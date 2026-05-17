import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Database, Cpu, GitBranch, ChevronDown, X,
  Users, ArrowUpRight, MessageSquare, Calendar, Activity,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── SVG layout constants ────────────────────────────────────────────────────
const VW = 700;
const VH = 460;
const HUB = { x: 332, y: 230 };
const PROX = 130;
const SAMPLES = 64;

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

// ─── Phase system ─────────────────────────────────────────────────────────────
interface PhaseConfig {
  id: number;
  name: string;
  fullLabel: string;
  tagline: string;
  description: string;
  pathBaseOpacity: number;
  glowMultiplier: number;
  pulseSpeed: number;
  pulseAlpha: number;
  hubIntensity: number;
}

const PHASE_CONFIGS: PhaseConfig[] = [
  {
    id: 0, name: "Chaos", fullLabel: "Phase 1 — Chaos",
    tagline: "Disconnected. Fragmented. Manual.",
    description: "Most businesses operate with disconnected systems, manual tasks, and operational friction. Tools exist in silos. Data doesn't flow. Growth stalls under the weight of manual work.",
    pathBaseOpacity: 0.05, glowMultiplier: 0.2, pulseSpeed: 0.0004, pulseAlpha: 0.2, hubIntensity: 0.25,
  },
  {
    id: 1, name: "Orchestration", fullLabel: "Phase 2 — Orchestration",
    tagline: "Systems connecting. Workflows illuminating.",
    description: "Momentum.OS centralizes workflows, automations, and communication into one operational framework. Systems begin talking. Processes run automatically.",
    pathBaseOpacity: 0.18, glowMultiplier: 0.72, pulseSpeed: 0.0017, pulseAlpha: 0.82, hubIntensity: 0.72,
  },
  {
    id: 2, name: "Scale", fullLabel: "Phase 3 — Scale",
    tagline: "Organized. Synchronized. Precise.",
    description: "Operate from a centralized command layer designed for scalable growth and automation. Every workflow synchronized. Every system optimized. Operational clarity at any scale.",
    pathBaseOpacity: 0.28, glowMultiplier: 1.0, pulseSpeed: 0.0026, pulseAlpha: 1.0, hubIntensity: 1.0,
  },
];

// ─── Hotspot system ───────────────────────────────────────────────────────────
interface HotspotDef {
  id: string;
  svgX: number;
  svgY: number;
  hitR: number;
  title: string;
  Icon: React.ElementType;
  body: string;
  tags: string[];
  cardAnchor: "left" | "right";
}

const HOTSPOTS: HotspotDef[] = [
  { id: "hub", svgX: 332, svgY: 230, hitR: 28, title: "Workflow Automation", Icon: Activity,
    body: "The central orchestration engine connects every system in your stack. All data flows through one intelligence hub — routing, enriching, and acting in real time.",
    tags: ["Real-time routing", "Zero manual work", "Self-healing"], cardAnchor: "right" },
  { id: "out0", svgX: 656, svgY: 85, hitR: 22, title: "CRM Automation", Icon: Users,
    body: "Contact records are automatically enriched with firmographic data and engagement signals. Your CRM stays accurate without a single manual update.",
    tags: ["Auto-enrich", "Data hygiene", "Signal detection"], cardAnchor: "left" },
  { id: "out1", svgX: 656, svgY: 170, hitR: 22, title: "Lead Routing", Icon: ArrowUpRight,
    body: "Inbound leads are scored and distributed to the right rep instantly. Routing rules adapt to your process — no dead ends, no lost opportunities.",
    tags: ["Smart scoring", "Instant routing", "SLA enforcement"], cardAnchor: "left" },
  { id: "out2", svgX: 656, svgY: 292, hitR: 22, title: "AI Follow-Up", Icon: MessageSquare,
    body: "AI drafts personalized outreach sequences triggered by behavior. Every message contextual, timely, and brand-consistent — sent automatically.",
    tags: ["Personalized AI", "Behavioral triggers", "Brand-consistent"], cardAnchor: "left" },
  { id: "out3", svgX: 656, svgY: 375, hitR: 22, title: "Scheduling Systems", Icon: Calendar,
    body: "Meeting scheduling flows automatically. Prospects book time directly, workflows trigger on confirmed appointments, and follow-up handles itself.",
    tags: ["Auto-scheduling", "Calendar sync", "Reminder sequences"], cardAnchor: "left" },
];

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
  yPct: number;
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
      { name: "Salesforce",    tag: "CRM",    status: "live"      },
      { name: "HubSpot",       tag: "CRM",    status: "live"      },
      { name: "Notion",        tag: "Docs",   status: "connected" },
      { name: "Airtable",      tag: "DB",     status: "connected" },
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
      { name: "REST API", tag: "HTTP",    status: "live"      },
      { name: "Slack",    tag: "Webhook", status: "live"      },
      { name: "Jira",     tag: "Tickets", status: "connected" },
      { name: "GitHub",   tag: "Events",  status: "connected" },
      { name: "Linear",   tag: "Issues",  status: "available" },
    ],
  },
  {
    id: "in2",
    icon: GitBranch,
    label: "Integrations",
    sub: "150+ connectors",
    yPct: 370 / VH,
    examples: [
      { name: "Gmail",      tag: "Email",    status: "live"      },
      { name: "Stripe",     tag: "Billing",  status: "live"      },
      { name: "Twilio",     tag: "SMS",      status: "connected" },
      { name: "Shopify",    tag: "Commerce", status: "connected" },
      { name: "PostgreSQL", tag: "DB",       status: "available" },
    ],
  },
];

