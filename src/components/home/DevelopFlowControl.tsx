import type {
  DevelopFlowGroup,
  DevelopReturnPath,
} from "@/content/develop-harness";

/**
 * PW-04 Develop flow panorama (design-spec section 8, AC-D02, AC-D06).
 *
 * The full flow is rendered as an inline, network-independent schematic: a
 * five-group track (准备 / 定义 / 实现 / 检查 / 交付) whose phases carry the
 * eight approved stage names and their responsible roles, an explicit return
 * path row, and a plain-language reading guide. No external Mermaid CDN is
 * involved, so the flow stays readable offline; on mobile the same track
 * becomes a vertical sequence without zoom or page-level overflow.
 */
export default function DevelopFlowControl({
  groups,
  returns,
  readingGuide,
}: {
  groups: DevelopFlowGroup[];
  returns: DevelopReturnPath[];
  readingGuide: string;
}) {
  return (
    <div className="develop-flow" data-develop-flow>
      <ol className="develop-flow-groups" aria-label="Develop 流程五阶段">
        {groups.map((group, index) => (
          <li key={group.label} className="develop-flow-group">
            <span className="develop-flow-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{group.label}</h3>
            <p>{group.phases}</p>
            <span className="develop-flow-roles">{group.roles}</span>
          </li>
        ))}
      </ol>

      <div className="develop-flow-returns" aria-label="失败时返回路径">
        <span className="develop-returns-label">返回路径</span>
        <ul>
          {returns.map((path) => (
            <li key={path.label}>
              <b>{path.label}</b>
              <span>{path.target}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="develop-flow-read">
        <b>怎样阅读</b>
        <p>{readingGuide}</p>
      </div>
    </div>
  );
}
