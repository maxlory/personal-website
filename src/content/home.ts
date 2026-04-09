import {
  selectedBuildsCase,
  type SelectedBuildsWorkCase,
} from "@/content/selected-builds";

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

export type AiWorkflowProject = {
  title: string;
  label: string;
  focus: string;
  summary: string;
  processHeading?: string;
  process?: AiWorkflowProcessStep[];
  prdWindow?: AiWorkflowPrdWindow;
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
  | SelectedBuildsWorkCase;

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
          sourceLabel: "产品需求文档：JobMatch v2.md",
          downloadHref: "/ai-workflow/jobmatch-prd-excerpt.md",
          content: [
            "# 产品需求文档：JobMatch v2",
            "",
            "**文档状态：** 草稿版 v2",
            "",
            "**最后更新时间：** 2026-03-24",
            "",
            "**产品名称：** JobMatch",
            "",
            "## 1. 概述",
            "",
            "JobMatch v2 是一款面向中国大陆实习生和应届生的轻量化岗位管理平台。其首版核心目标并非替用户做决策，而是帮助用户将岗位信息稳定记录、整理为固定字段、长期留存原始岗位描述（JD），并支持后续随时检索、回看、修改及归档。",
            "",
            "首版产品将以小范围在线网页版最小可行产品（MVP）的形式验证价值。聚焦于岗位记录、字段提取、当前岗位信息管理及后台岗位描述（JD）快照留存，暂不支持投递跟踪、职业规划、自动推荐或自动排名功能。",
            "",
            "## 2. 负责人",
            "",
            "|  姓名  |      角色      |                     备注                     |",
            "| :----: | :------------: | :------------------------------------------: |",
            "| 你本人 |   产品负责人   |     负责产品方向、范围判断及验收标准制定     |",
            "|  本人  |   技术负责人   |  负责前后端实现、数据结构设计及系统边界界定  |",
            "|  本人  |   设计负责人   | 负责新建页、列表页、详情页设计及信息层级规划 |",
            "|  本人  | 用户研究负责人 |       负责小范围内测及真实使用反馈收集       |",
            "",
            "## 3. 背景",
            "",
            "### 3.1 需求背景",
            "",
            "实习生和应届生在求职过程中，常需在招聘软件、聊天记录、朋友圈及笔记工具间频繁切换。看到意向岗位时，多数人会先截图、收藏、转发给自己，或简单复制到备忘录中。",
            "",
            "这种方式存在以下固有问题：",
            "",
            "- 岗位信息分散，难以长期管理",
            "- 同一岗位可能被重复保存，且内容不一致",
            "- 一段时间后，用户往往无法记起原始岗位描述（JD）的存放位置",
            "- 回看岗位时，需在多个工具间反复查找",
            "- 多数用户有整理岗位的需求，但不愿维护复杂表格",
            "",
            "### 3.2 如何推进",
            "",
            "当前可通过更轻量化的方式解决上述问题：将原始岗位描述（JD）作为长期资产留存，同时通过固定字段整理岗位当前信息。既保留原文，又形成可编辑、可检索、可筛选的岗位记录。",
            "",
            "该方向具备优先推进的条件：",
            "",
            "- 用户已养成复制岗位文本的习惯，录入门槛低",
            "- 大模型可辅助提取固定字段，且无需替代用户决策",
            "- 在线网页形态可为后续岗位描述（JD）历史留存及平台数据来源拓展奠定基础",
            "",
            "### 3.3 产品边界",
            "",
            "JobMatch v2 的核心定位是岗位管理工具，而非决策判断工具。",
            "",
            "首版主线功能不包含以下能力：",
            "",
            "- 投递状态跟踪",
            "- 能力差距分析",
            "- 职业路径建议",
            "- 自动岗位推荐",
            "- 自动岗位排序",
            "- 自动联系人力资源（HR）",
            "- 自动持续抓取平台岗位信息",
            "",
            "未来即便接入 BOSS MCP，产品主线仍聚焦岗位管理，而非平台聚合或黑盒决策。",
            "",
            "## 4. 目标",
            "",
            "### 4.1 产品目标",
            "",
            "JobMatch v2 首版目标是让用户愿意持续将岗位信息录入系统，并将其作为核心岗位管理平台长期使用。",
            "",
            "优先解决四大核心问题：",
            "",
            "1. 岗位记录流程足够轻量化，降低用户多次使用的门槛",
            "2. 岗位信息足够清晰，支持用户快速找回历史记录",
            "3. 原始岗位描述（JD）得到长期留存，而非仅保留二次整理结果",
            "4. 为后续结构化岗位对比及选岗环节奠定规范的数据基础",
            "",
            "### 4.2 核心价值",
            "",
            "对用户而言，核心需求并非系统替其分析，而是避免岗位信息持续丢失和散乱。唯有岗位信息被稳定收纳，后续的对比、选择及投递准备才有基础。",
            "",
            "对产品而言，先打造轻量化岗位管理平台，相比同时开发投递管理、选岗建议、职业分析等功能更稳妥。可先验证用户的长期使用意愿，再决定下一阶段是否拓展更多能力。",
            "",
            "### 4.3 策略一致性",
            "",
            "本产品需求文档（PRD）遵循以下长期原则：",
            "",
            "- 人工智能（AI）仅用于辅助字段提取，不替用户做决策",
            "- 用户可查看、修改、确认当前岗位记录",
            "- 原始岗位描述（JD）属于长期资产，需单独留存",
            "- 手动录入是长期正式录入方式，不会因接入平台而取消",
            "- 平台能力仅作为数据来源，而非产品核心定位",
            "",
            "### 4.4 关键结果",
            "",
            "**核心目标：** 验证用户愿意将 JobMatch 作为岗位管理平台持续使用。",
            "",
            "- **关键结果 1（KR1）：** 小范围内测中，用户可在 3 分钟内通过「岗位描述（JD）粘贴」或「纯手动创建」完成一条岗位记录的保存。",
            "- **关键结果 2（KR2）：** 100% 已保存的岗位需留存有效依据：原始岗位描述（JD）快照，或纯手动创建时填写的核心三字段。",
            "- **关键结果 3（KR3）：** 100% 的字段提取失败场景均不阻断保存流程，用户可切换至手动录入路径完成操作。",
            "- **关键结果 4（KR4）：** 小范围内测中，活跃试用用户中至少半数会在多个独立会话中重复新增或修改岗位记录。",
            "- **关键结果 5（KR5）：** 核心可用性测试中，用户可在 30 秒内通过搜索或基础筛选找到已保存的岗位。",
            "",
            "## 5. 目标市场细分",
            "",
            "### 5.1 核心目标人群",
            "",
            "首版主要服务以下用户：",
            "",
            "- 中国大陆的实习生及应届生",
            "- 正集中求职、投递、整理岗位信息的人群",
            "- 岗位信息分散在多个软件及记录工具中的用户",
            "- 希望通过轻量化、长期化、可回看的方式管理岗位的用户",
            "",
            "### 5.2 核心待办任务",
            "",
            "当用户在任意渠道看到值得关注的岗位时，期望快速记录信息、留存关键内容，并能在后续快速找回、补充及管理该岗位信息。",
            "",
            "### 5.3 约束条件",
            "",
            "该人群通常存在以下约束：",
            "",
            "- 时间碎片化，不愿维护复杂系统",
            "- 原始岗位描述（JD）来源分散，格式不统一",
            "- 有时仅能获取部分岗位描述（JD），有时仅掌握核心信息",
            "- 对黑盒化结论存疑，更信任可查看、可修改的记录",
            "- 初期未必愿意绑定平台账号、邮箱或完整简历",
            "",
            "### 5.4 V1 非目标人群",
            "",
            "首版暂不优先服务以下场景：",
            "",
            "- 招聘方、猎头或企业用户",
            "- 需自动批量投递的用户",
            "- 期望系统直接给出职业建议的用户",
            "- 需公开检索全量市场岗位的用户",
            "- 核心需求为投递流程管理而非岗位管理的用户",
            "",
            "## 6. 价值主张",
            "",
            "### 6.1 用户核心任务与需求",
            "",
            "用户的核心诉求为：",
            "",
            "- 稳定记录看到的岗位信息",
            "- 不丢失原始岗位描述（JD）",
            "- 快速形成可管理的当前岗位信息",
            "- 后续需要时能快速检索到该岗位",
            "- 为投递准备留存关键信息",
            "",
            "### 6.2 用户收益",
            "",
            "JobMatch v2 为用户带来的核心收益：",
            "",
            "- 统一的岗位管理入口",
            "- 可编辑的当前岗位记录",
            "- 长期留存的原始岗位描述（JD）快照",
            "- 比表格更轻量化、比笔记更结构化的管理方式",
            "- 无完整岗位描述（JD）时仍可手动记录岗位信息",
            "",
            "### 6.3 解决的痛点",
            "",
            "核心解决以下用户痛点：",
            "",
            "- 岗位记录分散在不同工具中",
            "- 后续检索时无法快速找到目标岗位",
            "- 回看岗位时需重新阅读大段文本",
            "- 仅保留整理结果，丢失原始岗位描述（JD）",
            "- 因资料不完整而放弃记录岗位信息",
            "",
            "### 6.4 相比竞品的优势",
            "",
            "相较于普通笔记工具，JobMatch 结构化更强；相较于复杂表格，更轻量化；相较于自动决策工具，更具可控性；相较于平台收藏功能，更适合长期留存及持续整理。",
            "",
            "产品核心价值并非替用户决策选岗，而是帮助用户先理清岗位信息。",
            "",
            "## 7. 解决方案",
            "",
            "### 7.1 用户体验 / 核心用户流程",
            "",
            "首版核心流程围绕统一新建页展开。",
            "",
            "**路径 A：岗位描述（JD）粘贴录入**",
            "",
            "1. 用户在任意渠道获取岗位描述（JD）",
            "2. 用户将岗位描述（JD）粘贴至统一新建页",
            "3. 用户手动触发字段提取操作",
            "4. 系统从岗位描述（JD）中提取固定字段，仅填充当前空白字段",
            "5. 用户核对并修改当前岗位信息",
            "6. 用户保存岗位记录",
            "7. 岗位进入主列表，后续可检索、筛选、归档及编辑",
            "",
            "**路径 B：纯手动创建**",
            "",
            "1. 用户无完整岗位描述（JD），但希望先记录岗位信息",
            "2. 用户在统一新建页展开手动创建表单",
            "3. 用户填写核心三字段：岗位名称、公司名称、所在地",
            "4. 用户保存岗位记录",
            "5. 后续获取原始岗位描述（JD）后，可补充并触发字段提取",
            "",
            "**失败与降级处理**",
            "",
            "- 字段提取失败时，系统主动引导用户手动填写",
            "- 用户仍可保存岗位记录，不会因提取失败导致记录丢失",
            "- 系统提供「重新提取」次级入口，但不阻断主流程",
            "",
            "### 7.2 核心功能",
            "",
            "#### 功能 A：统一岗位创建",
            "",
            "首版通过统一新建页承载两种正式录入方式：",
            "",
            "- 「岗位描述（JD）粘贴录入」",
            "- 「纯手动创建」",
            "",
            "两种路径均可生成正式岗位记录，纯手动创建并非临时占位，而是同等优先级的记录方式。",
            "",
            "#### 功能 B：固定字段提取",
            "",
            "首版采用固定字段体系，不支持自由标签。字段提取由大模型辅助完成，提取结果仅作为草稿。",
            "",
            "当前岗位记录至少包含以下字段：",
            "",
            "- 岗位名称",
            "- 公司名称",
            "- 归一化城市",
            "- 完整地点文本",
            "- 薪资原文",
            "- 到岗时间",
            "- 投递方式原文",
            "- 简历命名方式",
            "- 职位描述原文片段",
            "- 职位要求原文片段",
            "",
            "以下内容不单独设为字段：",
            "",
            "- 经验要求",
            "- 学历要求",
            "- 自动总结建议",
            "",
            "相关内容如需留存，统一纳入「职位要求」原文片段中。",
            "",
            "#### 功能 C：当前岗位记录",
            "",
            "用户日常查看、编辑、检索、筛选的核心对象为「当前岗位记录」。",
            "",
            "核心要求：",
            "",
            "- 所有固定字段支持用户修改",
            "- 用户修改后的字段为当前生效的正式记录",
            "- 检索、筛选及后续对比均以该层记录为核心依据",
            "",
            "#### 功能 D：岗位描述（JD）快照留存",
            "",
            "每次导入原始岗位描述（JD）时，系统自动留存一份快照。V1 版本先在后台留存，暂不要求前台展示历史快照列表。",
            "",
            "历史快照的核心作用：",
            "",
            "- 留存原始信息来源",
            "- 支持长期追溯",
            "- 为后续平台数据来源接入及版本变更奠定基础",
            "",
            "V1 版本规则：",
            "",
            "- 新快照不会自动覆盖当前岗位记录",
            "- 同一岗位新增快照后，是否更新当前岗位信息需用户人工确认",
            "",
            "#### 功能 E：检索、筛选与归档",
            "",
            "首版主列表围绕岗位主记录设计，支持：",
            "",
            "- 固定字段检索",
            "- 原始岗位描述（JD）全文检索",
            "- 按归一化城市筛选",
            "- 按公司名称筛选",
            "- 按归档状态筛选",
            "",
            "岗位默认进入主列表，用户可将不再关注的岗位归档，保持主列表整洁。",
            "",
            "#### 功能 F：重复提醒",
            "",
            "首版仅提供轻量化重复提醒，不强制自动合并。提醒规则优先基于：",
            "",
            "- 岗位名称",
            "- 公司名称",
            "- 归一化城市",
            "",
            "后续接入平台数据后，优先以平台岗位 ID 作为岗位唯一标识；无可靠 ID 时，仅触发提醒，不自动强制合并。",
            "",
            "### 7.3 技术方案",
            "",
            "首版采用小范围在线网页应用形态，而非本地个人工具。",
            "",
            "技术栈沿用现有基线：",
            "",
            "- 前端：Next.js App Router、TypeScript、Tailwind CSS、DaisyUI",
            "- 后端：FastAPI、SQLAlchemy、Pydantic、PostgreSQL",
            "- 人工智能（AI）：由后端统一调用，用于固定字段提取",
            "- 多渠道协作平台（MCP）：作为数据来源适配层，不存储核心业务状态",
            "",
            "数据层建议从 V1 版本起清晰分层：",
            "",
            "- 「岗位主记录」",
            "- 「当前岗位字段」",
            "- 「原始岗位描述（JD）快照」",
            "",
            "后续接入 BOSS MCP 需遵循以下原则：",
            "",
            "- 仅作为正式数据来源之一",
            "- 手动粘贴岗位描述（JD）仍为长期核心录入路径",
            "- 平台导入需由用户主动触发",
            "- 平台能力不应改变产品「管理工具而非决策工具」的核心定位",
            "",
            "### 7.4 核心假设",
            "",
            "本产品需求文档（PRD）基于以下假设：",
            "",
            "- 用户愿意持续使用轻量化岗位管理平台",
            "- 固定字段相比自由标签更适合首版长期数据积累",
            "- 在线网页架构更利于后续岗位描述（JD）历史留存及平台数据来源拓展",
            "- 大模型字段提取是首版核心能力，但不可作为保存操作的前置条件",
            "- 未来岗位对比仅需结构化字段罗列，无需系统替用户决策",
            "",
            "## 8. 版本规划",
            "",
            "### 8.1 V1 / 核心优先级（P0）",
            "",
            "首版交付小范围在线网页版最小可行产品（MVP），核心验证「岗位管理平台」的价值可行性。",
            "",
            "首版功能范围：",
            "",
            "- 统一新建页",
            "- 岗位描述（JD）粘贴录入",
            "- 纯手动创建",
            "- 固定字段提取",
            "- 当前岗位记录编辑",
            "- 原始岗位描述（JD）快照后台留存",
            "- 检索功能",
            "- 基础筛选功能",
            "- 归档功能",
            "- 轻量化重复提醒",
            "",
            "首版明确不做的功能：",
            "",
            "- 投递状态跟踪",
            "- 岗位优劣自动判断",
            "- 能力差距分析",
            "- 职业路径建议",
            "- 自定义标签体系",
            "- 前台展示岗位描述（JD）历史版本",
            "",
            "### 8.2 V1.1 / 次核心优先级（P1）",
            "",
            "V1 版本验证通过后，进入下一阶段迭代：",
            "",
            "- 支持用户主动发起的结构化岗位对比",
            "- 对比对象仅限用户已保存的岗位",
            "- 对比方式以结构化字段罗列为主",
            "- 将 BOSS MCP 作为正式数据来源之一接入",
            "",
            "本阶段仍需遵循：",
            "",
            "- 产品仅辅助信息整理，不替用户排名",
            "- 平台能力仅作为数据来源，不改变产品主线",
            "- 手动录入仍为正式录入路径",
            "",
            "### 8.3 远期规划 / 低优先级（P2）",
            "",
            "更远期迭代方向：",
            "",
            "- 前台支持查看同一岗位的岗位描述（JD）快照历史",
            "- 探索用户画像或简历相关能力",
            "- 明确需求后，评估拓展更多数据能力",
            "",
            "以上均非当前版本成功的必要条件。",
            "",
            "### 8.4 明确不做的事项",
            "",
            "以下内容不属于本次新版产品需求文档（PRD）的主线范围：",
            "",
            "- 自动投递",
            "- 自动联系人力资源（HR）",
            "- 自动推荐最优岗位",
            "- 自动岗位排名",
            "- 黑盒化选岗建议",
            "- 全量市场岗位检索聚合",
            "- 自动持续拉取平台岗位信息",
            "- 以职业规划为核心的产品定位",
          ].join("\n"),
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

export type LandingWorkCard = {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  subtitleAccent?: {
    primary: string;
    secondary: string;
  };
  meta?: string;
  isDraft?: boolean;
  cover:
    | "dashboard"
    | "mailroom"
    | "benchmark"
    | "character"
    | "workflow"
    | "research"
    | "practice"
    | "systems"
    | "ledger";
  placement:
    | "top-wide"
    | "left-large"
    | "right-medium"
    | "bottom-wide"
    | "left-small"
    | "center-small"
    | "right-small"
    | "center-wide";
  hoverTilt?: number;
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
        slug: "futures-ai",
        href: "/work/futures-ai",
        title: "项目经历与实践",
        subtitle: "Projects & Practice",
        cover: "dashboard",
        placement: "top-wide",
        hoverTilt: -1.15,
      },
      {
        slug: "selected-builds",
        href: "/work/selected-builds",
        title: "AI 产品评测与判断",
        subtitle: "AI Product Review & Judgment",
        meta: "WindClaw vs 东方财富 Skills",
        cover: "mailroom",
        placement: "left-large",
        hoverTilt: 1.1,
      },
      {
        slug: "ai-benchmark",
        href: "/work/ai-benchmark",
        title: "AI 工作流与实践",
        subtitle: "AI Workflow & Practice",
        cover: "character",
        placement: "right-medium",
        hoverTilt: -1,
      },
      {
        slug: "workflow-systems",
        href: "/work/futures-ai",
        title: "Workflow Systems",
        subtitle: "Signals, summaries, delivery",
        meta: "grounded in the futures case",
        cover: "workflow",
        placement: "bottom-wide",
        isDraft: true,
      },
      {
        slug: "research-frames",
        href: "/work/ai-benchmark",
        title: "Prompt Frames",
        subtitle: "Versions, tests, confidence",
        cover: "research",
        placement: "left-small",
        isDraft: true,
      },
      {
        slug: "practice-log",
        href: "/story",
        title: "Practice Log",
        subtitle: "Finance, product, AI",
        cover: "practice",
        placement: "center-small",
        isDraft: true,
      },
      {
        slug: "system-notes",
        href: "/process",
        title: "System Notes",
        subtitle: "How the pieces connect",
        cover: "systems",
        placement: "right-small",
        isDraft: true,
      },
      {
        slug: "build-ledger",
        href: "/work/selected-builds",
        title: "Build Ledger",
        subtitle: "Scoring, evidence, product sense",
        meta: "analysis, tests, raw markdown",
        cover: "ledger",
        placement: "center-wide",
        isDraft: true,
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
