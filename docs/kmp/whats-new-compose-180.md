[//]: # (title: Compose Multiplatform 1.8.2 的最新变化)

以下是此功能版本的主要亮点：

* [可变字体](#variable-fonts)
* [iOS 上的拖放](#drag-and-drop)
* [iOS 上的深层链接](#deep-linking)
* [iOS 上改进的辅助功能](#accessibility-support-improvements)
* [Web 目标的资源预加载](#preloading-of-resources)
* [与浏览器导航控件集成](#browser-controls-supported-in-the-navigation-library)

在 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0) 上查看此版本的完整更改列表。

## 依赖项

* Gradle 插件 `org.jetbrains.compose` 1.8.2 版。基于 Jetpack Compose 库：
    * [Runtime 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    * [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    * [Foundation 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    * [Material 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    * [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
* Lifecycle 库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`。基于 [Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0)
* Navigation 库 `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`。基于 [Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0)
* Material3 Adaptive 库 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`。基于 [Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0)
* Savedstate 库 `org.jetbrains.androidx.savedstate:savedstate:1.3.1`。基于 [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0)
* WindowManager Core 库 `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`。基于 [Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04)

## 破坏性变更

### Compose Multiplatform 全面迁移到 K2 编译器

在此版本中，Compose Multiplatform 代码库已全面迁移到 K2 编译器。
从 1.8.0 开始，
依赖 Compose Multiplatform 的项目所生成的 native 和 web klib
只能在使用 Kotlin 2.1.0 或更高版本时才能被使用。

除了 Compose 编译器 Gradle 插件的基础更改外，这对您的项目还意味着：

* 对于使用依赖 Compose Multiplatform 的库的应用：
  建议将您的项目更新到 Kotlin 2.1.20，
  并将依赖项更新为针对 Compose Multiplatform 1.8.0 和 Kotlin 2.1.x 编译的版本。
* 对于依赖 Compose Multiplatform 的库：
    您需要将项目更新到 Kotlin 2.1.x 和 Compose 1.8.0，
    然后重新编译库并发布新版本。

如果您在升级到 Compose Multiplatform 1.8.0 时遇到任何兼容性问题，
请通过在 [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP) 中提交问题告知我们。

### 删除了对 `material-icons-core` 的隐式依赖

Compose Multiplatform 1.8.2 包含了一项 [Material 中的更改](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)：
不再存在对 `material-icons-core` 的传递依赖。
这与[停止使用基于 K1 构建的依赖项](#full-migration-of-compose-multiplatform-to-the-k2-compiler)的方针一致。

如果您需要继续在项目中使用 `material-icons-core` 库，
请将该依赖项显式添加到您的 `build.gradle.kts` 中，例如：

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

您还可以使用 Material Symbols 库中的 [Android XML 矢量图标](compose-multiplatform-resources-usage.md#icons)。

### Navigation 中从 Bundle 迁移到 SavedState

Compose Multiplatform 1.8.2 中的 Navigation
正与 Android Navigation 组件一起过渡到使用 `SavedState` 类来存储 UI 状态。
这破坏了在导航图中声明目的地时访问状态数据的模式。
当升级到 2.9.* 版本的 [Navigation 库](compose-navigation-routing.md)时，
请务必更新此类代码以使用 `SavedState` 的访问器。

> 为了获得更健壮的架构，
> 请使用[类型安全的导航方法](https://developer.android.com/guide/navigation/design/type-safety)，
> 避免使用字符串路由。
>
{style="note"}

之前：

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.getString("userid")
    val page = navBackStackEntry.arguments?.getString("page")
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

从 Compose Multiplatform 1.8.2 开始：

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.read { getStringOrNull("userid") }
    val page = navBackStackEntry.arguments?.read { getStringOrNull("page") }
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

### iOS 上弃用的 `ComposeUIViewControllerDelegate`

`ComposeUIViewControllerDelegate` API 已被弃用，取而代之的是父视图控制器。
如果您在 Compose Multiplatform 1.8.2 中使用已弃用的 API，您将遇到一个弃用错误，提示 
您应该通过父视图控制器重写 `UIViewController` 类方法。

在 Apple 的开发者[文档](https://developer.apple.com/documentation/uikit/uiviewcontroller)中了解更多关于子父视图控制器关系的信息。

### 删除了 iOS 上已过时的 `platformLayers` 选项

`platformLayers`
实验性选项[是在 1.6.0 中引入的](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)，
用于启用替代分层模式，并在父容器边界之外绘制弹出窗口和对话框。

此模式现在是 iOS 上的默认行为，启用它的选项因已过时而被删除。

### 测试中的破坏性变更

#### 测试中协程延迟的新处理方式

以前，Compose Multiplatform 测试不会将带有 `delay()` 调用的副作用视为为空闲。
因此，例如以下测试将无限期挂起：

```kotlin
@Test
fun loopInLaunchedEffectTest() = runComposeUiTest {
    setContent {
        LaunchedEffect(Unit) {
            while (true) {
                delay(1000)
                println("Tick")
            }
        }
    }
}
```

当协程在组合作用域内启动并调用 `delay()` 函数时，`waitForIdle()`、`awaitIdle()` 
和 `runOnIdle()` 函数现在会认为 Compose 处于空闲状态。
此更改修复了上述挂起的测试，但会破坏依赖 `waitForIdle()`、`awaitIdle()` 和 `runOnIdle()` 
来执行带有 `delay()` 的协程的测试。

要在这些情况下产生相同的结果，请人工推进时间：

```kotlin
var updateText by mutableStateOf(false)
var text by mutableStateOf("0")
setContent {
    LaunchedEffect(updateText) {
        if (updateText) {
            delay(1000)
            text = "1"
        }
    }
}
updateText = true
waitForIdle()
// 由于 waitForIdle() 不再等待延迟的 LaunchedEffect() 完成，
// 测试需要推进时间以使以下断言正确：
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

已经使用 `mainClock.advanceTimeBy()` 调用来推进测试时钟的测试，在重新组合、布局、绘制和效应方面的行为可能会有所不同。

#### 与 Android 保持一致的 `runOnIdle()` 实现

为了使 Compose Multiplatform 的 `runOnIdle()` 测试函数实现与 Android 的行为一致，
我们引入了以下更改：

* `runOnIdle()` 现在在 UI 线程上执行其 `action`。
* `runOnIdle()` 在执行 `action` 后不再调用 `waitForIdle()`。

如果您的测试依赖于 `runOnIdle()` 操作之后额外的 `waitForIdle()` 调用，
请在为 Compose Multiplatform 1.8.2 更新测试时，根据需要添加该调用。

#### 测试中的时间推进与渲染解耦

在 Compose Multiplatform 1.8.2 中，如果时间未推进超过下一帧渲染点（虚拟测试帧每 16 ms 渲染一次），`mainClock.advanceTimeBy()` 函数将不再引起重新组合、布局或绘制。

这可能会破坏依赖于每次 `mainClock.advanceTimeBy()` 调用都会触发渲染的测试。
有关详细信息，请参阅 [PR 说明](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)。

## 跨平台

### 可变字体

Compose Multiplatform 1.8.2 在所有平台上都支持可变字体。
通过可变字体，您可以保留一个包含所有样式偏好的字体文件，例如粗细、
宽度、倾斜、斜体、自定义轴、带有字形颜色的视觉重量，
以及对特定文本大小的适配。

有关详细信息，
请参阅 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)。

### Skia 已更新至 Milestone 132

Compose Multiplatform 通过 Skiko 使用的 Skia 版本已更新至 Milestone 132。

之前使用的 Skia 版本是 Milestone 126。您可以在 [版本说明](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132)中查看这些版本之间的更改。

### 新的 Clipboard 接口

Compose Multiplatform 采用了 Jetpack Compose 的新 `Clipboard` 接口。

以前使用的 `ClipboardManager` 接口由于 [Web 上的 Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) 的异步性质而无法在 Web 目标上访问，
现在已被弃用，取而代之的是 `Clipboard`。新接口支持 `suspend` 函数，并与包括 Web 在内的所有目标兼容。

目前，公共代码中的剪贴板交互受到 API 设计的限制。
有关更多详细信息，请参阅 [CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)。

### 行高对齐

行高对齐的公共 API 
以前仅在 Android 上的 Compose Multiplatform 中受支持，现在在所有平台上都受支持。
使用 `LineHeightStyle.Alignment`，您可以配置文本行在行高提供的空间内如何对齐。
文本行可以对齐到预留空间的底部、中心或顶部，
也可以根据其升部和降部值按比例调整。

<img src="compose-180-LineHeightStyle.png" alt="行高对齐" width="508"/>

请注意，在 Material3 中，行高对齐的默认值为 `Center`，
这意味着在所有平台上的 Material3 组件中，除非另有说明，否则带有 `lineHeight` 的文本将应用居中对齐。

## iOS

### 深层链接

通过结合使用 Compose Multiplatform 1.8.2 和 [org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md)
%org.jetbrains.androidx.navigation%，
您可以按照通常的 Compose 方式在 iOS 上实现深层链接：
为目的地分配深层链接，并使用 `NavController` 导航到这些目的地。

有关在公共代码中引入深层链接的指南，请参阅[深层链接](compose-navigation-deep-links.md)。

### XCFrameworks 中的 Compose 资源

Compose Multiplatform 现在直接在生成的 XCFrameworks 中嵌入资源。
您可以将带有资源的 Compose 库作为标准的 XCFrameworks 进行构建和使用。

此功能需要 Kotlin Gradle 插件 2.2 或更高版本。

### 辅助功能支持改进

#### 支持从右到左的语言

Compose Multiplatform 1.8.2 引入了对从右到左语言的辅助功能支持，
包括对手势的正确文本方向处理。

要了解有关 RTL 支持的更多信息，请参阅[从右到左的语言](compose-rtl.md)。

#### 可滚动列表的辅助功能

此版本提高了滚动边界和元素位置计算的性能和准确性。
通过考虑安全区域（如刘海屏和屏幕边缘），
我们确保了间隙和边距附近滚动的精确辅助功能属性。

我们还引入了对滚动状态播报的支持。
启用 VoiceOver 后，在执行三指滚动手势时，您将听到列表状态更新。
播报内容包括：

* 位于列表顶部时播报“第一页”。
* 向前滚动时播报“下一页”。
* 向后滚动时播报“上一页”。
* 到达末尾时播报“最后一页”。

还提供了这些播报的本地化版本，允许 VoiceOver 以您选择的语言读取它们。

#### 容器视图的辅助功能

从 Compose Multiplatform 1.8.2 开始，
您可以为容器定义遍历语义属性，
以确保在滚动和轻扫复杂视图时具有正确的阅读顺序。

除了为屏幕阅读器正确排序元素外，
对遍历属性的支持还支持通过向上或向下轻扫的辅助功能手势在不同的遍历组之间导航。
要切换到容器的辅助功能导航模式，请在 VoiceOver 处于活动状态时在屏幕上旋转两根手指。

在[辅助功能](compose-accessibility.md#traversal-order)部分了解更多关于遍历语义属性的信息。

#### 可访问的文本输入

在 Compose Multiplatform 1.8.2 中，我们引入了对文本字段辅助功能特性的支持。
当文本输入框获得焦点时，它现在会被标记为可编辑，
从而确保正确的辅助功能状态表示。

您现在还可以在 UI 测试中使用可访问的文本输入。

#### 支持通过触控板和键盘进行控制

iOS 版 Compose Multiplatform 现在支持两种额外的输入方式来控制您的设备。除了依赖触摸屏外， 
您还可以启用辅助触控以使用鼠标或触控板，或者启用全键盘控制以使用键盘：

* 辅助触控（**设置** | **辅助功能** | **触控** | **辅助触控**）允许您使用连接的鼠标或触控板的指针来控制您的 iPhone 或 
 iPad。您可以使用指针点击屏幕上的图标， 
 在辅助触控菜单中导航，或使用屏幕键盘打字。
* 全键盘控制（**设置** | **辅助功能** | **键盘** | **全键盘控制**）支持使用连接的键盘控制设备。 
 您可以使用 **Tab** 等键进行导航，并使用 **空格键** 激活项目。

#### 按需加载辅助功能树

现在，您可以依靠 Compose Multiplatform 延迟处理该过程，
而无需设置 Compose 语义树与 iOS 辅助功能树同步的特定模式。
该树在 iOS 辅助功能引擎发出第一次请求后被完全加载，
并在屏幕阅读器停止与其交互时被销毁。

这允许全面支持 iOS 语音控制、VoiceOver 
以及其他依赖辅助功能树的辅助功能工具。

`AccessibilitySyncOptions` 类（曾用于[配置辅助功能树同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option)）已被删除，因为不再需要。

#### 提高了辅助功能属性计算的准确性

我们更新了 Compose Multiplatform 组件的辅助功能属性， 
以匹配 UIKit 组件的预期行为。
UI 元素现在提供广泛的辅助功能数据，
任何 Alpha 值为 0 的透明组件不再提供辅助功能语义。

对齐语义还允许我们
修复与辅助功能属性计算错误相关的几个问题，
例如 `DropDown` 元素缺少点击区域、
可见文本与辅助功能标签不匹配，以及错误的单选按钮状态。

### 稳定的 iOS 日志记录 API

在 iOS 上启用操作系统日志记录的 API 现已稳定。`enableTraceOSLog()` 函数不再需要 
实验性选择开启，现在与 Android 风格的日志记录保持一致。此类日志记录提供的跟踪信息可以使用 
Xcode Instruments 进行分析，以进行调试和性能分析。

### 拖放
<primary-label ref="Experimental"/>

iOS 版 Compose Multiplatform 引入了对拖放功能的支持，
允许您将内容拖入或拖出 Compose 应用程序
（演示视频请参见拉取请求 [1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690)）。
要定义可拖动内容和放置目标，请使用 `dragAndDropSource` 和 `dragAndDropTarget` 修饰符。

在 iOS 上，拖放会话数据由 [`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem) 表示。
此对象包含有关跨进程数据传输的信息，以及一个用于应用内使用的可选本地对象。
例如，您可以使用 `DragAndDropTransferData(listOf(UIDragItem.fromString(text)))` 来拖动文本，
其中 `UIDragItem.fromString(text)` 将文本编码为适合拖放操作的格式。
目前仅支持 `String` 和 `NSObject` 类型。

有关常见用例，
请参阅 Jetpack Compose 文档中的[专题文章](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)。

### 改进了滚动互操作视图的触摸处理

在此版本中：

* 以模态 `UIViewController` 形式呈现且具有不可滚动内容的 Compose 视图，可以通过向下滑动手势关闭。
* 嵌套的可滚动视图在通用的[互操作触摸框架](compose-ios-touch.md)中可以正常工作：
  当在可滚动的 Compose 视图中滚动原生内容，或在可滚动的原生视图中滚动 Compose 内容时，
  UI 会紧密遵循 iOS 逻辑来解决模糊的触摸序列。

### 选择性开启并发渲染
<primary-label ref="Experimental"/>

iOS 版 Compose Multiplatform 现在支持将渲染任务卸载到专用的渲染线程。
在没有 UIKit 互操作的情况下，并发渲染可能会提高性能。

通过启用 `ComposeUIViewControllerConfiguration` 类的 `useSeparateRenderThreadWhenPossible` 
标志，或直接在 `ComposeUIViewController` 配置块中设置 `parallelRendering` 
属性，选择在单独的渲染线程上对渲染命令进行编码：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main(vararg args: String) {
    UIKitMain {
        ComposeUIViewController(configure = { parallelRendering = true }) {
            // ...
        }
    }
}
```

## Web

### Navigation 库中支持的浏览器控件

在由 Compose Multiplatform 构建的 Kotlin/Wasm 和 Kotlin/JS 应用程序中，
导航现在可以正确配合基本的浏览器控件工作。
要启用此功能，请使用 `window.bindToNavigation()` 方法将浏览器窗口链接到主导航图。
完成此操作后，Web 应用将对使用**后退**和**前进**按钮在浏览器历史记录中移动做出正确反应
（演示视频请参见拉取请求 [1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621)）。

Web 应用还将操作浏览器地址栏以反映当前的目的地路由，
并在用户粘贴带有正确编码路由的 URL 时直接导航到目的地
（演示视频请参见拉取请求 [1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640)）。
`window.bindToNavigation()` 方法具有可选的 `getBackStackEntryPath` 参数，
允许您自定义将路由字符串转换为 URL 片段的过程。

### 设置浏览器光标
<primary-label ref="Experimental"/>

我们引入了实验性的 `PointerIcon.Companion.fromKeyword()` 函数，用于管理可在浏览器页面上作为鼠标 
指针使用的图标。通过传递关键字作为参数，您可以根据上下文指定要显示的光标类型。 
例如，您可以分配不同的指针图标来选择文本、打开上下文菜单或指示加载过程。

查看可用[关键字](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)的完整列表。

### 资源预加载
<primary-label ref="Experimental"/>

Compose Multiplatform 1.8.2 引入了新的实验性 API，
用于为 Web 目标预加载字体和图像。
预加载有助于
防止视觉问题，例如未样式化文本的闪烁 (FOUT) 或图像和图标的闪烁。

以下函数现在可用于加载和缓存资源：

* `preloadFont()`，预加载字体。
* `preloadImageBitmap()`，预加载位图图像。
* `preloadImageVector()`，预加载矢量图像。

有关详细信息，请参阅[文档](compose-web-resources.md#preload-resources-using-the-compose-multiplatform-preload-api)。

## Desktop

### Windows 上的软件渲染改进

在 Windows 上为 Skia 切换到推荐的 clang 编译器加快了依赖 CPU 的渲染速度。
这主要影响纯软件渲染，因为渲染通常依赖于 GPU，只有部分计算在 CPU 上完成。
因此，在某些虚拟机以及少数[不受 Skia 支持](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13)的旧图形卡上，这种改进非常明显：
与 Compose Multiplatform 1.7.3 相比，由 Compose Multiplatform 生成的 Windows 应用在这些环境中的速度现在最高提升了 6 倍。

除了对 Windows for ARM64 的支持外，这项改进还使得 macOS 下虚拟 Windows 系统上的 Compose Multiplatform UI 性能显著提高。

### 支持 Windows for ARM64

Compose Multiplatform 1.8.2 引入了对 JVM 上 Windows for ARM64 的支持，
提高了在基于 ARM 的 Windows 设备上构建和运行应用程序的整体体验。

## Gradle 插件

### 更改生成的 Res 类名的选项

您现在可以自定义生成的资源类的名称，该类提供了对应用中资源的访问。
自定义命名对于区分多模块项目中的资源特别有用，
并有助于保持与项目命名约定的一致性。

要定义自定义名称，请将以下行添加到 `build.gradle.kts` 文件中的 `compose.resources` 块：

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

有关更多详细信息，请参阅 [拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/5296)。

### androidLibrary 目标中对多平台资源的支持
<primary-label ref="Experimental"/>

从 Android Gradle 插件 8.8.0 版开始，您可以在新的 `androidLibrary` 目标中使用生成的资产。 
为了使 Compose Multiplatform 与这些更改保持一致，我们引入了对新目标配置的支持，以处理打包到 
Android 资产中的多平台资源。

如果您正在使用 `androidLibrary` 目标，请在配置中启用资源：

```
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

否则，您将遇到以下异常：`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`。