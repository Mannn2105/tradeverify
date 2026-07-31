import VerifiedCounter from "./VerifiedCounter";
import LedgerTable from "./LedgerTable";
import RegisterSearch from "./RegisterSearch";

export default function Hero() {
  return (
    <section
      id="register"
      className="texture-hero relative scroll-mt-32 overflow-hidden border-b border-ink/15 bg-paper"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative mb-10 flex flex-wrap items-center justify-between gap-3 border border-ink/25 bg-paper-2/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          <span>
            Register — active entries ·{" "}
            <span className="text-rust-600">re-certified daily</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-forest-600" />
            Last audit: 04:00 EST · 0 findings
          </span>
        </div>

        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-forest-700"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-forest-700"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-forest-700"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-forest-700"
          />

          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-rust-600">
              Municipal registry for local trades
            </p>
            <h1 className="mt-4 font-slab text-4xl font-bold leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
              Real trades.
              <br />
              <span className="relative inline-block text-forest-700">
                On the books.
                <span
                  className="animate-stamp absolute -right-10 -top-8 hidden h-20 w-20 text-rust-600 sm:inline-flex"
                  style={{ animationDelay: "900ms" }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 96 96" className="h-full w-full opacity-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="45.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M34 48 l10 10 l22 -22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              Local pros get free scheduling software in exchange for one thing:
              proof. We verify licenses, insurance, and references against
              public records — then put them on the town&apos;s register, where
              customers can actually find them.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#cta"
                className="rounded-sm border-2 border-ink bg-mustard-500 px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.14em] text-ink shadow-[5px_5px_0_0_rgba(34,30,23,1)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(34,30,23,1)]"
              >
                Get listed — free
              </a>
              <a
                href="#how"
                className="border-2 border-ink px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                How verification works
              </a>
            </div>

            <RegisterSearch />

            <VerifiedCounter />

            <p className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
              <span className="inline-block h-3 w-3 border-2 border-forest-600" />
              Powered by paperwork. Every entry checked against county license
              files.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "180ms" }}>
            <LedgerTable />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
