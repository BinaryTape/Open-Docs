import { DefaultTheme, defineConfig } from 'vitepress'
import markdownItContainer from 'markdown-it-container'
import markdownItWsCodeGroup from "./markdown-it-ws-code-group";
import markdownItWsContainer from "./markdown-it-ws-container";
import markdownItWsFrontmatter from "./markdown-it-ws-frontmatter";
import markdownItWsTldr from "./markdown-it-ws-tldr";
import markdownItWsTabs from "./markdown-it-ws-tabs";
import markdownItWsCodeClean from "./markdown-it-ws-code-clean";
import markdownItWsDeflist from "./markdown-it-ws-deflist";
import markdownItWsAssets from "./markdown-it-ws-assets";
import markdownItWsVars from "./markdown-it-ws-vars";
import markdownItMKVars from "./markdown-it-mk-vars";
import markdownItMkHlLines from "./markdown-it-mk-hl-lines";
import markdownItMkLiquidCondition from "./markdown-it-mk-liquid-condition";
import markdownItMkAdmonition from "./markdown-it-mk-admonitions";
import markdownItMkCodeTabs from "./markdown-it-mk-code-tabs";
import markdownItMkLinks from "./markdown-it-mk-links";
import { DOCS_TYPES, DocsTypeConfig } from './docs.config';
import { markdownItRewriteLinks } from './markdown-it-ws-inline-link';
import { SiteLocaleConfig } from './locales.config';
import generateSidebarItems from './config/sidebar.config';
import markdownItDiffTitleWrapper from "./markdown-it-mk-diff-code-block";
import { getSidebarTitle } from './utils/sidebar-utils';
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import shikiRemoveDiffMarker from "./shiki-remove-diff-marker";
import liquidIncludePlugin from "./vite-liquid-include";
import markdownItMKInclude from "./markdown-it-mk-Include";
import markdownItRemoveScript from "./markdown-it-remove-script";
import markdownItRemoveContributeUrl from "./markdown-it-remove-contribute-url";
import markdownItWsClassstyles from "./markdown-it-ws-classstyles";

