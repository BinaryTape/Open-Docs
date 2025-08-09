# 網路圖片

預設情況下，Coil 3.x 不包含從網路載入圖片的支援。這是為了避免對那些希望使用自己網路解決方案，或不需要網路 URL 支援（例如：只從磁碟載入圖片）的使用者，強行引入一個大型網路依賴。

若要新增從網路擷取圖片的支援，請**只匯入以下其中一個**：

```kotlin
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0") // Only available on Android/JVM.
implementation("io.coil-kt.coil3:coil-network-ktor2:3.3.0")
implementation("io.coil-kt.coil3:coil-network-ktor3:3.3.0")
```

如果你使用 OkHttp，這樣就完成了。一旦匯入，像 `https://example.com/image.jpg` 這樣的網路 URL 將會自動被支援。如果你使用 Ktor，你需要為每個平台新增支援的引擎（請參閱下方）。

## Ktor 網路引擎

如果你依賴 `coil-network-ktor2` 或 `coil-network-ktor3`，你需要為每個平台（Javascript 除外）匯入一個 [Ktor 引擎](https://ktor.io/docs/client-engines.html)。以下是一組快速入門引擎：

```kotlin
androidMain {
    dependencies {
        implementation("io.ktor:ktor-client-android:<ktor-version>")
    }
}
appleMain {
    dependencies {
        implementation("io.ktor:ktor-client-darwin:<ktor-version>")
    }
}
jvmMain {
    dependencies {
        implementation("io.ktor:ktor-client-java:<ktor-version>")
    }
}
```

如果你想使用自訂網路函式庫，你可以匯入 `io.coil-kt.coil3:coil-network-core`，實作 `NetworkClient`，並在你的 `ImageLoader` 中將 `NetworkFetcher` 與你的自訂 `NetworkClient` 註冊。

## 使用自訂 OkHttpClient

如果你使用 `io.coil-kt.coil3:coil-network-okhttp`，你可以在建立 `ImageLoader` 時指定一個自訂的 `OkHttpClient`：

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(
            OkHttpNetworkFetcherFactory(
                callFactory = {
                    OkHttpClient()
                }
            )
        )
    }
    .build()
```

!!! Note
    如果你已經有一個建置好的 `OkHttpClient`，請使用 [`newBuilder()`](https://square.github.io/okhttp/5.x/okhttp/okhttp3/-ok-http-client/#customize-your-client-with-newbuilder) 來建置一個與原始客戶端共用資源的新客戶端。

## Cache-Control 支援

預設情況下，Coil 3.x 不會遵循 `Cache-Control` 標頭，並總是將回應儲存到其磁碟快取中。

`io.coil-kt.coil3:coil-network-cache-control` 包含一個 `CacheStrategy` 實作，它確保 `NetworkFetcher` 遵循網路回應的 [`Cache-Control` 標頭](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)。

將 `CacheControlCacheStrategy` 傳遞給你的 `NetworkFetcher`，然後在你的 `ImageLoader` 中註冊自訂的 `NetworkFetcher`：

```kotlin
OkHttpNetworkFetcherFactory(
    cacheStrategy = { CacheControlCacheStrategy() },
)
```

!!! Note
    你需要啟用 `coreLibraryDesugaring` 以支援 Android API 等級 25 或以下。請依照[此處](https://developer.android.com/studio/write/java8-support#library-desugaring)的文件說明來啟用它。

#### 標頭

標頭可以透過兩種方式新增到你的圖片請求中。你可以為單一請求設定標頭：

```kotlin
val headers = NetworkHeaders.Builder()
    .set("Cache-Control", "no-cache")
    .build()
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .httpHeaders(headers)
    .target(imageView)
    .build()
imageLoader.execute(request)
```

或者你可以建立一個 OkHttp [`Interceptor`](https://square.github.io/okhttp/interceptors/)，為你的 `ImageLoader` 執行的每個請求設定標頭：

```kotlin
class RequestHeaderInterceptor(
    private val name: String,
    private val value: String,
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val headers = Headers.Builder()
            .set("Cache-Control", "no-cache")
            .build()
        val request = chain.request().newBuilder()
            .headers(headers)
            .build()
        return chain.proceed(request)
    }
}

val imageLoader = ImageLoader.Builder(context)
    .components {
        add(
            OkHttpNetworkFetcher(
                callFactory = {
                    OkHttpClient.Builder()
                        // This header will be added to every image request.
                        .addNetworkInterceptor(RequestHeaderInterceptor("Cache-Control", "no-cache"))
                        .build()
                },
            )
        )
    }
    .build()