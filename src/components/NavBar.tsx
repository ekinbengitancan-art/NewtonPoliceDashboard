"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeProvider";

const NAV_ITEMS = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#install", label: "Self-host" },
  { href: "/#modules", label: "Modules" },
  { href: "/#faq", label: "FAQ" },
];

export default function NavBar() {
  const pathname = usePathname() ?? "/";
  const onDashboard = pathname.startsWith("/dashboard");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 12);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`glass-nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="nav-logo-link" aria-label="GuildCore home" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
          <li>
            <a href="https://github.com/werseecloud/GuildCore" target="_blank" rel="noreferrer" className="nav-link-pill">
              <Icon name="github" size={14} />
              GitHub
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <ThemeToggle />
          {!onDashboard && (
            <Link href="/dashboard" className="btn-primary nav-cta">
              Dashboard
              <Icon name="arrowRight" size={14} strokeWidth={2.5} />
            </Link>
          )}
          <button
            className="btn-icon nav-mobile-toggle"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            type="button"
          >
            <Icon name={mobileOpen ? "x" : "menu"} />
          </button>
        </div>
      </nav>

      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobile-drawer-inner">
          <ul className="mobile-nav-list">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.href} style={{ animationDelay: `${index * 50}ms` }}>
                <a href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                  <Icon name="arrowRight" size={16} />
                </a>
              </li>
            ))}
            <li style={{ animationDelay: `${NAV_ITEMS.length * 50}ms` }}>
              <a href="https://github.com/werseecloud/GuildCore" target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>
                <span className="inline-icon-label">
                  <Icon name="github" size={16} />
                  GitHub
                </span>
                <Icon name="external" size={16} />
              </a>
            </li>
          </ul>
          {!onDashboard && (
            <Link href="/dashboard" className="btn-primary mobile-cta" onClick={() => setMobileOpen(false)}>
              Open dashboard
              <Icon name="arrowRight" size={14} strokeWidth={2.5} />
            </Link>
          )}
          <p className="mobile-drawer-footer">
            Open source / MIT / <span>by Wersee Team</span>
          </p>
        </div>
      </div>

      {mobileOpen && <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
