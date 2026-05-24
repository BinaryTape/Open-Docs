[//]: # (title: Android 專用元件)

Compose Multiplatform 建置於 [Jetpack Compose](https://developer.android.com/jetpack/compose) 之上。Compose Multiplatform 的大部分功能都可用於所有平台。然而，有些 API 與程式庫只能在 Android 目標中使用。這可能是因為它們是 Android 專用的，或者是因為它們尚未移植到其他平台。此頁面總結了 Compose Multiplatform API 的這些部分。

> 有時在 [Jetpack Compose 文件](https://developer.android.com/jetpack/compose/documentation) 或社群撰寫的文章中，您可能會發現只能在 Android 目標中使用的 API。如果您嘗試在 `commonMain` 程式碼中使用它，您的 IDE 會告訴您該 API 不可用。
>
{style="note"}

## Android 專用 API

Android 專用 API 是針對 Android 特有的，且在其他平台上不可用。這是因為其他平台不需要 Android 所使用的某些概念。該 API 通常使用來自 `android.*` 套件的類別，或設定 Android 專用的行為。以下是 Android 專用 API 的一些範例：

* [`android.context.Context`](https://developer.android.com/reference/android/content/Context) 類別
* [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext()) 與 [`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration()) 變數
* [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory) 與 [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) 類別
* [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap()) 函式
* [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) 類別
* [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0)) 函式
* [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView) 類別
* [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView()) 變數
* [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt) 函式
* [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 相依注入程式庫

通常，沒有強大的理由將這類 API 的部分通用化，因此最好僅保留在 `androidMain` 中。

## 簽章中包含 Android 類別的 API

Compose Multiplatform 中的某些 API 在其簽章中使用 `android.*`、`androidx.*`（不包括 `androidx.compose.*`），但其行為也適用於其他平台：

* [資源管理](https://developer.android.com/jetpack/compose/resources)：`stringResource`、`animatedVectorResource`、`Font` 以及用於資源管理的 `*.R` 類別。若要了解更多，請參閱[圖片與資源](compose-multiplatform-resources.md)。
* [導覽](https://developer.android.com/jetpack/compose/navigation)。若要了解更多，請參閱[導覽與路由](compose-navigation-routing.md)。
* [`ViewModel`](https://developer.android.com/jetpack/compose/libraries#viewmodel) 類別。若要了解更多，請參閱 [Multiplatform ViewModel](compose-viewmodel.md)。
* [Paging](https://developer.android.com/jetpack/compose/libraries#paging) 程式庫。
* [`ConstraintLayout`](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout) 配置。
* [Maps](https://developer.android.com/jetpack/compose/libraries#maps) 程式庫。
* [預覽](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary) 工具以及用於預覽 [桌面](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support) 應用程式的外掛程式。
* [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 類別。
* 其他尚未移植到 Compose Multiplatform 的 Jetpack Compose 程式庫。

根據複雜程度和需求，它們將來可能會被移植到 `commonMain`。

開發應用程式時常用的 API，例如權限、裝置（藍牙、GPS、相機）和 IO（網路、檔案、資料庫），超出了 Compose Multiplatform 的範疇。
<!-- To find alternative solutions, see [Search for Multiplatform libraries](search-libs.md). -->

## 簽章中不含 Android 類別的 API

即使 API 的簽章中不包含 `android.*` 或 `androidx.*` 類別，且該 API 適用於其他平台，某些 API 的部分內容仍可能僅適用於 Android 目標。這背後的原因通常是實作使用了許多平台特性，且為其他平台撰寫其他實作需要時間。

通常，這類 API 會在 Android 目標的 Jetpack Compose 中引入後，再移植到 Compose Multiplatform。

在 Compose Multiplatform %org.jetbrains.compose% 中，以下 API 部分在 `commonMain` 中 **不可用**：

* [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt) 函式
* [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt) 函式
* [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt) 函式
* [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt) 變數
* [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
* [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) 程式庫
* [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 程式庫

## 請求移植 Android API

對於每個可以從 Android 移植的 API，在 Compose Multiplatform 的 YouTrack 中都有[一個開放的問題 (issue)](https://youtrack.jetbrains.com/issues/CMP)。如果您看到某個 API 可以從 Android 移植並通用化，且目前尚未存在相關問題，請[建立一個](https://youtrack.jetbrains.com/newIssue?project=CMP)。