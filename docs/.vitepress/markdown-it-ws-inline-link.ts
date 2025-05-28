import type MarkdownIt from 'markdown-it'
import { SITE_LOCALES } from './locales.config'
import { DOCS_TYPES } from './docs.config'
import path from 'path'

export interface RewriteLinkOptions {
  rewriteHref: (env, href: string) => string
}

// Options for rewriting links in markdown
// rewriteHref: Function to transform href URLs by adding locale and doc type paths
const rewiteOptions: RewriteLinkOptions = {
  rewriteHref: (env, href) => {
    // 如果链接以 https:// 开头，则不进行处理
    if (href.startsWith('https://') || href.startsWith('http://')) {
      return href
    }
    
    // 处理特殊链接，如 mailto: 链接
    if (href.startsWith('mailto:')) {
      return href
    }
    
    const parts = env.relativePath.split('/')
    const docType = parts.find(p => DOCS_TYPES.includes(p))
    
    // 检查是否为 Kotlin 文档以及链接是否以 .png 或 .svg 结尾
    if (docType === 'kotlin' && (href.endsWith('.png') || href.endsWith('.svg') || href.endsWith('.jpeg') || href.endsWith('.jpg') || href.endsWith('.gif'))) {
      // 提取文件名

      const fileName = path.basename(href)
      return `/kotlin/${fileName}`
    }

    if (docType === 'ktor' && (href.endsWith('.png') || href.endsWith('.svg') || href.endsWith('.jpeg') || href.endsWith('.jpg') || href.endsWith('.gif'))) {
      const fileName = path.basename(href)
      return `/ktor/${fileName}`
    }

    if (docType === 'sqldelight' && (href.endsWith('.png') || href.endsWith('.svg') || href.endsWith('.gif'))) {
      const fileName = path.basename(href)
      return `/sqldelight/${fileName}`
    }

    // 处理相对路径链接
    if (docType === 'koin' && (href.startsWith('./') || href.startsWith('../'))) {
      // 获取当前文档的目录路径
      const currentDir = env.relativePath.split('/')
      currentDir.pop() // 移除文件名
      
      let pathSegments = []
      
      if (href.startsWith('./')) {
        // 同级目录下的文件
        pathSegments = [...currentDir]
        href = href.substring(2) // 移除 ./ 前缀
      } else if (href.startsWith('../')) {
        // 上一级目录的文件
        currentDir.pop() // 上移一级目录
        pathSegments = [...currentDir]
        href = href.substring(3) // 移除 ../ 前缀
      }
      
      // 构建完整路径
      return `/${pathSegments.join('/')}/${href}`
    }

    if (docType === 'koin' && href.startsWith('/docs')) {
      href = href.replace('/docs', '')
    }

    if ((docType === 'kotlin' || docType === 'ktor') && href.includes('.md')) {
      href = `/${href}`
    }

    if ((docType === 'kotlin' || docType === 'sqldelight' || docType === 'ktor') && href.startsWith('#')) {
      return href
    }

    if (docType === 'sqldelight') {

      if (!href.includes('/') && !href.startsWith('#') && !href.includes('.')) {
        // 这里假设这些引用是指向同目录下的md文件
        const currentDir = env.relativePath.split('/');
        currentDir.pop(); // 移除文件名

        // 构建相对于当前文件的路径
        return `/${currentDir.join('/')}/${href}.md`;
      }

      if (href.startsWith('../../')) {
        return 'https://sqldelight.github.io/sqldelight/latest/' + href.substring(6)
      } else if (href.startsWith('../2.x/')) {
        return 'https://sqldelight.github.io/sqldelight/latest/' + href.substring(3)
      } else if (href.startsWith('../')) {
        href = `${href.substring(2)}.md`
      } else {
        const currentDir = env.relativePath.split('/');
        currentDir.pop(); // 移除文件名

        console.log(currentDir)

        // 构建相对于当前文件的路径
        return `/${currentDir.join('/')}/${href}.md`;
      }
    }

    // 原有的链接处理逻辑（用于非相对路径的链接）
    const locale = parts.find(p => SITE_LOCALES.includes(p))
    const config = { locale, docType }
    const localePath = locale === undefined ? '' : `/${config.locale}`
    const docsPath = `/${config.docType}`
    return `${localePath}${docsPath}${href}`
  },
}

export function markdownItRewriteLinks(md: MarkdownIt) {

  md.core.ruler.before('inline', 'rewrite-inline-links', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      // 查找HTML标签开始
      if (token.type === 'html_block') {
        // 使用正则表达式查找并替换img标签中的src属性
        token.content = token.content.replace(
          /<img\s+([^>]*?)src\s*=\s*["']([^"']+)["']([^>]*?)>/gi,
          (match, beforeSrc, srcValue, afterSrc) => {
            // 不处理已经以/或http开头的路径
            if (srcValue.startsWith('/') || srcValue.startsWith('http')) {
              return match
            }

            // 使用与其他链接相同的逻辑处理src路径
            const newSrc = rewiteOptions.rewriteHref(state.env, srcValue)
            return `<img ${beforeSrc}src="${newSrc}"${afterSrc}>`
          }
        )
      }

      // 处理行内HTML标签
      if (token.type === 'inline' && token.content) {
        token.content = token.content.replace(
          /<img\s+([^>]*?)src\s*=\s*["']([^"']+)["']([^>]*?)>/gi,
          (match, beforeSrc, srcValue, afterSrc) => {
            // 不处理已经以/或http开头的路径
            if (srcValue.startsWith('/') || srcValue.startsWith('http')) {
              return match
            }

            // 使用与其他链接相同的逻辑处理src路径
            const newSrc = rewiteOptions.rewriteHref(state.env, srcValue)
            return `<img ${beforeSrc}src="${newSrc}"${afterSrc}>`
          }
        )
      }
    }
  })

  // 处理行内链接和图片标签
  md.core.ruler.after('inline', 'rewrite-inline-links', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (token.type === 'inline' && token.children) {
        for (let j = 0; j < token.children.length; j++) {
          const child = token.children[j]

          if (child.type === 'link_open' && child.attrs) {
            for (const attr of child.attrs) {
              if (attr[0] === 'href') {
                // 处理所有非 https:// 开头的链接
                attr[1] = rewiteOptions.rewriteHref(state.env, attr[1])
              }
            }
          }
          
          // 同样处理图片标签
          if (child.type === 'image' && child.attrs) {
            for (const attr of child.attrs) {
              if (attr[0] === 'src') {
                attr[1] = rewiteOptions.rewriteHref(state.env, attr[1])
              }
            }
          }
        }
      }
    }
  });
}