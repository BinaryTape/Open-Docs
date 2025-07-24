# 변경 로그

## [3.3.0] - 2025년 7월 22일

-   **신규**: 앱이 백그라운드 상태일 때 Android에서 `MemoryCache.maxSize`를 제한하는 새로운 API를 도입합니다.
    -   `ImageLoader.Builder.memoryCacheMaxSizePercentWhileInBackground`가 설정된 경우, 앱이 백그라운드 상태일 때 `ImageLoader`의 메모리 캐시가 최대 크기의 일정 비율로 제한됩니다. 이 설정은 현재 기본적으로 비활성화되어 있습니다.
    -   앱이 백그라운드 상태가 되면 메모리 캐시에서 이미지가 잘라내어져 제한된 최대 크기에 도달하지만, 최근 잘라낸 이미지에 대한 메모리 캐시의 약한 참조는 영향을 받지 않습니다. 즉, 이미지가 현재 다른 곳(예: `AsyncImage`, `ImageView` 등)에서 참조되고 있다면 메모리 캐시에 여전히 존재합니다.
    -   이 API는 백그라운드 메모리 사용량을 줄이고, 앱이 더 일찍 종료되는 것을 방지하며, 사용자 기기의 메모리 압박을 줄이는 데 도움이 됩니다.
-   **신규**: `SvgDecoder`에 `Svg.Parser` 인수를 추가합니다.
    -   이를 통해 기본 SVG 파서가 요구 사항을 충족하지 않을 경우 사용자 지정 SVG 파서를 사용할 수 있습니다.
