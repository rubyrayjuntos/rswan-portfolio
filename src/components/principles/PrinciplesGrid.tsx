import { Link } from "@tanstack/react-router";
import { Blueprint } from "@/components/ui/blueprint";
import { Glyph, PILLAR_GLYPH } from "@/components/ui/glyph";
import { PILLARS } from "@/data/site";
import { catalog } from "@/data/projects";

export function PrinciplesGrid() {
  return (
    <div className="absolute inset-0 grid grid-cols-1 gap-4 overflow-y-auto px-6 py-6 md:grid-cols-2 lg:px-8">
      {PILLARS.map((p, i) => {
        const count = catalog.filter((x) => (p.lens as Record<string, string>)[x.slug]).length;
        return (
          <Link key={p.slug} to="/principles/$cap" params={{ cap: p.slug }} className="min-h-0">
            <Blueprint className="flex h-full min-h-48 cursor-pointer flex-col gap-3 p-5 transition-colors duration-150 hover:border-ink">
              <div className="flex items-start justify-between gap-3">
                <div className="kicker">Capability {String(i + 1).padStart(2, "0")}</div>
                <Glyph name={PILLAR_GLYPH[p.slug]} label={p.title} />
              </div>
              <h3 className="font-heading text-[1.85rem] font-semibold leading-[1.12] tracking-tight">{p.title}</h3>
              <p className="min-h-0 flex-1 overflow-hidden text-[13.5px] leading-relaxed text-mute-800">
                {p.body}
              </p>
              <div className="mt-auto text-[11px] uppercase tracking-widest text-steel-700">
                {count} in catalog →
              </div>
            </Blueprint>
          </Link>
        );
      })}
    </div>
  );
}
