import Reveal from "./Reveal";

const steps = [
  {
    num: "01",
    title: "Prove it",
    body: "Show your license, insurance certificate, bond, and two recent references. We check them against county and state files. It's paperwork — that's the point.",
    tag: "15 min · free",
  },
  {
    num: "02",
    title: "Run it",
    body: "Get the full scheduling software — booking, invoicing, reminders — free, forever. No trial, no upsell. The tool is the payment for the proof.",
    tag: "No credit card",
  },
  {
    num: "03",
    title: "Get found",
    body: "Customers searching your trade in your town see you first — stamped, bonded, and on the books. The verification you already earned becomes your storefront.",
    tag: "Listed immediately",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="texture-dots-dark relative scroll-mt-32 bg-forest-900 text-paper"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-paper/20 pb-6">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-mustard-400">
                How the registry works
              </p>
              <h2 className="mt-3 max-w-2xl font-slab text-3xl font-bold leading-tight tracking-tight text-paper sm:text-4xl">
                Free software in exchange for verification.
                <span className="text-mustard-400"> That&apos;s the deal.</span>
              </h2>
            </div>
            <p className="max-w-sm font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">
              No paywalls. No lead bidding. Just one record, kept current.
            </p>
          </div>
        </Reveal>

        <div className="divide-y divide-paper/15">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 130}>
              <div className="group grid gap-3 py-9 sm:grid-cols-[5rem_1fr_1.6fr] sm:gap-8">
                <span className="font-mono text-sm font-bold text-mustard-400">
                  {s.num}
                </span>
                <h3 className="font-slab text-2xl font-bold text-paper sm:text-3xl">
                  {s.title}
                </h3>
                <div className="sm:max-w-xl">
                  <p className="leading-relaxed text-paper/75">{s.body}</p>
                  <span className="mt-3 inline-block border border-paper/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">
                    {s.tag}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-12 border-l-4 border-mustard-500 pl-4 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">
            Three steps, one stamp. No exceptions, no &ldquo;trust us&rdquo; — the record
            does the talking.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
