"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type PortfolioNavItem = {
  href: string;
  label: string;
  highlight?: boolean;
};

function matchesActiveSection(href: string, activeSection?: string) {
  if (!activeSection) return false;
  return href === `/#${activeSection}` || href === `/${activeSection}`;
}

export default function PortfolioSiteNav({
  items,
  activeSection,
}: {
  items: readonly PortfolioNavItem[];
  activeSection?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 701px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const main = document.querySelector<HTMLElement>("main");
    const footer = document.querySelector<HTMLElement>("footer");
    const previousOverflow = document.body.style.overflow;

    if (main) main.inert = true;
    if (footer) footer.inert = true;
    document.body.style.overflow = "hidden";
    mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const renderLink = (item: PortfolioNavItem, mobile = false) => {
    const isActive = matchesActiveSection(item.href, activeSection);
    const className = `portfolio-nav-link ${isActive ? "is-active" : ""} ${item.highlight ? "is-highlight" : ""} ${mobile ? "is-mobile" : ""}`;
    const isDocument = item.href.endsWith(".pdf");

    if (item.href.startsWith("mailto:") || isDocument) {
      return (
        <a key={`${mobile ? "mobile" : "desktop"}-${item.href}`} href={item.href} className={className} onClick={() => setMenuOpen(false)}>
          {item.label}
          {item.highlight ? <span aria-hidden="true">↗</span> : null}
        </a>
      );
    }

    return (
      <Link
        key={`${mobile ? "mobile" : "desktop"}-${item.href}`}
        href={item.href}
        className={className}
        aria-current={isActive ? "page" : undefined}
        onClick={() => setMenuOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="portfolio-nav-shell">
      <nav className="portfolio-nav section-frame" aria-label="主要导航">
        <Link href="/#home" className="portfolio-brand" aria-label="苏天润首页" onClick={() => setMenuOpen(false)}>
          <span className="portfolio-brand-mark" aria-hidden="true">ST</span>
          <span className="portfolio-brand-copy">
            <strong>苏天润</strong>
            <small>AI Product · Finance</small>
          </span>
        </Link>

        <div className="portfolio-nav-links portfolio-nav-links-desktop">
          {items.map((item) => renderLink(item))}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={`portfolio-menu-toggle ${menuOpen ? "is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="portfolio-mobile-menu"
          aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div
          ref={mobileMenuRef}
          id="portfolio-mobile-menu"
          className={`portfolio-mobile-menu ${menuOpen ? "is-open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className="portfolio-mobile-menu-head">
            <span>Navigation / 导航</span>
            <span>SU TIANRUN © 2026</span>
          </div>
          <div className="portfolio-mobile-links">
            {items.map((item) => renderLink(item, true))}
          </div>
          <p>Research clearly. Build deliberately.</p>
        </div>
      </nav>
    </header>
  );
}
