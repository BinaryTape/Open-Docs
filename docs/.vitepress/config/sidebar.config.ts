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
                "link": "kotlin-tour-welcome"
            },
            {
                "text": t['kotlin.overview'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.server-dev'],
                        "link": "server-overview"
                    },
                    {
                        "text": t['kotlin.android-platform'],
                        "link": "android-overview"
                    },
                    {
                        "text": t['kotlin.wasm'],
                        "link": "wasm-overview"
                    },
                    {
                        "text": t['kotlin.native'],
                        "link": "native-overview"
                    },
                    {
                        "text": t['kotlin.js-platform'],
                        "link": "js-overview"
                    },
                    {
                        "text": t['kotlin.data-analysis-overview'],
                        "link": "data-analysis-overview"
                    },
                    {
                        "text": t['kotlin.competitive-programming'],
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
                        "text": t['kotlin.kotlin-version-2120']
                    },
                    {
                        "link": "whatsnew21",
                        "text": t['kotlin.kotlin-version-210']
                    },
                    {
                        "link": "whatsnew-eap",
                        "text": t['kotlin.kotlin-version-22rc']
                    },
                    {
                        "text": t['kotlin.early-access'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.kotlin-version-2020'],
                                "link": "whatsnew2020"
                            },
                            {
                                "text": t['kotlin.kotlin-version-200'],
                                "link": "whatsnew20"
                            },
                            {
                                "text": t['kotlin.kotlin-version-1920'],
                                "link": "whatsnew1920"
                            },
                            {
                                "text": t['kotlin.kotlin-version-190'],
                                "link": "whatsnew19"
                            },
                            {
                                "text": t['kotlin.kotlin-version-1820'],
                                "link": "whatsnew1820"
                            },
                            {
                                "text": t['kotlin.kotlin-version-180'],
                                "link": "whatsnew18"
                            },
                            {
                                "text": t['kotlin.kotlin-version-1720'],
                                "link": "whatsnew1720"
                            },
                            {
                                "text": t['kotlin.kotlin-version-170'],
                                "link": "whatsnew17"
                            },
                            {
                                "text": t['kotlin.kotlin-version-1620'],
                                "link": "whatsnew1620"
                            },
                            {
                                "text": t['kotlin.kotlin-version-160'],
                                "link": "whatsnew16"
                            },
                            {
                                "text": t['kotlin.kotlin-version-1530'],
                                "link": "whatsnew1530"
                            },
                            {
                                "text": t['kotlin.kotlin-version-1520'],
                                "link": "whatsnew1520"
                            },
                            {
                                "text": t['kotlin.kotlin-version-150'],
                                "link": "whatsnew15"
                            },
                            {
                                "text": t['kotlin.kotlin-version-1430'],
                                "link": "whatsnew1430"
                            },
                            {
                                "text": t['kotlin.kotlin-version-1420'],
                                "link": "whatsnew1420"
                            },
                            {
                                "text": t['kotlin.kotlin-version-140'],
                                "link": "whatsnew14"
                            },
                            {
                                "text": t['kotlin.kotlin-version-130'],
                                "link": "whatsnew13"
                            },
                            {
                                "text": t['kotlin.kotlin-version-120'],
                                "link": "whatsnew12"
                            },
                            {
                                "text": t['kotlin.kotlin-version-110'],
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
                        "text": t['kotlin.roadmap'],
                        "link": "roadmap"
                    },
                    {
                        "text": t['kotlin.language-features'],
                        "link": "kotlin-language-features-and-proposals"
                    },
                    {
                        "text": t['kotlin.evolution-principles'],
                        "link": "kotlin-evolution-principles"
                    },
                    {
                        "text": t['kotlin.components-stability'],
                        "link": "components-stability"
                    },
                    {
                        "text": t['kotlin.releases'],
                        "link": "releases"
                    }
                ]
            },
            {
                "text": t['kotlin.basics'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.basic-syntax'],
                        "link": "basic-syntax"
                    },
                    {
                        "text": t['kotlin.idioms'],
                        "link": "idioms"
                    },
                    {
                        "text": t['kotlin.byexample'],
                        "href": "https://play.kotlinlang.org/byExample/overview"
                    },
                    {
                        "text": t['kotlin.coding-conventions'],
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
                                        "text": t['kotlin.basic-types'],
                                        "link": "basic-types"
                                    },
                                    {
                                        "text": t['kotlin.numbers'],
                                        "link": "numbers"
                                    },
                                    {
                                        "text": t['kotlin.unsigned-integer-types'],
                                        "link": "unsigned-integer-types"
                                    },
                                    {
                                        "text": t['kotlin.booleans'],
                                        "link": "booleans"
                                    },
                                    {
                                        "text": t['kotlin.characters'],
                                        "link": "characters"
                                    },
                                    {
                                        "text": t['kotlin.strings'],
                                        "link": "strings"
                                    },
                                    {
                                        "text": t['kotlin.arrays'],
                                        "link": "arrays"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.typecasts'],
                                "link": "typecasts"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.core-concepts-control-flow'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.control-flow'],
                                "link": "control-flow"
                            },
                            {
                                "text": t['kotlin.returns'],
                                "link": "returns"
                            },
                            {
                                "text": t['kotlin.exceptions'],
                                "link": "exceptions"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.packages'],
                        "link": "packages"
                    },
                    {
                        "text": t['kotlin.core-concepts-classes-objects'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.classes'],
                                "link": "classes"
                            },
                            {
                                "text": t['kotlin.inheritance'],
                                "link": "inheritance"
                            },
                            {
                                "text": t['kotlin.properties'],
                                "link": "properties"
                            },
                            {
                                "text": t['kotlin.interfaces'],
                                "link": "interfaces"
                            },
                            {
                                "text": t['kotlin.fun-interfaces'],
                                "link": "fun-interfaces"
                            },
                            {
                                "text": t['kotlin.visibility-modifiers'],
                                "link": "visibility-modifiers"
                            },
                            {
                                "text": t['kotlin.extensions'],
                                "link": "extensions"
                            },
                            {
                                "text": t['kotlin.data-classes'],
                                "link": "data-classes"
                            },
                            {
                                "text": t['kotlin.sealed-classes'],
                                "link": "sealed-classes"
                            },
                            {
                                "text": t['kotlin.generics'],
                                "link": "generics"
                            },
                            {
                                "text": t['kotlin.nested-classes'],
                                "link": "nested-classes"
                            },
                            {
                                "text": t['kotlin.enum-classes'],
                                "link": "enum-classes"
                            },
                            {
                                "text": t['kotlin.inline-classes'],
                                "link": "inline-classes"
                            },
                            {
                                "text": t['kotlin.object-declarations'],
                                "link": "object-declarations"
                            },
                            {
                                "text": t['kotlin.delegation'],
                                "link": "delegation"
                            },
                            {
                                "text": t['kotlin.delegated-properties'],
                                "link": "delegated-properties"
                            },
                            {
                                "text": t['kotlin.type-aliases'],
                                "link": "type-aliases"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.core-concepts-functions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.functions'],
                                "link": "functions"
                            },
                            {
                                "text": t['kotlin.lambdas'],
                                "link": "lambdas"
                            },
                            {
                                "text": t['kotlin.inline-functions'],
                                "link": "inline-functions"
                            },
                            {
                                "text": t['kotlin.operator-overloading'],
                                "link": "operator-overloading"
                            },
                            {
                                "text": t['kotlin.core-concepts-builders'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.type-safe-builders'],
                                        "link": "type-safe-builders"
                                    },
                                    {
                                        "text": t['kotlin.using-builders'],
                                        "link": "using-builders-with-builder-inference"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.null-safety'],
                        "link": "null-safety"
                    },
                    {
                        "text": t['kotlin.equality'],
                        "link": "equality"
                    },
                    {
                        "text": t['kotlin.this-expressions'],
                        "link": "this-expressions"
                    },
                    {
                        "text": t['kotlin.async-programming'],
                        "link": "async-programming"
                    },
                    {
                        "text": t['kotlin.coroutines-overview'],
                        "link": "coroutines-overview"
                    },
                    {
                        "text": t['kotlin.annotations'],
                        "link": "annotations"
                    },
                    {
                        "text": t['kotlin.destructuring-declarations'],
                        "link": "destructuring-declarations"
                    },
                    {
                        "text": t['kotlin.reflection'],
                        "link": "reflection"
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
                                "text": t['kotlin.notebooks-overview'],
                                "link": "get-started-with-kotlin-notebooks"
                            },
                            {
                                "text": t['kotlin.notebook-setup'],
                                "link": "kotlin-notebook-set-up-env"
                            },
                            {
                                "text": t['kotlin.notebook-create'],
                                "link": "kotlin-notebook-create"
                            },
                            {
                                "text": t['kotlin.notebook-dependencies'],
                                "link": "kotlin-notebook-add-dependencies"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.notebook-share'],
                        "link": "kotlin-notebook-share"
                    },
                    {
                        "text": t['kotlin.notebook-output-formats'],
                        "link": "data-analysis-notebooks-output-formats"
                    },
                    {
                        "text": t['kotlin.data-analysis.datasources'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.data-sources'],
                                "link": "data-analysis-work-with-data-sources"
                            },
                            {
                                "text": t['kotlin.web-api-sources'],
                                "link": "data-analysis-work-with-api"
                            },
                            {
                                "text": t['kotlin.db-connection'],
                                "link": "data-analysis-connect-to-db"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.data-visualization'],
                        "link": "data-analysis-visualization"
                    },
                    {
                        "text": t['kotlin.data-libraries'],
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
                                "text": t['kotlin.jvm-get-started'],
                                "link": "jvm-get-started"
                            },
                            {
                                "text": t['kotlin.java-comparison'],
                                "link": "comparison-to-java"
                            },
                            {
                                "text": t['kotlin.java-interop'],
                                "link": "java-interop"
                            },
                            {
                                "text": t['kotlin.java-to-kotlin-interop'],
                                "link": "java-to-kotlin-interop"
                            },
                            {
                                "text": "Spring",
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.spring-boot'],
                                        "collapsed": true,
                                        "items": [
                                            {
                                                "text": t['kotlin.spring-boot-start'],
                                                "link": "jvm-get-started-spring-boot"
                                            },
                                            {
                                                "text": t['kotlin.spring-boot-create'],
                                                "link": "jvm-create-project-with-spring-boot"
                                            },
                                            {
                                                "text": t['kotlin.spring-boot-data-class'],
                                                "link": "jvm-spring-boot-add-data-class"
                                            },
                                            {
                                                "text": t['kotlin.spring-boot-db'],
                                                "link": "jvm-spring-boot-add-db-support"
                                            },
                                            {
                                                "text": t['kotlin.spring-boot-crud'],
                                                "link": "jvm-spring-boot-using-crudrepository"
                                            }
                                        ]
                                    },
                                    {
                                        "text": t['kotlin.spring-framework'],
                                        "href": "https://docs.spring.io/spring-framework/docs/current/reference/html/languages.html#languages"
                                    },
                                    {
                                        "text": t['kotlin.spring-boot-kotlin'],
                                        "href": "https://spring.io/guides/tutorials/spring-boot-kotlin/"
                                    },
                                    {
                                        "text": t['kotlin.spring-webflux-kotlin'],
                                        "href": "https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.junit-test'],
                                "link": "jvm-test-using-junit"
                            },
                            {
                                "text": t['kotlin.mixing-java-kotlin'],
                                "link": "mixing-java-kotlin-intellij"
                            },
                            {
                                "text": t['kotlin.java-records'],
                                "link": "jvm-records"
                            },
                            {
                                "text": t['kotlin.platforms.java2kotlin'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.idioms-strings'],
                                        "link": "java-to-kotlin-idioms-strings"
                                    },
                                    {
                                        "text": t['kotlin.collections-guide'],
                                        "link": "java-to-kotlin-collections-guide"
                                    },
                                    {
                                        "text": t['kotlin.nullability-guide'],
                                        "link": "java-to-kotlin-nullability-guide"
                                    },
                                    {
                                        "text": t['kotlin.standard-input'],
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
                                "text": t['kotlin.native-get-started'],
                                "link": "native-get-started"
                            },
                            {
                                "text": t['kotlin.definition-file'],
                                "link": "native-definition-file"
                            },
                            {
                                "text": t['kotlin.platforms.c-interop'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.c-interop'],
                                        "link": "native-c-interop"
                                    },
                                    {
                                        "text": t['kotlin.c-primitive-mapping'],
                                        "link": "mapping-primitive-data-types-from-c"
                                    },
                                    {
                                        "text": t['kotlin.c-struct-mapping'],
                                        "link": "mapping-struct-union-types-from-c"
                                    },
                                    {
                                        "text": t['kotlin.c-function-pointers'],
                                        "link": "mapping-function-pointers-from-c"
                                    },
                                    {
                                        "text": t['kotlin.c-strings-mapping'],
                                        "link": "mapping-strings-from-c"
                                    },
                                    {
                                        "text": t['kotlin.dynamic-libraries'],
                                        "link": "native-dynamic-libraries"
                                    },
                                    {
                                        "text": t['kotlin.native-app-with-c'],
                                        "link": "native-app-with-c-and-libcurl"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.platforms.object-c-interop'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.objc-interop'],
                                        "link": "native-objc-interop"
                                    },
                                    {
                                        "text": t['kotlin.apple-framework'],
                                        "link": "apple-framework"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.native-libraries'],
                                "link": "native-libraries"
                            },
                            {
                                "text": t['kotlin.platform-libs'],
                                "link": "native-platform-libs"
                            },
                            {
                                "text": t['kotlin.platforms.memory-management'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.memory-manager'],
                                        "link": "native-memory-manager"
                                    },
                                    {
                                        "text": t['kotlin.arc-integration'],
                                        "link": "native-arc-integration"
                                    },
                                    {
                                        "text": t['kotlin.migration-guide'],
                                        "link": "native-migration-guide"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.native-debugging'],
                                "link": "native-debugging"
                            },
                            {
                                "text": t['kotlin.ios-symbolication'],
                                "link": "native-ios-symbolication"
                            },
                            {
                                "text": t['kotlin.platforms.references-tips'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.native-target-support'],
                                        "link": "native-target-support"
                                    },
                                    {
                                        "text": t['kotlin.compilation-time'],
                                        "link": "native-improving-compilation-time"
                                    },
                                    {
                                        "text": t['kotlin.binary-licenses'],
                                        "link": "native-binary-licenses"
                                    },
                                    {
                                        "text": t['kotlin.native-faq'],
                                        "link": "native-faq"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.wasm'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.wasm-get-started'],
                                "link": "wasm-get-started"
                            },
                            {
                                "text": t['kotlin.wasm-wasi'],
                                "link": "wasm-wasi"
                            },
                            {
                                "text": t['kotlin.wasm-debugging'],
                                "link": "wasm-debugging"
                            },
                            {
                                "text": t['kotlin.wasm-js-interop'],
                                "link": "wasm-js-interop"
                            },
                            {
                                "text": t['kotlin.wasm-troubleshooting'],
                                "link": "wasm-troubleshooting"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.js-platform'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.js-project-setup'],
                                "link": "js-project-setup"
                            },
                            {
                                "text": t['kotlin.running-kotlin-js'],
                                "link": "running-kotlin-js"
                            },
                            {
                                "text": t['kotlin.dev-server'],
                                "link": "dev-server-continuous-compilation"
                            },
                            {
                                "text": t['kotlin.js-debugging'],
                                "link": "js-debugging"
                            },
                            {
                                "text": t['kotlin.js-tests'],
                                "link": "js-running-tests"
                            },
                            {
                                "text": t['kotlin.js-dce'],
                                "link": "javascript-dce"
                            },
                            {
                                "text": t['kotlin.js-ir-compiler'],
                                "link": "js-ir-compiler"
                            },
                            {
                                "text": t['kotlin.js-ir-migration'],
                                "link": "js-ir-migration"
                            },
                            {
                                "text": t['kotlin.platforms.kotlin-js'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.browser-api-dom'],
                                        "link": "browser-api-dom"
                                    },
                                    {
                                        "text": t['kotlin.js-interop'],
                                        "link": "js-interop"
                                    },
                                    {
                                        "text": t['kotlin.dynamic-type'],
                                        "link": "dynamic-type"
                                    },
                                    {
                                        "text": t['kotlin.npm-packages'],
                                        "link": "using-packages-from-npm"
                                    },
                                    {
                                        "text": t['kotlin.js-to-kotlin-interop'],
                                        "link": "js-to-kotlin-interop"
                                    },
                                    {
                                        "text": t['kotlin.js-modules'],
                                        "link": "js-modules"
                                    },
                                    {
                                        "text": t['kotlin.js-reflection'],
                                        "link": "js-reflection"
                                    },
                                    {
                                        "text": t['kotlin.html-dsl'],
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
                                "text": t['kotlin.custom-script'],
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
                                "text": t['kotlin.collections-overview'],
                                "link": "collections-overview"
                            },
                            {
                                "text": t['kotlin.constructing-collections'],
                                "link": "constructing-collections"
                            },
                            {
                                "text": t['kotlin.iterators'],
                                "link": "iterators"
                            },
                            {
                                "text": t['kotlin.ranges'],
                                "link": "ranges"
                            },
                            {
                                "text": t['kotlin.sequences'],
                                "link": "sequences"
                            },
                            {
                                "text": t['kotlin.collection-operations'],
                                "link": "collection-operations"
                            },
                            {
                                "text": t['kotlin.collection-transformations'],
                                "link": "collection-transformations"
                            },
                            {
                                "text": t['kotlin.collection-filtering'],
                                "link": "collection-filtering"
                            },
                            {
                                "text": t['kotlin.collection-plus-minus'],
                                "link": "collection-plus-minus"
                            },
                            {
                                "text": t['kotlin.collection-grouping'],
                                "link": "collection-grouping"
                            },
                            {
                                "text": t['kotlin.collection-parts'],
                                "link": "collection-parts"
                            },
                            {
                                "text": t['kotlin.collection-elements'],
                                "link": "collection-elements"
                            },
                            {
                                "text": t['kotlin.collection-ordering'],
                                "link": "collection-ordering"
                            },
                            {
                                "text": t['kotlin.collection-aggregate'],
                                "link": "collection-aggregate"
                            },
                            {
                                "text": t['kotlin.collection-write'],
                                "link": "collection-write"
                            },
                            {
                                "text": t['kotlin.list-operations'],
                                "link": "list-operations"
                            },
                            {
                                "text": t['kotlin.set-operations'],
                                "link": "set-operations"
                            },
                            {
                                "text": t['kotlin.map-operations'],
                                "link": "map-operations"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.read-input'],
                        "link": "read-standard-input"
                    },
                    {
                        "text": t['kotlin.opt-in-requirements'],
                        "link": "opt-in-requirements"
                    },
                    {
                        "text": t['kotlin.scope-functions'],
                        "link": "scope-functions"
                    },
                    {
                        "text": t['kotlin.time-measurement'],
                        "link": "time-measurement"
                    }
                ]
            },
            {
                "text": t['kotlin.stdlib.official-library'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.coroutines'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.coroutines-guide'],
                                "link": "coroutines-guide"
                            },
                            {
                                "text": t['kotlin.coroutines-basics'],
                                "link": "coroutines-basics"
                            },
                            {
                                "text": t['kotlin.coroutines-channels'],
                                "link": "coroutines-and-channels"
                            },
                            {
                                "text": t['kotlin.cancellation-timeouts'],
                                "link": "cancellation-and-timeouts"
                            },
                            {
                                "text": t['kotlin.composing-functions'],
                                "link": "composing-suspending-functions"
                            },
                            {
                                "text": t['kotlin.coroutine-context'],
                                "link": "coroutine-context-and-dispatchers"
                            },
                            {
                                "text": t['kotlin.flow'],
                                "link": "flow"
                            },
                            {
                                "text": t['kotlin.channels'],
                                "link": "channels"
                            },
                            {
                                "text": t['kotlin.exception-handling'],
                                "link": "exception-handling"
                            },
                            {
                                "text": t['kotlin.shared-mutable-state'],
                                "link": "shared-mutable-state-and-concurrency"
                            },
                            {
                                "text": t['kotlin.select-expression'],
                                "link": "select-expression"
                            },
                            {
                                "text": t['kotlin.debug-coroutines'],
                                "link": "debug-coroutines-with-idea"
                            },
                            {
                                "text": t['kotlin.debug-flow'],
                                "link": "debug-flow-with-idea"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.serialization'],
                        "link": "serialization"
                    },
                    {
                        "text": t['kotlin.metadata-jvm'],
                        "link": "metadata-jvm"
                    },
                    {
                        "text": t['kotlin.lincheck'],
                        "collapsed": true,
                        "items": [
                            {
                                text: t['kotlin.lincheck-guide'],
                                link: "lincheck-guide"
                            },
                            {
                                text: t['kotlin.lincheck-intro'],
                                link: "introduction"
                            },
                            {
                                text: t['kotlin.testing-strategies'],
                                link: "testing-strategies"
                            },
                            {
                                text: t['kotlin.operation-arguments'],
                                link: "operation-arguments"
                            },
                            {
                                text: t['kotlin.constraints'],
                                link: "constraints"
                            },
                            {
                                text: t['kotlin.progress-guarantees'],
                                link: "progress-guarantees"
                            },
                            {
                                text: t['kotlin.sequential-specification'],
                                link: "sequential-specification"
                            }

                        ]
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
                        "text": t['kotlin.api.stdlib'],
                        "href": "https://kotlinlang.org/api/latest/jvm/stdlib/"
                    },
                    {
                        "text": t['kotlin.api.test'],
                        "href": "https://kotlinlang.org/api/latest/kotlin.test/"
                    },
                    {
                        "text": t['kotlin.api.coroutines'],
                        "href": "https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/"
                    },
                    {
                        "text": t['kotlin.api.serialization'],
                        "href": "https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/"
                    },
                    {
                        "text": t['kotlin.api.io'],
                        "href": "https://kotlinlang.org/api/kotlinx-io/"
                    },
                    {
                        "text": t['kotlin.api.datetime'],
                        "href": "https://kotlinlang.org/api/kotlinx-datetime/"
                    },
                    {
                        "text": t['kotlin.api.metadata'],
                        "href": "https://kotlinlang.org/api/kotlinx-metadata-jvm/"
                    },
                    {
                        "text": t['kotlin.api.ktor'],
                        "href": "https://api.ktor.io/"
                    },
                    {
                        "text": t['kotlin.api.gradle-plugin'],
                        "href": "https://kotlinlang.org/api/kotlin-gradle-plugin/"
                    }
                ]
            },
            {
                "text": t['kotlin.language.reference'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.keyword-reference'],
                        "link": "keyword-reference"
                    },
                    {
                        "text": t['kotlin.language.grammar'],
                        "href": "https://kotlinlang.org/docs/reference/grammar.html"
                    },
                    {
                        "text": t['kotlin.language.spec'],
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
                                        "text": t['kotlin.gradle'],
                                        "link": "gradle"
                                    },
                                    {
                                        "text": t['kotlin.gradle-jvm-start'],
                                        "link": "get-started-with-jvm-gradle-project"
                                    },
                                    {
                                        "text": t['kotlin.gradle-configure'],
                                        "link": "gradle-configure-project"
                                    },
                                    {
                                        "text": t['kotlin.gradle-best-practices'],
                                        "link": "gradle-best-practices"
                                    },
                                    {
                                        "text": t['kotlin.gradle-compiler-options'],
                                        "link": "gradle-compiler-options"
                                    },
                                    {
                                        "text": t['kotlin.gradle-compilation'],
                                        "link": "gradle-compilation-and-caches"
                                    },
                                    {
                                        "text": t['kotlin.gradle-plugin-variants'],
                                        "link": "gradle-plugin-variants"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.maven'],
                                "link": "maven"
                            },
                            {
                                "text": t['kotlin.ant'],
                                "link": "ant"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.dokka'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.dokka-introduction'],
                                "link": "dokka-introduction"
                            },
                            {
                                "text": t['kotlin.dokka-get-started'],
                                "link": "dokka-get-started"
                            },
                            {
                                "text": t['kotlin.dokka-run'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.dokka-gradle'],
                                        "link": "dokka-gradle"
                                    },
                                    {
                                        "text": t['kotlin.dokka-migration'],
                                        "link": "dokka-migration"
                                    },
                                    {
                                        "text": t['kotlin.dokka-maven'],
                                        "link": "dokka-maven"
                                    },
                                    {
                                        "text": t['kotlin.dokka-cli'],
                                        "link": "dokka-cli"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.dokka-output-formats'],
                                "collapsed": true,
                                "items": [
                                    {
                                        "text": t['kotlin.dokka-html'],
                                        "link": "dokka-html"
                                    },
                                    {
                                        "text": t['kotlin.dokka-markdown'],
                                        "link": "dokka-markdown"
                                    },
                                    {
                                        "text": t['kotlin.dokka-javadoc'],
                                        "link": "dokka-javadoc"
                                    }
                                ]
                            },
                            {
                                "text": t['kotlin.dokka-plugins'],
                                "link": "dokka-plugins"
                            },
                            {
                                "text": t['kotlin.dokka-docs'],
                                "link": "dokka-module-and-package-docs"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.ide'],
                        "link": "kotlin-ide"
                    },
                    {
                        "text": t['kotlin.code-style-migration'],
                        "link": "code-style-migration-guide"
                    },
                    {
                        "text": t['kotlin.kotlin-notebook'],
                        "link": "kotlin-notebook-overview"
                    },
                    {
                        "text": t['kotlin.lets-plot'],
                        "link": "lets-plot"
                    },
                    {
                        "text": t['kotlin.run-code-snippets'],
                        "link": "run-code-snippets"
                    },
                    {
                        "text": t['kotlin.ci'],
                        "link": "kotlin-and-ci"
                    },
                    {
                        "text": t['kotlin.kotlin-doc'],
                        "link": "kotlin-doc"
                    },
                    {
                        "text": t['kotlin.kotlin-osgi'],
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
                                "text": t['kotlin.k2-migration'],
                                "link": "k2-compiler-migration-guide"
                            },
                            {
                                "text": t['kotlin.command-line'],
                                "link": "command-line"
                            },
                            {
                                "text": t['kotlin.compiler-reference'],
                                "link": "compiler-reference"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.compiler-plugins.kotlin-compiler-plugins'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.all-open-plugin'],
                                "link": "all-open-plugin"
                            },
                            {
                                "text": t['kotlin.no-arg-plugin'],
                                "link": "no-arg-plugin"
                            },
                            {
                                "text": t['kotlin.sam-with-receiver-plugin'],
                                "link": "sam-with-receiver-plugin"
                            },
                            {
                                "text": t['kotlin.kapt'],
                                "link": "kapt"
                            },
                            {
                                "text": t['kotlin.lombok'],
                                "link": "lombok"
                            },
                            {
                                "text": t['kotlin.power-assert'],
                                "link": "power-assert"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.compiler-plugins.compose-compiler'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.compose-compiler-migration'],
                                "link": "compose-compiler-migration-guide"
                            },
                            {
                                "text": t['kotlin.compose-compiler-options'],
                                "link": "compose-compiler-options"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.ksp-overview'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.ksp-overview'],
                                "link": "ksp-overview"
                            },
                            {
                                "text": t['kotlin.ksp-quickstart'],
                                "link": "ksp-quickstart"
                            },
                            {
                                "text": t['kotlin.ksp-why'],
                                "link": "ksp-why-ksp"
                            },
                            {
                                "text": t['kotlin.ksp-examples'],
                                "link": "ksp-examples"
                            },
                            {
                                "text": t['kotlin.ksp-details'],
                                "link": "ksp-additional-details"
                            },
                            {
                                "text": t['kotlin.ksp-reference'],
                                "link": "ksp-reference"
                            },
                            {
                                "text": t['kotlin.ksp-incremental'],
                                "link": "ksp-incremental"
                            },
                            {
                                "text": t['kotlin.ksp-multi-round'],
                                "link": "ksp-multi-round"
                            },
                            {
                                "text": t['kotlin.ksp-multiplatform'],
                                "link": "ksp-multiplatform"
                            },
                            {
                                "text": t['kotlin.ksp-command-line'],
                                "link": "ksp-command-line"
                            },
                            {
                                "text": t['kotlin.ksp-faq'],
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
                        "text": t['kotlin.learning-materials'],
                        "link": "learning-materials-overview"
                    },
                    {
                        "text": t['kotlin.byexample'],
                        "href": "https://play.kotlinlang.org/byExample/overview"
                    },
                    {
                        "text": t['kotlin.koans'],
                        "link": "koans"
                    },
                    {
                        "text": t['kotlin.core-track'],
                        "href": "https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23"
                    },
                    {
                        "text": t['kotlin.hands-on'],
                        "link": "kotlin-hands-on"
                    },
                    {
                        "text": t['kotlin.tips'],
                        "link": "kotlin-tips"
                    },
                    {
                        "text": t['kotlin.books'],
                        "link": "books"
                    },
                    {
                        "text": t['kotlin.advent-of-code'],
                        "link": "advent-of-code"
                    },
                    {
                        "text": t['kotlin.materials.ide'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.edu-tools-learner'],
                                "link": "edu-tools-learner"
                            },
                            {
                                "text": t['kotlin.edu-tools-educator'],
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
                        "text": t['kotlin.eap-participate'],
                        "link": "eap"
                    },
                    {
                        "text": t['kotlin.eap-configure'],
                        "link": "configure-build-for-eap"
                    }
                ]
            },
            {
                "text": t['kotlin.others'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['kotlin.faq'],
                        "link": "faq"
                    },
                    {
                        "text": t['kotlin.others.compatibility-guide'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.compatibility-21'],
                                "link": "compatibility-guide-21"
                            },
                            {
                                "text": t['kotlin.compatibility-20'],
                                "link": "compatibility-guide-20"
                            },
                            {
                                "text": t['kotlin.compatibility-19'],
                                "link": "compatibility-guide-19"
                            },
                            {
                                "text": t['kotlin.compatibility-18'],
                                "link": "compatibility-guide-18"
                            },
                            {
                                "text": t['kotlin.compatibility-1720'],
                                "link": "compatibility-guide-1720"
                            },
                            {
                                "text": t['kotlin.compatibility-17'],
                                "link": "compatibility-guide-17"
                            },
                            {
                                "text": t['kotlin.compatibility-16'],
                                "link": "compatibility-guide-16"
                            },
                            {
                                "text": t['kotlin.compatibility-15'],
                                "link": "compatibility-guide-15"
                            },
                            {
                                "text": t['kotlin.compatibility-14'],
                                "link": "compatibility-guide-14"
                            },
                            {
                                "text": t['kotlin.compatibility-13'],
                                "link": "compatibility-guide-13"
                            },
                            {
                                "text": t['kotlin.compatibility-modes'],
                                "link": "compatibility-modes"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.others.foundation'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.foundation'],
                                "href": "https://kotlinfoundation.org/"
                            },
                            {
                                "text": t['kotlin.foundation-committee'],
                                "href": "https://kotlinfoundation.org/language-committee-guidelines/"
                            },
                            {
                                "text": t['kotlin.foundation-changes'],
                                "href": "https://kotlinfoundation.org/submitting-incompatible-changes/"
                            },
                            {
                                "text": t['kotlin.foundation-brand'],
                                "href": "https://kotlinfoundation.org/guidelines/"
                            },
                            {
                                "text": t['kotlin.foundation-faq'],
                                "href": "https://kotlinfoundation.org/faq/"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.gsoc'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.gsoc-overview'],
                                "link": "gsoc-overview"
                            },
                            {
                                "text": t['kotlin.gsoc-2025'],
                                "link": "gsoc-2025"
                            },
                            {
                                "text": t['kotlin.gsoc-2024'],
                                "link": "gsoc-2024"
                            },
                            {
                                "text": t['kotlin.gsoc-2023'],
                                "link": "gsoc-2023"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.security'],
                        "link": "security"
                    },
                    {
                        "text": t['kotlin.kotlin-pdf'],
                        "link": "kotlin-pdf"
                    },
                    {
                        "text": t['kotlin.others.community'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['kotlin.contribute'],
                                "link": "contribute"
                            },
                            {
                                "text": t['kotlin.kug-guidelines'],
                                "link": "kug-guidelines"
                            },
                            {
                                "text": t['kotlin.kotlin-night'],
                                "link": "kotlin-night-guidelines"
                            },
                            {
                                "text": t['kotlin.slack'],
                                "link": "slack-code-of-conduct"
                            }
                        ]
                    },
                    {
                        "text": t['kotlin.brand'],
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
                        "text": t['sqldelight.overview'],
                        "link": "index.md"
                    },
                    {
                        "text": t['sqldelight.upgrading-2.0'],
                        "link": "upgrading-2.0"
                    },
                    {
                        "text": t['sqldelight.changelog'],
                        "link": "changelog"
                    },
                    {
                        "text": t['sqldelight.contributing'],
                        "link": "contributing"
                    },
                    {
                        "text": t['sqldelight.code-of-conduct'],
                        "link": "code_of_conduct"
                    }
                ]
            },
            {
                "text": "SQLite (Android)",
                "collapsed": true,
                "items": [
                    {
                        "text": t['sqldelight.getting-started'],
                        "link": "android_sqlite/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.foreign-keys'],
                                "link": "android_sqlite/foreign_keys"
                            },
                            {
                                "text": t['sqldelight.custom-projections'],
                                "link": "android_sqlite/custom_projections"
                            },
                            {
                                "text": t['sqldelight.query-arguments'],
                                "link": "android_sqlite/query_arguments"
                            },
                            {
                                "text": t['sqldelight.types'],
                                "link": "android_sqlite/types"
                            },
                            {
                                "text": t['sqldelight.transactions'],
                                "link": "android_sqlite/transactions"
                            },
                            {
                                "text": t['sqldelight.grouping-statements'],
                                "link": "android_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.extensions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "RxJava",
                                "link": "android_sqlite/rxjava"
                            },
                            {
                                "text": t['sqldelight.coroutines'],
                                "link": "android_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "android_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.migrations'],
                        "link": "android_sqlite/migrations"
                    },
                    {
                        "text": t['sqldelight.testing'],
                        "link": "android_sqlite/testing"
                    },
                    {
                        "text": t['sqldelight.intellij-plugin'],
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
                        "text": t['sqldelight.resources'],
                        "link": "android_sqlite/resources"
                    }
                ]
            },
            {
                "text": t['sqldelight.sqlite-multiplatform'],
                "collapsed": true,
                "items": [
                    {
                        "text": t['sqldelight.getting-started'],
                        "link": "multiplatform_sqlite/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.foreign-keys'],
                                "link": "multiplatform_sqlite/foreign_keys"
                            },
                            {
                                "text": t['sqldelight.custom-projections'],
                                "link": "multiplatform_sqlite/custom_projections"
                            },
                            {
                                "text": t['sqldelight.query-arguments'],
                                "link": "multiplatform_sqlite/query_arguments"
                            },
                            {
                                "text": t['sqldelight.types'],
                                "link": "multiplatform_sqlite/types"
                            },
                            {
                                "text": t['sqldelight.transactions'],
                                "link": "multiplatform_sqlite/transactions"
                            },
                            {
                                "text": t['sqldelight.grouping-statements'],
                                "link": "multiplatform_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.extensions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.coroutines'],
                                "link": "multiplatform_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "multiplatform_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.migrations'],
                        "link": "multiplatform_sqlite/migrations"
                    },
                    {
                        "text": t['sqldelight.intellij-plugin'],
                        "link": "multiplatform_sqlite/intellij_plugin"
                    },
                    {
                        "text": "Gradle",
                        "link": "multiplatform_sqlite/gradle"
                    },
                    {
                        "text": t['sqldelight.resources'],
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
                        "text": t['sqldelight.getting-started'],
                        "link": "jvm_mysql/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.custom-projections'],
                                "link": "jvm_mysql/custom_projections"
                            },
                            {
                                "text": t['sqldelight.query-arguments'],
                                "link": "jvm_mysql/query_arguments"
                            },
                            {
                                "text": t['sqldelight.types'],
                                "link": "jvm_mysql/types"
                            },
                            {
                                "text": t['sqldelight.transactions'],
                                "link": "jvm_mysql/transactions"
                            },
                            {
                                "text": t['sqldelight.grouping-statements'],
                                "link": "jvm_mysql/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.extensions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "AndroidX Paging",
                                "link": "jvm_mysql/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.migrations'],
                        "link": "jvm_mysql/migrations"
                    },
                    {
                        "text": t['sqldelight.intellij-plugin'],
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
                        "text": t['sqldelight.getting-started'],
                        "link": "jvm_postgresql/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.custom-projections'],
                                "link": "jvm_postgresql/custom_projections"
                            },
                            {
                                "text": t['sqldelight.query-arguments'],
                                "link": "jvm_postgresql/query_arguments"
                            },
                            {
                                "text": t['sqldelight.types'],
                                "link": "jvm_postgresql/types"
                            },
                            {
                                "text": t['sqldelight.transactions'],
                                "link": "jvm_postgresql/transactions"
                            },
                            {
                                "text": t['sqldelight.grouping-statements'],
                                "link": "jvm_postgresql/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.extensions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "AndroidX Paging",
                                "link": "jvm_postgresql/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.migrations'],
                        "link": "jvm_postgresql/migrations"
                    },
                    {
                        "text": t['sqldelight.intellij-plugin'],
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
                        "text": t['sqldelight.getting-started'],
                        "link": "jvm_h2/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.custom-projections'],
                                "link": "jvm_h2/custom_projections"
                            },
                            {
                                "text": t['sqldelight.query-arguments'],
                                "link": "jvm_h2/query_arguments"
                            },
                            {
                                "text": t['sqldelight.types'],
                                "link": "jvm_h2/types"
                            },
                            {
                                "text": t['sqldelight.transactions'],
                                "link": "jvm_h2/transactions"
                            },
                            {
                                "text": t['sqldelight.grouping-statements'],
                                "link": "jvm_h2/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.extensions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "AndroidX Paging",
                                "link": "jvm_h2/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.migrations'],
                        "link": "jvm_h2/migrations"
                    },
                    {
                        "text": t['sqldelight.intellij-plugin'],
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
                        "text": t['sqldelight.getting-started'],
                        "link": "native_sqlite/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.foreign-keys'],
                                "link": "native_sqlite/foreign_keys"
                            },
                            {
                                "text": t['sqldelight.custom-projections'],
                                "link": "native_sqlite/custom_projections"
                            },
                            {
                                "text": t['sqldelight.query-arguments'],
                                "link": "native_sqlite/query_arguments"
                            },
                            {
                                "text": t['sqldelight.types'],
                                "link": "native_sqlite/types"
                            },
                            {
                                "text": t['sqldelight.transactions'],
                                "link": "native_sqlite/transactions"
                            },
                            {
                                "text": t['sqldelight.grouping-statements'],
                                "link": "native_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.extensions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.coroutines'],
                                "link": "native_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "native_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.migrations'],
                        "link": "native_sqlite/migrations"
                    },
                    {
                        "text": t['sqldelight.intellij-plugin'],
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
                        "text": t['sqldelight.getting-started'],
                        "link": "jvm_sqlite/index"
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.foreign-keys'],
                                "link": "jvm_sqlite/foreign_keys"
                            },
                            {
                                "text": t['sqldelight.custom-projections'],
                                "link": "jvm_sqlite/custom_projections"
                            },
                            {
                                "text": t['sqldelight.query-arguments'],
                                "link": "jvm_sqlite/query_arguments"
                            },
                            {
                                "text": t['sqldelight.types'],
                                "link": "jvm_sqlite/types"
                            },
                            {
                                "text": t['sqldelight.transactions'],
                                "link": "jvm_sqlite/transactions"
                            },
                            {
                                "text": t['sqldelight.grouping-statements'],
                                "link": "jvm_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.extensions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": "RxJava",
                                "link": "jvm_sqlite/rxjava"
                            },
                            {
                                "text": t['sqldelight.coroutines'],
                                "link": "jvm_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "jvm_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.migrations'],
                        "link": "jvm_sqlite/migrations"
                    },
                    {
                        "text": t['sqldelight.intellij-plugin'],
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
                        "text": t['sqldelight.getting-started'],
                        "link": "js_sqlite/index"
                    },
                    {
                        "text": t['sqldelight.multiplatform'],
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
                                "text": t['sqldelight.custom-workers'],
                                "link": "js_sqlite/custom_worker"
                            }
                        ]
                    },
                    {
                        "text": "SQL",
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.custom-projections'],
                                "link": "js_sqlite/custom_projections"
                            },
                            {
                                "text": t['sqldelight.query-arguments'],
                                "link": "js_sqlite/query_arguments"
                            },
                            {
                                "text": t['sqldelight.types'],
                                "link": "js_sqlite/types"
                            },
                            {
                                "text": t['sqldelight.transactions'],
                                "link": "js_sqlite/transactions"
                            },
                            {
                                "text": t['sqldelight.grouping-statements'],
                                "link": "js_sqlite/grouping_statements"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.extensions'],
                        "collapsed": true,
                        "items": [
                            {
                                "text": t['sqldelight.coroutines'],
                                "link": "js_sqlite/coroutines"
                            },
                            {
                                "text": "AndroidX Paging",
                                "link": "js_sqlite/androidx_paging"
                            }
                        ]
                    },
                    {
                        "text": t['sqldelight.migrations'],
                        "link": "js_sqlite/migrations"
                    },
                    {
                        "text": t['sqldelight.intellij-plugin'],
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
 * @param locale - The locale code for internationalization (default: "zh-Hans")
 * @param docsConfig - Configuration object containing documentation settings
 * @returns An array of sidebar items with localized text and links
 */
export default function generateSidebarItems(localeConfig: SideLocaleConfig, docsConfig: DocsItemConfig) {
    let sidebarPrefixDir = localeConfig.lang === "zh-Hans" ? docsConfig.path : path.posix.join(localeConfig.lang, docsConfig.path);
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
