[//]: # (title: iOS 迁移指南)

本页面将指导您了解升级项目中 Compose Multiplatform 库到新版本（从 1.7.0 开始）时与 iOS 相关的一些注意事项。

## Compose Multiplatform 1.6.11 到 1.7.0

### UIKitView 和 UIKitViewController 中移除了 background 参数

已弃用的 `UIKitView` 和 `UIKitViewController` API 包含 `background` 参数，而新 API 则没有。该参数被认为是多余的并已移除：

*   如果您需要为新实例设置互操作视图背景，可以使用 `factory` 参数来完成。
*   如果您需要背景可更新，请将相应的代码放入 `update` lambda 表达式中。

### 触摸或手势可能无法按预期工作

新的默认[触摸行为](compose-ios-touch.md)使用延迟来确定触摸是针对互操作视图还是针对该视图的 Compose 容器：用户必须保持静止至少 150 毫秒，互操作视图才会接收到触摸。

如果您需要 Compose Multiplatform 像以前一样处理触摸，请考虑使用新的实验性的 `UIKitInteropProperties` 构造函数。它具有 `interactionMode` 参数，您可以将其设置为 `UIKitInteropInteractionMode.NonCooperative`，以使 Compose 将触摸直接传递给互操作视图。

此构造函数被标记为实验性的，因为我们最终旨在通过单个布尔标志来描述互操作视图的可交互性。`interactionMode` 参数中显式描述的行为很可能在未来自动推导。

### accessibilityEnabled 被 isNativeAccessibilityEnabled 替换，并默认关闭

旧版 `UIKitView` 和 `UIKitViewController` 构造函数的 `accessibilityEnabled` 参数已移动并重命名，现在作为 `UIKitInteropProperties.isNativeAccessibilityEnabled` 属性提供。它也默认设置为 `false`。

`isNativeAccessibilityEnabled` 属性会污染合并的 Compose 子树与原生可访问性解析。因此，除非您需要互操作视图（例如网页视图）的丰富可访问性能力，否则不建议将其设置为 true。

关于此属性及其默认值背后的原理，请参见 [`UIKitInteropProperties` 类](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)的代码内部文档。

### onResize 参数已移除

旧版 `UIKitView` 和 `UIKitViewController` 构造函数的 `onResize` 参数会根据 `rect` 实参设置自定义帧，但它本身不影响 Compose 布局，因此使用起来不直观。除此之外，`onResize` 参数的默认实现需要正确设置互操作视图的帧，并包含一些关于正确裁剪视图的实现细节。<!-- TODO: what's wrong with that exactly? -->

如何在没有 `onResize` 的情况下实现：

*   如果您需要响应互操作视图帧的变化，您可以：
    *   覆盖互操作 `UIView` 的 [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)，
    *   覆盖互操作 `UIViewController` 的 [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)，
    *   或者将 `onGloballyPositioned` 添加到 `Modifier` 链中。
*   如果您需要设置互操作视图的帧，请使用相应的 Compose 修饰符：`size`、`fillMaxSize` 等。

### 某些 onReset 用法模式已失效

结合 `remember { UIView() }` 使用非空的 `onReset` lambda 表达式是不正确的。

请考虑以下代码：

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

当 `UIKitView` 进入组合时，`factory` 或 `onReset` 会被调用，两者永不同时被调用。因此，如果 `onReset` 不是 null，被记住的 `view` 可能与屏幕上显示的视图不同：一个可组合项可以离开组合并留下一个视图实例，该实例在 `onReset` 中重置后将被重用，而不是使用 `factory` 分配一个新实例。

为避免此类错误，请不要在构造函数中指定 `onReset` 值。您可能需要根据发出它的函数进入组合时的上下文，从互操作视图内部执行回调：在这种情况下，可以考虑使用 `update` 将回调存储在视图内部，以处理 `onReset` 相关的情况。