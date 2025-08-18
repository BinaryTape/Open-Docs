[//]: # (title: iOS 迁移指南)

本页面将引导您了解在项目中将 Compose Multiplatform 库升级到更高版本（从 1.7.0 开始）时，iOS 方面的考量事项。

## Compose Multiplatform 1.6.11 到 1.7.0

### 移除了 UIKitView 和 UIKitViewController 中的 background 形参

已弃用的 `UIKitView` 和 `UIKitViewController` API 包含 `background` 形参，而新 API 则没有。该形参被视为冗余并已移除：

* 如果您需要为新实例设置互操作视图背景，您可以使用 `factory` 形参来完成。
* 如果您需要背景可更新，请将相应的代码放入 `update` lambda 表达式中。

### 触摸或手势可能无法按预期工作

新的默认[触摸行为](compose-ios-touch.md)使用延迟来判断触摸是针对互操作视图，还是针对该视图的 Compose 容器：用户必须静止至少 150 毫秒，互操作视图才会接收到触摸。

如果您需要 Compose Multiplatform 像以前一样处理触摸，请考虑使用新的实验性 `UIKitInteropProperties` 构造函数。它包含 `interactionMode` 形参，您可以将其设置为 `UIKitInteropInteractionMode.NonCooperative`，使 Compose 直接将触摸传递给互操作视图。

该构造函数被标记为实验性的，因为我们最终打算让互操作视图的交互性由单个布尔标志来描述。`interactionMode` 形参中明确描述的行为，未来很可能将自动派生。

### accessibilityEnabled 被 isNativeAccessibilityEnabled 取代，并默认关闭

旧 `UIKitView` 和 `UIKitViewController` 构造函数的 `accessibilityEnabled` 形参已被移动并重命名为 `UIKitInteropProperties.isNativeAccessibilityEnabled` 属性。它也默认设置为 `false`。

`isNativeAccessibilityEnabled` 属性会使合并的 Compose 子树受到原生无障碍解析的影响。因此，除非您需要互操作视图（例如 Web 视图）的丰富无障碍功能，否则不建议将其设置为 `true`。

关于此属性及其默认值的原理，请参见 [UIKitInteropProperties 类的代码内文档](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)。

### onResize 形参已移除

旧 `UIKitView` 和 `UIKitViewController` 构造函数的 `onResize` 形参设置了一个基于 `rect` 实参的自定义 frame，但不影响 Compose 布局本身，因此使用起来不直观。此外，`onResize` 形参的默认实现需要正确设置互操作视图的 frame，并且包含一些关于正确剪裁视图的实现细节。<!-- TODO: what's wrong with that exactly? -->

如何在没有 `onResize` 的情况下实现：

* 如果您需要响应互操作视图 frame 变更，您可以：
    * 覆盖互操作 `UIView` 的 [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)，
    * 覆盖互操作 `UIViewController` 的 [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)，
    * 或者将 `onGloballyPositioned` 添加到 `Modifier` 链中。
* 如果您需要设置互操作视图的 frame，请使用相应的 Compose 修饰符：`size`、`fillMaxSize` 等。

### 某些 onReset 使用模式已失效

将非空 `onReset` lambda 表达式与 `remember { UIView() }` 一起使用是不正确的。

考虑以下代码：

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

当 `UIKitView` 进入组合时，`factory` 或 `onReset` 会被调用，但不会同时调用。因此，如果 `onReset` 非空，记住的视图可能与屏幕上显示的视图不同：可组合项可以离开组合，并留下一个视图实例，该实例将在 `onReset` 中重置后被重用，而不是使用 `factory` 分配一个新视图。

为避免此类错误，请不要在构造函数中指定 `onReset` 值。您可能需要根据发出回调的函数进入组合的上下文，在互操作视图内部执行回调：在这种情况下，考虑将回调存储在视图内部，并在 `onReset` 时通过 `update` 进行更新。