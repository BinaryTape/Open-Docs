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

// Convert Material for MkDocs content tabs to the site's generic Vue tabs.
// Unlike VitePress code groups, these tabs may contain prose, admonitions,
// multiple code blocks, or another nested tab group.
export default function markdownItMkCodeTabs(md: any) {
  function transformContentTabs(state: any) {
    if (!isMkDocsDoc(state.env)) return
    state.src = transformLines(state.src.split('\n')).join('\n')
  }

  function transformLines(lines: string[]): string[] {
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

      output.push(`${group.indent}<Tabs>`)
      output.push('')
      for (const tab of group.tabs) {
        output.push(`${group.indent}<TabItem title="${escapeAttribute(tab.title)}">`)
        output.push('')
        const transformed = transformLines(tab.content)
        output.push(...transformed.map((contentLine) => contentLine ? group.indent + contentLine : ''))
        output.push('')
        output.push(`${group.indent}</TabItem>`)
        output.push('')
      }
      output.push(`${group.indent}</Tabs>`)
      // Keep following Markdown outside the generated HTML block. parseGroup
      // consumes trailing blank lines from the final tab, so restore the block
      // boundary explicitly after the closing component tag.
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
      if (fenceMatch) {
        fence = fenceMatch[1]
        rawContent.push(line)
        cursor++
        continue
      }

      const nextHeader = line.match(/^(\s*)===\s+"([^"]+)"\s*$/)
      if (nextHeader && nextHeader[1] === indent) break
      if (line.trim() !== '' && indentation(line) <= indent.length) break
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

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
