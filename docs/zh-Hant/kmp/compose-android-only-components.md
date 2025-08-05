[//]: # (title: 僅限 Android 的元件)

Compose Multiplatform 建立在 [Jetpack Compose](https://developer.android.com/jetpack/compose) 之上。Compose Multiplatform 的大部分功能都適用於所有平台。然而，有些 API 和函式庫只能在 Android 目標平台中使用。這可能是因為它們是 Android 專屬的，或者尚未移植到其他平台。本頁總結了 Compose Multiplatform API 的這些部分。

> 有時，在 [Jetpack Compose 文件](https://developer.android.com/jetpack/compose/documentation) 或社群建立的文章中，您可能會發現一個只能在 Android 目標平台中使用的 API。
> 如果您嘗試在 `commonMain` 程式碼中使用它，您的 IDE 會告知您此 API 不可用。
>
{style="note"}

## 僅限 Android 的 API

僅限 Android 的 API 是 Android 專屬的，在其他平台上不可用。這是因為其他平台不需要 Android 使用的某些概念。此 API 通常使用來自 `android.*` 套件的類別或設定 Android 專屬的行為。以下是一些僅限 Android 的 API 部分的範例：

*   [`android.context.Context`](https://developer.android.com/reference/android/content/Context) 類別
*   [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext()) 和 [`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration()) 變數
*   [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory) 和 [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) 類別
*   [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap()) 函式
*   [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) 類別
*   [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0)) 函式
*   [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView) 類別
*   [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView()) 變數
*   [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt) 函式
*   [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 相依性注入函式庫

通常，沒有強烈理由去通用化此類 API 的部分，因此最好僅將其保留在 `androidMain` 中。

## 簽名中包含 Android 類別的 API

Compose Multiplatform 中有一些 API 部分在其簽名中使用了 `android.*`、`androidx.*`（不包括 `androidx.compose.*`），但它們的行為也適用於其他平台：

*   [資源管理](https://developer.android.com/jetpack/compose/resources)：`stringResource`、`animatedVectorResource`、`Font`，以及用於資源管理的 `*.R` 類別。如需更多資訊，請參閱[圖片和資源](compose-multiplatform-resources.md)。
*   [導覽](https://developer.android.com/jetpack/compose/navigation)。如需更多資訊，請參閱[導覽和路由](compose-navigation-routing.md)。
*   `ViewModel` 類別。
*   [Paging](https://developer.android.com/jetpack/compose/libraries#paging) 函式庫。
*   `ConstraintLayout` 版面配置。
*   [Maps](https://developer.android.com/jetpack/compose/libraries#maps) 函式庫。
*   [Preview](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary) 工具以及用於預覽[桌面](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)應用程式的插件。
*   `WebView` 類別。
*   其他尚未移植到 Compose Multiplatform 的 Jetpack Compose 函式庫。

它們未來可能會移植到 `commonMain`，這將取決於複雜度和需求。

在開發應用程式時常用的 API，例如權限、裝置（藍牙、GPS、相機）以及 IO（網路、檔案、資料庫），都不在 Compose Multiplatform 的範圍內。
<!-- To find alternative solutions, see [Search for Multiplatform libraries](search-libs.md). -->

## 簽名中不含 Android 類別的 API

API 的某些部分可能僅適用於 Android 目標平台，即使它們的簽名不包含 `android.*` 或 `androidx.*` 類別，且此 API 適用於其他平台。這背後的原因通常是實作使用了許多平台特定的內容，並且需要時間為其他平台編寫其他實作。

通常，此類 API 的部分在 Jetpack Compose 針對 Android 目標平台引入後，會被移植到 Compose Multiplatform。

在 Compose Multiplatform %org.jetbrains.compose% 中，以下 API 部分在 `commonMain` 中**不可用**：

*   [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt) 函式
*   [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt) 函式
*   [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt) 函式
*   [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt) 變數
*   [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
*   [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) 函式庫
*   [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 函式庫

## 移植 Android API 的請求

對於每個可以從 Android 移植的 API，Compose Multiplatform YouTrack 中都有一個[開放的議題](https://youtrack.jetbrains.com/issues/CMP)。如果您認為某個 API 可以從 Android 移植並通用化，但目前沒有針對它的現有議題，請[建立一個](https://youtrack.jetbrains.com/newIssue?project=CMP)。