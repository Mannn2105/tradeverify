import { verifiedPros } from "@/lib/pros";

const tableHeaders = ["License", "Pro", "Trade", "City", "Bonded", "Status"];

export default function LedgerTable() {
  const rows = verifiedPros.slice(0, 7);

  return (
    <div className="relative">
      <div className="absolute -left-3 -top-3 -z-0 h-full w-full border-2 border-rust-500/60" />
      <div className="relative overflow-hidden border-2 border-ink bg-paper shadow-[12px_12px_0_0_rgba(27,59,41,0.9)]">
        <div className="flex items-center justify-between border-b-2 border-ink bg-forest-800 px-4 py-2.5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-mustard-400">
            Local register
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/70">
            Last 7 entries · public record
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/25 bg-paper-2/70 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                {tableHeaders.map((h) => (
                  <th key={h} className="px-4 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr
                  key={p.license}
                  className={`animate-fade-up border-b border-ink/10 transition-colors hover:bg-mustard-100/40 ${
                    i === 0 ? "bg-mustard-100/30" : ""
                  }`}
                  style={{ animationDelay: `${120 + i * 140}ms` }}
                >
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-semibold text-rust-600">
                    {p.license}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span className="font-slab text-sm font-semibold text-ink">
                      {p.business}
                    </span>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-3">
                      {p.pro}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-ink-2">
                    {p.trade}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-ink-2">
                    {p.city}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <svg
                      viewBox="0 0 16 16"
                      className="h-4 w-4 text-forest-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="square"
                      aria-label="bonded"
                    >
                      <path d="M3 8.5 l3.5 3.5 L13 4.5" />
                    </svg>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span
                      className="animate-stamp inline-flex -rotate-2 items-center gap-1 border-2 border-rust-600 bg-rust-50 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-rust-600"
                      style={{ animationDelay: `${200 + i * 140}ms` }}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className="h-2.5 w-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="square"
                      >
                        <path d="M2 6.5 l2.5 2.5 L10 3" />
                      </svg>
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t-2 border-ink bg-forest-50/60 px-4 py-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            Updated continuously · 0.4s refresh
          </p>
          <a
            href="#register"
            className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-forest-700 hover:text-rust-600"
          >
            View full register →
          </a>
        </div>
      </div>
    </div>
  );
}
