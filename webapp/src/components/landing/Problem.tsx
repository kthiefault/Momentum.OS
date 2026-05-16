import { useEffect, useRef } from "react";
import { AlertTriangle, Clock, Inbox, Layers, Network, Receipt } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chaos = [
  { icon: Inbox, title: "Leads falling through", line: "Contacts live in three different places and nobody's following up." },
  { icon: Clock, title: "Hours wasted on low-value work", line: "You're spending your week on $20/hour tasks instead of $200/hour ones." },
  { icon: Network, title: "Too many tabs open", line: "Email, Slack, your CRM, your spreadsheet — and none of them talk to each other." },
  { icon: Receipt, title: "No idea what's coming in", line: "Your revenue forecast is basically a guess. You find out too late when things go wrong." },
  { icon: Layers, title: "Things fall through the cracks", line: "Sales passes to ops, ops passes to finance — and something always gets lost in the handoff." },
  { icon: AlertTriangle, title: "Everything depends on you", line: "If you're not pushing it, it doesn't happen. You're the bottleneck in your own business." },
];

const Problem = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".problem-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        opacity: 0, y: 40, duration: 0.9, ease: "power2.out",
      });
      gsap.from(".problem-card", {
        scrollTrigger: { trigger: ".problem-grid", start: "top 82%", once: true },
        opacity: 0, y: 32, stagger: 0.07, duration: 0.75, ease: "power2.out",
      });
      gsap.from(".problem-footer", {
        scrollTrigger: { trigger: ".problem-footer", start: "top 90%", once: true },
        opacity: 0, y: 20, duration: 0.7, ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <section ref={sectionRef} id="problem" className="relative isolate overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 100% 0%, hsl(0 80% 40% / 0.08), transparent 60%)",
        }}
      />

      <div className="container relative">
        <div className="problem-header mx-auto max-w-3xl">
          <SectionLabel index="01" label="The problem" tone="ember" />
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            Running a business feels like this:
          </h2>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            You didn't start this to become an admin. But here you are, buried
            in tasks that someone — or something — else should be doing.
          </p>
        </div>

        <div className="problem-grid mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chaos.map((c, i) => (
            <div
              key={c.title}
              onMouseMove={handleCardMouseMove}
              className="problem-card group relative overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 transition-all duration-500 hover:border-ember/40 hover:bg-card/70 hover:-translate-y-1 hover:shadow-[0_16px_48px_hsl(0_0%_0%/0.4)]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), hsl(22 95% 58% / 0.12), transparent 40%)",
                  }}
                />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 transition-all duration-300 group-hover:border-ember/30 group-hover:bg-ember/5">
                  <c.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-ember" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  ERR · 0{i + 1}
                </span>
              </div>
              <h3 className="relative mt-6 text-lg font-medium tracking-tight">{c.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{c.line}</p>
            </div>
          ))}
        </div>

        <div className="problem-footer mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 md:flex-row md:items-center">
          <p className="font-display text-3xl italic text-ember">
            That's what Momentum was built to fix.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problem;
