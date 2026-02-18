"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserProfile } from "@/lib/firestore";
import { Exam, Specialty } from "@/lib/types";
import { Stethoscope, FirstAid, Pill, Tooth } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const exams: { id: Exam; label: string; region: string; flag: string; fullName: string }[] = [
  { id: "DHA", label: "DHA", region: "Dubai", flag: "\u{1F1E6}\u{1F1EA}", fullName: "Dubai Health Authority" },
  { id: "MOH", label: "MOH", region: "UAE Federal", flag: "\u{1F1E6}\u{1F1EA}", fullName: "Ministry of Health" },
  { id: "SLE", label: "SLE", region: "Saudi Arabia", flag: "\u{1F1F8}\u{1F1E6}", fullName: "Saudi Licensing Exam" },
  { id: "HAAD", label: "HAAD", region: "Abu Dhabi", flag: "\u{1F1E6}\u{1F1EA}", fullName: "Dept. of Health" },
];

const specialties: { id: Specialty; label: string; icon: typeof Stethoscope }[] = [
  { id: "medicine", label: "Medicine", icon: Stethoscope },
  { id: "nursing", label: "Nursing", icon: FirstAid },
  { id: "pharmacy", label: "Pharmacy", icon: Pill },
  { id: "dentistry", label: "Dentistry", icon: Tooth },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  const handleContinue = () => {
    if (step === 1 && selectedExam) {
      setStep(2);
    } else if (step === 2 && selectedSpecialty && selectedExam) {
      const demoUser = localStorage.getItem("demo-user");
      const userData = demoUser ? JSON.parse(demoUser) : { uid: "demo", email: "demo@test.com", displayName: "User" };

      saveUserProfile({
        uid: userData.uid,
        name: userData.displayName || "User",
        email: userData.email,
        exam: selectedExam,
        specialty: selectedSpecialty,
        createdAt: new Date().toISOString(),
        streak: 0,
        longestStreak: 0,
        currentDay: 1,
      });

      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 animate-fade-up animate-fade-up-1">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all",
              step >= 1 ? "bg-amber-500 text-white" : "bg-border text-muted-foreground"
            )}>1</div>
            <div className={cn("w-12 h-0.5 rounded-full transition-all", step >= 2 ? "bg-amber-500" : "bg-border")} />
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all",
              step >= 2 ? "bg-amber-500 text-white" : "bg-border text-muted-foreground"
            )}>2</div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-up animate-fade-up-2">
            <div className="text-center">
              <h1 className="text-2xl font-heading font-bold text-foreground">Which exam are you preparing for?</h1>
              <p className="text-muted-foreground mt-2 text-sm">We&apos;ll tailor your questions accordingly</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExam(exam.id)}
                  className={cn(
                    "glass-card p-6 rounded-2xl text-center transition-all duration-200 hover:scale-[1.02]",
                    selectedExam === exam.id
                      ? "!border-amber-500 !bg-amber-500/10 shadow-lg shadow-amber-500/10"
                      : "hover:border-amber-500/30"
                  )}
                >
                  <span className="text-2xl mb-2 block">{exam.flag}</span>
                  <p className="text-xl font-heading font-bold text-foreground">{exam.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{exam.fullName}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{exam.region}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-up animate-fade-up-2">
            <div className="text-center">
              <h1 className="text-2xl font-heading font-bold text-foreground">What&apos;s your specialty?</h1>
              <p className="text-muted-foreground mt-2 text-sm">Pick your field of practice</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {specialties.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecialty(spec.id)}
                  className={cn(
                    "glass-card p-6 rounded-2xl text-center transition-all duration-200 hover:scale-[1.02]",
                    selectedSpecialty === spec.id
                      ? "!border-amber-500 !bg-amber-500/10 shadow-lg shadow-amber-500/10"
                      : "hover:border-amber-500/30"
                  )}
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                    <spec.icon size={28} weight="duotone" className="text-amber-500" />
                  </div>
                  <p className="text-sm font-heading font-semibold text-foreground">{spec.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={(step === 1 && !selectedExam) || (step === 2 && !selectedSpecialty)}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 disabled:opacity-30 disabled:hover:translate-y-0"
        >
          {step === 2 ? "Start My Journey" : "Continue"}
        </button>

        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to exam selection
          </button>
        )}
      </div>
    </div>
  );
}
