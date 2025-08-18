# 自适应布局

为了在所有类型的设备上提供一致的用户体验，请将您的应用 UI 调整为不同的显示尺寸、方向和输入模式。

## 设计自适应布局

设计自适应布局时请遵循以下关键准则：

* 优先使用 [规范布局](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) 模式，例如 list-detail、feed 和 supporting pane。
* 通过重用内边距、排版和其他设计元素的共享样式来保持一致性。在遵循平台特有的准则的同时，保持跨设备导航模式的一致性。
* 将复杂的布局分解为可重用的 composable，以实现灵活性和模块化。
* 调整屏幕密度和方向。

## 使用窗口尺寸类别

窗口尺寸类别是预定义的阈值，也称为断点，它们将不同的屏幕尺寸分类，以帮助您设计、开发和测试自适应布局。

窗口尺寸类别将应用可用的显示区域分为宽度和高度各三个类别：compact、medium 和 expanded。当您进行布局更改时，请测试所有窗口尺寸的布局行为，尤其是在不同的断点阈值处。

要使用 `WindowSizeClass` 类别，请将 `material3.adaptive` 依赖项添加到模块的 `build.gradle.kts` 文件中的公共源代码集：

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

<!--- 等待关于 @Preview 和热重载的页面
## 预览布局

我们有三种不同的 @Preview：

* Android 特有的，用于 `androidMain`，来自 Android Studio。
* 带有我们自己实现的独立桌面注解插件（仅适用于桌面源代码集）+ uiTooling plugin。
* 公共注解，也在 Android Studio 中支持，仅适用于 Android，但来自公共代码。
-->

## 接下来

在 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/layouts/adaptive) 中了解有关自适应布局的更多信息。