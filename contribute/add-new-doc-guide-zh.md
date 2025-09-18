# 添加新的文档翻译指南

本文面向维护者或贡献者，介绍如何把“新的上游文档”纳入本仓库的自动同步与翻译流程，或在现有专题中新增页面并正确出现在站点侧边栏中。

适用读者：
- 想要新增一个要跟踪的开源项目文档仓库（如某库的官网文档）；
- 想在现有专题中增加/修复某些页面，并让流水线自动翻译；
- 想在本地运行翻译流水线进行验证。

---

## 一、关键概念速览

- docType（文档类型）：站点中每个专题的“类型”标识，如 `kotlin`、`kmp`、`ktor`、`sqldelight`、`koog`、`coil` 等。它决定了输出目录、侧边栏文件名等。
- REPOS 配置：位于 `.github/scripts/docs-repo-config.mjs`，定义要跟踪的上游仓库、分支、文档目录、资源目录以及处理策略（strategy）。
- strategy（策略）：位于 `.github/scripts/strategy-*.mjs`，定义如何发现需要处理的文档文件（glob pattern）、在不同阶段（同步/检测/翻译）做自定义处理（如 Writerside 的 `.topic` 转换、侧边栏生成、资源拷贝等）。
- Sidebar 与 Locale：侧边栏 JSON 写在 `docs/.vitepress/sidebar/{docType}.sidebar.json`，多语言文案写在 `docs/.vitepress/locales/*.json`，由 `SidebarProcessor.mjs` 自动生成/增量更新。
- 输出目录结构：
    - 简体中文（默认）：`docs/{docType}/...`
    - 其它语言：`docs/{lang}/{docType}/...`（如 `docs/ja/kotlin/...`）。

---

## 二、准备工作

- Node 20+，pnpm 已安装
- 拉取本项目代码并安装依赖：
  ```bash
  pnpm i
  ```

---

## 三、新增一个“上游文档仓库/新专题”

当你希望把一个全新的开源项目文档纳入本项目并自动翻译时，按以下步骤：

1) 增加 strategy（若可复用现有策略，可跳过）
- 根据上游站点技术栈选择相近策略：
    - Writerside 示例：`kotlinStrategy`、`kmpStrategy`（处理 `.topic`、生成 Writerside 侧边栏）。
    - MkDocs 示例：`koogStrategy`、`coilStrategy`（从 `mkdocs.yml` 生成侧边栏）。
    - Docusaurus 示例：`koinStrategy`（一般是纯 Markdown 目录结构）。
- 如需自定义，复制一个最接近的策略文件，新建例如 `.github/scripts/strategy-xxx.mjs`：
  ```js
  import { defaultStrategy } from "./strategy.mjs";
  import path from "path";
  import fs from "fs-extra";
  import { generateSidebar } from "./SidebarProcessor.mjs";

  export const myLibStrategy = {
    ...defaultStrategy,
    // 1) 指定需要处理的文档文件匹配模式（相对上游仓库根目录）
    getDocPatterns: () => ["docs/**/*.md"],

    // 2) 如需：拉取后做预处理（可为空）
    postSync: async (repoPath) => {},

    // 3) 检测阶段：生成侧边栏（按上游类型择一）
    postDetect: async (repoConfig, task) => {
      const repoPath = repoConfig.path;
      const sidebarPath = path.join(repoPath, "docs/mkdocs.yml"); // 若是 MkDocs
      const docType = repoPath.replace("-repo", "");
      if (await fs.pathExists(sidebarPath)) {
        await generateSidebar(sidebarPath, docType);
      }
    },

    // 4) 翻译结束后：拷贝资源等
    postTranslate: async (context, repoConfig) => {
      const { src, dest } = repoConfig.assets || {};
      if (src && dest) {
        const srcPath = path.join(repoConfig.path, src);
        if (await fs.pathExists(srcPath)) {
          await fs.ensureDir(dest);
          await fs.copy(srcPath, dest, { overwrite: true });
          context.gitAddPaths.add(dest);
        }
      }
    },
  };
  ```

2) 在 REPOS 中注册新仓库
- 编辑 `.github/scripts/docs-repo-config.mjs`，引入并添加一项：
  ```js
  import { myLibStrategy } from "./strategy-my-lib.mjs";

  export const REPOS = [
    // ...已有条目
    {
      name: "my-lib",                 // docType，影响输出目录与侧边栏文件名
      repo: "org/my-lib",            // GitHub 仓库路径 org/repo
      branch: "origin/main",         // 跟踪的远端分支
      path: "my-lib-repo",           // 本地克隆到的临时目录名
      docPath: "./docs",             // 上游文档根目录（相对克隆根目录）
      lastCheckFile: ".github/last_check_my-lib.txt", // 进度文件，随意命名但需唯一
      assets: {                        // 可选：资源拷贝配置
        src: "docs/images",          // 上游中的资源目录
        dest: "docs/public/my-lib",  // 本站静态资源输出目录
      },
      strategy: myLibStrategy,         // 选择上一步创建/复用的策略
    },
  ];
  ```

