import { useEffect, useState } from "react";
import { ArrowUpRight, Moon, Sun, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const links = [
  { label: "Platform", to: "/platform" },
  { label: "Automation", to: "/automation" },
  { label: "AI", to: "/ai" },
  { label: "Pipeline", to: "/pipeline" },
  { label: "Pricing", to: "/pricing" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 reveal-up">
        <nav
          className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 ${
            scrolled ? "glass-strong" : "border border-transparent bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-ember to-ember-deep" />
              <div className="absolute inset-[2px] rounded-[5px] bg-background flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-ember shadow-[0_0_12px_2px_hsl(221_79%_48%/0.8)]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 font-medium tracking-tight">
              <span>Momentum</span>
              <span className="text-muted-foreground">.OS</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary/60 hover:text-foreground ${
                      active ? "bg-secondary/60 text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/40 text-muted-foreground transition-all hover:border-border hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <Link
              to="/"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block md:block"
            >
              Sign in
            </Link>
            <Link
              to="/pricing"
              className="group hidden md:inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-all hover:bg-foreground/90"
            >
              Request access
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/40 text-muted-foreground transition-all hover:border-border hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(16px)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col px-6 pt-28 pb-10 h-full"
            >
              {/* Nav links */}
              <ul className="flex flex-col gap-1 flex-1">
                {links.map((l, i) => {
                  const active = location.pathname === l.to;
                  return (
                    <motion.li
                      key={l.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.055, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <Link
                        to={l.to}
                        className={`flex items-center justify-between rounded-xl px-4 py-4 text-[18px] font-medium transition-all ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/06 hover:text-white/90"
                        }`}
                      >
                        {l.label}
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 opacity-30" />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col gap-3 pt-6 border-t border-white/10"
              >
                <Link
                  to="/pricing"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-black transition-all active:scale-95"
                >
                  Request access
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/"
                  className="flex items-center justify-center rounded-xl border border-white/15 px-6 py-3.5 text-[15px] font-medium text-white/70 transition-all active:scale-95 hover:border-white/25 hover:text-white"
                >
                  Sign in
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
