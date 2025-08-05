[//]: # (title: Compose Multiplatform 1.8.2 新特性)
此特性版本的主要亮点如下：

*   [可变字体](#variable-fonts)
*   [iOS 上的拖放](#drag-and-drop)
*   [iOS 上的深层链接](#deep-linking)
*   [iOS 上的辅助功能改进](#accessibility-support-improvements)
*   [Web 目标平台的资源预加载](#preloading-of-resources)
*   [与浏览器导航控件集成](#browser-controls-supported-in-the-navigation-library)

关于此版本的完整更改列表，请[参见 GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0)。

## 依赖项

*   Gradle Plugin `org.jetbrains.compose`，版本 1.8.2。基于 Jetpack Compose 库：
    *   [Runtime 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    *   [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    *   [Foundation 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    *   [Material 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    *   [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
*   Lifecycle 库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`。基于 [Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0)
*   Navigation 库 `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`。基于 [Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0)
*   Material3 Adaptive 库 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`。基于 [Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0)
*   Savedstate 库 `org.jetbrains.androidx.savedstate:savedstate:1.3.1`。基于 [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0)
*   WindowManager Core 库 `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`。基于 [Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04)

## 重大变更

### Compose Multiplatform 完全迁移至 K2 编译器

此版本中，Compose Multiplatform 代码库已完全迁移至 K2 编译器。
从 1.8.0 版本开始，依赖 Compose Multiplatform 的项目所生成的原生和 Web klib 仅在使用 Kotlin 2.1.0 或更高版本时才能被使用。

除了 Compose 编译器 Gradle 插件的底层变更之外，这对您的项目意味着：

*   对于使用依赖 Compose Multiplatform 库的应用程序：
    建议您将项目更新到 Kotlin 2.1.20，并将依赖项更新到针对 Compose Multiplatform 1.8.0 和 Kotlin 2.1.x 编译的版本。
*   对于依赖 Compose Multiplatform 的库：
    您需要将项目更新到 Kotlin 2.1.x 和 Compose 1.8.0，然后重新编译该库并发布新版本。

如果您在升级到 Compose Multiplatform 1.8.0 时遇到任何兼容性问题，请通过在 [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP) 中提交问题告知我们。

### `material-icons-core` 的隐式依赖项已移除

Compose Multiplatform 1.8.2 包含了 [Material 中的一项变更](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)：不再存在对 `material-icons-core` 的传递依赖项。
这与[放弃使用 K1 构建的依赖项](#full-migration-of-compose-multiplatform-to-the-k2-compiler)的趋势保持一致。

如果您的项目需要继续使用 `material-icons-core` 库，请将其依赖项显式添加到 `build.gradle.kts` 中，例如：

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

### Navigation 中从 Bundle 迁移到 SavedState

Compose Multiplatform 1.8.2 中的 Navigation，以及 Android Navigation 组件，正在过渡到使用 `SavedState` 类来存储 UI 状态。
这打破了在导航图中声明目标时访问状态数据的模式。
升级到 2.9.* 版本的 [Navigation 库](compose-navigation-routing.md)时，请确保更新此类代码以使用 `SavedState` 的访问器。

> 为了更稳健的架构，请使用[类型安全的导航方法](https://developer.android.com/guide/navigation/design/type-safety)，避免使用字符串路由。
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

### iOS 上已废弃的 `ComposeUIViewControllerDelegate`

`ComposeUIViewControllerDelegate` API 已被废弃，转而支持父视图控制器。
如果您在 Compose Multiplatform 1.8.2 中使用已废弃的 API，将会遇到废弃错误，提示您应该通过父视图控制器覆盖 `UIViewController` 类方法。

关于子父视图控制器关系的更多信息，请参阅 Apple 开发者[文档](https://developer.apple.com/documentation/uikit/uiviewcontroller)。

### iOS 上已移除废弃的 `platformLayers` 选项

`platformLayers` 实验性选项[在 1.6.0 中引入](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)，旨在允许启用替代分层模式并在父容器边界之外绘制弹出窗口和对话框。

此模式现在是 iOS 上的默认行为，并且启用此选项已作为废弃项被移除。

### 测试中的重大变更

#### 测试中协程延迟的新处理方式

此前，Compose Multiplatform 测试不会将包含 `delay()` 调用的副作用视为空闲。
正因如此，例如，以下测试将无限期挂起：

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

当协程在组合作用域中启动后调用 `delay()` 函数时，`waitForIdle()`、`awaitIdle()` 和 `runOnIdle()` 函数现在会认为 Compose 处于空闲状态。
此变更修复了上述挂起测试，但会破坏那些依赖 `waitForIdle()`、`awaitIdle()` 和 `runOnIdle()` 来执行带有 `delay()` 的协程的测试。

为了在这些情况下产生相同的结果，请人工推进时间：

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
// Since waitForIdle() no longer waits for the delayed LaunchedEffect() to complete,
// the test needs to advance time to make the following assertion correct:
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

已经使用 `mainClock.advanceTimeBy()` 调用来推进测试时钟的测试，可能会在重新组合、布局、绘制和效果方面表现不同。

#### `runOnIdle()` 的实现与 Android 对齐

为了使 Compose Multiplatform 中 `runOnIdle()` 测试函数 的实现与 Android 行为保持一致，我们引入了以下变更：

*   `runOnIdle()` 现在在 UI 线程上执行其 `action`。
*   `runOnIdle()` 在执行 `action` 后不再调用 `waitForIdle()`。

如果您的测试依赖于 `runOnIdle()` action 后的额外 `waitForIdle()` 调用，请在为 Compose Multiplatform 1.8.2 更新测试时，根据需要将该调用添加到您的测试中。

#### 测试中时间推进与渲染解耦

在 Compose Multiplatform 1.8.2 中，如果时间未推进到渲染下一帧（虚拟测试帧每 16 毫秒渲染一次）之后，`mainClock.advanceTimeBy()` 函数将不再引起重新组合、布局或绘制。

这可能会破坏那些依赖于每次 `mainClock.advanceTimeBy()` 调用触发渲染的测试。
关于详情，请[参见 PR 描述](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)。

## 跨平台

### 可变字体

Compose Multiplatform 1.8.2 支持所有平台上的可变字体。
借助可变字体，您可以保留一个字体文件，其中包含所有样式偏好设置，例如字重、宽度、倾斜、斜体、自定义轴、带有印刷色彩的视觉字重以及对特定文本尺寸的适应。

关于详情，请[参见 Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)。

### Skia 已更新至里程碑 132

Compose Multiplatform 通过 Skiko 使用的 Skia 版本已更新至里程碑 132。

之前使用的 Skia 版本是里程碑 126。您可以在[发行说明](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132)中查看这些版本之间的变更。

### 新的 Clipboard 接口

Compose Multiplatform 已采用 Jetpack Compose 的新 `Clipboard` 接口。

之前使用的 `ClipboardManager` 接口因 [Web 上的 Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) 的异步特性而在 Web 目标平台不可访问，现已废弃，转而支持 `Clipboard`。新接口支持 `suspend` 函数，并兼容所有目标平台，包括 Web。

通用代码中的 Clipboard 交互目前受到 API 设计的限制。
关于更多详情，请[参见 CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)。

### 行高对齐

之前仅在 Android 上由 Compose Multiplatform 支持的通用行高对齐 API，现在已在所有平台受支持。
使用 `LineHeightStyle.Alignment`，您可以配置文本行如何在行高提供的空间内对齐。
文本行可以对齐到保留空间的底部、中心或顶部，或根据其上升和下降值按比例调整。

<img src="compose-180-LineHeightStyle.png" alt="行高对齐" width="508"/>

请注意，在 Material3 中，行高对齐的默认值为 `Center`，这意味着除非另行指定，否则 Material3 组件中带有 `lineHeight` 的文本将在所有平台应用居中对齐。

## iOS

### 深层链接

通过将 Compose Multiplatform 1.8.2 与 [org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md) %org.jetbrains.androidx.navigation% 一起使用，您可以以常见的 Compose 方式在 iOS 上实现深层链接：将深层链接分配给目标并使用 `NavController` 导航到它们。

关于在通用代码中引入深层链接的指南，请[参见](compose-navigation-deep-links.md)。

### XCFrameworks 中的 Compose 资源

Compose Multiplatform 现在将资源直接嵌入到生成的 XCFrameworks 中。
您可以将带有资源的 Compose 库构建并用作标准 XCFrameworks。

此特性需要 Kotlin Gradle 插件版本 2.2 或更高版本。

### 辅助功能支持改进

#### 支持从右到左的语言

Compose Multiplatform 1.8.2 引入了对从右到左语言的辅助功能支持，包括对手势的正确文本方向处理。

关于 RTL 支持的更多信息，请[参考](compose-rtl.md)。

#### 可滚动列表的辅助功能

此版本改进了滚动边界和元素位置计算的性能和准确性。
通过考虑安全区域，例如刘海屏和屏幕边缘，我们确保了在间隙和边距附近滚动的精确辅助功能属性。

我们还引入了对滚动状态公告的支持。
启用 VoiceOver 后，在执行三指滚动手势时，您将听到列表状态更新。
公告包括：

*   "首页" （当位于列表顶部时）。
*   "下一页" （向前滚动时）。
*   "上一页" （向后滚动时）。
*   "最后一页" （到达末尾时）。

这些公告也提供了本地化版本，允许 VoiceOver 以您选择的语言读取它们。

#### 容器视图的辅助功能

从 Compose Multiplatform 1.8.2 开始，您可以为容器定义遍历语义属性，以确保在滚动和滑动复杂视图时有正确的阅读顺序。

除了为屏幕阅读器正确排序元素外，对遍历属性的支持还允许使用向上或向下轻扫的辅助功能手势在不同的遍历组之间导航。
要切换到容器的辅助功能导航模式，请在 VoiceOver 激活时在屏幕上旋转两根手指。

关于遍历语义属性的更多信息，请参阅[辅助功能](compose-accessibility.md#traversal-order)部分。

#### 可访问的文本输入

在 Compose Multiplatform 1.8.2 中，我们引入了对文本字段辅助功能特性的支持。
当文本输入字段获得焦点时，它现在被标记为可编辑，确保了正确的辅助功能状态表示。

您现在还可以在 UI 测试中使用可访问的文本输入。

#### 支持通过触控板和键盘进行控制

Compose Multiplatform for iOS 现在支持两种额外的输入方法来控制您的设备。您可以使用 AssistiveTouch 来使用鼠标或触控板，或者使用完全键盘访问来使用键盘，而不是依赖于触控屏：

*   AssistiveTouch (**设置** | **辅助功能** | **触控** | **AssistiveTouch**) 允许您使用连接的鼠标或触控板上的指针来控制您的 iPhone 或 iPad。您可以使用指针点击屏幕上的图标、浏览 AssistiveTouch 菜单或使用屏幕键盘输入。
*   完全键盘访问 (**设置** | **辅助功能** | **键盘** | **完全键盘访问**) 支持使用连接的键盘控制设备。您可以使用 **Tab** 等按键进行导航，并使用 **Space** 激活项目。

#### 按需加载辅助功能树

现在，您无需设置将 Compose 语义树与 iOS 辅助功能树同步的特定模式，而是可以依赖 Compose Multiplatform 惰性地处理此过程。
该树在收到 iOS 辅助功能引擎的第一个请求后完全加载，并在屏幕阅读器停止与其交互时被释放。

这使得完全支持 iOS 语音控制、VoiceOver 和其他依赖辅助功能树的辅助功能工具成为可能。

`AccessibilitySyncOptions` 类（此前[用于配置辅助功能树同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option)）已被移除，因为它不再是必需的。

#### 辅助功能属性计算准确性改进

我们已更新 Compose Multiplatform 组件的辅助功能属性，以匹配 UIKit 组件的预期行为。
UI 元素现在提供全面的辅助功能数据，并且任何 alpha 值为 0 的透明组件不再提供辅助功能语义。

语义对齐也使我们能够修复与辅助功能属性不正确计算相关的几个问题，例如 `DropDown` 元素的点击区域缺失、可见文本与辅助功能标签不匹配以及单选按钮状态不正确等。

### iOS 日志记录的稳定 API

在 iOS 上启用操作系统日志记录的 API 现在已稳定。`enableTraceOSLog()` 函数不再需要实验性选择加入，并且现在与 Android 风格的日志记录保持一致。此日志记录提供了可使用 Xcode Instruments 进行调试和性能分析的追踪信息。

### 拖放
<secondary-label ref="Experimental"/>

Compose Multiplatform for iOS 引入了对拖放功能的​​支持，允许您将内容拖入或拖出 Compose 应用程序（关于演示视频，请[参见](https://github.com/JetBrains/compose-multiplatform-core/pull/1690)拉取请求 [1690]）。
要定义可拖动内容和拖放目标，请使用 `dragAndDropSource` 和 `dragAndDropTarget` 修饰符。

在 iOS 上，拖放会话数据由 [`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem) 表示。
此对象包含跨进程数据传输的信息以及用于应用内使用的可选本地对象。
例如，您可以使用 `DragAndDropTransferData(listOf(UIDragItem.fromString(text)))` 来拖动文本，其中 `UIDragItem.fromString(text)` 将文本编码为适合拖放操作的格式。
目前，仅支持 `String` 和 `NSObject` 类型。

关于常见用例，请[参见](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) Jetpack Compose 文档中的[专用文章](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)。

### 改进了滚动互操作视图的触控处理

在此版本中：

*   以模态 `UIViewController` 形式呈现的、包含不可滚动内容的 Compose 视图，可以通过向下轻扫手势关闭。
*   嵌套可滚动视图在通用[互操作框架](compose-ios-touch.md)内正常工作：当在可滚动 Compose 视图内滚动原生内容，或在可滚动原生视图内滚动 Compose 内容时，UI 会严格遵循 iOS 逻辑来解决模糊的触控序列。

### 选择启用并发渲染
<secondary-label ref="Experimental"/>

Compose Multiplatform for iOS 现在支持将渲染任务卸载到专用渲染线程。
在不涉及 UIKit 互操作的场景中，并发渲染可能会提高性能。

通过启用 `ComposeUIViewControllerConfiguration` 类的 `useSeparateRenderThreadWhenPossible` 标志，或直接在 `ComposeUIViewController` 配置块中设置 `parallelRendering` 属性，选择在单独的渲染线程上编码渲染命令：

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

### Navigation 库中支持浏览器控件

在用 Compose Multiplatform 构建的 Kotlin/Wasm 和 Kotlin/JS 应用程序中，导航现在可以正确地与基本浏览器控件配合使用。
要启用此功能，请使用 `window.bindToNavigation()` 方法将浏览器窗口链接到主导航图。
一旦您这样做，Web 应用将正确响应使用**后退**和**前进**按钮在浏览器历史中移动（关于演示视频，请[参见](https://github.com/JetBrains/compose-multiplatform-core/pull/1621)拉取请求 [1621]）。

Web 应用还将操作浏览器地址栏以反映当前目标路由，并在用户粘贴包含正确编码路由的 URL 时直接导航到目标（关于演示视频，请[参见](https://github.com/JetBrains/compose-multiplatform-core/pull/1640)拉取请求 [1640]）。
`window.bindToNavigation()` 方法具有可选的 `getBackStackEntryPath` 形参，它允许您自定义路由字符串到 URL 片段的转换。

### 设置浏览器光标
<secondary-label ref="Experimental"/>

我们引入了一个实验性的 `PointerIcon.Companion.fromKeyword()` 函数，用于管理可在浏览器页面上用作鼠标指针的图标。通过将关键字作为形参传递，您可以根据上下文指定要显示的光标类型。例如，您可以分配不同的指针图标来选择文本、打开上下文菜单或指示加载过程。

查看可用[关键字](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)的完整列表。

### 资源预加载
<secondary-label ref="Experimental"/>

Compose Multiplatform 1.8.2 引入了一个新的实验性 API，用于为 Web 目标平台预加载字体和图像。
预加载有助于防止视觉问题，例如未样式化文本的闪烁 (FOUT) 或图像和图标的闪烁。

以下函数现在可用于加载和缓存资源：

*   `preloadFont()`，预加载字体。
*   `preloadImageBitmap()`，预加载位图图像。
*   `preloadImageVector()`，预加载矢量图像。

关于详情，请[参见文档](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api)。

## 桌面

### Windows 上的软件渲染改进

在 Windows 上切换到推荐的用于 Skia 的 clang 编译器，加快了依赖 CPU 的渲染速度。
这主要影响纯软件渲染，因为渲染通常依赖 GPU，只有部分计算在 CPU 上完成。
因此，在某些虚拟机和一些[不受 Skia 支持](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13)的旧显卡上，这种改进非常显著：Compose Multiplatform 生产的 Windows 应用在这些环境中的速度现在比 Compose Multiplatform 1.7.3 快达 6 倍。

这项改进，加上对 Windows for ARM64 的支持，使得 macOS 下虚拟 Windows 系统上的 Compose Multiplatform UI 性能显著提升。

### 支持 Windows for ARM64

Compose Multiplatform 1.8.2 引入了对 JVM 上 Windows for ARM64 的支持，改进了在基于 ARM 的 Windows 设备上构建和运行应用程序的整体体验。

## Gradle 插件

### 更改生成的 Res 类名称的选项

您现在可以自定义生成的资源类的名称，该类提供对您应用中资源的访问。
自定义命名对于区分多模块项目中的资源特别有用，并有助于与您项目的命名约定保持一致。

要定义自定义名称，请将以下行添加到 `build.gradle.kts` 文件中的 `compose.resources` 块中：

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

关于更多详情，请[参见](https://github.com/JetBrains/compose-multiplatform/pull/5296)该[拉取请求](https://github.com/JetBrains/compose-multiplatform/pull/5296)。

### `androidLibrary` 目标平台中多平台资源的支持
<secondary-label ref="Experimental"/>

从 Android Gradle 插件 8.8.0 版本开始，您可以在新的 `androidLibrary` 目标平台中使用生成的 assets。
为了使 Compose Multiplatform 与这些变更保持一致，我们引入了对新目标配置的支持，以处理打包到 Android assets 中的多平台资源。

如果您正在使用 `androidLibrary` 目标平台，请在您的配置中启用资源：

```
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

否则，您将遇到以下异常：`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`。