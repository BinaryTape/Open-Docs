import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import KotlinLayout from './KotlinLayout.vue'
import '../../../../docs/.vitepress/theme/style.css'
import './styles.css'

import Deflist from '../../../../docs/.vitepress/component/Deflist.vue'
import Def from '../../../../docs/.vitepress/component/Def.vue'
import List from '../../../../docs/.vitepress/component/List.vue'
import CodeBlock from '../../../../docs/.vitepress/component/CodeBlock.vue'
import TLDR from '../../../../docs/.vitepress/component/TLDR.vue'
import Tabs from '../../../../docs/.vitepress/component/Tabs.vue'
import Tab from '../../../../docs/.vitepress/component/Tab.vue'
import Topic from '../../../../docs/.vitepress/component/Topic.vue'
import TopicTitle from '../../../../docs/.vitepress/component/TopicTitle.vue'
import Page from '../../../../docs/.vitepress/component/Page.vue'
import IgnoreComponent from '../../../../docs/.vitepress/component/IgnoreComponent.vue'
import EmptyComponent from '../../../../docs/.vitepress/component/EmptyComponent.vue'
import Description from '../../../../docs/.vitepress/component/Description.vue'
import TopicCardSection from '../../../../docs/.vitepress/component/TopicCardSection.vue'
import Card from '../../../../docs/.vitepress/component/Card.vue'
import TopicLinkSection from '../../../../docs/.vitepress/component/TopicLinkSection.vue'
import LinkGroup from '../../../../docs/.vitepress/component/LinkGroup.vue'
import Link from '../../../../docs/.vitepress/component/Link.vue'
import Chapter from '../../../../docs/.vitepress/component/Chapter.vue'
import Procedure from '../../../../docs/.vitepress/component/Procedure.vue'
import Step from '../../../../docs/.vitepress/component/Step.vue'
import Highlight from '../../../../docs/.vitepress/component/Highlight.vue'
import Note from '../../../../docs/.vitepress/component/Note.vue'
import Tip from '../../../../docs/.vitepress/component/Tip.vue'
import YouTubeVideo from '../../../../docs/.vitepress/component/YouTubeVideo.vue'

export default {
  extends: DefaultTheme,
  Layout: KotlinLayout,
  enhanceApp({ app, router }) {
    app.component('deflist', Deflist)
    app.component('def', Def)
    app.component('list', List)
    app.component('tldr', TLDR)
    app.component('tabs', Tabs)
    app.component('tab', Tab)
    app.component('Tabs', Tabs)
    app.component('TabItem', Tab)
    app.component('code-block', CodeBlock)
    app.component('topic', Topic)
    app.component('TopicTitle', TopicTitle)
    app.component('section-starting-page', Page)
    app.component('show-structure', IgnoreComponent)
    app.component('link-summary', IgnoreComponent)
    app.component('card-summary', IgnoreComponent)
    app.component('web-summary', IgnoreComponent)
    app.component('snippet', EmptyComponent)
    app.component('description', Description)
    app.component('spotlight', TopicCardSection)
    app.component('primary', TopicCardSection)
    app.component('secondary', TopicCardSection)
    app.component('misc', EmptyComponent)
    app.component('cards', TopicCardSection)
    app.component('card', Card)
    app.component('links', TopicLinkSection)
    app.component('group', LinkGroup)
    app.component('Links', Link)
    app.component('chapter', Chapter)
    app.component('procedure', Procedure)
    app.component('step', Step)
    app.component('control', Highlight)
    app.component('Path', Highlight)
    app.component('ui-path', Highlight)
    app.component('emphasis', Highlight)
    app.component('note', Note)
    app.component('tip', Tip)
    app.component('YouTubeVideo', YouTubeVideo)

    router.onAfterRouteChange = () => {
      normalizeRenderedLinks()
    }

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(normalizeRenderedLinks)
      document.addEventListener('click', interceptLegacyDocLinks, true)
    }
  }
} satisfies Theme

function interceptLegacyDocLinks(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  const link = target?.closest?.('a') as HTMLAnchorElement | null
  if (!link) return

  const nextHref = mapLegacyHref(link.getAttribute('href') || '')
  if (!nextHref || nextHref === link.getAttribute('href')) return

  event.preventDefault()
  event.stopPropagation()
  window.location.href = nextHref
}

function normalizeRenderedLinks() {
  if (typeof document === 'undefined') return

  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    const nextHref = mapLegacyHref(link.getAttribute('href') || '')
    if (nextHref) link.setAttribute('href', nextHref)
  })
}

function mapLegacyHref(href: string): string | null {
  if (!href || href.startsWith('#') || href.startsWith('mailto:')) return null

  const url = new URL(href, window.location.origin)
  const isLocal = url.origin === window.location.origin
  const isKotlinLang = url.hostname === 'kotlinlang.org'

  if (!isLocal && !isKotlinLang) return null

  let pathname = url.pathname.replace(/\.html$/, '')

  if (isKotlinLang && pathname.startsWith('/docs/multiplatform/')) {
    pathname = pathname.replace(/^\/docs\/multiplatform\//, '/docs/multiplatform/')
  } else if (isKotlinLang && pathname.startsWith('/docs/')) {
    pathname = pathname.replace(/^\/docs\//, '/docs/language/')
  }

  pathname = pathname
    .replace(/^\/docs\/kotlin\//, '/docs/language/')
    .replace(/^\/kotlin\//, '/docs/language/')
    .replace(/^\/docs\/kmp\//, '/docs/multiplatform/')
    .replace(/^\/kmp\//, '/docs/multiplatform/')
    .replace(/^\/koog\//, '/docs/koog/')

  const currentSection = getCurrentSectionBase()
  if (
    currentSection &&
    isLocal &&
    /^\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(pathname) &&
    !pathname.startsWith('/assets')
  ) {
    pathname = `${currentSection}${pathname.slice(1)}`
  }

  const next = `${pathname}${url.search}${url.hash}`
  return next === href ? null : next
}

function getCurrentSectionBase() {
  const pathname = window.location.pathname
  if (pathname.startsWith('/docs/language/')) return '/docs/language/'
  if (pathname.startsWith('/docs/multiplatform/')) return '/docs/multiplatform/'
  if (pathname.startsWith('/docs/koog/')) return '/docs/koog/'
  return ''
}
