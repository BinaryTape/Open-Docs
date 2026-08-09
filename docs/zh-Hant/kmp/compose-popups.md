[//]: # (title: Popup)

<web-summary>了解如何在 Compose Multiplatform 中建立、定位及自訂 Popup，用於下拉式功能表、工具提示和選單。</web-summary>

Compose Multiplatform 中的 Popup 是一個浮動容器，可在相同視窗內的目前 UI 上方轉譯其內容。

與多平台 `Dialog()` API 不同，`Popup()` 是非強制回應（non-modal）的。
Compose Multiplatform 中的對話方塊作為強制回應容器，會取得焦點、將內容置中，並使用深色紗幕 (scrim) 來阻擋與 UI 其餘部分的互動。
另一方面，Popup 沒有紗幕，不限制其寬度，並允許使用者繼續與底層 UI 互動。它預設不置中，且需要額外的引數將其錨定到元件。

當您需要中斷使用者並要求其在繼續之前做出決定時，請使用 [`Dialog()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Dialog.composable)，例如回應確認、警報或短表單。對於桌面端獨立的作業系統級別對話方塊，請參閱 [`DialogWindow()`](compose-desktop-top-level-windows-management.md#show-dialogs)。
對於保持錨定在目前視窗內元件上的輕量化、非阻塞重疊層（如下拉式功能表、工具提示和選單），請使用 `Popup()`。

## 定位 Popup

若要定位 Popup，請使用 `alignment` 和 `offset`，或使用自訂的 `PopupPositionProvider` 進行錨定放置。

對於簡單的對齊：

```kotlin
var isPopupOpen by remember { mutableStateOf(false) }

Box(Modifier.padding(24.dp)) {
    Button(onClick = { isPopupOpen = !isPopupOpen }) {
        Text("Toggle popup")
    }

    if (isPopupOpen) {
        Popup(
            // 相對於按鈕定位 Popup
            alignment = Alignment.TopStart,
            // 以像素為單位偏移 (x, y)
            offset = IntOffset(30, 70),
            // 當 Popup 被關閉時隱藏，
            // 例如使用者點擊外部時
            onDismissRequest = { isPopupOpen = false }
        ) {
            Box(
                Modifier
                    .background(Color.LightGray, RoundedCornerShape(4.dp))
                    .padding(12.dp)
            ) {
                Text("Popup content on top of UI")
            }
        }
    }
}
```

對於錨定放置，請使用 `PopupPositionProvider`：

```kotlin
var isPopupOpen by remember { mutableStateOf(false) }

val belowAnchor = remember {
    object : PopupPositionProvider {
        override fun calculatePosition(
            anchorBounds: IntRect,
            windowSize: IntSize,
            layoutDirection: LayoutDirection,
            popupContentSize: IntSize
        ) = IntOffset(x = anchorBounds.left - 20, y = anchorBounds.bottom - 20)
    }
}

Column(Modifier.padding(24.dp)) {
    Box {
        Button(onClick = { isPopupOpen = !isPopupOpen }) {
            Text("Toggle menu")
        }

        if (isPopupOpen) {
            Popup(
                popupPositionProvider = belowAnchor,
                onDismissRequest = { isPopupOpen = false }
            ) {
                Box(
                    Modifier
                        .shadow(4.dp, RoundedCornerShape(4.dp))
                        .background(Color.White, RoundedCornerShape(4.dp))
                        .padding(12.dp)
                ) {
                    Text("Anchored to the button")
                }
            }
        }
    }
}
```

## 自訂行為

透過 `PopupProperties`，您可以控制 Popup 如何處理焦點和關閉：

* `focusable` 決定 Popup 是否接收按鍵事件，預設為停用。
* `dismissOnBackPress` 在 Android 的返回按鈕或桌面端的 **Esc** 鍵上關閉 Popup，預設為啟用。需要 `focusable = true`。
* `dismissOnClickOutside` 當使用者在邊界外按下時關閉 Popup，預設為啟用。

`Popup()` 及其 `PopupProperties` 是通用 API 的一部分。然而，某些屬性在通用原始碼集中不可用。例如，`usePlatformInsets` 在 iOS 上可用，它將 Popup 的內容限制在平台邊距（安全區域）內。

## 接下來的步驟

若要了解完整的 API 詳細資訊，請參閱 Jetpack Compose 文件中的參考資料：
* [`Popup()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Popup.composable)
* [`Dialog()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Dialog.composable)