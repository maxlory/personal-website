# 首页 Tokscale Usage / Models 模块设计

## 目标

在个人网站首页的作品列表之后、Connect 之前，展示 `maxlory` 的公开 AI token 使用情况。访客应能在不离开首页的情况下查看累计摘要、使用活动、单日明细、client/model 明细以及按模型汇总的数据。

模块以 Tokscale 原版 profile 页为视觉与交互基准：保留组件结构、尺寸关系、圆角、边框、间距、tabs、筛选器、热力图、明细卡片和表格，只将颜色替换为本站 Editorial Instruments 纸张配色。不得重新设计成另一套 dashboard。

## 已批准的页面位置和披露方式

- 位置：`ProjectIndex` 之后、`Connect` 之前。
- 默认状态：显示四项摘要，并提供明确的详情展开控件，避免完整 dashboard 默认占据过长首页。
- 展开状态：显示 Tokscale 原版的 Usage / Models tabs 和对应全部内容。
- 折叠与 tab 控件必须支持键盘操作、可见焦点和正确的 ARIA 状态。
- 移动端按 Tokscale 原版响应式语义单列展示，不允许横向裁掉核心信息；模型表格可在自身容器内横向滚动。

## 展示内容

### Summary

保持 Tokscale 原版 2 × 2 metrics grid：

- All-time tokens
- All-time cost
- Active days (1y)
- All submissions

不移植 Tokscale 用户头像、用户名、rank、joined、Embed、Share、GitHub actions、站点导航、登录和设备管理。

### Usage tab

保留：

- `Lifetime / 30d / 7d` 范围切换。
- Contributions 卡片，包括 recent year 选择、2D / 3D 切换、active days、日期范围、热力图、配色图例和颜色选择。
- Day Breakdown，包括选中日期、total tokens、cost、messages、token categories，以及 clients and models 分组明细。
- Tokscale Usage tab 中 Contributions column 的完整纵向内容；不得用另行设计的趋势卡片替代用户已标注的原版结构。

热力图与日期选择保留 Tokscale 原版可观察行为：鼠标或键盘移动日期、选中日期后更新 Day Breakdown、Escape 关闭临时 inspection 状态。2D 与 3D 视图均为必需交互，2D 为默认；3D 运行时加载失败时自动回退 2D，且不得阻断明细内容。

### Models tab

保留完整模型表格：

- Model
- Tokens
- Cost
- Share

过滤 `<synthetic>`，按 Tokscale 原版逻辑以 cost 降序排列，并保留模型/provider 色点。必须展示 API 返回的全部模型，而不是只显示前几项。

## 视觉映射

组件结构和布局以 Tokscale 原版为准，只映射颜色：

| Tokscale 语义 | 本站 token |
| --- | --- |
| 页面 / panel 背景 | `--ei-paper: #f3f1ea` |
| 次级 panel / control 背景 | `--ei-paper-strong: #e5e8e1` |
| 主文字 | `--ei-ink: #111512` |
| 次级文字 | `--ei-ink-soft: #626a64` |
| 边框 / 分隔线 | `--ei-line: #c7cdc6` |
| 选中态、主按钮、focus 与热力图强调 | `--ei-signal: #d9ff4a` |
| 选中态文字 | `--ei-signal-ink: #111512` |

模型和 provider 的分类颜色继续保留，以保证图表及表格可辨识；这些颜色需在纸张底色上满足可读性。组件不引入 Tokscale 全站导航、背景或品牌图形。

## 数据架构

### 来源

- 公共 profile：`https://tokscale.ai/u/maxlory`
- 公共 JSON：`https://tokscale.ai/api/users/maxlory`
- 无需用户凭据，不读取私人 Tokscale 状态。

由于本站使用 Next.js static export，生产页面读取仓库内经过验证的版本化快照。React client component 只接收已验证的数据，不直接在浏览器请求 Tokscale。

### 每周同步

