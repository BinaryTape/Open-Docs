[//]: # (title: 在 iOS 上处理互操作中的触摸事件)

在 iOS 上，Compose Multiplatform 可以与原生的 UIKit 和 SwiftUI 框架集成。
此类集成的挑战之一是处理触摸：当 Compose Multiplatform 应用包含原生 UI 元素时，应用可能需要根据上下文对互操作区域中的触摸做出不同的反应。

目前，Compose Multiplatform 在处理原生视图中的触摸事件时只有一种策略：所有触摸都完全由原生 UI 处理，Compose 完全察觉不到触摸的发生。

## 互操作滚动中的触摸

当互操作区域中的每个触摸都立即发送到基础原生 UI 元素时，容器组合项无法对同一触摸做出反应。这带来的最显而易见的问题是滚动。如果互操作区域位于可滚动容器中，用户可能希望该区域：

* 在他们想要与其交互时，对他们的触摸做出反应。
* 在他们想要滚动父容器时，不对他们的触摸做出反应。

为了解决这个问题，Compose Multiplatform 实现了受 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) 启发的行为。当首次检测到触摸时，会有一个短暂的延迟（150 ms），让应用决定是否让容器感知到它：

* 如果 Compose 组件在此延迟期间消耗了任何触摸事件，Compose Multiplatform 就不会让原生 UI 元素感知此触摸序列。
* 如果在此延迟期间没有消耗任何事件，对于触摸序列的剩余部分，Compose Multiplatform 将控制权移交给原生 UI。

因此，对于可滚动内容，如果用户按住触摸，UI 会将其解释为与原生元素交互的意图；如果触摸序列很快，则用户可能想要与父元素交互。

如果您的互操作视图不打算进行交互，您可以提前禁用所有触摸处理。为此，在调用 `UIKitView` 或 `UIKitViewController` 的构造函数时，将 `isInteractive` 形参设置为 `false`。

> 对于在互操作视图中处理手势的更复杂场景，请使用 `UIGestureRecognizer` 类及其各种子类。它允许在原生互操作视图中检测所需的手势，以及取消 Compose 中的触摸序列。
>
{style="note"}

## 选择触摸处理策略
<primary-label ref="Experimental"/>

通过 Compose Multiplatform %org.jetbrains.compose%，您还可以尝试使用实验性 API，以便对互操作 UI 进行更精细的控制。

`UIKitView` 或 `UIKitViewController` 的新构造函数接受一个 `UIKitInteropProperties` 对象作为实参。此对象允许设置：

* 给定互操作视图的 `interactionMode` 形参，它允许您选择触摸处理策略。
* `isNativeAccessibilityEnabled` 选项，它会更改互操作视图的辅助功能行为。

`interactionMode` 形参可以设置为 `Cooperative` 或 `NonCooperative`：

* `Cooperative` 模式是如上所述的新默认模式：Compose Multiplatform 在触摸处理中引入了延迟。实验性 API 允许您通过尝试不同值（而非默认的 150 ms）来微调此延迟。
* `NonCooperative` 模式使用之前的策略，即 Compose Multiplatform 不处理互操作视图中的任何触摸事件。尽管存在上述一般性问题，但如果您确定互操作触摸永远不需要在 Compose 级别处理，则此模式可能会很有用。
* 要禁用与原生 UI 的任何交互，请向构造函数传递 `interactionMode = null`。

## 下一步

了解有关 Compose Multiplatform 中 [UIKit](compose-uikit-integration.md) 和 [SwiftUI](compose-swiftui-integration.md) 集成的更多信息。