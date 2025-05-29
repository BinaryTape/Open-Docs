[//]: # (title: Gradle 最佳实践)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) 是许多 Kotlin 项目用于自动化和管理构建过程的构建系统。

充分利用 Gradle 对于帮助你减少管理和等待构建的时间、增加编码时间至关重要。本文提供了两方面的最佳实践：**组织**和**优化**你的项目。

## 组织

本节重点介绍如何构建你的 Gradle 项目，以提高清晰度、可维护性和可扩展性。

### 使用 Kotlin DSL

使用 Kotlin DSL 而非传统的 Groovy DSL。你无需学习另一种语言，并能获得严格类型检查的好处。严格类型检查让 IDE 能提供更好的重构和自动补全支持，从而提高开发效率。

在 [Gradle 的 Kotlin DSL 入门](https://docs.gradle.org/current/userguide/kotlin_dsl.html)中查找更多信息。

阅读 Gradle 关于 Kotlin DSL 成为新 Gradle 构建默认值的[博客](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)。

### 使用版本目录

使用 `libs.versions.toml` 文件中的版本目录来集中管理依赖项。这使你能够在项目中一致地定义和重用版本、库和插件。

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

在你的 `build.gradle.kts` 文件中添加以下依赖项：

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

在 Gradle 关于[依赖项管理基础](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)的文档中了解更多。

### 使用约定插件

<primary-label ref="advanced"/>

使用约定插件来封装和重用多个构建文件中的通用构建逻辑。将共享配置移到插件中有助于简化构建脚本并使其模块化。

虽然初始设置可能很耗时，但一旦完成，维护和添加新的构建逻辑就很容易了。

在 Gradle 关于[约定插件](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)的文档中了解更多。

## 优化

本节提供了提高 Gradle 构建性能和效率的策略。

### 使用本地构建缓存

使用本地构建缓存，通过重用其他构建产生的输出节省时间。构建缓存可以从你之前创建的任何构建中检索输出。

在 Gradle 关于其[构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)的文档中了解更多。

### 使用配置缓存

> 配置缓存尚不支持所有核心 Gradle 插件。有关最新信息，请参阅 Gradle 的[支持插件列表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)。
>
{style="note"}

使用配置缓存可以显著提高构建性能，它会缓存配置阶段的结果并在后续构建中重用。如果 Gradle 检测到构建配置或相关依赖项没有变化，它会跳过配置阶段。

在 Gradle 关于其[配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)的文档中了解更多。

### 缩短多目标的构建时间

当你的多平台项目包含多个目标时，像 `build` 和 `assemble` 这样的任务可能会为每个目标多次编译相同的代码，导致编译时间延长。

如果你正在积极开发和测试某个特定平台，请转而运行相应的 `linkDebug*` 任务。

有关更多信息，请参阅[提高编译时间的技巧](native-improving-compilation-time.md#gradle-configuration)。

### 从 kapt 迁移到 KSP

如果你正在使用的库依赖于 [kapt](kapt.md) 编译器插件，请检查是否可以改用 [Kotlin Symbol Processing (KSP) API](ksp-overview.md)。KSP API 通过减少注解处理时间来提高构建性能。KSP 比 kapt 更快、更高效，因为它直接处理源代码，而无需生成中间 Java 存根 (Java stubs)。

有关迁移步骤的指导，请参阅 Google 的[迁移指南](https://developer.android.com/build/migrate-to-ksp)。

要了解 KSP 如何与 kapt 进行比较，请查看[为什么选择 KSP](ksp-why-ksp.md)。

### 使用模块化

<primary-label ref="advanced"/>

> 模块化仅对中型到大型项目有利。对于基于微服务架构的项目，它不提供优势。
>
{style="note"}

使用模块化项目结构来提高构建速度并实现更简单的并行开发。将项目结构化为一个根项目和一个或多个子项目。如果更改仅影响其中一个子项目，Gradle 只会重新构建该特定子项目。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

在 Gradle 关于[使用 Gradle 组织项目](https://docs.gradle.org/current/userguide/multi_project_builds.html)的文档中了解更多。

### 设置 CI/CD
<primary-label ref="advanced"/>

设置 CI/CD 流程，通过使用增量构建和缓存依赖项来显著减少构建时间。添加持久化存储或使用远程构建缓存以获得这些好处。这个过程不一定耗时，因为像 [GitHub](https://github.com/features/actions) 这样的一些提供商几乎开箱即用地提供了这项服务。

探索 Gradle 社区关于[使用 Gradle 与持续集成系统](https://cookbook.gradle.org/ci/)的实践手册。

### 使用远程构建缓存
<primary-label ref="advanced"/>

与[本地构建缓存](#use-local-build-cache)类似，远程构建缓存通过重用其他构建的输出帮助你节省时间。它可以检索任何人已运行过的任何早期构建的任务输出，而不仅仅是最近一次的。

远程构建缓存使用缓存服务器来在构建之间共享任务输出。例如，在有 CI/CD 服务器的开发环境中，服务器上的所有构建都会填充远程缓存。当你检出主分支以开始新功能开发时，你可以立即访问增量构建。

请记住，缓慢的互联网连接可能会使缓存结果的传输速度慢于在本地运行任务。

在 Gradle 关于其[构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)的文档中了解更多。