import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CaseStudy } from "@/components/work/CaseStudy";
import { projectBySlug } from "@/data/projects";

export const Route = createFileRoute("/work_/$slug")({
  loader: ({ params }) => {
    const project = projectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  component: CasePage,
});

function CasePage() {
  const { project } = Route.useLoaderData();
  return (
    <AppShell
      compact
      title={project.title}
      meta={`${project.year} · ${project.cap} · ${project.role}`}
    >
      <CaseStudy project={project} />
    </AppShell>
  );
}
