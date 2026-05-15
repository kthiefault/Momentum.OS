import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "Platform", href: "#solution" },
  { label: "Automation", href: "#automation" },
  { label: "AI", href: "#ai" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 reveal-up">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 ${
          scrolled ? "glass-strong" : "border border-transparent bg-transparent"
        }`}
      >
        <a href="#" className="flex items-center gap-2.5">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-ember to-ember-deep" />
            <div className="absolute inset-[2px] rounded-[5px] bg-background flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-ember shadow-[0_0_12px_2px_hsl(22_95%_58%/0.8)]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 font-medium tracking-tight">
            <span>Momentum</span>
            <span className="text-muted-foreground">.OS</span>
          </div>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#login"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Sign in
          </a>
          <a
            href="#cta"
            className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-all hover:bg-foreground/90"
          >
            Request access
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
