import zh_Hans from './locales/zh-Hans.json'
import zh_Hant from './locales/zh-Hant.json'
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
        messages: zh_Hans
    },
    "zh-Hant": {
        lang: 'zh-Hant',
        label: '繁體中文',
        title: 'Open AIDoc',
        description: 'Open AIDoc',
        messages: zh_Hant
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