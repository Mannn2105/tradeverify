"use client";

import { useEffect, useMemo, useState } from "react";
import Stamp from "./Stamp";

type ProviderSummary = {
  _id: string;
  businessName: string;
  trade: string;
};

export default function RegisterSearch() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/providers?verificationStatus=verified")
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        if (body.success) setProviders(body.data ?? []);
        else setStatus("error");
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const matches = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return providers.filter(
      (p) =>
        p.businessName.toLowerCase().includes(q) ||
        p.trade.toLowerCase().includes(q)
    );
  }, [providers, query]);

  const result = submitted ? matches : null;

  return (
    <div className="mt-8 border-2 border-ink bg-paper shadow-[5px_5px_0_0_rgba(34,30,23,0.9)]">
      <p className="border-b border-ink/15 bg-forest-50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
        Public search · no account needed
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(query.trim() || " ");
        }}
        className="flex"
      >
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSubmitted(null);
          }}
          placeholder="Pro name or trade…"
          aria-label="Search the register"
          className="w-full min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-sm text-ink placeholder:text-ink-3 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 border-l-2 border-ink bg-mustard-500 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-mustard-400"
        >
          Search
        </button>
      </form>

      {submitted && (
        <div className="border-t border-ink/15 px-4 py-3">
          {status === "loading" ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              Loading the register…
            </p>
          ) : status === "error" ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              Could not load the register.
            </p>
          ) : result && result.length > 0 ? (
            <div className="flex flex-wrap items-center gap-4">
              <Stamp className="h-12 w-12 shrink-0 text-rust-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-slab font-semibold text-ink">
                  {result[0].businessName}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                  {result[0].trade}
                </p>
              </div>
              <span className="rounded-sm border-2 border-rust-600 bg-rust-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-rust-600">
                Verified
              </span>
            </div>
          ) : providers.length === 0 ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              No verified businesses on the register yet.
            </p>
          ) : (
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              No match in this register — try a trade or a business name.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
