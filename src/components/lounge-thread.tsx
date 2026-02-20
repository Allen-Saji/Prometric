"use client";

import { useState, useEffect, useRef } from "react";
import { LoungeMessage } from "@/lib/types";
import { getUserProfile } from "@/lib/firestore";
import { PaperPlaneRight } from "@phosphor-icons/react";

const MAX_MESSAGES = 50;

interface LoungeThreadProps {
  dayNumber: number;
}

function getThreadKey(day: number): string {
  return `lounge-day-${day}`;
}

function getMessages(day: number): LoungeMessage[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(getThreadKey(day));
  return data ? JSON.parse(data) : [];
}

function saveMessage(day: number, message: LoungeMessage): LoungeMessage[] {
  const messages = getMessages(day);
  messages.push(message);
  // FIFO: keep only last MAX_MESSAGES
  const trimmed = messages.slice(-MAX_MESSAGES);
  localStorage.setItem(getThreadKey(day), JSON.stringify(trimmed));
  return trimmed;
}

export function LoungeThread({ dayNumber }: LoungeThreadProps) {
  const [messages, setMessages] = useState<LoungeMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getMessages(dayNumber));
  }, [dayNumber]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const profile = getUserProfile();
    const msg: LoungeMessage = {
      id: `msg-${Date.now()}`,
      userName: profile?.name || "Anonymous",
      text: input.trim(),
      timestamp: Date.now(),
    };

    const updated = saveMessage(dayNumber, msg);
    setMessages(updated);
    setInput("");
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[60vh]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="glass-card rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-heading font-bold text-foreground">{msg.userName}</span>
              <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
            </div>
            <p className="text-sm text-foreground">{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-border">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-xl glass-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-white flex items-center justify-center disabled:opacity-30 hover:-translate-y-0.5 transition-all"
        >
          <PaperPlaneRight size={18} weight="fill" />
        </button>
      </form>
    </div>
  );
}
