"use client";

type IconName =
  | "grid" | "boxes" | "shield" | "ticket" | "store" | "cog"
  | "search" | "bell" | "check" | "trendUp" | "trendDown"
  | "discord" | "github" | "menu" | "x" | "arrowRight" | "arrowDown"
  | "sparkles" | "bolt" | "brain" | "chart" | "users" | "code"
  | "terminal" | "server" | "globe" | "lock" | "zap" | "heart"
  | "star" | "clock" | "rocket" | "puzzle" | "gift" | "wallet"
  | "copy" | "check2" | "play" | "external" | "filter" | "plus"
  | "moon" | "sun" | "chevron" | "flame";

type Props = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export default function Icon({ name, size = 18, strokeWidth = 2, className }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "grid":     return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
    case "boxes":    return <svg {...common}><path d="M21 8L12 3 3 8m18 0v8l-9 5-9-5V8m18 0l-9 5m0 0L3 8m9 5v8"/></svg>;
    case "shield":   return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "ticket":   return <svg {...common}><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z"/><path d="M9 6v12"/></svg>;
    case "store":    return <svg {...common}><path d="M3 7l1-3h16l1 3M3 7v13h18V7M3 7h18M9 12h6"/></svg>;
    case "cog":      return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>;
    case "search":   return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case "bell":     return <svg {...common}><path d="M18 16v-5a6 6 0 10-12 0v5l-2 3h16l-2-3zM10 21a2 2 0 004 0"/></svg>;
    case "check":    return <svg {...common}><path d="M5 12l5 5L20 7"/></svg>;
    case "check2":   return <svg {...common}><path d="M20 6L9 17l-5-5"/></svg>;
    case "trendUp":  return <svg {...common}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg>;
    case "trendDown":return <svg {...common}><path d="M3 7l6 6 4-4 8 8M14 17h7v-7"/></svg>;
    case "discord":  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.078.037 13.6 13.6 0 0 0-.6 1.236 18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.61-1.236.077.077 0 0 0-.078-.037A19.74 19.74 0 0 0 3.69 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.548-13.66a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z"/></svg>;
    case "github":   return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.96 10.96 0 0 1 5.74 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/></svg>;
    case "menu":     return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "x":        return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "arrowRight": return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "arrowDown":  return <svg {...common}><path d="M12 5v14M5 13l7 7 7-7"/></svg>;
    case "sparkles": return <svg {...common}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM5 16l.7 1.4L7 18l-1.3.6L5 20l-.7-1.4L3 18l1.3-.6L5 16z"/></svg>;
    case "bolt":     return <svg {...common}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>;
    case "brain":    return <svg {...common}><path d="M9.5 3a3 3 0 00-3 3v.5a3 3 0 00-1.5 5.5 3 3 0 002 5 3 3 0 005 0V3.5"/><path d="M14.5 3a3 3 0 013 3v.5a3 3 0 011.5 5.5 3 3 0 01-2 5 3 3 0 01-5 0V3.5"/></svg>;
    case "chart":    return <svg {...common}><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>;
    case "users":    return <svg {...common}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
    case "code":     return <svg {...common}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>;
    case "terminal": return <svg {...common}><path d="M4 17l6-6-6-6M12 19h8"/></svg>;
    case "server":   return <svg {...common}><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 7h.01M7 17h.01"/></svg>;
    case "globe":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
    case "lock":     return <svg {...common}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
    case "zap":      return <svg {...common}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>;
    case "heart":    return <svg {...common}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
    case "star":     return <svg {...common}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>;
    case "clock":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>;
    case "rocket":   return <svg {...common}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
    case "puzzle":   return <svg {...common}><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.03 7.03 0 00-1.69-.98l-.38-2.65A.5.5 0 0014 2h-4a.5.5 0 00-.49.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 00-.61.22l-2 3.46a.5.5 0 00.12.64L4.57 11c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 00-.12.64l2 3.46c.14.24.42.34.66.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.05.24.26.42.5.42h4c.24 0 .45-.18.5-.42l.38-2.65a7.03 7.03 0 001.69-.98l2.49 1c.24.12.52.02.66-.22l2-3.46a.5.5 0 00-.12-.64l-2.11-1.65z"/></svg>;
    case "gift":     return <svg {...common}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7M7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8M16.5 8a2.5 2.5 0 000-5C15 3 12 8 12 8"/></svg>;
    case "wallet":   return <svg {...common}><path d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-2"/><path d="M22 12h-4a2 2 0 100 4h4v-4z"/></svg>;
    case "copy":     return <svg {...common}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
    case "play":     return <svg {...common}><path d="M5 3l14 9-14 9V3z"/></svg>;
    case "external": return <svg {...common}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>;
    case "filter":   return <svg {...common}><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/></svg>;
    case "plus":     return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "moon":     return <svg {...common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;
    case "sun":      return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
    case "chevron":  return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case "flame":    return <svg {...common}><path d="M8.5 14.5C8.5 13 10 11 12 11s3.5 2 3.5 3.5S14 18 12 18s-3.5-2-3.5-3.5z"/><path d="M12 2C9 7 5 9 5 14a7 7 0 0014 0c0-3-2-5-3-7-1.5 2-4 1-4-5z"/></svg>;
    default:         return null;
  }
}

export type { IconName };
