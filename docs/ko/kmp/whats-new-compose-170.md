[//]: # (title: Compose Multiplatform 1.7.3의 새로운 기능)

이번 기능 릴리스의 주요 내용은 다음과 같습니다:

*   [타입-세이프 내비게이션](#type-safe-navigation)
*   [공유 요소 전환](#shared-element-transitions)
*   [Android 에셋에 패키징된 멀티플랫폼 리소스](#resources-packed-into-android-assets)
*   [사용자 지정 리소스 디렉터리](#custom-resource-directories)
*   [멀티플랫폼 테스트 리소스 지원](#support-for-multiplatform-test-resources)
*   [iOS에서 터치 상호 운용성 개선](#new-default-behavior-for-processing-touch-in-ios-native-elements)
*   [Material3 `adaptive` 및 `material3-window-size-class`가 이제 공통 코드에 포함](#material3-adaptive-adaptive)
*   [데스크톱에 드래그 앤 드롭 구현](#drag-and-drop)
*   [데스크톱에 `BasicTextField` 채택됨](#basictextfield-renamed-from-basictextfield2-adopted-on-desktop)

이번 릴리스의 전체 변경 사항은 [GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#170-october-2024)에서 확인할 수 있습니다.

## 종속성

*   Gradle 플러그인 `org.jetbrains.compose`, 버전 1.7.3. Jetpack Compose 라이브러리 기반:
    *   [Runtime 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.7.5)
    *   [UI 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.7.5)
    *   [Foundation 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.7.5)
    *   [Material 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-material#1.7.5)
    *   [Material3 1.3.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.1)
*   Lifecycle 라이브러리 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.3`. [Jetpack Lifecycle 2.8.5](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.5) 기반.
*   내비게이션 라이브러리 `org.jetbrains.androidx.navigation:navigation-*:2.8.0-alpha10`. [Jetpack Navigation 2.8.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.8.0) 기반.
*   Material3 Adaptive 라이브러리 `org.jetbrains.compose.material3.adaptive:adaptive-*:1.0.0`. [Jetpack Material3 Adaptive 1.0.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.0.0) 기반.

## 호환성을 깨뜨리는 변경 사항

### 최소 AGP 버전이 8.1.0으로 상향 조정되었습니다

Jetpack Compose 1.7.0과 Lifecycle 2.8.0은 모두 Compose Multiplatform 1.7.0에서 사용되는데, AGP 7을 지원하지 않습니다. 따라서 Compose Multiplatform 1.7.3으로 업데이트할 때 AGP 종속성도 업그레이드해야 할 수 있습니다.

> Android Studio에서 새로 구현된 Android 컴포저블 미리보기 기능은 최신 AGP 버전 중 하나를 [필요로 합니다](#resources-packed-into-android-assets).
>
{style="note"}

### 자바 리소스 API는 멀티플랫폼 리소스 라이브러리 지원으로 인해 사용이 중단됩니다

<!-- TODO additional copy editing -->

이번 릴리스에서는 `compose.ui` 패키지에서 사용할 수 있는 자바 리소스 API를 명시적으로 지원 중단합니다: `painterResource()`, `loadImageBitmap()`, `loadSvgPainter()`, `loadXmlImageVector()` 함수뿐만 아니라 `ClassLoaderResourceLoader` 클래스 및 이에 의존하는 함수도 포함됩니다.

[멀티플랫폼 리소스 라이브러리](compose-multiplatform-resources.md)로 전환하는 것을 고려해 보세요. Compose Multiplatform에서 자바 리소스를 사용할 수 있지만, 생성된 접근자, 멀티모듈 지원, 지역화 등과 같은 프레임워크에서 제공하는 확장 기능의 이점을 누릴 수 없습니다.

여전히 자바 리소스에 접근해야 한다면, [풀 리퀘스트에서 제안된 구현](https://github.com/JetBrains/compose-multiplatform-core/pull/1457)을 복사하여 Compose Multiplatform 1.7.3으로 업그레이드하고 가능할 때 멀티플랫폼 리소스로 전환한 후에도 코드가 작동하도록 할 수 있습니다.

### iOS 네이티브 요소에서 터치 처리의 새로운 기본 동작

1.7.3 이전에는 Compose Multiplatform이 상호 운용 UI 뷰에서 발생하는 터치 이벤트에 응답할 수 없었으므로, 상호 운용 뷰가 이러한 터치 시퀀스를 전적으로 처리했습니다.

Compose Multiplatform 1.7.3은 상호 운용 터치 시퀀스 처리를 위한 더욱 정교한 로직을 구현합니다. 기본적으로 초기 터치 후 지연 시간이 생겨, 부모 컴포저블이 해당 터치 시퀀스가 네이티브 뷰와 상호 작용하기 위한 것인지 이해하고 그에 따라 반응할 수 있도록 돕습니다.

자세한 내용은 [이 페이지의 iOS 섹션](#ios-touch-interop)에서 설명을 참조하거나 [이 기능에 대한 문서](compose-ios-touch.md)를 읽어보세요.

### iOS에서 최소 프레임 지속 시간 비활성화가 필수입니다

개발자들은 고주사율 디스플레이에 대한 출력 경고를 종종 인지하지 못했고, 사용자들은 120Hz 지원 기기에서 부드러운 애니메이션을 경험하지 못했습니다. 이제 이 검사를 엄격하게 시행합니다. Compose Multiplatform으로 빌드된 앱은 이제 `Info.plist` 파일의 `CADisableMinimumFrameDurationOnPhone` 속성이 없거나 `false`로 설정된 경우 크래시됩니다.

`ComposeUIViewControllerConfiguration.enforceStrictPlistSanityCheck` 속성을 `false`로 설정하여 이 동작을 비활성화할 수 있습니다.

### 데스크톱에서 Modifier.onExternalDrag 지원 중단

<!-- TODO additional copy editing -->

실험적인 `Modifier.onExternalDrag` 및 관련 API는 새로운 `Modifier.dragAndDropTarget`을 선호하여 지원 중단되었습니다. `DragData` 인터페이스는 `compose.ui.draganddrop` 패키지로 이동되었습니다.

Compose Multiplatform 1.7.0에서 지원 중단된 API를 사용하는 경우, 사용 중단 오류가 발생합니다. 1.8.0에서는 `onExternalDrag` 모디파이어가 완전히 제거될 예정입니다.

## 플랫폼 공통

### 공유 요소 전환

Compose Multiplatform은 이제 일관된 요소를 공유하는 컴포저블 간의 원활한 전환을 위한 API를 제공합니다. 이러한 전환은 내비게이션에서 유용하며, 사용자가 UI 변경의 흐름을 따라갈 수 있도록 돕습니다.

API에 대한 자세한 내용은 [Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/animation/shared-elements)를 참조하세요.

### 타입-세이프 내비게이션

Compose Multiplatform은 Jetpack Compose의 타입-세이프 방식을 채택하여 내비게이션 경로를 따라 객체를 전달합니다. Navigation 2.8.0의 새로운 API를 통해 Compose는 내비게이션 그래프에 컴파일 시간 안전성을 제공합니다. 이러한 API는 XML 기반 내비게이션을 위한 [Safe Args](https://developer.android.com/guide/navigation/use-graph/pass-data#Safe-args) 플러그인과 동일한 결과를 얻을 수 있습니다.

자세한 내용은 [Navigation Compose의 타입 안전성에 대한 Google 문서](https://developer.android.com/guide/navigation/design/type-safety)를 참조하세요.

### 멀티플랫폼 리소스

#### Android 에셋에 패키징된 리소스

모든 멀티플랫폼 리소스는 이제 Android 에셋에 패키징됩니다. 이를 통해 Android Studio는 Android 소스 세트의 Compose Multiplatform 컴포저블에 대한 미리보기를 생성할 수 있습니다.

> Android Studio 미리보기는 Android 소스 세트의 컴포저블에서만 사용할 수 있습니다.
> 또한 최신 AGP 버전 중 하나인 8.5.2, 8.6.0-rc01 또는 8.7.0-alpha04가 필요합니다.
>
{style="note"}

또한 Android에서 WebView 및 미디어 플레이어 컴포넌트에서 멀티플랫폼 리소스에 직접 접근할 수 있습니다. 예를 들어 `Res.getUri(“files/index.html”)`와 같이 간단한 경로로 리소스에 접근할 수 있기 때문입니다.

다음은 리소스 HTML 페이지와 리소스 이미지 링크를 표시하는 Android 컴포저블의 예입니다:

```kotlin
// androidMain/kotlin/com/example/webview/App.kt
@OptIn(ExperimentalResourceApi::class)
@Composable
@Preview
fun App() {
    MaterialTheme {
        val uri = Res.getUri("files/webview/index.html")

        // Adding a WebView inside AndroidView with layout as full screen.
        AndroidView(factory = {
            WebView(it).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
        }, update = {
            it.loadUrl(uri)
        })
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="AndroidView(factory = { WebView(it).apply"}

이 예제는 다음 간단한 HTML 파일과 함께 작동합니다:

```html
<html>
<header>
    <title>
        Cat Resource
    </title>
</header>
<body>
    <img src="cat.jpg">
</body>
</html>
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="<title>Cat Resource</title>"}

이 예제의 두 리소스 파일은 모두 `commonMain` 소스 세트에 있습니다:

![composeResources 디렉터리의 파일 구조](compose-resources-android-webview.png){width="230"}

#### 사용자 지정 리소스 디렉터리

새로운 구성 DSL의 `customDirectory` 설정을 사용하여 특정 소스 세트에 [사용자 지정 디렉터리를 연결](compose-multiplatform-resources-setup.md#custom-resource-directories)할 수 있습니다. 예를 들어 다운로드한 파일을 리소스로 사용할 수 있습니다.

#### 멀티플랫폼 폰트 캐시

Compose Multiplatform은 Android의 폰트 캐시 기능을 다른 플랫폼으로 가져와 `Font` 리소스의 과도한 바이트 읽기를 제거합니다.

#### 멀티플랫폼 테스트 리소스 지원

리소스 라이브러리는 이제 프로젝트에서 테스트 리소스를 사용하는 것을 지원하며, 이는 다음을 의미합니다:

*   테스트 소스 세트에 리소스를 추가할 수 있습니다.
*   해당 소스 세트에서만 사용 가능한 생성된 접근자를 사용할 수 있습니다.
*   테스트 실행 시에만 테스트 리소스를 앱에 패키징할 수 있습니다.

#### 쉬운 접근을 위해 문자열 ID로 매핑된 리소스

각 타입의 리소스는 파일 이름으로 매핑됩니다. 예를 들어 `Res.allDrawableResources` 속성을 사용하여 모든 `drawable` 리소스의 맵을 가져오고 문자열 ID를 전달하여 필요한 리소스에 접근할 수 있습니다:

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

#### 바이트 배열을 ImageBitmap 또는 ImageVector로 변환하는 함수

`ByteArray`를 이미지 리소스로 변환하는 새로운 함수들이 있습니다:

*   `decodeToImageBitmap()`는 JPEG, PNG, BMP 또는 WEBP 파일을 `ImageBitmap` 객체로 변환합니다.
*   `decodeToImageVector()`는 XML 벡터 파일을 `ImageVector` 객체로 변환합니다.
*   `decodeToSvgPainter()`는 SVG 파일을 `Painter` 객체로 변환합니다. 이 함수는 Android에서는 사용할 수 없습니다.

자세한 내용은 [문서](compose-multiplatform-resources-usage.md#convert-byte-arrays-into-images)를 참조하세요.

### 새로운 공통 모듈

#### material3.adaptive:adaptive*

Material3 adaptive 모듈은 이제 Compose Multiplatform과 함께 공통 코드에서 사용할 수 있습니다. 이를 사용하려면 모듈의 `build.gradle.kts` 파일에서 해당 종속성을 `commonMain` 소스 세트에 명시적으로 추가하세요:

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-layout:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-navigation:1.0.0-alpha03")
}
```

#### material3.material3-adaptive-navigation-suite

[적응형 내비게이션 구축](https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation)에 필요한 Material3 adaptive navigation suite는 Compose와 함께 Compose Multiplatform의 공통 코드에서 사용할 수 있습니다. 이를 사용하려면 모듈의 `build.gradle.kts` 파일에서 해당 종속성을 `commonMain` 소스 세트에 명시적으로 추가하세요:

```kotlin
commonMain.dependencies {
    implementation(compose.material3AdaptiveNavigationSuite)
}
```

#### material3:material3-window-size-class

[`WindowSizeClass`](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 클래스를 사용하려면 모듈의 `build.gradle.kts` 파일에서 `material3-window-size-class` 종속성을 `commonMain` 소스 세트에 명시적으로 추가하세요.

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3:material3-window-size-class:1.7.3")
}
```

`calculateWindowSizeClass()` 함수는 아직 공통 코드에서 사용할 수 없습니다. 하지만 플랫폼별 코드에서 임포트하고 호출할 수 있습니다. 예를 들어 다음과 같습니다:

```kotlin
// desktopMain/kotlin/main.kt
import androidx.compose.material3.windowsizeclass.calculateWindowSizeClass

// ...

val size = calculateWindowSizeClass()
```

#### material-navigation

`material-navigation` 라이브러리는 Compose Multiplatform Navigation 외에도 공통 코드에서 사용할 수 있습니다. 이를 사용하려면 모듈의 `build.gradle.kts` 파일에서 다음 명시적 종속성을 `commonMain` 소스 세트에 추가하세요:

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.androidx.navigation:navigation-compose:2.8.0-alpha10")
    implementation("org.jetbrains.compose.material:material-navigation:1.7.0-beta02")
}
```

### Skia가 마일스톤 126으로 업데이트되었습니다

Compose Multiplatform에서 [Skiko](https://github.com/JetBrains/skiko)를 통해 사용하는 Skia 버전이 마일스톤 126으로 업데이트되었습니다.

이전 Skia 버전은 마일스톤 116이었습니다. 이 버전들 사이의 변경 사항은 [릴리스 노트](https://skia.googlesource.com/skia/+/refs/heads/main/RELEASE_NOTES.md#milestone-126)에서 확인할 수 있습니다.

### GraphicsLayer – 새로운 드로잉 API

Jetpack Compose 1.7.0에 추가된 새로운 드로잉 레이어가 이제 Compose Multiplatform에서 사용할 수 있습니다.

`Modifier.graphicsLayer`와 달리 새로운 `GraphicsLayer` 클래스를 사용하면 컴포저블 콘텐츠를 어디든 렌더링할 수 있습니다. 이는 애니메이션 콘텐츠가 다른 장면에서 렌더링될 것으로 예상되는 경우에 유용합니다.

자세한 설명과 예시는 [참조 문서](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/layer/GraphicsLayer)를 참조하세요.

### LocalLifecycleOwner가 Compose UI 밖으로 이동했습니다

`LocalLifecycleOwner` 클래스가 Compose UI 패키지에서 Lifecycle 패키지로 이동되었습니다.

이 변경으로 인해 Compose UI와 독립적으로 클래스에 접근하고 Compose 기반 헬퍼 API를 호출할 수 있습니다. 하지만 Compose UI 바인딩이 없으면 `LocalLifecycleOwner` 인스턴스는 플랫폼 통합이 없어 플랫폼별 이벤트를 수신할 수 없다는 점을 명심하십시오.

## iOS

### Compose Multiplatform과 네이티브 iOS 간 터치 상호 운용성 개선 {id="ios-touch-interop"}

이번 릴리스에서는 iOS 상호 운용 뷰에 대한 터치 처리가 개선되었습니다. Compose Multiplatform은 이제 터치가 상호 운용 뷰를 위한 것인지 또는 Compose에서 처리되어야 하는지 감지하려고 시도합니다. 이를 통해 Compose Multiplatform 앱 내에서 UIKit 또는 SwiftUI 영역에서 발생하는 터치 이벤트를 처리할 수 있습니다.

기본적으로 Compose Multiplatform은 상호 운용 뷰로 터치 이벤트를 전송하는 것을 150ms 지연합니다:

*   이 시간 내에 일정 거리 임계값을 초과하는 움직임이 있으면, 부모 컴포저블이 터치 시퀀스를 가로채고 상호 운용 뷰로 전달되지 않습니다.
*   눈에 띄는 움직임이 없으면 Compose는 나머지 터치 시퀀스를 처리하지 않고, 대신 상호 운용 뷰에서 전적으로 처리됩니다.

이러한 동작은 네이티브 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview)의 작동 방식과 일치합니다. 이는 상호 운용 뷰에서 시작된 터치 시퀀스가 Compose Multiplatform이 이를 처리할 기회를 얻지 못하고 가로채지는 상황을 방지하는 데 도움이 됩니다. 이는 사용자에게 불쾌한 경험을 줄 수 있습니다. 예를 들어, 지연 목록(lazy list)과 같이 스크롤 가능한 컨텍스트에서 사용되는 큰 상호 운용 비디오 플레이어를 상상해 보세요. 화면의 대부분을 차지하는 비디오가 Compose Multiplatform이 인지하지 못하는 모든 터치를 가로챌 때 목록을 스크롤하기가 어렵습니다.

### 네이티브 성능 개선

<!-- TODO additional copy editing -->

Kotlin 2.0.20을 통해 Kotlin/Native 팀은 iOS에서 Compose 앱의 성능을 더 빠르고 부드럽게 만드는 데 많은 진전을 이루었습니다. Compose Multiplatform 1.7.3 릴리스는 이러한 최적화를 활용하고, Jetpack Compose 1.7.0의 성능 개선 사항도 가져옵니다.

Compose Multiplatform 1.6.11과 Kotlin 2.0.0을 조합한 경우와 Compose Multiplatform 1.7.3을 Kotlin 2.0.20과 조합한 경우, 전반적으로 더 나은 결과를 볼 수 있습니다:

*   *LazyGrid* 벤치마크는 실제 사용 사례와 가장 유사한 `LazyVerticalGrid` 스크롤링을 시뮬레이션하며 평균적으로 **약 9%** 더 빠르게 작동합니다. 또한 놓친 프레임 수가 현저히 줄어들어, 이는 일반적으로 사용자가 UI 반응성이 떨어진다고 느끼게 만듭니다. 직접 사용해 보세요: Compose Multiplatform으로 만든 iOS 앱은 훨씬 더 부드럽게 느껴질 것입니다.
*   *VisualEffects* 벤치마크는 무작위로 배치된 많은 컴포넌트를 렌더링하며 **3.6배** 더 빠르게 작동합니다: 1000프레임당 평균 CPU 시간이 8.8초에서 2.4초로 단축되었습니다.
*   *AnimatedVisibility* 컴포저블은 이미지를 표시하고 숨기는 애니메이션을 구현하며 **약 6%** 더 빠른 렌더링을 보여줍니다.

이 외에도 Kotlin 2.0.20은 가비지 컬렉터에서 [동시 마킹에 대한 실험적 지원](https://kotlinlang.org/docs/whatsnew2020.html#concurrent-marking-in-garbage-collector)을 도입합니다. 동시 마킹을 활성화하면 가비지 컬렉터의 일시 중지 시간이 단축되어 모든 벤치마크에서 훨씬 더 큰 개선을 이끌어냅니다.

이러한 Compose 관련 벤치마크 코드는 Compose Multiplatform 저장소에서 확인할 수 있습니다:

*   [Kotlin/Native 성능 벤치마크](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/kn-performance)
*   [Kotlin/JVM 대 Kotlin/Native 벤치마크](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/ios/jvm-vs-kotlin-native)

## 데스크톱

### 드래그 앤 드롭

사용자가 Compose 애플리케이션 안팎으로 콘텐츠를 드래그할 수 있도록 하는 드래그 앤 드롭 메커니즘이 데스크톱용 Compose Multiplatform에 구현되었습니다. 드래그 앤 드롭의 잠재적 소스와 대상을 지정하려면 `dragAndDropSource` 및 `dragAndDropTarget` 모디파이어를 사용하세요.

> 이러한 모디파이어는 공통 코드에서 사용할 수 있지만, 현재는 데스크톱 및 Android 소스 세트에서만 작동합니다.
> 향후 릴리스를 기대해 주세요.
>
{style="note"}

일반적인 사용 사례는 Jetpack Compose 문서의 [전용 문서](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)를 참조하세요.

### BasicTextField (BasicTextField2에서 이름 변경)가 데스크톱에 채택되었습니다

Jetpack Compose는 `BasicTextField2` 컴포넌트를 안정화하고 `BasicTextField`로 이름을 변경했습니다. 이번 릴리스에서 Compose Multiplatform은 데스크톱 타겟에 대해 이 변경 사항을 채택했으며, 안정적인 1.7.0 버전에서는 iOS도 지원할 계획입니다.

새로운 `BasicTextField`는 다음과 같습니다:

*   상태를 더 안정적으로 관리할 수 있습니다.
*   텍스트 필드 콘텐츠를 프로그래밍 방식으로 변경하기 위한 새로운 `TextFieldBuffer` API를 제공합니다.
*   시각적 변환 및 스타일링을 위한 여러 새로운 API를 포함합니다.
*   필드의 이전 상태로 돌아갈 수 있는 `UndoState`에 대한 접근을 제공합니다.

### ComposePanel의 렌더 설정

`ComposePanel` 생성자에서 새로운 `RenderSettings.isVsyncEnabled` 매개변수를 지정하여 백엔드 렌더링 구현에 수직 동기화(VSync)를 비활성화하도록 힌트를 줄 수 있습니다. 이는 입력과 UI 변경 사이의 시각적 지연을 줄일 수 있지만, 화면 찢어짐(screen tearing) 현상을 유발할 수도 있습니다.

기본 동작은 동일하게 유지됩니다: `ComposePanel`은 드로어블 프레젠테이션을 VSync와 동기화하려고 시도합니다.

## 웹

### Kotlin/Wasm 애플리케이션에서 skiko.js는 더 이상 필요하지 않습니다

<!-- TODO additional copy editing -->

`skiko.js` 파일은 Compose Multiplatform으로 빌드된 Kotlin/Wasm 애플리케이션에서 더 이상 필요하지 않습니다. `index.html` 파일에서 제거하여 앱의 로드 시간을 개선할 수 있습니다. `skiko.js`는 향후 릴리스에서 Kotlin/Wasm 배포판에서 완전히 제거될 예정입니다.

> `skiko.js` 파일은 Kotlin/JS 애플리케이션에서는 여전히 필요합니다.
>
{style="note"}