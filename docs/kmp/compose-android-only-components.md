[//]: # (title: 仅限 Android 的组件)

Compose Multiplatform 基于 [Jetpack Compose](https://developer.android.com/jetpack/compose) 构建。Compose Multiplatform 的大部分功能适用于所有平台。然而，有些 API 和库只能在 Android 目标平台中使用。这可能是因为它们是 Android 特有的，或者尚未移植到其他平台。本页总结了 Compose Multiplatform API 的这些部分。

> 有时，在 [Jetpack Compose 文档](https://developer.android.com/jetpack/compose/documentation) 或社区创建的文章中，你可能会发现一个只能在 Android 目标平台中使用的 API。
> 如果你尝试在 `commonMain` 代码中使用它，你的 IDE 会告诉你此 API 不可用。
>
{style="note"}

## 仅限 Android 的 API

仅限 Android 的 API 是 Android 特有的，在其他平台不可用。这是因为其他平台不需要 Android 使用的某些概念。该 API 通常使用来自 `android.*` 包中的类或配置 Android 特有的行为。以下是仅限 Android 的 API 的一些示例：

*   [`android.context.Context`](https://developer.android.com/reference/android/content/Context) 类
*   [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext()) 和 [`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration()) 变量
*   [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory) 和 [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) 类
*   [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap()) 函数
*   [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) 类
*   [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0)) 函数
*   [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView) 类
*   [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView()) 变量
*   [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt) 函数
*   [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 依赖项注入库

通常，没有充分的理由将此类 API 的部分通用化，因此最好只将其保留在 `androidMain` 中。

## 签名中包含 Android 类的 API

Compose Multiplatform 中有些 API 在其签名中使用了 `android.*`、`androidx.*`（不包括 `androidx.compose.*`）的类，但它们的行为也适用于其他平台：

*   [资源管理](https://developer.android.com/jetpack/compose/resources)：`stringResource`、`animatedVectorResource`、`Font` 以及用于资源管理的 `*.R` 类。
    关于更多信息，请参见 [图片和资源](compose-multiplatform-resources.md)。
*   [导航](https://developer.android.com/jetpack/compose/navigation)。
    关于更多信息，请参见 [导航和路由](compose-navigation-routing.md)。
*   [`ViewModel`](https://developer.android.com/jetpack/compose/libraries#viewmodel) 类。
*   [Paging](https://developer.android.com/jetpack/compose/libraries#paging) 库。
*   [`ConstraintLayout`](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout) 布局。
*   [Maps](https://developer.android.com/jetpack/compose/libraries#maps) 库。
*   [预览](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary) 工具以及用于预览 [桌面](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support) 应用程序的插件。
*   [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 类。
*   其他尚未移植到 Compose Multiplatform 的 Jetpack Compose 库。

未来，这些 API 可能会移植到 `commonMain`，具体取决于复杂性和需求。

在开发应用程序时经常使用的 API，例如权限、设备（蓝牙、GPS、摄像头）和 I/O（网络、文件、数据库），不属于 Compose Multiplatform 的范围。
<!-- 要查找替代解决方案，请参见 [搜索多平台库](search-libs.md)。 -->

## 签名中不含 Android 类的 API

即使某些 API 的签名不包含 `android.*` 或 `androidx.*` 类，并且该 API 适用于其他平台，它们也可能仅适用于 Android 目标平台。这背后的原因通常是实现使用了许多平台特有的内容，并且为其他平台编写其他实现需要时间。

通常，这类 API 会在 Jetpack Compose 中针对 Android 目标平台引入后移植到 Compose Multiplatform。

在 Compose Multiplatform %org.jetbrains.compose% 中，以下 API 部分在 `commonMain` 中**不可用**：

*   [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt) 函数
*   [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt) 函数
*   [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt) 函数
*   [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt) 变量
*   [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
*   [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) 库
*   [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 库

## Android API 移植请求

对于每个可以从 Android 移植的 API，Compose Multiplatform YouTrack 中都有一个 [未解决的 issue](https://youtrack.jetbrains.com/issues/CMP)。如果你发现一个 API 可以从 Android 移植并通用化，并且没有针对它的现有 issue，请 [创建一个](https://youtrack.jetbrains.com/newIssue?project=CMP)。