"use client";

import { useState } from "react";

export default function CtaForm() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  if (sent) {
    return (
      <div className="inline-flex items-center gap-4 border-2 border-forest-700 bg-paper px-5 py-4">
        <span className="animate-stamp inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-forest-700 text-forest-700">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
          >
            <path d="M5 13 l4 4 L19 7" />
          </svg>
        </span>
        <div className="text-left">
          <p className="font-slab text-lg font-bold text-ink">
            Application received — on the record.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            Ref #TV-{Math.floor(10000 + Math.random() * 89999)} · we&apos;ll
            call within one business day
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setSent(true);
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourbusiness.com"
        aria-label="Work email"
        className="w-full border-2 border-ink bg-paper px-4 py-3.5 font-mono text-sm text-ink placeholder:text-ink-3 focus:border-forest-600 focus:outline-none sm:w-80"
      />
      <button
        type="submit"
        className="border-2 border-ink bg-forest-700 px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.14em] text-paper shadow-[5px_5px_0_0_rgba(34,30,23,1)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(34,30,23,1)]"
      >
        Apply for a slot
      </button>
    </form>
  );
}
