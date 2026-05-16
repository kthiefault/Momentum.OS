import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Layout ──────────────────────────────────────────────────────────────────
const VW = 900;
const VH = 460;
const HUB = { x: 445, y: 230 };
const PROX = 130;   // px radius where proximity glow activates
const SAMPLES = 64; // samples per path for proximity math

// ─── Data ────────────────────────────────────────────────────────────────────
const INPUT_NODES = [
  { id: "in0", cx: 65, cy: 90,  label: "SOURCES",      sub: "CRM · ERP · Files" },
  { id: "in1", cx: 65, cy: 230, label: "SYSTEMS",      sub: "APIs · Webhooks" },
  { id: "in2", cx: 65, cy: 370, label: "INTEGRATIONS", sub: "150+ connectors" },
] as const;

const OUTPUT_NODES = [
  { id: "out0", cx: 815, cy: 85,  label: "Enrich" },
  { id: "out1", cx: 815, cy: 170, label: "Route"  },
  { id: "out2", cx: 815, cy: 292, label: "Draft"  },
  { id: "out3", cx: 815, cy: 375, label: "Book"   },
] as const;

// Circuit-board paths: sharp segments with 16 px quadratic rounded corners
const PATHS = [
  // Inputs → hub
  { id: "pi0", d: `M 113,90 H 193 Q 209,90 209,106 V 214 Q 209,230 225,230 H 431` },
  { id: "pi1", d: `M 113,230 H 431` },
  { id: "pi2", d: `M 113,370 H 193 Q 209,370 209,354 V 246 Q 209,230 225,230 H 431` },
  // Hub → outputs
  { id: "po0", d: `M 459,230 H 631 Q 647,230 647,214 V 101 Q 647,85 663,85 H 815` },
  { id: "po1", d: `M 459,230 H 595 Q 611,230 611,214 V 186 Q 611,170 627,170 H 815` },
  { id: "po2", d: `M 459,230 H 595 Q 611,230 611,246 V 276 Q 611,292 627,292 H 815` },
  { id: "po3", d: `M 459,230 H 631 Q 647,230 647,246 V 359 Q 647,375 663,375 H 815` },
] as const;

// Dots at path bends / junctions
const JUNCTION_DOTS = [
  { x: 209, y: 90  }, { x: 209, y: 230 }, { x: 209, y: 370 },
  { x: 340, y: 230 }, { x: 550, y: 230 },
  { x: 647, y: 85  }, { x: 611, y: 170 }, { x: 611, y: 292 }, { x: 647, y: 375 },
];

// Subtle ambient star-field coordinates
const STARS = [
  [140,45],[355,28],[590,70],[762,40],[868,174],
  [125,188],[278,158],[498,128],[728,196],[876,118],
  [158,318],[348,386],[548,338],[718,406],[836,288],
  [422,54],[672,148],[312,446],[758,362],[190,408],
  [530,400],[680,320],[820,230],[100,300],[450,50],
];

const PHASES = ["Phase 1", "Phase 2", "Phase 3"];

