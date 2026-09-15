import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ARC, CLIENTS, CONTRASTS, KEYWORDS, POSITION } from "@/data/site";

// Chapter pacing — single set of knobs to live-tune. Hot-reload instantly.
const ANCHOR_ENTER_MS = 700;
const ANCHOR_SETTLE_MS = 350; // pause after the anchor settles, before the first pulse
const PULSE_FADE_MS = 400;
const PULSE_HOLD_MS = 750;
const PULSE_GAP_MS = 200;
const TAIL_PAUSE_MS = 600; // pause after the last pulse, before the chapter ends
const CHAPTER_CROSSFADE_MS = 550;

type Pos = "top" | "bottom" | "left" | "right";
type Chapter = { id: string; pos: Pos; anchor: ReactNode; pulses: ReactNode[]; holdOverride?: number };

function pulseCycleMs(count: number) {
  return count * (PULSE_FADE_MS * 2 + PULSE_HOLD_MS + PULSE_GAP_MS);
}

function chapterHoldMs(chapter: Chapter) {
  return chapter.holdOverride ?? ANCHOR_ENTER_MS + ANCHOR_SETTLE_MS + pulseCycleMs(chapter.pulses.length) + TAIL_PAUSE_MS;
}

export function HomeStage() {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [pulseOn, setPulseOn] = useState(-1);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const loop = [...KEYWORDS, ...KEYWORDS];

  const contrastPositions: Pos[] = ["right", "bottom", "left", "right", "top"];

  const chapters: Chapter[] = [
    {
      id: "open",
      pos: "top",
      holdOverride: 3400,
      anchor: (
        <>
          <p className="kicker">{POSITION.kicker}</p>
          <h1 className="mt-5 max-w-[16ch] font-heading text-[clamp(2.5rem,6.2vw,4.5rem)] font-semibold leading-[1.04] tracking-tight">
            <span className="block">{POSITION.line1}</span>
            <span className="block">{POSITION.line2}</span>
          </h1>
        </>
      ),
      pulses: [],
    },
    {
      id: "punch",
      pos: "left",
      anchor: (
        <>
          <p className="kicker">with</p>
          <p className="mt-4 max-w-[14ch] font-heading text-[clamp(2.3rem,5.8vw,4.3rem)] font-medium italic leading-[1.06] tracking-tight text-steel">
            {POSITION.punch}
          </p>
        </>
      ),
      pulses: [
        <p key="against" className="hope-live font-heading text-[clamp(1.4rem,2.8vw,2.1rem)] text-mute-600">
          not {POSITION.against}
        </p>,
      ],
    },
    ...CONTRASTS.map(
      (row, i): Chapter => ({
        id: `contrast-${i}`,
        pos: contrastPositions[i % contrastPositions.length],
        anchor: (
          <p className="max-w-[16ch] font-heading text-[clamp(2rem,4.5vw,3.4rem)] font-medium italic leading-[1.1] tracking-tight text-steel">
            {row.ray}
          </p>
        ),
        pulses: [
          <p key="them" className="hope-live max-w-[28ch] text-[clamp(1.2rem,2.2vw,1.5rem)] leading-snug text-mute-600">
            {row.them}
          </p>,
        ],
      }),
    ),
    {
      id: "arc-0",
      pos: "left",
      anchor: (
        <>
          <p className="kicker">{ARC[0].n}</p>
          <h2 className="mt-4 max-w-[16ch] font-heading text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-tight">
            {ARC[0].title}
          </h2>
        </>
      ),
      pulses: [<p key="body" className="max-w-[42ch] text-[clamp(1.2rem,2.2vw,1.5rem)] leading-relaxed text-mute-800">{ARC[0].body}</p>],
    },
    {
      id: "arc-1",
      pos: "right",
      anchor: (
        <>
          <p className="kicker">{ARC[1].n}</p>
          <h2 className="mt-4 max-w-[16ch] font-heading text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-tight">
            {ARC[1].title}
          </h2>
        </>
      ),
      pulses: [<p key="body" className="max-w-[42ch] text-[clamp(1.2rem,2.2vw,1.5rem)] leading-relaxed text-mute-800">{ARC[1].body}</p>],
    },
    {
      id: "arc-2-clients",
      pos: "left",
      anchor: (
        <>
          <p className="kicker">{ARC[2].n}</p>
          <h2 className="mt-4 max-w-[16ch] font-heading text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-tight">
            {ARC[2].title}
          </h2>
        </>
      ),
      pulses: CLIENTS.map((c) => (
        <span key={c} className="font-heading text-[clamp(1.3rem,2.4vw,1.7rem)] font-medium tracking-tight">
          {c}
        </span>
      )),
    },
    {
      id: "arc-3",
      pos: "bottom",
      anchor: (
        <>
          <p className="kicker">{ARC[3].n}</p>
          <h2 className="mt-4 max-w-[16ch] font-heading text-[clamp(2.2rem,5vw,3.8rem)] font-semibold italic leading-[1.08] tracking-tight text-steel">
            {ARC[3].title}
          </h2>
        </>
      ),
      pulses: [<p key="body" className="max-w-[42ch] text-[clamp(1.2rem,2.2vw,1.5rem)] leading-relaxed text-mute-800">{ARC[3].body}</p>],
    },
    {
      id: "proof",
      pos: "right",
      anchor: <p className="kicker text-[1.2rem]">Proof of scope</p>,
      pulses: [
        <ProofStat key="a" n="15+" label="Years enterprise platforms" />,
        <ProofStat key="b" n="3 yrs" label="AI on that discipline" />,
        <ProofStat key="c" n="24/7" label="Platforms, not demos" />,
      ],
    },
  ];

  const totalHold = chapters.reduce((s, ch) => s + chapterHoldMs(ch), 0);
  // progress ticks every 60ms for the top clock
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    if (typeof window !== "undefined") {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  // chapter driver — overlapping handoff between anchors
  useEffect(() => {
    if (reduced.current || paused || !mounted) return;
    const hold = chapterHoldMs(chapters[index]);
    const t = window.setTimeout(() => {
      const next = (index + 1) % chapters.length;
      setPrev(index);
      setIndex(next);
      window.setTimeout(() => setPrev((p) => (p === index ? null : p)), CHAPTER_CROSSFADE_MS + 40);
    }, hold);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, mounted, paused, chapters.length]);

  // pulse driver — steps through the current chapter's evidence, one at a time
  useEffect(() => {
    setPulseOn(-1);
    if (reduced.current || paused || !mounted) return;
    const pulses = chapters[index].pulses;
    if (!pulses.length) return;
    const timers: number[] = [];
    let t = ANCHOR_ENTER_MS + ANCHOR_SETTLE_MS;
    pulses.forEach((_, i) => {
      const onAt = t;
      const offAt = t + PULSE_FADE_MS + PULSE_HOLD_MS;
      timers.push(window.setTimeout(() => setPulseOn(i), onAt));
      timers.push(window.setTimeout(() => setPulseOn((p) => (p === i ? -1 : p)), offAt));
      t = offAt + PULSE_FADE_MS + PULSE_GAP_MS;
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, mounted, paused]);

  // clock ticks for the progress bar (loop-aware, resets with index)
  useEffect(() => {
    if (!mounted || reduced.current) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, [mounted]);

  // compute progress 0..1 across the loop for the top bar
  const elapsedInLoop = (() => {
    let e = 0;
    for (let i = 0; i < index; i++) e += chapterHoldMs(chapters[i]);
    return e;
  })();
  const progress = Math.min(1, elapsedInLoop / totalHold);
  void tick;

  return (
    <div
      className={`home-stage reel-stage absolute inset-0 overflow-hidden ${mounted ? "is-mounted" : "is-loading"}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* top progress clock — sweeps across the full loop */}
      <div
        className="reel-clock"
        aria-hidden
        style={{ transform: `scaleX(${mounted ? progress : 0})` }}
      />

      {/* reel viewport — JS drives which chapter is .is-active, and which of its pulses is .is-on */}
      <div className="reel-viewport" aria-live="polite" aria-atomic={false}>
        {chapters.map((ch, i) => {
          const isActive = i === index;
          const isExiting = i === prev;
          return (
            <div
              key={ch.id}
              className={`reel-scene ${isActive ? "is-active" : ""} ${isExiting ? "is-exiting" : ""} ${!isActive && !isExiting ? "is-idle" : ""}`}
              aria-hidden={!isActive}
            >
              <div className="chapter-pair">
                <div className="chapter-anchor" data-pos={ch.pos}>
                  {ch.anchor}
                </div>
                {ch.pulses.length ? (
                  <div className="chapter-pulses">
                    {ch.pulses.map((node, pi) => (
                      <div key={pi} className={`pulse-item ${isActive && pi === pulseOn ? "is-on" : ""}`}>
                        {node}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
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

      {/* dot rail — which chapter are we on */}
      <div className="reel-dots" aria-hidden>
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            aria-label={`Go to ${ch.id}`}
            onClick={() => {
              if (i === index) return;
              setPrev(index);
              setIndex(i);
              window.setTimeout(() => setPrev((p) => (p === index ? null : p)), CHAPTER_CROSSFADE_MS + 40);
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
      <div className="font-heading text-[2.6rem] font-semibold leading-none tracking-tight text-steel">{n}</div>
      <p className="mt-2 text-[1.05rem] text-mute-700">{label}</p>
    </div>
  );
}
