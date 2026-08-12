import { expect, test, type Page } from "@playwright/test";

async function openModels(page: Page) {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Tokscale usage" });
  await section.getByRole("button", { name: "View usage details" }).click();
  const modelsTab = section.getByRole("tab", { name: "Models" });
  await modelsTab.click();
  return { section, modelsTab };
}

function parseCompactNumber(text: string): number {
  const value = text.replace(/[$,]/g, "");
  if (value.endsWith("T")) return parseFloat(value) * 1e12;
  if (value.endsWith("B")) return parseFloat(value) * 1e9;
  if (value.endsWith("M")) return parseFloat(value) * 1e6;
  if (value.endsWith("K")) return parseFloat(value) * 1e3;
  return parseFloat(value);
}

test("Usage/Models tabs support keyboard navigation, roving tabindex, and ARIA wiring", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Tokscale usage" });
  await section.getByRole("button", { name: "View usage details" }).click();

  const tablist = section.getByRole("tablist", { name: "Tokscale data views" });
  const usageTab = tablist.getByRole("tab", { name: "Usage" });
  const modelsTab = tablist.getByRole("tab", { name: "Models" });

  await expect(usageTab).toHaveAttribute("aria-selected", "true");
  await expect(usageTab).toHaveAttribute("tabindex", "0");
  await expect(modelsTab).toHaveAttribute("aria-selected", "false");
  await expect(modelsTab).toHaveAttribute("tabindex", "-1");

  const usagePanelId = await usageTab.getAttribute("aria-controls");
  const modelsPanelId = await modelsTab.getAttribute("aria-controls");
  const usagePanel = section.locator(`[id="${usagePanelId}"]`);
  const modelsPanel = section.locator(`[id="${modelsPanelId}"]`);
  await expect(usagePanel).toHaveAttribute(
    "aria-labelledby",
    (await usageTab.getAttribute("id")) ?? "",
  );
  await expect(modelsPanel).toHaveAttribute(
    "aria-labelledby",
    (await modelsTab.getAttribute("id")) ?? "",
  );
  await expect(usagePanel).toBeVisible();
  await expect(modelsPanel).toBeHidden();

  await modelsTab.focus();
  await modelsTab.press("ArrowLeft");
  await expect(usageTab).toBeFocused();
  await expect(usageTab).toHaveAttribute("aria-selected", "true");
  await expect(modelsTab).toHaveAttribute("aria-selected", "false");

  await usageTab.press("End");
  await expect(modelsTab).toBeFocused();
  await expect(modelsTab).toHaveAttribute("aria-selected", "true");
  await expect(modelsTab).toHaveAttribute("tabindex", "0");
  await expect(usageTab).toHaveAttribute("tabindex", "-1");
  await expect(modelsPanel).toBeVisible();

  await modelsTab.press("Home");
  await expect(usageTab).toBeFocused();
  await expect(usageTab).toHaveAttribute("aria-selected", "true");

  await usageTab.press("ArrowRight");
  await expect(modelsTab).toBeFocused();
  await expect(modelsTab).toHaveAttribute("aria-selected", "true");
});

test("Models tab shows every non-synthetic model sorted by cost descending", async ({
  page,
}) => {
  const { section } = await openModels(page);

  const table = section.getByRole("table");
  await expect(table).toBeVisible();

  const headers = table.locator("thead th");
  await expect(headers).toHaveCount(4);
  await expect(headers.nth(0)).toHaveText("Model");
  await expect(headers.nth(1)).toHaveText("Tokens");
  await expect(headers.nth(2)).toHaveText("Cost");
  await expect(headers.nth(3)).toHaveText("Share");

  const rows = table.locator("tbody tr");
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThan(0);

  const modelNames = await rows.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-model")),
  );
  expect(modelNames.every((name) => name !== "<synthetic>")).toBeTruthy();

  const costs = (await rows.locator('[data-label="Cost"]').allTextContents()).map(
    parseCompactNumber,
  );
  for (let index = 1; index < costs.length; index += 1) {
    expect(costs[index]! <= costs[index - 1]!).toBeTruthy();
  }

  const shareTexts = await rows.locator('[data-label="Share"]').allTextContents();
  for (const text of shareTexts) {
    expect(text).toMatch(/^\d+\.\d%$/);
  }

  await expect(rows.first().locator(".ei-tokscale-model-marker")).toHaveCount(1);
  const markerColor = await rows
    .first()
    .locator(".ei-tokscale-model-marker")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(markerColor).not.toBe("rgba(0, 0, 0, 0)");
});

test("Models table re-scopes to the shared Lifetime/30d/7d range controls", async ({
  page,
}) => {
  const { section } = await openModels(page);
  const table = section.getByRole("table");
  const range = section.getByRole("group", { name: "Usage range" });

  const lifetimeNames = await table
    .locator("tbody tr")
    .evaluateAll((rows) => rows.map((row) => row.getAttribute("data-model")));

  await range.getByRole("button", { name: "7d", exact: true }).click();
  await expect(
    range.getByRole("button", { name: "7d", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");

  const weekNames = await table
    .locator("tbody tr")
    .evaluateAll((rows) => rows.map((row) => row.getAttribute("data-model")));
  expect(weekNames.length).toBeGreaterThan(0);
  expect(weekNames.length).toBeLessThanOrEqual(lifetimeNames.length);
  for (const modelName of weekNames) {
    expect(lifetimeNames).toContain(modelName);
  }

  const weekCosts = (await table.locator('[data-label="Cost"]').allTextContents()).map(
    parseCompactNumber,
  );
  for (let index = 1; index < weekCosts.length; index += 1) {
    expect(weekCosts[index]! <= weekCosts[index - 1]!).toBeTruthy();
  }

  await range.getByRole("button", { name: "Lifetime", exact: true }).click();
  const restored = await table
    .locator("tbody tr")
    .evaluateAll((rows) => rows.map((row) => row.getAttribute("data-model")));
  expect(restored).toEqual(lifetimeNames);
});

test("mobile Models table scrolls inside its own container without page-level overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { section } = await openModels(page);
  const table = section.getByRole("table");
  await expect(table).toBeVisible();

  const scroller = section.locator(".ei-tokscale-models-scroll");
  await expect(scroller).toBeVisible();
  const overflowX = await scroller.evaluate(
    (node) => getComputedStyle(node).overflowX,
  );
  expect(["auto", "scroll"]).toContain(overflowX);

  const dimensions = await scroller.evaluate((node) => ({
    clientWidth: node.clientWidth,
    scrollWidth: node.scrollWidth,
    right: node.getBoundingClientRect().right,
    viewport: window.innerWidth,
    pageScrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);
  expect(dimensions.right).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.pageScrollWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
});
