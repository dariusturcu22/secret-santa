import { Router } from "express";
import {
  createEvent,
  enterEvent,
  getEvent,
  getEvents,
  joinEvent,
  shuffleUsers,
} from "../controller/eventController";

const router = Router();

router.get("/:eventId", getEvent);

router.get("/get/:userId", getEvents);

router.post("/create", createEvent);

router.get("/join/:inviteId", joinEvent);

router.post("/enter/:eventId", enterEvent);

router.post("/:eventId/shuffle", shuffleUsers);

export default router;
