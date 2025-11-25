import { Request, Response } from "express";
import Event from "../models/event.model";
import { v4 as uuidV4 } from "uuid";

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ users: req.params.userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, owner, users, pairs, date } = req.body;
    const newEvent = new Event({
      name,
      owner,
      users,
      pairs,
      date,
      joinLink: generateLink(),
      linkActive: true,
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const joinEvent = async (req: Request, res: Response) => {
  try {
    const inviteLink = req.params.inviteId;
    const event = await Event.findOne({ joinLink: inviteLink });
    if (!event) return res.status(404).json({ message: "Event not found" });
    const isLinkActive = event.linkActive;
    if (!isLinkActive)
      return res.status(403).json({ message: "Invite link expired" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const enterEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId });
    if (!event) return res.status(404).json({ message: "Event not found" });
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ message: "Missing user id" });
    if (event.users.includes(userId))
      return res.status(400).json({ message: "User already in event" });

    event.users.push(userId);
    await event.save();

    res.status(200).json({ message: "User added", event });
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
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
    await event.save();
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};

export const generateLink = () => {
  return uuidV4();
};
