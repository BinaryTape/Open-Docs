import { isMkDocsDoc } from '../../../utils/doctype-utils'

// Process Material for MkDocs admonitions, including collapsible `???` blocks.
export default function markdownItMkAdmonition(md: any) {
  function transformAdmonitions(state: any) {
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

      const match = !fence && line.match(
        /^(\s*)(!!!|\?\?\?\+?)\s+(?:([\w-]+)\s*)?(?:"([^"]*)")?\s*$/
      )
      if (!match) {
        output.push(line)
        index++
        continue
      }

      const leading = match[1]
      const marker = match[2]
      const originalType = match[3] || 'note'
      const type = normalizeType(originalType)
      const title = match[4] || defaultTitle(originalType)
      const contentIndent = leading + '    '
      const content: string[] = []
      let cursor = index + 1
      let contentFence: string | null = null

      while (cursor < lines.length) {
        const contentLine = lines[cursor]
        const strippedLine = contentLine.startsWith(contentIndent)
          ? contentLine.slice(contentIndent.length)
          : contentLine
        const contentFenceMatch = strippedLine.match(/^\s*(`{3,}|~{3,})/)

        if (contentFence) {
          content.push(strippedLine)
          if (
            contentFenceMatch?.[1][0] === contentFence[0] &&
            contentFenceMatch[1].length >= contentFence.length
          ) contentFence = null
          cursor++
          continue
        }
        if (contentLine.startsWith(contentIndent)) {
          content.push(strippedLine)
          if (contentFenceMatch) contentFence = contentFenceMatch[1]
          cursor++
          continue
        }
        if (contentLine.trim() === '') {
          content.push('')
          cursor++
          continue
        }
        break
      }

      if (contentFence) content.push(contentFence)

      while (content.at(-1) === '') content.pop()
      if (content.length === 0) {
        output.push(line)
        index++
        continue
      }

      const transformedContent = transformLines(content)
        .map((contentLine) => contentLine ? leading + contentLine : '')

      if (marker === '!!!') {
        output.push(`${leading}::: ${type} ${title}`.trimEnd())
        output.push(...transformedContent)
        output.push(`${leading}:::`)
      } else {
        const open = marker === '???+' ? ' open' : ''
        output.push(`${leading}<details${open} class="custom-block ${type}">`)
        output.push(`${leading}<summary>${md.utils.escapeHtml(title)}</summary>`)
        output.push('')
        output.push(...transformedContent)
        output.push('')
        output.push(`${leading}</details>`)
        // A blank line is required to prevent Markdown following this raw HTML
        // block from being consumed as unparsed details content.
        output.push('')
      }

      index = cursor
    }

    return output
  }

  md.core.ruler.before('normalize', 'mkdocs_admonition_transform', transformAdmonitions)
}

function normalizeType(type: string): string {
  const aliases: Record<string, string> = {
    abstract: 'info',
    attention: 'warning',
    beta: 'warning',
    bug: 'danger',
    caution: 'warning',
    danger: 'danger',
    error: 'danger',
    example: 'info',
    failure: 'danger',
    hint: 'tip',
    important: 'warning',
    info: 'info',
    note: 'info',
    question: 'info',
    quote: 'info',
    success: 'tip',
    tip: 'tip',
    warning: 'warning',
  }
  return aliases[type.toLowerCase()] || 'info'
}

function defaultTitle(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}
