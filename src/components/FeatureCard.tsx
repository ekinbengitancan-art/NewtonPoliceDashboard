"use client";

import { useRef } from "react";
import Icon, { type IconName } from "./Icon";

type Props = {
  iconName: IconName;
  title: string;
  desc: string;
  iconClass?: string;
  delay?: number;
};

export default function FeatureCard({ iconName, title, desc, iconClass = "primary-gradient", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="feature-card fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`feature-icon ${iconClass}`}>
        <Icon name={iconName} size={22} strokeWidth={2.2} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
