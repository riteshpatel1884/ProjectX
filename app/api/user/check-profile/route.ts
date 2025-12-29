import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ isComplete: false });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        roles: true,
        skills: true,
      },
    });

    // Check if user exists and has completed profile
    const isComplete = !!(
      user &&
      user.fullName &&
      user.experience &&
      user.roles.length > 0 &&
      user.skills.length > 0
    );

    return NextResponse.json({ isComplete });
  } catch (error) {
    console.error("Error checking profile:", error);
    return NextResponse.json({ isComplete: false });
  }
}
