import { expect, test } from "@playwright/test";

test("homepage motion layer is present in normal mode", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1005, height: 623 });
  await page.goto("/");

  const video = page.locator(".ei-hero-video");
  await expect(video).toHaveCount(1);
  await expect(video).toBeVisible();
  await expect(page.locator(".ei-hero-cta")).toContainText("View the work");

  const firstCard = page.locator("#work .ei-project-cell").first();
  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstCard).toHaveClass(/is-visible/);
});

test("homepage motion layer degrades to immediate content under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1005, height: 623 });
  await page.goto("/");
  await expect(page.locator("#work")).toBeVisible();

  await expect(page.locator(".ei-hero-video")).toHaveCount(0);
  await expect(page.locator("#work .ei-project-cell")).toHaveCount(5);
  await expect(page.locator("#work .ei-project-cell").first()).toHaveClass(
    /is-visible/,
  );

  const animatedInlineStyles = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#work [style]")).filter((el) =>
      /transform|opacity/i.test(el.getAttribute("style") ?? ""),
    ),
  );
  expect(animatedInlineStyles).toHaveLength(0);
});
