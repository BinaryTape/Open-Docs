import {themes as prismThemes} from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';

const themeConfig = {
    navbar: {
      title: 'OpenAIDoc',
      logo: {
        alt: 'OpenAIDoc Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'https://koin.openaidoc.org',
          label: 'Koin',
          position: 'left',
          className: 'header-koin-link',
          activeBasePath: 'https://koin.openaidoc.org',
        },
        {
          to: 'https://kotlin.openaidoc.org',
          label: 'Kotlin',
          position: 'left',
          className: 'header-kotlin-link',
          activeBasePath: 'https://kotlin.openaidoc.org',
        },
        {
          to: 'https://ktor.openaidoc.org',
          label: 'Ktor',
          position: 'left',
          className: 'header-ktor-link',
          activeBasePath: 'https://ktor.openaidoc.org',
        },
        {
          to: 'https://sqldelight.openaidoc.org',
          label: 'SQLDelight',
          position: 'left',
          className: 'header-sqldelight-link',
          activeBasePath: 'https://sqldelight.openaidoc.org',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/BinaryTape/Open-Docs',
          position: 'right',
          className: 'header-github-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '官方文档',
          items: [
            {
              label: 'Koin',
              to: 'https://insert-koin.io',
            },
            {
              label: 'Kotlin',
              to: 'https://kotlinlang.org/docs/home.html',
            },
            {
              label: 'Ktor',
              to: 'https://ktor.io/docs/welcome.html',
            },
            {
              label: 'SQLDelight',
              to: 'https://sqldelight.github.io/sqldelight',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/BinaryTape/Open-Docs',
            },
            {
              label: '问题反馈',
              href: 'https://github.com/BinaryTape/Open-Docs/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenAIDoc. 基于 Docusaurus 构建。`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
} satisfies Preset.ThemeConfig;

export default themeConfig;
