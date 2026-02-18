import Link from "next/link";
import { ArrowRight, Stethoscope, Lightning, Target, Trophy, ShieldCheck, Users, BookOpen } from "@phosphor-icons/react/dist/ssr";

const exams = [
  { name: "DHA", flag: "\u{1F1E6}\u{1F1EA}", label: "Dubai" },
  { name: "MOH", flag: "\u{1F1E6}\u{1F1EA}", label: "UAE" },
  { name: "SLE", flag: "\u{1F1F8}\u{1F1E6}", label: "Saudi" },
  { name: "HAAD", flag: "\u{1F1E6}\u{1F1EA}", label: "Abu Dhabi" },
];

const features = [
  { icon: Lightning, title: "10 Questions Daily", desc: "Bite-sized sessions designed for working professionals with limited study time" },
  { icon: Target, title: "45-Day Challenge", desc: "Progressive difficulty curve from foundation concepts to exam-ready mastery" },
  { icon: Stethoscope, title: "Exam-Specific", desc: "Questions precisely tailored to DHA, MOH, SLE & HAAD exam patterns" },
  { icon: Trophy, title: "Track Progress", desc: "Streaks, accuracy analytics, and intelligent weak area identification" },
];

const stats = [
  { value: "$15", label: "One-time payment", sublabel: "No subscription" },
  { value: "45", label: "Days to exam-ready", sublabel: "Structured path" },
  { value: "450", label: "Total questions", sublabel: "Curated by experts" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.03] dark:bg-blue-600/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500/[0.02] dark:bg-purple-600/[0.03] rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">P</span>
          </div>
          <span className="font-heading font-bold text-foreground text-lg tracking-tight">Prometric Hero</span>
        </div>
        <Link href="/login">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-accent">
            Sign In
          </button>
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 pt-20 pb-32 max-w-5xl mx-auto">
        <div className="text-center space-y-8 mb-24 animate-fade-up animate-fade-up-1">
          {/* Exam badges */}
          <div className="flex justify-center gap-2 mb-6">
            {exams.map((exam) => (
              <span
                key={exam.name}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium glass-card text-foreground/80"
              >
                <span className="text-sm">{exam.flag}</span>
                {exam.name}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-foreground leading-[1.05] tracking-tight">
            Ace Your Prometric Exam
            <br />
            <span className="text-gradient-amber">in 45 Days</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            10 questions a day. $15 total. Built for healthcare professionals who need results, not gimmicks.
          </p>

          <div className="pt-2">
            <Link href="/login">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold px-8 py-4 text-lg rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200">
                Start Your Challenge
                <ArrowRight size={20} weight="bold" />
              </button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">Free for 5 days · No credit card required</p>
          </div>
        </div>

        {/* Dotted grid behind features */}
        <div className="relative">
          <div className="absolute inset-0 dotted-grid text-border/40 -z-10 rounded-3xl" />

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24 animate-fade-up animate-fade-up-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-8 space-y-4 hover:scale-[1.02] transition-transform duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/15 transition-colors">
                  <feature.icon size={24} weight="duotone" className="text-amber-500" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="animate-fade-up animate-fade-up-5">
          <div className="glass-card rounded-2xl p-10">
            <div className="flex items-center justify-center gap-2 mb-8">
              <ShieldCheck size={20} weight="duotone" className="text-amber-500" />
              <p className="text-sm font-medium text-muted-foreground">Trusted by healthcare professionals across the Gulf</p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center relative">
                  {i > 0 && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-border" />
                  )}
                  <p className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Get Started</Link>
            <span className="text-border">·</span>
            <a href="mailto:support@prometrichero.com" className="hover:text-foreground transition-colors">Support</a>
          </div>
          <p className="text-xs text-muted-foreground/50">© 2025 Prometric Hero. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
