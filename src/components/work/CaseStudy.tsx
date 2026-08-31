import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Blueprint } from "@/components/ui/blueprint";
import { ProgressRail } from "@/components/layout/ProgressRail";
import { useSnapRail } from "@/hooks/use-snap-rail";
import { neighbors, repoOf, type Project } from "@/data/projects";
import { Glyph, PROJECT_GLYPH } from "@/components/ui/glyph";

const TABS = ["Problem", "Built", "Decisions", "Architecture", "Surfaces", "Standing"] as const;

export function CaseStudy({ project }: { project: Project }) {
  const navigate = useNavigate();
  const { prev, next } = neighbors(project.slug);
  const { scrollerRef, index, jumpTo } = useSnapRail(TABS.length, project.slug);
  const repo = repoOf(project);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && next) {
        void navigate({ to: "/work/$slug", params: { slug: next.slug } });
      }
      if (e.key === "ArrowLeft" && prev) {
        void navigate({ to: "/work/$slug", params: { slug: prev.slug } });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, next, prev]);

  return (
    <div className="absolute inset-0 grid grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-start gap-3 px-4 pb-3 lg:gap-4 lg:px-8">
        <Glyph name={PROJECT_GLYPH[project.slug]} size="sm" label={project.title} />
        <p className="m-0 min-w-0 flex-1 text-[14px] leading-snug text-mute-800 lg:text-[15.5px] lg:leading-relaxed">
          {project.value}
        </p>
        {repo ? (
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 text-[13px] font-medium text-steel hover:text-ink sm:inline"
          >
            {repo.label} ↗
          </a>
        ) : null}
      </div>

      <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_44px] lg:grid-cols-[minmax(0,1fr)_56px]">
        <div
          ref={scrollerRef}
          className="hide-scroll min-h-0 overflow-y-auto"
        >
          <Pane kicker="01 · Problem" title="The constraint">
            <p className="max-w-[62ch] text-[15.5px] leading-relaxed text-mute-800">{project.challenge}</p>
          </Pane>
          <Pane kicker="02 · Built" title="What shipped">
            <p className="max-w-[62ch] text-[15.5px] leading-relaxed text-mute-800">{project.development}</p>
          </Pane>
          <Pane kicker="03 · Decisions" title="The path">
            <ol className="grid max-w-5xl gap-4 md:grid-cols-2">
              {project.journey.map((j, i) => (
                <li key={j.title} className="flex gap-3">
                  <span className="kicker mt-1">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="font-heading text-lg font-semibold tracking-tight">{j.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-mute-800">{j.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Pane>
          <Pane kicker="04 · Architecture" title="How it is built">
            <div className="grid max-w-5xl gap-4 md:grid-cols-2">
              {project.specs.map((s) => (
                <Blueprint key={s.title} className="flex flex-col gap-2 p-4">
                  <div className="font-heading text-lg font-semibold tracking-tight">{s.title}</div>
                  <p className="text-sm leading-relaxed text-mute-800">{s.description}</p>
                </Blueprint>
              ))}
            </div>
          </Pane>
          <Pane kicker="05 · Surfaces" title="What it looks like to operate">
            <div className="grid max-w-5xl gap-4 md:grid-cols-2">
              {project.gallery.map((g) => (
                <Blueprint key={g.title} className="flex min-h-36 flex-col justify-between p-4">
                  <div className="kicker">Plate</div>
                  <div>
                    <div className="font-heading text-xl font-semibold tracking-tight">{g.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-mute-800">{g.description}</p>
                  </div>
                </Blueprint>
              ))}
            </div>
          </Pane>
          <Pane kicker="06 · Standing" title="What this proves">
            <p className="max-w-[62ch] font-heading text-xl font-semibold leading-snug tracking-tight">
              {project.outcomeLine}
            </p>
            <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-mute-800">
              {project.outcome}
            </p>
            <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-steel-800">
              {project.proofClaim}
            </p>
            {project.artifacts.length ? (
              <div className="mt-6 grid max-w-5xl gap-3 md:grid-cols-2">
                {project.artifacts.map((a) => (
                  <a
                    key={a.url}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-line px-4 py-3 transition-colors duration-150 hover:border-ink"
                  >
                    <div className="font-heading text-base font-semibold tracking-tight">{a.name}</div>
                    <p className="mt-1 text-sm text-mute-700">{a.description}</p>
                    <div className="mt-2 text-[12px] text-steel">Open ↗</div>
                  </a>
                ))}
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {prev ? (
                <Link
                  to="/work/$slug"
                  params={{ slug: prev.slug }}
                  className="border border-mute-300 px-4 py-3 text-sm font-medium hover:border-ink"
                >
                  ← {prev.title}
                </Link>
              ) : null}
              <Link
                to="/work"
                className="border border-ink px-4 py-3 text-sm font-medium hover:bg-ink hover:text-canvas"
              >
                All systems
              </Link>
              {next ? (
                <Link
                  to="/work/$slug"
                  params={{ slug: next.slug }}
                  className="border border-mute-300 px-4 py-3 text-sm font-medium hover:border-ink"
                >
                  {next.title} →
                </Link>
              ) : null}
            </div>
          </Pane>
        </div>
        <ProgressRail labels={[...TABS]} index={index} onPick={jumpTo} />
      </div>
    </div>
  );
}

function Pane({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="flex flex-col justify-start gap-4 border-t border-line px-4 py-8 first:border-t-0 lg:gap-5 lg:px-8 lg:py-10 last:pb-20">
      <div className="kicker">{kicker}</div>
      <h2 className="max-w-[28ch] font-heading text-[clamp(1.45rem,2.8vw,2.2rem)] font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </article>
  );
}
