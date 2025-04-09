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
  kotlinSidebar: [
    {
      type: 'doc',
      id: 'getting-started',
      label: '首页'
    },
    {
      type: 'category',
      label: 'Kotlin 教程',
      link: {
        type: 'doc',
        id: 'kotlin-tour-welcome',
      },
      items: [
        'kotlin-tour-hello-world',
        'kotlin-tour-basic-types',
        'kotlin-tour-collections',
        'kotlin-tour-control-flow',
        'kotlin-tour-functions',
        'kotlin-tour-classes',
        'kotlin-tour-null-safety',
      ],
    },
    {
      type: 'category',
      label: 'Kotlin 概述',
      items: [
        'server-overview',
        'android-overview',
        'wasm-overview',
        'native-overview',
        'js-overview',
        'data-analysis-overview',
        'competitive-programming',
      ],
    },
    {
      type: 'category',
      label: 'Kotlin 新特性',
      items: [
        {
          type: 'doc',
          id: 'whatsnew2120',
          label: 'Kotlin 2.1.20',
        },
        {
          type: 'doc',
          id: 'whatsnew21',
          label: 'Kotlin 2.1.0',
        },
        {
          type: 'category',
          label: '早期版本',
          items: [
            'whatsnew2020',
            'whatsnew20',
            'whatsnew1920',
            'whatsnew19',
            'whatsnew1820',
            'whatsnew18',
            'whatsnew1720',
            'whatsnew17',
            'whatsnew1620',
            'whatsnew16',
            'whatsnew1530',
            'whatsnew1520',
            'whatsnew15',
            'whatsnew1430',
            'whatsnew1420',
            'whatsnew14',
            'whatsnew13',
            'whatsnew12',
            'whatsnew11',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Kotlin 演进与路线图',
      items: [
        'roadmap',
        'kotlin-language-features-and-proposals',
        'kotlin-evolution-principles',
        'components-stability',
        'releases',
      ],
    },
    {
      type: 'category',
      label: '基础知识',
      items: [
        'basic-syntax',
        'idioms',
        {
          type: 'link',
          label: '通过示例学习 Kotlin',
          href: 'https://play.kotlinlang.org/byExample/overview',
        },
        'coding-conventions',
      ],
    },
    {
      type: 'category',
      label: '核心概念',
      items: [
        {
          type: 'category',
          label: '类型',
          items: [
            {
              type: 'category',
              label: '基本类型',
              items: [
                'basic-types',
                'numbers',
                'unsigned-integer-types',
                'booleans',
                'characters',
                'strings',
                'arrays',
              ],
            },
            'typecasts',
          ],
        },
        {
          type: 'category',
          label: '控制流',
          items: [
            'control-flow',
            'returns',
            'exceptions',
          ],
        },
        'packages',
        {
          type: 'category',
          label: '类和对象',
          items: [
            'classes',
            'inheritance',
            'properties',
            'interfaces',
            'fun-interfaces',
            'visibility-modifiers',
            'extensions',
            'data-classes',
            'sealed-classes',
            'generics',
            'nested-classes',
            'enum-classes',
            'inline-classes',
            'object-declarations',
            'delegation',
            'delegated-properties',
            'type-aliases',
          ],
        },
        {
          type: 'category',
          label: '函数',
          items: [
            'functions',
            'lambdas',
            'inline-functions',
            'operator-overloading',
            {
              type: 'category',
              label: '构建器',
              items: [
                'type-safe-builders',
                'using-builders-with-builder-inference',
              ],
            },
          ],
        },
        'null-safety',
        'equality',
        'this-expressions',
        'async-programming',
        'coroutines-overview',
        'annotations',
        'destructuring-declarations',
        'reflection',
      ],
    },
    {
      type: 'category',
      label: '多平台开发',
      items: [
        'multiplatform-intro',
        'multiplatform-discover-project',
        'multiplatform-advanced-project-structure',
        {
          type: 'category',
          label: '共享代码',
          items: [
            'multiplatform-share-on-platforms',
            'multiplatform-expect-actual',
            'multiplatform-hierarchy',
          ],
        },
        {
          type: 'category',
          label: '添加依赖',
          items: [
            'multiplatform-add-dependencies',
            'multiplatform-android-dependencies',
            'multiplatform-ios-dependencies',
          ],
        },
        {
          type: 'category',
          label: '设置 iOS 集成',
          items: [
            'multiplatform-ios-integration-overview',
            'multiplatform-direct-integration',
            'native-spm',
            {
              type: 'category',
              label: 'CocoaPods 集成',
              items: [
                'native-cocoapods',
                'native-cocoapods-libraries',
                'native-cocoapods-xcode',
                'native-cocoapods-dsl-reference',
              ],
            },
            'multiplatform-spm-local-integration',
          ],
        },
        {
          type: 'category',
          label: '编译成品',
          items: [
            'multiplatform-configure-compilations',
            'multiplatform-build-native-binaries',
          ],
        },
        'multiplatform-publish-lib',
        {
          type: 'category',
          label: '参考',
          items: [
            'multiplatform-dsl-reference',
            'multiplatform-android-layout',
            'multiplatform-compatibility-guide',
            'multiplatform-plugin-releases',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '数据分析',
      items: [
        {
          type: 'category',
          label: 'Kotlin Notebook 入门',
          items: [
            'get-started-with-kotlin-notebooks',
            'kotlin-notebook-set-up-env',
            'kotlin-notebook-create',
            'kotlin-notebook-add-dependencies',
          ],
        },
        'kotlin-notebook-share',
        'data-analysis-notebooks-output-formats',
        {
          type: 'category',
          label: '使用数据源',
          items: [
            'data-analysis-work-with-data-sources',
            'data-analysis-work-with-api',
            'data-analysis-connect-to-db',
          ],
        },
        'data-analysis-visualization',
        'data-analysis-libraries',
      ],
    },
    {
      type: 'category',
      label: '平台',
      items: [
        {
          type: 'category',
          label: 'JVM',
          items: [
            'jvm-get-started',
            'comparison-to-java',
            'java-interop',
            'java-to-kotlin-interop',
            {
              type: 'category',
              label: 'Spring',
              items: [
                {
                  type: 'category',
                  label: '使用 Spring Boot 创建 RESTful web 服务和数据库',
                  items: [
                    'jvm-get-started-spring-boot',
                    'jvm-create-project-with-spring-boot',
                    'jvm-spring-boot-add-data-class',
                    'jvm-spring-boot-add-db-support',
                    'jvm-spring-boot-using-crudrepository',
                  ],
                },
                {
                  type: 'link',
                  label: 'Spring Framework 的 Kotlin 文档',
                  href: 'https://docs.spring.io/spring-framework/docs/current/reference/html/languages.html#languages',
                },
                {
                  type: 'link',
                  label: '使用 Spring Boot 和 Kotlin 构建 Web 应用 - 教程',
                  href: 'https://spring.io/guides/tutorials/spring-boot-kotlin/',
                },
                {
                  type: 'link',
                  label: '使用 Kotlin 协程和 RSocket 创建聊天应用 - 教程',
                  href: 'https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/',
                },
              ],
            },
            'jvm-test-using-junit',
            'mixing-java-kotlin-intellij',
            'jvm-records',
            {
              type: 'category',
              label: 'Java 到 Kotlin 迁移指南',
              items: [
                'java-to-kotlin-idioms-strings',
                'java-to-kotlin-collections-guide',
                'java-to-kotlin-nullability-guide',
                'standard-input',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Native',
          items: [
            'native-get-started',
            'native-definition-file',
            {
              type: 'category',
              label: 'C 互操作',
              items: [
                'native-c-interop',
                'mapping-primitive-data-types-from-c',
                'mapping-struct-union-types-from-c',
                'mapping-function-pointers-from-c',
                'mapping-strings-from-c',
                'native-dynamic-libraries',
                'native-app-with-c-and-libcurl',
              ],
            },
            {
              type: 'category',
              label: 'Objective-C 互操作',
              items: [
                'native-objc-interop',
                'apple-framework',
              ],
            },
            'native-libraries',
            'native-platform-libs',
            {
              type: 'category',
              label: '内存管理器',
              items: [
                'native-memory-manager',
                'native-arc-integration',
                'native-migration-guide',
              ],
            },
            'native-debugging',
            'native-ios-symbolication',
            {
              type: 'category',
              label: '参考与技巧',
              items: [
                'native-target-support',
                'apple-privacy-manifest',
                'native-improving-compilation-time',
                'native-binary-licenses',
                'native-faq',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'WebAssembly (Wasm)',
          items: [
            'wasm-get-started',
            'wasm-wasi',
            'wasm-debugging',
            'wasm-js-interop',
            'wasm-troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'JavaScript',
          items: [
            'js-project-setup',
            'running-kotlin-js',
            'dev-server-continuous-compilation',
            'js-debugging',
            'js-running-tests',
            'javascript-dce',
            'js-ir-compiler',
            'js-ir-migration',
            {
              type: 'category',
              label: '适用于 JS 平台的 Kotlin',
              items: [
                'browser-api-dom',
                'js-interop',
                'dynamic-type',
                'using-packages-from-npm',
                'js-to-kotlin-interop',
                'js-modules',
                'js-reflection',
                'typesafe-html-dsl',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: '脚本',
          items: [
            'custom-script-deps-tutorial',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '标准库',
      items: [
        {
          type: 'category',
          label: '集合',
          items: [
            'collections-overview',
            'constructing-collections',
            'iterators',
            'ranges',
            'sequences',
            'collection-operations',
            'collection-transformations',
            'collection-filtering',
            'collection-plus-minus',
            'collection-grouping',
            'collection-parts',
            'collection-elements',
            'collection-ordering',
            'collection-aggregate',
            'collection-write',
            'list-operations',
            'set-operations',
            'map-operations',
          ],
        },
        'read-standard-input',
        'opt-in-requirements',
        'scope-functions',
        'time-measurement',
      ],
    },
    {
      type: 'category',
      label: '官方库',
      items: [
        {
          type: 'category',
          label: '协程 (kotlinx.coroutines)',
          items: [
            // 这里应该包含协程库的详细文档，但在XML中是通过include引入的
            // 简化起见，只保留存在的文档
            'coroutines-overview',
          ],
        },
        'serialization',
        'metadata-jvm',
        // {
        //   type: 'category',
        //   label: 'Lincheck (kotlinx.lincheck)',
        //   items: [
        //     // XML文档中通过include引入，但没有实际文档ID
        //     // 留空表示待填充
        //   ],
        // },
        {
          type: 'link',
          label: 'Ktor',
          href: 'https://ktor.io/',
        },
      ],
    },
    {
      type: 'category',
      label: 'API 参考',
      items: [
        {
          type: 'link',
          label: '标准库 (stdlib)',
          href: 'https://kotlinlang.org/api/latest/jvm/stdlib/',
        },
        {
          type: 'link',
          label: '测试库 (kotlin.test)',
          href: 'https://kotlinlang.org/api/latest/kotlin.test/',
        },
        {
          type: 'link',
          label: '协程 (kotlinx.coroutines)',
          href: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/',
        },
        {
          type: 'link',
          label: '序列化 (kotlinx.serialization)',
          href: 'https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/',
        },
        {
          type: 'link',
          label: 'Kotlin I/O 库 (kotlinx-io)',
          href: 'https://kotlinlang.org/api/kotlinx-io/',
        },
        {
          type: 'link',
          label: '日期和时间 (kotlinx-datetime)',
          href: 'https://kotlinlang.org/api/kotlinx-datetime/',
        },
        {
          type: 'link',
          label: 'JVM 元数据 (kotlin-metadata-jvm)',
          href: 'https://kotlinlang.org/api/kotlinx-metadata-jvm/',
        },
        {
          type: 'link',
          label: 'Ktor',
          href: 'https://api.ktor.io/',
        },
        {
          type: 'link',
          label: 'Kotlin Gradle 插件 (kotlin-gradle-plugin)',
          href: 'https://kotlinlang.org/api/kotlin-gradle-plugin/',
        },
      ],
    },
    {
      type: 'category',
      label: '语言参考',
      items: [
        'keyword-reference',
        {
          type: 'link',
          label: '语法',
          href: 'https://kotlinlang.org/docs/reference/grammar.html',
        },
        {
          type: 'link',
          label: '语言规范',
          href: 'https://kotlinlang.org/spec/',
        },
      ],
    },
    {
      type: 'category',
      label: '工具',
      items: [
        {
          type: 'category',
          label: '构建工具',
          items: [
            {
              type: 'category',
              label: 'Gradle',
              items: [
                'gradle',
                'get-started-with-jvm-gradle-project',
                'gradle-configure-project',
                'gradle-best-practices',
                'gradle-compiler-options',
                'gradle-compilation-and-caches',
                'gradle-plugin-variants',
              ],
            },
            'maven',
            'ant',
          ],
        },
        // {
        //   type: 'category',
        //   label: 'Dokka',
        //   items: [
        //     // XML文档中通过include引入，但没有实际文档ID
        //     // 留空表示待填充
        //   ],
        // },
        'kotlin-ide',
        'code-style-migration-guide',
        'kotlin-notebook-overview',
        'lets-plot',
        'run-code-snippets',
        'kotlin-and-ci',
        'kotlin-doc',
        'kotlin-osgi',
      ],
    },
    {
      type: 'category',
      label: '编译器和插件',
      items: [
        {
          type: 'category',
          label: 'Kotlin 编译器',
          items: [
            'k2-compiler-migration-guide',
            'command-line',
            'compiler-reference',
          ],
        },
        {
          type: 'category',
          label: 'Kotlin 编译器插件',
          items: [
            'all-open-plugin',
            'no-arg-plugin',
            'sam-with-receiver-plugin',
            'kapt',
            'lombok',
            'power-assert',
          ],
        },
        {
          type: 'category',
          label: 'Compose 编译器',
          items: [
            'compose-compiler-migration-guide',
            'compose-compiler-options',
          ],
        },
        {
          type: 'category',
          label: 'Kotlin Symbol Processing API',
          items: [
            'ksp-overview',
            'ksp-quickstart',
            'ksp-why-ksp',
            'ksp-examples',
            'ksp-additional-details',
            'ksp-reference',
            'ksp-incremental',
            'ksp-multi-round',
            'ksp-multiplatform',
            'ksp-command-line',
            'ksp-faq',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '学习资料',
      items: [
        'learning-materials-overview',
        {
          type: 'link',
          label: 'Kotlin by example',
          href: 'https://play.kotlinlang.org/byExample/overview',
        },
        'koans',
        {
          type: 'link',
          label: 'Kotlin Core track',
          href: 'https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23',
        },
        'kotlin-hands-on',
        'kotlin-tips',
        'books',
        'advent-of-code',
        {
          type: 'category',
          label: '在 IDE 中学习 (JetBrains Academy)',
          items: [
            'edu-tools-learner',
            'edu-tools-educator',
          ],
        },
        // {
        //   type: 'category',
        //   label: '库作者指南',
        //   items: [
        //     // XML文档中通过include引入，但没有实际文档ID
        //     // 留空表示待填充
        //   ],
        // },
      ],
    },
    {
      type: 'category',
      label: '早期访问预览 (EAP)',
      items: [
        'eap',
        'configure-build-for-eap',
      ],
    },
    {
      type: 'category',
      label: '其他资源',
      items: [
        'faq',
        {
          type: 'category',
          label: 'Kotlin 兼容性指南',
          items: [
            'compatibility-guide-21',
            'compatibility-guide-20',
            'compatibility-guide-19',
            'compatibility-guide-18',
            'compatibility-guide-1720',
            'compatibility-guide-17',
            'compatibility-guide-16',
            'compatibility-guide-15',
            'compatibility-guide-14',
            'compatibility-guide-13',
            'compatibility-modes',
          ],
        },
        {
          type: 'category',
          label: 'Kotlin 基金会',
          items: [
            {
              type: 'link',
              label: 'Kotlin 基金会',
              href: 'https://kotlinfoundation.org/',
            },
            {
              type: 'link',
              label: '语言委员会指南',
              href: 'https://kotlinfoundation.org/language-committee-guidelines/',
            },
            {
              type: 'link',
              label: '提交不兼容变更',
              href: 'https://kotlinfoundation.org/submitting-incompatible-changes/',
            },
            {
              type: 'link',
              label: '品牌使用',
              href: 'https://kotlinfoundation.org/guidelines/',
            },
            {
              type: 'link',
              label: 'Kotlin 基金会常见问题',
              href: 'https://kotlinfoundation.org/faq/',
            },
          ],
        },
        {
          type: 'category',
          label: 'Google Summer of Code',
          items: [
            'gsoc-overview',
            'gsoc-2025',
            'gsoc-2024',
            'gsoc-2023',
          ],
        },
        'security',
        'kotlin-pdf',
        {
          type: 'category',
          label: '社区',
          items: [
            'contribute',
            'kug-guidelines',
            'kotlin-night-guidelines',
            'slack-code-of-conduct',
          ],
        },
        'kotlin-brand-assets',
        {
          type: 'link',
          label: '新闻资料包',
          href: 'https://kotlinlang.org/assets/kotlin-media-kit.pdf',
        },
      ],
    },
  ],
};

export default sidebars;
