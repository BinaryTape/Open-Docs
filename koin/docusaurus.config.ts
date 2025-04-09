import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import themeConfigs from './themeConfig'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OpenAIDoc',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://koin.openaidoc.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'zh-Hant', 'ko' , 'ja' ],
  },

  markdown: {
    format: 'md',
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editLocalizedFiles: true,
          editUrl:
            'https://github.com/BinaryTape/Open-Docs/blob/main/koin/',
        },
        blog: false,
        theme: {
          customCss: '../src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: themeConfigs
};

export default config;
