import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * PW-R1 任务恢复 evidence chain Red seam (PW-05 revision per user review).
 *
 * The 任务恢复 case keeps the eight approved stage names, stage copy,
 * evidence tags, skill labels and verified numbers, but internal task ids
 * are de-professionalized: the project background tickets are A/B/C/D, the
 * frozen-ticket rail label is exactly "Ticket", no visible "RA-" task number
 * remains on the page, and the 重新验证 / 验收边界 copy maps to the new ids
 * (B = local backend ticket complete, C = frontend dashboard, D = final
 * product acceptance) while preserving the real test counts and the
 * completed/not-completed boundary.
 */

const DEVELOP_ROUTE = "/work/develop-harness";

const CASE_STAGES = [
  {
    title: "确认目标",
    skills: "Intent",
    tag: "业务问题",
    copy: "用户发起研报后可以离开页面再回来；已完成组件不能丢失；失败组件可以单独重试。",
    facts: [],
  },
  {
    title: "写清行为",
    skills: "Spec",
    tag: "可观察行为",
    copy: "“可以恢复”被进一步限定为 API 返回、事件顺序、断线续传、重启状态和安全错误语义。",
    facts: ["202", "Last-Event-ID", "410"],
  },
  {
    title: "冻结任务单",
    skills: "Ticket",
    tag: "内部任务单",
    copy: "B 只负责后端 Job、SSE、恢复、Retry、CLI 和错误协议，不负责前端与数据源。",
    facts: ["Job Store、API、schemas、编排、CLI、测试", "Redis、外部队列、云服务"],
  },
  {
    title: "暴露缺口",
    skills: "Red",
    tag: "真实测试报告 · E-06",
    copy: "实现前的 21 个失败集中在目标功能，原有 37 项基线仍然通过。",
    facts: ["21 failed", "37 passed"],
  },
  {
    title: "首轮实现",
    skills: "Green",
    tag: "真实 Green 报告 · E-07",
    copy: "加入持久化 Job、异步创建、状态查询、SSE、重启恢复、Retry、Markdown、410 和 CLI 新协议。",
    facts: ["21 passed", "39 passed", "737 passed"],
  },
  {
    title: "第一轮检查",
    skills: "Review → Red → Green",
    tag: "真实检查报告 · E-08",
    copy: "独立检查新增 5 个失败测试，覆盖重复终态、错误重试范围、状态与响应描述问题。",
    facts: ["focused 26 passed", "baseline 39 passed", "full 742 passed"],
  },
  {
    title: "第二轮检查",
    skills: "Review → Red → Green",
    tag: "真实检查报告 · E-09",
    copy: "第二轮从浏览器消费 SSE 的方式继续检查，又发现标准 id、连接生命周期和事务原子性问题。",
    facts: ["full 745 passed"],
  },
  {
    title: "重新验证",
    skills: "Verification",
    tag: "本地完成证据 · E-10",
    copy: "当前版本最终得到 29 项目标测试、39 项迁移与基线、745 项完整回归通过，未解决 finding 为空。",
    facts: ["29 passed", "39 passed", "745 passed", "[]"],
  },
] as const;

async function sectionByHeading(page: Page, name: string): Promise<Locator> {
  const heading = page.getByRole("heading", { name });
  await expect(heading).toBeVisible();
  // The shared page shell wraps detail content in an outer <section>, so
  // several sections contain the same heading; the innermost one (last in
  // document order) is the section that owns it.
  return page.locator("section").filter({ has: heading }).last();
}

async function caseSeam(page: Page) {
  const caseSection = await sectionByHeading(page, "案例拆解");
  const rail = caseSection
    .getByRole("tablist", { name: "任务恢复案例步骤" })
    .first();
  const panel = caseSection.getByRole("tabpanel").first();
  await expect(rail).toBeVisible();
  await expect(panel).toBeVisible();
  return { caseSection, rail, panel };
}

async function assertNoPageOverflow(page: Page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);
}

test("formal /work/develop-harness opens the 任务恢复 case under an explicit 案例拆解 section with plain-language context and no RA- ids", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();
  await assertNoPageOverflow(page);

  const caseSection = await sectionByHeading(page, "案例拆解");

  // The case is named "任务恢复" and explains the business problem in plain
  // language before any internal task id appears (AC-D05, ticket PW-05).
  await expect(
    caseSection.getByRole("heading", { name: "任务恢复" }),
  ).toBeVisible();
  await expect(
    caseSection
      .getByText(
        "业务问题很直接：研报任务刷新后不能丢失，已经完成的组件要保留，失败组件可以单独重试。",
      )
      .first(),
  ).toBeVisible();

  // Internal ids act only as trace indexes; the plain-language reading rule
  // is stated and internal numbers are no longer user-visible at all.
  await expect(
    caseSection
      .getByText("主叙事使用普通中文，内部标识只放在证据索引中。")
      .first(),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/RA-\d/);
});

