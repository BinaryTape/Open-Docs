import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ─── 加载 .env.local ─────────────────────────────────────────────────────────
// 项目根目录的 .env.local 已在 .gitignore 中忽略，可安全存放本地密钥
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val; // 不覆盖已有环境变量
  }
  console.log('  📄 已加载 .env');
}

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Config ─────────────────────────────────────────────────────────────────
const config = JSON.parse(
  fs.readFileSync(path.join(ROOT, '.github/scripts/translate-config.json'), 'utf8')
);

let terminologyContent = '';
try {
  terminologyContent = fs.readFileSync(path.join(ROOT, config.terminologyPath), 'utf8');
} catch { terminologyContent = ''; }

// ─── Projects: GitHub repos with doc paths ──────────────────────────────────
// Mirrors docs-repo-config.mjs — branches strip "origin/", docPaths from strategy.getDocPatterns()
const PROJECTS = [
  {
    name: 'kotlin', displayName: 'Kotlin',
    repos: [
      // kotlinStrategy: getDocPatterns → docs/**/*.md, docs/**/*.topic
      { repo: 'JetBrains/kotlin-web-site', branch: 'master', docPaths: ['docs/topics'] },
      { repo: 'Kotlin/kotlinx.coroutines', branch: 'master', docPaths: ['docs/topics'] },
      { repo: 'Kotlin/dokka', branch: 'master', docPaths: ['docs/topics'] },
      { repo: 'JetBrains/lincheck', branch: 'master', docPaths: ['docs/topics'] },
      { repo: 'Kotlin/api-guidelines', branch: 'main', docPaths: ['docs/topics'] },
    ],
  },
  {
    // kmpStrategy: getDocPatterns → topics/**/*.md, topics/**/*.topic
    name: 'kmp', displayName: 'Kotlin Multiplatform',
    repos: [
      { repo: 'JetBrains/kotlin-multiplatform-dev-docs', branch: 'master', docPaths: ['topics'] },
    ],
  },
  {
    // ktorStrategy: getDocPatterns → topics/*.md
    name: 'ktor', displayName: 'Ktor',
    repos: [
      { repo: 'ktorio/ktor-documentation', branch: 'main', docPaths: ['topics'] },
    ],
  },
  {
    // koinStrategy (defaultStrategy): getDocPatterns → docs/**/*.md
    name: 'koin', displayName: 'Koin',
    repos: [
      { repo: 'InsertKoinIO/koin', branch: 'main', docPaths: ['docs'] },
      { repo: 'InsertKoinIO/koin-annotations', branch: 'main', docPaths: ['docs'] },
    ],
  },
  {
    // sqlDelightStrategy: getDocPatterns → docs/**/*.md
    name: 'sqldelight', displayName: 'SQLDelight',
    repos: [
      { repo: 'sqldelight/sqldelight', branch: 'master', docPaths: ['docs'] },
    ],
  },
  {
    // koogStrategy: getDocPatterns → docs/docs/**/*.md
    name: 'koog', displayName: 'Koog',
    repos: [
      { repo: 'JetBrains/koog', branch: 'develop', docPaths: ['docs/docs'] },
    ],
  },
  {
    // coilStrategy: getDocPatterns → docs/**/*.md
    name: 'coil', displayName: 'Coil',
    repos: [
      { repo: 'coil-kt/coil', branch: 'main', docPaths: ['docs'] },
    ],
  },
];

const LANGUAGES = config.targetLanguages;
const LANGUAGE_NAMES = config.languageNames;
const MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash' },
];

// ─── GenAI Client ───────────────────────────────────────────────────────────
let currentApiKey = process.env.GOOGLE_API_KEY || '';
let genAI = null;

function getGenAI(apiKey) {
  const key = apiKey || currentApiKey;
  if (!key) throw new Error('请先设置 Google API Key');
  if (key !== currentApiKey || !genAI) {
    currentApiKey = key;
    genAI = new GoogleGenAI({ apiKey: key });
  }
  return genAI;
}

// ─── GitHub API ─────────────────────────────────────────────────────────────
const githubCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function githubHeaders() {
  const h = { Accept: 'application/vnd.github.v3+json' };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `token ${token}`;
  return h;
}

/**
 * 获取仓库的文档文件列表。
 * 优先用 Trees API（每仓库 1 次请求），失败则降级为 Contents API（逐目录递归）。
 */
