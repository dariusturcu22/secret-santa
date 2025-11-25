"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { IEvent } from "@/types/event";

const EventPage = () => {
  const params = useParams();
  const eventId = params.id;
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/${eventId}`, {
        withCredentials: true,
      });
      setEvent(res.data);
    } catch (error) {
      console.error("Failed to fetch event: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1>{event.name}</h1>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Owner: {event.owner}</p>
      <p>Participants: {event.users.join(", ")}</p>
      <p>Link active: {event.linkActive ? "Yes" : "No"}</p>
      <p>Link: {event.joinLink}</p>
    </div>
  );
};

export default EventPage;
