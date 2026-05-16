import { AlertTriangle, Clock, Inbox, Layers, Network, Receipt } from "lucide-react";
import SectionLabel from "./effects/SectionLabel";
import { motion } from "framer-motion";

const chaos = [
  { icon: Inbox, title: "Leads falling through", line: "Contacts live in three different places and nobody's following up." },
  { icon: Clock, title: "Hours wasted on low-value work", line: "You're spending your week on $20/hour tasks instead of $200/hour ones." },
  { icon: Network, title: "Too many tabs open", line: "Email, Slack, your CRM, your spreadsheet — and none of them talk to each other." },
  { icon: Receipt, title: "No idea what's coming in", line: "Your revenue forecast is basically a guess. You find out too late when things go wrong." },
  { icon: Layers, title: "Things fall through the cracks", line: "Sales passes to ops, ops passes to finance — and something always gets lost in the handoff." },
  { icon: AlertTriangle, title: "Everything depends on you", line: "If you're not pushing it, it doesn't happen. You're the bottleneck in your own business." },
];

const Problem = () => {
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <section id="problem" className="relative isolate overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 100% 0%, hsl(0 80% 40% / 0.08), transparent 60%)",
        }}
      />

      <div className="container relative">
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SectionLabel index="01" label="The problem" tone="ember" />
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            Running a business feels like this:
          </h2>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            You didn't start this to become an admin. But here you are, buried
            in tasks that someone — or something — else should be doing.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chaos.map((c, i) => (
            <motion.div
              key={c.title}
              onMouseMove={handleCardMouseMove}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 transition-all duration-500 hover:border-ember/40 hover:bg-card/70 hover:-translate-y-1 hover:shadow-[0_16px_48px_hsl(0_0%_0%/0.4)]"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.07 }}
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
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 md:flex-row md:items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="font-display text-3xl italic text-ember">
            That's what Momentum was built to fix.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;
