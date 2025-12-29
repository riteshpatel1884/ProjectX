import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'; // You might need to install: npm i uuid @types/uuid

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title } = await req.json();
    if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 12 AM Logic
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Check if row exists for today
    let dailyEntry = await prisma.dailyTask.findFirst({
      where: {
        userId: user.id,
        createdAt: { gte: startOfDay, lt: endOfDay },
      },
    });

    const newTaskObj = {
      id: uuidv4(), // Generate unique ID for the sub-task
      title: title.trim(),
      completed: false,
    };

    if (dailyEntry) {
      // Row exists, check limit
      const currentTasks = dailyEntry.tasks as any[];
      if (currentTasks.length >= 3) {
        return NextResponse.json({ error: "Daily limit of 3 tasks reached" }, { status: 400 });
      }

      // Update existing row: Append to JSON
      const updatedTasks = [...currentTasks, newTaskObj];
      
      dailyEntry = await prisma.dailyTask.update({
        where: { id: dailyEntry.id },
        data: { tasks: updatedTasks },
      });
    } else {
      // Create new row for today
      dailyEntry = await prisma.dailyTask.create({
        data: {
          userId: user.id,
          tasks: [newTaskObj],
          totalPoints: 0,
        },
      });
    }

    return NextResponse.json({ success: true, tasks: dailyEntry.tasks });

  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}