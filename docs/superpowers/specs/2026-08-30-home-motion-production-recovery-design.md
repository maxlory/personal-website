# 首页动态设计生产恢复

**日期：** 2026-08-30  
**状态：** 待用户书面确认  
**范围：** 恢复 2026-08-21 09:17 生产部署中已出现的首页动态设计，并使 GitHub `main` 成为生产环境的唯一真实来源。

## 背景与根因

2026-08-21 09:17 的 Vercel 生产部署从本地工作区上传，包含首页视频层、标题文字拉起、首屏 stagger reveal 和项目卡片滚动 reveal。09:21，Vercel 又从 GitHub `main@5ee7f18` 自动构建；该提交只更新 Tokscale 快照，且远端分支从未包含动态首页代码，因此新部署覆盖了前一个生产版本。

动态代码仍保存在本地未提交工作区。恢复工作必须从当前 `origin/main` 开始，只迁移已确认的首页动态改动，不能直接提交原工作区中的全部修改。

## 方案比较

1. **精确恢复并提交源码（采用）**：从 `origin/main` 建立干净分支，迁移此前生产版本的动态首页代码，验证后快进更新远端 `main`。优点是恢复用户见过的效果，同时消除“本地部署与 GitHub 不一致”的根因。
2. **直接把生产别名回滚到旧部署**：恢复最快，但 GitHub 仍缺少源码，下次远端构建还会再次覆盖，因此不采用。
3. **按早期 spec 重做无视频版本**：可移除远程媒体依赖，但不再是对已上线版本的恢复，需要重新进行视觉选择，因此不纳入本次修复。

## 恢复内容

- 首页 hero 恢复 muted、autoplay、loop、playsInline 的背景视频，并保留本地 poster、noise 和 gradient 覆盖层。
- Hero eyebrow、标题、身份文案、CTA 和右侧 work rail 使用短时 stagger fade-up。
- `WordsPullUp` 将标题按词裁切并在进入视口时向上揭示。
- 项目卡片在首次进入视口时使用 `opacity`、`translateY`、`scale` reveal，并按阅读顺序 stagger。
- 保留现有 hover、focus、键盘导航、Tokscale 区块、项目内容和所有路由。
- `prefers-reduced-motion: reduce` 下不播放 hero 视频，不执行位移、缩放或 stagger；内容立即可见。

## 代码边界

仅迁移恢复首页所需的文件与对应样式：

- `src/components/home/HomepageClient.tsx`
- `src/components/home/ProjectIndex.tsx`
- `src/components/home/ProjectIndexCard.tsx`
- `src/components/home/WordsPullUp.tsx`
- `src/components/home/useHydrated.ts`
- `src/app/globals.css` 中与本次首页 motion pass 直接相关的 scoped 规则

不迁移原工作区中的字体实验、Process/Develop 页面改动、内容扩展、测试草稿或其他未提交文件。

## 运行时与失败降级

- 视频继续使用此前生产版本的 HTTPS CloudFront 地址；加载失败时由本地 poster 和渐变层保持 hero 可读，不阻塞正文或导航。
- 首次 SSR 与 hydration 阶段保持内容可见，避免 JavaScript 未执行时首页空白。
- `useReducedMotion` 与 hydration guard 共同决定是否启用动态内容；无动画时 DOM 语义与链接保持不变。
- 不增加新的依赖；使用远端 `main` 已有的 Framer Motion 12。

## 验证

1. `npm run lint`、`npx tsc --noEmit`、`npm run build` 全部通过。
2. Playwright 在桌面和 390px 移动视口检查首页无横向溢出，hero、work rail、项目卡和 Tokscale 可见。
3. 正常 motion 环境确认视频层、`View the work`、文字拉起和卡片 reveal 存在。
4. reduced-motion 环境确认视频不渲染、内容立即可见、动画位移和缩放被禁用。
5. 对比构建产物，确认首页包含 `ei-hero-media`、`View the work` 和 motion client code。
6. 更新远端 `main` 后等待 Vercel Ready，再检查 `www.sutianrun.com` 指向新部署且生产 HTML 包含恢复标记。

## 发布约束

- 所有恢复代码必须先形成 Git commit，再触发生产部署。
- 远端 `main` 只允许从当前 `origin/main` 快进，不能 force push。
- 若远端在恢复期间出现新提交，停止发布并重新基于最新 `origin/main` 验证。
- 发布后不再从 dirty worktree 直接运行生产部署；GitHub `main` 与 Vercel 生产版本必须保持一致。

## 完成标准

- `www.sutianrun.com` 恢复 2026-08-21 09:17 版本的首页动态体验。
- 动态实现存在于 GitHub `main` 的可追溯提交中。
- 后续 Tokscale 快照或其他远端提交不会再把首页恢复成静态旧版本。
- 原始未提交工作区保持原样，不丢失也不混入本次生产恢复。
