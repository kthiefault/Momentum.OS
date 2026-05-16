import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Cog, Mail, Send, Webhook, Zap } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const nodes = [
  { icon: Mail, label: "Inbound lead", tone: "ice" },
  { icon: Cog, label: "Enrich + score", tone: "ember" },
  { icon: Webhook, label: "Route", tone: "ember" },
  { icon: Send, label: "Draft outreach", tone: "ember" },
  { icon: CheckCircle2, label: "Booked", tone: "ice" },
] as const;

const logLines = [
  { tag: "trigger", line: "lead.created · source=website", color: "text-ice" },
  { tag: "step.1", line: "enriched company → Atlas Group (Series B)", color: "text-foreground/80" },
  { tag: "step.2", line: "scored ICP fit · 92/100 · routed → Atlas (Sales)", color: "text-foreground/80" },
  { tag: "step.3", line: "drafted outreach · approved by lana@", color: "text-foreground/80" },
  { tag: "step.4", line: "meeting booked · Thu 10:00 PT ✓", color: "text-ember" },
];

const AutomationEngine = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeNode, setActiveNode] = useState<number>(-1);
  const [visibleLogs, setVisibleLogs] = useState<number>(0);
  const triggered = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setActiveNode(nodes.length - 1);
      setVisibleLogs(logLines.length);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".automation-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        opacity: 0, y: 40, duration: 0.9, ease: "power2.out",
      });
      gsap.from(".automation-panel", {
        scrollTrigger: {
          trigger: ".automation-panel",
          start: "top 80%",
          once: true,
          onEnter: () => {
            if (triggered.current) return;
            triggered.current = true;
            // Animate nodes one by one
            nodes.forEach((_, i) => {
              setTimeout(() => setActiveNode(i), i * 250);
            });
            // Animate log lines after nodes
            logLines.forEach((_, i) => {
              setTimeout(() => setVisibleLogs(i + 1), 900 + i * 180);
            });
          },
        },
        opacity: 0, y: 36, duration: 0.8, ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="automation" className="relative isolate overflow-hidden py-32 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 mask-radial bg-grid opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 100% 50%, hsl(22 95% 58% / 0.1), transparent 60%)",
        }}
      />

      <div className="container relative">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="automation-header lg:col-span-5">
            <SectionLabel index="04" label="Automation engine" tone="ember" />
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
              The boring work,{" "}
              <span className="font-display italic text-ember">on rails.</span>
            </h2>
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
              Compose multi-step workflows visually. Trigger on signals from
              email, CRM, calendar, billing, or any tool you already use.
              Observability and rollback built in — like git for your ops.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Drag-and-drop graph editor with type-safe branches",
                "Replay any execution from any step",
                "Approve-before-send gates for high-risk actions",
                "Versioned workflows with diff & rollback",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-1 flex h-4 w-4 flex-none items-center justify-center rounded-full border border-ember/40 bg-ember/10">
                    <Zap className="h-2.5 w-2.5 text-ember" />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <a
              href="#"
              className="group mt-10 inline-flex items-center gap-1.5 text-sm text-ember transition-colors hover:text-foreground"
            >
              See the workflow library
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="automation-panel glass relative overflow-hidden rounded-2xl p-6 lg:p-8">
              <div className="flex items-center justify-between pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  workflow / inbound-to-meeting · v4.2
                </span>
                <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] text-[hsl(140_70%_60%)]">
                  running
                </span>
              </div>

              {/* Node graph */}
              <div className="relative grid gap-3 sm:grid-cols-5">
                {nodes.map((n, i) => {
                  const isEmber = n.tone === "ember";
                  const isActive = activeNode >= i;
                  return (
                    <div key={n.label} className="relative">
                      <div
                        className={`group relative flex flex-col items-center gap-2 rounded-xl border bg-background/60 p-3 transition-all duration-500 ${
                          isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        } ${
                          isEmber
                            ? isActive ? "border-ember/60 shadow-[0_0_20px_hsl(22_95%_58%/0.2)]" : "border-ember/40"
                            : isActive ? "border-ice/60 shadow-[0_0_20px_hsl(192_90%_70%/0.2)]" : "border-ice/40"
                        }`}
                        style={{ transitionDelay: "0ms" }}
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
                            isEmber ? "bg-ember/10 text-ember" : "bg-ice/10 text-ice"
                          } ${isActive ? "scale-110" : "scale-100"}`}
                        >
                          <n.icon className="h-4 w-4" />
                        </div>
                        <span className="text-center text-[11px] leading-tight text-foreground/85">
                          {n.label}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground">step.{i + 1}</span>
                      </div>
                      {i < nodes.length - 1 ? (
                        <div className="absolute right-0 top-1/2 hidden h-px w-3 -translate-y-1/2 translate-x-full overflow-hidden sm:block">
                          <div
                            className="h-full w-full origin-left transition-transform duration-300 ember-line"
                            style={{
                              transform: activeNode >= i ? "scaleX(1)" : "scaleX(0)",
                              transitionDelay: "150ms",
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Run log */}
              <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-3">
                <p className="px-1 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  Last run · 11:42:08 UTC
                </p>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {logLines.map((r, i) => (
                    <div
                      key={r.tag}
                      className={`flex items-start gap-3 transition-all duration-300 ${
                        visibleLogs > i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
                      }`}
                    >
                      <span className="w-14 flex-none text-muted-foreground/60">{r.tag}</span>
                      <span className={r.color}>{r.line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics ribbon */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: "1,284", l: "Runs / 30d" },
                  { v: "99.94%", l: "Success rate" },
                  { v: "8.2s", l: "p95 latency" },
                ].map((m) => (
                  <div
                    key={m.l}
                    className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_hsl(0_0%_0%/0.3)]"
                  >
                    <p className="text-base font-medium">{m.v}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">{m.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationEngine;