// ─── Pulse particle ───────────────────────────────────────────────────────────
// Travels along a static SVG path via rAF + getPointAtLength
function Pulse({ pathId, startOffset }: { pathId: string; startOffset: number }) {
  const ref = useRef<SVGCircleElement>(null);
  const t = useRef(startOffset);

  useEffect(() => {
    const el = document.getElementById(pathId) as SVGPathElement | null;
    if (!el) return;
    const len = el.getTotalLength();
    let raf: number;
    const tick = () => {
      t.current = (t.current + 0.0017) % 1;
      const pt = el.getPointAtLength(t.current * len);
      if (ref.current) {
        ref.current.setAttribute("cx", pt.x.toFixed(1));
        ref.current.setAttribute("cy", pt.y.toFixed(1));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pathId]);

  return (
    <circle ref={ref} r={2.2} fill="white" opacity={0.82} filter="url(#dot-glow)" />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OrchestrationFlow() {
  const svgRef      = useRef<SVGSVGElement>(null);
  const baseRefs    = useRef<(SVGPathElement | null)[]>([]);
  const glowRefs    = useRef<(SVGPathElement | null)[]>([]);
  const hubRing1    = useRef<SVGCircleElement>(null);
  const hubRing2    = useRef<SVGCircleElement>(null);
  const hubCore     = useRef<SVGCircleElement>(null);
  const hubDot      = useRef<SVGCircleElement>(null);
  const hubLineH    = useRef<SVGLineElement>(null);
  const hubLineV    = useRef<SVGLineElement>(null);

  const mouseRef    = useRef({ x: -9999, y: -9999 });
  const samplesRef  = useRef<{ x: number; y: number }[][]>([]);
  const headerRef   = useRef<HTMLDivElement>(null);
  const windowRef   = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Delay pulse render until paths are in the DOM
  useEffect(() => setMounted(true), []);

  // Scroll-triggered entrance animations (GSAP, consistent with other sections)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: headerRef.current, start: "top 78%", once: true },
        opacity: 0, y: 28, duration: 0.9, ease: "power2.out",
      });
      gsap.from(windowRef.current, {
        scrollTrigger: { trigger: windowRef.current, start: "top 80%", once: true },
        opacity: 0, y: 52, scale: 0.975, duration: 1.1, ease: "power2.out", delay: 0.12,
      });
    });
    return () => ctx.revert();
  }, []);

  // Pre-cache path sample points so the rAF loop avoids DOM reads
  useEffect(() => {
    if (!mounted) return;
    samplesRef.current = baseRefs.current.map(el => {
      if (!el) return [];
      const len = el.getTotalLength();
      return Array.from({ length: SAMPLES + 1 }, (_, i) =>
        el.getPointAtLength((i / SAMPLES) * len)
      );
    });
  }, [mounted]);

  // Convert window mouse → SVG coordinate space
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - r.left) / r.width)  * VW,
        y: ((e.clientY - r.top)  / r.height) * VH,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Proximity glow — direct DOM attribute writes keep React out of the hot path
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const { x: mx, y: my } = mouseRef.current;

      // Update each glow path
      glowRefs.current.forEach((el, i) => {
        if (!el) return;
        const pts = samplesRef.current[i] ?? [];
        let min = Infinity;
        for (const pt of pts) {
          const d = Math.hypot(pt.x - mx, pt.y - my);
          if (d < min) min = d;
        }
        const g = Math.max(0, 1 - min / PROX);
        el.setAttribute("stroke-opacity", (0.06 + g * 0.75).toFixed(3));
        if (g > 0.06) el.setAttribute("filter", "url(#path-glow)");
        else          el.removeAttribute("filter");
      });

      // Hub glow
      const hd = Math.hypot(mx - HUB.x, my - HUB.y);
      const hg = Math.max(0, 1 - hd / 90);

      hubRing1.current?.setAttribute("stroke-opacity", (0.025 + hg * 0.08).toFixed(3));
      hubRing2.current?.setAttribute("fill-opacity",   (0.014 + hg * 0.06).toFixed(3));
      hubCore.current?.setAttribute( "fill-opacity",   (0.055 + hg * 0.22).toFixed(3));
      hubDot.current?.setAttribute(  "opacity",        (0.55  + hg * 0.45).toFixed(3));
      hubLineH.current?.setAttribute("stroke-opacity", (0.07  + hg * 0.25).toFixed(3));
      hubLineV.current?.setAttribute("stroke-opacity", (0.07  + hg * 0.25).toFixed(3));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-36">

      {/* Section background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, hsl(230 18% 6%), hsl(230 20% 3%))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mask-radial bg-grid opacity-25"
      />

      <div className="container relative">

        {/* ── Header ── */}
        <div ref={headerRef} className="mb-14 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Orchestration layer
          </span>
          <h2 className="mt-5 text-4xl font-medium leading-[1.06] tracking-[-0.03em] sm:text-5xl">
            Every workflow flows through{" "}
            <br className="hidden sm:block" />
            <em className="not-italic text-foreground/45">one intelligence hub.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Connect any source. Route through your logic. Every step is visual,
            traceable, and self-healing.
          </p>
        </div>

        {/* ── Product window ── */}
        <div
          ref={windowRef}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "hsl(230 22% 4.5%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03) inset, 0 52px 130px rgba(0,0,0,0.7), 0 0 80px rgba(0,0,0,0.4)",
          }}
        >

          {/* Window chrome */}
          <div
            className="flex items-center gap-3 px-5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{ width: 9, height: 9, background: "rgba(255,255,255,0.08)" }}
                />
              ))}
            </div>
            <span
              className="ml-2 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              Momentum.OS · Workflow Canvas
            </span>
          </div>

          {/* ── SVG canvas ── */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VW} ${VH}`}
            className="block w-full"
          >
            <defs>
              {/* Hub glow: large soft bloom */}
              <filter id="hub-glow" x="-250%" y="-250%" width="600%" height="600%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Path glow: tight horizontal spread */}
              <filter id="path-glow" x="-6%" y="-400%" width="112%" height="900%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Pulse dot glow */}
              <filter id="dot-glow" x="-600%" y="-600%" width="1300%" height="1300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ── Ambient star-field ── */}
            {STARS.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={0.7} fill="white" opacity={0.07} />
            ))}

            {/* ── Base paths — always visible at low opacity ── */}
            {PATHS.map((p, i) => (
              <path
                key={p.id}
                id={p.id}
                ref={el => { baseRefs.current[i] = el; }}
                d={p.d}
                fill="none"
                stroke="rgb(200,206,218)"
                strokeWidth={0.85}
                strokeOpacity={0.13}
              />
            ))}

            {/* ── Glow paths — brightness driven by cursor proximity ── */}
            {PATHS.map((p, i) => (
              <path
                key={`glow-${p.id}`}
                ref={el => { glowRefs.current[i] = el; }}
                d={p.d}
                fill="none"
                stroke="rgb(230,233,242)"
                strokeWidth={1.6}
                strokeOpacity={0.06}
              />
            ))}

            {/* ── Energy pulses — one dot per path ── */}
            {mounted && PATHS.map((p, i) => (
              <Pulse key={p.id} pathId={p.id} startOffset={i / PATHS.length} />
            ))}

            {/* ── Junction / node dots ── */}
            {JUNCTION_DOTS.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={2.5}
                fill="rgb(200,210,228)" fillOpacity={0.22} />
            ))}

            {/* ── Hub ── */}
            {/* Far ring */}
            <circle ref={hubRing1} cx={HUB.x} cy={HUB.y} r={54}
              fill="none" stroke="white" strokeOpacity={0.025} strokeWidth={0.75} />
            {/* Soft fill bloom */}
            <circle ref={hubRing2} cx={HUB.x} cy={HUB.y} r={34}
              fill="white" fillOpacity={0.014} />
            {/* Core glow orb */}
            <circle ref={hubCore} cx={HUB.x} cy={HUB.y} r={15}
              fill="white" fillOpacity={0.055} filter="url(#hub-glow)" />
            {/* Center pinpoint */}
            <circle ref={hubDot} cx={HUB.x} cy={HUB.y} r={3.5}
              fill="white" opacity={0.55} />
            {/* Crosshair */}
            <line ref={hubLineH}
              x1={HUB.x - 24} y1={HUB.y} x2={HUB.x + 24} y2={HUB.y}
              stroke="white" strokeWidth={0.75} strokeOpacity={0.07} />
            <line ref={hubLineV}
              x1={HUB.x} y1={HUB.y - 24} x2={HUB.x} y2={HUB.y + 24}
              stroke="white" strokeWidth={0.75} strokeOpacity={0.07} />

            {/* ── Input nodes — glassmorphism cards ── */}
            {INPUT_NODES.map(node => (
              <g key={node.id}>
                {/* Card body */}
                <rect
                  x={node.cx - 46} y={node.cy - 37}
                  width={92} height={74}
                  rx={10}
                  fill="white"  fillOpacity={0.038}
                  stroke="white" strokeOpacity={0.085} strokeWidth={0.75}
                />
                {/* Icon placeholder */}
                <rect
                  x={node.cx - 13} y={node.cy - 28}
                  width={26} height={26}
                  rx={5}
                  fill="white" fillOpacity={0.07}
                />
                {/* Label */}
                <text
                  x={node.cx} y={node.cy + 14}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.40)"
                  fontSize={8} fontWeight="600"
                  fontFamily="system-ui,-apple-system,BlinkMacSystemFont,sans-serif"
                  letterSpacing="0.08em"
                >
                  {node.label}
                </text>
                <text
                  x={node.cx} y={node.cy + 25}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.18)"
                  fontSize={6.5}
                  fontFamily="system-ui,-apple-system,BlinkMacSystemFont,sans-serif"
                >
                  {node.sub}
                </text>
                {/* Right-edge connector dot */}
                <circle cx={node.cx + 46} cy={node.cy} r={2.5}
                  fill="white" fillOpacity={0.18} />
              </g>
            ))}

            {/* ── Output nodes — pill chips ── */}
            {OUTPUT_NODES.map(node => (
              <g key={node.id}>
                <rect
                  x={node.cx - 4} y={node.cy - 13}
                  width={86} height={26}
                  rx={13}
                  fill="white"  fillOpacity={0.05}
                  stroke="white" strokeOpacity={0.10} strokeWidth={0.75}
                />
                <text
                  x={node.cx + 39} y={node.cy + 4.5}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.44)"
                  fontSize={10}
                  fontFamily="system-ui,-apple-system,BlinkMacSystemFont,sans-serif"
                  letterSpacing="0.04em"
                >
                  {node.label}
                </text>
                {/* Left-edge connector dot */}
                <circle cx={node.cx - 4} cy={node.cy} r={2.5}
                  fill="white" fillOpacity={0.22} />
              </g>
            ))}
          </svg>

          {/* ── Phase navigation ── */}
          <div
            className="flex items-center justify-center gap-2 px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {PHASES.map((label, i) => (
              <button
                key={label}
                onClick={() => setPhase(i)}
                className="rounded-full px-5 py-1.5 text-[11px] tracking-wide transition-all duration-300"
                style={{
                  background: phase === i ? "rgba(255,255,255,0.09)" : "transparent",
                  border:     phase === i
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1px solid rgba(255,255,255,0.07)",
                  color: phase === i
                    ? "rgba(255,255,255,0.72)"
                    : "rgba(255,255,255,0.28)",
                  cursor: "pointer",
                  fontFamily: "system-ui,-apple-system,sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