async function fetchDocFiles(repoFullName, branch, docPaths) {
  const cacheKey = `docs:${repoFullName}@${branch}:${docPaths.join(',')}`;
  const cached = githubCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  console.log(`  Fetching docs: ${repoFullName}@${branch} [${docPaths.join(', ')}]`);
  const headers = githubHeaders();

  // 方法 1: Trees API — 1 次请求拿到完整文件树
  let allFiles = await fetchViaTreesAPI(repoFullName, branch, docPaths, headers);

  // 方法 2: 降级到 Contents API — 逐目录递归（更多请求但更可靠）
  if (allFiles === null) {
    console.log(`    Falling back to Contents API for ${repoFullName}`);
    allFiles = [];
    for (const dp of docPaths) {
      const files = await listDirRecursive(repoFullName, branch, dp, headers);
      allFiles.push(...files);
    }
  }

  githubCache.set(cacheKey, { data: allFiles, ts: Date.now() });
  return allFiles;
}

/** Trees API: 一次请求获取整棵树，然后按 docPaths 过滤 */
async function fetchViaTreesAPI(repo, branch, docPaths, headers) {
  try {
    const url = `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`    Trees API ${res.status} for ${repo}@${branch}`);
      return null; // 触发降级
    }
    const data = await res.json();
    const tree = data.tree || [];
    // 过滤出 docPaths 下的 .md / .topic 文件
    return tree.filter(item => {
      if (item.type !== 'blob') return false;
      if (!/\.(md|topic)$/i.test(item.path)) return false;
      return docPaths.some(dp => item.path.startsWith(dp + '/'));
    });
  } catch (e) {
    console.warn(`    Trees API error for ${repo}: ${e.message}`);
    return null;
  }
}

/** Contents API 降级: 递归列出目录 */
async function listDirRecursive(repo, branch, dirPath, headers) {
  const url = `https://api.github.com/repos/${repo}/contents/${dirPath}?ref=${branch}`;
  let res;
  try { res = await fetch(url, { headers }); }
  catch (e) { return []; }
  if (!res.ok) return [];

  const items = await res.json();
  if (!Array.isArray(items)) return [];

  const result = [];
  for (const item of items) {
    if (item.type === 'file' && /\.(md|topic)$/i.test(item.name)) {
      result.push({ path: item.path, type: 'blob' });
    } else if (item.type === 'dir') {
      const sub = await listDirRecursive(repo, branch, item.path, headers);
      result.push(...sub);
    }
  }
  return result;
}

/** 从 GitHub raw 获取文件内容 */
async function fetchGitHubFile(repoFullName, branch, filePath) {
  const cacheKey = `file:${repoFullName}@${branch}:${filePath}`;
  const cached = githubCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const url = `https://raw.githubusercontent.com/${repoFullName}/${branch}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file (${res.status})`);

  const content = await res.text();
  githubCache.set(cacheKey, { data: content, ts: Date.now() });
  return content;
}

/** 将文件列表构建为前端树形结构 */
function buildTreeFromFiles(allFiles, docPaths) {
  const tree = [];

  for (const file of allFiles) {
    const matchDP = docPaths.find(dp => file.path.startsWith(dp + '/'));
    if (!matchDP) continue;
    const relPath = file.path.slice(matchDP.length + 1);
    const parts = relPath.split('/');

    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      if (i === parts.length - 1) {
        current.push({ name, type: 'file', path: file.path });
      } else {
        let dir = current.find(n => n.name === name && n.type === 'directory');
        if (!dir) {
          dir = { name, type: 'directory', children: [] };
          current.push(dir);
        }
        current = dir.children;
      }
    }
  }

  (function sortTree(nodes) {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(n => n.children && sortTree(n.children));
  })(tree);

  return tree;
}

// ─── Pre-processing（直接复用 .github/scripts/processors） ──────────────────
//
// processTopicContentAsync — Writerside XML 标签处理（<card>, <a>, <code-block src>, <include> 等）
// processMarkdownContent  — KMP/Ktor markdown 特殊语法处理（代码片段引用, tabs 重命名, 空链接标题填充等）
//
// 需要本地文件系统的操作（include 解析、snippet 获取、标题查找）会自动 fallback（catch → 返回原文）
//
import {
  processTopicContentAsync,
  replaceAsync,
} from '../.github/scripts/processors/TopicProcessor.mjs';
import {
  processMarkdownContent,
} from '../.github/scripts/processors/MarkdownProcessor.mjs';

