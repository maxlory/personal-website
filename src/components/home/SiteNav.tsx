import Link from "next/link";
import type { NavItem } from "@/content/home";

export default function SiteNav({
  items,
  active,
}: {
  items: readonly NavItem[];
  active?: string;
}) {
  const visibleItems = items.filter((item) => !item.isDraft);

  return (
    <nav className="site-nav enter-fade">
      <div className="nav-orb" aria-hidden="true">
        <span />
      </div>
      <div className="site-nav-links">
        {visibleItems.map((item) => {
          const isActive = active === item.label;
          const className = `site-nav-link ${isActive ? "is-active" : ""} ${item.highlight ? "is-highlight" : ""}`;
          const shouldUseAnchor =
            item.href.startsWith("http") ||
            item.href.startsWith("mailto:") ||
            item.href.endsWith(".pdf");

          if (shouldUseAnchor) {
            return (
              <a
                key={item.href}
                href={item.href}
                className={className}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={className}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
