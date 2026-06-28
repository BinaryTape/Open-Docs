[//]: # (title: ドラッグ＆ドロップ操作)

Compose Multiplatform アプリで、他のアプリケーションからドラッグされたデータを受け取ったり、アプリからデータをドラッグして外に出したりできるように設定できます。
これを実装するには、`dragAndDropSource` および `dragAndDropTarget` モディファイアを使用して、特定のコンポーザブルをドラッグ操作の潜在的なソース（移動元）またはターゲット（移動先）として指定します。

> `dragAndDropSource` と `dragAndDropTarget` モディファイアはどちらも実験的（experimental）であり、変更される可能性があり、オプトインアノテーションが必要です。
> 
{style="warning"}

## プラットフォーム固有のデータ処理

`dragAndDropSource` および `dragAndDropTarget` モディファイアは共通 API の一部ですが、転送されるデータはプラットフォーム固有の型でラップします：

* Android の場合は、データを Android の `ClipData` オブジェクトでラップします。
    ```kotlin
    Modifier.dragAndDropSource { _ ->
        DragAndDropTransferData(
            ClipData.newPlainText(
                "text", text
            )
        )
    }
    ```
* iOS の場合は、データを UIKit の `UIDragItem` でラップします。
    ```kotlin
    Modifier.dragAndDropSource {
        DragAndDropTransferData(
            listOf(UIDragItem.fromString(text)))
        }
    ```
* デスクトップの場合は、データを AWT の `datatransfer.Transferable` でラップします。
    ```kotlin
    Modifier.dragAndDropSource { offset ->
        DragAndDropTransferData(
            transferable = DragAndDropTransferable(
                StringSelection(text)
            )
        )
    }
    ```
* Web の場合は、データを `DataTransfer` オブジェクトでラップします。
    ```kotlin
    Modifier.dragAndDropSource { _: Offset ->
        val dataTransfer = createDataTransfer()
        dataTransfer.setData("text/plain", text)
        DragAndDropTransferData(dataTransfer)
    }
    ```

## ドラッグソースの作成

コンポーザブルをドラッグソースとして準備するには、以下の手順を行います。

1. コンポーザブルに `dragAndDropSource` モディファイアを適用します。
2. （任意）`drawDragDecoration` ラムダを追加して、ユーザーがデータをドラッグしている間に表示される視覚的な表現をカスタマイズします。
3. 転送するデータ、サポートされるアクション、および完了時の処理を記述した `DragAndDropTransferData` インスタンスを返します。

以下のデスクトップの例では、転送用の文字列を提供するドラッグソースとして `Box()` コンポーザブルをセットアップしています。実装はすべてのプラットフォームで一貫しており、ラップするデータ型のみが異なります。

```kotlin
val exportedText = "Hello, drag and drop!"
// ドラッグボックスに描画されるテキストを計測し、中央に配置します
val textMeasurer = rememberTextMeasurer()
Box(Modifier
    .size(200.dp)
    .background(Color.LightGray)
    .dragAndDropSource(
        // ドラッグされるデータの視覚的な表現を作成します
        // （exportedText 文字列が中央に配置された白い長方形）。
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
        // 転送可能なデータとサポートされる転送アクションを定義します。
        // アクションが完了すると、onTransferCompleted() を使用して
        // 結果をシステム出力に出力します。    
        DragAndDropTransferData(
            transferable = DragAndDropTransferable(
                StringSelection(exportedText)
            ),
            // このドラッグソースでサポートされるアクションのリスト。アクションのタイプは、
            // データとともにドロップターゲットに渡されます。ターゲットはこれを使用して、
            // 不適切なドロップ操作を拒否したり、ユーザーの期待を解釈したりできます。
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

## ドロップターゲットの作成

コンポーザブルをドロップターゲットとして準備するには、以下の手順を行います。

1. 処理したいドラッグイベントのオーバーライドを含む `DragAndDropTarget` オブジェクトを作成（および `remember`）します。この例では、`onStarted`、`onEnded`、および `onDrop` をオーバーライドします。
2. コンポーザブルに `dragAndDropTarget` モディファイアを適用します。ターゲットがセッションを受け入れるかどうかを決定する `shouldStartDragAndDrop` ラムダと、`DragAndDropTarget` オブジェクトを渡します。

以下のデスクトップの例では、ドロップされたテキストを表示するドロップターゲットとして `Box()` コンポーザブルをセットアップしています。

```kotlin
var showTargetBorder by remember { mutableStateOf(false) }
var targetText by remember { mutableStateOf("Drop here") }
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
            val result = (targetText == "Drop Here")
            // テキストをコンポーザブルにドロップされた値に変更します。
            targetText = event.awtTransferable.let {
                if (it.isDataFlavorSupported(DataFlavor.stringFlavor))
                    it.getTransferData(DataFlavor.stringFlavor) as String
                else
                    it.transferDataFlavors.first().humanPresentableName
            }
            // 2 秒後にドロップターゲットのテキストを初期値に戻します。
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
        // shouldStartDragAndDrop の値を "true" にすると、
        // ドラッグ＆ドロップ操作が無条件に有効になります。    
        shouldStartDragAndDrop = { true },
        target = dragAndDropTarget
    )
) {
    Text(targetText, Modifier.align(Alignment.Center))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.dragAndDropTarget"}

ドラッグ＆ドロップの動作を確認するには、`dragAndDropSource` と `dragAndDropTarget` を指定した両方の `Box()` コンポーザブルを `Row()` 内に並べて配置します。

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

## 次のステップ

実装の詳細や一般的なユースケースについては、Jetpack Compose ドキュメントの対応するモディファイアに関する記事「[Drag and drop](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)」（英語）を参照してください。