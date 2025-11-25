"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/constants/api";
import { IEvent, IUser } from "@/types/event";
import { Button } from "@/components/ui/button";

interface IEventWithOwner extends IEvent {
  isOwner: boolean;
}

const EventPage = () => {
  const { id: eventId } = useParams();
  const { userId } = useAuth();
  const [event, setEvent] = useState<IEventWithOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState(false);
  const [locked, setLocked] = useState(false);
  const [ownerUsername, setOwnerUsername] = useState<string>("");
  const [participantsUsernames, setParticipantsUsernames] = useState<string[]>(
    []
  );
  const [recipientUsername, setRecipientUsername] = useState<string>("");

  const fetchUser = async (clerkId: string) => {
    try {
      const res = await axios.get(`${API_URL}/users/${clerkId}`, {
        withCredentials: true,
      });
      return res.data.username;
    } catch {
      return clerkId;
    }
  };

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/${eventId}`, {
        withCredentials: true,
      });
      const { event, isOwner, isLocked } = res.data;
      setEvent(event);
      setOwner(isOwner);
      setLocked(isLocked);

      const ownerId =
        typeof event.owner === "string"
          ? event.owner
          : (event.owner as IUser)._id;
      const fetchedOwnerUsername = await fetchUser(ownerId);
      setOwnerUsername(fetchedOwnerUsername);

      const usersIds: string[] = event.users.map((u: string | IUser) =>
        typeof u === "string" ? u : u._id
      );
      const fetchedParticipants = await Promise.all(
        usersIds.map((id: string) => fetchUser(id))
      );
      setParticipantsUsernames(fetchedParticipants);

      if (isLocked && event.pairs && userId) {
        const pair = event.pairs.find(
          (p: { giver: string | IUser; receiver: string | IUser }) =>
            (typeof p.giver === "string" ? p.giver : p.giver._id) === userId
        );

        if (pair) {
          const receiverId =
            typeof pair.receiver === "string"
              ? pair.receiver
              : (pair.receiver as IUser)._id;
          const fetchedRecipient = await fetchUser(receiverId);
          setRecipientUsername(fetchedRecipient);
        }
      }
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
    if (eventId && userId) {
      fetchEvent();
    }
  }, [eventId, userId]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="flex flex-col gap-6">
      {!locked ? (
        <>
          <div className="flex flex-col gap-4 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Owner:</strong> {ownerUsername}
            </p>
            <p>
              <strong>Participants:</strong> {participantsUsernames.join(", ")}
            </p>
            {!locked && owner && (
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
        <div className="flex flex-col gap-4 bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Your gift recipient:</strong> {recipientUsername}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventPage;
