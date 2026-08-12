import { expect, test, type Page } from "@playwright/test";

/**
 * PW-02 Finance Skills capability atlas Red seam (ticket PW-02, spec AC-F01,
 * design-spec section 7).
 *
 * The formal route /work/finance-skills must exist and its static first layer
 * must explain that 30 Skills cooperate across seven finance stages before the
 * month-end case ("月末财务包"). The seven-stage capability atlas must be
 * keyboard operable: selecting a stage reveals its Skill names, responsibility,
 * input, output, next-step condition and collaboration relationship.
 *
 * The seam is public only: URL, approved V4 stage titles, approved Skill
 * identifiers and detail copy, approved detail labels, and standard tab ARIA
 * semantics (role, aria-selected, keyboard activation). No private component
 * classes and no pixel assertions.
 */

const FINANCE_STAGES = [
  {
    title: "数据治理",
    skills: [
      "clean-data-xls",
      "finance-data-normalization",
      "datapack-builder",
    ],
    responsibility: "先识别哪些记录可以可靠转换",
    input: "Excel / CSV、中文日期金额、业务口径",
    output: "标准记录、异常清单、数据血缘",
    next: "数据达到可用标准后进入工作簿。",
  },
  {
    title: "工作簿",
    skills: ["datapack-builder", "xlsx-author"],
    responsibility:
      "将标准记录组织成有输入区、报表、经营指标、来源和检查项的数据包",
    input: "标准记录、期间、单位、来源",
    output: "10 个相互衔接的 Sheet",
    next: "工作簿生成后先审计公式。",
  },
  {
    title: "表格审计",
    skills: ["audit-xls"],
    responsibility:
      "检查公式错误、硬编码、断层、外部链接、隐藏内容和跨表勾稽",
    input: "工作簿、公式、检查阈值",
    output: "错误定位、严重性、修复建议",
    next: "审计通过后进入三表建模。",
  },
  {
    title: "三表建模",
    skills: ["3-statement-model", "model-update"],
    responsibility: "构建相互联动的利润表、资产负债表和现金流量表",
    input: "历史报表、经营驱动、假设",
    output: "联动三表、支持附表、更新说明",
    next: "模型闭合后进入勾稽和差异诊断。",
  },
  {
    title: "勾稽诊断",
    skills: [
      "gl-recon",
      "break-trace",
      "roll-forward",
      "nav-tieout",
      "variance-commentary",
      "portfolio-monitoring",
      "annual-report-audit-tieout",
    ],
    responsibility: "对总账、明细、滚动科目、预算和年报之间的差异逐层定位",
    input: "总账、明细、预算、年报附注",
    output: "匹配结果、差异分类、根因轨迹",
    next: "勾稽结果进入财务分析。",
  },
  {
    title: "财务分析",
    skills: ["financial-statement-analysis", "financial-reporting-quality"],
    responsibility:
      "在三表和勾稽结果上分析盈利、现金、偿债、营运效率和报表质量",
    input: "三表、经营指标、异常清单",
    output: "趋势、风险假设、质量红旗",
    next: "分析结论与边界进入报告。",
  },
  {
    title: "报告交付",
    skills: ["finance-report-builder", "finance-skill-sop-builder"],
    responsibility:
      "把事实、计算、分析、建议、来源和限制组织成面向读者的交付文档",
    input: "分析结论、来源、人工意见",
    output: "报告、证据索引、复核清单",
    next: "人工复核后交付，稳定流程再沉淀 SOP。",
  },
] as const;

const DETAIL_LABELS = ["输入", "输出", "下一步", "协同关系"] as const;

async function atlasSeam(page: Page) {
  const tablist = page.getByRole("tablist").filter({ hasText: "数据治理" });
  const panel = page.getByRole("tabpanel").first();
  return { tablist, panel };
}

test("formal /work/finance-skills route statically explains 30 Skills across seven stages and names the month-end case", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto("/work/finance-skills");
  expect(response?.ok()).toBeTruthy();

  // Static first layer: the relation between 30 Skills and seven stages is
  // readable before any interaction (AC-G03, PW-02 static first layer).
  await expect(page.getByText(/30 个 Skills/).first()).toBeVisible();
  await expect(page.getByText(/七个/).first()).toBeVisible();

  // AC-F02: the case opens under an explicit "案例拆解" section and is named
  // "月末财务包", not presented as an isolated page title.
  await expect(page.getByText(/月末财务包/).first()).toBeVisible();
});

