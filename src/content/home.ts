import {
  selectedBuildsCase,
  type SelectedBuildsWorkCase,
} from "@/content/selected-builds";
import {
  financeSkillsCase,
  type FinanceSkillsWorkCase,
} from "@/content/finance-skills";
import {
  developHarnessCase,
  type DevelopHarnessWorkCase,
} from "@/content/develop-harness";

export type NavItem = {
  href: string;
  label: string;
  highlight?: boolean;
  isDraft?: boolean;
};

export type HomeEntry = {
  slug: string;
  section: "work" | "story" | "process";
  href: string;
  title: string;
  subtitle: string;
  coverStyle:
    | "selected-builds"
    | "futures-ai"
    | "ai-benchmark"
    | "ai-workflow-character"
    | "story"
    | "process";
  placement:
    | "left-feature"
    | "top-wide"
    | "right-feature"
    | "bottom-left"
    | "bottom-center";
};

export type DetailSection = {
  title: string;
  body: string;
};

export type StandardWorkCase = {
  kind: "standard";
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heroNote: string;
  summary: string;
  detailSections: DetailSection[];
  callout: string;
  stats?: { label: string; value: string }[];
};

export type AiWorkflowEvidenceAsset = {
  kind: "image" | "video";
  title: string;
  label: string;
  caption: string;
  src: string;
  alt?: string;
  poster?: string;
  mimeType?: string;
  width?: number;
  height?: number;
};

export type AiWorkflowProcessStep = {
  title: string;
  body: string;
};

export type AiWorkflowPrdWindow = {
  title: string;
  sourceLabel: string;
  downloadHref: string;
  content: string;
};

export type AiWorkflowPrototype = {
  title: string;
  summary: string;
  href: string;
  ctaLabel: string;
};

export type AiWorkflowProject = {
  title: string;
  label: string;
  focus: string;
  summary: string;
  processHeading?: string;
  process?: AiWorkflowProcessStep[];
  prdWindow?: AiWorkflowPrdWindow;
  prototype?: AiWorkflowPrototype;
  evidence?: AiWorkflowEvidenceAsset[];
  proofPoints: string[];
  closingJudgment: string;
};

export type AiWorkflowWorkCase = {
  kind: "ai-workflow";
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heroNote: string;
  overview: string;
  stats: { label: string; value: string }[];
  projects: AiWorkflowProject[];
  evidence: AiWorkflowEvidenceAsset[];
  callout: string;
};

export type ResumeContact = {
  label: string;
  value: string;
  href?: string;
};

export type ResumeHighlight = {
  title: string;
  body: string;
  detail: string;
};

export type ResumeOverviewDetail = {
  label: string;
  value: string;
};

export type ResumePdfEmbed = {
  title: string;
  href: string;
  note: string;
};

export type ResumeWorkCase = {
  kind: "resume";
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heroNote: string;
  overview: {
    summary: string;
    direction: string;
    details: ResumeOverviewDetail[];
    contacts: ResumeContact[];
    pdf: {
      label: string;
      href: string;
    };
  };
  highlights: ResumeHighlight[];
  pdfEmbed: ResumePdfEmbed;
};

export type WorkCase =
  | StandardWorkCase
  | AiWorkflowWorkCase
  | ResumeWorkCase
  | SelectedBuildsWorkCase
  | FinanceSkillsWorkCase
  | DevelopHarnessWorkCase;

export const siteNav: NavItem[] = [
  { href: "/#work", label: "Work" },
  { href: "/story", label: "Story", isDraft: true },
  { href: "/process", label: "Process", isDraft: true },
  { href: "/#connect", label: "Connect" },
  { href: "/resume.pdf", label: "Resume", highlight: true },
];

export const homeContent = {
  hero: {
    eyebrow: "AI x Finance x Product",
    title: ["Su", "Tianrun"],
    summary: "做研究，也把它做出来。",
    intro:
      "首页只放入口。具体内容，点进去再看。",
  },
  entries: [
    {
      slug: "selected-builds",
      section: "work",
      href: "/work/selected-builds",
      title: "AI 产品评测与判断",
      subtitle: "AI Product Review & Judgment",
      coverStyle: "selected-builds",
      placement: "left-feature",
    },
    {
      slug: "futures-ai",
      section: "work",
      href: "/work/futures-ai",
      title: "AI Enablement",
      subtitle: "Futures teams, workflow, rollout",
      coverStyle: "futures-ai",
      placement: "top-wide",
    },
    {
      slug: "ai-benchmark",
      section: "work",
      href: "/work/ai-benchmark",
      title: "AI 工作流与实践",
      subtitle: "AI Workflow & Practice",
      coverStyle: "ai-workflow-character",
      placement: "right-feature",
    },
    {
      slug: "story",
      section: "story",
      href: "/story",
      title: "Story",
      subtitle: "Education, practice, arc",
      coverStyle: "story",
      placement: "bottom-left",
    },
    {
      slug: "process",
      section: "process",
      href: "/process",
      title: "Process",
      subtitle: "How I think and build",
      coverStyle: "process",
      placement: "bottom-center",
    },
  ] satisfies HomeEntry[],
  connect: {
    eyebrow: "Connect",
    title: "Open to thoughtful conversations.",
    summary: "如果你想继续聊 AI、金融、产品实践，欢迎直接联系我。",
    links: [
      {
        label: "Email",
        value: "sutianrun@ucass.com",
        href: "mailto:sutianrun@ucass.com",
      },
      {
        label: "GitHub",
        value: "@maxlory",
        href: "https://github.com/maxlory",
      },
      {
        label: "Resume",
        value: "Download PDF",
        href: "/resume.pdf",
        download: true,
      },
    ],
  },
} as const;

