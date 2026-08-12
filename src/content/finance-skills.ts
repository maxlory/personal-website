/**
 * PW-02 Finance Skills capability atlas.
 *
 * Frozen source: .superpowers/brainstorm/48655-1786445733/content/
 * skills-process-atlas-v4.html (financeStages + financeGroups). Skill ids,
 * stage titles, responsibilities, inputs, outputs, next-step conditions and
 * the 30-Skill inventory are copied verbatim; nothing is renamed.
 */

export type FinanceStage = {
  title: string;
  meta: string;
  copy: string;
  why: string;
  example: string;
  input: string;
  output: string;
  next: string;
  collaboration: string;
  skills: string[];
};

export type FinanceSkillGroup = {
  title: string;
  meta: string;
  skills: { id: string; duty: string }[];
};

export type FinanceCaseStageKind = "saved" | "contract" | "workbook" | "analysis";

export type FinanceCell = string | { value: string; tone?: "good" | "risk" };

/**
 * One stage of the frozen month-end case (financeCase in
 * skills-process-atlas-v4.html). All labels, figures and uncertainty status
 * are copied verbatim; `kind` only drives how the evidence tag is presented
 * (saved evidence vs contract-fitted/derived evidence).
 */
export type FinanceCaseStage = {
  title: string;
  skills: string[];
  kind: FinanceCaseStageKind;
  tag: string;
  copy: string;
  summary: string;
  headers?: string[];
  rows?: FinanceCell[][];
};

export type FinanceWorkbookSheet = {
  name: string;
  purpose: string;
  link: string;
  headers: string[];
  rows: string[][];
};

export type FinanceAnalysisStep = {
  skill: string;
  title: string;
  intro: string;
  facts: { label: string; value: string }[];
  outputLabel: string;
  output: string;
};

export type FinanceAnalysisChain = {
  steps: FinanceAnalysisStep[];
  thread: { label: string; value: string }[];
  callout: string;
};

export type FinanceSkillsWorkCase = {
  kind: "finance-skills";
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heroNote: string;
  stages: FinanceStage[];
  groups: FinanceSkillGroup[];
  metrics: { value: string; label: string }[];
  caseName: string;
  caseSummary: string;
  caseBoundary: string;
  caseStages: FinanceCaseStage[];
  workbookSheets: FinanceWorkbookSheet[];
  workbookFootnote: string;
  analysisChain: FinanceAnalysisChain;
};

export const FINANCE_STAGE_TOTAL = 7;
export const FINANCE_SKILL_TOTAL = 30;

