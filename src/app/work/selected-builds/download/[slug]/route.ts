import { selectedBuildsCase } from "@/content/selected-builds";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSelectedBuildsDocByDownloadSlug } from "@/lib/selected-builds";

export const dynamic = "force-static";

export function generateStaticParams() {
  return selectedBuildsCase.appendix.docs.map((doc) => ({
    slug: doc.downloadSlug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const doc = getSelectedBuildsDocByDownloadSlug(slug);

  if (!doc) {
    return new Response("Not found", { status: 404 });
  }

  const absolutePath = path.join(
    process.cwd(),
    "src/content/selected-builds-docs",
    doc.sourcePath
  );
  const content = await readFile(absolutePath, "utf8");
  const fileName = `${slug}.md`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
