# Coil 2.x로 업그레이드하기

이 문서는 Coil 1.x에서 2.x로 업그레이드할 때의 주요 변경 사항과 처리 방법을 요약한 짧은 가이드입니다. 이 업그레이드 가이드는 모든 바이너리 또는 소스 호환성 변경 사항을 다루지는 않지만, 가장 중요한 변경 사항들을 포함하고 있습니다.

## 최소 API 21

Coil 2.x는 최소 API 레벨 21을 요구합니다. 이는 Compose 및 OkHttp 4.x에서 요구하는 최소 API 레벨과도 동일합니다.

## ImageRequest 기본 스케일(scale)

Coil 2.x에서는 `ImageRequest`의 기본 스케일이 `Scale.FILL`에서 `Scale.FIT`으로 변경되었습니다. 이는 `ImageView`의 기본 `ScaleType` 및 `Image`의 기본 `ContentScale`과 일치시키기 위함입니다. `ImageRequest.target`으로 `ImageView`를 설정한 경우에는 여전히 스케일이 자동으로 감지됩니다.

## Size 리팩터링

`Size`의 `width`와 `height`는 이제 `Int` 픽셀 값이 아닌 두 개의 `Dimension`으로 표현됩니다. `Dimension`은 픽셀 값 또는 정의되지 않거나 제한이 없는 제약 조건을 나타내는 `Dimension.Undefined` 중 하나입니다. 예를 들어, 크기가 `Size(400, Dimension.Undefined)`라면 이미지의 높이에 관계없이 너비를 400픽셀로 맞춰야 함을 의미합니다. `pxOrElse` 확장 함수를 사용하여 픽셀 값을 가져오거나(값이 있는 경우), 값이 없는 경우 폴백(fallback)을 사용할 수 있습니다.

```kotlin
val width = size.width.pxOrElse { -1 }
if (width > 0) {
    // 픽셀 값을 사용합니다.
}
```

이 변경은 타겟의 한쪽 차원(dimension)이 제한되지 않은 경우(예: `View`의 차원 중 하나가 `ViewGroup.LayoutParams.WRAP_CONTENT`이거나 Compose의 `Constraints.Infinity`인 경우)에 대한 지원을 개선하기 위해 이루어졌습니다.

## Compose

Coil 2.x에서는 기능을 추가하고 안정성과 성능을 향상시키기 위해 Compose 통합 방식을 대폭 개편했습니다.

Coil 1.x에서는 이미지를 로드하기 위해 `rememberImagePainter`를 사용했습니다:

```kotlin
val painter = rememberImagePainter("https://example.com/image.jpg") {
    crossfade(true)
}

Image(
    painter = painter,
    contentDescription = null,
    contentScale = ContentScale.Crop
)
```

Coil 2.x에서는 `rememberImagePainter`가 `rememberAsyncImagePainter`로 변경되었으며 다음과 같은 변화가 있습니다:

- `ImageRequest`를 설정하는 후행 람다 인자가 제거되었습니다.
- Coil 2.x의 `rememberAsyncImagePainter`는 `Image`와의 일관성을 위해 기본값으로 `ContentScale.Fit`을 사용합니다. Coil 1.x에서는 `ContentScale.Crop`이 기본값이었습니다. 따라서 `Image`에 커스텀 `ContentScale`을 설정하는 경우, 이제 `rememberAsyncImagePainter`에도 이를 전달해야 합니다.

```kotlin
val painter = rememberAsyncImagePainter(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentScale = ContentScale.Crop
)

Image(
    painter = painter,
    contentDescription = null,
    contentScale = ContentScale.Crop
)
```

또한, 이제 Coil은 `AsyncImage` 및 `SubcomposeAsyncImage` 컴포저블 함수를 제공하여 새로운 기능을 추가하고 `rememberAsyncImagePainter`의 일부 설계상 한계를 보완합니다. 자세한 Compose 문서는 [여기](compose.md)에서 확인하세요.

## 디스크 캐시(Disk Cache)

