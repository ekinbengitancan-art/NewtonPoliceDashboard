"use client";

import { usePathname } from "next/navigation";

type Props = {
  size?: number;
  withText?: boolean;
  variant?: "gradient" | "blue" | "mono";
  className?: string;
};

export default function Logo({ size = 32, withText = true, variant = "gradient", className }: Props) {
  const pathname = usePathname() ?? "/";
  const fillId = `gc-fill-${variant}`;
  const shineId = `gc-shine-${variant}`;
  const glowId = `gc-glow-${variant}`;

  return (
    <span className={`logo logo-mark ${className ?? ""}`} aria-label="GuildCore">
      <span
        key={pathname}
        className="logo-mark-glyph"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ display: "block", overflow: "visible" }}
        >
          <defs>
            <linearGradient id={fillId} x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
              {variant === "blue" ? (
                <>
                  <stop offset="0%" stopColor="#7DA8FF" />
                  <stop offset="55%" stopColor="#3D6BFF" />
                  <stop offset="100%" stopColor="#1F3FCC" />
                </>
              ) : variant === "mono" ? (
                <>
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#7DDC86" />
                  <stop offset="48%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </>
              )}
            </linearGradient>
            <linearGradient id={shineId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.6">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {variant !== "mono" && (
            <circle cx="32" cy="32" r="30" fill={`url(#${glowId})`} />
          )}

          <path
            fill={`url(#${fillId})`}
            fillRule="evenodd"
            d="
              M32 3 L58 18 L58 46 L32 61 L6 46 L6 18 Z
              M32 13 L15 22.5 V41.5 L22 45.5 V36 H32 V30 H22 V23 H42 V32 H50 V18 Z
              M32 36 V46 H42 V41 H50 V49 L32 49 V36 Z
            "
          />

          <path
            fill={`url(#${shineId})`}
            fillRule="evenodd"
            opacity={variant === "mono" ? 0 : 1}
            d="
              M32 3 L58 18 L58 46 L32 61 L6 46 L6 18 Z
              M32 13 L15 22.5 V41.5 L22 45.5 V36 H32 V30 H22 V23 H42 V32 H50 V18 Z
              M32 36 V46 H42 V41 H50 V49 L32 49 V36 Z
            "
          />

          <path
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.6"
            d="M32 3 L58 18 L58 46 L32 61 L6 46 L6 18 Z"
          />
        </svg>
      </span>

      {withText && (
        <span className="logo-mark-wordmark">
          Guild<span className="logo-mark-accent">Core</span>
        </span>
      )}
    </span>
  );
}
