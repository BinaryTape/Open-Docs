[//]: # (title: ドラッグ＆ドロップ操作)

> 現在、Compose Multiplatform for web ではドラッグ＆ドロップ操作はサポートされていません。
> 今後のリリースにご期待ください。
>
{style="note"}

Compose Multiplatformアプリで、ユーザーが他のアプリケーションからドラッグしてくるデータを受け入れたり、アプリからデータをドラッグして持ち出したりできるようにすることができます。
これを実装するには、`dragAndDropSource` および `dragAndDropTarget` 修飾子を使用して、特定のコンポーザブルをドラッグ操作の潜在的なソースまたはターゲットとして指定します。

> `dragAndDropSource` および `dragAndDropTarget` の両方の修飾子は実験的であり、変更される可能性があり、オプトインアノテーションが必要です。
>
{style="warning"}

## ドラッグソースの作成

コンポーザブルをドラッグソースとして準備するには：
1. `detectDragGestures()` 関数（例：`onDragStart`）でドラッグイベントのトリガーを選択します。
2. `startTransfer()` 関数を呼び出し、`DragAndDropTransferData()` を使ってドラッグ＆ドロップセッションを記述します。
3. `DragAndDropTransferable()` を使ってターゲットにドラッグされるデータを記述します。

ユーザーが文字列をドラッグできるようにする `Box()` コンポーザブルの例：

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // ドラッグ中のデータの視覚的な表現を作成します
        // （exportedText 文字列が中央に配置された白い四角形）。
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
                    // 転送可能なデータとサポートされる転送アクションを定義します。
                    // アクションが完了すると、onTransferCompleted() を使用して
                    // システム出力に結果を表示します。
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // このドラッグソースがサポートするアクションのリスト。アクションのタイプは、
                        // データと共にドロップターゲットに渡されます。
                        // ターゲットはこれを使用して、不適切なドロップ操作を拒否したり、
                        // ユーザーの期待を解釈したりできます。
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

## ドロップターゲットの作成

コンポーザブルをドラッグ＆ドロップターゲットとして準備するには：

1. `shouldStartDragAndDrop` ラムダで、コンポーザブルがドロップのターゲットとなる条件を記述します。
2. ドラッグイベントハンドラのオーバーライドを含む `DragAndDropTarget` オブジェクトを作成し（そして `remember` し）ます。
3. 必要なオーバーライドを記述します。例えば、受信したデータを解析するための `onDrop` や、ドラッグ可能なオブジェクトがコンポーザブルに入ったときの `onEntered` などです。

ドロップされたテキストを表示する準備ができている `Box()` コンポーザブルの例：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop Here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // 潜在的なドロップターゲットの境界線を強調表示します
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // ドラグ＆ドロップ操作が完了するたびに、アクションのタイプをシステム出力に表示します。
            println("Action at the target: ${event.action}")

            val result = (targetText == "Drop here")

            // ドロップされた値にテキストを変更します。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // ドロップターゲットのテキストを、2秒後に初期値に
            // 戻します。
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
        // shouldStartDragAndDrop の値を "true" にすると、
        // ドラッグ＆ドロップ操作が無条件で有効になります。
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 次のステップ

実装と一般的な使用例の詳細については、Jetpack Compose ドキュメントの対応する修飾子に関する [ドラッグ＆ドロップ](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) の記事を参照してください。