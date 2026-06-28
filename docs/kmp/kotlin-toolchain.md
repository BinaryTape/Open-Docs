[//]: # (title: 使用 Kotlin Toolchain 进行项目配置)

[Kotlin Toolchain](https://kotlin-toolchain.org/) 是由 JetBrains 开发的一款工具，旨在帮助您配置项目，用于构建、打包、发布等。使用 Kotlin Toolchain，您可以减少处理构建系统的时间，从而专注于解决实际的业务挑战。

Kotlin Toolchain 允许您为在 JVM、Android、iOS、macOS、Windows 和 Linux 上运行的 Kotlin Multiplatform 应用程序，以及适用于所有这些受支持目标的多平台库创建配置文件。

> Kotlin Toolchain 正处于 [Alpha](supported-platforms.md#general-kotlin-stability-levels) 阶段。
> 欢迎在您的 Kotlin Multiplatform 项目中尝试使用。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) 中提供反馈。
>
{style="warning"}

## Kotlin Toolchain 的工作原理

Kotlin Toolchain 是一个独立的命令行应用程序，允许使用 YAML 文件配置您的项目。

使用 Kotlin Toolchain，您可以设置特定平台的应用程序和共享的 Kotlin 库。它们在 `module.yaml` 清单文件中使用特殊的声明式 DSL 声明为模块。

该 DSL 的核心概念是 Kotlin Multiplatform。Kotlin Toolchain 允许您快速、轻松地配置 Kotlin Multiplatform 项目，而无需深入研究复杂的概念。Kotlin Toolchain DSL 提供了一种特殊的语法，使您能够处理多平台配置，包括依赖项、设置等。

以下是一个 Kotlin 模块文件的示例，该模块用于一个可与 JVM、Android 和 iOS 应用程序配合使用的 Kotlin Multiplatform 共享库：

```yaml
product:
  type: kmp/lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64 ]

# 共享的 Compose Multiplatform 依赖项：
dependencies:
  - $compose.foundation: exported
  - $compose.material3: exported

# 仅限 Android 的依赖项  
dependencies@android:
  # 将 Compose 与 Activity 集成
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

settings:
  # 启用 Kotlin 序列化
  kotlin:
    serialization: json

  # 启用 Compose Multiplatform 框架
  compose:
    enabled: true
```

* `product` 部分定义了项目类型和目标平台列表。
* `dependencies` 部分添加了 Maven 依赖项，未来可能会支持特定平台的软件包管理器，例如 CocoaPods 和 Swift Package Manager。
* `$compose` 命名空间是一个内置的库目录，提供对所有可选 Compose 模块的访问。
* `@platform` 限定符标记了特定平台的各个部分，包括依赖项和设置。

## 尝试使用 Kotlin Toolchain

查看 Kotlin Toolchain 的[快速入门指南](https://kotlin-toolchain.org/dev/getting-started/)以亲自尝试。

欢迎随时向我们的[问题跟踪器](https://jb.gg/amper-issues)提交您的任何反馈。您的意见将帮助我们塑造 Kotlin Toolchain 的未来。

## 下一步

<!---
* 访问 [JetBrains 博客](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience) 
  以详细了解我们开发 Kotlin Toolchain 的动力、 
  它的用例、项目的当前状态以及未来发展。
-->
* 访问 [Kotlin Toolchain 网站](https://kotlin-toolchain.org)阅读指南和全面的文档。