"use client";

import { Button } from "@/components/ui/button";
import { API_URL } from "@/constants/api";
import { IEvent } from "@/types/event";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const JoinEventPage = () => {
  const { id: inviteLink } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/join/${inviteLink}`, {
        withCredentials: true,
      });
      const { event, hasAlreadyJoined } = res.data;
      setEventId(event._id);

      if (hasAlreadyJoined) {
        router.replace(`/event/${event._id}`);
        return;
      }

      setEvent(event);
    } catch (error: any) {
      toast.error(`Failed to fetch event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inviteLink) fetchEvent();
  }, [inviteLink]);

  const handleYes = async () => {
    if (!eventId) return;

    try {
      await axios.post(
        `${API_URL}/events/enter/${eventId}`,
        {},
        { withCredentials: true }
      );
      router.push(`/event/${eventId}`);
    } catch (error: any) {
      toast.error(`Failed to join event: ${error.message}`);
    }
  };

  const handleNo = () => {
    router.push(`/events`);
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded shadow max-w-md mx-auto">
      <h1 className="text-xl font-bold">{event.name}</h1>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Owner:</strong> {event.owner}
      </p>
      <p>
        <strong>Participants:</strong>{" "}
        {event.users.map((u) => u.toString()).join(", ")}
      </p>
      <p>
        <strong>Link active:</strong> {event.linkActive ? "Yes" : "No"}
      </p>
      <p>
        <strong>Link:</strong> {event.joinLink}
      </p>

      <div className="flex gap-2 mt-4">
        <Button
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={handleYes}
        >
          Yes
        </Button>
        <Button
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={handleNo}
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default JoinEventPage;