-   사용자 지정 밀도 승수를 제공하는 것을 지원하기 위해 `SvgDecoder`에 `density` 인수를 추가합니다.
-   `Uri`를 복사하고 수정하는 것을 지원하기 위해 `Uri.Builder`를 추가합니다.
-   테스트에서 Coil의 `Dispatchers.main.immediate` 사용을 오버라이드하는 것을 지원하기 위해 `ImageLoader.Builder.mainCoroutineContext`를 추가합니다.
-   `start` 이미지가 애니메이션 끝에서 참조 해제될 때 `CrossfadePainter.intrinsicSize`가 변경되는 문제를 수정합니다. 이는 `CrossfadeDrawable`의 동작과 일치합니다.
-   Java에서 `ImageLoaders.executeBlocking`에 접근할 수 없는 문제를 수정합니다.
-   `coil-network-ktor3`에서 `kotlinx.io`의 Okio 상호 운용 모듈을 사용합니다.
-   `kotlinx-datetime`을 `0.7.1`로 업데이트합니다.
    -   이 릴리스에는 `coil-network-cache-control` 모듈에만 영향을 미치는 바이너리 호환되지 않는 변경 사항이 포함되어 있습니다. 자세한 내용은 [여기](https://github.com/Kotlin/kotlinx-datetime?tab=readme-ov-file#deprecation-of-instant)를 참조하세요.
-   Kotlin을 2.2.0으로 업데이트합니다.
-   Compose를 1.8.2로 업데이트합니다.
-   Okio를 3.15.0으로 업데이트합니다.
-   Skiko를 0.9.4.2로 업데이트합니다.

## [3.2.0] - 2025년 5월 13일

`3.1.0` 이후 변경 사항:

-   **중요**: Compose `1.8.0`이 Java 11 바이트코드를 요구함에 따라 `coil-compose` 및 `coil-compose-core`도 이제 Java 11 바이트코드를 요구합니다. 활성화하는 방법은 [여기](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8-or-java-11)를 참조하세요.
-   `AsyncImagePreviewHandler`의 함수형 생성자가 `AsyncImagePainter.State.Loading` 대신 `AsyncImagePainter.State.Success`를 반환하도록 변경합니다.
-   `ConstraintsSizeResolver#size()`에서 취소 문제를 수정합니다.
-   R8로 빌드할 때 `PlatformContext` 누락 경고를 수정합니다.
-   기본 `FakeImageLoaderEngine` 응답이 반환될 때 `FakeImageLoaderEngine`이 `Transition.Factory.NONE`을 설정하지 않는 문제를 수정합니다.
-   `ColorImage`에서 실험적(experimental) 주석을 제거합니다.
-   `CacheControlCacheStrategy`에서 네트워크 헤더를 지연 방식으로 파싱합니다.
-   `CircleCropTransformation` 및 `RoundedCornersTransformation`이 공통 코드를 공유하도록 리팩터링합니다.
-   `ExifOrientationStrategy`가 `RESPECT_PERFORMANCE`가 아닌 경우 내부적으로 `BitmapFactory`를 사용하도록 대체합니다.
-   Kotlin을 2.1.20으로 업데이트합니다.
-   Compose를 1.8.0으로 업데이트합니다.
-   Okio를 3.11.0으로 업데이트합니다.
-   Skiko를 0.9.4로 업데이트합니다.
-   Coroutines를 1.10.2로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.37.3으로 업데이트합니다.

`3.2.0-rc02` 이후 변경 사항:

-   `ExifOrientationStrategy`가 `RESPECT_PERFORMANCE`가 아닌 경우 내부적으로 `BitmapFactory`를 사용하도록 대체합니다.
-   Compose를 1.8.0으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.37.3으로 업데이트합니다.

## [3.2.0-rc02] - 2025년 4월 26일

-   비-JVM 타겟에서 `KtorNetworkFetcherFactory` (Ktor 3)를 사용하여 이미지를 로드할 때 이미지 요청이 `ClosedByteChannelException`으로 실패하는 문제를 수정합니다.

## [3.2.0-rc01] - 2025년 4월 24일

-   **중요**: Compose `1.8.0`이 Java 11 바이트코드를 요구함에 따라 `coil-compose` 및 `coil-compose-core`도 이제 Java 11 바이트코드를 요구합니다. 활성화하는 방법은 [여기](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8-or-java-11)를 참조하세요.
-   `AsyncImagePreviewHandler`의 함수형 생성자가 `AsyncImagePainter.State.Loading` 대신 `AsyncImagePainter.State.Success`를 반환하도록 변경합니다.
-   `ConstraintsSizeResolver#size()`에서 취소 문제를 수정합니다.
-   R8로 빌드할 때 `PlatformContext` 누락 경고를 수정합니다.
-   기본 `FakeImageLoaderEngine` 응답이 반환될 때 `FakeImageLoaderEngine`이 `Transition.Factory.NONE`을 설정하지 않는 문제를 수정합니다.
-   `ColorImage`에서 실험적(experimental) 주석을 제거합니다.
-   `CacheControlCacheStrategy`에서 네트워크 헤더를 지연 방식으로 파싱합니다.
-   `CircleCropTransformation` 및 `RoundedCornersTransformation`이 공통 코드를 공유하도록 리팩터링합니다.
-   `coil-network-ktor2` 및 `coil-network-ktor3`에서 `kotlinx.io`의 Okio 상호 운용 모듈을 사용합니다.
-   Kotlin을 2.1.20으로 업데이트합니다.
-   Compose를 1.8.0-rc01으로 업데이트합니다.
-   Okio를 3.11.0으로 업데이트합니다.
-   Skiko를 0.9.4로 업데이트합니다.
-   Coroutines를 1.10.2로 업데이트합니다.

## [3.1.0] - 2025년 2월 4일

-   `AsyncImage` 성능을 개선합니다.
    -   컴포저블이 인스턴스화되거나 재사용되는지에 따라 런타임 성능이 25%에서 40% 향상됩니다. 할당량도 35%에서 48% 감소합니다. 더 자세한 정보는 [여기](https://github.com/coil-kt/coil/pull/2795)를 참조하세요.
-   `ColorImage`를 추가하고 `FakeImage`를 지원 중단합니다.
    -   `ColorImage`는 테스트 및 미리보기에서 가짜 값을 반환하는 데 유용합니다. `FakeImage`와 동일한 사용 사례를 해결하지만, `coil-test` 대신 `coil-core`에서 더 쉽게 접근할 수 있습니다.
-   `coil-compose-core`의 `Dispatchers.Main.immediate`에 대한 의존성을 제거합니다.
    -   이는 `AsyncImagePainter`가 Paparazzi 및 Roborazzi 스크린샷 테스트에서 `ImageRequest`를 동기적으로 실행하지 않던 경우도 수정합니다.
-   `data:[<mediatype>][;base64],<data>` 형식의 [데이터 URI](https://www.ietf.org/rfc/rfc2397.txt)에 대한 지원을 추가합니다.
-   GIF의 메타데이터에서 인코딩된 반복 횟수를 사용하는 것을 지원하기 위해 `AnimatedImageDecoder.ENCODED_LOOP_COUNT`를 추가합니다.
-   사용자 지정 확장 기능을 지원하기 위해 `NetworkRequest`에 `Extras`를 추가합니다.
-   `DiskCache.Builder.cleanupCoroutineContext`를 추가하고 `DiskCache.Builder.cleanupDispatcher`를 지원 중단합니다.
-   API 29 이상에서 `android.graphics.ImageDecoder` 사용을 선택적으로 비활성화하기 위해 `ImageLoader.Builder.imageDecoderEnabled`를 추가합니다.
-   `ImageRequest`의 데이터 유형에 등록된 `Keyer`가 없으면 경고를 기록합니다.
-   `CrossfadePainter`를 공개 API로 만듭니다.
-   모든 멀티플랫폼 타겟에서 `Transformation`을 지원합니다.
-   `CacheControlCacheStrategy`에서 `Expires` 헤더 값으로 0을 지원합니다.
-   `AsyncImage`/`SubcomposeAsyncImage`/`rememberAsyncImage`에서 `ContentScale`이 `None`으로 변경되거나 `None`에서 변경될 때 새 `ImageRequest`를 시작하지 않는 문제를 수정합니다.
-   Kotlin을 2.1.10으로 업데이트합니다.
    -   참고: 이 릴리스는 [LLVM 업데이트](https://kotlinlang.org/docs/whatsnew21.html#llvm-update-from-11-1-0-to-16-0-0)로 인해 Kotlin/Native를 사용하는 경우 Kotlin 2.1.0 이상으로 컴파일해야 합니다.
-   Compose를 1.7.3으로 업데이트합니다.
-   `androidx.core`를 1.15.0으로 업데이트합니다.

## [3.0.4] - 2024년 11월 25일

-   Android Studio 미리보기에서 벡터 드로어블이 렌더링되지 않는 문제를 수정합니다.
-   크기가 `maxBitmapSize`를 초과하는 요청에 대해 잠재적인 메모리 캐시 미스 문제를 수정합니다.
-   Android에서 `FakeImage`가 렌더링되지 않는 문제를 수정합니다.
-   `AsyncImage`/`rememberAsyncImagePainter`/`SubcomposeAsyncImage`와 함께 사용될 때 요청의 `Transformation`이 변경되면 새 이미지 요청을 시작하지 않는 문제를 수정합니다.
-   `ScaleDrawable` 및 `CrossfadeDrawable`이 틴트 상태를 따르지 않는 문제를 수정합니다.
-   `ImageDecoder`가 부분적인 이미지 소스를 디코딩할 수 있도록 허용합니다. 이는 `BitmapFactory`의 동작과 일치합니다.
-   디코딩 후 `Bitmap.prepareToDraw()`가 호출되지 않는 문제를 수정합니다.
-   `SvgDecoder`는 래스터화되지 않은 이미지에 대해 `isSampled = true`를 반환해서는 안 됩니다.
-   즉시 메인 디스패처를 사용할 수 없는 경우 Compose에서 `Dispatchers.Unconfined`를 사용하도록 대체합니다. 이는 미리보기/테스트 환경에서만 사용됩니다.
-   Ktor 2를 `2.3.13`으로 업데이트합니다.

## [3.0.3] - 2024년 11월 14일

-   `ImageView`의 `ScaleType`에 따라 `ImageRequest.scale`이 설정되는 문제를 수정합니다.
-   `DiskCache`가 파일을 삭제한 후 항목 제거를 추적하지 않는 엣지 케이스를 수정합니다.
-   오류 기록 시 예외(throwable)를 `Logger`로 전달합니다.
-   `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`를 `kotlin-stdlib`로 대체하지 않도록 합니다.

## [3.0.2] - 2024년 11월 9일

-   Android에서 사용자 지정 `CacheStrategy`로 `OkHttpNetworkFetcherFactory`를 호출할 때 충돌이 발생하는 문제를 수정합니다.
-   `CacheControlCacheStrategy`가 캐시 항목의 수명을 잘못 계산하는 문제를 수정합니다.
-   `ImageRequest.bitmapConfig`가 `ARGB_8888` 또는 `HARDWARE`인 경우에만 API 28 이상에서 적용되는 문제를 수정합니다.

## [3.0.1] - 2024년 11월 7일

-   하드웨어 비트맵 기반 `BitmapImage`로 `Image.toBitmap`을 호출할 때 충돌이 발생하는 문제를 수정합니다.
-   `AsyncImageModelEqualityDelegate.Default`가 `ImageRequest`가 아닌 모델에 대해 등가성(equality) 비교를 잘못하는 문제를 수정합니다.

## [3.0.0] - 2024년 11월 4일

Coil 3.0.0은 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)에 대한 완전한 지원을 포함하는 Coil의 다음 주요 릴리스입니다.

[3.0.0의 모든 개선 사항 및 중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요.

`3.0.0-rc02` 이후 변경 사항:

-   남아있는 지원 중단된 메서드를 제거합니다.

## [3.0.0-rc02] - 2024년 10월 28일

[3.x의 모든 개선 사항 및 중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요. `3.0.0-rc01` 이후 변경 사항:

-   `BlackholeDecoder`를 추가합니다. 이는 [디스크 캐시 전용 사전 로드](https://coil-kt.github.io/coil/faq/#how-do-i-preload-an-image)를 단순화합니다.
-   `ConstraintsSizeResolver` 및 `DrawScopeSizeResolver`에 대한 `remember` 함수를 추가합니다.
-   `AsyncImage`의 파라미터에서 `EqualityDelegate`를 제거합니다. 대신 `LocalAsyncImageModelEqualityDelegate`를 통해 설정되어야 합니다.
-   상위 컴포저블이 `IntrinsicSize`를 사용할 때 `AsyncImage`가 렌더링되지 않는 문제를 수정합니다.
-   `AsyncImagePainter`에 자식 페인터가 없을 때 `AsyncImage`가 사용 가능한 제약 조건을 채우는 문제를 수정합니다.
-   `EqualityDelegate`가 무시되어 상태가 관찰될 때 `rememberAsyncImagePainter`가 무한히 다시 구성되는 문제를 수정합니다.
-   특수 문자가 포함된 `File`/`Path` 경로 파싱 문제를 수정합니다.
-   `VideoFrameDecoder`에서 사용자 지정 `FileSystem` 구현을 사용하는 문제를 수정합니다.
-   Ktor를 `3.0.0`으로 업데이트합니다.
-   `androidx.annotation`을 `1.9.0`으로 업데이트합니다.

## [3.0.0-rc01] - 2024년 10월 8일

[3.x의 모든 개선 사항 및 중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요. `3.0.0-alpha10` 이후 변경 사항:

-   **BREAKING** 기본적으로 `addLastModifiedToFileCacheKey`를 비활성화하고 요청별로 설정할 수 있도록 허용합니다. 이 동작은 동일한 플래그로 다시 활성화할 수 있습니다.
-   **신규**: [`Cache-Control` 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) 지원을 구현하는 새로운 `coil-network-cache-control` 아티팩트를 도입합니다.
-   **신규**: `SvgDecoder.Factory`에 `scaleToDensity` 속성을 추가합니다. 이 속성은 고유 치수를 가진 SVG가 기기 밀도에 의해 곱해지도록 보장합니다 (Android에서만 지원됨).
-   `ExifOrientationPolicy`의 이름을 `ExifOrientationStrategy`로 변경합니다.
-   가져올 때 `MemoryCache`에서 공유할 수 없는 이미지를 제거합니다.
-   `ConstraintsSizeResolver`를 공개 API로 만듭니다.
-   `setSingletonImageLoaderFactory`를 안정화합니다.
-   `coil-network-ktor3`에서 최적화된 JVM I/O 함수를 복원합니다.
-   MIME 유형 목록에 `pdf`를 추가합니다.
-   컴파일 SDK를 35로 업데이트합니다.
-   Kotlin을 2.0.20으로 업데이트합니다.
-   Okio를 3.9.1으로 업데이트합니다.

## [3.0.0-alpha10] - 2024년 8월 7일

-   **BREAKING**: `ImageLoader.Builder.networkObserverEnabled`를 `NetworkFetcher`에 대한 `ConnectivityChecker` 인터페이스로 대체합니다.
    -   네트워크 옵저버를 비활성화하려면 `KtorNetworkFetcherFactory`/`OkHttpNetworkFetcherFactory`의 생성자에 `ConnectivityChecker.ONLINE`을 전달하세요.
-   **신규**: 모든 플랫폼에서 [Compose Multiplatform 리소스](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-images-resources.html) 로드를 지원합니다. 리소스를 로드하려면 `Res.getUri`를 사용하세요:

```kotlin
AsyncImage(
    model = Res.getUri("drawable/image.jpg"),
    contentDescription = null,
)
```

-   `ImageLoader` 및 `ImageRequest`에 `maxBitmapSize` 속성을 추가합니다.
    -   이 속성의 기본값은 4096x4096이며, 할당된 비트맵의 차원에 대한 안전한 상한을 제공합니다. 이는 `Size.ORIGINAL`을 사용하여 매우 큰 이미지를 실수로 로드하여 메모리 부족 예외가 발생하는 것을 방지하는 데 도움이 됩니다.
-   `ExifOrientationPolicy`를 사용자 지정 정책을 지원하는 인터페이스로 전환합니다.
-   Windows 파일 경로의 `Uri` 처리 문제를 수정합니다.
-   `Image` API에서 `@ExperimentalCoilApi`를 제거합니다.
-   Kotlin을 2.0.10으로 업데이트합니다.

## [3.0.0-alpha09] - 2024년 7월 23일

-   **BREAKING**: `io.coil-kt.coil3:coil-network-ktor` 아티팩트의 이름을 Ktor 2.x에 의존하는 `io.coil-kt.coil3:coil-network-ktor2`로 변경합니다. 또한 Ktor 3.x에 의존하는 `io.coil-kt.coil3:coil-network-ktor3`를 도입합니다. `wasmJs` 지원은 Ktor 3.x에서만 사용 가능합니다.
-   **신규**: 이미지 요청을 수동으로 다시 시작하기 위해 `AsyncImagePainter.restart()`를 추가합니다.
-   `NetworkClient` 및 관련 클래스에서 `@ExperimentalCoilApi`를 제거합니다.
-   불필요한 `Extras` 및 `Map` 할당을 방지하도록 `ImageRequest`를 최적화합니다.

## [2.7.0] - 2024년 7월 17일

-   `ImageLoader.execute`, `AsyncImage`, `SubcomposeAsyncImage` 및 `rememberAsyncImagePainter`의 성능을 개선하기 위해 내부 코루틴 사용을 약간 최적화합니다. ([#2205](https://github.com/coil-kt/coil/pull/2205))
-   청크된 응답에 대한 중복 네트워크 호출 문제를 수정합니다. ([#2363](https://github.com/coil-kt/coil/pull/2363))
-   Kotlin을 2.0.0으로 업데이트합니다.
-   Compose UI를 1.6.8로 업데이트합니다.
-   Okio를 3.9.0으로 업데이트합니다.

## [3.0.0-alpha08] - 2024년 7월 8일

-   **BREAKING**: `ImageRequest` 및 `ImageLoader`의 `dispatcher` 메서드 이름을 `coroutineContext`로 변경합니다. 예를 들어, `ImageRequest.Builder.dispatcher`는 이제 `ImageRequest.Builder.coroutineContext`입니다. 이 메서드는 이제 모든 `CoroutineContext`를 허용하며 더 이상 `Dispatcher`를 요구하지 않으므로 이름이 변경되었습니다.
-   수정: 경쟁 조건으로 인해 발생할 수 있는 `IllegalStateException: Reading a state that was created after the snapshot was taken or in a snapshot that has not yet been applied` 문제를 수정합니다.
    -   참고: 이로 인해 `Dispatchers.Main.immediate`에 대한 약한 의존성이 다시 도입됩니다. 결과적으로 JVM에서 [`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/)에 대한 의존성을 다시 추가해야 합니다. 임포트되지 않은 경우 `ImageRequest`는 즉시 디스패치되지 않으며, `ImageRequest.placeholder`를 설정하거나 메모리 캐시에서 해결하기 전에 한 프레임의 지연이 발생합니다.

## [3.0.0-alpha07] - 2024년 6월 26일

-   **BREAKING**: `AsyncImagePainter`는 기본적으로 `onDraw`를 더 이상 기다리지 않고 `Size.ORIGINAL`을 사용합니다.
    -   이는 [Roborazzi/Paparazzi와의 호환성 문제](https://github.com/coil-kt/coil/issues/1910)를 수정하고 전반적인 테스트 안정성을 향상시킵니다.
    -   `onDraw`를 다시 기다리려면 `DrawScopeSizeResolver`를 `ImageRequest.sizeResolver`로 설정하세요.
-   **BREAKING**: 멀티플랫폼 `Image` API를 리팩터링합니다. 특히 `asCoilImage`의 이름이 `asImage`로 변경되었습니다.
-   **BREAKING**: `AsyncImagePainter.state`가 `StateFlow<AsyncImagePainter.State>`로 변경되었습니다. 해당 값을 관찰하려면 `collectAsState`를 사용하세요. 이는 성능을 향상시킵니다.
-   **BREAKING**: `AsyncImagePainter.imageLoader` 및 `AsyncImagePainter.request`가 `StateFlow<AsyncImagePainter.Inputs>`로 결합되었습니다. 해당 값을 관찰하려면 `collectAsState`를 사용하세요. 이는 성능을 향상시킵니다.
-   **BREAKING**: 리소스 축소 최적화를 방해하므로 `android.resource://example.package.name/drawable/image` URI에 대한 지원을 제거합니다.
    -   여전히 해당 기능이 필요한 경우 [컴포넌트 레지스트리에 `ResourceUriMapper`를 수동으로 포함](https://github.com/coil-kt/coil/blob/main/coil-core/src/androidInstrumentedTest/kotlin/coil3/map/ResourceUriMapper.kt)할 수 있습니다.
-   **신규**: `AsyncImagePreviewHandler`를 도입하여 `AsyncImagePainter`의 미리보기 렌더링 동작을 제어하는 것을 지원합니다.
    -   미리보기 동작을 오버라이드하려면 `LocalAsyncImagePreviewHandler`를 사용하세요.
    -   이 변경 및 기타 `coil-compose` 개선의 일환으로, `AsyncImagePainter`는 이제 `ImageRequest.placeholder`를 표시하는 것으로 기본 설정하는 대신 기본적으로 `ImageRequest` 실행을 시도합니다. 미리보기 환경에서는 [네트워크 또는 파일을 사용하는 요청이 실패할 것으로 예상](https://developer.android.com/develop/ui/compose/tooling/previews#preview-limitations)되지만, Android 리소스는 작동해야 합니다.
-   **신규**: 프레임 인덱스별 비디오 이미지 추출을 지원합니다. ([#2183](https://github.com/coil-kt/coil/pull/2183))
-   **신규**: 모든 `CoroutineDispatcher` 메서드에 `CoroutineContext` 전달을 지원합니다. ([#2241](https://github.com/coil-kt/coil/pull/2241)).
-   **신규**: JS 및 WASM JS에서 약한 참조 메모리 캐시를 지원합니다.
-   Compose에서 `Dispatchers.Main.immediate`로 디스패치하지 않도록 합니다. 부작용으로 JVM에서 [`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/)를 더 이상 임포트할 필요가 없습니다.
-   성능 향상을 위해 Compose에서 `async`를 호출하고 디스포저블을 생성하지 않도록 합니다 (@mlykotom님께 감사드립니다!). ([#2205](https://github.com/coil-kt/coil/pull/2205))
-   전역 `ImageLoader`의 추가 데이터를 `Options`로 전달하는 문제를 수정합니다. ([#2223](https://github.com/coil-kt/coil/pull/2223))
-   `crossfade(false)`가 비-Android 타겟에서 작동하지 않는 문제를 수정합니다.
-   VP8X 기능 플래그 바이트 오프셋 문제를 수정합니다. ([#2199](https://github.com/coil-kt/coil/pull/2199)).
-   비-Android 타겟의 `SvgDecoder`가 그리기 시간에 이미지를 렌더링하는 대신 비트맵으로 렌더링하도록 전환합니다. 이는 성능을 향상시킵니다.
    -   이 동작은 `SvgDecoder(renderToBitmap)`을 사용하여 제어할 수 있습니다.
-   `ScaleDrawable`을 `coil-gif`에서 `coil-core`로 이동합니다.
-   Kotlin을 2.0.0으로 업데이트합니다.
-   Compose를 1.6.11으로 업데이트합니다.
-   Okio를 3.9.0으로 업데이트합니다.
-   Skiko를 0.8.4로 업데이트합니다.
-   [3.x의 중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요.

## [3.0.0-alpha06] - 2024년 2월 29일

-   Skiko를 0.7.93으로 다운그레이드합니다.
-   [3.x의 중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요.

## [3.0.0-alpha05] - 2024년 2월 28일

-   **신규**: `wasmJs` 타겟을 지원합니다.
-   비-Android 플랫폼에서 `Bitmap`으로 백업되지 않은 `Image`를 그리는 것을 지원하기 위해 `DrawablePainter` 및 `DrawableImage`를 생성합니다.
    -   `Image` API는 실험적이며 알파 릴리스 간에 변경될 가능성이 있습니다.
-   `ContentPainterModifier`가 `Modifier.Node`를 구현하도록 업데이트합니다.
-   수정: 컴포넌트 콜백 및 네트워크 옵저버를 백그라운드 스레드에서 지연 등록하도록 합니다. 이는 일반적으로 메인 스레드에서 발생하는 느린 초기화 문제를 수정합니다.
-   수정: `ImageRequest`가 `ImageLoader.Builder.placeholder/error/fallback`을 사용하지 않는 문제를 수정합니다.
-   Compose를 1.6.0으로 업데이트합니다.
-   Coroutines를 1.8.0으로 업데이트합니다.
-   Okio를 3.8.0으로 업데이트합니다.
-   Skiko를 0.7.94로 업데이트합니다.
-   [3.x의 중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요.

## [2.6.0] - 2024년 2월 23일

-   `rememberAsyncImagePainter`, `AsyncImage` 및 `SubcomposeAsyncImage`를 [재시작 및 스킵 가능하도록](https://developer.android.com/jetpack/compose/performance/stability#functions) 만듭니다. 이는 컴포저블의 인수가 변경되지 않는 한 다시 구성되는 것을 방지하여 성능을 향상시킵니다.
    -   `model`이 다시 구성을 트리거할지 여부를 제어하기 위해 `rememberAsyncImagePainter`, `AsyncImage` 및 `SubcomposeAsyncImage`에 선택적 `modelEqualityDelegate` 인수를 추가합니다.
-   `ContentPainterModifier`가 `Modifier.Node`를 구현하도록 업데이트합니다.
-   수정: 컴포넌트 콜백 및 네트워크 옵저버를 백그라운드 스레드에서 지연 등록하도록 합니다. 이는 일반적으로 메인 스레드에서 발생하는 느린 초기화 문제를 수정합니다.
-   수정: `ImageRequest.listener` 또는 `ImageRequest.target`이 변경되면 `rememberAsyncImagePainter`, `AsyncImage` 및 `SubcomposeAsyncImage`에서 새 이미지 요청을 다시 시작하는 것을 방지합니다.
-   수정: `AsyncImagePainter`에서 이미지 요청을 두 번 관찰하지 않도록 합니다.
-   Kotlin을 1.9.22로 업데이트합니다.
-   Compose를 1.6.1로 업데이트합니다.
-   Okio를 3.8.0으로 업데이트합니다.
-   `androidx.collection`을 1.4.0으로 업데이트합니다.
-   `androidx.lifecycle`을 2.7.0으로 업데이트합니다.

## [3.0.0-alpha04] - 2024년 2월 1일

-   **Breaking**: `OkHttpNetworkFetcherFactory` 및 `KtorNetworkFetcherFactory`의 공개 API에서 `Lazy`를 제거합니다.
-   `OkHttpNetworkFetcherFactory`에서 `OkHttpClient` 대신 `Call.Factory`를 노출합니다.
-   `NetworkResponseBody`가 `ByteString`을 래핑하도록 전환합니다.
-   Compose를 1.5.12로 다운그레이드합니다.
-   [중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요.

## [3.0.0-alpha03] - 2024년 1월 20일

-   **Breaking**: `coil-network`의 이름이 `coil-network-ktor`로 변경되었습니다. 또한 OkHttp에 의존하고 Ktor 엔진을 지정할 필요가 없는 새로운 `coil-network-okhttp` 아티팩트가 있습니다.
    -   어떤 아티팩트를 임포트하는지에 따라 `KtorNetworkFetcherFactory` 또는 `OkHttpNetworkFetcherFactory`를 사용하여 `Fetcher.Factory`를 수동으로 참조할 수 있습니다.
-   Apple 플랫폼에서 `NSUrl` 로드를 지원합니다.
-   `AsyncImage`에 `clipToBounds` 파라미터를 추가합니다.
-   [중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요.

## [3.0.0-alpha02] - 2024년 1월 10일

-   **Breaking**: `coil-gif`, `coil-network`, `coil-svg`, `coil-video`의 패키지가 업데이트되어 모든 클래스가 각각 `coil.gif`, `coil.network`, `coil.svg`, `coil.video`의 일부가 되었습니다. 이는 다른 아티팩트와의 클래스 이름 충돌을 방지하는 데 도움이 됩니다.
-   **Breaking**: `ImageDecoderDecoder`의 이름이 `AnimatedImageDecoder`로 변경되었습니다.
-   **신규**: `coil-gif`, `coil-network`, `coil-svg`, `coil-video`의 구성 요소가 이제 각 `ImageLoader`의 `ComponentRegistry`에 자동으로 추가됩니다.
    -   분명히 말하자면, `3.0.0-alpha01`과 달리 **`ComponentRegistry`에 `NetworkFetcher.Factory()`를 수동으로 추가할 필요가 없습니다.** 단순히 `io.coil-kt.coil3:coil-network:[version]` 및 [Ktor 엔진](https://ktor.io/docs/http-client-engines.html#dependencies)을 임포트하는 것만으로도 네트워크 이미지를 로드하기에 충분합니다.
    -   이러한 구성 요소를 `ComponentRegistry`에 수동으로 추가해도 안전합니다. 수동으로 추가된 모든 구성 요소는 자동으로 추가된 구성 요소보다 우선합니다.
    -   원하는 경우 `ImageLoader.Builder.serviceLoaderEnabled(false)`를 사용하여 이 동작을 비활성화할 수 있습니다.
-   **신규**: 모든 플랫폼에서 `coil-svg`를 지원합니다. Android에서는 [AndroidSVG](https://bigbadaboom.github.io/androidsvg/)에 의해, 비-Android 플랫폼에서는 [SVGDOM](https://api.skia.org/classSkSVGDOM.html)에 의해 구동됩니다.
-   Coil은 이제 Android의 [`ImageDecoder`](https://developer.android.com/reference/android/graphics/ImageDecoder) API를 내부적으로 사용하며, 이는 파일, 리소스 또는 콘텐츠 URI에서 직접 디코딩할 때 성능 이점이 있습니다.
-   수정: 여러 `coil3.Uri` 파싱 문제를 수정합니다.
-   [중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요.

## [3.0.0-alpha01] - 2023년 12월 30일

-   **신규**: [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)을 지원합니다. Coil은 이제 Android, JVM, iOS, macOS 및 Javascript를 지원하는 Kotlin 멀티플랫폼 라이브러리입니다.
-   Coil의 Maven 좌표는 `io.coil-kt.coil3`로 업데이트되었고, 임포트는 `coil3`로 업데이트되었습니다. 이를 통해 Coil 3은 바이너리 호환성 문제 없이 Coil 2와 나란히 실행될 수 있습니다. 예를 들어, `io.coil-kt:coil:[version]`은 이제 `io.coil-kt.coil3:coil:[version]`입니다.
-   `coil-base` 및 `coil-compose-base` 아티팩트의 이름이 각각 `coil-core` 및 `coil-compose-core`로 변경되어 Coroutines, Ktor 및 AndroidX에서 사용되는 명명 규칙과 일치하도록 합니다.
-   [중요 변경 사항에 대한 전체 목록은 업그레이드 가이드](https://coil-kt.github.io/coil/upgrading_to_coil3/)를 참조하세요.

## [2.5.0] - 2023년 10월 30일

-   **신규**: `coil-video`에서 `MediaDataSource` 구현 디코딩을 지원하기 위해 `MediaDataSourceFetcher.Factory`를 추가합니다. ([#1795](https://github.com/coil-kt/coil/pull/1795))
-   `SHIFT6m` 기기를 하드웨어 비트맵 차단 목록에 추가합니다. ([#1812](https://github.com/coil-kt/coil/pull/1812))
-   수정: 제한 없는 차원을 가진 크기를 반환하는 페인터에 대비합니다. ([#1826](https://github.com/coil-kt/coil/pull/1826))
-   수정: 캐시된 헤더에 비-ASCII 문자가 포함된 경우 `304 Not Modified` 이후 디스크 캐시 로드가 실패하는 문제를 수정합니다. ([#1839](https://github.com/coil-kt/coil/pull/1839))
-   수정: `FakeImageEngine`이 인터셉터 체인의 요청을 업데이트하지 않는 문제를 수정합니다. ([#1905](https://github.com/coil-kt/coil/pull/1905))
-   컴파일 SDK를 34로 업데이트합니다.
-   Kotlin을 1.9.10으로 업데이트합니다.
-   Coroutines를 1.7.3으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.32.0으로 업데이트합니다.
-   `androidx.annotation`을 1.7.0으로 업데이트합니다.
-   `androidx.compose.foundation`을 1.5.4로 업데이트합니다.
-   `androidx.core`를 1.12.0으로 업데이트합니다.
-   `androidx.exifinterface:exifinterface`를 1.3.6으로 업데이트합니다.
-   `androidx.lifecycle`을 2.6.2로 업데이트합니다.
-   `com.squareup.okhttp3`를 4.12.0으로 업데이트합니다.
-   `com.squareup.okio`를 3.6.0으로 업데이트합니다.

## [2.4.0] - 2023년 5월 21일

-   `DiskCache`의 `get`/`edit` 이름을 `openSnapshot`/`openEditor`로 변경합니다.
-   `AsyncImagePainter`에서 `ColorDrawable`을 `ColorPainter`로 자동으로 변환하지 않도록 합니다.
-   간단한 `AsyncImage` 오버로드에 `@NonRestartableComposable` 주석을 추가합니다.
-   수정: `ImageSource`에서 `Context.cacheDir`을 지연 방식으로 호출합니다.
-   수정: `coil-bom` 게시 문제를 수정합니다.
-   수정: 하드웨어 비트맵이 비활성화된 경우 비트맵 구성을 항상 `ARGB_8888`로 설정하는 문제를 수정합니다.
-   Kotlin을 1.8.21으로 업데이트합니다.
-   Coroutines를 1.7.1으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.30.1으로 업데이트합니다.
-   `androidx.compose.foundation`을 1.4.3으로 업데이트합니다.
-   `androidx.profileinstaller:profileinstaller`를 1.3.1으로 업데이트합니다.
-   `com.squareup.okhttp3`를 4.11.0으로 업데이트합니다.

## [2.3.0] - 2023년 3월 25일

-   **신규**: `FakeImageLoaderEngine`을 포함하는 새로운 `coil-test` 아티팩트를 도입합니다. 이 클래스는 테스트에서 일관되고 동기적인(메인 스레드에서) 응답을 보장하기 위해 이미지 로더 응답을 하드코딩하는 데 유용합니다. 자세한 내용은 [여기](https://coil-kt.github.io/coil/testing)를 참조하세요.
-   **신규**: `coil-base` (Coil의 자식 모듈) 및 `coil-compose-base` (Coil-Compose의 자식 모듈)에 [베이스라인 프로필](https://developer.android.com/topic/performance/baselineprofiles/overview)을 추가합니다.
    -   이는 Coil의 런타임 성능을 개선하며, 앱에서 Coil이 어떻게 사용되는지에 따라 [더 나은 프레임 타이밍](https://github.com/coil-kt/coil/tree/main/coil-benchmark/benchmark_output.md)을 제공해야 합니다.
-   수정: 인코딩된 데이터가 포함된 `file://` URI 파싱 문제를 수정합니다. [#1601](https://github.com/coil-kt/coil/pull/1601)
-   수정: `DiskCache`가 존재하지 않는 디렉토리가 전달된 경우 최대 크기를 올바르게 계산하도록 수정합니다. [#1620](https://github.com/coil-kt/coil/pull/1620)
-   `Coil.reset`을 공개 API로 만듭니다. [#1506](https://github.com/coil-kt/coil/pull/1506)
-   Java 기본 메서드 생성을 활성화합니다. [#1491](https://github.com/coil-kt/coil/pull/1491)
-   Kotlin을 1.8.10으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.30.0으로 업데이트합니다.
-   `androidx.annotation`을 1.6.0으로 업데이트합니다.
-   `androidx.appcompat:appcompat-resources`를 1.6.1으로 업데이트합니다.
-   `androidx.compose.foundation`을 1.4.0으로 업데이트합니다.
-   `androidx.core`를 1.9.0으로 업데이트합니다.
-   `androidx.exifinterface:exifinterface`를 1.3.6으로 업데이트합니다.
-   `androidx.lifecycle`을 2.6.1으로 업데이트합니다.
-   `okio`를 3.3.0으로 업데이트합니다.

## [2.2.2] - 2022년 10월 1일

-   이미지 로더가 시스템 콜백을 등록하기 전에 완전히 초기화되도록 합니다. [#1465](https://github.com/coil-kt/coil/pull/1465)
-   API 30 이상에서 밴딩을 방지하기 위해 `VideoFrameDecoder`에 선호하는 비트맵 구성을 설정합니다. [#1487](https://github.com/coil-kt/coil/pull/1487)
-   `FileUriMapper`에서 `#`가 포함된 경로 파싱 문제를 수정합니다. [#1466](https://github.com/coil-kt/coil/pull/1466)
-   디스크 캐시에서 비-ASCII 헤더가 포함된 응답을 읽는 문제를 수정합니다. [#1468](https://github.com/coil-kt/coil/pull/1468)
-   에셋 하위 폴더 내에서 비디오 디코딩 문제를 수정합니다. [#1489](https://github.com/coil-kt/coil/pull/1489)
-   `androidx.annotation`을 1.5.0으로 업데이트합니다.

## [2.2.1] - 2022년 9월 8일

-   수정: `RoundedCornersTransformation`이 이제 `input` 비트맵을 올바르게 스케일링합니다.
-   `kotlin-parcelize` 플러그인에 대한 의존성을 제거합니다.
-   컴파일 SDK를 33으로 업데이트합니다.
-   [#1423](https://github.com/coil-kt/coil/issues/1423) 문제를 해결하기 위해 `androidx.appcompat:appcompat-resources`를 1.4.2로 다운그레이드합니다.

## [2.2.0] - 2022년 8월 16일

-   **신규**: 비디오 프레임을 비디오 길이의 백분율로 지정하는 것을 지원하기 위해 `coil-video`에 `ImageRequest.videoFramePercent`를 추가합니다.
-   **신규**: `BitmapFactoryDecoder`가 EXIF 방향 데이터를 처리하는 방법을 구성하기 위해 `ExifOrientationPolicy`를 추가합니다.
-   수정: `RoundedCornersTransformation`에 정의되지 않은 차원을 가진 크기가 전달된 경우 예외를 발생시키지 않도록 합니다.
-   수정: GIF의 프레임 지연을 하나의 부호 있는 바이트 대신 두 개의 부호 없는 바이트로 읽도록 합니다.
-   Kotlin을 1.7.10으로 업데이트합니다.
-   Coroutines를 1.6.4로 업데이트합니다.
-   Compose를 1.2.1으로 업데이트합니다.
-   OkHttp를 4.10.0으로 업데이트합니다.
-   Okio를 3.2.0으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.25.1으로 업데이트합니다.
-   `androidx.annotation`을 1.4.0으로 업데이트합니다.
-   `androidx.appcompat:appcompat-resources`를 1.5.0으로 업데이트합니다.
-   `androidx.core`를 1.8.0으로 업데이트합니다.

## [2.1.0] - 2022년 5월 17일

-   **신규**: `ByteArray` 로드를 지원합니다. ([#1202](https://github.com/coil-kt/coil/pull/1202))
-   **신규**: `ImageRequest.Builder.css`를 사용하여 SVG에 사용자 지정 CSS 규칙을 설정하는 것을 지원합니다. ([#1210](https://github.com/coil-kt/coil/pull/1210))
-   수정: `GenericViewTarget`의 private 메서드를 protected로 전환합니다. ([#1273](https://github.com/coil-kt/coil/pull/1273))
-   컴파일 SDK를 32로 업데이트합니다. ([#1268](https://github.com/coil-kt/coil/pull/1268))

## [2.0.0] - 2022년 5월 10일

Coil 2.0.0은 라이브러리의 주요 반복 버전이며 브레이킹 변경 사항을 포함합니다. 업그레이드 방법은 [업그레이드 가이드](https://coil-kt.github.io/coil/upgrading/)를 참조하세요.

-   **신규**: `coil-compose`에 `AsyncImage`를 도입합니다. 자세한 내용은 [문서](https://coil-kt.github.io/coil/compose/)를 참조하세요.

```kotlin
// 네트워크에서 이미지를 표시합니다.
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)

// 플레이스홀더, 원형 자르기 및 교차 페이드 애니메이션을 사용하여 네트워크에서 이미지를 표시합니다.
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    placeholder = painterResource(R.drawable.placeholder),
    contentDescription = stringResource(R.string.description),
    contentScale = ContentScale.Crop,
    modifier = Modifier.clip(CircleShape)
)
```

-   **신규**: 공개 `DiskCache` API를 도입합니다.
    -   디스크 캐시를 구성하려면 `ImageLoader.Builder.diskCache` 및 `DiskCache.Builder`를 사용하세요.
    -   Coil 2.0에서는 OkHttp의 `Cache`를 사용해서는 안 됩니다. 자세한 내용은 [여기](https://coil-kt.github.io/coil/upgrading_to_coil2/#disk-cache)를 참조하세요.
    -   `Cache-Control` 및 기타 캐시 헤더는 여전히 지원됩니다. 단, 캐시가 URL 일치 여부만 확인하므로 `Vary` 헤더는 제외됩니다. 또한, 응답 코드가 [200..300) 범위 내에 있는 응답만 캐시됩니다.
    -   2.0으로 업그레이드할 때 기존 디스크 캐시가 지워지고 다시 빌드됩니다.
-   최소 지원 API는 이제 21입니다.
-   `ImageRequest`의 기본 `Scale`은 이제 `Scale.FIT`입니다.
    -   이는 `ImageRequest.scale`을 기본 `Scale`을 가진 다른 클래스와 일관되게 만들기 위해 변경되었습니다.
    -   `ImageViewTarget`을 사용하는 요청은 여전히 `Scale`이 자동으로 감지됩니다.
-   이미지 파이프라인 클래스를 재작업합니다:
    -   `Mapper`, `Fetcher`, `Decoder`가 더 유연하게 리팩터링되었습니다.
    -   `Fetcher.key`가 새로운 `Keyer` 인터페이스로 대체되었습니다. `Keyer`는 입력 데이터에서 캐시 키를 생성합니다.
    -   `Decoder`가 Okio의 파일 시스템 API를 사용하여 `File`을 직접 읽을 수 있도록 `ImageSource`를 추가합니다.
-   Jetpack Compose 통합을 재작업합니다:
    -   `rememberImagePainter` 및 `ImagePainter`의 이름이 각각 `rememberAsyncImagePainter` 및 `AsyncImagePainter`로 변경되었습니다.
    -   `LocalImageLoader`를 지원 중단합니다. 자세한 내용은 지원 중단 메시지를 참조하세요.
-   런타임 not-null 어설션 생성을 비활성화합니다.
    -   Java를 사용하는 경우, not-null 주석이 달린 인수에 null을 전달해도 더 이상 `NullPointerException`이 즉시 발생하지 않습니다. Kotlin의 컴파일 시점 null 안전성이 이러한 발생을 방지합니다.
    -   이 변경으로 라이브러리 크기가 더 작아집니다.
-   `Size`는 이제 너비와 높이에 대한 두 개의 `Dimension` 값으로 구성됩니다. `Dimension`은 양수 픽셀 값이거나 `Dimension.Undefined`일 수 있습니다. 자세한 내용은 [여기](https://coil-kt.github.io/coil/upgrading/#size-refactor)를 참조하세요.
-   `BitmapPool` 및 `PoolableViewTarget`이 라이브러리에서 제거되었습니다.
-   `VideoFrameFileFetcher` 및 `VideoFrameUriFetcher`가 라이브러리에서 제거되었습니다. 대신 모든 데이터 소스를 지원하는 `VideoFrameDecoder`를 사용하세요.
-   [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 및 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt)이 라이브러리에서 제거되었습니다. 사용하는 경우 코드를 프로젝트에 복사할 수 있습니다.
-   `Transition.transition`이 전환 완료 시까지 일시 중단할 필요가 없으므로 일시 중단되지 않는 함수로 변경됩니다.
-   진행 중인 `BitmapFactory` 작업의 최대 수를 제한하는 `bitmapFactoryMaxParallelism` 지원을 추가합니다. 이 값은 기본적으로 4이며, UI 성능을 향상시킵니다.
-   `interceptorDispatcher`, `fetcherDispatcher`, `decoderDispatcher` 및 `transformationDispatcher` 지원을 추가합니다.
-   공통 `ViewTarget` 로직을 처리하는 `GenericViewTarget`를 추가합니다.
-   기본 지원 데이터 유형에 `ByteBuffer`를 추가합니다.
-   `Disposable`이 리팩터링되어 기본 `ImageRequest`의 작업을 노출합니다.
-   `MemoryCache` API를 재작업합니다.
-   `ImageRequest.fallback`이 null인 경우 `ImageRequest.error`가 `Target`에 설정됩니다.
-   `Transformation.key`가 `Transformation.cacheKey`로 대체됩니다.
-   Kotlin을 1.6.10으로 업데이트합니다.
-   Compose를 1.1.1으로 업데이트합니다.
-   OkHttp를 4.9.3으로 업데이트합니다.
-   Okio를 3.0.0으로 업데이트합니다.

`2.0.0-rc03` 이후 변경 사항:
-   `Dimension.Original`을 `Dimension.Undefined`로 전환합니다.
    -   이는 크기 시스템의 일부 엣지 케이스([예시](https://github.com/coil-kt/coil/issues/1246))를 수정하기 위해 비-픽셀 차원의 의미를 약간 변경합니다.
-   ContentScale이 None인 경우 `Size.ORIGINAL`로 이미지를 로드합니다.
-   `ImageView.load` 빌더 인수를 마지막이 아닌 먼저 적용하는 문제를 수정합니다.
-   응답이 수정되지 않은 경우 HTTP 헤더를 결합하지 않는 문제를 수정합니다.

## [2.0.0-rc03] - 2022년 4월 11일

-   `ScaleResolver` 인터페이스를 제거합니다.
-   `Size` 생성자를 함수로 전환합니다.
-   `Dimension.Pixels`의 `toString`이 픽셀 값만 반환하도록 변경합니다.
-   `SystemCallbacks.onTrimMemory`에서 드물게 발생하는 충돌에 대비합니다.
-   Coroutines를 1.6.1으로 업데이트합니다.

## [2.0.0-rc02] - 2022년 3월 20일

-   `ImageRequest`의 기본 크기를 `Size.ORIGINAL` 대신 현재 디스플레이 크기로 되돌립니다.
-   `DiskCache.Builder`가 실험적으로 표시되는 문제를 수정합니다. `DiskCache`의 메서드만 실험적입니다.
-   한 차원이 `WRAP_CONTENT`인 `ImageView`에 이미지를 로드할 때, 이미지가 제한된 차원에 맞춰지지 않고 원본 크기로 로드되는 경우를 수정합니다.
-   `MemoryCache.Key`, `MemoryCache.Value` 및 `Parameters.Entry`에서 컴포넌트 함수를 제거합니다.

## [2.0.0-rc01] - 2022년 3월 2일

`1.4.0` 이후 주요 변경 사항:

-   최소 지원 API는 이제 21입니다.
-   Jetpack Compose 통합을 재작업합니다.
    -   `rememberImagePainter`의 이름이 `rememberAsyncImagePainter`로 변경되었습니다.
    -   `AsyncImage` 및 `SubcomposeAsyncImage` 지원을 추가합니다. 자세한 내용은 [문서](https://coil-kt.github.io/coil/compose/)를 참조하세요.
    -   `LocalImageLoader`를 지원 중단합니다. 자세한 내용은 지원 중단 메시지를 참조하세요.
-   Coil 2.0은 자체 디스크 캐시 구현을 가지고 있으며 더 이상 OkHttp에 디스크 캐싱을 의존하지 않습니다.
    -   디스크 캐시를 구성하려면 `ImageLoader.Builder.diskCache` 및 `DiskCache.Builder`를 사용하세요.
    -   Coil 2.0에서 OkHttp의 `Cache`를 사용**해서는 안 됩니다**. 스레드가 캐시에 쓰는 도중 인터럽트된 경우 캐시가 손상될 수 있기 때문입니다.
    -   `Cache-Control` 및 기타 캐시 헤더는 여전히 지원됩니다. 단, 캐시가 URL 일치 여부만 확인하므로 `Vary` 헤더는 제외됩니다. 또한, 응답 코드가 [200..300) 범위 내에 있는 응답만 캐시됩니다.
    -   2.0으로 업그레이드할 때 기존 디스크 캐시가 지워집니다.
-   `ImageRequest`의 기본 `Scale`은 이제 `Scale.FIT`입니다.
    -   이는 `ImageRequest.scale`을 기본 `Scale`을 가진 다른 클래스와 일관되게 만들기 위해 변경되었습니다.
    -   `ImageViewTarget`을 사용하는 요청은 여전히 `Scale`이 자동으로 감지됩니다.
-   `ImageRequest`의 기본 크기는 이제 `Size.ORIGINAL`입니다.
-   이미지 파이프라인 클래스를 재작업합니다:
    -   `Mapper`, `Fetcher`, `Decoder`가 더 유연하게 리팩터링되었습니다.
    -   `Fetcher.key`가 새로운 `Keyer` 인터페이스로 대체되었습니다. `Keyer`는 입력 데이터에서 캐시 키를 생성합니다.
    -   `Decoder`가 Okio의 파일 시스템 API를 사용하여 `File`을 직접 읽을 수 있도록 `ImageSource`를 추가합니다.
-   런타임 not-null 어설션 생성을 비활성화합니다.
    -   Java를 사용하는 경우, not-null 주석이 달린 파라미터에 null을 전달해도 더 이상 `NullPointerException`이 즉시 발생하지 않습니다. Kotlin을 사용하는 경우 본질적으로 변화가 없습니다.
    -   이 변경으로 라이브러리 크기가 더 작아집니다.
-   `Size`는 이제 너비와 높이에 대한 두 개의 `Dimension` 값으로 구성됩니다. `Dimension`은 양수 픽셀 값이거나 `Dimension.Original`일 수 있습니다.
-   `BitmapPool` 및 `PoolableViewTarget`이 라이브러리에서 제거되었습니다.
-   `VideoFrameFileFetcher` 및 `VideoFrameUriFetcher`가 라이브러리에서 제거되었습니다. 대신 모든 데이터 소스를 지원하는 `VideoFrameDecoder`를 사용하세요.
-   [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 및 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt)이 라이브러리에서 제거되었습니다. 사용하는 경우 코드를 프로젝트에 복사할 수 있습니다.
-   `Transition.transition`이 전환 완료 시까지 일시 중단할 필요가 없으므로 일시 중단되지 않는 함수로 변경됩니다.
-   진행 중인 `BitmapFactory` 작업의 최대 수를 제한하는 `bitmapFactoryMaxParallelism` 지원을 추가합니다. 이 값은 기본적으로 4이며, UI 성능을 향상시킵니다.
-   `interceptorDispatcher`, `fetcherDispatcher`, `decoderDispatcher` 및 `transformationDispatcher` 지원을 추가합니다.
-   공통 `ViewTarget` 로직을 처리하는 `GenericViewTarget`를 추가합니다.
-   기본 지원 데이터 유형에 `ByteBuffer`를 추가합니다.
-   `Disposable`이 리팩터링되어 기본 `ImageRequest`의 작업을 노출합니다.
-   `MemoryCache` API를 재작업합니다.
-   `ImageRequest.fallback`이 null인 경우 `ImageRequest.error`가 `Target`에 설정됩니다.
-   `Transformation.key`가 `Transformation.cacheKey`로 대체됩니다.
-   Kotlin을 1.6.10으로 업데이트합니다.
-   Compose를 1.1.1으로 업데이트합니다.
-   OkHttp를 4.9.3으로 업데이트합니다.
-   Okio를 3.0.0으로 업데이트합니다.

`2.0.0-alpha09` 이후 변경 사항:

-   `-Xjvm-default=all` 컴파일러 플래그를 제거합니다.
-   `must-revalidate`/`e-tag`를 사용하는 여러 요청이 동시에 실행될 때 이미지 로드 실패 문제를 수정합니다.
-   `<svg` 태그 뒤에 새 줄 문자가 있는 경우 `DecodeUtils.isSvg`가 false를 반환하는 문제를 수정합니다.
-   `LocalImageLoader.provides` 지원 중단 메시지를 더 명확하게 합니다.
-   Compose를 1.1.1으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.23.1으로 업데이트합니다.

## [2.0.0-alpha09] - 2022년 2월 16일

-   `AsyncImage`가 잘못된 제약 조건을 생성하는 문제를 수정합니다. ([#1134](https://github.com/coil-kt/coil/pull/1134))
-   `AsyncImagePainter`에 `ContentScale` 인수를 추가합니다. ([#1144](https://github.com/coil-kt/coil/pull/1144))
    -   이는 이미지가 올바른 크기로 로드되도록 `Image`에 설정된 값과 동일하게 설정되어야 합니다.
-   `ImageRequest`에 대한 `Scale`을 지연 방식으로 해결하는 것을 지원하기 위해 `ScaleResolver`를 추가합니다. ([#1134](https://github.com/coil-kt/coil/pull/1134))
    -   `ImageRequest.scale`은 `ImageRequest.scaleResolver.scale()`로 대체되어야 합니다.
-   Compose를 1.1.0으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.23.0으로 업데이트합니다.
-   `androidx.lifecycle`을 2.4.1으로 업데이트합니다.

## [2.0.0-alpha08] - 2022년 2월 7일

-   `DiskCache` 및 `ImageSource`가 Okio의 `FileSystem` API를 사용하도록 업데이트합니다. ([#1115](https://github.com/coil-kt/coil/pull/1115))

## [2.0.0-alpha07] - 2022년 1월 30일

-   `AsyncImage` 성능을 크게 개선하고 `AsyncImage`를 `AsyncImage` 및 `SubcomposeAsyncImage`로 분할합니다. ([#1048](https://github.com/coil-kt/coil/pull/1048))
    -   `SubcomposeAsyncImage`는 `loading`/`success`/`error`/`content` 슬롯 API를 제공하며 성능이 낮은 서브컴포지션을 사용합니다.
    -   `AsyncImage`는 `placeholder`/`error`/`fallback` 인수를 제공하여 로드 중이거나 요청이 실패했을 때 그려지는 `Painter`를 덮어씁니다. `AsyncImage`는 서브컴포지션을 사용하지 않으며 `SubcomposeAsyncImage`보다 훨씬 더 나은 성능을 가집니다.
    -   `SubcomposeAsyncImage.content`에서 `AsyncImagePainter.State` 인수를 제거합니다. 필요한 경우 `painter.state`를 사용하세요.
    -   `AsyncImage` 및 `SubcomposeAsyncImage` 모두에 `onLoading`/`onSuccess`/`onError` 콜백을 추가합니다.
-   `LocalImageLoader`를 지원 중단합니다. ([#1101](https://github.com/coil-kt/coil/pull/1101))
-   `ImageRequest.tags` 지원을 추가합니다. ([#1066](https://github.com/coil-kt/coil/pull/1066))
-   `DecodeUtils`의 `isGif`, `isWebP`, `isAnimatedWebP`, `isHeif` 및 `isAnimatedHeif`를 coil-gif로 이동합니다. coil-svg에 `isSvg`를 추가합니다. ([#1117](https://github.com/coil-kt/coil/pull/1117))
-   `FetchResult` 및 `DecodeResult`를 비-데이터 클래스로 전환합니다. ([#1114](https://github.com/coil-kt/coil/pull/1114))
-   사용되지 않는 `DiskCache.Builder` 컨텍스트 인수를 제거합니다. ([#1099](https://github.com/coil-kt/coil/pull/1099))
-   원본 크기를 가진 비트맵 리소스의 스케일링 문제를 수정합니다. ([#1072](https://github.com/coil-kt/coil/pull/1072))
-   `ImageDecoderDecoder`에서 `ImageDecoder`를 닫지 못하는 문제를 수정합니다. ([#1109](https://github.com/coil-kt/coil/pull/1109))
-   드로어블을 비트맵으로 변환할 때 잘못된 스케일링 문제를 수정합니다. ([#1084](https://github.com/coil-kt/coil/pull/1084))
-   Compose를 1.1.0-rc03으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.22.1-rc로 업데이트합니다.
-   `androidx.appcompat:appcompat-resources`를 1.4.1으로 업데이트합니다.

## [2.0.0-alpha06] - 2021년 12월 24일

-   버퍼링이나 임시 파일 없이 에셋, 리소스 및 콘텐츠 URI에서 디코딩을 지원하기 위해 `ImageSource.Metadata`를 추가합니다. ([#1060](https://github.com/coil-kt/coil/pull/1060))
-   `AsyncImage`가 양의 제약 조건을 가질 때까지 이미지 요청 실행을 지연합니다. ([#1028](https://github.com/coil-kt/coil/pull/1028))
-   `loading`, `success`, `error`가 모두 설정된 경우 `AsyncImage`에 `DefaultContent`를 사용하는 문제를 수정합니다. ([#1026](https://github.com/coil-kt/coil/pull/1026))
-   플랫폼 `LruCache` 대신 androidx `LruCache`를 사용합니다. ([#1047](https://github.com/coil-kt/coil/pull/1047))
-   Kotlin을 1.6.10으로 업데이트합니다.
-   Coroutines를 1.6.0으로 업데이트합니다.
-   Compose를 1.1.0-rc01으로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.22.0-rc로 업데이트합니다.
-   `androidx.collection`을 1.2.0으로 업데이트합니다.

## [2.0.0-alpha05] - 2021년 11월 28일

-   **중요**: 이미지의 원본 크기를 어느 한 차원에 사용할 수 있도록 `Size`를 리팩터링합니다.
    -   `Size`는 이제 너비와 높이에 대한 두 개의 `Dimension` 값으로 구성됩니다. `Dimension`은 양수 픽셀 값이거나 `Dimension.Original`일 수 있습니다.
    -   이 변경은 한 차원이 고정 픽셀 값일 때 무제한 너비/높이 값(예: `wrap_content`, `Constraints.Infinity`)을 더 잘 지원하기 위해 이루어졌습니다.
-   수정: `AsyncImage`에 대한 검사 모드(미리보기)를 지원합니다.
-   수정: `imageLoader.memoryCache`가 null인 경우 `SuccessResult.memoryCacheKey`는 항상 `null`이어야 합니다.
-   `ImageLoader`, `SizeResolver` 및 `ViewSizeResolver`의 생성자와 유사한 `invoke` 함수를 최상위 함수로 전환합니다.
-   `CrossfadeDrawable`의 시작 및 끝 드로어블을 공개 API로 만듭니다.
-   `ImageLoader`의 플레이스홀더/오류/폴백 드로어블을 변경합니다.
-   `SuccessResult` 생성자에 기본 인수를 추가합니다.
-   `androidx.collection-ktx` 대신 `androidx.collection`에 의존합니다.
-   OkHttp를 4.9.3으로 업데이트합니다.

## [2.0.0-alpha04] - 2021년 11월 22일

-   **신규**: `coil-compose`에 `AsyncImage`를 추가합니다.
    -   `AsyncImage`는 `ImageRequest`를 비동기적으로 실행하고 결과를 렌더링하는 컴포저블입니다.
    -   **`AsyncImage`는 대부분의 사용 사례에서 `rememberImagePainter`를 대체하기 위함입니다.**
    -   API는 최종 버전이 아니며 최종 2.0 릴리스 전에 변경될 수 있습니다.
    -   `Image`와 유사한 API를 가지며 `Alignment`, `ContentScale`, `alpha`, `ColorFilter`, `FilterQuality`와 동일한 인수를 지원합니다.
    -   `content`, `loading`, `success`, `error` 인수를 사용하여 각 `AsyncImagePainter` 상태에 대해 그려지는 내용을 덮어쓰는 것을 지원합니다.
    -   이미지 크기 및 스케일 해결과 관련된 `rememberImagePainter`의 여러 디자인 문제를 수정합니다.
    -   예시 사용:

```kotlin
// 이미지만 그립니다.
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null, // `null`을 피하고 가능한 경우 현지화된 문자열을 설정합니다.
)

// 원형 자르기, 교차 페이드 및 `loading` 상태 덮어쓰기를 사용하여 이미지를 그립니다.
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
    modifier = Modifier
        .clip(CircleShape),
    loading = {
        CircularProgressIndicator()
    },
    contentScale = ContentScale.Crop
)

// 원형 자르기, 교차 페이드 및 모든 상태 덮어쓰기를 사용하여 이미지를 그립니다.
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
    modifier = Modifier
        .clip(CircleShape),
    contentScale = ContentScale.Crop
) { state ->
    if (state is AsyncImagePainter.State.Loading) {
        CircularProgressIndicator()
    } else {
        AsyncImageContent() // 이미지를 그립니다.
    }
}
```

-   **중요**: `ImagePainter`의 이름을 `AsyncImagePainter`로, `rememberImagePainter`의 이름을 `rememberAsyncImagePainter`로 변경합니다.
    -   `ExecuteCallback`은 더 이상 지원되지 않습니다. `AsyncImagePainter`가 `onDraw`가 호출될 때까지 기다리는 것을 건너뛰도록 하려면 `ImageRequest.size(OriginalSize)` (또는 다른 크기)를 대신 설정하세요.
    -   `rememberAsyncImagePainter`에 선택적 `FilterQuality` 인수를 추가합니다.
-   `DiskCache`의 정리 작업에 코루틴을 사용하고 `DiskCache.Builder.cleanupDispatcher`를 추가합니다.
-   `ImageLoader.Builder.placeholder`를 사용하여 설정된 플레이스홀더의 Compose 미리보기 문제를 수정합니다.
-   더 효율적인 코드를 생성하기 위해 `LocalImageLoader.current`에 `@ReadOnlyComposable`을 표시합니다.
-   Compose를 1.1.0-beta03으로 업데이트하고 `compose.ui` 대신 `compose.foundation`에 의존합니다.
-   `androidx.appcompat-resources`를 1.4.0으로 업데이트합니다.

## [2.0.0-alpha03] - 2021년 11월 12일

-   Android 29 이상에서 음악 썸네일을 로드하는 기능을 추가합니다. ([#967](https://github.com/coil-kt/coil/pull/967))
-   수정: 현재 패키지의 리소스를 로드하기 위해 `context.resources`를 사용합니다. ([#968](https://github.com/coil-kt/coil/pull/968))
-   수정: `clear` -> `dispose` 교체 표현식을 수정합니다. ([#970](https://github.com/coil-kt/coil/pull/970))
-   Compose를 1.0.5로 업데이트합니다.
-   `accompanist-drawablepainter`를 0.20.2로 업데이트합니다.
-   Okio를 3.0.0으로 업데이트합니다.
-   `androidx.annotation`을 1.3.0으로 업데이트합니다.
-   `androidx.core`를 1.7.0으로 업데이트합니다.
-   `androidx.lifecycle`을 2.4.0으로 업데이트합니다.
    -   `lifecycle-common-java8`이 `lifecycle-common`에 병합되었으므로 해당 의존성을 제거합니다.

## [2.0.0-alpha02] - 2021년 10월 24일

-   [BOM(Bill of Materials)](https://docs.gradle.org/7.2/userguide/platforms.html#sub:bom_import)을 포함하는 새로운 `coil-bom` 아티팩트를 추가합니다.
    -   `coil-bom`을 임포트하면 버전을 지정하지 않고 다른 Coil 아티팩트에 의존할 수 있습니다.
-   `ExecuteCallback.Immediate`를 사용할 때 이미지 로드 실패 문제를 수정합니다.
-   Okio를 3.0.0-alpha.11로 업데이트합니다.
    -   이는 Okio 3.0.0-alpha.11과의 호환성 문제도 해결합니다.
-   Kotlin을 1.5.31으로 업데이트합니다.
-   Compose를 1.0.4로 업데이트합니다.

## [2.0.0-alpha01] - 2021년 10월 11일

Coil 2.0.0은 라이브러리의 다음 주요 반복 버전이며 새로운 기능, 성능 개선, API 개선 및 다양한 버그 수정이 포함되어 있습니다. 이 릴리스는 2.0.0 안정 버전 릴리스 전까지 향후 알파 릴리스와 바이너리/소스 비호환일 수 있습니다.

-   **중요**: 최소 지원 API는 이제 21입니다.
-   **중요**: `-Xjvm-default=all`을 활성화합니다.
    -   이는 Kotlin의 기본 인터페이스 메서드 지원을 사용하는 대신 Java 8 기본 메서드를 생성합니다. 자세한 내용은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)을 참조하세요.
    -   **빌드 파일에도 `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility`를 추가해야 합니다.** 방법은 [여기](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8)를 참조하세요.
-   **중요**: Coil은 이제 자체 디스크 캐시 구현을 가지고 있으며 더 이상 OkHttp에 디스크 캐싱을 의존하지 않습니다.
    -   이 변경은 다음을 위해 이루어졌습니다.
        -   이미지 디코딩 중 스레드 인터럽션 지원을 강화합니다. 이는 이미지 요청이 빠르게 시작되고 중지될 때 성능을 향상시킵니다.
        -   `File`로 백업된 `ImageSource` 노출을 지원합니다. 이는 Android API가 디코딩을 위해 `File`을 요구할 때 (예: `MediaMetadataRetriever`) 불필요한 복사를 방지합니다.
        -   디스크 캐시 파일에서 직접 읽기/쓰기를 지원합니다.
    -   디스크 캐시를 구성하려면 `ImageLoader.Builder.diskCache` 및 `DiskCache.Builder`를 사용하세요.
    -   Coil 2.0에서는 OkHttp의 `Cache`를 사용**해서는 안 됩니다**. 스레드가 캐시에 쓰는 도중 인터럽트된 경우 캐시가 손상될 수 있기 때문입니다.
    -   `Cache-Control` 및 기타 캐시 헤더는 여전히 지원됩니다. 단, 캐시가 URL 일치 여부만 확인하므로 `Vary` 헤더는 제외됩니다. 또한, 응답 코드가 [200..300) 범위 내에 있는 응답만 캐시됩니다.
    -   캐시 헤더 지원은 `ImageLoader.Builder.respectCacheHeaders`를 사용하여 활성화 또는 비활성화할 수 있습니다.
    -   2.0으로 업그레이드할 때 기존 디스크 캐시가 지워지고 다시 빌드됩니다.
-   **중요**: `ImageRequest`의 기본 `Scale`은 이제 `Scale.FIT`입니다.
    -   이는 `ImageRequest.scale`을 기본 `Scale`을 가진 다른 클래스와 일관되게 만들기 위해 변경되었습니다.
    -   `ImageViewTarget`을 사용하는 요청은 여전히 스케일이 자동으로 감지됩니다.
-   이미지 파이프라인 클래스에 대한 주요 변경 사항:
    -   `Mapper`, `Fetcher`, `Decoder`가 더 유연하게 리팩터링되었습니다.
    -   `Fetcher.key`가 새로운 `Keyer` 인터페이스로 대체되었습니다. `Keyer`는 입력 데이터에서 캐시 키를 생성합니다.
    -   `Decoder`가 `File`을 직접 디코딩할 수 있도록 `ImageSource`를 추가합니다.
-   `BitmapPool` 및 `PoolableViewTarget`이 라이브러리에서 제거되었습니다. 비트맵 풀링이 제거된 이유는 다음과 같습니다.
    -   API 23 이하에서 가장 효과적이며 최신 Android 릴리스에서는 효과가 감소했습니다.
    -   비트맵 풀링을 제거하면 Coil이 변경 불가능한 비트맵을 사용할 수 있으며, 이는 성능 이점이 있습니다.
    -   비트맵 풀을 관리하는 데 런타임 오버헤드가 있습니다.
    -   비트맵 풀링은 비트맵이 풀링 대상인지 추적해야 하므로 Coil의 API에 설계 제한을 만듭니다. 비트맵 풀링을 제거하면 Coil이 더 많은 곳에서 결과 `Drawable`을 노출할 수 있습니다(예: `Listener`, `Disposable`). 또한, 이는 Coil이 `ImageView`를 지울 필요가 없다는 것을 의미하며, 이는 [문제를 야기](https://github.com/coil-kt/coil/issues/650)할 수 있습니다.
    -   비트맵 풀링은 [오류 발생 가능성](https://github.com/coil-kt/coil/issues/546)이 높습니다. 새 비트맵을 할당하는 것이 여전히 사용 중일 수 있는 비트맵을 재사용하려는 시도보다 훨씬 안전합니다.
-   `MemoryCache`가 더 유연하게 리팩터링되었습니다.
-   런타임 not-null 어설션 생성을 비활성화합니다.
    -   Java를 사용하는 경우, not-null 주석이 달린 파라미터에 null을 전달해도 더 이상 `NullPointerException`이 즉시 발생하지 않습니다. Kotlin을 사용하는 경우 본질적으로 변화가 없습니다.
    -   이 변경으로 라이브러리 크기가 더 작아집니다.
-   `VideoFrameFileFetcher` 및 `VideoFrameUriFetcher`가 라이브러리에서 제거되었습니다. 대신 모든 데이터 소스를 지원하는 `VideoFrameDecoder`를 사용하세요.
-   진행 중인 `BitmapFactory` 작업의 최대 수를 제한하는 `bitmapFactoryMaxParallelism` 지원을 추가합니다. 이 값은 기본적으로 4이며, UI 성능을 향상시킵니다.
-   `interceptorDispatcher`, `fetcherDispatcher`, `decoderDispatcher` 및 `transformationDispatcher` 지원을 추가합니다.
-   `Disposable`이 리팩터링되어 기본 `ImageRequest`의 작업을 노출합니다.
-   `Transition.transition`이 전환 완료 시까지 일시 중단할 필요가 없으므로 일시 중단되지 않는 함수로 변경됩니다.
-   공통 `ViewTarget` 로직을 처리하는 `GenericViewTarget`를 추가합니다.
-   라이브러리에서 [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 및 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt)이 제거되었습니다.
    -   사용하는 경우 코드를 프로젝트에 복사할 수 있습니다.
-   `ImageRequest.fallback`이 null인 경우 `ImageRequest.error`가 `Target`에 설정됩니다.
-   `Transformation.key`가 `Transformation.cacheKey`로 대체됩니다.
-   `ImageRequest.Listener`는 `onSuccess` 및 `onError`에서 각각 `SuccessResult`/`ErrorResult`를 반환합니다.
-   기본 지원 데이터 유형에 `ByteBuffer`를 추가합니다.
-   여러 클래스에서 `toString` 구현을 제거합니다.
-   OkHttp를 4.9.2로 업데이트합니다.
-   Okio를 3.0.0-alpha.10으로 업데이트합니다.

## [1.4.0] - 2021년 10월 6일

-   **신규**: `ImagePainter.State.Success` 및 `ImagePainter.State.Error`에 `ImageResult`를 추가합니다. ([#887](https://github.com/coil-kt/coil/pull/887))
    -   이는 `ImagePainter.State.Success` 및 `ImagePainter.State.Error`의 서명에 대한 바이너리 비호환 변경이지만, 이 API는 실험적(experimental)으로 표시되어 있습니다.
-   `View.isShown`이 `true`인 경우에만 `CrossfadeTransition`을 실행합니다. 이전에는 `View.isVisible`만 확인했습니다. ([#898](https://github.com/coil-kt/coil/pull/898))
-   반올림 문제로 인해 스케일링 승수가 1보다 약간 작은 경우 잠재적인 메모리 캐시 미스 문제를 수정합니다. ([#899](https://github.com/coil-kt/coil/pull/899))
-   인라인되지 않은(non-inlined) `ComponentRegistry` 메서드를 공개 API로 만듭니다. ([#925](https://github.com/coil-kt/coil/pull/925))
-   `accompanist-drawablepainter`에 의존하고 Coil의 사용자 지정 `DrawablePainter` 구현을 제거합니다. ([#845](https://github.com/coil-kt/coil/pull/845))
-   디슈거링(desugaring) 문제에 대비하기 위해 Java 8 메서드 사용을 제거합니다. ([#924](https://github.com/coil-kt/coil/pull/924))
-   `ImagePainter.ExecuteCallback`을 안정적인 API로 승격합니다. ([#927](https://github.com/coil-kt/coil/pull/927))
-   컴파일 SDK를 31로 업데이트합니다.
-   Kotlin을 1.5.30으로 업데이트합니다.
-   Coroutines를 1.5.2로 업데이트합니다.
-   Compose를 1.0.3으로 업데이트합니다.

## [1.3.2] - 2021년 8월 4일

-   `coil-compose`는 이제 `compose.foundation` 대신 `compose.ui`에 의존합니다.
    -   `compose.ui`는 `compose.foundation`의 하위 집합이므로 더 작은 의존성입니다.
-   Jetpack Compose를 1.0.1으로 업데이트합니다.
-   Kotlin을 1.5.21으로 업데이트합니다.
-   Coroutines를 1.5.1으로 업데이트합니다.
-   `androidx.exifinterface:exifinterface`를 1.3.3으로 업데이트합니다.

## [1.3.1] - 2021년 7월 28일

-   Jetpack Compose를 `1.0.0`으로 업데이트합니다. Compose 팀의 [안정 버전 릴리스](https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html)에 큰 축하를 보냅니다!
-   `androidx.appcompat:appcompat-resources`를 1.3.1으로 업데이트합니다.

## [1.3.0] - 2021년 7월 10일

-   **신규**: [Jetpack Compose](https://developer.android.com/jetpack/compose) 지원을 추가합니다. 이는 [Accompanist](https://github.com/google/accompanist/)의 Coil 통합을 기반으로 하지만, 여러 변경 사항이 있습니다. 자세한 내용은 [문서](https://coil-kt.github.io/coil/compose/)를 참조하세요.
-   `Transformation`에 대한 자동 비트맵 변환을 활성화/비활성화하기 위해 `allowConversionToBitmap`을 추가합니다. ([#775](https://github.com/coil-kt/coil/pull/775))
-   임계값 미만일 경우 GIF의 프레임 지연을 재작성하는 것을 활성화하기 위해 `ImageDecoderDecoder` 및 `GifDecoder`에 `enforceMinimumFrameDelay`를 추가합니다. ([#783](https://github.com/coil-kt/coil/pull/783))
    -   이는 기본적으로 비활성화되어 있지만, 향후 릴리스에서는 기본적으로 활성화될 예정입니다.
-   `ImageLoader`의 내부 네트워크 옵저버를 활성화/비활성화하는 지원을 추가합니다. ([#741](https://github.com/coil-kt/coil/pull/741))
-   `BitmapFactoryDecoder`에 의해 디코딩된 비트맵의 밀도 문제를 수정합니다. ([#776](https://github.com/coil-kt/coil/pull/776))
-   Licensee가 Coil의 라이선스 URL을 찾지 못하는 문제를 수정합니다. ([#774](https://github.com/coil-kt/coil/pull/774))
-   `androidx.core:core-ktx`를 1.6.0으로 업데이트합니다.

## [1.2.2] - 2021년 6월 4일

-   공유 상태를 가진 드로어블을 비트맵으로 변환하는 동안 경쟁 조건이 발생하는 문제를 수정합니다. ([#771](https://github.com/coil-kt/coil/pull/771))
-   `ImageLoader.Builder.fallback`이 `fallback` 드로어블 대신 `error` 드로어블을 설정하는 문제를 수정합니다.
-   `ResourceUriFetcher`가 잘못된 데이터 소스를 반환하는 문제를 수정합니다. ([#770](https://github.com/coil-kt/coil/pull/770))
-   API 26 및 27에서 사용 가능한 파일 디스크립터가 없는 경우 로그 확인 문제를 수정합니다.
-   플랫폼 벡터 드로어블 지원에 대한 잘못된 버전 확인 문제를 수정합니다. ([#751](https://github.com/coil-kt/coil/pull/751))
-   Kotlin (1.5.10)을 업데이트합니다.
-   Coroutines (1.5.0)을 업데이트합니다.
-   `androidx.appcompat:appcompat-resources`를 1.3.0으로 업데이트합니다.
-   `androidx.core:core-ktx`를 1.5.0으로 업데이트합니다.

## [1.2.1] - 2021년 4월 27일

-   수정: `VideoFrameUriFetcher`가 http/https URI를 처리하려는 시도 문제를 수정합니다. ([#734](https://github.com/coil-kt/coil/pull/734))

## [1.2.0] - 2021년 4월 12일

-   **중요**: `SvgDecoder`에서 SVG의 뷰 경계를 사용하여 가로세로 비율을 계산합니다. ([#688](https://github.com/coil-kt/coil/pull/688))
    -   이전에는 `SvgDecoder`가 SVG의 `width`/`height` 요소를 사용하여 가로세로 비율을 결정했지만, 이는 SVG 사양을 올바르게 따르지 않습니다.
    -   이전 동작으로 되돌리려면 `SvgDecoder`를 생성할 때 `useViewBoundsAsIntrinsicSize = false`를 설정하세요.
-   **신규**: 모든 소스에서 비디오 프레임 디코딩을 지원하기 위해 `VideoFrameDecoder`를 추가합니다. ([#689](https://github.com/coil-kt/coil/pull/689))
-   **신규**: MIME 유형만 사용하는 대신 소스의 내용을 사용하여 자동 SVG 감지를 지원합니다. ([#654](https://github.com/coil-kt/coil/pull/654))
-   **신규**: `ImageLoader.newBuilder()`를 사용하여 리소스 공유를 지원합니다. ([#653](https://github.com/coil-kt/coil/pull/653))
    -   중요하게도, 이는 `ImageLoader` 인스턴스 간에 메모리 캐시를 공유할 수 있도록 합니다.
-   **신규**: `AnimatedTransformation`을 사용하여 애니메이션 이미지 변환을 지원합니다. ([#659](https://github.com/coil-kt/coil/pull/659))
-   **신규**: 애니메이션 드로어블에 대한 시작/끝 콜백 지원을 추가합니다. ([#676](https://github.com/coil-kt/coil/pull/676))

---

-   HEIF/HEIC 파일의 EXIF 데이터 파싱 문제를 수정합니다. ([#664](https://github.com/coil-kt/coil/pull/664))
-   비트맵 풀링이 비활성화된 경우 `EmptyBitmapPool` 구현을 사용하지 않는 문제를 수정합니다. ([#638](https://github.com/coil-kt/coil/pull/638))
    -   이 수정이 없으면 비트맵 풀링은 여전히 제대로 비활성화되었지만, 더 무거운 `BitmapPool` 구현을 사용했습니다.
-   `MovieDrawable.getOpacity`가 잘못 투명을 반환하는 경우를 수정합니다. ([#682](https://github.com/coil-kt/coil/pull/682))
-   기본 임시 디렉토리가 존재하지 않는 경우에 대비합니다. ([#683](https://github.com/coil-kt/coil/pull/683))

---

-   JVM IR 백엔드를 사용하여 빌드합니다. ([#670](https://github.com/coil-kt/coil/pull/670))
-   Kotlin (1.4.32)을 업데이트합니다.
-   Coroutines (1.4.3)을 업데이트합니다.
-   OkHttp (3.12.13)을 업데이트합니다.
-   `androidx.lifecycle:lifecycle-common-java8`을 2.3.1으로 업데이트합니다.

## [1.1.1] - 2021년 1월 11일

-   `ViewSizeResolver.size`가 코루틴을 두 번 이상 재개하여 `IllegalStateException`을 발생시킬 수 있는 경우를 수정합니다.
-   메인 스레드에서 호출될 때 `HttpFetcher`가 영원히 블로킹하는 문제를 수정합니다.
    -   `ImageRequest.dispatcher(Dispatchers.Main.immediate)`를 사용하여 메인 스레드에서 강제로 실행되는 요청은 `ImageRequest.networkCachePolicy`가 `CachePolicy.DISABLED` 또는 `CachePolicy.WRITE_ONLY`로 설정되지 않은 한 `NetworkOnMainThreadException`과 함께 실패합니다.
-   비디오에 회전 메타데이터가 있는 경우 `VideoFrameFetcher`에서 비디오 프레임을 회전시킵니다.
-   Kotlin (1.4.21)을 업데이트합니다.
-   Coroutines (1.4.2)를 업데이트합니다.
-   Okio (2.10.0)을 업데이트합니다.
-   `androidx.exifinterface:exifinterface` (1.3.2)를 업데이트합니다.

## [1.1.0] - 2020년 11월 24일

-   **중요**: `CENTER` 및 `MATRIX` `ImageView` 스케일 유형을 `OriginalSize`로 해결하도록 변경합니다. ([#587](https://github.com/coil-kt/coil/pull/587))
    -   이 변경은 요청의 크기가 명시적으로 지정되지 않은 경우 암시적 크기 해결 알고리즘에만 영향을 미칩니다.
    -   이 변경은 이미지 요청의 시각적 결과가 `ImageView.setImageResource`/`ImageView.setImageURI`와 일관되도록 보장하기 위해 이루어졌습니다. 이전 동작으로 되돌리려면 요청을 생성할 때 `ViewSizeResolver`를 설정하세요.
-   **중요**: 뷰의 레이아웃 파라미터가 `WRAP_CONTENT`인 경우 `ViewSizeResolver`에서 디스플레이 크기를 반환합니다. ([#562](https://github.com/coil-kt/coil/pull/562))
    -   이전에는 뷰가 완전히 레이아웃된 경우에만 디스플레이 크기를 반환했습니다. 이 변경으로 일반적인 동작이 더 일관되고 직관적입니다.
-   알파 사전 곱셈을 제어하는 기능을 추가합니다. ([#569](https://github.com/coil-kt/coil/pull/569))
-   `CrossfadeDrawable`에서 정확한 고유 크기를 선호하는 것을 지원합니다. ([#585](https://github.com/coil-kt/coil/pull/585))
-   버전을 포함한 전체 GIF 헤더를 확인합니다. ([#564](https://github.com/coil-kt/coil/pull/564))
-   비어 있는 비트맵 풀 구현을 추가합니다. ([#561](https://github.com/coil-kt/coil/pull/561))
-   `EventListener.Factory`를 함수형 인터페이스로 만듭니다. ([#575](https://github.com/coil-kt/coil/pull/575))
-   `EventListener`를 안정화합니다. ([#574](https://github.com/coil-kt/coil/pull/574))
-   `ImageRequest.Builder.placeholderMemoryCacheKey`에 `String` 오버로드를 추가합니다.
-   `ViewSizeResolver` 생성자에 `@JvmOverloads`를 추가합니다.
-   수정: `CrossfadeDrawable`에서 시작/끝 드로어블을 변경합니다. ([#572](https://github.com/coil-kt/coil/pull/572))
-   수정: 두 번째 로드 시 GIF가 재생되지 않는 문제를 수정합니다. ([#577](https://github.com/coil-kt/coil/pull/534))
-   Kotlin (1.4.20)을 업데이트하고 `kotlin-parcelize` 플러그인으로 마이그레이션합니다.
-   Coroutines (1.4.1)을 업데이트합니다.

## [1.0.0] - 2020년 10월 22일

`0.13.0` 이후 변경 사항:
-   `Context.imageLoader` 확장 함수를 추가합니다. ([#534](https://github.com/coil-kt/coil/pull/534))
-   `ImageLoader.executeBlocking` 확장 함수를 추가합니다. ([#537](https://github.com/coil-kt/coil/pull/537))
-   이전 싱글턴 이미지 로더가 교체된 경우 종료되지 않도록 합니다. ([#533](https://github.com/coil-kt/coil/pull/533))

`1.0.0-rc3` 이후 변경 사항:
-   수정: `ActivityManager` 누락/잘못된 경우에 대비합니다. ([#541](https://github.com/coil-kt/coil/pull/541))
-   수정: OkHttp가 성공하지 못한 응답을 캐시할 수 있도록 허용합니다. ([#551](https://github.com/coil-kt/coil/pull/551))
-   Kotlin을 1.4.10으로 업데이트합니다.
-   Okio를 2.9.0으로 업데이트합니다.
-   `androidx.exifinterface:exifinterface`를 1.3.1으로 업데이트합니다.

## [1.0.0-rc3] - 2020년 9월 21일

-   불안정성으로 인해 [`-Xjvm-default=all`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 컴파일러 플래그 사용을 되돌립니다.
    -   **이는 이전 릴리스 후보 버전과의 소스 호환은 되지만 바이너리 호환은 되지 않는 변경입니다.**
-   `Context.imageLoader` 확장 함수를 추가합니다. ([#534](https://github.com/coil-kt/coil/pull/534))
-   `ImageLoader.executeBlocking` 확장 함수를 추가합니다. ([#537](https://github.com/coil-kt/coil/pull/537))
-   이전 싱글턴 이미지 로더가 교체된 경우 종료되지 않도록 합니다. ([#533](https://github.com/coil-kt/coil/pull/533))
-   AndroidX 의존성을 업데이트합니다:
    -   `androidx.exifinterface:exifinterface` -> 1.3.0

## [1.0.0-rc2] - 2020년 9월 3일

-   **이 릴리스는 Kotlin 1.4.0 이상을 요구합니다.**
-   [0.13.0](#0130---september-3-2020)의 모든 변경 사항이 포함되어 있습니다.
-   `stdlib-jdk8` 대신 기본 Kotlin `stdlib`에 의존합니다.

## [0.13.0] - 2020년 9월 3일

-   **중요**: 기본적으로 인터셉터 체인을 메인 스레드에서 실행합니다. ([#513](https://github.com/coil-kt/coil/pull/513))
    -   이는 `0.11.0` 이하 버전에서 메모리 캐시가 메인 스레드에서 동기적으로 확인되던 동작을 대부분 복원합니다.
    -   `ImageRequest.dispatcher`에서 메모리 캐시를 확인하던 `0.12.0`과 동일한 동작으로 되돌리려면 `ImageLoader.Builder.launchInterceptorChainOnMainThread(false)`를 설정하세요.
    -   자세한 내용은 [`launchInterceptorChainOnMainThread`](https://coil-kt.github.io/coil/api/coil-core/coil3/-image-loader/-builder/launch-interceptor-chain-on-main-thread/)를 참조하세요.

---

-   수정: 분리된 프래그먼트의 `ViewTarget`에서 요청이 시작될 때 잠재적인 메모리 누수 문제를 수정합니다. ([#518](https://github.com/coil-kt/coil/pull/518))
-   수정: 리소스 URI를 로드하기 위해 `ImageRequest.context`를 사용합니다. ([#517](https://github.com/coil-kt/coil/pull/517))
-   수정: 후속 요청이 디스크 캐시에 저장되지 않는 원인이 될 수 있는 경쟁 조건 문제를 수정합니다. ([#510](https://github.com/coil-kt/coil/pull/510))
-   수정: API 18에서 `blockCountLong` 및 `blockSizeLong`을 사용합니다.

---

-   `ImageLoaderFactory`를 함수형 인터페이스로 만듭니다.
-   `ImageLoader.Builder.addLastModifiedToFileCacheKey`를 추가하여 `File`에서 로드된 이미지의 메모리 캐시 키에 최종 수정 타임스탬프를 추가/제거할 수 있도록 합니다.

---

-   Kotlin을 1.4.0으로 업데이트합니다.
-   Coroutines를 1.3.9로 업데이트합니다.
-   Okio를 2.8.0으로 업데이트합니다.

## [1.0.0-rc1] - 2020년 8월 18일

-   **이 릴리스는 Kotlin 1.4.0 이상을 요구합니다.**
-   Kotlin을 1.4.0으로 업데이트하고 [`-Xjvm-default=all`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)을 활성화합니다.
    -   **빌드 파일에서 `-Xjvm-default=all`을 활성화하는 방법은 [여기](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8)를 참조하세요.**
    -   이는 기본 Kotlin 인터페이스 메서드에 대해 Java 8 기본 메서드를 생성합니다.
-   0.12.0에 있는 모든 지원 중단된 메서드를 제거합니다.
-   Coroutines를 1.3.9로 업데이트합니다.

## [0.12.0] - 2020년 8월 18일

-   **Breaking**: `LoadRequest` 및 `GetRequest`가 `ImageRequest`로 대체되었습니다:
    -   `ImageLoader.execute(LoadRequest)` -> `ImageLoader.enqueue(ImageRequest)`
    -   `ImageLoader.execute(GetRequest)` -> `ImageLoader.execute(ImageRequest)`
    -   `ImageRequest`는 `equals`/`hashCode`를 구현합니다.
-   **Breaking**: 여러 클래스 이름이 변경되거나 패키지가 변경되었습니다:
    -   `coil.request.RequestResult` -> `coil.request.ImageResult`
    -   `coil.request.RequestDisposable` -> `coil.request.Disposable`
    -   `coil.bitmappool.BitmapPool` -> `coil.bitmap.BitmapPool`
    -   `coil.DefaultRequestOptions` -> `coil.request.DefaultRequestOptions`
-   **Breaking**: [`SparseIntArraySet`](https://github.com/coil-kt/coil/blob/f52addd039f0195b66f93cb0f1cad59b0832f784/coil-core/src/main/java/coil/collection/SparseIntArraySet.kt)이 공개 API에서 제거되었습니다.
-   **Breaking**: `TransitionTarget`는 더 이상 `ViewTarget`를 구현하지 않습니다.
-   **Breaking**: `ImageRequest.Listener.onSuccess`의 서명이 `DataSource` 대신 `ImageResult.Metadata`를 반환하도록 변경되었습니다.
-   **Breaking**: `LoadRequest.aliasKeys` 지원을 제거합니다. 이 API는 메모리 캐시에 대한 직접 읽기/쓰기 접근으로 더 잘 처리됩니다.

---

-   **중요**: 메모리 캐시의 값은 더 이상 동기적으로 해결되지 않습니다 (메인 스레드에서 호출된 경우).
    -   이 변경은 백그라운드 디스패처에서 `Interceptor`를 실행하는 것을 지원하기 위해서도 필요했습니다.
    -   이 변경은 또한 메인 스레드에서 더 많은 작업을 이동하여 성능을 향상시킵니다.
-   **중요**: `Mapper`는 이제 백그라운드 디스패처에서 실행됩니다. 부작용으로 자동 비트맵 샘플링은 더 이상 **자동으로** 지원되지 않습니다. 동일한 효과를 얻으려면 이전 요청의 `MemoryCache.Key`를 후속 요청의 `placeholderMemoryCacheKey`로 사용하세요. [예시는 여기](https://coil-kt.github.io/coil/recipes/#using-a-memory-cache-key-as-a-placeholder)를 참조하세요.
    -   `placeholderMemoryCacheKey` API는 서로 다른 데이터(예: 작거나 큰 이미지에 대한 다른 URL)를 가진 두 이미지 요청을 "연결"할 수 있는 더 많은 자유를 제공합니다.
-   **중요**: Coil의 `ImageView` 확장 함수가 `coil.api` 패키지에서 `coil` 패키지로 이동했습니다.
    -   `import coil.api.load` -> `import coil.load`로 리팩터링하려면 찾기 및 바꾸기를 사용하세요. 안타깝게도 Kotlin의 `ReplaceWith` 기능을 사용하여 임포트를 대체하는 것은 불가능합니다.
-   **중요**: 드로어블이 동일한 이미지가 아닌 경우 표준 교차 페이드(crossfade)를 사용합니다.
-   **중요**: API 24 이상에서는 변경 불가능한 비트맵을 선호합니다.
-   **중요**: `MeasuredMapper`는 새로운 `Interceptor` 인터페이스를 선호하여 지원 중단되었습니다. `MeasuredMapper`를 `Interceptor`로 변환하는 방법에 대한 예시는 [여기](https://gist.github.com/colinrtwhite/90267704091467451e46b21b95154299)를 참조하세요.
    -   `Interceptor`는 훨씬 덜 제한적인 API로, 더 넓은 범위의 사용자 지정 로직을 허용합니다.
-   **중요**: `ImageRequest.data`는 이제 null이 아닙니다. 데이터를 설정하지 않고 `ImageRequest`를 생성하면 `NullRequestData`를 데이터로 반환합니다.

---

-   **신규**: `ImageLoader`의 `MemoryCache`에 대한 직접 읽기/쓰기 접근 지원을 추가합니다. 자세한 내용은 [문서](https://coil-kt.github.io/coil/getting_started/#memory-cache)를 참조하세요.
-   **신규**: `Interceptor` 지원을 추가합니다. 자세한 내용은 [문서](https://coil-kt.github.io/coil/image_pipeline/#interceptors)를 참조하세요. Coil의 `Interceptor` 설계는 [OkHttp](https://github.com/square/okhttp)에서 크게 영감을 받았습니다!
-   **신규**: `ImageLoader.Builder.bitmapPoolingEnabled`를 사용하여 비트맵 풀링을 활성화/비활성화하는 기능을 추가합니다.
    -   비트맵 풀링은 API 23 이하에서 가장 효과적이지만, API 24 이상에서도 여전히 유용할 수 있습니다 (적극적으로 `Bitmap.recycle`을 호출하여).
-   **신규**: 디코딩 중 스레드 인터럽션 지원을 추가합니다.

---

-   콘텐츠 유형 헤더에서 여러 세그먼트 파싱 문제를 수정합니다.
-   비트맵 참조 카운팅을 재작업하여 더 강력하게 만듭니다.
-   API 19 미만 기기에서 WebP 디코딩 문제를 수정합니다.
-   `EventListener` API에서 `FetchResult` 및 `DecodeResult`를 노출합니다.

---

-   SDK 30으로 컴파일합니다.
-   Coroutines를 1.3.8으로 업데이트합니다.
-   OkHttp를 3.12.12로 업데이트합니다.
-   Okio를 2.7.0으로 업데이트합니다.
-   AndroidX 의존성을 업데이트합니다:
    -   `androidx.appcompat:appcompat-resources` -> 1.2.0
    -   `androidx.core:core-ktx` -> 1.3.1

## [0.11.0] - 2020년 5월 14일

-   **Breaking**: **이 버전은 기존의 모든 지원 중단된 함수를 제거합니다.**
    -   이를 통해 Coil의 `ContentProvider`를 제거하여 앱 시작 시 어떤 코드도 실행하지 않도록 할 수 있습니다.
-   **Breaking**: `SparseIntArraySet.size`를 `val`로 전환합니다. ([#380](https://github.com/coil-kt/coil/pull/380))
-   **Breaking**: `Parameters.count()`를 확장 함수로 이동합니다. ([#403](https://github.com/coil-kt/coil/pull/403))
-   **Breaking**: `BitmapPool.maxSize`를 Int로 만듭니다. ([#404](https://github.com/coil-kt/coil/pull/404))

---

-   **중요**: `ImageLoader.shutdown()`을 선택적으로 만듭니다 (`OkHttpClient`와 유사). ([#385](https://github.com/coil-kt/coil/pull/385))

---

-   수정: AGP 4.1 호환성 문제를 수정합니다. ([#386](https://github.com/coil-kt/coil/pull/386))
-   수정: `GONE` 뷰 측정 문제를 수정합니다. ([#397](https://github.com/coil-kt/coil/pull/397))

---

-   기본 메모리 캐시 크기를 20%로 줄입니다. ([#390](https://github.com/coil-kt/coil/pull/390))
    -   기존 동작으로 되돌리려면 `ImageLoader`를 생성할 때 `ImageLoaderBuilder.availableMemoryPercentage(0.25)`를 설정하세요.
-   Coroutines를 1.3.6으로 업데이트합니다.
-   OkHttp를 3.12.11으로 업데이트합니다.

## [0.10.1] - 2020년 4월 26일

-   API 23 이하에서 대용량 PNG 디코딩 시 OOM(메모리 부족) 문제를 수정합니다. ([#372](https://github.com/coil-kt/coil/pull/372)).
    -   이는 PNG 파일의 EXIF 방향 디코딩을 비활성화합니다. PNG EXIF 방향은 거의 사용되지 않으며, PNG EXIF 데이터를 읽으려면 (비어 있더라도) 전체 파일을 메모리로 버퍼링해야 하므로 성능에 좋지 않습니다.
-   `SparseIntArraySet`의 사소한 Java 호환성 개선.

---

-   Okio를 2.6.0으로 업데이트합니다.

## [0.10.0] - 2020년 4월 20일

### 주요 내용

-   **이 버전은 대부분의 DSL API를 비권장하고 빌더를 직접 사용하는 것을 선호합니다.** 변경 사항은 다음과 같습니다:

    ```kotlin
    // 0.9.5 (이전)
    val imageLoader = ImageLoader(context) {
        bitmapPoolPercentage(0.5)
        crossfade(true)
    }

    val disposable = imageLoader.load(context, "https://example.com/image.jpg") {
        target(imageView)
    }

    val drawable = imageLoader.get("https://example.com/image.jpg") {
        size(512, 512)
    }

    // 0.10.0 (신규)
    val imageLoader = ImageLoader.Builder(context)
        .bitmapPoolPercentage(0.5)
        .crossfade(true)
        .build()

    val request = LoadRequest.Builder(context)
        .data("https://example.com/image.jpg")
        .target(imageView)
        .build()
    val disposable = imageLoader.execute(request)

    val request = GetRequest.Builder(context)
        .data("https://example.com/image.jpg")
        .size(512, 512)
        .build()
    val drawable = imageLoader.execute(request).drawable
    ```

    -   `io.coil-kt:coil` 아티팩트를 사용하는 경우 `Coil.execute(request)`를 호출하여 싱글턴 `ImageLoader`로 요청을 실행할 수 있습니다.

-   **`ImageLoader`는 이제 약한 참조 메모리 캐시를 가집니다.** 이 캐시는 강한 참조 메모리 캐시에서 제거된 이미지에 대한 약한 참조를 추적합니다.
    -   이는 이미지에 대한 강한 참조가 여전히 존재하는 경우 `ImageLoader`의 메모리 캐시에서 이미지가 항상 반환됨을 의미합니다.
    -   일반적으로 이는 메모리 캐시를 훨씬 더 예측 가능하게 만들고 적중률을 높여야 합니다.
    -   이 동작은 `ImageLoaderBuilder.trackWeakReferences`로 활성화/비활성화할 수 있습니다.

-   비디오 파일에서 특정 프레임을 디코딩하기 위한 새로운 아티팩트 **`io.coil-kt:coil-video`**를 추가합니다. [자세한 내용은 여기](https://coil-kt.github.io/coil/videos/)를 참조하세요.

-   메트릭 추적을 위한 새로운 [EventListener](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/EventListener.kt) API를 추가합니다.

-   싱글턴 초기화를 단순화하기 위해 `Application`에서 구현될 수 있는 [ImageLoaderFactory](https://github.com/coil-kt/coil/blob/main/coil/src/main/java/coil/ImageLoaderFactory.kt)를 추가합니다.

---

### 전체 릴리스 노트

-   **중요**: 빌더 구문을 선호하여 DSL 구문을 비권장합니다. ([#267](https://github.com/coil-kt/coil/pull/267))
-   **중요**: `Coil` 및 `ImageLoader` 확장 함수를 비권장합니다. ([#322](https://github.com/coil-kt/coil/pull/322))
-   **Breaking**: `ImageLoader.execute(GetRequest)`에서 봉인된(sealed) `RequestResult` 타입을 반환합니다. ([#349](https://github.com/coil-kt/coil/pull/349))
-   **Breaking**: `ExperimentalCoil`의 이름을 `ExperimentalCoilApi`로 변경합니다. `@Experimental`에서 `@RequiresOptIn`으로 마이그레이션합니다. ([#306](https://github.com/coil-kt/coil/pull/306))
-   **Breaking**: `CoilLogger`를 `Logger` 인터페이스로 대체합니다. ([#316](https://github.com/coil-kt/coil/pull/316))
-   **Breaking**: `destWidth`/`destHeight` 이름을 `dstWidth`/`dstHeight`로 변경합니다. ([#275](https://github.com/coil-kt/coil/pull/275))
-   **Breaking**: `MovieDrawable`의 생성자 파라미터를 재정렬합니다. ([#272](https://github.com/coil-kt/coil/pull/272))
-   **Breaking**: `Request.Listener`의 메서드는 이제 데이터만 받는 대신 전체 `Request` 객체를 받습니다.
-   **Breaking**: `GetRequestBuilder`는 이제 생성자에 `Context`를 요구합니다.
-   **Breaking**: `Request`의 여러 속성이 이제 nullable입니다.
-   **동작 변경**: 기본적으로 캐시 키에 파라미터 값을 포함합니다. ([#319](https://github.com/coil-kt/coil/pull/319))
-   **동작 변경**: `Request.Listener.onStart()` 타이밍을 `Target.onStart()` 직후에 호출되도록 약간 조정합니다. ([#348](https://github.com/coil-kt/coil/pull/348))

---

-   **신규**: `WeakMemoryCache` 구현을 추가합니다. ([#295](https://github.com/coil-kt/coil/pull/295))
-   **신규**: 비디오 프레임 디코딩을 지원하기 위해 `coil-video`를 추가합니다. ([#122](https://github.com/coil-kt/coil/pull/122))
-   **신규**: [`EventListener`](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/EventListener.kt)를 도입합니다. ([#314](https://github.com/coil-kt/coil/pull/314))
-   **신규**: [`ImageLoaderFactory`](https://github.com/coil-kt/coil/blob/main/coil/src/main/java/coil/ImageLoaderFactory.kt)를 도입합니다. ([#311](https://github.com/coil-kt/coil/pull/311))
-   **신규**: Android 11에서 애니메이션 HEIF 이미지 시퀀스를 지원합니다. ([#297](https://github.com/coil-kt/coil/pull/297))
-   **신규**: Java 호환성을 개선합니다. ([#262](https://github.com/coil-kt/coil/pull/262))
-   **신규**: 기본 `CachePolicy` 설정을 지원합니다. ([#307](https://github.com/coil-kt/coil/pull/307))
-   **신규**: 기본 `Bitmap.Config` 설정을 지원합니다. ([#342](https://github.com/coil-kt/coil/pull/342))
-   **신규**: 단일 메모리 캐시 항목을 지우기 위해 `ImageLoader.invalidate(key)`를 추가합니다. ([#55](https://github.com/coil-kt/coil/pull/55))
-   **신규**: 캐시된 이미지가 재사용되지 않는 이유를 설명하는 디버그 로그를 추가합니다. ([#346](https://github.com/coil-kt/coil/pull/346))
-   **신규**: get 요청에 대한 `error` 및 `fallback` 드로어블을 지원합니다.

---

-   수정: `Transformation`이 입력 비트맵 크기를 줄일 때 메모리 캐시 미스 문제를 수정합니다. ([#357](https://github.com/coil-kt/coil/pull/357))
-   수정: `BlurTransformation`에서 반지름이 RenderScript 최대값 미만인지 확인합니다. ([#291](https://github.com/coil-kt/coil/pull/291))
-   수정: 고색상 심도 이미지 디코딩 문제를 수정합니다. ([#358](https://github.com/coil-kt/coil/pull/358))
-   수정: Android 11 이상에서 `ImageDecoderDecoder` 충돌 우회 문제를 비활성화합니다. ([#298](https://github.com/coil-kt/coil/pull/298))
-   수정: API 23 미만에서 EXIF 데이터를 읽지 못하는 문제를 수정합니다. ([#331](https://github.com/coil-kt/coil/pull/331))
-   수정: Android R SDK와의 비호환성 문제를 수정합니다. ([#337](https://github.com/coil-kt/coil/pull/337))
-   수정: `ImageView`에 일치하는 `SizeResolver`가 있는 경우에만 부정확한 크기를 활성화합니다. ([#344](https://github.com/coil-kt/coil/pull/344))
-   수정: 캐시된 이미지가 요청된 크기에서 최대 1픽셀 오차를 가질 수 있도록 허용합니다. ([#360](https://github.com/coil-kt/coil/pull/360))
-   수정: 뷰가 보이지 않으면 교차 페이드 전환을 건너뜁니다. ([#361](https://github.com/coil-kt/coil/pull/361))

---

-   `CoilContentProvider`를 비권장합니다. ([#293](https://github.com/coil-kt/coil/pull/293))
-   여러 `ImageLoader` 메서드에 `@MainThread` 주석을 추가합니다.
-   라이프사이클이 현재 시작된 경우 `LifecycleCoroutineDispatcher` 생성을 방지합니다. ([#356](https://github.com/coil-kt/coil/pull/356))
-   `OriginalSize.toString()`에 전체 패키지 이름을 사용합니다.
-   소프트웨어 비트맵 디코딩 시 사전 할당합니다. ([#354](https://github.com/coil-kt/coil/pull/354))

---

-   Kotlin을 1.3.72로 업데이트합니다.
-   Coroutines를 1.3.5로 업데이트합니다.
-   OkHttp를 3.12.10으로 업데이트합니다.
-   Okio를 2.5.0으로 업데이트합니다.
-   AndroidX 의존성을 업데이트합니다:
    -   `androidx.exifinterface:exifinterface` -> 1.2.0

## [0.9.5] - 2020년 2월 6일

-   수정: 하드웨어 가속 여부를 확인하기 전에 뷰가 첨부되었는지 확인합니다. 이는 하드웨어 비트맵을 요청할 때 메모리 캐시를 놓칠 수 있는 경우를 수정합니다.

---

-   AndroidX 의존성을 업데이트합니다:
    -   `androidx.core:core-ktx` -> 1.2.0

## [0.9.4] - 2020년 2월 3일

-   수정: `ImageDecoderDecoder`에서 다운샘플링 시 가로세로 비율을 유지합니다. @zhanghai님께 감사드립니다.

---

-   이전에는 비트맵이 요청에서 지정된 구성과 같거나 그보다 큰 구성인 한 메모리 캐시에서 반환되었습니다. 예를 들어, `ARGB_8888` 비트맵을 요청하면 `RGBA_F16` 비트맵이 메모리 캐시에서 반환될 수 있었습니다. 이제 캐시된 구성과 요청된 구성이 같아야 합니다.
-   `CrossfadeDrawable` 및 `CrossfadeTransition`에서 `scale` 및 `durationMillis`를 공개 API로 만듭니다.

## [0.9.3] - 2020년 2월 1일

-   수정: `ScaleDrawable` 내부의 자식 드로어블이 중앙에 위치하도록 이동합니다.
-   수정: GIF 및 SVG가 경계를 완전히 채우지 못하는 경우를 수정합니다.

---

-   `HttpUrl.get()` 호출을 백그라운드 스레드로 지연합니다.
-   `BitmapFactory` null 비트맵 오류 메시지를 개선합니다.
-   하드웨어 비트맵 블랙리스트에 3개의 기기를 추가합니다. ([#264](https://github.com/coil-kt/coil/pull/264))

---

-   AndroidX 의존성을 업데이트합니다:
    -   `androidx.lifecycle:lifecycle-common-java8` -> 2.2.0

## [0.9.2] - 2020년 1월 19일

-   수정: API 19 미만에서 GIF 디코딩 문제를 수정합니다. @mario님께 감사드립니다.
-   수정: 래스터화된 벡터 드로어블이 샘플링된 것으로 표시되지 않는 문제를 수정합니다.
-   수정: `Movie` 치수가 0 이하인 경우 예외를 발생시키도록 합니다.
-   수정: 메모리 캐시 이벤트에 대해 `CrossfadeTransition`이 다시 시작되지 않는 문제를 수정합니다.
-   수정: 허용되지 않는 경우 하드웨어 비트맵을 모든 타겟 메서드에 반환하는 것을 방지합니다.
-   수정: `MovieDrawable`이 경계의 중앙에 자체적으로 위치하지 않는 문제를 수정합니다.

---

-   `CrossfadeDrawable`에서 자동 스케일링을 제거합니다.
-   `BitmapPool.trimMemory`를 공개 API로 만듭니다.
-   `AnimatedImageDrawable`을 `ScaleDrawable`로 감싸 경계를 채우도록 합니다.
-   `RequestBuilder.setParameter`에 `@JvmOverloads`를 추가합니다.
-   SVG의 뷰 박스가 설정되지 않은 경우 SVG의 뷰 박스를 크기로 설정합니다.
-   상태 및 레벨 변경을 `CrossfadeDrawable` 자식에게 전달합니다.

---

-   OkHttp를 3.12.8으로 업데이트합니다.

## [0.9.1] - 2019년 12월 30일

-   수정: `LoadRequestBuilder.crossfade(false)` 호출 시 충돌 문제를 수정합니다.

## [0.9.0] - 2019년 12월 30일

-   **Breaking**: `Transformation.transform`은 이제 `Size` 파라미터를 포함합니다. 이는 `Target`의 크기에 따라 출력 `Bitmap`의 크기를 변경하는 변환을 지원하기 위함입니다. 변환을 사용하는 요청은 이제 [이미지 샘플링](https://coil-kt.github.io/coil/getting_started/#image-sampling)에서도 제외됩니다.
-   **Breaking**: `Transformation`은 이제 모든 유형의 `Drawable`에 적용됩니다. 이전에는 입력 `Drawable`이 `BitmapDrawable`이 아닌 경우 `Transformation`이 건너뛰어졌습니다. 이제 `Drawable`은 `Transformation`을 적용하기 전에 `Bitmap`으로 렌더링됩니다.
-   **Breaking**: `ImageLoader.load`에 `null` 데이터를 전달하는 것은 이제 오류로 처리되며 `Target.onError` 및 `Request.Listener.onError`를 `NullRequestDataException`과 함께 호출합니다. 이 변경은 데이터가 `null`일 때 `fallback` 드로어블을 설정하는 것을 지원하기 위해 이루어졌습니다. 이전에는 요청이 조용히 무시되었습니다.
-   **Breaking**: `RequestDisposable.isDisposed`는 이제 `val`입니다.

---

-   **신규**: 사용자 지정 전환을 지원합니다. [자세한 내용은 여기](https://coil-kt.github.io/coil/transitions/)를 참조하세요. 전환은 API가 인큐베이팅 중이므로 실험적으로 표시됩니다.
-   **신규**: `LoadRequest`가 진행 중인 동안 일시 중단하는 것을 지원하기 위해 `RequestDisposable.await`를 추가합니다.
-   **신규**: 요청 데이터가 null일 때 `fallback` 드로어블을 설정하는 것을 지원합니다.
-   **신규**: `Precision`을 추가합니다. 이는 출력 `Drawable`의 크기를 정확하게 만들면서 스케일링을 지원하는 타겟(예: `ImageViewTarget`)에 대한 스케일링 최적화를 가능하게 합니다. 자세한 내용은 [문서](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/size/Precision.kt)를 참조하세요.
-   **신규**: 여러 캐시 키를 일치시키는 것을 지원하기 위해 `RequestBuilder.aliasKeys`를 추가합니다.

---

-   수정: `RequestDisposable`를 스레드 안전하게 만듭니다.
-   수정: `RoundedCornersTransformation`이 이제 타겟 크기에 맞춰 자른 다음 모서리를 둥글게 처리합니다.
-   수정: `CircleCropTransformation`이 이제 중앙에서 자릅니다.
-   수정: [하드웨어 비트맵 블랙리스트](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/memory/HardwareBitmapService.kt)에 여러 기기를 추가합니다.
-   수정: 드로어블을 비트맵으로 변환할 때 가로세로 비율을 유지합니다.
-   수정: `Scale.FIT` 사용 시 잠재적인 메모리 캐시 미스 문제를 수정합니다.
-   수정: `Parameters` 반복 순서가 확정적인지 확인합니다.
-   수정: `Parameters` 및 `ComponentRegistry` 생성 시 방어적 복사를 수행합니다.
-   수정: `RealBitmapPool`의 `maxSize`가 0 이상인지 확인합니다.
-   수정: `CrossfadeDrawable`이 애니메이션 중이 아니거나 완료된 경우 시작 드로어블을 표시합니다.
-   수정: 고유 크기가 정의되지 않은 자식을 처리하도록 `CrossfadeDrawable`을 조정합니다.
-   수정: `MovieDrawable`이 제대로 스케일링되지 않는 문제를 수정합니다.

---

-   Kotlin을 1.3.61으로 업데이트합니다.
-   Kotlin Coroutines를 1.3.3으로 업데이트합니다.
-   Okio를 2.4.3으로 업데이트합니다.
-   AndroidX 의존성을 업데이트합니다:
    -   `androidx.exifinterface:exifinterface` -> 1.1.0

## [0.8.0] - 2019년 10월 22일

-   **Breaking**: `SvgDrawable`이 제거되었습니다. 대신 SVG는 이제 `SvgDecoder`에 의해 `BitmapDrawable`로 사전 렌더링됩니다. 이로 인해 SVG는 **메인 스레드에서 렌더링하는 데 드는 비용이 크게 절감됩니다.** 또한 `SvgDecoder`는 이제 생성자에 `Context`를 요구합니다.
-   **Breaking**: `SparseIntArraySet` 확장 함수가 `coil.extension` 패키지로 이동했습니다.

---

-   **신규**: 요청별 네트워크 헤더 설정 지원을 추가합니다. [자세한 내용은 여기](https://github.com/coil-kt/coil/pull/120)를 참조하세요.
-   **신규**: 이미지 파이프라인을 통해 사용자 지정 데이터를 전달하는 것을 지원하는 새로운 `Parameters` API를 추가합니다.
-   **신규**: `RoundedCornersTransformation`에서 개별 코너 반지름을 지원합니다. @khatv911님께 감사드립니다.
-   **신규**: 선제적으로 리소스를 해제하는 것을 지원하기 위해 `ImageView.clear()`를 추가합니다.
-   **신규**: 다른 패키지에서 리소스를 로드하는 것을 지원합니다.
-   **신규**: `ViewSizeResolver`에 `subtractPadding` 속성을 추가하여 측정 시 뷰의 패딩을 빼는 것을 활성화/비활성화할 수 있도록 합니다.
-   **신규**: `HttpUrlFetcher` MIME 유형 감지를 개선합니다.
-   **신규**: `MovieDrawable` 및 `CrossfadeDrawable`에 `Animatable2Compat` 지원을 추가합니다.
-   **신규**: GIF의 반복 횟수를 설정하기 위해 `RequestBuilder<*>.repeatCount`를 추가합니다.
-   **신규**: `BitmapPool` 생성 기능을 공개 API로 추가합니다.
-   **신규**: `Request.Listener` 메서드에 `@MainThread` 주석을 추가합니다.

---

-   수정: `CoilContentProvider`를 테스트를 위해 보이도록 만듭니다.
-   수정: 리소스 캐시 키에 야간 모드를 포함합니다.
-   수정: `ImageDecoder` 네이티브 충돌을 우회하기 위해 소스를 임시적으로 디스크에 씁니다.
-   수정: 연락처 표시 사진 URI를 올바르게 처리합니다.
-   수정: `CrossfadeDrawable`의 자식에게 틴트를 전달합니다.
-   수정: 소스를 닫지 않는 여러 경우를 수정합니다.
-   수정: 손상되거나 불완전한 하드웨어 비트맵 구현을 가진 기기 블랙리스트를 추가합니다.

---

-   SDK 29에 대해 컴파일합니다.
-   Kotlin Coroutines를 1.3.2로 업데이트합니다.
-   OkHttp를 3.12.6으로 업데이트합니다.
-   Okio를 2.4.1으로 업데이트합니다.
-   `coil-base`에 대해 `appcompat-resources`를 선택적 `compileOnly` 의존성으로 변경합니다. `appcompat-resources`는 훨씬 더 작은 아티팩트입니다.

## [0.7.0] - 2019년 9월 8일

-   **Breaking**: `ImageLoaderBuilder.okHttpClient(OkHttpClient.Builder.() -> Unit)`는 이제 `ImageLoaderBuilder.okHttpClient(() -> OkHttpClient)`입니다. 초기화 프로그램도 이제 백그라운드 스레드에서 지연 호출됩니다. **사용자 지정 `OkHttpClient`를 설정하는 경우 디스크 캐싱을 활성화하려면 `OkHttpClient.cache`를 설정해야 합니다.** 사용자 지정 `OkHttpClient`를 설정하지 않으면 Coil은 디스크 캐싱이 활성화된 기본 `OkHttpClient`를 생성합니다. 기본 Coil 캐시는 `CoilUtils.createDefaultCache(context)`를 사용하여 생성할 수 있습니다. 예:

```kotlin
val imageLoader = ImageLoader(context) {
    okHttpClient {
        OkHttpClient.Builder()
            .cache(CoilUtils.createDefaultCache(context))
            .build()
    }
}
```

-   **Breaking**: `Fetcher.key`는 더 이상 기본 구현을 가지지 않습니다.
-   **Breaking**: 이전에는 첫 번째 적용 가능한 `Mapper`만 호출되었습니다. 이제 모든 적용 가능한 `Mapper`가 호출됩니다. API 변경은 없습니다.
-   **Breaking**: 사소한 이름 지정 파라미터 이름 변경: `url` -> `uri`, `factory` -> `initializer`.

---

-   **신규**: SVG를 자동으로 디코딩하는 `SvgDecoder`를 포함하는 `coil-svg` 아티팩트. [AndroidSVG](https://github.com/BigBadaboom/androidsvg)에 의해 구동됩니다. @rharter님께 감사드립니다.
-   **신규**: `load(String)` 및 `get(String)`은 이제 지원되는 모든 Uri 스킴을 허용합니다. 예: 이제 `imageView.load("file:///path/to/file.jpg")`를 사용할 수 있습니다.
-   **신규**: `ImageLoader`를 `Call.Factory`를 사용하도록 리팩터링합니다. 이는 `ImageLoaderBuilder.okHttpClient { OkHttpClient() }`를 사용하여 네트워킹 리소스의 지연 초기화를 가능하게 합니다. @ZacSweers님께 감사드립니다.
-   **신규**: 요청에 대한 디코더를 명시적으로 설정하기 위한 `RequestBuilder.decoder`를 추가합니다.
-   **신규**: `ImageLoader`에 대해 기본적으로 하드웨어 비트맵을 활성화/비활성화하기 위한 `ImageLoaderBuilder.allowHardware`를 추가합니다.
-   **신규**: `ImageDecoderDecoder`에서 소프트웨어 렌더링을 지원합니다.
-   수정: 벡터 드로어블 로드에 대한 여러 버그.
-   수정: `WRAP_CONTENT` 뷰 치수를 지원합니다.
-   수정: 8192바이트보다 긴 EXIF 데이터 파싱을 지원합니다.
-   수정: 교차 페이드 시 가로세로 비율이 다른 드로어블을 늘리지 않도록 합니다.
-   수정: 예외로 인해 네트워크 옵저버 등록 실패에 대비합니다.
-   수정: `MovieDrawable`의 0으로 나누기 오류를 수정합니다. @R12rus님께 감사드립니다.
-   수정: 중첩된 Android 에셋 파일을 지원합니다. @JaCzekanski님께 감사드립니다.
-   수정: Android O 및 O_MR1에서 파일 디스크립터 고갈에 대비합니다.
-   수정: 메모리 캐시 비활성화 시 충돌하지 않도록 합니다. @hansenji님께 감사드립니다.
-   수정: `Target.cancel`이 항상 메인 스레드에서 호출되도록 합니다.

---

-   Kotlin을 1.3.50으로 업데이트합니다.
-   Kotlin Coroutines를 1.3.0으로 업데이트합니다.
-   OkHttp를 3.12.4로 업데이트합니다.
-   Okio를 2.4.0으로 업데이트합니다.
-   AndroidX 의존성을 최신 안정 버전으로 업데이트합니다:
    -   `androidx.appcompat:appcompat` -> 1.1.0
    -   `androidx.core:core-ktx` -> 1.1.0
    -   `androidx.lifecycle:lifecycle-common-java8` -> 2.1.0
-   선택적 `compileOnly` 의존성으로 `appcompat`을 `appcompat-resources`로 대체합니다. `appcompat-resources`는 훨씬 더 작은 아티팩트입니다.

## [0.6.1] - 2019년 8월 16일

-   신규: `RequestBuilder`에 `transformations(List<Transformation>)`를 추가합니다.
-   수정: 파일 URI의 캐시 키에 최종 수정 날짜를 추가합니다.
-   수정: