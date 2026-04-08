import { homeContent, siteNav } from "@/content/home";
import SiteNav from "@/components/home/SiteNav";

export default function HomeHero() {
  const { hero } = homeContent;

  return (
    <section className="section-frame pt-6 sm:pt-8">
      <div className="home-hero">
        <SiteNav items={siteNav} active="Work" />

        <div className="hero-copy enter-rise">
          <p className="section-kicker">{hero.eyebrow}</p>
          <h1 className="hero-name">
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-summary">{hero.summary}</p>
          <p className="hero-note">{hero.intro}</p>
        </div>
      </div>
    </section>
  );
}
