[//]: # (title: 支援 iOS 輔助使用功能)

Compose Multiplatform 輔助使用支援讓身心障礙人士能如同與原生的 iOS UI 互動一樣舒適地與 Compose Multiplatform UI 互動：

* 螢幕閱讀器和 VoiceOver 可以存取 Compose Multiplatform UI 的內容。
* Compose Multiplatform UI 支援與原生 iOS UI 相同的手勢，用於導覽和互動。

這是因為 Compose APIs 產生的語義資料現在已映射到原生物件和屬性，供 iOS 輔助使用服務取用。對於大多數使用 Material widgets 建置的介面，這應該會自動發生。

您也可以在測試及其他自動化中使用此語義資料：`testTag` 等屬性將正確映射到 `accessibilityIdentifier` 等原生輔助使用屬性。這使得來自 Compose Multiplatform 的語義資料可用於 Accessibility Services 和 XCTest framework。

## 高對比主題

Compose Multiplatform 使用 Material3 函式庫中的 [`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/) 類別，該函式庫目前缺乏開箱即用的高對比色彩支援。若要在 iOS 上使用高對比主題，您需要為應用程式調色盤新增一組額外的色彩。對於每個自訂色彩，應手動指定其高對比版本。

iOS 提供了「**Increase Contrast**」輔助使用設定，可以透過檢查 `UIAccessibilityDarkerSystemColorsEnabled` 的值來偵測。您還可以追蹤 `UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`。當系統輔助使用設定啟用時，這些 APIs 允許您切換到高對比色彩調色盤。

在定義色彩調色盤時，請使用符合 WCAG 規範的對比度檢查工具來驗證您選擇的 `onPrimary` 色彩與您的主要色彩、`onSurface` 與表面色彩等具有足夠的對比度。確保色彩之間的對比度至少為 4.5:1。對於自訂前景色和背景色，對比度應為 7:1，尤其是針對小文字。這適用於您的 `lightColorScheme` 和 `darkColorScheme`。

此程式碼顯示如何在您的主題套件中定義高對比的淺色和深色調色盤：

```kotlin
import androidx.compose.ui.graphics.Color

// Defines a data class to hold the color palette for high-contrast themes
data class HighContrastColors(
    val primary: Color, // Main interactive elements, primary text, top app bars
    val onPrimary: Color, // Content displayed on top of a 'primary' color
    val secondary: Color, // Secondary interactive elements, floating action buttons
    val onSecondary: Color, // Content displayed on top of a 'secondary' color
    val tertiary: Color, // An optional third accent color
    val onTertiary: Color, // Content displayed on top of a 'tertiary' color
    val background: Color, // Main background of the screen
    val onBackground: Color, // Content displayed on top of a 'background' color
    val surface: Color, // Card backgrounds, sheets, menus, elevated surfaces
    val onSurface: Color, // Content displayed on top of a 'surface' color
    val error: Color, // Error states and messages
    val onError: Color, // Content displayed on top of an 'error' color
    val success: Color, // Success states and messages
    val onSuccess: Color, // Content displayed on top of a 'success' color
    val warning: Color, // Warning states and messages
    val onWarning: Color, // Content displayed on top of a 'warning' color
    val outline: Color, // Borders, dividers, disabled states
    val scrim: Color // Dimming background content behind modals/sheets
)

// Neutral colors
val Black = Color(0xFF000000)
val White = Color(0xFFFFFFFF)
val DarkGrey = Color(0xFF1A1A1A)
val MediumGrey = Color(0xFF888888)
val LightGrey = Color(0xFFE5E5E5)

// Primary accent colors
val RoyalBlue = Color(0xFF0056B3)
val SkyBlue = Color(0xFF007AFF)

// Secondary  and tertiary accent colors
val EmeraldGreen = Color(0xFF28A745)
val GoldenYellow = Color(0xFFFFC107)
val DeepPurple = Color(0xFF6F42C1)

// Status colors
val ErrorRed = Color(0xFFD32F2F)
val SuccessGreen = Color(0xFF388E3C)
val WarningOrange = Color(0xFFF57C00)

// Light high-contrast palette, dark content on light backgrounds
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

// Dark high-contrast palette, light content on dark backgrounds
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

## 透過觸控板和鍵盤控制

Compose Multiplatform for iOS 支援額外的輸入方法來控制您的裝置。您無需依賴觸控螢幕，而是可以啟用 AssistiveTouch 來使用滑鼠或觸控板，或啟用 Full Keyboard Access 來使用鍵盤：

* AssistiveTouch (**Settings** | **Accessibility** | **Touch** | **AssistiveTouch**) 允許您使用連接的滑鼠或觸控板的指標來控制您的 iPhone。您可以使用指標點擊螢幕上的圖示、導覽 AssistiveTouch 選單，或使用螢幕鍵盤打字。

  在 iPad 上，連接滑鼠或觸控板開箱即用，可實現基本使用。然而，如果您想調整指標大小、更改追蹤速度，或為按鈕分配特定動作，您仍然需要啟用 AssistiveTouch。
* Full Keyboard Access (**Settings** | **Accessibility** | **Keyboards** | **Full Keyboard Access**) 啟用透過連接鍵盤控制裝置。您可以使用 **Tab** 等按鍵導覽，並使用 **Space** 啟用項目。

## 使用 XCTest 框架測試輔助使用功能

您可以在測試及其他自動化中使用語義輔助使用資料。`testTag` 等屬性會正確映射到 `accessibilityIdentifier` 等原生輔助使用屬性。這使得來自 Compose Multiplatform 的語義資料可用於 Accessibility Services 和 XCTest framework。

您可以在 UI 測試中使用自動化輔助使用稽核。
為您的 `XCUIApplication` 呼叫 `performAccessibilityAudit()` 將如同 Accessibility Inspector 一樣稽核當前視圖的輔助使用問題。

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## 自訂輔助使用樹的同步

在預設設定下：
* iOS 輔助使用樹僅在 Accessibility Services 運行時才與 UI 同步。
* 同步事件未被記錄。

您可以使用新的 Compose Multiplatform API 自訂這些設定。

### 選擇樹同步選項

> 在 Compose Multiplatform 1.8.0 中，[此選項已被移除](whats-new-compose-180.md#loading-accessibility-tree-on-demand)，因為輔助使用樹是延遲同步的，不再需要額外設定。
>
{style="tip"}

為了偵錯和測試事件與互動，您可以更改同步模式為：
* 從不將樹與 UI 同步，例如，暫時停用輔助使用映射。
* 始終同步樹，以便每當 UI 更新時都重新寫入，以徹底測試輔助使用整合。

> 請記住，在每個 UI 事件後同步樹對於偵錯和測試非常有用，但可能會降低您應用程式的效能。
>
{style="note"}

啟用始終同步輔助使用樹選項的範例：

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // your @Composable content
}
```

`AccessibilitySyncOptions` 類別包含所有可用選項：

```kotlin
// package androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // 永不同步輔助使用樹的選項
    object Never: AccessibilitySyncOptions

    // 僅在輔助使用服務運行時同步樹的選項
    //
    // 您可以包含一個 AccessibilityDebugLogger 來記錄互動和樹同步事件
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // 始終同步輔助使用樹的選項
    //
    // 您可以包含一個 AccessibilityDebugLogger 來記錄互動和樹同步事件
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
    // your @Composable content
}
```

## 後續步驟？

* 在 [Apple 輔助使用](https://developer.apple.com/accessibility/)指南中了解更多資訊。
* 在您常用的 iOS 輔助使用工作流程中，試用由 [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/) 生成的專案。