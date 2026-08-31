import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PrinciplesGrid } from "@/components/principles/PrinciplesGrid";

export const Route = createFileRoute("/principles")({ component: Principles });

function Principles() {
  return (
    <AppShell
      title="Authority stays with the system, not the model"
      meta="Four capabilities. One philosophy."
    >
      <PrinciplesGrid />
    </AppShell>
  );
}
