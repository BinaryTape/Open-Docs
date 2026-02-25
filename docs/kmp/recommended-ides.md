[//]: # (title: 推荐的 IDE 和代码编辑器)

## IntelliJ IDEA 和 Android Studio

[IntelliJ IDEA](https://www.jetbrains.com/idea/) 提供完整的 Kotlin Multiplatform 支持。
[Android Studio](https://developer.android.com/studio) 是 Kotlin Multiplatform 的另一个稳定解决方案。
由于两者都基于 IntelliJ 平台构建，它们通常共享相同的功能。
但是，特定更新可能不会同时发布。

从 IntelliJ IDEA 2025.2.2 或 Android Studio Otter 2025.2.1 开始，
您可以安装 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)，
该插件为 iOS 应用提供基本的启动和调试功能、运行前环境检查以及其他有用的 KMP 功能。

除了基础的 Kotlin Multiplatform 功能外，该插件还支持 Compose Multiplatform
库，从而实现更舒适的 UI 开发：

* 多平台资源的便利性自动化。
* 支持在通用 Compose 代码中运行的 `@Preview` 注解。
* 支持 [Compose Hot Reload](compose-hot-reload.md)，包括自动检测热重载运行配置、
  IDE 与日志和设置的集成，以及
  定制的 IDE 操作和工具栏，使整体体验更加顺畅。

## Xcode

如果您在 Kotlin Multiplatform 项目中以 iOS 为目标，则需要在您的计算机上安装 [Xcode](https://developer.apple.com/xcode/)，
以便编写 iOS 特定代码并运行 iOS 应用程序。

要将您的应用上传到 App Store Connect，请使用 Xcode 16 或更高版本进行构建。

## 其他 IDE 和代码编辑器

如果基本的 Kotlin Multiplatform 支持对您来说已经足够，您可以使用任何支持 Kotlin 的 IDE。