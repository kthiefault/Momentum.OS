import { useEffect, useRef, useState } from "react";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function parseMetric(raw: string): { prefix: string; num: number; suffix: string } {
  const m = raw.match(/^([^0-9.]*)([0-9.]+)([^0-9.]*)$/);
  if (!m) return { prefix: "", num: 0, suffix: raw };
  return { prefix: m[1], num: parseFloat(m[2]), suffix: m[3] };
}

export function useCountUp(rawValue: string, duration = 1800) {
  const { prefix, num, suffix } = parseMetric(rawValue);
  const [display, setDisplay] = useState<string>(`${prefix}0${suffix}`);
  const triggered = useRef(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (num === 0) {
      setDisplay(`${prefix}0${suffix}`);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        obs.disconnect();

        const start = performance.now();
        const decimals = (num.toString().split(".")[1] ?? "").length;

        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutExpo(progress);
          const current = num * eased;
          setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [num, prefix, suffix, duration]);

  return { display, ref };
}
