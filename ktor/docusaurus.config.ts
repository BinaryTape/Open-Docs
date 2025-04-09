import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import themeConfigs from './themeConfig'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OpenAIDoc',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://ktor.openaidoc.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'zh-Hant', 'ko' , 'ja' ],
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
            'https://github.com/BinaryTape/Open-Docs/blob/main/ktor',
        },
        blog: false,
        theme: {
          customCss: '../src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  // 引入自定义脚本
  scripts: [
    {
      src: '../js/theme-detector.js',
      async: true,
    },
  ],

  // 静态资源配置
  staticDirectories: ['static', '../src/js'],

  themeConfig: themeConfigs
};

export default config;
