[//]: # (title: Kotlin Language Server)
<primary-label ref="alpha"/>

<web-summary>Kotlin Language Server 是 JetBrains 为 Kotlin 提供的官方 LSP 实现，支持 VS Code、代码补全、诊断、格式设置和重构。</web-summary>

[Kotlin Language Server](https://github.com/Kotlin/kotlin-lsp) 是 JetBrains 为 Kotlin 提供的 [语言服务器协议 (LSP)](https://microsoft.github.io/language-server-protocol/) 官方实现。

该服务器基于 IntelliJ IDEA、IntelliJ IDEA Kotlin 插件、JetBrains AIR 以及 Fleet。它旨在与任何支持 LSP 的代码编辑器协作。

> [IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio) 提供最佳的 Kotlin 开发体验。
>
{style="note"}

## Visual Studio Code 中的 Kotlin

Kotlin Language Server 为 [Visual Studio Code](https://code.visualstudio.com/) 提供官方 Kotlin 语言支持。

如果您使用 Visual Studio Code 进行 Kotlin 开发，请从 Visual Studio Marketplace 安装官方的 [Kotlin by JetBrains](https://marketplace.visualstudio.com/items?itemName=JetBrains.kotlin-server) 扩展程序。

要激活 **Kotlin by JetBrains** 扩展程序，请在 Visual Studio Code 中打开一个 Kotlin 项目，然后打开任意 Kotlin 文件。

## 支持的功能

Kotlin Language Server 包含核心语言功能，例如：

* 支持最新的 Kotlin 语言版本
* 基于 IntelliJ 的代码补全
* 基于 IntelliJ 的针对 Kotlin 和 `kotlinx.*` 库的诊断及快速修复
* JVM 项目的构建系统支持：Gradle、Maven 以及实验性的 Android Gradle Plugin 支持

  > Kotlin Multiplatform 项目的支持正在开发中。
  >
  {style="tip"}

* 语义高亮显示
* 整理导入
* 重命名重构
* 代码格式设置
* 文档导航和悬停支持
* 调用层次结构
* 代码折叠

## 反馈

Kotlin Language Server 正处于积极开发中，Alpha 阶段的反馈尤为宝贵。

如果您遇到问题或想提出改进建议，请在 [Kotlin LSP 仓库](https://github.com/Kotlin/kotlin-lsp)中提交。

## 下一步

* 浏览 [GitHub 上的 Kotlin Language Server 仓库](https://github.com/Kotlin/kotlin-lsp)