/**
 * 预处理内容。根据 preprocessMode 选择处理方式:
 *   'topic'    — 仅 .topic → 提取 <topic> 内容（用于 kotlin 策略的 .topic 文件）
 *   'markdown' — 仅 Markdown 变换（用于 ktor/kmp 的 .md 文件）
 *   'both'     — 先 topic 处理再 markdown 处理
 *   'none'     — 不处理
 *
 * @param {string} content      原始文件内容
 * @param {string} fileName     文件名（用于判断 .topic / .md）
 * @param {string} projectName  项目名（用于 processTopicContentAsync 的 docRoot）
 * @param {string} preprocessMode  'topic' | 'markdown' | 'both' | 'none'
 */
async function preprocessContent(content, fileName, projectName, preprocessMode) {
  if (!content || preprocessMode === 'none') return content;

  const isTopic = fileName.endsWith('.topic');
  const doTopic = preprocessMode === 'topic' || preprocessMode === 'both';
  const doMarkdown = preprocessMode === 'markdown' || preprocessMode === 'both';

  // ── .topic 文件提取 ──
  if (isTopic && doTopic) {
    const m = content.match(/<topic\s*([^>]*)>([\s\S]*?)<\/topic>/);
    if (m) {
      let tc = m[0];
      // 运行完整的 topic 内容处理（includes/snippets 找不到会自动跳过）
      try {
        const fakeDocsPath = `${projectName}-repo/docs`;
        tc = await processTopicContentAsync(fileName, fakeDocsPath, tc);
      } catch (e) {
        console.warn('  ⚠️ Topic content processing partial failure (expected):', e.message);
      }
      tc = tc.split(/\r?\n/).filter(l => l.trim() !== '').join('\n');
      if (tc.includes('<section-starting-page>')) tc = '---\naside: false\n---\n' + tc;
      return tc;
    }
    return content;
  }

  // ── Markdown 处理 ──
  if (!isTopic && doMarkdown) {
    try {
      // processMarkdownContent 内部会调用 processTopicContentAsync + processMarkdownContent
      // 文件系统相关操作（fetchSnippet, getChapterTitle 等）找不到文件时会静默失败
      const fakeFilePath = `${projectName}-repo/docs/${fileName}`;
      content = await processMarkdownContent(fakeFilePath, content);
    } catch (e) {
      console.warn('  ⚠️ Markdown processing partial failure (expected):', e.message);
    }
  }

  return content;
}

// ─── VitePress createMarkdownRenderer（完整插件链 + shiki + Vue 组件支持） ───
let mdRenderer = null;

async function getRenderer() {
  if (mdRenderer) return mdRenderer;

  const { createMarkdownRenderer } = await import('vitepress');

  // tsx 把 TS named exports 包在 .default 下；用相对路径避免 Windows 路径问题
  const mdConfigModule = await import('../docs/.vitepress/config/markdown.config.ts');
  const mdConfig = mdConfigModule.default || mdConfigModule;
  const { registerMarkdownPlugins, markdownItMkLiquidCondition, shikiRemoveDiffMarker } = mdConfig;

  const mkDiffGrammar = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'docs/.vitepress/plugins/shiki/shiki-mk-diff.json'), 'utf8'),
  );

  // 使用 VitePress 自身的 createMarkdownRenderer —— 包含：
  //   • VitePress 内置容器（::: tip / warning / danger / details / code-group）
  //   • VitePress 代码块增强（copy button、语言标签、双主题高亮、行号）
  //   • VitePress 锚链接
  //   • shiki 双主题（github-light + github-dark）
  //   • 项目自定义 Writerside / MkDocs / Common 全部 23 个插件
  //   • shiki diff marker 移除 transformer + 自定义 diff 语法
  const md = await createMarkdownRenderer('docs', {
    attrs: { leftDelimiter: '{', rightDelimiter: '}', allowedAttributes: [] },
    preConfig: (md) => { md.use(markdownItMkLiquidCondition); },
    shikiSetup: async (shiki) => { await shiki.loadLanguage(mkDiffGrammar); },
    codeTransformers: [shikiRemoveDiffMarker()],
    config: (md) => { registerMarkdownPlugins(md); },
  });

  mdRenderer = md;
  console.log('  ✅ VitePress createMarkdownRenderer 已初始化（含全部插件 + shiki 双主题）');
  return md;
}

// ─── Queue & State ──────────────────────────────────────────────────────────
const translationQueue = [];
let isProcessingQueue = false;
const uploadedFiles = [];
const customPrompts = {};

