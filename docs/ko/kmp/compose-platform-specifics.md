[//]: # (title: 다양한 플랫폼에서의 기본 UI 동작)

컴포즈 멀티플랫폼은 다양한 플랫폼에서 최대한 유사하게 동작하는 앱을 제작할 수 있도록 돕는 것을 목표로 합니다.
이 페이지에서는 컴포즈 멀티플랫폼을 사용하여 다양한 플랫폼을 위한 공유 UI 코드를 작성할 때 예상해야 할
피할 수 없는 차이점이나 일시적인 절충안에 대해 알아볼 수 있습니다.

## 프로젝트 구조

타겟팅하는 플랫폼에 관계없이 각 플랫폼에는 전용 진입점이 필요합니다:

*   Android의 경우, `Activity`는 공통 코드에서 메인 컴포저블을 표시하는 역할을 합니다.
*   iOS 앱의 경우, 앱을 초기화하는 `@main` 클래스 또는 구조체입니다.
*   JVM 앱의 경우, 메인 공통 컴포저블을 시작하는 애플리케이션을 실행하는 `main()` 함수입니다.
*   Kotlin/JS 또는 Kotlin/Wasm 앱의 경우, 메인 공통 코드 컴포저블을 웹 페이지에 연결하는 `main()` 함수입니다.

앱에 필요한 특정 플랫폼별 API는 멀티플랫폼을 지원하지 않을 수 있으며,
이러한 API 호출을 플랫폼별 소스 세트에서 구현해야 할 수도 있습니다.
그 전에, JetBrains 프로젝트인 [klibs.io](https://klibs.io/)를 확인하십시오. 이 프로젝트는 사용 가능한 모든 Kotlin Multiplatform 라이브러리를
포괄적으로 카탈로그화하는 것을 목표로 합니다.
네트워크 코드, 데이터베이스, 코루틴 등을 위한 라이브러리가 이미 많이 있습니다.

## 입력 방식

### 소프트웨어 키보드

각 플랫폼은 텍스트 필드가 활성화될 때 키보드가 나타나는 방식을 포함하여 소프트웨어 키보드를 약간 다르게 처리할 수 있습니다.

컴포즈 멀티플랫폼은 [컴포즈 창 인셋 방식 (Compose window insets approach)](https://developer.android.com/develop/ui/compose/system/insets)을 채택하고
iOS에서는 [안전 영역 (safe areas)](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)을 고려하여 이를 모방합니다.
구현 방식에 따라 소프트웨어 키보드가 iOS에서 약간 다르게 배치될 수 있습니다.
키보드가 두 플랫폼에서 중요한 UI 요소를 가리지 않는지 확인하십시오.

컴포즈 멀티플랫폼은 현재 기본 IME 액션 변경을 지원하지 않습니다. 예를 들어,
일반적인 `&crarr;` 아이콘 대신 돋보기나 체크 표시를 표시하는 것을 지원하지 않습니다.

### 터치 및 마우스 지원

현재 데스크톱 구현은 모든 포인터 조작을 마우스 제스처로 해석하므로
멀티터치 제스처를 지원하지 않습니다.
예를 들어, 두 번의 터치 처리가 필요한 일반적인 핀치 투 줌 제스처는
데스크톱용 컴포즈 멀티플랫폼으로는 구현할 수 없습니다.

## UI 동작 및 모양

### 플랫폼별 기능

일부 공통 UI 요소는 컴포즈 멀티플랫폼에서 다루지 않으며 프레임워크를 사용하여 사용자 정의할 수 없습니다.
따라서, 이들은 플랫폼마다 다르게 보일 수 있습니다.

네이티브 팝업 뷰가 그 예시입니다:
컴포즈 멀티플랫폼 텍스트 필드에서 텍스트를 선택하면 **복사 (Copy)** 또는 **번역 (Translate)**과 같은 기본 추천 작업은
앱이 실행되는 플랫폼에 따라 달라집니다.

### 스크롤 물리

Android와 iOS의 경우, 스크롤 느낌은 플랫폼과 일치합니다.
데스크톱의 경우, 스크롤 지원은 마우스 휠로 제한됩니다 ([터치 및 마우스 지원](#touch-and-mouse-support)에서 언급했듯이).

### 상호 운용 뷰

공통 컴포저블 내에 네이티브 뷰를 삽입하거나 그 반대의 경우,
컴포즈 멀티플랫폼이 지원하는 플랫폼별 메커니즘에 익숙해져야 합니다.

iOS의 경우, [SwiftUI](compose-swiftui-integration.md) 및 [UIKit](compose-uikit-integration.md)과의 상호 운용 코드에 대한 별도의 가이드가 있습니다.

데스크톱의 경우, 컴포즈 멀티플랫폼은 [Swing 상호 운용성](compose-desktop-swing-interoperability.md)을 지원합니다.

### 뒤로 가기 제스처

Android 장치는 기본적으로 뒤로 가기 제스처를 지원하며, 모든 화면은 어떤 식으로든 **뒤로 가기** 버튼에 반응합니다.

iOS에는 기본적으로 뒤로 가기 제스처가 없지만, 개발자는 사용자 경험 기대치를 충족하기 위해 유사한 기능을 구현하는 것이 좋습니다.
iOS용 컴포즈 멀티플랫폼은 Android 기능을 모방하기 위해 기본적으로 뒤로 가기 제스처를 지원합니다.

데스크톱의 경우, 컴포즈 멀티플랫폼은 **Esc** 키를 기본 뒤로 가기 트리거로 사용합니다.

자세한 내용은 [여기](compose-navigation.md#back-gesture)를 참조하십시오.

### 텍스트

텍스트의 경우, 컴포즈 멀티플랫폼은 서로 다른 플랫폼 간의 픽셀 단위 일치를 보장하지 않습니다:

*   명시적으로 폰트를 설정하지 않으면, 각 시스템은 텍스트에 다른 기본 폰트를 할당합니다.
*   동일한 폰트라도 각 플랫폼에 특정한 글자 앤티앨리어싱 메커니즘으로 인해 눈에 띄는 차이가 발생할 수 있습니다.

이는 사용자 경험에 큰 영향을 미치지 않습니다. 오히려 기본 폰트는 각 플랫폼에서 예상대로 나타납니다.
그러나 픽셀 차이는 예를 들어 스크린샷 테스트에 방해가 될 수 있습니다.

<!-- this should be covered in benchmarking, not as a baseline Compose Multiplatform limitation
### Initial performance

On iOS, you may notice a delay in the initial performance of individual screens compared to Android.
This can happen because Compose Multiplatform compiles UI shaders on demand.
So, if a particular shader is not cached yet, compiling it may delay rendering of a scene.

This issue affects only the first launch of each screen.
Once all necessary shaders are cached, subsequent launches are not delayed by compilation.
-->

## 개발자 경험

### 프리뷰

_프리뷰 (Previews)_는 IDE에서 컴포저블의 상호 작용할 수 없는 레이아웃 프리젠테이션입니다.

컴포저블의 프리뷰를 보려면:

1.  프로젝트에 Android 타겟이 없다면 추가합니다 (프리뷰 메커니즘은 Android 라이브러리를 사용합니다).
2.  공통 코드에서 프리뷰 가능하게 만들 컴포저블에 `@Preview` 어노테이션을 표시합니다.
3.  에디터 창에서 **분할 (Split)** 또는 **디자인 (Design)** 뷰로 전환합니다.
    아직 빌드하지 않았다면 프로젝트를 처음 빌드하라는 메시지가 표시됩니다.

IntelliJ IDEA와 Android Studio 모두에서 현재 파일에 `@Preview` 어노테이션이 지정된 모든 컴포저블의 초기 레이아웃을 볼 수 있습니다.

### 핫 리로드

_핫 리로드 (Hot reload)_는 추가 입력 없이 앱이 즉석에서 코드 변경 사항을 반영하는 것을 의미합니다.
컴포즈 멀티플랫폼에서는 핫 리로드 기능이 JVM (데스크톱) 타겟에서만 사용할 수 있습니다.
그러나 의도한 플랫폼으로 전환하여 미세 조정하기 전에 문제를 빠르게 해결하는 데 사용할 수 있습니다.

자세한 내용은 [컴포즈 핫 리로드](compose-hot-reload.md) 문서를 참조하십시오.

## 다음 단계

다음 구성 요소에 대한 컴포즈 멀티플랫폼 구현에 대해 자세히 알아보십시오:
*   [리소스](compose-multiplatform-resources.md)
*   [라이프사이클](compose-lifecycle.md)
*   [공통 뷰모델](compose-viewmodel.md)
*   [내비게이션 및 라우팅](compose-navigation-routing.md)