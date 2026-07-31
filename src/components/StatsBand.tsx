"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { registryStats } from "@/lib/pros";

function Stat({
  value,
  decimals,
  suffix,
  label,
}: {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}) {
  const { ref, value: v } = useCountUp(value, { decimals });
  return (
    <div className="border-t-2 border-mustard-500 pt-5">
      <p className="font-mono text-4xl font-bold tracking-tight text-paper sm:text-5xl">
        <span ref={ref}>
          {v.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
        </span>
        <span className="text-mustard-400">{suffix}</span>
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
        {label}
      </p>
    </div>
  );
}

export default function StatsBand() {
  return (
    <section className="border-b border-ink/15 bg-forest-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {registryStats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
