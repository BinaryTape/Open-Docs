[//]: # (title: 对 iOS 辅助功能的支持)

Compose Multiplatform 辅助功能支持允许残障人士像使用原生 iOS UI 一样舒适地与 Compose Multiplatform UI 进行交互：

* 屏幕阅读器和 VoiceOver 可以访问 Compose Multiplatform UI 的内容。
* Compose Multiplatform UI 支持与原生 iOS UI 相同的导航和交互手势。

这是可能的，因为由 Compose API 生成的语义数据现在被映射到 iOS 辅助功能服务所使用的原生对象和属性。对于大多数使用 Material 微件构建的界面，这应该会自动发生。

您也可以在测试和其他自动化中使用这些语义数据：`testTag` 等属性将正确映射到原生辅助功能属性，例如 `accessibilityIdentifier`。这使得来自 Compose Multiplatform 的语义数据可供辅助功能服务和 XCTest 框架使用。

## 高对比度主题

Compose Multiplatform 使用来自 Material3 库的 [`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/) 类，该类目前缺乏对高对比度色彩的开箱即用支持。对于 iOS 上的高对比度主题，您需要向应用程序调色盘添加一组额外的颜色。对于每种自定义颜色，应手动指定其高对比度版本。

iOS 提供了 **增强对比度** 辅助功能设置，可以通过检查 `UIAccessibilityDarkerSystemColorsEnabled` 的值来检测。您还可以跟踪 `UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`。这些 API 允许您在启用系统辅助功能设置时切换到高对比度调色盘。

在定义调色盘时，请使用符合 WCAG 标准的对比度检查工具，以验证您选择的 `onPrimary` 颜色与 `primary` 颜色、`onSurface` 与 `surface` 颜色等具有足够的对比度。确保颜色之间的对比度至少为 4.5:1。对于自定义前台和背景颜色，对比度应为 7:1，特别是对于小文本。这适用于您的 `lightColorScheme` 和 `darkColorScheme`。

以下代码演示了如何在您的主题包中定义高对比度浅色和深色调色盘：

```kotlin
import androidx.compose.ui.graphics.Color

// 定义一个数据类来保存高对比度主题的调色盘
data class HighContrastColors(
    val primary: Color, // 主要交互元素、主要文本、顶部应用栏
    val onPrimary: Color, // 显示在“primary”颜色之上的内容
    val secondary: Color, // 次要交互元素、悬浮操作按钮
    val onSecondary: Color, // 显示在“secondary”颜色之上的内容
    val tertiary: Color, // 可选的第三种强调色
    val onTertiary: Color, // 显示在“tertiary”颜色之上的内容
    val background: Color, // 屏幕主背景
    val onBackground: Color, // 显示在“background”颜色之上的内容
    val surface: Color, // 卡片背景、面板、菜单、提升表面
    val onSurface: Color, // 显示在“surface”颜色之上的内容
    val error: Color, // 错误状态和消息
    val onError: Color, // 显示在“error”颜色之上的内容
    val success: Color, // 成功状态和消息
    val onSuccess: Color, // 显示在“success”颜色之上的内容
    val warning: Color, // 警告状态和消息
    val onWarning: Color, // 显示在“warning”颜色之上的内容
    val outline: Color, // 边框、分割线、禁用状态
    val scrim: Color // 遮罩在模态框/面板下方的变暗背景内容
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

// 状态颜色
val ErrorRed = Color(0xFFD32F2F)
val SuccessGreen = Color(0xFF388E3C)
val WarningOrange = Color(0xFFF57C00)

// 浅色高对比度调色盘，浅色背景上的深色内容
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

// 深色高对比度调色盘，深色背景上的浅色内容
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

## 通过触控板和键盘进行控制

iOS 版 Compose Multiplatform 支持额外的输入方式来控制您的设备。除了依赖触摸屏外，您还可以启用 AssistiveTouch 以使用鼠标或触控板，或者启用全键盘控制以使用键盘：

* AssistiveTouch（**设置** | **辅助功能** | **触控** | **AssistiveTouch**）允许您通过连接的鼠标或触控板的指针来控制您的 iPhone。您可以使用指针点击屏幕上的图标、浏览 AssistiveTouch 菜单或使用屏幕键盘进行输入。

  在 iPad 上，连接鼠标或触控板对于基本用法是开箱即用的。但是，如果您想调整指针大小、更改跟踪速度或为按钮分配特定操作，仍需启用 AssistiveTouch。
* 全键盘控制（**设置** | **辅助功能** | **键盘** | **全键盘控制**）支持通过连接的键盘控制设备。您可以使用 **Tab** 等按键进行导航，并使用 **空格键** 激活项目。

## 使用 XCTest 框架测试辅助功能

您可以在测试和其他自动化中使用语义辅助功能数据。`testTag` 等属性会正确映射到原生辅助功能属性，例如 `accessibilityIdentifier`。这使得来自 Compose Multiplatform 的语义数据可供辅助功能服务和 XCTest 框架使用。

您可以在 UI 测试中使用自动化辅助功能审计。为您的 `XCUIApplication` 调用 `performAccessibilityAudit()` 将像辅助功能检查器 (Accessibility Inspector) 一样审计当前视图是否存在辅助功能问题。

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## 自定义辅助功能树的同步

使用默认设置时：
* 仅当辅助功能服务运行时，iOS 辅助功能树才会与 UI 同步。
* 同步事件不会被记录。

您可以使用新的 Compose Multiplatform API 自定义这些设置。

### 选择树同步选项

> 在 Compose Multiplatform 1.8.0 中，[该选项已被移除](whats-new-compose-180.md#loading-accessibility-tree-on-demand)，因为辅助功能树采用延迟同步方式，不再需要额外配置。
>
{style="tip"}

为了调试和测试事件及交互，您可以将同步模式更改为：
* 从不同步树与 UI，例如，用于临时禁用辅助功能映射。
* 始终同步树，以便每次 UI 更新时都进行重写，从而彻底测试辅助功能集成。

> 请记住，在每次 UI 事件后同步树对于调试和测试非常有用，但可能会降低应用的性能。
>
{style="note"}

启用始终同步辅助功能树选项的示例：

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // 您的 @Composable 内容
}
```

`AccessibilitySyncOptions` 类包含所有可用选项：

```kotlin
// package androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // 从不同步辅助功能树的选项
    object Never: AccessibilitySyncOptions

    // 仅在辅助功能服务运行时同步树的选项
    //
    // 您可以包含一个 AccessibilityDebugLogger 来记录交互和树同步事件
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // 始终同步辅助功能树的选项
    //
    // 您可以包含一个 AccessibilityDebugLogger 来记录交互和树同步事件
    class Always(debugLogger: AccessibilityDebugLogger?)
}
```

### 实现日志记录接口

您可以实现 `AccessibilityDebugLogger` 接口，将自定义消息写入您选择的输出：

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
    // 您的 @Composable 内容
}
```

## 下一步

* 在 [Apple 辅助功能](https://developer.apple.com/accessibility/) 指南中了解更多信息。
* 在您常用的 iOS 辅助功能工作流中，尝试由 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/) 生成的项目。