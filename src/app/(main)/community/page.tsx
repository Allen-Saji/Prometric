"use client";

import { useState } from "react";
import { ChatCircle, EnvelopeSimple, Check } from "@phosphor-icons/react";

export default function CommunityPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const emails = JSON.parse(localStorage.getItem("community-emails") || "[]");
    emails.push(email);
    localStorage.setItem("community-emails", JSON.stringify(emails));
    setSubmitted(true);
  };

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-8">
      <div className="animate-fade-up animate-fade-up-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">Community</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect with fellow exam preppers</p>
      </div>

      <div className="flex flex-col items-center text-center space-y-6 animate-fade-up animate-fade-up-2 pt-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
          <ChatCircle size={56} weight="duotone" className="text-amber-500" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Coming Soon
          </span>
          <h2 className="text-xl font-heading font-bold text-foreground">Study Groups & Discussions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Study groups, discussions, and peer support — launching soon
          </p>
        </div>

        {submitted ? (
          <div className="glass-card rounded-2xl p-5 w-full flex items-center gap-3">
            <Check size={24} weight="bold" className="text-emerald-500" />
            <p className="text-sm font-medium text-foreground">You&apos;ll be notified when we launch!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="relative">
              <EnvelopeSimple size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
            >
              Get Notified
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
