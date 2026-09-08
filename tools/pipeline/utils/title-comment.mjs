/**
 * Writerside sources carry their title as a comment:
 *
 *   [//]: # (title: Strings)
 *   [//]: # (description: …)
 *
 * `markdown-it-ws-frontmatter` turns that comment into the page's H1. Models
 * translating these files sometimes rewrite the header as YAML frontmatter
 * instead, and then the page renders with no heading at all — VitePress
 * consumes the frontmatter and nothing is left to become an H1.
 *
 * Put the source's own header form back.
 */

const COMMENT = /^\[\/\/\]: # \(([a-z-]+):\s*([\s\S]*?)\)\s*$/gm
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

/**
 * @returns {{content: string, changed: boolean}}
 */
export function restoreTitleComment(translated, source) {
  const sourceKeys = [...source.matchAll(COMMENT)].map(([, key]) => key)
  if (!sourceKeys.includes('title')) return { content: translated, changed: false }

  const frontmatter = translated.match(FRONTMATTER)
  if (!frontmatter) return { content: translated, changed: false }

  const yaml = parseSimpleYaml(frontmatter[1])
  if (!yaml.has('title')) return { content: translated, changed: false }

  const body = translated.slice(frontmatter[0].length).replace(/^\s*\n/, '')
  const existing = new Map([...body.matchAll(COMMENT)].map(([, key, value]) => [key, value]))
  // The translation usually keeps the comments and merely adds the frontmatter
  // on top; only fall back to the frontmatter for a key it dropped.
  const missing = sourceKeys.filter((key) => !existing.has(key) && yaml.has(key))
  const header = missing.map((key) => `[//]: # (${key}: ${yaml.get(key)})`)

  const content = header.length ? `${header.join('\n')}\n\n${body}` : body
  return { content, changed: true }
}

function parseSimpleYaml(block) {
  const values = new Map()
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([a-z-]+):\s*(.*)$/i)
    if (!match) continue
    values.set(match[1], match[2].trim().replace(/^(['"])([\s\S]*)\1$/, '$2'))
  }
  return values
}
