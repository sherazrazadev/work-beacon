export function CustomerLogo({
  letters,
  hue,
  size = "md",
}: {
  letters: string;
  hue: number;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? 72 : size === "sm" ? 40 : 56;
  const gid = `logo-${letters}-${hue}-${size}`;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 72 72"
      role="img"
      aria-label={`${letters} logo`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 55% 42%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 40) % 360} 45% 28%)`} />
        </linearGradient>
      </defs>
      <rect width="72" height="72" rx="4" fill={`url(#${gid})`} />
      <text
        x="36"
        y="42"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontFamily="var(--font-display), system-ui, sans-serif"
        fontWeight="700"
      >
        {letters}
      </text>
    </svg>
  );
}
