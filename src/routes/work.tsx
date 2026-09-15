import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkGrid } from "@/components/work/WorkGrid";

export const Route = createFileRoute("/work")({ component: Work });

function Work() {
  return (
    <AppShell title="Seven systems, three kinds of hard" meta="What shipped, and the repo that proves it.">
      <WorkGrid />
    </AppShell>
  );
}
