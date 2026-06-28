[//]: # (title: 拖放操作)

您可以讓您的 Compose Multiplatform 應用程式接受使用者從其他應用程式拖入的資料，或允許使用者將資料從您的應用程式中拖出到其他應用程式。
若要實作此功能，請使用 `dragAndDropSource` 與 `dragAndDropTarget` 修飾符將特定的 composable 指定為拖放操作的潛在來源或目的地。

> `dragAndDropSource` 與 `dragAndDropTarget` 修飾符皆為實驗性功能，可能會有所變動，且需要選擇性加入 (opt-in) 註解。
> 
{style="warning"}

## 特定平台的資料處理

雖然 `dragAndDropSource` 與 `dragAndDropTarget` 修飾符是通用 API 的一部分，但您需要將傳輸的資料包裝在特定平台的型別中：

* 對於 Android，請將您的資料包裝在 Android 的 `ClipData` 物件中。
    ```kotlin
    Modifier.dragAndDropSource { _ ->
        DragAndDropTransferData(
            ClipData.newPlainText(
                "text", text
            )
        )
    }
    ```
* 對於 iOS，請將您的資料包裝在 UIKit 的 `UIDragItem` 中。
    ```kotlin
    Modifier.dragAndDropSource {
        DragAndDropTransferData(
            listOf(UIDragItem.fromString(text)))
        }
    ```
* 對於桌面端，請將您的資料包裝在 AWT 的 `datatransfer.Transferable` 中。
    ```kotlin
    Modifier.dragAndDropSource { offset ->
        DragAndDropTransferData(
            transferable = DragAndDropTransferable(
                StringSelection(text)
            )
        )
    }
    ```
* 對於 Web，請將您的資料包裝在 `DataTransfer` 物件中。
    ```kotlin
    Modifier.dragAndDropSource { _: Offset ->
        val dataTransfer = createDataTransfer()
        dataTransfer.setData("text/plain", text)
        DragAndDropTransferData(dataTransfer)
    }
    ```

## 建立拖曳來源

若要將 composable 準備為拖曳來源：

1. 在您的 composable 上套用 `dragAndDropSource` 修飾符。
2. （選用）新增 `drawDragDecoration` lambda 運算式以自訂使用者拖曳資料時顯示的視覺表示。
3. 回傳一個 `DragAndDropTransferData` 執行個體，描述要傳輸的資料、支援的操作以及完成處理。

以下桌面端範例將 `Box()` composable 設定為拖曳來源，提供一個字串進行傳輸。此實作在所有平台上保持一致，僅有包裝資料的型別有所不同。

```kotlin
val exportedText = "Hello, drag and drop!"
// 測量並置中顯示在拖曳方塊上的文字
val textMeasurer = rememberTextMeasurer()
Box(Modifier
    .size(200.dp)
    .background(Color.LightGray)
    .dragAndDropSource(
        // 建立所拖曳資料的視覺表示
        // （帶有居中 exportedText 字串的白色矩形）。
        drawDragDecoration = {
            drawRect(
                color = Color.White, 
                topLeft = Offset(x = 0f, y = size.height/4),
                size = Size(size.width, size.height/2)
            )
            drawText(
                textMeasurer = textMeasurer,
                text = exportedText,
                topLeft = Offset(x = 16.dp.toPx(), y = size.height / 2 - 8.dp.toPx())
            )
        }
    ) { offset ->
        // 定義可傳輸資料與支援的傳輸操作。
        // 當操作結束時，透過 onTransferCompleted()
        // 將結果印到系統輸出。    
        DragAndDropTransferData(
            transferable = DragAndDropTransferable(
                StringSelection(exportedText)
            ),
            // 此拖曳來源支援的操作列表。操作類型
            // 會與資料一起傳遞到放置目標，因此
            // 目標可以拒絕不適當的放置或解讀使用者的期望。
            supportedActions = listOf(
                DragAndDropTransferAction.Copy,
                DragAndDropTransferAction.Move,
                DragAndDropTransferAction.Link,
            ),
            dragDecorationOffset = offset,
            onTransferCompleted = { action -> 
                println("Action at the source: $action")
            }
        )
    }
) {
    Text("Drag me", Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.dragAndDropSource"}

## 建立放置目標

若要將 composable 準備為放置目標：

1. 建立（並 `remember`）一個 `DragAndDropTarget` 物件，並覆寫您想要處理的拖曳事件。在我們的範例中，我們將覆寫 `onStarted`、`onEnded` 與 `onDrop`。
2. 在您的 composable 上套用 `dragAndDropTarget` 修飾符。傳遞一個 `shouldStartDragAndDrop` lambda 運算式（用以決定目標是否接受該工作階段）以及 `DragAndDropTarget` 物件。

以下桌面端範例將 `Box()` composable 設定為放置目標，顯示拖入其中的文字：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {
        // 醒目提示潛在放置目標的邊框
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // 每當拖放操作結束時，
            // 將操作類型印到系統輸出。
            println("Action at the target: ${event.action}")
            val result = (targetText == "Drop Here")
            // 將文字變更為拖入 composable 的值。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }
            // 在 2 秒後將放置目標的文字
            // 還原為初始值。
            coroutineScope.launch {
                delay(2.seconds)
                targetText = "Drop here"
            }
            return result
        }
    }
}

Box(Modifier
    .size(200.dp)
    .background(Color.LightGray)
    .then(
        if (showTargetBorder)
            Modifier.border(BorderStroke(3.dp, Color.Black))
        else
            Modifier
    )
    .dragAndDropTarget(
        // 當 shouldStartDragAndDrop 的值為 "true" 時，
        // 將無條件啟用拖放操作。    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.dragAndDropTarget"}

若要查看拖放操作的實際效果，請將分別指定了 `dragAndDropSource` 與 `dragAndDropTarget` 的兩個 `Box()` composable 並排放在 `Row()` 中：

```kotlin
Row(
    horizontalArrangement = Arrangement.SpaceEvenly,
    verticalAlignment = Alignment.CenterVertically,
    modifier = Modifier.fillMaxSize()
) {
    Box(Modifier.dragAndDropSource( /* ... */ )

    Box(Modifier.dragAndDropTarget( /* ... */ )
}
```

## 下一步

如需更多關於實作與常見使用案例的細節，請參閱 Jetpack Compose 文件中關於對應修飾符的 [拖放](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 文章。