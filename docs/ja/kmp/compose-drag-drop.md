[//]: # (title: ドラッグ＆ドロップ操作)

> 現在、Compose Multiplatform for web ではドラッグ＆ドロップ操作はサポートされていません。
> 今後のリリースにご期待ください。
>
{style="note"}

Compose Multiplatform アプリで、他のアプリケーションからドラッグされたデータを受け取ったり、アプリからデータをドラッグして外に出したりできるように設定できます。
これを実装するには、`dragAndDropSource` および `dragAndDropTarget` モディファイアを使用して、特定のコンポーザブルをドラッグ操作の潜在的なソース（移動元）またはターゲット（移動先）として指定します。

> `dragAndDropSource` と `dragAndDropTarget` モディファイアはどちらも実験的（experimental）であり、変更される可能性があり、オプトインアノテーションが必要です。
> 
{style="warning"}

## ドラッグソースの作成

コンポーザブルをドラッグソースとして準備するには、以下の手順を行います。
1. `detectDragGestures()` 関数（例: `onDragStart`）を使用して、ドラッグイベントのトリガーを選択します。
2. `startTransfer()` 関数を呼び出し、`DragAndDropTransferData()` を呼び出してドラッグ＆ドロップセッションを記述します。
3. `DragAndDropTransferable()` を呼び出して、ターゲットにドラッグされる予定のデータを記述します。

ユーザーが文字列をドラッグできる `Box()` コンポーザブルの例：

```kotlin
val exportedText = "Hello, drag and drop!"

Box(Modifier
    .dragAndDropSource(
        // ドラッグされるデータの視覚的な表現を作成します
        // （exportedText 文字列が中央に配置された白い長方形）。
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
                    // 結果をシステム出力に出力します。    
                    DragAndDropTransferData(
                        transferable = DragAndDropTransferable(
                            StringSelection(exportedText)
                        ),

                        // このドラッグソースでサポートされるアクションのリスト。アクションのタイプは、
                        // データとともにドロップターゲットに渡されます。
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

コンポーザブルをドラッグ＆ドロップターゲットとして準備するには、以下の手順を行います。

1. `shouldStartDragAndDrop` ラムダで、コンポーザブルがドロップのターゲットになるための条件を記述します。
2. ドラッグイベントハンドラーのオーバーライドを含む `DragAndDropTarget` オブジェクトを作成（および `remember`）します。
3. 必要なオーバーライドを記述します。例えば、受信したデータを解析するための `onDrop` や、ドラッグ可能なオブジェクトがコンポーザブルに入ったときの `onEntered` などです。

ドロップされたテキストを表示する準備ができている `Box()` コンポーザブルの例：

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop Here") }
val coroutineScope = rememberCoroutineScope()
val dragAndDropTarget = remember {
    object: DragAndDropTarget {

        // 潜在的なドロップターゲットの枠線を強調表示します
        override fun onStarted(event: DragAndDropEvent) {
            showTargetBorder = true
        }

        override fun onEnded(event: DragAndDropEvent) {
            showTargetBorder = false
        }

        override fun onDrop(event: DragAndDropEvent): Boolean {
            // ドラッグ＆ドロップ操作が完了するたびに、
            // アクションのタイプをシステム出力に出力します。
            println("Action at the target: ${event.action}")

            val result = (targetText == "Drop here")

            // テキストをコンポーザブルにドロップされた値に変更します。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }

            // 2 秒後にドロップターゲットのテキストを初期値に戻します。
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
        // 無条件にドラッグ＆ドロップ操作が有効になります。    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed"  collapsed-title="val dragAndDropTarget = remember"}

## 次のステップ

実装の詳細や一般的なユースケースについては、Jetpack Compose ドキュメントの対応するモディファイアに関する記事「[Drag and drop](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)」（英語）を参照してください。