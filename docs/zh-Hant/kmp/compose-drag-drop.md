[//]: # (title: 拖放操作)

> 目前，適用於網頁的 Compose Multiplatform 尚不支援拖放操作。
> 請關注未來的發佈。
>
{style="note"}

您可以啟用您的 Compose Multiplatform 應用程式，使其接受使用者從其他應用程式拖曳到其中的資料，或允許使用者從您的應用程式中拖出資料。
為了實作此功能，請使用 `dragAndDropSource` 和 `dragAndDropTarget` 修飾符來指定特定的 composable 作為拖曳操作的潛在來源或目的地。

> `dragAndDropSource` 和 `dragAndDropTarget` 這兩個修飾符都是實驗性的，可能會變更，並需要選入註解。
> 
{style="warning"}

## 建立拖曳來源

若要準備一個 composable 作為拖曳來源：
1. 使用 `detectDragGestures()` 函數（例如，`onDragStart`）選擇拖曳事件的觸發器。
2. 呼叫 `startTransfer()` 函數，並透過 `DragAndDropTransferData()` 呼叫來描述拖放會話。
3. 透過 `DragAndDropTransferable()` 呼叫來描述應拖曳到目標的資料。

一個 `Box()` composable 範例，允許使用者從中拖曳字串：

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // 建立正在拖曳之資料的視覺表示
        // （帶有置中 exportedText 字串的白色矩形）。
        drawDragDecoration = {
            drawRect(
                color = Color.White, 
                topLeft = Offset(x = 0f, y = size.height/4),
                size = Size(size.width, size.height/2)
            )
            val textLayoutResult = textMeasurer.measure(
                text = AnnotatedString(exportedText),
                layoutDirection = layoutDirection,
                density = this
            )
            drawText(
                textLayoutResult = textLayoutResult,
                topLeft = Offset(
                    x = (size.width - textLayoutResult.size.width) / 2,
                    y = (size.height - textLayoutResult.size.height) / 2,
                )
            )
        }
    ) {
        detectDragGestures(
            onDragStart = { offset ->
                startTransfer(
                    // 定義可傳輸的資料和支援的傳輸動作。
                    // 當動作完成時，透過 onTransferCompleted() 將結果輸出到系統。
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // 此拖曳來源支援的動作列表。動作類型會連同資料一起
                        // 傳遞給拖放目標。
                        // 目標可以使用此資訊拒絕不適當的拖放操作
                        // 或解讀使用者預期。
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
                )
            },
            onDrag = { _, _ -> },
        )
    }
    .size(200.dp)
    .background(Color.LightGray)
) {
    Text("拖曳我", Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="Box(Modifier.dragAndDropSource"}

## 建立拖放目標

若要準備一個 composable 以作為拖放目標：

1. 在 `shouldStartDragAndDrop` lambda 中描述該 composable 作為拖放目標的條件。
2. 建立 (並 `remember`) `DragAndDropTarget` 物件，該物件將包含您對拖曳事件處理器的覆寫。
3. 編寫必要的覆寫：例如，`onDrop` 用於解析接收到的資料，或 `onEntered` 用於當可拖曳物件進入 composable 時。

一個 `Box()` composable 範例，準備顯示拖曳到其中的文字：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop Here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // 強調潛在拖放目標的邊框
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // 每當拖放操作完成時，將動作類型輸出到系統。
            println("Action at the target: ${event.action}")

            val result = (targetText == "Drop here")

            // 將文字變更為拖曳到 composable 中的值。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // 2 秒後將拖放目標的文字恢復為初始值。
            coroutineScope.launch {
                delay(2000)
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
        // 拖放操作將無條件啟用。
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 下一步

有關實作和常見使用案例的更多詳細資訊，請參閱 Jetpack Compose 文件中關於對應修飾符的 [拖放](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 文章。