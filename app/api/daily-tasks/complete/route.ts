import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { dayId, subTaskId } = await req.json(); // We need the Row ID and the Task ID inside JSON

    const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Find the daily entry
    const dailyEntry = await prisma.dailyTask.findUnique({ where: { id: dayId } });
    if (!dailyEntry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

    // Parse tasks
    let tasks = dailyEntry.tasks as any[];
    let pointsAwarded = 0;
    let taskFound = false;

    // Modify the specific task
    const updatedTasks = tasks.map((t) => {
      if (t.id === subTaskId) {
        if (t.completed) throw new Error("ALREADY_COMPLETED");
        taskFound = true;
        pointsAwarded = 3; // 3 points per task
        return { ...t, completed: true };
      }
      return t;
    });

    if (!taskFound) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // Transaction: Update Task Array AND Update User Points
    await prisma.$transaction([
      prisma.dailyTask.update({
        where: { id: dayId },
        data: { 
          tasks: updatedTasks,
          totalPoints: { increment: pointsAwarded }
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { totalPoints: { increment: pointsAwarded } },
      }),
    ]);

    return NextResponse.json({ success: true, pointsEarned: pointsAwarded });

  } catch (error: any) {
    if (error.message === "ALREADY_COMPLETED") {
      return NextResponse.json({ error: "Task already completed" }, { status: 400 });
    }
    console.error("Complete task error:", error);
    return NextResponse.json({ error: "Failed to complete task" }, { status: 500 });
  }
}