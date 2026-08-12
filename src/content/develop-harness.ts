/**
 * PW-04 Develop Harness flow and role control plane.
 *
 * Frozen source: .superpowers/brainstorm/48655-1786445733/content/
 * skills-process-atlas-v4.html (develop page: project background, the
 * mermaid flow and fallback track, roleRouting). Background copy, the four
 * synchronous problems, ticket ids, the eight phase names, return paths,
 * reading guide, role contracts and evidence states are copied verbatim;
 * nothing is renamed.
 *
 * PW-05 owns the detailed "任务恢复" evidence chain (developCase and
 * 验收边界 in the same frozen V4 source); the case data below is copied
 * verbatim from that source, stage order included.
 */

export type DevelopProblem = {
  index: string;
  text: string;
};

export type DevelopTicket = {
  id: string;
  text: string;
};

export type DevelopFlowGroup = {
  label: string;
  phases: string;
  roles: string;
};

export type DevelopReturnPath = {
  label: string;
  target: string;
};

export type DevelopRoleEvidence = "proven" | "contract";

export type DevelopArtifactTable = {
  headers: string[];
  rows: string[][];
  /** Exact technical tokens inside cells that render as inline code. */
  codeTokens?: string[];
};

export type DevelopCaseStage = {
  id: string;
  title: string;
  skills: string;
  tag: string;
  copy: string;
  artifact: DevelopArtifactTable | null;
  callout?: string;
};

export type DevelopRecoveryCaseData = {
  sectionTitle: string;
  sectionIntro: string;
  caseName: string;
  caseNote: string;
  railLabel: string;
  stages: DevelopCaseStage[];
  boundaryTitle: string;
  boundaryIntro: string;
  provenTitle: string;
  provenItems: string[];
  limitedTitle: string;
  limitedItems: string[];
};

export type DevelopRole = {
  id: string;
  name: string;
  kicker: string;
  buttonSummary: string;
  summary: string;
  phases: string;
  receives: string;
  returns: string;
  writing: string;
  status: string;
  buttonStatus: string | null;
  evidence: DevelopRoleEvidence;
};

export type DevelopHarnessWorkCase = {
  kind: "develop-harness";
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heroNote: string;
  backgroundTitle: string;
  backgroundIntro: string;
  problemTitle: string;
  problems: DevelopProblem[];
  tickets: DevelopTicket[];
  ticketNote: string;
  flowTitle: string;
  flowIntro: string;
  groups: DevelopFlowGroup[];
  returns: DevelopReturnPath[];
  readingGuide: string;
  rolesTitle: string;
  rolesIntro: string;
  roles: DevelopRole[];
  recovery: DevelopRecoveryCaseData;
};

