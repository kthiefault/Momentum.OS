import { useEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight, Flame, Snowflake, Sparkles, Target } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Deal = {
  name: string;
  value: string;
  score: number;
  signal: "hot" | "cool" | "neutral";
  next: string;
};

const stages: { label: string; deals: Deal[] }[] = [
  {
    label: "Qualify",
    deals: [
      { name: "Helix Capital", value: "$48K", score: 92, signal: "hot", next: "Send exec brief" },
      { name: "Beacon Labs", value: "$22K", score: 71, signal: "neutral", next: "Map champion" },
    ],
  },
  {
    label: "Propose",
    deals: [
      { name: "Atlas Group", value: "$84K", score: 88, signal: "hot", next: "Confirm pricing" },
      { name: "Vector & Co.", value: "$31K", score: 64, signal: "neutral", next: "Address security review" },
    ],
  },
  {
    label: "Negotiate",
    deals: [
      { name: "NORTHWIND", value: "$120K", score: 58, signal: "cool", next: "Re-engage CFO" },
    ],
  },
  {
    label: "Close",
    deals: [
      { name: "Sequoia Ops", value: "$96K", score: 95, signal: "hot", next: "Counter-sign" },
    ],
  },
];

const SignalIcon = ({ signal }: { signal: Deal["signal"] }) => {
  if (signal === "hot")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-ember/15 px-2 py-0.5 text-[10px] font-medium text-ember">
        <Flame className="h-2.5 w-2.5" />hot
      </span>
    );
  if (signal === "cool")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-ice/15 px-2 py-0.5 text-[10px] font-medium text-ice">
        <Snowflake className="h-2.5 w-2.5" />cool
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Target className="h-2.5 w-2.5" />watch
    </span>
  );
};

const CRMPipeline = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".crm-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        opacity: 0, y: 40, duration: 0.9, ease: "power2.out",
      });
      gsap.from(".crm-column", {
        scrollTrigger: { trigger: ".crm-board", start: "top 82%", once: true },
        opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: "power2.out",
      });
      gsap.from(".crm-metric", {
        scrollTrigger: { trigger: ".crm-metrics", start: "top 88%", once: true },
        opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pipeline" className="relative isolate overflow-hidden py-16 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 mask-radial bg-grid-fine opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(192 90% 70% / 0.08), transparent 60%)",
        }}
      />

      <div className="container relative">
        <div className="crm-header mx-auto max-w-3xl">
          <SectionLabel index="06" label="CRM & pipeline" tone="ice" />
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            A pipeline that{" "}
            <span className="font-display italic text-ice">tells you what to do next.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Every deal scored. Every signal surfaced. Every next-best-action
            generated. The CRM stops being a system of record and becomes a
            system of leverage.
          </p>
        </div>

        <div className="crm-board mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, si) => (
            <div key={stage.label} className="crm-column rounded-2xl border border-border/70 bg-card/40 p-3">
              <div className="flex items-center justify-between px-2 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  0{si + 1} · {stage.label}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{stage.deals.length}</span>
              </div>

              <div className="space-y-2">
                {stage.deals.map((d) => (
                  <div
                    key={d.name}
                    className="group rounded-xl border border-border/60 bg-background/60 p-3 transition-all duration-300 hover:border-ember/40 hover:bg-background/80 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(0_0%_0%/0.3)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium tracking-tight">{d.name}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{d.value}</p>
                      </div>
                      <SignalIcon signal={d.signal} />
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/80">
                        <span>ICP fit</span>
                        <span>{d.score}</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${d.score}%`,
                            background:
                              d.score > 80
                                ? "linear-gradient(90deg, hsl(22 95% 58%), hsl(40 100% 70%))"
                                : d.score > 60
                                ? "linear-gradient(90deg, hsl(192 90% 70%), hsl(210 90% 60%))"
                                : "linear-gradient(90deg, hsl(230 8% 40%), hsl(230 8% 60%))",
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 rounded-md border border-ember/20 bg-ember/[0.06] px-2 py-1.5 text-[11px] text-foreground/85">
                      <Sparkles className="h-3 w-3 flex-none text-ember" />
                      <span className="truncate">{d.next}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="crm-metrics mt-10 grid gap-3 md:grid-cols-3">
          {[
            { l: "Avg. cycle time", v: "21 days", d: "-9 days vs. last Q", up: false },
            { l: "Forecast accuracy", v: "94.1%", d: "+12pt vs. last Q", up: true },
            { l: "Touches per close", v: "7.2", d: "AI handled 4 of them", up: true },
          ].map((m) => (
            <div
              key={m.l}
              className="crm-metric flex items-center justify-between rounded-xl border border-border/70 bg-card/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(0_0%_0%/0.3)]"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">{m.l}</p>
                <p className="mt-1 text-2xl font-medium tracking-tight">{m.v}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.d}</p>
              </div>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  m.up ? "bg-[hsl(140_70%_55%)]/15 text-[hsl(140_70%_60%)]" : "bg-ember/15 text-ember"
                }`}
              >
                {m.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CRMPipeline;
