"use client";

import { useState } from "react";

export default function CtaForm() {
  const [email, setEmail] = useState("");
  const [draftOpened, setDraftOpened] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (!address) return;

    const subject = "Trade registry application";
    const body = [
      "Hello On the Books team,",
      "",
      "I'd like to apply to be listed in the trade registry.",
      `Work email: ${address}`,
      "",
      "Please let me know the next steps.",
    ].join("\n");

    const mailto = `mailto:registry@onthebooks.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setDraftOpened(true);
  }

  if (draftOpened) {
    return (
      <div
        role="status"
        className="border-2 border-forest-700 bg-paper px-5 py-4 text-left"
      >
        <p className="font-slab text-lg font-bold text-ink">
          Your application email is ready.
        </p>
        <p className="mt-1 max-w-md font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-ink-3">
          Send the draft from your email app to complete your request. If it
          did not open, email registry@onthebooks.co.
        </p>
        <a
          href="mailto:registry@onthebooks.co?subject=Trade%20registry%20application"
          className="mt-3 inline-block font-mono text-xs font-bold uppercase tracking-[0.12em] text-forest-700 underline underline-offset-4"
        >
          Open email again
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
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
