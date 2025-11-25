import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import clerkWebhookRouter from "./routes/clerkWebhook";
import eventRouter from "./routes/eventRoutes";
import { connectDB } from "./lib/db";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const PORT = process.env.PORT!;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

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