const STATUS_DOT: Record<ExampleItem["status"], string> = {
  live:      "bg-emerald-400",
  connected: "bg-white/40",
  available: "bg-white/15",
};

// ─── PhaseControl segmented control ──────────────────────────────────────────
function PhaseControl({ phase, onChange }: { phase: number; onChange: (i: number) => void }) {
  return (
    <div
      className="relative flex items-center rounded-full p-1"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {PHASE_CONFIGS.map((config, i) => (
        <button
          key={config.id}
          onClick={() => onChange(i)}
          className="relative px-5 py-2 text-[11px] tracking-[0.04em]"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 1,
            color: phase === i ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.28)",
            fontFamily: "system-ui,-apple-system,sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {phase === i ? (
            <motion.div
              layoutId="phase-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
            />
          ) : null}
          <span className="relative">{config.fullLabel}</span>
        </button>
      ))}
    </div>
  );
}

// ─── HotspotInfoCard ──────────────────────────────────────────────────────────
function HotspotInfoCard({
  hotspot,
  style,
  onClose,
}: {
  hotspot: HotspotDef;
  style: React.CSSProperties;
  onClose: () => void;
}) {
  const Icon = hotspot.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, y: 8 }}
      transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
      style={{
        ...style,
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        background: "rgba(10,12,20,0.92)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "14px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
        padding: "16px",
        pointerEvents: "all",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Icon className="h-3.5 w-3.5 text-white/55" />
          </div>
          <span
            className="text-[12px] font-semibold tracking-[-0.01em]"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            {hotspot.title}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
        >
          <X className="h-3 w-3 text-white/40" />
        </button>
      </div>
      <p className="text-[11px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.42)" }}>
        {hotspot.body}
      </p>
      <div className="flex flex-wrap gap-1 mt-3">
        {hotspot.tags.map(tag => (
          <span
            key={tag}
            className="text-[9px] rounded-full px-2 py-0.5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.32)",
              letterSpacing: "0.03em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
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
      <div
        className="relative overflow-hidden rounded-xl transition-all duration-500"
        style={{
          background: isExpanded ? "hsl(230 22% 9%)" : "rgba(255,255,255,0.04)",
          border: isExpanded ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.08)",
          boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
        }}
      >
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

        <div
          className="overflow-hidden transition-all duration-500"
          style={{
            maxHeight: isExpanded ? "240px" : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div
            className="px-3 pb-3 pt-0 space-y-0.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "hsl(230 22% 9%)" }}
          >
            {node.examples.map(item => (
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

  // Consolidated pulse system
  const pulseCircleRefs   = useRef<(SVGCircleElement | null)[]>([]);
  const pulseSpeedRef     = useRef<number>(PHASE_CONFIGS[1].pulseSpeed);
  const pulseProgressRef  = useRef<number[]>(PATHS.map((_, i) => i / PATHS.length));
  const phaseConfigRef    = useRef<PhaseConfig>(PHASE_CONFIGS[1]);
  const pathLengthsRef    = useRef<(number | null)[]>(PATHS.map(() => null));

  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const samplesRef = useRef<{ x: number; y: number }[][]>([]);
  const headerRef  = useRef<HTMLDivElement>(null);
  const windowRef  = useRef<HTMLDivElement>(null);

  const [phase,          setPhase]          = useState<number>(1);
  const [expanded,       setExpanded]       = useState<number | null>(null);
  const [mounted,        setMounted]        = useState<boolean>(false);
  const [activeHotspot,  setActiveHotspot]  = useState<string | null>(null);
  const [cardStyle,      setCardStyle]      = useState<React.CSSProperties>({});

  const currentConfig = PHASE_CONFIGS[phase];

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

  // Mouse -> SVG coordinate tracking
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

  // Proximity glow loop — reads phaseConfigRef for phase-aware intensity
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const { x: mx, y: my } = mouseRef.current;
      const config = phaseConfigRef.current;

      glowRefs.current.forEach((el, i) => {
        if (!el) return;
        const pts = samplesRef.current[i] ?? [];
        let min = Infinity;
        for (const pt of pts) {
          const d = Math.hypot(pt.x - mx, pt.y - my);
          if (d < min) min = d;
        }
        const g = Math.max(0, 1 - min / PROX);
        const gScaled = g * config.glowMultiplier;
        el.setAttribute("stroke-opacity", (config.pathBaseOpacity * 0.4 + gScaled * 0.75).toFixed(3));
        if (gScaled > 0.06) el.setAttribute("filter", "url(#path-glow)");
        else el.removeAttribute("filter");
      });

      const hd = Math.hypot(mx - HUB.x, my - HUB.y);
      const hg = Math.max(0, 1 - hd / 90) * config.hubIntensity;

      hubRing1.current?.setAttribute("stroke-opacity", (0.025 * config.hubIntensity + hg * 0.08).toFixed(3));
      hubRing2.current?.setAttribute("fill-opacity",   (0.014 * config.hubIntensity + hg * 0.06).toFixed(3));
      hubCore.current?.setAttribute( "fill-opacity",   (0.055 * config.hubIntensity + hg * 0.22).toFixed(3));
      hubDot.current?.setAttribute(  "opacity",        (0.35  * config.hubIntensity + hg * 0.45 + 0.15).toFixed(3));
      hubLineH.current?.setAttribute("stroke-opacity", (0.07  * config.hubIntensity + hg * 0.25).toFixed(3));
      hubLineV.current?.setAttribute("stroke-opacity", (0.07  * config.hubIntensity + hg * 0.25).toFixed(3));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Consolidated pulse rAF loop
  useEffect(() => {
    if (!mounted) return;
    let raf: number;
    const tick = () => {
      const speed = pulseSpeedRef.current;
      const alpha = phaseConfigRef.current.pulseAlpha;

      PATHS.forEach((p, i) => {
        const el = pulseCircleRefs.current[i];
        if (!el) return;

        // Cache path length on first access
        if (pathLengthsRef.current[i] === null) {
          const pathEl = document.getElementById(p.id) as SVGPathElement | null;
          if (pathEl) pathLengthsRef.current[i] = pathEl.getTotalLength();
        }
        const len = pathLengthsRef.current[i];
        if (len === null) return;

        pulseProgressRef.current[i] = (pulseProgressRef.current[i] + speed) % 1;
        const pt = (document.getElementById(p.id) as SVGPathElement | null)?.getPointAtLength(
          pulseProgressRef.current[i] * len
        );
        if (pt) {
          el.setAttribute("cx", pt.x.toFixed(1));
          el.setAttribute("cy", pt.y.toFixed(1));
          el.setAttribute("opacity", alpha.toFixed(3));
        }
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  // Phase change handler
  const handlePhaseChange = useCallback((i: number) => {
    const config = PHASE_CONFIGS[i];
    phaseConfigRef.current = config;
    gsap.to(pulseSpeedRef, { current: config.pulseSpeed, duration: 1.4, ease: "power2.inOut" });
    setPhase(i);
    setActiveHotspot(null);
  }, []);

  // Hotspot click handler
  const handleHotspotClick = useCallback((hotspot: HotspotDef, e: React.MouseEvent<SVGCircleElement>) => {
    e.stopPropagation();
    if (activeHotspot === hotspot.id) { setActiveHotspot(null); return; }

    const svg = svgRef.current;
    if (!svg) return;

    const svgRect = svg.getBoundingClientRect();
    const scaleX = svgRect.width / VW;
    const scaleY = svgRect.height / VH;

    const CARD_W = 240;
    const CARD_H = 200;

    // Position relative to the SVG's parent div (the relative flex-1 container)
    const nodeX = hotspot.svgX * scaleX;
    const nodeY = hotspot.svgY * scaleY;

    let x = hotspot.cardAnchor === "left" ? nodeX - CARD_W - 14 : nodeX + 20;
    let y = nodeY - CARD_H / 2;
    y = Math.max(8, Math.min(y, svgRect.height - CARD_H - 8));
    x = Math.max(8, Math.min(x, svgRect.width - CARD_W - 8));

    setCardStyle({ position: "absolute", left: x, top: y, width: CARD_W, zIndex: 20 });
    setActiveHotspot(hotspot.id);
  }, [activeHotspot]);

  const toggleExpand = (i: number) => {
    setExpanded(prev => (prev === i ? null : i));
  };

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 50%, hsl(230 18% 6%), hsl(230 20% 3%))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mask-radial bg-grid opacity-25"
      />

      <div className="container relative">

        {/* Header */}
        <div ref={headerRef} className="mb-10 text-center">
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
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset, 0 52px 130px rgba(0,0,0,0.7)",
          }}
          onClick={() => setActiveHotspot(null)}
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

            {/* Phase status indicator */}
            <div className="ml-auto flex items-center gap-1.5">
              <span
                className="inline-flex h-1.5 w-1.5 rounded-full"
                style={{
                  background: phase === 0
                    ? "rgba(255,90,50,0.9)"
                    : phase === 1
                    ? "rgba(80,170,255,0.9)"
                    : "rgba(80,220,150,0.9)",
                  boxShadow: phase === 0
                    ? "0 0 6px rgba(255,90,50,0.7)"
                    : phase === 1
                    ? "0 0 6px rgba(80,170,255,0.7)"
                    : "0 0 6px rgba(80,220,150,0.7)",
                  transition: "all 0.6s ease",
                }}
              />
              <span
                className="font-mono text-[9px]"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                {currentConfig.name.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Split canvas */}
          <div className="flex items-stretch">

            {/* Left panel: interactive source nodes */}
            <div
              className="relative flex-none"
              style={{ width: "196px", borderRight: "1px solid rgba(255,255,255,0.05)" }}
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

            {/* Right: SVG visualization wrapped in relative container for card overlay */}
            <div
              className="relative flex-1 min-w-0"
              onClick={e => e.stopPropagation()}
            >
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
                  <filter id="hotspot-glow" x="-400%" y="-400%" width="900%" height="900%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
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

                {/* Base paths — React-driven opacity with CSS transition for smooth phase changes */}
                {PATHS.map((p, i) => (
                  <path
                    key={p.id}
                    id={p.id}
                    ref={el => { baseRefs.current[i] = el; }}
                    d={p.d}
                    fill="none"
                    stroke="rgb(200,206,218)"
                    strokeWidth={0.85}
                    strokeOpacity={currentConfig.pathBaseOpacity}
                    style={{ transition: "stroke-opacity 1.4s cubic-bezier(0.23, 1, 0.32, 1)" }}
                  />
                ))}

                {/* Glow paths — driven by proximity rAF */}
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

                {/* Consolidated pulse circles */}
                {mounted ? PATHS.map((_, i) => (
                  <circle
                    key={`pulse-${i}`}
                    ref={el => { pulseCircleRefs.current[i] = el; }}
                    r={2.2}
                    fill="white"
                    opacity={phaseConfigRef.current.pulseAlpha}
                    filter="url(#dot-glow)"
                  />
                )) : null}

                {/* Junction dots */}
                {JUNCTION_DOTS.map((d, i) => (
                  <circle
                    key={i}
                    cx={d.x} cy={d.y} r={2.5}
                    fill="rgb(200,210,228)"
                    fillOpacity={currentConfig.pathBaseOpacity * 1.5}
                    style={{ transition: "fill-opacity 1.4s cubic-bezier(0.23, 1, 0.32, 1)" }}
                  />
                ))}

                {/* Hub */}
                <circle ref={hubRing1} cx={HUB.x} cy={HUB.y} r={54}
                  fill="none" stroke="white" strokeOpacity={0.025 * currentConfig.hubIntensity} strokeWidth={0.75} />
                <circle ref={hubRing2} cx={HUB.x} cy={HUB.y} r={34}
                  fill="white" fillOpacity={0.014 * currentConfig.hubIntensity} />
                <circle ref={hubCore} cx={HUB.x} cy={HUB.y} r={15}
                  fill="white" fillOpacity={0.055 * currentConfig.hubIntensity} filter="url(#hub-glow)" />
                <circle ref={hubDot} cx={HUB.x} cy={HUB.y} r={3.5}
                  fill="white" opacity={0.35 * currentConfig.hubIntensity + 0.15} />
                <line ref={hubLineH}
                  x1={HUB.x - 24} y1={HUB.y} x2={HUB.x + 24} y2={HUB.y}
                  stroke="white" strokeWidth={0.75} strokeOpacity={0.07 * currentConfig.hubIntensity} />
                <line ref={hubLineV}
                  x1={HUB.x} y1={HUB.y - 24} x2={HUB.x} y2={HUB.y + 24}
                  stroke="white" strokeWidth={0.75} strokeOpacity={0.07 * currentConfig.hubIntensity} />

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

                {/* Hotspot hit circles */}
                {HOTSPOTS.map(hotspot => (
                  <circle
                    key={hotspot.id}
                    cx={hotspot.svgX} cy={hotspot.svgY} r={hotspot.hitR}
                    fill={activeHotspot === hotspot.id ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.01)"}
                    stroke={activeHotspot === hotspot.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}
                    strokeWidth={0.8}
                    style={{ cursor: "pointer", transition: "fill 0.2s, stroke 0.2s" }}
                    onClick={e => handleHotspotClick(hotspot, e)}
                    onMouseEnter={e => {
                      if (activeHotspot !== hotspot.id) {
                        (e.currentTarget as SVGCircleElement).setAttribute("fill", "rgba(255,255,255,0.03)");
                        (e.currentTarget as SVGCircleElement).setAttribute("stroke", "rgba(255,255,255,0.10)");
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeHotspot !== hotspot.id) {
                        (e.currentTarget as SVGCircleElement).setAttribute("fill", "rgba(255,255,255,0.01)");
                        (e.currentTarget as SVGCircleElement).setAttribute("stroke", "rgba(255,255,255,0.04)");
                      }
                    }}
                  />
                ))}

                {/* Hotspot indicator dots */}
                {HOTSPOTS.map(hotspot => (
                  <circle
                    key={`ind-${hotspot.id}`}
                    cx={hotspot.svgX} cy={hotspot.svgY} r={3.5}
                    fill="white"
                    opacity={activeHotspot === hotspot.id ? 0.85 : 0.2}
                    style={{ transition: "opacity 0.2s", pointerEvents: "none" }}
                    filter={activeHotspot === hotspot.id ? "url(#hotspot-glow)" : undefined}
                  />
                ))}
              </svg>

              {/* Hotspot info card overlay */}
              <AnimatePresence>
                {activeHotspot !== null ? (() => {
                  const hotspot = HOTSPOTS.find(h => h.id === activeHotspot);
                  return hotspot ? (
                    <HotspotInfoCard
                      key={activeHotspot}
                      hotspot={hotspot}
                      style={cardStyle}
                      onClose={() => setActiveHotspot(null)}
                    />
                  ) : null;
                })() : null}
              </AnimatePresence>
            </div>
          </div>

          {/* Phase navigation footer */}
          <div
            className="flex flex-col items-center gap-4 px-6 py-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <PhaseControl phase={phase} onChange={handlePhaseChange} />

            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="text-center text-[11px] max-w-md"
                style={{
                  color: "rgba(255,255,255,0.30)",
                  lineHeight: "1.6",
                  fontFamily: "system-ui,-apple-system,sans-serif",
                }}
              >
                {currentConfig.description}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Phase storytelling cards */}
        <div className="mt-12 grid grid-cols-3 gap-6 mx-auto max-w-2xl">
          {PHASE_CONFIGS.map((config, i) => (
            <button
              key={config.id}
              onClick={() => handlePhaseChange(i)}
              className="text-center transition-all duration-500"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                opacity: phase === i ? 1 : 0.65,
                transform: phase === i ? "scale(1)" : "scale(0.97)",
              }}
            >
              <div
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500"
                style={{
                  background: phase === i ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)",
                  border: phase === i ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.65)" }}>
                  0{i + 1}
                </span>
              </div>
              <p className="text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                {config.name}
              </p>
              <p className="text-[11px] leading-[1.55]" style={{ color: "rgba(255,255,255,0.52)" }}>
                {config.tagline}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
