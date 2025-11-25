"use client";

import { API_URL } from "@/constants/api";
import { IEvent } from "@/types/event";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const EventsPage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`, {
        withCredentials: true,
      });
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events: ", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1>Events</h1>
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((event) => (
          <Link key={event._id} href={`/event/${event._id}`} passHref>
            <div className="cursor-pointer">
              <p>{event.name}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default EventsPage;
