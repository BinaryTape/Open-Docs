[//]: # (title: 拖放操作)

> 目前，Compose Multiplatform for Web 尚不支持拖放操作。
> 请关注后续版本。
>
{style="note"}

您可以使您的 Compose Multiplatform 应用能够接受用户从其他应用程序拖入的数据，或者允许用户从您的应用中拖出数据。
要实现这一点，请使用 `dragAndDropSource` 和 `dragAndDropTarget` 修饰符将特定的可组合项指定为拖放操作的潜在源或目标。

> `dragAndDropSource` 和 `dragAndDropTarget` 修饰符均为实验性功能，可能会发生变化，并且需要选择性加入注解。
> 
{style="warning"}

## 创建拖动源

要将一个可组合项准备为拖动源，请执行以下操作：
1. 使用 `detectDragGestures()` 函数（例如 `onDragStart`）选择拖动事件的触发器。
2. 调用 `startTransfer()` 函数，并通过 `DragAndDropTransferData()` 调用来描述拖放会话。
3. 通过 `DragAndDropTransferable()` 调用来描述应拖动到目标的数据。

允许用户从中拖动字符串的 `Box()` 可组合项示例：

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // 创建正在拖动的数据的可视化表示
        // （一个带有居中 exportedText 字符串的白色矩形）。
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
                    // 定义可传输的数据和受支持的传输操作。
                    // 当操作结束时，使用 onTransferCompleted() 
                    // 将结果打印到系统输出。    
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // 此拖动源支持的操作列表。
                        // 操作类型将与数据一起传递给放置目标。
                        // 目标可以使用它来拒绝不恰当的放置操作，
                        // 或用来解释用户的预期。
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

## 创建放置目标

要将一个可组合项准备为拖放目标，请执行以下操作：

1. 在 `shouldStartDragAndDrop` Lambda 表达式中描述该可组合项成为放置目标的条件。
2. 创建（并 `remember`）`DragAndDropTarget` 对象，该对象将包含您对拖动事件处理程序的重写。
3. 编写必要的重写：例如，用于解析接收到的数据的 `onDrop`，或当可拖动对象进入可组合项时的 `onEntered`。

一个准备好显示拖入其中的文本的 `Box()` 可组合项示例：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop Here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // 高亮显示潜在放置目标的边框
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // 每次拖放操作结束时，
            // 将操作类型打印到系统输出。
            println("Action at the target: ${event.action}")

            val result = (targetText == "Drop here")

            // 将文本更改为拖入到该可组合项中的值。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // 在 2 秒后将放置目标的文本还原为初始值。
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
        // 将 shouldStartDragAndDrop 的值设置为 "true"，
        // 将无条件启用拖放操作。    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 后续步骤

要了解有关实现和常见用例的更多详细信息，请参阅 Jetpack Compose 文档中关于相应修饰符的 [拖放](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 文章。