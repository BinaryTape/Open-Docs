[//]: # (title: 支援 iOS 無障礙功能)

Compose Multiplatform 的無障礙支援讓身心障礙人士能如同使用原生 iOS UI 一樣，舒適地與 Compose Multiplatform UI 進行互動：

* 螢幕閱讀器與 VoiceOver 可以存取 Compose Multiplatform UI 的內容。
* Compose Multiplatform UI 支援與原生 iOS UI 相同的瀏覽與互動手勢。

這是因為 Compose API 產生的語意（semantics）資料現在會對應到 iOS 無障礙服務所使用的原生物件與屬性。對於大多數使用 Material 小工具建置的介面，這應該會自動發生。

您也可以在測試與其他自動化中使用此語意資料：如 `testTag` 等屬性將正確對應到原生無障礙屬性（例如 `accessibilityIdentifier`）。這使得來自 Compose Multiplatform 的語意資料可供無障礙服務與 XCTest 架構使用。

## 高對比佈景主題

Compose Multiplatform 使用 Material3 程式庫中的 [`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/) 類別，該類別目前缺乏對高對比色彩的開箱即用支援。對於 iOS 上的高對比佈景主題，您需要在應用程式調色盤中加入額外的一組顏色。對於每個自訂顏色，應手動指定其高對比版本。

iOS 提供了 **增強對比** 無障礙設定，可透過檢查 `UIAccessibilityDarkerSystemColorsEnabled` 的值來偵測。您也可以追蹤 `UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`。這些 API 讓您能在系統無障礙設定啟用時，切換至高對比調色盤。

在定義調色盤時，請使用符合 WCAG 標準的對比檢查工具，以驗證您選擇的 `onPrimary` 顏色與 `primary` 顏色、`onSurface` 與 `surface` 顏色等之間是否有足夠的對比。確保顏色之間的對比度至少為 4.5:1。對於自訂的前景與背景顏色，對比度應為 7:1，特別是對於小文字。這適用於您的 `lightColorScheme` 與 `darkColorScheme`。

這段程式碼展示了如何在您的佈景主題套件中定義高對比的淺色與深色調色盤：

```kotlin
import androidx.compose.ui.graphics.Color

// 定義一個資料類別來持有高對比佈景主題的調色盤
data class HighContrastColors(
    val primary: Color, // 主要互動元素、主要文字、頂部應用程式列
    val onPrimary: Color, // 顯示在「primary」顏色之上的內容
    val secondary: Color, // 次要互動元素、懸浮動作按鈕
    val onSecondary: Color, // 顯示在「secondary」顏色之上的內容
    val tertiary: Color, // 選用的第三種強調色
    val onTertiary: Color, // 顯示在「tertiary」顏色之上的內容
    val background: Color, // 螢幕的主要背景
    val onBackground: Color, // 顯示在「background」顏色之上的內容
    val surface: Color, // 卡片背景、底部表單、功能表、提升表面的高度
    val onSurface: Color, // 顯示在「surface」顏色之上的內容
    val error: Color, // 錯誤狀態與訊息
    val onError: Color, // 顯示在「error」顏色之上的內容
    val success: Color, // 成功狀態與訊息
    val onSuccess: Color, // 顯示在「success」顏色之上的內容
    val warning: Color, // 警告狀態與訊息
    val onWarning: Color, // 顯示在「warning」顏色之上的內容
    val outline: Color, // 框線、分隔線、停用狀態
    val scrim: Color // 彈出視窗/表單後方的遮罩背景內容
)

// 中性色
val Black = Color(0xFF000000)
val White = Color(0xFFFFFFFF)
val DarkGrey = Color(0xFF1A1A1A)
val MediumGrey = Color(0xFF888888)
val LightGrey = Color(0xFFE5E5E5)

// 主要強調色
val RoyalBlue = Color(0xFF0056B3)
val SkyBlue = Color(0xFF007AFF)

// 次要與第三強調色
val EmeraldGreen = Color(0xFF28A745)
val GoldenYellow = Color(0xFFFFC107)
val DeepPurple = Color(0xFF6F42C1)

// 狀態顏色
val ErrorRed = Color(0xFFD32F2F)
val SuccessGreen = Color(0xFF388E3C)
val WarningOrange = Color(0xFFF57C00)

// 淺色高對比調色盤，淺色背景上的深色內容
val LightHighContrastPalette =
    HighContrastColors(
        primary = RoyalBlue,
        onPrimary = White,
        secondary = EmeraldGreen,
        onSecondary = White,
        tertiary = DeepPurple,
        onTertiary = White,
        background = White,
        onBackground = Black,
        surface = LightGrey,
        onSurface = DarkGrey,
        error = ErrorRed,
        onError = White,
        success = SuccessGreen,
        onSuccess = White,
        warning = WarningOrange,
        onWarning = White,
        outline = MediumGrey,
        scrim = Black.copy(alpha = 0.6f)
    )

// 深色高對比調色盤，深色背景上的淺色內容
val DarkHighContrastPalette =
    HighContrastColors(
        primary = SkyBlue,
        onPrimary = Black,
        secondary = EmeraldGreen,
        onSecondary = White,
        tertiary = GoldenYellow,
        onTertiary = Black,
        background = Black,
        onBackground = White,
        surface = DarkGrey,
        onSurface = LightGrey,
        error = ErrorRed,
        onError = White,
        success = SuccessGreen,
        onSuccess = White,
        warning = WarningOrange,
        onWarning = White,
        outline = MediumGrey,
        scrim = Black.copy(alpha = 0.6f)
    )
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="val LightHighContrastPalette = HighContrastColors( primary = RoyalBlue,"}

## 透過觸控板與鍵盤控制

iOS 版 Compose Multiplatform 支援額外的輸入方式來控制您的裝置。除了依賴觸控螢幕外，您還可以啟用 AssistiveTouch 以使用滑鼠或觸控板，或啟用全鍵盤控制（Full Keyboard Access）以使用鍵盤：

* AssistiveTouch（**設定** | **無障礙** | **觸控** | **AssistiveTouch**）允許您透過連接的滑鼠或觸控板指標來控制您的 iPhone。您可以使用指標點擊螢幕上的圖示、在 AssistiveTouch 功能表中導航，或使用螢幕鍵盤輸入。

  在 iPad 上，連接滑鼠或觸控板即可直接進行基本操作。然而，若您想調整指標大小、更改追蹤速度或為按鈕指定特定操作，仍需啟用 AssistiveTouch。
* 全鍵盤控制（**設定** | **無障礙** | **鍵盤** | **全鍵盤控制**）可透過連接的鍵盤控制裝置。您可以使用 **Tab** 等按鍵進行瀏覽，並使用 **空格鍵** 啟動項目。

## 使用 XCTest 架構測試無障礙功能

您可以在測試與其他自動化中使用語意無障礙資料。如 `testTag` 等屬性會正確對應到原生無障礙屬性，例如 `accessibilityIdentifier`。這使得來自 Compose Multiplatform 的語意資料可供無障礙服務與 XCTest 架構使用。

您可以在 UI 測試中使用自動化無障礙稽核。為您的 `XCUIApplication` 呼叫 `performAccessibilityAudit()`，將會像無障礙檢查器（Accessibility Inspector）一樣，針對目前的視圖進行無障礙問題稽核。

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## 自訂無障礙樹的同步

使用預設設定時：
* iOS 無障礙樹僅在無障礙服務執行時才與 UI 同步。
* 同步事件不會被記錄。

您可以使用新的 Compose Multiplatform API 自訂這些設定。

### 選擇樹同步選項

> 在 Compose Multiplatform 1.8.0 中，[此選項已被移除](whats-new-compose-180.md#loading-accessibility-tree-on-demand)，因為無障礙樹採延遲同步，不再需要額外配置。
>
{style="tip"}

為了偵錯與測試事件及互動，您可以將同步模式更改為：
* 從不將樹與 UI 同步，例如暫時停用無障礙對應。
* 始終同步樹，以便在每次 UI 更新時重新寫入，從而徹底測試無障礙整合。

> 請記住，在每個 UI 事件後同步樹對於偵錯與測試非常有用，但可能會降低應用程式的效能。
>
{style="note"}

啟用始終同步無障礙樹選項的範例：

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // 您的 @Composable 內容
}
```

`AccessibilitySyncOptions` 類別包含所有可用的選項：

```kotlin
// package androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // 從不同步無障礙樹的選項
    object Never: AccessibilitySyncOptions

    // 僅在無障礙服務執行時同步樹的選項
    //
    // 您可以包含一個 AccessibilityDebugLogger 來記錄互動與樹同步事件
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // 始終同步無障礙樹的選項
    //
    // 您可以包含一個 AccessibilityDebugLogger 來記錄互動與樹同步事件
    class Always(debugLogger: AccessibilityDebugLogger?)
}
```

### 實作記錄介面

您可以實作 `AccessibilityDebugLogger` 介面，將自訂訊息寫入您選擇的輸出：

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.WhenRequiredByAccessibilityServices(object: AccessibilityDebugLogger {
         override fun log(message: Any?) {
             if (message == null) {
                 println()
             } else { 
                 println("[a11y]: $message") 
             } 
         } 
    })
}) {
    // 您的 @Composable 內容
}
```

## 接下來？

* 在 [Apple 無障礙](https://developer.apple.com/accessibility/) 指南中了解更多資訊。
* 在您平常的 iOS 無障礙工作流程中，嘗試使用 [Kotlin Multiplatform 精靈](https://kmp.jetbrains.com/) 產生的專案。