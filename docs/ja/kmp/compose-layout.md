# レイアウトの基本

Compose Multiplatformでユーザーインターフェースを効果的に構築するには、UIを構造化するために利用できるコア原則、レイアウトフェーズ、一般的なコンポーネントやツールを含む、レイアウト構築の主要な概念を理解することが重要です。

## コンポーザブル関数

一連のコンポーザブル関数を定義することで、ユーザーインターフェースを構築できます。これらの関数はデータを受け取り、UI要素を出力します。`@Composable`アノテーションは、関数がデータをUIに変換することをComposeコンパイラに伝えます。

テキストを表示するシンプルなコンポーザブル関数：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column、Row、およびBox

レイアウトを構造化するには、これらの基本的なビルディングブロックを使用できます。

*   `Column` を使用して、アイテムを画面に縦方向に配置します。
*   `Row` を使用して、アイテムを画面に横方向に配置します。
*   `Box` を使用して、要素を互いの上に重ねて配置します。
*   `Row` と `Column` の`FlowRow`および`FlowColumn`バージョンを使用して、レスポンシブなレイアウトを構築します。コンテナのスペースがなくなると、アイテムは自動的に次の行に流れ込み、複数の行または列を作成します。

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

## Modifier

Modifierを使用すると、コンポーザブルの動作を宣言的な方法で装飾または調整できます。
これらは、サイズ、配置、パディング、インタラクションの動作などを制御することで、レイアウトやインタラクションをカスタマイズする上で不可欠です。

例えば、テキストにパディングと中央揃えを追加できます。

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

詳細は[](compose-layout-modifiers.md)を参照してください。

## 次のステップ

*   レイアウトの詳細については、[Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/layouts) を参照してください。
*   コンポーネントの[ライフサイクル](compose-lifecycle.md)について学びます。