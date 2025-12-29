import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { dayId, subTaskId } = await req.json();

    const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const dailyEntry = await prisma.dailyTask.findUnique({ where: { id: dayId } });
    if (!dailyEntry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

    const tasks = dailyEntry.tasks as any[];
    
    // Check if task exists and is completed
    const taskToDelete = tasks.find(t => t.id === subTaskId);
    if (!taskToDelete) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    if (taskToDelete.completed) {
      return NextResponse.json({ error: "Cannot delete a completed task" }, { status: 400 });
    }

    // Filter out the task
    const updatedTasks = tasks.filter(t => t.id !== subTaskId);

    await prisma.dailyTask.update({
      where: { id: dayId },
      data: { tasks: updatedTasks },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}