import type { FinanceSkillsWorkCase } from "@/content/finance-skills";
import FinanceSkillsAtlas from "@/components/home/FinanceSkillsAtlas";
import FinanceLivingLedger from "@/components/home/FinanceLivingLedger";

/**
 * PW-02 + PW-03 Finance Skills page body (design-spec section 7, Living
 * Ledger).
 *
 * Static first layer: the 30-Skill / seven-stage relationship and all seven
 * stage names are readable before any interaction. The atlas is followed by
 * the explicit "案例拆解" section that runs the frozen "月末财务包" case through
 * all eight stages: ordered stage rail, synchronized workbook Sheet tabs,
 * persistent needs_review semantics and the three-Skill analysis chain.
 */
export default function FinanceSkillsCaseContent({
  caseData,
}: {
  caseData: FinanceSkillsWorkCase;
}) {
  return (
    <div className="detail-stack finance-page">
      <section className="finance-section" aria-labelledby="finance-atlas-heading">
        <div className="finance-section-head">
          <p className="section-kicker">Capability atlas</p>
          <h2 id="finance-atlas-heading" className="finance-section-title">
            能力全景
          </h2>
          <p className="finance-section-intro">
            <strong>30 个 Skills 不是固定的 30 步。</strong>
            七个环节组成主链，估值、投研、税务和交易能力按任务接入。选择任一环节，
            可查看准确名称、职责、输入、输出、下一步条件与协同关系。
          </p>
        </div>

        <div className="finance-metrics">
          {caseData.metrics.map((metric) => (
            <div key={metric.label} className="finance-metric">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>

        <FinanceSkillsAtlas stages={caseData.stages} />

        <div className="finance-inventory" aria-labelledby="finance-inventory-heading">
          <div className="finance-section-head">
            <p className="section-kicker">Skill inventory</p>
            <h3 id="finance-inventory-heading" className="finance-section-title">
              30 个 Skill 清单
            </h3>
            <p className="finance-section-intro">
              同一 Skill 可能出现在多个环节，清单按能力域分组去重，共{" "}
              <strong>30 个</strong>，无需悬停即可完整阅读。
            </p>
          </div>

          <div className="finance-groups">
            {caseData.groups.map((group) => (
              <section key={group.title} className="finance-group">
                <div className="finance-group-head">
                  <h3>{group.title}</h3>
                  <span>{group.meta}</span>
                </div>
                <div className="finance-group-list">
                  {group.skills.map((skill) => (
                    <article key={skill.id} className="finance-group-item">
                      <b>{skill.id}</b>
                      <p>{skill.duty}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="finance-section" aria-labelledby="finance-case-heading">
        <div className="finance-section-head">
          <p className="section-kicker">Case breakdown</p>
          <h2 id="finance-case-heading" className="finance-section-title">
            案例拆解
          </h2>
          <p className="finance-section-intro">
            同一份示例数据沿脏数据、清洗、统一字段、工作簿、审计、三表、对账、
            分析与报告的顺序走完整个处理链；不确定值在每一步都保持待复核。
          </p>
        </div>

        <div className="finance-case">
          <h3 className="finance-case-name">{caseData.caseName}</h3>
          <p className="finance-case-copy">{caseData.caseSummary}</p>
        </div>

        <FinanceLivingLedger
          stages={caseData.caseStages}
          sheets={caseData.workbookSheets}
          footnote={caseData.workbookFootnote}
          analysis={caseData.analysisChain}
        />

        <p className="finance-case-boundary">{caseData.caseBoundary}</p>
      </section>
    </div>
  );
}
