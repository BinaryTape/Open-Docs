[//]: # (title: 다른 플랫폼에서의 기본 UI 동작)

Compose Multiplatform는 다양한 플랫폼에서 가능한 한 비슷하게 동작하는 앱을 만들 수 있도록 돕는 것을 목표로 합니다.
이 페이지에서는 Compose Multiplatform로 다양한 플랫폼을 위한 공유 UI 코드를 작성할 때 예상해야 할 피할 수 없는 차이점 또는 일시적인 절충안에 대해 알아볼 수 있습니다.

## 프로젝트 구조

어떤 플랫폼을 대상으로 하든, 각 플랫폼에는 전용 진입점이 필요합니다.

*   Android의 경우, `Activity`는 공통 코드에서 메인 컴포저블을 표시하는 역할을 합니다.
*   iOS 앱의 경우, 앱을 초기화하는 `@main` 클래스 또는 구조체입니다.
*   JVM 앱의 경우, 애플리케이션을 시작하고 메인 공통 컴포저블을 실행하는 `main()` 함수입니다.
*   Kotlin/JS 또는 Kotlin/Wasm 앱의 경우, 메인 공통 코드 컴포저블을 웹 페이지에 연결하는 `main()` 함수입니다.

앱에 필요한 특정 플랫폼별 API는 멀티플랫폼 지원이 없을 수 있으므로, 플랫폼별 소스 세트에서 이러한 API를 호출하는 것을 구현해야 합니다.
그렇게 하기 전에, 사용 가능한 모든 Kotlin Multiplatform 라이브러리를 종합적으로 분류하는 것을 목표로 하는 JetBrains 프로젝트인 [klibs.io](https://klibs.io/)를 확인하십시오.
이미 네트워크 코드, 데이터베이스, 코루틴 등을 위한 라이브러리가 있습니다.

## 입력 방식

### 소프트웨어 키보드

각 플랫폼은 텍스트 필드가 활성화될 때 키보드가 나타나는 방식을 포함하여 소프트웨어 키보드를 약간 다르게 처리할 수 있습니다.

Compose Multiplatform는 [Compose 윈도우 인셋(Window Insets) 접근 방식](https://developer.android.com/develop/ui/compose/system/insets)을 채택하고 iOS에서 [안전 영역(Safe Area)](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe_area)을 고려하기 위해 이를 모방합니다.
구현에 따라 iOS에서는 소프트웨어 키보드가 약간 다르게 위치할 수 있습니다.
양쪽 플랫폼에서 키보드가 중요한 UI 요소를 가리지 않는지 확인해야 합니다.

Compose Multiplatform는 현재 기본 IME 동작을 변경하는 것을 지원하지 않습니다. 예를 들어, 일반적인 `&crarr;` 아이콘 대신 돋보기나 체크마크를 표시하는 기능 등입니다.

### 터치 및 마우스 지원

현재 데스크톱 구현은 모든 포인터 조작을 마우스 제스처로 해석하므로 멀티터치 제스처를 지원하지 않습니다.
예를 들어, 데스크톱용 Compose Multiplatform에서는 일반적인 핀치-투-줌(pinch-to-zoom) 제스처를 구현할 수 없습니다. 이는 동시에 두 번의 터치를 처리해야 하기 때문입니다.

## UI 동작 및 모양

### 플랫폼별 기능

일부 공통 UI 요소는 Compose Multiplatform에서 다루지 않으며 프레임워크를 사용하여 사용자 정의할 수 없습니다.
따라서 다른 플랫폼에서는 다르게 보일 것으로 예상해야 합니다.

네이티브 팝업 뷰가 그 예시입니다.
Compose Multiplatform 텍스트 필드에서 텍스트를 선택할 때, **복사** 또는 **번역**과 같은 기본 제안 작업은 앱이 실행되는 플랫폼에 따라 다릅니다.

### 스크롤 물리

Android와 iOS의 경우, 스크롤 느낌이 플랫폼에 맞춰져 있습니다.
데스크톱의 경우, 스크롤 지원은 마우스 휠로 제한됩니다([](#touch-and-mouse-support)에서 언급했듯이).

### 인터롭 뷰

공통 컴포저블 내에 네이티브 뷰를 포함하거나 그 반대로 하고 싶다면, Compose Multiplatform에서 지원하는 플랫폼별 메커니즘에 익숙해져야 합니다.

iOS의 경우, [SwiftUI](compose-swiftui-integration.md) 및 [UIKit](compose-uikit-integration.md)과의 인터롭 코드에 대한 별도의 가이드가 있습니다.

데스크톱의 경우, Compose Multiplatform는 [](compose-desktop-swing-interoperability.md)을 지원합니다.

### 뒤로 가기 제스처

Android 기기는 기본적으로 뒤로 가기 제스처를 지원하며, 모든 화면은 어떤 식으로든 **뒤로 가기** 버튼에 반응합니다.

iOS에는 기본적으로 뒤로 가기 제스처가 없지만, 개발자는 사용자 경험 기대치를 충족하기 위해 유사한 기능을 구현하도록 권장됩니다.
iOS용 Compose Multiplatform는 Android 기능을 모방하기 위해 기본적으로 뒤로 가기 제스처를 지원합니다.

데스크톱에서는 Compose Multiplatform가 **Esc** 키를 기본 뒤로 가기 트리거로 사용합니다.

자세한 내용은 [](compose-navigation.md#back-gesture) 섹션을 참조하십시오.

### 텍스트

텍스트의 경우, Compose Multiplatform는 다른 플랫폼 간의 픽셀 단위의 완벽한 일치를 보장하지 않습니다.

*   글꼴을 명시적으로 설정하지 않으면, 각 시스템은 텍스트에 다른 기본 글꼴을 할당합니다.
*   동일한 글꼴이라도, 각 플랫폼에 특화된 문자 앨리어싱(aliasing) 메커니즘은 눈에 띄는 차이를 초래할 수 있습니다.

이는 사용자 경험에 큰 영향을 미치지 않습니다. 오히려 기본 글꼴은 각 플랫폼에서 예상대로 나타납니다.
그러나 픽셀 차이가 스크린샷 테스트 등을 방해할 수 있습니다.

<!-- this should be covered in benchmarking, not as a baseline Compose Multiplatform limitation 
### Initial performance

On iOS, you may notice a delay in the initial performance of individual screens compared to Android.
This can happen because Compose Multiplatform compiles UI shaders on demand.
So, if a particular shader is not cached yet, compiling it may delay rendering of a scene.

This issue affects only the first launch of each screen.
Once all necessary shaders are cached, subsequent launches are not delayed by compilation.
-->

## 개발자 경험

### 미리 보기

*미리 보기*는 IDE에서 사용 가능한 컴포저블의 상호 작용할 수 없는 레이아웃 표현입니다.

컴포저블의 미리 보기를 보려면:

1.  프로젝트에 Android 타겟이 없다면 추가합니다 (미리 보기 메커니즘은 Android 라이브러리를 사용합니다).
2.  공통 코드에서 `@Preview` 어노테이션으로 미리 보기가 가능하도록 하려는 컴포저블을 표시합니다.
3.  에디터 창에서 **분할(Split)** 또는 **디자인(Design)** 뷰로 전환합니다.
    아직 프로젝트를 빌드하지 않았다면, 처음으로 프로젝트를 빌드하라는 메시지가 표시됩니다.

IntelliJ IDEA와 Android Studio 모두에서 현재 파일에 `@Preview` 어노테이션이 달린 모든 컴포저블의 초기 레이아웃을 볼 수 있습니다.

### 핫 리로드

*핫 리로드*는 앱이 추가 입력 없이 코드 변경 사항을 즉시 반영하는 것을 의미합니다.
Compose Multiplatform에서 핫 리로드 기능은 JVM (데스크톱) 타겟에서만 사용할 수 있습니다.
하지만 이 기능을 사용하여 미세 조정을 위해 의도한 플랫폼으로 전환하기 전에 문제를 빠르게 해결할 수 있습니다.

더 자세히 알아보려면, [](compose-hot-reload.md) 문서를 참조하십시오.

## 다음 단계

다음 컴포넌트에 대한 Compose Multiplatform 구현에 대해 더 자세히 알아보세요.
*   [리소스](compose-multiplatform-resources.md)
*   [](compose-lifecycle.md)
*   [](compose-viewmodel.md)
*   [](compose-navigation-routing.md)