# 扩展图像管道

Android [开箱即用](https://developer.android.com/guide/topics/media/media-formats#image-formats)支持多种图像格式，但也有许多它不支持的格式（例如 GIF、SVG、MP4 等）。

幸运的是，[ImageLoader](image_loaders.md) 支持可插拔组件，以添加新的缓存层、新的数据类型、新的获取行为、新的图像编码，或以其他方式覆盖基本的图像加载行为。Coil 的图像管道由以下五个主要部分组成，并按照以下顺序执行：[拦截器 (Interceptors)](/coil/api/coil-core/coil3.intercept/-interceptor)、[映射器 (Mappers)](/coil/api/coil-core/coil3.map/-mapper)、[键控器 (Keyers)](/coil/api/coil-core/coil3.key/-keyer)、[获取器 (Fetchers)](/coil/api/coil-core/coil3.fetch/-fetcher) 和 [解码器 (Decoders)](/coil/api/coil-core/coil3.decode/-decoder)。

自定义组件必须在通过 `ImageLoader` 的 [ComponentRegistry](/coil/api/coil-core/coil3/-component-registry) 构建时添加到其中：

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

## 拦截器 (Interceptors)

拦截器允许您观察、转换、短路或重试对 `ImageLoader` 图像引擎的请求。例如，您可以像这样添加一个自定义缓存层：

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

拦截器是一项高级特性，可让您使用自定义逻辑封装 `ImageLoader` 的图像管道。它们的设计大量借鉴了 [OkHttp 的 `Interceptor` 接口](https://square.github.io/okhttp/interceptors/#interceptors)。

有关更多信息，请参阅 [Interceptor](/coil/api/coil-core/coil3.intercept/-interceptor)。

## 映射器 (Mappers)

映射器允许您添加对自定义数据类型的支持。例如，假设我们从服务器获取以下模型：

```kotlin
data class Item(
    val id: Int,
    val imageUrl: String,
    val price: Int,
    val weight: Double
)
```

我们可以编写一个自定义映射器将其映射到其 URL，这将在管道后续阶段处理：

```kotlin
class ItemMapper : Mapper<Item, String> {
    override fun map(data: Item, options: Options) = data.imageUrl
}
```

在构建 `ImageLoader` 时注册它（如上所示）后，我们可以安全地加载一个 `Item`：

```kotlin
val request = ImageRequest.Builder(context)
    .data(item)
    .target(imageView)
    .build()
imageLoader.enqueue(request)
```

有关更多信息，请参阅 [Mapper](/coil/api/coil-core/coil3.map/-mapper)。

## 键控器 (Keyers)

键控器将数据转换为缓存键的一部分。当/如果此请求的输出写入 `MemoryCache` 时，此值将用作 `MemoryCache.Key.key`。

有关更多信息，请参阅 [Keyers](/coil/api/coil-core/coil3.key/-keyer)。

## 获取器 (Fetchers)

获取器将数据（例如 URL、URI、File 等）转换为 `ImageSource` 或 `Image`。它们通常将输入数据转换为 `Decoder` 可以使用的格式。使用此接口可添加对自定义获取机制（例如 Cronet、自定义 URI 方案等）的支持。

有关更多信息，请参阅 [Fetcher](/coil/api/coil-core/coil3.fetch/-fetcher)。

!!! Note
    如果您添加了一个使用自定义数据类型的 `Fetcher`，您还需要提供一个自定义 `Keyer`，以确保使用该请求的结果可以被内存缓存。例如，`Fetcher.Factory<MyDataType>` 将需要添加一个 `Keyer<MyDataType`。

## 解码器 (Decoders)

解码器读取 `ImageSource` 并返回一个 `Image`。使用此接口可添加对自定义文件格式（例如 GIF、SVG、TIFF 等）的支持。

有关更多信息，请参阅 [Decoder](/coil/api/coil-core/coil3.decode/-decoder)。

## 自定义 ImageLoader 和 ImageRequest 属性

Coil 支持通过 `Extras` 向 `ImageRequest` 和 `ImageLoader` 附加自定义数据。`Extras` 是额外属性的映射，通过 `Extras.Key` 引用。

例如，假设我们想为每个 `ImageRequest` 支持一个自定义超时。我们可以像这样为其添加自定义扩展函数：

```kotlin
fun ImageRequest.Builder.timeout(timeout: Duration) = apply {
    extras[timeoutKey] = timeout
}

fun ImageLoader.Builder.timeout(timeout: Duration) = apply {
    extras[timeoutKey] = timeout
}

val ImageRequest.timeout: Duration
    get() = getExtra(timeoutKey)

val Options.timeout: Duration
    get() = getExtra(timeoutKey)

// 注意：Extras.Key 实例应静态声明，因为它们通过实例相等性进行比较。
private val timeoutKey = Extras.Key(default = Duration.INFINITE)
```

然后我们可以在将在 `ImageLoader` 中注册的自定义 `Interceptor` 内部读取该属性：

```kotlin
class TimeoutInterceptor : Interceptor {
    override suspend fun intercept(chain: Interceptor.Chain): ImageResult {
        val timeout = chain.request.timeout
        if (timeout.isFinite()) {
            return withTimeout(timeout) {
                chain.proceed(chain.request)
            }
        } else {
            return chain.proceed(chain.request)
        }
    }
}
```

最后，我们可以在创建 `ImageRequest` 时设置该属性：

```kotlin
AsyncImage(
    model = ImageRequest.Builder(PlatformContext.current)
        .data("https://example.com/image.jpg")
        .timeout(10.seconds)
        .build(),
    contentDescription = null,
)
```

此外：

- 我们可以通过我们定义的 `ImageLoader.Builder.timeout` 扩展函数设置默认超时值。
- 我们可以通过我们定义的 `Options.timeout` 扩展函数在 `Mapper`、`Fetcher` 和 `Decoder` 内部读取超时。

[Coil 本身就使用此模式](https://github.com/coil-kt/coil/blob/main/coil-gif/src/main/java/coil3/gif/imageRequests.kt) 来支持 `coil-gif` 以及其他扩展库中 GIF 的自定义请求属性。

## 链式组件

Coil 图像加载器组件的一个有用特性是它们可以在内部进行链式调用。例如，假设您需要执行网络请求以获取将要加载的图像 URL。

首先，让我们创建一个只有我们的获取器会处理的自定义数据类型：

```kotlin
data class PartialUrl(
    val baseUrl: String,
)
```

然后，让我们创建自定义 `Fetcher`，它将获取图像 URL 并委托给内部网络获取器：

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

        // 读取图像 URL。
        val imageUrl: String = readImageUrl(response.body)

        // 这将委托给内部网络获取器。
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

最后，我们只需在 `ComponentRegistry` 中注册 `Fetcher`，并将 `PartialUrl` 作为我们的 `model`/`data` 传递：

```kotlin
AsyncImage(
    model = PartialUrl("https://example.com/image.jpg"),
    contentDescription = null,
)
```

这种模式同样适用于 `Mapper`、`Keyer` 和 `Decoder`。