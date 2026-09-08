/**
 * `cleanupTranslation` used to rewrite every literal `\n` in a translated file
 * into a real line break. That is right for a model that returns the whole
 * document on one line, and wrong everywhere else: Markdown carries `\n` inside
 * code samples (`val message = "Hello,\nworld!"`) and inside escape-sequence
 * tables, and turning those into line breaks splits a string literal across two
 * lines or breaks a table row in half.
 *
 * Put the escape back. A split leaves a telltale behind — an unclosed delimiter
 * on one line that the next line closes — so each repair is locally checkable,
 * and the caller only runs this on files whose upstream actually contains `\n`.
 */

const FENCE = /^\s{0,3}(`{3,}|~{3,})(.*)$/
// A rewritten escape splits one line into two; more than a handful of joins
// means the delimiter count is telling us something else.
const MAX_JOIN = 8

/**
 * @returns {{content: string, repaired: number}}
 */
export function restoreEscapedNewlines(markdown) {
  const lines = markdown.split('\n')
  const output = []
  let repaired = 0
  let fence = null
  let rawString = false

  for (let index = 0; index < lines.length; index++) {
    let line = lines[index]

    const fenceMatch = line.match(FENCE)
    if (fenceMatch) {
      const [, marker, info] = fenceMatch
      if (!fence) fence = marker
      else if (marker[0] === fence[0] && marker.length >= fence.length && !info.trim()) fence = null
      output.push(line)
      continue
    }

    // Kotlin raw strings really do span lines; leave everything inside one be.
    if (fence && countRawStringDelimiters(line) % 2 === 1) rawString = !rawString
    if (rawString) {
      output.push(line)
      continue
    }

    const isOpen = fence ? hasUnclosedQuote : hasUnclosedCode
    if (isOpen(line)) {
      // Absorb following lines until the delimiter closes again, and commit
      // only if it does. A line that never closes was not split by the escape
      // rewrite, and joining it would destroy real content.
      let joined = line
      let consumed = 0
      while (isOpen(joined) && consumed < MAX_JOIN && index + 1 + consumed < lines.length) {
        const next = lines[index + 1 + consumed]
        if (next.trim() === '') break
        joined = `${joined}\\n${next}`
        consumed++
      }
      if (consumed > 0 && !isOpen(joined)) {
        line = joined
        index += consumed
        repaired += consumed
      }
    }

    output.push(line)
  }

  return { content: output.join('\n'), repaired }
}

/** A code-fence line that opens a plain string literal without closing it. */
function hasUnclosedQuote(line) {
  const withoutRaw = line.replaceAll('"""', '')
  return countUnescaped(withoutRaw, '"') % 2 === 1
}

/**
 * A prose line that opens an inline code span without closing it. Only runs of
 * one or two backticks delimit inline code; a longer run is a fence, including
 * the indented fences inside list items that the block scanner above skips.
 */
function hasUnclosedCode(line) {
  // Blank out escapes rather than deleting them: dropping the `\n` between
  // two backticks would glue them into one run and hide the open span.
  const runs = line.replace(/\\./g, '  ').match(/`+/g) ?? []
  return runs.filter((run) => run.length <= 2).length % 2 === 1
}

function countRawStringDelimiters(line) {
  return line.split('"""').length - 1
}

function countUnescaped(line, character) {
  let count = 0
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '\\') {
      i++
      continue
    }
    if (line[i] === character) count++
  }
  return count
}
