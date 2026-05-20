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
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12"
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-ember/8 blur-[80px]" />
          </div>

          <div className="relative text-center mb-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember">
                <Zap className="h-6 w-6 fill-white text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              <span className="bg-gradient-to-r from-ember to-ice bg-clip-text text-transparent">
                Ready to reclaim your time?
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join 500+ operators who've already automated their way to scale.
            </p>
          </div>

          <div className="relative">
            <LeadForm compact />
          </div>

          {/* Bottom trust line */}
          <p className="relative mt-6 text-center text-xs text-muted-foreground/60">
            Free demo · No commitment · Results in 30 days or your money back
          </p>
        </motion.div>
      </div>
    </section>
  );
}
