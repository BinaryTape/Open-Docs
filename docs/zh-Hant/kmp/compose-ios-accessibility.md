[//]: # (title: 支援 iOS 輔助使用功能)

Compose Multiplatform 輔助使用支援讓身心障礙人士能如同使用原生 iOS UI 般舒適地與 Compose Multiplatform UI 互動：

* 螢幕閱讀器和 VoiceOver 可以存取 Compose Multiplatform UI 的內容。
* Compose Multiplatform UI 支援與原生 iOS UI 相同的手勢，用於導覽和互動。

這是因為 Compose API 產生的語義資料現在已映射到原生物件和屬性，供 iOS 輔助使用服務取用。對於大多數使用 Material 小工具建置的介面，這應該會自動發生。

您也可以將此語義資料用於測試和其他自動化：諸如 `testTag` 等屬性將正確映射到諸如 `accessibilityIdentifier` 等原生輔助使用屬性。這使得 Compose Multiplatform 的語義資料可供輔助使用服務和 XCTest 框架使用。

## 高對比主題

Compose Multiplatform 使用 Material3 函式庫中的 [`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/) 類別，該類別目前不具備開箱即用的高對比色彩支援。要在 iOS 上實現高對比主題，您需要為應用程式調色盤新增一組額外的色彩。對於每個自訂色彩，其高對比版本都應手動指定。

iOS 提供了「**增加對比**」輔助使用設定，可以透過檢查 `UIAccessibilityDarkerSystemColorsEnabled` 的值來偵測。您也可以追蹤 `UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`。這些 API 允許您在啟用系統輔助使用設定時切換到高對比調色盤。

在定義調色盤時，請使用符合 WCAG 規範的對比檢查工具來驗證您所選的 `onPrimary` 色彩與您的主要色彩、`onSurface` 與表面色彩等是否具有足夠的對比。確保色彩之間的對比度至少為 4.5:1。對於自訂的前景和背景色彩，對比度應為 7:1，特別是對於小字體。這適用於您的 `lightColorScheme` 和 `darkColorScheme`。

以下程式碼展示如何在您的主題套件中定義高對比的淺色和深色調色盤：

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

## 透過觸控式軌跡板和鍵盤控制

適用於 iOS 的 Compose Multiplatform 支援額外的輸入方法來控制您的裝置。您無需依賴觸控螢幕，可以啟用 AssistiveTouch 來使用滑鼠或觸控式軌跡板，或啟用完整鍵盤控制來使用鍵盤：

* AssistiveTouch (**設定** | **輔助使用** | **觸控** | **AssistiveTouch**) 允許您使用連接滑鼠或觸控式軌跡板的指標來控制您的 iPhone。您可以使用指標點擊螢幕上的圖示、導覽 AssistiveTouch 選單，或使用螢幕鍵盤輸入。

  在 iPad 上，連接滑鼠或觸控式軌跡板即可開箱即用於基本用途。但是，如果您想調整指標大小、更改追蹤速度或將特定動作指派給按鈕，您仍然需要啟用 AssistiveTouch。
* 完整鍵盤控制 (**設定** | **輔助使用** | **鍵盤** | **完整鍵盤控制**) 啟用透過連接的鍵盤進行裝置控制。您可以使用像 **Tab** 鍵進行導覽，並使用 **Space** 鍵啟用項目。

## 使用 XCTest 框架測試輔助使用功能

您可以在測試和其他自動化中使用語義輔助使用資料。諸如 `testTag` 等屬性會正確映射到諸如 `accessibilityIdentifier` 等原生輔助使用屬性。這使得 Compose Multiplatform 的語義資料可供輔助使用服務和 XCTest 框架使用。

您可以在您的 UI 測試中使用自動化輔助使用稽核。對您的 `XCUIApplication` 呼叫 `performAccessibilityAudit()` 將如同輔助使用檢查器一樣，稽核目前視圖的輔助使用問題。

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
* iOS 輔助使用樹僅在輔助使用服務正在執行時才與 UI 同步。
* 同步事件不會被記錄。

您可以使用新的 Compose Multiplatform API 自訂這些設定。

### 選擇樹同步選項

> 在 Compose Multiplatform 1.8.0 中，[此選項已被移除](whats-new-compose-180.md#loading-accessibility-tree-on-demand)，因為輔助使用樹是延遲同步的，不再需要額外配置。
>
{style="tip"}

為了除錯和測試事件與互動，您可以將同步模式更改為：
* 永不同步樹與 UI，例如，暫時停用輔助使用映射。
* 始終同步樹，以便在 UI 每次更新時重新寫入，以徹底測試輔助使用整合。

> 請記住，在每個 UI 事件後同步樹對於除錯和測試非常有用，但可能會降低應用程式的效能。
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
    
    // Option to never synchronize the accessibility tree
    object Never: AccessibilitySyncOptions

    // Option to synchronize the tree only when Accessibility Services are running
    //
    // You can include an AccessibilityDebugLogger to log interactions and tree syncing events
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // Option to always synchronize the accessibility tree
    //
    // You can include an AccessibilityDebugLogger to log interactions and tree syncing events
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

## 接下來？

* 在 [Apple 輔助使用](https://developer.apple.com/accessibility/)指南中了解更多。
* 在您常用的 iOS 輔助使用工作流程中，試用由 [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/) 產生的專案。