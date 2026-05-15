import { Bot, GitBranch, LineChart, Workflow } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";

const pillars = [
  {
    icon: Workflow,
    badge: "Workflows",
    title: "Composable execution graphs",
    body:
      "Every recurring process — onboarding, follow-up, renewal — becomes a versioned, observable workflow. No more tribal knowledge.",
  },
  {
    icon: Bot,
    badge: "AI agents",
    title: "Specialist agents on rails",
    body:
      "Drop-in copilots for sales, ops, and advisory. Trained on your data, constrained by your rules, accountable to your KPIs.",
  },
  {
    icon: GitBranch,
    badge: "CRM intelligence",
    title: "A pipeline that thinks",
    body:
      "Auto-enrichment, deal scoring, and prescriptive next-actions baked into the core. Forecast like a CFO without one.",
  },
  {
    icon: LineChart,
    badge: "Signal layer",
    title: "Real-time business OS",
    body:
      "A single canvas for cashflow, capacity, and conversion. Drill from KPI to the workflow that moved it in two clicks.",
  },
];

const Solution = () => {
  return (
    <section id="solution" className="relative isolate overflow-hidden py-32 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 0% 0%, hsl(22 80% 45% / 0.12), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 100%, hsl(192 80% 60% / 0.08), transparent 55%)",
        }}
      />

      <div className="container relative">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel index="02" label="The system" tone="ember" />
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
              The{" "}
              <span className="font-display italic text-ember">operating system</span>{" "}
              for operators.
            </h2>
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
              One canvas. Four primitives. Infinite leverage. Momentum.OS
              installs an execution layer on top of your business — so the
              boring parts run themselves and you get back to deciding.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Workflows", "Agents", "CRM", "Signals"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="grid gap-3 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <div
                  key={p.title}
                  className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 transition-all duration-500 hover:border-ember/50 hover:bg-card/70"
                  style={{ minHeight: 220 }}
                >
                  <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-ember/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                      0{i + 1} · {p.badge}
                    </span>
                    <p.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-ember" />
                  </div>
                  <h3 className="relative mt-6 text-lg font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
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
