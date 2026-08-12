import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * PW-R1 Develop flow-and-roles Red seam (PW-04 revision per user review).
 *
 * The Develop page keeps the A-share research-report background, the four
 * synchronous problems, the eight flow phases, return paths and the
 * four-role control plane, but internal task ids are de-professionalized:
 * the project background tickets are A/B/C/D, no visible "RA-" task number
 * remains on the page, and role evidence states use generic labels
 * (已实跑 / 仅有契约 / 流程契约) while the proven-vs-contract distinction
 * stays exact.
 *
 * A new accessible collaboration flywheel sits beside the background summary
 * and explains the loop 用户目标 → 主会话决策与分派 → 低模型子会话 / Subagent
 * 实现 → 证据验证 → 回到主会话. Its motion only expresses the loop and is
 * static under prefers-reduced-motion.
 */

const DEVELOP_ROUTE = "/work/develop-harness";

const FOUR_PROBLEMS = [
  "用户点击生成后，只能等待整份报告一次成功或失败。",
  "一个组件证据不足，会让已经完成的内容一起无法交付。",
  "页面刷新或服务重启后，用户无法继续观察原任务。",
  "失败后只能重跑整份报告，不能只重试失败组件。",
] as const;

const FLOW_PHASES = [
  "Intent",
  "Spec",
  "Ticket",
  "Red",
  "Green",
  "Review",
  "Verification",
  "UAT",
] as const;

const RETURN_PATHS = [
  "审查发现问题",
  "验证失败",
  "需求变化",
  "发现故障",
] as const;

const FALLBACK_GROUPS = ["准备", "定义", "实现", "检查", "交付"] as const;

const ROLE_FACT_LABELS = ["负责环节", "收到", "交回", "写入权限"] as const;

const ROLES = [
  {
    name: "主会话 / Sol",
    phases: "Intent、Spec、Ticket、Gate、范围审计",
    receives: "用户目标、当前代码、各角色的结构化报告",
    returns: "任务说明、通过或退回决定、本地提交",
    writing: "默认不与 DeepSeek 同时写代码",
    status: "流程契约",
    evidence: "contract",
  },
  {
    name: "DeepSeek",
    phases: "Red、Green、review finding fix",
    receives: "冻结的 Task Brief、允许路径、验证命令",
    returns: "改动文件、执行命令、测试证据、未解决项",
    writing: "可以，单一写者",
    status: "已实跑",
    evidence: "proven",
  },
  {
    name: "Terra",
    phases: "Diagnose、Review",
    receives: "冻结规格、代码差异、测试与证据包",
    returns: "按严重程度排列的 findings 或通过结论",
    writing: "不写产品代码",
    status: "仅有契约",
    evidence: "contract",
  },
  {
    name: "Luna",
    phases: "上下文扫描、DeepSeek 协调、Verification",
    receives: "任务说明、当前代码指纹、验证清单",
    returns: "子任务报告、验证结果、证据摘要",
    writing: "不接管产品代码",
    status: "已实跑",
    evidence: "proven",
  },
] as const;

async function sectionByHeading(page: Page, name: string): Promise<Locator> {
  const heading = page.getByRole("heading", { name });
  await expect(heading).toBeVisible();
  return page.locator("section").filter({ has: heading });
}

async function assertNoPageOverflow(page: Page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);
}

async function blockFlowCdn(page: Page) {
  await page.route("**cdn.jsdelivr.net/**", (route) => route.abort());
}

test("formal /work/develop-harness explains background and four problems, then tickets A/B/C/D with no RA- task ids", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();
  await assertNoPageOverflow(page);

  const background = await sectionByHeading(page, "项目背景");

  // AC-D01: the plain-language program explanation comes first.
  await expect(
    background.getByText(/面向 A 股业绩点评的投研程序/).first(),
  ).toBeVisible();
  await expect(
    background.getByText(/由受控 Writer 生成多组件 Markdown 研报/).first(),
  ).toBeVisible();

  // The four synchronous-flow problems stay the readable entry.
  const problemBoxes: (Awaited<ReturnType<Locator["boundingBox"]>>)[] = [];
  for (const problem of FOUR_PROBLEMS) {
    const item = background.getByText(problem).first();
    await expect(item).toBeVisible();
    problemBoxes.push(await item.boundingBox());
  }

  // Project background tickets are the de-professionalized A/B/C/D ids,
  // placed after the readable problems, and no RA- number is user-visible.
  const ticketIds = background.locator(".develop-tickets b");
  await expect(ticketIds).toHaveText(["A", "B", "C", "D"]);
  const firstTicketBox = await ticketIds.first().boundingBox();

  expect(problemBoxes[3]).not.toBeNull();
  expect(firstTicketBox).not.toBeNull();
  expect(firstTicketBox!.y).toBeGreaterThan(
    problemBoxes[3]!.y + problemBoxes[3]!.height - 1,
  );

  await expect(page.locator("body")).not.toContainText(/RA-\d/);
});

