[//]: # (title: 拖放操作)

> 目前，Compose Multiplatform 尚不支援網頁版上的拖放操作。
> 請持續關注未來的版本更新。
>
{style="note"}

您可以讓您的 Compose Multiplatform 應用程式接受使用者從其他應用程式拖曳到其中的資料，
或允許使用者將資料從您的應用程式中拖曳出去。
若要實作此功能，請使用 `dragAndDropSource` 和 `dragAndDropTarget` 修飾子來指定特定可組合項，
作為拖曳操作的潛在來源或目的地。

> `dragAndDropSource` 和 `dragAndDropTarget` 這兩個修飾子均為實驗性質，可能會變更，並且需要選用註解。
> 
{style="warning"}

## 建立拖曳來源

若要準備一個可組合項作為拖曳來源：
1. 使用 `detectDragGestures()` 函數選擇拖曳事件的觸發器 (例如 `onDragStart`)。
2. 呼叫 `startTransfer()` 函數，並使用 `DragAndDropTransferData()` 呼叫描述拖放工作階段。
3. 使用 `DragAndDropTransferable()` 呼叫描述應拖曳到目標的資料。

以下是一個 `Box()` 可組合項的範例，它允許使用者從中拖曳字串：

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // 建立正在拖曳的資料的視覺表示
        // (一個白色矩形，其中 exportedText 字串居中顯示)。
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
                    // 當動作結束時，會將結果列印到
                    // 系統輸出中，並使用 onTransferCompleted()。    
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // 此拖曳來源支援的動作列表。動作類型
                        // 會與資料一起傳遞給放置目標。
                        // 目標可以使用它來拒絕不當的放置操作
                        // 或解讀使用者的期望。
                        supportedActions = listOf(
                            DragAndDropTransferAction.Copy,
                            DragAndDropTransferAction.Move,
                            DragAndDropTransferAction.Link,
                        ),
                        dragDecorationOffset = offset,
                        onTransferCompleted = { action -> 
                            println("來源端的動作: $action")
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

## 建立放置目標

若要準備一個可組合項作為拖放目標：

1. 在 `shouldStartDragAndDrop` lambda 中描述可組合項成為放置目標的條件。
2. 建立 (並 `remember`) `DragAndDropTarget` 物件，其中將包含您對拖曳事件處理常式的覆寫。
3. 編寫必要的覆寫：例如，`onDrop` 用於解析接收到的資料，或 `onEntered` 用於可拖曳物件進入可組合項時的處理。

以下是一個 `Box()` 可組合項的範例，它準備好顯示拖曳到其中的文字：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("放這裡") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // 反白顯示潛在放置目標的邊框
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // 每次拖放操作結束時，都會將動作類型列印到系統輸出中。
            println("目標端的動作: ${event.action}")

            val result = (targetText == "放這裡")

            // 將文字變更為拖曳到可組合項中的值。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // 2 秒後，將放置目標的文字恢復為初始值。
            coroutineScope.launch {
                delay(2000)
                targetText = "放這裡"
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
        // 將 shouldStartDragAndDrop 的值設為 "true"，
        // 表示無條件啟用拖放操作。    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 接下來是什麼

如需實作和常見使用案例的更多詳細資訊，請參閱 Jetpack Compose 文件中關於相應修飾子的 [拖放](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 文章。