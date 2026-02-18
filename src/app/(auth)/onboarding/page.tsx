"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveUserProfile } from "@/lib/firestore";
import { Exam, Specialty } from "@/lib/types";
import { cn } from "@/lib/utils";

const exams: { id: Exam; label: string; region: string }[] = [
  { id: "DHA", label: "DHA", region: "Dubai" },
  { id: "MOH", label: "MOH", region: "UAE Federal" },
  { id: "SLE", label: "SLE", region: "Saudi Arabia" },
  { id: "HAAD", label: "HAAD", region: "Abu Dhabi" },
];

const specialties: { id: Specialty; label: string; emoji: string }[] = [
  { id: "medicine", label: "Medicine", emoji: "🩺" },
  { id: "nursing", label: "Nursing", emoji: "💉" },
  { id: "pharmacy", label: "Pharmacy", emoji: "💊" },
  { id: "dentistry", label: "Dentistry", emoji: "🦷" },
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
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={cn("w-8 h-1 rounded-full", step >= 1 ? "bg-[#F5A524]" : "bg-[#1F1F23]")} />
          <div className={cn("w-8 h-1 rounded-full", step >= 2 ? "bg-[#F5A524]" : "bg-[#1F1F23]")} />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#FAFAFA]">Which exam are you preparing for?</h1>
              <p className="text-[#71717A] mt-2">We&apos;ll tailor your questions</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExam(exam.id)}
                  className={cn(
                    "p-6 rounded-xl border text-center transition-all",
                    selectedExam === exam.id
                      ? "border-[#F5A524] bg-[#F5A524]/10"
                      : "border-[#1F1F23] bg-[#141416] hover:border-[#F5A524]/50"
                  )}
                >
                  <p className="text-xl font-bold text-[#FAFAFA]">{exam.label}</p>
                  <p className="text-xs text-[#71717A] mt-1">{exam.region}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#FAFAFA]">What&apos;s your specialty?</h1>
              <p className="text-[#71717A] mt-2">Pick your field of practice</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {specialties.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecialty(spec.id)}
                  className={cn(
                    "p-6 rounded-xl border text-center transition-all",
                    selectedSpecialty === spec.id
                      ? "border-[#F5A524] bg-[#F5A524]/10"
                      : "border-[#1F1F23] bg-[#141416] hover:border-[#F5A524]/50"
                  )}
                >
                  <span className="text-3xl">{spec.emoji}</span>
                  <p className="text-sm font-medium text-[#FAFAFA] mt-2">{spec.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={(step === 1 && !selectedExam) || (step === 2 && !selectedSpecialty)}
          className="w-full bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-semibold py-6 disabled:opacity-40"
        >
          {step === 2 ? "Start My Journey →" : "Continue →"}
        </Button>
      </div>
    </div>
  );
}
