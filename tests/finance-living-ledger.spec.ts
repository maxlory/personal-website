import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * PW-03 Living Ledger month-end case Red seam (ticket PW-03, spec AC-F02,
 * AC-F03, AC-F04, AC-F05, AC-F06, AC-G10, design-spec section 7).
 *
 * Frozen source: .superpowers/brainstorm/48655-1786445733/content/
 * skills-process-atlas-v4.html (financeCase + workbookSheets + renderAnalysis).
 * Stage titles, skill ids, tags, workbook sheet names/purposes/headers/data,
 * the three-Skill analysis chain and the needs_review semantics are copied
 * verbatim; nothing is renamed.
 *
 * This phase only adds the executable Red: the current formal finance route
 * still stops at the PW-02 case teaser, so the assertions below must fail for
 * one reason only, that the full month-end case behavior is absent.
 *
 * The seam is public only: section headings, standard tab semantics
 * (role=tablist, role=tab, aria-selected), approved V4 labels and numbers,
 * and keyboard activation. The case stage control intentionally accepts
 * either a real tab list (as in V4) or a plain button stage rail, so a later
 * implementation may choose either while preserving an accessible mobile
 * fallback. The workbook Sheet switcher is locked to real tab semantics by
 * the design spec.
 */

const CASE_STAGES = [
  {
    title: "脏数据输入",
    skills: ["clean-data-xls"],
    tag: "保存的示例输入",
    copy: "原始记录同时包含中文日期、中文金额、含糊表达和无法判断的字段。",
    marker: "问题",
  },
  {
    title: "清洗与置信度",
    skills: ["clean-data-xls", "finance-data-normalization"],
    tag: "保存的示例产物",
    copy: "明确值被标准化，含糊值保留为 needs_review。",
    marker: "标准日期",
  },
  {
    title: "统一字段",
    skills: ["finance-data-normalization"],
    tag: "基于 Skill 契约拟合",
    copy: "标准记录使用统一字段，并保留来源行、转换规则、置信度与异常状态。",
    marker: "transaction_date",
  },
  {
    title: "生成工作簿",
    skills: ["datapack-builder", "xlsx-author"],
    tag: "基于 Skill 契约拟合",
    copy: "点击 Sheet 后，表头、数据和用途会同步更新。",
    marker: "Executive Summary",
  },
  {
    title: "审计公式",
    skills: ["audit-xls"],
    tag: "基于 Skill 契约拟合",
    copy: "工作簿在进入模型前检查公式、硬编码、断层、外链和隐藏内容。",
    marker: "检查项",
  },
  {
    title: "联动三表",
    skills: ["3-statement-model", "model-update"],
    tag: "基于 Skill 契约拟合",
    copy: "净利润进入现金流，期末现金回到资产负债表，留存收益按期滚动。",
    marker: "连接关系",
  },
  {
    title: "对账与追踪",
    skills: ["gl-recon", "break-trace", "roll-forward"],
    tag: "保存产物 + 核心 Skill 映射",
    copy: "候选不等于确认。",
    marker: "候选",
  },
  {
    title: "分析与报告",
    skills: [
      "financial-statement-analysis",
      "financial-reporting-quality",
      "finance-report-builder",
    ],
    tag: "基于 Skill 契约拟合",
    copy: "三个 Skills 继续回答经营是否健康、利润是否可靠，以及哪些结论可以进入报告。",
    marker: "报表分析",
  },
] as const;

const WORKBOOK_SHEETS = [
  "Executive Summary",
  "Inputs",
  "Historical Financials",
  "Balance Sheet",
  "Cash Flow",
  "Operating Metrics",
  "Segment Performance",
  "Market Analysis",
  "Investment Highlights",
  "Checks",
] as const;

async function caseSection(page: Page): Promise<Locator> {
  const heading = page.getByRole("heading", { name: "案例拆解" });
  await expect(heading).toBeVisible();
  return page.locator("section").filter({ has: heading });
}

/**
 * Stage control seam. V4 renders the case stages as a tab list; the design
 * spec allows a stage rail instead, so accept either a role=tab control or a
 * plain button whose accessible name carries the approved stage title.
 */
