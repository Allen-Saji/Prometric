import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Target, Trophy } from "lucide-react";

const exams = ["DHA", "MOH", "SLE", "HAAD"];

const features = [
  { icon: Zap, title: "10 Questions Daily", desc: "Bite-sized sessions that fit your schedule" },
  { icon: Target, title: "45-Day Challenge", desc: "Progressive difficulty from foundation to exam-ready" },
  { icon: Shield, title: "Exam-Specific", desc: "Questions tailored to DHA, MOH, SLE & HAAD" },
  { icon: Trophy, title: "Track Progress", desc: "Streaks, accuracy stats, and weak area analysis" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏥</span>
          <span className="font-bold text-foreground text-lg">Prometric Hero</span>
        </div>
        <Link href="/login">
          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="px-6 pt-16 pb-24 max-w-5xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center gap-2 mb-4">
            {exams.map((exam) => (
              <Badge key={exam} variant="secondary" className="bg-card text-primary border-border px-3 py-1">
                {exam}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Ace Your Prometric Exam
            <br />
            <span className="text-primary">in 45 Days</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            10 questions a day. $15 total. That&apos;s it.
          </p>

          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-6 text-lg mt-4">
              Start Your Challenge <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground">Free for 5 days · No credit card required</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="bg-card border border-border rounded-xl p-6 space-y-3">
              <feature.icon className="text-primary" size={24} />
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">Trusted by healthcare professionals across the Gulf</p>
          <div className="flex justify-center gap-8">
            <div>
              <p className="text-2xl font-bold text-foreground">$15</p>
              <p className="text-xs text-muted-foreground">One-time payment</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">45</p>
              <p className="text-xs text-muted-foreground">Days to exam-ready</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">450</p>
              <p className="text-xs text-muted-foreground">Total questions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
