# Image Request

`ImageRequest` 是 [值对象](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)，为 [ImageLoader](image_loaders.md) 加载图片提供所有必要信息。可以使用 builder 创建 `ImageRequest`：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(imageView)
    .build()
```

创建请求后，将其传递给 `ImageLoader` 以进行入队/执行：

```kotlin
imageLoader.enqueue(request)
```

有关更多信息，请参阅 [API 文档](/coil/api/coil-core/coil3.request/-image-request/)。

!!! Notes
    在 Coil 3.x 中，`ImageRequest` 的平台特定函数（例如 `ImageRequest.Builder.target(ImageView)`）是以扩展函数的形式实现的，需要单独导入。