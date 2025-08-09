# 擴展影像管線

Android 開箱即用即支援多種[影像格式](https://developer.android.com/guide/topics/media/media-formats#image-formats)，然而它也有許多不支援的格式（例如：GIF、SVG、MP4 等）。

幸運的是，[影像載入器 (ImageLoader)](image_loaders.md) 支援可插拔元件 (pluggable components)，以新增快取層、資料型別、抓取行為、影像編碼，或以其他方式覆寫基本影像載入行為。Coil 的影像管線由五個主要部分組成，它們依以下順序執行：[攔截器 (Interceptor)](/coil/api/coil-core/coil3.intercept/-interceptor)、[對映器 (Mapper)](/coil/api/coil-core/coil3.map/-mapper)、[鍵值產生器 (Keyer)](/coil/api/coil-core/coil3.key/-keyer)、[抓取器 (Fetcher)](/coil/api/coil-core/coil3.fetch/-fetcher) 和 [解碼器 (Decoder)](/coil/api/coil-core/coil3.decode/-decoder)。

在透過其 [元件註冊表 (ComponentRegistry)](/coil/api/coil-core/coil3/-component-registry) 建構 `ImageLoader` 時，必須將自訂元件新增至其中：

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

## 攔截器 (Interceptors)

攔截器 (Interceptors) 允許您觀察、轉換、短路或重試 `ImageLoader` 影像引擎的請求。例如，您可以這樣新增一個自訂快取層：

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

攔截器是一項進階功能，可讓您使用自訂邏輯來封裝 `ImageLoader` 的影像管線。它們的設計大量基於 [OkHttp 的 `Interceptor` 介面](https://square.github.io/okhttp/interceptors/#interceptors)。

詳情請參閱 [Interceptor](/coil/api/coil-core/coil3.intercept/-interceptor)。

## 對映器 (Mappers)

對映器 (Mappers) 允許您新增對自訂資料型別的支援。例如，假設我們從伺服器取得以下模型：

```kotlin
data class Item(
    val id: Int,
    val imageUrl: String,
    val price: Int,
    val weight: Double
)
```

我們可以編寫一個自訂對映器，將其對映到其 URL，這將在管線後續處理：

```kotlin
class ItemMapper : Mapper<Item, String> {
    override fun map(data: Item, options: Options) = data.imageUrl
}
```

在建構我們的 `ImageLoader` 時註冊它（見上文）之後，我們就可以安全地載入一個 `Item`：

```kotlin
val request = ImageRequest.Builder(context)
    .data(item)
    .target(imageView)
    .build()
imageLoader.enqueue(request)
```

詳情請參閱 [Mapper](/coil/api/coil-core/coil3.map/-mapper)。

## 鍵值產生器 (Keyers)

鍵值產生器 (Keyers) 將資料轉換為快取鍵的一部分。當此請求的輸出被寫入到 [記憶體快取 (MemoryCache)](/coil/api/coil-core/coil3.memory/-memory-cache) 時，此值將用作 `MemoryCache.Key.key`。

詳情請參閱 [Keyers](/coil/api/coil-core/coil3.key/-keyer)。

## 抓取器 (Fetchers)

抓取器 (Fetchers) 將資料（例如 URL、URI、檔案等）轉換為 [影像來源 (ImageSource)](/coil/api/coil-core/coil3.request/-image-source) 或 [影像 (Image)](/coil/api/coil-core/coil3.drawable/-image)。它們通常將輸入資料轉換為可由 `Decoder` 消耗的格式。使用此介面來新增對自訂抓取機制（例如 Cronet、自訂 URI 方案等）的支援。

詳情請參閱 [Fetcher](/coil/api/coil-core/coil3.fetch/-fetcher)。

!!! 注意
    如果您新增一個使用自訂資料型別的 `Fetcher`，您也需要提供一個自訂的 `Keyer`，以確保使用它的請求結果可以記憶體快取。例如，`Fetcher.Factory<MyDataType>` 將需要新增一個 `Keyer<MyDataType`。

## 解碼器 (Decoders)

解碼器 (Decoders) 讀取一個 `ImageSource` 並傳回一個 `Image`。使用此介面來新增對自訂檔案格式（例如 GIF、SVG、TIFF 等）的支援。

詳情請參閱 [Decoder](/coil/api/coil-core/coil3.decode/-decoder)。

## 連結元件

Coil 影像載入器元件的一個有用特性是它們可以在內部連結。例如，假設您需要執行網路請求以取得將載入的影像 URL。

首先，讓我們建立一個只有我們的抓取器將處理的自訂資料型別：

```kotlin
data class PartialUrl(
    val baseUrl: String,
)
```

然後讓我們建立我們的自訂 `Fetcher`，它將取得影像 URL 並委託給內部網路抓取器：

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

        // Read the image URL.
        val imageUrl: String = readImageUrl(response.body)

        // This will delegate to the internal network fetcher.
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

最後，我們只需在我們的 `ComponentRegistry` 中註冊 `Fetcher`，並將 `PartialUrl` 作為我們的 `model`/`data` 傳遞：

```kotlin
AsyncImage(
    model = PartialUrl("https://example.com/image.jpg"),
    contentDescription = null,
)
```

這種模式同樣可以應用於 `Mapper`、`Keyer` 和 `Decoder`。