export type SelectedBuildsOverviewInsight = {
  title: string;
  body: string;
};

export type SelectedBuildsProductSection = {
  title: string;
  body: string;
};

export type SelectedBuildsProductDossier = {
  product: string;
  label: string;
  summary: string;
  sections: SelectedBuildsProductSection[];
  strengths: string[];
  risks: string[];
  verdict: string;
};

export type SelectedBuildsMethodSection = {
  title: string;
  body: string;
};

export type SelectedBuildsAppendixDoc = {
  title: string;
  product: "东方财富 Skills" | "WindClaw";
  docType: "产品深度分析" | "28题体验评分" | "原始体验实录";
  label: string;
  group: "东方财富 Skills" | "WindClaw";
  anchorId?: string;
  downloadSlug: string;
  renderMode: "inline" | "download-only";
  sourcePath: string;
  defaultCollapsed: boolean;
  priority: number;
};

export type SelectedBuildsNavItem = {
  id: string;
  title: string;
  shortTitle: string;
  href: string;
  kind: "anchor" | "download";
  group: "主内容" | "东方财富 Skills" | "WindClaw";
};

export type SelectedBuildsWorkCase = {
  kind: "selected-builds";
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heroNote: string;
  summary: string;
  role: string;
  conclusion: string;
  stats: { label: string; value: string }[];
  comparison: {
    winner: string;
    overview: string;
    insights: SelectedBuildsOverviewInsight[];
    finalJudgment: string;
  };
  dossiers: SelectedBuildsProductDossier[];
  evaluation: {
    summary: string;
    sections: SelectedBuildsMethodSection[];
  };
  appendix: {
    intro: string;
    docs: SelectedBuildsAppendixDoc[];
  };
  callout: string;
};

