// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { createI18n } from 'vue-i18n'
import './style.css'
import {useWsTabs} from "./ws-tabs";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    useWsTabs()
    app.use(createI18n({
      legacy: false,
      locale: 'zh-hans',
      messages: {
        'zh-hant': {
          // Add your English translations here
        },
        zh: {
          // Add your Chinese translations here
        }
      }
    }))
  }
} satisfies Theme
