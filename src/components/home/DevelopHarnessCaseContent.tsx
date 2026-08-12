import type { DevelopHarnessWorkCase } from "@/content/develop-harness";
import DevelopFlowControl from "@/components/home/DevelopFlowControl";
import DevelopRoles from "@/components/home/DevelopRoles";
import DevelopRecoveryCase from "@/components/home/DevelopRecoveryCase";

/**
 * PW-R1 Develop Harness page body (PW-04 + PW-05 revision).
 *
 * First layer: the A-share earnings-commentary program and its four
 * synchronous-flow problems in plain language, with the project background
 * tickets shown as A/B/C/D, beside an accessible collaboration flywheel
 * (用户目标 → 主会话决策与分派 → 低模型子会话 / Subagent 实现 →
 * 证据验证 → 回到主会话). Then a network-independent flow panorama and the
 * four-role control plane with generic evidence labels. The page closes with
 * the "任务恢复" evidence chain: the approved eight-stage case under 案例拆解
 * plus the 验收边界 split, so the B local backend completion stays separated
 * from C dashboard and D product work. No RA- task id is user-visible.
 */

const FLYWHEEL_NODES = [
  {
    index: "01",
    name: "用户目标",
    note: "启动一次工作",
  },
  {
    index: "02",
    name: "主会话决策与分派",
    note: "冻结任务，选择执行者",
  },
  {
    index: "03",
    name: "低模型子会话 / Subagent 实现",
    note: "写失败测试与产品代码",
  },
  {
    index: "04",
    name: "证据验证",
    note: "运行测试与独立检查",
  },
] as const;

function DevelopCollaborationFlywheel() {
  return (
    <aside
      className="develop-flywheel"
      aria-label="协作飞轮：从用户目标回到主会话"
    >
      <div className="develop-flywheel-head">
        <p className="section-kicker">Collaboration flywheel</p>
        <h3>协作飞轮</h3>
      </div>
      <div className="develop-flywheel-orbit">
        <span className="develop-flywheel-ring" aria-hidden="true" />
        <span className="develop-flywheel-spin" aria-hidden="true" />
        <ol className="develop-flywheel-nodes" aria-label="协作飞轮节点">
          {FLYWHEEL_NODES.map((node) => (
            <li key={node.name} className="develop-flywheel-node">
              <span className="develop-flywheel-node-index" aria-hidden="true">
                {node.index}
              </span>
              <b>{node.name}</b>
              <small>{node.note}</small>
            </li>
          ))}
        </ol>
      </div>
      <p className="develop-flywheel-return">
        验证结果与证据回到主会话，由主会话决定继续、退回或完成。
      </p>
    </aside>
  );
}

export default function DevelopHarnessCaseContent({
  caseData,
}: {
  caseData: DevelopHarnessWorkCase;
}) {
  return (
    <div className="detail-stack develop-page">
      <section
        className="develop-section develop-context"
        aria-labelledby="develop-context-heading"
      >
        <div className="develop-context-grid">
          <div className="develop-context-copy">
            <div className="develop-section-head">
              <p className="section-kicker">Project context</p>
              <h2 id="develop-context-heading" className="develop-section-title">
                {caseData.backgroundTitle}
              </h2>
              <p className="develop-section-intro">
                {caseData.backgroundIntro}
              </p>
            </div>

            <div
              className="develop-problems"
              aria-label={caseData.problemTitle}
            >
              <h3>{caseData.problemTitle}</h3>
              <ol>
                {caseData.problems.map((problem) => (
                  <li key={problem.index} className="develop-problem">
                    <span aria-hidden="true">{problem.index}</span>
                    <p>{problem.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="develop-tickets" aria-label="内部任务单">
              {caseData.tickets.map((ticket) => (
                <div key={ticket.id} className="develop-ticket">
                  <b>{ticket.id}</b>
                  <span>{ticket.text}</span>
                </div>
              ))}
            </div>

            <p className="develop-callout">{caseData.ticketNote}</p>
          </div>
          <DevelopCollaborationFlywheel />
        </div>
      </section>

      <section className="develop-section" aria-labelledby="develop-flow-heading">
        <div className="develop-section-head">
          <p className="section-kicker">Flow panorama</p>
          <h2 id="develop-flow-heading" className="develop-section-title">
            {caseData.flowTitle}
          </h2>
          <p className="develop-section-intro">{caseData.flowIntro}</p>
        </div>

        <DevelopFlowControl
          groups={caseData.groups}
          returns={caseData.returns}
          readingGuide={caseData.readingGuide}
        />
      </section>

      <section className="develop-section" aria-labelledby="develop-roles-heading">
        <div className="develop-section-head">
          <p className="section-kicker">Role console</p>
          <h2 id="develop-roles-heading" className="develop-section-title">
            {caseData.rolesTitle}
          </h2>
          <p className="develop-section-intro">{caseData.rolesIntro}</p>
        </div>

        <DevelopRoles roles={caseData.roles} />
      </section>

      <DevelopRecoveryCase caseData={caseData.recovery} />
    </div>
  );
}
