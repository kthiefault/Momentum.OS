import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "41+", label: "hrs/week saved", suffix: " per business" },
  { value: "500+", label: "businesses automated", suffix: "" },
  { value: "30-day", label: "ROI guarantee", suffix: "" },
];

export function StatsBar() {
  return (
    <section className="border-y border-zinc-800 bg-zinc-900/50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
                {stat.value}
              </span>
              <p className="text-base font-semibold text-white">{stat.label}</p>
              {stat.suffix && (
                <p className="text-xs text-zinc-500">{stat.suffix}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
