import { DocsItemConfig } from "../docs.config";
import { SideLocaleConfig } from "../locales.config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function createI18nSideBarConfig(t) {
    return {
        koin: [
            {
                "text": t['koin.setup'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Koin",
                        "link": "setup/koin"
                    },
                    {
                        "text": "Koin Embedded",
                        "link": "support/embedded"
                    },
                    {
                        "text": "Koin 注解",
                        "link": "setup/annotations"
                    },
                    {
                        "text": "为什么选择 Koin？",
                        "link": "setup/why"
                    },
                    {
                        "text": "发布 & API 兼容性指南",
                        "link": "support/releases"
                    },
                    {
                        "text": "API 稳定性 & 发布类型",
                        "link": "support/api-stability"
                    },
                    {
                        "text": "版本、路线图和支持",
                        "link": "support/index"
                    }
                ]
            },
            {
                "text": t['koin.tutorial'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Kotlin",
                        "link": "quickstart/kotlin"
                    },
                    {
                        "text": "安卓",
                        "link": "quickstart/android"
                    },
                    {
                        "text": "Android - ViewModel",
                        "link": "quickstart/android-viewmodel"
                    },
                    {
                        "text": "Android - Jetpack Compose",
                        "link": "quickstart/android-compose"
                    },
                    {
                        "text": "Android & 注解 (Annotations)",
                        "link": "quickstart/android-annotations"
                    },
                    {
                        "text": "Kotlin Multiplatform - 无共享 UI",
                        "link": "quickstart/kmp"
                    },
                    {
                        "text": "Compose Multiplatform - Shared UI",
                        "link": "quickstart/cmp"
                    },
                    {
                        "text": "Ktor",
                        "link": "quickstart/ktor"
                    },
                    {
                        "text": "Ktor & 注解(Annotations)",
                        "link": "quickstart/ktor-annotations"
                    }
                ]
            },
            {
                "text": t['koin.core.test'],
                "collapsed": true,
                "items": [
                    {
                        "text": "什么是 Koin？",
                        "link": "reference/introduction"
                    },
                    {
                        "text": "Koin DSL",
                        "link": "reference/koin-core/dsl"
                    },
                    {
                        "text": "构造器 DSL",
                        "link": "reference/koin-core/dsl-update"
                    },
                    {
                        "text": "定义",
                        "link": "reference/koin-core/definitions"
                    },
                    {
                        "text": "模块",
                        "link": "reference/koin-core/modules"
                    },
                    {
                        "text": "扩展管理器",
                        "link": "reference/koin-core/extension-manager"
                    },
                    {
                        "text": "启动 Koin",
                        "link": "reference/koin-core/start-koin"
                    },
                    {
                        "text": "Koin 组件",
                        "link": "reference/koin-core/koin-component"
                    },
                    {
                        "text": "传递参数 - 注入参数",
                        "link": "reference/koin-core/injection-parameters"
                    },
                    {
                        "text": "上下文隔离 (Context Isolation)",
                        "link": "reference/koin-core/context-isolation"
                    },
                    {
                        "text": "作用域",
                        "link": "reference/koin-core/scopes"
                    },
                    {
                        "text": "在测试中注入 (Injecting)",
                        "link": "reference/koin-test/testing"
                    },
                    {
                        "text": "验证你的 Koin 配置",
                        "link": "reference/koin-test/verify"
                    },
                    {
                        "text": "CheckModules - 检查 Koin 配置（已弃用）",
                        "link": "reference/koin-test/checkmodules"
                    }
                ]
            },
            {
                "text": t['koin.android'],
                "collapsed": true,
                "items": [
                    {
                        "text": "在 Android 上启动 Koin",
                        "link": "reference/koin-android/start"
                    },
                    {
                        "text": "在 Android 中注入",
                        "link": "reference/koin-android/get-instances"
                    },
                    {
                        "text": "Android 的构造器 DSL",
                        "link": "reference/koin-android/dsl-update"
                    },
                    {
                        "text": "Android 中的多个 Koin 模块",
                        "link": "reference/koin-android/modules-android"
                    },
                    {
                        "text": "Android ViewModel & Navigation",
                        "link": "reference/koin-android/viewmodel"
                    },
                    {
                        "text": "管理 Android 作用域",
                        "link": "reference/koin-android/scope"
                    },
                    {
                        "text": "Fragment 工厂",
                        "link": "reference/koin-android/fragment-factory"
                    },
                    {
                        "text": "WorkManager",
                        "link": "reference/koin-android/workmanager"
                    },
                    {
                        "text": "Android 检测工具化测试",
                        "link": "reference/koin-android/instrumented-testing"
                    }
                ]
            },
            {
                "text": t['koin.compose'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Koin 对 Jetpack Compose 和 Compose Multiplatform 的支持",
                        "link": "reference/koin-compose/compose"
                    },
                    {
                        "text": "使用 Compose 应用实现隔离上下文",
                        "link": "reference/koin-compose/isolated-context"
                    }
                ]
            },
            {
                "text": t['koin.annotation'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Koin 注解入门",
                        "link": "reference/koin-annotations/start"
                    },
                    {
                        "text": "使用注解的定义",
                        "link": "reference/koin-annotations/definitions"
                    },
                    {
                        "text": "使用 @Module 的模块",
                        "link": "reference/koin-annotations/modules"
                    },
                    {
                        "text": "Koin 注解中的作用域 (Scopes)",
                        "link": "reference/koin-annotations/scope"
                    },
                    {
                        "text": "Kotlin 多平台应用中定义和模块的注解",
                        "link": "reference/koin-annotations/kmp"
                    }
                ]
            },
            {
                "text": t['koin.multiplatform'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Kotlin 多平台依赖注入",
                        "link": "reference/koin-mp/kmp"
                    }
                ]
            },
            {
                "text": t['koin.ktor'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Ktor 中的依赖注入 (Dependency Injection)",
                        "link": "reference/koin-ktor/ktor"
                    },
                    {
                        "text": "Ktor & Koin 隔离上下文",
                        "link": "reference/koin-ktor/ktor-isolated"
                    }
                ]
            }
        ],
        kotlin: [
            {
                "link": "getting-started",
                "text": t['kotlin.gettings-started']
            },
            {
                "text": t['kotlin.tour'],
                "link": "kotlin-tour-welcome",
                "collapsed": true,
                "items": [
                    {
                        "text": "你好，世界",
                        "link": "kotlin-tour-hello-world"
                    },
                    {
                        "text": "基本类型",
                        "link": "kotlin-tour-basic-types"
                    },
                    {
                        "text": "集合",
                        "link": "kotlin-tour-collections"
                    },
                    {
                        "text": "控制流",
                        "link": "kotlin-tour-control-flow"
                    },
                    {
                        "text": "函数",
                        "link": "kotlin-tour-functions"
                    },
                    {
                        "text": "类",
                        "link": "kotlin-tour-classes"
                    },
                    {
                        "text": "Null 安全",
                        "link": "kotlin-tour-null-safety"
                    }
                ]
            },
            {
                "text": t['kotlin.overview'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Kotlin服务端开发",
                        "link": "server-overview"
                    },
                    {
                        "text": "Android平台的Kotlin语言",
                        "link": "android-overview"
                    },
                    {
                        "text": "Kotlin/Wasm",
                        "link": "wasm-overview"
                    },
                    {
                        "text": "Kotlin Native",
                        "link": "native-overview"
                    },
                    {
                        "text": "Kotlin for JavaScript",
                        "link": "js-overview"
                    },
                    {
                        "text": "用于数据分析的 Kotlin",
                        "link": "data-analysis-overview"
                    },
                    {
                        "text": "Kotlin 竞赛编程",
                        "link": "competitive-programming"
                    }
                ]
            },
            {
                "text": t['kotlin.whatsnew'],
                "collapsed": true,
                "items": [
                    {
                        "link": "whatsnew2120",
                        "text": "Kotlin 2.1.20"
                    },
                    {
                        "link": "whatsnew21",
                        "text": "Kotlin 2.1.0"
                    },
                    {
                        "text": t['kotlin.early-access'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin 2.0.20 中的新增功能",
                                "link": "whatsnew2020"
                            },
                            {
                                "text": "Kotlin 2.0.0 中的新特性",
                                "link": "whatsnew20"
                            },
                            {
                                "text": "Kotlin 1.9.20 中的新特性",
                                "link": "whatsnew1920"
                            },
                            {
                                "text": "Kotlin 1.9.0 版本的新特性",
                                "link": "whatsnew19"
                            },
                            {
                                "text": "Kotlin 1.8.20 版本的新特性",
                                "link": "whatsnew1820"
                            },
                            {
                                "text": "Kotlin 1.8.0 新特性",
                                "link": "whatsnew18"
                            },
                            {
                                "text": "Kotlin 1.7.20 中的新特性",
                                "link": "whatsnew1720"
                            },
                            {
                                "text": "Kotlin 1.7.0 中的新特性",
                                "link": "whatsnew17"
                            },
                            {
                                "text": "Kotlin 1.6.20 中的新特性",
                                "link": "whatsnew1620"
                            },
                            {
                                "text": "Kotlin 1.6.0 的新特性",
                                "link": "whatsnew16"
                            },
                            {
                                "text": "Kotlin 1.5.30 中的新增功能",
                                "link": "whatsnew1530"
                            },
                            {
                                "text": "Kotlin 1.5.20 中的新增功能",
                                "link": "whatsnew1520"
                            },
                            {
                                "text": "Kotlin 1.5.0 新特性",
                                "link": "whatsnew15"
                            },
                            {
                                "text": "Kotlin 1.4.30 中的新增功能",
                                "link": "whatsnew1430"
                            },
                            {
                                "text": "Kotlin 1.4.20 新特性",
                                "link": "whatsnew1420"
                            },
                            {
                                "text": "Kotlin 1.4.0 中的新特性",
                                "link": "whatsnew14"
                            },
                            {
                                "text": "Kotlin 1.3 中的新特性",
                                "link": "whatsnew13"
                            },
                            {
                                "text": "Kotlin 1.2 新特性",
                                "link": "whatsnew12"
                            },
                            {
                                "text": "Kotlin 1.1 的新特性",
                                "link": "whatsnew11"
                            }
                        ]
                    }
                ]
            },
            {
                "text": t['kotlin.evolution-roadmap'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Kotlin 路线图",
                        "link": "roadmap"
                    },
                    {
                        "text": "Kotlin 语言特性和提案",
                        "link": "kotlin-language-features-and-proposals"
                    },
                    {
                        "text": "Kotlin 演进原则",
                        "link": "kotlin-evolution-principles"
                    },
                    {
                        "text": "Kotlin 组件的稳定性",
                        "link": "components-stability"
                    },
                    {
                        "text": "Kotlin 发布版本",
                        "link": "releases"
                    }
                ]
            },
            {
                "text": t['kotlin.basics'],
                "collapsed": true,
                "items": [
                    {
                        "text": "基本语法",
                        "link": "basic-syntax"
                    },
                    {
                        "text": "习惯用法",
                        "link": "idioms"
                    },
                    {
                        "text": "通过示例学习 Kotlin",
                        "href": "https://play.kotlinlang.org/byExample/overview"
                    },
                    {
                        "text": "编码规范",
                        "link": "coding-conventions"
                    }
                ]
            },
            {
                "text": t['kotlin.core-concepts'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.core-concepts-types'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.core-concepts-basic-types'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "基本类型",
                                        "link": "basic-types"
                                    },
                                    {
                                        "text": "数字",
                                        "link": "numbers"
                                    },
                                    {
                                        "text": "无符号整型",
                                        "link": "unsigned-integer-types"
                                    },
                                    {
                                        "text": "布尔值",
                                        "link": "booleans"
                                    },
                                    {
                                        "text": "字符",
                                        "link": "characters"
                                    },
                                    {
                                        "text": "字符串",
                                        "link": "strings"
                                    },
                                    {
                                        "text": "数组",
                                        "link": "arrays"
                                    }
                                ]
                            },
                            {
                                "text": "类型检查与转换",
                                "link": "typecasts"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.core-concepts-control-flow'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "条件语句和循环",
                                "link": "control-flow"
                            },
                            {
                                "text": "返回值和跳转",
                                "link": "returns"
                            },
                            {
                                "text": "异常",
                                "link": "exceptions"
                            }
                        ]
                    },
                    {
                        "text": "包和导入",
                        "link": "packages"
                    },
                    {
                        "text": t['kotlin.core-concepts-classes-objects'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "类 (Classes)",
                                "link": "classes"
                            },
                            {
                                "text": "继承",
                                "link": "inheritance"
                            },
                            {
                                "text": "属性",
                                "link": "properties"
                            },
                            {
                                "text": "接口",
                                "link": "interfaces"
                            },
                            {
                                "text": "函数式 (SAM) 接口",
                                "link": "fun-interfaces"
                            },
                            {
                                "text": "可见性修饰符",
                                "link": "visibility-modifiers"
                            },
                            {
                                "text": "扩展",
                                "link": "extensions"
                            },
                            {
                                "text": "数据类",
                                "link": "data-classes"
                            },
                            {
                                "text": "密封类和密封接口",
                                "link": "sealed-classes"
                            },
                            {
                                "text": "泛型：in、out、where",
                                "link": "generics"
                            },
                            {
                                "text": "嵌套类和内部类",
                                "link": "nested-classes"
                            },
                            {
                                "text": "枚举类",
                                "link": "enum-classes"
                            },
                            {
                                "text": "内联值类 (Inline value classes)",
                                "link": "inline-classes"
                            },
                            {
                                "text": "对象声明和表达式",
                                "link": "object-declarations"
                            },
                            {
                                "text": "委托",
                                "link": "delegation"
                            },
                            {
                                "text": "委托属性",
                                "link": "delegated-properties"
                            },
                            {
                                "text": "类型别名",
                                "link": "type-aliases"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.core-concepts-functions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "函数",
                                "link": "functions"
                            },
                            {
                                "text": "高阶函数与 Lambda 表达式",
                                "link": "lambdas"
                            },
                            {
                                "text": "内联函数",
                                "link": "inline-functions"
                            },
                            {
                                "text": "运算符重载",
                                "link": "operator-overloading"
                            },
                            {
                                "text": t['kotlin.core-concepts-builders'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "类型安全的构建器",
                                        "link": "type-safe-builders"
                                    },
                                    {
                                        "text": "结合构建器类型推断使用构建器",
                                        "link": "using-builders-with-builder-inference"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "text": "Null 安全",
                        "link": "null-safety"
                    },
                    {
                        "text": "相等性",
                        "link": "equality"
                    },
                    {
                        "text": "This 表达式",
                        "link": "this-expressions"
                    },
                    {
                        "text": "异步编程技术",
                        "link": "async-programming"
                    },
                    {
                        "text": "协程",
                        "link": "coroutines-overview"
                    },
                    {
                        "text": "注解 (Annotations)",
                        "link": "annotations"
                    },
                    {
                        "text": "解构声明",
                        "link": "destructuring-declarations"
                    },
                    {
                        "text": "反射",
                        "link": "reflection"
                    }
                ]
            },
            {
                "text": t['kotlin.multiplatform'],
                "collapsed": true,
                "items": [
                    {
                        "text": "Kotlin Multiplatform 简介",
                        "link": "multiplatform-intro"
                    },
                    {
                        "text": "Kotlin Multiplatform 项目结构基础",
                        "link": "multiplatform-discover-project"
                    },
                    {
                        "text": "多平台项目结构的高级概念",
                        "link": "multiplatform-advanced-project-structure"
                    },
                    {
                        "text": t['kotlin.multiplatform.shared-code'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "在平台上共享代码",
                                "link": "multiplatform-share-on-platforms"
                            },
                            {
                                "text": "预期声明和实际声明",
                                "link": "multiplatform-expect-actual"
                            },
                            {
                                "text": "分层项目结构",
                                "link": "multiplatform-hierarchy"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.multiplatform.add-dependencies'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "添加对多平台库的依赖",
                                "link": "multiplatform-add-dependencies"
                            },
                            {
                                "text": "添加 Android 依赖项",
                                "link": "multiplatform-android-dependencies"
                            },
                            {
                                "text": "添加 iOS 依赖项",
                                "link": "multiplatform-ios-dependencies"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.multiplatform.ios-integration'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "iOS 集成方法",
                                "link": "multiplatform-ios-integration-overview"
                            },
                            {
                                "text": "Direct integration",
                                "link": "multiplatform-direct-integration"
                            },
                            {
                                "text": "Swift 包导出设置",
                                "link": "native-spm"
                            },
                            {
                                "text": t['kotlin.multiplatform.cocoapod-integration'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "CocoaPods 概述和设置",
                                        "link": "native-cocoapods"
                                    },
                                    {
                                        "text": "添加对 Pod 库的依赖",
                                        "link": "native-cocoapods-libraries"
                                    },
                                    {
                                        "text": "将 Kotlin Gradle 项目用作 CocoaPods 依赖项",
                                        "link": "native-cocoapods-xcode"
                                    },
                                    {
                                        "text": "CocoaPods Gradle 插件 DSL 参考",
                                        "link": "native-cocoapods-dsl-reference"
                                    }
                                ]
                            },
                            {
                                "text": "从本地 Swift 包中使用 Kotlin",
                                "link": "multiplatform-spm-local-integration"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.multiplatform.compilations'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "配置编译",
                                "link": "multiplatform-configure-compilations"
                            },
                            {
                                "text": "构建最终原生二进制文件",
                                "link": "multiplatform-build-native-binaries"
                            }
                        ]
                    },
                    {
                        "text": "设置多平台库发布",
                        "link": "multiplatform-publish-lib"
                    },
                    {
                        "text": t['kotlin.multiplatform.reference'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "多平台 Gradle DSL 参考",
                                "link": "multiplatform-dsl-reference"
                            },
                            {
                                "text": "Android 源码集布局",
                                "link": "multiplatform-android-layout"
                            },
                            {
                                "text": "Kotlin Multiplatform 兼容性指南",
                                "link": "multiplatform-compatibility-guide"
                            },
                            {
                                "text": "Kotlin Multiplatform 插件发布",
                                "link": "multiplatform-plugin-releases"
                            }
                        ]
                    }
                ]
            },
            {
                "text": t['kotlin.data-analysis'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.data-analysis.notebooks'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin Notebook 入门",
                                "link": "get-started-with-kotlin-notebooks"
                            },
                            {
                                "text": "设置环境",
                                "link": "kotlin-notebook-set-up-env"
                            },
                            {
                                "text": "创建你的第一个 Kotlin Notebook",
                                "link": "kotlin-notebook-create"
                            },
                            {
                                "text": "向你的 Kotlin Notebook 添加依赖",
                                "link": "kotlin-notebook-add-dependencies"
                            }
                        ]
                    },
                    {
                        "text": "分享你的 Kotlin Notebook",
                        "link": "kotlin-notebook-share"
                    },
                    {
                        "text": "Kotlin Notebook 支持的输出格式",
                        "link": "data-analysis-notebooks-output-formats"
                    },
                    {
                        "text": t['kotlin.data-analysis.datasources'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "从文件中检索数据",
                                "link": "data-analysis-work-with-data-sources"
                            },
                            {
                                "text": "从 Web 源和 API 检索数据",
                                "link": "data-analysis-work-with-api"
                            },
                            {
                                "text": "连接数据库并从中检索数据",
                                "link": "data-analysis-connect-to-db"
                            }
                        ]
                    },
                    {
                        "text": "在 Kotlin Notebook 中使用 Kandy 进行数据可视化",
                        "link": "data-analysis-visualization"
                    },
                    {
                        "text": "用于数据分析的 Kotlin 和 Java 库",
                        "link": "data-analysis-libraries"
                    }
                ]
            },
            {
                "text": t['kotlin.platforms'],
                "collapsed": true,
                "items": [
                    {
                        "text": "JVM",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin/JVM 入门",
                                "link": "jvm-get-started"
                            },
                            {
                                "text": "与 Java 的比较",
                                "link": "comparison-to-java"
                            },
                            {
                                "text": "从 Kotlin 中调用 Java",
                                "link": "java-interop"
                            },
                            {
                                "text": "从 Java 调用 Kotlin",
                                "link": "java-to-kotlin-interop"
                            },
                            {
                                "text": "Spring",
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "使用 Spring Boot 创建 RESTful web 服务和数据库",
                                        "collapsed": true,
                                        "items": [
                                            {
                                                "text": "Spring Boot 和 Kotlin 入门",
                                                "link": "jvm-get-started-spring-boot"
                                            },
                                            {
                                                "text": "使用 Kotlin 创建 Spring Boot 项目",
                                                "link": "jvm-create-project-with-spring-boot"
                                            },
                                            {
                                                "text": "向 Spring Boot 项目添加数据类",
                                                "link": "jvm-spring-boot-add-data-class"
                                            },
                                            {
                                                "text": "为 Spring Boot 项目添加数据库支持",
                                                "link": "jvm-spring-boot-add-db-support"
                                            },
                                            {
                                                "text": "使用 Spring Data CrudRepository 进行数据库访问",
                                                "link": "jvm-spring-boot-using-crudrepository"
                                            }
                                        ]
                                    },
                                    {
                                        "text": "Spring Framework 的 Kotlin 文档",
                                        "href": "https://docs.spring.io/spring-framework/docs/current/reference/html/languages.html#languages"
                                    },
                                    {
                                        "text": "使用 Spring Boot 和 Kotlin 构建 Web 应用 - 教程",
                                        "href": "https://spring.io/guides/tutorials/spring-boot-kotlin/"
                                    },
                                    {
                                        "text": "使用 Kotlin 协程和 RSocket 创建聊天应用 - 教程",
                                        "href": "https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/"
                                    }
                                ]
                            },
                            {
                                "text": "在 JVM 中使用 JUnit 测试代码 – 教程",
                                "link": "jvm-test-using-junit"
                            },
                            {
                                "text": "在一个项目中混合使用 Java 和 Kotlin – 教程",
                                "link": "mixing-java-kotlin-intellij"
                            },
                            {
                                "text": "在 Kotlin 中使用 Java records (记录类)",
                                "link": "jvm-records"
                            },
                            {
                                "text": t['kotlin.platforms.java2kotlin'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "Java 和 Kotlin 中的字符串",
                                        "link": "java-to-kotlin-idioms-strings"
                                    },
                                    {
                                        "text": "Java 和 Kotlin 中的集合",
                                        "link": "java-to-kotlin-collections-guide"
                                    },
                                    {
                                        "text": "Java 和 Kotlin 中的可空性",
                                        "link": "java-to-kotlin-nullability-guide"
                                    },
                                    {
                                        "text": "标准输入",
                                        "link": "standard-input"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "text": "Native",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin/Native 入门",
                                "link": "native-get-started"
                            },
                            {
                                "text": "定义文件",
                                "link": "native-definition-file"
                            },
                            {
                                "text": t['kotlin.platforms.c-interop'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "与 C 的互操作性",
                                        "link": "native-c-interop"
                                    },
                                    {
                                        "text": "C 原始数据类型映射 – 教程",
                                        "link": "mapping-primitive-data-types-from-c"
                                    },
                                    {
                                        "text": "C 语言结构体和联合体类型的映射——教程",
                                        "link": "mapping-struct-union-types-from-c"
                                    },
                                    {
                                        "text": "C 语言中的映射函数指针 – 教程",
                                        "link": "mapping-function-pointers-from-c"
                                    },
                                    {
                                        "text": "C 语言中的字符串映射 – 教程",
                                        "link": "mapping-strings-from-c"
                                    },
                                    {
                                        "text": "Kotlin/Native 作为动态库 - 教程",
                                        "link": "native-dynamic-libraries"
                                    },
                                    {
                                        "text": "使用 C 互操作和 libcurl 创建应用程序 – 教程",
                                        "link": "native-app-with-c-and-libcurl"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.platforms.object-c-interop'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "与 Swift/Objective-C 的互操作性",
                                        "link": "native-objc-interop"
                                    },
                                    {
                                        "text": "Kotlin/Native 作为 Apple 框架 – 教程",
                                        "link": "apple-framework"
                                    }
                                ]
                            },
                            {
                                "text": "Kotlin/Native 库",
                                "link": "native-libraries"
                            },
                            {
                                "text": "平台库",
                                "link": "native-platform-libs"
                            },
                            {
                                "text": t['kotlin.platforms.memory-management'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "Kotlin/Native 内存管理",
                                        "link": "native-memory-manager"
                                    },
                                    {
                                        "text": "与 Swift/Objective-C ARC 集成",
                                        "link": "native-arc-integration"
                                    },
                                    {
                                        "text": "迁移到新的内存管理器",
                                        "link": "native-migration-guide"
                                    }
                                ]
                            },
                            {
                                "text": "调试 Kotlin/Native",
                                "link": "native-debugging"
                            },
                            {
                                "text": "iOS崩溃报告符号化",
                                "link": "native-ios-symbolication"
                            },
                            {
                                "text": t['kotlin.platforms.references-tips'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "Kotlin/Native 目标平台支持",
                                        "link": "native-target-support"
                                    },
                                    {
                                        "text": "iOS 应用的隐私清单",
                                        "link": "apple-privacy-manifest"
                                    },
                                    {
                                        "text": "提升编译时间的技巧",
                                        "link": "native-improving-compilation-time"
                                    },
                                    {
                                        "text": "Kotlin/Native 二进制文件的许可文件",
                                        "link": "native-binary-licenses"
                                    },
                                    {
                                        "text": "Kotlin/Native 常见问题解答",
                                        "link": "native-faq"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "text": "WebAssembly (Wasm)",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin/Wasm 和 Compose Multiplatform 入门",
                                "link": "wasm-get-started"
                            },
                            {
                                "text": "Kotlin/Wasm 和 WASI 入门",
                                "link": "wasm-wasi"
                            },
                            {
                                "text": "调试 Kotlin/Wasm 代码",
                                "link": "wasm-debugging"
                            },
                            {
                                "text": "与 JavaScript 的互操作性",
                                "link": "wasm-js-interop"
                            },
                            {
                                "text": "问题排查",
                                "link": "wasm-troubleshooting"
                            }
                        ]
                    },
                    {
                        "text": "JavaScript",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "搭建 Kotlin/JS 项目",
                                "link": "js-project-setup"
                            },
                            {
                                "text": "运行 Kotlin/JS",
                                "link": "running-kotlin-js"
                            },
                            {
                                "text": "开发服务器和持续编译",
                                "link": "dev-server-continuous-compilation"
                            },
                            {
                                "text": "调试 Kotlin/JS 代码",
                                "link": "js-debugging"
                            },
                            {
                                "text": "在 Kotlin/JS 中运行测试",
                                "link": "js-running-tests"
                            },
                            {
                                "text": "Kotlin/JS 死代码消除 (dead code elimination)",
                                "link": "javascript-dce"
                            },
                            {
                                "text": "Kotlin/JS IR 编译器",
                                "link": "js-ir-compiler"
                            },
                            {
                                "text": "将 Kotlin/JS 项目迁移到 IR 编译器",
                                "link": "js-ir-migration"
                            },
                            {
                                "text": t['kotlin.platforms.kotlin-js'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "浏览器和 DOM API",
                                        "link": "browser-api-dom"
                                    },
                                    {
                                        "text": "从 Kotlin 中使用 JavaScript 代码",
                                        "link": "js-interop"
                                    },
                                    {
                                        "text": "动态类型",
                                        "link": "dynamic-type"
                                    },
                                    {
                                        "text": "使用 npm 中的依赖项",
                                        "link": "using-packages-from-npm"
                                    },
                                    {
                                        "text": "从 JavaScript 中使用 Kotlin 代码",
                                        "link": "js-to-kotlin-interop"
                                    },
                                    {
                                        "text": "JavaScript 模块",
                                        "link": "js-modules"
                                    },
                                    {
                                        "text": "Kotlin/JS 反射",
                                        "link": "js-reflection"
                                    },
                                    {
                                        "text": "类型安全的 HTML DSL",
                                        "link": "typesafe-html-dsl"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.platforms.kotlin-script'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin 自定义脚本入门教程",
                                "link": "custom-script-deps-tutorial"
                            }
                        ]
                    }
                ]
            },
            {
                "text": t['kotlin.stdlib.standard-library'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.stdlib.standard-library-collections'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "集合概览",
                                "link": "collections-overview"
                            },
                            {
                                "text": "构建集合",
                                "link": "constructing-collections"
                            },
                            {
                                "text": "迭代器",
                                "link": "iterators"
                            },
                            {
                                "text": "区间 (Ranges) 和数列 (progressions)",
                                "link": "ranges"
                            },
                            {
                                "text": "序列",
                                "link": "sequences"
                            },
                            {
                                "text": "集合操作概览",
                                "link": "collection-operations"
                            },
                            {
                                "text": "集合转换操作",
                                "link": "collection-transformations"
                            },
                            {
                                "text": "过滤集合",
                                "link": "collection-filtering"
                            },
                            {
                                "text": "加号和减号运算符",
                                "link": "collection-plus-minus"
                            },
                            {
                                "text": "分组",
                                "link": "collection-grouping"
                            },
                            {
                                "text": "获取集合的部分内容",
                                "link": "collection-parts"
                            },
                            {
                                "text": "检索单个元素",
                                "link": "collection-elements"
                            },
                            {
                                "text": "排序",
                                "link": "collection-ordering"
                            },
                            {
                                "text": "聚合操作",
                                "link": "collection-aggregate"
                            },
                            {
                                "text": "集合写操作",
                                "link": "collection-write"
                            },
                            {
                                "text": "列表特定操作",
                                "link": "list-operations"
                            },
                            {
                                "text": "Set-specific operations",
                                "link": "set-operations"
                            },
                            {
                                "text": "Map-specific operations",
                                "link": "map-operations"
                            }
                        ]
                    },
                    {
                        "text": "Read standard input",
                        "link": "read-standard-input"
                    },
                    {
                        "text": "选择加入要求",
                        "link": "opt-in-requirements"
                    },
                    {
                        "text": "作用域函数",
                        "link": "scope-functions"
                    },
                    {
                        "text": "时间测量",
                        "link": "time-measurement"
                    }
                ]
            },
            {
                "text": t['kotlin.stdlib.official-library'],
                "collapsed": true,
                "items": [
                    {
                        "text": "协程 (kotlinx.coroutines)",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "协程",
                                "link": "coroutines-overview"
                            }
                        ]
                    },
                    {
                        "text": "序列化",
                        "link": "serialization"
                    },
                    {
                        "text": "Kotlin元数据 JVM 库",
                        "link": "metadata-jvm"
                    },
                    {
                        "text": "Ktor",
                        "href": "https://ktor.io/"
                    }
                ]
            },
            {
                "text": t['kotlin.api.reference'],
                "collapsed": true,
                "items": [
                    {
                        "text": "标准库 (stdlib)",
                        "href": "https://kotlinlang.org/api/latest/jvm/stdlib/"
                    },
                    {
                        "text": "测试库 (kotlin.test)",
                        "href": "https://kotlinlang.org/api/latest/kotlin.test/"
                    },
                    {
                        "text": "协程 (kotlinx.coroutines)",
                        "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/"
                    },
                    {
                        "text": "序列化 (kotlinx.serialization)",
                        "href": "https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/"
                    },
                    {
                        "text": "Kotlin I/O 库 (kotlinx-io)",
                        "href": "https://kotlinlang.org/api/kotlinx-io/"
                    },
                    {
                        "text": "日期和时间 (kotlinx-datetime)",
                        "href": "https://kotlinlang.org/api/kotlinx-datetime/"
                    },
                    {
                        "text": "JVM 元数据 (kotlin-metadata-jvm)",
                        "href": "https://kotlinlang.org/api/kotlinx-metadata-jvm/"
                    },
                    {
                        "text": "Ktor",
                        "href": "https://api.ktor.io/"
                    },
                    {
                        "text": "Kotlin Gradle 插件 (kotlin-gradle-plugin)",
                        "href": "https://kotlinlang.org/api/kotlin-gradle-plugin/"
                    }
                ]
            },
            {
                "text": t['kotlin.language.reference'],
                "collapsed": true,
                "items": [
                    {
                        "text": "关键字和运算符",
                        "link": "keyword-reference"
                    },
                    {
                        "text": "语法",
                        "href": "https://kotlinlang.org/docs/reference/grammar.html"
                    },
                    {
                        "text": "语言规范",
                        "href": "https://kotlinlang.org/spec/"
                    }
                ]
            },
            {
                "text": t['kotlin.tools'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.tools.build-tools'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Gradle",
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": "Gradle",
                                        "link": "gradle"
                                    },
                                    {
                                        "text": "Gradle 和 Kotlin/JVM 入门",
                                        "link": "get-started-with-jvm-gradle-project"
                                    },
                                    {
                                        "text": "配置 Gradle 项目",
                                        "link": "gradle-configure-project"
                                    },
                                    {
                                        "text": "Gradle 最佳实践",
                                        "link": "gradle-best-practices"
                                    },
                                    {
                                        "text": "Kotlin Gradle 插件中的编译器选项",
                                        "link": "gradle-compiler-options"
                                    },
                                    {
                                        "text": "Kotlin Gradle 插件中的编译和缓存",
                                        "link": "gradle-compilation-and-caches"
                                    },
                                    {
                                        "text": "支持 Gradle 插件变体",
                                        "link": "gradle-plugin-variants"
                                    }
                                ]
                            },
                            {
                                "text": "Maven",
                                "link": "maven"
                            },
                            {
                                "text": "Ant",
                                "link": "ant"
                            }
                        ]
                    },
                    {
                        "text": "Kotlin 开发的 IDE",
                        "link": "kotlin-ide"
                    },
                    {
                        "text": "迁移到 Kotlin 代码风格",
                        "link": "code-style-migration-guide"
                    },
                    {
                        "text": "Kotlin Notebook",
                        "link": "kotlin-notebook-overview"
                    },
                    {
                        "text": "使用 Kotlin 的 Lets-Plot 进行数据可视化",
                        "link": "lets-plot"
                    },
                    {
                        "text": "运行代码片段",
                        "link": "run-code-snippets"
                    },
                    {
                        "text": "Kotlin 和 TeamCity 的持续集成",
                        "link": "kotlin-and-ci"
                    },
                    {
                        "text": "Kotlin 代码文档：KDoc",
                        "link": "kotlin-doc"
                    },
                    {
                        "text": "Kotlin 和 OSGi",
                        "link": "kotlin-osgi"
                    }
                ]
            },
            {
                "text": t['kotlin.compiler-plugins'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.compiler-plugins.kotlin-compiler'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "K2 编译器迁移指南",
                                "link": "k2-compiler-migration-guide"
                            },
                            {
                                "text": "Kotlin 命令行编译器",
                                "link": "command-line"
                            },
                            {
                                "text": "Kotlin 编译器选项",
                                "link": "compiler-reference"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.compiler-plugins.kotlin-compiler-plugins'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "全开放编译器插件",
                                "link": "all-open-plugin"
                            },
                            {
                                "text": "无参数编译器插件",
                                "link": "no-arg-plugin"
                            },
                            {
                                "text": "带有接收器的 SAM 转换编译器插件",
                                "link": "sam-with-receiver-plugin"
                            },
                            {
                                "text": "kapt编译器插件",
                                "link": "kapt"
                            },
                            {
                                "text": "Lombok 编译器插件",
                                "link": "lombok"
                            },
                            {
                                "text": "Power-assert 编译器插件",
                                "link": "power-assert"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.compiler-plugins.compose-compiler'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Compose 编译器迁移指南",
                                "link": "compose-compiler-migration-guide"
                            },
                            {
                                "text": "Compose 编译器选项 DSL",
                                "link": "compose-compiler-options"
                            }
                        ]
                    },
                    {
                        "text": "Kotlin Symbol Processing API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin 符号处理 API",
                                "link": "ksp-overview"
                            },
                            {
                                "text": "KSP 快速入门",
                                "link": "ksp-quickstart"
                            },
                            {
                                "text": "为什么选择 KSP",
                                "link": "ksp-why-ksp"
                            },
                            {
                                "text": "KSP 示例",
                                "link": "ksp-examples"
                            },
                            {
                                "text": "KSP 如何对 Kotlin 代码建模",
                                "link": "ksp-additional-details"
                            },
                            {
                                "text": "Java 注解处理器到 KSP 参考",
                                "link": "ksp-reference"
                            },
                            {
                                "text": "增量处理",
                                "link": "ksp-incremental"
                            },
                            {
                                "text": "多轮处理",
                                "link": "ksp-multi-round"
                            },
                            {
                                "text": "使用 Kotlin Multiplatform 的 KSP",
                                "link": "ksp-multiplatform"
                            },
                            {
                                "text": "通过命令行运行 KSP",
                                "link": "ksp-command-line"
                            },
                            {
                                "text": "KSP 常见问题",
                                "link": "ksp-faq"
                            }
                        ]
                    }
                ]
            },
            {
                "text": t['kotlin.materials'],
                "collapsed": true,
                "items": [
                    {
                        "text": "学习材料概述",
                        "link": "learning-materials-overview"
                    },
                    {
                        "text": "Kotlin by example",
                        "href": "https://play.kotlinlang.org/byExample/overview"
                    },
                    {
                        "text": "Kotlin 考研",
                        "link": "koans"
                    },
                    {
                        "text": "Kotlin Core track",
                        "href": "https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23"
                    },
                    {
                        "text": "Kotlin 实践",
                        "link": "kotlin-hands-on"
                    },
                    {
                        "text": "Kotlin 小贴士",
                        "link": "kotlin-tips"
                    },
                    {
                        "text": "Kotlin 书籍",
                        "link": "books"
                    },
                    {
                        "text": "使用惯用的 Kotlin 解决 Advent of Code 谜题",
                        "link": "advent-of-code"
                    },
                    {
                        "text": t['kotlin.materials.ide'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "通过 JetBrains Academy 插件学习 Kotlin",
                                "link": "edu-tools-learner"
                            },
                            {
                                "text": "使用 JetBrains Academy 插件教授 Kotlin",
                                "link": "edu-tools-educator"
                            }
                        ]
                    }
                ]
            },
            {
                "text": t['kotlin.eap'],
                "collapsed": true,
                "items": [
                    {
                        "text": "参与 Kotlin 抢先体验预览",
                        "link": "eap"
                    },
                    {
                        "text": "为 EAP 配置你的构建",
                        "link": "configure-build-for-eap"
                    }
                ]
            },
            {
                "text": t['kotlin.others'],
                "collapsed": true,
                "items": [
                    {
                        "text": "常见问题解答",
                        "link": "faq"
                    },
                    {
                        "text": t['kotlin.others.compatibility-guide'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin 2.1 兼容性指南",
                                "link": "compatibility-guide-21"
                            },
                            {
                                "text": "Kotlin 2.0 兼容性指南",
                                "link": "compatibility-guide-20"
                            },
                            {
                                "text": "Kotlin 1.9 兼容性指南",
                                "link": "compatibility-guide-19"
                            },
                            {
                                "text": "Kotlin 1.8 兼容性指南",
                                "link": "compatibility-guide-18"
                            },
                            {
                                "text": "Kotlin 1.7.20 兼容性指南",
                                "link": "compatibility-guide-1720"
                            },
                            {
                                "text": "Kotlin 1.7 兼容性指南",
                                "link": "compatibility-guide-17"
                            },
                            {
                                "text": "Kotlin 1.6 兼容性指南",
                                "link": "compatibility-guide-16"
                            },
                            {
                                "text": "Kotlin 1.5 兼容性指南",
                                "link": "compatibility-guide-15"
                            },
                            {
                                "text": "Kotlin 1.4 兼容性指南",
                                "link": "compatibility-guide-14"
                            },
                            {
                                "text": "Kotlin 1.3 兼容性指南",
                                "link": "compatibility-guide-13"
                            },
                            {
                                "text": "兼容模式",
                                "link": "compatibility-modes"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.others.foundation'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin 基金会",
                                "href": "https://kotlinfoundation.org/"
                            },
                            {
                                "text": "语言委员会指南",
                                "href": "https://kotlinfoundation.org/language-committee-guidelines/"
                            },
                            {
                                "text": "提交不兼容变更",
                                "href": "https://kotlinfoundation.org/submitting-incompatible-changes/"
                            },
                            {
                                "text": "品牌使用",
                                "href": "https://kotlinfoundation.org/guidelines/"
                            },
                            {
                                "text": "Kotlin 基金会常见问题",
                                "href": "https://kotlinfoundation.org/faq/"
                            }
                        ]
                    },
                    {
                        "text": "Google Summer of Code",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "Kotlin 与 Google 编程之夏",
                                "link": "gsoc-overview"
                            },
                            {
                                "text": "Kotlin 2025 年 Google 编程之夏",
                                "link": "gsoc-2025"
                            },
                            {
                                "text": "2024 年 Kotlin 的 Google 编程之夏活动",
                                "link": "gsoc-2024"
                            },
                            {
                                "text": "Kotlin 与 Google Summer of Code 2023",
                                "link": "gsoc-2023"
                            }
                        ]
                    },
                    {
                        "text": "安全性",
                        "link": "security"
                    },
                    {
                        "text": "Kotlin 文档的 PDF 版本",
                        "link": "kotlin-pdf"
                    },
                    {
                        "text": t['kotlin.others.community'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "贡献",
                                "link": "contribute"
                            },
                            {
                                "text": "KUG 指南",
                                "link": "kug-guidelines"
                            },
                            {
                                "text": "Kotlin Night 指南",
                                "link": "kotlin-night-guidelines"
                            },
                            {
                                "text": "Kotlin Slack 的行为准则和指南",
                                "link": "slack-code-of-conduct"
                            }
                        ]
                    },
                    {
                        "text": "Kotlin 品牌资源",
                        "link": "kotlin-brand-assets"
                    },
                    {
                        "text": t['kotlin.others.news-kit'],
                        "href": "https://kotlinlang.org/assets/kotlin-media-kit.pdf"
                    }
                ]
            }
        ],
        sqldelight: [
            {
                "text": "SQLDelight",
                "items": [
                    {
                        "text": "概述",
                        "link": "index"
                    },
                    {
                        "text": "升级到 2.0",
                        "link": "upgrading-2.0"
                    },
                    {
                        "text": "更新日志",
                        "link": "changelog"
                    },
                    {
                        "text": "贡献",
                        "link": "contributing"
                    },
                    {
                        "text": "行为准则",
                        "link": "code_of_conduct"
                    }
                ]
            },
            {
                "text": "SQLite (Android)",
                "collapsed": true,
                "items": [
                    {
                        "text": "入门指南",
                        "link": "android_sqlite/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "外键",
                                "link": "android_sqlite/foreign_keys"
                            },
                            {
                                "text": "类型投影",
                                "link": "android_sqlite/custom_projections"
                            },
                            {
                                "text": "参数",
                                "link": "android_sqlite/query_arguments"
                            },
                            {
                                "text": "类型",
                                "link": "android_sqlite/types"
                            },
                            {
                                "text": "事务",
                                "link": "android_sqlite/transactions"
                            },
                            {
                                "text": "语句分组",
                                "link": "android_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": "扩展",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "RxJava",
                                "link": "android_sqlite/rxjava"
                            },
                            {
                                "text": "协程",
                                "link": "android_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "android_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": "迁移",
                        "link": "android_sqlite/migrations"
                    },
                    {
                        "text": "测试",
                        "link": "android_sqlite/testing"
                    },
                    {
                        "text": "IntelliJ 插件",
                        "link": "android_sqlite/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "android_sqlite/gradle"
                    },
                    {
                        "text": "2.x API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "coroutines-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/coroutines-extensions/index.html"
                            },
                            {
                                "text": "rxjava2-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/rxjava2-extensions/index.html"
                            },
                            {
                                "text": "rxjava3-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/rxjava3-extensions/index.html"
                            },
                            {
                                "text": "androidx-paging3",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/androidx-paging3/index.html"
                            },
                            {
                                "text": "android-driver",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/drivers/android-driver/index.html"
                            },
                            {
                                "text": "runtime",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/runtime/index.html"
                            }
                        ]
                    },
                    {
                        "text": "资源",
                        "link": "android_sqlite/resources"
                    }
                ]
            },
            {
                "text": "SQLite (多平台)",
                "collapsed": true,
                "items": [
                    {
                        "text": "入门指南",
                        "link": "multiplatform_sqlite/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "外键",
                                "link": "multiplatform_sqlite/foreign_keys"
                            },
                            {
                                "text": "类型投影",
                                "link": "multiplatform_sqlite/custom_projections"
                            },
                            {
                                "text": "参数",
                                "link": "multiplatform_sqlite/query_arguments"
                            },
                            {
                                "text": "类型",
                                "link": "multiplatform_sqlite/types"
                            },
                            {
                                "text": "事务",
                                "link": "multiplatform_sqlite/transactions"
                            },
                            {
                                "text": "语句分组",
                                "link": "multiplatform_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": "扩展",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "协程",
                                "link": "multiplatform_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "multiplatform_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": "迁移",
                        "link": "multiplatform_sqlite/migrations"
                    },
                    {
                        "text": "IntelliJ 插件",
                        "link": "multiplatform_sqlite/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "multiplatform_sqlite/gradle"
                    },
                    {
                        "text": "资源",
                        "link": "multiplatform_sqlite/resources"
                    },
                    {
                        "text": "2.x API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "coroutines-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/coroutines-extensions/index.html"
                            },
                            {
                                "text": "runtime",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/runtime/index.html"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "MySQL (JVM)",
                "collapsed": true,
                "items": [
                    {
                        "text": "入门指南",
                        "link": "jvm_mysql/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "类型投影",
                                "link": "jvm_mysql/custom_projections"
                            },
                            {
                                "text": "参数",
                                "link": "jvm_mysql/query_arguments"
                            },
                            {
                                "text": "类型",
                                "link": "jvm_mysql/types"
                            },
                            {
                                "text": "事务",
                                "link": "jvm_mysql/transactions"
                            },
                            {
                                "text": "语句分组",
                                "link": "jvm_mysql/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": "扩展",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "AndroidX Paging",
                                "link": "jvm_mysql/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": "迁移",
                        "link": "jvm_mysql/migrations"
                    },
                    {
                        "text": "IntelliJ 插件",
                        "link": "jvm_mysql/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "jvm_mysql/gradle"
                    },
                    {
                        "text": "2.x API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "jdbc-driver",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/drivers/jdbc-driver/index.html"
                            },
                            {
                                "text": "runtime",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/runtime/index.html"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "PostgreSQL (JVM)",
                "collapsed": true,
                "items": [
                    {
                        "text": "入门指南",
                        "link": "jvm_postgresql/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "类型投影",
                                "link": "jvm_postgresql/custom_projections"
                            },
                            {
                                "text": "参数",
                                "link": "jvm_postgresql/query_arguments"
                            },
                            {
                                "text": "类型",
                                "link": "jvm_postgresql/types"
                            },
                            {
                                "text": "事务",
                                "link": "jvm_postgresql/transactions"
                            },
                            {
                                "text": "语句分组",
                                "link": "jvm_postgresql/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": "扩展",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "AndroidX Paging",
                                "link": "jvm_postgresql/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": "迁移",
                        "link": "jvm_postgresql/migrations"
                    },
                    {
                        "text": "IntelliJ 插件",
                        "link": "jvm_postgresql/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "jvm_postgresql/gradle"
                    },
                    {
                        "text": "2.x API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "jdbc-driver",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/drivers/jdbc-driver/index.html"
                            },
                            {
                                "text": "runtime",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/runtime/index.html"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "HSQL (JVM)",
                "collapsed": true,
                "items": [
                    {
                        "text": "入门指南",
                        "link": "jvm_h2/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "类型投影",
                                "link": "jvm_h2/custom_projections"
                            },
                            {
                                "text": "参数",
                                "link": "jvm_h2/query_arguments"
                            },
                            {
                                "text": "类型",
                                "link": "jvm_h2/types"
                            },
                            {
                                "text": "事务",
                                "link": "jvm_h2/transactions"
                            },
                            {
                                "text": "语句分组",
                                "link": "jvm_h2/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": "扩展",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "AndroidX Paging",
                                "link": "jvm_h2/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": "迁移",
                        "link": "jvm_h2/migrations"
                    },
                    {
                        "text": "IntelliJ 插件",
                        "link": "jvm_h2/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "jvm_h2/gradle"
                    },
                    {
                        "text": "2.x API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "jdbc-driver",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/drivers/jdbc-driver/index.html"
                            },
                            {
                                "text": "runtime",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/runtime/index.html"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "SQLite (Native)",
                "collapsed": true,
                "items": [
                    {
                        "text": "入门指南",
                        "link": "native_sqlite/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "外键",
                                "link": "native_sqlite/foreign_keys"
                            },
                            {
                                "text": "类型投影",
                                "link": "native_sqlite/custom_projections"
                            },
                            {
                                "text": "参数",
                                "link": "native_sqlite/query_arguments"
                            },
                            {
                                "text": "类型",
                                "link": "native_sqlite/types"
                            },
                            {
                                "text": "事务",
                                "link": "native_sqlite/transactions"
                            },
                            {
                                "text": "语句分组",
                                "link": "native_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": "扩展",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "协程",
                                "link": "native_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "native_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": "迁移",
                        "link": "native_sqlite/migrations"
                    },
                    {
                        "text": "IntelliJ 插件",
                        "link": "native_sqlite/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "native_sqlite/gradle"
                    },
                    {
                        "text": "2.x API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "coroutines-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/coroutines-extensions/index.html"
                            },
                            {
                                "text": "native-driver",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/drivers/native-driver/index.html"
                            },
                            {
                                "text": "runtime",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/runtime/index.html"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "SQLite (JVM)",
                "collapsed": true,
                "items": [
                    {
                        "text": "入门指南",
                        "link": "jvm_sqlite/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "外键",
                                "link": "jvm_sqlite/foreign_keys"
                            },
                            {
                                "text": "类型投影",
                                "link": "jvm_sqlite/custom_projections"
                            },
                            {
                                "text": "参数",
                                "link": "jvm_sqlite/query_arguments"
                            },
                            {
                                "text": "类型",
                                "link": "jvm_sqlite/types"
                            },
                            {
                                "text": "事务",
                                "link": "jvm_sqlite/transactions"
                            },
                            {
                                "text": "语句分组",
                                "link": "jvm_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": "扩展",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "RxJava",
                                "link": "jvm_sqlite/rxjava"
                            },
                            {
                                "text": "协程",
                                "link": "jvm_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "jvm_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": "迁移",
                        "link": "jvm_sqlite/migrations"
                    },
                    {
                        "text": "IntelliJ 插件",
                        "link": "jvm_sqlite/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "jvm_sqlite/gradle"
                    },
                    {
                        "text": "2.x API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "coroutines-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/coroutines-extensions/index.html"
                            },
                            {
                                "text": "rxjava2-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/rxjava2-extensions/index.html"
                            },
                            {
                                "text": "rxjava3-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/rxjava3-extensions/index.html"
                            },
                            {
                                "text": "sqlite-driver",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/drivers/sqlite-driver/index.html"
                            },
                            {
                                "text": "runtime",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/runtime/index.html"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "SQLite (JS)",
                "collapsed": true,
                "items": [
                    {
                        "text": "入门指南",
                        "link": "js_sqlite/index"
                    },
                    {
                        "text": "多平台",
                        "link": "js_sqlite/multiplatform"
                    },
                    {
                        "text": "Web Workers",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "SQL.js Worker",
                                "link": "js_sqlite/sqljs_worker"
                            },
                            {
                                "text": "自定义 Workers",
                                "link": "js_sqlite/custom_worker"
                            }
                        ]
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "类型投影",
                                "link": "js_sqlite/custom_projections"
                            },
                            {
                                "text": "参数",
                                "link": "js_sqlite/query_arguments"
                            },
                            {
                                "text": "类型",
                                "link": "js_sqlite/types"
                            },
                            {
                                "text": "事务",
                                "link": "js_sqlite/transactions"
                            },
                            {
                                "text": "语句分组",
                                "link": "js_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": "扩展",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "协程",
                                "link": "js_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "js_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": "迁移",
                        "link": "js_sqlite/migrations"
                    },
                    {
                        "text": "IntelliJ 插件",
                        "link": "js_sqlite/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "js_sqlite/gradle"
                    },
                    {
                        "text": "2.x API",
                        "collapsed": true,
                        "items": [
                            {
                                "text": "coroutines-extensions",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/extensions/coroutines-extensions/index.html"
                            },
                            {
                                "text": "sqljs-driver",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/drivers/sqljs-driver/index.html"
                            },
                            {
                                "text": "runtime",
                                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/runtime/index.html"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "2.x API",
                "href": "https://sqldelight.github.io/sqldelight/latest/2.x/index.html"
            }
        ]
    }
}

/**
 * Extracts the title from a markdown file
 * @param rootDir - The root directory path where markdown files are located
 * @param filePath - The relative path to the markdown file (without extension)
 * @returns The title from the markdown frontmatter, or null if not found
 */
function getTitleFromMarkdownFile(rootDir, filePath) {
    const fullPath = path.join(rootDir, `${filePath}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const content = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(content);
    return data.title || null;
}


/**
 * Recursively traverses the sidebar configuration and transforms each item
 * @param config - The original sidebar configuration array
 * @param sidebarPrefixDir - The prefix directory path for sidebar links
 * @param relativePrefixDir - The relative prefix directory path for markdown files
 * @returns Transformed sidebar configuration with updated text and links
 */
function traversalConfig(config, sidebarPrefixDir, relativePrefixDir) {
    return config.map((item) => {
        let itemLink: string | undefined = undefined;
        if (item.href) {
            itemLink = item.href;
        } else {
            itemLink = item.link ? `${sidebarPrefixDir}${item.link}` : undefined;
        }
        if (item.items) {
            return {
                ...item,
                text: getTitleFromMarkdownFile(relativePrefixDir, item.link) || item.text,
                link: itemLink,
                items: traversalConfig(item.items, sidebarPrefixDir, relativePrefixDir)
            };
        } else {
            return {
                ...item,
                text: getTitleFromMarkdownFile(relativePrefixDir, item.link) || item.text,
                link: itemLink,
            };
        }
    });
}

/**
 * Generates sidebar items for documentation navigation
 * @param locale - The locale code for internationalization (default: "zh-hans")
 * @param docsConfig - Configuration object containing documentation settings
 * @returns An array of sidebar items with localized text and links
 */
export default function generateSidebarItems(localeConfig: SideLocaleConfig, docsConfig: DocsItemConfig) {
    let sidebarPrefixDir = localeConfig.lang === "zh-hans" ? docsConfig.path : path.posix.join(localeConfig.lang, docsConfig.path);
    const relativePrefixDir = path.posix.join("docs", sidebarPrefixDir);
    sidebarPrefixDir = path.posix.join("/", sidebarPrefixDir);
    const sidebars = traversalConfig(createI18nSideBarConfig(localeConfig.messages)[docsConfig.type], sidebarPrefixDir, relativePrefixDir)
    // fs.writeFileSync(
    //     path.join("docs", `${localeConfig.lang}-${docsConfig.type}.json`),
    //     JSON.stringify(sidebars, null, 2),
    //     "utf-8"
    // );
    return sidebars;
}