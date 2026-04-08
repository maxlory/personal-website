import type { ReactNode } from "react";
import { siteNav } from "@/content/home";
import SiteNav from "@/components/home/SiteNav";

export default function DetailPageFrame({
  active,
  eyebrow,
  title,
  subtitle,
  note,
  children,
}: {
  active: "Work" | "Story" | "Process";
  eyebrow: string;
  title: string;
  subtitle: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <main className="page-shell detail-page-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />

      <section className="section-frame pt-6 sm:pt-8">
        <div className="detail-hero">
          <SiteNav items={siteNav} active={active} />
          <div className="detail-hero-copy enter-rise">
            <p className="section-kicker">{eyebrow}</p>
            <h1 className="detail-title">{title}</h1>
            <p className="detail-subtitle">{subtitle}</p>
            {note ? <p className="detail-note">{note}</p> : null}
          </div>
        </div>
      </section>

      <section className="section-frame detail-content">{children}</section>
    </main>
  );
}
