import zh_hans from './locales/zh-hans.json'
import zh_hant from './locales/zh-hant.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'

export type SideLocaleConfig = {
    lang: string
    label: string
    title: string
    description: string
    messages: {
        [key: string]: string
    }
}

export const SiteLocaleConfig: { [key: string]: SideLocaleConfig } = {
    'zh-Hans': {
        lang: 'zh-Hans',
        label: '简体中文',
        title: 'Open AIDoc',
        description: 'Open AIDoc',
        messages: zh_hans
    },
    "zh-Hant": {
        lang: 'zh-Hant',
        label: '繁體中文',
        title: 'Open AIDoc',
        description: 'Open AIDoc',
        messages: zh_hant
    },
    ja: {
        lang: 'ja',
        label: '日本語',
        title: 'Open AIDoc',
        description: 'Open AIDoc',
        messages: ja
    },
    ko: {
        lang: 'ko',
        label: '한국어',
        title: 'Open AIDoc',
        description: 'Open AIDoc',
        messages: ko
    }
}

export const SITE_LOCALES = Object.keys(SiteLocaleConfig)