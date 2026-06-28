[//]: # (title: 拖放操作)

您可以使您的 Compose Multiplatform 应用能够接受用户从其他应用程序拖入的数据，或者允许用户从您的应用中拖出数据。
要实现这一点，请使用 `dragAndDropSource` 和 `dragAndDropTarget` 修饰符将特定的可组合项指定为拖放操作的潜在源或目标。

> `dragAndDropSource` 和 `dragAndDropTarget` 修饰符均为实验性功能，可能会发生变化，并且需要选择性加入注解。
> 
{style="warning"}

## 特定于平台的数据处理

虽然 `dragAndDropSource` 和 `dragAndDropTarget` 修饰符是公共 API 的一部分，但您需要将传输的数据包装在特定于平台的类型中：

* 对于 Android，请将您的数据包装在 Android 的 `ClipData` 对象中。
    ```kotlin
    Modifier.dragAndDropSource { _ ->
        DragAndDropTransferData(
            ClipData.newPlainText(
                "text", text
            )
        )
    }
    ```
* 对于 iOS，请将您的数据包装在 UIKit 的 `UIDragItem` 中。
    ```kotlin
    Modifier.dragAndDropSource {
        DragAndDropTransferData(
            listOf(UIDragItem.fromString(text)))
        }
    ```
* 对于桌面端，请将您的数据包装在 AWT 的 `datatransfer.Transferable` 中。
    ```kotlin
    Modifier.dragAndDropSource { offset ->
        DragAndDropTransferData(
            transferable = DragAndDropTransferable(
                StringSelection(text)
            )
        )
    }
    ```
* 对于 Web 端，请将您的数据包装在 `DataTransfer` 对象中。
    ```kotlin
    Modifier.dragAndDropSource { _: Offset ->
        val dataTransfer = createDataTransfer()
        dataTransfer.setData("text/plain", text)
        DragAndDropTransferData(dataTransfer)
    }
    ```

## 创建拖动源

要将一个可组合项准备为拖动源，请执行以下操作：

1. 将 `dragAndDropSource` 修饰符应用于您的可组合项。
2. （可选）添加 `drawDragDecoration` Lambda 表达式，以自定义用户拖动数据时显示的可视化表示。
3. 返回一个 `DragAndDropTransferData` 实例，其中描述了要传输的数据、支持的操作以及完成处理。

以下桌面端示例将 `Box()` 可组合项设置为拖动源，该源提供一个字符串进行传输。其实现跨所有平台保持一致，仅包装数据类型有所不同。

```kotlin
val exportedText = "Hello, drag and drop!"
// 测量并居中在拖动框上绘制的文本
val textMeasurer = rememberTextMeasurer()
Box(Modifier
    .size(200.dp)
    .background(Color.LightGray)
    .dragAndDropSource(
        // 创建正在拖动的数据的可视化表示
        // （一个带有居中 exportedText 字符串的白色矩形）。
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
    }
) {
    Text("Drag me", Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.dragAndDropSource"}

## 创建放置目标

要将一个可组合项准备为拖放目标，请执行以下操作：

1. 创建（并 `remember`）一个 `DragAndDropTarget` 对象，并重写您想要处理的拖动事件。在我们的示例中，我们将重写 `onStarted`、`onEnded` 和 `onDrop`。
2. 将 `dragAndDropTarget` 修饰符应用于您的可组合项。传入一个 `shouldStartDragAndDrop` Lambda 表达式（用于确定目标是否接受该会话）以及 `DragAndDropTarget` 对象。

以下桌面端示例将 `Box()` 可组合项设置为放置目标，用于显示拖入其中的文本：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop here") }
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
            val result = (targetText == "Drop Here")
            // 将文本更改为拖入到该可组合项中的值。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }
            // 在 2 秒后将放置目标的文本还原为初始值。
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
        // 将 shouldStartDragAndDrop 的值设置为 "true"，
        // 将无条件启用拖放操作。    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.dragAndDropTarget"}

要查看拖放操作的实际效果，请将指定了 `dragAndDropSource` 和 `dragAndDropTarget` 的两个 `Box()` 可组合项并排放在 `Row()` 中：

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

## 后续步骤

要了解有关实现和常见用例的更多详细信息，请参阅 Jetpack Compose 文档中关于相应修饰符的 [拖放](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 文章。