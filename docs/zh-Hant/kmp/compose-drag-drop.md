[//]: # (title: 拖放操作)

> 目前 Compose Multiplatform for web 尚不支援拖放操作。
> 請關注未來版本。
>
{style="note"}

您可以讓您的 Compose Multiplatform 應用程式接受使用者從其他應用程式拖入的資料，或允許使用者將資料從您的應用程式中拖出。
若要實作此功能，請使用 `dragAndDropSource` 與 `dragAndDropTarget` 修飾符將特定的 composable 指定為拖曳操作的潛在來源或目的地。

> `dragAndDropSource` 與 `dragAndDropTarget` 修飾符皆為實驗性功能，可能會有所變動，且需要選擇性加入 (opt-in) 註解。
> 
{style="warning"}

## 建立拖曳來源

若要將 composable 準備為拖曳來源：
1. 使用 `detectDragGestures()` 函式選擇拖曳事件的觸發條件（例如：`onDragStart`）。
2. 呼叫 `startTransfer()` 函式並透過 `DragAndDropTransferData()` 呼叫來描述拖放工作階段。
3. 透過 `DragAndDropTransferable()` 呼叫描述預計要拖曳到目標的資料。

以下是一個允許使用者從中拖曳字串的 `Box()` composable 範例：

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // 建立所拖曳資料的視覺表示
        // （帶有居中 exportedText 字串的白色矩形）。
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
                    // 定義可傳輸資料與支援的傳輸操作。
                    // 當操作結束時，透過 onTransferCompleted()
                    // 將結果印到系統輸出。    
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // 此拖曳來源支援的操作列表。操作類型
                        // 會與資料一起傳遞到拖放目標。
                        // 目標可以使用此資訊來拒絕不適當的拖放操作
                        // 或解讀使用者的期望。
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
    Text("Drag Me", Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="Box(Modifier.dragAndDropSource"}

## 建立放置目標

若要將 composable 準備為拖放目標：

1. 在 `shouldStartDragAndDrop` lambda 運算式中描述該 composable 成為拖放目標的條件。
2. 建立（並 `remember`）`DragAndDropTarget` 物件，該物件將包含您對拖曳事件處理常式的覆寫。
3. 撰寫必要的覆寫：例如，用於剖析接收資料的 `onDrop`，或當可拖曳物件進入 composable 時的 `onEntered`。

以下是一個準備好顯示拖入文字的 `Box()` composable 範例：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop Here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // 醒目提示潛在拖放目標的邊框
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

            val result = (targetText == "Drop here")

            // 將文字變更為拖入 composable 的值。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // 在 2 秒後將拖放目標的文字
            // 還原為初始值。
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
        // 將無條件啟用拖放操作。    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 下一步

如需更多關於實作與常見使用案例的細節，請參閱 Jetpack Compose 文件中關於對應修飾符的 [拖放](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 文章。