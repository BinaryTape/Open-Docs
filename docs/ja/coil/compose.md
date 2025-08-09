# Compose

[Compose UI](https://www.jetbrains.com/compose-multiplatform/) のサポートを追加するには、拡張ライブラリをインポートします。

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
```

次に、`AsyncImage` コンポーザブルを使用して画像をロードして表示します。

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

`model` は `ImageRequest.data` の値、または `ImageRequest` 自体のいずれかになります。`contentDescription` は、アクセシビリティサービスがこの画像が何を表しているかを説明するために使用するテキストを設定します。

## AsyncImage

`AsyncImage` は、画像リクエストを非同期で実行し、結果をレンダリングするコンポーザブルです。これは標準の `Image` コンポーザブルと同じ引数をサポートしており、さらに `placeholder`/`error`/`fallback` の Painter 設定や、`onLoading`/`onSuccess`/`onError` のコールバックをサポートしています。以下は、画像を円形に切り抜き、クロスフェードを適用し、プレースホルダーを設定する例です。

```kotlin
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    placeholder = painterResource(R.drawable.placeholder),
    contentDescription = stringResource(R.string.description),
    contentScale = ContentScale.Crop,
    modifier = Modifier.clip(CircleShape),
)
```

**この関数を使用する場合：**

ほとんどの場合、`AsyncImage` の使用を推奨します。これは、コンポーザブルの制約と提供された `ContentScale` に基づいて、画像をロードすべきサイズを正確に決定します。

## rememberAsyncImagePainter

内部的に、`AsyncImage` と `SubcomposeAsyncImage` は `model` をロードするために `rememberAsyncImagePainter` を使用します。コンポーザブルではなく `Painter` が必要な場合は、`rememberAsyncImagePainter` を使用して画像をロードできます。

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")
```

`rememberAsyncImagePainter` は `AsyncImage` および `SubcomposeAsyncImage` よりも柔軟ですが、いくつかの欠点があります（下記参照）。

**この関数を使用する場合：**

コンポーザブルではなく `Painter` が必要な場合、または `AsyncImagePainter.state` を監視してそれに基づいて異なるコンポーザブルを描画する必要がある場合、または `AsyncImagePainter.restart` を使用して画像リクエストを手動で再開する必要がある場合に役立ちます。

この関数の主な欠点は、画面上で画像がロードされるサイズを検出せず、常に元の寸法で画像をロードすることです。これを解決するには、カスタムの `SizeResolver` を渡すか、`rememberConstraintsSizeResolver`（`AsyncImage` が内部的に使用するもの）を使用できます。例：

```kotlin
val sizeResolver = rememberConstraintsSizeResolver()
val painter = rememberAsyncImagePainter(
    model = ImageRequest.Builder(LocalPlatformContext.current)
        .data("https://example.com/image.jpg")
        .size(sizeResolver)
        .build(),
)

Image(
    painter = painter,
    contentDescription = null,
    modifier = Modifier.then(sizeResolver),
)
```

もう1つの欠点は、`rememberAsyncImagePainter` を使用すると、最初のコンポジションでは `AsyncImagePainter.state` が常に `AsyncImagePainter.State.Empty` になることです。これは、画像がメモリキャッシュに存在し、最初のフレームで描画される場合でも同様です。

## SubcomposeAsyncImage

`SubcomposeAsyncImage` は、`Painter` を使用する代わりに、サブコンポジションを使用して `AsyncImagePainter` の状態にスロット API を提供する `AsyncImage` のバリアントです。以下に例を示します。

```kotlin
SubcomposeAsyncImage(
    model = "https://example.com/image.jpg",
    loading = {
        CircularProgressIndicator()
    },
    contentDescription = stringResource(R.string.description),
)
```

さらに、`content` 引数と、現在の状態をレンダリングする `SubcomposeAsyncImageContent` を使用して、より複雑なロジックを持つことができます。

