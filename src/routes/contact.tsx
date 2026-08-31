import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ContactStage } from "@/components/contact/ContactStage";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  return (
    <AppShell title="Start with the problem, not the stack" meta={SITE.email}>
      <ContactStage />
    </AppShell>
  );
}
