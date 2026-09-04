import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ResumeStage } from "@/components/resume/ResumeStage";

export const Route = createFileRoute("/resume")({ component: Resume });

function Resume() {
  return (
    <AppShell title="Resume" compact>
      <ResumeStage />
    </AppShell>
  );
}
