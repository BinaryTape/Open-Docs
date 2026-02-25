# Java 兼容性

Coil 的 API 设计以 Kotlin 优先。它利用了 Kotlin 的语言功能，如内联 lambda、接收者形参、默认实参和扩展方法，而这些功能在 Java 中不可用。

重要的是，suspend 函数无法在 Java 中实现。这意味着自定义 [Transformations](/coil/api/coil-core/coil3.transform/-transformation)、[Size Resolvers](/coil/api/coil-core/coil3.size/-size-resolver)、[Fetchers](image_pipeline.md#fetchers) 和 [Decoders](image_pipeline.md#decoders) **必须**使用 Kotlin 实现。

尽管有这些限制，Coil 的大多数 API 仍与 Java 兼容。您可以使用以下方式获取单例 `ImageLoader`：

```java
ImageLoader imageLoader = SingletonImageLoader.get(context);
```

在 Java 和 Kotlin 中，将 `ImageRequest` 入队的语法几乎相同：

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(new ImageViewTarget(imageView))
    .build();
imageLoader.enqueue(request);
```

!!! Note
    `ImageView.load` 无法在 Java 中使用。请改用 `ImageRequest.Builder` API。

`suspend` 函数无法轻松地从 Java 中调用。因此，若要同步获取图像，您必须使用 `ImageLoader.executeBlocking` 扩展方法，该方法可以像这样从 Java 中调用：

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .size(1080, 1920)
    .build();
Image image = ImageLoaders.executeBlocking(imageLoader, request).getImage();
Drawable drawable = Image_androidKt.asDrawable(image, context.resources);
```

!!! Note
    `ImageLoaders.executeBlocking` 将阻塞当前线程，而不是挂起。请勿在主线程中调用此方法。