[//]: # (title: 處理 iOS 上的互通操作觸控事件)

在 iOS 上，Compose Multiplatform 可以與原生的 UIKit 和 SwiftUI 框架整合。這種整合的一個挑戰是處理觸控：當 Compose Multiplatform 應用程式包含原生 UI 元素時，應用程式可能需要根據上下文，對互通區域中的觸控做出不同的反應。

目前，Compose Multiplatform 只有一種處理原生檢視中觸控事件的策略：所有觸控都完全由原生 UI 處理，Compose 完全不會感知到它們的發生。

## 互通捲動中的觸控

當互通區域中的每個觸控都立即傳送到底層的原生 UI 元素時，容器 composable 無法對相同的觸控做出反應。這帶來最明顯的問題是捲動。如果互通區域位於可捲動容器中，使用者可能會預期該區域：

*   在他們想要與其互動時，對其觸控做出反應。
*   在他們想要捲動父容器時，不對其觸控做出反應。

為了解決這個問題，Compose Multiplatform 實作了受 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) 啟發的行為。當首次偵測到觸控時，會有一小段延遲（150 毫秒），讓應用程式決定是否讓容器感知到它：

*   如果 Compose 元件在此延遲期間消耗了任何觸控事件，Compose Multiplatform 不會讓原生 UI 元素感知到這個觸控序列。
*   如果在延遲期間沒有消耗任何事件，則在觸控序列的其餘部分，Compose Multiplatform 將控制權交給原生 UI。

因此，對於可捲動內容，如果使用者按住觸控，UI 會將此解釋為與原生元素互動的意圖；如果觸控序列快速，使用者可能想要與父元素互動。

如果您的互通操作檢視不打算進行互動，您可以預先禁用所有觸控處理。為此，請呼叫 `UIKitView` 或 `UIKitViewController` 的建構函式，並將 `isInteractive` 參數設為 `false`。

> 對於處理互通操作檢視內手勢的更複雜情境，
> 請使用 `UIGestureRecognizer` 類別或其各種子類別。
> 它允許在原生互通操作檢視中偵測所需的手勢，以及取消 Compose 中的觸控序列。
>
{style="note"}

## 選擇觸控處理策略
<secondary-label ref="Experimental"/>

透過 Compose Multiplatform %org.jetbrains.compose%，您還可以試用實驗性 API，以對互通操作 UI 進行更精細的控制。

新的 `UIKitView` 或 `UIKitViewController` 建構函式接受一個 `UIKitInteropProperties` 物件作為引數。此物件允許設定：

*   給定互通操作檢視的 `interactionMode` 參數，它讓您可以選擇觸控處理策略。
*   `isNativeAccessibilityEnabled` 選項，它會變更互通操作檢視的輔助使用行為。

`interactionMode` 參數可以設為 `Cooperative` 或 `NonCooperative`：

*   `Cooperative` 模式是新的預設模式，如上所述：Compose Multiplatform 在觸控處理中引入了延遲。實驗性 API 允許您透過嘗試不同的值來微調此延遲，而不是預設的 150 毫秒。
*   `NonCooperative` 模式使用先前的策略，其中 Compose Multiplatform 不處理互通操作檢視中的任何觸控事件。儘管存在上述一般問題，但如果您確定互通操作觸控永遠不需要在 Compose 層級處理，此模式可能很有用。
*   若要禁用與原生 UI 的任何互動，請將 `interactionMode = null` 傳遞給建構函式。

## 接下來是什麼？

深入了解 Compose Multiplatform 中的 [UIKit](compose-uikit-integration.md) 和 [SwiftUI](compose-swiftui-integration.md) 整合。