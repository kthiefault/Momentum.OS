import { useEffect, useRef, useState } from "react";
import { Bot, BrainCircuit, FileText, Mic, Sparkles, User } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const conversation = [
  {
    who: "user",
    text: "What's at risk this week and what should I do about it?",
  },
  {
    who: "ai",
    text: "Three things. Northwind hasn't responded in 8 days — engagement dropping. Helix renewal in 14 days, no champion identified. Vesta flagged $42K invoice unsent. I drafted actions for each.",
  },
  {
    who: "user",
    text: "Send the Northwind nudge and queue the Helix exec brief for my review.",
  },
  {
    who: "ai",
    text: "Done. Nudge sent through Atlas. Brief queued — I pulled their last QBR, the open tickets, and three recent product wins relevant to their roadmap.",
  },
];

const AIAssistant = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showTyping, setShowTyping] = useState<boolean>(false);
  const triggered = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisibleMessages(conversation.length);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".ai-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        opacity: 0, y: 36, duration: 0.9, ease: "power2.out",
      });
      gsap.from(".ai-panel", {
        scrollTrigger: {
          trigger: ".ai-panel",
          start: "top 80%",
          once: true,
          onEnter: () => {
            if (triggered.current) return;
            triggered.current = true;

            // Reveal messages with typing indicator between AI responses
            let delay = 200;
            conversation.forEach((msg, i) => {
              if (msg.who === "ai" && i > 0) {
                // Show typing indicator before AI message
                setTimeout(() => setShowTyping(true), delay);
                delay += 700;
                setTimeout(() => {
                  setShowTyping(false);
                  setVisibleMessages(i + 1);
                }, delay);
              } else {
                setTimeout(() => setVisibleMessages(i + 1), delay);
              }
              delay += msg.who === "ai" ? 400 : 300;
            });
          },
        },
        opacity: 0, y: 36, duration: 0.8, ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="ai" className="relative isolate overflow-hidden py-16 sm:py-20">
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
          {/* Panel */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <div className="ai-panel glass relative overflow-hidden rounded-2xl">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-md border border-ember/40 bg-ember/10">
                    <Sparkles className="h-3.5 w-3.5 text-ember" />
                    <span className="absolute inset-0 animate-pulse rounded-md ring-1 ring-ember/40" style={{ animationDuration: "3s" }} />
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
                {conversation.slice(0, visibleMessages).map((m, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 animate-[message-in_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md border ${
                        m.who === "user" ? "border-border bg-card" : "border-ember/40 bg-ember/10"
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

                {/* Typing indicator */}
                {showTyping ? (
                  <div className="flex items-start gap-3 animate-[message-in_0.3s_ease_forwards]">
                    <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md border border-ember/40 bg-ember/10">
                      <Bot className="h-3.5 w-3.5 text-ember" />
                    </div>
                    <div className="rounded-2xl border border-ember/20 bg-ember/[0.06] px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-1.5 w-1.5 rounded-full bg-ember/70 animate-bounce"
                            style={{ animationDelay: `${d * 150}ms`, animationDuration: "0.8s" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Suggested actions */}
                {visibleMessages >= conversation.length ? (
                  <div className="ml-10 mt-3 flex flex-wrap gap-2 animate-[message-in_0.4s_ease_forwards]">
                    {[
                      { icon: FileText, label: "Open Helix brief" },
                      { icon: BrainCircuit, label: "Show reasoning" },
                      { icon: Mic, label: "Voice mode" },
                    ].map((s) => (
                      <button
                        key={s.label}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-foreground/80 transition-all duration-300 hover:border-ember/40 hover:text-foreground hover:-translate-y-0.5"
                      >
                        <s.icon className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-ember" />
                        {s.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Input */}
              <div className="border-t border-border/60 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 transition-all duration-300 focus-within:border-ember/40 focus-within:shadow-[0_0_0_3px_hsl(22_95%_58%/0.1)]">
                  <Sparkles className="h-3.5 w-3.5 text-ember" />
                  <span className="flex-1 text-sm text-muted-foreground">
                    Ask Momentum anything about your business...
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">⌘ ↵</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="ai-header order-1 lg:order-2 lg:col-span-5">
            <SectionLabel index="05" label="AI assistant" tone="ember" />
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
              An operator{" "}
              <span className="font-display italic text-ember">with infinite hours.</span>
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
                <div
                  key={x.t}
                  className="border-l border-border pl-4 transition-all duration-300 hover:border-ember/60 hover:pl-5"
                >
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
