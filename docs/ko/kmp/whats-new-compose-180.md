[//]: # (title: Compose Multiplatform 1.8.2의 새로운 기능)
이번 기능 릴리스의 주요 하이라이트는 다음과 같습니다:

* [가변 폰트(Variable fonts)](#variable-fonts)
* [iOS에서의 드래그 앤 드롭(Drag-and-drop)](#drag-and-drop)
* [iOS에서의 딥 링크(Deep linking)](#deep-linking)
* [iOS의 향상된 접근성(Accessibility)](#accessibility-support-improvements)
* [웹 타겟을 위한 리소스 프리로딩(Preloading)](#preloading-of-resources)
* [브라우저 탐색 컨트롤과의 통합](#browser-controls-supported-in-the-navigation-library)

이번 릴리스의 전체 변경 사항 목록은 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0)에서 확인할 수 있습니다.

## 의존성(Dependencies)

* Gradle 플러그인 `org.jetbrains.compose`, 버전 1.8.2. 다음 Jetpack Compose 라이브러리를 기반으로 합니다:
    * [Runtime 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    * [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    * [Foundation 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    * [Material 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    * [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
* Lifecycle 라이브러리 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`. [Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0) 기반
* Navigation 라이브러리 `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`. [Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0) 기반
* Material3 Adaptive 라이브러리 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`. [Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0) 기반
* Savedstate 라이브러리 `org.jetbrains.androidx.savedstate:savedstate:1.3.1`. [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0) 기반
* WindowManager Core 라이브러리 `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`. [Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04) 기반

## 중요한 변경 사항 (Breaking changes)

### Compose Multiplatform의 K2 컴파일러 완전 마이그레이션

이번 릴리스를 통해 Compose Multiplatform 코드베이스가 K2 컴파일러로 완전히 마이그레이션되었습니다.
1.8.0부터 Compose Multiplatform에 의존하는 프로젝트에서 생성된 Native 및 Web klib은 Kotlin 2.1.0 이상을 사용할 때만 사용할 수 있습니다.

Compose 컴파일러 Gradle 플러그인의 내부 변경 사항 외에, 여러분의 프로젝트에 미치는 영향은 다음과 같습니다:

* Compose Multiplatform에 의존하는 라이브러리를 사용하는 앱의 경우:
  프로젝트를 Kotlin 2.1.20으로 업데이트하고, 의존성을 Compose Multiplatform 1.8.0 및 Kotlin 2.1.x에서 컴파일된 버전으로 업데이트하는 것을 권장합니다.
* Compose Multiplatform에 의존하는 라이브러리의 경우:
    프로젝트를 Kotlin 2.1.x 및 Compose 1.8.0으로 업데이트한 다음, 라이브러리를 다시 컴파일하여 새 버전을 배포해야 합니다.

Compose Multiplatform 1.8.0으로 업그레이드할 때 호환성 문제가 발생하면 [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP)에 이슈를 제보해 주세요.

### `material-icons-core`에 대한 암시적 의존성 제거

Compose Multiplatform 1.8.2에는 [Material에서 이루어진 변경 사항](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)이 통합되었습니다.
더 이상 `material-icons-core`에 대한 전이적 의존성(transitive dependency)이 존재하지 않습니다.
이는 [K1으로 빌드된 의존성에서 벗어나는 작업](#full-migration-of-compose-multiplatform-to-the-k2-compiler)의 일환입니다.

프로젝트에서 `material-icons-core` 라이브러리를 계속 사용해야 하는 경우, `build.gradle.kts`에 의존성을 명시적으로 추가하세요. 예:

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

또한 Material Symbols 라이브러리의 [벡터 Android XML 아이콘을 사용](compose-multiplatform-resources-usage.md#icons)할 수도 있습니다.

### Navigation의 Bundle에서 SavedState로의 마이그레이션

Compose Multiplatform 1.8.2의 Navigation은 Android Navigation 컴포넌트와 함께 UI 상태를 저장하기 위해 `SavedState` 클래스를 사용하는 방식으로 전환하고 있습니다.
이로 인해 내비게이션 그래프에서 목적지(destination)를 선언할 때 상태 데이터에 액세스하는 방식이 변경됩니다.
[Navigation 라이브러리](compose-navigation-routing.md)를 2.9.* 버전으로 업그레이드할 때는 해당 코드가 `SavedState`의 접근자(accessor)를 사용하도록 업데이트해야 합니다.

> 더 견고한 아키텍처를 위해, 문자열 경로(string routes)를 피하고 [타입 안전한 내비게이션 방식](https://developer.android.com/guide/navigation/design/type-safety)을 사용하세요.
>
{style="note"}

이전 방식:

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.getString("userid")
    val page = navBackStackEntry.arguments?.getString("page")
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

Compose Multiplatform 1.8.2부터:

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.read { getStringOrNull("userid") }
    val page = navBackStackEntry.arguments?.read { getStringOrNull("page") }
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

### iOS의 `ComposeUIViewControllerDelegate` 지원 중단 (Deprecated)

`ComposeUIViewControllerDelegate` API가 부모 뷰 컨트롤러(parent view controller)를 사용하는 방식으로 대체되면서 지원이 중단되었습니다.
Compose Multiplatform 1.8.2에서 이 지원 중단된 API를 사용하면, 부모 뷰 컨트롤러를 통해 `UIViewController` 클래스 메서드를 재정의해야 한다는 지원 중단 오류가 발생합니다.

자식-부모 뷰 컨트롤러 관계에 대한 자세한 내용은 Apple의 개발자 [문서](https://developer.apple.com/documentation/uikit/uiviewcontroller)를 참조하세요.

### iOS의 불필요한 `platformLayers` 옵션 제거

`platformLayers` 실험적 옵션은 [1.6.0에서 도입](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)되었으며, 대체 레이어링 모드를 활성화하여 팝업과 대화 상자를 부모 컨테이너의 경계 밖에서 그릴 수 있도록 했습니다.

이 모드는 이제 iOS에서 기본 동작이 되었으며, 이를 활성화하는 옵션은 불필요해졌으므로 삭제되었습니다.

### 테스트의 중요한 변경 사항

#### 테스트에서의 코루틴 지연 처리 방식 변경

이전에는 Compose Multiplatform 테스트에서 `delay()` 호출이 포함된 사이드 이펙트를 유휴 상태(idle)로 간주하지 않았습니다.
이 때문에 예를 들어 다음과 같은 테스트는 무한히 대기 상태에 빠졌습니다:

```kotlin
@Test
fun loopInLaunchedEffectTest() = runComposeUiTest {
    setContent {
        LaunchedEffect(Unit) {
            while (true) {
                delay(1000)
                println("Tick")
            }
        }
    }
}
```

컴포지션 스코프에서 실행된 코루틴이 `delay()` 함수를 호출할 때, `waitForIdle()`, `awaitIdle()`, `runOnIdle()` 함수는 이제 Compose가 유휴 상태인 것으로 간주합니다.
이 변경으로 위와 같은 테스트가 멈추는 문제는 해결되었지만, `delay()`가 포함된 코루틴이 실행되기를 기다리기 위해 `waitForIdle()`, `awaitIdle()`, `runOnIdle()`에 의존하던 테스트는 실패할 수 있습니다.

이러한 경우 동일한 결과를 얻으려면 인위적으로 시간을 진행시켜야 합니다:

```kotlin
var updateText by mutableStateOf(false)
var text by mutableStateOf("0")
setContent {
    LaunchedEffect(updateText) {
        if (updateText) {
            delay(1000)
            text = "1"
        }
    }
}
updateText = true
waitForIdle()
// waitForIdle()이 더 이상 지연된 LaunchedEffect()가 완료될 때까지 기다리지 않으므로,
// 다음 단언(assertion)을 올바르게 수행하려면 테스트에서 시간을 진행시켜야 합니다:
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

이미 `mainClock.advanceTimeBy()` 호출을 사용하여 테스트 클록을 진행시키던 테스트는 재구성(recomposition), 레이아웃, 그리기 및 효과와 관련하여 다르게 동작할 수 있습니다.

#### Android와 일치하도록 `runOnIdle()` 구현 조정

Compose Multiplatform의 `runOnIdle()` 테스트 함수 구현을 Android의 동작과 일치시키기 위해 다음과 같은 변경 사항이 도입되었습니다:

* `runOnIdle()`은 이제 UI 스레드에서 `action`을 실행합니다.
* `runOnIdle()`은 `action`을 실행한 후 더 이상 `waitForIdle()`을 호출하지 않습니다.

`runOnIdle()` 액션 이후에 수행되던 추가적인 `waitForIdle()` 호출에 의존하는 테스트가 있다면, Compose Multiplatform 1.8.2로 업데이트할 때 필요에 따라 해당 호출을 테스트에 직접 추가해야 합니다.

#### 테스트의 시간 진행과 렌더링 분리

Compose Multiplatform 1.8.2에서 `mainClock.advanceTimeBy()` 함수는 시간이 다음 프레임을 렌더링하는 시점(가상 테스트 프레임은 16ms마다 렌더링됨)을 지나지 않았다면 더 이상 재구성, 레이아웃 또는 그리기를 유발하지 않습니다.

이로 인해 모든 `mainClock.advanceTimeBy()` 호출이 렌더링을 트리거한다고 가정한 테스트가 실패할 수 있습니다. 자세한 내용은 [PR 설명](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)을 참조하세요.

## 모든 플랫폼 공통

### 가변 폰트 (Variable fonts)

Compose Multiplatform 1.8.2는 모든 플랫폼에서 가변 폰트를 지원합니다.
가변 폰트를 사용하면 두께(weight), 너비(width), 기울기(slant), 이탤릭(italic), 커스텀 축, 타이포그래픽 컬러가 적용된 시각적 두께, 특정 텍스트 크기에 대한 적응 등 모든 스타일 기본 설정을 포함하는 단일 폰트 파일을 유지할 수 있습니다.

자세한 내용은 [Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)를 참조하세요.

### Skia 132 버전 업데이트

Skiko를 통해 Compose Multiplatform에서 사용하는 Skia 버전이 Milestone 132로 업데이트되었습니다.

이전에 사용된 Skia 버전은 Milestone 126이었습니다. 이 버전들 사이의 변경 사항은 [릴리스 노트](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132)에서 확인할 수 있습니다.

### 새로운 Clipboard 인터페이스

Compose Multiplatform은 Jetpack Compose의 새로운 `Clipboard` 인터페이스를 채택했습니다.

이전에 사용되던 `ClipboardManager` 인터페이스는 [웹의 Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)의 비동기적 특성 때문에 웹 타겟에서 접근할 수 없었으며, 이제 `Clipboard`를 위해 지원이 중단되었습니다. 새로운 인터페이스는 `suspend` 함수를 지원하며 웹을 포함한 모든 타겟과 호환됩니다.

공통 코드에서의 클립보드 상호작용은 현재 API 설계상 제한적입니다. 자세한 내용은 [CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)를 참조하세요.

### 행간 정렬 (Line-height alignment)

이전에는 Android의 Compose Multiplatform에서만 지원되던 행간 정렬용 공통 API가 이제 모든 플랫폼에서 지원됩니다.
`LineHeightStyle.Alignment`를 사용하여 행 높이로 제공된 공간 내에서 텍스트 라인이 정렬되는 방식을 구성할 수 있습니다.
텍스트 라인은 예약된 공간의 하단, 중앙 또는 상단에 정렬하거나 어센트(ascent) 및 디센트(descent) 값을 기준으로 비례하여 조정할 수 있습니다.

<img src="compose-180-LineHeightStyle.png" alt="Line-height alignment" width="508"/>

Material3에서 행간 정렬의 기본값은 `Center`입니다. 즉, 별도로 지정하지 않는 한 모든 플랫폼의 Material3 컴포넌트에서 `lineHeight`가 적용된 텍스트에는 중앙 정렬이 적용됩니다.

## iOS

### 딥 링크 (Deep linking)

Compose Multiplatform 1.8.2와 [org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md) %org.jetbrains.androidx.navigation%를 사용하면, 일반적인 Compose 방식과 동일하게 iOS에서 딥 링크를 구현할 수 있습니다. 즉, 목적지에 딥 링크를 할당하고 `NavController`를 사용하여 해당 목적지로 이동할 수 있습니다.

공통 코드에 딥 링크를 도입하는 방법은 [Deep links](compose-navigation-deep-links.md) 가이드를 참조하세요.

### XCFramework의 Compose 리소스

Compose Multiplatform은 이제 생성된 XCFramework 내에 직접 리소스를 포함합니다. 
따라서 리소스가 포함된 Compose 라이브러리를 표준 XCFramework로 빌드하고 사용할 수 있습니다.

이 기능을 사용하려면 Kotlin Gradle 플러그인 버전 2.2 이상이 필요합니다.

### 접근성 지원 개선

#### 우측에서 좌측으로 읽는 언어(RTL) 지원

Compose Multiplatform 1.8.2에서는 제스처에 대한 적절한 텍스트 방향 처리를 포함하여 우측에서 좌측으로 읽는 언어(RTL)에 대한 접근성 지원을 도입했습니다.

RTL 지원에 대해 자세히 알아보려면 [Right-to-Left languages](compose-rtl.md)를 참조하세요.

#### 스크롤 가능한 리스트의 접근성

이번 버전에서는 스크롤 경계 및 요소 위치 계산의 성능과 정확도가 향상되었습니다.
노치(notch) 및 화면 가장자리와 같은 세이프 에어리어(safe area)를 고려하여, 간격 및 여백 근처에서 스크롤할 때 정확한 접근성 속성을 보장합니다.

또한 스크롤 상태 알림 지원이 도입되었습니다.
VoiceOver가 활성화된 상태에서 세 손가락 스크롤 제스처를 수행하면 다음과 같은 리스트 상태 업데이트를 들을 수 있습니다:

* 리스트 맨 위일 때 "첫 페이지(First page)"
* 앞으로 스크롤할 때 "다음 페이지(Next page)"
* 뒤로 스크롤할 때 "이전 페이지(Previous page)"
* 끝에 도달했을 때 "마지막 페이지(Last page)"

이러한 알림의 현지화된 버전도 제공되므로 VoiceOver가 원하는 언어로 읽어줄 수 있습니다.

#### 컨테이너 뷰의 접근성

Compose Multiplatform 1.8.2부터 복잡한 뷰를 스크롤하거나 스와이프할 때 올바른 읽기 순서를 보장하기 위해 컨테이너의 탐색 시맨틱 속성(traversal semantic properties)을 정의할 수 있습니다.

스크린 리더를 위한 요소 정렬뿐만 아니라, 탐색 속성 지원을 통해 접근성 제스처인 위로 스와이프 또는 아래로 스와이프를 사용하여 서로 다른 탐색 그룹 간을 이동할 수 있습니다.
컨테이너에 대한 접근성 탐색 모드로 전환하려면 VoiceOver가 활성화된 상태에서 화면에 두 손가락을 대고 돌리세요.

탐색 시맨틱 속성에 대한 자세한 내용은 [접근성(Accessibility)](compose-accessibility.md#traversal-order) 섹션에서 확인할 수 있습니다.

#### 접근 가능한 텍스트 입력

Compose Multiplatform 1.8.2에서는 텍스트 필드의 접근성 특성(accessibility traits) 지원을 도입했습니다.
텍스트 입력 필드에 포커스가 오면 이제 편집 가능(editable)으로 표시되어 적절한 접근성 상태 표현을 보장합니다.

이제 UI 테스트에서도 접근 가능한 텍스트 입력을 사용할 수 있습니다.

#### 트랙패드 및 키보드 제어 지원

iOS용 Compose Multiplatform은 이제 기기를 제어하기 위한 두 가지 추가 입력 방법을 지원합니다. 터치스크린에 의존하는 대신 AssistiveTouch를 활성화하여 마우스나 트랙패드를 사용하거나, '풀 키보드 액세스(Full Keyboard Access)'를 활성화하여 키보드를 사용할 수 있습니다:

* AssistiveTouch (**설정** | **손쉬운 사용** | **터치** | **AssistiveTouch**)를 사용하면 연결된 마우스나 트랙패드의 포인터로 iPhone 또는 iPad를 제어할 수 있습니다. 포인터를 사용하여 화면의 아이콘을 클릭하거나, AssistiveTouch 메뉴를 탐색하거나, 화상 키보드를 사용하여 입력할 수 있습니다.
* 풀 키보드 액세스 (**설정** | **손쉬운 사용** | **키보드** | **풀 키보드 액세스**)를 사용하면 연결된 키보드로 기기를 제어할 수 있습니다. **Tab**과 같은 키로 탐색하고 **Space**를 사용하여 항목을 활성화할 수 있습니다.

#### 요청 시 접근성 트리 로드 (On demand)

Compose 시맨틱 트리를 iOS 접근성 트리와 동기화하는 특정 모드를 설정하는 대신, 이제 Compose Multiplatform이 이 프로세스를 지연(lazy) 처리하도록 맡길 수 있습니다.
트리는 iOS 접근성 엔진의 첫 번째 요청 후에 완전히 로드되며, 스크린 리더가 상호작용을 중단하면 폐기됩니다.

이를 통해 iOS Voice Control, VoiceOver 및 접근성 트리에 의존하는 기타 접근성 도구를 완벽하게 지원할 수 있습니다.

[접근성 트리 동기화를 구성하는 데 사용되었던](compose-ios-accessibility.md#choose-the-tree-synchronization-option) `AccessibilitySyncOptions` 클래스는 더 이상 필요하지 않으므로 제거되었습니다.

#### 접근성 속성 계산 정확도 향상

Compose Multiplatform 컴포넌트의 접근성 속성을 UIKit 컴포넌트의 예상 동작과 일치하도록 업데이트했습니다.
UI 요소는 이제 광범위한 접근성 데이터를 제공하며, 알파 값이 0인 투명한 컴포넌트는 더 이상 접근성 시맨틱을 제공하지 않습니다.

시맨틱을 일치시킴으로써 `DropDown` 요소의 히트박스 누락, 가시 텍스트와 접근성 레이블 간의 불일치, 잘못된 라디오 버튼 상태와 같은 접근성 속성 계산 오류와 관련된 여러 이슈를 해결할 수 있었습니다.

### iOS 로깅용 안정적인 API

iOS에서 운영체제 로깅을 활성화하는 API가 이제 안정화되었습니다. `enableTraceOSLog()` 함수는 더 이상 실험적 기능 사용 설정(experimental opt-in)이 필요하지 않으며 이제 Android 스타일의 로깅과 일치합니다. 이 로깅은 디버깅 및 성능 분석을 위해 Xcode Instruments를 사용하여 분석할 수 있는 트레이스 정보를 제공합니다.

### 드래그 앤 드롭(Drag-and-drop)
<primary-label ref="Experimental"/>

iOS용 Compose Multiplatform에 드래그 앤 드롭 기능 지원이 도입되어, Compose 애플리케이션 내부 또는 외부로 콘텐츠를 드래그할 수 있습니다(데모 영상은 풀 리퀘스트 [1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690)을 참조하세요).
드래그 가능한 콘텐츠와 드롭 타겟을 정의하려면 `dragAndDropSource` 및 `dragAndDropTarget` 수정자(modifier)를 사용하세요.

iOS에서 드래그 앤 드롭 세션 데이터는 [`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem)으로 표현됩니다.
이 객체에는 프로세스 간 데이터 전송에 대한 정보와 앱 내 사용을 위한 선택적 로컬 객체가 포함되어 있습니다.
예를 들어, `DragAndDropTransferData(listOf(UIDragItem.fromString(text)))`를 사용하여 텍스트를 드래그할 수 있으며, 여기서 `UIDragItem.fromString(text)`는 텍스트를 드래그 앤 드롭 작업에 적합한 형식으로 인코딩합니다.
현재는 `String` 및 `NSObject` 타입만 지원됩니다.

일반적인 사용 사례는 Jetpack Compose 문서의 [전용 문서](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)를 참조하세요.

### 상호 운용 뷰(interop views)를 위한 터치 처리 개선

이번 릴리스의 개선 사항:

* 모달 `UIViewController`로 표시되는 비스크롤 콘텐츠가 있는 Compose 뷰를 아래로 스와이프 제스처로 닫을 수 있습니다.
* 중첩된 스크롤 가능 뷰가 일반적인 [상호 운용 터치 프레임워크(interop touch framework)](compose-ios-touch.md) 내에서 올바르게 작동합니다. 스크롤 가능한 Compose 뷰 내에서 네이티브 콘텐츠를 스크롤하거나, 스크롤 가능한 네이티브 뷰 내에서 Compose 콘텐츠를 스크롤할 때 UI가 iOS 로직을 긴밀하게 따라 모호한 터치 시퀀스를 해결합니다.

### 병렬 렌더링 옵트인 (Concurrent rendering)
<primary-label ref="Experimental"/>

iOS용 Compose Multiplatform은 이제 렌더링 작업을 전용 렌더 스레드로 오프로드하는 기능을 지원합니다.
병렬 렌더링(Concurrent rendering)은 UIKit 상호 운용성이 없는 시나리오에서 성능을 향상시킬 수 있습니다.

`ComposeUIViewControllerConfiguration` 클래스의 `useSeparateRenderThreadWhenPossible` 플래그를 활성화하거나, `ComposeUIViewController` 구성 블록 내에서 `parallelRendering` 속성을 직접 활성화하여 별도의 렌더 스레드에서 렌더링 명령을 인코딩하도록 옵트인할 수 있습니다:

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main(vararg args: String) {
    UIKitMain {
        ComposeUIViewController(configure = { parallelRendering = true }) {
            // ...
        }
    }
}
```

## 웹 (Web)

### Navigation 라이브러리의 브라우저 컨트롤 지원

Compose Multiplatform으로 빌드된 Kotlin/Wasm 및 Kotlin/JS 애플리케이션에서 내비게이션이 이제 기본적인 브라우저 컨트롤과 올바르게 작동합니다.
이를 활성화하려면 `window.bindToNavigation()` 메서드를 사용하여 브라우저 창을 메인 내비게이션 그래프에 연결하세요.
연결이 완료되면 웹 앱은 브라우저의 **뒤로 가기** 및 **앞으로 가기** 버튼을 사용하여 히스토리를 이동하는 동작에 올바르게 반응합니다(데모 영상은 풀 리퀘스트 [1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621)을 참조하세요).

또한 웹 앱은 브라우저 주소창을 조작하여 현재 목적지 경로를 반영하고, 사용자가 올바른 경로가 포함된 URL을 붙여넣으면 해당 목적지로 직접 이동합니다(데모 영상은 풀 리퀘스트 [1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640)을 참조하세요).
`window.bindToNavigation()` 메서드에는 선택 사항인 `getBackStackEntryPath` 파라미터가 있어, 경로 문자열을 URL 프래그먼트로 변환하는 방식을 커스텀할 수 있습니다.

### 브라우저 커서 설정
<primary-label ref="Experimental"/>

브라우저 페이지에서 마우스 포인터로 사용할 수 있는 아이콘을 관리하기 위한 실험적인 `PointerIcon.Companion.fromKeyword()` 함수를 도입했습니다. 키워드를 파라미터로 전달하여 문맥에 따라 표시할 커서 유형을 지정할 수 있습니다. 예를 들어 텍스트 선택, 컨텍스트 메뉴 열기 또는 로딩 프로세스 표시에 따라 다른 포인터 아이콘을 할당할 수 있습니다.

사용 가능한 전체 [키워드](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) 목록을 확인해 보세요.

### 리소스 프리로딩 (Preloading)
<primary-label ref="Experimental"/>

Compose Multiplatform 1.8.2는 웹 타겟을 위해 폰트와 이미지를 미리 로드하는 새로운 실험적 API를 도입했습니다.
프리로딩은 스타일이 지정되지 않은 텍스트가 깜빡이는 현상(FOUT)이나 이미지 및 아이콘의 깜빡임과 같은 시각적 문제를 방지하는 데 도움이 됩니다.

리소스 로딩 및 캐싱을 위해 다음과 같은 함수를 사용할 수 있습니다:

* `preloadFont()`: 폰트 프리로드
* `preloadImageBitmap()`: 비트맵 이미지 프리로드
* `preloadImageVector()`: 벡터 이미지 프리로드

자세한 내용은 [문서](compose-web-resources.md#preload-resources-using-the-compose-multiplatform-preload-api)를 참조하세요.

## 데스크톱 (Desktop)

### Windows의 소프트웨어 렌더링 개선

Windows에서 Skia를 위해 권장되는 clang 컴파일러로 전환함에 따라 CPU에 의존하는 렌더링 속도가 향상되었습니다.
이는 주로 순수 소프트웨어 렌더링에 영향을 미치는데, 렌더링은 일반적으로 GPU에 의존하고 일부 계산만 CPU에서 수행되기 때문입니다.
따라서 일부 가상 머신이나 [Skia가 지원하지 않는](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13) 일부 구형 그래픽 카드가 있는 환경에서는 성능 향상이 매우 뚜렷합니다. Compose Multiplatform으로 제작된 Windows 앱은 이러한 환경에서 Compose Multiplatform 1.7.3에 비해 최대 6배까지 빨라졌습니다.

이 개선 사항은 Windows for ARM64 지원과 함께 macOS의 가상 Windows 시스템에서 Compose Multiplatform UI의 성능을 크게 향상시킵니다.

### Windows for ARM64 지원

Compose Multiplatform 1.8.2는 JVM에서 Windows for ARM64 지원을 도입하여, ARM 기반 Windows 기기에서 애플리케이션을 빌드하고 실행하는 전반적인 경험을 개선했습니다.

## Gradle 플러그인

### 생성된 Res 클래스 이름 변경 옵션

앱의 리소스에 액세스할 수 있게 해주는 생성된 리소스 클래스의 이름을 이제 커스텀할 수 있습니다.
커스텀 이름 지정은 특히 멀티 모듈 프로젝트에서 리소스를 구별하는 데 유용하며, 프로젝트의 명명 규칙과 일관성을 유지하는 데 도움이 됩니다.

커스텀 이름을 정의하려면 `build.gradle.kts` 파일의 `compose.resources` 블록에 다음 라인을 추가하세요:

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform/pull/5296)를 참조하세요.

### `androidLibrary` 타겟의 멀티플랫폼 리소스 지원
<primary-label ref="Experimental"/>

Android Gradle 플러그인 버전 8.8.0부터 새로운 `androidLibrary` 타겟에서 생성된 에셋(assets)을 사용할 수 있습니다.
이러한 변화에 발맞춰 Compose Multiplatform에서도 Android 에셋으로 패키징된 멀티플랫폼 리소스를 사용하기 위한 새로운 타겟 구성 지원을 도입했습니다.

`androidLibrary` 타겟을 사용하는 경우 구성에서 리소스를 활성화하세요:

```kotlin
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

그렇지 않으면 다음과 같은 예외가 발생합니다: `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`.