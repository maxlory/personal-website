"use client";

import { getModelColor } from "@/lib/tokscale/modelColors";
import {
  formatModelCost,
  formatModelShare,
  formatModelTokens,
  type TokscaleModelUsage,
} from "@/lib/tokscale/models";

export function TokscaleModelsTable({
  usage,
}: {
  usage: readonly TokscaleModelUsage[];
}) {
  if (usage.length === 0) {
    return <p className="ei-tokscale-empty">No model usage is available.</p>;
  }

  return (
    <div className="ei-tokscale-models-scroll">
      <table className="ei-tokscale-models-table">
        <caption className="ei-visually-hidden">Model usage</caption>
        <thead>
          <tr>
            <th scope="col">Model</th>
            <th scope="col" className="ei-tokscale-numeric">
              Tokens
            </th>
            <th scope="col" className="ei-tokscale-numeric">
              Cost
            </th>
            <th scope="col" className="ei-tokscale-numeric">
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {usage.map((item) => (
            <tr key={item.model} data-model={item.model}>
              <th scope="row" className="ei-tokscale-model-cell">
                <span className="ei-tokscale-model-identity">
                  <span
                    className="ei-tokscale-model-marker"
                    aria-hidden="true"
                    style={{ backgroundColor: getModelColor(item.model) }}
                  />
                  <span className="ei-tokscale-model-name">{item.model}</span>
                </span>
              </th>
              <td className="ei-tokscale-numeric" data-label="Tokens">
                <span title={item.tokens.toLocaleString("en-US")}>
                  {formatModelTokens(item.tokens)}
                </span>
              </td>
              <td className="ei-tokscale-numeric ei-tokscale-accent" data-label="Cost">
                {formatModelCost(item.cost)}
              </td>
              <td className="ei-tokscale-numeric" data-label="Share">
                {formatModelShare(item.percentage)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
