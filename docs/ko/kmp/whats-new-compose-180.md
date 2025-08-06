[//]: # (title: Compose Multiplatform 1.8.2의 새로운 기능)
이번 기능 릴리스의 주요 내용은 다음과 같습니다:

*   [가변 폰트](#variable-fonts)
*   [iOS 드래그 앤 드롭](#drag-and-drop)
*   [iOS 딥 링크](#deep-linking)
*   [iOS 접근성 지원 개선](#accessibility-support-improvements)
*   [웹 타겟용 리소스 사전 로드](#preloading-of-resources)
*   [브라우저 내비게이션 컨트롤 통합](#browser-controls-supported-in-the-navigation-library)

이번 릴리스의 전체 변경 사항은 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0)에서 확인할 수 있습니다.

## 종속성

*   Gradle 플러그인 `org.jetbrains.compose`, 버전 1.8.2. 다음 Jetpack Compose 라이브러리를 기반으로 합니다:
    *   [런타임 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    *   [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    *   [파운데이션 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    *   [머티리얼 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    *   [머티리얼3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
*   라이프사이클 라이브러리 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`. [Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0) 기반
*   내비게이션 라이브러리 `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`. [Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0) 기반
*   Material3 어댑티브 라이브러리 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`. [Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0) 기반
*   Savedstate 라이브러리 `org.jetbrains.androidx.savedstate:savedstate:1.3.1`. [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0) 기반
*   WindowManager 코어 라이브러리 `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`. [Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04) 기반

## 호환성이 깨지는 변경 사항

### Compose Multiplatform의 K2 컴파일러로의 전체 마이그레이션

이번 릴리스에서 Compose Multiplatform 코드베이스는 K2 컴파일러로 완전히 마이그레이션되었습니다.
1.8.0부터,
Compose Multiplatform에 의존하는 프로젝트에서 생성된 네이티브 및 웹 klibs는
Kotlin 2.1.0 이상을 사용할 때만 사용할 수 있습니다.

이는 Compose 컴파일러 Gradle 플러그인의 기본 변경 사항 외에 프로젝트에 다음을 의미합니다:

*   Compose Multiplatform에 의존하는 라이브러리를 사용하는 앱의 경우:
    프로젝트를 Kotlin 2.1.20으로 업데이트하고
    종속성을 Compose Multiplatform 1.8.0 및 Kotlin 2.1.x에 대해 컴파일된 버전으로 업데이트하는 것이 좋습니다.
*   Compose Multiplatform에 의존하는 라이브러리의 경우:
    프로젝트를 Kotlin 2.1.x 및 Compose 1.8.0으로 업데이트한 다음,
    라이브러리를 다시 컴파일하고 새 버전을 게시해야 합니다.

Compose Multiplatform 1.8.0으로 업그레이드할 때 호환성 문제가 발생하면,
[YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP)에 이슈를 제출하여 알려주십시오.

### `material-icons-core`에 대한 암시적 종속성 제거

Compose Multiplatform 1.8.2는 [Material에서 변경된 내용](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)을 통합합니다:
이제 `material-icons-core`에 대한 전이적(transitive) 종속성이 없습니다.
이는 [K1으로 빌드된 종속성에서 벗어나려는](#full-migration-of-compose-multiplatform-to-the-k2-compiler) 움직임과 일치합니다.

프로젝트에서 계속 `material-icons-core` 라이브러리를 사용해야 하는 경우,
예를 들어 `build.gradle.kts`에 종속성을 명시적으로 추가하십시오:

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

### Navigation에서 Bundle에서 SavedState로 마이그레이션

Compose Multiplatform 1.8.2의 Navigation은
Android Navigation 컴포넌트와 함께 UI 상태를 저장하기 위해 `SavedState` 클래스를 사용하도록 전환하고 있습니다.
이는 내비게이션 그래프에서 대상을 선언할 때 상태 데이터에 액세스하는 패턴을 변경합니다.
[내비게이션 라이브러리](compose-navigation-routing.md)의 2.9.* 버전으로 업그레이드할 때,
`SavedState`의 접근자(accessor)를 사용하도록 해당 코드를 업데이트해야 합니다.

> 더 견고한 아키텍처를 위해,
> 문자열 경로를 피하고
> [내비게이션에 대한 타입-세이프(type-safe) 접근 방식](https://developer.android.com/guide/navigation/design/type-safety)을 사용하십시오.
>
{style="note"}

이전:

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

### iOS에서 `ComposeUIViewControllerDelegate` 사용 중단

`ComposeUIViewControllerDelegate` API는 부모 뷰 컨트롤러를 선호하여 사용 중단되었습니다.
Compose Multiplatform 1.8.2에서 사용 중단된 API를 사용하면 부모 뷰 컨트롤러를 통해
`UIViewController` 클래스 메서드를 재정의해야 함을 나타내는 사용 중단 오류가 발생합니다.

자식-부모 뷰 컨트롤러 관계에 대한 자세한 내용은 Apple 개발자 [문서](https://developer.apple.com/documentation/uikit/uiviewcontroller)를 참조하십시오.

### iOS에서 더 이상 사용되지 않는 `platformLayers` 옵션 제거

`platformLayers` 실험적 옵션은
대체 레이어링 모드를 활성화하고 부모 컨테이너 경계 외부에서 팝업 및 대화 상자를 그릴 수 있도록
[1.6.0에서 도입](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)되었습니다.

이 모드는 이제 iOS의 기본 동작이 되었으며, 이를 활성화하는 옵션은 더 이상 사용되지 않으므로 제거되었습니다.

### 테스트의 호환성이 깨지는 변경 사항

#### 테스트에서 코루틴 지연의 새로운 처리 방식

이전에는 Compose Multiplatform 테스트에서 `delay()` 호출이 있는 부수 효과를 유휴(idle) 상태로 간주하지 않았습니다.
그 때문에 예를 들어 다음 테스트는 무한히 멈춰 있었습니다:

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

코루틴이 컴포지션 스코프에서 시작된 후 `delay()` 함수를 호출할 때, `waitForIdle()`, `awaitIdle()`,
및 `runOnIdle()` 함수는 이제 Compose가 유휴 상태라고 간주합니다.
이 변경 사항은 위에서 멈춰 있던 테스트를 수정하지만,
`delay()`와 함께 코루틴을 실행하기 위해 `waitForIdle()`, `awaitIdle()`, 및 `runOnIdle()`에
의존하는 테스트는 더 이상 작동하지 않을 수 있습니다.

이 경우 동일한 결과를 얻으려면 시간을 인위적으로 진행하십시오:

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
// 다음 단언이 정확하도록 테스트는 시간을 진행해야 합니다:
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

이미 `mainClock.advanceTimeBy()` 호출을 사용하여 테스트 클럭을 진행하는 테스트는
리컴포지션, 레이아웃, 그리기 및 효과와 관련하여 다르게 동작할 수 있습니다.

#### Android와 일치하도록 `runOnIdle()` 구현

Android 동작과 일치하도록 Compose Multiplatform의 `runOnIdle()` 테스트 함수 구현을 위해,
다음 변경 사항을 도입했습니다:

*   `runOnIdle()`은 이제 UI 스레드에서 `action`을 실행합니다.
*   `runOnIdle()`은 이제 `action` 실행 후 `waitForIdle()`을 더 이상 호출하지 않습니다.

테스트가 `runOnIdle()` 액션 후 추가 `waitForIdle()` 호출에 의존하는 경우,
Compose Multiplatform 1.8.2로 업데이트할 때 필요에 따라 테스트에 해당 호출을 추가하십시오.

#### 테스트에서 시간 진행이 렌더링과 분리됨

Compose Multiplatform 1.8.2에서 `mainClock.advanceTimeBy()` 함수는
다음 프레임을 렌더링하는 시점(가상 테스트 프레임은 16ms마다 렌더링됨)을 지나 시간이 진행되지 않은 경우
더 이상 리컴포지션, 레이아웃 또는 그리기를 유발하지 않습니다.

이는 모든 `mainClock.advanceTimeBy()` 호출에 의해 렌더링이 트리거되는 것에 의존하는 테스트를 중단시킬 수 있습니다.
자세한 내용은 [PR 설명](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)을 참조하십시오.

## 모든 플랫폼

### 가변 폰트

Compose Multiplatform 1.8.2는 모든 플랫폼에서 가변 폰트를 지원합니다.
가변 폰트를 사용하면 두께(weight), 너비(width), 기울기(slant), 이탤릭(italic), 사용자 지정 축(custom axes), 타이포그래피 색상을 통한 시각적 두께(visual weight),
및 특정 텍스트 크기에 대한 조정(adaptations) 등 모든 스타일 선호 사항을 포함하는 하나의 폰트 파일을 유지할 수 있습니다.

자세한 내용은 [Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)를 참조하십시오.

### Skia가 Milestone 132로 업데이트됨

Skiko를 통해 Compose Multiplatform에서 사용되는 Skia 버전이 Milestone 132로 업데이트되었습니다.

이전에 사용된 Skia 버전은 Milestone 126이었습니다. 이 버전들 간의 변경 사항은
[릴리스 노트](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132)에서 확인할 수 있습니다.

### 새로운 Clipboard 인터페이스

Compose Multiplatform은 Jetpack Compose의 새로운 `Clipboard` 인터페이스를 채택했습니다.

[웹의 Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)의 비동기적 특성 때문에
웹 타겟에서 접근할 수 없었던 이전에 사용되던 `ClipboardManager` 인터페이스는
`Clipboard`를 선호하여 사용 중단되었습니다.
새 인터페이스는 `suspend` 함수를 지원하며 웹을 포함한 모든 타겟과 호환됩니다.

공통 코드에서 클립보드 상호 작용은 현재 API 설계에 의해 제한됩니다.
자세한 내용은 [CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)를 참조하십시오.

### 줄 높이 정렬

이전에 Android에서만 Compose Multiplatform에 의해 지원되던 줄 높이 정렬(line-height alignment)을 위한 공통 API가 이제 모든 플랫폼에서 지원됩니다.
`LineHeightStyle.Alignment`를 사용하여 줄 높이(line height)에 의해 제공되는 공간 내에서 텍스트 줄이 어떻게 정렬되는지 구성할 수 있습니다.
텍스트 줄은 예약된 공간의 하단, 중앙 또는 상단에 정렬될 수 있으며,
상승(ascent) 및 하강(descent) 값에 비례하여 조정될 수 있습니다.

<img src="compose-180-LineHeightStyle.png" alt="Line-height alignment" width="508"/>

Material3에서 줄 높이 정렬의 기본값은 `Center`이며,
이는 특별히 지정되지 않는 한 모든 플랫폼의 Material3 컴포넌트에서 `lineHeight`가 있는 텍스트에 중앙 정렬이 적용됨을 의미합니다.

## iOS

### 딥 링크

[org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md) %org.jetbrains.androidx.navigation%와 함께 Compose Multiplatform 1.8.2를 사용하면,
일반적인 Compose 방식(대상에 딥 링크를 할당하고 `NavController`를 사용하여 탐색)으로 iOS에서 딥 링크를 구현할 수 있습니다.

공통 코드에 딥 링크를 도입하는 가이드는 [](compose-navigation-deep-links.md)를 참조하십시오.

### XCFrameworks의 Compose 리소스

Compose Multiplatform은 이제 생성된 XCFramework에 리소스를 직접 임베드합니다.
리소스를 포함한 Compose 라이브러리를 표준 XCFramework로 빌드하고 사용할 수 있습니다.

이 기능은 Kotlin Gradle 플러그인 버전 2.2 이상이 필요합니다.

### 접근성 지원 개선

#### 오른쪽에서 왼쪽으로 쓰는 언어 지원

Compose Multiplatform 1.8.2는 제스처에 대한 올바른 텍스트 방향 처리를 포함하여
오른쪽에서 왼쪽으로 쓰는 언어에 대한 접근성 지원을 도입합니다.

RTL 지원에 대해 자세히 알아보려면 [오른쪽에서 왼쪽으로 쓰는 언어](compose-rtl.md)를 참조하십시오.

#### 스크롤 가능한 목록의 접근성

이 버전은 스크롤 경계 및 요소 위치 계산의 성능과 정확도를 향상시킵니다.
노치(notch) 및 화면 가장자리와 같은 안전 영역을 고려하여,
간격 및 여백 근처 스크롤에 대한 정확한 접근성 속성을 보장합니다.

또한 스크롤 상태 알림(announcement) 지원을 도입했습니다.
VoiceOver가 활성화된 경우, 세 손가락 스크롤 제스처를 수행할 때 목록 상태 업데이트를 들을 수 있습니다.
알림에는 다음이 포함됩니다:

*   목록 상단에 있을 때 "첫 페이지"
*   앞으로 스크롤할 때 "다음 페이지"
*   뒤로 스크롤할 때 "이전 페이지"
*   끝에 도달했을 때 "마지막 페이지"

이러한 알림의 현지화된 버전도 제공되어, VoiceOver가 사용자가 선택한 언어로 읽을 수 있도록 합니다.

#### 컨테이너 뷰의 접근성

Compose Multiplatform 1.8.2부터는
컨테이너에 대한 트래버스(traversal) 시맨틱 속성을 정의하여
복잡한 뷰를 스크롤하고 스와이프할 때 올바른 읽기 순서를 보장할 수 있습니다.

화면 판독기(screen reader)를 위한 올바른 요소 정렬 외에도,
트래버스 속성 지원을 통해 위로 스와이프 또는 아래로 스와이프 접근성 제스처를 사용하여 다른 트래버스 그룹 간을 탐색할 수 있습니다.
컨테이너에 대한 접근성 탐색 모드로 전환하려면 VoiceOver가 활성화된 동안 화면에서 두 손가락을 회전하십시오.

트래버스 시맨틱 속성에 대해 자세히 알아보려면 [접근성](compose-accessibility.md#traversal-order) 섹션을 참조하십시오.

#### 접근 가능한 텍스트 입력

Compose Multiplatform 1.8.2에서는 텍스트 필드의 접근성 트레이트(trait) 지원을 도입했습니다.
텍스트 입력 필드가 포커스를 받으면 이제 편집 가능(editable)으로 표시되어,
적절한 접근성 상태 표현을 보장합니다.

이제 UI 테스트에서도 접근 가능한 텍스트 입력을 사용할 수 있습니다.

#### 트랙패드 및 키보드를 통한 제어 지원

iOS용 Compose Multiplatform은 이제 장치를 제어하기 위한 두 가지 추가 입력 방법을 지원합니다. 터치스크린에 의존하는 대신,
AssistiveTouch를 활성화하여 마우스나 트랙패드를 사용하거나, 전체 키보드 접근(Full Keyboard Access)을 사용하여 키보드를 사용할 수 있습니다:

*   AssistiveTouch (**설정** | **손쉬운 사용** | **터치** | **AssistiveTouch**)를 사용하면 연결된 마우스 또는
    트랙패드의 포인터로 iPhone 또는 iPad를 제어할 수 있습니다. 포인터를 사용하여 화면의 아이콘을 클릭하고,
    AssistiveTouch 메뉴를 탐색하거나, 화면 키보드를 사용하여 입력할 수 있습니다.
*   전체 키보드 접근(Full Keyboard Access) (**설정** | **손쉬운 사용** | **키보드** | **전체 키보드 접근**)은 연결된 키보드로 장치를 제어할 수 있도록 합니다.
    **Tab**과 같은 키로 탐색하고 **Space**를 사용하여 항목을 활성화할 수 있습니다.

#### 필요에 따른 접근성 트리 로드

Compose 시맨틱 트리와 iOS 접근성 트리를 동기화하는 특정 모드를 설정하는 대신,
이제 Compose Multiplatform이 이 프로세스를 지연 처리하도록 신뢰할 수 있습니다.
트리는 iOS 접근성 엔진의 첫 번째 요청 후에 완전히 로드되며,
화면 판독기가 상호 작용을 멈추면 해제됩니다.

이를 통해 iOS 음성 제어(Voice Control), VoiceOver,
및 접근성 트리에 의존하는 기타 접근성 도구를 완전히 지원할 수 있습니다.

[접근성 트리 동기화를 구성하는 데 사용](compose-ios-accessibility.md#choose-the-tree-synchronization-option)되었던
`AccessibilitySyncOptions` 클래스는 더 이상 필요하지 않으므로 제거되었습니다.

#### 접근성 속성 계산 정확도 향상

Compose Multiplatform 컴포넌트의 접근성 속성을 UIKit 컴포넌트의 예상 동작과 일치하도록 업데이트했습니다.
UI 요소는 이제 광범위한 접근성 데이터를 제공하며,
알파 값 0인 투명 컴포넌트는 더 이상 접근성 시맨틱을 제공하지 않습니다.

시맨틱을 정렬함으로써 또한
`DropDown` 요소의 누락된 히트박스,
보이는 텍스트와 접근성 레이블 간의 불일치, 그리고 잘못된 라디오 버튼 상태와 같은
접근성 속성 계산 오류와 관련된 여러 문제를 해결할 수 있었습니다.

### iOS 로깅을 위한 안정적인 API

iOS에서 운영 체제 로깅을 활성화하는 API가 이제 안정화되었습니다. `enableTraceOSLog()` 함수는 더 이상
실험적 옵트인(opt-in)이 필요하지 않으며 이제 Android 스타일 로깅과 일치합니다. 이 로깅은 디버깅 및 성능 분석을 위해
Xcode Instruments를 사용하여 분석할 수 있는 추적 정보를 제공합니다.

### 드래그 앤 드롭
<secondary-label ref="Experimental"/>

iOS용 Compose Multiplatform은 드래그 앤 드롭 기능을 지원하여,
Compose 애플리케이션 안팎으로 콘텐츠를 드래그할 수 있도록 합니다
(데모 비디오는 풀 리퀘스트 [1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690) 참조).
드래그 가능한 콘텐츠와 드롭 대상을 정의하려면 `dragAndDropSource` 및 `dragAndDropTarget` 수정자(modifier)를 사용하십시오.

iOS에서 드래그 앤 드롭 세션 데이터는 [`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem)으로 표현됩니다.
이 객체는 교차 프로세스 데이터 전송에 대한 정보와 앱 내 사용을 위한 선택적 로컬 객체를 포함합니다.
예를 들어, 텍스트를 드래그하려면 `DragAndDropTransferData(listOf(UIDragItem.fromString(text)))`를 사용할 수 있으며,
여기서 `UIDragItem.fromString(text)`는 텍스트를 드래그 앤 드롭 작업에 적합한 형식으로 인코딩합니다.
현재 `String` 및 `NSObject` 타입만 지원됩니다.

일반적인 사용 사례는 Jetpack Compose 문서의 [전용 문서](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)를 참조하십시오.

### 스크롤링 인터롭 뷰를 위한 터치 처리 개선

이번 릴리스에서:

*   모달 `UIViewController`로 표시되는 스크롤 불가능한 콘텐츠를 가진 Compose 뷰는 아래로 스와이프 제스처로 닫을 수 있습니다.
*   중첩된 스크롤 가능한 뷰는 일반적인 [인터롭 터치 프레임워크](compose-ios-touch.md) 내에서 올바르게 작동합니다:
    스크롤 가능한 Compose 뷰 내에서 네이티브 콘텐츠를 스크롤하거나, 스크롤 가능한 네이티브 뷰 내에서 Compose 콘텐츠를 스크롤할 때,
    UI는 모호한 터치 시퀀스를 해결하기 위해 iOS 로직을 면밀히 따릅니다.

### 옵트인 동시 렌더링
<secondary-label ref="Experimental"/>

iOS용 Compose Multiplatform은 이제 렌더링 작업을 전용 렌더 스레드로 오프로드(offload)하는 것을 지원합니다.
동시 렌더링은 UIKit 인터롭이 없는 시나리오에서 성능을 향상시킬 수 있습니다.

`ComposeUIViewControllerConfiguration` 클래스의 `useSeparateRenderThreadWhenPossible` 플래그를 활성화하거나,
`ComposeUIViewController` 구성 블록 내에서 `parallelRendering` 속성을 직접 활성화하여
별도의 렌더 스레드에서 렌더링 명령을 인코딩하도록 옵트인하십시오:

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

## 웹

### 내비게이션 라이브러리에서 브라우저 컨트롤 지원

Compose Multiplatform으로 빌드된 Kotlin/Wasm 및 Kotlin/JS 애플리케이션에서,
내비게이션은 이제 기본 브라우저 컨트롤과 올바르게 작동합니다.
이를 활성화하려면 `window.bindToNavigation()` 메서드를 사용하여 브라우저 창을 기본 내비게이션 그래프에 연결하십시오.
이렇게 하면 웹 앱은 브라우저에서 **뒤로** 및 **앞으로** 버튼을 사용하여 기록을 이동하는 것에 올바르게 반응합니다
(데모 비디오는 풀 리퀘스트 [1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621) 참조).

웹 앱은 또한 브라우저 주소 표시줄을 조작하여 현재 대상 경로를 반영하고,
사용자가 올바른 경로가 인코딩된 URL을 붙여넣을 때 직접 대상으로 이동합니다
(데모 비디오는 풀 리퀘스트 [1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640) 참조).
`window.bindToNavigation()` 메서드에는 선택적 `getBackStackEntryPath` 매개변수가 있어,
경로 문자열을 URL 프래그먼트로 변환하는 것을 사용자 지정할 수 있습니다.

### 브라우저 커서 설정
<secondary-label ref="Experimental"/>

브라우저 페이지에서 마우스 포인터로 사용될 수 있는 아이콘을 관리하기 위해 실험적인 `PointerIcon.Companion.fromKeyword()` 함수를 도입했습니다.
매개변수로 키워드를 전달하여 컨텍스트에 따라 표시할 커서 유형을 지정할 수 있습니다.
예를 들어, 텍스트를 선택하거나, 컨텍스트 메뉴를 열거나, 로딩 프로세스를 나타내기 위해 다른 포인터 아이콘을 할당할 수 있습니다.

사용 가능한 전체 [키워드 목록](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)을 확인하십시오.

### 리소스 사전 로드
<secondary-label ref="Experimental"/>

Compose Multiplatform 1.8.2는 웹 타겟을 위한 폰트 및 이미지를 사전 로드(preloading)하는 새로운 실험적 API를 도입합니다.
사전 로드는 스타일이 적용되지 않은 텍스트 깜빡임(FOUT)이나 이미지 및 아이콘 깜빡임과 같은 시각적 문제를 방지하는 데 도움이 됩니다.

다음 함수는 이제 리소스를 로드하고 캐시하는 데 사용할 수 있습니다:

*   폰트를 사전 로드하는 `preloadFont()`.
*   비트맵 이미지를 사전 로드하는 `preloadImageBitmap()`.
*   벡터 이미지를 사전 로드하는 `preloadImageVector()`.

자세한 내용은 [문서](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api)를 참조하십시오.

## 데스크톱

### Windows 소프트웨어 렌더링 개선

Windows에서 Skia에 권장되는 clang 컴파일러로 전환함으로써 CPU에 의존하는 렌더링 속도가 향상되었습니다.
이는 주로 순수 소프트웨어 렌더링에 영향을 미치는데, 일반적으로 렌더링은 GPU에 의존하며 일부 계산만 CPU에서 수행되기 때문입니다.
따라서 이 개선 사항은 일부 가상 머신과 [Skia에서 지원되지 않는](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13) 몇몇 오래된 그래픽 카드에서 매우 두드러집니다:
해당 환경에서 Compose Multiplatform으로 생성된 Windows 앱은 Compose Multiplatform 1.7.3에 비해 최대 6배 빨라졌습니다.

이 개선 사항은 Windows for ARM64 지원과 더불어, macOS 하의 가상 Windows 시스템에서 Compose Multiplatform UI의 성능을 크게 향상시킵니다.

### Windows for ARM64 지원

Compose Multiplatform 1.8.2는 JVM에서 Windows for ARM64 지원을 도입하여,
ARM 기반 Windows 장치에서 애플리케이션을 빌드하고 실행하는 전반적인 경험을 개선합니다.

## Gradle 플러그인

### 생성된 Res 클래스 이름을 변경하는 옵션

이제 앱의 리소스에 액세스할 수 있는 생성된 리소스 클래스의 이름을 사용자 지정할 수 있습니다.
사용자 지정 이름 지정은 다중 모듈 프로젝트에서 리소스를 구분하는 데 특히 유용하며,
프로젝트의 명명 규칙과의 일관성을 유지하는 데 도움이 됩니다.

사용자 지정 이름을 정의하려면 `build.gradle.kts` 파일의 `compose.resources` 블록에 다음 줄을 추가하십시오:

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform/pull/5296)를 참조하십시오.

### `androidLibrary` 타겟에서 멀티플랫폼 리소스 지원
<secondary-label ref="Experimental"/>

Android Gradle 플러그인 버전 8.8.0부터, 새로운 `androidLibrary` 타겟에서 생성된 자산(asset)을 사용할 수 있습니다.
Compose Multiplatform을 이러한 변경 사항에 맞추기 위해,
Android 자산에 패키징된 멀티플랫폼 리소스와 함께 작동하는 새로운 타겟 구성에 대한 지원을 도입했습니다.

`androidLibrary` 타겟을 사용하는 경우, 구성에서 리소스를 활성화하십시오:

```
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

그렇지 않으면 다음 예외가 발생합니다: `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`.