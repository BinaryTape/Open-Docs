[//]: # (title: Compose Multiplatform 1.10.0-beta01 新功能)

以下是此 EAP 功能版本的重點：
 * [統一的 `@Preview` 註解](#unified-preview-annotation)
 * [支援 Navigation 3](#support-for-navigation-3)
 * [內建 Compose Hot Reload](#compose-hot-reload-integration)

您可以在 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.10.0-beta01) 上找到此版本的完整變更清單。

## 依賴項

* Gradle Plugin `org.jetbrains.compose`，版本 `1.10.0-beta01`。基於 Jetpack Compose 函式庫：
    * [Runtime 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.10.0-beta01)
    * [UI 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.10.0-beta01)
    * [Foundation 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.10.0-beta01)
    * [Material 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-material#1.10.0-beta01)
    * [Material3 1.4.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0)

* Compose Material3 函式庫 `org.jetbrains.compose.material3:material3*:1.10.0-alpha04`。基於 [Jetpack Compose Material3 1.5.0-alpha07](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha07)。

  若要使用 [Expressive 主題](whats-new-compose-190.md#material-3-expressive-theme)，請包含實驗性版本的 Material 3：
    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
    ```
* Compose Material3 Adaptive 函式庫 `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha01`。基於 [Jetpack Compose Material3 Adaptive 1.3.0-alpha02](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha02)
* Lifecycle 函式庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.10.0-alpha04`。基於 [Jetpack Lifecycle 2.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.10.0-beta01)
* Navigation 函式庫 `org.jetbrains.androidx.navigation:navigation-*:2.9.1`。基於 [Jetpack Navigation 2.9.4](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.4)
* Navigation 3 函式庫 `org.jetbrains.androidx.navigation:navigation3-*:1.0.0-alpha04`。基於 [Jetpack Navigation 3](https://developer.android.com/jetpack/androidx/releases/navigation3#1.0.0-beta01)
* Navigation Event 函式庫 `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.0.0-beta01`。基於 [Jetpack Navigation Event 1.0.0-beta01](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.0.0-beta01)
* Savedstate 函式庫 `org.jetbrains.androidx.savedstate:savedstate*:1.4.0-beta01`。基於 [Jetpack Savedstate 1.4.0-rc01](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0-rc01)
* WindowManager Core 函式庫 `org.jetbrains.androidx.window:window-core:1.5.0-rc01`。基於 [Jetpack WindowManager 1.5.0](https://developer.android.com/jetpack/androidx/releases/window#1.5.0)

## 跨平台

### 統一的 `@Preview` 註解

我們統一了跨平台的預覽方法。您現在可以在 `commonMain` 原始碼集中為所有目標平台使用 `androidx.compose.ui.tooling.preview.Preview` 註解。

所有其他註解，例如 `org.jetbrains.compose.ui.tooling.preview.Preview` 以及桌面專用的 `androidx.compose.desktop.ui.tooling.preview.Preview`，都已被棄用。

### 支援 Navigation 3

Navigation 3 是一個新的導覽函式庫，專為與 Compose 協同工作而設計。藉由 Navigation 3，您可以完全控制返回堆疊，並且導覽至目標和從目標返回就像從清單中新增和移除項目一樣簡單。您可以在 [Navigation 3 文件](https://developer.android.com/guide/navigation/navigation-3) 以及公告[部落格文章](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)中閱讀有關新的指導原則和決策。

Compose Multiplatform 1.10.0-beta01 為在非 Android 目標上使用新的導覽 API 提供了 Alpha 支援。已發布的多平台構件是：

* Navigation 3 UI 函式庫 `org.jetbrains.androidx.navigation3:navigation3-ui`
* 適用於 Navigation 3 的 ViewModel `org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3`
* 適用於 Navigation 3 的 Material 3 自適應版面配置 `org.jetbrains.compose.material3.adaptive:adaptive-navigation3`

您可以在從原始 Android 儲存庫鏡像的 [nav3-recipes](https://github.com/terrakok/nav3-recipes) 範例中找到多平台 Navigation 3 實作的範例。

一些特定平台實作細節：

* 在 iOS 上，您現在可以使用 [EndEdgePanGestureBehavior](https://github.com/JetBrains/compose-multiplatform-core/pull/2519) 選項（預設為 `Disabled`）來管理終點邊緣[平移手勢](https://developer.apple.com/documentation/uikit/handling-pan-gestures)的導覽。「終點邊緣」在此指由左至右 (LTR) 介面中的螢幕右側邊緣，以及由右至左 (RTL) 介面中的左側邊緣。起始邊緣與終點邊緣相對，並且始終綁定到返回手勢。
* 在網頁應用程式中，現在桌面瀏覽器中按下 **Esc** 鍵會將使用者返回到上一畫面（並關閉對話框、彈出視窗以及某些小工具，例如 Material 3 的 `SearchBar`），就像它在桌面應用程式中已經做的那樣。
* Compose Multiplatform 1.10 將不會延伸對 [瀏覽器歷史導覽](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps) 和在網址列中使用目標的支援至 Navigation 3。這已延後到多平台函式庫的後續版本。

### Skia 更新至 Milestone 138

Compose Multiplatform 透過 Skiko 使用的 Skia 版本已更新至 Milestone 138。

之前使用的 Skia 版本是 Milestone 132。您可以在[發行說明](https://skia.googlesource.com/skia/+/refs/heads/chrome/m138/RELEASE_NOTES.md)中查看這些版本之間的變更。

## iOS

### 視窗內嵌區

Compose Multiplatform 現在支援 `WindowInsetsRulers`，它提供根據視窗內嵌區（例如狀態列、導覽列或螢幕鍵盤）來定位和調整 UI 元素大小的功能。

這種管理視窗內嵌區的新方法使用單一實作來檢索特定平台的視窗內嵌區資料。這表示 `WindowInsets` 和 `WindowInsetsRulers` 都使用通用機制來一致地管理內嵌區。因此，特定平台本機變數，包括 `LocalLayoutMargins`、`LocalSafeArea`、`LocalKeyboardOverlapHeight` 和 `LocalInterfaceOrientation`，已棄用，轉而使用新的統一 API。

>之前，`WindowInsets.Companion.captionBar` 並未標記為 `@Composable`。我們新增了 `@Composable` 屬性，以使其行為在各平台之間保持一致。
> 
{style="note"}

### 改進的 IME 設定

繼 [1.9.0 中引入](whats-new-compose-190.md#ime-options)的 iOS 專屬 IME 客製化之後，此版本新增了使用 `PlatformImeOptions` 配置文字輸入檢視的 API。

這些新的 API 允許在欄位取得焦點並觸發 IME 時客製化輸入介面：

 * `UIResponder.inputView` 指定一個自訂輸入檢視，以取代預設的系統鍵盤。
 * `UIResponder.inputAccessoryView` 定義一個自訂輔助檢視，在 IME 啟用時附加到系統鍵盤或自訂 `inputView`。

## 桌面版

### Compose Hot Reload 整合

Compose Hot Reload 外掛程式現在已與 Compose Multiplatform Gradle 外掛程式內建。您不再需要單獨配置 Hot Reload 外掛程式，因為它預設為適用於目標桌面平台的 Compose Multiplatform 專案啟用。

這對明確宣告 Compose Hot Reload 外掛程式的專案意味著：

 * 您可以安全地移除宣告，以便使用 Compose Multiplatform Gradle 外掛程式提供的版本。
 * 如果您選擇保留特定版本宣告，則將使用該版本而不是內建版本。

>內建的 Compose Hot Reload Gradle 外掛程式將 Compose Multiplatform 專案所需的 Kotlin 版本提升至 2.1.20。
>
{style="warning"}

### `SwingPanel` 自動調整大小

`SwingPanel` 現在根據內容的最小、慣用和最大尺寸自動調整其大小。這消除了計算精確尺寸和預先指定固定尺寸的需求。

```kotlin
val label = JLabel("Hello Swing!")

singleWindowApplication {
    SwingPanel(factory = { label })

    LaunchedEffect(Unit) {
        delay(500)
        // 放大文字
        repeat(2) { 
            label.text = "#${label.text}#"
            delay(200)
        }
        // 縮小文字
        repeat(2) { 
            label.text = label.text.substring(1, label.text.length - 1)
            delay(200)
        }
    }
}
```

## Gradle

### 已棄用的依賴項別名

Compose Multiplatform Gradle 外掛程式支援的依賴項別名 (`compose.ui` 等) 在 1.10.0-beta01 版本中已被棄用。我們鼓勵您將函式庫直接引用新增到您的版本目錄中。在相應的棄用通知中建議了具體引用。

此更改應能使 Compose Multiplatform 函式庫的依賴項管理更加透明化。未來，我們希望能為 Compose Multiplatform 提供一個 BOM (物料清單)，以簡化設定相容版本。

### 支援 AGP 9.0.0

Compose Multiplatform 引入了對 Android Gradle Plugin (AGP) 9.0.0 版本的支援。為了與新的 AGP 版本相容，請確保您升級到 Compose Multiplatform 1.9.3 或 1.10.0。

為了使長期更新過程更順暢，我們建議更改您的專案結構，將 AGP 用途隔離到專用 Android 模組中。