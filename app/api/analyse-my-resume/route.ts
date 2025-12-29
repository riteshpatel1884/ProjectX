import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import mammoth from 'mammoth';
const pdf = require('pdf-parse-fork');

const groq = new Groq({
  apiKey: process.env.GROQ_RESUME_API_KEY,
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }
  if (userLimit.count >= 50) return false;
  userLimit.count++;
  return true;
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    if (!data.text || data.text.trim().length < 10) {
      throw new Error('PDF is empty or contains only images.');
    }
    return data.text;
  } catch (error: any) {
    console.error('PDF Error:', error);
    throw new Error(`Failed to read PDF: ${error.message}`);
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error: any) {
    throw new Error('Failed to read DOCX file.');
  }
}

async function analyzeResume(
  resumeText: string,
  jobType: string,
  jobDescription: string,
  experienceLevel: string,
  yearsOfExperience: string,
  requiredSkills: string,
  companyName: string
): Promise<any> {
  const MODEL = 'llama-3.3-70b-versatile'; 

  const systemPrompt = `You are an expert ATS specialist and career coach. Analyze resumes comprehensively and return ONLY a valid JSON object with detailed insights.
  Do not include markdown code blocks or explanations.
  
  Provide a comprehensive analysis with the following structure:
  {
    "overallScore": number (0-100),
    "atsScore": number (0-100),
    "strengths": string[] (at least 5-7 specific strengths),
    "weaknesses": string[] (at least 5-7 specific areas to improve),
    "additions": string[] (5-7 specific things to add to the resume),
    "keywordAnalysis": { 
      "matched": string[] (keywords found in resume), 
      "missing": string[] (important keywords missing),
      "matchPercentage": number (0-100)
    },
    "sectionFeedback": [
      { 
        "section": string (e.g., "Summary/Objective", "Experience", "Education", "Skills", "Projects", "Certifications"),
        "score": number (0-100),
        "feedback": string (detailed 2-3 sentence feedback)
      }
    ] (analyze ALL major sections found in the resume),
    "actionItems": string[] (5-10 prioritized action items in order of importance),
    "redFlags": string[] (critical issues that need immediate attention)
  }
  
  Be specific and actionable in all feedback. Focus on both content and ATS optimization.`;

  const userPrompt = `Analyze this resume for a ${jobType} position at ${companyName || 'Target Company'}
  
  Experience Level Required: ${experienceLevel} (${yearsOfExperience} years)
  Required Skills: ${requiredSkills || 'Not specified'}
  
  Job Description:
  ${jobDescription.substring(0, 2500)}
  
  Resume Content:
  ${resumeText.substring(0, 5000)}
  
  Provide a comprehensive, detailed analysis covering:
  1. Overall quality and ATS compatibility
  2. Specific strengths (be detailed)
  3. Specific weaknesses (be detailed)  
  4. Exact additions needed (be specific about what to add and where)
  5. Keyword match analysis with percentages
  6. Section-by-section breakdown with scores
  7. Prioritized action items
  8. Critical red flags
  
  Make the analysis as detailed and actionable as possible.`;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI.');
    
    const analysis = JSON.parse(content);
    
    // Ensure all required fields exist with defaults
    return {
      overallScore: analysis.overallScore || 0,
      atsScore: analysis.atsScore || 0,
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      additions: analysis.additions || [],
      deletions: analysis.deletions || [],
      keywordAnalysis: {
        matched: analysis.keywordAnalysis?.matched || [],
        missing: analysis.keywordAnalysis?.missing || [],
        matchPercentage: analysis.keywordAnalysis?.matchPercentage || 0
      },
      sectionFeedback: analysis.sectionFeedback || [],
      actionItems: analysis.actionItems || [],
      redFlags: analysis.redFlags || []
    };
  } catch (error: any) {
    throw new Error(`AI Analysis Error: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_RESUME_API_KEY) {
      return NextResponse.json({ error: 'Server Config Error: API Key missing' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Hourly limit reached. Try again later.' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: 'Resume file and job description are required.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeText = '';

    if (file.type === 'application/pdf') {
      resumeText = await extractTextFromPDF(buffer);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      resumeText = await extractTextFromDOCX(buffer);
    } else {
      return NextResponse.json({ error: 'Please upload a PDF or DOCX file.' }, { status: 400 });
    }

    const analysis = await analyzeResume(
      resumeText,
      formData.get('jobType') as string,
      jobDescription,
      formData.get('experienceLevel') as string,
      formData.get('yearsOfExperience') as string,
      formData.get('requiredSkills') as string,
      formData.get('companyName') as string
    );

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('Final Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed. Please try a different file.' },
      { status: 500 }
    );
  }
}