import { Link } from "@tanstack/react-router";
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
import { ProgressRail } from "@/components/layout/ProgressRail";
import { useSnapRail } from "@/hooks/use-snap-rail";

export function ResumeStage() {
  const { scrollerRef, index, jumpTo } = useSnapRail(RESUME_SECTIONS.length);

  return (
    <div className="absolute inset-0 grid grid-cols-[minmax(0,1fr)_56px]">
      <div
        ref={scrollerRef}
        className="hide-scroll min-h-0 snap-y snap-mandatory overflow-y-auto"
      >
        <article className="snap-pane flex flex-col justify-center gap-6 px-6 py-8 lg:px-8">
          <div className="kicker">01 · Summary</div>
          <p className="max-w-[68ch] text-[15.5px] leading-relaxed text-mute-800">{SUMMARY}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-steel-800">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={`mailto:${SITE.resumeEmail}`}>{SITE.resumeEmail}</a>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <a href={SITE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </article>

        <article className="snap-pane flex flex-col justify-center gap-6 px-6 py-8 lg:px-8">
          <div className="kicker">02 · Expertise</div>
          <h2 className="max-w-[28ch] font-heading text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold tracking-tight">
            Architecture & engineering
          </h2>
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
        </article>

        <article className="snap-pane flex flex-col justify-start gap-5 px-6 py-8 lg:px-8">
          <div className="kicker">03 · Selected architecture</div>
          <div className="flex items-center gap-3">
            <Glyph name="cloud" label="Azure factory" />
            <h2 className="max-w-[32ch] font-heading text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold tracking-tight">
              {FEATURED_ARCHITECTURE.title}
            </h2>
          </div>
          <div className="text-sm text-steel-700">
            {FEATURED_ARCHITECTURE.role} · {FEATURED_ARCHITECTURE.year}
          </div>
          <ul className="max-w-[72ch] space-y-3 text-sm leading-relaxed text-mute-800">
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
            className="w-fit text-[13px] font-medium text-steel hover:text-ink"
          >
            Full case study — AI/ML Ops Factory ↗
          </Link>
        </article>

        <article className="snap-pane flex flex-col justify-center gap-5 px-6 py-8 lg:px-8">
          <div className="kicker">04 · Additional systems</div>
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
        </article>

        <article className="snap-pane flex flex-col justify-center gap-5 px-6 py-8 lg:px-8">
          <div className="kicker">05 · Experience</div>
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
        </article>

        <article className="snap-pane flex flex-col justify-center gap-6 px-6 py-8 lg:px-8">
          <div className="kicker">06 · Education & credentials</div>
          <div className="grid max-w-4xl gap-4 md:grid-cols-3">
            {EDUCATION.map((e) => (
              <Blueprint key={e.credential} className="p-5">
                <h3 className="font-heading text-lg font-semibold tracking-tight">{e.credential}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute-800">{e.org}</p>
              </Blueprint>
            ))}
          </div>
          <a
            href={`mailto:${SITE.email}?subject=Resume%20request`}
            className="inline-flex w-fit border border-ink px-6 py-3 text-sm font-medium hover:bg-ink hover:text-canvas"
          >
            Request PDF
          </a>
        </article>
      </div>
      <ProgressRail labels={[...RESUME_SECTIONS]} index={index} onPick={jumpTo} />
    </div>
  );
}