async function stageControl(caseRoot: Locator, title: string): Promise<Locator> {
  const tab = caseRoot.getByRole("tab", { name: title });
  if ((await tab.count()) > 0) {
    return tab;
  }
  return caseRoot.getByRole("button", { name: title });
}

async function expectActiveStage(control: Locator) {
  await expect
    .poll(
      async () => {
        const state = await control.first().evaluate((el) => ({
          selected: el.getAttribute("aria-selected"),
          current: el.getAttribute("aria-current"),
        }));
        return (
          state.selected === "true" ||
          (state.current !== null && state.current !== "false")
        );
      },
      { timeout: 5000 },
    )
    .toBe(true);
}

async function activateStage(page: Page, title: string) {
  const root = await caseSection(page);
  const control = await stageControl(root, title);
  await expect(control.first()).toBeVisible();
  await control.first().focus();
  await expect(control.first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expectActiveStage(control);
}

async function workbookTablist(page: Page) {
  return page
    .getByRole("tablist")
    .filter({ hasText: "Executive Summary" });
}

test("case section exposes the eight approved month-end stages in order under 案例拆解", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");

  const root = await caseSection(page);

  // AC-F02: "月末财务包" is the case name inside the explicit case section,
  // not an isolated page title.
  await expect(
    root.getByText("月末财务包", { exact: true }).first(),
  ).toBeVisible();

  const controls = await Promise.all(
    CASE_STAGES.map((stage) => stageControl(root, stage.title)),
  );
  for (const control of controls) {
    await expect(control.first()).toBeVisible();
  }

  // The stage controls follow the frozen V4 order (AC-F03). Accept either a
  // horizontal tab row or a vertical stage rail by comparing geometry.
  const boxes = await Promise.all(
    controls.map((control) => control.first().boundingBox()),
  );
  for (let i = 1; i < boxes.length; i += 1) {
    const prev = boxes[i - 1];
    const current = boxes[i];
    expect(prev).not.toBeNull();
    expect(current).not.toBeNull();
    const below = current!.y >= prev!.y + prev!.height - 1;
    const right =
      Math.abs(current!.y - prev!.y) < 2 &&
      current!.x >= prev!.x + prev!.width - 1;
    expect(below || right).toBe(true);
  }
});

test("keyboard stage selection reveals each stage's tag, skills, copy and matching detail", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");
  const root = await caseSection(page);

  for (let index = 0; index < CASE_STAGES.length; index += 1) {
    const stage = CASE_STAGES[index];
    await activateStage(page, stage.title);

    await expect(root.getByText(stage.tag, { exact: true }).first()).toBeVisible();
    for (const skill of stage.skills) {
      await expect(root.getByText(skill, { exact: true }).first()).toBeVisible();
    }
    await expect(root.getByText(stage.copy).first()).toBeVisible();

    if (stage.marker === "Executive Summary") {
      await expect(
        (await workbookTablist(page)).getByRole("tab", { name: "Executive Summary" }),
      ).toBeVisible();
    } else if (stage.marker === "报表分析") {
      await expect(
        page.getByRole("heading", { name: stage.marker }),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("columnheader", { name: stage.marker }),
      ).toBeVisible();
    }

    // Selection reveals: the previous stage's unique content is no longer
    // exposed once the next stage is active.
    if (index > 0) {
      const previousMarker = CASE_STAGES[index - 1].marker;
      if (previousMarker === "Executive Summary") {
        await expect(
          page.getByRole("tab", { name: "Executive Summary" }),
        ).toHaveCount(0);
      } else {
        await expect(
          page.getByRole("columnheader", { name: previousMarker }),
        ).toHaveCount(0);
      }
    }
  }
});

