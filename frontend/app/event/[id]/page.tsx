"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/constants/api";
import { IEvent } from "@/types/event";

const EventPage = () => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/${eventId}`, {
        withCredentials: true,
      });
      setEvent(res.data);
    } catch (error: any) {
      toast.error(`Failed to fetch event: ${error.message}`);
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
    <div className="flex flex-col gap-4 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold">{event.name}</h1>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Owner:</strong> {event.owner}
      </p>
      <p>
        <strong>Participants:</strong> {event.users.join(", ")}
      </p>
      <p>
        <strong>Link Active:</strong> {event.linkActive ? "Yes" : "No"}
      </p>
      <p>
        <strong>Link:</strong> {event.joinLink}
      </p>
    </div>
  );
};

export default EventPage;
