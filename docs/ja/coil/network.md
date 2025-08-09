# ネットワーク画像

デフォルトでは、Coil 3.x はネットワークからの画像読み込みをサポートしていません。これは、独自のネットワーキングソリューションを使用したいユーザーや、ネットワークURLのサポートを必要としないユーザー（例えば、ディスクからのみ画像を読み込む場合）に、大きなネットワーキング依存関係を強制することを避けるためです。

ネットワークから画像をフェッチするサポートを追加するには、**以下のいずれか1つのみ**をインポートしてください:

```kotlin
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0") // Only available on Android/JVM.
implementation("io.coil-kt.coil3:coil-network-ktor2:3.3.0")
implementation("io.coil-kt.coil3:coil-network-ktor3:3.3.0")
```

OkHttp を使用する場合、これだけです。インポートすると、`https://example.com/image.jpg` のようなネットワークURLは自動的にサポートされます。Ktor を使用する場合は、プラットフォームごとにサポートされているエンジンを追加する必要があります（下記参照）。

## Ktor ネットワークエンジン

`coil-network-ktor2` または `coil-network-ktor3` に依存する場合、各プラットフォーム（JavaScriptを除く）向けに [Ktor エンジン](https://ktor.io/docs/client-engines.html) をインポートする必要があります。以下にエンジンのクイックスタートセットを示します:

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

カスタムのネットワーキングライブラリを使用したい場合、`io.coil-kt.coil3:coil-network-core` をインポートし、`NetworkClient` を実装し、`ImageLoader` 内でカスタムの `NetworkClient` を使って `NetworkFetcher` を登録することができます。

## カスタム OkHttpClient の使用

`io.coil-kt.coil3:coil-network-okhttp` を使用する場合、`ImageLoader` を作成する際にカスタムの `OkHttpClient` を指定できます:

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

!!! 注
    既にビルド済みの `OkHttpClient` がある場合、元のクライアントとリソースを共有する新しいクライアントをビルドするには、[`newBuilder()`](https://square.github.io/okhttp/5.x/okhttp/okhttp3/-ok-http-client/#customize-your-client-with-newbuilder) を使用してください。

## Cache-Control のサポート

デフォルトでは、Coil 3.x は `Cache-Control` ヘッダーを尊重せず、常にレスポンスをディスクキャッシュに保存します。

`io.coil-kt.coil3:coil-network-cache-control` には、`CacheStrategy` の実装が含まれており、これにより、`NetworkFetcher` がネットワークレスポンスの [`Cache-Control` ヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) を尊重するようになります。

`CacheControlCacheStrategy` を `NetworkFetcher` に渡してから、カスタムの `NetworkFetcher` を `ImageLoader` に登録してください:

```kotlin
OkHttpNetworkFetcherFactory(
    cacheStrategy = { CacheControlCacheStrategy() },
)
```

!!! 注
    Android API レベル 25 以下をサポートするには、`coreLibraryDesugaring` を有効にする必要があります。有効にするには、[こちらのドキュメント](https://developer.android.com/studio/write/java8-support#library-desugaring) に従ってください。

#### ヘッダー

ヘッダーは、画像リクエストに以下の2つの方法のいずれかで追加できます。単一のリクエストに対してヘッダーを設定できます:

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

または、OkHttp [`Interceptor`](https://square.github.io/okhttp/interceptors/) を作成して、`ImageLoader` が実行するすべてのリクエストにヘッダーを設定できます:

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