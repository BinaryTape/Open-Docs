[//]: # (title: 在 iOS 上使用互通性處理觸控事件)

在 iOS 上，Compose Multiplatform 可以與原生的 UIKit 和 SwiftUI 框架整合。
這種整合的一個挑戰是處理觸控：當 Compose Multiplatform 應用程式包含原生 UI 元素時，
應用程式可能需要根據上下文，在互通性區域中對觸控做出不同的反應。

目前，Compose Multiplatform 對於處理原生視圖中的觸控事件只有一種策略：
所有觸控完全由原生 UI 處理，而 Compose 完全不察覺它們的發生。

## 互通性捲動中的觸控

當互通性區域中的每個觸控立即傳送到底層原生 UI 元素時，
容器可組合項無法對相同的觸控做出反應。
這帶來最明顯的問題是捲動。如果互通性區域位於可捲動容器中，使用者可能會期望該區域：

*   當他們想與其互動時，能對其觸控做出反應。
*   當他們想捲動父容器時，不會對其觸控做出反應。

為了解決這個問題，Compose Multiplatform 實作了受 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) 啟發的行為。
當首次偵測到觸控時，會有一個短暫的延遲 (150 毫秒)，讓應用程式決定是否讓容器察覺到它：

*   如果 Compose 元件在此延遲期間消耗任何觸控事件，Compose Multiplatform 就不會讓原生 UI 元素
    察覺到此觸控序列。
*   如果在此延遲期間沒有消耗任何事件，則在觸控序列的其餘部分，Compose Multiplatform
    會將控制權交給原生 UI。

因此，對於可捲動內容，如果使用者按住觸控，UI 會將此解釋為與原生元素互動的意圖；
如果觸控序列快速，使用者則可能想與父元素互動。

如果您的互通性視圖不打算互動，您可以預先停用所有觸控處理。
為此，請呼叫 `UIKitView` 或 `UIKitViewController` 的建構函式，並將 `isInteractive` 參數設定為 `false`。

> 對於在互通性視圖內處理手勢的更複雜場景，
> 請使用 `UIGestureRecognizer` 類別或其各種子類別。
> 它允許在原生互通性視圖中偵測所需手勢，以及在 Compose 中取消觸控序列。
>
{style="note"}

## 選擇觸控處理策略
<primary-label ref="Experimental"/>

透過 Compose Multiplatform %org.jetbrains.compose%，您還可以嘗試實驗性 API，以更精細地控制互通性 UI。

`UIKitView` 或 `UIKitViewController` 的新建構函式接受 `UIKitInteropProperties` 物件作為引數。
此物件允許設定：

*   給定互通性視圖的 `interactionMode` 參數，讓您可以選擇觸控處理策略。
*   `isNativeAccessibilityEnabled` 選項，它會更改互通性視圖的無障礙行為。

`interactionMode` 參數可以設定為 `Cooperative` 或 `NonCooperative`：

*   `Cooperative` 模式是新的預設值，如上所述：Compose Multiplatform 會在觸控處理中引入延遲。
    實驗性 API 允許您透過嘗試不同的值來微調此延遲，而非使用預設的 150 毫秒。
*   `NonCooperative` 模式使用先前的策略，其中 Compose Multiplatform 不處理互通性視圖中的任何觸控事件。
    儘管有上述一般問題，但如果您確定互通性觸控從不需要在 Compose 層級處理，此模式可能很有用。
*   若要停用與原生 UI 的任何互動，請將 `interactionMode = null` 傳遞給建構函式。

## 接下來是什麼？

進一步了解 Compose Multiplatform 中 [UIKit](compose-uikit-integration.md) 和 [SwiftUI](compose-swiftui-integration.md) 的整合。