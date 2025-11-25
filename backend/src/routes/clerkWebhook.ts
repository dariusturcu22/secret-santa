import dotenv from "dotenv";
dotenv.config();

import { Router, Request, Response } from "express";
import User from "../models/user.model";
import { verifyWebhook } from "@clerk/express/webhooks";

const router = Router();
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

router.post("/", async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: CLERK_WEBHOOK_SECRET,
    });

    const eventType = evt.type;
    const data = evt.data as any;

    const email = data.email_addresses?.[0]?.email_address || "unknown";

    const username = data.username || data.first_name || "unknown";

    switch (eventType) {
      case "user.created":
        await User.updateOne(
          { clerkId: data.id },
          { clerkId: data.id, email, username },
          { upsert: true }
        );
        break;

      case "user.updated":
        await User.updateOne({ clerkId: data.id }, { email, username });
        break;

      case "user.deleted":
        await User.deleteOne({ clerkId: data.id });
        break;

      default:
        console.log("Unhandled event type:", eventType);
    }

    res.status(200).send("ok");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send("Invalid webhook");
  }
});

export default router;
