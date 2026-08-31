import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  Box,
  Brain,
  ChefHat,
  CircleCheck,
  Cloud,
  CodeXml,
  Cpu,
  Database,
  Eye,
  GraduationCap,
  Rocket,
  Settings,
  Share2,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const GLYPHS = {
  boxes: { Icon: Boxes, tone: "text-mark-blue", hex: true },
  cube: { Icon: Box, tone: "text-mark-amber", hex: true },
  brain: { Icon: Brain, tone: "text-mark-violet", hex: true },
  chef: { Icon: ChefHat, tone: "text-mark-green", hex: true },
  eye: { Icon: Eye, tone: "text-mark-violet", hex: true },
  code: { Icon: CodeXml, tone: "text-mark-blue", hex: true },
  network: { Icon: Share2, tone: "text-mark-violet", hex: true },
  grad: { Icon: GraduationCap, tone: "text-mark-violet", hex: true },
  shield: { Icon: Shield, tone: "text-mark-teal", hex: false },
  database: { Icon: Database, tone: "text-mark-teal", hex: false },
  chart: { Icon: BarChart3, tone: "text-mark-green", hex: false },
  cpu: { Icon: Cpu, tone: "text-mark-blue", hex: false },
  cloud: { Icon: Cloud, tone: "text-mark-blue", hex: false },
  gear: { Icon: Settings, tone: "text-mark-slate", hex: false },
  check: { Icon: CircleCheck, tone: "text-mark-teal", hex: false },
  rocket: { Icon: Rocket, tone: "text-mark-teal", hex: false },
  users: { Icon: Users, tone: "text-mark-teal", hex: false },
} as const satisfies Record<string, { Icon: LucideIcon; tone: string; hex: boolean }>;

export type GlyphName = keyof typeof GLYPHS;

export const PROJECT_GLYPH: Record<string, GlyphName> = {
  neuronote: "brain",
  "tokyo-eye": "eye",
  "kitchen-kontrol": "chef",
  "ai-ml-ops-factory": "cloud",
  "canon-forge": "cube",
  "governed-lora-factory": "cpu",
};

export const PILLAR_GLYPH: Record<string, GlyphName> = {
  platform: "boxes",
  governance: "shield",
  generative: "network",
  product: "cube",
};

export const EXPERTISE_GLYPH: Record<string, GlyphName> = {
  "AI Platforms & GenAI": "brain",
  "MLOps / LLMOps": "gear",
  "Cloud & IaC": "cloud",
  "Governance & Security": "shield",
};

type Size = "sm" | "md";

export function Glyph({
  name,
  size = "md",
  label,
}: {
  name: GlyphName;
  size?: Size;
  label?: string;
}) {
  const { Icon, tone, hex } = GLYPHS[name];
  const box = size === "sm" ? "size-9" : "size-11";
  const icon = size === "sm" ? "size-4" : "size-[18px]";

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", box, tone)}
      role="img"
      aria-label={label ?? name}
    >
      {hex ? (
        <svg viewBox="0 0 40 40" className="absolute inset-0 size-full" aria-hidden>
          <polygon
            points="20,3 35.5,12 35.5,28 20,37 4.5,28 4.5,12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="absolute inset-0 rounded-lg border border-current/25" aria-hidden />
      )}
      <Icon className={cn("relative", icon)} strokeWidth={1.75} />
    </span>
  );
}
