// api/user/update-profile/route.ts
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { SkillType, JobRole } from "@prisma/client";

export async function PUT(req: Request) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, email, experience, roles, skills } = await req.json();

    // Validation
    if (!fullName || !email || !experience) {
      return NextResponse.json(
        { error: "Full name, email, and experience are required" },
        { status: 400 }
      );
    }

    if (!roles || roles.length === 0) {
      return NextResponse.json(
        { error: "At least one job role is required" },
        { status: 400 }
      );
    }

    if (!skills || skills.length === 0) {
      return NextResponse.json(
        { error: "At least one skill is required" },
        { status: 400 }
      );
    }

    if (roles.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 job roles allowed" },
        { status: 400 }
      );
    }

    // Find the user
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { clerkId: clerkUser.id },
      data: {
        fullName,
        email,
        experience,
      },
    });

    // Update roles
    await prisma.userRole.deleteMany({
      where: { userId: user.id },
    });

    await prisma.userRole.createMany({
      data: roles.map((role: string) => ({
        userId: user.id,
        role: role as JobRole,
      })),
    });

    // Update skills - preserve existing points
    const existingSkills = await prisma.skillScore.findMany({
      where: { userId: user.id },
    });

    // Create a map of existing skill points (convert enum to string for lookup)
    const skillPointsMap = new Map<string, number>(
      existingSkills.map(s => [String(s.skill), s.points])
    );

    // Delete all existing skills
    await prisma.skillScore.deleteMany({
      where: { userId: user.id },
    });

    // Create new skills, preserving points if they existed
    await prisma.skillScore.createMany({
      data: skills.map((skill: string) => ({
        userId: user.id,
        skill: skill as SkillType,
        points: skillPointsMap.get(skill) || 0,
      })),
    });

    // Recalculate total points after updating skills
    const updatedSkills = await prisma.skillScore.findMany({
      where: { userId: user.id },
    });

    const totalPoints = updatedSkills.reduce((sum, skill) => sum + skill.points, 0);

    // Update user's total points
    const finalUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        totalPoints: totalPoints,
      },
      include: {
        skills: true,
        roles: true,
      },
    });

    return NextResponse.json({ success: true, user: finalUser, totalPoints });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}