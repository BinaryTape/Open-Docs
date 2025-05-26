// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { createI18n } from 'vue-i18n'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './style.css'
import './home.style.css'
import { useWsTabs } from "./ws-tabs";
import HomeLayout from './layout/Home.vue' // 调整路径，如果它在子目录，例如 './layouts/MyHomeLayout.vue'
import { SiteLocaleConfig } from '../locales.config'

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

    app.use(createI18n({
      legacy: false,
      locale: 'zh-hans',
      messages: {
        'zh-hans': SiteLocaleConfig['zh-hans'].messages,
        'zh-hant': SiteLocaleConfig['zh-hant'].messages,
        'ja': SiteLocaleConfig['ja'].messages,
        'ko': SiteLocaleConfig['ko'].messages
      }
    }))
    router.onAfterRouteChange = () => {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true
      });
      const path = location.pathname
      const locale = Object.keys(SiteLocaleConfig).find(locale => path.startsWith(`/${locale}/`)) || 'zh-hans';
      app.config.globalProperties.$i18n.locale = locale;
    }
    useWsTabs()
  }
} satisfies Theme
