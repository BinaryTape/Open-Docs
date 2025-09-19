[//]: # (title: Gradle 最佳实践)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) 是一个构建系统，许多 Kotlin 项目使用它来自动化和管理构建过程。

充分利用 Gradle 至关重要，它能帮助你减少管理和等待构建的时间，将更多时间用于编码。本文将一套最佳实践分为两个主要领域：**组织**和**优化**你的项目。

## 组织

本节重点介绍如何构建 Gradle 项目，以提高清晰度、可维护性和可伸缩性。

### 使用 Kotlin DSL

使用 Kotlin DSL 代替传统的 Groovy DSL。这样可以避免学习另一种语言，并获得严格类型带来的优势。严格类型支持 IDE 提供更好的重构和自动补全支持，从而提高开发效率。

关于更多信息，请参阅 [Gradle 的 Kotlin DSL 入门指南](https://docs.gradle.org/current/userguide/kotlin_dsl.html)。

关于 Kotlin DSL 成为 Gradle 构建的默认选项，请参阅 Gradle 的[博客](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)。

### 使用版本目录

在 `libs.versions.toml` 文件中使用版本目录来集中管理依赖项。这使你能够在项目之间一致地定义和重用版本、库和插件。

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

将以下依赖项添加到你的 `build.gradle.kts` 文件中：

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

关于 [依赖项管理基础知识](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)，请参阅 Gradle 的文档。

### 使用约定插件

<primary-label ref="advanced"/>

使用约定插件可在多个构建文件之间封装和重用通用构建逻辑。将共享配置移入插件有助于简化构建脚本并使其模块化。

尽管初始设置可能耗时，但一旦完成，后续维护和添加新的构建逻辑将变得容易。

关于 [约定插件](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)，请参阅 Gradle 的文档。

## 优化

本节提供了提升 Gradle 构建性能和效率的策略。

### 使用本地构建缓存

使用本地构建缓存，通过重用其他构建产生的输出节省时间。构建缓存可以从你已创建的任何早期构建中检索输出。

关于 [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)，请参阅 Gradle 的文档。

### 使用配置缓存

> 配置缓存尚不支持所有核心 Gradle 插件。有关最新信息，请参阅 Gradle 的
> [支持插件表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)。
>
{style="note"}

使用配置缓存可显著提升构建性能，它通过缓存配置阶段的结果并在后续构建中重用该结果。如果 Gradle 检测到构建配置或相关依赖项没有变化，它将跳过配置阶段。

关于 [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，请参阅 Gradle 的文档。

### 缩短多目标平台的构建时间

当你的多平台项目包含多个目标平台时，`build` 和 `assemble` 等任务可能会为每个目标平台多次编译相同的代码，从而导致编译时间延长。

如果你正在积极开发和测试特定平台，请转而运行相应的 `linkDebug*` 任务。

关于更多信息，请参见 [优化编译时间的技巧](native-improving-compilation-time.md#gradle-configuration)。

### 从 kapt 迁移到 KSP

如果你正在使用的库依赖于 [kapt](kapt.md) 编译器插件，请检测是否可以转而使用 [Kotlin 符号处理 (KSP) API](ksp-overview.md)。KSP API 通过减少注解处理时间来提升构建性能。KSP 比 kapt 更快、更高效，因为它直接处理源代码，而无需生成中间 Java 存根。

关于迁移步骤的指导，请参见 Google 的[迁移指南](https://developer.android.com/build/migrate-to-ksp)。

要详细了解 KSP 与 kapt 的比较，请查阅 [KSP 的优势](ksp-why-ksp.md)。

### 使用模块化

<primary-label ref="advanced"/>

> 模块化仅适用于中大型项目。对于基于微服务架构的项目，它不提供优势。
>
{style="note"}

使用模块化项目结构可以提高构建速度并实现更轻松的并行开发。将项目构建为包含一个根项目和一个或多个子项目的结构。如果更改仅影响其中一个子项目，Gradle 将仅重新构建该特定子项目。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

关于 [使用 Gradle 构建项目](https://docs.gradle.org/current/userguide/multi_project_builds.html)，请参阅 Gradle 的文档。

### 设置 CI/CD

<primary-label ref="advanced"/>

设置 CI/CD 流程可显著减少构建时间，方法是使用增量构建和缓存依赖项。添加持久化存储或使用远程构建缓存即可获得这些优势。此过程不必耗时，因为像 [GitHub](https://github.com/features/actions) 这样的某些提供商几乎提供开箱即用的此项服务。

请查阅 Gradle 社区手册中关于 [将 Gradle 与持续集成系统结合使用](https://cookbook.gradle.org/ci/) 的内容。

### 使用远程构建缓存

<primary-label ref="advanced"/>

与 [本地构建缓存](#use-local-build-cache) 类似，远程构建缓存通过重用其他构建的输出帮助你节省时间。它不仅可以从上次运行的构建中检索任务输出，还可以从任何人已运行过的任何早期构建中检索。

远程构建缓存使用缓存服务器在构建之间共享任务输出。例如，在包含 CI/CD 服务器的开发环境中，服务器上的所有构建都会填充远程缓存。当你检出主分支以开始新特性开发时，可以立即访问增量构建。

请记住，缓慢的互联网连接可能会导致传输缓存结果比在本地运行任务更慢。

关于 [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)，请参阅 Gradle 的文档。