export const financeStages: FinanceStage[] = [
  {
    title: "数据治理",
    meta: "3 Skills · 主链",
    copy: "先识别哪些记录可以可靠转换，哪些需要人工确认，再把不同来源的数据统一为可追溯字段。",
    why: "避免含糊日期、金额和来源直接进入报表。",
    example: "“壹万零捌佰元整”转成 10,800；“十来万”保留为待复核。",
    input: "Excel / CSV、中文日期金额、业务口径",
    output: "标准记录、异常清单、数据血缘",
    next: "数据达到可用标准后进入工作簿。",
    collaboration: "数据达到可用标准后进入工作簿。",
    skills: ["clean-data-xls", "finance-data-normalization", "datapack-builder"],
  },
  {
    title: "工作簿",
    meta: "2 Skills · 主链",
    copy: "将标准记录组织成有输入区、报表、经营指标、来源和检查项的数据包。",
    why: "让计算区不直接硬编码，所有数字都能追到来源。",
    example: "Inputs 向三表供数，Executive Summary 只汇总，不重新计算。",
    input: "标准记录、期间、单位、来源",
    output: "10 个相互衔接的 Sheet",
    next: "工作簿生成后先审计公式。",
    collaboration: "工作簿生成后先审计公式。",
    skills: ["datapack-builder", "xlsx-author"],
  },
  {
    title: "表格审计",
    meta: "1 Skill · 主链",
    copy: "检查公式错误、硬编码、断层、外部链接、隐藏内容和跨表勾稽。",
    why: "防止结构看起来完整，但公式已经断开。",
    example: "现金流期末现金必须等于资产负债表现金。",
    input: "工作簿、公式、检查阈值",
    output: "错误定位、严重性、修复建议",
    next: "审计通过后进入三表建模。",
    collaboration: "审计通过后进入三表建模。",
    skills: ["audit-xls"],
  },
  {
    title: "三表建模",
    meta: "2 Skills · 主链",
    copy: "构建相互联动的利润表、资产负债表和现金流量表，并在实际数据变化时更新模型。",
    why: "单张报表无法解释利润、资产和现金如何互相影响。",
    example: "净利润进入现金流，期末现金回到资产负债表。",
    input: "历史报表、经营驱动、假设",
    output: "联动三表、支持附表、更新说明",
    next: "模型闭合后进入勾稽和差异诊断。",
    collaboration: "模型闭合后进入勾稽和差异诊断。",
    skills: ["3-statement-model", "model-update"],
  },
  {
    title: "勾稽诊断",
    meta: "7 Skills · 场景调用",
    copy: "对总账、明细、滚动科目、预算和年报之间的差异逐层定位。",
    why: "同额、同名或时间接近只能形成候选，不能直接确认。",
    example: "北京凭证与银行流水得分 90.24，是强候选，仍保留复核。",
    input: "总账、明细、预算、年报附注",
    output: "匹配结果、差异分类、根因轨迹",
    next: "勾稽结果进入财务分析。",
    collaboration: "勾稽结果进入财务分析。",
    skills: [
      "gl-recon",
      "break-trace",
      "roll-forward",
      "nav-tieout",
      "variance-commentary",
      "portfolio-monitoring",
      "annual-report-audit-tieout",
    ],
  },
  {
    title: "财务分析",
    meta: "2 Skills · 主链",
    copy: "在三表和勾稽结果上分析盈利、现金、偿债、营运效率和报表质量。",
    why: "三表平衡只证明数学闭合，不等于经营健康。",
    example: "收入增长 12.5%，但 OCF/NI 降到 0.63，需要核查现金转化。",
    input: "三表、经营指标、异常清单",
    output: "趋势、风险假设、质量红旗",
    next: "分析结论与边界进入报告。",
    collaboration: "分析结论与边界进入报告。",
    skills: ["financial-statement-analysis", "financial-reporting-quality"],
  },
  {
    title: "报告交付",
    meta: "2 Skills · 主链",
    copy: "把事实、计算、分析、建议、来源和限制组织成面向读者的交付文档。",
    why: "报告不能在最后一步重新创造未经验证的判断。",
    example: "将现金转化风险写入摘要，并列出应收账龄和期后回款要求。",
    input: "分析结论、来源、人工意见",
    output: "报告、证据索引、复核清单",
    next: "人工复核后交付，稳定流程再沉淀 SOP。",
    collaboration: "人工复核后交付，稳定流程再沉淀 SOP。",
    skills: ["finance-report-builder", "finance-skill-sop-builder"],
  },
];

