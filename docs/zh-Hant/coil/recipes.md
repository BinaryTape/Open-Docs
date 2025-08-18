# 範例

本頁提供如何使用 Coil 處理一些常見使用案例的指南。您可能需要修改這些程式碼以符合您的確切需求，但希望它能為您指引正確的方向！

看到未涵蓋的常見使用案例？歡迎提交包含新章節的 PR (Pull Request)。

## Palette

[Palette](https://developer.android.com/training/material/palette-colors?hl=en) 允許您從圖片中提取主要顏色。要建立一個 `Palette`，您需要存取圖片的 `Bitmap`。這可以透過多種方式完成：

您可以透過設定 `ImageRequest.Listener` 並將 `ImageRequest` 加入佇列來存取圖片的位元圖：

```kotlin
imageView.load("https://example.com/image.jpg") {
    // 禁用硬體位元圖，因為 Palette 需要讀取圖片的像素。
    allowHardware(false)
    listener(
        onSuccess = { _, result ->
            // 在背景執行緒上建立 Palette。
            Palette.Builder(result.image.toBitmap()).generate { palette ->
                // 使用 Palette。
            }
        }
    )
}
```

## 使用記憶體快取鍵作為佔位符

如果兩張圖片相同但以不同尺寸載入，則使用前一個請求的 `MemoryCache.Key` 作為後續請求的佔位符會很有用。例如，如果第一個請求以 100x100 載入圖片，第二個請求以 500x500 載入圖片，我們可以使用第一張圖片作為第二個請求的同步佔位符。

此效果在範例應用程式中的外觀如下：

<p style="text-align: center;">
    <video width="360" height="640" autoplay loop muted playsinline>
        <source src="../images/crossfade.mp4" type="video/mp4">
    </video>
</p>

*清單中的圖片已刻意以非常低的細節載入，並且交叉淡入淡出效果已減慢，以突顯視覺效果。*

為了實現此效果，請將第一個請求的 `MemoryCache.Key` 用作第二個請求的 `ImageRequest.placeholderMemoryCacheKey`。以下是一個範例：

```kotlin
// 第一個請求
listImageView.load("https://example.com/image.jpg")

// 第二個請求（一旦第一個請求完成）
detailImageView.load("https://example.com/image.jpg") {
    placeholderMemoryCacheKey(listImageView.result.memoryCacheKey)
}
```

## 共享元素轉場

[共享元素轉場](https://developer.android.com/training/transitions/start-activity) 允許您在 `Activities` 和 `Fragments` 之間進行動畫處理。以下是關於如何讓它們與 Coil 協同工作的一些建議：

- **共享元素轉場與硬體位元圖不相容。** 您應該設定 `allowHardware(false)` 以禁用您要從中執行動畫的 `ImageView` 和要執行動畫的視圖的硬體位元圖。如果您不這樣做，轉場將拋出 `java.lang.IllegalArgumentException: Software rendering doesn't support hardware bitmaps` 例外。

- 使用起始圖片的 `MemoryCache.Key` 作為結束圖片的 [`placeholderMemoryCacheKey`](/coil/api/coil-core/coil3.request/-image-request/-builder/placeholder-memory-cache-key)。這確保了起始圖片被用作結束圖片的佔位符，如果圖片在記憶體快取中，這將導致流暢的轉場，沒有白色閃爍。

- 同時使用 [`ChangeImageTransform`](https://developer.android.com/reference/android/transition/ChangeImageTransform) 和 [`ChangeBounds`](https://developer.android.com/reference/android/transition/ChangeBounds) 以獲得最佳結果。

正在使用 Compose？[請查閱這篇文章，了解如何使用 `AsyncImage` 執行共享元素轉場](https://www.tunjid.com/articles/animating-contentscale-during-image-shared-element-transitions-65fba03537c67f8df0161c31)。

## 遠端視圖 (RemoteViews)

Coil 並未直接為 [`RemoteViews`](https://developer.android.com/reference/android/widget/RemoteViews) 提供 `Target`，但您可以像這樣建立一個：

```kotlin
class RemoteViewsTarget(
    private val context: Context,
    private val componentName: ComponentName,
    private val remoteViews: RemoteViews,
    @IdRes private val imageViewResId: Int
) : Target {

    override fun onStart(placeholder: Image?) = setImage(placeholder)

    override fun onError(error: Image?) = setImage(error)

    override fun onSuccess(result: Image) = setImage(result)

    private fun setImage(image: Image?) {
        remoteViews.setImageViewBitmap(imageViewResId, image?.toBitmap())
        AppWidgetManager.getInstance(context).updateAppWidget(componentName, remoteViews)
    }
}
```

然後像往常一樣 `enqueue`／`execute` 請求：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .target(RemoteViewsTarget(context, componentName, remoteViews, imageViewResId))
    .build()
imageLoader.enqueue(request)
```

## 轉換 Painter

`AsyncImage` 和 `AsyncImagePainter` 都具有接受 `Painter` 的 `placeholder`／`error`／`fallback` 參數。Painter 不如 composable 靈活，但由於 Coil 不需要使用 subcomposition，因此速度更快。儘管如此，可能需要內嵌、拉伸、著色或轉換您的 painter 以獲得所需的 UI。為了實現此目的，[將此 Gist 複製到您的專案中](https://gist.github.com/colinrtwhite/c2966e0b8584b4cdf0a5b05786b20ae1)，並像這樣包裝 (wrap) painter：

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

`onDraw` 可以使用尾隨 lambda 覆寫：

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

## 轉換請求

您可能需要轉換用於擷取圖片的 HTTP 請求。在此範例中，我們將使用一個 [Interceptor](https://coil-kt.github.io/coil/api/coil-core/coil3.intercept/-interceptor) 來將 `width` 和 `height` 查詢參數附加到請求 URL。

```kotlin
class UrlSizeInterceptor : Interceptor {

    override suspend fun intercept(chain: Chain): ImageResult {
        val request = chain.request
        val uri = request.uri

        if (uri == null || uri.scheme !in setOf("https", "http")) {
            // 忽略非 HTTP 請求。
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
            // 寬度與高度不可用，例如因為無限約束。
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

別忘了將攔截器 (interceptor) 加入您的 `ImageLoader`！

```kotlin
ImageLoader.Builder(context)
    .components {
        add(UrlSizeInterceptor())
    }
    .build()