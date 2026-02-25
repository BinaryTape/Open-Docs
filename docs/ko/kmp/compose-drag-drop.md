[//]: # (title: 드래그 앤 드롭 작업)

> 현재 웹용 Compose Multiplatform에서는 드래그 앤 드롭 작업이 지원되지 않습니다.
> 향후 릴리스를 기다려 주세요.
>
{style="note"}

Compose Multiplatform 앱이 다른 애플리케이션에서 사용자가 드래그한 데이터를 수락하거나, 사용자가 앱 밖으로 데이터를 드래그할 수 있도록 설정할 수 있습니다.
이를 구현하려면 `dragAndDropSource` 및 `dragAndDropTarget` 수정자를 사용하여 특정 컴포저블을 드래그 작업의 잠재적 소스(source) 또는 대상(destination)으로 지정하십시오.

> `dragAndDropSource`와 `dragAndDropTarget` 수정자는 모두 실험적이며, 변경될 수 있으며, opt-in 어노테이션이 필요합니다.
> 
{style="warning"}

## 드래그 소스 만들기

컴포저블을 드래그 소스로 준비하려면 다음을 수행합니다:
1. `detectDragGestures()` 함수(예: `onDragStart`)를 사용하여 드래그 이벤트의 트리거를 선택합니다.
2. `startTransfer()` 함수를 호출하고 `DragAndDropTransferData()` 호출을 통해 드래그 앤 드롭 세션을 설명합니다.
3. `DragAndDropTransferable()` 호출을 통해 대상으로 드래그할 데이터를 설명합니다.

사용자가 문자열을 드래그할 수 있도록 하는 `Box()` 컴포저블의 예시입니다:

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // 드래그되는 데이터의 시각적 표현을 생성합니다
        // (내부에 exportedText 문자열이 중앙에 배치된 흰색 직사각형).
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
                    // 전송 가능한 데이터와 지원되는 전송 동작을 정의합니다.
                    // 동작이 완료되면 onTransferCompleted()를 통해 
                    // 결과를 시스템 출력으로 출력합니다.    
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // 이 드래그 소스에서 지원하는 동작 목록입니다. 동작 유형은 
                        // 데이터와 함께 드롭 대상으로 전달됩니다.
                        // 대상은 이를 사용하여 부적절한 드롭 작업을 거부하거나 
                        // 사용자의 의도를 해석할 수 있습니다.
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

## 드롭 대상 만들기

컴포저블을 드래그 앤 드롭 대상으로 준비하려면 다음을 수행합니다:

1. `shouldStartDragAndDrop` 람다에서 컴포저블이 드롭의 대상이 되기 위한 조건을 설명합니다.
2. 드래그 이벤트 핸들러의 오버라이드를 포함할 `DragAndDropTarget` 객체를 생성(및 `remember`)합니다.
3. 필요한 오버라이드를 작성합니다: 예를 들어, 수신된 데이터를 파싱하기 위한 `onDrop`이나 드래그 가능한 객체가 컴포저블에 들어올 때 호출되는 `onEntered` 등이 있습니다.

드롭된 텍스트를 표시할 준비가 된 `Box()` 컴포저블의 예시입니다:

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop Here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // 잠재적인 드롭 대상의 테두리를 강조합니다.
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // 드래그 앤 드롭 작업이 완료될 때마다 
            // 동작 유형을 시스템 출력으로 출력합니다.
            println("Action at the target: ${event.action}")

            val result = (targetText == "Drop here")

            // 텍스트를 컴포저블로 드롭된 값으로 변경합니다.
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // 2초 후에 드롭 대상의 텍스트를 초기 값으로 되돌립니다.
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
        // shouldStartDragAndDrop의 값이 "true"이면
        // 드래그 앤 드롭 작업이 무조건적으로 활성화됩니다.    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 다음 단계

구현 및 일반적인 사용 사례에 대한 자세한 내용은 Jetpack Compose 문서의 해당 수정자에 관한 [Drag and drop](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 문서를 참조하십시오.