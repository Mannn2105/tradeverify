import Reveal from "./Reveal";
import Stamp from "./Stamp";
import CtaForm from "./CtaForm";

export default function CTASection() {
  return (
    <section
      id="cta"
      className="texture-hero relative scroll-mt-32 overflow-hidden border-b border-ink/15 bg-paper"
    >
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <Reveal>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-rust-600">
            Application — 15 minutes, free
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-slab text-3xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Put your business on the books.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-2">
            No credit card. No trial window. The software is free in exchange
            for verification — that&apos;s the whole deal. Fill this out and a
            registry clerk (a human) will walk you through the paperwork.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative mt-10 inline-block">
            <Stamp
              className="absolute -left-10 -top-10 h-20 w-20 text-rust-600"
              label="OPEN"
              delay={700}
            />
            <CtaForm />
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            Prefer the phone? Call the registry: (614) 555-0187 · Mon–Fri
            8:00–5:00 EST
          </p>
        </Reveal>

        <Reveal delay={250}>
          <div className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-ink/15 pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            <span>No lead fees</span>
            <span>No upsells</span>
            <span>No &ldquo;premium&rdquo; tiers</span>
            <span>Just the record</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
