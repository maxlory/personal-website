import Link from "next/link";
import Image from "next/image";
import type { HomeEntry } from "@/content/home";

function CoverArt({ style }: { style: HomeEntry["coverStyle"] }) {
  if (style === "selected-builds") {
    return (
      <div className="cover-surface cover-selected-builds cover-photo">
        <Image
          src="/selected-builds-cover.png"
          alt=""
          fill
          sizes="(max-width: 959px) 100vw, 58vw"
          className="cover-photo-backdrop"
          aria-hidden="true"
        />
        <Image
          src="/selected-builds-cover.png"
          alt="Selected Builds cover"
          fill
          sizes="(max-width: 959px) 100vw, 58vw"
          className="cover-photo-image"
        />
      </div>
    );
  }

  if (style === "futures-ai") {
    return (
      <div className="cover-surface cover-futures-ai">
        <div className="cover-canvas cover-canvas-framed">
          <div className="cover-side-band" />
          <div className="cover-side-band right" />
          <div className="cover-showcase">
            <div className="cover-showcase-card cover-showcase-card-primary">
              <span className="cover-showcase-chip" />
              <span className="cover-showcase-glow" />
            </div>
            <div className="cover-showcase-card cover-showcase-card-glass">
              <span className="cover-showcase-pill" />
              <span className="cover-showcase-card-line" />
            </div>
            <div className="cover-showcase-card cover-showcase-card-soft">
              <span className="cover-showcase-phone" />
            </div>
            <div className="cover-showcase-card cover-showcase-card-cream">
              <span className="cover-showcase-card-line" />
              <span className="cover-showcase-card-line short" />
              <span className="cover-showcase-cta" />
            </div>
          </div>
          <div className="cover-fine-label cover-fine-label-dark">workflow lane</div>
        </div>
      </div>
    );
  }

  if (style === "ai-benchmark") {
    return (
      <div className="cover-surface cover-ai-benchmark">
        <div className="cover-canvas">
          <div className="cover-dot-field" />
          <div className="cover-benchmark-plaque">
            <span>Research</span>
            <span>Frame</span>
          </div>
          <div className="cover-benchmark-band" />
          <div className="cover-wordmark">benchmark</div>
          <div className="cover-fine-label cover-fine-label-light">signal over noise</div>
        </div>
      </div>
    );
  }

  if (style === "ai-workflow-character") {
    return (
      <div className="cover-surface cover-ai-workflow-character cover-photo">
        <Image
          src="/covers/ai-workflow-character.png"
          alt=""
          fill
          sizes="(max-width: 959px) 100vw, 58vw"
          className="cover-photo-backdrop cover-ai-workflow-character-backdrop"
          aria-hidden="true"
        />
        <div className="cover-ai-workflow-character-foreground">
          <Image
            src="/covers/ai-workflow-character.png"
            alt="AI Workflow cover"
            fill
            sizes="(max-width: 959px) 70vw, 40vw"
            className="cover-ai-workflow-character-image"
          />
        </div>
      </div>
    );
  }

  if (style === "story") {
    return (
      <div className="cover-surface cover-story">
        <div className="cover-canvas cover-story-layout">
          <div className="cover-story-kicker">01</div>
          <div className="cover-story-title">Story</div>
          <div className="cover-story-line" />
          <div className="cover-story-line short" />
          <div className="cover-story-line tiny" />
          <div className="cover-story-margin" />
        </div>
      </div>
    );
  }

  return (
    <div className="cover-surface cover-process">
      <div className="cover-canvas cover-process-layout">
        <div className="cover-process-node cover-process-node-first">
          <span className="cover-process-number">01</span>
          <span className="cover-process-block" />
        </div>
        <div className="cover-process-connector cover-process-connector-one" />
        <div className="cover-process-node cover-process-node-second">
          <span className="cover-process-number">02</span>
          <span className="cover-process-block" />
        </div>
        <div className="cover-process-connector cover-process-connector-two" />
        <div className="cover-process-node cover-process-node-third">
          <span className="cover-process-number">03</span>
          <span className="cover-process-block" />
        </div>
        <div className="cover-fine-label">method diagram</div>
      </div>
    </div>
  );
}

export default function HomeEntryCard({ entry }: { entry: HomeEntry }) {
  return (
    <Link href={entry.href} className={`entry-card placement-${entry.placement}`}>
      <div className="entry-cover-wrap">
        <CoverArt style={entry.coverStyle} />
      </div>
      <div className="entry-meta">
        <div className="entry-title-row">
          <h2 className="entry-title">{entry.title}</h2>
          <span className="entry-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
        <p className="entry-subtitle">{entry.subtitle}</p>
      </div>
    </Link>
  );
}