export const financeSkillGroups: FinanceSkillGroup[] = [
  {
    title: "数据准备",
    meta: "参考 Skills · 3",
    skills: [
      { id: "clean-data-xls", duty: "清洗日期、数字文本、重复和公式错误。" },
      { id: "datapack-builder", duty: "生成带来源、假设和检查项的数据包。" },
      { id: "xlsx-author", duty: "在无实时 Excel 环境时生成工作簿。" },
    ],
  },
  {
    title: "表格审计",
    meta: "参考 Skills · 1",
    skills: [
      { id: "audit-xls", duty: "检查公式、硬编码、外链、单位和勾稽。" },
    ],
  },
  {
    title: "财务建模",
    meta: "参考 Skills · 5",
    skills: [
      { id: "3-statement-model", duty: "构建联动三表和支持附表。" },
      { id: "model-update", duty: "把实际业绩和假设更新进模型。" },
      { id: "comps-analysis", duty: "整理可比公司指标和估值倍数。" },
      { id: "dcf-model", duty: "计算现金流估值与敏感性。" },
      { id: "lbo-model", duty: "分析债务偿还和投资回报。" },
    ],
  },
  {
    title: "运营诊断",
    meta: "参考 Skills · 6",
    skills: [
      { id: "portfolio-monitoring", duty: "比较实际、预算和上期 KPI。" },
      { id: "variance-commentary", duty: "解释重大差异的驱动因素。" },
      { id: "gl-recon", duty: "匹配总账与明细并分类差异。" },
      { id: "break-trace", duty: "下钻交易记录定位根因。" },
      { id: "nav-tieout", duty: "逐行勾稽资本账户和 NAV。" },
      { id: "roll-forward", duty: "连接期初、增减和期末余额。" },
    ],
  },
  {
    title: "研究决策",
    meta: "参考 Skills · 6",
    skills: [
      { id: "earnings-preview", duty: "生成财报前瞻和关注指标。" },
      { id: "earnings-analysis", duty: "复盘业绩差异与预测变化。" },
      { id: "competitive-analysis", duty: "分析竞争结构与壁垒。" },
      { id: "sector-overview", duty: "整理行业规模、趋势与估值。" },
      { id: "portfolio-rebalance", duty: "生成组合再平衡建议。" },
      { id: "tear-sheet", duty: "生成带来源的公司一页表。" },
    ],
  },
  {
    title: "财务扩展",
    meta: "扩展 Skills · 9",
    skills: [
      { id: "finance-data-normalization", duty: "统一字段、单位、币种和期间。" },
      { id: "annual-report-audit-tieout", duty: "核对中国年报、审计报告和附注。" },
      { id: "china-tax-risk-screening", duty: "初筛合同、发票和付款的税务风险。" },
      { id: "financial-statement-analysis", duty: "分析盈利、现金、偿债和效率。" },
      { id: "financial-reporting-quality", duty: "检查现金支持、应计与来源质量。" },
      { id: "finance-report-builder", duty: "组织结论、来源和限制条件。" },
      { id: "ma-valuation-toolkit", duty: "组合并购估值工具。" },
      { id: "merger-model-analysis", duty: "分析增厚摊薄、融资和协同。" },
      { id: "finance-skill-sop-builder", duty: "把稳定流程沉淀为 SOP。" },
    ],
  },
];

export const financeSkillIds: string[] = financeSkillGroups.flatMap((group) =>
  group.skills.map((skill) => skill.id),
);

/**
 * Frozen month-end case stages (financeCase in skills-process-atlas-v4.html).
 * Skill ids, tags, copy, table headers and every row value are copied
 * verbatim; the uncertainty status text (needs_review, 空, 需复核,
 * 不可直接匹配) is preserved exactly.
 */
