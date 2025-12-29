
// leaderbaord/AIChat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust import based on your prisma setup

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Fetch leaderboard data from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        totalPoints: true,
        roles: {
          select: {
            role: true
          }
        },
        skills: {
          select: {
            skill: true,
            points: true
          }
        }
      },
      orderBy: {
        totalPoints: 'desc'
      },
      take: 50 // Get top 50 users for context
    });

    // Format leaderboard data for AI context
    const leaderboardContext = users.map((user, index) => ({
      rank: index + 1,
      name: user.fullName,
      totalPoints: user.totalPoints,
      roles: user.roles.map(r => r.role),
      skills: user.skills.map(s => ({ skill: s.skill, points: s.points }))
    }));

    // Get top performers by skill
    const skillLeaders: Record<string, any[]> = {};
    const skills = ['DSA', 'WEB_DEV', 'PROJECTS', 'SYSTEM_DESIGN', 'ML', 'DATA'];
    
    for (const skill of skills) {
      const topInSkill = users
        .map(user => ({
          name: user.fullName,
          points: user.skills.find(s => s.skill === skill)?.points || 0
        }))
        .filter(u => u.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 5);
      
      skillLeaders[skill] = topInSkill;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a career coach AI for a tech leaderboard platform with access to real-time leaderboard data.

CURRENT LEADERBOARD (Top 50):
${JSON.stringify(leaderboardContext.slice(0, 10), null, 2)}

TOP PERFORMERS BY SKILL:
${JSON.stringify(skillLeaders, null, 2)}

TOTAL USERS IN DATABASE: ${users.length}

You can now answer questions about:
- Who is ranked at specific positions (e.g., "Who is rank 1?")
- Current leaders in specific skills (e.g., "Who has the most DSA points?")
- User statistics and comparisons
- Skill distributions across top performers
- Point differences between ranks

When users ask about rankings or specific people:
- Provide accurate information from the leaderboard data above
- Mention their total points and top skills
- Compare them with others if relevant
- Suggest how they can improve based on what top performers are doing

Also help users by:
- Suggesting which skills to focus on (DSA, WEB_DEV, PROJECTS, SYSTEM_DESIGN, ML, DATA)
- Recommending job roles (SDE, FRONTEND, BACKEND, FULLSTACK, DATA_ANALYST, DATA_SCIENTIST, ML_ENGINEER, DEVOPS, CYBER_SECURITY)
- Providing study strategies based on top performer patterns
- Being encouraging and motivational

Keep responses concise, data-driven, and actionable.`
          },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API Error:', errorData);
      throw new Error('Groq API request failed');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I encountered an error.';
    
    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error with AI chat:', error);
    return NextResponse.json(
      { 
        message: 'Failed to get AI response. Please ensure GROQ_API_KEY is set and database is accessible.' 
      },
      { status: 500 }
    );
  }
}