export const selectedBuildsCase: SelectedBuildsWorkCase = {
  kind: "selected-builds",
  slug: "selected-builds",
  title: "Selected Builds",
  subtitle: "WindClaw vs 东方财富 Skills",
  eyebrow: "Case Study",
  heroNote: "AI 投研产品对比案例页",
  summary:
    "这页不是把两份体验报告简单贴上来，而是把产品分析、并行测试、逐题重评分和原始问答证据串成一个招聘可读的案例。我要展示的不是“我会做表”，而是我能把一个主观、复杂、容易失真的使用体验问题，收束成可比较、可解释、可复核的判断框架。",
  role:
    "独立完成选题、评判标准设计、问题集搭建、双产品并行测试、逐题重评分和最终结论整理。",
  conclusion:
    "东方财富 Skills 整体更像成品化的金融检索与投研表达助手，但两者共同短板都在于检索错位后仍倾向继续生成，看起来完整，事实边界却不够稳。",
  stats: [
    { label: "Products", value: "2 款" },
    { label: "Prompts", value: "28 题" },
    { label: "Score axes", value: "4 维" },
    { label: "Appendix docs", value: "6 份" },
  ],
  comparison: {
    winner: "东方财富 Skills 整体领先",
    overview:
      "如果从 AI 产品经理招聘的视角看，这个案例最重要的不是“谁赢了”，而是我如何定义胜负。结论层面，东方财富 Skills 在题意承接、结构化表达和长文成稿感上更成熟；WindClaw 在单标数据快查、表格组织和部分简单查询场景里并不弱，但一旦进入新闻、政策、舆情或筛选类任务，题意偏移和边界失控的问题会更明显。",
    insights: [
      {
        title: "谁更强",
        body:
          "东方财富 Skills 的优势在于更贴题，也更像真正完成一份分析任务；WindClaw 更像结构好看的金融问答生成器。",
      },
      {
        title: "各自优势",
        body:
          "东方财富 Skills 更强在政策、舆情、策略和横向比较；WindClaw 更稳在字段明确、范围收敛的单标数据查询和表格化输出。",
      },
      {
        title: "共同短板",
        body:
          "两者一旦检索不准，都不愿意停下来，而是继续把结构写满，用泛化分析补足内容，容易掩盖时间错位、对象错配和口径混杂。",
      },
      {
        title: "我的赛道判断",
        body:
          "这次案例让我更确认金融 AI 的核心护城河仍然是准确、及时、可核验的数据能力。产品体验当然重要，但在投研场景里，可靠信息源始终先于炫目的交互形式。",
      },
    ],
    finalJudgment:
      "真正决定这类产品上限的，不是模型会不会写，而是系统能不能在信息不足时克制收口，并清楚告诉用户“我知道什么、不知道什么”。",
  },
  dossiers: [
    {
      product: "东方财富 Skills",
      label: "Dossier 01",
      summary:
        "东方财富 Skills 更像一个已经能拿来交付初稿的金融检索 + 投研表达助手。它把资讯搜索、金融数据、智能选股和账户管理拆成明确 skill，再借东方财富自有 API 和数据库去支撑输出，所以整体更像有产品化边界的系统，而不只是套壳对话。",
      sections: [
        {
          title: "产品定位与能力边界",
          body:
            "核心能力是把东方财富的金融数据库接进 openclaw，让模型不只靠训练知识和网页搜索回答问题。强项在 A 股数据查询、新闻检索、政策梳理、选股和结构化长文输出；边界是依赖特定数据库口径，部分研究报告和海外信息的权威性判断仍不够稳。",
        },
        {
          title: "功能 / 设计逻辑",
          body:
            "它把投研流程拆成资讯搜索、金融数据、智能选股、自选管理和模拟组合管理几个模块，本质是在降低普通用户提问门槛，同时保留金融数据的专业口径。对产品经理而言，这种“任务能力模块化”的设计很值得看，因为它兼顾了明确入口和数据库约束。",
        },
        {
          title: "测试表现摘要",
          body:
            "在新闻、舆情、政策、对比和策略类题目里，东方财富 Skills 更经常正面回应题目要求，而不是绕开问题。它的结构也更稳定，常常能形成“结论 - 数据 - 解释 - 风险”这种接近成稿的阅读顺序。",
        },
        {
          title: "评分表现摘要",
          body:
            "28 题重评分后，它的主要加分项是题意承接能力、结构化表达和中长篇分析成熟度。主要失分点在财报时间错位、筛选题板块污染，以及少数长文里把综合判断写得过于确定。",
        },
      ],
      strengths: [
        "更像真正按题作答，而不是围绕题目组织一段像答案的内容。",
        "结构化输出稳定，适合直接当研究初稿或汇报材料底稿。",
        "在政策、舆情、策略类任务上更接近“分析成品”。",
      ],
      risks: [
        "长文一旦拿到的证据不够稳，仍会继续包装成完整结论。",
        "筛选题在板块定义和样本清洁度上仍会失控。",
      ],
      verdict:
        "如果目标是快速得到一份可读、可继续加工的投研初稿，东方财富 Skills 明显更适合作为工作流入口。",
    },
    {
      product: "WindClaw",
      label: "Dossier 02",
      summary:
        "WindClaw 的产品气质更强金融终端工具感，背后是 Wind 数据库和一组面向投研任务的模板入口。它的优点不是“会说”，而是给用户一种可以直接在专业语境下聊股票、谈策略、做对比的感觉。",
      sections: [
        {
          title: "产品定位与能力边界",
          body:
            "WindClaw 强在结构化金融数据和专业投研语境，尤其适合个股、估值、配置和框架型分析。但它对实时 web 搜索依赖额外配置，新闻、公告、政策和研报获取明显受限，导致很多非结构化信息题目只能退化成数据或趋势概览。",
        },
        {
          title: "功能 / 设计逻辑",
          body:
            "它用“聊股票、找机会、做对比、谈大势、论策略”这类任务入口把复杂投研流程产品化，让用户不必先想 prompt 结构，就能进入一个熟悉的研究动作里。这是很典型的“面向任务而不是面向功能”设计。",
        },
        {
          title: "测试表现摘要",
          body:
            "WindClaw 在单标数据、多字段查询和部分框架型长文里读起来很顺，表格也漂亮。但一旦题目明确要求新闻事件、舆情进展、具体政策或研究报告，它很容易用销量、财务或泛行业背景替代真正的问题。",
        },
        {
          title: "评分表现摘要",
          body:
            "28 题重评分后，它的主要优势是信息整理能力、表格化输出和简单数据快查；失分主要来自题不对题、事实与推断混写，以及筛选口径前后不一。也就是说，它经常看起来比真实质量更完整。",
        },
      ],
      strengths: [
        "单标数据快查和字段明确的任务整体较稳。",
        "表格组织、框架铺陈和阅读体验普遍不错。",
        "任务式入口很符合真实投研工作流。",
      ],
      risks: [
        "新闻、舆情、政策和研报题容易偏题，用概览替代精确回答。",
        "已披露数据、预测值和推断常混写，边界不够清楚。",
      ],
      verdict:
        "如果用户已经知道自己想问什么、且问题更偏结构化数据，WindClaw 仍然有价值；但要直接拿来做事实要求高的研究判断，风险更大。",
    },
  ],
  evaluation: {
    summary:
      "这次案例刻意把“体验感受”拆成可以重复执行的评测流程。核心不是给两个产品打一个主观印象分，而是控制问题、时间、追问、上下文和判分口径，让结果尽量反映产品能力本身，而不是模型偶然发挥。",
    sections: [
      {
        title: "评分标准",
        body:
          "我把回答质量拆成四个维度：内容完整性与准确性、结构清晰度、格式可用性、解读质量。这个标准专门针对金融分析场景，重点看它有没有正面回答题目、事实边界是否清楚、读者能否快速定位结论与证据，以及解读有没有建立在已证实信息上。",
      },
      {
        title: "测试约束",
        body:
          "所有题目尽量保持相同 prompt、相同追问轮数限制、相近测试时间，并控制上下文窗口，避免把“调教产品”的结果误当成产品本身能力。同时我也单独区分了“拿不到数据”和“拿到数据但不会组织表达”这两类问题。",
      },
      {
        title: "问题设计",
        body:
          "题库覆盖新闻检索、公司公告、板块异动、政策研究、数据查询、多条件筛选、横向比较、宏观判断和配置建议。这样既能测简单字段能力，也能测复杂场景下的命中率、结构化表达和克制程度。",
      },
      {
        title: "重评分方式",
        body:
          "对两份原始测试报告，我又做了一轮逐题重评分和外部事实抽核，避免初始体验报告被模型表达风格误导。重评分文档因此承担“量化结果”和“失分理由”两层作用，是这次案例里最接近判断底稿的部分。",
      },
    ],
  },
  appendix: {
    intro:
      "下面保留 6 份 Markdown 文档。产品深度分析和 28 题体验评分继续保留页内阅读，但默认折叠，按需展开查看；两份原始测试实录因为篇幅过长，改为直接下载查看。",
    docs: [
      {
        title: "东方财富 Skills 产品深度分析",
        product: "东方财富 Skills",
        docType: "产品深度分析",
        label: "产品深度分析",
        group: "东方财富 Skills",
        anchorId: "appendix-eastmoney-analysis",
        downloadSlug: "eastmoney-analysis",
        renderMode: "inline",
        sourcePath: "eastmoney/deep-analysis.md",
        defaultCollapsed: true,
        priority: 1,
      },
      {
        title: "东方财富 Skills 28题体验评分",
        product: "东方财富 Skills",
        docType: "28题体验评分",
        label: "28题体验评分",
        group: "东方财富 Skills",
        anchorId: "appendix-eastmoney-score",
        downloadSlug: "eastmoney-score",
        renderMode: "inline",
        sourcePath: "eastmoney/score-report.md",
        defaultCollapsed: true,
        priority: 2,
      },
      {
        title: "东方财富 Skills 原始体验报告",
        product: "东方财富 Skills",
        docType: "原始体验实录",
        label: "原始测试下载",
        group: "东方财富 Skills",
        downloadSlug: "eastmoney-raw",
        renderMode: "download-only",
        sourcePath: "eastmoney/raw-transcript.md",
        defaultCollapsed: true,
        priority: 3,
      },
      {
        title: "WindClaw 产品深度分析",
        product: "WindClaw",
        docType: "产品深度分析",
        label: "产品深度分析",
        group: "WindClaw",
        anchorId: "appendix-windclaw-analysis",
        downloadSlug: "windclaw-analysis",
        renderMode: "inline",
        sourcePath: "windclaw/deep-analysis.md",
        defaultCollapsed: true,
        priority: 1,
      },
      {
        title: "WindClaw 28题体验评分",
        product: "WindClaw",
        docType: "28题体验评分",
        label: "28题体验评分",
        group: "WindClaw",
        anchorId: "appendix-windclaw-score",
        downloadSlug: "windclaw-score",
        renderMode: "inline",
        sourcePath: "windclaw/score-report.md",
        defaultCollapsed: true,
        priority: 2,
      },
      {
        title: "WindClaw 原始使用体验",
        product: "WindClaw",
        docType: "原始体验实录",
        label: "原始测试下载",
        group: "WindClaw",
        downloadSlug: "windclaw-raw",
        renderMode: "download-only",
        sourcePath: "windclaw/raw-transcript.md",
        defaultCollapsed: true,
        priority: 3,
      },
    ],
  },
  callout:
    "我想证明的不是“我会写一份竞品分析”，而是我能定义问题、控制变量、设计标准，并把体验判断转化成更可信的产品结论。",
};

