[//]: # (title: Android 专用组件)

Compose Multiplatform 基于 [Jetpack Compose](https://developer.android.com/jetpack/compose) 构建。Compose Multiplatform 的大部分功能适用于所有平台。然而，有些 API 和库只能在 Android 目标中使用。这要么是因为它们是 Android 专有的，要么是因为它们尚未被移植到其他平台。本页面总结了 Compose Multiplatform API 的这些部分。

> 有时，在 [Jetpack Compose 文档](https://developer.android.com/jetpack/compose/documentation)或社区创建的文章中，您可能会发现仅限在 Android 目标中使用的 API。如果您尝试在 `commonMain` 代码中使用它，您的 IDE 会提示该 API 不可用。
>
{style="note"}

## Android 专用 API

Android 专用 API 是 Android 特有的，在其他平台上不可用。这是因为其他平台不需要 Android 使用的某些概念。该 API 通常使用 `android.*` 软件包中的类或配置 Android 特有的行为。以下是 Android 专用 API 的一些示例：

* [`android.context.Context`](https://developer.android.com/reference/android/content/Context) 类
* [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext()) 和 [`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration()) 变量
* [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory) 和 [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) 类
* [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap()) 函数
* [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) 类
* [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0)) 函数
* [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView) 类
* [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView()) 变量
* [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt) 函数
* [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 依赖注入库

通常情况下，没有充分的理由将此类 API 的部分内容通用化，因此最好将其仅保留在 `androidMain` 中。

## 签名中包含 Android 类的 API

Compose Multiplatform 中的某些 API 在其签名中使用了 `android.*`、`androidx.*`（不包括 `androidx.compose.*`），但它们的行为也适用于其他平台：

* [资源管理](https://developer.android.com/jetpack/compose/resources)：用于资源管理的 `stringResource`、`animatedVectorResource`、`Font` 以及 `*.R` 类。有关更多信息，请参阅[图像与资源](compose-multiplatform-resources.md)。
* [导航](https://developer.android.com/jetpack/compose/navigation)。有关更多信息，请参阅[导航与路由](compose-navigation-routing.md)。
* [`ViewModel`](https://developer.android.com/jetpack/compose/libraries#viewmodel) 类。
* [Paging](https://developer.android.com/jetpack/compose/libraries#paging) 库。
* [`ConstraintLayout`](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout) 布局。
* [Maps](https://developer.android.com/jetpack/compose/libraries#maps) 库。
* [预览](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary)工具以及用于预览[桌面](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)应用程序的插件。
* [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 类。
* 其他尚未移植到 Compose Multiplatform 的 Jetpack Compose 库。

这些内容可能会在未来根据复杂程度和需求被移植到 `commonMain`。

开发应用程序时经常使用的 API，例如权限、设备（蓝牙、GPS、相机）和 IO（网络、文件、数据库），不属于 Compose Multiplatform 的范畴。
<!-- 要寻找替代解决方案，请参阅[搜索多平台库](search-libs.md)。 -->

## 签名中不含 Android 类的 API

即使某些 API 的签名不包含 `android.*` 或 `androidx.*` 类，且该 API 适用于其他平台，它们也可能仅在 Android 目标中可用。这背后的原因通常是该实现在很大程度上使用了平台特性，编写其他平台的实现需要一定时间。

通常，这类 API 会在 Jetpack Compose 的 Android 目标中引入后，被移植到 Compose Multiplatform。

在 Compose Multiplatform %org.jetbrains.compose% 中，以下 API 在 `commonMain` 中**不可用**：

* [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt) 函数
* [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt) 函数
* [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt) 函数
* [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt) 变量
* [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
* [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) 库
* [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 库

## 请求移植 Android API

对于每个可以从 Android 移植的 API，在 Compose Multiplatform [YouTrack](https://youtrack.jetbrains.com/issues/CMP) 中都有一个**待解决的问题**。如果您发现某个 API 可以从 Android 移植并通用化，但目前还没有相关的问题，请[创建一个](https://youtrack.jetbrains.com/newIssue?project=CMP)。