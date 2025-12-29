// import { prisma } from "@/lib/prisma";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const clerkUser = await currentUser();
    
//     if (!clerkUser) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { fullName, experience, roles, skills } = await req.json();

//     // Validation
//     if (!fullName || !experience) {
//       return NextResponse.json(
//         { error: "Full name and experience are required" },
//         { status: 400 }
//       );
//     }

//     if (!roles || roles.length === 0) {
//       return NextResponse.json(
//         { error: "At least one job role is required" },
//         { status: 400 }
//       );
//     }

//     if (!skills || skills.length === 0) {
//       return NextResponse.json(
//         { error: "At least one skill is required" },
//         { status: 400 }
//       );
//     }

//     if (roles.length > 3) {
//       return NextResponse.json(
//         { error: "Maximum 3 job roles allowed" },
//         { status: 400 }
//       );
//     }

//     // Update user profile
//     const user = await prisma.user.update({
//       where: { clerkId: clerkUser.id },
//       data: {
//         fullName,
//         experience,
//       },
//     });

//     // Add selected roles
//     await prisma.userRole.deleteMany({
//       where: { userId: user.id },
//     });

//     await prisma.userRole.createMany({
//       data: roles.map((role: string) => ({
//         userId: user.id,
//         role,
//       })),
//     });

//     // Add selected skills with initial points
//     await prisma.skillScore.deleteMany({
//       where: { userId: user.id },
//     });

//     await prisma.skillScore.createMany({
//       data: skills.map((skill: string) => ({
//         userId: user.id,
//         skill,
//         points: 0,
//       })),
//     });

//     return NextResponse.json({ success: true, user });
//   } catch (error) {
//     console.error("Profile update error:", error);
//     return NextResponse.json(
//       { error: "Failed to update profile" },
//       { status: 500 }
//     );
//   }
// }


// api/user/complete-profile/route.ts
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    // Update user profile
    const user = await prisma.user.update({
      where: { clerkId: clerkUser.id },
      data: {
        fullName,
        email,
        experience,
      },
    });

    // Add selected roles
    await prisma.userRole.deleteMany({
      where: { userId: user.id },
    });

    await prisma.userRole.createMany({
      data: roles.map((role: string) => ({
        userId: user.id,
        role,
      })),
    });

    // Add selected skills with initial points
    await prisma.skillScore.deleteMany({
      where: { userId: user.id },
    });

    await prisma.skillScore.createMany({
      data: skills.map((skill: string) => ({
        userId: user.id,
        skill,
        points: 0,
      })),
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}