[//]: # (title: 通过 Amper 配置项目)

[Amper](https://amper.org) 是 JetBrains 创建的一款新工具，可帮助你配置项目以进行构建、打包、发布等。使用 Amper，你可以减少处理构建系统的时间，转而专注于解决实际的业务挑战。

Amper 允许你为可在 JVM、Android、iOS、macOS、Windows 和 Linux 上运行的 Kotlin Multiplatform 应用程序，以及可与所有这些受支持的目标平台协同工作的多平台库创建配置文件。

> Amper 当前为[实验性的](supported-platforms.md#general-kotlin-stability-levels)。
> 欢迎你在 Kotlin Multiplatform 项目中使用它。
> 我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供反馈意见。
>
{style="warning"}

## Amper 的工作原理

Amper 是一个独立的 CLI 应用程序，允许你使用 YAML 文件配置项目。

借助 Amper，你可以设置平台特有的应用程序和共享 Kotlin 库。它们使用特殊的声明式 DSL 在 `module.yaml` 清单文件中声明为模块。

此 DSL 的核心概念是 Kotlin Multiplatform。Amper 允许你快速轻松地配置 Kotlin Multiplatform 项目，而无需深入复杂的概念。Amper DSL 提供了特殊的语法，使你能够处理多平台配置，包括依赖项、设置等。

以下是适用于 JVM、Android 和 iOS 应用程序的 Kotlin Multiplatform 共享库的 Amper 模块文件示例：

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64, iosX64 ]

# 共享 Compose Multiplatform 依赖项：
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# 仅限 Android 的依赖项  
dependencies@android:
  # 将 Compose 与 activity 集成
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

settings:
  # 启用 Kotlin 序列化
  kotlin:
    serialization: json

  # 启用 Compose Multiplatform 框架
  compose: enabled
```

*   `product` 部分定义了项目类型和目标平台列表。
*   `dependencies` 部分添加了 Maven 依赖项，未来可能支持平台特有的包管理器，例如 CocoaPods 和 Swift Package Manager。
*   `@platform` 限定符标记平台特有的部分，包括依赖项和设置。

## 试用 Amper

请查阅 Amper 的[快速入门指南](https://jb.gg/amper/get-started)以亲自试用。

欢迎将你的任何反馈意见提交到我们的[问题跟踪器](https://jb.gg/amper-issues)。你的反馈将帮助我们塑造 Amper 的未来。

## 接下来

*   查看 [JetBrains 博客](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)，了解更多关于我们创建 Amper 的动机、其用例、项目的当前状态及其未来。
*   访问 [Amper 网站](https://amper.org)以阅读指南和全面的文档。