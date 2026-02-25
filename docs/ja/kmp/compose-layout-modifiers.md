# 修飾子（Modifier）の使用

修飾子（Modifier）を使用すると、コンポーザブルを装飾したり拡張したりできます。修飾子を使用すると、以下のことが可能になります。

* コンポーザブルのサイズ、レイアウト、動作、外観を変更する。
* アクセシビリティラベルなどの情報を追加する。
* ユーザー入力を処理する。
* 要素をクリック可能、スクロール可能、ドラッグ可能、またはズーム可能にするなどの高度なインタラクションを追加する。

## 修飾子の連結 

修飾子は連結して複数の効果を適用できます。

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 連結された `Modifier` 関数:
        modifier = Modifier
            // `Modifier.padding(24.dp)` はカラムの周囲にパディングを追加します
            .padding(24.dp)
            // `Modifier.fillMaxWidth()` はカラムを利用可能な幅いっぱいに広げます
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**修飾子関数の連結順序は重要です**。各関数は前の関数から返された `Modifier` に変更を加えるため、呼び出しの順序がコンポーザブルの最終的な動作や外観に直接影響します。

## 組み込みの修飾子

Compose Multiplatform には、一般的なレイアウトや配置タスクを処理するための `size`、`padding`、`offset` などの組み込み修飾子が用意されています。

### サイズ修飾子

固定サイズを設定するには、`size` 修飾子を使用します。制約を上書きする必要がある場合は、`requiredSize` 修飾子を使用します。

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
            // コンテンツは行内の残りのスペースを占有します
        }
    }
}
```

### パディング修飾子

`padding` 修飾子を使用して、要素の周囲にパディングを追加します。また、`paddingFromBaseline` を使用して、ベースラインを基準に動的にパディングを適用することもできます。

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

レイアウトの位置を元の位置から調整するには、`offset` 修飾子を使用します。X 軸と Y 軸のオフセットを指定します。

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // オフセットを適用せず、テキストを通常の位置に配置します
            Text(text = "Title")
            
            // X 軸に沿って 4.dp のオフセットを適用し、垂直方向の元の位置を維持したまま、
            // テキストを右にわずかに移動します
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## スコープ付き修飾子

スコープ付き修飾子は、親データ修飾子（parent data modifiers）とも呼ばれ、子の特定の要件を親レイアウトに通知します。
例えば、親の `Box` のサイズに合わせるには、`matchParentSize` 修飾子を使用します。

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 親の Box のサイズに合わせます
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 最大の子要素であり、Box のサイズを決定します
        Card()
    }
}
```

スコープ付き修飾子のもう一つの例は、`RowScope` または `ColumnScope` 内で使用可能な `weight` です。
これは、兄弟要素との比較において、コンポーザブルが占有するスペースの割合を決定します。

```kotlin
@Composable
fun Card() {
    Row(
        // 親の全幅を占有します
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 画像読み込み用のプレースホルダー */,
            // 利用可能なスペースの 1 分割分を占有するように、ウェイト 1f を割り当てます 
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // ウェイト 2f を割り当て、Image と比較して 2 倍の幅を占有します
            modifier = Modifier.weight(2f)
        ) {
            // カラム内のコンテンツ
        }
    }
}
```

## 修飾子の抽出と再利用 

修飾子を連結する場合、その連鎖を変数や関数に抽出して再利用できます。
これにより、コードの可読性が向上し、修飾子のインスタンスを再利用することでパフォーマンスが向上する可能性があります。

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // パディングと背景色が設定された再利用可能な修飾子を適用します
    Text("Reusable modifier", modifier = commonModifier)

    // ボタンに同じ修飾子を再利用します
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

Compose Multiplatform には、一般的なユースケース向けの組み込み修飾子が多数用意されていますが、独自のカスタム修飾子を作成することもできます。

カスタム修飾子を作成するには、いくつかのアプローチがあります。

* [既存の修飾子の連結](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
* [コンポーザブルな修飾子ファクトリの使用](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
* [低レベルの `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 次のステップ

修飾子の詳細については、[Jetpack Compose のドキュメント](https://developer.android.com/develop/ui/compose/modifiers)をご覧ください。