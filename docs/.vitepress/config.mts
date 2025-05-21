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
import { DocsTypeConfig } from './docs.config';
import { markdownItRewriteLinks } from './markdown-it-ws-inline-link';
import { SiteLocaleConfig } from './locales.config';
import generateSidebarItems from './config/sidebar.config';

const commonThemeConfig = {
  editLink: {
    pattern: 'https://github.com/BinaryTape/Open-Docs/blob/main/koin/:path'
  },
  socialLinks: [
    { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
  ],
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,
  lastUpdated: true,
  locales: {
    root: {
      ...SiteLocaleConfig['zh-hans'],
      themeConfig: {
        ...commonThemeConfig,
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Koin', link: '/koin/setup/koin' },
          { text: 'kotlin', link: '/kotlin/getting-started' }
        ],
        sidebar: {
          "/koin/": generateSidebarItems(SiteLocaleConfig['zh-hans'], DocsTypeConfig.koin),
          "/kotlin/": generateSidebarItems(SiteLocaleConfig['zh-hans'], DocsTypeConfig.kotlin),
        },
      },
    },
    "zh-hant": {
      dir: 'zh-hant',
      ...SiteLocaleConfig['zh-hant'],
      themeConfig: {
        ...commonThemeConfig,
        nav: [
          { text: 'Koin', link: 'zh-hant/koin/setup/koin' },
          { text: 'kotlin', link: 'zh-hant/kotlin/getting-started' }
        ],
        sidebar: {
          "zh-hant/koin/": generateSidebarItems(SiteLocaleConfig['zh-hant'], DocsTypeConfig.koin),
          "zh-hant/kotlin/": generateSidebarItems(SiteLocaleConfig['zh-hant'], DocsTypeConfig.kotlin),
        },
      },
    },
    ja: {
      ...SiteLocaleConfig['ja'],
      themeConfig: {
        ...commonThemeConfig,
        nav: [
          { text: 'Koin', link: 'ja/koin/setup/koin' },
          { text: 'kotlin', link: 'ja/kotlin/getting-started' }
        ],
        sidebar: {
          "ja/koin/": generateSidebarItems(SiteLocaleConfig['ja'], DocsTypeConfig.koin),
          "ja/kotlin/": generateSidebarItems(SiteLocaleConfig['ja'], DocsTypeConfig.kotlin),
        },
      },
    },
    ko: {
      ...SiteLocaleConfig['ko'],
      themeConfig: {
        ...commonThemeConfig,
        nav: [
          { text: 'Koin', link: 'ko/koin/setup/koin' },
          { text: 'kotlin', link: 'ko/kotlin/getting-started' }
        ],
        sidebar: {
          "ko/koin/": generateSidebarItems(SiteLocaleConfig['ko'], DocsTypeConfig.koin),
          "ko/kotlin/": generateSidebarItems(SiteLocaleConfig['ko'], DocsTypeConfig.kotlin),
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
    // preConfig: (md) => {
    //   md.use(markdownItWsAssets)
    //
    // },
    config: (md) => {
      md.use(markdownItWsCodeClean)

      md.use(markdownItWsTabs)

      md.use(markdownItWsFrontmatter)

      md.use(markdownItWsTldr)

      md.use(markdownItWsDeflist)

      md.use(markdownItWsContainer)

      md.use(markdownItWsCodeGroup)

      md.use(markdownItWsAssets)

      md.use(markdownItWsVars, {
        xmlFilePath: 'docs/v.list'
      });
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
        const result = originalRender.call(this, src, env)

        if (env.frontmatter && env.frontmatter.title) {
          return `<h1>${env.frontmatter.title}</h1>\n${result}`
        }

        return result
      }
    },
  },
})
