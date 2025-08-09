# 이미지 파이프라인 확장하기

안드로이드는 기본적으로 많은 [이미지 형식](https://developer.android.com/guide/topics/media/media-formats#image-formats)을 지원하지만, GIF, SVG, MP4 등 지원하지 않는 형식도 많습니다.

다행히도, [ImageLoader](image_loaders.md)는 새로운 캐시 계층, 새로운 데이터 타입, 새로운 가져오기 동작, 새로운 이미지 인코딩을 추가하거나 기본 이미지 로딩 동작을 덮어쓸 수 있는 플러그인 컴포넌트를 지원합니다. Coil의 이미지 파이프라인은 다음 순서로 실행되는 다섯 가지 주요 부분으로 구성됩니다: [Interceptor](/coil/api/coil-core/coil3.intercept/-interceptor), [Mapper](/coil/api/coil-core/coil3.map/-mapper), [Keyer](/coil/api/coil-core/coil3.key/-keyer), [Fetcher](/coil/api/coil-core/coil3.fetch/-fetcher), 그리고 [Decoder](/coil/api/coil-core/coil3.decode/-decoder).

커스텀 컴포넌트는 `ImageLoader`를 [ComponentRegistry](/coil/api/coil-core/coil3/-component-registry)를 통해 생성할 때 추가해야 합니다:

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

## 인터셉터

인터셉터는 `ImageLoader`의 이미지 엔진에 대한 요청을 관찰하고, 변환하고, 단락(short circuit)시키거나, 재시도할 수 있도록 합니다. 예를 들어, 다음과 같이 커스텀 캐시 계층을 추가할 수 있습니다:

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

인터셉터는 `ImageLoader`의 이미지 파이프라인을 커스텀 로직으로 래핑할 수 있게 해주는 고급 기능입니다. 이들의 디자인은 [OkHttp의 `Interceptor` 인터페이스](https://square.github.io/okhttp/interceptors/#interceptors)에 크게 기반을 두고 있습니다.

자세한 내용은 [Interceptor](/coil/api/coil-core/coil3.intercept/-interceptor)를 참조하세요.

## 매퍼

매퍼는 커스텀 데이터 타입에 대한 지원을 추가할 수 있도록 합니다. 예를 들어, 서버로부터 다음과 같은 모델을 받는다고 가정해 봅시다:

```kotlin
data class Item(
    val id: Int,
    val imageUrl: String,
    val price: Int,
    val weight: Double
)
```

우리는 이를 URL로 매핑하는 커스텀 매퍼를 작성할 수 있으며, 이 URL은 파이프라인에서 나중에 처리될 것입니다:

```kotlin
class ItemMapper : Mapper<Item, String> {
    override fun map(data: Item, options: Options) = data.imageUrl
}
```

`ImageLoader`를 빌드할 때 이를 등록한 후 (위 참조), 우리는 `Item`을 안전하게 로드할 수 있습니다:

```kotlin
val request = ImageRequest.Builder(context)
    .data(item)
    .target(imageView)
    .build()
imageLoader.enqueue(request)
```

자세한 내용은 [Mapper](/coil/api/coil-core/coil3.map/-mapper)를 참조하세요.

## 키어

키어는 데이터를 캐시 키의 일부로 변환합니다. 이 값은 이 요청의 출력이 `MemoryCache`에 기록될 때 `MemoryCache.Key.key`로 사용됩니다.

자세한 내용은 [Keyer](/coil/api/coil-core/coil3.key/-keyer)를 참조하세요.

## 페처

페처는 데이터(예: URL, URI, File 등)를 `ImageSource` 또는 `Image`로 변환합니다. 페처는 일반적으로 입력 데이터를 `Decoder`가 사용할 수 있는 형식으로 변환합니다. 이 인터페이스를 사용하여 커스텀 가져오기 메커니즘(예: Cronet, 커스텀 URI 스키마 등)에 대한 지원을 추가하세요.

자세한 내용은 [Fetcher](/coil/api/coil-core/coil3.fetch/-fetcher)를 참조하세요.

!!! Note
    커스텀 데이터 타입을 사용하는 `Fetcher`를 추가하는 경우, 해당 `Fetcher`를 사용하는 요청의 결과가 메모리 캐시 가능하도록 커스텀 `Keyer`도 제공해야 합니다. 예를 들어, `Fetcher.Factory<MyDataType>`는 `Keyer<MyDataType`를 추가해야 합니다.

## 디코더

디코더는 `ImageSource`를 읽고 `Image`를 반환합니다. 이 인터페이스를 사용하여 커스텀 파일 형식(예: GIF, SVG, TIFF 등)에 대한 지원을 추가하세요.

자세한 내용은 [Decoder](/coil/api/coil-core/coil3.decode/-decoder)를 참조하세요.

## 컴포넌트 연결

Coil의 이미지 로더 컴포넌트의 유용한 속성 중 하나는 내부적으로 연결될 수 있다는 것입니다. 예를 들어, 로드될 이미지 URL을 얻기 위해 네트워크 요청을 수행해야 한다고 가정해 봅시다.

먼저, 우리의 페처만 처리할 커스텀 데이터 타입을 생성해 봅시다:

```kotlin
data class PartialUrl(
    val baseUrl: String,
)
```

다음으로, 이미지 URL을 가져와 내부 네트워크 페처에 위임할 커스텀 `Fetcher`를 생성해 봅시다:

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

        // 이미지 URL을 읽습니다.
        val imageUrl: String = readImageUrl(response.body)

        // 이는 내부 네트워크 페처에 위임합니다.
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

마지막으로, `ComponentRegistry`에 `Fetcher`를 등록하고 `PartialUrl`을 `model`/`data`로 전달하기만 하면 됩니다:

```kotlin
AsyncImage(
    model = PartialUrl("https://example.com/image.jpg"),
    contentDescription = null,
)
```

이 패턴은 `Mapper`, `Keyer`, 그리고 `Decoder`에도 유사하게 적용될 수 있습니다.