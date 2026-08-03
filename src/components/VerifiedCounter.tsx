"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";

export default function VerifiedCounter() {
  const [count, setCount] = useState(0);
  const { ref, value } = useCountUp(count, { duration: 2600 });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/providers?verificationStatus=verified")
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        if (body.success && Array.isArray(body.data)) {
          setCount(body.data.length);
        }
      })
      .catch(() => {
        // Leave count at 0 if the register is unreachable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-10 border-l-4 border-mustard-500 pl-4">
      <div className="flex items-baseline gap-2">
        <span
          ref={ref}
          className="font-mono text-5xl font-bold tracking-tight text-ink sm:text-6xl"
        >
          {value.toLocaleString("en-US")}
        </span>
        <span className="font-mono text-sm font-bold text-rust-600">▲ live</span>
      </div>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
        Verified pros on the register
      </p>
      <p className="mt-1 text-xs text-ink-3">
        Re-certified daily against county license files
      </p>
    </div>
  );
}
