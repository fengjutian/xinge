# 心格 · 探索自我与世界

React + TypeScript + Vite 自我探索网站，面向个人反思与心理学知识探索。

## 本地运行
需要 Node.js 22（见 `.nvmrc`）。依赖版本已固定，减少直接使用 `latest` 带来的非预期升级。

```bash
npm install
npm run dev
npm run build
```

Netlify 构建命令为 `npm run build`，发布目录为 `dist`。项目通过 `netlify.toml` 固定 Node.js 22，并配置 SPA 回退与静态资源缓存策略。

## 当前功能（V0.8.1）
- 心理概念探索地图、今日一问、机制反思练习、研究笔记。
- 情绪日记：情绪与强度、日期、情境、身体感受、需要和主题标签。
- 日记关键词搜索、情绪/标签筛选、近七日记录数量图、描述性周度指标与标签频次线索。
- 情绪日记可逐条删除并导出 JSON；与原有反思练习使用不同的本地存储键。
- 价值观罗盘：从 16 项价值方向中选择最多 5 项，调整优先顺序，记录重要原因、近期行动与未来一周的小行动。
- 个人成长实验：记录假设、具体行动、起止日期、进度状态、观察结果和复盘；支持新建、编辑、逐条删除、清空确认与 JSON 导出。
- 自我认知反思：分别记录客观情境、自我评价、对他人看法的猜测、事实线索、替代解释和下一步行动；支持历史回看、逐条删除与 JSON 导出。
- 价值观练习独立保存到浏览器，可导出 JSON、清除并重新开始；不会生成固定人格类型或分数。
- 反思记录通过 `ReflectionStorage` 接口管理，当前适配器使用浏览器 `localStorage`。
- 页面加载时恢复上次保存的反思记录；可保存覆盖、清除、导出 JSON 备份和导入备份。
- 导入时会校验备份数据结构；清除操作会二次确认。
- 页面提供保存、导入、导出状态反馈与错误提示。
- 数据仅保存在当前浏览器，不上传服务器。清理浏览器站点数据或更换设备可能导致记录丢失；请自行保管导出的备份文件。

## 产品规划与验收文档

- `docs/PRODUCT-ROADMAP.md`：产品定位、功能规划、技术路线与隐私原则。
- `docs/V0.5-ACCEPTANCE.md`：V0.5.0 验收清单与手工测试步骤。
- `docs/V0.6-ACCEPTANCE.md`：价值观罗盘的功能范围与手工验收步骤。
- `docs/V0.7-ACCEPTANCE.md`：成长实验的功能范围与手工验收步骤。
- `docs/V0.8-ACCEPTANCE.md`：自我认知反思的功能范围与手工验收步骤。

## Netlify 部署与预检查

1. 将项目推送到 GitHub/GitLab 等 Git 仓库。
2. 在 Netlify 选择 **Add new site → Import an existing project** 并连接仓库。
3. 构建命令填写 `npm run build`，发布目录填写 `dist`（与 `netlify.toml` 一致）。Node.js 版本由仓库根目录 `.nvmrc` 和 Netlify 配置指定为 22。
4. 触发部署后，先检查首页，再刷新页面，并直接访问站点中的页面锚点/路径，确认 SPA 回退生效。
5. 发布后打开浏览器开发者工具，检查 Console 与 Network；确认 JS/CSS 资源没有 404，并测试反思记录保存、JSON 导出和导入。

部署前可运行静态预检查：

```bash
npm run check:deploy
```

此命令检查关键配置、入口文件、相对导入路径、SPA 回退及缓存策略，但**不代替**依赖安装、TypeScript 编译、Vite 生产构建、真实浏览器测试或线上部署验证。V0.8.1 当前仍需完成依赖安装、生产构建和浏览器手工验收。当前环境访问 npm registry 时出现 DNS 网络错误，因此无法在此处生成 lockfile 或确认构建结果。

## 数据与部署说明
当前版本没有服务端数据库，也没有跨设备同步。此版本尚未接入 SQLite。Netlify Functions 的临时文件系统不能当作持久数据库。未来如需 SQLite，需要单独实现并验证浏览器端 SQLite/WASM + OPFS 的浏览器兼容性，或使用独立的持久化服务；不能把 Netlify Functions 的临时磁盘当作数据库。

## 内容边界
内容用于自我观察，不构成心理诊断。概念图连线只表示内容组织，不代表心理因果、相似度或预测。


## 依赖安装故障排查

如果 `npm install` 出现 `EAI_AGAIN`、`getaddrinfo` 或超时，通常是当前网络无法解析/连接 npm registry，不是项目构建成功或失败的证据。建议：

1. 检查 `npm config get registry`，默认应为 `https://registry.npmjs.org/`。
2. 在可访问 npm registry 的网络环境中运行 `npm install`。
3. 将生成的 `package-lock.json` 纳入版本控制；后续 CI/Netlify 可使用 `npm ci` 进行可复现安装。
4. 运行 `npm run check:deploy` 做静态检查，再运行 `npm run build` 验证 TypeScript 与生产构建。

不要通过删除 TypeScript 严格检查或忽略构建错误来“修复”依赖网络故障。


## V0.9.0：心理学知识依赖网络

新增可搜索、可筛选的知识网络。六个入门概念附有前置知识、来源类型、适用范围、局限、练习和来源链接。节点之间的连线只表达学习组织关系，不代表心理因果。详见 `docs/V0.9-ACCEPTANCE.md`。
