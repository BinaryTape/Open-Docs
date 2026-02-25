[//]: # (title: 用于 Kotlin 开发的 IDE)

<web-summary>JetBrains 为 IntelliJ IDEA 和 Android Studio 提供官方 Kotlin IDE 支持。</web-summary>

JetBrains 为以下 IDE 和代码编辑器提供官方 Kotlin 支持：
[IntelliJ IDEA](#intellij-idea) 和 [Android Studio](#android-studio)。

其他 IDE 和代码编辑器仅提供由 Kotlin 社区支持的插件。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一款专为 JVM 语言（如 Kotlin 和 Java）设计的 IDE，旨在最大程度提高开发者生产力。
它通过提供智能代码补全、静态代码分析和重构操作，为您处理常规和重复性任务。
它让您专注于软件开发中充满乐趣的部分，使其不仅高效，而且成为一种愉快的体验。

Kotlin 插件随每个 IntelliJ IDEA 版本内置。
每个 IDEA 版本都会引入新功能和升级，以改进 IDE 中 Kotlin 开发者的体验。
请参阅 [IntelliJ IDEA 最新变化](https://www.jetbrains.com/idea/whatsnew/)以了解 Kotlin 的最新更新和改进。

在[官方文档](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)中详细了解有关 IntelliJ IDEA 的信息。

## Android Studio

[Android Studio](https://developer.android.com/studio) 是官方的 Android 应用开发 IDE，基于 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
除了 IntelliJ 强大的代码编辑器和开发者工具外， Android Studio 还提供了更多功能，可提高您构建 Android 应用时的生产力。

Kotlin 插件随每个 Android Studio 版本内置。

在[官方文档](https://developer.android.com/studio/intro)中详细了解有关 Android Studio 的信息。

## Eclipse

[Eclipse](https://eclipseide.org/release/) 允许开发者使用不同的编程语言（包括 Kotlin）编写应用程序。它也拥有 Kotlin 插件：该插件最初由 JetBrains 开发，现在由 Kotlin 社区贡献者支持。

您可以[从 Marketplace 手动安装 Kotlin 插件](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)。

Kotlin 团队负责管理 Eclipse 版 Kotlin 插件的开发和贡献流程。
如果您想为该插件做出贡献，请向其 [GitHub 上的仓库](https://github.com/Kotlin/kotlin-eclipse)发送拉取请求 (PR)。

## 与 Kotlin 语言版本的兼容性

对于 IntelliJ IDEA 和 Android Studio，Kotlin 插件随每个版本内置。
当新的 Kotlin 版本发布时，这些工具将建议自动将 Kotlin 更新到最新版本。
请参阅 [Kotlin 版本发布](releases.md#ide-support)中的最新支持语言版本。

## 其他 IDE 支持

JetBrains 不为其他 IDE 提供 Kotlin 插件。
然而，其他一些 IDE 和源编辑器（如 Eclipse、Visual Studio Code 和 Atom）拥有由 Kotlin 社区支持的自有 Kotlin 插件。

您可以使用任何文本编辑器编写 Kotlin 代码，但没有 IDE 相关功能：代码格式设置、调试工具等。
要在文本编辑器中使用 Kotlin，您可以从 Kotlin [GitHub Releases](%kotlinLatestUrl%) 下载最新的 Kotlin 命令行编译器 (`kotlin-compiler-%kotlinVersion%.zip`) 并[手动安装](command-line.md#manual-install)。
此外，您还可以使用软件包管理器，例如 [Homebrew](command-line.md#homebrew)、[SDKMAN!](command-line.md#sdkman) 和 [Snap 软件包](command-line.md#snap-package)。

## 下一步

* [在 IntelliJ IDEA 中创建控制台应用程序](jvm-get-started.md)
* [使用 Android Studio 创建您的第一个跨平台移动应用](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)