3) 在站点配置中注册 docType
- 编辑 `docs/.vitepress/docs.config.ts`，在 `DocsTypeConfig` 中添加：
  ```ts
  import { myLibRewriteHref } from "./rewrite/my-lib-rewrite-strategy"; // 若需要，亦可省略

  export const DocsTypeConfig = {
    // ...已有
    "my-lib": {
      type: "my-lib",
      title: "MyLib",           // 导航/侧边栏上显示的名称
      path: "/my-lib/",        // 站点路由前缀
      framework: "MKDocs",      // 或 "Writerside" | "Docusaurus"
      rewriteHref: myLibRewriteHref, // 可选：重写链接规则
    },
  } as const;
  ```
- 若无需特殊链接重写，可不提供 `rewriteHref`。

完成以上三步后，流水线会：
- 在 `STAGE 1` 克隆/更新新仓库；
- 在 `STAGE 2` 依据策略 `getDocPatterns()` 找到新增/变更文档；
- 在 `STAGE 3` 调用 Gemini 翻译，输出到 `docs/{docType}/...`（简中）与其他语言目录；
- 在 `STAGE 3.1` 生成/更新侧边栏与多语言 locale；
- 在 `STAGE 4` 统一提交并推送。

### 关于“自定义 Markdown 语法/HTML 组件”的处理（重要）

有些上游文档会使用框架自定义的 Markdown 语法（如 Writerside 的变量、容器，或 MkDocs 的标签/条件），也可能直接嵌入自定义 HTML。总体有两条路径可选：

- A. 在 Strategy 阶段做预处理（同步/检测阶段）——把非常“上游特定”的语法先转换为更通用的 Markdown/HTML，再交给翻译与构建。适合一次性重写、重命名、批量替换等。通常在 `.github/scripts/strategy-*.mjs` 的 `postSync`/`postDetect` 中处理。
- B. 在站点编译阶段用 MarkdownIt 插件转换 —— 保留上游原始语法，在 VitePress 编译 Markdown 时做语法解析与转换，甚至直接产出目标 HTML。适合需要可重复维护、跨仓库/多专题复用的语法规则。

如何选择：
- 如果你的转换只和某个上游绑定，且需要在“翻译之前”就统一格式（比如把 `.topic` 转成 `.md`、把特殊标签替换掉），优先用 Strategy 预处理。
- 如果语法具有通用性、需要在渲染期按上下文动态处理（比如根据 frontmatter、语言或链接重写），优先用 MarkdownIt 插件。

——

A. 示例：在 Strategy 中预处理 Markdown 语法

下面演示在 `postDetect` 阶段批量将自定义语法替换为标准容器（或 HTML）。你可以参考现有策略文件（如 `strategy-kmp.mjs`、`strategy-koog.mjs`）的结构：

```js
// .github/scripts/strategy-my-lib.mjs（节选）
import { defaultStrategy } from "./strategy.mjs";
import fs from "fs-extra";
import path from "path";

export const myLibStrategy = {
  ...defaultStrategy,
  getDocPatterns: () => ["docs/**/*.md"],
  postDetect: async (repoConfig, task) => {
    const repoPath = repoConfig.path;
    // 仅处理本次变更的 Markdown 文件
    const mdFiles = task.files.filter((f) => f.endsWith(".md"));
    for (const rel of mdFiles) {
      const abs = path.join(repoPath, rel);
      if (!(await fs.pathExists(abs))) continue;
      let content = await fs.readFile(abs, "utf8");

      // 把占位标签 <var name="..."/> 替换为固定文本或变量
      content = content.replace(/<var\s+name="(.*?)"\s*\/>/g, (m, p1) => `{{ ${p1} }}`);

      await fs.writeFile(abs, content);
    }
  },
};
```

注意：
- 若涉及“改名/改路径”（如 `.topic` → `.md`），需要像 `strategy-kmp.mjs` 那样同步更新 `task.files`，确保后续翻译拿到更新后的路径。
- 预处理通常在翻译前进行，可显著降低翻译时被奇怪语法干扰的概率。

——

B. 示例：编译阶段用 MarkdownIt 插件

在 `docs/.vitepress` 下新增一个插件文件（命名示例：`markdown-it-my-syntax.ts`），解析自定义语法并生成目标渲染：

