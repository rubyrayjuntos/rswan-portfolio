import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ResumeStage } from "@/components/resume/ResumeStage";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/resume")({ component: Resume });

function Resume() {
  return (
    <AppShell title="Resume" meta={`25 years · ${SITE.city}`}>
      <ResumeStage />
    </AppShell>
  );
}
