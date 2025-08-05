[//]: # (title: 使用 Amper 配置项目)

[Amper](https://github.com/JetBrains/amper/tree/HEAD) 是 JetBrains 创建的一款新工具，旨在帮助您配置项目以进行构建、打包、发布等。借助 Amper，您可以减少花在构建系统上的时间，转而专注于解决实际业务挑战。

Amper 允许您为在 JVM、Android、iOS、macOS 和 Linux 上运行的 Kotlin 多平台应用程序以及支持所有这些目标平台的多平台库创建配置文件。

> Amper 目前处于[实验性的](supported-platforms.md#general-kotlin-stability-levels)阶段。
> 欢迎您在 Kotlin 多平台项目中使用它。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供反馈。
>
{style="warning"}

## Amper 的工作原理

Amper 目前使用 Gradle 作为后端，并使用 YAML 作为定义项目配置的前端。它支持自定义任务、CocoaPods、将库发布到 Maven，以及通过 Gradle 互操作打包桌面应用程序。

借助 Amper，您可以为平台特有的应用程序和共享 Kotlin 库设置配置。它们在 `.yaml` 模块清单文件中使用特殊的声明式 DSL 声明为模块。

此 DSL 的核心概念是 Kotlin Multiplatform。Amper 允许您快速轻松地配置 Kotlin 多平台项目，而无需深入研究复杂的 Gradle 概念。Amper DSL 提供特殊语法，使您能够使用多平台配置，包括依赖项、设置等。

下面是 Amper 为一个可与 JVM、Android 和 iOS 应用程序配合使用的 Kotlin 多平台共享库提供的清单文件示例：

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64, iosX64 ]

# Shared Compose Multiplatform dependencies:
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# Android-only dependencies  
dependencies@android:
  # Integration compose with activities
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

# iOS-only dependencies with a dependency on a CocoaPod
# Note that CocoaPods dependencies are not yet implemented in the prototype
dependencies@ios:
  - pod: 'FirebaseCore'
    version: '~> 6.6'

settings:
  # Enable Kotlin serialization
  kotlin:
    serialization: json

  # Enable Compose Multiplatform framework
  compose: enabled
```

* `product` 部分定义了项目类型和目标平台列表。
* `dependencies` 部分不仅添加了 Kotlin 和 Maven 依赖项，还添加了平台特有的包管理器，例如 CocoaPods 和 Swift Package Manager。
* `@platform` 限定符标记了平台特有的部分，包括依赖项和设置。

## 尝试 Amper

您可以通过以下方式之一尝试 Amper：

* 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/) 2023.3 及更高版本中用于 JVM 和 Android 项目（从构建 233.11555 开始）。
* 使用 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 从命令行或 CI/CD 工具构建 Amper 项目。

按照[本教程](https://github.com/JetBrains/amper/tree/HEAD/docs/Tutorial.md)创建您的第一个 Kotlin 多平台项目。查阅[文档](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)以了解有关 Amper 功能性和设计的更多信息。

欢迎向我们的[问题追踪器](https://youtrack.jetbrains.com/issues/AMPER)提交您可能有的任何反馈。您的意见将帮助我们塑造 Amper 的未来。

## 后续计划

* 查阅 [JetBrains 博客](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)，了解更多关于我们创建 Amper 的动机、其用例、项目的当前状态及其未来。
* 关于最常见问题，请参见 [Amper FAQ](https://github.com/JetBrains/amper/tree/HEAD/docs/FAQ.md)。
* 关于 Amper 功能性和设计的不同方面，请参阅 [Amper 文档](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)。