import { AlertTriangle, Clock, Inbox, Layers, Network, Receipt } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";

const chaos = [
  {
    icon: Inbox,
    title: "Lead chaos",
    line: "Spreadsheets, sticky notes, and a CRM no one updates.",
  },
  {
    icon: Clock,
    title: "Time hemorrhage",
    line: "Operators trapped doing $40/hour tasks all week.",
  },
  {
    icon: Network,
    title: "Disconnected tools",
    line: "Twelve tabs, zero source of truth, infinite context-switching.",
  },
  {
    icon: Receipt,
    title: "Invisible cashflow",
    line: "Pipeline gut-feel. No forecast. No early-warning signals.",
  },
  {
    icon: Layers,
    title: "Manual handoffs",
    line: "Sales → ops → finance. Every transition leaks revenue.",
  },
  {
    icon: AlertTriangle,
    title: "Founder bottleneck",
    line: "Nothing happens unless you personally push it through.",
  },
];

const Problem = () => {
  return (
    <section id="problem" className="relative isolate overflow-hidden py-32 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 100% 0%, hsl(0 80% 40% / 0.08), transparent 60%)",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl">
          <SectionLabel index="01" label="The problem" tone="ember" />
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            Running a business today feels like{" "}
            <span className="font-display italic text-muted-foreground">
              orchestrating a fire
            </span>{" "}
            with wet matches.
          </h2>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            You didn't start your company to drown in ops. But every operator
            we meet is running the same six fires at the same time.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chaos.map((c, i) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 transition-all duration-500 hover:border-ember/40 hover:bg-card/70"
              style={{
                animationDelay: `${i * 70}ms`,
              }}
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
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60">
                  <c.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-ember" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  ERR · 0{i + 1}
                </span>
              </div>
              <h3 className="relative mt-6 text-lg font-medium tracking-tight">
                {c.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.line}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 md:flex-row md:items-center">
          <p className="max-w-xl text-sm text-muted-foreground">
            The cost isn't your tools. The cost is the friction between them —
            the thousand invisible handoffs where momentum dies.
          </p>
          <p className="font-display text-3xl italic text-ember">
            That's what we built Momentum.OS to fix.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problem;
