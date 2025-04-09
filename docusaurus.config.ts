import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import themeConfigs from './themeConfig';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OpenAIDoc',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://openaidoc.org',
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
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: themeConfigs,
  
  // 添加 AOS 动画库脚本
  scripts: [
    {
      src: 'https://unpkg.com/aos@next/dist/aos.js',
      defer: true,
      onload: `
        // 初始化 AOS
        document.addEventListener('DOMContentLoaded', function() {
          AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true
          });
        });
      `
    }
  ],
  
  // 添加 AOS 动画库样式
  stylesheets: [
    {
      href: 'https://unpkg.com/aos@next/dist/aos.css',
    }
  ]
};

export default config;
