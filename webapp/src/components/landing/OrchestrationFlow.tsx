import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Database, Cpu, GitBranch, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── SVG layout (left panel is HTML, so SVG starts at x=0) ──────────────────
const VW = 700;
const VH = 460;
const HUB = { x: 332, y: 230 };
const PROX = 130;
const SAMPLES = 64;

// Paths now start at x=0 (left edge of SVG, adjacent to HTML panel)
const PATHS = [
  { id: "pi0", d: `M 0,90 H 80 Q 96,90 96,106 V 214 Q 96,230 112,230 H 318` },
  { id: "pi1", d: `M 0,230 H 318` },
  { id: "pi2", d: `M 0,370 H 80 Q 96,370 96,354 V 246 Q 96,230 112,230 H 318` },
  { id: "po0", d: `M 346,230 H 518 Q 534,230 534,214 V 101 Q 534,85 550,85 H 700` },
  { id: "po1", d: `M 346,230 H 482 Q 498,230 498,214 V 186 Q 498,170 514,170 H 700` },
  { id: "po2", d: `M 346,230 H 482 Q 498,230 498,246 V 276 Q 498,292 514,292 H 700` },
  { id: "po3", d: `M 346,230 H 518 Q 534,230 534,246 V 359 Q 534,375 550,375 H 700` },
] as const;

const JUNCTION_DOTS = [
  { x: 96,  y: 90  }, { x: 96,  y: 230 }, { x: 96,  y: 370 },
  { x: 227, y: 230 }, { x: 437, y: 230 },
  { x: 534, y: 85  }, { x: 498, y: 170 }, { x: 498, y: 292 }, { x: 534, y: 375 },
];

const OUTPUT_NODES = [
  { id: "out0", cx: 700, cy: 85,  label: "Enrich" },
  { id: "out1", cx: 700, cy: 170, label: "Route"  },
  { id: "out2", cx: 700, cy: 292, label: "Draft"  },
  { id: "out3", cx: 700, cy: 375, label: "Book"   },
] as const;

const STARS = [
  [60,40],[200,22],[380,65],[540,38],[660,168],
  [30,185],[155,152],[310,122],[520,190],[660,112],
  [80,315],[240,382],[420,332],[580,402],[640,282],
  [310,50],[480,148],[160,440],[540,358],[100,298],
];

const PHASES = ["Phase 1", "Phase 2", "Phase 3"];

// ─── Source node data ─────────────────────────────────────────────────────────
interface ExampleItem {
  name: string;
  tag: string;
  status: "live" | "connected" | "available";
}

interface InputNodeDef {
  id: string;
  icon: React.ElementType;
  label: string;
  sub: string;
  yPct: number;   // vertical center as % of SVG height (matches path y)
  examples: ExampleItem[];
}

const INPUT_NODES: InputNodeDef[] = [
  {
    id: "in0",
    icon: Database,
    label: "Sources",
    sub: "CRM · ERP · Files",
    yPct: 90 / VH,
    examples: [
      { name: "Salesforce", tag: "CRM",    status: "live"      },
      { name: "HubSpot",    tag: "CRM",    status: "live"      },
      { name: "Notion",     tag: "Docs",   status: "connected" },
      { name: "Airtable",   tag: "DB",     status: "connected" },
      { name: "Google Sheets", tag: "Sheets", status: "available" },
    ],
  },
  {
    id: "in1",
    icon: Cpu,
    label: "Systems",
    sub: "APIs · Webhooks",
    yPct: 230 / VH,
    examples: [
      { name: "REST API",    tag: "HTTP",    status: "live"      },
      { name: "Slack",       tag: "Webhook", status: "live"      },
      { name: "Jira",        tag: "Tickets", status: "connected" },
      { name: "GitHub",      tag: "Events",  status: "connected" },
      { name: "Linear",      tag: "Issues",  status: "available" },
    ],
  },
  {
    id: "in2",
    icon: GitBranch,
    label: "Integrations",
    sub: "150+ connectors",
    yPct: 370 / VH,
    examples: [
      { name: "Gmail",    tag: "Email",   status: "live"      },
      { name: "Stripe",   tag: "Billing", status: "live"      },
      { name: "Twilio",   tag: "SMS",     status: "connected" },
      { name: "Shopify",  tag: "Commerce",status: "connected" },
      { name: "PostgreSQL", tag: "DB",    status: "available" },
    ],
  },
];

