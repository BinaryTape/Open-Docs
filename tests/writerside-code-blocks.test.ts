import { describe, expect, it } from 'vitest'
import { normalizeWritersideCodeBlocks } from '../docs/.vitepress/plugins/markdown/writerside/normalize-writerside-code-blocks'

describe('normalizeWritersideCodeBlocks', () => {
  it('converts CDATA inside code-block tags into an escaped code attribute', () => {
    const input = `
<code-block lang="xml">
                    <![CDATA[
<aptMode>stubsAndApt</aptMode>
                    ]]>
                </code-block>
`.trim()

    const output = normalizeWritersideCodeBlocks(input)

    expect(output).toContain('<code-block lang="xml" code="')
    expect(output).toContain('&lt;aptMode&gt;stubsAndApt&lt;/aptMode&gt;')
    expect(output).not.toContain('<![CDATA[')
    expect(output).not.toContain('</code-block>')
  })

  it('leaves self-closing code-blocks and src-backed blocks unchanged', () => {
    const selfClosing = '<code-block lang="kotlin" code="fun main() {}"/>'
    const withSrc = '<code-block lang="kotlin" src="Foo.kt">ignored</code-block>'

    expect(normalizeWritersideCodeBlocks(selfClosing)).toBe(selfClosing)
    expect(normalizeWritersideCodeBlocks(withSrc)).toBe(withSrc)
  })
})
