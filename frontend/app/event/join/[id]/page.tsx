"use client";

import { Button } from "@/components/ui/button";
import { API_URL } from "@/constants/api";
import { IEvent } from "@/types/event";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const JoinEventPage = () => {
  const params = useParams();
  const router = useRouter();
  const inviteLink = params.id;
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/join/${inviteLink}`, {
        withCredentials: true,
      });

      const { event, hasAlreadyJoined } = res.data;

      const id = event._id;
      setEventId(id);

      if (hasAlreadyJoined) {
        router.replace(`/event/${id}`);
        return;
      }

      setEvent(event);
    } catch (error) {
      console.error("Failed to fetch event: ", error);
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
    } catch (error) {
      console.error("Failed to join event: ", error);
    }
  };

  const handleNo = () => {
    router.push(`/events`);
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1>{event.name}</h1>
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        <p>Owner: {event.owner}</p>
        <p>Participants: {event.users.map((u) => u.toString()).join(", ")}</p>
        <p>Link active: {event.linkActive ? "Yes" : "No"}</p>
        <p>Link: {event.joinLink}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleYes}>Yes</Button>
        <Button onClick={handleNo}>No</Button>
      </div>
    </>
  );
};

export default JoinEventPage;