// ─── Prompt Templates ───────────────────────────────────────────────────────
function getDefaultPrompt(targetLang) {
  const langName = LANGUAGE_NAMES[targetLang] || targetLang;
  if (customPrompts[targetLang]) return customPrompts[targetLang];
  if (targetLang === 'ja' || targetLang === 'ko') return getEnglishPrompt(langName);
  if (targetLang === 'zh-Hant') return getTraditionalChinesePrompt(langName);
  return getSimplifiedChinesePrompt(langName);
}

function getEnglishPrompt(lang) {
  return `# Role and Task

You are a professional AI translation assistant specializing in translating **Kotlin-related** English technical documentation into ${lang} with precision. Your goal is to produce high-quality, technically accurate translations that conform to the reading habits of the target language, primarily for a **developer audience**. Please strictly follow these guidelines and requirements:

## I. Translation Style and Quality Requirements

1.  **Faithful to the Original and Fluent Expression:**
    * Translations should be natural and fluent while ensuring technical accuracy, conforming to the language habits of ${lang} and the expression style of the internet technology community.
    * Properly handle the original sentence structure and word order, avoiding literal translations that may create reading obstacles.
    * Maintain the tone of the original text (e.g., formal, informal, educational).

2.  **Terminology Handling:**
    * **Prioritize the Terminology List:** Strictly translate according to the terminology list provided below. The terminology list has the highest priority.
    * **Reference Translation Consistency:** For terms not included in the terminology list, please refer to the reference translations to maintain consistency in style and existing terminology usage.
    * **New/Ambiguous Terminology Handling:**
        * For proper nouns or technical terms not included in the terminology list and without precedent in reference translations, if you choose to translate them, it is recommended to include the original English in parentheses after the translation at first occurrence, e.g., "Translation (English Term)".
        * If you are uncertain about a term's translation, or believe keeping the English is clearer, please **keep the original English text**.
    * **Placeholders/Variable Names:** Placeholders (such as \`YOUR_API_KEY\`) or special variable names in the document that are not in code blocks should usually be kept in English, or translated with comments based on context.

## II. Technical Format Requirements

1.  **Markdown Format:** Completely preserve all Markdown syntax and formatting in the original text, including but not limited to: headers, lists, bold, italics, strikethrough, blockquotes, horizontal rules, admonitions (:::), etc.
2.  **Code Handling:** Content in code blocks and inline code **must not be translated**, must be kept in the original English, determine whether to translate comments based on context.
3.  **Links and Images:** All links (URLs) and image reference paths in the original text must remain unchanged.
4.  **HTML Tags:** If HTML tags are embedded in the original Markdown, these tags and their attributes should also remain unchanged.

## III. YAML Frontmatter and Special Comments Handling Requirements

1.  **Format Preservation:** The format of the YAML Frontmatter section at the beginning of the document must be strictly preserved.
2.  **Field Translation:** Only translate the content values of fields like 'title', 'description', etc.
3.  **Special Comments Handling:** Translate the title content in special comments like \`[//]: # (title: Content to translate)\`.

## IV. Output Requirements

1.  **Clean Output:** Output only the translated Markdown content. Do not include any additional explanations, statements, apologies, or self-comments.
2.  **Consistent Structure:** Maintain the same document structure and paragraphing as the original text.

---

## V. Resources

### 1. Terminology List (Glossary)
{RELEVANT_TERMS}

### 2. Reference Translations
{TRANSLATION_REFERENCES}

---

## VI. Content to Translate
Please translate the following Markdown content from English to ${lang}:

\`\`\`markdown
{SOURCE_TEXT}
\`\`\``;
}

