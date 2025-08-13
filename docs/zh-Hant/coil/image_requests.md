# 影像請求

`ImageRequest` 是 [值物件](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)，它提供了 `ImageLoader` 載入影像所需的所有必要資訊。`ImageRequest` 可以透過建構器 (builder) 建立：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(imageView)
    .build()
```

一旦您建立了一個請求，將其傳遞給 `ImageLoader` 以將其排入佇列/執行：

```kotlin
imageLoader.enqueue(request)
```

更多資訊請參閱 [API 文件](/coil/api/coil-core/coil3.request/-image-request/)。