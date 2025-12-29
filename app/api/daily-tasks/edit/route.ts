import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { dayId, subTaskId, newTitle } = await req.json();

    if (!newTitle || !newTitle.trim()) {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const dailyEntry = await prisma.dailyTask.findUnique({ where: { id: dayId } });
    if (!dailyEntry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

    // Logic to edit specific task in JSON array
    const tasks = dailyEntry.tasks as any[];
    let taskFound = false;

    const updatedTasks = tasks.map((t) => {
      if (t.id === subTaskId) {
        if (t.completed) throw new Error("CANNOT_EDIT_COMPLETED");
        taskFound = true;
        return { ...t, title: newTitle.trim() };
      }
      return t;
    });

    if (!taskFound) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    await prisma.dailyTask.update({
      where: { id: dayId },
      data: { tasks: updatedTasks },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    if (error.message === "CANNOT_EDIT_COMPLETED") {
      return NextResponse.json({ error: "Cannot edit a completed task" }, { status: 400 });
    }
    console.error("Edit task error:", error);
    return NextResponse.json({ error: "Failed to edit task" }, { status: 500 });
  }
}