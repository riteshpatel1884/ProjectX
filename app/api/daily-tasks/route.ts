import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Calculate Today's Date Range (12:00 AM to 11:59 PM)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // 2. Find Today's Entry
    const todayEntry = await prisma.dailyTask.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // 3. Find History (Everything before today)
    const history = await prisma.dailyTask.findMany({
      where: {
        userId: user.id,
        createdAt: {
          lt: startOfDay,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10, // Limit history to last 10 days
    });

    // 4. Calculate stats
    const taskList = todayEntry?.tasks ? (todayEntry.tasks as any[]) : [];
    const canCreateMore = taskList.length < 3;

    return NextResponse.json({
      todayEntry: todayEntry || null,
      tasks: taskList,
      canCreateMore,
      history,
      totalPoints: user.totalPoints
    });

  } catch (error) {
    console.error("Get daily tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}