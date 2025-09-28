[//]: # (title: Compose Multiplatform 1.9.0 中的新特性)

以下是本次特性发布的亮点：

*   [@Preview 注解的参数](#parameters-for-the-preview-annotation)
*   [可定制的阴影](#customizable-shadows)
*   [新的上下文菜单 API](#new-context-menu-api)
*   [Material 3 表现力主题](#material-3-expressive-theme)
*   [iOS 上的帧率配置](#frame-rate-configuration)
*   [Web 平台上的 Compose Multiplatform 进入 Beta 阶段](#compose-multiplatform-for-web-in-beta)
*   [Web 目标平台上的辅助功能支持](#accessibility-support)
*   [嵌入 HTML 内容的新 API](#new-api-for-embedding-html-content)

关于此版本的所有更改列表，请参见 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.9.0-beta01)。

## 依赖项

*   Gradle 插件 `org.jetbrains.compose`，版本 1.9.0。基于 Jetpack Compose 库：
    *   [Runtime 1.9.0](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.9.0)
    *   [UI 1.9.0](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.9.0)
    *   [Foundation 1.9.0](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.9.0)
    *   [Material 1.9.0](https://developer.android.com/jetpack/androidx/releases/compose-material#1.9.0)
    *   [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)

*   Compose Material3 库 `org.jetbrains.compose.material3:1.9.0-beta06`。基于 [Jetpack Material3 1.4.0-beta03](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-beta03)。

    公共 Material3 库的稳定版本基于 Jetpack Compose Material3 1.3.2，但得益于 Compose Multiplatform 和 Material3 的[解耦版本控制](#decoupled-material3-versioning)，你可以为你的项目选择更新的预发布版本。
*   Compose Material3 Adaptive 库 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha06`。基于 [Jetpack Material3 Adaptive 1.2.0-alpha11](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.2.0-alpha11)
*   Lifecycle 库 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.4`。基于 [Jetpack Lifecycle 2.9.2](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.2)
*   Navigation 库 `org.jetbrains.androidx.navigation:navigation-*:2.9.0`。基于 [Jetpack Navigation 2.9.1](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.1)
*   Savedstate 库 `org.jetbrains.androidx.savedstate:savedstate:1.3.4`。基于 [Jetpack Savedstate 1.3.1](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.1)
*   WindowManager Core 库 `org.jetbrains.androidx.window:window-core:1.4.0`。基于 [Jetpack WindowManager 1.4.0](https://developer.android.com/jetpack/androidx/releases/window#1.4.0)

## 跨平台

### @Preview 注解的参数

Compose Multiplatform 中的 `@Preview` 注解现在包含额外参数，用于配置 `@Composable` 函数在设计时预览中的渲染方式：

*   `name`：预览的显示名称。
*   `group`：预览的分组名称，可用于相关预览的逻辑组织和选择性显示。
*   `widthDp`：最大宽度（单位 dp）。
*   `heightDp`：最大高度（单位 dp）。
*   `locale`：应用程序的当前区域设置。
*   `showBackground`：一个标志，用于将默认背景色应用于预览。
*   `backgroundColor`：一个 32 位 ARGB 整数颜色，定义预览的背景色。

这些新的预览参数在 IntelliJ IDEA 和 Android Studio 中都能识别并生效。

### 可定制的阴影

在 Compose Multiplatform 1.9.0 中，我们引入了可定制的阴影，采用了 Jetpack Compose 新的阴影原语和 API。除了先前支持的 `shadow` 修饰符，你现在可以使用新 API 创建更高级、更灵活的阴影效果。

两种新的原语可用于创建不同类型的阴影：`DropShadowPainter()` 和 `InnerShadowPainter()`。

要将这些新阴影应用于 UI 组件，请使用 `dropShadow` 或 `innerShadow` 修饰符配置阴影效果：

<list columns="2">
   <li><code-block lang="kotlin" code="        Box(&#10;            Modifier.size(120.dp)&#10;                .dropShadow(&#10;                    RectangleShape,&#10;                    DropShadow(12.dp)&#10;                )&#10;                .background(Color.White)&#10;        )&#10;        Box(&#10;            Modifier.size(120.dp)&#10;                .innerShadow(&#10;                    RectangleShape,&#10;                    InnerShadow(12.dp)&#10;                )&#10;        )"/></li>
   <li><img src="compose-advanced-shadows.png" type="inline" alt="Customizable shadows" width="200"/></li>
</list>

你可以绘制任意形状和颜色的阴影，甚至可以使用阴影几何形状作为遮罩来创建内部渐变填充阴影：

<img src="compose-expressive-shadows.png" alt="Expressive shadows" width="244"/>

有关详细信息，请参见 [阴影 API 参考](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/shadow/package-summary.html)。

### 新的上下文菜单 API

我们已采用 Jetpack Compose 的新 API，用于 `SelectionContainer` 和 `BasicTextField` 中的自定义上下文菜单。该实现在 iOS 和 web 上已完成，而桌面端则有初步支持。

<list columns="2">
   <li><img src="compose_basic_text_field.png" type="inline" alt="Context menu for BasicTextField" width="420"/></li>
   <li><img src="compose_selection_container.png" type="inline" alt="Context menu for SelectionContainer" width="440"/></li>
</list>

要启用此新 API，请在应用程序入口点使用以下设置：

```kotlin
ComposeFoundationFlags.isNewContextMenuEnabled = true
```

有关详细信息，请参见 [上下文菜单 API 参考](https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/contextmenu/data/package-summary)。

### Material 3 表现力主题
<secondary-label ref="Experimental"/>

Compose Multiplatform 现在支持来自 Material 3 库的实验性 [`MaterialExpressiveTheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary?hl=en#MaterialExpressiveTheme(androidx.compose.material3.ColorScheme,androidx.compose.material3.MotionScheme,androidx.compose.material3.Shapes,androidx.compose.material3.Typography,kotlin.Function0))。表现力主题化允许你定制 Material Design 应用，以获得更个性化的体验。

{style="note"}
>为与 Jetpack Material3 [1.4.0-beta01 版本](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-beta01) 保持一致，所有带有 `ExperimentalMaterial3ExpressiveApi` 和 `ExperimentalMaterial3ComponentOverrideApi` 标签的公共 API 已被移除。
>
>如果你想使用这些实验性特性，需要显式包含 Alpha 版本的 Material3。

使用表现力主题：

1.  包含 Material 3 的实验性版本：

    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
    ```

2.  使用 `MaterialExpressiveTheme()` 函数配置 UI 元素的整体主题。此函数需要 `@OptIn(ExperimentalMaterial3ExpressiveApi::class)` opt-in，并允许你指定 `colorScheme`、`motionScheme`、`shapes` 和 `typography`。

Material 组件，例如 [`Button()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-button.html) 和 [`Checkbox()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-checkbox.html)，随后将自动使用你提供的值。

<img src="compose_expressive_theme.animated.gif" alt="Material 3 Expressive" width="250" preview-src="compose_expressive_theme.png"/>

### `androidx.compose.runtime:runtime` 中的多平台目标

为了改善 Compose Multiplatform 与 Jetpack Compose 的对齐，我们已将所有目标的支持直接添加到 `androidx.compose.runtime:runtime` 构件中。

`org.jetbrains.compose.runtime:runtime` 构件保持完全兼容，现在作为别名。

### `runComposeUiTest()` 与挂起 lambda

`runComposeUiTest()` 函数现在接受一个 `suspend` lambda，允许你使用 `awaitIdle()` 等挂起函数。

新 API 保证在所有支持的平台上正确执行测试，包括对 Web 环境的适当异步处理：

*   对于 JVM 和原生目标平台，`runComposeUiTest()` 的功能类似于 `runBlocking()`，但跳过延迟。
*   对于 Web 目标平台 (Wasm 和 JS)，它返回一个 `Promise` 并执行测试体，同时跳过延迟。

## iOS

### 帧率配置

Compose Multiplatform for iOS 现在支持配置渲染可组合项的首选帧率。如果动画卡顿，你可能希望提高帧率。另一方面，如果动画缓慢或静态，你可能希望以较低帧率运行它以降低功耗。

你可以按如下方式设置首选帧率类别：

```kotlin
Modifier.preferredFrameRate(FrameRateCategory.High)
```

另外，如果你需要可组合项的特定帧率，可以使用非负数以每秒帧数定义首选帧率：

```kotlin
Modifier.preferredFrameRate(30f)
```

如果在同一个 `@Composable` 树中多次应用 `preferredFrameRate`，将应用指定的最高值。然而，设备的硬件可能会限制支持的帧率，通常最高为 120 Hz。

### IME 选项

Compose Multiplatform 1.9.0 引入了对文本输入组件的 iOS 特有 IME 定制支持。你现在可以使用 `PlatformImeOptions` 直接在文本字段组件中配置原生 UIKit 文本输入特性，例如键盘类型、自动更正和回车键行为：

```kotlin
BasicTextField(
    value = "",
    onValueChange = {},
    keyboardOptions = KeyboardOptions(
        platformImeOptions = PlatformImeOptions {
            keyboardType(UIKeyboardTypeEmailAddress)
        }
    )
)
```

## Web

### Web 平台上的 Compose Multiplatform 进入 Beta 阶段

Web 平台上的 Compose Multiplatform 现已进入 Beta 阶段，正是尝试它的好时机。
关于此版本达成的里程碑进展，请参阅 [我们的博客文章](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)。

在我们努力实现稳定版本的过程中，我们的路线图包括：

*   在移动浏览器中实现拖放功能支持。
*   改进辅助功能支持。
*   解决与 `TextField` 组件相关的问题。

### 辅助功能支持

Compose Multiplatform 现在为 Web 目标平台提供初步的辅助功能支持。此版本使屏幕阅读器能够访问描述标签，并允许用户在辅助功能导航模式下导航和点击按钮。

在此版本中，以下特性尚不受支持：

*   带滚动条和滑块的互操作和容器视图的辅助功能。
*   遍历索引。

你可以定义组件的[语义属性](compose-accessibility.md#semantic-properties)，为辅助功能服务提供各种详细信息，例如组件的文本描述、功能类型、当前状态或唯一标识符。

例如，通过在可组合项上设置 `Modifier.semantics { heading() }`，你将通知辅助功能服务此元素作为标题，类似于文档中的章节或小节标题。屏幕阅读器随后可以使用此信息进行内容导航，允许用户直接跳转到不同标题之间。

```kotlin
Text(
    text = "This is heading", 
    modifier = Modifier.semantics { heading() }
)
```

辅助功能支持现在默认启用，但你可以随时通过调整 `isA11YEnabled` 来禁用：

```kotlin
ComposeViewport(
    viewportContainer = document.body!!,
    configure = { isA11YEnabled = false }
) {
    Text("Hello, Compose Multiplatform for web")
}
```

### 嵌入 HTML 内容的新 API

借助新的 `WebElementView()` 可组合函数，你可以将 HTML 元素无缝集成到你的 Web 应用程序中。

嵌入的 HTML 元素会根据 Compose 代码中定义的大小覆盖画布区域。它会拦截该区域内的输入事件，阻止这些事件被 Compose Multiplatform 接收。

以下是 `WebElementView()` 用于创建和嵌入 HTML 元素的一个示例，该元素在你的 Compose 应用程序中显示交互式地图视图：

```kotlin
private val ttOSM =
    "https://www.openstreetmap.org/export/embed.html?bbox=4.890965223312379%2C52.33722052818563%2C4.893990755081177%2C52.33860862450587&amp;layer=mapnik"

@Composable
fun Map() {
    Box(
        modifier = Modifier.fillMaxWidth().fillMaxHeight()
    ) {
        WebElementView(
            factory = {
                (document.createElement("iframe")
                        as HTMLIFrameElement)
                    .apply { src = ttOSM }
            },
            modifier = Modifier.fillMaxSize(),
            update = { iframe -> iframe.src = iframe.src }
        )
    }
}
```

请注意，你只能将此函数与 `ComposeViewport` 入口点一起使用，因为 `CanvasBasedWindow` 已弃用。

### 简化导航图绑定 API

Compose Multiplatform 引入了一个新 API，用于将浏览器的导航状态绑定到 `NavController`：

```kotlin
suspend fun NavController.bindToBrowserNavigation()
```

新函数消除了直接与 `window` API 交互的需要，简化了 Kotlin/Wasm 和 Kotlin/JS 源代码集。

先前使用的 `Window.bindToNavigation()` 函数已弃用，取而代之的是新的 `NavController.bindToBrowserNavigation()` 函数。

之前：

```kotlin
LaunchedEffect(Unit) {
    // Directly interacts with the window object
    window.bindToNavigation(navController)
}
```

之后：

```kotlin
LaunchedEffect(Unit) {
    // Implicitly accesses the window object
    navController.bindToBrowserNavigation()
}
```

## 桌面端

### 在显示前配置窗口

Compose Multiplatform 现在包含新的 `SwingFrame()` 和 `SwingDialog()` 可组合项。它们与现有的 `Window()` 和 `DialogWindow()` 函数类似，但包含一个 `init` 代码块。

以前，你无法设置某些必须在显示前配置的窗口属性。新的 `init` 代码块会在你的窗口或对话框出现在屏幕之前执行，允许你配置 `java.awt.Window.setType` 等属性，或添加需要提前准备好的事件监听器。

我们建议仅将 `init` 代码块用于窗口或对话框一旦可见后无法更改的属性。对于所有其他配置，请继续使用 `LaunchedEffect(window)` 模式，以确保你的代码保持兼容性，并能正确处理未来的更新。

## Gradle 插件

### Material3 版本解耦

Material3 库和 Compose Multiplatform Gradle 插件的版本和稳定级别不再需要对齐。`compose.material3` DSL 别名现在引用 Jetpack Compose 之前稳定版本中的 Material3 1.8.2。

如果你想使用支持表现力设计的更新 Material3 版本，请将 `build.gradle.kts` 中的 Material 3 依赖项替换为以下内容：

```kotlin
implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
```

### 统一的 Web 分发

新的 `composeCompatibilityBrowserDistribution` Gradle 任务将 Kotlin/JS 和 Kotlin/Wasm 分发包组合成一个单独的包。这允许 Wasm 应用程序在浏览器不支持现代 Wasm 特性时回退到 JS 目标平台。