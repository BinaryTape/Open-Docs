# 이미지 요청

`ImageRequest`는 [값 객체](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)로, [ImageLoader](image_loaders.md)가 이미지를 로드하는 데 필요한 모든 정보를 제공합니다. `ImageRequest`는 빌더(builder)를 사용하여 생성할 수 있습니다:

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(imageView)
    .build()
```

요청을 생성한 후에는 `ImageLoader`에 전달하여 큐에 추가하거나 실행할 수 있습니다:

```kotlin
imageLoader.enqueue(request)
```

더 자세한 내용은 [API 문서](/coil/api/coil-core/coil3.request/-image-request/)를 참조하세요.