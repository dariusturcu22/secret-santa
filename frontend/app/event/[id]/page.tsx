"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/constants/api";
import { IEvent } from "@/types/event";
import { Button } from "@/components/ui/button";

interface IEventWithOwner extends IEvent {
  isOwner: boolean;
}

const EventPage = () => {
  const { id: eventId } = useParams();
  const { userId } = useAuth();
  const [event, setEvent] = useState<IEventWithOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState("");

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

  const handleShuffle = async () => {
    if (!event) return;
    try {
      await axios.post(
        `${API_URL}/events/${event._id}/shuffle`,
        {},
        { withCredentials: true }
      );
      toast.success("Users shuffled successfully!");
      fetchEvent();
    } catch (error: any) {
      toast.error(`Failed to shuffle users: ${error.message}`);
    }
  };

  const handleCopyLink = () => {
    if (!event) return;
    const fullLink = `${window.location.origin}/event/join/${event.joinLink}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="flex flex-col gap-6">
      {!event.locked ? (
        <>
          <div className="flex flex-col gap-4 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Owner:</strong> {event.owner}
            </p>
            <p>
              <strong>Participants:</strong>{" "}
              {event.users.map((u) => u).join(", ")}
            </p>

            {!event.locked && (
              <Button
                className="bg-purple-600 text-white hover:bg-purple-700 mt-4"
                onClick={handleShuffle}
              >
                Shuffle Users
              </Button>
            )}
          </div>

          <div className="flex flex-col bg-gray-50 p-4 rounded shadow max-w-sm">
            <p>
              <strong>Event link:</strong> {window.location.origin}/events/join/
              {event.joinLink}
            </p>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 mt-2"
              onClick={handleCopyLink}
            >
              Copy Link
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Your gift recipient:</strong>{" "}
              {event.pairs.find((p) => p.giver === userId)?.receiver}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default EventPage;
