[//]: # (title: iOS 遷移指南)

本頁面將引導您瞭解在專案中將 Compose Multiplatform 程式庫升級至較新版本（從 1.7.0 開始）時，關於 iOS 的注意事項。

## Compose Multiplatform 1.6.11 至 1.7.0

### 移除 UIKitView 和 UIKitViewController 中的 background 參數

已棄用的 `UIKitView` 和 `UIKitViewController` API 具有 `background` 參數，而新的 API 則沒有。該參數被認為是冗餘的並已移除：

* 如果您需要為新執行個體設定 Interop 視圖背景，可以使用 `factory` 參數來完成。
* 如果您需要背景是可更新的，請將對應的程式碼放入 `update` Lambda 中。

### 觸控或手勢可能無法按預期運作

新的預設[觸控行為](compose-ios-touch.md)使用延遲來判斷觸控是針對 Interop 視圖，還是針對該視圖的 Compose 容器：使用者必須保持靜止至少 150 ms，Interop 視圖才會接收到觸控。

如果您需要 Compose Multiplatform 像以前一樣處理觸控，請考慮使用新的實驗性 `UIKitInteropProperties` 建構函式。
它具有 `interactionMode` 參數，您可以將其設定為 `UIKitInteropInteractionMode.NonCooperative`，使 Compose 將觸控直接傳遞給 Interop 視圖。

該建構函式被標記為實驗性，因為我們最終打算透過單個布林旗標來保持 Interop 視圖的互動性。
在 `interactionMode` 參數中明確描述的行為，在未來很可能會自動推導出來。

### accessibilityEnabled 被 isNativeAccessibilityEnabled 取代，且預設為關閉

舊版 `UIKitView` 和 `UIKitViewController` 建構函式的 `accessibilityEnabled` 參數已移動並重新命名，現在作為 `UIKitInteropProperties.isNativeAccessibilityEnabled` 屬性提供。
它預設也設定為 `false`。

`isNativeAccessibilityEnabled` 屬性會使合併後的 Compose 子樹受原生無障礙解析影響。
因此，除非您需要 Interop 視圖的豐富無障礙功能（例如 Web 視圖），否則不建議將其設定為 true。

關於此屬性及其預設值的基本原理，請參閱 [`UIKitInteropProperties` 類別的程式碼內文件](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)。

### onResize 參數移除

舊版 `UIKitView` 和 `UIKitViewController` 建構函式的 `onResize` 參數根據 `rect` 引數設定了自訂框架，但並未影響 Compose 佈局本身，因此使用起來不直觀。
最重要的是，`onResize` 參數的預設實作需要正確設定 Interop 視圖的框架，且包含一些關於正確裁剪視圖的實作細節。 <!-- TODO: what's wrong with that exactly? -->

如何處理沒有 `onResize` 的情況：

* 如果您需要對 Interop 視圖框架變更做出反應，您可以：
    * 覆寫 Interop `UIView` 的 [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)，
    * 覆寫 Interop `UIViewController` 的 [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)，
    * 或是在 `Modifier` 鏈中加入 `onGloballyPositioned`。
* 如果您需要設定 Interop 視圖的框架，請使用對應的 Compose 修飾符：`size`、`fillMaxSize` 等。

### 部分 onReset 使用模式已失效

將非 null 的 `onReset` Lambda 與 `remember { UIView() }` 配合使用是不正確的。

考慮以下程式碼：

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

當 `UIKitView` 進入組合時，會呼叫 `factory` 或 `onReset` 其中之一，絕不會兩者都呼叫。
因此，如果 `onReset` 不為 null，則記住的 `view` 可能與螢幕上顯示的視圖不同：
一個 Composable 可以離開組合並留下一個視圖執行個體，該執行個體在 `onReset` 中重設後將被重複使用，而不是使用 `factory` 分配一個新視圖。

為了避免此類錯誤，請不要在建構函式中指定 `onReset` 值。
您可能需要根據發射該函式進入組合的上下文，從 Interop 視圖內執行回呼：
在這種情況下，請考慮使用 `update` 或 `onReset` 將回呼儲存在視圖內。