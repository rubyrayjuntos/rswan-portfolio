import { Link } from "@tanstack/react-router";
import { Blueprint } from "@/components/ui/blueprint";
import { Glyph, PILLAR_GLYPH, PROJECT_GLYPH } from "@/components/ui/glyph";
import { catalog } from "@/data/projects";
import { PILLARS } from "@/data/site";

type Pillar = (typeof PILLARS)[number];

function lensCopy(pillar: Pillar, slug: string) {
  return (pillar.lens as Record<string, string>)[slug];
}

export function CapabilityStage({ pillar }: { pillar: Pillar }) {
  const cards = catalog.filter((p) => lensCopy(pillar, p.slug));

  return (
    <div className="absolute inset-0 overflow-y-auto px-6 py-6 lg:px-8">
      <div className="flex items-start gap-4">
        <Glyph name={PILLAR_GLYPH[pillar.slug]} label={pillar.title} />
        <p className="max-w-[68ch] text-[15.5px] leading-relaxed text-mute-800">{pillar.detail}</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((p) => (
          <Link key={p.slug} to="/work/$slug" params={{ slug: p.slug }}>
            <Blueprint className="flex h-full flex-col gap-3 p-5 transition-colors duration-150 hover:border-ink">
              <div className="flex items-start justify-between gap-3">
                <div className="kicker">{p.tagline}</div>
                <Glyph name={PROJECT_GLYPH[p.slug]} size="sm" label={p.title} />
              </div>
              <h3 className="font-heading text-2xl font-semibold tracking-tight">{p.title}</h3>
              <p className="text-sm leading-relaxed text-mute-800">{lensCopy(pillar, p.slug)}</p>
              <div className="mt-auto text-[11px] uppercase tracking-widest text-steel-700">
                Open case →
              </div>
            </Blueprint>
          </Link>
        ))}
      </div>
    </div>
  );
}
