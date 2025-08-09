# Compose

[Compose UI](https://www.jetbrains.com/compose-multiplatform/) 지원을 추가하려면 확장 라이브러리를 가져오세요:

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
```

그런 다음 `AsyncImage` 컴포저블을 사용하여 이미지를 로드하고 표시할 수 있습니다:

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

`model`은 `ImageRequest.data` 값 또는 `ImageRequest` 자체일 수 있습니다. `contentDescription`은 접근성 서비스에서 이 이미지가 무엇을 나타내는지 설명하는 데 사용되는 텍스트를 설정합니다.

## AsyncImage

`AsyncImage`는 이미지 요청을 비동기적으로 실행하고 결과를 렌더링하는 컴포저블입니다. 이것은 표준 `Image` 컴포저블과 동일한 인수를 지원하며, 추가적으로 `placeholder`/`error`/`fallback` 페인터와 `onLoading`/`onSuccess`/`onError` 콜백 설정을 지원합니다. 다음은 원형 크롭, 크로스페이드 효과로 이미지를 로드하고 플레이스홀더를 설정하는 예시입니다:

```kotlin
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    placeholder = painterResource(R.drawable.placeholder),
    contentDescription = stringResource(R.string.description),
    contentScale = ContentScale.Crop,
    modifier = Modifier.clip(CircleShape),
)
```

**이 함수를 사용하는 경우:**

대부분의 경우 `AsyncImage` 사용을 권장합니다. 이것은 컴포저블의 제약 조건과 제공된 `ContentScale`에 따라 이미지가 로드되어야 할 크기를 올바르게 결정합니다.

## rememberAsyncImagePainter

내부적으로 `AsyncImage`와 `SubcomposeAsyncImage`는 `model`을 로드하기 위해 `rememberAsyncImagePainter`를 사용합니다. 컴포저블이 아닌 `Painter`가 필요한 경우, `rememberAsyncImagePainter`를 사용하여 이미지를 로드할 수 있습니다:

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")
```

`rememberAsyncImagePainter`는 `AsyncImage` 및 `SubcomposeAsyncImage`보다 유연하지만, 몇 가지 단점이 있습니다 (아래 참조).

**이 함수를 사용하는 경우:**

컴포저블 대신 `Painter`가 필요한 경우 - 또는 `AsyncImagePainter.state`를 관찰하여 이를 기반으로 다른 컴포저블을 그려야 하는 경우 - 또는 `AsyncImagePainter.restart`를 사용하여 이미지 요청을 수동으로 다시 시작해야 하는 경우 유용합니다.

이 함수의 주요 단점은 화면에 로드되는 이미지 크기를 감지하지 못하고 항상 원본 크기로 이미지를 로드한다는 것입니다. 이 문제를 해결하기 위해 사용자 지정 `SizeResolver`를 전달하거나 `rememberConstraintsSizeResolver` (이것은 `AsyncImage`가 내부적으로 사용하는 것임)를 사용할 수 있습니다. 예시:

```kotlin
val sizeResolver = rememberConstraintsSizeResolver()
val painter = rememberAsyncImagePainter(
    model = ImageRequest.Builder(LocalPlatformContext.current)
        .data("https://example.com/image.jpg")
        .size(sizeResolver)
        .build(),
)

Image(
    painter = painter,
    contentDescription = null,
    modifier = Modifier.then(sizeResolver),
)
```

또 다른 단점은 `rememberAsyncImagePainter`를 사용할 때 첫 번째 컴포지션에서 `AsyncImagePainter.state`가 항상 `AsyncImagePainter.State.Empty`가 된다는 것입니다. 이는 이미지가 메모리 캐시에 존재하고 첫 번째 프레임에 그려질 경우에도 마찬가지입니다.

## SubcomposeAsyncImage

`SubcomposeAsyncImage`는 `Painter` 대신 서브컴포지션(subcomposition)을 사용하여 `AsyncImagePainter`의 상태에 대한 슬롯 API를 제공하는 `AsyncImage`의 변형입니다. 다음은 예시입니다:

```kotlin
SubcomposeAsyncImage(
    model = "https://example.com/image.jpg",
    loading = {
        CircularProgressIndicator()
    },
    contentDescription = stringResource(R.string.description),
)
```

또한, `content` 인수와 현재 상태를 렌더링하는 `SubcomposeAsyncImageContent`를 사용하여 더 복잡한 로직을 구현할 수 있습니다:

```kotlin
SubcomposeAsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = stringResource(R.string.description)
) {
    val state by painter.state.collectAsState()
    if (state is AsyncImagePainter.State.Success) {
        SubcomposeAsyncImageContent()
    } else {
        CircularProgressIndicator()
    }
}
```

!!! Note
    서브컴포지션(Subcomposition)은 일반적인 컴포지션보다 느리므로, 이 컴포저블은 UI의 성능이 중요한 부분(예: `LazyList`)에는 적합하지 않을 수 있습니다.

**이 함수를 사용하는 경우:**

`AsyncImagePainter.state`를 관찰해야 하고 서브컴포지션(subcomposition)을 사용하지 않으므로, 일반적으로 이 함수 대신 `rememberAsyncImagePainter`를 사용하는 것을 선호합니다.

구체적으로, 이 함수는 `AsyncImagePainter.state`를 관찰해야 하고 `rememberAsyncImagePainter`처럼 첫 번째 컴포지션과 첫 번째 프레임에서 `Empty` 상태가 되어서는 안 되는 경우에만 유용합니다. `SubcomposeAsyncImage`는 서브컴포지션(subcomposition)을 사용하여 이미지의 제약 조건을 가져오므로, `AsyncImagePainter.state`가 즉시 최신 상태로 업데이트됩니다.

## AsyncImagePainter.state 관찰하기

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")
val state by painter.state.collectAsState()

when (state) {
    is AsyncImagePainter.State.Empty,
    is AsyncImagePainter.State.Loading -> {
        CircularProgressIndicator()
    }
    is AsyncImagePainter.State.Success -> {
        Image(
            painter = painter,
            contentDescription = stringResource(R.string.description)
        )
    }
    is AsyncImagePainter.State.Error -> {
        // 오류 UI를 표시합니다.
    }
}
```

## 트랜지션

`ImageRequest.Builder.crossfade`를 사용하여 내장된 크로스페이드 트랜지션을 활성화할 수 있습니다:

```kotlin
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
)
```

사용자 지정 [`Transition`](/coil/api/coil-core/coil3.transition/-transition)은 `View` 참조가 필요하므로 `AsyncImage`, `SubcomposeAsyncImage` 또는 `rememberAsyncImagePainter`와 함께 작동하지 않습니다. `CrossfadeTransition`은 특별한 내부 지원으로 인해 작동합니다.

그렇지만, `AsyncImagePainter.state`를 관찰하여 Compose에서 사용자 지정 트랜지션을 만들 수 있습니다:

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")

val state by painter.state.collectAsState()
if (state is AsyncImagePainter.State.Success && state.result.dataSource != DataSource.MEMORY_CACHE) {
    // 트랜지션 애니메이션을 수행합니다.
}

Image(
    painter = painter,
    contentDescription = stringResource(R.string.description),
)
```

## 미리보기

`AsyncImage`/`rememberAsyncImagePainter`/`SubcomposeAsyncImage`에 대한 Android Studio 미리보기 동작은 `LocalAsyncImagePreviewHandler`에 의해 제어됩니다. 기본적으로 미리보기 환경 내에서 요청을 일반적인 방식으로 수행하려고 시도합니다. 미리보기 환경에서는 네트워크 접근이 비활성화되어 있으므로, 네트워크 URL은 항상 실패합니다.

미리보기 동작을 다음과 같이 재정의할 수 있습니다:

```kotlin
val previewHandler = AsyncImagePreviewHandler {
    ColorImage(Color.Red.toArgb())
}

CompositionLocalProvider(LocalAsyncImagePreviewHandler provides previewHandler) {
    AsyncImage(
        model = "https://example.com/image.jpg",
        contentDescription = null,
    )
}
```

이는 동일한 미리보기 환경에서 실행되는 [AndroidX의 Compose 미리보기 스크린샷 테스트 라이브러리](https://developer.android.com/studio/preview/compose-screenshot-testing)에도 유용합니다.

## Compose Multiplatform 리소스

Coil은 `model` 매개변수로 `Res.getUri`를 사용하여 [Compose Multiplatform 리소스](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-resources.html) 로드를 지원합니다. 예시:

```kotlin
AsyncImage(
    model = Res.getUri("drawable/sample.jpg"),
    contentDescription = null,
)
```

!!! Note
    `Res.drawable.image` 및 기타 컴파일 안전 참조는 Coil에서 지원되지 않습니다. 대신 `Res.getUri("drawable/image")`를 사용해야 합니다. [업데이트는 이 이슈를 팔로우하세요](https://github.com/coil-kt/coil/issues/2812).