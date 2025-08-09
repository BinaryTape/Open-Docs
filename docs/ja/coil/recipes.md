# レシピ集

このページでは、Coilを使用する際の一般的なユースケースを処理する方法についてガイダンスを提供します。これらのコードは、特定の要件に合わせて修正する必要があるかもしれませんが、解決のヒントになるはずです。

カバーされていない一般的なユースケースが見つかりましたか？新しいセクションを追加するプルリクエストを遠慮なく送信してください。

## Palette

[Palette](https://developer.android.com/training/material/palette-colors?hl=en) を使用すると、画像から主要な色を抽出できます。`Palette` を作成するには、画像の `Bitmap` にアクセスする必要があります。これにはいくつかの方法があります。

`ImageRequest.Listener` を設定し、`ImageRequest` をキューに入れることで、画像のビットマップにアクセスできます。

```kotlin
imageView.load("https://example.com/image.jpg") {
    // Disable hardware bitmaps as Palette needs to read the image's pixels.
    allowHardware(false)
    listener(
        onSuccess = { _, result ->
            // Create the palette on a background thread.
            Palette.Builder(result.drawable.toBitmap()).generate { palette ->
                // Consume the palette.
            }
        }
    )
}
```

## メモリキャッシュキーをプレースホルダーとして使用する

前のリクエストの `MemoryCache.Key` を後続のリクエストのプレースホルダーとして使用すると、2つの画像が同じでも異なるサイズで読み込まれる場合に役立ちます。たとえば、最初のリクエストで画像が100x100で読み込まれ、2番目のリクエストで画像が500x500で読み込まれる場合、最初のリクエストの画像を2番目のリクエストの同期プレースホルダーとして使用できます。

サンプルアプリでのこの効果は次のとおりです。

<p style="text-align: center;">
    <video width="360" height="640" autoplay loop muted playsinline>
        <source src="../images/crossfade.mp4" type="video/mp4">
    </video>
</p>

*リスト内の画像は意図的に非常に低い解像度で読み込まれており、視覚効果を強調するためにクロスフェードが遅くなっています。*

この効果を実現するには、最初のリクエストの `MemoryCache.Key` を2番目のリクエストの `ImageRequest.placeholderMemoryCacheKey` として使用します。例を示します。

```kotlin
// First request
listImageView.load("https://example.com/image.jpg")

// Second request (once the first request finishes)
detailImageView.load("https://example.com/image.jpg") {
    placeholderMemoryCacheKey(listImageView.result.memoryCacheKey)
}
```

## 共有要素遷移 (Shared Element Transitions)

[Shared element transitions](https://developer.android.com/training/transitions/start-activity) を使用すると、`Activity` と `Fragment` 間でアニメーションできます。Coilでこれらを機能させるための推奨事項をいくつか示します。

- **Shared element transitions はハードウェアビットマップと互換性がありません。** アニメーション元とアニメーション先の両方の `ImageView` でハードウェアビットマップを無効にするには、`allowHardware(false)` を設定する必要があります。設定しない場合、遷移時に `java.lang.IllegalArgumentException: Software rendering doesn't support hardware bitmaps` 例外がスローされます。

- 開始画像の `MemoryCache.Key` を終了画像の [`placeholderMemoryCacheKey`](/coil/api/coil-core/coil3.request/-image-request/-builder/placeholder-memory-cache-key) として使用します。これにより、開始画像が終了画像のプレースホルダーとして使用され、画像がメモリキャッシュにある場合に白い点滅なしでスムーズな遷移が実現します。

- 最適な結果を得るには、[`ChangeImageTransform`](https://developer.android.com/reference/android/transition/ChangeImageTransform) と [`ChangeBounds`](https://developer.android.com/reference/android/transition/ChangeBounds) を組み合わせて使用します。

Composeを使用していますか？[`AsyncImage` で共有要素遷移を実行する方法については、こちらの記事をご覧ください](https://www.tunjid.com/articles/animating-contentscale-during-image-shared-element-transitions-65fba03537c67f8df0161c31)。

## Remote Views

Coilは、[`RemoteViews`](https://developer.android.com/reference/android/widget/RemoteViews) 用の `Target` をそのままでは提供していませんが、次のように作成できます。

```kotlin
class RemoteViewsTarget(
    private val context: Context,
    private val componentName: ComponentName,
    private val remoteViews: RemoteViews,
    @IdRes private val imageViewResId: Int
) : Target {

    override fun onStart(placeholder: Image?) = setDrawable(placeholder)

    override fun onError(error: Image?) = setDrawable(error)

    override fun onSuccess(result: Image) = setDrawable(result)

    private fun setDrawable(image: Image?) {
        remoteViews.setImageViewBitmap(imageViewResId, image?.toBitmap())
        AppWidgetManager.getInstance(context).updateAppWidget(componentName, remoteViews)
    }
}
```

次に、通常通りリクエストをキューに入れる/実行します。

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .target(RemoteViewsTarget(context, componentName, remoteViews, imageViewResId))
    .build()
imageLoader.enqueue(request)
```

## Painter の変換

`AsyncImage` と `AsyncImagePainter` の両方には、`Painter` を受け入れる `placeholder`/`error`/`fallback` 引数があります。Painterはcomposableを使用するよりも柔軟性が劣りますが、Coilがサブコンポジションを使用する必要がないため高速です。とはいえ、目的のUIを得るために、painterをインセット、ストレッチ、色付け、または変換する必要があるかもしれません。これを行うには、[このGistをプロジェクトにコピー](https://gist.github.com/colinrtwhite/c2966e0b8584b4cdf0a5b05786b20ae1)して、次のようにpainterをラップします。

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
    placeholder = forwardingPainter(
        painter = painterResource(R.drawable.placeholder),
        colorFilter = ColorFilter(Color.Red),
        alpha = 0.5f,
    ),
)
```

`onDraw` は末尾ラムダを使用して上書きできます。

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
    placeholder = forwardingPainter(painterResource(R.drawable.placeholder)) { info ->
        inset(50f, 50f) {
            with(info.painter) {
                draw(size, info.alpha, info.colorFilter)
            }
        }
    },
)
```

## リクエストの変換

画像を取得するために使用されるHTTPリクエストを変換する必要がある場合があります。この例では、[Interceptor](https://coil-kt.github.io/coil/api/coil-core/coil3.intercept/-interceptor) を使用して、`width` と `height` クエリパラメータをリクエストURLに追加します。

```kotlin
class UrlSizeInterceptor : Interceptor {

    override suspend fun intercept(chain: Chain): ImageResult {
        val request = chain.request
        val uri = request.uri

        if (uri == null || uri.scheme !in setOf("https", "http")) {
            // Ignore non-HTTP requests.
            return chain.proceed()
        }

        val (width, height) = chain.size
        return if (width is Pixels && height is Pixels) {
            val transformUri = uri.newBuilder()
                .query("width=${width.px}&height=${height.px}")
                .build()

            val transformedRequest = request.newBuilder()
                .data(transformUri)
                .build()
            return chain.withRequest(transformedRequest).proceed()
        } else {
            // Width & height aren't available, i.e. because of infinite constraints.
            chain.proceed()
        }
    }

    private val ImageRequest.uri: Uri?
        get() = when (val data = data) {
            is Uri -> data
            is coil3.Uri -> data.toAndroidUri()
            is String -> data.toUri()
            else -> null
        }
}
```

`ImageLoader` にインターセプターを追加登録するのを忘れないでください！

```kotlin
ImageLoader.Builder(context)
    .components {
        add(FastlyCoilInterceptor())
    }
    .build()