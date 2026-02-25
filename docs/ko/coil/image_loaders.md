# 이미지 로더 (Image Loaders)

`ImageLoader`는 [`ImageRequest`](image_requests.md)를 실행하는 [서비스 객체(service objects)](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)입니다. 캐싱, 데이터 가져오기(data fetching), 이미지 디코딩, 요청 관리, 메모리 관리 등을 처리합니다.

Coil은 단일 `ImageLoader`를 생성하여 앱 전체에서 공유할 때 가장 효율적으로 작동합니다. 이는 각 `ImageLoader`가 자체적인 메모리 캐시, 디스크 캐시 및 `OkHttpClient`를 갖기 때문입니다.

## 싱글톤 (Singleton)

기본 `io.coil-kt.coil3:coil` 아티팩트에는 싱글톤 `ImageLoader`가 포함되어 있습니다. Coil은 이 `ImageLoader`를 지연(lazily) 생성합니다. 이는 다음과 같은 여러 가지 방법으로 설정할 수 있습니다:

```kotlin
// setSafe 메서드는 이미 생성된 기존 이미지 로더를 
// 덮어쓰지 않도록 보장합니다.
SingletonImageLoader.setSafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// Compose Multiplatform 앱에서 유용하게 사용할 수 있는 
// SingletonImageLoader.setSafe의 별칭(alias)입니다.
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// 테스트에서만 사용해야 합니다. 이 메서드를 여러 번 호출하면 
// 여러 개의 이미지 로더가 생성됩니다.
SingletonImageLoader.setUnsafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// Android에서는 Application 클래스에서 SingletonImageLoader.Factory를 
// 구현하여 싱글톤 이미지 로더를 생성하도록 할 수 있습니다.
class CustomApplication : SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

**모든 경우에 위 메서드들은 앱이 시작될 때 가능한 한 빨리 호출되어야 합니다. (즉, `Application.onCreate` 내부 또는 앱이 단일 `Activity`로 구성된 경우 `MainActivity.onCreate` 내부에서 호출해야 합니다.)**

## 의존성 주입 (Dependency injection)

더 큰 규모의 앱을 개발하거나 자체적으로 `ImageLoader`를 관리하려는 경우, `io.coil-kt.coil3:coil` 대신 `io.coil-kt.coil3:coil-core`에 의존할 수 있습니다.

이 방식은 가짜(fake) `ImageLoader`의 생명주기(lifecycle) 범위를 지정하기 훨씬 쉽게 만들며, 전반적으로 테스트를 더 용이하게 해줍니다.

## 캐싱 (Caching)

각 `ImageLoader`는 최근에 디코딩된 `Bitmap`의 메모리 캐시와 인터넷에서 로드된 이미지의 디스크 캐시를 유지합니다. 두 가지 모두 `ImageLoader`를 생성할 때 설정할 수 있습니다:

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .memoryCache {
        MemoryCache.Builder()
            .maxSizePercent(context, 0.25)
            .build()
    }
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .maxSizePercent(0.02)
            .build()
    }
    .build()
```

이미지가 로드된 후 `ImageResult`로 반환되는 키(key)를 사용하여 메모리 및 디스크 캐시의 항목에 접근할 수 있습니다. `ImageResult`는 `ImageLoader.execute`에 의해 반환되거나 `ImageRequest.Listener.onSuccess` 및 `ImageRequest.Listener.onError`에서 전달됩니다.