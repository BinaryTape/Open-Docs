[//]: # (title: 使用 Amper 进行项目配置)

[Amper](https://amper.org) 是 JetBrains 开发的一款新工具，旨在帮助您配置项目的构建、打包、发布等。使用 Amper，您可以减少处理构建系统的时间，转而专注于解决实际的业务挑战。

Amper 允许您为在 JVM、Android、iOS、macOS、Windows 和 Linux 上运行的 Kotlin 多平台应用程序，以及适用于所有这些受支持目标的多平台库创建配置文件。

> Amper 目前处于 [实验性](supported-platforms.md#general-kotlin-stability-levels) 阶段。
> 欢迎在您的 Kotlin 多平台项目中尝试使用。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供的反馈。
>
{style="warning"}

## Amper 的工作原理

Amper 是一个独立的命令行应用程序，允许使用 YAML 文件配置您的项目。

使用 Amper，您可以设置特定平台的应用程序和共享 Kotlin 库。它们在 `module.yaml` 清单文件中使用特殊的声明式 DSL 声明为模块。

这个 DSL 的核心概念是 Kotlin 多平台。Amper 允许您快速轻松地配置 Kotlin 多平台项目，而无需深入研究复杂的概念。Amper DSL 提供了一种特殊的语法，使您能够处理多平台配置，包括依赖项、设置等。

以下是适用于 JVM、Android 和 iOS 应用程序的 Kotlin 多平台共享库的 Amper 模块文件示例：

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64 ]

# 共享 Compose 多平台依赖项：
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# 仅限 Android 的依赖项  
dependencies@android:
  # 将 Compose 与 Activity 集成
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

settings:
  # 启用 Kotlin 序列化
  kotlin:
    serialization: json

  # 启用 Compose 多平台框架
  compose: enabled
```

* `product` 部分定义了项目类型和目标平台列表。
* `dependencies` 部分添加了 Maven 依赖项，未来可能支持特定平台的软件包管理器，例如 CocoaPods 和 Swift Package Manager。
* `@platform` 限定符标记了特定平台的部分，包括依赖项和设置。

## 尝试 Amper

查阅 Amper 的 [快速入门指南](https://jb.gg/amper/get-started) 亲自尝试。

欢迎随时向我们的 [问题跟踪器](https://jb.gg/amper-issues) 提交您可能有的任何反馈。您的意见将帮助我们塑造 Amper 的未来。

## 下一步

* 查看 [JetBrains 博客](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)，详细了解我们开发 Amper 的动力、其用例、项目的当前状态以及未来发展。
* 访问 [Amper 网站](https://amper.org) 阅读指南和详尽文档。