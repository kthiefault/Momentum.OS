import { useEffect, useRef } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import AmbientOrbs from "./effects/AmbientOrbs";
import GridBackdrop from "./effects/GridBackdrop";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      // Background layers drift upward slower than scroll → depth
      gsap.to(bgRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
        y: -140,
        ease: "none",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <GridBackdrop />
        <AmbientOrbs />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 100%, hsl(230 20% 4% / 0.9), transparent 60%)",
        }}
      />

      <div className="container relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <div
            className="reveal-up mb-7 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 backdrop-blur"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_2px_hsl(22_95%_58%/0.8)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Now in early access
            </span>
          </div>

          <h1
            className="reveal-up text-balance text-[44px] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[88px]"
            style={{ animationDelay: "0.15s" }}
          >
            Your business,{" "}
            <span className="font-display italic text-ember">on autopilot.</span>
          </h1>

          <p
            className="reveal-up mx-auto mt-7 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "0.3s" }}
          >
            Stop drowning in tasks. Momentum connects your tools, automates the
            routine work, and keeps you focused on what actually moves the needle.
          </p>

          <div
            className="reveal-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.45s" }}
          >
            <a
              href="#cta"
              data-magnetic
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_8px_32px_hsl(22_95%_58%/0.3)]"
              style={{ willChange: "transform" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-ember/0 via-ember/25 to-ember/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <Sparkles className="relative h-4 w-4" />
              <span className="relative">Start for free</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#preview"
              className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/40 px-5 py-3 text-sm text-foreground backdrop-blur transition-all duration-300 hover:bg-card/80 hover:shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
                <Play className="h-3 w-3 fill-foreground text-foreground" />
              </span>
              See how it works
              <span className="text-muted-foreground">2:14</span>
            </a>
          </div>

          <div
            className="reveal-up mt-16 flex flex-col items-center gap-4"
            style={{ animationDelay: "0.7s" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
              Trusted by operators building at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-muted-foreground/70">
              {["NORTHWIND", "Helix Capital", "Atlas Group", "Beacon Labs", "Vector & Co.", "Sequoia Ops"].map(
                (name) => (
                  <span
                    key={name}
                    className="text-sm font-medium tracking-wider transition-colors hover:text-foreground"
                  >
                    {name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-end justify-between px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 md:px-12">
        <span>System status — operational</span>
        <span className="hidden sm:inline">Scroll ↓ to explore</span>
        <span>Lat 37.7°N · Lon 122.4°W</span>
      </div>
    </section>
  );
};

export default Hero;