test("atlas exposes the seven approved stages as a keyboard-operable tab list", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");

  const { tablist, panel } = await atlasSeam(page);
  await expect(tablist).toBeVisible();
  await expect(panel).toBeVisible();

  const tabs = tablist.getByRole("tab");
  await expect(tabs).toHaveCount(FINANCE_STAGES.length);

  for (const stage of FINANCE_STAGES) {
    await expect(tablist.getByRole("tab", { name: stage.title })).toBeVisible();
  }

  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
});

test("keyboard stage selection reveals the complete detail contract for every stage", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");

  const { tablist, panel } = await atlasSeam(page);
  const tabs = tablist.getByRole("tab");
  await expect(tabs).toHaveCount(FINANCE_STAGES.length);
  await expect(panel).toBeVisible();

  // Behavior seam: a later stage's detail must not be exposed until the user
  // selects it (selection reveals, rather than a static dump of every stage).
  await expect(
    panel.getByText("3-statement-model", { exact: true }),
  ).not.toBeVisible();
  await expect(panel.getByText("audit-xls", { exact: true })).not.toBeVisible();

  for (let index = 0; index < FINANCE_STAGES.length; index += 1) {
    const stage = FINANCE_STAGES[index];
    const tab = tabs.nth(index);

    await tab.focus();
    await expect(tab).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(tab).toHaveAttribute("aria-selected", "true");

    await expect(panel.getByText(stage.title, { exact: true })).toBeVisible();

    // Skill names.
    for (const skill of stage.skills) {
      await expect(panel.getByText(skill, { exact: true })).toBeVisible();
    }

    // Responsibility, input, output and next-step condition (AC-F01).
    await expect(panel.getByText(stage.responsibility)).toBeVisible();
    await expect(panel.getByText(stage.input)).toBeVisible();
    await expect(panel.getByText(stage.output)).toBeVisible();
    // 下一步 and 协同关系 share the frozen V4 handoff text, so the first
    // occurrence is asserted for the next-step condition.
    await expect(panel.getByText(stage.next).first()).toBeVisible();

    // Collaboration relationship is an explicit part of the detail contract.
    for (const label of DETAIL_LABELS) {
      await expect(panel.getByText(label, { exact: true })).toBeVisible();
    }
  }
});

test("atlas ArrowLeft/ArrowRight/Home/End move focus and selected state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");

  const { tablist } = await atlasSeam(page);
  const tabs = tablist.getByRole("tab");
  await expect(tabs).toHaveCount(FINANCE_STAGES.length);

  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("End");
  await expect(tabs.nth(FINANCE_STAGES.length - 1)).toBeFocused();
  await expect(tabs.nth(FINANCE_STAGES.length - 1)).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page.keyboard.press("ArrowLeft");
  await expect(tabs.nth(FINANCE_STAGES.length - 2)).toBeFocused();
  await expect(tabs.nth(FINANCE_STAGES.length - 2)).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page.keyboard.press("Home");
  await expect(tabs.nth(0)).toBeFocused();
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
});

test("mobile keeps all seven stages vertically accessible without page-level horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/work/finance-skills");

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);

  const { tablist, panel } = await atlasSeam(page);
  const tabs = tablist.getByRole("tab");
  await expect(tabs).toHaveCount(FINANCE_STAGES.length);

  for (const stage of FINANCE_STAGES) {
    await expect(tablist.getByRole("tab", { name: stage.title })).toBeVisible();
  }

  await tabs.nth(4).focus();
  await page.keyboard.press("Enter");
  await expect(tabs.nth(4)).toHaveAttribute("aria-selected", "true");

  const stage = FINANCE_STAGES[4];
  await expect(panel.getByText(stage.title, { exact: true })).toBeVisible();
  for (const skill of stage.skills) {
    await expect(panel.getByText(skill, { exact: true })).toBeVisible();
  }

  const hasOverflowAfterSelection = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflowAfterSelection).toBe(false);
});

test("reduced motion keeps immediate keyboard selection with no positional or scale animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/finance-skills");

  const { tablist, panel } = await atlasSeam(page);
  const tabs = tablist.getByRole("tab");
  await expect(tabs).toHaveCount(FINANCE_STAGES.length);

  await tabs.nth(0).focus();
  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press("ArrowDown");
  }
  await expect(tabs.nth(3)).toBeFocused();
  await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");

  const stage = FINANCE_STAGES[3];
  await expect(panel.getByText(stage.title, { exact: true })).toBeVisible();
  for (const skill of stage.skills) {
    await expect(panel.getByText(skill, { exact: true })).toBeVisible();
  }

  const animatedInlineStyles = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        '[data-finance-atlas] [style], .finance-page [style]',
      ),
    ).filter((el) => /transform|opacity/i.test(el.getAttribute("style") ?? "")),
  );
  expect(animatedInlineStyles.length).toBe(0);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);
});
