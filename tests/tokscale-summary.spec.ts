import { expect, test } from "@playwright/test";

test("Tokscale Summary sits after Project Index and before Connect with an accessible disclosure", async ({
  page,
}) => {
  await page.goto("/");

  const work = page.locator("#work");
  const summary = page.getByRole("region", { name: "Tokscale usage" });
  const connect = page.locator("#connect");

  await expect(work).toBeVisible();
  await expect(summary).toBeVisible();
  await expect(connect).toBeVisible();

  const order = await page.locator("#work, [aria-label='Tokscale usage'], #connect").evaluateAll(
    (elements) => elements.map((element) => element.id || element.getAttribute("aria-label")),
  );
  expect(order).toEqual(["work", "Tokscale usage", "connect"]);

  for (const label of [
    "All-time tokens",
    "All-time cost",
    "Active days (1y)",
    "All submissions",
  ]) {
    await expect(summary.getByText(label, { exact: true })).toBeVisible();
  }

  const disclosure = summary.getByRole("button", { name: "View usage details" });
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  await disclosure.focus();
  await expect(disclosure).toBeFocused();
  await disclosure.press("Enter");
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
});
