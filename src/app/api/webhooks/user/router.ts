import prisma from "@/lib/prisma";
import { EmailAddress } from "@clerk/nextjs/server";
import { create } from "domain";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

type EventType = "user.created" | "user.updated" | "*";

type Event = {
    data: EventDataType;
    object: 'event';
    type: EventType;
}

type EventDataType = {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses: EmailAddressType[];
    primary_email_address_id: string;
    attributes: Record<string, string | number>;
}

type EmailAddressType = {
    id: string;
    email_address: string;
};

async function handler(req: Request) {
  const payload = await req.json();
  const headersList = headers();
  const heads = {
    "svix-id": (await headersList).get("svix-id"),
    "svix-timestamp": (await headersList).get("svix-timestamp"),
    "svix-signature": (await headersList).get("svix-signature"),
  };
  const wh = new Webhook(webhookSecret as string);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
        JSON.stringify(payload),
        heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  }
    catch (error) {
        console.error("Webhook verification failed:", error);
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const eventType: EventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            primary_email_address_id,
            ...attributes
        } = evt.data;

        await prisma.user.upsert({
            where: { externalId: id },
            create: {
                externalId: id as string,
                attributes
            },
            update: {
                attributes
            }
        });
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;