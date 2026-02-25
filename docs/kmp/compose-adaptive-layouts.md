# 自适应布局

为了在所有类型的设备上提供一致的用户体验，请针对不同的显示尺寸、屏幕方向和输入模式来适配应用的 UI。

## 设计自适应布局

在设计自适应布局时，请遵循以下关键准则：

*   优先使用[规范布局](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts)模式，例如列表-详情、Feed 流以及辅助面板。
*   通过为内边距、排版和其他设计元素重复使用共享样式来保持一致性。在遵循平台特定指南的同时，保持各设备间的导航模式一致。
*   将复杂的布局分解为可重用的可组合项 (composables)，以提高灵活性和模块化程度。
*   针对屏幕密度和方向进行调整。

## 使用窗口大小类别

窗口大小类别 (Window size classes) 是预定义的阈值，也称为断点，用于对不同的屏幕尺寸进行分类，以帮助你设计、开发和测试自适应布局。

窗口大小类别将应用可用的显示区域在宽度和高度上各分为三类：紧凑 (compact)、中等 (medium) 和扩展 (expanded)。在进行布局更改时，请测试所有窗口大小下的布局行为，尤其是各个断点阈值处的行为。

要使用 `WindowSizeClass` 类，请将 `material3.adaptive` 依赖项添加到模块 `build.gradle.kts` 文件中的公共源集 (common source set) 中：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API 允许你根据可用的显示空间更改应用的布局。例如，你可以根据窗口高度来管理顶部应用栏的可见性：

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // 确定是否应显示顶部应用栏
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // 使用应用栏的可见性来定义 UI 
    MyScreen(
        showTopAppBar = showTopAppBar,
        /* ... */
    )
}
```

<!--- 正在等待关于 @Preview 和热重载的页面
## 预览布局

我们有三种不同的 @Preview：

* Android 专用，用于 `androidMain`，来自 Android Studio。
* 带有我们自己实现的独立桌面注解插件（仅用于桌面源集）+ uiTooling 插件。
* 通用注解，Android Studio 也支持，仅适用于 Android，但来自通用代码。
-->

## 下一步

要在 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/layouts/adaptive)中详细了解自适应布局。