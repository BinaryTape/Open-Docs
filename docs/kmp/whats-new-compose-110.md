[//]: # (title: Compose Multiplatform 1.10.0-beta01 新特性)

以下是本次抢先体验预览 (EAP) 特性发布的主要亮点：
 * [统一的 `@Preview` 注解](#unified-preview-annotation)
 * [支持 Navigation 3](#support-for-navigation-3)
 * [捆绑的 Compose Hot Reload](#compose-hot-reload-integration)

你可以在 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.10.0-beta01) 上找到此版本的完整更改列表。

## 依赖项

*   Gradle 插件 `org.jetbrains.compose`，版本 `1.10.0-beta01`。基于 Jetpack Compose 库：
    *   [Runtime 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.10.0-beta01)
    *   [UI 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.10.0-beta01)
    *   [Foundation 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.10.0-beta01)
    *   [Material 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-material#1.10.0-beta01)
    *   [Material3 1.4.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0)

*   Compose Material3 库 `org.jetbrains.compose.material3:material3*:1.10.0-alpha04`。基于 [Jetpack Compose Material3 1.5.0-alpha07](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha07)。

  要使用 [Expressive 主题](whats-new-compose-190.md#material-3-expressive-theme)，请包含实验性的 Material 3 版本：
    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
    ```
*   Compose Material3 Adaptive 库 `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha01`。基于 [Jetpack Compose Material3 Adaptive 1.3.0-alpha02](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha02)
*   Lifecycle 库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.10.0-alpha04`。基于 [Jetpack Lifecycle 2.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.10.0-beta01)
*   Navigation 库 `org.jetbrains.androidx.navigation:navigation-*:2.9.1`。基于 [Jetpack Navigation 2.9.4](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.4)
*   Navigation 3 库 `org.jetbrains.androidx.navigation:navigation3-*:1.0.0-alpha04`。基于 [Jetpack Navigation 3](https://developer.android.com/jetpack/androidx/releases/navigation3#1.0.0-beta01)
*   Navigation Event 库 `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.0.0-beta01`。基于 [Jetpack Navigation Event 1.0.0-beta01](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.0.0-beta01)
*   Savedstate 库 `org.jetbrains.androidx.savedstate:savedstate*:1.4.0-beta01`。基于 [Jetpack Savedstate 1.4.0-rc01](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0-rc01)
*   WindowManager Core 库 `org.jetbrains.androidx.window:window-core:1.5.0-rc01`。基于 [Jetpack WindowManager 1.5.0](https://developer.android.com/jetpack/androidx/releases/window#1.5.0)

## 跨平台

### 统一的 `@Preview` 注解

我们统一了跨平台预览的方法。
你现在可以在 `commonMain` 源代码集中为所有目标平台使用 `androidx.compose.ui.tooling.preview.Preview` 注解。

所有其他注解，例如 `org.jetbrains.compose.ui.tooling.preview.Preview` 和
桌面特有的 `androidx.compose.desktop.ui.tooling.preview.Preview`，均已被弃用。

### 支持 Navigation 3

Navigation 3 是一个专为 Compose 设计的新导航库。
借助 Navigation 3，你可以完全控制返回栈，
并且导航到目标和从目标返回就像从 list 中添加和删除项一样简单。
关于新的指导原则和决策，请参见 [Navigation 3 文档](https://developer.android.com/guide/navigation/navigation-3)以及公告 [博客文章](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)。

Compose Multiplatform 1.10.0-beta01 为在非 Android 目标上使用新的导航 API 提供了 Alpha 支持。
已发布的多平台构件有：

*   Navigation 3 UI 库，`org.jetbrains.androidx.navigation3:navigation3-ui`
*   Navigation 3 的 ViewModel，`org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3`
*   Navigation 3 的 Material 3 adaptive 布局，`org.jetbrains.compose.material3.adaptive:adaptive-navigation3`

你可以在从原始 Android 版本库镜像的 [nav3-recipes](https://github.com/terrakok/nav3-recipes) 示例中找到多平台 Navigation 3 实现的例子。

一些平台特有的实现细节：

*   在 iOS 上，你现在可以使用 `EndEdgePanGestureBehavior` 选项（默认为 `Disabled`）来管理用于结束边缘[平移手势](https://developer.apple.com/documentation/uikit/handling-pan-gestures)的导航。
  这里的“结束边缘”在从左到右 (LTR) 界面中指屏幕的右边缘，在从右到左 (RTL) 界面中指左边缘。
  起始边缘与结束边缘相对，并且总是绑定到返回手势。
*   在 Web 应用中，在桌面浏览器中按下 **Esc** 键现在会将用户返回到上一个屏幕
  （并关闭对话框、弹窗和一些小组件，如 Material 3 的 `SearchBar`），
  就像在桌面应用中那样。
*   对 [浏览器历史导航](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps) 和在地址栏中使用目标的支持将不会扩展到 Compose Multiplatform 1.10 的 Navigation 3。
  这已推迟到多平台库的更高版本。

### Skia 更新至 Milestone 138

Compose Multiplatform 通过 Skiko 使用的 Skia 版本已更新至 Milestone 138。

以前使用的 Skia 版本是 Milestone 132。
你可以在[发行说明](https://skia.googlesource.com/skia/+/refs/heads/chrome/m138/RELEASE_NOTES.md)中查看这些版本之间的更改。

## iOS

### 窗口内边距

Compose Multiplatform 现在支持 `WindowInsetsRulers`，
它提供了根据窗口内边距（例如状态栏、导航栏或屏幕键盘）定位和调整 UI 元素大小的功能。

这种管理窗口内边距的新方法使用单一实现来检索平台特有的窗口内边距数据。
这意味着 `WindowInsets` 和 `WindowInsetsRulers` 都使用通用机制来一致地管理内边距。
因此，平台特有的局部量，包括 `LocalLayoutMargins`、`LocalSafeArea`、
`LocalKeyboardOverlapHeight` 和 `LocalInterfaceOrientation`，已被移除，取而代之的是新的统一 API。

>以前，`WindowInsets.Companion.captionBar` 未被标记为 `@Composable`。
> 我们添加了 `@Composable` 属性以使其行为在不同平台之间保持一致。
> 
{style="note"}

### 改进的 IME 配置

继 [1.9.0 中引入的](whats-new-compose-190.md#ime-options) iOS 特有的 IME 定制之后，
此版本添加了用于使用 `PlatformImeOptions` 配置文本输入视图的新 API。

这些新 API 允许在字段获得焦点并触发 IME 时定制输入界面：

 * `UIResponder.inputView` 指定一个自定义输入视图来替换默认系统键盘。
 * `UIResponder.inputAccessoryView` 定义一个自定义附件视图，该视图在 IME 激活时附着到系统键盘或自定义 `inputView`。

## 桌面

### Compose Hot Reload 集成

Compose Hot Reload 插件现在已与 Compose Multiplatform Gradle 插件捆绑在一起。
你不再需要单独配置 Hot Reload 插件，
因为它默认在面向桌面的 Compose Multiplatform 项目中启用。

这对显式声明 Compose Hot Reload 插件的项目意味着：

 * 你可以安全地移除声明，以使用 Compose Multiplatform Gradle 插件提供的版本。
 * 如果你选择保留特定版本的声明，将使用该版本而不是捆绑版本。

> 捆绑的 Compose Hot Reload Gradle 插件将 Compose Multiplatform 项目所需的 Kotlin 版本提高到 2.1.20。
> 
{style="warning"}

### SwingPanel 自动调整大小

`SwingPanel` 现在会根据内容的最小、首选和最大尺寸自动调整其大小。
这消除了提前计算确切大小和指定固定尺寸的需要。

```kotlin
val label = JLabel("Hello Swing!")

singleWindowApplication {
    SwingPanel(factory = { label })

    LaunchedEffect(Unit) {
        delay(500)
        // 增大文本
        repeat(2) { 
            label.text = "#${label.text}#"
            delay(200)
        }
        // 缩小文本
        repeat(2) { 
            label.text = label.text.substring(1, label.text.length - 1)
            delay(200)
        }
    }
}
```

## Gradle

### 已弃用的依赖项别名

Compose Multiplatform Gradle 插件支持的依赖项别名（`compose.ui` 等）
在 1.10.0-beta01 版本中已弃用。
我们鼓励你将直接库引用添加到你的版本目录。
相应的弃用通知中建议了具体的引用。

此更改应使 Compose Multiplatform 库的依赖项管理更加透明。
未来，我们希望为 Compose Multiplatform 提供一个 BOM，以简化兼容版本的设置。

### 支持 AGP 9.0.0

Compose Multiplatform 引入了对 Android Gradle 插件 (AGP) 9.0.0 版本的支持。
为了与新的 AGP 版本兼容，请确保你升级到 Compose Multiplatform 1.9.3 或 1.10.0。

为了长期使更新过程更顺畅，
我们建议你更改项目结构，以将 AGP 的使用隔离到专用的 Android 模块中。