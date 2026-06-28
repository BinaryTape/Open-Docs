[//]: # (title: 드래그 앤 드롭 작업)

Compose Multiplatform 앱이 다른 애플리케이션에서 사용자가 드래그한 데이터를 수락하거나, 사용자가 앱 밖으로 데이터를 드래그할 수 있도록 설정할 수 있습니다.
이를 구현하려면 `dragAndDropSource` 및 `dragAndDropTarget` 수정자를 사용하여 특정 컴포저블을 드래그 앤 드롭 작업의 잠재적 소스(source) 또는 대상(destination)으로 지정하십시오.

> `dragAndDropSource`와 `dragAndDropTarget` 수정자는 모두 실험적이며, 변경될 수 있으며, opt-in 어노테이션이 필요합니다.
> 
{style="warning"}

## 플랫폼별 데이터 처리

`dragAndDropSource` 및 `dragAndDropTarget` 수정자는 공통 API의 일부이지만, 전송되는 데이터는 플랫폼별 타입으로 래핑해야 합니다:

* Android의 경우, 데이터를 Android의 `ClipData` 객체로 래핑합니다.
    ```kotlin
    Modifier.dragAndDropSource { _ ->
        DragAndDropTransferData(
            ClipData.newPlainText(
                "text", text
            )
        )
    }
    ```
* iOS의 경우, 데이터를 UIKit의 `UIDragItem`으로 래핑합니다.
    ```kotlin
    Modifier.dragAndDropSource {
        DragAndDropTransferData(
            listOf(UIDragItem.fromString(text)))
        }
    ```
* 데스크톱의 경우, 데이터를 AWT의 `datatransfer.Transferable`로 래핑합니다.
    ```kotlin
    Modifier.dragAndDropSource { offset ->
        DragAndDropTransferData(
            transferable = DragAndDropTransferable(
                StringSelection(text)
            )
        )
    }
    ```
* 웹의 경우, 데이터를 `DataTransfer` 객체로 래핑합니다.
    ```kotlin
    Modifier.dragAndDropSource { _: Offset ->
        val dataTransfer = createDataTransfer()
        dataTransfer.setData("text/plain", text)
        DragAndDropTransferData(dataTransfer)
    }
    ```

## 드래그 소스 만들기

컴포저블을 드래그 소스로 준비하려면 다음을 수행합니다:

1. 컴포저블에 `dragAndDropSource` 수정자를 적용합니다.
2. (선택 사항) 사용자가 데이터를 드래그하는 동안 표시되는 시각적 표현을 커스텀하기 위해 `drawDragDecoration` 람다를 추가합니다.
3. 전송할 데이터, 지원되는 동작 및 완료 처리를 설명하는 `DragAndDropTransferData` 인스턴스를 반환합니다.

다음 데스크톱 예제는 문자열 전송을 제공하는 드래그 소스로 `Box()` 컴포저블을 설정합니다. 구현은 모든 플랫폼에서 동일하게 유지되며, 데이터를 래핑하는 타입만 다릅니다.

```kotlin
val exportedText = "Hello, drag and drop!"
// 드래그 박스에 그려지는 텍스트를 측정하고 중앙에 배치합니다.
val textMeasurer = rememberTextMeasurer()
Box(Modifier
    .size(200.dp)
    .background(Color.LightGray)
    .dragAndDropSource(
        // 드래그되는 데이터의 시각적 표현을 생성합니다
        // (내부에 exportedText 문자열이 중앙에 배치된 흰색 직사각형).
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
    }
) {
    Text("Drag me", Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.dragAndDropSource"}

## 드롭 대상 만들기

컴포저블을 드래그 앤 드롭 대상으로 준비하려면 다음을 수행합니다:

1. 처리하려는 드래그 이벤트에 대한 오버라이드를 포함하는 `DragAndDropTarget` 객체를 생성(및 `remember`)합니다. 이 예제에서는 `onStarted`, `onEnded`, `onDrop`을 오버라이드합니다.
2. 컴포저블에 `dragAndDropTarget` 수정자를 적용합니다. `DragAndDropTarget` 객체와 함께, 대상이 세션을 수락할지 여부를 결정하는 `shouldStartDragAndDrop` 람다를 전달합니다.

다음 데스크톱 예제는 드롭된 텍스트를 표시하는 드롭 대상으로 `Box()` 컴포저블을 설정합니다:

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop here") }
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
            val result = (targetText == "Drop Here")
            // 텍스트를 컴포저블로 드롭된 값으로 변경합니다.
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }
            // 2초 후에 드롭 대상의 텍스트를 초기 값으로 되돌립니다.
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
        // shouldStartDragAndDrop의 값이 "true"이면
        // 드래그 앤 드롭 작업이 무조건적으로 활성화됩니다.    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.dragAndDropTarget"}

드래그 앤 드롭이 작동하는 모습을 보려면, 지정된 `dragAndDropSource`와 `dragAndDropTarget`이 있는 두 `Box()` 컴포저블을 `Row()`에 나란히 배치하십시오:

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

## 다음 단계

구현 및 일반적인 사용 사례에 대한 자세한 내용은 Jetpack Compose 문서의 해당 수정자에 관한 [Drag and drop](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) 문서를 참조하십시오.