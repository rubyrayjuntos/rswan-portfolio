import { Link, useRouterState } from "@tanstack/react-router";
import { Github, Linkedin, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { PILLARS, SITE } from "@/data/site";
import { catalog } from "@/data/projects";
import { cn } from "@/lib/utils";

function Item({
  to,
  params,
  label,
  child,
  active,
  onClick,
}: {
  to: string;
  params?: Record<string, string>;
  label: string;
  child?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      params={params}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center pr-2 leading-none",
        child ? "h-7" : "h-9",
        active
          ? cn(
              "font-heading italic text-steel",
              child ? "text-[1.05rem]" : "text-[1.25rem]",
            )
          : cn(
              "text-mute-700 hover:text-ink",
              child ? "text-[13px]" : "text-[15px] font-medium",
            ),
      )}
    >
      {label}
    </Link>
  );
}

function Group({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="ml-0.5 border-l border-line pl-3" role="group" aria-label={label}>
      {children}
    </div>
  );
}

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full min-h-0 flex-col justify-between bg-canvas px-6 py-6">
      <div className="flex min-h-0 flex-col">
        <Link
          to="/"
          onClick={onNavigate}
          className="font-heading text-[1.7rem] font-semibold leading-none tracking-tight text-ink"
        >
          {SITE.name}
          <span className="text-steel">_</span>
        </Link>
        <div className="mt-2 flex flex-col gap-0.5 text-[10px] uppercase tracking-[0.14em] text-steel-700">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={SITE.phoneHref}>{SITE.phone}</a>
        </div>

        <nav className="mt-8 flex flex-col" aria-label="Primary">
          <Item to="/" label="Home" active={pathname === "/"} onClick={onNavigate} />

          <Item to="/work" label="Work" active={pathname === "/work"} onClick={onNavigate} />
          <Group label="Work">
            {catalog.map((p) => (
              <Item
                key={p.slug}
                to="/work/$slug"
                params={{ slug: p.slug }}
                label={p.title}
                child
                active={pathname === `/work/${p.slug}`}
                onClick={onNavigate}
              />
            ))}
          </Group>

          <Item
            to="/principles"
            label="Principles"
            active={pathname === "/principles"}
            onClick={onNavigate}
          />
          <Group label="Principles">
            {PILLARS.map((p) => (
              <Item
                key={p.slug}
                to="/principles/$cap"
                params={{ cap: p.slug }}
                label={p.title}
                child
                active={pathname === `/principles/${p.slug}`}
                onClick={onNavigate}
              />
            ))}
          </Group>

          <Item to="/resume" label="Resume" active={pathname === "/resume"} onClick={onNavigate} />
          <Item to="/contact" label="Contact" active={pathname === "/contact"} onClick={onNavigate} />
        </nav>
      </div>

      <div className="flex flex-col gap-3 text-sm text-mute-700">
        <div className="flex items-center gap-5 py-2">
          <a href={SITE.github} title="GitHub" className="text-mute-700 hover:text-ink" target="_blank" rel="noreferrer">
            <Github className="size-5" strokeWidth={1.5} />
          </a>
          <a href={SITE.linkedin} title="LinkedIn" className="text-mute-700 hover:text-ink" target="_blank" rel="noreferrer">
            <Linkedin className="size-5" strokeWidth={1.5} />
          </a>
        </div>
        <div className="text-[10px] uppercase tracking-[0.14em] text-mute-600">
          {SITE.city} · {SITE.revision}
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between border-b border-line px-4 py-3 lg:hidden">
        <Link to="/" className="font-heading text-[1.35rem] font-semibold tracking-tight">
          {SITE.name}
          <span className="text-steel">_</span>
        </Link>
        <button
          type="button"
          className="flex size-11 items-center justify-center border border-line text-ink"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="size-6" strokeWidth={1.75} />
          ) : (
            <span className="flex flex-col gap-1" aria-hidden>
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
            </span>
          )}
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 bg-canvas lg:hidden">
          <SideNav onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