export const financeCaseStages: FinanceCaseStage[] = [
  {
    title: "脏数据输入",
    skills: ["clean-data-xls"],
    kind: "saved",
    tag: "保存的示例输入",
    copy: "原始记录同时包含中文日期、中文金额、含糊表达和无法判断的字段。第一步先区分哪些可以可靠转换。",
    summary: "原始日期 · 原始金额 · 问题",
    headers: ["原始日期", "原始金额", "问题"],
    rows: [
      ["二月初八", "壹万零捌佰元整", "中文日期与大写金额"],
      ["初十八", "一万五", "日期缺少月份"],
      ["不知道几号", "十来万", "无法精确判断"],
    ],
  },
  {
    title: "清洗与置信度",
    skills: ["clean-data-xls", "finance-data-normalization"],
    kind: "saved",
    tag: "保存的示例产物",
    copy: "明确值被标准化，含糊值保留为 needs_review。置信度和异常状态继续进入后续环节。",
    summary: "原始金额 → 标准金额 · 状态",
    headers: ["原始日期", "标准日期", "原始金额", "标准金额", "状态"],
    rows: [
      [
        "二月初八",
        { value: "2026-03-26", tone: "good" },
        "壹万零捌佰元整",
        { value: "10,800", tone: "good" },
        "medium / high",
      ],
      [
        "初十八",
        { value: "空", tone: "risk" },
        "一万五",
        { value: "15,000", tone: "good" },
        "needs_review",
      ],
      [
        "不知道几号",
        { value: "空", tone: "risk" },
        "十来万",
        { value: "空", tone: "risk" },
        "needs_review",
      ],
    ],
  },
  {
    title: "统一字段",
    skills: ["finance-data-normalization"],
    kind: "contract",
    tag: "基于 Skill 契约拟合",
    copy: "标准记录使用统一字段，并保留来源行、转换规则、置信度与异常状态。",
    summary: "transaction_date · amount · confidence",
    headers: [
      "transaction_date",
      "entity_name",
      "amount",
      "currency",
      "source_ref",
      "confidence",
    ],
    rows: [
      [
        "2026-03-26",
        "北京供应商 A",
        "10,800",
        "CNY",
        "voucher_03:R28",
        "medium / high",
      ],
    ],
  },
  {
    title: "生成工作簿",
    skills: ["datapack-builder", "xlsx-author"],
    kind: "workbook",
    tag: "基于 Skill 契约拟合",
    copy: "datapack-builder 定义财务包的业务结构，xlsx-author 负责在无实时 Excel 环境时生成 XLSX。点击 Sheet 后，表头、数据和用途会同步更新。",
    summary: "Sheet 名称 · 用途 · 表头 · 数据",
  },
  {
    title: "审计公式",
    skills: ["audit-xls"],
    kind: "contract",
    tag: "基于 Skill 契约拟合",
    copy: "工作簿在进入模型前检查公式、硬编码、断层、外链和隐藏内容。",
    summary: "检查项 · 结果 · 处理",
    headers: ["检查项", "结果", "处理"],
    rows: [
      ["公式错误", { value: "0", tone: "good" }, "通过"],
      ["硬编码断层", { value: "2", tone: "risk" }, "回到 Inputs"],
      ["异常项引用", { value: "1", tone: "risk" }, "保留人工复核"],
    ],
  },
  {
    title: "联动三表",
    skills: ["3-statement-model", "model-update"],
    kind: "contract",
    tag: "基于 Skill 契约拟合",
    copy: "净利润进入现金流，期末现金回到资产负债表，留存收益按期滚动。",
    summary: "连接关系 · 结果 · 检查",
    headers: ["连接关系", "结果", "检查"],
    rows: [
      ["Net Income → Cash Flow", "95", { value: "linked", tone: "good" }],
      [
        "Ending Cash → Balance Sheet",
        "345",
        { value: "0 difference", tone: "good" },
      ],
      [
        "Retained Earnings Roll-forward",
        "510",
        { value: "passed", tone: "good" },
      ],
    ],
  },
  {
    title: "对账与追踪",
    skills: ["gl-recon", "break-trace", "roll-forward"],
    kind: "saved",
    tag: "保存产物 + 核心 Skill 映射",
    copy: "辅助实验产生真实匹配候选，再映射到总账勾稽、差异下钻和科目滚动。候选不等于确认。",
    summary: "候选 · 总分 · 结论",
    headers: ["候选", "金额", "日期差", "总分", "结论"],
    rows: [
      [
        "北京凭证 ↔ 银行流水",
        "32,000",
        "1 天",
        { value: "90.24", tone: "good" },
        "强候选",
      ],
      ["天津记录 ↔ 别名实体", "同额", "近邻", "82.71", "需复核"],
      [
        "3 月凭证 ↔ 4 月工资",
        "同名同额",
        "30 天",
        { value: "71.50", tone: "risk" },
        "不可直接匹配",
      ],
    ],
  },
  {
    title: "分析与报告",
    skills: [
      "financial-statement-analysis",
      "financial-reporting-quality",
      "finance-report-builder",
    ],
    kind: "analysis",
    tag: "基于 Skill 契约拟合",
    copy: "三表平衡只说明数学闭合。三个 Skills 继续回答经营是否健康、利润是否可靠，以及哪些结论可以进入报告。",
    summary: "报表分析 · 报表质量 · 报告生成",
  },
];

