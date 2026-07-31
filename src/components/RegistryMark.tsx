export default function RegistryMark({
  className = "h-9 w-9",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="4"
        fill="#1b3b29"
        stroke="#e5a90e"
        strokeWidth="2.5"
      />
      <path
        d="M11 21 l6 6 l12 -13"
        fill="none"
        stroke="#e5a90e"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}
