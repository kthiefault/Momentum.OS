import { ArrowRight, Check } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";

type Plan = {
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  cta: string;
  features: string[];
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Operator",
    tagline: "For solo founders & advisors getting out of the weeds.",
    price: "$98",
    cadence: "/ seat / month",
    cta: "Start free trial",
    features: [
      "Up to 5 active workflows",
      "1 AI agent · Sales OR Ops",
      "CRM + pipeline scoring",
      "Email & calendar automations",
      "Community support",
    ],
  },
  {
    name: "Studio",
    tagline: "For 2–15 person teams running real revenue.",
    price: "$340",
    cadence: "/ seat / month",
    cta: "Talk to sales",
    highlight: true,
    features: [
      "Unlimited workflows + versioning",
      "3 AI agents · Sales · Ops · Finance",
      "Custom CRM objects & scoring models",
      "Approval gates & audit log",
      "Dedicated implementation engineer",
    ],
  },
  {
    name: "Atlas",
    tagline: "For advisory firms & operator collectives.",
    price: "Custom",
    cadence: "annual contract",
    cta: "Request access",
    features: [
      "Everything in Studio",
      "Unlimited agents · custom-trained",
      "Multi-org & client-of-client workspaces",
      "On-prem data residency option",
      "24/7 white-glove support",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="relative isolate overflow-hidden py-32 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mask-radial bg-grid opacity-40"
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SectionLabel index="08" label="Pricing" tone="ember" />
          </div>
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            Priced like{" "}
            <span className="font-display italic text-ember">an operator,</span>{" "}
            not a SaaS tax.
          </h2>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            Three tiers. Start small. Expand as Momentum compounds.
          </p>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`group relative flex flex-col rounded-2xl border p-8 transition-all duration-500 ${
                p.highlight
                  ? "border-ember/40 bg-gradient-to-b from-ember/[0.08] to-card/60 ring-1 ring-ember/20 hover:ring-ember"
                  : "border-border/70 bg-card/40 hover:border-foreground/30 hover:bg-card/70"
              }`}
            >
              {p.highlight ? (
                <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-background px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
                  <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_6px_hsl(22_95%_58%)]" />
                  Most loved
                </span>
              ) : null}

              <div>
                <h3 className="text-xl font-medium tracking-tight">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.tagline}
                </p>
              </div>

              <div className="mt-8 flex items-baseline gap-1.5">
                <span className="font-display text-5xl leading-none">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.cadence}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full ${
                        p.highlight ? "bg-ember/20 text-ember" : "bg-secondary text-foreground"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`mt-10 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  p.highlight
                    ? "bg-foreground text-background hover:scale-[1.02]"
                    : "border border-border bg-background/60 text-foreground hover:bg-secondary"
                }`}
              >
                {p.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          All plans include unlimited integrations, SSO, and our standard SLAs.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
