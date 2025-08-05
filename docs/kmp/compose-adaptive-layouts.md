# 自适应布局

为了在所有类型的设备上提供一致的用户体验，请根据不同的显示尺寸、屏幕方向和输入模式调整应用的 UI。

## 设计自适应布局

设计自适应布局时，请遵循以下关键指南：

* 优先选择 [规范布局](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) 模式，例如列表-详情、信息流和辅助面板。
* 通过复用用于内边距、排版和其他设计元素的共享样式来保持一致性。在遵循平台特有的指南的同时，在不同设备上保持导航模式一致。
* 将复杂布局拆分为可复用的 Composables，以提高灵活性和模块化。
* 调整以适应屏幕密度和屏幕方向。

## 使用窗口尺寸类别

窗口尺寸类别是预定义的阈值，也称为断点，它们对不同的屏幕尺寸进行分类，以帮助您设计、开发和测试自适应布局。

窗口尺寸类别将应用可用的显示区域在宽度和高度上分为三类：紧凑型、中等型和扩展型。在进行布局更改时，请测试布局在所有窗口尺寸下的行为，尤其是在不同的断点阈值处。

要使用 `WindowSizeClass` 类，请将 `material3.adaptive` 依赖项添加到模块的 `build.gradle.kts` 文件中的公共源代码集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API 允许您根据可用的显示空间更改应用的布局。例如，您可以根据窗口高度管理顶部应用栏的可见性：

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // Determines whether the top app bar should be displayed
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // Uses bar visibility to define UI 
    MyScreen(
        showTopAppBar = showTopAppBar,
        /* ... */
    )
}
```

<!--- waiting for a page about @Preview and hot reload
## Previewing layouts

We have three different @Preview:

* Android-specific, for `androidMain`, from Android Studio.
* Separate desktop annotation plugin with our own implementation (only for desktop source set) + uiTooling plugin.
* Common annotation, also supported in Android Studio, works for Android only but from common code.
-->

## 后续步骤

在 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/layouts/adaptive) 中了解更多关于自适应布局的信息。