test("hero subtitle uses the approved generic collaboration wording and drops the old role sentence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  await expect(
    page
      .getByText(
        "主会话负责决策与任务分派，低模型子会话和 Subagent 负责实现，再用验证证据决定继续、退回或完成。",
      )
      .first(),
  ).toBeVisible();

  // The user-approved wording replaces the old role-binding sentence; the old
  // sentence must no longer be user-visible anywhere on the Develop page.
  await expect(page.locator("body")).not.toContainText(
    "主会话掌握决定，DeepSeek 写代码，Terra 独立检查，Luna 协调和验证。",
  );
});

test("Develop case H1 renders exactly two lines with the approved em dash", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const h1 = page.getByRole("heading", {
    level: 1,
    name: "Develop流程 —人机协同工作",
  });
  await expect(h1).toBeVisible();

  // PW-R2: the H1 text is exactly the two approved lines, separated by a
  // literal newline carrying the em dash "—" on the second line.
  const text = await h1.evaluate((el) => el.textContent ?? "");
  expect(text).toBe("Develop流程\n—人机协同工作");
  expect(text.split("\n")).toEqual(["Develop流程", "—人机协同工作"]);

  // The title renders as two visual lines via a safe white-space rule, and
  // the old single-line title is gone from the page.
  const whiteSpace = await h1.evaluate((el) => getComputedStyle(el).whiteSpace);
  expect(whiteSpace).toBe("pre-line");
  const lineRects = await h1.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return Array.from(range.getClientRects())
      .filter((rect) => rect.width > 1 && rect.height > 1)
      .map((rect) => ({ y: rect.y, height: rect.height }));
  });
  expect(lineRects.length).toBe(2);
  // The two line boxes sit on separate rows (line 2 starts after line 1).
  expect(lineRects[1].y).toBeGreaterThan(lineRects[0].y);

  await expect(page.locator("body")).not.toContainText("Develop 流程与角色控制面");
});

test("flow panorama exposes Intent, Spec, Ticket, Red, Green, Review, Verification and UAT with return paths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const flow = await sectionByHeading(page, "流程全景");

  // AC-D02: all eight frozen phase names are present.
  for (const phase of FLOW_PHASES) {
    await expect(flow.getByText(phase).first()).toBeVisible();
  }

  // AC-D02: failing work returns to the earliest evidence-gap stage, shown by
  // explicit return-path labels plus the plain-language reading rule.
  for (const path of RETURN_PATHS) {
    await expect(flow.getByText(path).first()).toBeVisible();
  }
  await expect(
    flow
      .getByText("发现问题就回到最早需要补证据的环节，不必从头重做。")
      .first(),
  ).toBeVisible();
});

test("blocking the external flow CDN keeps a readable fallback with all five phase groups", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  await blockFlowCdn(page);
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const flow = await sectionByHeading(page, "流程全景");

  for (const group of FALLBACK_GROUPS) {
    await expect(flow.getByText(group, { exact: true }).first()).toBeVisible();
  }
  await expect(
    flow
      .getByText("发现问题就回到最早需要补证据的环节，不必从头重做。")
      .first(),
  ).toBeVisible();
  await assertNoPageOverflow(page);
});

