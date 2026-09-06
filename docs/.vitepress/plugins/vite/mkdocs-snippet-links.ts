import MarkdownIt from 'markdown-it'
import { dirname, posix, relative, sep } from 'node:path'

// Read link destinations with MarkdownIt's parser so labels, titles, escaped
// parentheses, and inline code retain their original Markdown spelling.
const md = new MarkdownIt()
md.inline.ruler.before('link', 'collect_snippet_links', (state: any, silent: boolean) => {
  if (silent) return false
  const start = state.src[state.pos] === '!' ? state.pos + 1 : state.pos
  if (state.src[start] !== '[') return false
  const end = md.helpers.parseLinkLabel(state, start, false)
  if (end < 0 || state.src[end + 1] !== '(') return false
  const destinationStart = end + 2 + (state.src.slice(end + 2).match(/^\s*/)?.[0].length ?? 0)
  state.env.collect(state.src, destinationStart)
  return false
})

/** Rebase Markdown links without rendering snippets or changing code examples. */
export function rebaseSnippetLinks(source: string, snippetFile: string, callerFile: string): string {
  const prefix = relative(dirname(callerFile), dirname(snippetFile)).split(sep).join('/')
  if (!prefix) return source

  function rewriteText(text: string): string {
    const edits = new Map<number, { end: number, value: string }>()
    function collect(input: string, start: number) {
      const destination = md.helpers.parseLinkDestination(input, start, input.length)
      if (!destination.ok || !destination.str || /^(?:[a-z][a-z\d+.-]*:|[/#?])/i.test(destination.str)) return
      const suffixStart = destination.str.search(/[?#]/)
      const pathname = suffixStart < 0 ? destination.str : destination.str.slice(0, suffixStart)
      const suffix = suffixStart < 0 ? '' : destination.str.slice(suffixStart)
      const href = posix.join(prefix, pathname) + suffix
      // Angle brackets keep spaces and parentheses valid as link destinations.
      edits.set(start, { end: destination.pos, value: `<${md.normalizeLink(href)}>` })
    }

    md.inline.parse(text, md, { collect }, [])
    // Reference-style destinations are not processed by the inline parser.
    for (const match of text.matchAll(/^[ \t]*\[[^\]\n]+\]:[ \t]*/gm)) {
      collect(text, match.index! + match[0].length)
    }
    for (const [start, edit] of [...edits].sort(([a], [b]) => b - a)) {
      text = text.slice(0, start) + edit.value + text.slice(edit.end)
    }
    return text
  }

  const output: string[] = []
  let pending: string[] = []
  let fence: string | null = null
  const flush = () => {
    if (pending.length) output.push(rewriteText(pending.join('\n')))
    pending = []
  }
  // MkDocs tabs/admonitions can indent fences beyond CommonMark's three spaces.
  for (const line of source.split('\n')) {
    const marker = line.match(/^[ \t]*(`{3,}|~{3,})(.*)$/)
    if (fence) {
      output.push(line)
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = null
    } else if (marker) {
      flush()
      fence = marker[1]
      output.push(line)
    } else {
      pending.push(line)
    }
  }
  flush()
  return output.join('\n')
}
