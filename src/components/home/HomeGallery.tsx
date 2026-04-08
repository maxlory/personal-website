import { homeContent } from "@/content/home";
import HomeEntryCard from "@/components/home/HomeEntryCard";

export default function HomeGallery() {
  return (
    <section id="work" className="section-frame mt-8 sm:mt-12">
      <div className="gallery-layout">
        {homeContent.entries.map((entry) => (
          <HomeEntryCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </section>
  );
}
