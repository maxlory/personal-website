import { expect, test } from "@playwright/test";

async function openUsage(page: import("@playwright/test").Page) {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Tokscale usage" });
  await section.getByRole("button", { name: "View usage details" }).click();
  return section;
}

test("expanded Usage preserves period controls and complete Contributions and Day Breakdown content", async ({
  page,
}) => {
  const section = await openUsage(page);

  const tabs = section.getByRole("tablist", { name: "Tokscale data views" });
  await expect(tabs.getByRole("tab", { name: "Usage" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(tabs.getByRole("tab", { name: "Models" })).toHaveAttribute(
    "aria-selected",
    "false",
  );

  const range = section.getByRole("group", { name: "Usage range" });
  for (const label of ["Lifetime", "30d", "7d"]) {
    await expect(range.getByRole("button", { name: label, exact: true })).toBeVisible();
  }

  const contributions = section.getByRole("figure", { name: "Contributions" });
  for (const text of ["Recent year", "active days", "Color", "Low", "High"]) {
    await expect(contributions.getByText(text, { exact: text !== "active days" })).toBeVisible();
  }
  await expect(contributions.getByRole("button", { name: "2D" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(contributions.getByRole("button", { name: "3D" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(contributions.getByLabel("Contribution graph color")).toBeVisible();

  const breakdown = section.getByRole("region", { name: "Day Breakdown" });
  for (const text of [
    "Total tokens",
    "Cost",
    "Messages",
    "Token categories",
    "Input",
    "Output",
    "Cache read",
    "Cache write",
    "Reasoning",
    "Clients and models",
  ]) {
    await expect(breakdown.getByText(text, { exact: true })).toBeVisible();
  }
  await expect(breakdown.locator("[data-client]").first()).toBeVisible();
  await expect(breakdown.locator("[data-model]").first()).toBeVisible();

  await range.getByRole("button", { name: "7d", exact: true }).click();
  await expect(range.getByRole("button", { name: "7d", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(contributions).toContainText(/active days/);

  const dates = contributions.locator("[data-contribution-date]");
  await expect(dates.first()).toBeVisible();
  await dates.last().focus();
  await dates.last().press("ArrowLeft");
  await expect(dates.nth(-2)).toBeFocused();
  const selectedDate = await dates.nth(-2).getAttribute("data-contribution-date");
  await dates.nth(-2).press("Enter");
  await expect(
    section.getByRole("region", { name: "Day Breakdown" }),
  ).toHaveAttribute("data-selected-date", selectedDate ?? "none");
});

test("Contributions renders the latest 12 months with month markers and Mon/Wed/Fri side labels", async ({
  page,
}) => {
  const section = await openUsage(page);
  const contributions = section.getByRole("figure", { name: "Contributions" });

  const monthMarkers = contributions.locator(".ei-tokscale-month-marker");
  await expect(monthMarkers.first()).toBeVisible();
  expect(await monthMarkers.count()).toBeGreaterThan(0);
  expect(
    await monthMarkers.first().textContent(),
  ).toMatch(/^[A-Z][a-z]{2}$/);

  const labels = contributions.locator(".ei-tokscale-day-labels");
  for (const label of ["Mon", "Wed", "Fri"]) {
    await expect(labels.getByText(label, { exact: true })).toBeVisible();
  }

  await expect(contributions.locator("[data-contribution-date]")).toHaveCount(365);
});

test("Day Breakdown header holds only label/date and totals are a separate block below it", async ({
  page,
}) => {
  const section = await openUsage(page);
  const breakdown = section.getByRole("region", { name: "Day Breakdown" });

  await expect(breakdown.locator("header .ei-tokscale-day-totals")).toHaveCount(0);
  await expect(breakdown.locator(".ei-tokscale-day-totals")).toHaveCount(1);
  await expect(breakdown.getByText("Total tokens", { exact: true })).toBeVisible();
  await expect(
    breakdown.locator("header").getByText("Total tokens", { exact: true }),
  ).toHaveCount(0);
});

test("disclosure toggle styles are scoped so nested controls keep compact geometry", async ({
  page,
}) => {
  const section = await openUsage(page);
  const disclosure = section.locator(".ei-tokscale-disclosure");
  const toggle = section.getByRole("button", { name: "View usage details" });
  const period = section
    .getByRole("group", { name: "Usage range" })
    .getByRole("button", { name: "Lifetime", exact: true });
  const view3d = section.getByRole("button", { name: "3D" });

  await expect(toggle).toHaveClass(/ei-tokscale-disclosure-toggle/);
  const disclosureWidth = (await disclosure.boundingBox())?.width ?? 0;
  const toggleWidth = (await toggle.boundingBox())?.width ?? 0;
  const periodWidth = (await period.boundingBox())?.width ?? 0;
  const view3dWidth = (await view3d.boundingBox())?.width ?? 0;
  expect(toggleWidth).toBeGreaterThanOrEqual(disclosureWidth - 2);
  expect(periodWidth).toBeLessThan(disclosureWidth / 2);
  expect(view3dWidth).toBeLessThan(disclosureWidth / 2);
  expect(await period.evaluate((node) => getComputedStyle(node).display)).not.toBe(
    "flex",
  );
});

test("Usage and Day Breakdown stay inside the viewport at 320 and 390", async ({
  page,
}) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 800 });
    const section = await openUsage(page);
    await expect(
      section.getByRole("figure", { name: "Contributions" }),
    ).toBeVisible();

    const metrics = await page.evaluate(() => ({
      pageScrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(metrics.pageScrollWidth).toBeLessThanOrEqual(metrics.viewport + 1);

    const sectionBox = (await section.boundingBox())!;
    expect(
      await section.evaluate((node) => node.scrollWidth - node.clientWidth),
    ).toBeLessThanOrEqual(1);

    for (const selector of [
      ".ei-tokscale-tabs",
      ".ei-tokscale-periods",
      ".ei-tokscale-view-toggle",
      ".ei-tokscale-day-totals",
      ".ei-tokscale-categories",
      ".ei-tokscale-client",
      ".ei-tokscale-client li",
    ]) {
      const rights = await section
        .locator(selector)
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getBoundingClientRect().right),
        );
      for (const right of rights) {
        expect(right).toBeLessThanOrEqual(sectionBox.x + sectionBox.width + 1);
      }
    }
  }
});

test("date grid uses role=group with a single roving tab stop", async ({
  page,
}) => {
  const section = await openUsage(page);
  const contributions = section.getByRole("figure", { name: "Contributions" });

  await expect(
    contributions.getByRole("group", { name: "Daily token contributions" }),
  ).toBeVisible();

  const tabbable = contributions.locator(
    '[data-contribution-date][tabindex="0"]',
  );
  await expect(tabbable).toHaveCount(1);
  await expect(tabbable).toHaveAttribute("aria-current", "date");

  await expect(contributions.locator(".ei-tokscale-calendar-pad").first()).toBeDisabled();

  const dates = contributions.locator("[data-contribution-date]");
  await dates.last().focus();
  await dates.last().press("ArrowLeft");
  await expect(dates.nth(-2)).toBeFocused();
});

test("3D view swaps the grid for an independent isometric SVG layer and back", async ({
  page,
}) => {
  const section = await openUsage(page);
  const contributions = section.getByRole("figure", { name: "Contributions" });
  const grid2d = contributions.locator(".ei-tokscale-date-grid");
  const isometric = contributions.locator(".ei-tokscale-isometric");

  await expect(grid2d).toBeVisible();
  await contributions.getByRole("button", { name: "3D" }).click();
  await expect(isometric).toBeVisible();
  await expect(grid2d).toBeHidden();
  await expect(
    isometric.getByRole("group", { name: "Isometric daily token contributions" }),
  ).toBeVisible();
  await expect(isometric.locator("svg").first()).toBeVisible();
  await expect(isometric.locator("[data-contribution-date]").first()).toBeVisible();
  await expect(
    isometric.locator('[data-contribution-date][tabindex="0"]'),
  ).toHaveCount(1);

  await contributions.getByRole("button", { name: "2D" }).click();
  await expect(grid2d).toBeVisible();
  await expect(isometric).toBeHidden();
});
