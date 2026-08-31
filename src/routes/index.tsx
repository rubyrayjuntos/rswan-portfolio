import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HomeStage } from "@/components/home/HomeStage";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <HomeStage />
    </AppShell>
  );
}
