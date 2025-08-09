# Java 相容性

Coil 的 API 設計以 Kotlin 優先。它利用了 Kotlin 的語言特性，例如內聯 Lambda 表達式、接收器參數、預設引數和擴展函數，這些特性在 Java 中是不可用的。

重要的是，掛起函數 (suspend functions) 無法在 Java 中實作。這意味著自訂的 [Transformations](/coil/api/coil-core/coil3.transform/-transformation)、[Size Resolvers](/coil/api/coil-core/coil3.size/-size-resolver)、[Fetchers](image_pipeline.md#fetchers) 和 [Decoders](image_pipeline.md#decoders) **必須**在 Kotlin 中實作。

儘管有這些限制，Coil 的大多數 API 都與 Java 相容。您可以使用以下方式取得單例 `ImageLoader`：

```java
ImageLoader imageLoader = SingletonImageLoader.get(context);
```

將 `ImageRequest` 入佇列的語法在 Java 和 Kotlin 中幾乎相同：

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(new ImageViewTarget(imageView))
    .build();
imageLoader.enqueue(request);
```

!!! Note
    `ImageView.load` 無法從 Java 使用。請改用 `ImageRequest.Builder` API。

`suspend` 函數無法從 Java 輕鬆呼叫。因此，要同步取得影像，您必須使用 `ImageLoader.executeBlocking` 擴展函數，它可像這樣從 Java 呼叫：

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .size(1080, 1920)
    .build();
Drawable drawable = ImageLoaders.executeBlocking(imageLoader, request).getImage().asDrawable(context.resources);
```

!!! Note
    `ImageLoaders.executeBlocking` 將會阻塞當前執行緒，而不是掛起。請勿從主執行緒呼叫此函數。