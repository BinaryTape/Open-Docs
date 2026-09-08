import { describe, expect, it } from 'vitest'
import { restoreTitleComment } from '../tools/pipeline/utils/title-comment.mjs'

const source = ['[//]: # (title: Strings)', '[//]: # (description: About strings.)', '', 'Body.'].join('\n')

describe('restoreTitleComment', () => {
  it('converts frontmatter back into the comment header the renderer reads', () => {
    const translated = [
      '---',
      'title: 字符串',
      'description: 关于字符串。',
      '---',
      '',
      '正文。',
    ].join('\n')

    const { content, changed } = restoreTitleComment(translated, source)
    expect(changed).toBe(true)
    expect(content).toBe(
      ['[//]: # (title: 字符串)', '[//]: # (description: 关于字符串。)', '', '正文。'].join('\n')
    )
  })

  it('drops frontmatter the translation merely stacked on top of the comments', () => {
    const translated = [
      '---',
      'title: "字符串"',
      '---',
      '',
      '[//]: # (title: 字符串)',
      '',
      '正文。',
    ].join('\n')

    expect(restoreTitleComment(translated, source).content).toBe(
      ['[//]: # (title: 字符串)', '', '正文。'].join('\n')
    )
  })

  it('leaves a source that never used a title comment alone', () => {
    const translated = '---\nlayout: home\n---\n\n正文。'
    const { content, changed } = restoreTitleComment(translated, '# Overview\n\nBody.')
    expect(changed).toBe(false)
    expect(content).toBe(translated)
  })

  it('leaves frontmatter that carries no title alone', () => {
    const translated = '---\naside: false\n---\n\n正文。'
    expect(restoreTitleComment(translated, source).changed).toBe(false)
  })
})
