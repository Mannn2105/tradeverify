"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";

export default function VerifiedCounter() {
  const { ref, value } = useCountUp(12418, { duration: 2600 });
  const [live, setLive] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        setLive((v) => v + (Math.random() > 0.45 ? 2 : 1));
        setJustAdded(true);
        setTimeout(() => {
          if (alive) setJustAdded(false);
        }, 1100);
        loop();
      }, 4200);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="mt-10 border-l-4 border-mustard-500 pl-4">
      <div className="flex items-baseline gap-2">
        <span
          ref={ref}
          className={`font-mono text-5xl font-bold tracking-tight text-ink sm:text-6xl ${
            justAdded ? "animate-tick-flash" : ""
          }`}
        >
          {(value + live).toLocaleString("en-US")}
        </span>
        <span className="font-mono text-sm font-bold text-rust-600">
          {justAdded ? "+1 just now" : "▲ live"}
        </span>
      </div>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
        Verified pros in your area
      </p>
      <p className="mt-1 text-xs text-ink-3">
        +212 verified this week · re-certified daily against county files
      </p>
    </div>
  );
}
