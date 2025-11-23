[//]: # (title: Compose Multiplatform 1.10.0-beta02의 새로운 기능)

이번 EAP 기능 릴리스의 주요 내용은 다음과 같습니다:
 * [통합된 `@Preview` 어노테이션](#unified-preview-annotation)
 * [Navigation 3 지원](#support-for-navigation-3)
 * [번들로 제공되는 Compose Hot Reload](#compose-hot-reload-integration)

이번 릴리스의 전체 변경 사항 목록은 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.10.0-beta01)에서 확인할 수 있습니다.

## 의존성

* Gradle 플러그인 `org.jetbrains.compose`, 버전 `1.10.0-beta02`. Jetpack Compose 라이브러리 기반:
    * [Runtime 1.10.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.10.0-beta02)
    * [UI 1.10.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.10.0-beta02)
    * [Foundation 1.10.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.10.0-beta02)
    * [Material 1.10.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-material#1.10.0-beta02)
    * [Material3 1.5.0-alpha08](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha08)

* Compose Material3 라이브러리 `org.jetbrains.compose.material3:material3*:1.10.0-alpha05`. [Jetpack Compose Material3 1.5.0-alpha08](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha08) 기반.

  [Expressive 테마](whats-new-compose-190.md#material-3-expressive-theme)를 사용하려면 Material 3의 실험적인 버전을 포함하세요:
    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
    ```
* Compose Material3 Adaptive 라이브러리 `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha02`. [Jetpack Compose Material3 Adaptive 1.3.0-alpha03](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha03) 기반
* Lifecycle 라이브러리 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.10.0-alpha05`. [Jetpack Lifecycle 2.10.0-rc01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.10.0-rc01) 기반
* Navigation 라이브러리 `org.jetbrains.androidx.navigation:navigation-*:2.9.1`. [Jetpack Navigation 2.9.4](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.4) 기반
* Navigation 3 라이브러리 `org.jetbrains.androidx.navigation3:navigation3-*:1.0.0-alpha05`. [Jetpack Navigation3 1.0.0-rc01](https://developer.android.com/jetpack/androidx/releases/navigation3#1.0.0-rc01) 기반
* Navigation Event 라이브러리 `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.0.0-beta02`. [Jetpack Navigation Event 1.0.0-rc01](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.0.0-rc01) 기반
* Savedstate 라이브러리 `org.jetbrains.androidx.savedstate:savedstate*:1.4.0-rc01`. [Jetpack Savedstate 1.4.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0) 기반
* WindowManager Core 라이브러리 `org.jetbrains.androidx.window:window-core:1.5.0`. [Jetpack WindowManager 1.5.0](https://developer.android.com/jetpack/androidx/releases/window#1.5.0) 기반

## 호환성을 깨는 변경 사항

### 지원 중단된 의존성 별칭

Compose Multiplatform Gradle 플러그인(`compose.ui` 및 기타)에서 지원하는 의존성 별칭은
1.10.0-beta01 릴리스와 함께 지원 중단됩니다.
버전 카탈로그에 직접 라이브러리 참조를 추가하는 것을 권장합니다.
해당 지원 중단 알림에서 특정 참조가 제안됩니다.

이 변경 사항은 Compose Multiplatform 라이브러리에 대한 의존성 관리를 좀 더 투명하게 만들 것입니다.
앞으로 Compose Multiplatform용 BOM을 제공하여 호환 가능한 버전 설정을 간소화할 수 있기를 바랍니다.

### 웹 대상에 필요한 최소 Kotlin 버전 증가

프로젝트에 웹 대상이 포함된 경우, 최신 기능을 사용하려면 Kotlin 2.2.21로 업그레이드해야 합니다.

## 크로스 플랫폼

### 통합된 `@Preview` 어노테이션

여러 플랫폼에 걸쳐 미리 보기에 대한 접근 방식을 통합했습니다.
이제 `commonMain` 소스 세트의 모든 대상 플랫폼에서 `androidx.compose.ui.tooling.preview.Preview` 어노테이션을 사용할 수 있습니다.

`org.jetbrains.compose.ui.tooling.preview.Preview`와 같은 다른 모든 어노테이션 및
데스크톱 전용 `androidx.compose.desktop.ui.tooling.preview.Preview`는 더 이상 사용되지 않습니다.

### Navigation 3 지원

Navigation 3는 Compose와 함께 작동하도록 설계된 새로운 내비게이션 라이브러리입니다.
Navigation 3를 사용하면 백 스택을 완벽하게 제어할 수 있으며,
목적지로 이동하고 돌아오는 것은 목록에서 항목을 추가하고 제거하는 것만큼 간단합니다.
새로운 기본 원칙과 결정 사항에 대해서는 [Navigation 3 문서](https://developer.android.com/guide/navigation/navigation-3)와
안내 [블로그 게시물](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)에서 확인할 수 있습니다.

Compose Multiplatform 1.10.0-beta01은 비 Android 대상에서 새로운 내비게이션 API를 사용하는 것에 대한 알파 지원을 제공합니다.
릴리스된 멀티플랫폼 아티팩트는 다음과 같습니다:

* Navigation 3 UI 라이브러리, `org.jetbrains.androidx.navigation3:navigation3-ui`
* Navigation 3용 ViewModel, `org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3`
* Navigation 3용 Material 3 적응형 레이아웃, `org.jetbrains.compose.material3.adaptive:adaptive-navigation3`

원본 Android 저장소에서 미러링된 [nav3-recipes](https://github.com/terrakok/nav3-recipes) 샘플에서 멀티플랫폼 Navigation 3 구현 예제를 찾을 수 있습니다.

일부 플랫폼별 구현 세부 정보:

* iOS에서는 [EndEdgePanGestureBehavior](https://github.com/JetBrains/compose-multiplatform-core/pull/2519) 옵션(기본적으로 `Disabled`)을 사용하여 끝 가장자리 [패닝 제스처](https://developer.apple.com/documentation/uikit/handling-pan-gestures)에 대한 내비게이션을 관리할 수 있습니다.
  여기서 "끝 가장자리"는 LTR 인터페이스에서 화면의 오른쪽 가장자리를, RTL 인터페이스에서는 왼쪽 가장자리를 의미합니다.
  시작 가장자리는 끝 가장자리와 반대이며 항상 뒤로 가기 제스처에 바인딩됩니다.
* 웹 앱에서 데스크톱 브라우저에서 **Esc** 키를 누르면 사용자가 이전 화면으로 돌아가고
  (대화 상자, 팝업 및 Material 3의 `SearchBar`와 같은 일부 위젯을 닫습니다),
  이는 데스크톱 앱에서 이미 그러하듯이 작동합니다.
* [브라우저 기록 내비게이션](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps) 지원 및 주소 표시줄에서 목적지를 사용하는 것은 Compose Multiplatform 1.10에서 Navigation 3으로 확장되지 않을 것입니다.
  이는 멀티플랫폼 라이브러리의 이후 버전으로 연기되었습니다.

### 자동 크기 조정 인터롭 뷰

Compose Multiplatform은 이제 데스크톱 및 iOS의 네이티브 인터롭 요소에 대한 자동 크기 조정을 지원합니다.
이제 이러한 요소들은 콘텐츠를 기반으로 레이아웃을 조정할 수 있으며,
정확한 크기를 수동으로 계산하거나 고정된 치수를 미리 지정할 필요가 없습니다.

* 데스크톱에서는 `SwingPanel`이 포함된 구성 요소의 최소, 권장 및 최대 크기를 기반으로 자동으로 크기를 조정합니다.
* iOS에서는 UIKit 인터롭 뷰가 이제 뷰의 적합 크기(고유 콘텐츠 크기)에 따라 크기 조정을 지원합니다.
  이를 통해 SwiftUI 뷰(`UIHostingController`를 통해) 및
  `NSLayoutConstraints`에 의존하지 않는 기본 `UIView` 서브클래스의 적절한 래핑이 가능합니다.

### Skia Milestone 138로 업데이트

Skiko를 통해 Compose Multiplatform에서 사용하는 Skia 버전이 Milestone 138로 업데이트되었습니다.

이전 Skia 버전은 Milestone 132였습니다.
이 버전들 사이의 변경 사항은 [릴리스 노트](https://skia.googlesource.com/skia/+/refs/heads/chrome/m138/RELEASE_NOTES.md)에서 확인할 수 있습니다.

## iOS

### 창 인셋

Compose Multiplatform은 이제 `WindowInsetsRulers`를 지원합니다.
이는 상태 표시줄, 내비게이션 바 또는 화면 키보드와 같은 창 인셋을 기반으로 UI 요소를 배치하고 크기를 조정하는 기능을 제공합니다.

창 인셋을 관리하는 이 새로운 접근 방식은 플랫폼별 창 인셋 데이터를 검색하기 위한 단일 구현을 사용합니다.
이는 `WindowInsets`와 `WindowInsetsRulers` 모두 공통 메커니즘을 사용하여 인셋을 일관되게 관리한다는 것을 의미합니다.

> 이전에는 `WindowInsets.Companion.captionBar`가 `@Composable`로 표시되지 않았습니다.
> 여러 플랫폼에서 해당 동작을 일치시키기 위해 `@Composable` 속성을 추가했습니다.
>
{style="note"}

### 개선된 IME 구성

[1.9.0에서 도입된](whats-new-compose-190.md#ime-options) iOS 전용 IME 사용자 정의에 이어서,
이번 릴리스에서는 `PlatformImeOptions`로 텍스트 입력 뷰를 구성하기 위한 새로운 API를 추가합니다.

이 새로운 API를 통해 필드가 포커스를 얻고 IME를 트리거할 때 입력 인터페이스를 사용자 정의할 수 있습니다:

 * `UIResponder.inputView`는 기본 시스템 키보드를 대체하기 위한 사용자 정의 입력 뷰를 지정합니다.
 * `UIResponder.inputAccessoryView`는 IME 활성화 시 시스템 키보드 또는 사용자 정의 `inputView`에 연결되는 사용자 정의 액세서리 뷰를 정의합니다.

### 인터롭 뷰를 위한 오버레이 배치
<primary-label ref="Experimental"/>

이제 실험적인 `placedAsOverlay` 플래그를 사용하여 `UIKitView` 및 `UIKitViewController` 뷰를 Compose UI 위에 배치할 수 있습니다.
이 플래그를 통해 인터롭 뷰는 투명한 배경과 네이티브 셰이더 효과를 지원할 수 있습니다.

인터롭 뷰를 오버레이로 렌더링하려면 `@OptIn(ExperimentalComposeUiApi::class)` 어노테이션을 사용하고
`UIKitInteropProperties`에서 `placedAsOverlay` 매개변수를 `true`로 설정하세요:

```kotlin
UIKitViewController(
    modifier = modifier,
    update = {},
    factory = { factory.createNativeMap() },
    properties = UIKitInteropProperties(placedAsOverlay = true)
)
```

이 구성은 Compose UI 레이어 위에 뷰를 렌더링하므로,
동일한 영역에 위치한 다른 컴포저블을 시각적으로 가릴 수 있다는 점을 유의하세요.

## 데스크톱

### Compose Hot Reload 통합

Compose Hot Reload 플러그인은 이제 Compose Multiplatform Gradle 플러그인에 번들로 제공됩니다.
더 이상 Hot Reload 플러그인을 별도로 구성할 필요가 없으며,
데스크톱을 대상으로 하는 Compose Multiplatform 프로젝트에서는 기본적으로 활성화되어 있습니다.

Compose Hot Reload 플러그인을 명시적으로 선언하는 프로젝트의 경우 다음과 같습니다:

 * Compose Multiplatform Gradle 플러그인에서 제공하는 버전을 사용하기 위해 선언을 안전하게 제거할 수 있습니다.
 * 특정 버전 선언을 유지하기로 선택하면 번들로 제공되는 버전 대신 해당 버전이 사용됩니다.

번들로 제공되는 Compose Hot Reload Gradle 플러그인의 최소 Kotlin 버전은 2.1.20입니다.
이전 버전의 Kotlin이 감지되면 핫 리로드 기능은 비활성화됩니다.

## Gradle

### AGP 9.0.0 지원

Compose Multiplatform은 Android Gradle 플러그인(AGP) 버전 9.0.0에 대한 지원을 도입합니다.
새로운 AGP 버전과의 호환성을 위해 Compose Multiplatform 1.9.3 또는 1.10.0으로 업그레이드해야 합니다.

장기적으로 업데이트 프로세스를 더 원활하게 만들기 위해,
프로젝트 구조를 변경하여 AGP 사용을 전용 Android 모듈로 분리하는 것을 권장합니다.