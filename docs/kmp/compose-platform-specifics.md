[//]: # (title: 不同平台上的默认 UI 行为)

Compose Multiplatform 旨在帮助您产出在不同平台上行为尽可能相似的应用。
在本页中，您可以了解在使用 Compose Multiplatform 为不同平台编写共享 UI 代码时，
可能遇到的一些不可避免的差异或临时折衷。

## 项目结构 (Project structure)

无论您的目标平台是什么，每个平台都需要一个专门的入口点：

* 对于 Android，入口点是 `Activity`，其职责是显示来自公共代码的主可组合项 (main composable)。
* 对于 iOS 应用，入口点是用于初始化应用的 `@main` 类或结构。
* 对于 JVM 应用，入口点是启动应用程序并启动主公共可组合项的 `main()` 函数。
* 对于 Kotlin/JS 或 Kotlin/Wasm 应用，入口点是将主公共代码可组合项附加到网页的 `main()` 函数。

您的应用所需的某些平台特定 API 可能没有多平台支持，
您必须在平台特定的源集 (source set) 中实现对这些 API 的调用。
在开始之前，请查看 [klibs.io](https://klibs.io/)，这是一个 JetBrains 项目，旨在全面收录所有可用的 Kotlin Multiplatform 库。
目前已有针对网络代码、数据库、协程 (coroutines) 等内容的库可供使用。

## 输入方法 (Input methods)

### 软件键盘 (Software keyboards)

每个平台处理软件键盘的方式可能略有不同，包括当文本字段变为活动状态时键盘出现的方式。

Compose Multiplatform 采用了 [Compose 窗口内边距 (window insets) 方法](https://developer.android.com/develop/ui/compose/system/insets)，
并在 iOS 上对其进行模拟，以兼顾 [安全区域 (safe areas)](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)。
根据您的实现方式，软件键盘在 iOS 上的位置可能略有不同。
请务必检查键盘在两个平台上是否都不会遮挡重要的 UI 元素。

### 触摸和鼠标支持 (Touch and mouse support)

当前的桌面端实现将所有文本光标操作解释为鼠标手势，
因此不支持多点触控 (multitouch) 手势。
例如，常见的捏合缩放 (pinch-to-zoom) 手势无法在桌面端 Compose Multiplatform 中实现，
因为它需要同时处理两个触摸点。

## UI 行为和外观 (UI behavior and appearance)

### 平台特定功能 (Platform-specific functionality)

一些通用的 UI 元素并未包含在 Compose Multiplatform 中，且无法使用该框架进行自定义。
因此，您应该预料到它们在不同平台上的外观会有所不同。

原生弹出视图就是一个例子：
当您在 Compose Multiplatform 文本字段中选择文本时，默认的建议操作（如 **Copy** (复制) 或 **Translate** (翻译)）
取决于应用运行的具体平台。

### 滚动物理效果 (Scroll physics)

对于 Android 和 iOS，滚动的触感与平台保持一致。
对于桌面端，滚动支持仅限于鼠标滚轮（如 [待确认](#touch-and-mouse-support) 中所述）。 

### 互操作视图 (Interop views)

如果您想在公共可组合项中嵌入原生视图，或者反之亦然，
您需要熟悉 Compose Multiplatform 支持的平台特定机制。

对于 iOS，有针对 [SwiftUI](compose-swiftui-integration.md) 和 [UIKit](compose-uikit-integration.md) 的互操作代码单独指南。

对于桌面端，Compose Multiplatform 支持 [Swing 互操作性](compose-desktop-swing-interoperability.md)。

### 返回手势 (Back gesture)

Android 设备默认支持返回手势，每个屏幕都会以某种方式对 **Back** (返回) 按钮做出反应。

在 iOS 上，默认没有返回手势，尽管鼓励开发者实现类似的功能以满足用户体验预期。
iOS 版 Compose Multiplatform 默认支持返回手势，以模拟 Android 的功能。

在桌面端，Compose Multiplatform 使用 **Esc** 键作为默认的返回触发键。

有关详情，请参阅 [待确认](compose-navigation.md#back-gesture) 部分。

### 文本 (Text)

对于文本，Compose Multiplatform 并不保证不同平台之间的像素级完美对应：

* 如果您没有显式设置字体，每个系统都会为您的文本分配不同的默认字体。
* 即使使用相同的字体，每个平台特有的字母抗锯齿 (aliasing) 机制也可能导致明显的差异。

这不会对用户体验产生显著影响。相反，默认字体在每个平台上都会按预期显示。
然而，像素差异可能会干扰屏幕截图测试 (screenshot testing) 等工作。

<!-- 这一部分应该在基准测试中涵盖，而不是作为 Compose Multiplatform 的基本限制
### 初始性能 (Initial performance)

在 iOS 上，您可能会注意到单个屏幕的初始性能与 Android 相比存在延迟。
发生这种情况是因为 Compose Multiplatform 根据需要编译 UI 着色器 (shaders)。
因此，如果特定的着色器尚未缓存，编译它可能会延迟场景的渲染。

此问题仅影响每个屏幕的首次启动。
一旦所有必要的着色器都已缓存，后续启动将不会因编译而延迟。
-->

## 开发者体验 (Developer experience)

### 预览 (Previews)

*预览 (Previews)* 是使用 `@Preview` 注解的可组合项的布局展示，可以与 IntelliJ IDEA 和 Android Studio 中的共享 UI 代码并行渲染。

预览需要特定的项目配置和显式依赖项。
请参阅 [Compose UI 预览](compose-previews.md) 了解如何在您的项目中启用预览。

### 热重载 (Hot reload)

*热重载 (Hot reload)* 是指应用能够实时反映代码更改而无需额外输入。
在 Compose Multiplatform 中，热重载功能仅适用于 JVM（桌面端）目标。
但是，您可以使用它快速排查问题，然后再切换到目标平台进行精细调整。

要了解更多信息，请参阅我们的 [Compose 热重载](compose-hot-reload.md) 文章。 

## 下一步 (What's next)

阅读更多关于以下组件的 Compose Multiplatform 实现：
  * [资源 (Resources)](compose-multiplatform-resources.md)
  * [生命周期 (Lifecycle)](compose-lifecycle.md)
  * [通用 ViewModel](compose-viewmodel.md)
  * [导航与路由 (Navigation and routing)](compose-navigation-routing.md)