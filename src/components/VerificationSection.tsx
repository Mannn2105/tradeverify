import Reveal from "./Reveal";
import Stamp from "./Stamp";

const checks = [
  {
    label: "State license confirmed",
    sub: "Matched against county contractor file",
    code: "LIC",
  },
  {
    label: "Insurance on file",
    sub: "$1M general liability certificate, current",
    code: "INS",
  },
  {
    label: "Bonded",
    sub: "Surety bond active — protects the homeowner",
    code: "BND",
  },
  {
    label: "References called",
    sub: "Two recent clients, both reached, both would re-hire",
    code: "REF",
  },
  {
    label: "Complaint history reviewed",
    sub: "No open complaints in any county served",
    code: "CHK",
  },
];

export default function VerificationSection() {
  return (
    <section
      id="verification"
      className="texture-blueprint relative scroll-mt-32 border-b border-ink/15 bg-paper"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-rust-600">
                What &ldquo;verified&rdquo; actually means
              </p>
              <h2 className="mt-3 font-slab text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Verification is the whole product.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-ink-2">
                Most &ldquo;reviews&rdquo; are vibes. We do paperwork — the
                license check, the insurance certificate, the bond, the
                references. If a pro isn&apos;t willing to put it on the record,
                they don&apos;t get listed. That&apos;s what makes a listing on
                the register worth anything at all.
              </p>
            </Reveal>

            <div className="mt-10">
              {checks.map((c, i) => (
                <Reveal key={c.code} delay={i * 110}>
                  <div className="flex items-start gap-4 border-b border-ink/10 py-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-mustard-500 font-mono text-[10px] font-bold text-ink">
                      <svg
                        viewBox="0 0 14 14"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="square"
                      >
                        <path d="M2 7.5 l3 3 L12 3.5" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <p className="font-slab text-base font-semibold text-ink">
                          {c.label}
                        </p>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rust-600">
                          {c.code}
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-ink-3">
                        {c.sub}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:pt-6">
            <Reveal delay={150}>
              <div className="relative mx-auto max-w-md">
                <div className="absolute -left-4 -top-4 h-full w-full border-2 border-forest-700/40" />
                <div className="relative rotate-2 border-2 border-ink bg-paper-2 p-8 shadow-[10px_10px_0_0_rgba(38,80,52,0.55)]">
                  <Stamp
                    className="absolute -top-7 right-1 h-20 w-20 text-rust-600 sm:right-auto sm:-right-8 sm:-top-9 sm:h-24 sm:w-24"
                    label="APPROVED"
                    delay={600}
                  />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
                    Certificate of standing
                  </p>
                  <p className="mt-2 font-slab text-2xl font-bold leading-snug text-ink">
                    This business is on the books.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">
                    Listed on the public register after passing license,
                    insurance, and reference checks. Re-verified every 12
                    months — no exceptions, no grandfathering.
                  </p>
                  <div className="mt-6 border-t border-ink/15 pt-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                      Certificate of standing · current on this register
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-3">
                      Re-verified every 12 months — no exceptions
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3 border border-ink/25 bg-forest-50 px-4 py-3">
                  <span className="h-2 w-2 shrink-0 animate-blink rounded-full bg-forest-600" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                    Every certificate is independently audited each quarter.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
