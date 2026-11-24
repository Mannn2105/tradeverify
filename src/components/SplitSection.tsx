import Reveal from "./Reveal";

const cards = [
  {
    id: "for-pros",
    eyebrow: "For trade pros",
    title: "Your license is your marketing.",
    copy: "You already did the work to be licensed, insured, and bonded. Stop paying to be anonymous.",
    points: [
      "Free scheduling, invoicing, and job reminders — no trial, no upsell, no monthly fee",
      "Listed first in your trade, in your town, among verified pros only",
      "The verification you already have becomes your storefront",
    ],
    cta: "Claim your business",
    href: "/register",
    accent: "forest",
  },
  {
    id: "for-customers",
    eyebrow: "For customers",
    title: "Hire with receipts.",
    copy: "No more picking between the guy who ghosted you and the ad that looks too good to be true.",
    points: [
      "Every pro is licensed, insured, and bonded — on the record, not on a profile",
      "Proof is checked against public files, not self-submitted photos",
      "Look up the certificate before you pick up the phone",
    ],
    cta: "Search the register",
    href: "#register",
    accent: "rust",
  },
];

export default function SplitSection() {
  return (
    <section className="relative border-b border-ink/15 bg-paper-2">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
          {cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 140}>
              <div
                id={card.id}
                className={`scroll-mt-32 border-2 border-ink bg-paper p-8 shadow-[10px_10px_0_0_${
                  card.accent === "forest"
                    ? "rgba(38,80,52,1)"
                    : "rgba(164,69,22,1)"
                }] sm:p-10`}
              >
                <div
                  className={`mb-6 h-1.5 w-12 ${
                    card.accent === "forest" ? "bg-forest-700" : "bg-rust-600"
                  }`}
                />
                <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-ink-3">
                  {card.eyebrow}
                </p>
                <h2 className="mt-2 font-slab text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                  {card.title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-2">{card.copy}</p>
                <ul className="mt-6 space-y-3">
                  {card.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-ink ${
                          card.accent === "forest"
                            ? "bg-forest-100 text-forest-700"
                            : "bg-rust-100 text-rust-600"
                        }`}
                      >
                        <svg
                          viewBox="0 0 12 12"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="square"
                        >
                          <path d="M2 6 l2.5 2.5 L10 3" />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-ink-2">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={card.href}
                  className={`mt-8 inline-flex items-center gap-2 border-2 border-ink px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink transition-transform duration-150 hover:-translate-y-0.5 ${
                    card.accent === "forest"
                      ? "bg-forest-700 text-paper"
                      : "bg-mustard-500"
                  }`}
                >
                  {card.cta} <span aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
