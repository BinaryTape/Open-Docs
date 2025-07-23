// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import 'aos/dist/aos.css'
import './style.css'
import './home.style.css'
import HomeLayout from './layout/Home.vue' // 调整路径，如果它在子目录，例如 './layouts/MyHomeLayout.vue'
import { SiteLocaleConfig } from '../locales.config'
import { createI18n, setLocale } from '../utils/i18n-utils'
import Deflist from '../component/Deflist.vue'
import Def from '../component/Def.vue'
import List from "../component/List.vue";
import CodeBlock from "../component/CodeBlock.vue";
import TLDR from "../component/TLDR.vue";
import Tabs from "../component/Tabs.vue";
import Tab from "../component/Tab.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('HomeLayout', HomeLayout)

    app.component('deflist', Deflist)
    app.component('def', Def)
    app.component('list', List)
    app.component('code-block', CodeBlock)
    app.component('tldr', TLDR)
    app.component('tabs', Tabs)
    app.component('tab', Tab)

    // Use our custom i18n implementation
    app.use(createI18n())

    router.onAfterRouteChange = () => {
      if (typeof window !== 'undefined') {
        import('aos').then((AOS) => {
          AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true
          });
        })
      }

      if (typeof location !== 'undefined') {
        const path = location.pathname
        const locale = Object.keys(SiteLocaleConfig).find(locale => path.startsWith(`/${locale}/`)) || 'zh-Hans';
        setLocale(locale);
      }
    }
  }
} satisfies Theme