- GitHub Actions 每周一刷新一次快照，并支持手动触发。
- 更新脚本使用有限超时；候选响应完整校验后，通过同目录临时文件和原子 rename 替换快照。
- 页面展示 Tokscale 的 `updatedAt` 作为数据更新时间，并在说明中标注数据来自 Tokscale。

### 失败回退

- 刷新失败时工作流退出且不改动仓库中的最近成功快照。
- 若构建时没有有效快照，模块显示紧凑 unavailable 状态和指向 Tokscale 原页的链接；首页其他作品与 Connect 正常渲染。
- 不把失败响应、HTML 错误页或不完整 JSON 写成成功数据。
- 已部署页面不访问 Tokscale，因此上游延迟不会阻塞首页响应。

## 组件边界

- `TokscaleUsageSection`：首页区块、摘要、折叠状态、tabs 和 period state。
- `TokscaleContributionGraph`：热力图、日期检查、2D / 3D 视图与 range controls。
- `TokscaleDayBreakdown`：选中日期的 totals、token categories、clients and models。
- `TokscaleModelsTable`：完整模型表格和移动端滚动边界。
- `tokscale-data`：本地快照读取、校验、格式转换和 fallback 类型；独立脚本负责每周更新。
- 独立的格式化与纯计算模块承载模型排序、token/cost 缩写、range 过滤和日期选择，便于单元测试。

首页只负责组合模块；第三方字段解析、图表计算和模型排序不得堆入 `HomepageClient.tsx`。

## 来源和许可证

行为级 copy-adapt 固定到 Tokscale commit：

- Repository: `https://github.com/junhoyeo/tokscale`
- Commit: `246765b1f32c384c375601c4307477847355fbbf`
- Original License: MIT
- Copyright: 2025 Junho Yeo

主要参考文件：

- `packages/frontend/src/components/profile/ProfileContributionGraph.tsx`
- `packages/frontend/src/components/profile/ProfileModels.tsx`
- `packages/frontend/src/components/profile/ProfileTabBar.tsx`
- `packages/frontend/src/components/profile/types.ts`
- `packages/frontend/src/app/u/[username]/ProfilePageClient.tsx`
- 对应 `profileContributionGraphData`、`profileUsageChart*` 测试

copy-adapt 文件需写明固定 commit、MIT license 和本站修改内容；仓库保留适用的版权与许可证文本。本站不引入 Tokscale 的数据库、认证、设备管理、styled-components 主题系统或无关 profile 组件。

## 验收标准

- 模块位于作品列表之后、Connect 之前。
- 页面初始可见四项 Summary，数值来自 Tokscale 公共 API。
- 展开后可在 Usage / Models 间切换，并可选择 Lifetime / 30d / 7d。
- Usage 的 Contributions、Day Breakdown、Token categories、Clients and models 与用户标注的 Tokscale 原版结构一致。
- Contributions 的 2D / 3D 切换均可用；3D 异常时安全回退 2D。
- 选择一个有数据的日期会更新 Day Breakdown；键盘交互可用。
- Models 显示全部非 synthetic 模型，包含 Tokens、Cost、Share，排序正确。
- 颜色使用本站纸张 tokens；除颜色和首页必要的外层折叠外，不擅自更改 Tokscale 原版视觉结构。
- 桌面与移动端无页面级横向溢出，核心内容无遮挡。
- Tokscale 超时或返回无效响应时，首页主体仍正常显示，并使用最近成功缓存或 unavailable fallback。
- 新增测试覆盖数据适配、缓存失败边界、tab / period 切换、日期明细、模型排序、键盘访问和移动端布局。
- 当前仓库配置的 lint、typecheck、build 与适用 Playwright 测试全部通过。

## 非目标

- 不复制 Tokscale 导航、登录、头像、profile identity、rank、share/embed actions 或 devices。
- 不修改 Tokscale 账号数据或提交新的 usage。
- 不在本任务中发布、Push、创建 PR 或改生产域名。
- 不重新设计用户已经批准的 Tokscale 原版结构。
