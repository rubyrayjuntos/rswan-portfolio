import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ADDITIONAL_SYSTEMS,
  EDUCATION,
  EXPERTISE,
  FEATURED_ARCHITECTURE,
  RESUME_SECTIONS,
  ROLES,
  SITE,
  SKILLS,
  SUMMARY,
} from "@/data/site";
import { Blueprint } from "@/components/ui/blueprint";
import { Glyph, EXPERTISE_GLYPH } from "@/components/ui/glyph";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { ProgressRail } from "@/components/layout/ProgressRail";
import { useSnapRail } from "@/hooks/use-snap-rail";

const SUMMARY_HIGHLIGHTS = [
  "dual-kernel proposal-verification pipelines",
  "hyperbolic graph neural networks",
  "fault-tolerant cloud orchestration",
  "enterprise-grade software integrations",
  "high-throughput physical operations",
  "deterministic safety frameworks",
  "multi-agent runtime environments",
  "production artificial intelligence",
  "scalable software architecture",
  "low-level algorithmic research",
  "large language models",
  "AI/ML Systems Architect",
  "structurally resilient",
  "regulatorily compliant",
  "TypeScript",
  "Python",
  "React",
  "AWS",
  "GCP",
];

function highlightSummary(text: string, keyPrefix: string) {
  const pattern = new RegExp(
    `(${SUMMARY_HIGHLIGHTS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    SUMMARY_HIGHLIGHTS.includes(part) ? (
      <em key={`${keyPrefix}-${i}`} className="font-heading font-semibold italic text-steel">
        {part}
      </em>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    ),
  );
}

export function ResumeStage() {
  const { scrollerRef, index, jumpTo } = useSnapRail(RESUME_SECTIONS.length);

  return (
    <div className="absolute inset-0 grid grid-cols-[minmax(0,1fr)_44px] lg:grid-cols-[minmax(0,1fr)_56px]">
      <div ref={scrollerRef} className="hide-scroll min-h-0 overflow-y-auto">
        <Pane kicker="01 · Summary" title="Architect, builder, product lead">
          <Blueprint className="max-w-5xl p-5">
            <div className="flex max-w-[68ch] flex-col gap-4 text-[15.5px] leading-relaxed text-mute-800">
              {SUMMARY.split("\n\n").map((para, pi) => (
                <p key={para.slice(0, 32)}>{highlightSummary(para, `sum-${pi}`)}</p>
              ))}
            </div>
          </Blueprint>
          <Blueprint className="max-w-5xl p-5">
            <div className="kicker">Contact</div>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-steel-800">
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-ink">
                <Mail className="size-4" aria-hidden />
                {SITE.email}
              </a>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2 hover:text-ink">
                <Phone className="size-4" aria-hidden />
                {SITE.phone}
              </a>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
                <Github className="size-4" aria-hidden />
                GitHub
              </a>
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
                <Linkedin className="size-4" aria-hidden />
                LinkedIn
              </a>
              <span className="inline-flex items-center gap-2 text-mute-600">
                <MapPin className="size-4" aria-hidden />
                {SITE.city}
              </span>
            </div>
          </Blueprint>
        </Pane>

        <Pane kicker="02 · Expertise" title="Architecture & engineering">
          <div className="grid max-w-5xl gap-4 md:grid-cols-2">
            {EXPERTISE.map((e) => (
              <Blueprint key={e.title} className="flex flex-col gap-2 p-4">
                <Glyph name={EXPERTISE_GLYPH[e.title]} size="sm" label={e.title} />
                <div className="mt-1 font-heading text-lg font-semibold tracking-tight">{e.title}</div>
                <p className="text-sm leading-relaxed text-mute-800">{e.items}</p>
              </Blueprint>
            ))}
          </div>
          <div className="mt-2 flex max-w-5xl flex-wrap gap-2">
            {SKILLS.map((s) => (
              <span
                key={s}
                className="border border-line px-3 py-1 text-[11px] uppercase tracking-wide text-mute-800"
              >
                {s}
              </span>
            ))}
          </div>
        </Pane>

        <Pane kicker="03 · Selected architecture" title={FEATURED_ARCHITECTURE.title}>
          <Blueprint className="max-w-5xl p-5">
            <div className="text-sm text-steel-700">
              {FEATURED_ARCHITECTURE.role} · {FEATURED_ARCHITECTURE.year}
            </div>
            <ul className="mt-3 max-w-[72ch] space-y-3 text-sm leading-relaxed text-mute-800">
              {FEATURED_ARCHITECTURE.bullets.map((b) => (
                <li key={b.slice(0, 40)} className="grid grid-cols-[12px_minmax(0,1fr)] gap-2">
                  <span className="mt-2 h-1 w-1 bg-steel-700" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/work/$slug"
              params={{ slug: "ai-ml-ops-factory" }}
              className="mt-4 inline-block w-fit text-[13px] font-medium text-steel hover:text-ink"
            >
              Full case study — AI/ML Ops Factory ↗
            </Link>
          </Blueprint>
        </Pane>

        <Pane kicker="04 · Additional systems">
          <div className="grid max-w-5xl gap-4">
            {ADDITIONAL_SYSTEMS.map((s) => (
              <Blueprint key={s.title} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="kicker">{s.org}</div>
                  <Glyph name={s.glyph} size="sm" label={s.title} />
                </div>
                <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight">{s.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute-800">
                  {s.bullets.map((b) => (
                    <li key={b.slice(0, 32)}>{b}</li>
                  ))}
                </ul>
              </Blueprint>
            ))}
          </div>
        </Pane>

        <Pane kicker="05 · Experience">
          <div className="flex max-w-5xl flex-col gap-4">
            {ROLES.map((r) => (
              <Blueprint key={r.dates} className="p-5">
                <div className="kicker">{r.dates}</div>
                <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight">{r.title}</h3>
                <div className="mt-1 text-sm text-steel-700">{r.org}</div>
                <p className="mt-3 text-sm leading-relaxed text-mute-800">{r.note}</p>
              </Blueprint>
            ))}
          </div>
        </Pane>

        <Pane kicker="06 · Education & credentials">
          <div className="grid max-w-4xl gap-4 md:grid-cols-3">
            {EDUCATION.map((e) => (
              <Blueprint key={e.credential} className="p-5">
                <h3 className="font-heading text-lg font-semibold tracking-tight">{e.credential}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute-800">{e.org}</p>
              </Blueprint>
            ))}
          </div>
          <a
            href="/resume/Ray_Swan_Resume_GenAI_ML_Architect.pdf"
            download="Ray_Swan_Resume_GenAI_ML_Architect.pdf"
            className="inline-flex w-fit border border-ink px-6 py-3 text-sm font-medium hover:bg-ink hover:text-canvas"
          >
            Download PDF
          </a>
        </Pane>
      </div>
      <ProgressRail labels={[...RESUME_SECTIONS]} index={index} onPick={jumpTo} />
    </div>
  );
}

function Pane({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <article className="flex flex-col justify-start gap-4 border-t border-line px-4 py-8 first:border-t-0 first:pt-4 lg:gap-5 lg:px-8 lg:py-10 lg:first:pt-4 last:pb-20">
      <div className="kicker">{kicker}</div>
      {title ? (
        <h2 className="max-w-[32ch] font-heading text-[clamp(1.45rem,2.8vw,2.2rem)] font-semibold tracking-tight">
          {title}
        </h2>
      ) : null}
      {children}
    </article>
  );
}
