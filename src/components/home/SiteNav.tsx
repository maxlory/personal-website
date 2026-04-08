import Link from "next/link";
import type { NavItem } from "@/content/home";

export default function SiteNav({
  items,
  active,
}: {
  items: readonly NavItem[];
  active?: string;
}) {
  return (
    <nav className="site-nav enter-fade">
      <div className="nav-orb" aria-hidden="true">
        <span />
      </div>
      <div className="site-nav-links">
        {items.map((item) => {
          const isActive = active === item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav-link ${isActive ? "is-active" : ""} ${item.highlight ? "is-highlight" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
