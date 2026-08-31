import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CapabilityStage } from "@/components/principles/CapabilityStage";
import { pillarBySlug } from "@/data/site";
import { catalog } from "@/data/projects";

export const Route = createFileRoute("/principles_/$cap")({
  loader: ({ params }) => {
    const pillar = pillarBySlug(params.cap);
    if (!pillar) throw notFound();
    return { pillar };
  },
  component: CapPage,
});

function CapPage() {
  const { pillar } = Route.useLoaderData();
  const count = catalog.filter(
    (p) => (pillar.lens as Record<string, string>)[p.slug],
  ).length;
  return (
    <AppShell
      compact
      title={pillar.title}
      meta={`${count} ${count === 1 ? "system" : "systems"} evidence this`}
    >
      <CapabilityStage pillar={pillar} />
    </AppShell>
  );
}