const STATUS_DOT: Record<ExampleItem["status"], string> = {
  live:      "bg-emerald-400",
  connected: "bg-white/40",
  available: "bg-white/15",
};

// ─── Pulse particle ───────────────────────────────────────────────────────────
function Pulse({ pathId, startOffset }: { pathId: string; startOffset: number }) {
  const ref = useRef<SVGCircleElement>(null);
  const t   = useRef(startOffset);

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

  return <circle ref={ref} r={2.2} fill="white" opacity={0.82} filter="url(#dot-glow)" />;
}

// ─── Expandable source card ───────────────────────────────────────────────────
function SourceCard({
  node,
  isExpanded,
  onToggle,
}: {
  node: InputNodeDef;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = node.icon;

  return (
    <div
      className="absolute left-0 right-0"
      style={{
        top: `calc(${node.yPct * 100}% - 36px)`,
        zIndex: isExpanded ? 10 : 1,
      }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-xl transition-all duration-500"
        style={{
          background: isExpanded
            ? "rgba(255,255,255,0.07)"
            : "rgba(255,255,255,0.04)",
          border: isExpanded
            ? "1px solid rgba(255,255,255,0.14)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: isExpanded
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "none",
        }}
      >
        {/* Header row — always visible */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer"
          style={{ background: "transparent", border: "none" }}
        >
          <div
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <Icon className="h-3.5 w-3.5 text-white/50" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45 leading-none">
              {node.label}
            </p>
            <p className="mt-0.5 text-[9px] text-white/22 truncate">{node.sub}</p>
          </div>
          <ChevronDown
            className="h-3 w-3 flex-none text-white/25 transition-transform duration-300"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {/* Expanded examples */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{
            maxHeight: isExpanded ? "240px" : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div
            className="px-3 pb-3 pt-0 space-y-0.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {node.examples.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150"
                style={{ background: "rgba(255,255,255,0.02)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div className={`h-1.5 w-1.5 flex-none rounded-full ${STATUS_DOT[item.status]}`} />
                <span className="flex-1 text-[10px] text-white/50 truncate">{item.name}</span>
                <span
                  className="text-[8px] text-white/20 rounded px-1 py-0.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connector dot — right edge, at vertical center of header */}
      <div
        className="absolute right-0 top-[36px] -translate-y-1/2 translate-x-1/2 h-2 w-2 rounded-full"
        style={{
          background: isExpanded ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)",
          border: "1px solid rgba(255,255,255,0.3)",
          transition: "background 0.3s ease",
          zIndex: 2,
        }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OrchestrationFlow() {
  const svgRef    = useRef<SVGSVGElement>(null);
  const baseRefs  = useRef<(SVGPathElement | null)[]>([]);
  const glowRefs  = useRef<(SVGPathElement | null)[]>([]);
  const hubRing1  = useRef<SVGCircleElement>(null);
  const hubRing2  = useRef<SVGCircleElement>(null);
  const hubCore   = useRef<SVGCircleElement>(null);
  const hubDot    = useRef<SVGCircleElement>(null);
  const hubLineH  = useRef<SVGLineElement>(null);
  const hubLineV  = useRef<SVGLineElement>(null);

  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const samplesRef = useRef<{ x: number; y: number }[][]>([]);
  const headerRef  = useRef<HTMLDivElement>(null);
  const windowRef  = useRef<HTMLDivElement>(null);

  const [phase,    setPhase]    = useState<number>(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [mounted,  setMounted]  = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  // GSAP scroll entrance
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

  // Cache path sample points once mounted
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

  // Mouse → SVG coordinate tracking
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

  // Proximity glow loop — direct DOM writes, no React re-renders
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const { x: mx, y: my } = mouseRef.current;

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

  const toggleExpand = (i: number) => {
    setExpanded(prev => (prev === i ? null : i));
  };

  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-36">

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

        {/* Header */}
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

        {/* Product window */}
        <div
          ref={windowRef}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "hsl(230 22% 4.5%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03) inset, 0 52px 130px rgba(0,0,0,0.7)",
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

          {/* Split canvas: HTML left panel + SVG right */}
          <div className="flex items-stretch">

            {/* ── Left panel: interactive source nodes ── */}
            <div
              className="relative flex-none"
              style={{
                width: "196px",
                borderRight: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {INPUT_NODES.map((node, i) => (
                <SourceCard
                  key={node.id}
                  node={node}
                  isExpanded={expanded === i}
                  onToggle={() => toggleExpand(i)}
                />
              ))}
            </div>

            {/* ── Right: SVG visualization ── */}
            <div className="flex-1 min-w-0">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${VW} ${VH}`}
                className="block w-full"
              >
                <defs>
                  <filter id="hub-glow" x="-250%" y="-250%" width="600%" height="600%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="path-glow" x="-6%" y="-400%" width="112%" height="900%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="dot-glow" x="-600%" y="-600%" width="1300%" height="1300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Star-field */}
                {STARS.map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={0.7} fill="white" opacity={0.07} />
                ))}

                {/* Base paths */}
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

                {/* Glow paths */}
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

                {/* Energy pulses */}
                {mounted && PATHS.map((p, i) => (
                  <Pulse key={p.id} pathId={p.id} startOffset={i / PATHS.length} />
                ))}

                {/* Junction dots */}
                {JUNCTION_DOTS.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={2.5}
                    fill="rgb(200,210,228)" fillOpacity={0.22} />
                ))}

                {/* Hub */}
                <circle ref={hubRing1} cx={HUB.x} cy={HUB.y} r={54}
                  fill="none" stroke="white" strokeOpacity={0.025} strokeWidth={0.75} />
                <circle ref={hubRing2} cx={HUB.x} cy={HUB.y} r={34}
                  fill="white" fillOpacity={0.014} />
                <circle ref={hubCore} cx={HUB.x} cy={HUB.y} r={15}
                  fill="white" fillOpacity={0.055} filter="url(#hub-glow)" />
                <circle ref={hubDot} cx={HUB.x} cy={HUB.y} r={3.5}
                  fill="white" opacity={0.55} />
                <line ref={hubLineH}
                  x1={HUB.x - 24} y1={HUB.y} x2={HUB.x + 24} y2={HUB.y}
                  stroke="white" strokeWidth={0.75} strokeOpacity={0.07} />
                <line ref={hubLineV}
                  x1={HUB.x} y1={HUB.y - 24} x2={HUB.x} y2={HUB.y + 24}
                  stroke="white" strokeWidth={0.75} strokeOpacity={0.07} />

                {/* Output nodes */}
                {OUTPUT_NODES.map(node => (
                  <g key={node.id}>
                    <rect
                      x={node.cx - 4} y={node.cy - 13}
                      width={80} height={26}
                      rx={13}
                      fill="white" fillOpacity={0.05}
                      stroke="white" strokeOpacity={0.10} strokeWidth={0.75}
                    />
                    <text
                      x={node.cx + 36} y={node.cy + 4.5}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.44)"
                      fontSize={10}
                      fontFamily="system-ui,-apple-system,sans-serif"
                      letterSpacing="0.04em"
                    >
                      {node.label}
                    </text>
                    <circle cx={node.cx - 4} cy={node.cy} r={2.5}
                      fill="white" fillOpacity={0.22} />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Phase navigation */}
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
                  color: phase === i ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.28)",
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
