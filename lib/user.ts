// lib/user.ts

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return null;
  }

  // Try to find existing user WITH relations
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      roles: true,   // ✅ Include roles relation
      skills: true,  // ✅ Include skills relation
    },
  });

  // If user doesn't exist, create them
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
      },
      include: {
        roles: true,   // ✅ Include roles relation
        skills: true,  // ✅ Include skills relation
      },
    });
  }

  return user;
}