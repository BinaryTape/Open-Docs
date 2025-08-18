[//]: # (title: 支持 iOS 无障碍特性)

Compose Multiplatform 的无障碍支持功能允许残障人士像使用原生 iOS UI 一样方便地与 Compose Multiplatform UI 交互：

*   屏幕阅读器和 VoiceOver 可以访问 Compose Multiplatform UI 的内容。
*   Compose Multiplatform UI 支持与原生 iOS UI 相同的操作手势，用于导航和交互。

这之所以可能，是因为 Compose API 产生的语义数据现在被映射到原生对象和属性，这些对象和属性由 iOS 无障碍服务（Accessibility Services）使用。对于大多数使用 Material 部件构建的界面，这应该会自动发生。

你还可以在测试和其他自动化中使用这些语义数据：`testTag` 等属性将正确映射到 `accessibilityIdentifier` 等原生无障碍属性。这使得 Compose Multiplatform 中的语义数据可供无障碍服务和 XCTest framework 使用。

## 高对比度主题

Compose Multiplatform 使用 Material3 库中的 [`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/) 类，该类目前尚不提供开箱即用的高对比度颜色支持。对于 iOS 上的高对比度主题，你需要向应用程序调色板添加额外一套颜色。对于每种自定义颜色，都应手动指定其高对比度版本。

iOS 提供了“**增强对比度**”（Increase Contrast）无障碍设置，可以通过检测 `UIAccessibilityDarkerSystemColorsEnabled` 的值来检测该设置。你还可以跟踪 `UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`。当系统无障碍设置启用时，这些 API 允许你切换到高对比度调色板。

定义颜色调色板时，请使用符合 WCAG 标准的对比度检测工具，以验证你选择的 `onPrimary` 颜色与 `primary` 颜色、`onSurface` 颜色与 `surface` 颜色等之间具有足够的对比度。确保颜色之间的对比度至少为 4.5:1。对于自定义前景色和背景色，对比度应为 7:1，特别是对于小文本。这适用于你的 `lightColorScheme` 和 `darkColorScheme`。

此代码演示了如何在主题包中定义高对比度的浅色和深色调色板：

```kotlin
import androidx.compose.ui.graphics.Color

// 定义一个数据类，用于保存高对比度主题的颜色调色板
data class HighContrastColors(
    val primary: Color, // 主要交互元素、主文本、顶部应用栏
    val onPrimary: Color, // 显示在 'primary' 颜色之上的内容
    val secondary: Color, // 次要交互元素、浮动操作按钮
    val onSecondary: Color, // 显示在 'secondary' 颜色之上的内容
    val tertiary: Color, // 可选的第三种强调色
    val onTertiary: Color, // 显示在 'tertiary' 颜色之上的内容
    val background: Color, // 屏幕的主要背景
    val onBackground: Color, // 显示在 'background' 颜色之上的内容
    val surface: Color, // 卡片背景、表单、菜单、浮动表面
    val onSurface: Color, // 显示在 'surface' 颜色之上的内容
    val error: Color, // 错误状态和消息
    val onError: Color, // 显示在 'error' 颜色之上的内容
    val success: Color, // 成功状态和消息
    val onSuccess: Color, // 显示在 'success' 颜色之上的内容
    val warning: Color, // 警告状态和消息
    val onWarning: Color, // 显示在 'warning' 颜色之上的内容
    val outline: Color, // 边框、分隔线、禁用状态
    val scrim: Color // 模态框/表单后面的背景内容调暗
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

// 浅色高对比度调色板，在浅色背景上显示深色内容
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

// 深色高对比度调色板，在深色背景上显示浅色内容
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

Compose Multiplatform for iOS 支持额外的输入方式来控制你的设备。无需依赖触摸屏，你可以启用 AssistiveTouch 来使用鼠标或触控板，或者启用全键盘访问（Full Keyboard Access）来使用键盘：

*   AssistiveTouch（**设置** | **无障碍** | **触控** | **AssistiveTouch**）允许你使用已连接鼠标或触控板的指针控制你的 iPhone。你可以使用指针点击屏幕上的图标、导航 AssistiveTouch 菜单或使用屏幕键盘输入。

    在 iPad 上，连接鼠标或触控板开箱即用，可用于基本用途。但是，如果你想调整指针大小、更改跟踪速度或为按钮分配特定操作，你仍然需要启用 AssistiveTouch。
*   全键盘访问（**设置** | **无障碍** | **键盘** | **全键盘访问**）启用通过已连接键盘控制设备。你可以使用 **Tab** 等按键导航，并使用 **Space** 激活项目。

## 使用 XCTest framework 测试无障碍功能

你可以在测试和其他自动化中使用语义无障碍数据。`testTag` 等属性正确映射到 `accessibilityIdentifier` 等原生无障碍属性。这使得 Compose Multiplatform 中的语义数据可供无障碍服务和 XCTest framework 使用。

你可以在 UI 测试中使用自动化无障碍审计。为你的 `XCUIApplication` 调用 `performAccessibilityAudit()` 将审计当前视图的无障碍问题，正如 Accessibility Inspector 所做的那样。

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## 自定义无障碍树的同步

默认设置下：
*   iOS 无障碍树仅当无障碍服务运行时才与 UI 同步。
*   同步事件不被记录。

你可以使用新的 Compose Multiplatform API 自定义这些设置。

### 选择树同步选项

> 在 Compose Multiplatform 1.8.0 中，[此选项已被移除](whats-new-compose-180.md#loading-accessibility-tree-on-demand)，因为无障碍树是惰性同步的，不再需要额外配置。
>
{style="tip"}

为了调试和测试事件及交互，你可以将同步模式更改为：
*   从不将树与 UI 同步，例如，暂时禁用无障碍映射。
*   始终同步树，以便每次 UI 更新时都会重写，从而彻底测试无障碍集成。

> 请记住，在每次 UI 事件后同步树对于调试和测试可能非常有用，但可能会降低你的应用程序的性能。
>
{style="note"}

一个启用始终同步无障碍树选项的示例：

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // your @Composable content
}
```

`AccessibilitySyncOptions` 类包含所有可用选项：

```kotlin
// package androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // 从不同步无障碍树的选项
    object Never: AccessibilitySyncOptions

    // 仅当无障碍服务运行时才同步树的选项
    //
    // 你可以包含一个 AccessibilityDebugLogger 来记录交互和树同步事件
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // 始终同步无障碍树的选项
    //
    // 你可以包含一个 AccessibilityDebugLogger 来记录交互和树同步事件
    class Always(debugLogger: AccessibilityDebugLogger?)
}
```

### 实现日志接口

你可以实现 `AccessibilityDebugLogger` 接口，将自定义消息写入你选择的输出：

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
    // 你的 @Composable 内容
}
```

## 接下来？

*   在 [Apple 无障碍](https://developer.apple.com/accessibility/) 指南中了解更多。
*   尝试使用 [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/) 生成的项目，在你常用的 iOS 无障碍工作流程中进行实践。