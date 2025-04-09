import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  sidebar: [
    {
      type: 'category',
      label: '配置',
      items: [
        'setup/koin',
        'support/embedded',
        'setup/annotations',
        'setup/why',
        'support/releases',
        'support/api-stability',
        'support/index'
      ]
    },
    {
      type: 'category',
      label: '教程',
      items: [
        'quickstart/kotlin',
        'quickstart/android',
        'quickstart/android-viewmodel',
        'quickstart/android-compose',
        'quickstart/android-annotations',
        'quickstart/kmp',
        'quickstart/cmp',
        'quickstart/ktor',
        'quickstart/ktor-annotations',
      ]
    },
    {
      type: 'category',
      label: '核心 & 测试',
      items: [
        'reference/introduction',
        'reference/koin-core/dsl',
        'reference/koin-core/dsl-update',
        'reference/koin-core/definitions',
        'reference/koin-core/modules',
        'reference/koin-core/extension-manager',
        'reference/koin-core/start-koin',
        'reference/koin-core/koin-component',
        'reference/koin-core/injection-parameters',
        'reference/koin-core/context-isolation',
        'reference/koin-core/scopes',
        'reference/koin-test/testing',
        'reference/koin-test/verify',
        'reference/koin-test/checkmodules'
      ]
    },
    {
      type: 'category',
      label: 'Android',
      items: [
        'reference/koin-android/start',
        'reference/koin-android/get-instances',
        'reference/koin-android/dsl-update',
        'reference/koin-android/modules-android',
        'reference/koin-android/viewmodel',
        'reference/koin-android/scope',
        'reference/koin-android/fragment-factory',
        'reference/koin-android/workmanager',
        'reference/koin-android/instrumented-testing'
      ]
    },
    {
      type: 'category',
      label: 'Compose',
      items: [
        'reference/koin-compose/compose',
        'reference/koin-compose/isolated-context'
      ]
    },
    {
      type: 'category',
      label: '注解',
      items: [
        'reference/koin-annotations/start',
        'reference/koin-annotations/definitions',
        'reference/koin-annotations/modules',
        'reference/koin-annotations/scope',
        'reference/koin-annotations/kmp',
      ]
    },
    {
      type: 'category',
      label: '多平台',
      items: [
        'reference/koin-mp/kmp'
      ]
    },
    {
      type: 'category',
      label: 'Ktor',
      items: [
        'reference/koin-ktor/ktor',
        'reference/koin-ktor/ktor-isolated'
      ]
    }
  ],
};

export default sidebars;
