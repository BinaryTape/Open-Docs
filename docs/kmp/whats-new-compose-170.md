[//]: # (title: Compose Multiplatform 1.7.3 新特性)

此特性版本的主要亮点如下：

*   [类型安全的导航](#type-safe-navigation)
*   [共享元素转场](#shared-element-transitions)
*   [打包到 Android asset 中的多平台资源](#resources-packed-into-android-assets)
*   [自定义资源目录](#custom-resource-directories)
*   [支持多平台测试资源](#support-for-multiplatform-test-resources)
*   [改进了 iOS 上的触控互操作](#new-default-behavior-for-processing-touch-in-ios-native-elements)
*   [Material3 `adaptive` 和 `material3-window-size-class` 现已在公共代码中可用](#material3-adaptive-adaptive)
*   [桌面平台实现拖放功能](#drag-and-drop)
*   [`BasicTextField` 桌面平台适配](#basictextfield-renamed-from-basictextfield2-adopted-on-desktop)

有关此版本的完整变更列表，请参见 [GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#170-october-2024)。

## 依赖项

*   Gradle 插件 `org.jetbrains.compose`，版本 1.7.3。基于以下 Jetpack Compose 库：
    *   [Runtime 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.7.5)
    *   [UI 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.7.5)
    *   [Foundation 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.7.5)
    *   [Material 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-material#1.7.5)
    *   [Material3 1.3.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.1)
*   Lifecycle 库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.3`。基于 [Jetpack Lifecycle 2.8.5](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.5)。
*   Navigation 库 `org.jetbrains.androidx.navigation:navigation-*:2.8.0-alpha10`。基于 [Jetpack Navigation 2.8.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.8.0)。
*   Material3 Adaptive 库 `org.jetbrains.compose.material3.adaptive:adaptive-*:1.0.0`。基于 [Jetpack Material3 Adaptive 1.0.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.0.0)。

## 破坏性变更

### 最低 AGP 版本提升至 8.1.0

Jetpack Compose 1.7.0 和 Lifecycle 2.8.0（两者均由 Compose Multiplatform 1.7.0 使用）均不支持 AGP 7。
因此，当您更新到 Compose Multiplatform 1.7.3 时，可能也需要升级您的 AGP 依赖项。

> Android Studio 中新实现的 Android composable 预览功能 [需要最新版本的 AGP](#resources-packed-into-android-assets)。
>
{style="note"}

### Java 资源 API 已弃用，建议改用多平台资源库

在此版本中，我们明确弃用了 `compose.ui` 包中可用的 Java 资源 API：`painterResource()`、`loadImageBitmap()`、`loadSvgPainter()` 和 `loadXmlImageVector()` 函数，以及 `ClassLoaderResourceLoader` 类及其依赖函数。

请考虑迁移到[多平台资源库](compose-multiplatform-resources.md)。
虽然您可以在 Compose Multiplatform 中使用 Java 资源，但它们无法受益于框架提供的扩展特性：例如生成的访问器、多模块支持、本地化等。

如果您仍然需要访问 Java 资源，可以复制[拉取请求中建议的实现](https://github.com/JetBrains/compose-multiplatform-core/pull/1457)，以确保即使在您升级到 Compose Multiplatform 1.7.3 并在可能的情况下切换到多平台资源后，您的代码也能正常工作。

### iOS 原生元素中触控处理的新默认行为

在 1.7.3 之前，Compose Multiplatform 无法响应落在互操作 UI 视图中的触控事件，因此互操作视图完全处理这些触控序列。

Compose Multiplatform 1.7.3 实现了更复杂的逻辑来处理互操作触控序列。
默认情况下，现在在初始触控后会有一个延迟，这有助于父级 composable 判断触控序列是否旨在与原生视图交互，并据此作出响应。

关于更多信息，请参见[本页面的 iOS 部分](#ios-touch-interop)的解释，或参阅[此特性](compose-ios-touch.md)的文档。

### 在 iOS 上禁用最小帧持续时间是强制性的

开发者通常未能注意到有关高刷新率显示器的打印警告，导致用户在支持 120Hz 的设备上无法获得流畅的动画。
我们现在严格执行此检测。如果 `Info.plist` 文件中的 `CADisableMinimumFrameDurationOnPhone` 属性缺失或设置为 `false`，使用 Compose Multiplatform 构建的应用将崩溃。

您可以通过将 `ComposeUIViewControllerConfiguration.enforceStrictPlistSanityCheck` 属性设置为 `false` 来禁用此行为。

### 桌面平台上的 Modifier.onExternalDrag 已弃用

实验性的 `Modifier.onExternalDrag` 及其相关 API 已弃用，建议改用新的 `Modifier.dragAndDropTarget`。
`DragData` 接口已移至 `compose.ui.draganddrop` 包中。

如果您在 Compose Multiplatform 1.7.0 中使用已弃用的 API，将会遇到弃用错误。
在 1.8.0 版本中，`onExternalDrag` 修饰符将被完全移除。

## 跨平台

### 共享元素转场

Compose Multiplatform 现在提供了 API，用于在共享一致元素的 composable 之间实现无缝转场。
这些转场在导航中通常很有用，有助于用户追踪 UI 变化的轨迹。

关于该 API 的深入探讨，请参见 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/animation/shared-elements)。

### 类型安全的导航

Compose Multiplatform 已采用 Jetpack Compose 的类型安全方法，用于在导航路由中传递对象。
Navigation 2.8.0 中的新 API 允许 Compose 为您的导航图提供编译期安全。
这些 API 实现了与基于 XML 导航的 [Safe Args](https://developer.android.com/guide/navigation/use-graph/pass-data#Safe-args) 插件相同的结果。

更多详情，请参见 [Google 关于 Navigation Compose 中类型安全](https://developer.android.com/guide/navigation/design/type-safety)的文档。

### 多平台资源

#### 打包到 Android asset 中的资源

所有多平台资源现在都已打包到 Android asset 中。这允许 Android Studio 为 Android 源代码集中的 Compose Multiplatform composable 生成预览。

> Android Studio 预览仅适用于 Android 源代码集中的 composable。
> 它们还需要最新版本的 AGP 之一：8.5.2、8.6.0-rc01 或 8.7.0-alpha04。
>
{style="note"}

这也允许从 Android 上的 WebView 和媒体播放器组件直接访问多平台资源，因为资源可以通过简单的路径访问，例如 `Res.getUri(“files/index.html”)`。

以下是显示资源 HTML 页面并链接到资源图片的 Android composable 示例：

```kotlin
// androidMain/kotlin/com/example/webview/App.kt
@OptIn(ExperimentalResourceApi::class)
@Composable
@Preview
fun App() {
    MaterialTheme {
        val uri = Res.getUri("files/webview/index.html")

        // Adding a WebView inside AndroidView with layout as full screen.
        AndroidView(factory = {
            WebView(it).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
        }, update = {
            it.loadUrl(uri)
        })
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="AndroidView(factory = { WebView(it).apply"}

该示例适用于以下简单 HTML 文件：

```html
<html>
<header>
    <title>
        Cat Resource
    </title>
</header>
<body>
    <img src="cat.jpg">
</body>
</html>
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="<title>Cat Resource</title>"}

此示例中的两个资源文件都位于 `commonMain` 源代码集中：

![File structure of the composeResources directory](compose-resources-android-webview.png){width="230"}

#### 自定义资源目录

通过配置 DSL 中的新 `customDirectory` 设置，您可以将[自定义目录](compose-multiplatform-resources-setup.md#custom-resource-directories)与特定的源代码集关联起来。这使得例如可以将下载的文件用作资源。

#### 多平台字体缓存

Compose Multiplatform 将 Android 的字体缓存功能引入其他平台，消除了对 `Font` 资源过多的字节读取。

#### 支持多平台测试资源

资源库现在支持在您的项目中使用测试资源，这意味着您可以：

*   将资源添加到测试源代码集。
*   使用仅在相应源代码集中可用的生成访问器。
*   仅在测试运行期间将测试资源打包到应用中。

#### 资源映射到字符串 ID 以方便访问

每种类型的资源都与其文件名进行映射。例如，您可以使用 `Res.allDrawableResources` 属性获取所有 `drawable` 资源的 map，并通过传递其字符串 ID 来访问所需的资源：

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

#### 用于将字节数组转换为 ImageBitmap 或 ImageVector 的函数

有用于将 `ByteArray` 转换为图片资源的新函数：

*   `decodeToImageBitmap()` 将 JPEG、PNG、BMP 或 WEBP 文件转换为 `ImageBitmap` 对象。
*   `decodeToImageVector()` 将 XML 矢量文件转换为 `ImageVector` 对象。
*   `decodeToSvgPainter()` 将 SVG 文件转换为 `Painter` 对象。此函数在 Android 上不可用。

有关详情，请参见[文档](compose-multiplatform-resources-usage.md#convert-byte-arrays-into-images)。

### 新公共模块

#### material3.adaptive:adaptive*

Material3 adaptive 模块现在已在 Compose Multiplatform 的公共代码中可用。
要使用它们，请在模块的 `build.gradle.kts` 文件中，向公共源代码集显式添加相应的依赖项：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-layout:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-navigation:1.0.0-alpha03")
}
```

#### material3.material3-adaptive-navigation-suite

Material3 adaptive navigation suite（在使用 Compose [构建自适应导航](https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation)时必需）在 Compose Multiplatform 的公共代码中可用。
要使用它，请在模块的 `build.gradle.kts` 文件中，向公共源代码集显式添加依赖项：

```kotlin
commonMain.dependencies {
    implementation(compose.material3AdaptiveNavigationSuite)
}
```

#### material3:material3-window-size-class

要使用 [`WindowSizeClass`](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 类，请在模块的 `build.gradle.kts` 文件中，向公共源代码集显式添加 `material3-window-size-class` 依赖项：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3:material3-window-size-class:1.7.3")
}
```

`calculateWindowSizeClass()` 函数尚未在公共代码中可用。
但是，您可以在平台特有的代码中导入并调用它，例如：

```kotlin
// desktopMain/kotlin/main.kt
import androidx.compose.material3.windowsizeclass.calculateWindowSizeClass

// ...

val size = calculateWindowSizeClass()
```

#### material-navigation

`material-navigation` 库除了 Compose Multiplatform Navigation 之外，还在公共代码中可用。
要使用它，请在模块的 `build.gradle.kts` 文件中，向公共源代码集添加以下显式依赖项：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.androidx.navigation:navigation-compose:2.8.0-alpha10")
    implementation("org.jetbrains.compose.material:material-navigation:1.7.0-beta02")
}
```

### Skia 更新至里程碑 126

Compose Multiplatform 通过 [Skiko](https://github.com/JetBrains/skiko) 使用的 Skia 版本已更新至里程碑 126。

之前使用的 Skia 版本是里程碑 116。您可以在[发布说明](https://skia.googlesource.com/skia/+/refs/heads/main/RELEASE_NOTES.md#milestone-126)中查看这些版本之间的变更。

### GraphicsLayer – 新绘图 API

Jetpack Compose 1.7.0 中新增的绘图层现在已在 Compose Multiplatform 中可用。

与 `Modifier.graphicsLayer` 不同，新的 `GraphicsLayer` 类允许您在任何地方渲染 Composable 内容。
这在预期动画内容在不同场景中渲染的情况下非常有用。

有关更详细的描述和示例，请参见[参考文档](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/layer/GraphicsLayer)。

### LocalLifecycleOwner 从 Compose UI 中移出

`LocalLifecycleOwner` 类已从 Compose UI 包移至 Lifecycle 包中。

此变更允许您独立于 Compose UI 访问该类并调用其基于 Compose 的辅助 API。
然而请记住，如果没有 Compose UI 绑定，`LocalLifecycleOwner` 实例将没有平台集成，因此也无法监听平台特有的事件。

## iOS

### 改进了 Compose Multiplatform 与原生 iOS 之间的触控互操作 {id="ios-touch-interop"}

此版本改进了 iOS 互操作视图的触控处理。
Compose Multiplatform 现在尝试检测触控是针对互操作视图，还是应该由 Compose 处理。
这使得处理发生在您的 Compose Multiplatform 应用中 UIKit 或 SwiftUI 区域内的触控事件成为可能。

默认情况下，Compose Multiplatform 将延迟 150 毫秒向互操作视图传递触控事件：

*   如果在此时间范围内，触控移动超过了距离阈值，则父级 composable 将拦截该触控序列，并且不会将其转发到互操作视图。
*   如果没有明显的移动，Compose 将不会处理触控序列的其余部分，而是由互操作视图单独处理。

此行为与原生 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) 的工作方式一致。
它有助于防止在互操作视图中开始的触控序列被拦截，而 Compose Multiplatform 没有机会处理它的情况。这可能导致令人沮丧的用户体验。例如，想象一个在可滚动上下文（例如 lazy list）中使用的互操作视频播放器。当屏幕大部分被视频占据，并且视频拦截所有触控而 Compose Multiplatform 不知情时，滚动 list 会很棘手。

### 原生性能改进

随着 Kotlin 2.0.20 的发布，Kotlin/Native 团队在使 iOS 上的 Compose 应用运行更快、更流畅方面取得了长足进展。
Compose Multiplatform 1.7.3 版本利用了这些优化，并带来了 Jetpack Compose 1.7.0 的性能改进。

当比较 Compose Multiplatform 1.6.11 与 Kotlin 2.0.0 搭配，以及 Compose Multiplatform 1.7.3 与 Kotlin 2.0.20 搭配时，我们看到了全面更好的结果：

*   *LazyGrid* 基准测试模拟 `LazyVerticalGrid` 滚动，这最接近实际使用场景，平均性能提升了约 **9%**。
    它还显著减少了丢帧数量，这通常会使用户感觉 UI 响应不灵敏。
    您可以亲身体验：使用 Compose Multiplatform 为 iOS 构建的应用应该会感觉流畅得多。
*   *VisualEffects* 基准测试渲染大量随机放置的组件，速度提升了 **3.6** 倍：每 1000 帧的平均 CPU 时间从 8.8 秒减少到 2.4 秒。
*   *AnimatedVisibility* composable 动画演示了图片的显示和隐藏，渲染速度提升了约 **6%**。

最重要的是，Kotlin 2.0.20 引入了垃圾收集器中[并发标记](https://kotlinlang.org/docs/whatsnew2020.html#concurrent-marking-in-garbage-collector)的实验性支持。启用并发标记可以缩短垃圾收集器的暂停时间，并为所有基准测试带来更大的改进。

您可以在 Compose Multiplatform 版本库中查看这些 Compose 特有的基准测试代码：

*   [Kotlin/Native 性能基准测试](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/kn-performance)
*   [Kotlin/JVM 对比 Kotlin/Native 基准测试](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/ios/jvm-vs-kotlin-native)

## 桌面

### 拖放

Compose Multiplatform 已在桌面目标平台上实现了拖放机制，该机制使用户能够将内容拖入或拖出您的 Compose 应用程序。
要指定拖放的潜在源和目标，请使用 `dragAndDropSource` 和 `dragAndDropTarget` 修饰符。

> 虽然这些修饰符在公共代码中可用，但它们目前仅在桌面和 Android 源代码集中有效。
> 请关注未来的版本发布。
>
{style="note"}

对于常见用例，请参见 Jetpack Compose 文档中的[专用文章](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)。

### 桌面平台适配 BasicTextField，原 BasicTextField2

Jetpack Compose 已将 `BasicTextField2` 组件稳定化并重命名为 `BasicTextField`。
在此版本中，Compose Multiplatform 已在桌面目标平台上适配了此变更，并计划在稳定版 1.7.0 中也涵盖 iOS。

新的 `BasicTextField`：

*   允许您更可靠地管理状态。
*   提供了新的 `TextFieldBuffer` API，用于以编程方式更改文本字段内容。
*   包含了多个用于视觉转换和样式设置的新 API。
*   提供对 `UndoState` 的访问，能够返回到字段的先前状态。

### ComposePanel 的渲染设置

通过在 `ComposePanel` 构造函数中指定新的 `RenderSettings.isVsyncEnabled` 形参，您可以提示后端渲染实现禁用垂直同步。
这可以减少输入和 UI 变化之间的视觉延迟，但也可能导致画面撕裂。

默认行为保持不变：`ComposePanel` 尝试将可绘制的呈现与 VSync 同步。

## Web

### skiko.js 对于 Kotlin/Wasm 应用程序是冗余的

对于使用 Compose Multiplatform 构建的 Kotlin/Wasm 应用程序来说，`skiko.js` 文件现在是冗余的。
您可以从 `index.html` 文件中移除它，并缩短您的应用加载时间。
`skiko.js` 将在未来的版本中从 Kotlin/Wasm 分发中完全移除。

> `skiko.js` 文件对于 Kotlin/JS 应用程序仍然是必需的。
>
{style="note"}