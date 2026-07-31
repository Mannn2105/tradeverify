"use client";

import { useId } from "react";

export default function Stamp({
  className = "h-14 w-14",
  color = "text-rust-600",
  label = "VERIFIED",
  delay = 0,
}: {
  className?: string;
  color?: string;
  label?: string;
  delay?: number;
}) {
  const arcId = useId();
  return (
    <span
      className={`animate-stamp inline-flex items-center justify-center ${color} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`${label} on the books`}
    >
      <svg viewBox="0 0 96 96" className="h-full w-full">
        <defs>
          <path
            id={arcId}
            d="M48 48 m -32 0 a 32 32 0 1 1 64 0 a 32 32 0 1 1 -64 0"
            fill="none"
          />
        </defs>
        <circle
          cx="48"
          cy="48"
          r="45.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="2.5 3.5"
        />
        <text
          fontSize="9.4"
          fontWeight="700"
          letterSpacing="1.7"
          fill="currentColor"
        >
          <textPath href={`#${arcId}`}>
            {`${label} • ON THE BOOKS • ${label} •`}
          </textPath>
        </text>
        <path
          d="M32 49 l10 10 l23 -22"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}
