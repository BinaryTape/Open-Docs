# 네트워크 이미지

`Coil 3.x`는 기본적으로 네트워크에서 이미지를 로드하는 기능을 지원하지 않습니다. 이는 자체 네트워킹 솔루션을 사용하거나 네트워크 URL 지원이 필요 없는 사용자(예: 디스크에서만 이미지를 로드하는 경우)에게 큰 네트워킹 의존성을 강제하는 것을 피하기 위함입니다.

네트워크에서 이미지를 가져오는 지원을 추가하려면 **다음 중 하나만** 임포트(import)하세요.

```kotlin
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0") // Only available on Android/JVM.
implementation("io.coil-kt.coil3:coil-network-ktor2:3.3.0")
implementation("io.coil-kt.coil3:coil-network-ktor3:3.3.0")
```

`OkHttp`를 사용한다면 이것으로 끝입니다. 일단 임포트되면 `https://example.com/image.jpg`와 같은 네트워크 URL이 자동으로 지원됩니다. `Ktor`를 사용한다면 각 플랫폼에 대해 지원되는 엔진을 추가해야 합니다(아래 참조).

## Ktor 네트워크 엔진

`coil-network-ktor2` 또는 `coil-network-ktor3`에 의존하는 경우 각 플랫폼(자바스크립트 제외)에 대해 [Ktor 엔진](https://ktor.io/docs/client-engines.html)을 임포트해야 합니다. 다음은 빠른 시작을 위한 엔진 설정입니다.

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

사용자 정의 네트워킹 라이브러리를 사용하려면 `io.coil-kt.coil3:coil-network-core`를 임포트하고, `NetworkClient`를 구현한 다음, `ImageLoader`에서 사용자 정의 `NetworkClient`를 사용하여 `NetworkFetcher`를 등록할 수 있습니다.

## 사용자 정의 OkHttpClient 사용하기

`io.coil-kt.coil3:coil-network-okhttp`를 사용하는 경우 `ImageLoader`를 생성할 때 사용자 정의 `OkHttpClient`를 지정할 수 있습니다.

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

!!! 참고
    이미 빌드된 `OkHttpClient`가 있다면 [`newBuilder()`](https://square.github.io/okhttp/5.x/okhttp/okhttp3/-ok-http-client/#customize-your-client-with-newbuilder)를 사용하여 원본과 리소스를 공유하는 새 클라이언트를 빌드하세요.

## Cache-Control 지원

`Coil 3.x`는 기본적으로 `Cache-Control` 헤더를 존중하지 않으며 항상 응답을 디스크 캐시에 저장합니다.

`io.coil-kt.coil3:coil-network-cache-control`에는 `NetworkFetcher`가 네트워크 응답의 [`Cache-Control` 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)를 준수하도록 보장하는 `CacheStrategy` 구현이 포함되어 있습니다.

`NetworkFetcher`에 `CacheControlCacheStrategy`를 전달한 다음 `ImageLoader`에 사용자 정의 `NetworkFetcher`를 등록하세요.

```kotlin
OkHttpNetworkFetcherFactory(
    cacheStrategy = { CacheControlCacheStrategy() },
)
```

!!! 참고
    Android API 레벨 25 이하를 지원하려면 `coreLibraryDesugaring`을 활성화해야 합니다. [여기](https://developer.android.com/studio/write/java8-support#library-desugaring) 문서를 따라 활성화하세요.

#### 헤더

이미지를 요청할 때 헤더를 추가하는 두 가지 방법이 있습니다. 단일 요청에 대해 헤더를 설정할 수 있습니다.

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

또는 `ImageLoader`에 의해 실행되는 모든 요청에 대해 헤더를 설정하는 OkHttp [`Interceptor`](https://square.github.io/okhttp/interceptors/)를 생성할 수 있습니다.

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
                        // 이 헤더는 모든 이미지 요청에 추가됩니다.
                        .addNetworkInterceptor(RequestHeaderInterceptor("Cache-Control", "no-cache"))
                        .build()
                },
            )
        )
    }
    .build()