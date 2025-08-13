# 图像请求

`ImageRequest` 是 [值对象](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)，它为 [ImageLoader](image_loaders.md) 提供加载图像所需的所有必要信息。`ImageRequest` 可以使用构建器创建：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(imageView)
    .build()
```

创建请求后，将其传递给 `ImageLoader` 以便将其入队/执行：

```kotlin
imageLoader.enqueue(request)
```

有关更多信息，请参阅 [API 文档](/coil/api/coil-core/coil3.request/-image-request/)。