export const workCases: WorkCase[] = [
  {
    kind: "resume",
    slug: "futures-ai",
    title: "苏天润",
    subtitle: "AI 产品、金融场景与工作流实践",
    eyebrow: "Resume",
    heroNote: "项目经历与完整 PDF 简历",
    overview: {
      summary:
        "关注金融场景、工作流设计与产品落地，希望把研究、结构化分析和真实执行连接在同一条链路里。",
      direction: "求职方向聚焦 AI 产品经理与 AI 产品相关岗位。",
      details: [
        {
          label: "当前状态",
          value: "中国社会科学院研究生院金融硕士在读",
        },
        {
          label: "关注方向",
          value: "AI 产品、金融场景、工作流实践",
        },
        {
          label: "求职方向",
          value: "AI 产品经理 / AI 产品相关岗位",
        },
      ],
      contacts: [
        {
          label: "Email",
          value: "sutianrun@ucass.com",
          href: "mailto:sutianrun@ucass.com",
        },
        {
          label: "GitHub",
          value: "@maxlory",
          href: "https://github.com/maxlory",
        },
      ],
      pdf: {
        label: "下载简历 PDF",
        href: "/resume.pdf",
      },
    },
    highlights: [
      {
        title: "Claw 投研产品体验测试",
        body: "评测框架设计与产品判断能力",
        detail:
          "结合真实投研场景设计近30道金融类评测题，系统比较回答质量、专业性与任务完成度。",
      },
      {
        title: "AI 竞品分析报告",
        body: "行业洞察与结构化分析能力",
        detail:
          "围绕 WindClaw 与东方财富 Skills 做横向对比，形成可量化的竞品分析结论并支撑体验判断。",
      },
      {
        title: "RSS 的 n8n 工作流",
        body: "自动化流程设计与prompt调优",
        detail:
          "独立搭建 AI 前沿信息追踪工作流，完成抓取、清洗、规范化处理与飞书推送。",
      },
      {
        title: "JobMatch 小程序",
        body: "AI 产品从 0 到 1 的全栈搭建工作流",
        detail:
          "围绕岗位信息存档、JD 结构化提取与长期管理，完成 PRD、版本范围与核心流程设计。",
      },
      {
        title: "媒体通稿发布",
        body: "产品内容包装与对外表达能力",
        detail:
          "将项目信息整理为可对外发布的内容版本，强调表达结构、重点提炼与成品感。",
      },
    ],
    pdfEmbed: {
      title: "完整简历",
      href: "/resume.pdf",
      note: "项目经历之后可直接继续下滑查看整份 PDF 简历。",
    },
  },
  {
    kind: "ai-workflow",
    slug: "ai-benchmark",
    title: "AI Workflow",
    subtitle: "全栈工作流和prompt调优",
    eyebrow: "Work",
    heroNote: "JobMatch / Lets Go RSS",
    overview:
      "这里整理了两个 AI Workflow 项目：JobMatch 侧重全栈搭建，RSS 工作流侧重信息处理、prompt 调优和交付。",
    stats: [
      { label: "Projects", value: "2" },
      { label: "JobMatch focus", value: "Full-stack" },
      { label: "RSS focus", value: "Prompt tuning" },
      { label: "Evidence", value: "5 assets" },
    ],
    projects: [
      {
        title: "JobMatch",
        label: "Case 01",
        focus: "Full-stack workflow",
        summary:
          "JobMatch 是一个全栈岗位管理项目：围绕 PRD、数据结构、JD 提取、前端确认和 GitHub 开发规范，展示把需求推进成完整产品流程的方式。",
        process: [
          {
            title: "搭建全栈项目底座",
            body:
              "从 GitHub 获取主体框架，先确认前端、后端、存储、部署等完整技术栈，并把它作为项目模板；同时参考 MCP 框架，为后续功能接入预留结构。最终结合当前需求范围，没有将 MCP 功能纳入本次具体构建。",
          },
          {
            title: "用 PRD 固化需求边界",
            body:
              "以自建 PRD 文档为模板，结合 create-prd、brainstorming 等 skill，以及 agent 的 Plan Mode，持续沟通产品细节，逐步确定功能目标、用户场景和版本边界，并把结论沉淀到 JobMatch 的 PRD 文档中。",
          },
          {
            title: "反复追问未定细节",
            body:
              "PRD 初稿完成后，继续用 brainstorming 对未覆盖的产品细节逐轮提问，每次给出可选方案，再选择最适合当前版本的实现方式。",
          },
          {
            title: "沉淀项目 rules",
            body:
              "根据我常用技术栈和项目边界，包括前端 Next.js、后端 FastAPI 等规则，让 Codex 生成本项目专用 rules，确保 AI 在开发时始终理解技术约束、项目边界和不能跑偏的地方。",
          },
          {
            title: "根据使用体验持续优化",
            body:
              "在实际试用 JobMatch 的过程中，围绕岗位录入、JD 提取结果、字段校对和页面反馈继续调整细节，让流程更贴近真实求职管理场景。",
          },
        ],
        prdWindow: {
          title: "PRD 原文全文",
          sourceLabel: "产品需求文档：JobMatch v3.md",
          downloadHref: "/ai-workflow/jobmatch-prd-excerpt.md",
          content: [
            "# JobMatch v3 产品需求文档",
            "",
            "**文档状态：** Current-state v3",
            "**最后更新时间：** 2026-03-31",
            "**产品名称：** JobMatch",
            "",
            "---",
            "",
            "## 一、项目背景和目标",
            "",
            "### 1.1 项目背景",
            "",
            "JobMatch v3 是一款面向中国大陆实习生和应届生的轻量求职流程管理台。",
            "它解决的问题，不只是“把岗位记录下来”，还包括围绕岗位后续发生的一系列关键流程管理问题，例如：",
            "",
            "- 原始 JD 分散，后续回看时难以找回",
            "- 岗位字段没有整理，回看时仍需重新读长文",
            "- 投递、截止、测评、面试、Offer 等信息散落在不同工具中",
            "- 同一个岗位虽然被记录下来，但后续推进节奏没有被统一管理",
            "",
            "因此，JobMatch v3 不再只是岗位记录工具，而是一个 **以岗位为中心的轻量流程管理工具**，帮助用户在同一个地方完成岗位收纳、信息整理、流程维护和节奏查看。",
            "",
            "### 1.2 产品定位",
            "",
            "JobMatch v3 的产品定位是：",
            "",
            "**一个面向中国大陆实习生和应届生的轻量求职流程管理台。**",
            "",
            "产品的核心特点是：",
            "",
            "- 以岗位为中心管理信息",
            "- 支持岗位录入、字段维护、流程节点维护、日历节奏查看和结构化对比",
            "- AI 只用于辅助提取，不用于推荐、排序、决策或自动执行",
            "- 产品以 Web 为主，桌面打包为辅",
            "",
            "它不是一个推荐工具、判断工具，也不是一个复杂 CRM 系统。",
            "",
            "### 1.3 目标用户",
            "",
            "核心目标用户包括：",
            "",
            "- 中国大陆的实习生和应届生",
            "- 经常收到以微信信息、截图形式获取JD的用户",
            "- 同时在看多个岗位的求职用户",
            "- 岗位信息和流程信息分散在招聘平台、聊天记录、备忘录和日历工具中的用户",
            "- 希望用比表格更直观、比平台收藏更可持续的方式管理岗位和流程的用户",
            "",
            "非目标用户包括：",
            "",
            "- 招聘方、猎头、企业协同场景",
            "- 需要自动海投的用户",
            "- 期望系统直接告诉自己“该选哪个岗位”的用户",
            "- 需要公开搜索全市场岗位的用户",
            "- 需要设置自动提醒的用户。",
            "",
            "### 1.4 产品目标",
            "",
            "JobMatch v3 的目标，是让用户把它当作自己的 **轻量求职流程台持续使用**，而不是只在第一次记录岗位时打开一次。",
            "",
            "它优先解决五件事：",
            "",
            "1. 让用户能快速把岗位存进系统",
            "2. 让原始 JD 在有来源时被长期保留",
            "3. 让当前岗位字段始终可编辑、可修正",
            "4. 让每条岗位都可以继续维护关键流程节点",
            "5. 让用户能按月看到截止、测评、面试和结果节奏。",
            "",
            "---",
            "",
            "## 二、功能详细说明",
            "",
            "### 2.1 功能列表",
            "",
            "JobMatch v3 当前核心功能包括：",
            "",
            "1. 统一岗位创建",
            "2. JD 粘贴录入",
            "3. 纯手动创建",
            "4. AI 辅助固定字段提取",
            "5. 当前岗位记录管理",
            "6. 原始 JD 快照保留",
            "7. 流程节点与流程摘要",
            "8. 月历视图",
            "9. 搜索、筛选、归档和删除",
            "10. 结构化对比",
            "11. 轻量重复提醒",
            "",
            "---",
            "",
            "### 2.2 详细功能描述",
            "",
            "#### 功能 1：统一岗位创建",
            "",
            "产品通过统一新建页拥有两种正式录入方式：",
            "",
            "- JD 粘贴录入",
            "- 纯手动创建",
            "",
            "两种路径都可以生成正式岗位记录。",
            "其中，纯手动创建不是提取失败后的替代方案，而是一条正式、一等的录入路径。",
            "",
            "---",
            "",
            "#### 功能 2：JD 粘贴录入",
            "",
            "用户在任意渠道看到岗位 JD 后，可将原始 JD 粘贴到统一新建页中，并手动触发字段提取。",
            "系统会基于 JD 返回固定字段草稿，只补当前空白字段（用户如果之前手动填充过内容，系统不会覆盖而是保留信息）；随后由用户核对、修改并保存岗位。",
            "",
            "主要价值：",
            "",
            "- 降低岗位录入成本",
            "- 保留原始岗位依据",
            "- 让用户快速形成结构化岗位信息。",
            "",
            "---",
            "",
            "#### 功能 3：纯手动创建",
            "",
            "当用户没有完整 JD，但仍希望先记录岗位时，可通过纯手动方式创建岗位。",
            "用户直接填写核心字段后即可保存岗位，系统生成正式岗位记录。后续如果拿到了原始 JD，还可以继续补充。",
            "",
            "这保证了：",
            "",
            "- 资料不完整时也能记录岗位",
            "- 岗位管理不会因为缺少 JD 而中断。",
            "",
            "---",
            "",
            "#### 功能 4：AI 辅助固定字段提取",
            "",
            "字段提取由后端统一管理，可以通过真实 LLM 或启发式 fallback 完成。",
            "提取结果只作为可编辑草稿，不是系统真相。",
            "",
            "当前固定字段包括：",
            "",
            "- job_title：岗位名称",
            "- company_name：公司名称",
            "- normalized_city：归一化城市",
            "- full_location_text：完整地点文本",
            "- salary_text：薪资原文",
            "- arrival_time：到岗时间",
            "- application_method_text：投递方式原文",
            "- resume_naming_convention：简历命名方式",
            "- job_description_excerpt：职位描述原文片段",
            "- job_requirements_excerpt：职位要求原文片段",
            "- other_content_excerpt：其他内容",
            "",
            "设计原则：",
            "",
            "- 提取失败不阻断保存",
            "- 只补空白字段，不自动覆盖已有内容",
            "- 原文片段尽量保留结构，不总结、不改写。",
            "",
            "---",
            "",
            "#### 功能 5：当前岗位记录管理",
            "",
            "用户日常搜索、筛选、查看、编辑和对比的核心对象，是当前岗位记录（CurrentJobRecord）。",
            "",
            "规则包括：",
            "",
            "- 所有字段都允许用户修改",
            "- 用户修改后的值是当前生效记录",
            "- 搜索、筛选、对比和详情展示主要基于这层记录",
            "- 编辑当前记录时，不能覆盖原始 JD 快照",
            "",
            "这一层代表系统中“用户当前认可的正式信息”。",
            "",
            "---",
            "",
            "#### 功能 6：原始 JD 快照保留",
            "",
            "当岗位通过 JD 粘贴录入时，系统会保留一份 JD 快照（JDSnapshot）作为原始依据。",
            "",
            "当前版本规则：",
            "",
            "- 后台长期保留快照",
            "- 前台详情页当前只展示最新一份快照",
            "- 新快照不会自动覆盖当前岗位字段",
            "- 纯手动创建的岗位可以暂时没有快照",
            "",
            "该功能的主要价值在于保留原始依据，方便后续回看、核对和追溯。",
            "",
            "---",
            "",
            "#### 功能 7：流程节点与流程摘要",
            "",
            "每条岗位都可以维护正式的流程节点（WorkflowEvent），例如：",
            "",
            "- planned_apply（计划投递）",
            "- application_deadline（投递截止）",
            "- applied（已投递）",
            "- assessment（测评）",
            "- interview（面试）",
            "- offer",
            "- rejected（未通过）",
            "- closed（关闭）",
            "",
            "系统会基于这些节点，自动推导流程摘要，包括：",
            "",
            "- 当前进度",
            "- 下一节点",
            "- 是否已过截止",
            "",
            "这一步的意义，是让用户不仅能记录岗位，还能持续管理这条岗位后续发生的关键事件。",
            "",
            "---",
            "",
            "#### 功能 8：月历视图",
            "",
            "系统提供按月查看的 CalendarMonth 视图，用于查看当前活跃岗位的关键流程节点。",
            "",
            "当前规则：",
            "",
            "- 默认聚焦未归档岗位",
            "- 按月份查看截止、测评、面试和结果",
            "- 支持从月历继续打开岗位详情",
            "- 适合帮助用户理解“这个月要处理什么”",
            "",
            "月历视图的核心价值，是让用户在时间维度上管理岗位节奏，而不只是停留在静态记录层。",
            "",
            "---",
            "",
            "#### 功能 9：搜索、筛选、归档和删除",
            "",
            "主列表围绕已保存岗位工作，支持：",
            "",
            "- 对当前字段搜索",
            "- 对原始 JD 全文搜索",
            "- 按城市筛选",
            "- 按公司名称筛选",
            "- 按归档状态筛选",
            "- 归档岗位",
            "- 删除岗位",
            "",
            "其中：",
            "",
            "- 归档用于保持主列表整洁",
            "- 删除用于移除不再需要的岗位。",
            "",
            "---",
            "",
            "#### 功能 10：结构化对比",
            "",
            "系统支持对已保存岗位进行结构化对比。",
            "该功能属于支持能力，而不是主产品承诺本身。",
            "",
            "当前规则：",
            "",
            "- 只能选择已保存岗位",
            "- 一次最少 2 个、最多 4 个岗位",
            "- 用户自己选择对比字段",
            "- 系统只展示字段，不输出自动结论、推荐或排序",
            "",
            "该能力主要帮助用户在多个已保存岗位之间进行自主比较。",
            "",
            "---",
            "",
            "#### 功能 11：轻量重复提醒",
            "",
            "系统在创建岗位时提供轻量重复提醒，但不自动合并岗位。",
            "",
            "当前逻辑优先参考：",
            "",
            "- 岗位名称",
            "- 公司名称",
            "- 归一化城市",
            "",
            "如果没有可靠唯一标识，系统只做提醒，不做强制合并。",
            "",
            "---",
            "",
            "### 2.3 优先级排序",
            "",
            "#### Must have（必须有）：核心功能，满足基本需求",
            "",
            "- 统一岗位创建",
            "- JD 粘贴录入",
            "- 纯手动创建",
            "- AI 辅助固定字段提取",
            "- 当前岗位字段编辑",
            "- 原始 JD 快照保留",
            "- 流程节点新增、修改、删除",
            "- 进度、下一节点和是否过截止摘要",
            "- 月历视图",
            "- 搜索、筛选、归档和删除",
            "- 轻量重复提醒",
            "",
            "#### Should have（应该有）：增强体验，提升转化",
            "",
            "- 列表、详情、月历之间的一致性优化",
            "- 快照历史展示优化",
            "- 对比页阅读效率优化",
            "- 字段提取失败后的引导体验优化",
            "- 流程节点维护交互优化",
            "",
            "#### Could have（可以有）：锦上添花，非必需",
            "",
            "- 更清楚地暴露快照历史",
            "- 用户主动触发的更多输入来源补强",
            "- 桌面端交付体验持续优化",
            "- 结构化对比页进一步增强",
            "",
            "#### Won’t have（暂不考虑）",
            "",
            "- 自动推荐最优岗位",
            "- 自动岗位排名",
            "- 自动联系 HR",
            "- 自动投递",
            "- 自动持续抓取平台岗位",
            "- 黑盒式职业建议",
            "- 能力差距分析",
            "- 复杂 CRM、团队协作、自动编排型重系统。",
            "",
            "---",
            "",
            "## 三、产品边界说明",
            "",
            "JobMatch v3 的核心定位是：",
            "",
            "**以岗位为中心的轻量流程管理工具，而不是判断工具、推荐工具或自动执行工具。**",
            "",
            "因此，它明确不负责：",
            "",
            "- 自动推荐更好的岗位",
            "- 自动给岗位打分或排名",
            "- 自动联系 HR 或自动投递",
            "- 自动持续抓取全市场岗位",
            "- 职业路线建议",
            "- 能力差距分析",
            "- 黑盒式决策",
            "",
            "产品虽然支持记录 `已投递 / 面试 / Offer / 未通过 / 关闭` 等流程节点，但这并不意味着要演变成一个复杂招聘 CRM。",
            "其首要目标仍然是：轻、可控、手动优先。",
            "",
            "---",
            "",
            "## 四、关键结果（KR）",
            "",
            "**核心目标：** 证明用户愿意把 JobMatch 当作轻量求职流程台持续使用。",
            "",
            "- 用户可以在 3 分钟内通过 JD 粘贴录入或纯手动创建保存一条岗位",
            "- 100% 的已保存岗位都必须保留一份有效依据：原始 JD 快照，或纯手动创建时的核心三字段",
            "- 100% 的字段提取失败场景都不能阻断保存",
            "- 对已维护流程节点的岗位，列表、详情和日历展示的当前进度 / 下一节点 / 是否过截止必须保持一致",
            "- 用户可以在 30 秒内通过搜索、筛选或日历找到之前保存的岗位或本月关键节点",
            "- 用户可以从主列表选择 2-4 个已保存岗位并完成一次无推荐、无自动结论的结构化对比。",
            "",
            "---",
            "",
            "## 五、总结",
            "",
            "JobMatch v3 的主承诺已经不再只是“岗位收纳”，而是：",
            "",
            "**记录岗位 + 管流程节点 + 看时间节奏**",
            "",
            "它的核心价值不是替用户做决策，而是把用户已经在做的岗位管理动作，放进一个统一、轻量、可持续维护的闭环中。",
            "",
            "从产品演进角度看，JobMatch v3 已经从“轻量岗位记录工具”升级为“轻量求职流程管理台”，更接近真实求职过程中的持续使用场景。",
          ].join("\n"),
        },
        prototype: {
          title: "Axure 交互原型",
          summary:
            "用 Axure 把 JobMatch 的岗位创建、字段提取、流程节点、日历和结构化对比做成了一套可交互原型，实现把需求文档进一步转成页面结构、信息层级和关键交互流程的能力。",
          href: "/jobmatch-prototype-v20260409a/start?v=20260409a",
          ctaLabel: "打开完整原型",
        },
        proofPoints: [
          "从岗位存档、JD 提取、字段校对这些真实求职场景出发设计流程。",
          "演示视频展示从输入岗位信息到提取字段、确认校对的完整路径。",
          "GitHub README 体现本地安全初始化、功能分支、检查、checkpoint/tag 等工程纪律。",
        ],
        closingJudgment: "",
      },
      {
        title: "Lets Go RSS",
        label: "Case 02",
        focus: "Prompt tuning",
        summary:
          "Lets Go RSS 是一个 AI 前沿信息追踪系统：用 n8n 串起 RSS 抓取、摘要分类、入库和飞书推送，同时用 prompt_tuning 目录把分类与摘要能力拆成可测试、可对比、可迭代的实验。",
        processHeading: "具体调优流程",
        process: [
          {
            title: "明确 prompt 调优目标",
            body:
              "先把调优目标拆成三件事：分类要稳定落到六个固定类别，摘要要能说明核心事实和关注角度，输出必须能被 n8n 稳定读取。这样 prompt 调优不是追求“写得更像总结”，而是围绕可交付的结果迭代。",
          },
          {
            title: "固定每日真实测试物料",
            body:
              "每天从真实 RSS 信息流中摘取一批测试物料，保留标题、来源、时间、描述和链接，作为后续 prompt 调优的固定输入。每轮改 prompt 都在同一批物料上对比，避免只凭单次输出观感判断效果。",
          },
          {
            title: "保存不同版本的提示词",
            body:
              "把每一版提示词单独保存下来，并写清楚这一版主要想解决什么问题。这样后续对比时，可以知道变化来自哪里，也能在效果不稳定时回到上一版。",
          },
          {
            title: "合并记录 V1 到 V6 的调试路径",
            body:
              "从生产基线开始逐轮拆问题：V2 处理分类冲突；V3 梳理分类原则和易错规则；V4 强调只依据明确文本分类，并细化 AI产品 vs AI商业化 的边界；V5 强化输出完整性，避免漏条目、错编号或分类名跑偏；V6 将摘要升级为“事实 + 关注角度”的双句结构。",
          },
          {
            title: "确定提示词版本更替规则",
            body:
              "每一轮只改一个主要问题，再用同一批物料和上一版结果对比。只有新版本确实解决了当前问题，同时没有破坏分类稳定性、输出完整性和摘要可读性，才把它替换为新的基线；否则只作为实验记录保留，不进入正式工作流。",
          },
        ],
        evidence: [
          {
            kind: "image",
            title: "RSS n8n 自动化链路",
            label: "Automation map",
            caption:
              "Webhook、RSS 抓取、去重、DeepSeek 摘要分类、Neon 入库与飞书推送串成完整工作流。",
            src: "/ai-workflow/rss-n8n-workflow.png",
            alt: "n8n 工作流画布，展示 RSS 抓取、DeepSeek 摘要分类、Neon 入库和飞书推送节点。",
            width: 2300,
            height: 430,
          },
          {
            kind: "image",
            title: "RSS prompt 调优记录",
            label: "Prompt iteration",
            caption:
              "飞书多维表格记录 V1-V6 / V6 验证，每轮都有测试提示词、测试物料、结果和差异点。",
            src: "/ai-workflow/rss-prompt-tuning.png",
            alt: "飞书多维表格截图，展示 RSS prompt 从 V1 到 V6 验证的测试提示词、测试物料和测试结果记录。",
            width: 2448,
            height: 948,
          },
        ],
        proofPoints: [],
        closingJudgment: "",
      },
    ],
    evidence: [
      {
        kind: "video",
        title: "JobMatch 产品演示",
        label: "Full-stack flow",
        caption:
          "从岗位文本输入，到 AI 提取字段，再进入人工确认与校对界面。",
        src: "/ai-workflow/jobmatch-demo.mp4",
        poster: "/ai-workflow/jobmatch-demo-poster.png",
      },
      {
        kind: "video",
        title: "JobMatch GitHub 规范",
        label: "Engineering workflow",
        caption:
          "README 记录本地安全初始化、功能分支、检查和 checkpoint/tag 流程。",
        src: "/ai-workflow/jobmatch-github.mp4",
        poster: "/ai-workflow/jobmatch-github-poster.png",
      },
      {
        kind: "video",
        title: "RSS 飞书交付效果",
        label: "Delivery proof",
        caption:
          "分类汇总后的每日 AI 前沿信息进入飞书群，成为真实可消费的信息产品。",
        src: "/ai-workflow/rss-feishu-delivery.mp4",
        poster: "/ai-workflow/rss-feishu-delivery-poster.png",
      },
      {
        kind: "video",
        title: "Lets Go RSS GitHub 规范",
        label: "Engineering workflow",
        caption: "README 记录 RSS 抓取、调试、运行和交付链路的项目说明。",
        src: "/ai-workflow/lets-go-rss-github.mp4",
        poster: "/ai-workflow/lets-go-rss-github-poster.png",
      },
    ],
    callout:
      "我不是只会 vibe coding 出一个界面，而是能把 AI 想法推进成可运行、可验证、可复盘的工作流。",
  },
  selectedBuildsCase,
  financeSkillsCase,
  developHarnessCase,
];

