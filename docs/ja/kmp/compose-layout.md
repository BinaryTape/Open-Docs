# レイアウトの基本

Compose Multiplatform でユーザーインターフェースを効率的に構築するには、コアとなる原則、レイアウトのフェーズ、および UI を構造化するために利用可能な一般的なコンポーネントやツールを含む、レイアウト構築の主要な概念を理解することが重要です。

## コンポーザブル関数

一連のコンポーザブル関数を定義することで、ユーザーインターフェースを構築できます。これらの関数はデータを受け取り、UI 要素を出力（emit）します。`@Composable` アノテーションは、その関数がデータを UI に変換することを Compose コンパイラに伝えます。

テキストを表示するシンプルなコンポーザブル関数：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column、Row、および Box

レイアウトを構造化するために、以下の基本的な構成要素を使用できます。

* `Column` を使用して、アイテムを画面上に垂直方向に配置します。
* `Row` を使用して、アイテムを画面上に水平方向に配置します。
* `Box` を使用して、要素を重ねて配置します。
* `Row` と `Column` のバリエーションである `FlowRow` と `FlowColumn` を使用して、レスポンシブなレイアウトを構築します。コンテナのスペースが足りなくなると、アイテムは自動的に次の行（または列）に送られ、複数の行または列が作成されます。

    ```kotlin
    @Composable
    fun ResponsiveLayout() {
        FlowRow {
            Text(text = "Item 1")
            Text(text = "Item 2")
            Text(text = "Item 3")
        }
    }
    ```

## 修飾子 (Modifiers)

修飾子（Modifier）を使用すると、宣言的な方法でコンポーザブルを装飾したり、その動作を調整したりできます。これらは、サイズ、配置（alignment）、パディング、インタラクションの動作などを制御することで、レイアウトやインタラクションをカスタマイズするために不可欠です。

例えば、テキストにパディングを追加できます。

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

詳細は [](compose-layout-modifiers.md) をご覧ください。

## 次のステップ

* レイアウトの詳細については、[Jetpack Compose のドキュメント](https://developer.android.com/develop/ui/compose/layouts) を参照してください。
* コンポーネントの [ライフサイクル](compose-lifecycle.md) について学びましょう。