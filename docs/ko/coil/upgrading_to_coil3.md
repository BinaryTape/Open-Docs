# Coil 3.x으로 업그레이드

Coil 3은 여러 주요 개선 사항을 포함하는 Coil의 다음 주요 버전입니다.

- 모든 주요 타겟(Android, iOS, JVM, JS, [WASM](https://coil-kt.github.io/coil/sample/))을 포함하여 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)을 전폭적으로 지원합니다.
- 여러 네트워킹 라이브러리(Ktor 및 OkHttp)를 지원합니다. 또는 로컬/정적 파일만 로드해야 하는 경우 네트워크 종속성 없이 Coil을 사용할 수 있습니다.
- `LocalAsyncImagePreviewHandler`를 통한 Compose `@Preview` 렌더링 개선 및 사용자 정의 미리보기 동작을 지원합니다.
- 기존 동작을 중단해야 했던(아래에 설명됨) 버그에 대한 중요한 수정 사항이 있습니다.

이 문서는 Coil 2에서 Coil 3으로의 주요 변경 사항에 대한 개요를 제공하고, 중단되거나 중요한 변경 사항을 강조합니다. 모든 바이너리 비호환 변경 사항이나 사소한 동작 변경 사항을 다루지는 않습니다.

Compose Multiplatform 프로젝트에서 Coil 3을 사용하시나요? 예제는 [`samples`](https://github.com/coil-kt/coil/tree/3.x/samples/compose) 저장소를 확인하세요.

## Maven 좌표 및 패키지 이름

Coil의 Maven 좌표는 `io.coil-kt`에서 `io.coil-kt.coil3`으로, 패키지 이름은 `coil`에서 `coil3`으로 업데이트되었습니다. 이를 통해 Coil 3은 Coil 2와 바이너리 호환성 문제 없이 나란히 실행될 수 있습니다. 예를 들어, `io.coil-kt:coil:2.7.0`은 이제 `io.coil-kt.coil3:coil:3.0.0`입니다.

`coil-base` 및 `coil-compose-base` 아티팩트는 Coroutines, Ktor, AndroidX에서 사용되는 명명 규칙에 맞추기 위해 각각 `coil-core` 및 `coil-compose-core`로 이름이 변경되었습니다.

## 네트워크 이미지

**`coil-core`는 기본적으로 네트워크에서 이미지 로드를 더 이상 지원하지 않습니다.** [Coil의 네트워크 아티팩트 중 하나에 종속성을 추가해야 합니다. 자세한 내용은 여기를 참조하세요.](network.md). 이 변경은 사용자가 다른 네트워킹 라이브러리를 사용하거나 앱에 네트워크 종속성이 필요 없는 경우 이를 피할 수 있도록 하기 위함입니다.

또한, 캐시 제어 헤더는 기본적으로 더 이상 존중되지 않습니다. 자세한 내용은 [여기](network.md)를 참조하세요.

## 멀티플랫폼

Coil 3은 이제 Android, JVM, iOS, macOS, Javascript 및 WASM을 지원하는 Kotlin 멀티플랫폼 라이브러리입니다.

Android에서 Coil은 표준 그래픽 클래스를 사용하여 이미지를 렌더링합니다. Android가 아닌 플랫폼에서는 Coil이 [Skiko](https://github.com/JetBrains/skiko)를 사용하여 이미지를 렌더링합니다. Skiko는 Google이 개발한 [Skia](https://github.com/google/skia) 그래픽 엔진을 래핑하는 Kotlin 바인딩 집합입니다.

Android SDK로부터의 분리(decoupling)의 일환으로 여러 API 변경이 이루어졌습니다. 특히 다음과 같습니다.

- `Drawable`은 사용자 정의 `Image` 인터페이스로 대체되었습니다. Android에서는 `Drawable.asImage()`와 `Image.asDrawable(resources)`를 사용하여 클래스 간에 변환합니다. Android가 아닌 플랫폼에서는 `Bitmap.asImage()`와 `Image.toBitmap()`을 사용합니다.
- Android의 `android.net.Uri` 클래스 사용은 멀티플랫폼 `coil3.Uri` 클래스로 대체되었습니다. `android.net.Uri`를 `ImageRequest.data`로 전달하는 모든 호출 지점은 영향을 받지 않습니다. `android.net.Uri` 수신에 의존하는 사용자 정의 `Fetcher`는 `coil3.Uri`를 사용하도록 업데이트해야 합니다.
- `Context`의 사용은 `PlatformContext`로 대체되었습니다. `PlatformContext`는 Android에서 `Context`의 타입 별칭이며, Android가 아닌 플랫폼에서는 `PlatformContext.INSTANCE`를 사용하여 접근할 수 있습니다. Compose Multiplatform에서는 `LocalPlatformContext.current`를 사용하여 참조를 얻을 수 있습니다.
- `Coil` 클래스는 `SingletonImageLoader`로 이름이 변경되었습니다.
- 사용자 정의 Android `Application` 클래스에서 `ImageLoaderFactory`를 구현하고 있다면, `ImageLoaderFactory`를 대체하여 `SingletonImageLoader.Factory`를 구현하도록 전환해야 합니다. `SingletonImageLoader.Factory`를 구현하면 필요하거나 원하는 경우 `newImageLoader()`를 오버라이드할 수 있습니다.

`coil-svg` 아티팩트는 멀티플랫폼에서 지원되지만, `coil-gif` 및 `coil-video` 아티팩트는 특정 Android 디코더 및 라이브러리에 의존하므로 (현재로서는) 계속 Android 전용입니다.

## Compose

`coil-compose` 아티팩트의 API는 대부분 변경되지 않았습니다. `AsyncImage`, `SubcomposeAsyncImage`, `rememberAsyncImagePainter`를 Coil 2와 동일한 방식으로 계속 사용할 수 있습니다. 또한, 이 메서드들은 [재시작 가능하고 스킵 가능하도록](https://developer.android.com/jetpack/compose/performance/stability) 업데이트되어 성능이 향상될 것입니다.

- `AsyncImagePainter.state`는 이제 `StateFlow`입니다. `val state = painter.state.collectAsState()`를 사용하여 관찰해야 합니다.
- `AsyncImagePainter`의 기본 `SizeResolver`는 더 이상 첫 번째 `onDraw` 호출을 기다려 캔버스 크기를 가져오지 않습니다. 대신, `AsyncImagePainter`는 기본적으로 `Size.ORIGINAL`로 설정됩니다.
- Compose `modelEqualityDelegate` 델리게이트는 이제 `AsyncImage`/`SubcomposeAsyncImage`/`rememberAsyncImagePainter`의 매개변수 대신, `LocalAsyncImageModelEqualityDelegate`라는 컴포지션 로컬을 통해 설정됩니다.

## 일반

기타 중요한 동작 변경 사항은 다음과 같습니다.

- 퍼스트 파티 `Fetcher` 및 `Decoder` (예: `NetworkFetcher.Factory`, `SvgDecoder` 등)는 이제 서비스 로더를 통해 각 새 `ImageLoader`에 자동으로 추가됩니다. 이 동작은 `ImageLoader.Builder.serviceLoaderEnabled(false)`로 비활성화할 수 있습니다.
- `android.resource://example.package.name/drawable/image` URI에 대한 지원이 제거되었습니다. 이는 리소스 축소 최적화를 방해하기 때문입니다. `R.drawable.image` 값을 직접 전달하는 것이 좋습니다. 리소스 이름 대신 리소스 ID를 전달해도 여전히 작동합니다: `android.resource://example.package.name/12345678`. 여전히 이 기능이 필요한 경우 [컴포넌트 레지스트리에 `ResourceUriMapper`를 수동으로 포함](https://github.com/coil-kt/coil/blob/da7d872e340430014dbc5136e35eb62f9b17662e/coil-core/src/androidInstrumentedTest/kotlin/coil3/map/ResourceUriMapper.kt)할 수 있습니다.
- 파일의 최종 쓰기 타임스탬프는 기본적으로 캐시 키에 더 이상 추가되지 않습니다. 이는 메인 스레드에서 디스크를 읽는 것을(아주 짧은 시간이라도) 피하기 위함입니다. 이 기능은 `ImageRequest.Builder.addLastModifiedToFileCacheKey(true)` 또는 `ImageLoader.Builder.addLastModifiedToFileCacheKey(true)`로 다시 활성화할 수 있습니다.
- 출력 이미지 치수는 의도치 않은 OOM(Out Of Memory)을 방지하기 위해 4096x4096 미만으로 강제됩니다. 이는 `ImageLoader/ImageRequest.Builder.maxBitmapSize`로 구성할 수 있습니다. 이 동작을 비활성화하려면 `maxBitmapSize`를 `Size.ORIGINAL`로 설정하세요.
- Coil 2의 `Parameters` API는 `Extras`로 대체되었습니다. `Extras`는 문자열 키를 요구하지 않으며 대신 참조 동일성에 의존합니다. `Extras`는 메모리 캐시 키 수정을 지원하지 않습니다. 대신, 추가 데이터가 메모리 캐시 키에 영향을 미치는 경우 `ImageRequest.memoryCacheKeyExtra`를 사용하세요.
- `ImageRequest.Builder`의 많은 함수가 멀티플랫폼을 더 쉽게 지원하기 위해 확장 함수로 이동되었습니다.