import { useCallback, useEffect, useRef, useState } from "react";

export function useSnapRail(count: number, resetKey?: string) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const jumpTo = useCallback((i: number) => {
    const root = scrollerRef.current;
    if (!root) return;
    const child = root.children[i] as HTMLElement | undefined;
    if (!child) return;
    child.scrollIntoView({ behavior: "smooth", block: "start" });
    setIndex(i);
  }, []);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
    setIndex(0);
  }, [resetKey]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const kids = Array.from(root.children);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const i = kids.indexOf(visible.target);
        if (i >= 0) setIndex(i);
      },
      { root, rootMargin: "0px 0px -60% 0px", threshold: [0, 0.15, 0.4] },
    );
    kids.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [count, resetKey]);

  return { scrollerRef, index, jumpTo, setIndex };
}
