[//]: # (title: FAQ)

## Kotlin Multiplatform

### Kotlin Multiplatform이란 무엇인가요?

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/)(KMP)은 유연한 크로스 플랫폼 개발을 위해 JetBrains에서 개발한 오픈 소스 기술입니다. 네이티브 프로그래밍의 장점을 유지하면서 다양한 플랫폼용 애플리케이션을 제작하고, 플랫폼 간에 코드를 효율적으로 재사용할 수 있게 해줍니다. Kotlin Multiplatform을 사용하면 안드로이드(Android), iOS, 데스크톱, 웹, 서버 측 및 기타 플랫폼용 앱을 개발할 수 있습니다.

### Kotlin Multiplatform으로 UI 코드를 공유할 수 있나요?

네, Kotlin과 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 하는 JetBrains의 선언형 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)을 사용하여 UI를 공유할 수 있습니다. 이 프레임워크를 사용하면 iOS, 안드로이드, 데스크톱 및 웹과 같은 플랫폼을 위한 공통 UI 컴포넌트를 생성할 수 있어, 서로 다른 기기와 플랫폼에서 일관된 사용자 인터페이스를 유지하는 데 도움이 됩니다.

자세한 내용은 [Compose Multiplatform](#compose-multiplatform) 섹션을 참고하세요.

### Kotlin Multiplatform은 어떤 플랫폼을 지원하나요?

Kotlin Multiplatform은 안드로이드, iOS, 데스크톱, 웹, 서버 측 및 기타 플랫폼을 지원합니다. [지원되는 플랫폼](supported-platforms.md)에서 자세한 내용을 확인하세요.

### 크로스 플랫폼 앱 작업에는 어떤 IDE를 사용해야 하나요?

Kotlin Multiplatform 프로젝트 작업에는 IntelliJ IDEA 또는 Android Studio를 사용하는 것을 권장합니다.

Kotlin Multiplatform 프로젝트에서 iOS를 타겟팅하는 경우, iOS 전용 코드를 작성하고 iOS 애플리케이션을 실행하려면 머신에 [Xcode](https://developer.apple.com/xcode/)가 설치되어 있어야 합니다.

### 새로운 Kotlin Multiplatform 프로젝트는 어떻게 만드나요?

[Kotlin 멀티플랫폼 앱 만들기](get-started.topic) 튜토리얼에서 Kotlin Multiplatform 프로젝트 생성을 위한 단계별 지침을 제공합니다. 비즈니스 로직만 공유할지, 로직과 UI를 모두 공유할지 결정할 수 있습니다.

### 기존 안드로이드 애플리케이션이 있습니다. Kotlin Multiplatform으로 어떻게 마이그레이션할 수 있나요?

[안드로이드 애플리케이션을 iOS에서 동작하게 만들기](multiplatform-integrate-in-existing-app.md) 단계별 튜토리얼에서 기존 안드로이드 애플리케이션을 네이티브 UI와 함께 iOS에서 동작하게 만드는 방법을 설명합니다.

[Jetpack Compose 앱을 Kotlin Multiplatform으로 마이그레이션하기](migrate-from-android.md)는 UI를 Compose Multiplatform으로 마이그레이션하는 것을 포함하여, 복잡한 안드로이드 애플리케이션을 멀티플랫폼으로 전환하는 포괄적인 경로를 보여주는 심화 튜토리얼입니다.

### 직접 실행해 볼 수 있는 전체 예제는 어디에서 찾을 수 있나요?

여기 [실제 사례 예제 목록](multiplatform-samples.md)이 있습니다.

### 실제 Kotlin Multiplatform 애플리케이션 목록은 어디에서 볼 수 있나요? 어떤 기업들이 프로덕션에서 KMP를 사용하고 있나요?

이미 프로덕션 환경에 Kotlin Multiplatform을 도입한 다른 기업들의 사례를 [사례 연구 목록](https://kotlinlang.org/case-studies/?type=multiplatform)에서 확인해 보세요.

### 어떤 운영 체제에서 Kotlin Multiplatform 작업을 할 수 있나요?

iOS를 제외한 공유 코드 또는 플랫폼 전용 코드를 작업하는 경우, IDE가 지원하는 모든 운영 체제에서 작업할 수 있습니다.

iOS 전용 코드를 작성하고 시뮬레이터나 실제 기기에서 iOS 애플리케이션을 실행하려면 macOS가 설치된 Mac을 사용해야 합니다. 이는 Apple의 요구 사항에 따라 iOS 시뮬레이터는 macOS에서만 실행될 수 있으며, Microsoft Windows나 Linux와 같은 다른 운영 체제에서는 실행할 수 없기 때문입니다.

[권장 IDE](recommended-ides.md)에 대해 더 자세히 알아보세요.

### Kotlin Multiplatform 프로젝트에서 동시성(concurrent) 코드를 어떻게 작성하나요?

Kotlin Multiplatform 프로젝트에서도 코루틴(coroutines)과 플로우(flows)를 사용하여 비동기 코드를 작성할 수 있습니다. 이 코드를 호출하는 방법은 코드를 어디에서 호출하느냐에 따라 달라집니다. Kotlin 코드에서 서스펜딩 함수(suspending functions)와 플로우를 호출하는 방법은 특히 안드로이드의 경우 널리 문서화되어 있습니다. [Swift 코드에서 이를 호출하는 것](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers)은 약간의 추가 작업이 필요하며, 자세한 내용은 [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610)을 참고하세요.

현재 Swift에서 서스펜딩 함수와 플로우를 호출하는 가장 좋은 방법은 Swift의 `async`/`await` 또는 Combine, RxSwift와 같은 라이브러리와 함께 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines)와 같은 플러그인 및 라이브러리를 사용하는 것입니다.

현재로서는 KMP-NativeCoroutines가 더 많이 검증된 솔루션이며, `async`/`await`, Combine, RxSwift 방식의 동시성을 지원합니다. SKIE는 설정이 더 쉽고 코드가 덜 장황할 수 있습니다. 예를 들어, Kotlin `Flow`를 Swift `AsyncSequence`로 직접 매핑해 줍니다. 두 라이브러리 모두 코루틴의 적절한 취소(cancellation)를 지원합니다.

사용 방법은 [iOS와 안드로이드 간 더 많은 로직 공유하기](multiplatform-upgrade-app.md) 튜토리얼을 참고하세요.

### Kotlin/Native란 무엇이며, Kotlin Multiplatform과는 어떤 관계인가요?

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)는 가상 머신 없이 실행될 수 있는 네이티브 바이너리로 Kotlin 코드를 컴파일하는 기술입니다. 여기에는 Kotlin 컴파일러를 위한 [LLVM 기반](https://llvm.org/) 백엔드와 Kotlin 표준 라이브러리의 네이티브 구현이 포함됩니다.

Kotlin/Native는 기본적으로 임베디드 기기나 iOS와 같이 가상 머신이 바람직하지 않거나 불가능한 플랫폼을 위해 컴파일할 수 있도록 설계되었습니다. 추가 런타임이나 가상 머신이 필요 없는 독립형 프로그램을 제작해야 할 때 특히 적합합니다.

예를 들어, 모바일 애플리케이션에서 Kotlin으로 작성된 공유 코드는 Kotlin/JVM을 통해 안드로이드용 JVM 바이트코드로 컴파일되고, Kotlin/Native를 통해 iOS용 네이티브 바이너리로 컴파일됩니다. 이를 통해 두 플랫폼 모두에서 Kotlin Multiplatform과의 통합이 매끄럽게 이루어집니다.

![Kotlin/Native 및 Kotlin/JVM 바이너리](kotlin-native-and-jvm-binaries.png){width=350}

### 네이티브 플랫폼(iOS, macOS, Linux)에 대한 Kotlin Multiplatform 모듈 컴파일 속도를 어떻게 높일 수 있나요?

[Kotlin/Native 컴파일 시간 개선을 위한 팁](https://kotlinlang.org/docs/native-improving-compilation-time.html)을 확인하세요.

## Compose Multiplatform

### Compose Multiplatform이란 무엇인가요?

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)은 JetBrains에서 개발한 현대적인 선언형 및 반응형 UI 프레임워크로, 적은 양의 Kotlin 코드로 사용자 인터페이스를 구축할 수 있는 간단한 방법을 제공합니다. 또한 UI를 한 번 작성하면 지원되는 모든 플랫폼(iOS, 안드로이드, 데스크톱(Windows, macOS, Linux), 웹)에서 실행할 수 있습니다.

### 안드로이드용 Jetpack Compose와는 어떤 관계인가요?

Compose Multiplatform은 Google에서 개발한 안드로이드 UI 프레임워크인 [Jetpack Compose](https://developer.android.com/jetpack/compose)와 대부분의 API를 공유합니다. 실제로 Compose Multiplatform을 사용하여 안드로이드를 타겟팅할 때, 앱은 단순히 Jetpack Compose 위에서 실행됩니다.
Compose Multiplatform이 타겟팅하는 다른 플랫폼들은 내부 구현 세부 사항이 안드로이드의 Jetpack Compose와 다를 수 있지만, 사용자에게는 동일한 API를 제공합니다.

자세한 내용은 [프레임워크 간 상호 관계 개요](compose-multiplatform-and-jetpack-compose.md)를 참고하세요.

### 어떤 플랫폼 간에 UI를 공유할 수 있나요?

우리는 여러분이 인기 있는 플랫폼인 안드로이드, iOS, 데스크톱(Linux, macOS, Windows), 웹(Wasm 기반)의 어떤 조합 간에도 UI를 공유할 수 있기를 바랍니다. 현재 Compose Multiplatform은 안드로이드, iOS, 데스크톱에서 Stable(안정화) 단계입니다. 자세한 내용은 [지원되는 플랫폼](supported-platforms.md)을 참고하세요.

### 프로덕션에서 Compose Multiplatform을 사용할 수 있나요?

Compose Multiplatform의 안드로이드, iOS, 데스크톱 타겟은 Stable 단계입니다. 프로덕션 환경에서 사용할 수 있습니다.

WebAssembly 기반의 Compose Multiplatform for Web 버전은 Beta(베타) 단계이며, 이는 거의 완성되었음을 의미합니다. 사용할 수는 있지만 마이그레이션 이슈가 여전히 발생할 수 있습니다. iOS, 안드로이드, 데스크톱용 Compose Multiplatform과 동일한 UI를 가집니다.

### 새로운 Compose Multiplatform 프로젝트는 어떻게 만드나요?

[로직과 UI를 공유하는 Compose Multiplatform 앱 만들기](compose-multiplatform-create-first-app.md) 튜토리얼에서 안드로이드, iOS, 데스크톱용 Compose Multiplatform을 사용한 Kotlin Multiplatform 프로젝트 생성을 위한 단계별 지침을 제공합니다. Kotlin Developer Advocate인 Sebastian Aigner가 제작한 YouTube [비디오 튜토리얼](https://www.youtube.com/watch?v=5_W5YKPShZ4)도 시청하실 수 있습니다.

### Compose Multiplatform으로 앱을 빌드할 때 어떤 IDE를 사용해야 하나요?

[KMP IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform/)이 설치된 IntelliJ IDEA 또는 Android Studio IDE 사용을 권장합니다.

자세한 내용은 [권장 IDE 및 코드 에디터](recommended-ides.md)를 참고하세요.

### 데모 애플리케이션을 실행해 볼 수 있나요? 어디에서 찾을 수 있나요?

우리의 [샘플](multiplatform-samples.md)들을 직접 실행해 보실 수 있습니다.

### Compose Multiplatform에는 위젯이 포함되어 있나요?

네, Compose Multiplatform은 [Material 3](https://m3.material.io/) 위젯을 완벽하게 지원합니다.

### Material 위젯의 외관을 어느 정도까지 커스터마이징할 수 있나요?

Material의 테마 기능을 사용하여 색상, 글꼴, 패딩 등을 커스터마이징할 수 있습니다. 독특한 디자인을 만들고 싶다면 커스텀 위젯과 레이아웃을 직접 생성할 수도 있습니다.

### 기존 Kotlin Multiplatform 앱에서 UI를 공유할 수 있나요?

애플리케이션이 UI에 네이티브 API를 사용하고 있는 경우(가장 일반적인 경우), Compose Multiplatform이 상호운용성(interoperability)을 제공하므로 일부 파트를 점진적으로 Compose Multiplatform으로 다시 작성할 수 있습니다. 네이티브 UI를 Compose로 작성된 공통 UI를 감싸는 특수한 interop 뷰로 교체할 수 있습니다.

### Jetpack Compose를 사용하는 기존 안드로이드 애플리케이션이 있습니다. 다른 플랫폼으로 마이그레이션하려면 어떻게 해야 하나요?

앱 마이그레이션은 UI 마이그레이션과 로직 마이그레이션의 두 부분으로 구성됩니다. 마이그레이션의 복잡성은 애플리케이션의 복잡성과 사용하는 안드로이드 전용 라이브러리의 양에 따라 달라집니다.

복잡한 앱의 마이그레이션 예제는 [Jetpack Compose 앱을 Kotlin Multiplatform으로 마이그레이션하기](migrate-from-android.md) 가이드를 참고하세요.

대부분의 화면은 변경 없이 Compose Multiplatform으로 마이그레이션할 수 있습니다. 모든 Jetpack Compose 위젯이 지원됩니다. 그러나 일부 API는 안드로이드 타겟에서만 작동하며, 이는 안드로이드 전용이거나 아직 다른 플랫폼으로 포팅되지 않았기 때문일 수 있습니다. 예를 들어, 리소스 처리는 안드로이드 전용이므로 [Compose Multiplatform 리소스 라이브러리](compose-multiplatform-resources.md)로 마이그레이션하거나 커뮤니티 솔루션을 사용해야 합니다. 안드로이드에서만 사용 가능한 컴포넌트에 대한 자세한 내용은 현재의 [안드로이드 전용 API 목록](compose-android-only-components.md)을 참고하세요.

[비즈니스 로직을 Kotlin Multiplatform으로 마이그레이션](multiplatform-integrate-in-existing-app.md)해야 합니다. 코드를 공유 모듈로 이동하려고 할 때, 안드로이드 의존성을 사용하는 부분은 컴파일이 중단되므로 해당 부분을 다시 작성해야 합니다.

* 안드로이드 전용 의존성을 사용하는 코드를 멀티플랫폼 라이브러리를 사용하도록 다시 작성할 수 있습니다. 일부 라이브러리는 이미 Kotlin Multiplatform을 지원할 수 있으므로 변경이 필요 없을 수도 있습니다. [klibs.io](https://klibs.io/) 카탈로그나 [KMP-awesome](https://github.com/terrakok/kmp-awesome) 라이브러리 목록을 확인해 보세요.
* 또는 공통 코드와 플랫폼 전용 로직을 분리하고, 플랫폼에 따라 다르게 구현되는 [공통 인터페이스를 제공](multiplatform-connect-to-apis.md)할 수 있습니다. 안드로이드에서는 기존 기능을 사용하여 구현할 수 있고, iOS와 같은 다른 플랫폼에서는 공통 인터페이스에 대한 새로운 구현을 제공해야 합니다.

### Compose 화면을 기존 iOS 앱에 통합할 수 있나요?

네, 가능합니다. Compose Multiplatform은 다양한 통합 시나리오를 지원합니다. iOS UI 프레임워크와의 통합에 대한 자세한 내용은 [SwiftUI와 통합](compose-swiftui-integration.md) 및 [UIKit과 통합](compose-uikit-integration.md)을 참고하세요.

### UIKit 또는 SwiftUI 컴포넌트를 Compose 화면에 통합할 수 있나요?

네, 가능합니다. [SwiftUI와 통합](compose-swiftui-integration.md) 및 [UIKit과 통합](compose-uikit-integration.md)을 확인해 보세요.

<!-- Need to revise
### 모바일 OS가 업데이트되어 새로운 플랫폼 기능이 도입되면 어떻게 되나요?

Kotlin이 해당 기능을 지원하게 되면 코드베이스의 플랫폼 전용 부분에서 사용할 수 있습니다. 우리는 향후 Kotlin 버전에서 이를 지원하기 위해 최선을 다하고 있습니다. 모든 새로운 안드로이드 기능은 Kotlin 또는 Java API를 제공하며, iOS API에 대한 래퍼는 자동으로 생성됩니다.
-->

### 모바일 OS가 업데이트되어 시스템 컴포넌트의 시각적 스타일이나 동작이 변경되면 어떻게 되나요?

모든 컴포넌트가 캔버스(canvas)에 그려지기 때문에 OS 업데이트 후에도 UI는 동일하게 유지됩니다. 만약 화면에 네이티브 iOS 컴포넌트를 내장한 경우, 업데이트가 해당 컴포넌트의 외관에 영향을 줄 수 있습니다.

## 향후 계획

### Kotlin Multiplatform의 진화 계획은 무엇인가요?

JetBrains는 멀티플랫폼 개발에 최상의 경험을 제공하고 사용자들의 기존 불편함을 제거하기 위해 많은 투자를 하고 있습니다. 핵심 Kotlin Multiplatform 기술 개선, Apple 생태계와의 통합, 툴링, 그리고 Compose Multiplatform UI 프레임워크 개선에 대한 계획을 가지고 있습니다.
[Kotlin 로드맵의 멀티플랫폼 섹션](https://kotlinlang.org/docs/roadmap.html#kotlin-roadmap-by-subsystem)을 확인해 보세요.

### Compose Multiplatform은 언제 Stable이 되나요?

Compose Multiplatform은 안드로이드, iOS, 데스크톱에서 Stable 단계이며, Wasm 기반의 웹 지원은 Beta 단계입니다. 웹 플랫폼의 Stable 릴리스를 위해 노력하고 있으며, 정확한 날짜는 추후 발표될 예정입니다.

안정성 상태에 대한 자세한 내용은 [지원되는 플랫폼](supported-platforms.md)을 참고하세요.

### Kotlin 및 Compose Multiplatform의 향후 웹 타겟 지원은 어떻게 되나요?

우리는 현재 큰 잠재력을 보여주고 있는 WebAssembly(Wasm)에 리소스를 집중하고 있습니다. 새로운 [Kotlin/Wasm 백엔드](https://kotlinlang.org/docs/wasm-overview.html)와 Wasm 기반의 [Compose Multiplatform for Web](https://kotl.in/wasm-compose-example)을 실험해 보실 수 있습니다.

JS 타겟의 경우, Kotlin/JS 백엔드는 이미 Stable 상태에 도달했습니다. Compose Multiplatform에서는 리소스 제한으로 인해 포커스를 JS Canvas에서 Wasm으로 옮겼으며, Wasm이 더 유망하다고 믿고 있습니다.

또한 이전에 Compose Multiplatform for web으로 알려졌던 Compose HTML도 제공하고 있습니다. 이는 Kotlin/JS에서 DOM 작업을 위해 설계된 추가 라이브러리이며, 플랫폼 간 UI 공유를 목적으로 하지는 않습니다.

### 멀티플랫폼 개발을 위한 툴링 개선 계획이 있나요?

네, 우리는 현재 멀티플랫폼 툴링의 과제들을 잘 인지하고 있으며 여러 분야에서 개선 작업을 활발히 진행하고 있습니다.

### Swift 상호운용성(interop)을 제공할 예정인가요?

네, 현재 Kotlin 코드를 Swift로 내보내는 것에 중점을 두고 Swift와 직접적인 상호운용성을 제공하기 위한 다양한 접근 방식을 연구하고 있습니다.