[//]: # (title: iOS 遷移指南)

本頁將引導您瞭解在專案中將 Compose Multiplatform 函式庫升級到較新版本（從 1.7.0 開始）時，針對 iOS 的考量事項。

## Compose Multiplatform 1.6.11 到 1.7.0

### `UIKitView` 和 `UIKitViewController` 中的 `background` 參數已移除

已棄用的 `UIKitView` 和 `UIKitViewController` API 具有 `background` 參數，而新版本則沒有。該參數被認為是多餘的，因此已移除：

*   如果您需要為新實例設定互通視圖的背景，可以使用 `factory` 參數來完成。
*   如果您需要背景是可更新的，請將相應的程式碼放入 `update` lambda 運算式中。

### 觸控或手勢可能無法按預期工作

新的預設[觸控行為](compose-ios-touch.md)會使用延遲來判斷觸控是適用於互通視圖，還是該視圖的 Compose 容器：使用者必須至少靜止 150 毫秒，互通視圖才會接收到觸控。

如果您需要 Compose Multiplatform 像以前一樣處理觸控，請考慮使用新的實驗性 `UIKitInteropProperties` 建構函式。它具有 `interactionMode` 參數，您可以將其設定為 `UIKitInteropInteractionMode.NonCooperative`，以使 Compose 直接將觸控轉移到互通視圖。

該建構函式被標記為實驗性，因為我們最終打算使用單個布林旗標來描述互通視圖的互動性。在 `interactionMode` 參數中明確描述的行為，將來很可能會自動派生。

### `accessibilityEnabled` 被 `isNativeAccessibilityEnabled` 取代，且預設為關閉

舊版 `UIKitView` 和 `UIKitViewController` 建構函式的 `accessibilityEnabled` 參數已移動並重新命名，現在作為 `UIKitInteropProperties.isNativeAccessibilityEnabled` 屬性提供。它也預設設定為 `false`。

`isNativeAccessibilityEnabled` 屬性會透過原生無障礙解析影響合併的 Compose 子樹。因此，除非您需要互通視圖的豐富無障礙功能（例如網頁視圖），否則不建議將其設定為 `true`。

有關此屬性及其預設值的基本原理，請參閱[`UIKitInteropProperties` 類別的程式碼內文件](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)。

### `onResize` 參數已移除

舊版 `UIKitView` 和 `UIKitViewController` 建構函式的 `onResize` 參數會根據 `rect` 引數設定自訂框架，但它不影響 Compose 佈局本身，因此使用起來不直觀。除此之外，`onResize` 參數的預設實作需要正確設定互通視圖的框架，並包含一些關於正確裁剪視圖的實作細節。 <!-- TODO: what's wrong with that exactly? -->

如何在沒有 `onResize` 的情況下完成：

*   如果您需要對互通視圖框架的變更做出反應，您可以：
    *   覆寫互通 `UIView` 的 [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)，
    *   覆寫互通 `UIViewController` 的 [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)，
    *   或將 `onGloballyPositioned` 新增到 `Modifier` 鏈。
*   如果您需要設定互通視圖的框架，請使用相應的 Compose 修正器：`size`、`fillMaxSize` 等。

### 部分 `onReset` 使用模式已失效

將非空的 `onReset` lambda 運算式搭配 `remember { UIView() }` 使用是不正確的。

考慮以下程式碼：

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

當 `UIKitView` 進入組合時，`factory` 或 `onReset` 兩者之一會被呼叫，絕不會同時呼叫。因此，如果 `onReset` 非空，則記憶中的 `view` 可能與螢幕上顯示的不同：可組合項可以離開組合，並留下一個視圖實例，該實例將在 `onReset` 中重置後被重用，而不是使用 `factory` 分配新的實例。

為避免此類錯誤，請勿在建構函式中指定 `onReset` 值。您可能需要根據發出它的函式進入組合的上下文，從互通視圖內部執行回呼：在這種情況下，請考慮使用 `update` 在 `onReset` 中將回呼儲存到視圖內部。