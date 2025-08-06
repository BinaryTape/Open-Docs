[//]: # (title: Kotlin 开发的 IDE)

<web-summary>JetBrains 为 IntelliJ IDEA 和 Android Studio 提供官方的 Kotlin IDE 支持。</web-summary>

JetBrains 为以下 IDE 和代码编辑器提供官方的 Kotlin 支持：
[IntelliJ IDEA](#intellij-idea) 和 [Android Studio](#android-studio)。

其他 IDE 和代码编辑器仅提供 Kotlin 社区支持的插件。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一款专为 Kotlin 和 Java 等 JVM 语言设计的 IDE，旨在最大限度地提升开发者生产力。
它通过提供智能代码补全、静态代码分析和重构功能，为你处理日常和重复性任务。
它让你能专注于软件开发的亮点，使其不仅高效，而且令人愉悦。

Kotlin 插件捆绑在每个 IntelliJ IDEA 版本发布中。
每个 IDEA 版本发布都引入了新特性和升级，以改进 Kotlin 开发者在 IDE 中的体验。
关于 Kotlin 的最新更新和改进，请参见 [IntelliJ IDEA 新特性](https://www.jetbrains.com/idea/whatsnew/)。

关于 IntelliJ IDEA 的更多信息，请参阅[官方文档](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)。

## Android Studio

[Android Studio](https://developer.android.com/studio) 是 Android 应用开发的官方 IDE，基于 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
在 IntelliJ 强大的代码编辑器和开发者工具的基础上，Android Studio 还提供更多特性，可在你构建 Android 应用时提升生产力。

Kotlin 插件捆绑在每个 Android Studio 版本发布中。

关于 Android Studio 的更多信息，请参阅[官方文档](https://developer.android.com/studio/intro)。

## Eclipse

[Eclipse](https://eclipseide.org/release/) 允许开发者使用不同的编程语言编写应用程序，包括 Kotlin。
它也拥有 Kotlin 插件：该插件最初由 JetBrains 开发，现在由 Kotlin 社区贡献者提供支持。

你可以从 [Marketplace 手动安装 Kotlin 插件](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)。

Kotlin 团队管理 Eclipse 版 Kotlin 插件的开发和贡献过程。
如果你想为该插件做贡献，请向其 [GitHub 版本库](https://github.com/Kotlin/kotlin-eclipse)发送拉取请求。

## Kotlin 语言版本的兼容性

对于 IntelliJ IDEA 和 Android Studio，Kotlin 插件捆绑在每个版本发布中。
当新的 Kotlin 版本发布时，这些工具将自动建议将 Kotlin 更新到最新版本。
关于最新支持的语言版本，请参见 [Kotlin 版本发布](releases.md#ide-support)。

## 其他 IDE 支持

JetBrains 不为其他 IDE 提供 Kotlin 插件。
但是，一些其他 IDE 和源代码编辑器，例如 Eclipse、Visual Studio Code 和 Atom，拥有由 Kotlin 社区支持的专属 Kotlin 插件。

你可以使用任何文本编辑器编写 Kotlin 代码，但无法使用 IDE 相关特性：例如代码格式化、调试工具等等。
要在文本编辑器中使用 Kotlin，你可以从 Kotlin [GitHub 版本发布](%kotlinLatestUrl%)下载最新的 Kotlin 命令行编译器 (``kotlin-compiler-%kotlinVersion%.zip``) 并[手动安装](command-line.md#manual-install)。
此外，你也可以使用包管理器，例如 [Homebrew](command-line.md#homebrew)、[SDKMAN!](command-line.md#sdkman) 和 [Snap package](command-line.md#snap-package)。

## 下一步？

* [使用 IntelliJ IDEA IDE 启动你的第一个项目](jvm-get-started.md)
* [使用 Android Studio 创建你的第一个跨平台移动应用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)