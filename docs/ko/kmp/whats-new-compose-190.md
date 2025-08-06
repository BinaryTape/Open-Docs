[//]: # (title: Compose Multiplatform %org.jetbrains.compose-eap%의 새로운 기능)

이번 EAP 기능 릴리스의 주요 내용은 다음과 같습니다:

* [Material 3 Expressive 테마](#new-material-3-expressive-theme)
* [사용자 정의 가능한 그림자](#customizable-shadows)
* [@Preview 어노테이션을 위한 매개변수](#parameters-for-the-preview-annotation)
* [iOS에서의 프레임 레이트 구성](#frame-rate-configuration)
* [웹 타겟에서의 접근성 지원](#accessibility-support)
* [HTML 콘텐츠 임베딩을 위한 새로운 API](#new-api-for-embedding-html-content)

이 릴리스의 전체 변경 사항은 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.9.0-beta01)에서 확인할 수 있습니다.

## 의존성

* Gradle 플러그인 `org.jetbrains.compose`, 버전 %org.jetbrains.compose-eap%. Jetpack Compose 라이브러리 기반:
   * [Runtime 1.9.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.9.0-beta02)
   * [UI 1.9.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.9.0-beta02)
   * [Foundation 1.9.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.9.0-beta02)
   * [Material 1.9.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-material#1.9.0-beta02)
   * [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
* Compose Material3 라이브러리 `org.jetbrains.compose.material3:1.9.0-alpha04`. [Jetpack Material3 1.4.0-alpha17](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-alpha17) 기반

  공통 Material3 라이브러리의 안정화 버전은 Jetpack Compose Material3 1.3.2를 기반으로 하지만, Compose Multiplatform과 Material3의 [버전 분리](#decoupled-material3-versioning) 덕분에 프로젝트에 더 새로운 EAP 버전을 선택할 수 있습니다.
* Compose Material3 Adaptive 라이브러리 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha04`. [Jetpack Material3 Adaptive 1.2.0-alpha08](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.2.0-alpha08) 기반
* Graphics-Shapes 라이브러리 `org.jetbrains.androidx.graphics:graphics-shapes:1.0.0-alpha09`. [Jetpack Graphics-Shapes 1.0.1](https://developer.android.com/jetpack/androidx/releases/graphics#graphics-shapes-1.0.1) 기반
* Lifecycle 라이브러리 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.1`. [Jetpack Lifecycle 2.9.1](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.1) 기반
* Navigation 라이브러리 `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta04`. [Jetpack Navigation 2.9.1](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.1) 기반
* Savedstate 라이브러리 `org.jetbrains.androidx.savedstate:savedstate:1.3.1`. [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0) 기반
* WindowManager Core 라이브러리 `org.jetbrains.androidx.window:window-core:1.4.0-alpha09`. [Jetpack WindowManager 1.4.0](https://developer.android.com/jetpack/androidx/releases/window#1.4.0) 기반

## 플랫폼 전반

### 새로운 Material 3 Expressive 테마
<secondary-label ref="Experimental"/>

Compose Multiplatform은 이제 Material 3 라이브러리의 실험적인 [`MaterialExpressiveTheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary?hl=en#MaterialExpressiveTheme(androidx.compose.material3.ColorScheme,androidx.compose.material3.MotionScheme,androidx.compose.material3.Shapes,androidx.compose.material3.Typography,kotlin.Function0))을 지원합니다. Expressive 테마는 Material Design 앱을 더욱 개인화된 경험으로 커스터마이즈할 수 있도록 해줍니다.

Expressive 테마를 사용하려면:

1. Material 3의 최신 버전을 포함합니다:
 
    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:%org.jetbrains.compose.material3%")
    ```

2. `@OptIn(ExperimentalMaterial3ExpressiveApi::class)` opt-in과 함께 `MaterialExpressiveTheme()` 함수를 사용하여 `colorScheme`, `motionScheme`, `shapes`, `typography` 매개변수를 설정하여 UI 요소의 전체 테마를 구성합니다.

[`Button()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-button.html) 및 [`Checkbox()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-checkbox.html)와 같은 Material 컴포넌트는 제공한 값을 자동으로 사용합니다.

<img src="compose_expressive_theme.animated.gif" alt="Material 3 Expressive" width="250" preview-src="compose_expressive_theme.png"/>

### 사용자 정의 가능한 그림자

Compose Multiplatform %org.jetbrains.compose-eap%에서는 Jetpack Compose의 새로운 그림자 프리미티브와 API를 채택하여 사용자 정의 가능한 그림자를 도입했습니다. 기존에 지원되던 `shadow` 모디파이어 외에도, 이제 새로운 API를 사용하여 더 고급스럽고 유연한 그림자 효과를 만들 수 있습니다.

두 가지 새로운 프리미티브(`DropShadowPainter()`와 `InnerShadowPainter()`)를 사용하여 다양한 유형의 그림자를 만들 수 있습니다.

이 새로운 그림자를 UI 컴포넌트에 적용하려면 `dropShadow` 또는 `innerShadow` 모디파이어로 그림자 효과를 구성합니다:

<list columns="2">
   <li><code-block lang="kotlin">
        Box(
            Modifier.size(120.dp)
                .dropShadow(
                    RectangleShape,
                    DropShadow(12.dp)
                )
                .background(Color.White)
        )
        Box(
            Modifier.size(120.dp)
                .innerShadow(
                    RectangleShape,
                    InnerShadow(12.dp)
                )
        )
   </code-block></li>
   <li><img src="compose-advanced-shadows.png" type="inline" alt="Customizable shadows" width="200"/></li>
</list>

어떤 모양과 색상의 그림자도 그릴 수 있으며, 그림자 지오메트리를 마스크로 사용하여 내부 그라데이션 채움 그림자를 만들 수도 있습니다:

<img src="compose-expressive-shadows.png" alt="Expressive shadows" width="244"/>

자세한 내용은 [그림자 API 참조](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/shadow/package-summary.html)를 참조하세요.

### @Preview 어노테이션을 위한 매개변수

Compose Multiplatform의 `@Preview` 어노테이션은 이제 디자인 타임 프리뷰에서 `@Composable` 함수가 렌더링되는 방식을 구성하기 위한 추가 매개변수를 포함합니다:

* `name`: 프리뷰의 표시 이름입니다.
* `group`: 프리뷰의 그룹 이름으로, 관련 프리뷰의 논리적 구성 및 선택적 표시를 가능하게 합니다.
* `widthDp`: 최대 너비(dp 단위)입니다.
* `heightDp`: 최대 높이(dp 단위)입니다.
* `locale`: 애플리케이션의 현재 로케일입니다.
* `showBackground`: 기본 배경색을 프리뷰에 적용할지 여부를 나타내는 플래그입니다.
* `backgroundColor`: 프리뷰의 배경색을 정의하는 32비트 ARGB 색상 정수입니다.

이 새로운 프리뷰 매개변수는 IntelliJ IDEA와 Android Studio 모두에서 인식되고 작동합니다.

### `androidx.compose.runtime:runtime`의 멀티플랫폼 타겟

Jetpack Compose와의 정렬을 개선하기 위해, Compose Multiplatform은 `androidx.compose.runtime:runtime` 아티팩트에 모든 타겟에 대한 지원을 직접 추가했습니다.

`org.jetbrains.compose.runtime:runtime` 아티팩트는 완전히 호환되며 이제 별칭으로 사용됩니다.

### `suspend` 람다와 함께하는 `runComposeUiTest()`

`runComposeUiTest()` 함수는 이제 `suspend` 람다를 허용하여 `awaitIdle()`과 같은 suspending 함수를 사용할 수 있도록 합니다.

새로운 API는 웹 환경을 위한 적절한 비동기 처리를 포함하여 지원되는 모든 플랫폼에서 올바른 테스트 실행을 보장합니다:

* JVM 및 네이티브 타겟의 경우, `runComposeUiTest()`는 `runBlocking()`과 유사하게 작동하지만, 지연을 건너뜨니다.
* 웹 타겟(Wasm 및 JS)의 경우, `Promise`를 반환하고 지연을 건너뛰면서 테스트 본문을 실행합니다.

## iOS

### 프레임 레이트 구성

iOS용 Compose Multiplatform은 이제 컴포저블 렌더링을 위한 선호 프레임 레이트 구성을 지원합니다. 애니메이션이 버벅거린다면 프레임 레이트를 높이는 것이 좋습니다. 반면에 애니메이션이 느리거나 정적이라면 전력 소비를 줄이기 위해 낮은 프레임 레이트에서 실행하는 것이 좋습니다.

선호 프레임 레이트 범주를 다음과 같이 설정할 수 있습니다:

```kotlin
Modifier.preferredFrameRate(FrameRateCategory.High)
```

또는 컴포저블에 특정 프레임 레이트가 필요한 경우, 0이 아닌 숫자를 사용하여 초당 프레임(fps) 단위로 선호 프레임 레이트를 정의할 수 있습니다:

```kotlin
Modifier.preferredFrameRate(30f)
```

## 웹

### 접근성 지원

Compose Multiplatform은 이제 웹 타겟에 대한 초기 접근성 지원을 제공합니다. 이 버전은 스크린 리더가 설명 레이블에 접근할 수 있도록 하고, 사용자가 접근성 탐색 모드에서 버튼을 탐색하고 클릭할 수 있도록 합니다.

이 버전에서는 다음 기능이 아직 지원되지 않습니다:

* 스크롤 및 슬라이더가 있는 인터롭(interop) 및 컨테이너 뷰를 위한 접근성.
* 순회 인덱스.

컴포넌트의 텍스트 설명, 기능 유형, 현재 상태 또는 고유 식별자와 같은 다양한 세부 정보를 접근성 서비스에 제공하기 위해 컴포넌트의 [시맨틱 속성](compose-accessibility.md#semantic-properties)을 정의할 수 있습니다.

예를 들어, 컴포저블에 `Modifier.semantics { heading() }`을 설정함으로써, 이 요소가 문서의 챕터나 하위 섹션 제목과 유사하게 헤딩 역할을 한다는 것을 접근성 서비스에 알립니다. 스크린 리더는 이 정보를 콘텐츠 탐색에 사용하여 사용자가 헤딩 사이를 직접 이동할 수 있도록 합니다.

```kotlin
Text(
    text = "This is heading", 
    modifier = Modifier.semantics { heading() }
)
```

접근성 지원은 이제 기본적으로 활성화되어 있지만, `isA11YEnabled`를 조정하여 언제든지 비활성화할 수 있습니다:

```kotlin
ComposeViewport(
    viewportContainer = document.body!!,
    configure = { isA11YEnabled = false }
) {
    Text("Hello, Compose Multiplatform for web")
}
```

### HTML 콘텐츠 임베딩을 위한 새로운 API

새로운 `WebElementView()` 컴포저블 함수를 사용하면 HTML 요소를 웹 애플리케이션에 원활하게 통합할 수 있습니다.

임베디드 HTML 요소는 Compose 코드에서 정의된 크기를 기반으로 캔버스 영역 위에 오버레이됩니다. 이 영역 내의 입력 이벤트를 가로채어 해당 이벤트가 Compose Multiplatform에 수신되지 않도록 합니다.

다음은 `WebElementView()`를 사용하여 Compose 애플리케이션 내에 대화형 지도 뷰를 표시하는 HTML 요소를 생성하고 임베딩하는 예시입니다:

```kotlin
private val ttOSM =
    "https://www.openstreetmap.org/export/embed.html?bbox=4.890965223312379%2C52.33722052818563%2C4.893990755081177%2C52.33860862450587&amp;layer=mapnik"

@Composable
fun Map() {
    Box(
        modifier = Modifier.fillMaxWidth().fillMaxHeight()
    ) {
        WebElementView(
            factory = {
                (document.createElement("iframe")
                        as HTMLIFrameElement)
                    .apply { src = ttOSM }
            },
            modifier = Modifier.fillMaxSize(),
            update = { iframe -> iframe.src = iframe.src }
        )
    }
}
```

이 함수는 `ComposeViewport` 진입점에서만 사용할 수 있습니다. `CanvasBasedWindow`는 더 이상 사용되지 않기 때문입니다.

### 컨텍스트 메뉴

Compose Multiplatform %org.jetbrains.compose-eap%는 웹 컨텍스트 메뉴에 대한 다음 업데이트를 제공합니다:

* 텍스트 컨텍스트 메뉴: 표준 Compose 텍스트 컨텍스트 메뉴는 이제 모바일 및 데스크톱 모드 모두에서 완벽하게 지원됩니다.
* 새로운 사용자 정의 가능한 컨텍스트 메뉴: Jetpack Compose의 새로운 사용자 정의 웹 컨텍스트 메뉴 API를 채택했습니다. 현재는 데스크톱 모드에서만 사용할 수 있습니다.

  이 새로운 API를 활성화하려면 애플리케이션 진입점에서 다음 설정을 사용합니다:
   
   ```kotlin
   ComposeFoundationFlags.isNewContextMenuEnabled = true
   ```

### 내비게이션 그래프 바인딩을 위한 간소화된 API

Compose Multiplatform은 브라우저의 내비게이션 상태를 `NavController`에 바인딩하기 위한 새로운 API를 도입했습니다:

```kotlin
suspend fun NavController.bindToBrowserNavigation()
```

새로운 함수는 `window` API와 직접 상호작용할 필요성을 제거하여 Kotlin/Wasm 및 Kotlin/JS 소스 세트를 모두 간소화합니다.

이전에 사용되던 `Window.bindToNavigation()` 함수는 새로운 `NavController.bindToBrowserNavigation()` 함수로 대체되어 더 이상 사용되지 않습니다.

이전:

```kotlin
LaunchedEffect(Unit) {
    // Directly interacts with the window object
    window.bindToNavigation(navController)
}
```

이후:

```kotlin
LaunchedEffect(Unit) {
    // Implicitly accesses the window object
    navController.bindToBrowserNavigation()
}
```

## Gradle 플러그인

### Material3 버전 분리

Material3 라이브러리와 Compose Multiplatform Gradle 플러그인의 버전 및 안정성 수준이 더 이상 일치할 필요가 없습니다. `compose.material3` DSL 별칭은 이제 Jetpack Compose의 이전 안정화 릴리스에 포함된 Material3 1.8.2를 참조합니다.

Expressive 디자인 지원이 포함된 최신 Material3 버전을 사용하려면 `build.gradle.kts`의 Material 3 의존성을 다음으로 바꿉니다:

```kotlin
implementation("org.jetbrains.compose.material3:material3:%org.jetbrains.compose.material3%")