/**
 * Frozen workbook sheets (workbookSheets in skills-process-atlas-v4.html).
 * Sheet names, purposes, links, headers and all rows are copied verbatim.
 */
export const financeWorkbookSheets: FinanceWorkbookSheet[] = [
  {
    name: "Executive Summary",
    purpose: "先看增长、利润、现金和风险概况。",
    link: "汇总三表、经营指标和 Checks。",
    headers: ["Metric", "2026-02", "2026-03", "Change", "Status"],
    rows: [
      ["Revenue", "1,200", "1,350", "+12.5%", "Growth"],
      ["EBITDA", "180", "191", "+6.1%", "Monitor"],
      ["EBITDA Margin", "15.0%", "14.1%", "-0.9pp", "Monitor"],
      ["Net Income", "90", "95", "+5.6%", "Stable"],
      ["Operating Cash Flow", "105", "60", "-42.9%", "Review"],
      ["Ending Cash", "320", "345", "+7.8%", "Pass"],
    ],
  },
  {
    name: "Inputs",
    purpose: "集中保存原始输入、口径和来源，避免计算区硬编码。",
    link: "向三表、经营指标和市场分析供数。",
    headers: ["Input ID", "Period", "Metric", "Value", "Unit", "Source Ref", "Status"],
    rows: [
      ["I-001", "2026-02", "Revenue", "1,200", "万元", "IS-202602:R5", "Assumed"],
      ["I-002", "2026-03", "Revenue", "1,350", "万元", "IS-202603:R5", "Assumed"],
      [
        "I-003",
        "2026-03",
        "Accounts Receivable",
        "330",
        "万元",
        "BS-202603:R8",
        "Assumed",
      ],
      [
        "I-004",
        "2026-03",
        "Operating Cash Flow",
        "60",
        "万元",
        "CF-202603:R12",
        "Assumed",
      ],
      [
        "I-005",
        "2026-03",
        "Active Customers",
        "438",
        "个",
        "OPS-202603:R6",
        "Assumed",
      ],
    ],
  },
  {
    name: "Historical Financials",
    purpose: "展示收入、成本、利润及利润率变化。",
    link: "净利润进入 Cash Flow，收入和利润进入 Summary。",
    headers: ["Line Item", "2026-02A", "2026-03A", "Change", "Source / Formula"],
    rows: [
      ["Revenue", "1,200", "1,350", "+12.5%", "Inputs: Revenue"],
      ["Cost of Revenue", "(720)", "(824)", "+14.4%", "Inputs: Cost"],
      ["Gross Profit", "480", "526", "+9.6%", "Revenue - Cost"],
      ["Gross Margin", "40.0%", "39.0%", "-1.0pp", "GP / Revenue"],
      ["Net Income", "90", "95", "+5.6%", "EBIT - Interest - Tax"],
    ],
  },
  {
    name: "Balance Sheet",
    purpose: "展示期末资产、负债、权益和营运资金。",
    link: "现金和营运资金变化进入 Cash Flow 与 Checks。",
    headers: ["Line Item", "2026-02", "2026-03", "Change", "Source / Formula"],
    rows: [
      ["Cash", "320", "345", "+25", "CF: Ending Cash"],
      ["Accounts Receivable", "260", "330", "+70", "Inputs: AR"],
      ["Inventory", "240", "285", "+45", "Inputs: Inventory"],
      ["Total Assets", "2,200", "2,410", "+210", "SUM Assets"],
      ["Liabilities + Equity", "2,200", "2,410", "+210", "L + E"],
    ],
  },
  {
    name: "Cash Flow",
    purpose: "解释利润怎样转化为现金。",
    link: "连接净利润、资产负债表现金和融资变动。",
    headers: ["Line Item", "2026-02", "2026-03", "Source / Formula"],
    rows: [
      ["Net Income", "90", "95", "Historical Financials"],
      ["Working Capital and Other", "(25)", "(77)", "BS Changes"],
      ["Operating Cash Flow", "105", "60", "NI + D&A ± Adjustments"],
      ["Net Change in Cash", "25", "25", "OCF + ICF + CFF"],
      ["Ending Cash", "320", "345", "Beginning + Net Change"],
    ],
  },
  {
    name: "Operating Metrics",
    purpose: "解释财务变化背后的业务数量与效率。",
    link: "支撑收入、毛利和营运资金分析。",
    headers: ["Metric", "2026-02", "2026-03", "Change", "Unit"],
    rows: [
      ["Orders", "860", "940", "+9.3%", "笔"],
      ["Active Customers", "410", "438", "+6.8%", "个"],
      ["Capacity Utilization", "78.0%", "83.0%", "+5.0pp", "%"],
      ["DSO", "6.5", "7.3", "+0.8", "天"],
      ["Cash Conversion Cycle", "7.8", "8.4", "+0.6", "天"],
    ],
  },
  {
    name: "Segment Performance",
    purpose: "比较不同业务线的收入与盈利能力。",
    link: "向 Summary 与 Highlights 提供业务拆分。",
    headers: ["Segment", "Revenue Feb", "Revenue Mar", "Growth", "EBITDA Mar", "Margin"],
    rows: [
      ["软件业务", "720", "850", "+18.1%", "153", "18.0%"],
      ["服务业务", "480", "500", "+4.2%", "38", "7.6%"],
      ["合计", "1,200", "1,350", "+12.5%", "191", "14.1%"],
    ],
  },
  {
    name: "Market Analysis",
    purpose: "将公司指标放入展示基准中比较。",
    link: "为风险判断与 Highlights 提供参照。",
    headers: ["Benchmark", "Company", "Demo Reference", "Gap", "Note"],
    rows: [
      ["Revenue Growth", "12.5%", "8.0%", "+4.5pp", "高于演示基准"],
      ["Gross Margin", "39.0%", "42.0%", "-3.0pp", "低于演示基准"],
      ["EBITDA Margin", "14.1%", "16.0%", "-1.9pp", "需核查费用"],
      ["Cash Cycle", "8.4 天", "7.0 天", "+1.4 天", "资金占用偏高"],
    ],
  },
  {
    name: "Investment Highlights",
    purpose: "汇总增长点、风险与待核实事项，不重新计算。",
    link: "接收前述 Sheet 的证据并进入报告。",
    headers: ["Topic", "Evidence", "Interpretation", "Risk", "Follow-up"],
    rows: [
      ["收入增长", "Revenue +12.5%", "软件业务贡献主要增量", "Moderate", "核对持续性"],
      ["利润率", "EBITDA Margin -0.9pp", "利润增速落后收入", "Moderate", "拆分成本费用"],
      ["现金转化", "OCF/NI 0.63", "利润未同步转成现金", "High", "获取账龄与回款"],
      ["融资依赖", "Debt +105", "现金增加依赖融资", "Moderate", "检查期限利率"],
    ],
  },
  {
    name: "Checks",
    purpose: "检查三表、来源与例外项是否通过。",
    link: "未通过项返回 Inputs 或对应报表修正。",
    headers: ["Check", "Rule", "Result", "Status", "Action"],
    rows: [
      ["Balance Sheet", "Assets - L - E", "0", "Pass", "无"],
      ["Cash Tie", "CF Cash - BS Cash", "0", "Pass", "无"],
      ["Net Income Link", "CF NI - IS NI", "0", "Pass", "无"],
      ["Source Coverage", "来源覆盖", "90%", "Warning", "补 2 个引用"],
      ["Open Exceptions", "未关闭项", "2", "Warning", "人工复核"],
    ],
  },
];

