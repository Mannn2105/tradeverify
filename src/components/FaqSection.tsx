import Reveal from "./Reveal";

const faqs = [
  {
    q: "Is the software really free?",
    a: "Yes. The payment is the verification — that's the whole deal. No trial, no upsell, no monthly fee, no \"premium\" tier. The registry stays honest because the pros on it have already paid with proof.",
  },
  {
    q: "What exactly do you verify?",
    a: "Your state license, matched against county contractor files. A current $1M general liability insurance certificate. Your surety bond, where one applies. Two recent references — we call them. And your complaint record across every county you serve.",
  },
  {
    q: "How long does verification take?",
    a: "Usually 3 to 5 business days. We call your references — not your competitors, not your customers. Then a registry clerk reviews the file, stamps it, and you're on the books.",
  },
  {
    q: "What happens if I don't pass?",
    a: "You simply aren't listed. We tell you exactly what was missing so you can fix it and reapply. There's no blacklist and no public record of the attempt — just the paperwork, done properly.",
  },
  {
    q: "How do customers actually find me?",
    a: "Searching your trade in your town returns the register, filtered to verified entries in that area. Being on the books is the ranking. We don't sell placement, because placement is only worth anything if everyone on it is real.",
  },
  {
    q: "Do you sell leads or charge for higher placement?",
    a: "No. Every entry is verified, so there's nothing to sell. A register that sold placement would stop being a register. It would just be advertising with extra steps.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="texture-dots-paper scroll-mt-32 border-b border-ink/15 bg-paper"
    >
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-rust-600">
            Registry Q&A
          </p>
          <h2 className="mt-3 font-slab text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            Straight answers, no fine print.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-ink/15 border-y border-ink/20">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 70}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center gap-4">
                  <span className="font-mono text-xs font-bold text-rust-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 font-slab text-lg font-semibold text-ink">
                    {f.q}
                  </h3>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink font-mono text-sm font-bold text-ink transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pl-9 pr-8 leading-relaxed text-ink-2">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            Something else? Call the registry at (614) 555-0187 — a human
            answers.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
