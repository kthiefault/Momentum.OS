import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    title: "Agency Owner",
    initials: "SK",
    color: "hsl(35, 90%, 45%)",
    quote:
      "We cut our client reporting time from 8 hours to 20 minutes. Momentum.OS paid for itself in week one.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    title: "E-commerce CEO",
    initials: "MT",
    color: "hsl(200, 70%, 45%)",
    quote:
      "We automated 23 workflows in the first month. Our team finally has time to think strategically.",
    stars: 5,
  },
  {
    name: "Priya M.",
    title: "Consultant",
    initials: "PM",
    color: "hsl(280, 60%, 50%)",
    quote:
      "I went from working 60-hour weeks to 35. The AI integrations handle everything I used to do manually.",
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ember">
            Social Proof
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">
            <span className="bg-gradient-to-r from-ember to-ice bg-clip-text text-transparent">
              What operators are saying
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border/80"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-ember text-ember" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/80">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
