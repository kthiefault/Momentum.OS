import React from "react";
import { motion } from "framer-motion";
import { LeadForm } from "./LeadForm";
import { Zap } from "lucide-react";

export function BottomCTA() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-8 sm:p-12"
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-amber-500/8 blur-[80px]" />
          </div>

          <div className="relative text-center mb-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500">
                <Zap className="h-6 w-6 fill-black text-black" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to reclaim your time?
            </h2>
            <p className="mt-3 text-zinc-400">
              Join 500+ operators who've already automated their way to scale.
            </p>
          </div>

          <div className="relative">
            <LeadForm compact />
          </div>

          {/* Bottom trust line */}
          <p className="relative mt-6 text-center text-xs text-zinc-600">
            Free demo · No commitment · Results in 30 days or your money back
          </p>
        </motion.div>
      </div>
    </section>
  );
}
