[//]: # (title: 드래그 앤 드롭 작업)

> 현재 Compose Multiplatform 웹 버전에서는 드래그 앤 드롭 작업이 지원되지 않습니다.
> 향후 릴리스를 기대해 주세요.
>
{style="note"}

Compose Multiplatform 앱에서 사용자가 다른 애플리케이션에서 끌어온 데이터를 수락하거나, 앱에서 데이터를 끌어낼 수 있도록 설정할 수 있습니다.
이를 구현하려면, 특정 컴포저블을 드래그 작업의 잠재적인 소스 또는 대상으로 지정하기 위해 `dragAndDropSource` 및 `dragAndDropTarget` 모디파이어를 사용하세요.

> `dragAndDropSource` 및 `dragAndDropTarget` 모디파이어는 모두 실험적이며, 변경될 수 있고, 옵트인(opt-in) 주석이 필요합니다.
> 
{style="warning"}

## 드래그 소스 생성

컴포저블을 드래그 소스로 준비하려면:
1. `detectDragGestures()` 함수(`onDragStart`와 같은)를 사용하여 드래그 이벤트의 트리거를 선택합니다.
2. `startTransfer()` 함수를 호출하고 `DragAndDropTransferData()` 호출로 드래그 앤 드롭 세션을 설명합니다.
3. `DragAndDropTransferable()` 호출로 대상에 끌어올 데이터를 설명합니다.

사용자가 문자열을 끌어낼 수 있도록 하는 `Box()` 컴포저블의 예시:

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // Creates a visual representation of the data being dragged
        // (white rectangle with the exportedText string centered on it).
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
                    // Defines transferable data and supported transfer actions.
                    // When an action is concluded, prints the result into
                    // system output with onTransferCompleted().    
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // List of actions supported by this drag source. A type of action
                        // is passed to the drop target together with data.
                        // The target can use this to reject an inappropriate drop operation
                        // or to interpret user expectations.
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

## 드롭 대상 생성

컴포저블을 드래그 앤 드롭 대상으로 준비하려면:

1. `shouldStartDragAndDrop` 람다에서 컴포저블이 드롭 대상이 되기 위한 조건을 설명합니다.
2. 드래그 이벤트 핸들러에 대한 오버라이드를 포함할 `DragAndDropTarget` 객체를 생성(`remember`도 사용하여)합니다.
3. 필요한 오버라이드를 작성합니다. 예를 들어, 수신된 데이터를 파싱하는 `onDrop` 또는 드래그 가능한 객체가 컴포저블에 진입할 때의 `onEntered`와 같은 오버라이드를 작성합니다.

끌어온 텍스트를 표시할 준비가 된 `Box()` 컴포저블의 예시:

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop Here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // Highlights the border of a potential drop target
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // Prints the type of action into system output every time
            // a drag-and-drop operation is concluded.
            println("Action at the target: ${event.action}")

            val result = (targetText == "Drop here")

            // Changes the text to the value dropped into the composable.
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // Reverts the text of the drop target to the initial
            // value after 2 seconds.
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
        // With "true" as the value of shouldStartDragAndDrop,
        // drag-and-drop operations are enabled unconditionally.    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 다음 단계

구현 및 일반적인 사용 사례에 대한 자세한 내용은 Jetpack Compose 문서의 해당 모디파이어에 대한 [드래그 앤 드롭](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 문서를 참조하세요.