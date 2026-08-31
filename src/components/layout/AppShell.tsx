import type { ReactNode } from "react";
import { MobileNav, SideNav } from "./SideNav";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  meta?: string;
  compact?: boolean;
  children: ReactNode;
};

export function AppShell({ title, meta, compact, children }: Props) {
  const hasHeader = Boolean(title);

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] bg-canvas lg:grid-cols-[236px_minmax(0,1fr)] lg:grid-rows-1">
      <div className="hidden h-full min-h-0 lg:block">
        <SideNav />
      </div>
      <MobileNav />
      <main
        className={cn(
          "grid min-h-0 overflow-hidden",
          hasHeader ? "grid-rows-[auto_minmax(0,1fr)]" : "grid-rows-1",
        )}
      >
        {hasHeader ? (
          <header className={cn("px-4 lg:px-8", compact ? "py-3 lg:py-4" : "py-3 lg:pb-4 lg:pt-6")}>
            <h1
              className={cn(
                "text-balance font-heading font-semibold tracking-tight text-ink",
                compact
                  ? "text-[1.35rem] leading-tight lg:text-[clamp(1.55rem,2.6vw,2.1rem)] lg:leading-[1.12]"
                  : "max-w-[22ch] text-[clamp(1.45rem,3.6vw,2.55rem)] leading-[1.12]",
              )}
            >
              {title}
            </h1>
            {meta ? (
              <p className="mt-1 max-w-[68ch] text-[12.5px] leading-snug text-mute-700 lg:mt-1.5 lg:text-[13.5px]">
                {meta}
              </p>
            ) : null}
          </header>
        ) : null}
        <section className="relative min-h-0 overflow-hidden">{children}</section>
      </main>
    </div>
  );
}
