import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import AmbientOrbs from "./effects/AmbientOrbs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FinalCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".cta-content > *", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        opacity: 0, y: 40, stagger: 0.12, duration: 1, ease: "power3.out",
      });
      gsap.from(".cta-ticker", {
        scrollTrigger: { trigger: ".cta-ticker", start: "top 95%", once: true },
        opacity: 0, duration: 1, ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative isolate overflow-hidden py-16 sm:py-24"
    >
      <AmbientOrbs />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, hsl(22 95% 58% / 0.18), transparent 60%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 mask-radial bg-grid opacity-50" />

      <div className="container relative">
        <div className="cta-content mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            09 · Begin
          </p>

          <h2 className="mt-6 text-balance text-5xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[96px]">
            Turn chaos into{" "}
            <span className="font-display italic text-ember">compounding systems.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-base text-muted-foreground sm:text-lg">
            Momentum.OS is currently onboarding a small cohort of operators
            each month. Tell us about your business — we'll send you a
            personalized walkthrough within 48 hours.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-10 flex max-w-md flex-col items-stretch gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@yourcompany.com"
              className="flex-1 rounded-full border border-border bg-card/60 px-5 py-3 text-sm outline-none ring-0 placeholder:text-muted-foreground/70 transition-all duration-300 focus:border-ember/60 focus:ring-2 focus:ring-ember/20 focus:shadow-[0_0_0_4px_hsl(22_95%_58%/0.12)]"
            />
            <button
              type="submit"
              data-magnetic
              className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_32px_hsl(22_95%_58%/0.3)] active:scale-[0.98]"
              style={{ willChange: "transform" }}
            >
              Request access
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-4 font-mono text-[11px] text-muted-foreground/70">
            Private preview · ~3 weeks from request to onboarding
          </p>
        </div>

        {/* Ticker */}
        <div className="cta-ticker relative mt-12 overflow-hidden border-y border-border/60 py-4">
          <div className="flex whitespace-nowrap will-change-transform animate-ticker">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex items-center gap-12 pr-12">
                {[
                  "Build Momentum.",
                  "Automate everything else.",
                  "The operating system for operators.",
                  "Turn chaos into compounding systems.",
                  "An execution layer for the modern business.",
                ].map((line, i) => (
                  <span
                    key={`${dup}-${i}`}
                    className="font-display text-3xl italic text-foreground/30 sm:text-4xl"
                  >
                    {line}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
