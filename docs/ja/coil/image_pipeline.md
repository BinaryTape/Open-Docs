# イメージパイプラインの拡張

Android は、[多くの画像フォーマット](https://developer.android.com/guide/topics/media/media-formats#image-formats) を標準でサポートしていますが、サポートしていないフォーマットも多数存在します (例: GIF、SVG、MP4 など)。

幸いなことに、[ImageLoader](image_loaders.md) は、新しいキャッシュレイヤー、新しいデータ型、新しいフェッチ動作、新しい画像エンコーディングを追加したり、ベースの画像読み込み動作を上書きしたりするためのプラグイン可能なコンポーネントをサポートしています。Coil のイメージパイプラインは、以下の順序で実行される5つの主要な部分で構成されています: [Interceptors](/coil/api/coil-core/coil3.intercept/-interceptor)、[Mappers](/coil/api/coil-core/coil3.map/-mapper)、[Keyers](/coil/api/coil-core/coil3.key/-keyer)、[Fetchers](/coil/api/coil-core/coil3.fetch/-fetcher)、そして [Decoders](/coil/api/coil-core/coil3.decode/-decoder)。

カスタムコンポーネントは、[ComponentRegistry](/coil/api/coil-core/coil3/-component-registry) を介して `ImageLoader` を構築する際に追加する必要があります:

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(CustomCacheInterceptor())
        add(ItemMapper())
        add(HttpUrlKeyer())
        add(CronetFetcher.Factory())
        add(GifDecoder.Factory())
    }
    .build()
```

## Interceptors

Interceptors は、`ImageLoader` のイメージエンジンへのリクエストを監視、変換、ショートサーキット、または再試行することを可能にします。例えば、次のようにカスタムキャッシュレイヤーを追加できます:

```kotlin
class CustomCacheInterceptor(
    private val context: Context,
    private val cache: LruCache<String, Image>,
) : Interceptor {

    override suspend fun intercept(chain: Interceptor.Chain): ImageResult {
        val value = cache.get(chain.request.data.toString())
        if (value != null) {
            return SuccessResult(
                image = value.bitmap.toImage(),
                request = chain.request,
                dataSource = DataSource.MEMORY_CACHE,
            )
        }
        return chain.proceed(chain.request)
    }
}
```

Interceptors は、`ImageLoader` のイメージパイプラインをカスタムロジックでラップできる高度な機能です。その設計は、[OkHttp の `Interceptor` インターフェース](https://square.github.io/okhttp/interceptors/#interceptors) に大きく基づいています。

詳細については、[Interceptor](/coil/api/coil-core/coil3.intercept/-interceptor) を参照してください。

## Mappers

Mappers を使用すると、カスタムデータ型へのサポートを追加できます。例えば、サーバーからこのようなモデルを取得するとします:

```kotlin
data class Item(
    val id: Int,
    val imageUrl: String,
    val price: Int,
    val weight: Double
)
```

カスタムマッパーを作成して、それをURLにマッピングできます。このURLはパイプラインの後半で処理されます:

```kotlin
class ItemMapper : Mapper<Item, String> {
    override fun map(data: Item, options: Options) = data.imageUrl
}
```

(上記参照) `ImageLoader` を構築する際にそれを登録した後、`Item` を安全にロードできます:

```kotlin
val request = ImageRequest.Builder(context)
    .data(item)
    .target(imageView)
    .build()
imageLoader.enqueue(request)
```

詳細については、[Mapper](/coil/api/coil-core/coil3.map/-mapper) を参照してください。

## Keyers

Keyers はデータをキャッシュキーの一部に変換します。この値は、このリクエストの出力が `MemoryCache` に書き込まれる際に `MemoryCache.Key.key` として使用されます。

詳細については、[Keyers](/coil/api/coil-core/coil3.key/-keyer) を参照してください。

## Fetchers

Fetchers は、データ (例: URL、URI、File など) を `ImageSource` または `Image` のいずれかに変換します。これらは通常、入力データを `Decoder` によって消費できる形式に変換します。このインターフェースを使用して、カスタムフェッチメカニズム (例: Cronet、カスタムURIスキームなど) のサポートを追加します。

詳細については、[Fetcher](/coil/api/coil-core/coil3.fetch/-fetcher) を参照してください。

!!! Note
    カスタムデータ型を使用する `Fetcher` を追加する場合、それを使用するリクエストの結果がメモリキャッシュ可能であることを保証するために、カスタム `Keyer` も提供する必要があります。例えば、`Fetcher.Factory<MyDataType>` は `Keyer<MyDataType>` を追加する必要があります。

## Decoders

Decoders は `ImageSource` を読み取り、`Image` を返します。このインターフェースを使用して、カスタムファイルフォーマット (例: GIF、SVG、TIFF など) のサポートを追加します。

詳細については、[Decoder](/coil/api/coil-core/coil3.decode/-decoder) を参照してください。

## Chaining components

Coil のイメージローダーコンポーネントの便利な特性は、それらが内部的にチェーンできることです。例えば、ロードされる画像URLを取得するためにネットワークリクエストを実行する必要があるとします。

まず、私たちのフェッチャーのみが処理するカスタムデータ型を作成しましょう:

```kotlin
data class PartialUrl(
    val baseUrl: String,
)
```

次に、画像URLを取得し、内部ネットワークフェッチャーに委譲するカスタム `Fetcher` を作成しましょう:

```kotlin
class PartialUrlFetcher(
    private val callFactory: Call.Factory,
    private val partialUrl: PartialUrl,
    private val options: Options,
    private val imageLoader: ImageLoader,
) : Fetcher {

    override suspend fun fetch(): FetchResult? {
        val request = Request.Builder()
            .url(partialUrl.baseUrl)
            .build()
        val response = callFactory.newCall(request).await()

        // 画像URLを読み取る。
        val imageUrl: String = readImageUrl(response.body)

        // これは内部ネットワークフェッチャーに委譲されます。
        val data = imageLoader.components.map(imageUrl, options)
        val output = imageLoader.components.newFetcher(data, options, imageLoader)
        val (fetcher) = checkNotNull(output) { "no supported fetcher" }
        return fetcher.fetch()
    }

    class Factory(
        private val callFactory: Call.Factory = OkHttpClient(),
    ) : Fetcher.Factory<PartialUrl> {
        override fun create(data: PartialUrl, options: Options, imageLoader: ImageLoader): Fetcher {
            return PartialUrlFetcher(callFactory, data, options, imageLoader)
        }
    }
}
```

最後に、`ComponentRegistry` に `Fetcher` を登録し、`PartialUrl` を `model`/`data` として渡すだけです:

```kotlin
AsyncImage(
    model = PartialUrl("https://example.com/image.jpg"),
    contentDescription = null,
)
```

このパターンは、`Mapper`、`Keyer`、`Decoder` にも同様に適用できます。