export const FINANCE_WORKBOOK_FOOTNOTE =
  "金额单位：万元，币种：CNY。所有企业经营数字均为展示假设。";

/**
 * Frozen three-Skill analysis chain (renderAnalysis in
 * skills-process-atlas-v4.html): 报表分析 -> 报表质量 -> 报告生成, the causal
 * metric thread and the scope-limit callout are copied verbatim.
 */
export const financeAnalysisChain: FinanceAnalysisChain = {
  steps: [
    {
      skill: "financial-statement-analysis",
      title: "报表分析",
      intro: "解释数字变化，不判断会计操纵。",
      facts: [
        { label: "输入", value: "三表、经营指标、基准与例外项" },
        {
          label: "具体分析",
          value: "收入 +12.5%；毛利率 -1.0pp；OCF/NI 0.63；应收 +26.9%",
        },
      ],
      outputLabel: "输出",
      output: "财务健康 Moderate，现金转化风险 High",
    },
    {
      skill: "financial-reporting-quality",
      title: "报表质量",
      intro: "检查利润是否有现金支持，红旗只用于提出问题。",
      facts: [
        { label: "输入", value: "分析指标、三表、来源与明细缺口" },
        {
          label: "具体检查",
          value: "净利润 +5.6%，OCF -42.9%；应收增速高于收入",
        },
      ],
      outputLabel: "输出",
      output: "利润与现金分化，需补账龄、回款和库存库龄",
    },
    {
      skill: "finance-report-builder",
      title: "报告生成",
      intro: "组织已有结论，不在最后一步创造新判断。",
      facts: [
        { label: "输入", value: "指标、质量红旗、来源、Checks 与人工意见" },
        {
          label: "写入报告",
          value: "执行摘要、指标快照、风险清单、后续资料和数据附录",
        },
      ],
      outputLabel: "输出",
      output: "带事实、分析、建议、来源和限制条件的报告",
    },
  ],
  thread: [
    { label: "分析", value: "OCF/NI 降至 0.63，利润没有同步转成现金。" },
    { label: "质量检查", value: "利润与现金走势分化，现金转化风险为 High。" },
    {
      label: "报告动作",
      value: "要求补充应收账龄、期后回款和库存库龄。",
    },
  ],
  callout:
    "现有信息只支持“营运资金占用需要核查”。在拿到补充资料前，不能确认具体原因，更不能指控财务操纵。",
};

