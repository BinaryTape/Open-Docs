import { describe, expect, it } from 'vitest'
import { restoreEscapedNewlines } from '../tools/pipeline/utils/escaped-newlines.mjs'

describe('restoreEscapedNewlines', () => {
  it('rejoins a string literal split across two lines', () => {
    const broken = ['```kotlin', 'val message = "Hello,', 'world!"', '```'].join('\n')
    const { content, repaired } = restoreEscapedNewlines(broken)

    expect(repaired).toBe(1)
    expect(content).toContain('val message = "Hello,\\nworld!"')
  })

  it('rejoins a literal split across several lines', () => {
    const broken = ['```kotlin', 'val numbers = "one', 'two', 'three"', '```'].join('\n')
    const { content, repaired } = restoreEscapedNewlines(broken)

    expect(repaired).toBe(2)
    expect(content).toContain('val numbers = "one\\ntwo\\nthree"')
  })

  it('rejoins an inline code span broken mid-table', () => {
    const broken = ['| `', '`           | New Line (LF) |'].join('\n')
    expect(restoreEscapedNewlines(broken).content).toBe('| `\\n`           | New Line (LF) |')
  })

  it('leaves a Kotlin raw string spanning lines alone', () => {
    const raw = ['```kotlin', 'val text = """', 'Hello,', 'Kotlin', '"""', '```'].join('\n')
    const { content, repaired } = restoreEscapedNewlines(raw)

    expect(repaired).toBe(0)
    expect(content).toBe(raw)
  })

  it('leaves an escaped quote from confusing the count', () => {
    const fine = ['```kotlin', 'val quote = "Kotlin says, \\"Hi\\"."', '```'].join('\n')
    expect(restoreEscapedNewlines(fine).repaired).toBe(0)
  })

  it('does not mistake an indented fence for an open code span', () => {
    const listed = ['    ```java', '    ```', '', '    ```kotlin', '    val a = 1', '    ```'].join('\n')
    expect(restoreEscapedNewlines(listed).repaired).toBe(0)
  })

  it('leaves ordinary prose and balanced code spans alone', () => {
    const fine = ['Use `trimIndent()` here.', '', '```kotlin', 'val a = "x"', '```'].join('\n')
    expect(restoreEscapedNewlines(fine)).toEqual({ content: fine, repaired: 0 })
  })
})
