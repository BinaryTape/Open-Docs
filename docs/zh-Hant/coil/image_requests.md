# Image Requests

`ImageRequest` 是 [值物件](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)，為 [ImageLoader](image_loaders.md) 提供載入圖片所需的所有必要資訊。可以使用 Builder 建立 `ImageRequest`：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(imageView)
    .build()
```

建立請求後，將其傳遞給 `ImageLoader` 以進行 enqueue（入列）或 execute（執行）：

```kotlin
imageLoader.enqueue(request)
```

更多資訊請參閱 [API 文件](/coil/api/coil-core/coil3.request/-image-request/)。

!!! Notes
    在 Coil 3.x 中，`ImageRequest` 的平台特定函式（例如 `ImageRequest.Builder.target(ImageView)`）是以擴充函式方式實作的，需要單獨匯入。