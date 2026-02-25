# 이미지 요청

`ImageRequest`는 [ImageLoader](image_loaders.md)가 이미지를 로드하는 데 필요한 모든 정보를 제공하는 [값 객체(value objects)](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)입니다. `ImageRequest`는 빌더를 사용하여 생성할 수 있습니다:

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(imageView)
    .build()
```

요청을 생성한 후에는 `ImageLoader`에 전달하여 대기열에 추가(enqueue)하거나 실행(execute)하세요:

```kotlin
imageLoader.enqueue(request)
```

더 자세한 정보는 [API 문서](/coil/api/coil-core/coil3.request/-image-request/)를 참조하세요.

!!! Notes
    Coil 3.x에서 `ImageRequest`의 플랫폼별 함수(예: `ImageRequest.Builder.target(ImageView)`)는 확장 함수로 구현되어 있으며 별도로 임포트(import)해야 합니다.