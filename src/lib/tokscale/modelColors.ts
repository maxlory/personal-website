/**
 * Categorical provider/model marker colors, copy-adapted from Tokscale commit
 * 246765b1f32c384c375601c4307477847355fbbf (packages/frontend/src/components/
 * profile/modelColors.ts). Keys match as delimited tokens optionally followed
 * by a version digit, so family keys precede generic fallbacks.
 */
const MODEL_COLORS: Record<string, string> = {
  fable: "#DA7756",
  opus: "#DF886B",
  sonnet: "#E39980",
  haiku: "#E8AA95",
  claude: "#ECB8A6",
  gpt: "#10B981",
  chatgpt: "#10B981",
  o1: "#6366F1",
  o3: "#8B5CF6",
  gemini: "#3B82F6",
  deepseek: "#06B6D4",
  codex: "#F59E0B",
  kimi: "#A855F7",
  qwen: "#1A73E8",
};

export function getModelColor(modelName: string): string {
  const tokens = modelName.toLowerCase().split(/[^a-z0-9]+/);
  for (const [key, color] of Object.entries(MODEL_COLORS)) {
    for (const token of tokens) {
      if (
        token === key ||
        (token.startsWith(key) && /^\d/.test(token.slice(key.length)))
      ) {
        return color;
      }
    }
  }
  return "#6B7280";
}
