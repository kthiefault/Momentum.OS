import { Bot, BrainCircuit, FileText, Mic, Sparkles, User } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";

const conversation = [
  {
    who: "user",
    text:
      "What's at risk this week and what should I do about it?",
  },
  {
    who: "ai",
    text:
      "Three things. Northwind hasn't responded in 8 days — engagement dropping. Helix renewal in 14 days, no champion identified. Vesta flagged $42K invoice unsent. I drafted actions for each.",
  },
  {
    who: "user",
    text:
      "Send the Northwind nudge and queue the Helix exec brief for my review.",
  },
  {
    who: "ai",
    text:
      "Done. Nudge sent through Atlas. Brief queued — I pulled their last QBR, the open tickets, and three recent product wins relevant to their roadmap.",
  },
];

const AIAssistant = () => {
  return (
    <section id="ai" className="relative isolate overflow-hidden py-32 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 0% 50%, hsl(192 90% 70% / 0.1), transparent 55%)",
        }}
      />

      <div className="container relative">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <div className="glass relative overflow-hidden rounded-2xl">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-md border border-ember/40 bg-ember/10">
                    <Sparkles className="h-3.5 w-3.5 text-ember" />
                    <span className="absolute inset-0 animate-pulse-glow rounded-md ring-1 ring-ember/40" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Momentum AI</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      thinking · grounded in your CRM + ops data
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  context · 14 tools
                </span>
              </div>

              {/* Conversation */}
              <div className="space-y-3 p-4 lg:p-6">
                {conversation.map((m, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${
                      m.who === "user" ? "" : ""
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md border ${
                        m.who === "user"
                          ? "border-border bg-card"
                          : "border-ember/40 bg-ember/10"
                      }`}
                    >
                      {m.who === "user" ? (
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-ember" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.who === "user"
                          ? "border border-border bg-card/60 text-foreground/85"
                          : "border border-ember/20 bg-ember/[0.06] text-foreground"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {/* Suggested actions */}
                <div className="ml-10 mt-3 flex flex-wrap gap-2">
                  {[
                    { icon: FileText, label: "Open Helix brief" },
                    { icon: BrainCircuit, label: "Show reasoning" },
                    { icon: Mic, label: "Voice mode" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-foreground/80 transition-all hover:border-ember/40 hover:text-foreground"
                    >
                      <s.icon className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-ember" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-border/60 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
                  <Sparkles className="h-3.5 w-3.5 text-ember" />
                  <span className="flex-1 text-sm text-muted-foreground">
                    Ask Momentum anything about your business...
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    ⌘ ↵
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <SectionLabel index="05" label="AI assistant" tone="ember" />
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
              An operator{" "}
              <span className="font-display italic text-ember">
                with infinite hours.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
              Momentum AI is grounded in your live data and constrained by
              your policies. It reasons, drafts, executes, and reports — with
              every action logged and reversible.
            </p>

            <dl className="mt-8 space-y-5">
              {[
                {
                  t: "Grounded in your stack",
                  b: "Direct access to CRM, calendar, billing, and docs. No copy-paste, no hallucination.",
                },
                {
                  t: "Bounded autonomy",
                  b: "Set rails per action — auto-execute, draft-and-approve, or read-only. You stay in command.",
                },
                {
                  t: "Replayable reasoning",
                  b: "Every decision shows the data it touched and the steps it took. Audit any action in one click.",
                },
              ].map((x) => (
                <div key={x.t} className="border-l border-border pl-4">
                  <dt className="text-sm font-medium">{x.t}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{x.b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistant;
