[//]: # (title: Compose Multiplatform 1.11.1의 새로운 기능)

이번 기능 릴리스의 주요 하이라이트는 다음과 같습니다.

* [iOS 네이티브 텍스트 입력](#native-text-input)
* [Compose UI 테스트 API v2 버전](#compose-ui-tests-v2)
* [웹 타겟의 스크롤 성능 개선](#scroll-on-web-targets-brought-in-line-with-native-ui)

전체 변경 사항 목록은 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.11.0)에서 확인할 수 있습니다.
이번 릴리스의 구체적인 컴포넌트 버전은 [의존성(Dependencies)](#dependencies) 섹션에 나열되어 있습니다.

## 주요 변경 사항 및 지원 중단(Deprecations)

### 안드로이드 이외의 타겟을 위한 쉐이더(Shader) 래퍼

안드로이드 이외의 타겟에서 `Shader` 타입이 `org.jetbrains.skia.Shader`에 대한 `actual typealias`에서 Compose 전용 래퍼 클래스로 리팩터링되었습니다. 이 변경을 통해 공통 API가 직접적인 Skia/Skiko 의존성으로부터 분리되었습니다.

마이그레이션 단계:

* Compose API에서 Skia/Skiko 쉐이더를 사용하려면 `SkShader.asComposeShader()`를 사용하여 래핑하세요.
* Compose `Shader`에서 저수준 Skia 타입에 접근하려면 `Shader.skiaShader` 확장 프로퍼티를 사용하세요.
* `Shader` API에 의존하는 서드파티 라이브러리를 사용하는 경우, 호환되는 최신 버전으로 업데이트하세요.

### 최소 Kotlin 버전 상향

프로젝트에 네이티브 또는 웹 타겟이 포함된 경우, 최신 기능을 사용하려면 Kotlin 2.3.10으로 업그레이드해야 합니다.

### iOS 타겟 지원 변경 사항

Compose Multiplatform은 Kotlin에서 지원 중단된 Apple x86_64 타겟을 더 이상 지원하지 않습니다. 이에 따라 모든 모듈에서 `iosX64` 및 `macosX64` 타겟이 완전히 제거되었습니다.

또한 지원하는 최소 iOS 버전을 13.0에서 14.0으로 상향했습니다.

### 지원 중단(Deprecations)

* Compose Multiplatform 1.9.0에서는 HTML 요소를 웹 애플리케이션에 원활하게 통합할 수 있도록 [`WebElementView`](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html#new-api-for-embedding-html-content) 컴포저블을 도입했습니다. 그러나 선택된 이름이 다소 모호하다는 의견이 있어, HTML 전용 목적을 더 잘 반영하도록 `HtmlElementView`로 이름을 변경했습니다. 기존 `WebElementView` 버전은 `HtmlElementView`를 위해 지원 중단되었습니다.
* `Key.Home`은 잘못 매핑되어 있었기 때문에 지원 중단되었습니다. 키보드 탐색에는 `Key.MoveHome`을, 시스템 수준 동작에는 `Key.SystemHome`을 사용하세요.

## 플랫폼 공통 사항

### Compose UI 테스트 v2

Compose Multiplatform은 안드로이드 이외의 타겟에 [v2 `ComposeUiTest` API](https://developer.android.com/develop/ui/compose/testing/migrate-v2) 지원을 도입합니다. 이 새로운 API는 기본 테스트 디스패처로 `UnconfinedTestDispatcher` 대신 `StandardTestDispatcher`를 사용합니다. 이 변경을 통해 코루틴이 이벤트 큐에 따라 순서대로 실행되도록 보장하며, 테스트의 신뢰성을 높이고 프로덕션 동작과의 일관성을 개선합니다.

또한 Compose UI 테스트 v2에 `effectContext` 파라미터 지원을 추가했습니다. 이 파라미터를 사용하면 컴포지션(compositions)을 실행할 때 커스텀 코루틴 컨텍스트를 지정할 수 있습니다.

기존에 제공되던 `runComposeUiTest`, `runSkikoComposeUiTest`, `runDesktopComposeUiTest` 등의 테스트 API는 v2 버전을 위해 지원 중단되었습니다.

### Skia Milestone 144로 업데이트

Skiko를 통해 Compose Multiplatform에서 사용하는 Skia 버전이 Milestone 144로 업데이트되었습니다.

이전에 사용된 Skia 버전은 Milestone 138이었습니다.
버전 간의 변경 사항은 [릴리스 노트](https://skia.googlesource.com/skia/+/refs/heads/chrome/m144/RELEASE_NOTES.md)에서 확인할 수 있습니다.

## iOS

### 네이티브 텍스트 입력
<primary-label ref="Experimental"/>

Compose Multiplatform은 `UITextInput` 및 `UIKeyInput` 프로토콜을 통해 입력을 관리하기 위해 네이티브 iOS `UIView`를 사용하는 새로운 텍스트 입력 구현을 도입합니다. 이를 통해 정밀한 캐럿(caret) 이동, 네이티브 제스처, 네이티브 선택 처리, 그리고 `자동 채우기(Autofill)`, `번역(Translate)`, `검색(Search)`과 같은 항목이 포함된 시스템 컨텍스트 메뉴를 포함하여 완전히 네이티브한 iOS 텍스트 편집 동작이 가능해집니다. 이 새로운 방식은 네이티브 iOS의 룩앤필(look and feel)을 따르면서 향후 Apple 업데이트와의 호환성도 개선합니다.

기존의 Compose Multiplatform 텍스트 입력은 플랫폼 간의 일관성을 위한 안정적인 선택지로 남아있지만, 네이티브 방식은 iOS에 특화된 사용자 경험에 초점을 맞춥니다.

새로운 텍스트 입력을 활성화하려면 iOS 소스 세트에서 `usingNativeTextInput` 옵션을 사용하세요.

```kotlin
@ExperimentalComposeUiApi
BasicTextField(
    value = state,
    keyboardOptions = KeyboardOptions(
        platformImeOptions = PlatformImeOptions {
            usingNativeTextInput(true)
        }
    )
)
```

새로운 네이티브 텍스트 입력은 `BasicTextField(TextFieldValue)`와 `BasicTextField(TextFieldState)` API를 모두 지원하며, `isNewContextMenuEnabled` 플래그를 통해 활성화되는 새로운 컨텍스트 메뉴 API와도 호환됩니다.

### 병렬 렌더링(Concurrent rendering) 기본 활성화

Compose Multiplatform 1.8.0에서는 렌더링 작업을 전용 렌더 스레드로 오프로드(offload)하는 기능을 [실험적 옵트인(opt-in) 기능](whats-new-compose-180.md#opt-in-concurrent-rendering)으로 도입했습니다.

Compose Multiplatform 1.11.0부터 병렬 렌더링이 기본적으로 활성화됩니다.

## 웹(Web)

### 웹 타겟의 스크롤 성능을 네이티브 UI 수준으로 개선

Compose Multiplatform에서 웹의 스크롤 성능은 네이티브 UI에 비해 뒤처져 있었습니다. 1.11.0 릴리스에서는 터치 처리의 많은 부분이 재작업되고 수정되어, Compose 웹 앱의 스크롤 성능이 다른 타겟과 대등한 수준으로 개선되었습니다. 이러한 개선 효과는 최신 [웹 버전 KotlinConf 앱](https://jetbrains.github.io/kotlinconf-app/)에서 확인할 수 있습니다.

이 작업의 일환으로 [웹에서의 Coil 이미지 디코딩도 개선되었습니다](https://github.com/coil-kt/coil/pull/3305). Coil을 사용하는 경우 최상의 경험을 위해 3.4.0 버전으로 업데이트하시기 바랍니다.

수정 사항 목록과 개선 사항에 대한 설명 및 데모는 이슈 [CMP-9727](https://youtrack.jetbrains.com/issue/CMP-9727)에서 확인할 수 있습니다.

## 의존성(Dependencies)

| 라이브러리 | Maven 좌표 | 기반 Jetpack 버전 |
|--------------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Runtime            | `org.jetbrains.compose.runtime:runtime*:1.11.1`                        | [Runtime 1.11.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.11.2)                                     |
| UI                 | `org.jetbrains.compose.ui:ui*:1.11.1`                                  | [UI 1.11.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.11.2)                                               |
| Foundation         | `org.jetbrains.compose.foundation:foundation*:1.11.1`                  | [Foundation 1.11.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.11.2)                               |
| Material           | `org.jetbrains.compose.material:material*:1.11.1`                      | [Material 1.11.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.11.2)                                   |
| Material3          | `org.jetbrains.compose.material3:material3*:1.11.0-alpha07`            | [Material3 1.5.0-alpha17](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha17)                   |
| Material3 Adaptive | `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha07`     | [Material3 Adaptive 1.3.0-alpha10](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha10) |
| Lifecycle          | `org.jetbrains.androidx.lifecycle:lifecycle-*:2.11.0-beta01`           | [Lifecycle 2.11.0-beta01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.11.0-beta01)                           |
| Navigation         | `org.jetbrains.androidx.navigation:navigation-*:2.9.2`                 | [Navigation 2.9.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.7)                                         |
| Navigation3        | `org.jetbrains.androidx.navigation3:navigation3-*:1.1.2`               | [Navigation3 1.1.2](https://developer.android.com/jetpack/androidx/releases/navigation3#1.1.2)                                       |
| Navigation Event   | `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.1.1` | [Navigation Event 1.1.1](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.1.1)                              |
| Savedstate         | `org.jetbrains.androidx.savedstate:savedstate*:1.4.0`                  | [Savedstate 1.4.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0)                                         |
| WindowManager Core | `org.jetbrains.androidx.window:window-core:1.5.1`                      | [WindowManager 1.5.1](https://developer.android.com/jetpack/androidx/releases/window#1.5.1)                                          |