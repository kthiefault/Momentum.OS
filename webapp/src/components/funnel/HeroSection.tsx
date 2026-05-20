import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { LeadForm } from "./LeadForm";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

const trustBadges = [
  "No contracts",
  "Setup in 48 hours",
  "ROI in 30 days",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-ember/5 blur-[120px]" />
        <div className="absolute -bottom-20 right-0 h-[400px] w-[500px] rounded-full bg-ice/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left column — copy */}
          <div className="flex flex-col gap-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/20 bg-ember/10 px-3 py-1 text-xs font-medium text-ember">
                <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
                Trusted by 500+ operators
              </span>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="space-y-3"
            >
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Stop Wasting{" "}
                <span className="bg-gradient-to-r from-ember to-ice bg-clip-text text-transparent">
                  41+ Hours
                </span>{" "}
                a Week on Manual Work
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Momentum.OS automates your workflows, eliminates busywork, and integrates AI into
                every corner of your business — so you can scale without burning out.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-ember/20">
                    <Check className="h-3 w-3 text-ember" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-foreground/80">{badge}</span>
                </div>
              ))}
            </motion.div>

            {/* Social proof avatars */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="hidden items-center gap-3 lg:flex"
            >
              <div className="flex -space-x-2">
                {["SL", "MT", "PK", "JR", "AW"].map((initials, i) => (
                  <div
                    key={initials}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold"
                    style={{
                      background: `hsl(${221 + i * 10}, 79%, ${40 + i * 4}%)`,
                      color: "white",
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">500+</span> businesses automated this month
              </p>
            </motion.div>
          </div>

          {/* Right column — form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            <LeadForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
