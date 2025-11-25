"use client";

import { API_URL } from "@/constants/api";
import { IEvent } from "@/types/event";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EventsPage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`, {
        withCredentials: true,
      });
      setEvents(res.data);
    } catch (error: any) {
      toast.error(`Failed to fetch events: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h1 className="text-xl font-bold">Events</h1>
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((event) => (
          <Link key={event._id} href={`/event/${event._id}`}>
            <div className="cursor-pointer p-3 rounded hover:bg-gray-100 transition">
              <p className="font-semibold">{event.name}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default EventsPage;
