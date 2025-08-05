[//]: # (title: 在 iOS 上通过互操作处理触摸事件)

在 iOS 上，Compose Multiplatform 可以与原生的 UIKit 和 SwiftUI 框架集成。这种集成的一个挑战是处理触摸事件：当 Compose Multiplatform 应用包含原生 UI 元素时，应用可能需要根据上下文对互操作区域中的触摸事件做出不同的响应。

目前，Compose Multiplatform 在原生视图中处理触摸事件只有一种策略：所有触摸事件都完全由原生 UI 处理，Compose 对这些事件的发生毫不知情。

## 互操作滚动中的触摸事件

当互操作区域中的每次触摸都立即发送到底层的原生 UI 元素时，容器 composable 无法对同一触摸做出响应。这带来的最明显问题是滚动。如果互操作区域位于可滚动容器中，用户可能期望该区域：

*   当用户想要与之交互时，对触摸做出响应。
*   当用户想要滚动父容器时，不对触摸做出响应。

为了解决这个问题，Compose Multiplatform 实现了受 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) 启发的行为。首次检测到触摸时，会有一个短暂的延迟 (150 ms)，允许应用决定是否让容器感知到它：

*   如果 Compose 组件在此延迟期间消耗了任何触摸事件，Compose Multiplatform 不会让原生 UI 元素感知到此触摸序列。
*   如果在此延迟期间没有事件被消耗，对于其余的触摸序列，Compose Multiplatform 将控制权移交给原生 UI。

因此，对于可滚动内容，如果用户保持触摸，UI 会将其解释为与原生元素交互的意图；如果触摸序列快速，用户可能希望与父元素交互。

如果您的互操作视图不打算进行交互，您可以提前禁用所有触摸处理。为此，请调用 `UIKitView` 或 `UIKitViewController` 的构造函数，并将 `isInteractive` 形参设置为 `false`。

> 对于互操作视图中更复杂的手势处理场景，
> 请使用 `UIGestureRecognizer` 类或其各种子类。
> 它允许检测原生互操作视图中所需的手势，以及取消 Compose 中的触摸序列。
>
{style="note"}

## 选择触摸处理策略
<secondary-label ref="Experimental"/>

通过 Compose Multiplatform %org.jetbrains.compose%，您还可以试用实验性的 API，以对互操作 UI 进行更精细的控制。

`UIKitView` 或 `UIKitViewController` 的新构造函数接受一个 `UIKitInteropProperties` 对象作为实参。此对象允许设置：

*   给定互操作视图的 `interactionMode` 形参，它允许您选择一种触摸处理策略。
*   `isNativeAccessibilityEnabled` 选项，它会更改互操作视图的辅助功能行为。

`interactionMode` 形参可以设置为 `Cooperative` 或 `NonCooperative`：

*   `Cooperative` 模式是新的默认模式，如上所述：Compose Multiplatform 在触摸处理中引入延迟。实验性的 API 允许您通过尝试不同的值而非默认的 150 ms 来微调此延迟。
*   `NonCooperative` 模式使用以前的策略，其中 Compose Multiplatform 不处理互操作视图中的任何触摸事件。尽管存在上述一般问题，但如果您确定互操作触摸永远不需要在 Compose 层面处理，此模式会很有用。
*   要禁用与原生 UI 的任何交互，请将 `interactionMode = null` 传递给构造函数。

## 下一步？

了解更多关于 Compose Multiplatform 中 [UIKit](compose-uikit-integration.md) 和 [SwiftUI](compose-swiftui-integration.md) 集成的信息。