Coil 2.x는 `imageLoader.diskCache`를 통해 접근할 수 있는 자체적인 공개 디스크 캐시 클래스를 가집니다. Coil 1.x는 OkHttp의 디스크 캐시에 의존했으나, 더 이상 필요하지 않습니다.

1.x에서 디스크 캐시를 설정하려면 `CoilUtils.createDefaultCache`를 사용했습니다:

```kotlin
ImageLoader.Builder(context)
    .okHttpClient {
        OkHttpClient.Builder().cache(CoilUtils.createDefaultCache(context)).build()
    }
    .build()
```

Coil 2.x에서는 `ImageLoader`와 함께 사용되는 `OkHttpClient`에 `Cache` 객체를 설정해서는 안 됩니다. 대신 다음과 같이 디스크 캐시 객체를 설정하세요:

```kotlin
ImageLoader.Builder(context)
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .build()
    }
    .build()
```

이 변경은 기능을 추가하고 성능을 향상시키기 위해 이루어졌습니다:

- 이미지 디코딩 중 스레드 중단(interruption)을 지원합니다.
  - 스레드 중단은 디코드 작업의 빠른 취소를 가능하게 합니다. 이는 목록을 빠르게 스크롤할 때 특히 중요합니다.
  - 커스텀 디스크 캐시를 사용함으로써 Coil은 디코딩 전에 네트워크 소스가 디스크에 완전히 기록되도록 보장할 수 있습니다. 데이터를 디스크에 쓰는 작업은 중단될 수 없으며, 디코드 단계만 중단될 수 있기 때문에 이는 필수적입니다. OkHttp의 `Cache`는 모든 데이터가 디코딩 전에 디스크에 기록됨을 보장할 수 없으므로 Coil 2.0과 함께 사용해서는 안 됩니다.
- `InputStream`을 지원하지 않거나 `File`에 직접 접근해야 하는 디코드 API(예: `ImageDecoder`, `MediaMetadataRetriever`)를 위해 버퍼링이나 임시 파일 생성을 피할 수 있습니다.
- 공개 읽기/쓰기 `DiskCache` API를 추가했습니다.

Coil 2.x에서도 `Cache-Control` 및 기타 캐시 헤더는 여전히 지원됩니다. 단, `Vary` 헤더는 제외되는데, 이는 캐시가 URL 일치 여부만 확인하기 때문입니다. 또한 응답 코드가 [200..300) 범위에 있는 응답만 캐싱됩니다.

Coil 1.x에서 2.x로 업그레이드할 때, 내부 형식이 변경되었으므로 기존의 모든 디스크 캐시는 삭제됩니다.

## 이미지 파이프라인 리팩터링

Coil 2.x는 이미지 파이프라인 클래스들을 더 유연하게 리팩터링했습니다. 주요 변경 사항 목록은 다음과 같습니다:

- 요청에 대한 메모리 캐시 키를 계산하는 새로운 클래스인 `Keyer`를 도입했습니다. 이는 `Fetcher.key`를 대체합니다.
- `Mapper`, `Keyer`, `Fetcher`, 및 `Decoder`는 `null`을 반환하여 컴포넌트 목록의 다음 요소로 처리를 위임할 수 있습니다.
- `Mapper.map` 시그니처에 `Options`를 추가했습니다.
- `Fetcher.Factory` 및 `Decoder.Factory`를 도입했습니다. 특정 `Fetcher`/`Decoder`가 적용 가능한지 확인하려면 팩토리를 사용하세요. 해당 `Fetcher`/`Decoder`가 적용 가능하지 않다면 `null`을 반환하면 됩니다.

## 비트맵 풀링(Bitmap pooling) 제거

Coil 2.x에서는 비트맵 풀링 및 관련 클래스(`BitmapPool`, `PoolableViewTarget`)가 삭제되었습니다. 삭제된 이유는 [여기](https://github.com/coil-kt/coil/discussions/1186#discussioncomment-2305528)를 참조하세요.