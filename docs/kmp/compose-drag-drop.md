[//]: # (title: 拖放操作)

> 当前，Compose Multiplatform for Web 不支持拖放操作。
> 敬请关注未来的发布。
>
{style="note"}

您可以让您的 Compose Multiplatform 应用接受用户从其他应用程序拖入的数据，或者允许用户将数据从您的应用中拖出。
要实现此功能，请使用 `dragAndDropSource` 和 `dragAndDropTarget` 修饰符，将特定的 composable 指定为拖放操作的潜在源或目标。

> `dragAndDropSource` 和 `dragAndDropTarget` 修饰符都是实验性的，可能会发生变化，并且需要选择性加入注解。
> 
{style="warning"}

## 创建拖放源

要准备一个 composable 作为拖放源：
1. 使用 `detectDragGestures()` 函数选择拖放事件的触发器（例如，`onDragStart`）。
2. 调用 `startTransfer()` 函数，并使用 `DragAndDropTransferData()` 调用来描述拖放会话。
3. 使用 `DragAndDropTransferable()` 调用描述将要拖动到目标的数据。

一个 `Box()` composable 的示例，它允许用户从中拖动字符串：

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // 创建正在拖动数据的视觉表示
        // （白色矩形，中心显示 exportedText 字符串）。
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
                    // 定义可传输数据和支持的传输操作。
                    // 当操作结束时，将结果打印到
                    // 系统输出，通过 onTransferCompleted()。    
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // 此拖放源支持的操作列表。操作类型
                        // 与数据一起传递给拖放目标。
                        // 目标可以使用此信息拒绝不适当的拖放操作
                        // 或解释用户预期。
                        supportedActions = listOf(
                            DragAndDropTransferAction.Copy,
                            DragAndDropTransferAction.Move,
                            DragAndDropTransferAction.Link,
                        ),
                        dragDecorationOffset = offset,
                        onTransferCompleted = { action -> 
                            println("源上的操作: $action")
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

## 创建拖放目标

要准备一个 composable 作为拖放目标：

1. 在 `shouldStartDragAndDrop` lambda 表达式中描述 composable 成为拖放目标的条件。
2. 创建（并 `remember`）`DragAndDropTarget` 对象，该对象将包含您对拖放事件处理器的覆盖。
3. 编写必要的覆盖：例如，`onDrop` 用于解析接收到的数据，或者 `onEntered` 用于可拖动对象进入 composable 时。

一个 `Box()` composable 的示例，它已准备好显示拖入其中的文本：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop Here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // 突出显示潜在拖放目标的边框
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // 每次拖放操作结束时，将操作类型打印到系统输出。
            println("目标上的操作: ${event.action}")

            val result = (targetText == "Drop here")

            // 将文本更改为拖放到 composable 中的值。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // 在 2 秒后将拖放目标的文本
            // 还原为初始值。
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
        // 拖放操作将无条件启用。    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 接下来

有关实现和常见用例的更多详细信息，请参见 Jetpack Compose 文档中关于相应修饰符的 [拖放](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 文章。