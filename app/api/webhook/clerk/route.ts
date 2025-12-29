// app/api/webhook/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  console.log("🔔 Webhook received");

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log("📋 Headers:", { svix_id, svix_timestamp, svix_signature });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get payload
  const payload = await req.json();
  const body = JSON.stringify(payload);
  
  console.log("📦 Payload received:", payload.type);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("✅ Webhook verified");
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  const eventType = evt.type;
  console.log("🎯 Event type:", eventType);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    console.log("👤 Processing user:", {
      id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name} ${last_name}`,
    });

    // Validate required data
    if (!id || !email_addresses || email_addresses.length === 0) {
      console.error("❌ Missing required user data");
      return new Response("Missing required user data", { status: 400 });
    }

    try {
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: email_addresses[0].email_address,
          fullName: `${first_name ?? ""} ${last_name ?? ""}`.trim() || "User",
        },
        create: {
          clerkId: id,
          email: email_addresses[0].email_address,
          fullName: `${first_name ?? ""} ${last_name ?? ""}`.trim() || "User",
          experience: "FRESHER",
        },
      });

      console.log("✅ User synced to database:", user.id);
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      return new Response("Database error", { status: 500 });
    }
  }

  return new Response("Webhook processed", { status: 200 });
}