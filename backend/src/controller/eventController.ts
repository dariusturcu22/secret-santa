import { Request, Response } from "express";
import Event from "../models/event.model";
import { v4 as uuidV4 } from "uuid";
import { getAuth } from "@clerk/express";

export const getEvent = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const event = await Event.findOne({
      _id: req.params.eventId,
      users: userId,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isOwner = userId === event.owner;
    const isLocked = event.locked;

    res.json({ event, isOwner, isLocked });
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const events = await Event.find({ users: userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name, date } = req.body;

    const newEvent = new Event({
      name,
      owner: userId,
      users: [userId],
      pairs: [],
      date,
      joinLink: generateLink(),
      linkActive: true,
      locked: false,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const joinEvent = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const inviteLink = req.params.inviteId;
    const event = await Event.findOne({ joinLink: inviteLink });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isLinkActive = event.linkActive;
    if (!isLinkActive)
      return res.status(403).json({ message: "Invite link expired" });

    const hasAlreadyJoined = event.users.some(
      (user) => user.toString() === userId
    );

    res.status(200).json({ event, hasAlreadyJoined });
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const enterEvent = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const event = await Event.findOne({ _id: req.params.eventId });
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.users.includes(userId))
      return res.status(400).json({ message: "User already in event" });

    event.users.push(userId);
    await event.save();

    res.status(200).json({ message: "User added", event });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const shuffleUsers = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const users = [...event.users];
    if (users.length < 2)
      res.status(400).json({ message: "Need at least 2 users to start" });

    for (let i = users.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [users[i], users[j]] = [users[j], users[i]];
    }

    const pairs = users.map((giver, index) => ({
      giver,
      receiver: users[(index + 1) % users.length],
    }));

    event.pairs = pairs;
    event.linkActive = false;
    event.locked = true;
    await event.save();
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const generateLink = () => {
  return uuidV4();
};
