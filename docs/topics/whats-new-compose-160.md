[//]: # (title: Compose Multiplatform 1.6.0 新特性)

以下是 Compose Multiplatform 1.6.0 版本的亮点：

*   [破坏性变更](#breaking-changes)
*   [全新且改进的资源 API](#improved-resources-api-all-platforms)
*   [对 iOS 辅助功能的基本支持](#accessibility-support)
*   [面向所有平台的 UI 测试 API](#ui-testing-api-experimental-all-platforms)
*   [为弹窗、对话框和下拉菜单提供独立的平台视图](#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)。
*   [合并 Jetpack Compose 和 Material 3 的变更](#changes-from-jetpack-compose-and-material-3-all-platforms)
*   [稳定版本中提供 Kotlin/Wasm artifact](#kotlin-wasm-artifacts-available-in-stable-versions-of-the-framework)
*   [已知问题：缺失依赖项](#known-issues-missing-dependencies)

## 依赖项

此版本的 Compose Multiplatform 基于以下 Jetpack Compose 库：

*   [Compiler 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)
*   [Runtime 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.1)
*   [UI 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.1)
*   [Foundation 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.1)
*   [Material 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.1)
*   [Material3 1.2.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.0)

## 破坏性变更

### 默认修剪设置了 lineHeight 的文本内边距

随着对 [LineHeightStyle.Trim](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/LineHeightStyle.Trim) 的支持，Compose Multiplatform 在文本内边距的修剪方式上与 Android 保持一致。
关于详细信息，请参见 [pull request](https://github.com/JetBrains/compose-multiplatform-core/pull/897)。

这与 [1.6.0-alpha01 版本](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.0-alpha01)中 `compose.material` 的变更一致：
*   在 Android 上，`includeFontPadding` 参数默认变为 `false`。
    为了更深入地了解此变更，请参见 [关于不在 Compose Multiplatform 中实现此标志的讨论](https://github.com/JetBrains/compose-multiplatform/issues/2477#issuecomment-1825716543)。
*   默认行高样式已更改为 `Trim.None` 和 `Alignment.Center`。Compose Multiplatform 现在支持
    `LineHeightStyle.Trim` 并将 `Trim.None` 作为默认值实现。
*   `TextStyle` 的 `Typography` 中已添加显式 `lineHeight`，这导致了[下一个破坏性变更](#using-fontsize-in-materialtheme-requires-lineheight)。

### 在 MaterialTheme 中使用 fontSize 需要 lineHeight

> 这仅影响 `material` 组件。`material3` 已有此限制。
>
{style="note"}

如果在 `MaterialTheme` 中为 `Text` 组件设置 `fontSize` 属性但未包含 `lineHeight`，则实际行高不会随字体进行修改。现在，每次设置相应的 `fontSize` 时，都必须显式指定 `lineHeight` 属性。

Jetpack Compose 现在[建议](https://issuetracker.google.com/issues/321872412)不要直接设置字体大小：

> 为了支持非标准文本大小，我们鼓励用户遵循 Material Design 系统并使用不同的[排版比例](https://m2.material.io/design/typography/the-type-system.html#type-scale)，而不是直接更改字体大小。另外，用户可以像这样覆盖行高：`style = LocalTextStyle.current.copy(lineHeight = TextUnit.Unspecified)`，或者完全创建自定义 `Typography`。
>
{style="tip"}

### 资源组织的新方法

如果您一直在 Compose Multiplatform 1.6.0 的预览版本中使用资源 API，请熟悉[当前版本的文档](compose-multiplatform-resources.md)：1.6.0-beta01 更改了资源文件在项目文件夹中的存储方式，以便项目代码可以访问它们。

## 跨平台

### 改进的资源 API (所有平台)

新的实验性 API 增加了对字符串和字体的支持，并允许您更方便地在公共 Kotlin 中共享和访问资源：

*   资源可以根据其设计的特定设置或约束进行组织，支持：
    *   区域设置
    *   图像分辨率
    *   深色和浅色主题
*   Compose Multiplatform 现在为每个项目生成一个 `Res` 对象，以提供直接的资源访问。

关于资源限定符的更详细介绍，以及对新资源 API 的更深入概述，请参见[图像和资源](compose-multiplatform-resources.md)。

### UI 测试 API（实验性的，所有平台）

用于 Compose Multiplatform UI 测试的实验性 API，此前已可用于桌面和 Android，现在支持所有平台。您可以编写和运行公共测试，以验证您的应用程序 UI 在框架支持的平台上的行为。该 API 使用与 Jetpack Compose 相同的查找器、断言、操作和匹配器。

> 仅桌面项目支持基于 JUnit 的测试。
>
{style="note"}

关于设置说明和测试示例，请参见[测试 Compose Multiplatform UI](compose-test.md)。

### Jetpack Compose 和 Material 3 的变更（所有平台）

#### Jetpack Compose 1.6.1

合并最新版本的 Jetpack Compose 对所有平台的性能产生积极影响。关于详细信息，请参见 [Android 开发者博客上的公告](https://android-developers.googleblog.com/2024/01/whats-new-in-jetpack-compose-january-24-release.html)。

此版本的其他显著特性：
*   默认字体内边距的变更仅对 Android 目标生效。但是，请务必考虑此变更的[副作用](#using-fontsize-in-materialtheme-requires-lineheight)。
*   Compose Multiplatform 之前已支持其他目标上的鼠标选择。在 1.6.0 中，这也包括 Android。

尚未移植到 Compose Multiplatform 的 Jetpack Compose 特性：
*   [BasicTextField2](https://github.com/JetBrains/compose-multiplatform/issues/4218)
*   [支持非线性字体缩放](https://github.com/JetBrains/compose-multiplatform/issues/4305)
*   [MultiParagraph.fillBoundingBoxes](https://github.com/JetBrains/compose-multiplatform/issues/4236)
*   [多平台拖放](https://github.com/JetBrains/compose-multiplatform/issues/4235)。目前仅在 Android 上可用。在桌面端，您可以使用现有 API `Modifier.onExternalDrag`。

JetBrains 团队正在努力在即将发布的 Compose Multiplatform 版本中采用这些特性。

#### Compose Material 3 1.2.0

版本亮点：
*   一个新的实验性组件 `Segmented Button`，支持单选和多选。
*   扩展的颜色集，具有更多表面选项，可更轻松地在 UI 中突出信息。
    *   实现说明：`ColorScheme` 对象现在是不可变的。如果您的代码当前直接修改 `ColorScheme` 中的颜色，您现在需要使用 [copy](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme#copy(androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color)) 方法来更改颜色。
    *   现在不是单一的表面值，而是有多个表面颜色和表面容器选项，以实现更灵活的颜色管理。

关于 Material 3 变更的更多详细信息，请参见 [Material Design 博客上的发布文章](https://material.io/blog/material-3-compose-1-2)。

### 为弹窗、对话框和下拉菜单提供独立的平台视图（iOS、桌面）

有时，重要的在于弹窗元素（例如，工具提示和下拉菜单）不受初始可组合画布或应用程序窗口的限制。如果可组合视图未占据整个屏幕但需要生成警报对话框，这一点尤其重要。在 1.6.0 中，有一种可靠的方法可以实现这一点。

请注意，弹窗和对话框仍然无法在其自身边界之外绘制任何内容（例如，最顶层容器的阴影）。

#### iOS（稳定版）

在 iOS 上，此特性默认是激活的。
要切换回旧行为，请将 `platformLayers` 形参设置为 `false`：

```kotlin
ComposeUIViewController(
    configure = {
        platformLayers = false
    }
) {
    // 您的 Compose 代码
}
```

#### 桌面（实验性的）

要在桌面端使用此特性，请设置 `compose.layers.type` 系统属性。支持的值有：
*   `WINDOW`，用于将 `Popup` 和 `Dialog` 组件创建为独立的无装饰窗口。
*   `COMPONENT`，用于在同一窗口中将 `Popup` 或 `Dialog` 创建为独立的 Swing 组件。它仅在使用离屏渲染时工作，其中 `compose.swing.render.on.graphics` 设置为 `true`（关于详细信息，请参见 1.5.0 Compose Multiplatform 发布说明的[增强 Swing 互操作](https://blog.jetbrains.com/kotlin/2023/08/compose-multiplatform-1-5-0-release/#enhanced-swing-interop)部分）。请注意，离屏渲染仅适用于 `ComposePanel` 组件，不适用于全窗口应用程序。

使用 `COMPONENT` 属性的代码示例：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() = SwingUtilities.invokeLater {
    System.setProperty("compose.swing.render.on.graphics", "true")
    System.setProperty("compose.layers.type", "COMPONENT")

    val window = JFrame()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE

    val contentPane = JLayeredPane()
    contentPane.layout = null

    val composePanel = ComposePanel()
    composePanel.setBounds(200, 200, 200, 200)
    composePanel.setContent {
      ComposeContent()
    }
    composePanel.windowContainer = contentPane  // 为对话框使用全窗口
    contentPane.add(composePanel)

    window.contentPane.add(contentPane)
    window.setSize(800, 600)
    window.isVisible = true
  }

@Composable
fun ComposeContent() {
    Box(Modifier.fillMaxSize().background(Color.Green)) {
        Dialog(onDismissRequest = {}) {
            Box(Modifier.size(100.dp).background(Color.Yellow))
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="val window = JFrame()"}

`Dialog`（黄色）是完整绘制的，无论其父 `ComposePanel`（绿色）的边界如何：

![Dialog outside the bounds of the parent panel](compose-desktop-separate-dialog.png){width=700}

### 支持文本装饰行样式（iOS、桌面、Web）

Compose Multiplatform 现在允许使用 `PlatformTextStyle` 类设置文本的下划线样式。

> 该类在公共源代码集中不可用，需要在平台特有的代码中使用。
>
{style="warning"}

设置点状下划线样式的示例：

```kotlin
Text(
  "Hello, Compose",
  style = TextStyle(
    textDecoration = TextDecoration.Underline,
    platformStyle = PlatformTextStyle (
      textDecorationLineStyle = TextDecorationLineStyle.Dotted
    )
  )
)
```

您可以使用实线、双实线、点线、虚线和波浪线样式。关于所有可用选项，请参见[源代码](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui-text/src/skikoMain/kotlin/androidx/compose/ui/text/TextDecorationLineStyle.kt#L21)。

### 访问系统上安装的字体（iOS、桌面、Web）

您现在可以从 Compose Multiplatform 应用中访问系统上安装的字体：使用 `SystemFont` 类加载具有适当字体样式和字重的字体：

```kotlin
import androidx.compose.ui.text.platform.SystemFont

FontFamily(SystemFont("Menlo", weight = 700))
FontFamily(SystemFont("Times New Roman", FontWeight.Bold))
FontFamily(SystemFont("Webdings"))
```

在桌面端，您可以使用 `FontFamily` 函数，仅通过指定字体系列名称来加载所有可能的字体样式（关于更详尽的示例，请参见[代码示例](https://github.com/JetBrains/compose-multiplatform-core/blob/release/1.6.0/compose/desktop/desktop/samples/src/jvmMain/kotlin/androidx/compose/desktop/examples/fonts/Fonts.jvm.kt)）：

```kotlin
FontFamily("Menlo")
```

## iOS

### 辅助功能支持

现在，Compose Multiplatform for iOS 允许残障人士以与原生 iOS UI 相同的舒适度与 Compose UI 交互：

*   屏幕阅读器和 VoiceOver 可以访问 Compose UI 的内容。
*   Compose UI 支持与原生 UI 相同的导航和交互手势。

这也意味着您可以将 Compose Multiplatform 语义数据提供给辅助功能服务和 XCTest framework。

关于实现和自定义 API 的详细信息，请参见[支持 iOS 辅助功能](compose-ios-accessibility.md)。

### 更改可组合视图的不透明度

`ComposeUIViewController` 类现在多了一个配置选项，用于将视图背景的不透明度更改为透明。

> 透明背景会对性能产生负面影响，因为它会导致额外的混合步骤。
>
{style="note"}

```kotlin
val appController = ComposeUIViewController(configure = {
      this.opaque = false
}) {
    App()
}
```

透明背景可以帮助您实现的效果示例：

![Compose opaque = false demo](compose-opaque-property.png){width=700}

### 通过双击和三击在 SelectionContainer 中选择文本

此前，Compose Multiplatform for iOS 允许用户仅在文本输入字段中使用多点触控来选择文本。现在，双击和三击手势也适用于选择 `SelectionContainer` 内 `Text` 组件中显示的文本。

### 与 UIViewController 的互操作

一些未实现为 `UIView` 的原生 API，例如 `UITabBarController` 或 `UINavigationController`，无法使用[现有互操作机制](compose-uikit-integration.md)嵌入到 Compose Multiplatform UI 中。

现在，Compose Multiplatform 实现了 `UIKitViewController` 函数，允许您在 Compose UI 中嵌入原生 iOS 视图控制器。

### 文本字段中长按/单击实现类似原生的插入符行为

Compose Multiplatform 现在更接近原生 iOS 中文本字段插入符的行为：
*   文本字段中单击后插入符的位置确定得更精确。
*   在文本字段中长按并拖动会导致光标移动，而不是像 Android 上那样进入选择模式。

## 桌面

### 改进的互操作混合的实验性支持

过去，使用 `SwingPanel` 包装器实现的互操作视图始终是矩形的，并且始终位于前景，在任何 Compose Multiplatform 组件之上。这使得任何弹窗元素（下拉菜单、toast 通知）使用起来都具有挑战性。通过新的实现，此问题已解决，您现在可以在以下用例中依赖 Swing：

*   剪裁。您不受矩形形状的限制：clip 和 shadow 修饰符现在与 SwingPanel 正确工作。

    ```kotlin
    // 启用实验性混合所需标志 
    System.setProperty("compose.interop.blending", "true")
  
    SwingPanel(
        modifier = Modifier.clip(RoundedCornerShape(6.dp))
        //...
    )
    ```
  
  您可以在左侧看到没有此特性时 `JButton` 的剪裁方式，以及右侧的实验性混合效果：

  ![Correct clipping with SwingPanel](compose-swingpanel-clipping.png)
*   重叠。现在可以在 `SwingPanel` 上方绘制任何 Compose Multiplatform 内容并像往常一样与其交互。
  这里，"Snackbar" 位于 Swing 面板的顶部，带有一个可点击的 **OK** 按钮：

  ![Correct overlapping with SwingPanel](compose-swingpanel-overlapping.png)

关于已知限制和更多详细信息，请参见 [pull request 的描述](https://github.com/JetBrains/compose-multiplatform-core/pull/915)。

## Web

### framework 的稳定版本中提供 Kotlin/Wasm artifact

Compose Multiplatform 的稳定版本现在支持 Kotlin/Wasm 目标。切换到 1.6.0 后，您无需在依赖项列表中指定特定 `dev-wasm` 版本的 `compose-ui` 库。

> 要构建带有 Wasm 目标的 Compose Multiplatform 项目，您需要安装 Kotlin 1.9.22 或更高版本。
>
{style="warning"}

## 已知问题：缺失依赖项

在默认项目配置下，有几个库可能会缺失：

*   `org.jetbrains.compose.annotation-internal:annotation` 或 `org.jetbrains.compose.collection-internal:collection`

    如果某个库依赖于 Compose Multiplatform 1.6.0-beta02，则它们可能会缺失，因为后者与 1.6.0 不二进制兼容。
    要找出是哪个库，请运行以下命令（将 `shared` 替换为主模块的名称）：

    ```shell
    ./gradlew shared:dependencies
    ```

    将该库降级到依赖于 Compose Multiplatform 1.5.12 的版本，或者要求库作者将其升级到 Compose Multiplatform 1.6.0。

*   `androidx.annotation:annotation:...` 或 `androidx.collection:collection:...`

    Compose Multiplatform 1.6.0 依赖于 [collection](https://developer.android.com/jetpack/androidx/releases/collection) 和 [annotation](https://developer.android.com/jetpack/androidx/releases/annotation) 库，这些库仅在 Google Maven 仓库中可用。

    要使此仓库对您的项目可用，请将以下行添加到模块的 `build.gradle.kts` 文件中：

    ```kotlin
    repositories {
        //...
        google()
    }