import { homeContent } from "@/content/home";

export default function HomeConnect() {
  const year = new Date().getFullYear();
  const { connect } = homeContent;

  return (
    <section id="connect" className="section-frame mt-16 pb-10 sm:pb-14">
      <div className="paper-panel enter-rise px-5 py-6 sm:px-7 sm:py-7">
        <div className="connect-strip">
          <div>
            <p className="section-kicker">{connect.eyebrow}</p>
            <h2 className="connect-title mt-4">
              {connect.title}
            </h2>
            <p className="connect-summary mt-4">
              {connect.summary}
            </p>
          </div>

          <div className="grid gap-3">
            {connect.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                download={"download" in link ? link.download : undefined}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="connect-row"
              >
                <span className="section-kicker">{link.label}</span>
                <span className="text-base font-medium text-[var(--foreground)]">
                  {link.value}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-soft)] pt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          © {year} Su Tianrun
        </div>
      </div>
    </section>
  );
}
