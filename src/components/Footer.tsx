import RegistryMark from "./RegistryMark";

const columns = [
  {
    title: "Register",
    links: [
      { label: "Search the register", href: "#register" },
      { label: "How verification works", href: "#verification" },
      { label: "For pros", href: "#for-pros" },
      { label: "For customers", href: "#for-customers" },
    ],
  },
  {
    title: "Registry",
    links: [
      { label: "About the registry", href: "#verification" },
      {
        label: "Quarterly audit report",
        href: "mailto:registry@onthebooks.co?subject=Quarterly%20audit%20report%20request",
      },
      {
        label: "Privacy of entries",
        href: "mailto:registry@onthebooks.co?subject=Privacy%20of%20registry%20entries",
      },
      {
        label: "Careers — we hire paperwork people",
        href: "mailto:registry@onthebooks.co?subject=Careers%20at%20On%20the%20Books",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="texture-dots-dark bg-forest-950 text-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <a href="#main" aria-label="On the Books home" className="flex items-center gap-2.5">
              <RegistryMark className="h-10 w-10" />
              <span className="font-slab text-2xl font-bold tracking-tight text-paper">
                On&nbsp;the&nbsp;Books
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              The boring, reliable infrastructure your town runs on. Free
              scheduling for local trades — in exchange for the one thing that
              matters: proof.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/40">
              Verified registry · re-certified daily
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-mustard-400">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-paper/70 transition-colors hover:text-paper"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-mustard-400">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 font-mono text-sm text-paper/70">
              <li>registry@onthebooks.co</li>
              <li>Mon–Fri 8:00–5:00 EST</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-paper/15 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">
            <span>© 2026 On the Books Municipal Registry</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-mustard-400" />
              Independent third-party audit · Quarterly
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-paper/40">
            On the Books is a registry, not a referral network. Every entry is
            verified against public license files at the time of listing and
            re-verified every 12 months. Always confirm current standing with
            your county before hiring. Entries shown are illustrative.
          </p>
        </div>
      </div>
    </footer>
  );
}