test("keyboard role selection exposes the four-role contract with responsibility, receives, returns, write and generic evidence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const routing = await sectionByHeading(page, "谁来执行");

  for (const role of ROLES) {
    const button = routing.getByRole("button", { name: role.name });
    await expect(button).toBeVisible();
    await button.focus();
    await expect(button).toBeFocused();
    await page.keyboard.press("Enter");
    await expect
      .poll(async () => {
        const state = await button.evaluate((el) => ({
          selected: el.getAttribute("aria-selected"),
          current: el.getAttribute("aria-current"),
        }));
        return (
          state.selected === "true" ||
          (state.current !== null && state.current !== "false")
        );
      })
      .toBe(true);

    await expect(
      routing.getByRole("heading", { name: role.name }),
    ).toBeVisible();
    for (const label of ROLE_FACT_LABELS) {
      await expect(routing.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(
      routing.getByText(role.phases, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      routing.getByText(role.receives, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      routing.getByText(role.returns, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      routing.getByText(role.writing, { exact: true }).first(),
    ).toBeVisible();

    // AC-D04: the role exposes its evidence status as its own generic label.
    await expect(
      routing.getByText(role.status, { exact: true }).first(),
    ).toBeVisible();
  }
});

test("contract and observed evidence stay distinct with generic statuses", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const routing = await sectionByHeading(page, "谁来执行");

  const deepseek = routing.getByRole("button", { name: "DeepSeek" });
  const terra = routing.getByRole("button", { name: "Terra" });
  const luna = routing.getByRole("button", { name: "Luna" });

  // Observed evidence (DeepSeek and Luna) uses 已实跑; Terra's label is
  // contract-only, and the main session owns the gate as 流程契约.
  await expect(deepseek).toContainText("已实跑");
  await expect(terra).toContainText("契约");
  await expect(terra).not.toContainText("已实跑");
  await expect(luna).toContainText("已实跑");
  await expect(
    routing.getByText("流程契约", { exact: true }).first(),
  ).toBeVisible();

  await terra.focus();
  await page.keyboard.press("Enter");
  await expect(routing.getByRole("heading", { name: "Terra" })).toBeVisible();
  await expect(
    routing.getByText("仅有契约", { exact: true }).first(),
  ).toBeVisible();
  for (const label of ROLE_FACT_LABELS) {
    await expect(routing.getByText(label, { exact: true })).toBeVisible();
  }
});

test("collaboration flywheel sits beside the background and names all four loop nodes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const background = await sectionByHeading(page, "项目背景");
  const copy = background.locator(".develop-context-copy").first();
  const flywheel = page.getByRole("complementary", { name: /协作飞轮/ });
  await expect(flywheel).toBeVisible();

  for (const node of [
    "用户目标",
    "主会话决策与分派",
    "低模型子会话 / Subagent 实现",
    "证据验证",
  ]) {
    await expect(flywheel.getByText(node).first()).toBeVisible();
  }
  await expect(flywheel.getByText(/回到主会话/).first()).toBeVisible();

  // The flywheel is beside (not below) the background summary on desktop.
  const copyBox = await copy.boundingBox();
  const flywheelBox = await flywheel.boundingBox();
  expect(copyBox).not.toBeNull();
  expect(flywheelBox).not.toBeNull();
  expect(flywheelBox!.x).toBeGreaterThanOrEqual(
    copyBox!.x + copyBox!.width - 1,
  );
  expect(flywheelBox!.y).toBeLessThan(copyBox!.y + copyBox!.height);

  await assertNoPageOverflow(page);
});

test("flywheel loop animation runs normally and is static under reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  await page.goto(DEVELOP_ROUTE);

  const spin = page.locator(".develop-flywheel-spin");
  await expect(spin).toBeVisible();
  const normalName = await spin.evaluate(
    (el) => getComputedStyle(el).animationName,
  );
  expect(normalName).not.toBe("none");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(
    page.getByRole("complementary", { name: /协作飞轮/ }),
  ).toBeVisible();
  const reducedName = await spin.evaluate(
    (el) => getComputedStyle(el).animationName,
  );
  expect(reducedName).toBe("none");
});

test("flywheel nodes are shrunken, symmetric and quadrant-aligned around the orbit center", async ({
  page,
}) => {
  const viewports = [
    { width: 1280, height: 623 },
    { width: 1005, height: 623 },
  ] as const;

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    const response = await page.goto(DEVELOP_ROUTE);
    expect(response?.ok()).toBeTruthy();

    const flywheel = page.getByRole("complementary", { name: /协作飞轮/ });
    await expect(flywheel).toBeVisible();
    for (const nodeName of [
      "用户目标",
      "主会话决策与分派",
      "低模型子会话 / Subagent 实现",
      "证据验证",
    ]) {
      await expect(flywheel.getByText(nodeName).first()).toBeVisible();
    }

    const orbit = flywheel.locator(".develop-flywheel-orbit");
    const nodes = flywheel.locator(".develop-flywheel-node");
    await expect(nodes).toHaveCount(4);

    const orbitBox = await orbit.boundingBox();
    expect(orbitBox).not.toBeNull();

    const nodeBoxes: NonNullable<
      Awaited<ReturnType<Locator["boundingBox"]>>
    >[] = [];
    for (let i = 0; i < 4; i += 1) {
      const box = await nodes.nth(i).boundingBox();
      expect(box, `node ${i + 1} box`).not.toBeNull();
      nodeBoxes.push(box!);
    }

    // PW-R2 review-fix: all four cards share one explicit block size, so the
    // widths and heights must be equal across the four nodes within 1px, and
    // the height stays in the compact 5.2-5.8rem band (~83-93px) instead of
    // the old ~105px tall cards (01/04 vs 02/03 height mismatch).
    for (const box of nodeBoxes) {
      expect(Math.abs(box.width - nodeBoxes[0].width)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.height - nodeBoxes[0].height)).toBeLessThanOrEqual(1);
      expect(box.height).toBeGreaterThanOrEqual(83);
      expect(box.height).toBeLessThanOrEqual(93);
    }

    const centerX = (box: { x: number; width: number }) =>
      box.x + box.width / 2;
    const centerY = (box: { y: number; height: number }) =>
      box.y + box.height / 2;
    const orbitCenterX = centerX(orbitBox!);
    const orbitCenterY = centerY(orbitBox!);

    // 01/03 share x and 02/04 share x (left/right columns).
    expect(Math.abs(centerX(nodeBoxes[0]) - centerX(nodeBoxes[2]))).toBeLessThanOrEqual(2);
    expect(Math.abs(centerX(nodeBoxes[1]) - centerX(nodeBoxes[3]))).toBeLessThanOrEqual(2);
    // 01/02 share y and 03/04 share y (top/bottom rows).
    expect(Math.abs(centerY(nodeBoxes[0]) - centerY(nodeBoxes[1]))).toBeLessThanOrEqual(2);
    expect(Math.abs(centerY(nodeBoxes[2]) - centerY(nodeBoxes[3]))).toBeLessThanOrEqual(2);

    // Pairwise symmetry about the orbit center: left/right x distances are
    // equal and top/bottom y distances are equal, within 2px.
    expect(
      Math.abs(
        Math.abs(centerX(nodeBoxes[0]) - orbitCenterX) -
          Math.abs(centerX(nodeBoxes[1]) - orbitCenterX),
      ),
    ).toBeLessThanOrEqual(2);
    expect(
      Math.abs(
        Math.abs(centerY(nodeBoxes[0]) - orbitCenterY) -
          Math.abs(centerY(nodeBoxes[2]) - orbitCenterY),
      ),
    ).toBeLessThanOrEqual(2);

    // 01/02 sit above the orbit center; 03/04 sit below it.
    expect(centerY(nodeBoxes[0])).toBeLessThan(orbitCenterY);
    expect(centerY(nodeBoxes[1])).toBeLessThan(orbitCenterY);
    expect(centerY(nodeBoxes[2])).toBeGreaterThan(orbitCenterY);
    expect(centerY(nodeBoxes[3])).toBeGreaterThan(orbitCenterY);

    // No two node cards overlap.
    for (let i = 0; i < nodeBoxes.length; i += 1) {
      for (let j = i + 1; j < nodeBoxes.length; j += 1) {
        const a = nodeBoxes[i];
        const b = nodeBoxes[j];
        const overlaps =
          a.x < b.x + b.width &&
          b.x < a.x + a.width &&
          a.y < b.y + b.height &&
          b.y < a.y + a.height;
        expect(overlaps, `node ${i + 1} overlaps node ${j + 1}`).toBe(false);
      }
    }

    // Each node card is clearly smaller than the orbit (under 40% width) and
    // stays inside the orbit bounds.
    for (const box of nodeBoxes) {
      expect(box.width).toBeLessThan(orbitBox!.width * 0.4);
      expect(box.x).toBeGreaterThanOrEqual(orbitBox!.x);
      expect(box.y).toBeGreaterThanOrEqual(orbitBox!.y);
      expect(box.x + box.width).toBeLessThanOrEqual(
        orbitBox!.x + orbitBox!.width + 1,
      );
      expect(box.y + box.height).toBeLessThanOrEqual(
        orbitBox!.y + orbitBox!.height + 1,
      );
    }

    await assertNoPageOverflow(page);
  }
});

