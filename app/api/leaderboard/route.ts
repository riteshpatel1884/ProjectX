// api/leaderboard/route.ts
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    // Fetch all users
    const users = await prisma.user.findMany({
      include: {
        roles: {
          select: { role: true },
        },
        skills: {
          select: { skill: true, points: true },
        },
        // FIX: We cannot use _count with { completed: true } anymore
        // Instead, we fetch the dailyTasks to sum their points
        dailyTasks: {
          select: {
            totalPoints: true, 
          }
        }
      },
      orderBy: {
        totalPoints: 'desc',
      },
    });

    // Transform the data
    const usersWithDailyTaskPoints = users.map(user => {
      // Calculate total points specifically from daily tasks
      // Sum up the 'totalPoints' of all daily entries
      const dailyTaskPointsTotal = user.dailyTasks.reduce((sum, day) => sum + day.totalPoints, 0);

      // Since each task is 3 points, we can estimate completed count
      const completedTasksCount = Math.floor(dailyTaskPointsTotal / 3);

      return {
        id: user.id,
        clerkId: user.clerkId,
        fullName: user.fullName || "Anonymous",
        email: user.email || "",
        totalPoints: user.totalPoints,
        experience: user.experience,
        roles: user.roles,
        skills: user.skills,
        // Use the calculated values
        dailyTaskPoints: dailyTaskPointsTotal, 
        completedDailyTasks: completedTasksCount, 
      };
    });

    return NextResponse.json({
      users: usersWithDailyTaskPoints,
      currentUserId: clerkUser?.id || null,
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}