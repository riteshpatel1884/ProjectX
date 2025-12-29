// api/user/update-skill-points/route.ts
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { SkillType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skill, points } = await req.json();

    // Validation
    if (!skill) {
      return NextResponse.json(
        { error: "Skill is required" },
        { status: 400 }
      );
    }

    if (typeof points !== 'number' || points < 0) {
      return NextResponse.json(
        { error: "Points must be a positive number" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Update the specific skill points
      const updatedSkill = await tx.skillScore.upsert({
        where: {
          userId_skill: {
            userId: user.id,
            skill: skill as SkillType,
          },
        },
        update: {
          points: points,
        },
        create: {
          userId: user.id,
          skill: skill as SkillType,
          points: points,
        },
      });

      // Recalculate total points by summing all skill points
      const allSkills = await tx.skillScore.findMany({
        where: { userId: user.id },
      });

      const totalPoints = allSkills.reduce((sum, skill) => sum + skill.points, 0);

      // Update user's total points
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          totalPoints: totalPoints,
        },
        include: {
          skills: true,
          roles: true,
        },
      });

      return { updatedUser, totalPoints, updatedSkill };
    });

    return NextResponse.json({ 
      success: true, 
      user: result.updatedUser,
      totalPoints: result.totalPoints,
      updatedSkill: result.updatedSkill
    });
  } catch (error) {
    console.error("Skill points update error:", error);
    return NextResponse.json(
      { error: "Failed to update skill points" },
      { status: 500 }
    );
  }
}