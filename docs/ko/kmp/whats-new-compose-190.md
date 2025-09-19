[//]: # (title: Compose Multiplatform 1.9.0의 새로운 기능)

이번 기능 릴리스의 주요 내용은 다음과 같습니다:

*   [`@Preview` 어노테이션을 위한 파라미터](#parameters-for-the-preview-annotation)
*   [사용자 정의 가능한 그림자](#customizable-shadows)
*   [새로운 컨텍스트 메뉴 API](#new-context-menu-api)
*   [Material 3 Expressive 테마](#material-3-expressive-theme)
*   [iOS에서의 프레임 속도 설정](#frame-rate-configuration)
*   [베타 버전으로 출시된 웹용 Compose Multiplatform](#compose-multiplatform-for-web-in-beta)
*   [웹 타겟에서의 접근성 지원](#accessibility-support)
*   [HTML 콘텐츠 임베딩을 위한 새로운 API](#new-api-for-embedding-html-content)

이번 릴리스의 전체 변경 사항 목록은 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.9.0-beta01)에서 확인할 수 있습니다.

## 의존성

*   Gradle 플러그인 `org.jetbrains.compose`, 버전 1.9.0. Jetpack Compose 라이브러리 기반:
    *   [Runtime 1.9.0](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.9.0)
    *   [UI 1.9.0](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.9.0)
    *   [Foundation 1.9.0](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.9.0)
    *   [Material 1.9.0](https://developer.android.com/jetpack/androidx/releases/compose-material#1.9.0)
    *   [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)

*   Compose Material3 라이브러리 `org.jetbrains.compose.material3:1.9.0-beta06`. [Jetpack Material3 1.4.0-beta03](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-beta03) 기반.

    공통 Material3 라이브러리의 안정 버전은 Jetpack Compose Material3 1.3.2를 기반으로 하지만, Compose Multiplatform와 Material3의 [분리된 버전 관리](#decoupled-material3-versioning) 덕분에 프로젝트에 더 새로운 프리릴리스(pre-release) 버전을 선택할 수 있습니다.
*   Compose Material3 Adaptive 라이브러리 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha06`. [Jetpack Material3 Adaptive 1.2.0-alpha11](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.2.0-alpha11) 기반
*   Lifecycle 라이브러리 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.4`. [Jetpack Lifecycle 2.9.2](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.2) 기반
*   Navigation 라이브러리 `org.jetbrains.androidx.navigation:navigation-*:2.9.0`. [Jetpack Navigation 2.9.1](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.1) 기반
*   Savedstate 라이브러리 `org.jetbrains.androidx.savedstate:savedstate:1.3.4`. [Jetpack Savedstate 1.3.1](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.1) 기반
*   WindowManager Core 라이브러리 `org.jetbrains.androidx.window:window-core:1.4.0`. [Jetpack WindowManager 1.4.0](https://developer.android.com/jetpack/androidx/releases/window#1.4.0) 기반

## 모든 플랫폼에서

### `@Preview` 어노테이션을 위한 파라미터

Compose Multiplatform의 `@Preview` 어노테이션은 이제 디자인 타임 미리보기에서 `@Composable` 함수가 렌더링되는 방식을 구성하기 위한 추가 파라미터를 포함합니다:

*   `name`: 미리보기의 표시 이름입니다.
*   `group`: 미리보기의 그룹 이름으로, 관련 미리보기의 논리적 구성 및 선택적 표시를 가능하게 합니다.
*   `widthDp`: 최대 너비(dp 단위)입니다.
*   `heightDp`: 최대 높이(dp 단위)입니다.
*   `locale`: 애플리케이션의 현재 로케일입니다.
*   `showBackground`: 기본 배경색을 미리보기에 적용하는 플래그입니다.
*   `backgroundColor`: 미리보기의 배경색을 정의하는 32비트 ARGB 색상 정수입니다.

이 새로운 미리보기 파라미터는 IntelliJ IDEA와 Android Studio 모두에서 인식되고 작동합니다.

### 사용자 정의 가능한 그림자

Compose Multiplatform 1.9.0에서는 Jetpack Compose의 새로운 그림자 프리미티브와 API를 도입하여 사용자 정의 가능한 그림자를 제공합니다. 이전에 지원되던 `shadow` 한정자(modifier) 외에도, 이제 새로운 API를 사용하여 더 고급스럽고 유연한 그림자 효과를 만들 수 있습니다.

두 가지 새로운 프리미티브를 사용하여 다른 유형의 그림자를 만들 수 있습니다:
`DropShadowPainter()` 및 `InnerShadowPainter()`.

이 새로운 그림자를 UI 컴포넌트에 적용하려면, `dropShadow` 또는 `innerShadow` 한정자로 그림자 효과를 구성합니다:

<list columns="2">
   <li><code-block lang="kotlin" code="        Box(&#10;            Modifier.size(120.dp)&#10;                .dropShadow(&#10;                    RectangleShape,&#10;                    DropShadow(12.dp)&#10;                )&#10;                .background(Color.White)&#10;        )&#10;        Box(&#10;            Modifier.size(120.dp)&#10;                .innerShadow(&#10;                    RectangleShape,&#10;                    InnerShadow(12.dp)&#10;                )&#10;        )"/></li>
   <li><img src="compose-advanced-shadows.png" type="inline" alt="Customizable shadows" width="200"/></li>
</list>

어떤 모양과 색상의 그림자도 그릴 수 있으며, 그림자 지오메트리를 마스크로 사용하여 내부 그라디언트 채워진 그림자를 생성할 수도 있습니다:

<img src="compose-expressive-shadows.png" alt="Expressive shadows" width="244"/>

자세한 내용은 [그림자 API 참조](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/shadow/package-summary.html)를 참조하십시오.

### 새로운 컨텍스트 메뉴 API

`SelectionContainer` 및 `BasicTextField`의 사용자 정의 컨텍스트 메뉴를 위한 Jetpack Compose의 새로운 API를 채택했습니다. iOS 및 웹에서는 구현이 완료되었으며, 데스크톱에서는 초기 지원이 제공됩니다.

<list columns="2">
   <li><img src="compose_basic_text_field.png" type="inline" alt="Context menu for BasicTextField" width="420"/></li>
   <li><img src="compose_selection_container.png" type="inline" alt="Context menu for SelectionContainer" width="440"/></li>
</list>

이 새로운 API를 활성화하려면 애플리케이션 진입점에서 다음 설정을 사용하십시오:

```kotlin
ComposeFoundationFlags.isNewContextMenuEnabled = true
```

자세한 내용은 [컨텍스트 메뉴 API 참조](https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/contextmenu/data/package-summary)를 참조하십시오.

### Material 3 Expressive 테마
<secondary-label ref="Experimental"/>

Compose Multiplatform은 이제 Material 3 라이브러리의 실험적 [`MaterialExpressiveTheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary?hl=en#MaterialExpressiveTheme(androidx.compose.material3.ColorScheme,androidx.compose.material3.MotionScheme,androidx.compose.material3.Shapes,androidx.compose.material3.Typography,kotlin.Function0))를 지원합니다. 표현형 테마를 사용하면 Material Design 앱을 사용자 정의하여 더욱 개인화된 경험을 제공할 수 있습니다.

>Jetpack Material3 [1.4.0-beta01 릴리스](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-beta01)에 맞춰, `ExperimentalMaterial3ExpressiveApi` 및 `ExperimentalMaterial3ComponentOverrideApi` 태그가 지정된 모든 공개 API가 제거되었습니다. 이러한 실험적 기능을 계속 사용하려면, Material3 알파 버전을 명시적으로 포함해야 합니다.
{style="note"}

Expressive 테마를 사용하려면:

1.  Material 3의 실험 버전을 포함합니다:

    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
    ```

2.  `@OptIn(ExperimentalMaterial3ExpressiveApi::class)` 옵트인(opt-in)과 함께 `MaterialExpressiveTheme()` 함수를 사용하여 `colorScheme`, `motionScheme`, `shapes`, `typography` 파라미터를 설정하여 UI 요소의 전반적인 테마를 구성합니다.

그런 다음 [`Button()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-button.html) 및 [`Checkbox()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-checkbox.html)와 같은 Material 컴포넌트가 제공한 값을 자동으로 사용합니다.

<img src="compose_expressive_theme.animated.gif" alt="Material 3 Expressive" width="250" preview-src="compose_expressive_theme.png"/>

### `androidx.compose.runtime:runtime`의 멀티플랫폼 타겟

Compose Multiplatform과 Jetpack Compose의 정렬을 개선하기 위해, 모든 타겟에 대한 지원을 `androidx.compose.runtime:runtime` 아티팩트에 직접 추가했습니다.

`org.jetbrains.compose.runtime:runtime` 아티팩트는 완벽하게 호환되며 이제 별칭으로 사용됩니다.

### `suspend` 람다를 사용하는 `runComposeUiTest()`

`runComposeUiTest()` 함수는 이제 `suspend` 람다를 허용하여 `awaitIdle()`과 같은 `suspend` 함수를 사용할 수 있도록 합니다.

새로운 API는 웹 환경을 위한 적절한 비동기 처리를 포함하여 모든 지원 플랫폼에서 올바른 테스트 실행을 보장합니다:

*   JVM 및 네이티브 타겟의 경우, `runComposeUiTest()`는 `runBlocking()`과 유사하게 작동하지만 지연을 건너뜁니다.
*   웹 타겟(Wasm 및 JS)의 경우, `Promise`를 반환하고 지연을 건너뛰고 테스트 본문을 실행합니다.

## iOS

### 프레임 속도 설정

iOS용 Compose Multiplatform은 이제 컴포저블 렌더링을 위한 선호 프레임 속도 설정을 지원합니다. 애니메이션이 끊긴다면 프레임 속도를 높이고 싶을 수 있습니다. 반면에 애니메이션이 느리거나 정적이라면 전력 소비를 줄이기 위해 낮은 프레임 속도로 실행하는 것을 선호할 수 있습니다.

선호 프레임 속도 카테고리는 다음과 같이 설정할 수 있습니다:

```kotlin
Modifier.preferredFrameRate(FrameRateCategory.High)
```

또는 컴포저블에 대한 특정 프레임 속도가 필요한 경우, 음이 아닌 숫자를 사용하여 초당 프레임(fps) 단위로 선호 프레임 속도를 정의할 수 있습니다:

```kotlin
Modifier.preferredFrameRate(30f)
```

동일한 `@Composable` 트리 내에서 `preferredFrameRate`를 여러 번 적용하는 경우, 가장 높은 지정된 값이 적용됩니다. 하지만 장치 하드웨어는 지원되는 프레임 속도를 일반적으로 최대 120Hz로 제한할 수 있습니다.

### IME 옵션

Compose Multiplatform 1.9.0은 텍스트 입력 컴포넌트를 위한 iOS 특정 IME 사용자 정의 지원을 도입했습니다. 이제 `PlatformImeOptions`를 사용하여 키보드 유형, 자동 고침, 리턴 키 동작과 같은 기본 UIKit 텍스트 입력 특성을 텍스트 필드 컴포넌트에서 직접 구성할 수 있습니다:

```kotlin
BasicTextField(
    value = "",
    onValueChange = {},
    keyboardOptions = KeyboardOptions(
        platformImeOptions = PlatformImeOptions {
            keyboardType(UIKeyboardTypeEmailAddress)
        }
    )
)
```

## 웹

### 베타 버전으로 출시된 웹용 Compose Multiplatform

웹용 Compose Multiplatform은 이제 베타 버전으로, 지금 사용해보기 아주 좋은 시기입니다.
<!-- Check out [our blog post]() to learn more about the progress made to reach this milestone.
-->

안정 버전 릴리스를 위해 노력하는 동안, 저희의 로드맵에는 다음이 포함됩니다:

*   모바일 브라우저에서 드래그 앤 드롭 기능 지원 구현.
*   접근성 지원 개선.
*   `TextField` 컴포넌트 관련 문제 해결.

### 접근성 지원

Compose Multiplatform은 이제 웹 타겟을 위한 초기 접근성 지원을 제공합니다. 이 버전은 스크린 리더가 설명 레이블에 접근할 수 있도록 하며, 사용자가 접근 가능한 내비게이션 모드에서 버튼을 탐색하고 클릭할 수 있도록 합니다.

이번 버전에서는 다음 기능이 아직 지원되지 않습니다:

*   스크롤 및 슬라이더가 있는 상호 운용성 및 컨테이너 뷰를 위한 접근성.
*   순회 인덱스.

컴포넌트의 [시맨틱 속성](compose-accessibility.md#semantic-properties)을 정의하여 컴포넌트의 텍스트 설명, 기능 유형, 현재 상태 또는 고유 식별자와 같은 다양한 세부 정보를 접근성 서비스에 제공할 수 있습니다.

예를 들어, 컴포저블에 `Modifier.semantics { heading() }`을 설정하면, 이 요소가 문서의 챕터나 하위 섹션 제목처럼 제목 역할을 한다고 접근성 서비스에 알립니다. 그러면 스크린 리더는 이 정보를 콘텐츠 내비게이션에 사용하여 사용자가 제목 사이를 직접 이동할 수 있도록 합니다.

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

임베딩된 HTML 요소는 Compose 코드에서 정의된 크기에 따라 캔버스 영역을 오버레이합니다. 이는 해당 영역 내에서 입력 이벤트를 가로채어, Compose Multiplatform에서 해당 이벤트를 수신하지 못하게 합니다.

다음은 `WebElementView()`가 HTML 요소를 생성하고 임베딩하여 Compose 애플리케이션 내에 대화형 지도 뷰를 표시하는 예시입니다:

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

이 함수는 `ComposeViewport` 진입점에서만 사용할 수 있으며, `CanvasBasedWindow`는 더 이상 사용되지 않습니다.

### 내비게이션 그래프 바인딩을 위한 간소화된 API

Compose Multiplatform은 브라우저의 내비게이션 상태를 `NavController`에 바인딩하기 위한 새로운 API를 도입했습니다:

```kotlin
suspend fun NavController.bindToBrowserNavigation()
```

새로운 함수는 `window` API와 직접 상호 작용할 필요성을 없애주어 Kotlin/Wasm 및 Kotlin/JS 소스 세트 모두를 간소화합니다.

이전에 사용되던 `Window.bindToNavigation()` 함수는 새로운 `NavController.bindToBrowserNavigation()` 함수를 위해 더 이상 사용되지 않습니다.

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

## 데스크톱

### 디스플레이 전 창 구성

Compose Multiplatform은 이제 새로운 `SwingFrame()` 및 `SwingDialog()` 컴포저블을 포함합니다. 이들은 기존의 `Window()` 및 `DialogWindow()` 함수와 유사하지만 `init` 블록을 포함합니다.

이전에는 디스플레이 전에 구성해야 하는 특정 창 속성을 설정할 수 없었습니다. 새로운 `init` 블록은 창이나 대화 상자가 화면에 나타나기 전에 실행되므로, `java.awt.Window.setType`과 같은 속성을 구성하거나 일찍 준비되어야 하는 이벤트 리스너를 추가할 수 있습니다.

창이나 대화 상자가 일단 표시되면 변경할 수 없는 속성에만 `init` 블록을 사용하는 것을 권장합니다. 다른 모든 구성의 경우, 코드가 호환성을 유지하고 향후 업데이트에서 올바르게 작동하도록 `LaunchedEffect(window)` 패턴을 계속 사용하십시오.

## Gradle 플러그인

### 분리된 Material3 버전 관리

Material3 라이브러리 및 Compose Multiplatform Gradle 플러그인의 버전과 안정성 수준이 더 이상 일치할 필요가 없습니다. `compose.material3` DSL 별칭은 이제 Jetpack Compose의 이전 안정 릴리스에서 제공되는 Material3 1.8.2를 참조합니다.

Expressive 디자인 지원이 포함된 최신 Material3 버전을 사용하려면 `build.gradle.kts`의 Material 3 의존성을 다음으로 대체하십시오:

```kotlin
implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
```

### 통합 웹 배포

새로운 `composeCompatibilityBrowserDistribution` Gradle 태스크는 Kotlin/JS 및 Kotlin/Wasm 배포를 단일 패키지로 결합합니다. 이는 최신 Wasm 기능이 브라우저에서 지원되지 않을 때 Wasm 애플리케이션이 JS 타겟으로 폴백(fallback)할 수 있도록 합니다.