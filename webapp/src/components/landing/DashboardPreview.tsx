import { useEffect, useRef, useState } from "react";
import { Activity, ArrowUpRight, Bot, Circle, DollarSign, Sparkles, TrendingUp, Users, Workflow, Zap } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";

const tabs = [
  { id: "command", label: "Command", icon: Activity },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "workflows", label: "Workflows", icon: Workflow },
];

const sparklinePath = (values: number[], w: number, h: number) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = w / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

const DashboardPreview = () => {
  const [tab, setTab] = useState<string>("command");
  const [revealed, setRevealed] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const trend = [12, 18, 15, 22, 28, 24, 35, 32, 40, 38, 47, 52, 49, 58, 64];
  const trendPath = sparklinePath(trend, 220, 60);

  return (
    <section id="preview" className="relative isolate overflow-hidden py-32 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mask-radial bg-grid-fine opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, hsl(22 80% 50% / 0.18), transparent 60%)",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SectionLabel index="03" label="Live preview" tone="ice" />
          </div>
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            One canvas to run{" "}
            <span className="font-display italic text-ice">the whole company.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            From the first lead to the renewal invoice — every signal, every
            workflow, every agent in a single view.
          </p>
        </div>

        <div
          ref={ref}
          className={`relative mx-auto mt-16 max-w-6xl transition-all duration-1000 ${
            revealed
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          {/* Outer glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem]"
            style={{
              background:
                "linear-gradient(180deg, hsl(22 95% 58% / 0.25), hsl(192 90% 70% / 0.18) 50%, transparent 100%)",
              filter: "blur(36px)",
            }}
          />

          <div className="glass-strong relative overflow-hidden rounded-2xl">
            {/* Window chrome */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(0_80%_55%)]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(40_90%_55%)]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(140_60%_50%)]/70" />
                <span className="ml-3 font-mono text-[11px] text-muted-foreground">
                  momentum.os / atlas group · production
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(140_70%_55%)] shadow-[0_0_8px_hsl(140_70%_55%)]" />
                  live
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-border/60 px-3 py-2">
              {tabs.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`group inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors ${
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                    {active ? (
                      <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_6px_hsl(22_95%_58%)]" />
                    ) : null}
                  </button>
                );
              })}
              <div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">⌘K</span>
                <span>Ask Momentum</span>
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-12 gap-4 p-4 lg:p-6">
              {/* Sidebar */}
              <aside className="col-span-12 lg:col-span-3">
                <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    Today
                  </p>
                  {[
                    { label: "Inbox triage", count: 24, dot: "bg-ember" },
                    { label: "Pipeline review", count: 7, dot: "bg-ice" },
                    { label: "Renewals due", count: 3, dot: "bg-[hsl(140_70%_55%)]" },
                    { label: "Agent escalations", count: 1, dot: "bg-[hsl(0_80%_60%)]" },
                  ].map((i) => (
                    <button
                      key={i.label}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-foreground/80 transition-colors hover:bg-secondary/60"
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${i.dot}`} />
                        {i.label}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {i.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-3 rounded-xl border border-border/60 bg-background/40 p-3">
                  <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    Agents online
                  </p>
                  {[
                    { name: "Atlas / Sales", status: "running" },
                    { name: "Mercury / Ops", status: "running" },
                    { name: "Vesta / Finance", status: "idle" },
                  ].map((a) => (
                    <div
                      key={a.name}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs"
                    >
                      <span className="flex items-center gap-2 text-foreground/80">
                        <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                        {a.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Main */}
              <main className="col-span-12 space-y-4 lg:col-span-9">
                {/* KPI row */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: "Pipeline value", val: "$1.84M", delta: "+12.4%", icon: DollarSign },
                    { label: "Win rate", val: "38.2%", delta: "+4.1pt", icon: TrendingUp },
                    { label: "Active deals", val: "127", delta: "+8", icon: Users },
                    { label: "Hours reclaimed", val: "412", delta: "this wk", icon: Zap },
                  ].map((k) => (
                    <div
                      key={k.label}
                      className="rounded-xl border border-border/60 bg-background/40 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                          {k.label}
                        </span>
                        <k.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-xl font-medium tracking-tight">
                          {k.val}
                        </p>
                        <span className="font-mono text-[10px] text-[hsl(140_70%_60%)]">
                          {k.delta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart + activity */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
                  <div className="col-span-1 rounded-xl border border-border/60 bg-background/40 p-4 lg:col-span-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                          Revenue velocity · 30d
                        </p>
                        <p className="mt-1 text-lg font-medium tracking-tight">
                          $384,210 <span className="text-sm text-muted-foreground">/ week</span>
                        </p>
                      </div>
                      <button className="rounded-md border border-border bg-card/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground">
                        Drill in
                      </button>
                    </div>

                    <div className="relative mt-4 h-[88px] w-full overflow-hidden">
                      <svg
                        viewBox="0 0 220 60"
                        preserveAspectRatio="none"
                        className="h-full w-full"
                      >
                        <defs>
                          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="hsl(22 95% 58%)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="hsl(22 95% 58%)" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="g2" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor="hsl(22 95% 58%)" />
                            <stop offset="100%" stopColor="hsl(192 90% 70%)" />
                          </linearGradient>
                        </defs>
                        <path d={`${trendPath} L 220,60 L 0,60 Z`} fill="url(#g1)" />
                        <path
                          d={trendPath}
                          fill="none"
                          stroke="url(#g2)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="220"
                          cy={60 - ((trend[trend.length - 1] - Math.min(...trend)) / (Math.max(...trend) - Math.min(...trend))) * 60}
                          r="3"
                          fill="hsl(22 95% 58%)"
                        >
                          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    </div>

                    <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground/70">
                      <span>w-30</span>
                      <span>w-28</span>
                      <span>w-26</span>
                      <span>w-24</span>
                      <span>w-22</span>
                      <span>now</span>
                    </div>
                  </div>

                  <div className="col-span-1 rounded-xl border border-border/60 bg-background/40 p-4 lg:col-span-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                      Live activity
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {[
                        { dot: "ember", text: "Atlas closed Helix Capital · $48K", t: "now" },
                        { dot: "ice", text: "Workflow ‹Onboarding-v3› auto-fired", t: "1m" },
                        { dot: "green", text: "Renewal signal · NORTHWIND high", t: "4m" },
                        { dot: "ember", text: "Vesta drafted Q3 forecast", t: "8m" },
                        { dot: "ice", text: "Mercury cleared 14 ops tickets", t: "12m" },
                      ].map((row, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs">
                          <span
                            className={`mt-1 h-1.5 w-1.5 flex-none rounded-full ${
                              row.dot === "ember"
                                ? "bg-ember shadow-[0_0_8px_hsl(22_95%_58%)]"
                                : row.dot === "ice"
                                ? "bg-ice shadow-[0_0_8px_hsl(192_90%_70%)]"
                                : "bg-[hsl(140_70%_55%)] shadow-[0_0_8px_hsl(140_70%_55%)]"
                            }`}
                          />
                          <span className="flex-1 text-foreground/85">{row.text}</span>
                          <span className="font-mono text-[10px] text-muted-foreground/70">
                            {row.t}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pipeline lane */}
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                      Pipeline · weighted
                    </p>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      AI-prioritized
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {[
                      { stage: "Discover", value: "$420K", count: 38, fill: 70 },
                      { stage: "Qualify", value: "$310K", count: 21, fill: 55 },
                      { stage: "Propose", value: "$280K", count: 14, fill: 42 },
                      { stage: "Negotiate", value: "$210K", count: 9, fill: 30 },
                      { stage: "Close", value: "$118K", count: 5, fill: 18 },
                    ].map((s) => (
                      <div key={s.stage} className="space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
                            {s.stage}
                          </span>
                          <span className="font-mono text-muted-foreground">
                            {s.count}
                          </span>
                        </div>
                        <div className="relative h-16 overflow-hidden rounded-md border border-border bg-secondary/40">
                          <div
                            className="absolute inset-x-0 bottom-0 transition-all duration-700"
                            style={{
                              height: `${s.fill}%`,
                              background:
                                "linear-gradient(180deg, hsl(22 95% 58% / 0.5), hsl(22 95% 58% / 0.15))",
                            }}
                          />
                          <div
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-px"
                            style={{
                              top: `${100 - s.fill}%`,
                              background:
                                "linear-gradient(90deg, transparent, hsl(22 95% 58%), transparent)",
                            }}
                          />
                        </div>
                        <p className="text-xs font-medium">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>

            {/* Footer command bar */}
            <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Circle className="h-2 w-2 fill-[hsl(140_70%_55%)] text-[hsl(140_70%_55%)]" />
                  All systems nominal
                </span>
                <span className="font-mono">·</span>
                <span>17 workflows · 3 agents · 4 integrations</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-muted-foreground">Momentum AI</span>
                <Sparkles className="h-3.5 w-3.5 text-ember" />
                <span className="text-foreground">Ready</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Soft scan line */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
            >
              <div
                className="absolute inset-x-0 h-32 animate-scan opacity-[0.06]"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, hsl(192 90% 70%), transparent)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
