[//]: # (title: Compose Multiplatform 1.11.0-beta03 的最新变化)

以下是该抢先体验计划 (EAP) 功能版本的亮点：

* [原生 iOS 文本输入](#native-text-input)
* [Compose UI 测试 API 的 v2 版本](#compose-ui-tests-v2)
* [改进了 Web 目标的滚动性能](#scroll-on-web-targets-brought-in-line-with-native-ui)

您可以在 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.11.0-beta03) 上找到完整的变更列表。
此版本的特定组件版本列在 [依赖项](#dependencies) 部分。

## 破坏性变更与弃用

### 针对 non-Android 目标的 Shader 包装器

对于 non-Android 目标，`Shader` 类型已从 `org.jetbrains.skia.Shader` 的 `actual typealias` 重构为 Compose 特有的包装类。这一更改将公共 API 与直接的 Skia/Skiko 依赖项解耦。

迁移步骤：

* 要在 Compose API 中使用 Skia/Skiko shader，请使用 `SkShader.asComposeShader()` 进行包装。
* 要从 Compose `Shader` 访问底层 Skia 类型，请使用 `Shader.skiaShader` 扩展属性。
* 如果您使用的第三方库依赖于 `Shader` API，请将其更新到最新的兼容版本。

### 最低 Kotlin 版本已提高

如果您的项目包含原生或 Web 目标，最新功能需要升级到 Kotlin 2.3.10。

### 停止支持 Apple x86_64 目标

Compose Multiplatform 不再支持 Apple x86_64 目标，因为它们在 Kotlin 中已被弃用。因此，`iosX64` 和 `macosX64` 目标已从所有模块中完全移除。

### 弃用

* 在 Compose Multiplatform 1.9.0 中，我们[引入了 `WebElementView`](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html#new-api-for-embedding-html-content) composable，以便将 HTML 元素无缝集成到 Web 应用程序中。事实证明，所选名称有些含糊，因此我们将其重命名为 `HtmlElementView`，以更好地反映其针对 HTML 的用途。`WebElementView` 版本已被弃用，建议使用 `HtmlElementView`。
* `Key.Home` 已被弃用，因为其映射不正确。请使用 `Key.MoveHome` 进行键盘导航，或使用 `Key.SystemHome` 执行系统级操作。

## 跨平台

### Compose UI 测试 v2

Compose Multiplatform 在 non-Android 目标上引入了对 [v2 `ComposeUiTest` API](https://developer.android.com/develop/ui/compose/testing/migrate-v2) 的支持。这些新 API 使用 `StandardTestDispatcher` 作为默认测试调度器，而不是 `UnconfinedTestDispatcher`。这一更改确保了协程根据事件队列顺序执行，从而提高了测试的可靠性并与生产环境行为保持一致。

我们还在 Compose UI 测试 v2 中添加了对 `effectContext` 形参的支持。该形参允许您在运行 composition 时指定自定义协程上下文。

此前提供的测试 API（如 `runComposeUiTest`、`runSkikoComposeUiTest` 和 `runDesktopComposeUiTest`）现已弃用，建议使用其 v2 版本。

### Skia 更新至 Milestone 144

Compose Multiplatform 通过 Skiko 使用的 Skia 版本已更新至 Milestone 144。

此前使用的 Skia 版本为 Milestone 138。
您可以在 [发行说明](https://skia.googlesource.com/skia/+/refs/heads/chrome/m144/RELEASE_NOTES.md) 中查看这些版本之间的变更。

## iOS

### 原生文本输入
<primary-label ref="Experimental"/>

Compose Multiplatform 引入了一种新的文本输入实现，它使用原生 iOS `UIView`，通过 `UITextInput` 和 `UIKeyInput` 协议管理输入。这实现了完全原生的 iOS 文本编辑行为，包括精准的文本光标移动、原生手势、原生选择处理，以及带有 `自动填充`、`翻译`和`搜索`等项的系统上下文菜单。这种新方法在符合原生 iOS 观感的同时，也提高了与未来 Apple 更新的兼容性。

虽然现有的 Compose Multiplatform 文本输入仍是保持跨平台一致性的稳定选择，但原生方法专注于为 iOS 量身定制的用户体验。

要启用新的文本输入，请在 iOS 源集中使用 `usingNativeTextInput` 选项：

```kotlin
@ExperimentalComposeUiApi
BasicTextField(
    value = state,
    keyboardOptions = KeyboardOptions(
        platformImeOptions = PlatformImeOptions {
            usingNativeTextInput(true)
        }
    )
)
```

新的原生文本输入同时支持 `BasicTextField(TextFieldValue)` 和 `BasicTextField(TextFieldState)` API，并且还兼容通过 `isNewContextMenuEnabled` 标志启用的新上下文菜单 API。

## Web

### Web 目标的滚动性能已提升至与原生 UI 一致

在 Compose Multiplatform 中，Web 端的滚动性能一直落后于原生 UI。在 1.11.0 版本中，我们对触摸处理进行了大量重构和修复，使 Compose Web 应用的滚动体验与其它可用目标保持一致。您可以在最新版本的 [KotlinConf App Web 版](https://jetbrains.github.io/kotlinconf-app/)中看到这些改进的效果。

作为这项工作的一部分，[Web 上的 Coil 图像解码也得到了改进](https://github.com/coil-kt/coil/pull/3305)。如果您使用 Coil，请务必更新到 3.4.0 版本以获得最佳体验。

修复列表以及改进的说明和演示可在问题 [CMP-9727](https://youtrack.jetbrains.com/issue/CMP-9727) 中查看。

## 依赖项

| 库 | Maven 坐标 | 基于 Jetpack 版本 |
|--------------------|-------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Runtime | `org.jetbrains.compose.runtime:runtime*:1.11.0-beta03` | [Runtime 1.11.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.11.0-rc01) |
| UI | `org.jetbrains.compose.ui:ui*:1.11.0-beta03` | [UI 1.11.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.11.0-rc01) |
| Foundation | `org.jetbrains.compose.foundation:foundation*:1.11.0-beta03` | [Foundation 1.11.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.11.0-rc01) |
| Material | `org.jetbrains.compose.material:material*:1.11.0-beta03` | [Material 1.11.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-material#1.11.0-rc01) |
| Material3 | `org.jetbrains.compose.material3:material3*:1.11.0-alpha07` | [Material3 1.5.0-alpha17](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha17) |
| Material3 Adaptive | `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha07` | [Material3 Adaptive 1.3.0-alpha10](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha10) |
| Lifecycle | `org.jetbrains.androidx.lifecycle:lifecycle-*:2.11.0-alpha03` | [Lifecycle 2.11.0-alpha03](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.11.0-alpha03) |
| Navigation | `org.jetbrains.androidx.navigation:navigation-*:2.9.2` | [Navigation 2.9.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.7) |
| Navigation3 | `org.jetbrains.androidx.navigation3:navigation3-*:1.1.0` | [Navigation3 1.1.0](https://developer.android.com/jetpack/androidx/releases/navigation3#1.1.0) |
| Navigation Event | `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.1.0-beta01` | [Navigation Event 1.1.0-rc01](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.1.0-rc01) |
| Savedstate | `org.jetbrains.androidx.savedstate:savedstate*:1.4.0` | [Savedstate 1.4.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0) |
| WindowManager Core | `org.jetbrains.androidx.window:window-core:1.5.1` | [WindowManager 1.5.1](https://developer.android.com/jetpack/androidx/releases/window#1.5.1) |