export const storyPage = {
  title: "Story",
  subtitle: "Education, practice, and the line that connects them",
  intro:
    "不是简单把简历贴上来，而是解释我为什么会走到现在这条路径上。",
  sections: [
    {
      title: "Education",
      body:
        "中国社会科学院研究生院金融硕士在读，本科毕业于上海理工大学国际金融专业。金融训练给了我理解问题、组织信息和判断结构的底子。",
    },
    {
      title: "Practice",
      body:
        "在上海新见科技做 AI 应用产品实习，在财达证券做债券承做实习。一个偏产品和工作流，一个偏行业研究和分析，逐渐把研究能力和落地能力连到一起。",
    },
    {
      title: "Direction",
      body:
        "我更关注那些既有判断要求、又必须真正做出来的工作。所以会自然走向 AI、金融与产品实践的交叉点。",
    },
  ],
};

export const processPage = {
  title: "Process",
  subtitle: "How I study, structure, and build",
  intro:
    "这里不是技能清单，而是我推进问题的方式：先理解，再拆解，再验证。",
  steps: [
    {
      title: "Frame the problem",
      body:
        "先确认真正的问题是什么，谁在用、为什么重要、判断标准是什么。没有边界的任务很容易变成无效投入。",
    },
    {
      title: "Build a usable structure",
      body:
        "把问题拆成可以比较、可以执行、可以沟通的小块。不管是竞品分析、产品方案还是 workflow 设计，都先建立结构。",
    },
    {
      title: "Validate by making",
      body:
        "只停留在分析层面是不够的。我会尽可能做出原型、流程或小系统，用真实运行结果反过来检验判断。",
    },
  ],
};

