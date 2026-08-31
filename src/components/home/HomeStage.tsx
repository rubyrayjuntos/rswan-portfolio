import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ARC, CLIENTS, CONTRASTS, KEYWORDS, POSITION } from "@/data/site";

// TikTok-reel timing — single knob to live-tune. Hot-reload instantly.
// 1900 = fast narrative, 1600 = twitch, 2200 = editorial breath.
const REEL_HOLD_MS = 1900;
const REEL_PROOF_HOLD_MS = 2800; // last beat holds a touch longer
const REEL_ENTER_MS = 600; // cross-slide where both are visible

type Scene = { id: string; hold: number; node: React.ReactNode };

export function HomeStage() {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const loop = [...KEYWORDS, ...KEYWORDS];

  const scenes: Scene[] = [
    {
      id: "identity",
      hold: REEL_HOLD_MS,
      node: (
        <>
          <p className="kicker">{POSITION.kicker}</p>
          <h1 className="mt-5 max-w-[16ch] font-heading text-[clamp(2.5rem,6.2vw,4.5rem)] font-semibold leading-[1.04] tracking-tight">
            <span className="block">{POSITION.line1}</span>
            <span className="block">{POSITION.line2}</span>
          </h1>
        </>
      ),
    },
    {
      id: "punch",
      hold: REEL_HOLD_MS,
      node: (
        <>
          <p className="kicker">with</p>
          <p className="mt-4 max-w-[14ch] font-heading text-[clamp(2.3rem,5.8vw,4.3rem)] font-medium italic leading-[1.06] tracking-tight text-steel">
            {POSITION.punch}
          </p>
          <p className="hope-live mt-6 font-heading text-[clamp(1.2rem,2.4vw,1.85rem)] text-mute-600">
            not {POSITION.against}
          </p>
        </>
      ),
    },
    ...CONTRASTS.map((row) => ({
      id: `c-${row.ray.slice(0, 12)}`,
      hold: REEL_HOLD_MS,
      node: (
        <>
          <p className="max-w-[28ch] text-[1.05rem] leading-snug text-mute-600">{row.them}</p>
          <p className="mt-5 max-w-[16ch] font-heading text-[clamp(1.8rem,4.2vw,3.2rem)] font-medium italic leading-[1.1] tracking-tight text-steel">
            {row.ray}
          </p>
        </>
      ),
    })),
    ...ARC.map((beat, i) => ({
      id: `arc-${i}`,
      hold: REEL_HOLD_MS,
      node: (
        <>
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
        </>
      ),
    })),
    {
      id: "proof",
      hold: REEL_PROOF_HOLD_MS,
      node: (
        <>
          <p className="kicker">Proof of scope</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {CLIENTS.map((c) => (
              <span key={c} className="font-heading text-[1.2rem] font-medium tracking-tight">
                {c}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-10">
            <ProofStat n="15 yrs" label="Enterprise systems" />
            <ProofStat n="3 yrs" label="AI on that discipline" />
            <ProofStat n="24/7" label="Platforms, not demos" />
          </div>
        </>
      ),
    },
  ];

  const totalHold = scenes.reduce((s, sc) => s + sc.hold, 0);
  // progress ticks every 60ms for the top clock
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    if (typeof window !== "undefined") {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  // reel driver — overlapping handoff
  useEffect(() => {
    if (reduced.current || paused || !mounted) return;
    const hold = scenes[index]?.hold ?? REEL_HOLD_MS;
    const t = window.setTimeout(() => {
      const next = (index + 1) % scenes.length;
      setPrev(index);
      setIndex(next);
      // clear the exiting scene after the cross-slide finishes
      window.setTimeout(() => setPrev((p) => (p === index ? null : p)), REEL_ENTER_MS + 40);
    }, hold);
    return () => clearTimeout(t);
  }, [index, mounted, paused, scenes.length]);

  // clock ticks for the progress bar (loop-aware, resets with index)
  useEffect(() => {
    if (!mounted || reduced.current) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, [mounted]);

  // compute progress 0..1 across the loop for the top bar
  const elapsedInLoop = (() => {
    let e = 0;
    for (let i = 0; i < index; i++) e += scenes[i].hold;
    // add ~60ms * (tick remainder) style? simpler: no sub-beat lerp — step progress is enough
    // lerp within current hold by estimating time since mount modulo
    return e;
  })();
  const progress = Math.min(1, elapsedInLoop / totalHold);

  if (reduced.current && mounted) {
    // accessible fallback: stacked, no motion — uses CSS prefers-reduced-motion guard too
  }

  return (
    <div
      className={`home-stage reel-stage absolute inset-0 overflow-hidden ${mounted ? "is-mounted" : "is-loading"}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* top progress clock — sweeps across the ~26s loop */}
      <div
        className="reel-clock"
        aria-hidden
        style={{ transform: `scaleX(${mounted ? progress : 0})` }}
      />

      {/* reel viewport — JS drives which .reel-scene is .is-active */}
      <div className="reel-viewport" aria-live="polite" aria-atomic={false}>
        {scenes.map((sc, i) => {
          const isActive = i === index;
          const isExiting = i === prev;
          return (
            <div
              key={sc.id}
              className={`reel-scene ${isActive ? "is-active" : ""} ${isExiting ? "is-exiting" : ""} ${!isActive && !isExiting ? "is-idle" : ""}`}
              aria-hidden={!isActive}
            >
              {sc.node}
            </div>
          );
        })}
      </div>

      {/* persistent CTA — visible after the initial rise, not keyframed */}
      <div className={`reel-cta ${mounted ? "reel-cta--in" : "reel-cta--out"}`}>
        <Link
          to="/work"
          className="whitespace-nowrap border border-ink bg-ink px-5 py-2.5 text-[14px] font-medium text-canvas transition-colors duration-150 hover:bg-transparent hover:text-ink"
        >
          View the systems
        </Link>
        <Link
          to="/resume"
          className="whitespace-nowrap border border-mute-300 bg-canvas/90 px-5 py-2.5 text-[14px] font-medium text-mute-700 backdrop-blur transition-colors duration-150 hover:border-ink hover:text-ink"
        >
          Resume
        </Link>
      </div>

      {/* dot rail — which beat are we on */}
      <div className="reel-dots" aria-hidden>
        {scenes.map((sc, i) => (
          <button
            key={sc.id}
            type="button"
            aria-label={`Go to ${sc.id}`}
            onClick={() => {
              if (i === index) return;
              setPrev(index);
              setIndex(i);
              window.setTimeout(() => setPrev((p) => (p === index ? null : p)), REEL_ENTER_MS + 40);
            }}
            className={`reel-dot ${i === index ? "is-on" : ""} ${i === prev ? "is-prev" : ""}`}
          />
        ))}
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
