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
        <p className="m-0 min-w-0 flex-1 text-body leading-snug text-mute-800 lg:text-body-lg lg:leading-relaxed">
          {project.value}
        </p>
        {repo ? (
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 text-small font-medium text-steel hover:text-ink sm:inline"
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
            <p className="max-w-[62ch] text-body-lg leading-relaxed text-mute-800">{project.challenge}</p>
          </Pane>
          <Pane kicker="02 · Built" title="What shipped">
            <p className="max-w-[62ch] text-body-lg leading-relaxed text-mute-800">{project.development}</p>
          </Pane>
          <Pane kicker="03 · Decisions" title="The path">
            <ol className="grid max-w-5xl gap-4 md:grid-cols-2">
              {project.journey.map((j, i) => (
                <li key={j.title} className="flex gap-3">
                  <span className="kicker mt-1">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="font-heading text-h-item font-semibold leading-[1.12] tracking-tight">{j.title}</div>
                    <p className="mt-1 text-body leading-relaxed text-mute-800">{j.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Pane>
          <Pane kicker="04 · Architecture" title="How it is built">
            <div className="grid max-w-5xl gap-4 md:grid-cols-2">
              {project.specs.map((s) => (
                <Blueprint key={s.title} className="flex flex-col gap-2 p-4">
                  <div className="font-heading text-h-item font-semibold leading-[1.12] tracking-tight">{s.title}</div>
                  <p className="text-body leading-relaxed text-mute-800">{s.description}</p>
                </Blueprint>
              ))}
            </div>
          </Pane>
          <Pane kicker="05 · Surfaces" title="What it looks like to operate">
            {project.embed ? (
              <Blueprint className="max-w-5xl overflow-hidden p-0">
                <iframe
                  src={project.embed.url}
                  title={project.embed.title}
                  loading="lazy"
                  style={{ height: project.embed.height ?? 600 }}
                  className="block w-full border-0"
                />
                <div className="flex flex-col gap-2 border-t border-line p-4">
                  <div className="kicker">Live</div>
                  <div className="font-heading text-h-plate font-semibold leading-[1.12] tracking-tight">
                    {project.embed.title}
                  </div>
                  <p className="text-body leading-relaxed text-mute-800">{project.embed.description}</p>
                </div>
              </Blueprint>
            ) : null}
            <div className="mt-4 grid max-w-5xl gap-4 md:grid-cols-2">
              {project.gallery.map((g) => (
                <Blueprint key={g.title} className="overflow-hidden p-0">
                  <img
                    src={g.image}
                    alt={g.title}
                    width={1200}
                    height={675}
                    loading="lazy"
                    className="block h-auto w-full border-b border-line bg-canvas"
                  />
                  <div className="flex flex-col gap-2 p-4">
                    <div className="kicker">Plate</div>
                    <div className="font-heading text-h-plate font-semibold leading-[1.12] tracking-tight">{g.title}</div>
                    <p className="text-body leading-relaxed text-mute-800">{g.description}</p>
                  </div>
                </Blueprint>
              ))}
            </div>
          </Pane>
          <Pane kicker="06 · Standing" title="What this proves">
            <p className="max-w-[62ch] font-heading text-h-card font-semibold leading-snug tracking-tight">
              {project.outcomeLine}
            </p>
            <p className="mt-4 max-w-[62ch] text-body-lg leading-relaxed text-mute-800">
              {project.outcome}
            </p>
            <p className="mt-3 max-w-[62ch] text-body leading-relaxed text-steel-800">
              {project.proofClaim}
            </p>
            {project.artifacts.length ? (
              <div className="mt-6 grid max-w-5xl gap-3 md:grid-cols-2">
                {project.artifacts.map((a) =>
                  a.url ? (
                    <a key={a.name} href={a.url} target="_blank" rel="noreferrer" className="block">
                      <Blueprint className="flex flex-col gap-1 p-4 transition-colors duration-150 hover:border-ink">
                        <div className="font-heading text-h-item font-semibold leading-[1.12] tracking-tight">{a.name}</div>
                        <p className="text-body text-mute-700">{a.description}</p>
                        <div className="mt-1 text-caption text-steel">Open ↗</div>
                      </Blueprint>
                    </a>
                  ) : (
                    <div key={a.name}>
                      <Blueprint className="flex flex-col gap-1 p-4">
                        <div className="font-heading text-h-item font-semibold leading-[1.12] tracking-tight">{a.name}</div>
                        <p className="text-body text-mute-700">{a.description}</p>
                        <div className="mt-1 text-caption text-mute-600">Private — case-study evidence only</div>
                      </Blueprint>
                    </div>
                  ),
                )}
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
      <h2 className="max-w-[28ch] font-heading text-h-section font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </article>
  );
}
