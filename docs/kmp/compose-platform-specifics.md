[//]: # (title: 不同平台上的默认 UI 行为)

Compose Multiplatform 旨在帮助您开发在不同平台上尽可能保持相似行为的应用。在本页中，您可以了解使用 Compose Multiplatform 为不同平台编写共享 UI 代码时，应预期的不可避免的差异或暂时的折衷。

## 项目结构

无论您面向哪个平台，每个平台都需要一个专属入口点：

* 对于 Android，它是 `Activity`，其作用是显示来自公共代码的主可组合项。
* 对于 iOS 应用，它是初始化应用的 `@main` 类或结构。
* 对于 JVM 应用，它是启动应用程序并启动主公共可组合项的 `main()` 函数。
* 对于 Kotlin/JS 或 Kotlin/Wasm 应用，它是将主公共代码可组合项附加到网页的 `main()` 函数。

您的应用所需的某些平台特有的 API 可能不具备多平台支持，您将不得不在平台特有的源代码集中实现对这些 API 的调用。在此之前，请查看 [klibs.io](https://klibs.io/)，这是一个 JetBrains 项目，旨在全面收录所有可用的 Kotlin Multiplatform 库。目前已有适用于网络代码、数据库、协程等方面的库。

## 输入方法

### 软键盘

每个平台处理软键盘的方式可能略有不同，包括文本字段变为活跃状态时键盘的显示方式。

Compose Multiplatform 采用了 [Compose 窗口内边距方法](https://developer.android.com/develop/ui/compose/system/insets)，并在 iOS 上模仿了该方法，以考虑 [安全区域](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)。根据您的实现方式，软键盘在 iOS 上的位置可能略有不同。请务必检测键盘是否遮挡了两个平台上重要的 UI 元素。

Compose Multiplatform 目前不支持更改默认 IME 操作，例如，显示放大镜或复选标记，而不是常见的 &crarr; 图标。

### 触控和鼠标支持

当前的桌面实现将所有指针操作解释为鼠标手势，因此不支持多点触控手势。例如，桌面版的 Compose Multiplatform 无法实现常见的捏合缩放手势，因为它需要同时处理两次触控。

## UI 行为与外观

### 平台特有的功能性

某些常见的 UI 元素不被 Compose Multiplatform 涵盖，并且无法使用该框架进行定制。因此，您应该预期它们在不同平台上的外观会有所不同。

原生弹窗视图就是其中一个例子：当您在 Compose Multiplatform 文本字段中选择文本时，**复制**或**翻译**等默认建议操作都是其运行所在平台特有的。

### 滚动物理特性

对于 Android 和 iOS，滚动感受与平台保持一致。对于桌面端，滚动支持仅限于鼠标滚轮（如在 [](#touch-and-mouse-support) 中提及）。

### 互操作视图

如果您想在公共可组合项中嵌入原生视图，反之亦然，您需要熟悉 Compose Multiplatform 支持的平台特有机制。

对于 iOS，有关于 [SwiftUI](compose-swiftui-integration.md) 和 [UIKit](compose-uikit-integration.md) 互操作代码的单独指南。

对于桌面端，Compose Multiplatform 支持 [](compose-desktop-swing-interoperability.md)。

### 返回手势

Android 设备默认支持返回手势，并且每个屏幕都会以某种方式响应**返回**按钮。

在 iOS 上，默认没有返回手势，但鼓励开发者实现类似功能以满足用户体验预期。适用于 iOS 的 Compose Multiplatform 默认支持返回手势，以模仿 Android 功能。

在桌面端，Compose Multiplatform 使用 **Esc** 键作为默认的返回触发器。

有关详细信息，请参见 [](compose-navigation.md#back-gesture) 部分。

### 文本

对于文本，Compose Multiplatform 不保证不同平台之间存在像素级的对应关系：

* 如果您没有显式设置字体，每个系统都会为您的文本分配不同的默认字体。
* 即使是相同的字体，每个平台特有的字母抗锯齿机制也可能导致显著差异。

这对用户体验没有显著影响。相反，默认字体在每个平台上都按预期显示。然而，像素差异可能会干扰截图测试，例如。

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

_预览_ 是在 IDE 中可用的可组合项的非交互式布局呈现。

要查看可组合项的预览：

1. 如果您的项目尚未包含 Android 目标平台，请添加一个（预览机制使用 Android 库）。
2. 在公共代码中使用 `@Preview` 注解标记您想要可预览的可组合项。
3. 在编辑器窗口中切换到 **Split**（分屏）或 **Design**（设计）视图。
     如果您尚未构建项目，它会提示您首次构建项目。

在 IntelliJ IDEA 和 Android Studio 中，您将能够看到当前文件中所有使用 `@Preview` 注解的可组合项的初始布局。

### 热重载

_热重载_ 是指应用即时反映代码更改而无需额外输入的功能。在 Compose Multiplatform 中，热重载功能性仅适用于 JVM（桌面）目标平台。但是，您可以使用它来快速排除故障，然后再切换到您的目标平台进行微调。

要了解更多信息，请参见我们的 [](compose-hot-reload.md) 文章。

## 接下来

阅读更多关于以下组件的 Compose Multiplatform 实现：
  * [资源](compose-multiplatform-resources.md)
  * [](compose-lifecycle.md)
  * [](compose-viewmodel.md)
  * [](compose-navigation-routing.md)