function getTraditionalChinesePrompt(lang) {
  return `# 角色與任務

你是一位專業的 AI 翻譯助手，負責專門將 **Github 中 Kotlin 相關的** 英文技術文件精準翻譯為台灣的 ${lang}。你的目標是產出高品質、技術準確、且符合目標語言閱讀習慣的譯文，主要面向 **開發者受眾**。請嚴格遵循以下指導原則和要求：

## 一、翻譯風格與品質要求

1. **忠實原文與流暢表達**
   * 在確保技術準確性的前提下，譯文應自然流暢，符合 ${lang} 的語言習慣和網路技術社群的表達方式。
   * 妥善處理原文的語序和句子結構，避免生硬直譯或造成閱讀障礙。
   * 保持原文的語氣（例如：正式、非正式、教學性）。

2. **術語與優先級規則（重要）**
   * **優先級次序：** 術語表（Glossary） > 文內慣例 > 一般語言習慣。
   * **衝突裁決：** 當「專有名詞不譯」與「常規含義可譯」衝突時，以術語表 **適用上下文** 說明裁決。
   * **不翻譯術語的形態：** 列入「**不翻譯術語**」的詞一律保持 **英文原形與大小寫**。
   * **翻譯術語：** 按術語表「翻譯術語」指定譯法執行。若存在「不要譯作 …」的禁用譯法，嚴禁使用。

3. **新／模糊術語處理**
   * 若你選擇翻譯，**首次出現**可在中文後以括號附註英文原文，如：\`譯文 (English Term)\`。
   * 若不確定或保留英文更清晰，**直接保留英文原文**。

## 二、技術格式要求

1.  **Markdown 格式：** 完整保留原文中的所有 Markdown 語法和格式。
2.  **程式碼處理：** 程式碼區塊和行內程式碼中的內容 **均不得翻譯**，必須保持英文原文。
3.  **連結與圖片：** 原文中的所有連結和圖片引用路徑必須保持不變。
4.  **HTML 標籤：** 如果原文 Markdown 中內嵌了 HTML 標籤，這些標籤及其屬性也應保持不變。

## 三、YAML Frontmatter 與特殊註解處理要求

1.  **格式保持：** 文件開頭由兩個 '---' 包圍的 YAML Frontmatter 部分的格式必須嚴格保持不變。
2.  **欄位翻譯：** 僅翻譯 'title'、'description' 等欄位的內容值。
3.  **特殊註解處理：** 翻譯形如 \`[//]: # (title: 標題內容)\` 的特殊註解中的標題內容。

## 四、輸出要求

1.  **純淨輸出：** 僅輸出翻譯後的 Markdown 內容。
2.  **結構一致：** 保持與原文相同的文件結構和分段。

---

## 五、資源

### 1. 術語表 (Glossary)
{RELEVANT_TERMS}

### 2. 參考翻譯 (Translation References)
{TRANSLATION_REFERENCES}

---

## 六、待翻譯內容
請將以下 Markdown 內容從英文翻譯為 ${lang}:

\`\`\`markdown
{SOURCE_TEXT}
\`\`\``;
}

function getSimplifiedChinesePrompt(lang) {
  return `# 角色与任务

你是一位专业的 AI 翻译助手，专门负责将 **Github中Kotlin相关的** 英文技术文档精准翻译为 ${lang}。你的目标是产出高质量、技术准确、且符合目标语言阅读习惯的译文，主要面向**开发者受众**。请严格遵循以下指导原则和要求：

## 一、翻译风格与质量要求

1. **忠实原文与流畅表达**
   * 在确保技术准确性的前提下，译文应自然流畅，符合 ${lang} 的语言习惯和互联网技术社群的表达方式。
   * 妥善处理原文的语序和句子结构，避免生硬直译或产生阅读障碍。
   * 保持原文的语气（例如：正式、非正式、教学性）。

2. **术语与优先级规则（重要）**
   * **优先级次序：** 术语表（Glossary） > 文内惯例 > 一般语言习惯。
   * **冲突裁决：** 当"专有名词不译"与"常规含义可译"冲突时，以术语表**适用上下文**说明裁决。
   * **不翻译术语的形态：** 列入"**不翻译术语**"的词一律保持**英文原形与大小写**。
   * **翻译术语：** 按术语表"翻译术语"指定译法执行。若存在"不要译作 …"的禁用译法，严禁使用。
   * **括号称谓统一：** 使用"圆括号 / 方括号 / 花括号"，不得使用"小/中/大括号"。

3. **新/模糊术语处理**
   * 若你选择翻译，**首次出现**可在中文后以括号附注英文原文，如：\`译文 (English Term)\`。
   * 若不确定或保留英文更清晰，**直接保留英文原文**。

## 二、技术格式要求

1.  **Markdown 格式:** 完整保留原文中的所有 Markdown 语法和格式。
2.  **代码处理:** 代码块和内联代码中的内容 **均不得翻译**，必须保持英文原文。
3.  **链接与图片:** 原文中的所有链接和图片引用路径必须保持不变。
4.  **HTML 标签:** 如果原文 Markdown 中内嵌了 HTML 标签，这些标签及其属性也应保持不变。

## 三、YAML Frontmatter 及特殊注释处理要求

1.  **格式保持:** 文档开头由两个 '---' 包围的 YAML Frontmatter 部分的格式必须严格保持不变。
2.  **字段翻译:** 仅翻译 'title'、'description' 等字段的内容值。
3.  **特殊注释处理:** 翻译形如 \`[//]: # (title: 标题内容)\` 的特殊注释中的标题内容。

## 四、输出要求

1.  **纯净输出:** 仅输出翻译后的 Markdown 内容。
2.  **结构一致:** 保持与原文相同的文档结构和分段。

---

## 五、资源

### 1. 术语表 (Glossary)
{RELEVANT_TERMS}

### 2. 参考翻译 (Translation References)
{TRANSLATION_REFERENCES}

---

## 六、待翻译内容
请将以下 Markdown 内容从英文翻译为 ${lang}:

\`\`\`markdown
{SOURCE_TEXT}
\`\`\``;
}

