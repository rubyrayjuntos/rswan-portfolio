import { FormEvent } from "react";
import { SITE } from "@/data/site";
import { Blueprint } from "@/components/ui/blueprint";

export function ContactStage() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const from = String(fd.get("email") ?? "").trim();
    const brief = String(fd.get("brief") ?? "").trim();
    const subject = encodeURIComponent(name ? `Brief from ${name}` : "Brief");
    const body = encodeURIComponent(`${brief}\n\n— ${name}${from ? ` · ${from}` : ""}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 py-5 lg:px-8 lg:py-6">
      <div className="grid max-w-5xl gap-8 lg:grid-cols-2">
        <div>
          <p className="max-w-[48ch] text-[15.5px] leading-relaxed text-mute-800">
            Start with the operational problem, the constraint, and the evidence you need. I will
            answer with architecture, not a stack pitch.
          </p>
          <div className="mt-8 flex flex-col gap-2 text-sm">
            <a href={`mailto:${SITE.email}`} className="text-steel-800 hover:text-ink">
              {SITE.email}
            </a>
            <a href={SITE.phoneHref} className="text-steel-800 hover:text-ink">
              {SITE.phone}
            </a>
            <div className="text-mute-600">{SITE.city}</div>
          </div>
        </div>
        <Blueprint className="p-5">
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <label className="block text-xs text-mute-700">
              Name
              <input
                required
                name="name"
                className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-ink caret-steel"
              />
            </label>
            <label className="block text-xs text-mute-700">
              Email
              <input
                required
                type="email"
                name="email"
                className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-ink caret-steel"
              />
            </label>
            <label className="block text-xs text-mute-700">
              The problem
              <textarea
                required
                name="brief"
                rows={5}
                className="mt-1 w-full resize-y border border-line bg-surface px-3 py-2 text-sm text-ink caret-steel"
              />
            </label>
            <button
              type="submit"
              className="border border-steel bg-steel px-6 py-3 text-sm font-medium text-canvas transition-colors duration-150 hover:bg-steel-700 active:scale-[0.96]"
            >
              Open email
            </button>
            <p className="text-xs leading-relaxed text-mute-600">
              Opens your mail client to {SITE.email}. Nothing is stored on this site.
            </p>
          </form>
        </Blueprint>
      </div>
    </div>
  );
}
