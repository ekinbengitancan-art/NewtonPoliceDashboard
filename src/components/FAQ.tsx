"use client";

import { useState } from "react";
import Icon from "./Icon";

type Item = { q: string; a: string };

export default function FAQ({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
            <button
              className="faq-q"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              type="button"
            >
              <span>{it.q}</span>
              <span className="faq-chev"><Icon name="plus" size={16} /></span>
            </button>
            <div className="faq-a-wrap">
              <p className="faq-a">{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
