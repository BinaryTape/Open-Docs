// plugins/markdownItRewriteLinks.ts
import type MarkdownIt from 'markdown-it'
import { SITE_LOCALES } from './locales.config'
import { DOCS_TYPES } from './docs.config'

export interface RewriteLinkOptions {
  rewriteHref: (env, href: string) => string
}

// Options for rewriting links in markdown
// rewriteHref: Function to transform href URLs by adding locale and doc type paths
const rewiteOptions: RewriteLinkOptions = {
  rewriteHref: (env, href) => {
    const parts = env.relativePath.split('/')
    const locale = parts.find(p => SITE_LOCALES.includes(p))
    const docType = parts.find(p => DOCS_TYPES.includes(p))
    const config = { locale, docType }
    console.log(config)
    const localePath = locale === undefined ? '' : `/${config.locale}`
    const docsPath = `/${config.docType}`
    return `${localePath}${docsPath}${href}`
  },
}
export function markdownItRewriteLinks(md: MarkdownIt) {
  md.core.ruler.after('inline', 'rewrite-inline-links', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.type === 'inline' && token.children) {
        for (let j = 0; j < token.children.length; j++) {
          const child = token.children[j]

          if (child.type === 'link_open' && child.attrs) {
            for (const attr of child.attrs) {
              if (attr[0] === 'href') {
                const link = attr[1]
                if (link.startsWith('/')) {
                  attr[1] = rewiteOptions.rewriteHref(state.env, link)
                }
              }
            }
          }
        }
      }
    }
  })
}