export function getWorkCaseBySlug(slug: string) {
  return workCases.find((item) => item.slug === slug);
}

export type LandingNavItem = {
  href: string;
  label: string;
  highlight?: boolean;
};

export type LandingProjectRole = "grid-a" | "grid-b";

export type LandingFinanceCover = {
  kind: "finance";
  label: string;
  sheetName: string;
  headers: string[];
  rows: string[][];
  metrics: string[];
};

export type LandingDevelopCover = {
  kind: "develop";
  nodes: { index: string; name: string; note: string }[];
};

export type LandingWorkCard = {
  slug: string;
  href: string;
  title: string;
  type: string;
  outcome: string;
  isDraft?: boolean;
  cover: "dashboard" | "mailroom" | "character" | "systems" | "ledger";
  role: LandingProjectRole;
  coverData?: LandingFinanceCover | LandingDevelopCover;
};

export const landingPageContent = {
  nav: [
    { href: "/#home", label: "Home" },
    { href: "/#work", label: "Work" },
    { href: "/#connect", label: "Connect" },
    { href: "mailto:sutianrun@ucass.com", label: "Start project", highlight: true },
  ] satisfies LandingNavItem[],
  hero: {
    eyebrow: "AI x Finance x Product",
    note:
      "这些既是我来时的路，也是我奔赴的远方。\nAfoot and light-hearted I take to the open road",
    title: "SU TIANRUN",
  },
  work: {
    eyebrow: "My best work",
    note: "from research 'til build",
    cards: [
      {
        slug: "finance-skills",
        href: "/work/finance-skills",
        title: "财务 Skills 协作实战",
        type: "Living Ledger · 月末财务包",
        outcome: "30 个 Skills 贯穿七个财务环节",
        cover: "ledger",
        role: "grid-a",
        coverData: {
          kind: "finance",
          label: "月末财务包",
          sheetName: "Sheet 01 · 清洗与置信度",
          headers: ["原始日期", "标准日期", "标准金额", "状态"],
          rows: [
            ["二月初八", "2026-03-26", "10,800", "medium / high"],
            ["初十八", "空", "15,000", "needs_review"],
          ],
          metrics: ["7 环节", "30 Skills", "月末财务包"],
        },
      },
      {
        slug: "develop-harness",
        href: "/work/develop-harness",
        title: "人机协同工作案例",
        type: "Evidence Control Room · 任务恢复",
        outcome: "Intent、Build、Review、Verify 协作链与真实测试证据",
        cover: "systems",
        role: "grid-a",
        coverData: {
          kind: "develop",
          nodes: [
            { index: "01", name: "Intent", note: "用户目标" },
            { index: "02", name: "Build", note: "Subagent 实现" },
            { index: "03", name: "Review", note: "独立检查" },
            { index: "04", name: "Verify", note: "证据验证" },
          ],
        },
      },
      {
        slug: "ai-benchmark",
        href: "/work/ai-benchmark",
        title: "AI 工作流与实践",
        type: "Workflow Cinema",
        outcome: "JobMatch 与 Lets Go RSS 的全栈搭建与 prompt 调优",
        cover: "character",
        role: "grid-a",
      },
      {
        slug: "selected-builds",
        href: "/work/selected-builds",
        title: "AI 产品评测与判断",
        type: "AI Product Review",
        outcome: "WindClaw 与东方财富 Skills 的横向评测与产品判断",
        cover: "mailroom",
        role: "grid-b",
      },
      {
        slug: "futures-ai",
        href: "/work/futures-ai",
        title: "AI Enablement",
        type: "Practice Dossier",
        outcome: "把任务、方法、产物与能力变化整理成实践档案",
        cover: "dashboard",
        role: "grid-b",
      },
    ] satisfies LandingWorkCard[],
  },
  story: {
    eyebrow: "Story",
    title: ["NO SHORTCUTS.", "ONLY PRACTICE."],
    paragraphs: [
      "中国社会科学院研究生院金融硕士在读，本科毕业于上海理工大学国际金融专业。金融训练给了我理解问题、组织信息和判断结构的底子。",
      "在上海新见科技做 AI 应用产品实习，在财达证券做债券承做实习。一个偏产品和工作流，一个偏行业研究和分析，逐渐把研究能力和落地能力连到一起。",
      "我更关注那些既有判断要求、又必须真正做出来的工作，所以会自然走向 AI、金融与产品实践的交叉点。",
    ],
    tags: ["Finance", "AI Product", "Workflow", "Research", "Execution"],
  },
  process: {
    eyebrow: "Process",
    title: ["WHAT", "MY", "WORKFLOW", "LOOKS", "LIKE"],
    intro:
      "这里不是技能清单，而是我推进问题的方式：先确认问题，再搭出结构，最后用真实运行结果验证判断。",
    steps: [
      {
        title: "Frame",
        body:
          "先确认真正的问题是什么，谁在用、为什么重要、判断标准是什么。",
      },
      {
        title: "Structure",
        body:
          "把问题拆成可以比较、可以执行、可以沟通的小块，先搭结构，再补细节。",
      },
      {
        title: "Validate",
        body:
          "尽可能做出原型、流程或小系统，用真实结果反过来检验最初的判断。",
      },
    ],
  },
  connect: {
    eyebrow: "Connect",
    title: "Open to thoughtful conversations.",
    summary:
      "如果你想继续聊 AI、金融、产品实践，或者正在推进一个值得认真对待的项目，欢迎直接联系我。",
    cta: {
      label: "Connect",
      href: "mailto:sutianrun@ucass.com",
    },
    links: [
      { label: "Email", value: "sutianrun@ucass.com", href: "mailto:sutianrun@ucass.com" },
      { label: "GitHub", value: "@maxlory", href: "https://github.com/maxlory" },
      { label: "Resume", value: "Download PDF", href: "/resume.pdf" },
      { label: "Story", value: "Secondary page", href: "/story", isDraft: true },
      { label: "Process", value: "Secondary page", href: "/process", isDraft: true },
    ],
  },
} as const;
