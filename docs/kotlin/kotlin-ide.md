[//]: # (title: Kotlin 开发的 IDE)
[//]: # (description: JetBrains 为 IntelliJ IDEA 和 Android Studio 提供官方 Kotlin IDE 支持。)

JetBrains 为以下 IDE 和代码编辑器提供官方 Kotlin 支持：
[IntelliJ IDEA](#intellij-idea) 和 [Android Studio](#android-studio)。

其他 IDE 和代码编辑器仅有社区支持的 Kotlin 插件。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一款专为 JVM 语言（如 Kotlin 和 Java）设计的 IDE，旨在最大化开发者生产力。
它通过提供智能代码补全、静态代码分析和重构，为你完成常规和重复性任务。
它让你专注于软件开发的亮点，使其不仅富有成效，而且成为一种愉快的体验。

Kotlin 插件捆绑在每个 IntelliJ IDEA 版本中。
每个 IDEA 版本都会引入新功能和升级，以改善 Kotlin 开发者在 IDE 中的体验。
请参阅 [IntelliJ IDEA 新特性](https://www.jetbrains.com/idea/whatsnew/) 以了解 Kotlin 的最新更新和改进。

在[官方文档](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)中阅读更多关于 IntelliJ IDEA 的信息。

## Android Studio

[Android Studio](https://developer.android.com/studio) 是 Android 应用开发的官方 IDE，基于 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
在 IntelliJ 强大的代码编辑器和开发者工具之上，Android Studio 提供了更多功能，可在构建 Android 应用时提高你的生产力。

Kotlin 插件捆绑在每个 Android Studio 版本中。

在[官方文档](https://developer.android.com/studio/intro)中阅读更多关于 Android Studio 的信息。

## Eclipse

[Eclipse](https://eclipseide.org/release/) 允许开发者使用不同的编程语言（包括 Kotlin）编写应用程序。
它也拥有 Kotlin 插件：最初由 JetBrains 开发，现在该 Kotlin 插件由 Kotlin 社区贡献者支持。

你可以从 [Marketplace 手动安装 Kotlin 插件](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)。

Kotlin 团队管理 Eclipse 的 Kotlin 插件的开发和贡献过程。
如果你想为该插件贡献代码，请向其 [GitHub 仓库](https://github.com/Kotlin/kotlin-eclipse)发送拉取请求 (pull request)。

## 与 Kotlin 语言版本的兼容性

对于 IntelliJ IDEA 和 Android Studio，Kotlin 插件捆绑在每个版本中。
当新的 Kotlin 版本发布时，这些工具将自动建议将 Kotlin 更新到最新版本。
请参阅 [Kotlin 版本](releases.md#ide-support)中的最新支持语言版本。

## 其他 IDE 支持

JetBrains 不为其他 IDE 提供 Kotlin 插件。
然而，一些其他的 IDE 和源代码编辑器（如 Eclipse、Visual Studio Code 和 Atom）拥有各自由 Kotlin 社区支持的 Kotlin 插件。

你可以使用任何文本编辑器编写 Kotlin 代码，但没有 IDE 相关功能：代码格式化、调试工具等。
要在文本编辑器中使用 Kotlin，你可以从 Kotlin [GitHub Releases](%kotlinLatestUrl%) 下载最新的 Kotlin 命令行编译器 (`kotlin-compiler-%kotlinVersion%.zip`) 并[手动安装](command-line.md#manual-install)。
此外，你还可以使用包管理器，如 [Homebrew](command-line.md#homebrew)、[SDKMAN!](command-line.md#sdkman) 和 [Snap package](command-line.md#snap-package)。

## 接下来？

* [使用 IntelliJ IDEA IDE 启动你的第一个项目](jvm-get-started.md)
* [使用 Android Studio 创建你的第一个跨平台移动应用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)