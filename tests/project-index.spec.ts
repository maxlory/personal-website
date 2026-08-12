import { expect, test, type Page } from "@playwright/test";

/**
 * PW-R2 Project Index browser seam (second browser-review revision).
 *
 * The homepage Work section (#work) exposes exactly the five formal project
 * entries as standard links in the approved PW-R2 order: 财务 Skills 协作实战,
 * 人机协同工作案例, AI 工作流与实践, AI 产品评测与判断, and AI Enablement
 * last. Routes are unchanged from the original pages; only the presentation
 * order and the first two titles moved. The hero rail mirrors the same order.
 * The Work section stays a strict 3+2 grid: row 1 has three equal cells
 * (data-project-role="grid-a"), row 2 has two equal cells
 * (data-project-role="grid-b").
 */

const FORMAL_WORK_ROUTES = [
  "/work/finance-skills",
  "/work/develop-harness",
  "/work/ai-benchmark",
  "/work/selected-builds",
  "/work/futures-ai",
] as const;

const WORK_TITLES = [
  "财务 Skills 协作实战",
  "人机协同工作案例",
  "AI 工作流与实践",
  "AI 产品评测与判断",
  "AI Enablement",
] as const;

async function gotoHome(page: Page) {
  await page.goto("/");
  await expect(page.locator("#work")).toBeVisible();
}

async function assertNoPageOverflow(page: Page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);
}

test("homepage Work section exposes five formal project entries in the approved order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  await gotoHome(page);

  const entries = page.locator('#work a[href^="/work/"]');
  await expect(entries).toHaveCount(5);

  const routes = await entries.evaluateAll((els) =>
    els.map((el) => el.getAttribute("href")),
  );
  expect(routes).toEqual([...FORMAL_WORK_ROUTES]);

  for (const route of FORMAL_WORK_ROUTES) {
    const entry = page.locator(`#work a[href="${route}"]`);
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute("href", route);
  }

  for (let i = 0; i < WORK_TITLES.length; i += 1) {
    await expect(entries.nth(i).locator(".ei-project-title")).toHaveText(
      WORK_TITLES[i],
    );
  }
  await assertNoPageOverflow(page);
});

test("desktop project index is a strict 3+2 grid with equal cells per row", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  await gotoHome(page);

  const placed = page.locator('#work a[data-project-role]');
  await expect(placed).toHaveCount(5);

  const roles = await placed.evaluateAll((els) =>
    els.map((el) => el.getAttribute("data-project-role")),
  );
  expect(roles).toEqual(["grid-a", "grid-a", "grid-a", "grid-b", "grid-b"]);

  const boxes = await placed.evaluateAll((els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }),
  );

  // Row 1: three equal cells share top, width and height.
  for (const box of boxes.slice(0, 3)) {
    expect(Math.abs(box.top - boxes[0].top)).toBeLessThanOrEqual(1);
    expect(Math.abs(box.width - boxes[0].width)).toBeLessThanOrEqual(1);
    expect(Math.abs(box.height - boxes[0].height)).toBeLessThanOrEqual(1);
  }
  // Row 2: two equal cells share top, width and height.
  expect(Math.abs(boxes[3].top - boxes[4].top)).toBeLessThanOrEqual(1);
  expect(Math.abs(boxes[3].width - boxes[4].width)).toBeLessThanOrEqual(1);
  expect(Math.abs(boxes[3].height - boxes[4].height)).toBeLessThanOrEqual(1);
  // Row 2 starts after row 1; no single card dominates the grid width.
  expect(boxes[3].top).toBeGreaterThanOrEqual(boxes[2].bottom - 1);
  expect(Math.max(...boxes.map((box) => box.width))).toBeLessThanOrEqual(
    Math.round(1005 * 0.55),
  );

  await assertNoPageOverflow(page);
});

test("hero index is a large two-column rail at the review viewport with AI Enablement last", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  await gotoHome(page);

  const rail = page.locator(".ei-index-rail");
  await expect(rail).toBeVisible();
  const list = rail.locator("ol");
  const items = list.locator("li");
  await expect(items).toHaveCount(5);

  const tracks = await list.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      display: style.display,
      trackCount: style.gridTemplateColumns.split(" ").filter(Boolean).length,
    };
  });
  expect(tracks.display).toBe("grid");
  expect(tracks.trackCount).toBe(2);

  const boxes = await items.evaluateAll((els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        bottom: Math.round(rect.bottom),
        right: Math.round(rect.right),
      };
    }),
  );
  expect(boxes[0].top).toBe(boxes[1].top);
  expect(boxes[2].top).toBe(boxes[3].top);
  expect(boxes[0].left).toBeLessThan(boxes[1].left);
  expect(boxes[2].left).toBeLessThan(boxes[3].left);

  // PW-R2: the hero rail exposes the same five routes and titles in exactly
  // the same order as the Work section.
  const railRoutes = await items.evaluateAll((els) =>
    els.map((el) => el.querySelector("a")?.getAttribute("href") ?? null),
  );
  expect(railRoutes).toEqual([...FORMAL_WORK_ROUTES]);
  const railTitles = await items.evaluateAll((els) =>
    els.map(
      (el) => el.querySelector(".ei-rail-name")?.textContent?.trim() ?? "",
    ),
  );
  expect(railTitles).toEqual([...WORK_TITLES]);

  // The whole index fits on the first screen at the 623px review height.
  for (const box of boxes) {
    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(623);
  }

  // AI Enablement is the fifth and final rail entry in the new order.
  const last = items.nth(4);
  await expect(last).toContainText("AI Enablement");
  await expect(last.locator("a")).toHaveAttribute("href", "/work/futures-ai");

  await assertNoPageOverflow(page);
});

