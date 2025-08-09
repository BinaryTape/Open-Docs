# Coil 2.x로 업그레이드

이 문서는 Coil 1.x에서 2.x로 업그레이드할 때의 주요 변경 사항과 해당 변경 사항을 처리하는 방법을 요약한 짧은 가이드입니다. 이 업그레이드 가이드는 모든 바이너리 또는 소스 비호환 변경 사항을 다루지는 않지만, 가장 중요한 변경 사항들을 다룹니다.

## 최소 API 21

Coil 2.x는 최소 API 21을 요구합니다. 이는 Compose와 OkHttp 4.x에도 필요한 최소 API 버전입니다.

## ImageRequest 기본 스케일

Coil 2.x는 `ImageRequest`의 기본 스케일을 `Scale.FILL`에서 `Scale.FIT`으로 변경합니다. 이 변경은 `ImageView`의 기본 `ScaleType` 및 `Image`의 기본 `ContentScale`과의 일관성을 유지하기 위해 이루어졌습니다. `ImageView`를 `ImageRequest.target`으로 설정하면 스케일은 여전히 자동으로 감지됩니다.

## Size 리팩터링

`Size`의 `width`와 `height`는 이제 `Int` 픽셀 값 대신 두 개의 `Dimension` 타입입니다. `Dimension`은 픽셀 값이거나 `Dimension.Undefined`일 수 있으며, 이는 정의되지 않거나(unbounded) 제한되지 않은 제약 조건을 나타냅니다. 예를 들어, 크기가 `Size(400, Dimension.Undefined)`라면 이는 이미지의 높이와 관계없이 너비를 400픽셀로 스케일링해야 함을 의미합니다. 픽셀 값(있는 경우)을 가져오려면 `pxOrElse` 확장 함수를 사용할 수 있습니다. 없는 경우에는 대체 값을 사용합니다.

```kotlin
val width = size.width.pxOrElse { -1 }
if (width > 0) {
    // Use the pixel value.
}
```

이 변경은 타겟이 하나의 제한 없는 차원을 가질 경우(예: `View`의 `ViewGroup.LayoutParams.WRAP_CONTENT` 또는 Compose의 `Constraints.Infinity`와 같이 한 차원이 무제한인 경우)에 대한 지원을 개선하기 위해 이루어졌습니다.

## Compose

Coil 2.x는 Compose 통합을 대폭 재작업하여 기능을 추가하고 안정성 및 성능을 향상시켰습니다.

Coil 1.x에서는 이미지를 로드하기 위해 `rememberImagePainter`를 사용했습니다.

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

Coil 2.x에서는 `rememberImagePainter`가 다음과 같은 변경 사항과 함께 `rememberAsyncImagePainter`로 변경되었습니다.

- `ImageRequest`를 구성하는 후행 람다(trailing lambda) 인자가 제거되었습니다.
- Coil 2.x에서 `rememberAsyncImagePainter`는 `Image`와 일관성을 유지하기 위해 기본적으로 `ContentScale.Fit`을 사용합니다. 반면 Coil 1.x에서는 기본값이 `ContentScale.Crop`이었습니다. 따라서 `Image`에 사용자 지정 `ContentScale`을 설정하는 경우, 이제 `rememberAsyncImagePainter`에도 이를 전달해야 합니다.

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

또한 Coil은 이제 `AsyncImage` 및 `SubcomposeAsyncImage` 컴포저블 함수를 제공하여 새로운 기능을 추가하고 `rememberAsyncImagePainter`의 일부 디자인 제약을 해결합니다. 전체 Compose 문서는 [여기](compose.md)에서 확인하세요.

## 디스크 캐시

Coil 2.x는 `imageLoader.diskCache`를 통해 접근할 수 있는 자체 공개 디스크 캐시 클래스를 가집니다. Coil 1.x는 OkHttp의 디스크 캐시에 의존했지만, 이제 더 이상 필요하지 않습니다.

1.x에서 디스크 캐시를 구성하려면 `CoilUtils.createDefaultCache`를 사용했습니다.

```kotlin
ImageLoader.Builder(context)
    .okHttpClient {
        OkHttpClient.Builder().cache(CoilUtils.createDefaultCache(context)).build()
    }
    .build()
```

Coil 2.x에서는 `ImageLoader`와 함께 사용할 때 `OkHttpClient`에 `Cache` 객체를 설정해서는 안 됩니다. 대신 다음과 같이 디스크 캐시 객체를 구성합니다.

```kotlin
ImageLoader.Builder(context)
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .build()
    }
    .build()
```

이 변경은 기능 추가 및 성능 향상을 위해 이루어졌습니다.

- 이미지 디코딩 중 스레드 인터럽션(thread interruption)을 지원합니다.
  - 스레드 인터럽션은 디코딩 작업을 빠르게 취소할 수 있도록 합니다. 이는 리스트를 빠르게 스크롤할 때 특히 중요합니다.
  - Coil은 사용자 지정 디스크 캐시를 사용하여 디코딩하기 전에 네트워크 소스가 디스크에 완전히 읽혔는지 확인할 수 있습니다. 데이터를 디스크에 쓰는 작업은 중단될 수 없으므로 이는 필수적입니다. 오직 디코딩 단계만 중단될 수 있습니다. OkHttp의 `Cache`는 디코딩 전에 모든 데이터가 디스크에 기록되었음을 보장할 수 없으므로 Coil 2.0과 함께 사용해서는 안 됩니다.
- `InputStream`을 지원하지 않거나 `File`에 직접 접근해야 하는 디코딩 API(예: `ImageDecoder`, `MediaMetadataRetriever`)를 위한 버퍼링/임시 파일 생성을 방지합니다.
- 공개 읽기/쓰기 `DiskCache` API를 추가합니다.

Coil 2.x에서는 `Cache-Control` 및 기타 캐시 헤더가 여전히 지원됩니다. 단, 캐시는 URL 일치 여부만 확인하므로 `Vary` 헤더는 예외입니다. 또한, 응답 코드가 [200..300) 범위인 응답만 캐시됩니다.

Coil 1.x에서 2.x로 업그레이드할 때, 내부 형식이 변경되었으므로 기존 디스크 캐시는 모두 지워집니다.

## 이미지 파이프라인 리팩터링

Coil 2.x는 이미지 파이프라인 클래스를 재구성하여 더 유연하게 만들었습니다. 다음은 변경 사항의 개략적인 목록입니다.

- 요청에 대한 메모리 캐시 키를 계산하는 새로운 클래스인 `Keyer`가 도입되었습니다. 이는 `Fetcher.key`를 대체합니다.
- `Mapper`, `Keyer`, `Fetcher`, 및 `Decoder`는 `null`을 반환하여 컴포넌트 목록의 다음 요소로 위임할 수 있습니다.
- `Mapper.map`의 시그니처에 `Options`가 추가되었습니다.
- `Fetcher.Factory`와 `Decoder.Factory`가 도입되었습니다. 특정 `Fetcher`/`Decoder`가 적용 가능한지 여부를 확인하기 위해 팩토리를 사용합니다. 해당 `Fetcher`/`Decoder`가 적용 불가능한 경우 `null`을 반환합니다.

## 비트맵 풀링(bitmap pooling) 제거

Coil 2.x는 비트맵 풀링과 관련 클래스(`BitmapPool`, `PoolableViewTarget`)를 제거했습니다. 제거 이유에 대해서는 [여기](https://github.com/coil-kt/coil/discussions/1186#discussioncomment-2305528)를 참조하세요.