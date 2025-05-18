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
import generateSidebarItems from './script/generateSidebar';
import { DocsTypeConfig } from './docs.config';
import { markdownItRewriteLinks } from './markdown-it-ws-inline-link';
import { SiteLocaleConfig } from './locales.config';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,
  lastUpdated: true,
  locales: {
    root: {
      ...SiteLocaleConfig['zh-hans'],
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Koin', link: '/koin/setup/koin' },
          { text: 'kotlin', link: '/kotlin/home' }
        ],
        sidebar: {
          "/koin/": generateSidebarItems("zh-hans", DocsTypeConfig.koin),
          "/kotlin/": [
            {
              text: 'Home',
              link: '/kotlin/home'
            },
            {
              text: 'Kotlin教程',
              collapsed: false,
              items: [
                { text: 'Kotlin组件B', link: '/kotlin/kotlin2' },
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/BinaryTape/Open-Docs/blob/main/koin/:path'
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ],
      },
    },
    "zh-hant": {
      ...SiteLocaleConfig['zh-hant'],
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Koin', link: 'zh-hant/koin/setup/koin' },
          { text: 'kotlin', link: '/kotlin/home' }
        ],
        sidebar: {
          "zh-hant/koin/": generateSidebarItems("zh-hant", DocsTypeConfig.koin),
          "/kotlin/": [
            {
              text: 'Home',
              link: '/kotlin/home'
            },
            {
              text: 'Kotlin教程',
              collapsed: false,
              items: [
                { text: 'Kotlin组件B', link: '/kotlin/kotlin2' },
              ]
            }
          ]
        },
      },
    },
    ja: {
      ...SiteLocaleConfig['ja'],
      themeConfig: {
        nav: [
          { text: 'Koin', link: 'ja/koin/setup/koin' },
          { text: 'kotlin', link: '/kotlin/home' }
        ],
        sidebar: {
          "ja/koin/": generateSidebarItems("ja", DocsTypeConfig.koin),
          "/kotlin/": [
            {
              text: 'Home',
              link: '/kotlin/home'
            },
            {
              text: 'Kotlin教程',
              collapsed: false,
              items: [
                { text: 'Kotlin组件B', link: '/kotlin/kotlin2' },
              ]
            }
          ]
        },
      },
    },
    ko: {
      ...SiteLocaleConfig['ko'],
      themeConfig: {
        nav: [
          { text: 'Koin', link: 'ko/koin/setup/koin' },
          { text: 'kotlin', link: '/kotlin/home' }
        ],
        sidebar: {
          "ko/koin/": generateSidebarItems("ko", DocsTypeConfig.koin),
          "/kotlin/": [
            {
              text: 'Home',
              link: '/kotlin/home'
            },
            {
              text: 'Kotlin教程',
              collapsed: false,
              items: [
                { text: 'Kotlin组件B', link: '/kotlin/kotlin2' },
              ]
            }
          ]
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