export const financeSkillsCase: FinanceSkillsWorkCase = {
  kind: "finance-skills",
  slug: "finance-skills",
  title: "财务 Skills 能力全景",
  subtitle:
    "30 个 Skills 组成七个可复核环节。先理解分工，再看它们如何处理同一份月末数据。",
  eyebrow: "Work · Finance Skills",
  heroNote: "Living Ledger",
  stages: financeStages,
  groups: financeSkillGroups,
  metrics: [
    { value: "21", label: "精选重组参考 Skills" },
    { value: "9", label: "财务语境扩展 Skills" },
    { value: "7", label: "主流程处理环节" },
  ],
  caseName: "月末财务包",
  caseSummary:
    "一组格式混乱的业务记录，经过清洗、工作簿生成、公式审计、三表建模和跨文件对账，最终形成一份可以复核的月末财务报告。",
  caseBoundary:
    "已有证据：30 个 SKILL.md 已逐项核对，中文金额和日期清洗有保存的 XLSX，跨文件候选匹配有保存的 recon_report.xlsx，工作簿结构和分析流程来自真实 Skill 契约。展示边界：完整工作簿与经营数字属于契约拟合，演示数字不代表真实企业经营结果，风险红旗不等于舞弊结论，完整 datapack 和最终报告没有保存的实跑产物。",
  caseStages: financeCaseStages,
  workbookSheets: financeWorkbookSheets,
  workbookFootnote: FINANCE_WORKBOOK_FOOTNOTE,
  analysisChain: financeAnalysisChain,
};
