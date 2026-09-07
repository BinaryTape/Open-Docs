import { isMkDocsDoc } from '../../../utils/doctype-utils'

type ParsedTab = {
  title: string
  content: string[]
}

type ParsedGroup = {
  tabs: ParsedTab[]
  nextIndex: number
  indent: string
}

// Convert Material for MkDocs content tabs to static tab markup. Unlike
// VitePress code groups, these tabs may contain prose, admonitions, multiple
// code blocks, or another nested tab group.
//
// The markup is deliberately plain HTML rather than the `<Tabs>` component used
// by the Writerside sources: `Tabs.vue` inspects its slot vnodes and re-renders
// them through `<component :is>`, which drops Vue's compiled SSR string path
// and materialises a vnode tree for every tab body. Koog contributes ~3.1k tab
// groups, and that was enough to exhaust an 8 GB heap while rendering pages.
// Radio inputs plus sibling selectors give the same behaviour with no component
// at all; see `.ws-tabs-static` in theme/style.css.
export default function markdownItMkCodeTabs(md: any) {
  function transformContentTabs(state: any) {
    if (!isMkDocsDoc(state.env)) return
    // Group names only have to be unique within one page, and a per-document
    // counter keeps them stable across builds.
    const groupName = groupNamer()
    state.src = transformLines(state.src.split('\n'), groupName).join('\n')
  }

  function transformLines(lines: string[], groupName: () => string): string[] {
    const output: string[] = []
    let index = 0
    let fence: string | null = null

    while (index < lines.length) {
      const line = lines[index]
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
      if (fenceMatch) {
        const marker = fenceMatch[1][0]
        fence = fence === marker ? null : (fence ?? marker)
        output.push(line)
        index++
        continue
      }

      const group = !fence ? parseGroup(lines, index) : null
      if (!group) {
        output.push(line)
        index++
        continue
      }

      const name = groupName()

      // The radios are direct children of the container, ahead of both the tab
      // bar and the bodies, so plain `input:checked ~ …` sibling selectors
      // reach everything that has to react — no `:has()`, and no JavaScript.
      // Keep this as one HTML block: no blank lines until the bar is closed.
      output.push(`${group.indent}<div class="ws-tabs-container ws-tabs-static">`)
      group.tabs.forEach((_tab, tabIndex) => {
        const checked = tabIndex === 0 ? ' checked' : ''
        output.push(`${group.indent}<input type="radio" name="${name}" id="${name}-${tabIndex}"${checked}>`)
      })
      output.push(`${group.indent}<div class="ws-tablist">`)
      group.tabs.forEach((tab, tabIndex) => {
        const title = escapeAttribute(tab.title)
        output.push(
          `${group.indent}<label class="ws-tab" data-title="${title}" for="${name}-${tabIndex}">${title}</label>`
        )
      })
      output.push(`${group.indent}</div>`)
      output.push('')
      output.push(`${group.indent}<div class="ws-tabcontents">`)
      output.push('')
      for (const tab of group.tabs) {
        output.push(`${group.indent}<div class="ws-tabcontent">`)
        output.push('')
        const transformed = transformLines(tab.content, groupName)
        output.push(...transformed.map((contentLine) => contentLine ? group.indent + contentLine : ''))
        output.push('')
        output.push(`${group.indent}</div>`)
        output.push('')
      }
      output.push(`${group.indent}</div>`)
      output.push('')
      output.push(`${group.indent}</div>`)
      // Keep following Markdown outside the generated HTML block. parseGroup
      // consumes trailing blank lines from the final tab, so restore the block
      // boundary explicitly after the closing tag.
      output.push('')
      index = group.nextIndex
    }

    return output
  }

  md.core.ruler.before('normalize', 'mkdocs_content_tabs_transform', transformContentTabs)
}

function parseGroup(lines: string[], startIndex: number): ParsedGroup | null {
  const first = lines[startIndex].match(/^(\s*)===\s+"([^"]+)"\s*$/)
  if (!first) return null

  const indent = first[1]
  const tabs: ParsedTab[] = []
  let index = startIndex

  while (index < lines.length) {
    const header = lines[index].match(/^(\s*)===\s+"([^"]+)"\s*$/)
    if (!header || header[1] !== indent) break

    const rawContent: string[] = []
    let cursor = index + 1
    let fence: string | null = null
    while (cursor < lines.length) {
      const line = lines[cursor]

      // Translated Koog sources occasionally contain code lines that lost the
      // tab body's four-space indentation. Once a fenced block has started,
      // keep consuming through its closing fence instead of ending the tab.
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
      if (fence) {
        rawContent.push(line)
        if (
          fenceMatch?.[1][0] === fence[0] &&
          fenceMatch[1].length >= fence.length
        ) fence = null
        cursor++
        continue
      }
      // Only an already-open fence may contain de-indented translated lines.
      // A new fence at the tab header's level belongs to the following page.
      if (line.trim() !== '' && indentation(line) <= indent.length) break
      if (fenceMatch) {
        fence = fenceMatch[1]
        rawContent.push(line)
        cursor++
        continue
      }

      const nextHeader = line.match(/^(\s*)===\s+"([^"]+)"\s*$/)
      if (nextHeader && nextHeader[1] === indent) break
      rawContent.push(line)
      cursor++
    }

    // Match the previous compatibility behavior for truncated translated
    // pages: do not let a missing final fence swallow the generated Vue tags.
    if (fence) rawContent.push(indent + '    ' + fence)

    while (rawContent[0]?.trim() === '') rawContent.shift()
    while (rawContent.at(-1)?.trim() === '') rawContent.pop()
    if (rawContent.length === 0) return null

    tabs.push({
      title: header[2],
      content: dedentTabContent(rawContent, indent),
    })
    index = cursor
  }

  return tabs.length > 0 ? { tabs, nextIndex: index, indent } : null
}

function dedentTabContent(lines: string[], parentIndent: string): string[] {
  const expected = parentIndent + '    '
  return lines.map((line) => {
    if (line.trim() === '') return ''
    if (line.startsWith(expected)) return line.slice(expected.length)

    // Be tolerant of tabs or non-standard indentation while still requiring
    // the content to be nested more deeply than its `===` header.
    const extra = line.slice(parentIndent.length)
    return extra.replace(/^(?: {1,4}|\t)/, '')
  })
}

function indentation(line: string): number {
  return line.match(/^\s*/)?.[0].length ?? 0
}

// Group names double as the `id` prefix for the radios. VitePress inlines
// `@include` directives and the MkDocs snippet transform runs in the Vite
// layer, so one counter per document covers everything that ends up on a page.
function groupNamer(): () => string {
  let next = 0
  return () => `ws-tabs-${next++}`
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
