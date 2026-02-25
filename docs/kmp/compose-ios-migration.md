[//]: # (title: iOS 迁移指南)

本页面将引导您了解在项目中将 Compose Multiplatform 库升级到新版本（从 1.7.0 开始）时，关于 iOS 方面的注意事项。

## Compose Multiplatform 1.6.11 至 1.7.0

### UIKitView 和 UIKitViewController 中移除了 background 参数

已弃用的 `UIKitView` 和 `UIKitViewController` API 具有 `background` 参数，而新版本的 API 则没有。
该参数被认为冗余并已被移除：

* 如果您需要为新实例设置互操作视图背景，可以使用 `factory` 参数来实现。
* 如果您需要背景是可更新的，请将相应的代码放入 `update` lambda表达式中。

### 轻触或手势可能无法按预期工作

新的默认[轻触行为](compose-ios-touch.md)使用延迟来确定轻触是针对互操作视图还是针对该视图的 Compose 容器：用户必须保持静止至少 150 ms，互操作视图才会接收到该轻触。

如果您需要 Compose Multiplatform 像以前一样处理轻触，请考虑使用新的实验性 `UIKitInteropProperties` 构造函数。
它具有 `interactionMode` 参数，您可以将其设置为 `UIKitInteropInteractionMode.NonCooperative`，以使 Compose 直接将轻触传递给互操作视图。

该构造函数被标记为实验性，是因为我们最终打算通过单个布尔标记来保持互操作视图的可交互性。
在 `interactionMode` 参数中明确描述的行为在未来极有可能被自动推导。

### accessibilityEnabled 已替换为 isNativeAccessibilityEnabled，且默认关闭

旧版 `UIKitView` 和 `UIKitViewController` 构造函数的 `accessibilityEnabled` 参数已移动并重命名，现在作为 `UIKitInteropProperties.isNativeAccessibilityEnabled` 属性提供。
它默认也设置为 `false`。

`isNativeAccessibilityEnabled` 属性会使合并后的 Compose 子树受到原生可访问性解析的影响。
因此，除非您需要互操作视图具有丰富的可访问性功能（例如 Web 视图），否则不建议将其设置为 true。

有关此属性及其默认值背后的原理，请参阅 [`UIKitInteropProperties` 类的代码内文档](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)。

### onResize 参数已移除

旧版 `UIKitView` 和 `UIKitViewController` 构造函数的 `onResize` 参数根据 `rect` 实参设置了自定义框架，但并未影响 Compose 布局本身，因此使用起来并不直观。
最重要的是，`onResize` 参数的默认实现需要正确设置互操作视图的框架，并且包含一些关于正确剪裁视图的实现细节。 <!-- TODO: what's wrong with that exactly? -->

在没有 `onResize` 的情况下如何处理：

* 如果您需要对互操作视图框架更改做出反应，可以：
    * 重写互操作 `UIView` 的 [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)，
    * 重写互操作 `UIViewController` 的 [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)，
    * 或者在 `Modifier` 链中添加 `onGloballyPositioned`。
* 如果您需要设置互操作视图的框架，请使用相应的 Compose 修饰符：`size`、`fillMaxSize` 等。

### 某些 onReset 使用模式已失效

将非 null 的 `onReset` lambda表达式与 `remember { UIView() }` 结合使用是不正确的。

考虑以下代码：

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

当 `UIKitView` 进入组合时，要么调用 `factory`，要么调用 `onReset`，绝不会两者都调用。
因此，如果 `onReset` 不为 null，则记住的 `view` 可能与屏幕上显示的视图不同：
可组合项可以离开组合并留下一个视图实例，该实例在 `onReset` 中重置后将被重用，而不是使用 `factory` 分配一个新实例。

为了避免此类错误，请不要在构造函数中指定 `onReset` 值。
您可能需要根据发出该函数的函数进入组合的上下文，从互操作视图内部执行回调：
在这种情况下，请考虑在 `onReset` 的 `update` 中将回调存储在视图内部。