test("workbook sheet tabs synchronize sheet name, purpose, headers and data", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");
  await activateStage(page, "生成工作簿");

  const tablist = await workbookTablist(page);
  await expect(tablist).toBeVisible();
  const tabs = tablist.getByRole("tab");
  await expect(tabs).toHaveCount(WORKBOOK_SHEETS.length);
  for (const name of WORKBOOK_SHEETS) {
    await expect(tablist.getByRole("tab", { name })).toBeVisible();
  }

  const summaryTab = tablist.getByRole("tab", { name: "Executive Summary" });
  await expect(summaryTab).toHaveAttribute("aria-selected", "true");

  const summaryPurpose = page.getByText(/先看增长、利润、现金和风险概况/);
  await expect(summaryPurpose).toHaveCount(1);
  await expect(summaryPurpose).toBeVisible();
  for (const header of ["Metric", "2026-02", "2026-03", "Change", "Status"]) {
    await expect(page.getByRole("columnheader", { name: header })).toBeVisible();
  }
  const ocfRow = page
    .locator("tbody tr:visible")
    .filter({ hasText: "Operating Cash Flow" });
  await expect(ocfRow).toContainText("105");
  await expect(ocfRow).toContainText("60");
  await expect(ocfRow).toContainText("-42.9%");
  await expect(ocfRow).toContainText("Review");

  // Keyboard activation moves the selected sheet and swaps purpose, headers
  // and data together (AC-F04, AC-G04).
  const cashFlowTab = tablist.getByRole("tab", { name: "Cash Flow" });
  await cashFlowTab.focus();
  await expect(cashFlowTab).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(cashFlowTab).toHaveAttribute("aria-selected", "true");
  await expect(summaryTab).toHaveAttribute("aria-selected", "false");

  const cashFlowPurpose = page.getByText(/解释利润怎样转化为现金/);
  await expect(cashFlowPurpose).toHaveCount(1);
  await expect(cashFlowPurpose).toBeVisible();
  for (const header of ["Line Item", "2026-02", "2026-03", "Source / Formula"]) {
    await expect(page.getByRole("columnheader", { name: header })).toBeVisible();
  }
  await expect(page.getByRole("columnheader", { name: "Metric" })).toHaveCount(0);
  const endingRow = page
    .locator("tbody tr:visible")
    .filter({ hasText: "Ending Cash" });
  await expect(endingRow).toContainText("320");
  await expect(endingRow).toContainText("345");
  await expect(endingRow).toContainText("Beginning + Net Change");

  const checksTab = tablist.getByRole("tab", { name: "Checks" });
  await checksTab.click();
  await expect(checksTab).toHaveAttribute("aria-selected", "true");
  const checksPurpose = page.getByText(/检查三表、来源与例外项是否通过/);
  await expect(checksPurpose).toHaveCount(1);
  await expect(checksPurpose).toBeVisible();
  for (const header of ["Check", "Rule", "Result", "Status", "Action"]) {
    await expect(page.getByRole("columnheader", { name: header })).toBeVisible();
  }
  const sourceRow = page
    .locator("tbody tr:visible")
    .filter({ hasText: "Source Coverage" });
  await expect(sourceRow).toContainText("90%");
  await expect(sourceRow).toContainText("Warning");
  await expect(sourceRow).toContainText("补 2 个引用");
});

test("unknown values stay needs_review across stages and never become confirmed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");

  await activateStage(page, "脏数据输入");
  await expect(page.getByText("十来万").first()).toBeVisible();
  await expect(page.getByText("不知道几号").first()).toBeVisible();
  await expect(page.getByText("无法精确判断").first()).toBeVisible();

  await activateStage(page, "清洗与置信度");
  const looseAmountRow = page
    .locator("tbody tr:visible")
    .filter({ hasText: "十来万" });
  await expect(looseAmountRow).toBeVisible();
  await expect(looseAmountRow.locator("td").nth(1)).toHaveText("空");
  await expect(looseAmountRow.locator("td").nth(3)).toHaveText("空");
  await expect(looseAmountRow.locator("td").nth(4)).toHaveText("needs_review");

  const unknownDateRow = page
    .locator("tbody tr:visible")
    .filter({ hasText: "不知道几号" });
  await expect(unknownDateRow.locator("td").nth(1)).toHaveText("空");
  await expect(unknownDateRow.locator("td").nth(3)).toHaveText("空");
  await expect(unknownDateRow.locator("td").nth(4)).toHaveText("needs_review");

  // The clearly convertible record gets a normalized amount; the unknown
  // record must never gain one (AC-G10).
  const confirmedRow = page
    .locator("tbody tr:visible")
    .filter({ hasText: "二月初八" });
  await expect(confirmedRow.locator("td").nth(3)).toHaveText("10,800");

  await activateStage(page, "脏数据输入");
  await expect(page.getByText("十来万").first()).toBeVisible();
  await expect(page.getByText("不知道几号").first()).toBeVisible();

  await activateStage(page, "对账与追踪");
  await expect(page.getByText("候选不等于确认").first()).toBeVisible();
  await expect(page.getByText("强候选").first()).toBeVisible();
  await expect(page.getByText("需复核").first()).toBeVisible();

  await activateStage(page, "分析与报告");
  await expect(page.getByText(/不能确认具体原因/).first()).toBeVisible();
});

