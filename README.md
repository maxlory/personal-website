# 苏天润个人网站

一个以研究、产品判断与可验证实践为主线的个人作品集。网站使用统一的暖纸色、深绿色与金色视觉系统，包含首页、个人经历、工作方法和 3 个完整案例页。

## 页面

- `/`：个人定位、精选案例与联系方式
- `/story`：金融训练到 AI 产品实践的经历路径
- `/process`：定义问题、建立结构、验证判断的方法
- `/work/profile`：个人经历、项目实践与简历
- `/work/selected-builds`：AI 产品评测、评分方法与原始附录
- `/work/ai-workflow`：JobMatch 与 Lets Go RSS 工作流证据

旧地址 `/work/futures-ai` 和 `/work/ai-benchmark` 会自动跳转到对应的新页面。

## 本地运行

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:3000`。

## 验证与构建

```bash
npm run lint
npm run build
```

项目使用 Next.js 静态导出，构建结果写入 `out/`，可部署到支持静态文件的网站托管服务。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Markdown

## 设计原则

- 证据先于包装，案例内容区分目标、过程与实际结果。
- 首页建立定位，详情页统一采用“问题—方法—证据—判断”阅读结构。
- 支持键盘导航、跳过链接、可见焦点、减少动态效果和移动端安全区。
- 页面元数据、分享图、旧链接兼容与静态导出均已配置。
