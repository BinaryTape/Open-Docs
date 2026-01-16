// @ts-ignore - no type declarations available
import markdownItContainer from 'markdown-it-container'

// ===== MarkdownIt plugin imports =====
import markdownItWsContainer from "../markdown-it-ws-container"
import markdownItWsFrontmatter from "../markdown-it-ws-frontmatter"
import markdownItWsCodeClean from "../markdown-it-ws-code-clean"
import markdownItWsAssets from "../markdown-it-ws-assets"
import markdownItWsVars from "../markdown-it-ws-vars"
import markdownItMKVars from "../markdown-it-mk-vars"
import markdownItMkHlLines from "../markdown-it-mk-hl-lines"
import markdownItMkAdmonition from "../markdown-it-mk-admonitions"
import markdownItMkCodeTabs from "../markdown-it-mk-code-tabs"
import markdownItMkLinks from "../markdown-it-mk-links"
import { markdownItRewriteLinks } from '../markdown-it-ws-inline-link'
import markdownItDiffTitleWrapper from "../markdown-it-mk-diff-code-block"
import markdownItMKInclude from "../markdown-it-mk-Include"
import markdownItRemoveScript from "../markdown-it-remove-script"
import markdownItRemoveContributeUrl from "../markdown-it-remove-contribute-url"
import markdownItWsClassstyles from "../markdown-it-ws-classstyles"
import markdownItWsRenderInline from "../markdown-it-ws-render-inline"
import markdownItWsRename from "../markdown-it-ws-rename"
import markdownItWsTopicTitle from "../markdown-it-ws-topicTitle"
import { markdownItCollapsed } from "../markdownItCollapsed.mts"
import markdownItWsRemoveCodeAttr from "../markdown-it-ws-remove-code-attr"
import markdownItAutoTitle from "../markdown-it-auto-title"

// Re-export plugins that are used directly in config.mts
export { default as markdownItMkLiquidCondition } from "../markdown-it-mk-liquid-condition"
export { default as shikiRemoveDiffMarker } from "../shiki-remove-diff-marker"

/**
 * Create a custom markdown-it container
 * @param md - The markdown-it instance
 * @param name - The name of the container (e.g., 'note', 'caution')
 * @param className - The CSS class to apply to the container div
 * @param defaultTitle - The default title for the container
 */
function createContainer(md: any, name: string, className: string, defaultTitle: string) {
  md.use(markdownItContainer, name, {
    render: (tokens: any[], idx: number) => {
      const token = tokens[idx]
      const info = token.info.trim().slice(name.length).trim()
      if (token.nesting === 1) {
        const title = md.utils.escapeHtml(info || defaultTitle)
        return `<div class="${className} custom-block"><p class="custom-block-title">${title}</p>\n`
      }
      return '</div>\n'
    }
  })
}

/**
 * Register all markdown-it plugins
 * @param md - The markdown-it instance
 */
export function registerMarkdownPlugins(md: any) {
  // Writerside plugins
  md.use(markdownItWsClassstyles)
  md.use(markdownItRewriteLinks)
  md.use(markdownItWsCodeClean)
  md.use(markdownItWsFrontmatter)
  md.use(markdownItWsRenderInline)
  md.use(markdownItWsContainer)
  md.use(markdownItWsAssets)
  md.use(markdownItWsVars)
  md.use(markdownItWsRename)
  md.use(markdownItWsTopicTitle)
  md.use(markdownItWsRemoveCodeAttr)

  // MkDocs plugins
  md.use(markdownItMkAdmonition)
  md.use(markdownItMkHlLines)
  md.use(markdownItMkCodeTabs)
  md.use(markdownItMkLinks)
  md.use(markdownItMKInclude)
  md.use(markdownItMKVars)
  md.use(markdownItDiffTitleWrapper)

  // Common plugins
  md.use(markdownItRemoveContributeUrl)
  md.use(markdownItRemoveScript)
  md.use(markdownItCollapsed)

  // Custom containers
  createContainer(md, 'note', 'note', 'NOTE')
  createContainer(md, 'caution', 'warning', 'CAUTION')
  createContainer(md, 'warning', 'danger', 'WARNING')
  createContainer(md, 'example', 'info', 'EXAMPLE')

  // Auto-titling (must be registered last as it overrides md.parse)
  md.use(markdownItAutoTitle)
}
