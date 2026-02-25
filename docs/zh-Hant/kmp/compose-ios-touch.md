[//]: # (title: 在 iOS 上透過 interop 處理觸控事件)

在 iOS 上，Compose Multiplatform 可以與原生的 UIKit 和 SwiftUI 架構整合。
此類整合的一項挑戰是處理觸控：當 Compose Multiplatform 應用程式包含原生 UI 元件時，應用程式可能需要根據上下文對 interop 區域中的觸控做出不同的反應。

目前，Compose Multiplatform 處理原生視圖中觸控事件的策略只有一種：所有觸控都完全由原生 UI 處理，Compose 完全不知道觸控發生過。

## interop 捲動中的觸控

當 interop 區域中的每個觸控立即傳送到下層的原生 UI 元件時，容器 composable 無法對同一個觸控做出反應。
這所呈現出的最顯著問題是捲動。如果 interop 區域位於可捲動的容器中，使用者可能會預期該區域：

* 當他們想要與其互動時，對其觸控做出反應。
* 當他們想要捲動父容器時，不對其觸控做出反應。

為了解決這個問題，Compose Multiplatform 實作了受 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) 啟發的行為。
當首次偵測到觸控時，會有一個短暫的延遲（150 ms），讓應用程式決定是否讓容器察覺到它：

* 如果 Compose 元件在此延遲期間取用了任何觸控事件，Compose Multiplatform 就不會讓原生 UI 元件察覺到此觸控序列。
* 如果在延遲期間沒有取用任何事件，則在該觸控序列的其餘部分，Compose Multiplatform 會將控制權交給原生 UI。

因此，對於可捲動的內容，如果使用者長按觸控，UI 會將其解釋為與原生元件互動的意圖；如果觸控序列很快，使用者則可能想要與父元件互動。

如果您的 interop 視圖不打算進行互動，您可以提前停用所有觸控處理。
為此，請在呼叫 `UIKitView` 或 `UIKitViewController` 的建構函式時，將 `isInteractive` 參數設定為 `false`。

> 對於在 interop 視圖中處理手勢的更複雜場景，請使用 `UIGestureRecognizer` 類別或其各種子類別。它允許在原生 interop 視圖中偵測所需的手勢，並取消 Compose 中的觸控序列。
>
{style="note"}

## 選擇觸控處理策略
<primary-label ref="Experimental"/>

透過 Compose Multiplatform %org.jetbrains.compose%，您還可以嘗試實驗性 API，以對 interop UI 進行更精細的控制。

`UIKitView` 或 `UIKitViewController` 的新建構函式接受一個 `UIKitInteropProperties` 物件作為引數。
此物件允許設定：

* 指定 interop 視圖的 `interactionMode` 參數，讓您選擇觸控處理策略。
* `isNativeAccessibilityEnabled` 選項，它會變更 interop 視圖的協助工具行為。

`interactionMode` 參數可以設定為 `Cooperative` 或 `NonCooperative`：

* `Cooperative` 模式是如上所述的新預設模式：Compose Multiplatform 在觸控處理中引入了延遲。實驗性 API 允許您透過嘗試不同的值（而非預設的 150 ms）來微調此延遲。
* `NonCooperative` 模式使用之前的策略，在該策略中，Compose Multiplatform 不處理 interop 視圖中的任何觸控事件。儘管存在上述一般問題，如果您確定 interop 觸控永遠不需要在 Compose 層級處理，則此模式可能會很有用。
* 若要停用與原生 UI 的任何互動，請將 `interactionMode = null` 傳遞給建構函式。

## 接下來要做什麼？

進一步了解 Compose Multiplatform 中的 [UIKit](compose-uikit-integration.md) 和 [SwiftUI](compose-swiftui-integration.md) 整合。