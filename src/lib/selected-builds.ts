import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import {
  selectedBuildsNavItems,
  selectedBuildsCase,
  type SelectedBuildsAppendixDoc,
  type SelectedBuildsNavItem,
} from "@/content/selected-builds";

export type SelectedBuildsAppendixDocWithContent = SelectedBuildsAppendixDoc & {
  content: string | null;
  lineCount: number;
  charCount: number;
};

async function readAppendixDoc(
  doc: SelectedBuildsAppendixDoc
): Promise<SelectedBuildsAppendixDocWithContent> {
  const absolutePath = path.join(
    process.cwd(),
    "src/content/selected-builds-docs",
    doc.sourcePath
  );
  const content = await readFile(absolutePath, "utf8");
  const lineCount = content.split(/\r?\n/).length;
  const charCount = content.replace(/\s+/g, "").length;

  return {
    ...doc,
    content: doc.renderMode === "inline" ? content : null,
    lineCount,
    charCount,
  };
}

export const getSelectedBuildsAppendixDocs = cache(async () => {
  return Promise.all(selectedBuildsCase.appendix.docs.map(readAppendixDoc));
});

export function getSelectedBuildsDocByDownloadSlug(slug: string) {
  return selectedBuildsCase.appendix.docs.find((doc) => doc.downloadSlug === slug);
}

export function getSelectedBuildsNavigationGroups(): {
  label: SelectedBuildsNavItem["group"];
  items: SelectedBuildsNavItem[];
}[] {
  const order: SelectedBuildsNavItem["group"][] = [
    "主内容",
    "东方财富 Skills",
    "WindClaw",
  ];

  return order.map((label) => ({
    label,
    items: selectedBuildsNavItems.filter((item) => item.group === label),
  }));
}
