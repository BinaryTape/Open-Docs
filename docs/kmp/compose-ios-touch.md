[//]: # (title: 在 iOS 上通过互操作处理触控事件)

在 iOS 上，Compose Multiplatform 可以与原生 UIKit 和 SwiftUI framework 集成。这种集成的一个挑战是触控处理：当 Compose Multiplatform 应用包含原生 UI 元素时，应用可能需要根据上下文对互操作区域中的触控做出不同反应。

目前，Compose Multiplatform 仅有一种策略来处理原生视图中的触控事件：所有触控都完全由原生 UI 处理，Compose 对它们的发生全然不知。

## 互操作滚动中的触控

当互操作区域中的每次触控立即发送到底层原生 UI 元素时，容器 composable 无法对相同的触控做出反应。这带来的最明显问题是滚动。如果互操作区域位于可滚动容器中，用户可能会期望该区域：

*   当他们想要与它交互时，对触控做出反应。
*   当他们想要滚动父容器时，不对触控做出反应。

为了解决这个问题，Compose Multiplatform 实现了受 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) 启发的行为。当首次检测到触控时，会有一个短暂的延迟（150 毫秒），让应用决定是否让容器感知到它：

*   如果 Compose 组件在此延迟期间消耗了任何触控事件，Compose Multiplatform 则不会让原生 UI 元素感知到此触控序列。
*   如果延迟期间没有事件被消耗，在触控序列的其余部分，Compose Multiplatform 会将控制权交给原生 UI。

因此，对于可滚动内容，如果用户按住触控，UI 会将其解释为与原生元素交互的意图；如果触控序列很快，用户可能希望与父元素交互。

如果你的互操作视图不打算进行交互，你可以预先禁用所有触控处理。为此，请使用 `isInteractive` 参数设置为 `false` 来调用 `UIKitView` 或 `UIKitViewController` 的构造函数。

> 对于在互操作视图内处理手势的更复杂场景，
> 请使用 `UIGestureRecognizer` 类或其各种子类。
> 它允许检测原生互操作视图中所需的手势以及取消 Compose 中的触控序列。
>
{style="note"}

## 选择触控处理策略
<secondary-label ref="Experimental"/>

使用 Compose Multiplatform %org.jetbrains.compose%，你还可以尝试使用实验性的 API 来对互操作 UI 进行更精细的控制。

`UIKitView` 或 `UIKitViewController` 的新构造函数接受一个 `UIKitInteropProperties` 对象作为实参。此对象允许设置：

*   给定互操作视图的 `interactionMode` 参数，它允许你选择触控处理策略。
*   `isNativeAccessibilityEnabled` 选项，它会更改互操作视图的辅助功能行为。

`interactionMode` 参数可以设置为 `Cooperative` 或 `NonCooperative`：

*   `Cooperative` 模式是新的默认模式，如上所述：Compose Multiplatform 会引入触控处理延迟。实验性 API 允许你通过尝试不同的值而不是默认的 150 毫秒来微调此延迟。
*   `NonCooperative` 模式使用以前的策略，即 Compose Multiplatform 不处理互操作视图中的任何触控事件。尽管存在上述普遍问题，但如果你确定互操作触控永远不需要在 Compose 层级处理，此模式可能会很有用。
*   要禁用与原生 UI 的任何交互，请将 `interactionMode = null` 传递给构造函数。

## 接下来是什么？

了解更多关于 Compose Multiplatform 中 [UIKit](compose-uikit-integration.md) 和 [SwiftUI](compose-swiftui-integration.md) 集成的更多信息。