test("mobile keeps the flow fallback vertically readable and the flywheel reachable without page-level overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await blockFlowCdn(page);
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();
  await assertNoPageOverflow(page);

  const flow = await sectionByHeading(page, "流程全景");
  const boxes: (Awaited<ReturnType<Locator["boundingBox"]>>)[] = [];
  for (const group of FALLBACK_GROUPS) {
    const item = flow.getByText(group, { exact: true }).first();
    await expect(item).toBeVisible();
    boxes.push(await item.boundingBox());
  }

  for (let i = 1; i < boxes.length; i += 1) {
    expect(boxes[i]).not.toBeNull();
    expect(boxes[i - 1]).not.toBeNull();
    expect(boxes[i]!.y).toBeGreaterThan(
      boxes[i - 1]!.y + boxes[i - 1]!.height - 1,
    );
  }

  const flywheel = page.getByRole("complementary", { name: /协作飞轮/ });
  await expect(flywheel).toBeVisible();
  await expect(flywheel.getByText("用户目标").first()).toBeVisible();

  const routing = await sectionByHeading(page, "谁来执行");
  const terra = routing.getByRole("button", { name: "Terra" });
  await expect(terra).toBeVisible();
  await terra.focus();
  await page.keyboard.press("Enter");
  await expect(routing.getByRole("heading", { name: "Terra" })).toBeVisible();
  await assertNoPageOverflow(page);
});
