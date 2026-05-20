import { useEffect, useRef } from "react";
import { Bot, GitBranch, LineChart, Workflow } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Workflow,
    badge: "Automations",
    title: "Your processes, on rails",
    body: "Every recurring task — welcome emails, follow-ups, check-ins — runs automatically. Set it up once and forget it.",
  },
  {
    icon: Bot,
    badge: "AI Assistants",
    title: "Help that actually helps",
    body: "AI trained on your business handles emails, writes summaries, and flags what needs your attention. No prompts needed.",
  },
  {
    icon: GitBranch,
    badge: "Smart CRM",
    title: "Never lose a lead again",
    body: "Contacts are automatically enriched, deals are scored, and you always know who to call next. No manual updates.",
  },
  {
    icon: LineChart,
    badge: "Live Dashboard",
    title: "Your whole business in one view",
    body: "See your pipeline, revenue, and team activity in real time. Drill into any number to understand exactly what's driving it.",
  },
];

const Solution = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".solution-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", once: true },
        opacity: 0, y: 40, duration: 0.9, ease: "power2.out",
      });
      gsap.from(".solution-card", {
        scrollTrigger: { trigger: ".solution-grid", start: "top 90%", once: true },
        y: 30, stagger: 0.1, duration: 0.75, ease: "power2.out",
      });
      gsap.from(".solution-tags span", {
        scrollTrigger: { trigger: ".solution-tags", start: "top bottom", once: true },
        opacity: 0, y: 12, scale: 0.9, stagger: 0.06, duration: 0.5, ease: "back.out(2)",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <section ref={sectionRef} id="solution" className="relative isolate overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 0% 0%, hsl(221 80% 45% / 0.12), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 100%, hsl(192 80% 60% / 0.08), transparent 55%)",
        }}
      />

      <div className="container relative">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="solution-header md:col-span-5">
            <SectionLabel index="02" label="The system" tone="ember" />
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
              One app. Everything handled.
            </h2>
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
              Momentum plugs into your business and quietly takes care of the
              parts that shouldn't need you. Here's what's under the hood.
            </p>

            <div className="solution-tags mt-8 flex flex-wrap gap-2">
              {["Automations", "AI Help", "CRM", "Dashboard"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 hover:border-ember/40 hover:text-ember"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="solution-grid grid gap-3 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <div
                  key={p.title}
                  onMouseMove={handleMouseMove}
                  className="solution-card group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-ember/50 hover:-translate-y-1 hover:shadow-[0_16px_48px_hsl(0_0%_0%/0.4)]"
                  style={{ minHeight: 220 }}
                >
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          "radial-gradient(360px circle at var(--x, 50%) var(--y, 50%), hsl(221 79% 48% / 0.1), transparent 40%)",
                      }}
                    />
                  </div>
                  <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-ember/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                      0{i + 1} · {p.badge}
                    </span>
                    <p.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-ember" />
                  </div>
                  <h3 className="relative mt-6 text-lg font-medium tracking-tight">{p.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
