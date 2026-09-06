import { describe, expect, it } from 'vitest'
import { fillPromptTemplate } from '../tools/pipeline/translate.mjs'

describe('fillPromptTemplate', () => {
  it('preserves `$` in source markdown instead of applying replace substitutions', () => {
    const template = [
      'PREFIX',
      '{RELEVANT_TERMS}',
      '{TRANSLATION_REFERENCES}',
      '{SOURCE_TEXT}',
      'SUFFIX',
    ].join('\n')
    const sourceText = [
      '**Multidollar interpolation: improved handling of `$` in string literals**',
      '',
      'Use `$$` to escape a dollar sign.',
    ].join('\n')

    const filled = fillPromptTemplate(template, 'zh-Hans', sourceText, '$term', "ref with $' value")

    expect(filled).toContain(sourceText)
    expect(filled.startsWith('PREFIX\n$term\n')).toBe(true)
    expect(filled.endsWith('\nSUFFIX')).toBe(true)
    expect(filled).not.toContain('{SOURCE_TEXT}')
  })
})
