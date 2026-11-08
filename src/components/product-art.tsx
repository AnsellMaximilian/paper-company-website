export function ProductArt({
  variant,
  accent,
  className = "",
}: {
  variant: string;
  accent: string;
  className?: string;
}) {
  const dark = variant === "midnight";

  return (
    <div
      className={`product-art ${dark ? "product-art-dark" : ""} ${className}`}
      style={{ "--product-accent": accent } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 360 270" role="img">
        <rect width="360" height="270" rx="30" fill={dark ? "#151515" : "#f7c93f"} />
        <circle cx="304" cy="48" r="24" fill={accent} opacity={dark ? 0.9 : 0.55} />
        <path d="M24 212 128 118l78 53 69-83 61 124Z" fill="#fff" opacity=".22" />

        {variant === "ream" && (
          <g transform="translate(74 46)">
            <path d="m26 20 144 8 25 142-153-2Z" fill="#fff" stroke="#151515" strokeWidth="7" />
            <path d="m42 2 145 9-17 17-144-8Z" fill="#ececec" stroke="#151515" strokeWidth="7" />
            <rect x="66" y="61" width="104" height="62" fill="#151515" />
            <text x="118" y="84" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">SCRANTON</text>
            <text x="118" y="106" textAnchor="middle" fill="#f7c93f" fontSize="21" fontWeight="900">STANDARD</text>
          </g>
        )}

        {variant === "stack" && (
          <g transform="translate(62 44)" stroke="#151515" strokeWidth="7" strokeLinejoin="round">
            <path d="m18 108 166-35 50 44-168 42Z" fill="#fff" />
            <path d="m11 82 166-35 50 44-168 42Z" fill="#f2f2f2" />
            <path d="M2 54 168 19l50 44-168 42Z" fill="#fff" />
            <path d="m50 105 168-42" fill="none" stroke={accent} strokeWidth="12" />
          </g>
        )}

        {variant === "ticket" && (
          <g transform="rotate(-8 180 135)">
            <path d="M68 70h224v130H68c8-17 8-29 0-46 8-17 8-29 0-46 8-14 8-25 0-38Z" fill="#fff4c3" stroke="#151515" strokeWidth="7" />
            <path d="M105 96h151M105 174h151" stroke="#c8920b" strokeWidth="5" strokeDasharray="9 8" />
            <text x="181" y="143" textAnchor="middle" fill="#151515" fontSize="27" fontWeight="900">GOLDEN TICKET</text>
          </g>
        )}

        {variant === "letter" && (
          <g transform="translate(84 38)">
            <rect x="0" y="0" width="188" height="195" rx="5" fill="#fff" stroke="#151515" strokeWidth="7" />
            <rect x="18" y="18" width="152" height="28" fill="#151515" />
            <text x="94" y="38" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">MICHAEL SCOTT PAPER COMPANY</text>
            <path d="M28 78h132M28 103h132M28 128h94M28 162h65" stroke="#c8c8c8" strokeWidth="7" />
            <path d="M124 162h36" stroke={accent} strokeWidth="9" />
          </g>
        )}

        {variant === "midnight" && (
          <g transform="translate(71 47)">
            <path d="m10 29 143-18 52 133-148 29Z" fill="#2c2c2c" stroke="#fff" strokeWidth="6" />
            <path d="m46 14 143-8 16 138-52-133-143 18Z" fill="#474747" stroke="#fff" strokeWidth="6" />
            <path d="M62 58h90M70 84h90M80 110h62" stroke={accent} strokeWidth="8" />
            <circle cx="149" cy="116" r="24" fill={accent} />
          </g>
        )}

        {variant === "notepad" && (
          <g transform="translate(87 35)">
            <rect x="0" y="0" width="186" height="202" rx="12" fill="#fff7bc" stroke="#151515" strokeWidth="7" />
            <path d="M0 35h186" stroke="#151515" strokeWidth="12" />
            <circle cx="30" cy="18" r="7" fill="#fff" />
            <circle cx="62" cy="18" r="7" fill="#fff" />
            <circle cx="94" cy="18" r="7" fill="#fff" />
            <text x="93" y="89" textAnchor="middle" fill="#151515" fontSize="18" fontWeight="900">WORLD’S BEST</text>
            <text x="93" y="119" textAnchor="middle" fill="#151515" fontSize="29" fontWeight="900">BOSS</text>
            <path d="M34 151h118M34 175h83" stroke="#d4c75f" strokeWidth="6" />
          </g>
        )}
      </svg>
    </div>
  );
}
