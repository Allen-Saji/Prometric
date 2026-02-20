import { GulfDay, World } from "./types";

export const WORLDS: World[] = [
  { id: "foundation", name: "Foundation", color: "#3B82F6", icon: "Flask", dayStart: 1, dayEnd: 6, description: "Autonomic Pharmacology & General Principles" },
  { id: "engine", name: "Engine", color: "#EF4444", icon: "Heartbeat", dayStart: 7, dayEnd: 15, description: "Cardiovascular, Respiratory & Blood" },
  { id: "calculator", name: "Calculator", color: "#8B5CF6", icon: "Calculator", dayStart: 16, dayEnd: 21, description: "Pharmaceutical Calculations & Pharmacokinetics" },
  { id: "endocrine", name: "Endocrine", color: "#F59E0B", icon: "Drop", dayStart: 22, dayEnd: 28, description: "Hormones, Insulin & Clinical Research" },
  { id: "mind", name: "Mind", color: "#EC4899", icon: "Brain", dayStart: 29, dayEnd: 35, description: "CNS, Psychiatry & Musculoskeletal" },
  { id: "shield", name: "Shield", color: "#10B981", icon: "Shield", dayStart: 36, dayEnd: 42, description: "Microbiology & Anti-Infectives" },
  { id: "oath", name: "Oath", color: "#6366F1", icon: "Scroll", dayStart: 43, dayEnd: 44, description: "Ethics & Final Review" },
];

