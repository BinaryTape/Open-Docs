---
title: "Kotlin 开发的 IDE"
description: "JetBrains 为 IntelliJ IDEA 和 Android Studio 提供官方的 Kotlin IDE 支持。"
---
JetBrains 为以下 IDE 和代码编辑器提供官方的 Kotlin 支持：[IntelliJ IDEA](#intellij-idea) 和 [Android Studio](#android-studio)。

其他 IDE 和代码编辑器只有 Kotlin 社区支持的插件。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一款专为 JVM 语言（如 Kotlin 和 Java）设计的 IDE，旨在最大限度地提高开发人员的生产力。
它通过提供智能代码补全、静态代码分析和重构，为你完成日常和重复性任务。
它让你专注于软件开发的光明面，使其不仅高效，而且是一种愉快的体验。

Kotlin 插件与每个 IntelliJ IDEA 版本捆绑在一起。
每个 IDEA 版本都引入了新功能和升级，从而改善了 Kotlin 开发人员在 IDE 中的体验。
有关 Kotlin 的最新更新和改进，请参见 [IntelliJ IDEA 的新功能](https://www.jetbrains.com/idea/whatsnew/)。

在[官方文档](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)中阅读更多关于 IntelliJ IDEA 的信息。

## Android Studio

[Android Studio](https://developer.android.com/studio) 是 Android 应用程序开发的官方 IDE，它基于 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
除了 IntelliJ 强大的代码编辑器和开发工具之外，Android Studio 还提供了更多功能，可在构建 Android 应用程序时提高你的生产力。

Kotlin 插件与每个 Android Studio 版本捆绑在一起。

在 [官方文档](https://developer.android.com/studio/intro) 中阅读更多关于 Android Studio 的信息。

## Eclipse

[Eclipse](https://eclipseide.org/release/) 允许开发人员使用不同的编程语言编写应用程序，包括 Kotlin。 它也有 Kotlin 插件：最初由 JetBrains 开发，现在 Kotlin 插件由 Kotlin 社区贡献者支持。

你可以从 [Marketplace 手动安装 Kotlin 插件](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)。

Kotlin 团队管理 Eclipse 的 Kotlin 插件的开发和贡献过程。 如果你想为该插件做贡献，请将 pull request 发送到其 [GitHub 上的存储库](https://github.com/Kotlin/kotlin-eclipse)。

## 与 Kotlin 语言版本的兼容性

对于 IntelliJ IDEA 和 Android Studio，Kotlin 插件与每个版本捆绑在一起。
当新的 Kotlin 版本发布时，这些工具会自动建议将 Kotlin 更新到最新版本。
请参见 [Kotlin releases](releases#ide-support) 中最新支持的语言版本。

## 其他 IDE 支持

JetBrains 不为其他 IDE 提供 Kotlin 插件。
但是，其他一些 IDE 和源代码编辑器（如 Eclipse、Visual Studio Code 和 Atom）具有由 Kotlin 社区支持的自己的 Kotlin 插件。

你可以使用任何文本编辑器编写 Kotlin 代码，但没有与 IDE 相关的功能：代码格式化、调试工具等。
要在文本编辑器中使用 Kotlin，你可以从 Kotlin [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 下载最新的 Kotlin 命令行编译器 (`kotlin-compiler-2.1.20.zip`) 并[手动安装](command-line#manual-install) 它。
此外，你可以使用包管理器，例如 [Homebrew](command-line#homebrew)、[SDKMAN!](command-line#sdkman) 和 [Snap package](command-line#snap-package)。

## 接下来做什么？

* [使用 IntelliJ IDEA IDE 启动你的第一个项目](jvm-get-started)
* [使用 Android Studio 创建你的第一个跨平台移动应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)