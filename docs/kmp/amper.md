[//]: # (title: 通过 Amper 配置项目)

[Amper](https://github.com/JetBrains/amper/tree/HEAD) 是 JetBrains 创建的一款新工具，可帮助你配置项目以进行构建、打包、发布等。使用 Amper，你可以减少处理构建系统的时间，转而专注于解决实际的业务挑战。

Amper 允许你为可在 JVM、Android、iOS、macOS 和 Linux 上运行的 Kotlin 多平台应用程序以及可与所有这些受支持的目标平台协同工作的多平台库创建配置文件。

> Amper 当前为[实验性的](supported-platforms.md#general-kotlin-stability-levels)。
> 欢迎你在 Kotlin 多平台项目中使用它。
> 我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供反馈意见。
>
{style="warning"}

## Amper 的工作原理

Amper 当前使用 Gradle 作为后端，YAML 作为定义项目配置的前端。它支持自定义任务、CocoaPods、向 Maven 发布库以及通过 Gradle 互操作打包桌面应用程序。

借助 Amper，你可以为平台特有的应用程序和共享 Kotlin 库设置配置。它们使用特殊的声明式 DSL 在 `.yaml` 模块清单文件中声明为模块。

此 DSL 的核心概念是 Kotlin 多平台。Amper 允许你快速轻松地配置 Kotlin 多平台项目，而无需深入复杂的 Gradle 概念。Amper DSL 提供了特殊的语法，使你能够处理多平台配置，包括依赖项、设置等。

以下是适用于 JVM、Android 和 iOS 应用程序的 Kotlin 多平台共享库的 Amper 清单文件示例：

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64, iosX64 ]

# 共享 Compose 多平台依赖项：
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# 仅限 Android 的依赖项
dependencies@android:
  # 将 Compose 与 Activity 集成
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

# 仅限 iOS 的依赖项，依赖于 CocoaPod
# 请注意，CocoaPods 依赖项尚未在原型中实现
dependencies@ios:
  - pod: 'FirebaseCore'
    version: '~> 6.6'

settings:
  # 启用 Kotlin 序列化
  kotlin:
    serialization: json

  # 启用 Compose 多平台框架
  compose: enabled
```

* `product` 部分定义了项目类型和目标平台列表。
* `dependencies` 部分不仅添加了 Kotlin 和 Maven 依赖项，还添加了平台特有的包管理器，例如 CocoaPods 和 Swift Package Manager。
* `@platform` 限定符标记平台特有的部分，包括依赖项和设置。

## 试用 Amper

你可以通过以下方式之一试用 Amper：

* 将 [IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/) 2023.3 及更高版本用于 JVM 和 Android 项目（从构建版本 233.11555 开始）。
* 使用 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 从命令行或 CI/CD 工具构建 Amper 项目。

按照[本教程](https://github.com/JetBrains/amper/tree/HEAD/docs/Tutorial.md)创建你的第一个 Kotlin 多平台项目。查阅[文档](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)以了解更多关于 Amper 的功能和设计。

欢迎将你的任何反馈意见提交到我们的[问题跟踪器](https://youtrack.jetbrains.com/issues/AMPER)。你的输入将帮助我们塑造 Amper 的未来。

## 接下来

* 查看 [JetBrains 博客](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)，了解更多关于我们创建 Amper 的动机、其用例、项目的当前状态及其未来。
* 关于最常见问题，请参见 [Amper FAQ](https://github.com/JetBrains/amper/tree/HEAD/docs/FAQ.md)。
* 关于 Amper 的功能和设计，请参阅 [Amper 文档](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)，其中涵盖了 Amper 的不同方面。