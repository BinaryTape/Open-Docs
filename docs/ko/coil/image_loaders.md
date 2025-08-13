# 이미지 로더

`ImageLoader`는 [`ImageRequest`](image_requests.md)를 실행하는 [서비스 객체](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)입니다. 캐싱, 데이터 가져오기, 이미지 디코딩, 요청 관리, 메모리 관리 등 다양한 작업을 처리합니다.

Coil은 단일 `ImageLoader`를 생성하고 앱 전체에서 공유할 때 최상의 성능을 발휘합니다. 이는 각 `ImageLoader`가 자체 메모리 캐시, 디스크 캐시 및 `OkHttpClient`를 가지고 있기 때문입니다.

## 싱글턴

기본 `io.coil-kt.coil3:coil` 아티팩트에는 싱글턴 `ImageLoader`가 함께 제공됩니다. Coil은 이 `ImageLoader`를 지연 생성합니다. 다음을 포함한 여러 가지 방법으로 구성할 수 있습니다:

```kotlin
// setSafe 메서드는 이미 생성된 이미지 로더를 덮어쓰지 않도록 합니다.
SingletonImageLoader.setSafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// Compose Multiplatform 앱에 유용한 SingletonImageLoader.setSafe의 별칭입니다.
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// 테스트에서만 사용해야 합니다. 이 메서드를 여러 번 호출하면
// 여러 이미지 로더가 생성됩니다.
SingletonImageLoader.setUnsafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// Android에서는 Application 클래스에 SingletonImageLoader.Factory를 구현하여
// 싱글턴 이미지 로더를 생성하도록 할 수 있습니다.
class CustomApplication : SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

**모든 경우에 위에 언급된 메서드는 앱 시작 시 (즉, `Application.onCreate` 내부 또는 앱이 단일 `Activity`인 경우 `MainActivity.onCreate` 내부) 가능한 한 빨리 호출되도록 해야 합니다.**

## 의존성 주입

앱이 더 크거나 자체 `ImageLoader`를 관리하고 싶다면 `io.coil-kt.coil3:coil` 대신 `io.coil-kt.coil3:coil-core`에 의존할 수 있습니다.

이 방법은 가짜 `ImageLoader`의 수명 주기 범위를 지정하는 것을 훨씬 더 쉽게 만들고, 전반적으로 테스트를 더 쉽게 만듭니다.

## 캐싱

각 `ImageLoader`는 최근 디코딩된 `Bitmap`에 대한 메모리 캐시와 인터넷에서 로드된 이미지에 대한 디스크 캐시를 유지합니다. 둘 다 `ImageLoader`를 생성할 때 구성할 수 있습니다:

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .memoryCache {
        MemoryCache.Builder(context)
            .maxSizePercent(0.25)
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

메모리 및 디스크 캐시의 항목은 이미지가 로드된 후 `ImageResult`로 반환되는 키를 사용하여 접근할 수 있습니다. `ImageResult`는 `ImageLoader.execute`에 의해 또는 `ImageRequest.Listener.onSuccess` 및 `ImageRequest.Listener.onError`에서 반환됩니다.