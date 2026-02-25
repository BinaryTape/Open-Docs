[//]: # (title: 플랫폼별 기본 UI 동작)

Compose Multiplatform은 서로 다른 플랫폼에서 가능한 한 동일하게 동작하는 앱을 제작할 수 있도록 돕는 것을 목표로 합니다.
이 페이지에서는 Compose Multiplatform으로 여러 플랫폼을 위한 공통 UI 코드를 작성할 때 예상되는,
피할 수 없는 차이점이나 일시적인 절충안에 대해 알아볼 수 있습니다.

## 프로젝트 구조

타겟팅하는 플랫폼에 관계없이, 각 플랫폼에는 전용 엔트리 포인트(entry point)가 필요합니다:

* Android의 경우, 공통 코드의 메인 컴포저블(composable)을 보여주는 역할을 하는 `Activity`가 그 역할을 합니다.
* iOS 앱의 경우, 앱을 초기화하는 `@main` 클래스 또는 구조체입니다.
* JVM 앱의 경우, 애플리케이션을 시작하고 메인 공통 컴포저블을 실행하는 `main()` 함수입니다.
* Kotlin/JS 또는 Kotlin/Wasm 앱의 경우, 메인 공통 코드 컴포저블을 웹 페이지에 연결하는 `main()` 함수입니다.

앱에 필요한 특정 플랫폼 전용 API가 멀티플랫폼 지원을 제공하지 않을 수 있으며, 이 경우 플랫폼별 소스 세트(source set)에서 이러한 API를 호출하도록 구현해야 합니다.
직접 구현하기 전에, 모든 사용 가능한 Kotlin 멀티플랫폼 라이브러리를 종합적으로 카탈로그화하는 것을 목표로 하는 JetBrains 프로젝트인 [klibs.io](https://klibs.io/)를 확인해 보세요.
네트워크 코드, 데이터베이스, 코루틴 등을 위한 라이브러리가 이미 준비되어 있습니다.

## 입력 방식

### 소프트웨어 키보드

각 플랫폼은 텍스트 필드가 활성화될 때 키보드가 나타나는 방식을 포함하여 소프트웨어 키보드를 약간씩 다르게 처리할 수 있습니다.

Compose Multiplatform은 [Compose 윈도우 인셋(window insets) 방식](https://developer.android.com/develop/ui/compose/system/insets)을 채택하고 있으며, [세이프 영역(safe areas)](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)을 고려하기 위해 iOS에서도 이를 모방합니다.
구현 방식에 따라 iOS에서 소프트웨어 키보드의 위치가 약간 다를 수 있습니다.
두 플랫폼 모두에서 키보드가 중요한 UI 요소를 가리지 않는지 확인하십시오.

### 터치 및 마우스 지원

현재 데스크톱 구현은 모든 포인터 조작을 마우스 제스처로 해석하므로 멀티터치 제스처를 지원하지 않습니다.
예를 들어, 일반적인 핀치 투 줌(pinch-to-zoom) 제스처는 두 개의 터치를 동시에 처리해야 하므로 데스크톱용 Compose Multiplatform으로는 구현할 수 없습니다.

## UI 동작 및 외형

### 플랫폼 전용 기능

일부 공통 UI 요소는 Compose Multiplatform에서 다루지 않으며 프레임워크를 사용하여 커스텀할 수 없습니다.
따라서 플랫폼마다 다르게 보일 수 있음을 예상해야 합니다.

네이티브 팝업 뷰가 그 예입니다. Compose Multiplatform 텍스트 필드에서 텍스트를 선택할 때, **복사(Copy)** 또는 **번역(Translate)**과 같은 기본 권장 작업은 앱이 실행 중인 플랫폼에 따라 다르게 나타납니다.

### 스크롤 물리 효과

Android 및 iOS의 경우, 스크롤의 느낌이 해당 플랫폼에 맞춰져 있습니다.
데스크톱의 경우, 스크롤 지원은 마우스 휠로 제한됩니다 ([터치 및 마우스 지원](#touch-and-mouse-support)에서 언급된 바와 같습니다).

### 인터롭 뷰 (Interop views)

공통 컴포저블 내에 네이티브 뷰를 삽입하거나 그 반대의 작업을 수행하려면, Compose Multiplatform에서 지원하는 플랫폼별 메커니즘을 숙지해야 합니다.

iOS의 경우, [SwiftUI](compose-swiftui-integration.md) 및 [UIKit](compose-uikit-integration.md)과의 인터롭 코드를 위한 별도의 가이드가 있습니다.

데스크톱의 경우, Compose Multiplatform은 [Swing 상호 운용성](compose-desktop-swing-interoperability.md)을 지원합니다.

### 뒤로 가기 제스처

Android 기기는 기본적으로 뒤로 가기 제스처를 지원하며, 모든 화면은 어떤 방식으로든 **뒤로 가기** 버튼에 반응합니다.

iOS에는 기본적으로 뒤로 가기 제스처가 없지만, 개발자는 사용자 경험 기대치를 충족하기 위해 유사한 기능을 구현하도록 권장됩니다.
iOS용 Compose Multiplatform은 Android 기능을 모방하기 위해 기본적으로 뒤로 가기 제스처를 지원합니다.

데스크톱에서 Compose Multiplatform은 **Esc** 키를 기본 뒤로 가기 트리거로 사용합니다.

자세한 내용은 [이 섹션](compose-navigation.md#back-gesture)을 참조하십시오.

### 텍스트

텍스트의 경우, Compose Multiplatform은 서로 다른 플랫폼 간의 픽셀 단위 일치를 보장하지 않습니다.

* 글꼴을 명시적으로 설정하지 않으면, 각 시스템은 텍스트에 서로 다른 기본 글꼴을 할당합니다.
* 동일한 글꼴이라 하더라도 각 플랫폼 고유의 글자 앤티앨리어싱(aliasing) 메커니즘으로 인해 눈에 띄는 차이가 발생할 수 있습니다.

이는 사용자 경험에 큰 영향을 미치지는 않습니다. 오히려 각 플랫폼에서 예상되는 대로 기본 글꼴이 나타납니다.
그러나 픽셀 차이로 인해 스크린샷 테스트 등에서 문제가 발생할 수 있습니다.

<!-- this should be covered in benchmarking, not as a baseline Compose Multiplatform limitation 
### Initial performance

On iOS, you may notice a delay in the initial performance of individual screens compared to Android.
This can happen because Compose Multiplatform compiles UI shaders on demand.
So, if a particular shader is not cached yet, compiling it may delay rendering of a scene.

This issue affects only the first launch of each screen.
Once all necessary shaders are cached, subsequent launches are not delayed by compilation.
-->

## 개발자 경험

### 프리뷰 (Previews)

*프리뷰(Previews)*는 IntelliJ IDEA 및 Android Studio에서 공유 UI 코드와 함께 렌더링될 수 있는, `@Preview` 어노테이션이 달린 컴포저블의 레이아웃 프레젠테이션입니다.

프리뷰를 사용하려면 명시적인 의존성이 포함된 특정 프로젝트 구성이 필요합니다.
프로젝트에서 프리뷰를 활성화하는 방법은 [Compose UI 프리뷰](compose-previews.md)를 참조하십시오.

### 핫 리로드 (Hot reload)

*핫 리로드(Hot reload)*는 추가 입력 없이 코드 변경 사항을 즉시 앱에 반영하는 기능을 말합니다.
Compose Multiplatform에서 핫 리로드 기능은 JVM(데스크톱) 타겟에서만 사용할 수 있습니다.
하지만 이를 사용하여 의도한 플랫폼으로 전환하여 미세 조정을 하기 전에 문제를 빠르게 해결하는 데 활용할 수 있습니다.

자세한 내용은 [Compose 핫 리로드](compose-hot-reload.md) 문서를 참조하십시오.

## 다음 단계

다음 구성 요소에 대한 Compose Multiplatform 구현에 대해 자세히 알아보세요:
  * [리소스 (Resources)](compose-multiplatform-resources.md)
  * [수명 주기 (Lifecycle)](compose-lifecycle.md)
  * [공통 ViewModel (Common ViewModel)](compose-viewmodel.md)
  * [내비게이션 및 라우팅 (Navigation and routing)](compose-navigation-routing.md)