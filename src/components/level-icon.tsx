import { Plant, BookOpen, Pill, Lightning, Medal, Trophy, Crown, Diamond } from "@phosphor-icons/react";

const iconMap = {
  Plant, BookOpen, Pill, Lightning, Medal, Trophy, Crown, Diamond
};

export function LevelIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const Icon = iconMap[name as keyof typeof iconMap];
  if (!Icon) return null;
  return <Icon size={size} weight="duotone" className={className} />;
}
