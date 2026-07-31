import RegistryMark from "./RegistryMark";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#verification", label: "Verification" },
  { href: "#register", label: "The register" },
  { href: "#for-pros", label: "For pros" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-forest-950 text-paper/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] sm:px-6 lg:px-8">
          <span className="truncate text-paper/70">
            Municipal trades registry · est. 2019
          </span>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-mustard-400" />
            <span>Independent verification · open to audit</span>
          </span>
        </div>
      </div>
      <div className="border-b border-ink/15 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <RegistryMark className="h-9 w-9" />
            <span className="font-slab text-xl font-bold tracking-tight text-ink">
              On&nbsp;the&nbsp;Books
            </span>
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-forest-700"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#register"
              className="hidden font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-forest-700 sm:block"
            >
              Customer? Search
            </a>
            <a
              href="#cta"
              className="rounded-sm bg-mustard-500 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink shadow-[3px_3px_0_0_rgba(34,30,23,1)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_rgba(34,30,23,1)]"
            >
              Get listed free
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
