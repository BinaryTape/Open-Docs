[//]: # (title: 不同平台上的默认 UI 行为)

Compose Multiplatform 旨在帮助您开发出在不同平台行为尽可能相似的应用程序。
在本页面中，您将了解到在使用 Compose Multiplatform 为不同平台编写共享 UI 代码时，
需要预期的不可避免的差异或临时折衷方案。

## 项目结构

无论您面向哪个平台，每个平台都需要一个专属的入口点：

*   对于 Android，它是 `Activity`，其作用是显示来自公共代码的主可组合项。
*   对于 iOS 应用，它是 `@main` 类或结构体，用于初始化应用。
*   对于 JVM 应用，它是 `main()` 函数，用于启动应用程序，进而启动主公共可组合项。
*   对于 Kotlin/JS 或 Kotlin/Wasm 应用，它是 `main()` 函数，用于将主公共代码可组合项
    附加到网页。

您应用所需的某些平台特有 API 可能不具备多平台支持，
您将不得不在平台特有的源代码集中实现这些 API 的调用。
在此之前，请查阅 [klibs.io](https://klibs.io/)，这是一个 JetBrains 项目，旨在全面收录
所有可用的 Kotlin Multiplatform 库。
目前已有适用于网络代码、数据库、协程等多种场景的库可用。

## 输入法

### 软键盘

每个平台处理软键盘的方式可能略有不同，包括文本字段激活时键盘的显示方式。

Compose Multiplatform 采用了 [Compose 窗口插边处理方法](https://developer.android.com/develop/ui/compose/system/insets)
并在 iOS 上模仿了它，
以考虑 [安全区域](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)。
根据您的实现，软键盘在 iOS 上的位置可能会略有不同。
请务必检测键盘是否会遮盖两个平台上的重要 UI 元素。

Compose Multiplatform 目前不支持更改默认 IME action，例如，
显示放大镜或复选标记，而不是通常的 &crarr; 图标。

### 触摸和鼠标支持

当前的桌面实现将所有指针操作解释为鼠标手势，
因此，不支持多点触控手势。
例如，桌面平台的 Compose Multiplatform 无法实现常见的捏合缩放手势，
因为它需要同时处理两次触摸。

## UI 行为和外观

### 平台特有的功能

一些常见的 UI 元素未被 Compose Multiplatform 覆盖，也无法使用该框架进行定制。
因此，您应该预期它们在不同平台上的外观会不同。

原生弹窗视图就是一个例子：
当您在 Compose Multiplatform 文本字段中选择文本时，像 **复制** 或 **翻译** 这样的默认建议操作
是应用运行所在平台特有的。

### 滚动物理特性

对于 Android 和 iOS，滚动感受与平台保持一致。
对于桌面平台，滚动支持仅限于鼠标滚轮（如 [触摸和鼠标支持](#touch-and-mouse-support) 中所述）。

### 互操作视图

如果您想在公共可组合项中嵌入原生视图，或反之，
您需要熟悉 Compose Multiplatform 支持的平台特有机制。

对于 iOS，有针对与 [SwiftUI](compose-swiftui-integration.md) 和 [UIKit](compose-uikit-integration.md) 进行互操作代码的单独指南。

对于桌面平台，Compose Multiplatform 支持 [Swing 互操作性](compose-desktop-swing-interoperability.md)。

### 返回手势

Android 设备默认支持返回手势，并且每个屏幕都会以某种方式响应 **返回** 按钮。

在 iOS 上，默认没有返回手势，尽管鼓励开发者实现类似的功能
以满足用户体验预期。
Compose Multiplatform for iOS 默认支持返回手势，以模仿 Android 功能。

在桌面平台上，Compose Multiplatform 使用 **Esc** 键作为默认返回触发器。

有关详细信息，请参见 [undefined](compose-navigation.md#back-gesture) 节。

### 文本

对于文本，Compose Multiplatform 不保证不同平台之间像素级完美一致：

*   如果您没有显式设置字体，每个系统都会为您的文本分配不同的默认字体。
*   即使是相同的字体，每个平台特有的字母抗锯齿机制也可能导致明显的差异。

这不会对用户体验产生显著影响。相反，默认字体在每个平台上都会如预期般显示。
然而，像素差异可能会干扰截屏测试，例如。

<!-- this should be covered in benchmarking, not as a baseline Compose Multiplatform limitation
### Initial performance

On iOS, you may notice a delay in the initial performance of individual screens compared to Android.
This can happen because Compose Multiplatform compiles UI shaders on demand.
So, if a particular shader is not cached yet, compiling it may delay rendering of a scene.

This issue affects only the first launch of each screen.
Once all necessary shaders are cached, subsequent launches are not delayed by compilation.
-->

## 开发者体验

### 预览

_预览_ 是 IDE 中可组合项的不可交互的布局呈现。

要查看可组合项的预览：

1.  如果项目中没有 Android 目标平台，请添加一个（预览机制使用 Android 库）。
2.  在公共代码中使用 `@Preview` 注解标记您想要预览的可组合项。
3.  切换到编辑器窗口中的 **分割** 视图或 **设计** 视图。
    如果尚未构建项目，它将提示您首次构建。

在 IntelliJ IDEA 和 Android Studio 中，您都将能够看到当前文件中所有
使用 `@Preview` 注解标记的可组合项的初始布局。

### 热重载

_热重载_ 是指应用程序在无需额外输入的情况下即时反映代码更改。
在 Compose Multiplatform 中，热重载功能仅适用于 JVM（桌面）目标平台。
但是，您可以使用它来快速解决问题，然后再切换到目标平台进行细致调整。

要了解更多信息，请参阅我们的 [Compose 热重载](compose-hot-reload.md) 文章。

## 下一步

阅读更多关于 Compose Multiplatform 对以下组件的实现：
*   [资源](compose-multiplatform-resources.md)
*   [生命周期](compose-lifecycle.md)
*   [公共 ViewModel](compose-viewmodel.md)
*   [导航和路由](compose-navigation-routing.md)