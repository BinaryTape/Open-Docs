[//]: # (title: iOS 遷移指南)

本頁將引導您瞭解在專案中將 Compose Multiplatform 函式庫升級到較新版本時（從 1.7.0 開始）需要考慮的 iOS 事項。

## Compose Multiplatform 1.6.11 到 1.7.0

### UIKitView 和 UIKitViewController 中移除了 background 參數

已棄用的 `UIKitView` 和 `UIKitViewController` API 具有 `background` 參數，而新的 API 則沒有。該參數被認為是多餘的，因此已移除：

* 如果您需要為新的實例設定互通視圖的背景，可以使用 `factory` 參數來完成。
* 如果您需要背景可更新，請將相應的程式碼放入 `update` lambda 中。

### 觸控或手勢可能無法如預期般運作

新的預設 [觸控行為](compose-ios-touch.md) 使用延遲來判斷觸控是針對互通視圖還是針對該視圖的 Compose 容器：使用者必須保持靜止至少 150 毫秒，互通視圖才會接收到觸控。

如果您需要 Compose Multiplatform 像以前一樣處理觸控，請考慮使用新的實驗性 `UIKitInteropProperties` 建構函式。它具有 `interactionMode` 參數，您可以將其設定為 `UIKitInteropInteractionMode.NonCooperative`，使 Compose 直接將觸控傳遞給互通視圖。

此建構函式被標記為實驗性，因為我們最終打算透過單一布林旗標來描述互通視圖的互動性。未來，在 `interactionMode` 參數中明確描述的行為很可能會被自動推導。

### accessibilityEnabled 被 isNativeAccessibilityEnabled 取代，並且預設為關閉

舊版 `UIKitView` 和 `UIKitViewController` 建構函式的 `accessibilityEnabled` 參數已移至並重新命名為 `UIKitInteropProperties.isNativeAccessibilityEnabled` 屬性。它也預設為 `false`。

`isNativeAccessibilityEnabled` 屬性會使合併的 Compose 子樹受到原生輔助功能解析的影響。因此，除非您需要互通視圖（例如網頁視圖）的豐富輔助功能，否則不建議將其設定為 true。

有關此屬性及其預設值的基本原理，請參閱 [UIKitInteropProperties 類別的程式碼內文件](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)。

### onResize 參數已移除

舊版 `UIKitView` 和 `UIKitViewController` 建構函式的 `onResize` 參數根據 `rect` 引數設定了自訂框架，但並未影響 Compose 佈局本身，因此使用起來不夠直觀。除此之外，`onResize` 參數的預設實作需要正確設定互通視圖的框架，並且包含一些關於正確剪裁視圖的實作細節。 <!-- TODO: what's wrong with that exactly? -->

如何在沒有 `onResize` 的情況下完成：

* 如果您需要回應互通視圖框架的變更，您可以：
    * 覆寫互通 `UIView` 的 [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)，
    * 覆寫互通 `UIViewController` 的 [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)，
    * 或將 `onGloballyPositioned` 加入 `Modifier` 鏈中。
* 如果您需要設定互通視圖的框架，請使用相應的 Compose 修飾符：`size`、`fillMaxSize` 等。

### 某些 onReset 使用模式已失效

將非空的 `onReset` lambda 與 `remember { UIView() }` 一起使用是不正確的。

請考慮以下程式碼：

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

當 `UIKitView` 進入組合時，`factory` 或 `onReset` 會被呼叫，但不會同時呼叫。因此，如果 `onReset` 不是 null，則記住的 `view` 可能與螢幕上顯示的 `view` 不同：一個 composable 可以離開組合，並留下一個視圖實例，該實例將在 `onReset` 中重設後被重複使用，而不是使用 `factory` 分配一個新的實例。

為避免此類錯誤，請勿在建構函式中指定 `onReset` 值。您可能需要根據函式發出它進入組合的上下文，在互通視圖內部執行回呼：在這種情況下，考慮使用 `update` 將回呼儲存在視圖內部，以處理 `onReset` 的相關情況。