// ─── Translation Helpers ────────────────────────────────────────────────────
function cleanupTranslation(text) {
  if (!text) return '';
  if (text.startsWith('```markdown')) text = text.replace(/^```markdown\n/, '');
  else if (text.startsWith('```md')) text = text.replace(/^```md\n/, '');
  else if (text.startsWith('```')) text = text.replace(/^```\n/, '');
  if (text.endsWith('```')) text = text.replace(/```$/, '');
  text = text.replace(/([^\\])\\n/g, '$1\n');
  text = text.replace(/^\\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

/**
 * Find the local previous translation for a file.
 * @param {string} projectName - e.g. "kotlin"
 * @param {string} fileName - basename of the file, e.g. "getting-started.md"
 * @param {string} targetLang
 */
function loadPreviousTranslation(projectName, fileName, targetLang) {
  try {
    let targetPath;
    if (targetLang === 'zh-Hans') {
      targetPath = path.join(ROOT, 'docs', projectName, fileName);
    } else {
      targetPath = path.join(ROOT, 'docs', targetLang, projectName, fileName);
    }
    if (fs.existsSync(targetPath)) {
      const content = fs.readFileSync(targetPath, 'utf8');
      return `\n### 先前翻译版本\n\`\`\`\n${content}\n\`\`\`\n`;
    }
  } catch (e) {
    console.warn('Failed to load previous translation:', e.message);
  }
  return '';
}

/**
 * Calculate the local target path for saving a translated file.
 * @param {string} projectName - e.g. "kotlin"
 * @param {string} fileName - basename of the file
 * @param {string} targetLang
 */
function calculateTargetPath(projectName, fileName, targetLang) {
  if (targetLang === 'zh-Hans') {
    return `${projectName}/${fileName}`;
  }
  return `${targetLang}/${projectName}/${fileName}`;
}

// ─── SSE Clients ────────────────────────────────────────────────────────────
const sseClients = new Set();

function broadcastQueue() {
  const data = JSON.stringify({ queue: translationQueue.map(q => ({ ...q, sourceContent: undefined })), isProcessing: isProcessingQueue });
  for (const client of sseClients) {
    client.write(`data: ${data}\n\n`);
  }
}

// ─── API Routes ─────────────────────────────────────────────────────────────

// SSE endpoint for real-time queue updates
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('data: connected\n\n');
  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

// Config
app.get('/api/config', (req, res) => {
  res.json({
    projects: PROJECTS,
    languages: LANGUAGES,
    languageNames: LANGUAGE_NAMES,
    models: MODELS,
    hasApiKey: !!process.env.GOOGLE_API_KEY,
    hasGitHubToken: !!process.env.GITHUB_TOKEN,
  });
});

// ─── GitHub file browsing ───────────────────────────────────────────────────

// Get file tree for a project (all repos)
app.get('/api/files/:project', async (req, res) => {
  const project = PROJECTS.find(p => p.name === req.params.project);
  if (!project) return res.status(404).json({ error: '项目不存在' });

  const repos = [];
  for (const rc of project.repos) {
    try {
      const allFiles = await fetchDocFiles(rc.repo, rc.branch, rc.docPaths);
      const tree = buildTreeFromFiles(allFiles, rc.docPaths);
      repos.push({
        repo: rc.repo,
        branch: rc.branch,
        docPaths: rc.docPaths,
        tree,
        fileCount: allFiles.length,
      });
    } catch (error) {
      console.warn(`  ⚠️ Failed to fetch ${rc.repo}@${rc.branch}: ${error.message}`);
      repos.push({
        repo: rc.repo, branch: rc.branch, docPaths: rc.docPaths,
        tree: [], fileCount: 0, error: error.message,
      });
    }
  }
  res.json({ project: project.name, repos });
});

// Get file content from GitHub
app.get('/api/github/file', async (req, res) => {
  const { repo, branch, path: filePath } = req.query;
  if (!repo || !branch || !filePath) {
    return res.status(400).json({ error: '缺少参数: repo, branch, path' });
  }
  try {
    const content = await fetchGitHubFile(repo, branch, filePath);
    res.json({ content, repo, branch, path: filePath });
  } catch (error) {
    console.error('GitHub file error:', error);
    res.status(502).json({ error: error.message });
  }
});

// Clear GitHub cache
app.post('/api/github/refresh', (req, res) => {
  githubCache.clear();
  res.json({ success: true, message: '缓存已清除' });
});

// ─── Render & Preprocess API ────────────────────────────────────────────────

// Server-side markdown → HTML rendering（VitePress createMarkdownRenderer + renderAsync）
app.post('/api/render', async (req, res) => {
  const { content, projectName, fileName } = req.body;
  if (!content) return res.json({ html: '' });
  try {
    const md = await getRenderer();
    // 提供 env 上下文给需要 relativePath 的插件（ws-rename, auto-title, inline-link 等）
    const name = fileName || 'preview.md';
    const env = { relativePath: projectName ? `${projectName}/${name}` : name };
    const html = await md.renderAsync(content, env);
    res.json({ html });
  } catch (e) {
    console.error('Render error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Pre-process raw source content (topic→md, Writerside/MkDocs transforms)
app.post('/api/preprocess', async (req, res) => {
  const { content, fileName, projectName, mode } = req.body;
  if (!content) return res.json({ content: '' });
  try {
    const processed = await preprocessContent(
      content,
      fileName || 'file.md',
      projectName || 'unknown',
      mode || 'both',
    );
    res.json({ content: processed });
  } catch (e) {
    console.error('Preprocess error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ─── Prompt API ─────────────────────────────────────────────────────────────

app.get('/api/prompt/:lang', (req, res) => {
  const lang = req.params.lang;
  res.json({ prompt: getDefaultPrompt(lang), isCustom: !!customPrompts[lang] });
});

app.post('/api/prompt/:lang', (req, res) => {
  const lang = req.params.lang;
  const { prompt } = req.body;
  if (prompt) customPrompts[lang] = prompt;
  else delete customPrompts[lang];
  res.json({ success: true });
});

// ─── Translation ────────────────────────────────────────────────────────────

app.post('/api/translate', async (req, res) => {
  const { sourceContent, targetLang, model, useTerminology, usePrevTranslation, preprocessMode, customPrompt, projectName, fileName, apiKey } = req.body;

  try {
    // Optional pre-processing
    let content = sourceContent;
    if (preprocessMode && preprocessMode !== 'none' && fileName) {
      content = await preprocessContent(content, fileName, projectName || 'unknown', preprocessMode);
    }

    const ai = getGenAI(apiKey);
    const terms = useTerminology !== false ? terminologyContent : '';
    let prevTranslation = '';
    if (usePrevTranslation !== false && projectName && fileName) {
      prevTranslation = loadPreviousTranslation(projectName, fileName, targetLang);
    }

    const promptTemplate = customPrompt || getDefaultPrompt(targetLang);
    const prompt = promptTemplate
      .replace('{RELEVANT_TERMS}', terms || '无相关术语')
      .replace('{TRANSLATION_REFERENCES}', prevTranslation || '无参考翻译')
      .replace('{SOURCE_TEXT}', content);

    const response = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 1 },
    });

    const translated = cleanupTranslation(response.text);
    res.json({ success: true, content: translated });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Queue ──────────────────────────────────────────────────────────────────

app.post('/api/queue/add', (req, res) => {
  const { fileName, sourceContent, projectName, targetLang, model, options } = req.body;
  const id = crypto.randomUUID();
  translationQueue.push({
    id, fileName, sourceContent, projectName,
    targetLang: targetLang || 'zh-Hans',
    model: model || 'gemini-2.5-flash',
    options: options || {},
    status: 'pending', result: null, error: null,
    createdAt: new Date().toISOString(),
  });
  broadcastQueue();
  res.json({ id, queue: translationQueue.map(q => ({ ...q, sourceContent: undefined })) });
});

app.delete('/api/queue/:id', (req, res) => {
  const idx = translationQueue.findIndex(q => q.id === req.params.id);
  if (idx !== -1) translationQueue.splice(idx, 1);
  broadcastQueue();
  res.json({ success: true });
});

app.delete('/api/queue', (req, res) => {
  translationQueue.length = 0;
  broadcastQueue();
  res.json({ success: true });
});

app.get('/api/queue', (req, res) => {
  res.json({
    queue: translationQueue.map(q => ({ ...q, sourceContent: undefined })),
    isProcessing: isProcessingQueue,
  });
});

app.get('/api/queue/:id', (req, res) => {
  const item = translationQueue.find(q => q.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/queue/process', (req, res) => {
  if (isProcessingQueue) return res.json({ message: '正在处理中' });
  const { apiKey } = req.body;
  isProcessingQueue = true;
  broadcastQueue();
  res.json({ message: '开始处理队列' });
  processQueueAsync(apiKey);
});

async function processQueueAsync(apiKey) {
  for (const item of translationQueue) {
    if (item.status !== 'pending') continue;
    item.status = 'translating';
    broadcastQueue();
    try {
      const ai = getGenAI(apiKey);
      const terms = item.options.useTerminology !== false ? terminologyContent : '';
      let prevTranslation = '';
      if (item.options.usePrevTranslation !== false && item.projectName && item.fileName) {
        prevTranslation = loadPreviousTranslation(item.projectName, item.fileName, item.targetLang);
      }
      let sourceText = item.sourceContent;
      if (item.options.preprocessMode && item.options.preprocessMode !== 'none' && item.fileName) {
        sourceText = await preprocessContent(sourceText, item.fileName, item.projectName || 'unknown', item.options.preprocessMode);
      }
      const promptTemplate = item.options.customPrompt || getDefaultPrompt(item.targetLang);
      const prompt = promptTemplate
        .replace('{RELEVANT_TERMS}', terms || '无相关术语')
        .replace('{TRANSLATION_REFERENCES}', prevTranslation || '无参考翻译')
        .replace('{SOURCE_TEXT}', sourceText);
      const response = await ai.models.generateContent({
        model: item.model,
        contents: prompt,
        config: { temperature: 1 },
      });
      item.result = cleanupTranslation(response.text);
      item.status = 'completed';
    } catch (error) {
      item.error = error.message;
      item.status = 'error';
    }
    broadcastQueue();
  }
  isProcessingQueue = false;
  broadcastQueue();
}

// ─── Upload ─────────────────────────────────────────────────────────────────

app.post('/api/upload', (req, res) => {
  const { files: fileList } = req.body;
  if (!fileList || !Array.isArray(fileList)) return res.status(400).json({ error: '无效的文件数据' });
  const uploaded = [];
  for (const file of fileList) {
    const id = crypto.randomUUID();
    const item = { id, name: file.name, content: file.content, uploadedAt: new Date().toISOString() };
    uploadedFiles.push(item);
    uploaded.push({ id: item.id, name: item.name, uploadedAt: item.uploadedAt });
  }
  res.json({ files: uploaded });
});

app.get('/api/uploads', (req, res) => {
  res.json({ files: uploadedFiles.map(f => ({ id: f.id, name: f.name, uploadedAt: f.uploadedAt })) });
});

app.get('/api/upload/:id', (req, res) => {
  const file = uploadedFiles.find(f => f.id === req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });
  res.json({ content: file.content, name: file.name });
});

app.delete('/api/upload/:id', (req, res) => {
  const idx = uploadedFiles.findIndex(f => f.id === req.params.id);
  if (idx !== -1) uploadedFiles.splice(idx, 1);
  res.json({ success: true });
});

// ─── Save ───────────────────────────────────────────────────────────────────

app.post('/api/save', (req, res) => {
  const { content, projectName, fileName, targetLang } = req.body;
  if (!content || !projectName || !fileName || !targetLang) {
    return res.status(400).json({ error: '缺少必要参数 (content, projectName, fileName, targetLang)' });
  }
  try {
    const targetRelPath = calculateTargetPath(projectName, fileName, targetLang);
    const targetFullPath = path.join(ROOT, 'docs', targetRelPath);
    fs.mkdirSync(path.dirname(targetFullPath), { recursive: true });
    fs.writeFileSync(targetFullPath, content, 'utf8');
    res.json({ success: true, targetPath: targetRelPath });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Terminology ────────────────────────────────────────────────────────────

app.get('/api/terminology', (req, res) => {
  res.json({ content: terminologyContent });
});

// ─── Fallback ───────────────────────────────────────────────────────────────

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`\n  🌐 Open-Docs 翻译平台已启动`);
  console.log(`  📍 地址: http://localhost:${PORT}`);
  console.log(`  🔑 API Key: ${currentApiKey ? '已设置 ✅' : '未设置 ❌ (可在界面中设置)'}`);
  console.log(`  🐙 GitHub Token: ${process.env.GITHUB_TOKEN ? '已设置 ✅ (5000 req/hr)' : '未设置 (60 req/hr)'}\n`);
});