```kotlin
SubcomposeAsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = stringResource(R.string.description)
) {
    val state by painter.state.collectAsState()
    if (state is AsyncImagePainter.State.Success) {
        SubcomposeAsyncImageContent()
    } else {
        CircularProgressIndicator()
    }
}
```

!!! Note
    サブコンポジションは通常のコンポジションよりも遅いため、このコンポーザブルはUIのパフォーマンスが重要な部分（例: `LazyList`）には適していない可能性があります。

**この関数を使用する場合：**

`AsyncImagePainter.state` を監視する必要がある場合は、サブコンポジションを使用しないため、この関数よりも `rememberAsyncImagePainter` の使用を一般的に推奨します。

具体的には、`AsyncImagePainter.state` を監視する必要があり、`rememberAsyncImagePainter` のように最初のコンポジションと最初のフレームで `Empty` になることが許容できない場合にのみ、この関数は役立ちます。`SubcomposeAsyncImage` はサブコンポジションを使用して画像の制約を取得するため、`AsyncImagePainter.state` はすぐに最新の状態になります。

## AsyncImagePainter.state の監視

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")
val state by painter.state.collectAsState()

when (state) {
    is AsyncImagePainter.State.Empty,
    is AsyncImagePainter.State.Loading -> {
        CircularProgressIndicator()
    }
    is AsyncImagePainter.State.Success -> {
        Image(
            painter = painter,
            contentDescription = stringResource(R.string.description)
        )
    }
    is AsyncImagePainter.State.Error -> {
        // エラーUIを表示します。
    }
}
```

## トランジション

`ImageRequest.Builder.crossfade` を使用して、組み込みのクロスフェードトランジションを有効にできます。

```kotlin
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
)
```

カスタムの [`Transition`](/coil/api/coil-core/coil3.transition/-transition) は、`View` 参照を必要とするため、`AsyncImage`、`SubcomposeAsyncImage`、または `rememberAsyncImagePainter` とは連携しません。`CrossfadeTransition` は、特別な内部サポートにより機能します。

とはいえ、`AsyncImagePainter.state` を監視することで、Compose でカスタムトランジションを作成することは可能です。

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")

val state by painter.state.collectAsState()
if (state is AsyncImagePainter.State.Success && state.result.dataSource != DataSource.MEMORY_CACHE) {
    // トランジションアニメーションを実行します。
}

Image(
    painter = painter,
    contentDescription = stringResource(R.string.description),
)
```

## プレビュー

`AsyncImage`/`rememberAsyncImagePainter`/`SubcomposeAsyncImage` の Android Studio のプレビュー動作は、`LocalAsyncImagePreviewHandler` によって制御されます。デフォルトでは、プレビュー環境内で通常通りリクエストを実行しようとします。プレビュー環境ではネットワークアクセスが無効になっているため、ネットワークURLは常に失敗します。

以下のようにプレビュー動作をオーバーライドできます。

```kotlin
val previewHandler = AsyncImagePreviewHandler {
    ColorImage(Color.Red.toArgb())
}

CompositionLocalProvider(LocalAsyncImagePreviewHandler provides previewHandler) {
    AsyncImage(
        model = "https://example.com/image.jpg",
        contentDescription = null,
    )
}
```

これは、同じプレビュー環境で実行される [AndroidX の Compose Preview Screenshot Testing ライブラリ](https://developer.android.com/studio/preview/compose-screenshot-testing) にも役立ちます。

## Compose Multiplatform リソース

Coil は、`model` パラメータとして `Res.getUri` を使用することで、[Compose Multiplatform リソース](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-resources.html) のロードをサポートします。例：

```kotlin
AsyncImage(
    model = Res.getUri("drawable/sample.jpg"),
    contentDescription = null,
)
```

!!! Note
    `Res.drawable.image` やその他のコンパイルセーフな参照は Coil ではサポートされていません。代わりに `Res.getUri("drawable/image")` を使用する必要があります。[このissueで更新情報を確認してください](https://github.com/coil-kt/coil/issues/2812)。