import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../../..')
const siteDocsRoot = resolve(repoRoot, 'sites/kotlin-cn/docs')

const contentMaps = [
  ['docs/kotlin', 'language'],
  ['docs/kmp', 'multiplatform'],
  ['docs/koog', 'koog']
]

mkdirSync(siteDocsRoot, { recursive: true })

for (const [source, target] of contentMaps) {
  const sourceDir = resolve(repoRoot, source)
  const targetDir = resolve(siteDocsRoot, target)

  rmSync(targetDir, { recursive: true, force: true })
  cpSync(sourceDir, targetDir, {
    recursive: true,
    dereference: false,
    force: true
  })
}
