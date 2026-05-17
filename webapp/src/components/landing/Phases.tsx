import { useEffect, useRef } from "react";
import { Brain, Sparkles, Target, Zap } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const phases = [
  {
    number: "01",
    icon: Zap,
    title: "Get Set Up in Minutes",
    subtitle: "No IT department needed.",
    description:
      "Connect the tools you already use — email, calendar, Slack, your CRM — and we pull everything into one place. Takes about 5 minutes.",
    details: [
      "Works with Gmail, Outlook, Slack, HubSpot, and more",
      "Your data stays yours — we don't sell or share it",
      "Start seeing your whole business in one dashboard",
    ],
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Learns How You Work",
    subtitle: "It gets smarter every day.",
    description:
      "Your AI reads your workflows, your deals, your emails — and starts to understand what matters to your business. The more you use it, the better it gets.",
    details: [
      "Spots patterns you'd miss in a spreadsheet",
      "Remembers every contact, meeting, and deal",
      "Learns your team's strengths and how you like to work",
    ],
  },
  {
    number: "03",
    icon: Sparkles,
    title: "The Boring Stuff Runs Itself",
    subtitle: "Stop being the bottleneck.",
    description:
      "Follow-ups go out on time. Leads get scored. Reports write themselves. The routine tasks that eat your week? They just... happen.",
    details: [
      "Automated follow-ups so nothing falls through the cracks",
      "Instant alerts when a deal needs your attention",
      "Weekly summaries delivered to your inbox",
    ],
  },
  {
    number: "04",
    icon: Target,
    title: "You Focus on What Actually Matters",
    subtitle: "More thinking, less doing.",
    description:
      "With the noise handled, you can actually run your business. Make better decisions, grow faster, and stop putting out fires.",
    details: [
      "Clear view of what's working and what's not",
      "AI suggestions for your next best move",
      "More time for strategy, clients, and growth",
    ],
  },
];

const Phases = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".phases-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power2.out",
      });

      gsap.from(".phase-item", {
        scrollTrigger: { trigger: ".phases-list", start: "top 82%", once: true },
        opacity: 0,
        y: 48,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".phase-connector", {
        scrollTrigger: { trigger: ".phases-list", start: "top 75%", once: true },
        scaleY: 0,
        transformOrigin: "top center",
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
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
    <section
      ref={sectionRef}
      id="phases"
      className="relative isolate overflow-hidden py-16 sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 0%, hsl(221 80% 45% / 0.07), transparent 60%), radial-gradient(ellipse 50% 40% at 0% 100%, hsl(221 79% 48% / 0.05), transparent 50%)",
        }}
      />

      <div className="container relative">
        <div className="phases-header mx-auto max-w-3xl text-center md:text-left">
          <SectionLabel index="03" label="How it works" tone="ember" />
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            From day one to done —{" "}
            <span className="font-display italic text-muted-foreground">
              here's exactly what happens
            </span>
          </h2>
        </div>

        <div className="phases-list mt-10 space-y-0">
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            const isLast = i === phases.length - 1;
            return (
              <div key={phase.number} className="phase-item relative">
                {/* Connector line between phases */}
                {!isLast && (
                  <div
                    className="phase-connector absolute left-[2.75rem] top-[5.5rem] hidden w-px md:block"
                    style={{
                      height: "calc(100% - 3.5rem)",
                      background:
                        "linear-gradient(to bottom, hsl(221 79% 48% / 0.3), hsl(221 79% 48% / 0.05))",
                    }}
                  />
                )}

                <div className="group flex flex-col gap-6 py-8 md:flex-row md:gap-12 md:py-10">
                  {/* Left: number + icon */}
                  <div className="flex flex-row items-start gap-4 md:flex-col md:items-center md:w-22">
                    <div className="relative flex-shrink-0">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card/60 transition-all duration-500 group-hover:border-ember/50 group-hover:bg-ember/5 group-hover:shadow-[0_0_32px_hsl(221_79%_48%/0.15)]">
                        <Icon className="h-6 w-6 text-muted-foreground transition-colors duration-300 group-hover:text-ember" />
                      </div>
                    </div>
                    <div
                      className="font-display text-[3.5rem] font-medium leading-none tracking-[-0.04em] text-border transition-colors duration-500 group-hover:text-ember/25 md:text-[2.5rem]"
                    >
                      {phase.number}
                    </div>
                  </div>

                  {/* Right: content card */}
                  <div className="flex-1">
                    <div
                      onMouseMove={handleMouseMove}
                      className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 transition-all duration-500 hover:border-ember/40 hover:bg-card/70 hover:-translate-y-1 hover:shadow-[0_16px_48px_hsl(0_0%_0%/0.4)] sm:p-8"
                    >
                      {/* Radial glow on hover */}
                      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background:
                              "radial-gradient(500px circle at var(--x, 50%) var(--y, 50%), hsl(221 79% 48% / 0.1), transparent 40%)",
                          }}
                        />
                      </div>
                      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-ember/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember/70">
                            {phase.subtitle}
                          </p>
                          <h3 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                            {phase.title}
                          </h3>
                          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                            {phase.description}
                          </p>
                        </div>
                      </div>

                      <ul className="relative mt-6 space-y-2.5">
                        {phase.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ember/60" />
                            <span className="text-sm leading-relaxed text-muted-foreground">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Phases;
