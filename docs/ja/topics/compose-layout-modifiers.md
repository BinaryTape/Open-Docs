# 修飾子の操作

修飾子を使用すると、コンポーザブルを装飾したり、機能を拡張したりできます。修飾子を使用すると、次のことが可能になります。

*   コンポーザブルのサイズ、レイアウト、動作、および見た目を変更します。
*   アクセシビリティラベルなどの情報を追加します。
*   ユーザー入力を処理します。
*   要素をクリック可能、スクロール可能、ドラッグ可能、ズーム可能にするなど、高レベルなインタラクションを追加します。

## 修飾子のチェイン

修飾子は、複数の効果を適用するためにチェインできます。

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // チェインされた `Modifier` 関数:
        modifier = Modifier
            // `Modifier.padding(24.dp)` は列の周囲にパディングを追加します
            .padding(24.dp)
            // `Modifier.fillMaxWidth()` は列を使用可能な幅いっぱいに拡張します
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**チェイン内の修飾子関数の順序は重要です**。各関数は前の関数が返した `Modifier` に変更を加えるため、呼び出しのシーケンスがコンポーザブルの最終的な動作と見た目（外観）に直接影響します。

## 組み込み修飾子

Compose Multiplatform は、一般的なレイアウトおよび位置決めタスクを処理するために、`size`、`padding`、`offset` などの組み込み修飾子を提供します。

### サイズ修飾子

固定サイズを設定するには `size` 修飾子を使用します。制約を上書きする必要がある場合は `requiredSize` 修飾子を使用します。

```kotlin
@Composable
fun Card() {
    // 行のサイズを 400x100 dp に設定します
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 必須サイズを 150x150 dp に設定し、親の 100 dp の制限を上書きします
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // コンテンツは行内で残りのスペースを占めます
        }
    }
}
```

### パディング修飾子

`padding` 修飾子を使用して要素の周囲にパディングを追加します。また、`paddingFromBaseline` を使用して、ベースラインを基準に動的にパディングを適用することもできます。

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // ベースラインを基準に位置を調整するためにパディングを適用します
            Text(
                text = "Title",
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            // パディングが指定されていないため、デフォルトの配置に従います
            Text(text = "Subtitle")
        }
    }
}
```

### オフセット修飾子

レイアウトを元の位置から調整するには、`offset` 修飾子を使用します。X軸とY軸のオフセットを指定します。

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // オフセットを適用せずにテキストを通常通り配置します
            Text(text = "Title")
            
            // テキストをX軸に沿って 4.dp オフセットでわずかに右に移動させます。
            // 元の垂直位置は維持します
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## スコープ付き修飾子

スコープ付き修飾子（親データ修飾子とも呼ばれます）は、子に対する特定の要件を親レイアウトに通知します。
たとえば、親の `Box` のサイズに合わせるには、`matchParentSize` 修飾子を使用します。

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 親の `Box` のサイズを取得します
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 最も大きい子要素であり、`Box` のサイズを決定します
        Card()
    }
}
```

スコープ付き修飾子のもう一つの例は `weight` で、これは `RowScope` または `ColumnScope` 内で利用できます。
これは、コンポーザブルが兄弟要素に対してどれくらいのスペースを占めるべきかを決定します。

```kotlin
@Composable
fun Card() {
    Row(
        // 親の全幅を占めます
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 画像を読み込むためのプレースホルダー */,
            // 使用可能なスペースの1フラクションを占めるために 1f の重みを割り当てます 
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // 2f の重みを割り当て、`Image` と比較して2倍の幅を取ります
            modifier = Modifier.weight(2f)
        ) {
            // 列内のコンテンツ
        }
    }
}
```

## 修飾子の抽出と再利用

修飾子をチェインする際、チェインを変数や関数に抽出して再利用することができます。
これによりコードの可読性が向上し、修飾子インスタンスを再利用することでパフォーマンスが向上する可能性があります。

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // パディングと背景色を持つ再利用可能な修飾子を適用します
    Text("Reusable modifier", modifier = commonModifier)

    // `Button` に同じ修飾子を再利用します
    Button(
        onClick = { /* 何らかの処理を行う */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## カスタム修飾子

Compose Multiplatform は、一般的なユースケースに対応する多くの組み込み修飾子をすぐに提供していますが、独自のカスタム修飾子を作成することもできます。

カスタム修飾子を作成するにはいくつかの方法があります。

*   [既存の修飾子をチェインする](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
*   [コンポーザブル修飾子ファクトリを使用する](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
*   [低レベルの `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 次のステップ

修飾子の詳細については、[Jetpack Compose ドキュメント](https://developer.android.com/develop/ui/compose/modifiers)を参照してください。