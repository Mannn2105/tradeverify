import Stamp from "./Stamp";
import { getVerifiedProviders } from "@/lib/data";

export default async function TrustTicker() {
  const providers = await getVerifiedProviders(16);

  const row = (key: string, ariaHidden = false) => (
    <div
      key={key}
      className="flex shrink-0 items-stretch"
      aria-hidden={ariaHidden || undefined}
    >
      {(providers.length === 0
        ? [{ businessName: "No verified businesses yet", trade: "Register open" }]
        : providers
      ).map((p) => (
        <div
          key={`${key}-${p.businessName}`}
          className="flex items-center gap-3 border-r border-ink/15 px-6 py-3"
        >
          <Stamp className="h-9 w-9 shrink-0 text-rust-600" />
          <div className="leading-tight">
            <p className="font-slab text-sm font-semibold text-ink">
              {p.businessName}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
              {p.trade}
            </p>
          </div>
          <div className="ml-3 flex shrink-0 items-center gap-1.5 rounded-sm bg-mustard-500 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
            <svg
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 6.5 l2.5 2.5 L10 3" strokeLinecap="square" />
            </svg>
            Verified
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="marquee relative overflow-hidden border-b border-ink/20 bg-paper-2/80"
      aria-label="Verified trade businesses"
    >
      <div className="flex items-stretch">
        <div className="relative z-10 flex shrink-0 items-center gap-2 border-r border-forest-950/40 bg-forest-800 px-4 py-3 text-paper sm:px-6">
          <span
            className="h-2 w-2 animate-blink rounded-full bg-mustard-400"
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]">
            On the register
          </span>
        </div>
        <div
          className="marquee-track flex items-stretch"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 32px, black calc(100% - 48px), transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 32px, black calc(100% - 48px), transparent)",
          }}
        >
          {row("a")}
          {row("b", true)}
        </div>
      </div>
    </section>
  );
}
