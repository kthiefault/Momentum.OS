import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    emoji: "🗺️",
    title: "Custom Automation Roadmap",
    desc: "A personalized map of where you're losing time and money",
  },
  {
    emoji: "⚡",
    title: "Live Workflow Demo",
    desc: "See your exact use case automated in real-time",
  },
  {
    emoji: "🤖",
    title: "AI Integration Audit",
    desc: "Discover which AI tools will move the needle for you",
  },
  {
    emoji: "📈",
    title: "ROI Projection",
    desc: "Get a concrete estimate of hours saved and revenue unlocked",
  },
];

export function WhatYouGetSection() {
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
            What's included
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Your free demo includes:
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-amber-500/30 hover:bg-zinc-900/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-2xl transition-colors group-hover:border-amber-500/30 group-hover:bg-amber-500/10">
                {f.emoji}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
