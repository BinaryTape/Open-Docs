import matter from 'gray-matter'
import { DOCS_TYPES } from '../../../docs.config'
import { getSidebarTitle } from '../../../utils/sidebar-utils'

/**
 * Markdown-it plugin for auto-titling
 * Automatically prepends H1 heading based on frontmatter title or sidebar title
 * Skips 'kotlin' doc type and index pages
 */
export default function markdownItAutoTitle(md: any) {
  const originalParse = md.parse

  md.parse = function (src: string, env: any) {
    // Pre-process: remove liquid conditional blocks
    let modifiedSrc = src.replace(/{%\s*if\s+.*?%}[\s\S]*?{%\s*endif\s*%}/g, '')

    const parts = env.relativePath.split('/')
    const docType = parts.find((p: string) => DOCS_TYPES.includes(p))

    // Skip auto-titling for 'kotlin' doc type and index pages
    if (docType === 'kotlin' || docType === undefined) {
      return originalParse.call(this, modifiedSrc, env)
    }

    const lines = modifiedSrc.trim().split(/\r?\n/)
    let hasH1 = false

    // Check if document already has a level-1 heading
    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      if (lines[i].trim().startsWith('# ')) {
        hasH1 = true
        break
      }
    }

    // If no H1 heading found, prepend one automatically
    if (!hasH1) {
      const parsed = matter(modifiedSrc)
      const title = parsed.data?.title || getSidebarTitle(env.relativePath)

      if (title) {
        modifiedSrc = modifiedSrc.replace(/^---[\s\S]*?---\n*/, '')
        modifiedSrc = `# ${title}\n\n${modifiedSrc}`
      }
    }

    return originalParse.call(this, modifiedSrc, env)
  }
}
