import SectionLabel from "./effects/SectionLabel";

const outcomes = [
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

const Outcomes = () => {
  return (
    <section id="outcomes" className="relative isolate overflow-hidden py-32 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(22 80% 50% / 0.1), transparent 60%)",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
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

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-4">
          {outcomes.map((o) => (
            <div
              key={o.label}
              className="group relative bg-background p-8 transition-colors hover:bg-card/60"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, hsl(22 95% 58%), transparent)",
                }}
              />
              <p className="font-display text-5xl text-ember sm:text-6xl">
                {o.metric}
              </p>
              <p className="mt-4 text-sm font-medium text-foreground/90">
                {o.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{o.note}</p>
            </div>
          ))}
        </div>

        <figure className="mx-auto mt-20 max-w-3xl text-center">
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
