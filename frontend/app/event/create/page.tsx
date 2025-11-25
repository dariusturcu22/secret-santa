"use client";

import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";

export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async () => {
    if (!name) return alert("Enter a name");
    if (!date) return alert("Select a date");
    const payload = { name, date };
    await axios.post(`${API_URL}/events/create`, payload, {
      withCredentials: true,
    });
  };

  const formatDate = (date: Date | undefined) =>
    date
      ? date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <div className="flex flex-col gap-4">
      <Label>Event Name</Label>
      <Textarea
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Event name"
      />

      <Label>Event Date</Label>
      <div className="relative flex gap-2">
        <Input
          value={formatDate(date)}
          placeholder="Select a date"
          onChange={(e) => {
            const d = new Date(e.target.value);
            if (!isNaN(d.getTime())) setDate(d);
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              className="absolute top-1/2 right-2 -translate-y-1/2"
              variant="ghost"
            >
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
