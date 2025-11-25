import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import clerkWebhookRouter from "./routes/clerkWebhook";
import eventRouter from "./routes/eventRoutes";
import { connectDB } from "./lib/db";

dotenv.config();

const PORT = process.env.PORT!;

const app = express();

app.use(
  "/api/webhooks/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhookRouter
);

app.use("/events", eventRouter);

app.get("/", () => {
  console.log("home route");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