export const developHarnessCase: DevelopHarnessWorkCase = {
  kind: "develop-harness",
  slug: "develop-harness",
  title: "Develop流程\n—人机协同工作",
  subtitle:
    "主会话负责决策与任务分派，低模型子会话和 Subagent 负责实现，再用验证证据决定继续、退回或完成。",
  eyebrow: "Work · Develop Harness",
  heroNote: "Evidence Control Room",
  backgroundTitle: "项目背景",
  backgroundIntro:
    "这是一个面向 A 股业绩点评的投研程序。用户输入股票代码和报告日期，程序从多个数据源收集事实，再由受控 Writer 生成多组件 Markdown 研报。",
  problemTitle: "同步流程的问题",
  problems: [
    {
      index: "01",
      text: "用户点击生成后，只能等待整份报告一次成功或失败。",
    },
    {
      index: "02",
      text: "一个组件证据不足，会让已经完成的内容一起无法交付。",
    },
    {
      index: "03",
      text: "页面刷新或服务重启后，用户无法继续观察原任务。",
    },
    {
      index: "04",
      text: "失败后只能重跑整份报告，不能只重试失败组件。",
    },
  ],
  tickets: [
    {
      id: "A",
      text: "拆分研报组件，允许部分完成，并明确每个组件的状态。",
    },
    {
      id: "B",
      text: "增加任务编号、进度事件、刷新恢复、失败重试和下载。",
    },
    {
      id: "C",
      text: "把后端状态做成用户能够看见和操作的组件看板。",
    },
    {
      id: "D",
      text: "使用真实数据、模型、浏览器和冻结样本做最终验收。",
    },
  ],
  ticketNote:
    "B 只是内部任务单编号，不是产品名。本案例选择 B，是因为它完整经历了目标、规格、失败测试、实现、两轮独立检查和重新验证。",
  flowTitle: "流程全景",
  flowIntro:
    "这张图回答事情按什么顺序发生。模型不是额外步骤，框内标出谁负责；问题出现时，工作会带着证据回到对应环节。",
  groups: [
    { label: "准备", phases: "Resume 与代码审计", roles: "主会话和 Luna" },
    {
      label: "定义",
      phases: "Intent、Spec、Ticket",
      roles: "用户、主会话和 Sol",
    },
    { label: "实现", phases: "Red 与 Green", roles: "DeepSeek" },
    { label: "检查", phases: "Review 与 Verification", roles: "Terra 和 Luna" },
    {
      label: "交付",
      phases: "UAT、范围审计、提交",
      roles: "用户和主会话",
    },
  ],
  returns: [
    { label: "审查发现问题", target: "回到实现环节，先补失败测试再修复。" },
    { label: "验证失败", target: "进入诊断，复现并确认根因。" },
    { label: "需求变化", target: "回到定义环节，重写行为说明。" },
    { label: "发现故障", target: "进入诊断，先复现再定位。" },
  ],
  readingGuide:
    "流程阶段像生产线上的工序，角色则是完成工序的人。主会话负责方向和完成权，DeepSeek 负责写代码，Terra 负责独立检查，Luna 负责协调和整理验证证据。发现问题就回到最早需要补证据的环节，不必从头重做。",
  rolesTitle: "谁来执行",
  rolesIntro:
    "Develop 先判断这一步需要做决定、写代码、独立检查，还是整理大量证据，再选择对应角色。点击角色查看它收到什么、交回什么，以及真实证据是否已经确认。",
  roles: [
    {
      id: "main",
      name: "主会话 / Sol",
      kicker: "方向、边界与完成权",
      buttonSummary: "把用户目标冻结成可执行任务，并判断证据是否足够。",
      summary:
        "主会话保留产品方向、任务边界和完成权。它把用户目标变成冻结的任务说明，分派工作，并根据返回证据决定继续、退回还是结束。",
      phases: "Intent、Spec、Ticket、Gate、范围审计",
      receives: "用户目标、当前代码、各角色的结构化报告",
      returns: "任务说明、通过或退回决定、本地提交",
      writing: "默认不与 DeepSeek 同时写代码",
      status: "流程契约",
      buttonStatus: null,
      evidence: "contract",
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      kicker: "唯一默认写入者",
      buttonSummary: "编写失败测试、产品代码与修复。",
      summary:
        "DeepSeek 在独立任务中先写能暴露缺口的测试，再补最小实现；审查发现问题时，也由它完成针对性修复并返回命令和结果。",
      phases: "Red、Green、review finding fix",
      receives: "冻结的 Task Brief、允许路径、验证命令",
      returns: "改动文件、执行命令、测试证据、未解决项",
      writing: "可以，单一写者",
      status: "已实跑",
      buttonStatus: "已实跑",
      evidence: "proven",
    },
    {
      id: "terra",
      name: "Terra",
      kicker: "独立检查者",
      buttonSummary: "定位根因，检查正确性与测试充分性。",
      summary:
        "Terra 不沿用实现者的判断。它负责故障根因、代码正确性、测试是否充分和改动质量，并把阻塞问题交回实现环节。",
      phases: "Diagnose、Review",
      receives: "冻结规格、代码差异、测试与证据包",
      returns: "按严重程度排列的 findings 或通过结论",
      writing: "不写产品代码",
      status: "仅有契约",
      buttonStatus: "契约",
      evidence: "contract",
    },
    {
      id: "luna",
      name: "Luna",
      kicker: "协调与验证者",
      buttonSummary: "扫描高上下文，协调子任务并整理新鲜证据。",
      summary:
        "Luna 适合处理高上下文扫描、协调 DeepSeek 子任务和压缩长日志。实现与审查结束后，它重新运行当前版本的验证，并只把结构化证据交回主会话。",
      phases: "上下文扫描、DeepSeek 协调、Verification",
      receives: "任务说明、当前代码指纹、验证清单",
      returns: "子任务报告、验证结果、证据摘要",
      writing: "不接管产品代码",
      status: "已实跑",
      buttonStatus: "已实跑",
      evidence: "proven",
    },
  ],
  recovery: {
    sectionTitle: "案例拆解",
    sectionIntro:
      "业务问题很直接：研报任务刷新后不能丢失，已经完成的组件要保留，失败组件可以单独重试。",
    caseName: "任务恢复",
    caseNote:
      "B 是这次后端改造的内部任务单编号。主叙事使用普通中文，内部标识只放在证据索引中。",
    railLabel: "任务恢复案例步骤",
    stages: [
      {
        id: "confirm-goal",
        title: "确认目标",
        skills: "Intent",
        tag: "业务问题",
        copy: "用户发起研报后可以离开页面再回来；已完成组件不能丢失；失败组件可以单独重试。",
        artifact: {
          headers: ["原来", "目标"],
          rows: [
            ["同步等待整份报告", "创建后立即获得任务编号"],
            ["刷新后无法继续观察", "断开不影响任务继续"],
            ["一个失败阻断全部", "成功内容保留，失败组件单独重试"],
          ],
        },
      },
      {
        id: "write-behavior",
        title: "写清行为",
        skills: "Spec",
        tag: "可观察行为",
        copy: "“可以恢复”被进一步限定为 API 返回、事件顺序、断线续传、重启状态和安全错误语义。",
        artifact: {
          headers: ["行为", "可检查结果"],
          rows: [
            ["创建任务", "立即返回 202 与稳定 Job ID"],
            ["断线重连", "通过 Last-Event-ID 继续接收"],
            ["服务重启", "未结束组件进入 interrupted，成功产物保留"],
            ["旧同步接口", "稳定返回 410"],
          ],
          codeTokens: ["202", "Last-Event-ID", "410"],
        },
      },
      {
        id: "freeze-ticket",
        title: "冻结任务单",
        skills: "Ticket",
        tag: "内部任务单",
        copy: "B 只负责后端 Job、SSE、恢复、Retry、CLI 和错误协议，不负责前端与数据源。",
        artifact: {
          headers: ["允许修改", "明确排除"],
          rows: [
            ["Job Store、API、schemas、编排、CLI、测试", "前端、数据源、Writer 方法"],
            ["本地 SQLite 持久化", "Redis、外部队列、云服务"],
          ],
        },
      },
      {
        id: "expose-gap",
        title: "暴露缺口",
        skills: "Red",
        tag: "真实测试报告 · E-06",
        copy: "实现前的 21 个失败集中在目标功能，原有 37 项基线仍然通过。",
        artifact: {
          headers: ["测试范围", "结果", "说明"],
          rows: [
            ["异步任务目标测试", "21 failed", "目标功能尚未实现"],
            ["原有 API 与组件", "37 passed", "既有基线未被破坏"],
          ],
        },
      },
      {
        id: "first-green",
        title: "首轮实现",
        skills: "Green",
        tag: "真实 Green 报告 · E-07",
        copy: "加入持久化 Job、异步创建、状态查询、SSE、重启恢复、Retry、Markdown、410 和 CLI 新协议。",
        artifact: {
          headers: ["范围", "结果"],
          rows: [
            ["目标测试", "21 passed"],
            ["迁移、组件和 CLI", "39 passed"],
            ["完整回归", "737 passed"],
          ],
        },
      },
      {
        id: "first-review",
        title: "第一轮检查",
        skills: "Review → Red → Green",
        tag: "真实检查报告 · E-08",
        copy: "独立检查新增 5 个失败测试，覆盖重复终态、错误重试范围、状态与响应描述问题。",
        artifact: {
          headers: ["新增发现", "修复后"],
          rows: [
            ["stale runner 重复写终态", "focused 26 passed"],
            ["Retry 包含锁定组件", "baseline 39 passed"],
            ["缺少 writing、URL 与 artifact 描述", "full 742 passed"],
          ],
        },
      },
      {
        id: "second-review",
        title: "第二轮检查",
        skills: "Review → Red → Green",
        tag: "真实检查报告 · E-09",
        copy: "第二轮从浏览器消费 SSE 的方式继续检查，又发现标准 id、连接生命周期和事务原子性问题。",
        artifact: {
          headers: ["新增发现", "修复后"],
          rows: [
            ["SSE 缺少标准 id", "重连只接收更大序号"],
            ["连接在完成前结束", "持续收到运行中与最终事件"],
            ["状态与事件不在同一事务", "full 745 passed"],
          ],
        },
      },
      {
        id: "reverify",
        title: "重新验证",
        skills: "Verification",
        tag: "本地完成证据 · E-10",
        copy: "当前版本最终得到 29 项目标测试、39 项迁移与基线、745 项完整回归通过，未解决 finding 为空。",
        artifact: {
          headers: ["证据", "结果"],
          rows: [
            ["Focused", "29 passed"],
            ["Migration / baseline / CLI", "39 passed"],
            ["Full research-report", "745 passed"],
            ["Unresolved findings", "[]"],
          ],
        },
        callout:
          "这证明 B 的本地后端任务单完成。前端看板属于 C，真实数据、模型与浏览器最终验收属于 D。",
      },
    ],
    boundaryTitle: "验收边界",
    boundaryIntro: "B 完成的是本地后端任务单，不代表整个投研产品已经通过最终验收。",
    provenTitle: "已经证明",
    provenItems: [
      "同步流程的真实问题与任务单边界",
      "持久化 Job、SSE、恢复、Retry 和 410 协议",
      "两轮独立检查与最终测试数字",
      "B 结构化状态为 complete",
    ],
    limitedTitle: "尚未证明",
    limitedItems: [
      "前端组件看板通过最终验收",
      "整个投研产品已经完成",
      "真实生产环境的高并发与长期稳定性",
      "745 项测试等同于真实研报内容质量",
    ],
  },
};