export const selectedBuildsNavItems: SelectedBuildsNavItem[] = [
  {
    id: "comparison-overview",
    title: "对比总览",
    shortTitle: "总览",
    href: "#comparison-overview",
    kind: "anchor",
    group: "主内容",
  },
  {
    id: "product-dossiers",
    title: "单产品拆解",
    shortTitle: "拆解",
    href: "#product-dossiers",
    kind: "anchor",
    group: "主内容",
  },
  {
    id: "evaluation-method",
    title: "测试与评分方法",
    shortTitle: "方法",
    href: "#evaluation-method",
    kind: "anchor",
    group: "主内容",
  },
  {
    id: "appendix",
    title: "原文附录",
    shortTitle: "附录",
    href: "#appendix",
    kind: "anchor",
    group: "主内容",
  },
  {
    id: "appendix-eastmoney-analysis",
    title: "东方财富 Skills / 产品深度分析",
    shortTitle: "深度分析",
    href: "#appendix-eastmoney-analysis",
    kind: "anchor",
    group: "东方财富 Skills",
  },
  {
    id: "appendix-eastmoney-score",
    title: "东方财富 Skills / 28题体验评分",
    shortTitle: "28题评分",
    href: "#appendix-eastmoney-score",
    kind: "anchor",
    group: "东方财富 Skills",
  },
  {
    id: "eastmoney-raw",
    title: "东方财富 Skills / 原始测试下载",
    shortTitle: "原始下载",
    href: "/work/selected-builds/download/eastmoney-raw",
    kind: "download",
    group: "东方财富 Skills",
  },
  {
    id: "appendix-windclaw-analysis",
    title: "WindClaw / 产品深度分析",
    shortTitle: "深度分析",
    href: "#appendix-windclaw-analysis",
    kind: "anchor",
    group: "WindClaw",
  },
  {
    id: "appendix-windclaw-score",
    title: "WindClaw / 28题体验评分",
    shortTitle: "28题评分",
    href: "#appendix-windclaw-score",
    kind: "anchor",
    group: "WindClaw",
  },
  {
    id: "windclaw-raw",
    title: "WindClaw / 原始测试下载",
    shortTitle: "原始下载",
    href: "/work/selected-builds/download/windclaw-raw",
    kind: "download",
    group: "WindClaw",
  },
];
