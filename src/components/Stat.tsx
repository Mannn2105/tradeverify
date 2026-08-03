"use client";

import { useCountUp } from "@/hooks/useCountUp";

export default function Stat({
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
