# 修飾子を扱う

修飾子（Modifier）を使うと、コンポーザブルを装飾したり拡張したりできます。修飾子を使用すると、次のことが可能になります。

*   コンポーザブルのサイズ、レイアウト、動作、外観を変更する。
*   アクセシビリティラベルなどの情報を追加する。
*   ユーザー入力を処理する。
*   要素をクリック可能、スクロール可能、ドラッグ可能、ズーム可能にするなど、高レベルなインタラクションを追加する。

## 修飾子の連結

複数の効果を適用するために、修飾子を連結（チェイン）できます。

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 連結された `Modifier` 関数:
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

**チェイン内の修飾子関数の順序は重要です**。各関数は前の関数が返した`Modifier`に変更を加えるため、呼び出しの順序がコンポーザブルの最終的な動作と外観に直接影響します。

## 組み込み修飾子

Compose Multiplatform は、一般的なレイアウトおよび配置タスクを処理するために、`size`、`padding`、`offset`などの組み込み修飾子を提供します。

### サイズ修飾子

固定サイズを設定するには、`size`修飾子を使用します。制約を上書きする必要がある場合は、`requiredSize`修飾子を使用します。

```kotlin
@Composable
fun Card() {
    // 行のサイズを 400x100 dp に設定します
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 必須サイズを 150x150 dp に設定し、親の 100 dp 制限を上書きします
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // コンテンツは行内の残りのスペースを占めます
        }
    }
}
```

### パディング修飾子

`padding`修飾子を使って要素の周囲にパディングを追加します。`paddingFromBaseline` を使用して、ベースラインを基準に動的にパディングを適用することもできます。

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // ベースラインに対する位置を調整するためにパディングを適用します
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

レイアウトの元の位置からの配置を調整するには、`offset`修飾子を使用します。X軸とY軸のオフセットを指定します。

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // オフセットが適用されず、テキストを通常通り配置します
            Text(text = "Title")
            
            // X軸に沿って 4.dp のオフセットでテキストを少し右に移動させ、
            // 元の垂直位置を維持します
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## スコープ付き修飾子

スコープ付き修飾子（Scoped Modifier）は、親データ修飾子とも呼ばれ、子コンポーザブルに対する特定の要件を親レイアウトに通知します。
例えば、親の`Box`のサイズに合わせるには、`matchParentSize`修飾子を使用します。

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 親の Box のサイズを取得します
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 最も大きい子コンポーザブルが Box のサイズを決定します
        Card()
    }
}
```

スコープ付き修飾子の別の例として、`RowScope`または`ColumnScope`内で使用できる`weight`があります。これは、コンポーザブルがその兄弟要素に対してどれくらいのスペースを占めるべきかを決定します。

```kotlin
@Composable
fun Card() {
    Row(
        // 親の全幅を占めます
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 画像を読み込むためのプレースホルダー */,
            // 使用可能なスペースの1つの比率を占めるように 1f の重みを割り当てます 
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // Imageと比較して2倍の幅を占めるように 2f の重みを割り当てます
            modifier = Modifier.weight(2f)
        ) {
            // 列内のコンテンツ
        }
    }
}
```

## 修飾子の抽出と再利用

修飾子を連結する場合、再利用のためにそのチェインを変数や関数に抽出できます。これにより、コードの可読性が向上し、修飾子インスタンスを再利用することでパフォーマンスが向上する可能性があります。

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // パディングと背景色を持つ再利用可能な修飾子を適用します
    Text("Reusable modifier", modifier = commonModifier)

    // Button に同じ修飾子を再利用します
    Button(
        onClick = { /* Do something */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## カスタム修飾子

Compose Multiplatform は、一般的なユースケースに対応する多くの組み込み修飾子をすぐに利用できるように提供していますが、独自のカスタム修飾子を作成することもできます。

カスタム修飾子を作成するには、いくつかの方法があります。

*   [既存の修飾子を連結する](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
*   [コンポーザブル修飾子ファクトリを使用する](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
*   [低レベルの `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 次のステップ

修飾子については、[Jetpack Compose ドキュメント](https://developer.android.com/develop/ui/compose/modifiers)で詳細をご覧ください。