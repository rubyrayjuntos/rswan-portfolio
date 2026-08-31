import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Blueprint } from "@/components/ui/blueprint";
import { Glyph, PROJECT_GLYPH } from "@/components/ui/glyph";
import { catalog, repoOf, type Project } from "@/data/projects";

function split<T>(items: T[], n: number) {
  const cols: T[][] = Array.from({ length: n }, () => []);
  items.forEach((item, i) => cols[i % n].push(item));
  return cols;
}

function useColumnCount() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const sm = window.matchMedia("(min-width: 640px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setN(lg.matches ? 3 : sm.matches ? 2 : 1);
    update();
    sm.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      sm.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return n;
}

export function WorkGrid() {
  const count = useColumnCount();
  const columns = split(catalog, count);

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
      <div className="flex items-start gap-4">
        {columns.map((col, i) => (
          <div key={i} className="flex min-w-0 flex-1 flex-col gap-4">
            {col.map((p) => (
              <WorkCard key={p.slug} project={p} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkCard({ project: p }: { project: Project }) {
  const repo = repoOf(p);
  return (
    <Blueprint className="flex min-w-0 w-full flex-col gap-3 p-5 transition-colors duration-150 hover:border-ink">
      {p.cardImage ? (
        <Link to="/work/$slug" params={{ slug: p.slug }} className="group -mx-5 -mt-5 mb-1 block overflow-hidden border-b border-line">
          <img
            src={p.cardImage}
            alt={p.title}
            className="h-[168px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            width={640}
            height={168}
          />
        </Link>
      ) : null}
      <Link to="/work/$slug" params={{ slug: p.slug }} className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <Glyph name={PROJECT_GLYPH[p.slug]} size="sm" label={p.title} />
          <span className="text-[11px] text-mute-600">{p.year}</span>
        </div>
        <div>
          <h2 className="font-heading text-[1.45rem] font-semibold leading-[1.12] tracking-tight">
            {p.title}
          </h2>
          <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">
            {p.tagline}
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed break-words text-ink">{p.value}</p>
          <p className="mt-2 text-[13px] leading-relaxed break-words text-mute-700">{p.arch}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {p.tech.map((t) => (
            <span
              key={t}
              className="border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-mute-700"
            >
              {t}
            </span>
          ))}
        </div>
      </Link>
      <a
        href={repo.url}
        target="_blank"
        rel="noreferrer"
        className="w-fit text-[13px] font-medium text-steel hover:text-ink"
      >
        {repo.label} ↗
      </a>
    </Blueprint>
  );
}
