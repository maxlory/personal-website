import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const pages = [
  "",
  "/story",
  "/process",
  "/work/profile",
  "/work/selected-builds",
  "/work/ai-workflow",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `https://www.sutianrun.com${path}`,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : path.startsWith("/work/") ? 0.8 : 0.7,
  }));
}