```ts
// docs/.vitepress/markdown-it-my-syntax.ts
import type MarkdownIt from 'markdown-it'

export default function markdownItMySyntax(md: MarkdownIt) {
  const ruleName = 'my_inline_syntax'
  md.inline.ruler.before('emphasis', ruleName, (state, silent) => {
    const src = state.src
    const pos = state.pos
    // 例如匹配 [[badge:TEXT]] → <Badge text="TEXT"/>
    if (src.charCodeAt(pos) !== 0x5B /* '[' */ || src.slice(pos, pos + 9) !== '[[badge:') {
      return false
    }
    const end = src.indexOf(']]', pos)
    if (end < 0) return false
    if (!silent) {
      const text = src.slice(pos + 9, end)
      const token = state.push('html_inline', '', 0)
      token.content = `<Badge text="${md.utils.escapeHtml(text)}"/>`
    }
    state.pos = end + 2
    return true
  })
}
```

在 `docs/.vitepress/config.mts` 中注册：

```ts
// docs/.vitepress/config.mts（节选）
import markdownItMySyntax from './markdown-it-my-syntax'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(markdownItMySyntax)
    }
  }
})
```

你可以参考仓库里已有的插件实现，按需复用逻辑：
- Writerside 相关：`markdown-it-ws-*.ts`（frontmatter、变量、重命名、资源、内联渲染等）
- MkDocs 相关：`markdown-it-mk-*.ts`（高亮行、条件、Admonitions、Include、链接处理等）
- 其他实用插件：`markdown-it-remove-script.ts`、`markdown-it-remove-contribute-url.ts` 等

避坑建议：
- 插件应输出“最终面向 VitePress 的 HTML/Markdown”，不要残留上游专用占位符，否则本地预览会显示异常。

——

C. 自定义 HTML → 用 Vue 组件承载

对于复杂的 HTML 片段或交互，推荐将其封装为 Vue 组件放在：`docs/.vitepress/component`。

示例（在 Markdown 中按需引入并使用）：

```md
<script setup>
import Step from '@/component/Step.vue'
</script>

<template>
    <ul>
      <Step>安装依赖</Step>
      <Step>初始化项目</Step>
    </ul>
</template>
```

说明与建议：
- 本仓库已提供若干示例组件（如 `Step.vue` 等），可直接复用或参考实现。
- 若组件需要访问浏览器 API，请将逻辑放在 `onMounted` 中以避免 SSR 期间报错。
- 样式尽量使用局部样式（`<style scoped>`）避免污染文档全局。

---

## 四、翻译输出路径与语言

流水线在翻译前会设置环境变量：
- `DOC_TYPE = repoConfig.name`（即上文的 docType）
- `DOC_PATH = repoConfig.docPath`（上游文档根）

输出规则（见 `.github/scripts/translate.mjs`）：
- 简体中文：`docs/{DOC_TYPE}/{相对 DOC_PATH 的路径}`
- 其它语言：`docs/{lang}/{DOC_TYPE}/{相对 DOC_PATH 的路径}`

站点支持语言在 `docs/.vitepress/locales.config.ts` 中配置（默认：`zh-Hans`、`zh-Hant`、`ja`、`ko`）。

---

## 五、本地运行流水线（可选）

1) 配置act环境：https://github.com/nektos/act

2) 在终端运行：`act -s GOOGLE_API_KEY=KEY -j docs-update`

脚本阶段说明：
- STAGE 1: 同步上游仓库（克隆/更新）并执行 `strategy.postSync`；
- STAGE 2: 计算变更并生成任务，调用 `strategy.postDetect`；
- STAGE 3: 调用 Gemini 执行翻译，随后执行 `strategy.postTranslate`（拷贝资源等）；
- STAGE 3.1: 翻译/更新 `docs/.vitepress/locales/*.json`；
- STAGE 4: 统一 `git add` + `commit` + `push` 到 `GITHUB_REF_NAME`。

---

## 七、验证与预览

- 侧边栏：确认 `docs/.vitepress/sidebar/{docType}.sidebar.json` 已更新；
- 多语言：确认 `docs/.vitepress/locales/en.json` 以及其他语言 JSON 有新增键值；
- 资源：若配置了 `assets`，确认文件已复制至 `docs/public/{docType}`；
- 本地预览站点：
  ```bash
  pnpm docs:dev     # 开发预览
  pnpm docs:build   # 构建
  pnpm docs:preview # 产物预览
  ```

---

## 八、提交变更

- 若你只提交了文档/配置（未运行脚本），请正常 `git add/commit/push` 并发起 PR。

---

如需进一步帮助，请在仓库中提交 Issue，说明目标上游仓库地址与站点技术栈（Writerside/MkDocs/Docusaurus），我们会协助提供对应策略模板。