test("case rail exposes the approved eight-stage evidence chain in order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const { rail } = await caseSeam(page);
  const tabs = rail.getByRole("tab");
  await expect(tabs).toHaveCount(CASE_STAGES.length);

  // The stage rail keeps the frozen order 确认目标、写清行为、冻结任务单、
  // 暴露缺口、首轮实现、第一轮检查、第二轮检查、重新验证 (AC-D05).
  for (let i = 0; i < CASE_STAGES.length; i += 1) {
    await expect(tabs.nth(i)).toContainText(CASE_STAGES[i].title);
    await expect(tabs.nth(i)).toContainText(CASE_STAGES[i].skills);
  }
});

test("keyboard stage selection reveals exact objective, spec, scope, test, implementation, review and verification facts with evidence tags", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const { caseSection, rail, panel } = await caseSeam(page);

  for (const stage of CASE_STAGES) {
    const tab = rail.getByRole("tab", { name: new RegExp(stage.title) });
    await expect(tab).toBeVisible();
    await tab.focus();
    await expect(tab).toBeFocused();
    await page.keyboard.press("Enter");
    await expect
      .poll(async () =>
        tab.evaluate((el) => el.getAttribute("aria-selected")),
      )
      .toBe("true");

    await expect(
      caseSection.getByRole("heading", { name: stage.title }),
    ).toBeVisible();
    await expect(panel.getByText(stage.tag, { exact: true }).first()).toBeVisible();
    await expect(panel.getByText(stage.copy, { exact: true }).first()).toBeVisible();
    await expect(
      panel.getByText(stage.skills, { exact: true }).first(),
    ).toBeVisible();

    // The exact verified numbers are part of the revealed facts.
    for (const fact of stage.facts) {
      await expect(panel.getByText(fact, { exact: true }).first()).toBeVisible();
    }
  }
});

test("local-backend completion stays separated from the C dashboard and D product acceptance", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1005, height: 623 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();

  const { caseSection, rail, panel } = await caseSeam(page);

  // The final stage proves the local backend ticket only: C and D are named
  // as future product work, never as completed evidence.
  const verification = rail.getByRole("tab", { name: "重新验证" });
  await verification.focus();
  await page.keyboard.press("Enter");
  await expect(
    caseSection.getByRole("heading", { name: "重新验证" }),
  ).toBeVisible();
  await expect(
    panel.getByText(/这证明 B 的本地后端任务单完成/).first(),
  ).toBeVisible();
  await expect(panel.getByText(/前端看板属于 C/).first()).toBeVisible();
  await expect(
    panel.getByText(/真实数据、模型与浏览器最终验收属于 D/).first(),
  ).toBeVisible();

  // The page-level boundary section restates what is proven and what is not.
  const boundary = await sectionByHeading(page, "验收边界");
  await expect(
    boundary
      .getByText("B 完成的是本地后端任务单，不代表整个投研产品已经通过最终验收。")
      .first(),
  ).toBeVisible();
  await expect(
    boundary.getByRole("heading", { name: "已经证明" }),
  ).toBeVisible();
  const notProven = boundary.getByRole("heading", { name: "尚未证明" });
  await expect(notProven).toBeVisible();
  await expect(
    boundary.getByText("B 结构化状态为 complete").first(),
  ).toBeVisible();
  const limited = boundary
    .locator("section, div")
    .filter({ has: page.getByRole("heading", { name: "尚未证明" }) })
    .last();
  await expect(limited.getByText("前端组件看板通过最终验收").first()).toBeVisible();
  await expect(limited.getByText("整个投研产品已经完成").first()).toBeVisible();
});

test("mobile keeps the ordered stage rail readable and every stage detail reachable by keyboard without page-level overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const response = await page.goto(DEVELOP_ROUTE);
  expect(response?.ok()).toBeTruthy();
  await assertNoPageOverflow(page);

  const { caseSection, rail, panel } = await caseSeam(page);

  for (const stage of CASE_STAGES) {
    const tab = rail.getByRole("tab", { name: new RegExp(stage.title) });
    await expect(tab).toBeVisible();
    await tab.focus();
    await page.keyboard.press("Enter");
    await expect
      .poll(async () =>
        tab.evaluate((el) => el.getAttribute("aria-selected")),
      )
      .toBe("true");
    await expect(
      caseSection.getByRole("heading", { name: stage.title }),
    ).toBeVisible();
    await expect(panel.getByText(stage.copy, { exact: true }).first()).toBeVisible();
    await assertNoPageOverflow(page);
  }
});