export const GULF_SCHEDULE: GulfDay[] = [
  { day: 1, topics: ["Adrenergic agonist"], subtopics: ["General Pharmacology"], worldId: "foundation" },
  { day: 2, topics: ["Adrenergic agonist"], subtopics: ["General Pharmacology"], worldId: "foundation" },
  { day: 3, topics: ["Adrenergic antagonist"], subtopics: ["Antidote & Pregnancy choices"], worldId: "foundation" },
  { day: 4, topics: ["Adrenergic antagonist"], subtopics: ["Antidote & Pregnancy choices"], worldId: "foundation" },
  { day: 5, topics: ["Cholinergic agonist"], subtopics: ["Sources of drug information", "Hypolipidemic agents"], worldId: "foundation" },
  { day: 6, topics: ["Cholinergic agonist"], subtopics: ["Sources of drug information", "Hypolipidemic agents"], worldId: "foundation" },
  { day: 7, topics: ["Cholinergic antagonist"], subtopics: ["Inventory control"], worldId: "engine" },
  { day: 8, topics: ["Asthma"], subtopics: ["NSAIDs", "Cough"], worldId: "engine" },
  { day: 9, topics: ["CVS introduction"], subtopics: ["Histamines & Antihistamines"], worldId: "engine" },
  { day: 10, topics: ["Diuretics", "Congestive heart failure introduction"], subtopics: ["Peptic ulcer"], worldId: "engine" },
  { day: 11, topics: ["Congestive heart failure"], subtopics: ["Institutional review board"], worldId: "engine" },
  { day: 12, topics: ["Angina", "Hypolipidemic agents (discussion)"], subtopics: ["Regulations"], worldId: "engine" },
  { day: 13, topics: ["Arrhythmia"], subtopics: ["Statistics"], worldId: "engine" },
  { day: 14, topics: ["Blood drugs", "Hypertension"], subtopics: ["Pharmacoepidemiology", "Emetics and antiemetics"], worldId: "engine" },
  { day: 15, topics: ["Blood drugs", "Hypertension"], subtopics: ["Measurement of Risk", "Prevalence, incidence"], worldId: "engine" },
  { day: 16, topics: ["Q&A discussion"], subtopics: ["Difference b/w suspension & emulsion"], worldId: "calculator" },
  { day: 17, topics: ["Dose calculation & percentage type"], subtopics: [], worldId: "calculator" },
  { day: 18, topics: ["Molarity & molality", "Milli-equivalence", "Osmolar concentration"], subtopics: [], worldId: "calculator" },
  { day: 19, topics: ["Parts per million", "Pharmacokinetics 1"], subtopics: [], worldId: "calculator" },
  { day: 20, topics: ["Pharmacokinetics 2", "Dilution mixing"], subtopics: [], worldId: "calculator" },
  { day: 21, topics: ["Bioavailability", "Infusion rate & drop rate", "Insulin dose calculation"], subtopics: [], worldId: "calculator" },
  { day: 22, topics: ["Q&A discussion"], subtopics: ["Androgens"], worldId: "endocrine" },
  { day: 23, topics: ["Introduction & Pituitary hormones", "Adrenal hormones"], subtopics: ["ADR Classification", "Adverse reaction of important drugs"], worldId: "endocrine" },
  { day: 24, topics: ["Thyroid hormones"], subtopics: ["Immunosuppressants"], worldId: "endocrine" },
  { day: 25, topics: ["Estrogens", "Progestogens", "OCP"], subtopics: ["Medication error"], worldId: "endocrine" },
  { day: 26, topics: ["Study designs", "Clinical trial"], subtopics: ["Drugs for constipation & diarrhea"], worldId: "endocrine" },
  { day: 27, topics: ["Insulin & OHA", "Insulin Dosing"], subtopics: ["Pharmacogenomics"], worldId: "endocrine" },
  { day: 28, topics: ["Insulin & OHA", "Insulin Dosing"], subtopics: ["Pharmacogenomics"], worldId: "endocrine" },
  { day: 29, topics: ["Sedatives", "Hypnotics", "Antidepressants"], subtopics: ["Efficacy, Potency", "Communication Skill"], worldId: "mind" },
  { day: 30, topics: ["General Anesthetics", "Local Anesthetics"], subtopics: ["Child Pugh & CHA2DS2VASc Score"], worldId: "mind" },
  { day: 31, topics: ["Opioids"], subtopics: ["Herbal drugs", "RF value chromatography"], worldId: "mind" },
  { day: 32, topics: ["Antipsychotics & Antimanic"], subtopics: ["Pharmacoeconomics", "Indirect and direct cost"], worldId: "mind" },
  { day: 33, topics: ["Neurodegenerative disorders"], subtopics: ["Alcohol"], worldId: "mind" },
  { day: 34, topics: ["Epilepsy"], subtopics: ["Vitamins"], worldId: "mind" },
  { day: 35, topics: ["RA", "Osteoporosis", "Gout"], subtopics: ["Corrected phenytoin level"], worldId: "mind" },
  { day: 36, topics: ["Introduction Microbiology", "Cell wall synthesis inhibitors"], subtopics: ["Immunology"], worldId: "shield" },
  { day: 37, topics: ["Introduction Microbiology", "Cell wall synthesis inhibitors"], subtopics: ["Immunology"], worldId: "shield" },
  { day: 38, topics: ["Protein synthesis inhibitor"], subtopics: ["Transcription, Translation", "Difference between DNA & RNA"], worldId: "shield" },
  { day: 39, topics: ["Fluoroquinolones", "Anti TB"], subtopics: ["Antiprotozoal agents"], worldId: "shield" },
  { day: 40, topics: ["Antileprotic", "Sulfonamides"], subtopics: ["Antifungal agents", "Bioequivalence and bioavailability"], worldId: "shield" },
  { day: 41, topics: ["Antiviral drugs", "Anticancer"], subtopics: ["Importance of hydroxyl group of quinine"], worldId: "shield" },
  { day: 42, topics: ["Vaccines"], subtopics: ["SAR of drugs"], worldId: "shield" },
  { day: 43, topics: ["Ethics principle", "Ethics in clinical trial"], subtopics: ["Off-label drug use"], worldId: "oath" },
  { day: 44, topics: ["Q&A discussion", "Final Review"], subtopics: ["Amino acids"], worldId: "oath" },
];

export function getDaySchedule(day: number): GulfDay | undefined {
  return GULF_SCHEDULE.find((d) => d.day === day);
}

export function getWorldForDay(day: number): World | undefined {
  return WORLDS.find((w) => day >= w.dayStart && day <= w.dayEnd);
}

export function getWorldById(worldId: string): World | undefined {
  return WORLDS.find((w) => w.id === worldId);
}

export function getDaysForWorld(worldId: string): GulfDay[] {
  return GULF_SCHEDULE.filter((d) => d.worldId === worldId);
}

export function getWorldProgress(unlockedDay: number, worldId: string): { total: number; completed: number; percent: number } {
  const world = WORLDS.find((w) => w.id === worldId);
  if (!world) return { total: 0, completed: 0, percent: 0 };
  const total = world.dayEnd - world.dayStart + 1;
  const completed = Math.max(0, Math.min(unlockedDay - world.dayStart, total));
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
}