test("analysis stage chains 报表分析, 报表质量 and 报告生成 with input, analysis and output", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");
  await activateStage(page, "分析与报告");

  const analysisHeading = page.getByRole("heading", { name: "报表分析" });
  const qualityHeading = page.getByRole("heading", { name: "报表质量" });
  const reportHeading = page.getByRole("heading", { name: "报告生成" });
  await expect(analysisHeading).toBeVisible();
  await expect(qualityHeading).toBeVisible();
  await expect(reportHeading).toBeVisible();

  // AC-F05: the causal order runs analysis, then quality check, then report.
  const boxes = await Promise.all([
    analysisHeading.boundingBox(),
    qualityHeading.boundingBox(),
    reportHeading.boundingBox(),
  ]);
  expect(boxes[0]!.y).toBeLessThan(boxes[1]!.y);
  expect(boxes[1]!.y).toBeLessThan(boxes[2]!.y);

  for (const skill of [
    "financial-statement-analysis",
    "financial-reporting-quality",
    "finance-report-builder",
  ]) {
    await expect(page.getByText(skill, { exact: true }).first()).toBeVisible();
  }

  // 报表分析: input, concrete analysis signal, output.
  await expect(page.getByText("三表、经营指标、基准与例外项").first()).toBeVisible();
  await expect(page.getByText(/收入 \+12\.5%/).first()).toBeVisible();
  await expect(page.getByText(/OCF\/NI 0\.63/).first()).toBeVisible();
  await expect(
    page.getByText("财务健康 Moderate，现金转化风险 High").first(),
  ).toBeVisible();

  // 报表质量: input, concrete check, output that scopes the risk.
  await expect(
    page.getByText(/净利润 \+5\.6%，OCF -42\.9%/).first(),
  ).toBeVisible();
  await expect(
    page.getByText("利润与现金分化，需补账龄、回款和库存库龄").first(),
  ).toBeVisible();

  // 报告生成: input, written report sections, deliverable output.
  await expect(
    page.getByText(/执行摘要、指标快照、风险清单/).first(),
  ).toBeVisible();
  await expect(
    page.getByText("带事实、分析、建议、来源和限制条件的报告").first(),
  ).toBeVisible();

  for (const label of ["分析", "质量检查", "报告动作"]) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }
});

test("mobile keeps workbook switching and stage navigation without page-level overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/work/finance-skills");
  await activateStage(page, "生成工作簿");

  const tablist = await workbookTablist(page);
  await expect(tablist).toBeVisible();
  await expect(tablist.getByRole("tab")).toHaveCount(WORKBOOK_SHEETS.length);

  await tablist.getByRole("tab", { name: "Cash Flow" }).click();
  await expect(page.getByText(/解释利润怎样转化为现金/).first()).toBeVisible();

  const hasPageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasPageOverflow).toBe(false);

  await activateStage(page, "对账与追踪");
  await expect(page.getByText("候选不等于确认").first()).toBeVisible();
  const hasPageOverflowAfter = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasPageOverflowAfter).toBe(false);
});

test("tablet keeps stage activation and workbook switching without page-level overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/work/finance-skills");

  await activateStage(page, "生成工作簿");
  const tablist = await workbookTablist(page);
  await expect(tablist).toBeVisible();
  await expect(tablist.getByRole("tab")).toHaveCount(WORKBOOK_SHEETS.length);

  await tablist.getByRole("tab", { name: "Cash Flow" }).click();
  await expect(page.getByText(/解释利润怎样转化为现金/).first()).toBeVisible();
  await expect(
    page.getByRole("columnheader", { name: "Source / Formula" }),
  ).toBeVisible();

  const hasPageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasPageOverflow).toBe(false);

  await activateStage(page, "分析与报告");
  await expect(
    page.getByRole("heading", { name: "报告生成" }),
  ).toBeVisible();
  const hasPageOverflowAfter = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasPageOverflowAfter).toBe(false);
});
