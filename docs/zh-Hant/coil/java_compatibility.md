# Java 相容性

Coil 的 API 設計以 Kotlin 優先。它利用了 Kotlin 的語言特性，例如內嵌 Lambda (inlined lambdas)、接收者參數 (receiver params)、預設引數 (default arguments) 以及擴充函式 (extension functions)，而這些特性在 Java 中是無法使用的。

重要的一點是，Java 無法實作暫停函式 (suspend functions)。這意味著自訂的 [Transformations](/coil/api/coil-core/coil3.transform/-transformation)、[Size Resolvers](/coil/api/coil-core/coil3.size/-size-resolver)、[Fetchers](image_pipeline.md#fetchers) 和 [Decoders](image_pipeline.md#decoders) **必須** 使用 Kotlin 實作。

儘管有這些限制，Coil 的大部分 API 仍與 Java 相容。您可以使用以下方式取得單例 `ImageLoader`：

```java
ImageLoader imageLoader = SingletonImageLoader.get(context);
```

在 Java 中將 `ImageRequest` 加入佇列的語法與 Kotlin 幾乎相同：

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(new ImageViewTarget(imageView))
    .build();
imageLoader.enqueue(request);
```

!!! Note
    `ImageView.load` 無法在 Java 中使用。請改用 `ImageRequest.Builder` API。

`suspend` 函式無法輕易從 Java 呼叫。因此，若要同步取得圖片，您必須使用 `ImageLoader.executeBlocking` 擴充函式，在 Java 中的呼叫方式如下：

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .size(1080, 1920)
    .build();
Image image = ImageLoaders.executeBlocking(imageLoader, request).getImage();
Drawable drawable = Image_androidKt.asDrawable(image, context. resources);
```

!!! Note
    `ImageLoaders.executeBlocking` 會阻塞目前執行緒而非暫停 (suspending)。請勿在主要執行緒中呼叫此方法。