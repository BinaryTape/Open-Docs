import { defineConfig } from 'vitepress'
import { resolve, dirname, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import matter from 'gray-matter'

import {
  registerMarkdownPlugins,
  markdownItMkLiquidCondition,
  shikiRemoveDiffMarker
} from '../../../docs/.vitepress/config/markdown.config'
import liquidIncludePlugin from '../../../docs/.vitepress/plugins/vite/vite-liquid-include'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../../..')
const sourceDocsRoot = resolve(repoRoot, 'docs')
const sidebarRoot = resolve(sourceDocsRoot, '.vitepress/sidebar')
const localePath = resolve(sourceDocsRoot, '.vitepress/locales/zh-Hans.json')
const locale = JSON.parse(readFileSync(localePath, 'utf-8')) as Record<string, string>
const mkDiffGrammarPath = resolve(sourceDocsRoot, '.vitepress/plugins/shiki/shiki-mk-diff.json')
const mkDiffGrammar = JSON.parse(readFileSync(mkDiffGrammarPath, 'utf-8'))

type SidebarNode = {
  text?: string
  link?: string
  href?: string
  include?: string
  items?: SidebarNode[]
  collapsed?: boolean
}

type CommunityDoc = {
  key: string
  label: string
  title: string
  home: string
  sourceType: string
  sidebar: SidebarNode[]
}

const docsConfig = [
  {
    key: 'language',
    label: 'Language',
    title: 'Kotlin Language',
    sourceType: 'kotlin',
    sourceDir: resolve(sourceDocsRoot, 'kotlin'),
    base: '/docs/language/',
    home: '/docs/language/home'
  },
  {
    key: 'multiplatform',
    label: 'Multiplatform',
    title: 'Kotlin Multiplatform',
    sourceType: 'kmp',
    sourceDir: resolve(sourceDocsRoot, 'kmp'),
    base: '/docs/multiplatform/',
    home: '/docs/multiplatform/get-started'
  },
  {
    key: 'koog',
    label: 'Koog',
    title: 'Koog',
    sourceType: 'koog',
    sourceDir: resolve(sourceDocsRoot, 'koog'),
    base: '/docs/koog/',
    home: '/docs/koog/'
  }
] as const

function buildCommunityDocs(): CommunityDoc[] {
  return docsConfig.map((doc) => ({
    key: doc.key,
    label: doc.label,
    title: doc.title,
    sourceType: doc.sourceType,
    home: doc.home,
    sidebar: buildSidebar(doc.sourceType, doc.sourceDir, doc.base)
  }))
}

function buildSidebar(type: string, sourceDir: string, base: string): SidebarNode[] {
  const sidebarPath = resolve(sidebarRoot, `${type}.sidebar.json`)
  const sidebar = JSON.parse(readFileSync(sidebarPath, 'utf-8')) as SidebarNode[]
  return sidebar.map((node) => localizeNode(node, type, sourceDir, base)).filter(Boolean) as SidebarNode[]
}

function localizeNode(node: SidebarNode, type: string, sourceDir: string, base: string): SidebarNode | null {
  const includedItems = node.include ? buildSidebar(node.include, sourceDir, base) : undefined
  const childItems = node.items?.map((child) => localizeNode(child, type, sourceDir, base)).filter(Boolean) as SidebarNode[] | undefined
  const text = localizeText(node, sourceDir)

  if (!text && !node.link && !node.href && !includedItems?.length && !childItems?.length) return null

  const out: SidebarNode = {
    text,
    link: node.link ? normalizeDocLink(base, node.link) : undefined,
    href: node.href,
    collapsed: node.collapsed
  }

  if (includedItems?.length) out.items = includedItems
  else if (childItems?.length) out.items = childItems

  return out
}

function localizeText(node: SidebarNode, sourceDir: string): string {
  if (node.text && locale[node.text]) return locale[node.text]
  if (node.link) return getTitleFromMarkdown(sourceDir, node.link) || node.text || ''
  return node.text || ''
}

function normalizeDocLink(base: string, link: string): string {
  const clean = link.replace(/\.md$/, '').replace(/\/index$/, '/')
  if (!clean || clean === '/') return base
  return posix.join(base, clean)
}

function getTitleFromMarkdown(rootDir: string, filePath: string): string | null {
  const fullPath = resolve(rootDir, `${filePath}.md`)
  if (!existsSync(fullPath)) return null
  const content = readFileSync(fullPath, 'utf-8')
  const parsed = matter(content)
  if (parsed.data?.title) return parsed.data.title

  const topicMatch = content.match(/<topic\s*([^>]*)>/)
  const topicTitleMatch = topicMatch?.[1]?.match(/title="([^"]+)"/)
  if (topicTitleMatch) return topicTitleMatch[1]

  const markdownTitleMatch = content.match(/\[\/\/\]: # \(title:\s*(.*?)\)/i)
  if (markdownTitleMatch) return markdownTitleMatch[1]

  const markdownHeaderMatch = content.match(/^# (.+)$/m)
  return markdownHeaderMatch?.[1] || null
}

function installKotlinCnMarkdownEnvAlias(md: any) {
  const originalParse = md.parse
  const originalRender = md.render
  const originalRenderAsync = md.renderAsync

  md.parse = function (src: string, env: any) {
    return withSourceRelativePath(env, () => originalParse.call(this, src, env))
  }

  md.render = function (src: string, env: any) {
    return withSourceRelativePath(env, () => originalRender.call(this, src, env))
  }

  if (originalRenderAsync) {
    md.renderAsync = function (src: string, env: any) {
      return withSourceRelativePath(env, () => originalRenderAsync.call(this, src, env))
    }
  }
}

function withSourceRelativePath<T>(env: any, callback: () => T): T {
  const originalRelativePath = env?.relativePath
  const aliasedRelativePath = toSourceRelativePath(originalRelativePath)

  if (!aliasedRelativePath) return callback()

  env.relativePath = aliasedRelativePath
  env.kotlinCnPublicRelativePath = originalRelativePath

  try {
    return callback()
  } finally {
    env.relativePath = originalRelativePath
  }
}

function toSourceRelativePath(relativePath?: string): string | null {
  if (!relativePath) return null
  if (relativePath.startsWith('docs/language/')) {
    return relativePath.replace(/^docs\/language\//, 'docs/kotlin/')
  }
  if (relativePath.startsWith('docs/multiplatform/')) {
    return relativePath.replace(/^docs\/multiplatform\//, 'docs/kmp/')
  }
  return null
}

export default defineConfig({
  lang: 'zh-Hans',
  title: 'Kotlin 中文社区',
  description: '社区维护的 Kotlin 中文官方网站',
  cleanUrls: true,
  lastUpdated: false,
  ignoreDeadLinks: true,
  metaChunk: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/kotlin-mark.svg' }],
    ['meta', { name: 'theme-color', content: '#19191c' }]
  ],
  vite: {
    resolve: {
      alias: {
        '@kotlin-cn': resolve(__dirname, 'theme'),
        '@open-docs': resolve(sourceDocsRoot, '.vitepress')
      }
    },
    server: {
      fs: {
        allow: [repoRoot]
      }
    },
    plugins: [liquidIncludePlugin()]
  },
  themeConfig: {
    communityDocs: buildCommunityDocs()
  },
  markdown: {
    attrs: {
      leftDelimiter: '{',
      rightDelimiter: '}',
      allowedAttributes: []
    },
    preConfig: (md) => {
      md.use(markdownItMkLiquidCondition)
    },
    shikiSetup: (shiki) => {
      shiki.loadLanguage(mkDiffGrammar)
    },
    codeTransformers: [
      shikiRemoveDiffMarker()
    ],
    config: (md) => {
      registerMarkdownPlugins(md)
      installKotlinCnMarkdownEnvAlias(md)
    }
  }
})
