# 网络图片

默认情况下，Coil 3.x 不支持从网络加载图片。这是为了避免强制那些希望使用自己网络解决方案或不需要网络 URL 支持（例如，仅从磁盘加载图片）的用户引入大型网络依赖。

要添加从网络获取图片的支持，请**仅导入以下其中一个**：

```kotlin
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0") // Only available on Android/JVM.
implementation("io.coil-kt.coil3:coil-network-ktor2:3.3.0")
implementation("io.coil-kt.coil3:coil-network-ktor3:3.3.0")
```

如果你使用 OkHttp，那么就完成了。导入后，`https://example.com/image.jpg` 等网络 URL 将自动得到支持。如果你使用 Ktor，则需要为每个平台添加受支持的引擎（详见下文）。

## Ktor 网络引擎

如果你依赖 `coil-network-ktor2` 或 `coil-network-ktor3`，你需要为每个平台（JavaScript 除外）导入一个 [Ktor 引擎](https://ktor.io/docs/client-engines.html)。以下是快速入门的引擎集：

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

如果你想使用自定义网络库，可以导入 `io.coil-kt.coil3:coil-network-core`，实现 `NetworkClient` 接口，并在你的 `ImageLoader` 中使用你的自定义 `NetworkClient` 注册 `NetworkFetcher`。

## 使用自定义 OkHttpClient

如果你使用 `io.coil-kt.coil3:coil-network-okhttp`，你可以在创建 `ImageLoader` 时指定一个自定义的 `OkHttpClient`：

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
    如果你已经有一个构建好的 `OkHttpClient`，请使用 [`newBuilder()`](https://square.github.io/okhttp/5.x/okhttp/okhttp3/-ok-http-client/#customize-your-client-with-newbuilder) 来构建一个与原始客户端共享资源的新客户端。

## Cache-Control 支持

默认情况下，Coil 3.x 不遵循 `Cache-Control` 头部，并且总是将响应保存到其磁盘缓存中。

`io.coil-kt.coil3:coil-network-cache-control` 包含一个 `CacheStrategy` 实现，它确保 `NetworkFetcher` 遵循网络响应的 [`Cache-Control` 头部](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)。

将 `CacheControlCacheStrategy` 传递给你的 `NetworkFetcher`，然后在你的 `ImageLoader` 中注册自定义的 `NetworkFetcher`：

```kotlin
OkHttpNetworkFetcherFactory(
    cacheStrategy = { CacheControlCacheStrategy() },
)
```

!!! Note
    你需要启用 `coreLibraryDesugaring` 以支持 Android API 级别 25 或更低版本。请遵循[此处](https://developer.android.com/studio/write/java8-support#library-desugaring)的文档来启用它。

#### 请求头

可以通过两种方式将请求头添加到你的图片请求中。你可以为单个请求设置请求头：

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

或者，你可以创建一个 OkHttp [`Interceptor`](https://square.github.io/okhttp/interceptors/)，为你的 `ImageLoader` 执行的每个请求设置请求头：

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
                        // 此请求头将被添加到每个图片请求中。
                        .addNetworkInterceptor(RequestHeaderInterceptor("Cache-Control", "no-cache"))
                        .build()
                },
            )
        )
    }
    .build()