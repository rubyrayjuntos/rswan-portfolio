import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ARC, CLIENTS, CONTRASTS, KEYWORDS, POSITION } from "@/data/site";

export function HomeStage() {
  const [mounted, setMounted] = useState(false);
  const loop = [...KEYWORDS, ...KEYWORDS];

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`home-stage absolute inset-0 overflow-hidden ${mounted ? "is-mounted" : "is-loading"}`}>
      <div className="stage-clock" aria-hidden />
      <div className="scene scene-identity">
        <p className={`kicker ${mounted ? "initial-rise initial-rise-d1" : "initial-rise"}`}>{POSITION.kicker}</p>
        <h1
          className={`mt-5 max-w-[16ch] font-heading text-[clamp(2.5rem,6.2vw,4.5rem)] font-semibold leading-[1.04] tracking-tight ${mounted ? "initial-rise initial-rise-d2" : "initial-rise"}`}
        >
          <span className="block">{POSITION.line1}</span>
          <span className="block">{POSITION.line2}</span>
        </h1>
      </div>

      <div className="scene scene-punch">
        <p className="kicker">with</p>
        <p className="mt-4 max-w-[14ch] font-heading text-[clamp(2.3rem,5.8vw,4.3rem)] font-medium italic leading-[1.06] tracking-tight text-steel">
          {POSITION.punch}
        </p>
        <p className="hope-live mt-6 font-heading text-[clamp(1.2rem,2.4vw,1.85rem)] text-mute-600">
          not {POSITION.against}
        </p>
      </div>

      {CONTRASTS.map((row, i) => (
        <div key={row.ray} className={`scene scene-contrast scene-contrast-${i}`}>
          <p className="max-w-[28ch] text-[1.05rem] leading-snug text-mute-600">{row.them}</p>
          <p className="mt-5 max-w-[16ch] font-heading text-[clamp(1.8rem,4.2vw,3.2rem)] font-medium italic leading-[1.1] tracking-tight text-steel">
            {row.ray}
          </p>
        </div>
      ))}

      {ARC.map((beat, i) => (
        <div key={beat.title} className={`scene scene-arc scene-arc-${i}`}>
          <p className="kicker">{beat.n}</p>
          <h2
            className={
              i === ARC.length - 1
                ? "mt-4 max-w-[16ch] font-heading text-[clamp(2rem,4.8vw,3.6rem)] font-semibold italic leading-[1.08] tracking-tight text-steel"
                : "mt-4 max-w-[16ch] font-heading text-[clamp(1.8rem,4vw,3.1rem)] font-semibold leading-[1.1] tracking-tight"
            }
          >
            {beat.title}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[1.05rem] leading-relaxed text-mute-800">{beat.body}</p>
        </div>
      ))}

      <div className="scene scene-proof">
        <p className="kicker">Proof of scope</p>
        <div className={`mt-6 flex flex-wrap gap-x-8 gap-y-3 ${mounted ? "initial-rise initial-rise-d3" : "initial-rise"}`}>
          {CLIENTS.map((c) => (
            <span key={c} className="font-heading text-[1.2rem] font-medium tracking-tight">
              {c}
            </span>
          ))}
        </div>
        <div className={`mt-10 flex flex-wrap gap-10 ${mounted ? "initial-rise initial-rise-d4" : "initial-rise"}`}>
          <ProofStat n="15 yrs" label="Enterprise systems" />
          <ProofStat n="3 yrs" label="AI on that discipline" />
          <ProofStat n="24/7" label="Platforms, not demos" />
        </div>
      </div>

      <div className="stage-cta">
        <Link
          to="/work"
          className="whitespace-nowrap border border-ink bg-ink px-5 py-2.5 text-[14px] font-medium text-canvas transition-colors duration-150 hover:bg-transparent hover:text-ink"
        >
          View the systems
        </Link>
        <Link
          to="/resume"
          className="whitespace-nowrap border border-mute-300 px-5 py-2.5 text-[14px] font-medium text-mute-700 transition-colors duration-150 hover:border-ink hover:text-ink"
        >
          Resume
        </Link>
      </div>

      <div className="keyword-rail" aria-hidden>
        <div className="keyword-track text-[11px] font-semibold uppercase tracking-[0.18em] text-steel-700">
          {loop.map((k, i) => (
            <span key={`${k}-${i}`} className="shrink-0">
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProofStat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-heading text-[2.4rem] font-semibold leading-none tracking-tight text-steel">{n}</div>
      <p className="mt-2 text-sm text-mute-700">{label}</p>
    </div>
  );
}
