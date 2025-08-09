# 레시피

이 페이지는 Coil에서 자주 사용되는 몇 가지 일반적인 사용 사례를 처리하는 방법에 대한 지침을 제공합니다. 이 코드를 정확한 요구 사항에 맞게 수정해야 할 수도 있지만, 올바른 방향으로 나아가는 데 도움이 되기를 바랍니다!

다루지 않은 일반적인 사용 사례가 있나요? 새로운 섹션과 함께 PR을 자유롭게 제출해주세요.

## Palette

[Palette](https://developer.android.com/training/material/palette-colors?hl=en)를 사용하면 이미지에서 주요 색상을 추출할 수 있습니다. `Palette`를 생성하려면 이미지의 `Bitmap`에 접근해야 합니다. 이는 여러 가지 방법으로 수행할 수 있습니다:

`ImageRequest.Listener`를 설정하고 `ImageRequest`를 큐에 넣어 이미지의 비트맵에 접근할 수 있습니다:

```kotlin
imageView.load("https://example.com/image.jpg") {
    // Palette가 이미지의 픽셀을 읽어야 하므로 하드웨어 비트맵을 비활성화합니다.
    allowHardware(false)
    listener(
        onSuccess = { _, result ->
            // 백그라운드 스레드에서 팔레트를 생성합니다.
            Palette.Builder(result.drawable.toBitmap()).generate { palette ->
                // 팔레트를 사용합니다.
            }
        }
    )
}
```

## 메모리 캐시 키를 플레이스홀더로 사용하기

이전 요청의 `MemoryCache.Key`를 후속 요청의 플레이스홀더로 사용하는 것은 두 이미지가 동일하지만 다른 크기로 로드될 때 유용할 수 있습니다. 예를 들어, 첫 번째 요청이 이미지를 100x100으로 로드하고 두 번째 요청이 이미지를 500x500으로 로드하는 경우, 첫 번째 이미지를 두 번째 요청의 동기식 플레이스홀더로 사용할 수 있습니다.

샘플 앱에서 이 효과는 다음과 같습니다:

<p style="text-align: center;">
    <video width="360" height="640" autoplay loop muted playsinline>
        <source src="../images/crossfade.mp4" type="video/mp4">
    </video>
</p>

*목록의 이미지는 의도적으로 매우 낮은 디테일로 로드되었으며, 시각적 효과를 강조하기 위해 크로스페이드가 느리게 설정되었습니다.*

이 효과를 얻으려면 첫 번째 요청의 `MemoryCache.Key`를 두 번째 요청의 `ImageRequest.placeholderMemoryCacheKey`로 사용합니다. 다음은 예시입니다:

```kotlin
// 첫 번째 요청
listImageView.load("https://example.com/image.jpg")

// 두 번째 요청 (첫 번째 요청이 완료되면)
detailImageView.load("https://example.com/image.jpg") {
    placeholderMemoryCacheKey(listImageView.result.memoryCacheKey)
}
```

## 공유 요소 전환

[공유 요소 전환](https://developer.android.com/training/transitions/start-activity)을 사용하면 `Activities`와 `Fragments` 간에 애니메이션을 적용할 수 있습니다. 다음은 Coil과 함께 작동하도록 하는 방법에 대한 몇 가지 권장 사항입니다:

- **공유 요소 전환은 하드웨어 비트맵과 호환되지 않습니다.** 애니메이션을 시작하는 `ImageView`와 애니메이션을 적용할 뷰 모두에 대해 `allowHardware(false)`를 설정하여 하드웨어 비트맵을 비활성화해야 합니다. 그렇지 않으면 전환 시 `java.lang.IllegalArgumentException: Software rendering doesn't support hardware bitmaps` 예외가 발생합니다.

- 시작 이미지의 `MemoryCache.Key`를 종료 이미지의 [`placeholderMemoryCacheKey`](/coil/api/coil-core/coil3.request/-image-request/-builder/placeholder-memory-cache-key)로 사용하세요. 이렇게 하면 시작 이미지가 종료 이미지의 플레이스홀더로 사용되어, 이미지가 메모리 캐시에 있는 경우 흰색 플래시 없이 부드러운 전환이 가능합니다.

- 최적의 결과를 위해 [`ChangeImageTransform`](https://developer.android.com/reference/android/transition/ChangeImageTransform)과 [`ChangeBounds`](https://developer.android.com/reference/android/transition/ChangeBounds)를 함께 사용하세요.

Compose를 사용하시나요? [`AsyncImage`로 공유 요소 전환을 수행하는 방법에 대한 이 글](https://www.tunjid.com/articles/animating-contentscale-during-image-shared-element-transitions-65fba03537c67f8df0161c31)을 확인해보세요.

## 원격 뷰

Coil은 기본적으로 [`RemoteViews`](https://developer.android.com/reference/android/widget/RemoteViews)용 `Target`을 제공하지 않지만, 다음과 같이 직접 생성할 수 있습니다:

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

그 다음 요청을 평소처럼 `enqueue`/`execute` 합니다:

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .target(RemoteViewsTarget(context, componentName, remoteViews, imageViewResId))
    .build()
imageLoader.enqueue(request)
```

## Painter 변환하기

`AsyncImage`와 `AsyncImagePainter`는 모두 `Painter`를 허용하는 `placeholder`/`error`/`fallback` 인수를 가집니다. Painter는 컴포저블을 사용하는 것보다 유연성이 떨어지지만, Coil이 서브컴포지션(subcomposition)을 사용할 필요가 없으므로 더 빠릅니다. 하지만 원하는 UI를 얻기 위해 Painter를 삽입(inset), 늘이기(stretch), 색조 변경(tint) 또는 변환(transform)해야 할 수도 있습니다. 이를 수행하려면 [이 Gist를 프로젝트에 복사](https://gist.github.com/colinrtwhite/c2966e0b8584b4cdf0a5b05786b20ae1)하고 다음과 같이 Painter를 감싸세요:

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

다음과 같이 후행 람다(trailing lambda)를 사용하여 `onDraw`를 재정의할 수 있습니다:

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

## 요청 변환하기

이미지를 가져오는 데 사용되는 HTTP 요청을 변환해야 할 수도 있습니다. 이 예시에서는 [Interceptor](https://coil-kt.github.io/coil/api/coil-core/coil3.intercept/-interceptor)를 사용하여 요청 URL에 `width` 및 `height` 쿼리 파라미터를 추가하겠습니다.

```kotlin
class UrlSizeInterceptor : Interceptor {

    override suspend fun intercept(chain: Chain): ImageResult {
        val request = chain.request
        val uri = request.uri

        if (uri == null || uri.scheme !in setOf("https", "http")) {
            // HTTP가 아닌 요청은 무시합니다.
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
            // 너비와 높이를 사용할 수 없는 경우(예: 무한 제약 조건으로 인해).
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

`ImageLoader`에 인터셉터를 등록하는 것을 잊지 마세요!

```kotlin
ImageLoader.Builder(context)
    .components {
        add(FastlyCoilInterceptor())
    }
    .build()