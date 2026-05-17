import { useRef } from "react";
import SectionLabel from "./effects/SectionLabel";
import { useCountUp } from "@/hooks/use-count-up";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const rawOutcomes = [
  { metric: "41h", label: "reclaimed per operator, per week", note: "boring work, automated" },
  { metric: "2.4×", label: "lift in pipeline velocity", note: "AI-prioritized next actions" },
  { metric: "94%", label: "forecast accuracy at quarter-end", note: "vs. ~62% pre-Momentum" },
  { metric: "$0", label: "context lost between handoffs", note: "single source of truth" },
];

const quote = {
  body: "Within ten weeks we replaced four tools, a part-time CRM admin, and most of our weekly ops review. Our team stopped reacting and started compounding.",
  who: "Lana Suzuki",
  role: "COO, Atlas Group",
};

function OutcomeMetric({ metric, label, note }: { metric: string; label: string; note: string }) {
  const { display, ref } = useCountUp(metric, 1600);

  return (
    <div className="group relative bg-background p-8 transition-colors hover:bg-card/60">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, transparent, hsl(221 79% 48%), transparent)" }}
      />
      <p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        className="font-display text-5xl text-ember sm:text-6xl"
      >
        {display}
      </p>
      <p className="mt-4 text-sm font-medium text-foreground/90">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

const Outcomes = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".outcomes-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        opacity: 0, y: 40, duration: 0.9, ease: "power2.out",
      });
      gsap.from(".outcomes-grid", {
        scrollTrigger: { trigger: ".outcomes-grid", start: "top 82%", once: true },
        opacity: 0, y: 30, duration: 0.8, ease: "power2.out",
      });
      gsap.from(".outcomes-quote", {
        scrollTrigger: { trigger: ".outcomes-quote", start: "top 86%", once: true },
        opacity: 0, y: 30, duration: 0.9, ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="outcomes" className="relative isolate overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(221 80% 50% / 0.1), transparent 60%)",
        }}
      />

      <div className="container relative">
        <div className="outcomes-header mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SectionLabel index="07" label="The transformation" tone="ember" />
          </div>
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            From{" "}
            <span className="font-display italic text-muted-foreground">chaos</span>{" "}
            to{" "}
            <span className="font-display italic text-ember">compounding.</span>
          </h2>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            What operators see in their first ninety days.
          </p>
        </div>

        <div className="outcomes-grid mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-4">
          {rawOutcomes.map((o) => (
            <OutcomeMetric key={o.metric} {...o} />
          ))}
        </div>

        <figure className="outcomes-quote mx-auto mt-12 max-w-3xl text-center">
          <blockquote className="text-balance font-display text-2xl italic leading-snug text-foreground/95 sm:text-3xl md:text-4xl">
            &ldquo;{quote.body}&rdquo;
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-3 text-sm">
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-ember to-ember-deep" />
            <span className="font-medium">{quote.who}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{quote.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Outcomes;
