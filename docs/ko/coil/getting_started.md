# 시작하기

## Compose UI

일반적인 Compose UI 프로젝트에서는 다음을 임포트해야 합니다:

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

임포트한 후에는 `AsyncImage`를 사용하여 네트워크에서 이미지를 로드할 수 있습니다:

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

!!! Note
    Compose Multiplatform을 사용하는 경우 OkHttp 대신 Ktor를 사용해야 합니다. 자세한 방법은 [여기](network.md#ktor-network-engines)를 참조하십시오.

## Android Views

Compose UI 대신 Android Views를 사용하는 경우 다음을 임포트합니다:

```kotlin
implementation("io.coil-kt.coil3:coil:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

임포트한 후에는 `ImageView.load` 확장 함수를 사용하여 네트워크에서 이미지를 로드할 수 있습니다:

```kotlin
imageView.load("https://example.com/image.jpg")
```

## 싱글톤 ImageLoader 구성하기

기본적으로 Coil은 싱글톤 `ImageLoader`를 포함합니다. `ImageLoader`는 들어오는 `ImageRequest`를 가져오고, 디코딩하고, 캐싱하고, 결과를 반환함으로써 실행합니다. `ImageLoader`를 구성할 필요는 없습니다. 구성하지 않으면 Coil이 기본 설정으로 싱글톤 `ImageLoader`를 생성합니다.

다양한 방법으로 구성할 수 있습니다 (**하나만 선택하십시오**):

- 앱의 진입점(앱의 루트 `@Composable`) 근처에서 `setSingletonImageLoaderFactory`를 호출합니다. **이 방법은 Compose Multiplatform 앱에 가장 적합합니다.**

```kotlin
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}
```

- Android에서 [`Application`](https://developer.android.com/reference/android/app/Application)에 `SingletonImageLoader.Factory`를 구현합니다. **이 방법은 Android 앱에 가장 적합합니다.**

```kotlin
class CustomApplication : Application(), SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

- 앱의 진입점(예: Android의 `Application.onCreate`) 근처에서 `SingletonImageLoader.setSafe`를 호출합니다. 이 방법이 가장 유연합니다.

```kotlin
SingletonImageLoader.setSafe { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}
```

!!! Note
    Coil에 의존하는 라이브러리를 작성하는 경우 싱글톤 `ImageLoader`를 가져오거나 설정해서는 안 됩니다. 대신, `io.coil-kt.coil3:coil-core`에 의존하고, 자체 `ImageLoader`를 생성하여 수동으로 전달해야 합니다. 라이브러리에서 싱글톤 `ImageLoader`를 설정하면 해당 라이브러리를 사용하는 앱이 Coil을 함께 사용하는 경우, 앱에서 설정한 `ImageLoader`를 덮어쓸 수 있습니다.

## 아티팩트

Coil이 `mavenCentral()`에 게시한 주요 아티팩트 목록은 다음과 같습니다:

*   `io.coil-kt.coil3:coil`: `io.coil-kt.coil3:coil-core`에 의존하는 기본 아티팩트입니다. 싱글톤 `ImageLoader` 및 관련 확장 함수를 포함합니다.
*   `io.coil-kt.coil3:coil-core`: `io.coil-kt.coil3:coil`의 하위 집합으로, 싱글톤 `ImageLoader` 및 관련 확장 함수를 **포함하지 않습니다**.
*   `io.coil-kt.coil3:coil-compose`: `io.coil-kt.coil3:coil` 및 `io.coil-kt.coil3:coil-compose-core`에 의존하는 기본 [Compose UI](https://www.jetbrains.com/compose-multiplatform/) 아티팩트입니다. 싱글톤 `ImageLoader`를 사용하는 `AsyncImage`, `rememberAsyncImagePainter`, `SubcomposeAsyncImage`에 대한 오버로드(overload)를 포함합니다.
*   `io.coil-kt.coil3:coil-compose-core`: `io.coil-kt.coil3:coil-compose`의 하위 집합으로, 싱글톤 `ImageLoader`에 의존하는 함수를 포함하지 않습니다.
*   `io.coil-kt.coil3:coil-network-okhttp`: [OkHttp](https://github.com/square/okhttp)를 사용하여 네트워크에서 이미지를 가져오는 기능을 지원합니다.
*   `io.coil-kt.coil3:coil-network-ktor2`: [Ktor 2](https://github.com/ktorio/ktor)를 사용하여 네트워크에서 이미지를 가져오는 기능을 지원합니다.
*   `io.coil-kt.coil3:coil-network-ktor3`: [Ktor 3](https://github.com/ktorio/ktor)를 사용하여 네트워크에서 이미지를 가져오는 기능을 지원합니다.
*   `io.coil-kt.coil3:coil-network-cache-control`: 네트워크에서 이미지를 가져올 때 [`Cache-Control` 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)를 준수하는 기능을 지원합니다.
*   `io.coil-kt.coil3:coil-gif`: GIF 디코딩을 지원하는 두 개의 [디코더](/coil/api/coil-core/coil3.decode/-decoder)를 포함합니다. 자세한 내용은 [GIF](gifs.md)를 참조하십시오.
*   `io.coil-kt.coil3:coil-svg`: SVG 디코딩을 지원하는 [디코더](/coil/api/coil-core/coil3.decode/-decoder)를 포함합니다. 자세한 내용은 [SVG](svgs.md)를 참조하십시오.
*   `io.coil-kt.coil3:coil-video`: [Android에서 지원하는 비디오 형식](https://developer.android.com/guide/topics/media/media-formats#video-codecs)에서 프레임을 디코딩하는 것을 지원하는 [디코더](/coil/api/coil-core/coil3.decode/-decoder)를 포함합니다. 자세한 내용은 [비디오](videos.md)를 참조하십시오.
*   `io.coil-kt.coil3:coil-test`: 테스트를 지원하는 클래스를 포함합니다. 자세한 내용은 [테스팅](testing.md)을 참조하십시오.
*   `io.coil-kt.coil3:coil-bom`: [재료 명세서(bill of materials)](https://docs.gradle.org/7.2/userguide/platforms.html#sub:bom_import)를 포함합니다. `coil-bom`을 임포트하면 버전을 지정하지 않고도 다른 Coil 아티팩트에 의존할 수 있습니다.