const mkDiffGrammarPath = resolve(__dirname, './shiki-mk-diff.json')
const mkDiffGrammar = JSON.parse(readFileSync(mkDiffGrammarPath, 'utf-8'))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  lang: 'zh-Hans',
  title: 'Open AIDoc',
  head: [
    ['link', { rel: 'icon', href: 'img/favicon.ico' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-HLCXSW4HH1' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HLCXSW4HH1');`
    ]
  ],
  vite: {
    plugins: [
      liquidIncludePlugin()
    ]
  },
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: 'KKPT76EMFG',
        apiKey: '4aa380b300f9018dd16ecfc112c8a786',
        indexName: 'openaiorg'
      }
    },
    logo: '/img/logo.png',
    editLink: {
      pattern: 'https://github.com/BinaryTape/Open-Docs/blob/main/:path'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/BinaryTape/Open-Docs' }
    ],
    footer: {
      copyright: 'Copyright © 2025 Open AIDoc.'
    }
  },
  locales: {
    root: {
      ...SiteLocaleConfig['zh-Hans'],
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Koin', link: '/koin/setup/koin' },
          { text: 'Kotlin', link: '/kotlin/getting-started' },
          { text: 'SQLDelight', link: '/sqldelight/index' }
        ],
        sidebar: {
          "/koin/": generateSidebarItems(SiteLocaleConfig['zh-Hans'], DocsTypeConfig.koin),
          "/kotlin/": generateSidebarItems(SiteLocaleConfig['zh-Hans'], DocsTypeConfig.kotlin),
          "/sqldelight/": generateSidebarItems(SiteLocaleConfig['zh-Hans'], DocsTypeConfig.sqldelight),
        },
      },
    },
    "zh-Hant": {
      link: "/zh-Hant/",
      ...SiteLocaleConfig['zh-Hant'],
      themeConfig: {
        nav: [
          { text: 'Koin', link: 'zh-Hant/koin/setup/koin' },
          { text: 'Kotlin', link: 'zh-Hant/kotlin/getting-started' },
          { text: 'SQLDelight', link: 'zh-Hant/sqldelight/index' }
        ],
        sidebar: {
          "/zh-Hant/koin/": generateSidebarItems(SiteLocaleConfig['zh-Hant'], DocsTypeConfig.koin),
          "/zh-Hant/kotlin/": generateSidebarItems(SiteLocaleConfig['zh-Hant'], DocsTypeConfig.kotlin),
          "/zh-Hant/sqldelight/": generateSidebarItems(SiteLocaleConfig['zh-Hant'], DocsTypeConfig.sqldelight),
        },
      },
    },
    ja: {
      ...SiteLocaleConfig['ja'],
      themeConfig: {
        nav: [
          { text: 'Koin', link: 'ja/koin/setup/koin' },
          { text: 'Kotlin', link: 'ja/kotlin/getting-started' },
          { text: 'SQLDelight', link: 'ja/sqldelight/index' }
        ],
        sidebar: {
          "ja/koin/": generateSidebarItems(SiteLocaleConfig['ja'], DocsTypeConfig.koin),
          "ja/kotlin/": generateSidebarItems(SiteLocaleConfig['ja'], DocsTypeConfig.kotlin),
          "ja/sqldelight/": generateSidebarItems(SiteLocaleConfig['ja'], DocsTypeConfig.sqldelight),
        },
      },
    },
    ko: {
      ...SiteLocaleConfig['ko'],
      themeConfig: {
        nav: [
          { text: 'Koin', link: 'ko/koin/setup/koin' },
          { text: 'Kotlin', link: 'ko/kotlin/getting-started' },
          { text: 'SQLDelight', link: 'ko/sqldelight/index' }
        ],
        sidebar: {
          "ko/koin/": generateSidebarItems(SiteLocaleConfig['ko'], DocsTypeConfig.koin),
          "ko/kotlin/": generateSidebarItems(SiteLocaleConfig['ko'], DocsTypeConfig.kotlin),
          "ko/sqldelight/": generateSidebarItems(SiteLocaleConfig['ko'], DocsTypeConfig.sqldelight),
        }
      }
    }
  },
  markdown: {
    attrs: {
      leftDelimiter: '{',
      rightDelimiter: '}',
      allowedAttributes: []
    },

    preConfig: (md) => {
      md.use(markdownItMkLiquidCondition)
    },

    shikiSetup: (shiki) => {
      shiki.loadLanguage(mkDiffGrammar)
    },

    codeTransformers: [
      shikiRemoveDiffMarker()
    ],

    config: (md) => {
      md.use(markdownItWsClassstyles)
      md.use(markdownItRewriteLinks)

      md.use(markdownItRemoveContributeUrl)

      md.use(markdownItRemoveScript)

      md.use(markdownItMKInclude)

      md.use(markdownItWsCodeClean)

      md.use(markdownItWsTabs)

      md.use(markdownItWsFrontmatter)

      md.use(markdownItWsTldr)

      md.use(markdownItWsDeflist)

      md.use(markdownItWsContainer)

      md.use(markdownItWsCodeGroup)

      md.use(markdownItWsAssets)

      md.use(markdownItMkAdmonition)

      md.use(markdownItMkHlLines)

      md.use(markdownItMkCodeTabs)

      md.use(markdownItMkLinks)

      md.use(markdownItDiffTitleWrapper)
      md.use(markdownItWsVars, {
        xmlFilePath: 'docs/.vitepress/v.list'
      });
      md.use(markdownItMKVars);

      md.use(markdownItContainer, 'note', {
        render: function (tokens, idx) {
          const m = tokens[idx].info.trim().match(/^note\s*(.*)$/);

          if (tokens[idx].nesting === 1) {
            return `<div class="note custom-block"><p class="custom-block-title">${md.utils.escapeHtml(m[1] || 'NOTE')}</p>\n`;
          } else {
            return '</div>\n';
          }
        }
      })

      md.use(markdownItContainer, 'caution', {
        render: function (tokens, idx) {
          const m = tokens[idx].info.trim().match(/^caution\s*(.*)$/);

          if (tokens[idx].nesting === 1) {
            return `<div class="warning custom-block"><p class="custom-block-title">${md.utils.escapeHtml(m[1] || 'CAUTION')}</p>\n`;
          } else {
            return '</div>\n';
          }
        }
      })

      md.use(markdownItContainer, 'warning', {
        render: function (tokens, idx) {
          const m = tokens[idx].info.trim().match(/^warning\s*(.*)$/);

          if (tokens[idx].nesting === 1) {
            return `<div class="danger custom-block"><p class="custom-block-title">${md.utils.escapeHtml(m[1] || 'DANGER')}</p>\n`;
          } else {
            return '</div>\n';
          }
        }
      })

      md.use(markdownItContainer, 'example', {
        render: function (tokens, idx) {
          const m = tokens[idx].info.trim().match(/^example\s*(.*)$/);

          if (tokens[idx].nesting === 1) {
            return `<div class="danger custom-block"><p class="custom-block-title">${md.utils.escapeHtml(m[1] || 'DANGER')}</p>\n`;
          } else {
            return '</div>\n';
          }
        }
      })

      const originalParse = md.parse;

      md.parse = function (src, env) {
        // 检查源代码是否以#开头的标题开始（处理可能的空行）
        src = src.replace(/{%\s*if\s+.*?%}[\s\S]*?{%\s*endif\s*%}/g, '');
        const lines = src.trim().split(/\r?\n/);
        let hasH1 = false;
        let modifiedSrc = src;



        const parts = env.relativePath.split('/')
        const docType = parts.find(p => DOCS_TYPES.includes(p))

        if (docType === 'kotlin') {
          return originalParse.call(this, src, env);
        }

        // 跳过可能的空行，检查是否有#开头的标题行
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '') continue; // 跳过空行
          // 检查是否是h1标题行
          if (trimmedLine.startsWith('# ')) {
            hasH1 = true;
            break;
          }
        }

        // 如果没有H1标题，在源码开头添加标题
        if (!hasH1) {
          // 先尝试从frontmatter获取标题
          if (env.frontmatter && env.frontmatter.title) {
            modifiedSrc = `# ${env.frontmatter.title}\n\n${src}`;
          } else {
            // 否则从侧栏获取标题
            const sidebarTitle = getSidebarTitle(env.relativePath);
            if (sidebarTitle) {
              modifiedSrc = `# ${sidebarTitle}\n\n${src}`;
            }
          }
        }

        // 使用可能修改过的源码执行原始渲染
        return originalParse.call(this, modifiedSrc, env);
      }
    },
  },
})
