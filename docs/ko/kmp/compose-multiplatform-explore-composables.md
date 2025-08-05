[//]: # (title: 컴포저블 코드 살펴보기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼에서는 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 튜토리얼은 <strong>공유 로직 및 UI를 사용하여 Compose Multiplatform 앱 만들기</strong>의 두 번째 부분입니다. 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="compose-multiplatform-create-first-app.md">Compose Multiplatform 앱 만들기</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>컴포저블 코드 살펴보기</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> 프로젝트 수정하기<br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 나만의 애플리케이션 만들기<br/>
    </p>
</tldr>

Kotlin Multiplatform 마법사가 생성한 샘플 컴포저블을 자세히 살펴보겠습니다. 첫째, 공통 UI를 구현하고 모든 플랫폼에서 사용할 수 있는 컴포저블 `App()` 함수가 있습니다. 둘째, 각 플랫폼에서 이 UI를 실행하는 플랫폼별 코드가 있습니다.

## 컴포저블 함수 구현

`composeApp/src/commonMain/kotlin/App.kt` 파일에서 `App()` 함수를 살펴보세요.

```kotlin
@Composable
@Preview
fun App() {
  MaterialTheme {
    var showContent by remember { mutableStateOf(false) }
    Column(
      modifier = Modifier
        .safeContentPadding()
        .fillMaxSize(),
      horizontalAlignment = Alignment.CenterHorizontally,
    ) {
      Button(onClick = { showContent = !showContent }) {
        Text("Click me!")
      }
      AnimatedVisibility(showContent) {
        val greeting = remember { Greeting().greet() }
        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
          Image(painterResource(Res.drawable.compose_multiplatform), null)
          Text("Compose: $greeting")
        }
      }
    }
  }
}
```

`App()` 함수는 `@Composable`로 주석 처리된 일반적인 코틀린 함수입니다. 이러한 종류의 함수를 _컴포저블 함수(composable functions)_ 또는 단순히 _컴포저블(composables)_이라고 합니다. 이들은 Compose Multiplatform 기반 UI의 구성 요소입니다.

컴포저블 함수는 다음과 같은 일반적인 구조를 가집니다.

*   `MaterialTheme`은 애플리케이션의 모양을 설정합니다. 기본 설정을 사용자 지정할 수 있습니다. 예를 들어, 색상, 모양 및 타이포그래피를 선택할 수 있습니다.
*   `Column` 컴포저블은 애플리케이션의 레이아웃을 제어합니다. 여기서는 `AnimatedVisibility` 컴포저블 위에 `Button`을 표시합니다.
*   `Button`은 텍스트를 렌더링하는 `Text` 컴포저블을 포함합니다.
*   `AnimatedVisibility`는 애니메이션을 사용하여 `Image`를 표시하거나 숨깁니다.
*   `painterResource`는 XML 리소스에 저장된 벡터 아이콘을 로드합니다.

`Column`의 `horizontalAlignment` 파라미터는 콘텐츠를 가운데에 정렬합니다. 하지만 이것이 효과를 보려면 Column이 컨테이너의 전체 너비를 차지해야 합니다. 이는 `modifier` 파라미터를 사용하여 달성됩니다.

Modifier는 Compose Multiplatform의 핵심 구성 요소입니다. 이는 UI에서 컴포저블의 모양이나 동작을 조정하는 데 사용하는 주요 메커니즘입니다. Modifier는 `Modifier` 타입의 메서드를 사용하여 생성됩니다. 이러한 메서드를 연결하면 각 호출이 이전 호출에서 반환된 `Modifier`를 변경할 수 있으므로 순서가 중요합니다. 자세한 내용은 [Jetpack Compose 문서](https://developer.android.com/jetpack/compose/modifiers)를 참조하세요.

### 상태 관리

샘플 컴포저블의 마지막 측면은 상태가 관리되는 방식입니다. `App` 컴포저블의 `showContent` 속성은 `mutableStateOf()` 함수를 사용하여 빌드되며, 이는 관찰 가능한 상태 객체임을 의미합니다.

```kotlin
var showContent by remember { mutableStateOf(false) }
```

상태 객체는 `remember()` 함수 호출로 래핑되어 한 번 빌드된 다음 프레임워크에 의해 유지됩니다. 이를 실행하면 값이 불리언을 포함하는 상태 객체인 속성을 만듭니다. 프레임워크는 이 상태 객체를 캐시하여 컴포저블이 이를 관찰할 수 있도록 합니다.

상태 값이 변경되면 이를 관찰하는 모든 컴포저블이 다시 호출됩니다. 이를 통해 생성하는 위젯이 다시 그려질 수 있습니다. 이를 _리컴포지션(recomposition)_이라고 합니다.

애플리케이션에서 상태가 변경되는 유일한 곳은 버튼의 클릭 이벤트입니다. `onClick` 이벤트 핸들러는 `showContent` 속성의 값을 전환합니다. 결과적으로 부모 `AnimatedVisibility` 컴포저블이 `showContent`를 관찰하기 때문에 이미지가 `Greeting().greet()` 호출과 함께 표시되거나 숨겨집니다.

## 여러 플랫폼에서 UI 실행

`App()` 함수 실행은 각 플랫폼마다 다릅니다. Android에서는 액티비티(activity)에 의해 관리되고, iOS에서는 뷰 컨트롤러(view controller)에 의해, 데스크톱에서는 창(window)에 의해, 웹에서는 컨테이너(container)에 의해 관리됩니다. 각각을 살펴보겠습니다.

### Android에서

Android의 경우, `composeApp/src/androidMain/kotlin`에서 `MainActivity.kt` 파일을 엽니다.

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            App()
        }
    }
}
```

이것은 `App` 컴포저블을 호출하는 [Android 액티비티](https://developer.android.com/guide/components/activities/intro-activities)인 `MainActivity`입니다.

### iOS에서

iOS의 경우, `composeApp/src/iosMain/kotlin`에서 `MainViewController.kt` 파일을 엽니다.

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

이것은 Android의 액티비티와 동일한 역할을 하는 [뷰 컨트롤러](https://developer.apple.com/documentation/uikit/view_controllers)입니다. iOS 및 Android 타입 모두 단순히 `App` 컴포저블을 호출한다는 점에 유의하세요.

### 데스크톱에서

데스크톱의 경우, `composeApp/src/desktopMain/kotlin`의 `main()` 함수를 살펴보세요.

```kotlin
fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "ComposeDemo") {
        App()
    }
}
```

*   여기서 `application()` 함수는 새 데스크톱 애플리케이션을 시작합니다.
*   이 함수는 UI를 초기화하는 람다를 사용합니다. 일반적으로 `Window`를 생성하고 창이 닫힐 때 프로그램이 어떻게 반응해야 하는지를 지시하는 속성 및 지침을 지정합니다. 이 경우 전체 애플리케이션이 종료됩니다.
*   이 창 안에 콘텐츠를 배치할 수 있습니다. Android 및 iOS와 마찬가지로 유일한 콘텐츠는 `App()` 함수입니다.

현재 `App` 함수는 어떤 파라미터도 선언하지 않습니다. 더 큰 애플리케이션에서는 일반적으로 플랫폼별 종속성에 파라미터를 전달합니다. 이러한 종속성은 직접 생성하거나 의존성 주입 라이브러리를 사용하여 생성할 수 있습니다.

### 웹에서

`composeApp/src/wasmJsMain/kotlin/main.kt` 파일에서 `main()` 함수를 살펴보세요.

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(document.body!!) { App() }
}
```

*   `@OptIn(ExperimentalComposeUiApi::class)` 어노테이션은 컴파일러에게 실험적이며 향후 릴리스에서 변경될 수 있는 API를 사용하고 있음을 알립니다.
*   `ComposeViewport()` 함수는 애플리케이션을 위한 Compose 환경을 설정합니다.
*   웹 앱은 `ComposeViewport` 함수의 파라미터로 지정된 컨테이너에 삽입됩니다. 예시에서는 전체 문서의 본문이 컨테이너 역할을 합니다.
*   `App()` 함수는 Jetpack Compose를 사용하여 애플리케이션의 UI 구성 요소를 빌드하는 역할을 합니다.

## 다음 단계

튜토리얼의 다음 부분에서는 프로젝트에 의존성을 추가하고 사용자 인터페이스를 수정합니다.

**[다음 부분으로 진행하기](compose-multiplatform-modify-project.md)**

## 도움 받기

*   **코틀린 슬랙(Kotlin Slack)**. [초대장을 받고](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
*   **코틀린 이슈 트래커(Kotlin issue tracker)**. [새로운 이슈 보고하기](https://youtrack.jetbrains.com/newIssue?project=KT).