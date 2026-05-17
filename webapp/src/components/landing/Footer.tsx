const cols = [
  {
    title: "Platform",
    links: ["Workflows", "AI agents", "CRM", "Signals", "Integrations"],
  },
  {
    title: "Operators",
    links: ["Founders", "Advisors", "Studios", "Agencies", "Customers"],
  },
  {
    title: "Resources",
    links: ["Playbooks", "Docs", "Changelog", "Security", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Manifesto", "Careers", "Press", "Contact"],
  },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-border/60 bg-background/40 py-16">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 rounded-md bg-gradient-to-br from-ember to-ember-deep" />
                <div className="absolute inset-[2px] flex items-center justify-center rounded-[5px] bg-background">
                  <div className="h-2 w-2 rounded-full bg-ember shadow-[0_0_12px_2px_hsl(221_79%_48%/0.8)]" />
                </div>
              </div>
              <div className="flex items-baseline gap-1 font-medium tracking-tight">
                <span>Momentum</span>
                <span className="text-muted-foreground">.OS</span>
              </div>
            </a>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              An AI-powered execution operating system for entrepreneurs,
              advisors, and operators. Built in Coeur d'Alene, Idaho.
            </p>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
              © {new Date().getFullYear()} Momentum Labs, Inc.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  {c.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-foreground/80 transition-colors hover:text-ember"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(140_70%_55%)] shadow-[0_0_8px_hsl(140_70%_55%)]" />
            <span>All systems nominal</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">DPA</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </div>

      {/* Huge wordmark behind */}
      <div className="pointer-events-none mt-20 flex select-none justify-center overflow-hidden">
        <span
          className="font-display text-[18vw] leading-none tracking-tight text-foreground/[0.04] sm:text-[16vw]"
          style={{ letterSpacing: "-0.04em" }}
        >
          Momentum.OS
        </span>
      </div>
    </footer>
  );
};

export default Footer;
