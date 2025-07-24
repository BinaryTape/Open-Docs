# 实用案例

本页面提供了关于如何使用 Coil 处理一些常见用例的指导。你可能需要修改这些代码以适应你的具体需求，但它们有望为你提供正确的方向！

发现未涵盖的常见用例？欢迎提交 PR 来添加新章节。

## Palette

[Palette](https://developer.android.com/training/material/palette-colors?hl=en) 允许你从图像中提取主要颜色。要创建 `Palette`，你需要访问图像的 `Bitmap`。这可以通过多种方式完成：

你可以通过设置 `ImageRequest.Listener` 并将 `ImageRequest` 入队来访问图像的位图：

```kotlin
imageView.load("https://example.com/image.jpg") {
    // 禁用硬件位图，因为 Palette 需要读取图像的像素。
    allowHardware(false)
    listener(
        onSuccess = { _, result ->
            // 在后台线程上创建调色板。
            Palette.Builder(result.drawable.toBitmap()).generate { palette ->
                // 使用调色板。
            }
        }
    )
}
```

## 使用内存缓存键作为占位符

将先前请求的 `MemoryCache.Key` 用作后续请求的占位符非常有用，即使这两张图片大小不同，但内容相同。例如，如果第一个请求加载 100x100 的图像，而第二个请求加载 500x500 的图像，我们可以将第一张图像用作第二个请求的同步占位符。

以下是此效果在示例应用中的表现：

<p style="text-align: center;">
    <video width="360" height="640" autoplay loop muted playsinline>
        <source src="../images/crossfade.mp4" type="video/mp4">
    </video>
</p>

*列表中的图像特意以非常低的细节加载，并且交叉淡入淡出效果被放慢以突出视觉效果。*

要实现此效果，请将第一个请求的 `MemoryCache.Key` 用作第二个请求的 `ImageRequest.placeholderMemoryCacheKey`。示例如下：

```kotlin
// 第一个请求
listImageView.load("https://example.com/image.jpg")

// 第二个请求（在第一个请求完成后）
detailImageView.load("https://example.com/image.jpg") {
    placeholderMemoryCacheKey(listImageView.result.memoryCacheKey)
}
```

## 共享元素转换

[共享元素转换 (Shared element transitions)](https://developer.android.com/training/transitions/start-activity) 允许你在 `Activities` 和 `Fragments` 之间进行动画。以下是关于如何使其与 Coil 协同工作的一些建议：

-   **共享元素转换与硬件位图不兼容。** 你应该将 `allowHardware(false)` 设置为禁用硬件位图，无论是从哪个 `ImageView` 进行动画，还是动画到哪个视图。否则，转换将抛出 `java.lang.IllegalArgumentException: Software rendering doesn't support hardware bitmaps` 异常。

-   将起始图像的 `MemoryCache.Key` 用作结束图像的 [`placeholderMemoryCacheKey`](/coil/api/coil-core/coil3.request/-image-request/-builder/placeholder-memory-cache-key)。这可以确保起始图像被用作结束图像的占位符，从而在图像位于内存缓存中时实现平滑过渡，避免出现白色闪烁。

-   结合使用 [`ChangeImageTransform`](https://developer.android.com/reference/android/transition/ChangeImageTransform) 和 [`ChangeBounds`](https://developer.android.com/reference/android/transition/ChangeBounds) 以获得最佳效果。

正在使用 Compose？[请查阅这篇文章，了解如何使用 `AsyncImage` 执行共享元素转换](https://www.tunjid.com/articles/animating-contentscale-during-image-shared-element-transitions-65fba03537c67f8df0161c31)。

## RemoteViews

Coil 不提供开箱即用的 [`RemoteViews`](https://developer.android.com/reference/android/widget/RemoteViews) 的 `Target`，但是你可以像这样创建一个：

```kotlin
class RemoteViewsTarget(
    private val context: Context,
    private val componentName: ComponentName,
    private val remoteViews: RemoteViews,
    @IdRes private val imageViewResId: Int
) : Target {

    override fun onStart(placeholder: Image?) = setDrawable(placeholder)

    override fun onError(error: Image?) = setDrawable(error)

    override fun onSuccess(result: Image) = setDrawable(result)

    private fun setDrawable(image: Image?) {
        remoteViews.setImageViewBitmap(imageViewResId, image?.toBitmap())
        AppWidgetManager.getInstance(context).updateAppWidget(componentName, remoteViews)
    }
}
```

然后像往常一样 `enqueue` / `execute` 请求：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .target(RemoteViewsTarget(context, componentName, remoteViews, imageViewResId))
    .build()
imageLoader.enqueue(request)
```

## 转换 Painters

`AsyncImage` 和 `AsyncImagePainter` 都具有接受 `Painter` 的 `placeholder` / `error` / `fallback` 参数。`Painter` 不如 composable 灵活，但由于 Coil 不需要使用子组合 (subcomposition)，因此速度更快。尽管如此，你可能需要对 `Painter` 进行内嵌、拉伸、着色或转换以获得所需的 UI。为此，请[将此 Gist 复制到你的项目中](https://gist.github.com/colinrtwhite/c2966e0b8584b4cdf0a5b05786b20ae1)并像这样包装 `Painter`：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
    placeholder = forwardingPainter(
        painter = painterResource(R.drawable.placeholder),
        colorFilter = ColorFilter(Color.Red),
        alpha = 0.5f,
    ),
)
```

可以使用尾随 lambda 覆盖 `onDraw`：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
    placeholder = forwardingPainter(painterResource(R.drawable.placeholder)) { info ->
        inset(50f, 50f) {
            with(info.painter) {
                draw(size, info.alpha, info.colorFilter)
            }
        }
    },
)
```

## 转换请求

你可能需要转换用于获取图像的 HTTP 请求。在此示例中，我们将使用 [Interceptor](https://coil-kt.github.io/coil/api/coil-core/coil3.intercept/-interceptor) 来将 `width` 和 `height` 查询参数附加到请求 URL。

```kotlin
class UrlSizeInterceptor : Interceptor {

    override suspend fun intercept(chain: Chain): ImageResult {
        val request = chain.request
        val uri = request.uri

        if (uri == null || uri.scheme !in setOf("https", "http")) {
            // 忽略非 HTTP 请求。
            return chain.proceed()
        }

        val (width, height) = chain.size
        return if (width is Pixels && height is Pixels) {
            val transformUri = uri.newBuilder()
                .query("width=${width.px}&height=${height.px}")
                .build()

            val transformedRequest = request.newBuilder()
                .data(transformUri)
                .build()
            return chain.withRequest(transformedRequest).proceed()
        } else {
            // 宽度和高度不可用，例如由于无限约束。
            chain.proceed()
        }
    }

    private val ImageRequest.uri: Uri?
        get() = when (val data = data) {
            is Uri -> data
            is coil3.Uri -> data.toAndroidUri()
            is String -> data.toUri()
            else -> null
        }
}
```

别忘了将拦截器注册到你的 `ImageLoader` 中！

```kotlin
ImageLoader.Builder(context)
    .components {
        add(FastlyCoilInterceptor())
    }
    .build()
```