// api/user/add-skill-points/route.ts
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

    const { skill, pointsToAdd } = await req.json();

    // Validation
    if (!skill) {
      return NextResponse.json(
        { error: "Skill is required" },
        { status: 400 }
      );
    }

    if (typeof pointsToAdd !== 'number') {
      return NextResponse.json(
        { error: "Points to add must be a number" },
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

    // Get current skill points
    const currentSkill = await prisma.skillScore.findUnique({
      where: {
        userId_skill: {
          userId: user.id,
          skill: skill as SkillType,
        },
      },
    });

    const currentPoints = currentSkill?.points || 0;
    const newPoints = Math.max(0, currentPoints + pointsToAdd); // Prevent negative points

    // Update the specific skill points
    await prisma.skillScore.upsert({
      where: {
        userId_skill: {
          userId: user.id,
          skill: skill as SkillType,
        },
      },
      update: {
        points: newPoints,
      },
      create: {
        userId: user.id,
        skill: skill as SkillType,
        points: newPoints,
      },
    });

    // Recalculate total points by summing all skill points
    const allSkills = await prisma.skillScore.findMany({
      where: { userId: user.id },
    });

    const totalPoints = allSkills.reduce((sum, skill) => sum + skill.points, 0);

    // Update user's total points
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        totalPoints: totalPoints,
      },
      include: {
        skills: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      totalPoints: totalPoints,
      skillPoints: newPoints,
      pointsAdded: pointsToAdd
    });
  } catch (error) {
    console.error("Add skill points error:", error);
    return NextResponse.json(
      { error: "Failed to add skill points" },
      { status: 500 }
    );
  }
}