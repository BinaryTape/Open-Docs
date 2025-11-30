# 多平台 Jetpack 库如何打包

Compose Multiplatform 将 Jetpack Compose 及其相关的 AndroidX 库的全部强大能力带到了除 Android 之外的其他平台。如 [Android Developers 网站](https://developer.android.com/kotlin/multiplatform) 所示，许多 Jetpack 库（例如 `androidx.annotation`）由 Android 团队以完全多平台的形式发布，并可以直接在 KMP 项目中使用。而其他库，例如 Compose 本身、Navigation、Lifecycle 和 ViewModel，则需要额外的支持才能在公共代码中工作。

JetBrains 的 Compose Multiplatform 团队会为除 Android 之外的其他平台生成这些库的 artifact，然后将它们与原始 Android artifact 一同发布到一个统一的 group ID 下。这样，当你将此类多平台依赖项添加到你的公共源代码集时，你的应用程序的 Android 分发版会使用 Android artifact。同时，其他目标平台的分发版会使用为相应平台构建的 artifact。

这是该过程的概览：

![](androidx-cmp-artifacts.svg)

例如，“iOS 版 Navigation artifact” 指的是以下多平台 artifact 集合：
* `org.jetbrains.androidx.navigation.navigation-compose-uikitarm64`
* `org.jetbrains.androidx.navigation.navigation-compose-uikitsimarm64`
* `org.jetbrains.androidx.navigation.navigation-common-iosx64`
* `org.jetbrains.androidx.navigation.navigation-runtime-iossimulatorarm64`
* 等等。

所有这些 artifact，连同其他平台的 artifact 以及对原始 Android 库（`androidx.navigation.navigation-compose`）的引用，都作为一个组发布。它们可以通过统一的 `org.jetbrains.androidx.navigation.navigation-compose` 依赖项进行访问。Compose Multiplatform Gradle 插件负责处理平台特有的 artifact 到分发版的映射。

通过这种方法，带有该依赖项的 Kotlin Multiplatform (KMP) 项目所生成的 Android 应用会使用原始的 Android Navigation 库。另一方面，iOS 应用则使用由 JetBrains 构建的相应 iOS 库。

## 适用于多平台项目的 Compose 包

在基础 Compose 库中，核心的 `androidx.compose.runtime` 是完全多平台的。（[先前使用的](whats-new-compose-190.md#multiplatform-targets-in-androidx-compose-runtime-runtime) `org.jetbrains.compose.runtime` artifact 现在作为别名。）此外，Compose Multiplatform 还实现了：
* `androidx.compose.ui` 和 `androidx.compose.foundation` 的多平台版本，它们在 Compose Multiplatform 项目中以 `org.jetbrains.compose.ui` 和 `org.jetbrains.compose.foundation` 的形式提供。
* `androidx.compose.material3` 和 `androidx.compose.material` 的多平台版本，它们以类似的方式打包（`org.jetbrains.compose.material3` 和 `org.jetbrains.compose.material`）。与其他库不同，Material 3 库不与 Compose Multiplatform 版本耦合。因此，你可以不使用 `material3` 别名，而是提供直接依赖项。例如，你可能使用抢先体验预览版本。
* Material 3 adaptive 库作为独立的 artifact（`org.jetbrains.compose.material3.adaptive:adaptive*`）

## 其他多平台库

构建 Compose 应用所需的一些功能性超出了 AndroidX 的范围，因此 JetBrains 将其实现为随 Compose Multiplatform 捆绑的多平台库，例如：

* Compose Multiplatform Gradle 插件，它：
    * 提供用于配置 Compose Multiplatform 项目的 Gradle DSL。
    * 帮助为桌面和 Web 目标平台创建分发包。
    * 支持多平台资源库正确地为每个目标平台提供资源。
* `org.jetbrains.compose.components.resources`，它提供对 [跨平台资源](compose-multiplatform-resources.md) 的支持。
* `org.jetbrains.compose.components.uiToolingPreview`，它支持在 IntelliJ IDEA 和 Android Studio 中对公共代码进行 Compose UI 预览。
* `org.jetbrains.compose.components.animatedimage`，它支持显示动画图片。
* `org.jetbrains.compose.components.splitpane`，它实现了 Swing 的 [JSplitPane](https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html) 的一个模拟。