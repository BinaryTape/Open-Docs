import { defineConfig } from 'vitepress'
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
import { DocsTypeConfig } from './docs.config';
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

const commonThemeConfig = {
  editLink: {
    pattern: 'https://github.com/BinaryTape/Open-Docs/blob/main/:path'
  },
  socialLinks: [
    { icon: 'github', link: 'https://github.com/BinaryTape/Open-Docs' }
  ],
  footer: {
    copyright: 'Copyright © 2025 Open AIDoc.'
  }
}

const mkDiffGrammarPath = resolve(__dirname, './shiki-mk-diff.json')
const mkDiffGrammar = JSON.parse(readFileSync(mkDiffGrammarPath, 'utf-8'))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,
  lastUpdated: true,
  lang: 'zh-hans',
  title: 'Open AiDoc',
  head: [['link', { rel: 'icon', href: 'img/favicon.ico' }]],
  vite: {
    plugins: [
      liquidIncludePlugin()
    ]
  },
  locales: {
    root: {
      ...SiteLocaleConfig['zh-hans'],
      themeConfig: {
        ...commonThemeConfig,
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Koin', link: '/koin/setup/koin' },
          { text: 'kotlin', link: '/kotlin/getting-started' },
          { text: 'SQLDelight', link: '/sqldelight/index' }
        ],
        sidebar: {
          "/koin/": generateSidebarItems(SiteLocaleConfig['zh-hans'], DocsTypeConfig.koin),
          "/kotlin/": generateSidebarItems(SiteLocaleConfig['zh-hans'], DocsTypeConfig.kotlin),
          "/sqldelight/": generateSidebarItems(SiteLocaleConfig['zh-hans'], DocsTypeConfig.sqldelight),
        },
      },
    },
    "zh-hant": {
      link: "/zh-hant/",
      ...SiteLocaleConfig['zh-hant'],
      themeConfig: {
        ...commonThemeConfig,
        nav: [
          { text: 'Koin', link: 'zh-hant/koin/setup/koin' },
          { text: 'kotlin', link: 'zh-hant/kotlin/getting-started' },
          { text: 'SQLDelight', link: 'zh-hant/sqldelight/index' }
        ],
        sidebar: {
          "/zh-hant/koin/": generateSidebarItems(SiteLocaleConfig['zh-hant'], DocsTypeConfig.koin),
          "/zh-hant/kotlin/": generateSidebarItems(SiteLocaleConfig['zh-hant'], DocsTypeConfig.kotlin),
          "/zh-hant/sqldelight/": generateSidebarItems(SiteLocaleConfig['zh-hant'], DocsTypeConfig.sqldelight),
        },
      },
    },
    ja: {
      ...SiteLocaleConfig['ja'],
      themeConfig: {
        ...commonThemeConfig,
        nav: [
          { text: 'Koin', link: 'ja/koin/setup/koin' },
          { text: 'kotlin', link: 'ja/kotlin/getting-started' },
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
        ...commonThemeConfig,
        nav: [
          { text: 'Koin', link: 'ko/koin/setup/koin' },
          { text: 'kotlin', link: 'ko/kotlin/getting-started' },
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
      md.use(markdownItRewriteLinks)

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

      const originalRender = md.render

      md.render = function (src, env) {
        // 检查源代码是否以#开头的标题开始（处理可能的空行）
        const lines = src.trim().split(/\r?\n/);
        let hasH1 = false;
        
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
        
        // 执行原始渲染
        const result = originalRender.call(this, src, env);
        
        // 如果frontmatter中有标题，直接使用
        if (env.frontmatter && env.frontmatter.title) {
          return `<h1>${env.frontmatter.title}</h1>\n${result}`;
        }
        
        // 如果源码中没有h1标题，则使用侧栏标题
        if (!hasH1) {
          const sidebarTitle = getSidebarTitle(env.relativePath);
          if (sidebarTitle) {
            return `<h1>${sidebarTitle}</h1>\n${result}`;
          }
        }
      
        return result;
      }
    },
  },
})
