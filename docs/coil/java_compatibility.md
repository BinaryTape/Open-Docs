# Java 兼容性

Coil 的 API 设计为优先 Kotlin (Kotlin-first)。它利用了 Kotlin 语言特性，例如内联 lambda 表达式 (inlined lambdas)、接收者参数 (receiver params)、默认参数 (default arguments) 和扩展函数 (extension functions)，这些在 Java 中不可用。

重要的是，挂起函数 (suspend functions) 无法在 Java 中实现。这意味着自定义 [Transformations](/coil/api/coil-core/coil3.transform/-transformation)、[Size Resolvers](/coil/api/coil-core/coil3.size/-size-resolver)、[Fetchers](image_pipeline.md#fetchers) 和 [Decoders](image_pipeline.md#decoders) **必须**在 Kotlin 中实现。

尽管有这些限制，Coil 的大部分 API 都与 Java 兼容。你可以使用以下方式获取单例 `ImageLoader`：

```java
ImageLoader imageLoader = SingletonImageLoader.get(context);
```

在 Java 和 Kotlin 中，入队 `ImageRequest` 的语法几乎相同：

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(new ImageViewTarget(imageView))
    .build();
imageLoader.enqueue(request);
```

!!! 注意
    `ImageView.load` 无法从 Java 使用。请改用 `ImageRequest.Builder` API。

挂起函数 ( `suspend` functions) 无法从 Java 轻松调用。因此，要同步获取图像，你将不得不使用 `ImageLoader.executeBlocking` 扩展函数，它可以像这样从 Java 调用：

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .size(1080, 1920)
    .build();
Drawable drawable = ImageLoaders.executeBlocking(imageLoader, request).getImage().asDrawable(context.resources);
```

!!! 注意
    `ImageLoaders.executeBlocking` 将阻塞当前线程而不是挂起。请勿在主线程中调用此方法。