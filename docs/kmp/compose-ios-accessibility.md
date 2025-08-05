[//]: # (title: 支持 iOS 辅助功能)

Compose Multiplatform 辅助功能支持允许残障人士如同与原生 iOS UI 交互一样方便地与 Compose Multiplatform UI 交互：

* 屏幕阅读器和 VoiceOver 可以访问 Compose Multiplatform UI 的内容。
* Compose Multiplatform UI 支持与原生 iOS UI 相同的导航和交互手势。

这之所以成为可能，是因为 Compose API 生成的语义数据现在已映射到 iOS 辅助功能服务所使用的原生对象和属性。对于大多数使用 Material 组件构建的界面，这应该会自动发生。

你也可以在测试及其他自动化中使用这些语义数据：`testTag` 等属性将正确映射到 `accessibilityIdentifier` 等原生辅助功能属性。这使得 Compose Multiplatform 的语义数据可供辅助功能服务和 XCTest framework 使用。

## 高对比度主题

Compose Multiplatform 使用 Material3 库中的 [`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/) 类，该类目前缺乏开箱即用的高对比度颜色支持。对于 iOS 上的高对比度主题，你需要向应用程序调色板添加额外的颜色集。对于每种自定义颜色，应手动指定其高对比度版本。

iOS 提供了**增加对比度**辅助功能设置，可以通过检测 `UIAccessibilityDarkerSystemColorsEnabled` 的值来检测。你也可以跟踪 `UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`。这些 API 允许你在系统辅助功能设置启用时切换到高对比度调色板。

在定义调色板时，请使用符合 WCAG 标准的对比度检测工具来验证你选择的 `onPrimary` 颜色与 `primary` 颜色、`onSurface` 与 `surface` 颜色等具有足够的对比度。确保颜色之间的对比度至少为 4.5:1。对于自定义的前景和背景颜色，对比度应为 7:1，尤其对于小字号文本。这适用于你的 `lightColorScheme` 和 `darkColorScheme`。

此代码展示了如何在主题包中定义高对比度的亮色和暗色调色板：

```kotlin
import androidx.compose.ui.graphics.Color

// 定义一个数据类，用于保存高对比度主题的调色板
data class HighContrastColors(
    val primary: Color, // 主要交互元素、主文本、顶部应用栏
    val onPrimary: Color, // 显示在“primary”颜色之上的内容
    val secondary: Color, // 次要交互元素、浮动操作按钮
    val onSecondary: Color, // 显示在“secondary”颜色之上的内容
    val tertiary: Color, // 可选的第三种强调色
    val onTertiary: Color, // 显示在“tertiary”颜色之上的内容
    val background: Color, // 屏幕主背景
    val onBackground: Color, // 显示在“background”颜色之上的内容
    val surface: Color, // 卡片背景、面板、菜单、浮起表面
    val onSurface: Color, // 显示在“surface”颜色之上的内容
    val error: Color, // 错误状态和消息
    val onError: Color, // 显示在“error”颜色之上的内容
    val success: Color, // 成功状态和消息
    val onSuccess: Color, // 显示在“success”颜色之上的内容
    val warning: Color, // 警告状态和消息
    val onWarning: Color, // 显示在“warning”颜色之上的内容
    val outline: Color, // 边框、分隔线、禁用状态
    val scrim: Color // 模态/底部面板后面的暗化背景内容
)

// 中性色
val Black = Color(0xFF000000)
val White = Color(0xFFFFFFFF)
val DarkGrey = Color(0xFF1A1A1A)
val MediumGrey = Color(0xFF888888)
val LightGrey = Color(0xFFE5E5E5)

// 主要强调色
val RoyalBlue = Color(0xFF0056B3)
val SkyBlue = Color(0xFF007AFF)

// 次要和第三强调色
val EmeraldGreen = Color(0xFF28A745)
val GoldenYellow = Color(0xFFFFC107)
val DeepPurple = Color(0xFF6F42C1)

// 状态色
val ErrorRed = Color(0xFFD32F2F)
val SuccessGreen = Color(0xFF388E3C)
val WarningOrange = Color(0xFFF57C00)

// 亮色高对比度调色板，浅色背景上的深色内容
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

// 暗色高对比度调色板，深色背景上的浅色内容
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

## 通过触控板和键盘控制

Compose Multiplatform for iOS 支持额外的输入方法来控制你的设备。你可以启用 AssistiveTouch 以使用鼠标或触控板，或启用全键盘访问以使用键盘，而不是依赖触控屏：

* AssistiveTouch （**设置** | **辅助功能** | **触控** | **AssistiveTouch**）允许你使用连接的鼠标或触控板的指针控制你的 iPhone。你可以使用指针点击屏幕上的图标、导航 AssistiveTouch 菜单或使用屏幕键盘输入。

  在 iPad 上，连接鼠标或触控板可以开箱即用，实现基本使用。然而，如果你想调整指针大小、更改跟踪速度或为按钮分配特定操作，你仍然需要启用 AssistiveTouch。
* 全键盘访问 （**设置** | **辅助功能** | **键盘** | **全键盘访问**）启用使用连接键盘的设备控制。你可以使用 **Tab** 等按键进行导航，并使用 **Space** 激活项目。

## 使用 XCTest framework 测试辅助功能

你可以在测试及其他自动化中使用语义辅助功能数据。`testTag` 等属性将正确映射到 `accessibilityIdentifier` 等原生辅助功能属性。这使得 Compose Multiplatform 的语义数据可供辅助功能服务和 XCTest framework 使用。

你可以在 UI 测试中使用自动化辅助功能审计。
对 `XCUIApplication` 调用 `performAccessibilityAudit()` 将像 Accessibility Inspector 一样审计当前视图的辅助功能问题。

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## 自定义辅助功能树的同步

默认设置下：
* iOS 辅助功能树仅当辅助功能服务正在运行时才与 UI 同步。
* 同步事件不会被记录。

你可以使用新的 Compose Multiplatform API 自定义这些设置。

### 选择树同步选项

> 在 Compose Multiplatform 1.8.0 中，[此选项已移除](whats-new-compose-180.md#loading-accessibility-tree-on-demand)，因为辅助功能树是惰性同步的，不再需要额外配置。
>
{style="tip"}

为了调试和测试事件及交互，你可以将同步模式更改为：
* 从不同步树与 UI，例如，暂时禁用辅助功能映射。
* 始终同步树，以便每次 UI 更新时都会重写它，以彻底测试辅助功能集成。

> 请记住，在每个 UI 事件后同步树对于调试和测试可能非常有用，但会降低应用程序的性能。
>
{style="note"}

以下是启用始终同步辅助功能树选项的示例：

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // your @Composable content
}
```

`AccessibilitySyncOptions` 类包含所有可用选项：

```kotlin
// 包 androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // 选项：从不同步辅助功能树
    object Never: AccessibilitySyncOptions

    // 选项：仅当辅助功能服务运行时才同步树
    //
    // 你可以包含一个 AccessibilityDebugLogger 来记录交互和树同步事件
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // 选项：始终同步辅助功能树
    //
    // 你可以包含一个 AccessibilityDebugLogger 来记录交互和树同步事件
    class Always(debugLogger: AccessibilityDebugLogger?)
}
```

### 实现日志接口

你可以实现 `AccessibilityDebugLogger` 接口，将自定义消息写入你选择的输出端：

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

## 接下来？

* 关于 [Apple 辅助功能](https://developer.apple.com/accessibility/)指南，了解更多信息。
* 在你常用的 iOS 辅助功能工作流程中，试用由 [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/) 生成的项目。