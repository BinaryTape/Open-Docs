# レイアウトの基本

Compose Multiplatform でユーザーインターフェースを効率的に構築するには、レイアウト構築の主要な概念（基本的な原則、レイアウトのフェーズ、そしてUIを構成するために利用できる一般的なコンポーネントとツールなど）を理解することが重要です。

## コンポーザブル関数

コンポーザブル関数を定義することで、ユーザーインターフェースを構築できます。これらの関数はデータを受け取り、UI要素を出力します。`@Composable` アノテーションは、関数がデータをUIに変換することをComposeコンパイラに伝えます。

テキストを表示するシンプルなコンポーザブル関数：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column、Row、およびBox

レイアウトを構成するには、これらの基本的なビルディングブロックを使用できます:

*   `Column` を使用して、アイテムを画面上に垂直に配置します。
*   `Row` を使用して、アイテムを画面上に水平に配置します。
*   `Box` を使用して、要素を重ねて配置します。
*   `Row` および `Column` の `FlowRow` および `FlowColumn` バージョンを使用して、レスポンシブなレイアウトを構築します。コンテナのスペースが不足すると、アイテムは自動的に次の行に流れ、複数の行または列を作成します:

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

Modifier を使用すると、コンポーザブルの動作を宣言的に装飾または調整できます。これらは、サイズ、配置、パディング、インタラクションの動作などを制御することで、レイアウトとインタラクションをカスタマイズする上で不可欠です。

例えば、テキストにパディングと中央揃えを追加できます:

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

詳細については、[](compose-layout-modifiers.md) を参照してください。

## 次のステップ

*   レイアウトに関する詳細については、[Jetpack Compose ドキュメント](https://developer.android.com/develop/ui/compose/layouts) を参照してください。
*   コンポーネントの[ライフサイクル](compose-lifecycle.md)について学びます。