test("mobile collapses the hero index to one column and stacks the work entries vertically", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await gotoHome(page);

  const list = page.locator(".ei-index-rail ol");
  const trackCount = await list.evaluate(
    (el) =>
      getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length,
  );
  expect(trackCount).toBe(1);

  const railBoxes = await list.locator("li").evaluateAll((els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    }),
  );
  for (let i = 1; i < railBoxes.length; i += 1) {
    expect(railBoxes[i].top).toBeGreaterThanOrEqual(railBoxes[i - 1].bottom - 1);
  }

  const entries = page.locator('#work a[href^="/work/"]');
  await expect(entries).toHaveCount(5);
  const workBoxes = await entries.evaluateAll((els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    }),
  );
  for (let i = 1; i < workBoxes.length; i += 1) {
    expect(workBoxes[i].top).toBeGreaterThanOrEqual(workBoxes[i - 1].bottom - 1);
  }

  await assertNoPageOverflow(page);
});

test("keyboard reaches title, type and outcome for every entry without hover", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  await gotoHome(page);

  const entries = page.locator('#work a[href^="/work/"]');
  await expect(entries).toHaveCount(5);

  for (let i = 0; i < FORMAL_WORK_ROUTES.length; i += 1) {
    const entry = entries.nth(i);
    await expect(entry.locator(".ei-project-title")).toBeVisible();
    await expect(entry.locator(".ei-project-type")).toBeVisible();
    await expect(entry.locator(".ei-project-outcome")).toBeVisible();
    await expect(entry.locator(".ei-project-title")).not.toHaveText(/^\s*$/);
    await expect(entry.locator(".ei-project-type")).not.toHaveText(/^\s*$/);
    await expect(entry.locator(".ei-project-outcome")).not.toHaveText(/^\s*$/);
  }

  await page.evaluate(() =>
    (document.activeElement as HTMLElement | null)?.blur(),
  );
  const seen = new Set<string>();
  for (let i = 0; i < 40; i += 1) {
    await page.keyboard.press("Tab");
    const href = await page.evaluate(() => {
      const el = document.activeElement;
      return el instanceof HTMLAnchorElement ? el.getAttribute("href") : null;
    });
    if (href) {
      seen.add(href);
    }
  }
  for (const route of FORMAL_WORK_ROUTES) {
    expect(seen.has(route)).toBe(true);
  }
});

test("reduced motion keeps the static index and Finance/Develop covers expose native content labels", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1005, height: 623 });
  await gotoHome(page);

  const entries = page.locator('#work a[href^="/work/"]');
  await expect(entries).toHaveCount(5);

  for (const route of FORMAL_WORK_ROUTES) {
    const entry = page.locator(`#work a[href="${route}"]`);
    await expect(entry).toBeVisible();
    await expect(entry.locator(".ei-project-title")).toBeVisible();
    await expect(entry.locator(".ei-project-type")).toBeVisible();
    await expect(entry.locator(".ei-project-outcome")).toBeVisible();
  }

  const finance = page.locator('#work a[href="/work/finance-skills"]');
  await expect(finance.locator(".ei-project-cover-ledger")).toContainText("7 环节");
  await expect(finance.locator(".ei-project-cover-ledger")).toContainText("30 Skills");
  await expect(finance.locator(".ei-project-cover-ledger")).toContainText("月末财务包");

  const develop = page.locator('#work a[href="/work/develop-harness"]');
  for (const label of ["Intent", "Build", "Review", "Verify"]) {
    await expect(develop.locator(".ei-project-cover-systems")).toContainText(label);
  }

  const animatedInlineStyles = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#work [style]")).filter((el) =>
      /transform|opacity/i.test(el.getAttribute("style") ?? ""),
    ),
  );
  expect(animatedInlineStyles.length).toBe(0);

  await assertNoPageOverflow(page);
});
