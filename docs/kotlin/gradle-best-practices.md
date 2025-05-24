---
title: "Gradle 最佳实践"
---
[Gradle](https://docs.gradle.org/current/userguide/userguide.html) 是许多 Kotlin 项目使用的构建系统，用于自动化和管理构建过程。

充分利用 Gradle 对于减少管理和等待构建的时间，从而将更多时间用于编码至关重要。 在这里，我们提供了一系列最佳实践，分为两个关键领域：**组织 (organizing)** 和 **优化 (optimizing)** 你的项目。

## 组织 (Organize)

本节重点介绍如何构建 Gradle 项目，以提高清晰度、可维护性和可扩展性。

### 使用 Kotlin DSL

使用 Kotlin DSL 而不是传统的 Groovy DSL。 这样可以避免学习另一种语言，并获得严格类型的优势。 严格类型使 IDE 能够为重构和自动完成提供更好的支持，从而提高开发效率。

在 [Gradle 的 Kotlin DSL 入门](https://docs.gradle.org/current/userguide/kotlin_dsl.html) 中查找更多信息。

阅读 Gradle 的 [博客](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)，了解 Kotlin DSL 如何成为 Gradle 构建的默认设置。

### 使用版本目录 (version catalog)

在 `libs.versions.toml` 文件中使用版本目录 (version catalog) 来集中依赖管理。 这样你就可以在项目中一致地定义和重用版本、库和插件。

```kotlin
[versions]
kotlinxCoroutines = "1.10.1"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

将以下依赖项添加到你的 `build.gradle.kts` 文件中：

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

在 Gradle 的文档中了解更多关于 [依赖管理基础知识](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog) 的信息。

### 使用约定插件 (convention plugins)

使用约定插件 (convention plugins) 来封装和重用多个构建文件中的通用构建逻辑。 将共享配置移动到插件中有助于简化和模块化你的构建脚本。

虽然初始设置可能比较耗时，但一旦完成，就可以轻松维护和添加新的构建逻辑。

在 Gradle 的文档中了解更多关于 [约定插件 (Convention plugins)](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins) 的信息。

## 优化 (Optimize)

本节提供了一些策略，用于提高 Gradle 构建的性能和效率。

### 使用本地构建缓存 (local build cache)

使用本地构建缓存 (local build cache) 通过重用其他构建产生的输出来节省时间。 构建缓存可以检索你已经创建的任何早期构建的输出。

在 Gradle 的文档中了解更多关于 [构建缓存 (Build cache)](https://docs.gradle.org/current/userguide/build_cache.html) 的信息。

### 使用配置缓存 (configuration cache)

:::note
配置缓存 (configuration cache) 尚不支持所有核心 Gradle 插件。 有关最新信息，请参阅 Gradle 的 [支持插件表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)。

:::

使用配置缓存 (configuration cache) 通过缓存配置阶段的结果并在后续构建中重用它来显着提高构建性能。 如果 Gradle 检测到构建配置或相关依赖项中没有更改，它将跳过配置阶段。

在 Gradle 的文档中了解更多关于 [配置缓存 (Configuration cache)](https://docs.gradle.org/current/userguide/configuration_cache.html) 的信息。

### 提高多个目标的构建时间

当你的多平台项目包含多个目标时，`build` 和 `assemble` 等任务可能会为每个目标多次编译相同的代码，从而导致更长的编译时间。

如果你正在积极开发和测试特定平台，请运行相应的 `linkDebug*` 任务。

有关更多信息，请参阅 [提高编译时间的技巧](native-improving-compilation-time#gradle-configuration)。

### 从 kapt 迁移到 KSP

如果你正在使用依赖于 [kapt](kapt) 编译器插件的库，请检查是否可以切换到使用 [Kotlin 符号处理 (KSP) API](ksp-overview) 代替。 KSP API 通过减少注解处理时间来提高构建性能。 KSP 比 kapt 更快更有效，因为它直接处理源代码，而无需生成中间 Java 存根。

有关迁移步骤的指导，请参阅 Google 的 [迁移指南](https://developer.android.com/build/migrate-to-ksp)。

要了解更多关于 KSP 与 kapt 的比较，请查看 [为什么选择 KSP](ksp-why-ksp)。

### 使用模块化 (modularization)

:::note
模块化 (modularization) 仅对中型到大型项目有利。 它不为基于微服务架构的项目提供优势。

:::

使用模块化的项目结构来提高构建速度并实现更轻松的并行开发。 将你的项目构建为一个根项目和一个或多个子项目。 如果更改仅影响其中一个子项目，Gradle 将仅重建该特定子项目。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

在 Gradle 的文档中了解更多关于 [使用 Gradle 构建项目](https://docs.gradle.org/current/userguide/multi_project_builds.html) 的信息。

### 设置 CI/CD

通过使用增量构建和缓存依赖项来设置 CI/CD 流程，从而显着减少构建时间。 添加持久存储或使用远程构建缓存 (remote build cache) 可以看到这些好处。 此过程不必耗时，因为某些提供商（如 [GitHub](https://github.com/features/actions)）几乎可以开箱即用地提供此服务。

浏览 Gradle 社区关于 [将 Gradle 与持续集成系统结合使用](https://cookbook.gradle.org/ci/) 的 cookbook。

### 使用远程构建缓存 (remote build cache)

与 [本地构建缓存 (local build cache)](#use-local-build-cache) 类似，远程构建缓存 (remote build cache) 通过重用其他构建的输出来帮助你节省时间。 它可以从任何人都已经运行过的任何早期构建中检索任务输出，而不仅仅是上一次构建。

远程构建缓存 (remote build cache) 使用缓存服务器来跨构建共享任务输出。 例如，在具有 CI/CD 服务器的开发环境中，服务器上的所有构建都会填充远程缓存。 当你检出主分支以开始新功能时，你可以立即访问增量构建。

请记住，缓慢的互联网连接可能会使传输缓存结果比在本地运行任务更慢。

在 Gradle 的文档中了解更多关于 [构建缓存 (Build cache)](https://docs.gradle.org/current/userguide/build_cache.html) 的信息。