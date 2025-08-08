[//]: # (title: 자주 묻는 질문)

## Kotlin Multiplatform

### Kotlin Multiplatform란 무엇인가요?

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/)(KMP)는 JetBrains가 유연한 크로스 플랫폼 개발을 위해 만든 오픈 소스 기술입니다. 이 기술을 사용하면 다양한 플랫폼용 애플리케이션을 만들고 플랫폼 간에 코드를 효율적으로 재사용하면서도 네이티브 프로그래밍의 이점을 유지할 수 있습니다. Kotlin Multiplatform를 사용하면 Android, iOS, 데스크톱, 웹, 서버 사이드 및 기타 플랫폼용 앱을 개발할 수 있습니다.

### Kotlin Multiplatform로 UI를 공유할 수 있나요?

네, Kotlin과 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 하는 JetBrains의 선언형 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)을 사용하여 UI를 공유할 수 있습니다. 이 프레임워크를 사용하면 iOS, Android, 데스크톱, 웹과 같은 플랫폼에서 공유 UI 구성 요소를 생성하여 다양한 기기와 플랫폼에서 일관된 사용자 인터페이스를 유지하는 데 도움이 됩니다.

자세한 내용은 [Compose Multiplatform](#compose-multiplatform) 섹션을 참조하세요.

### Kotlin Multiplatform는 어떤 플랫폼을 지원하나요?

Kotlin Multiplatform는 Android, iOS, 데스크톱, 웹, 서버 사이드 및 기타 플랫폼을 지원합니다. [지원되는 플랫폼](supported-platforms.md)에 대해 자세히 알아보세요.

### 크로스 플랫폼 앱 작업은 어떤 IDE에서 해야 하나요?

Kotlin Multiplatform 프로젝트 작업을 위해 Android Studio IDE를 사용하는 것을 권장합니다.
[권장 IDE 및 코드 편집기](recommended-ides.md)에서 사용 가능한 대안에 대해 자세히 알아보세요.

### 새로운 Kotlin Multiplatform 프로젝트는 어떻게 생성하나요?

[Kotlin Multiplatform 앱 생성](get-started.topic) 튜토리얼은 Kotlin Multiplatform 프로젝트를 생성하기 위한 단계별 지침을 제공합니다. 로직만 공유할지, 아니면 로직과 UI를 모두 공유할지 결정할 수 있습니다.

### 기존 Android 애플리케이션이 있습니다. Kotlin Multiplatform로 어떻게 마이그레이션할 수 있나요?

[Android 애플리케이션을 iOS에서 작동하도록 만들기](multiplatform-integrate-in-existing-app.md) 단계별 튜토리얼은 네이티브 UI를 사용하여 Android 애플리케이션이 iOS에서 작동하도록 하는 방법을 설명합니다.
Compose Multiplatform로 UI를 공유하고 싶다면 [해당 답변](#i-have-an-existing-android-application-that-uses-jetpack-compose-what-should-i-do-to-migrate-it-to-other-platforms)을 참조하세요.

### 가지고 놀 수 있는 완전한 예제는 어디서 얻을 수 있나요?

여기 [실제 예제 목록](multiplatform-samples.md)이 있습니다.

### 실제 Kotlin Multiplatform 애플리케이션 목록은 어디서 찾을 수 있나요? 어떤 회사들이 프로덕션 환경에서 KMP를 사용하고 있나요?

프로덕션 환경에서 Kotlin Multiplatform를 이미 채택한 다른 회사들로부터 배우려면 [사례 연구 목록](case-studies.topic)을 확인하세요.

### 어떤 운영 체제에서 Kotlin Multiplatform와 함께 작업할 수 있나요?

iOS를 제외하고 공유 코드 또는 플랫폼별 코드 작업을 하는 경우, IDE에서 지원하는 모든 운영 체제에서 작업할 수 있습니다.

[권장 IDE](recommended-ides.md)에 대해 자세히 알아보세요.

iOS 관련 코드를 작성하고 시뮬레이터 또는 실제 기기에서 iOS 애플리케이션을 실행하려면 macOS가 설치된 Mac을 사용하세요. 이는 Apple의 요구 사항에 따라 iOS 시뮬레이터는 macOS에서만 실행될 수 있으며, Microsoft Windows 또는 Linux와 같은 다른 운영 체제에서는 실행될 수 없기 때문입니다.

### Kotlin Multiplatform 프로젝트에서 동시성 코드를 어떻게 작성할 수 있나요?

Kotlin Multiplatform 프로젝트에서 여전히 코루틴(coroutines)과 플로우(flows)를 사용하여 비동기 코드를 작성할 수 있습니다. 이 코드를 호출하는 방식은 코드를 어디에서 호출하는지에 따라 달라집니다. Kotlin 코드에서 중단 함수(suspending functions)와 플로우(flows)를 호출하는 것은 특히 Android의 경우 광범위하게 문서화되어 있습니다. [Swift 코드에서 호출](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers)하려면 약간의 추가 작업이 필요하며, 자세한 내용은 [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610)을 참조하세요.

<!-- when adding SKIE back to the tutorial, add it here as well
and uncomment the paragraph below --> 

Swift에서 중단 함수(suspending functions)와 플로우(flows)를 호출하는 현재 가장 좋은 접근 방식은 Swift의 `async`/`await` 또는 Combine 및 RxSwift와 같은 라이브러리와 함께 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines)와 같은 플러그인 및 라이브러리를 사용하는 것입니다.

<!-- At the moment, KMP-NativeCoroutines is the more
tried-and-tested solution, and it supports `async`/`await`, Combine, and RxSwift approaches to concurrency. SKIE is easier
to set up and less verbose. For instance, it maps Kotlin `Flow` to Swift `AsyncSequence` directly. Both of these libraries
support the proper cancellation of coroutines. -->

사용 방법을 알아보려면 [](multiplatform-upgrade-app.md)을 참조하세요.

### Kotlin/Native란 무엇이며, Kotlin Multiplatform와 어떤 관계가 있나요?

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)는 Kotlin 코드를 가상 머신 없이 실행할 수 있는 네이티브 바이너리로 컴파일하는 기술입니다. 여기에는 Kotlin 컴파일러를 위한 [LLVM 기반](https://llvm.org/) 백엔드와 Kotlin 표준 라이브러리의 네이티브 구현이 포함됩니다.

Kotlin/Native는 주로 임베디드 기기 및 iOS와 같이 가상 머신이 바람직하지 않거나 불가능한 플랫폼을 위한 컴파일을 허용하도록 설계되었습니다. 추가 런타임이나 가상 머신이 필요 없는 독립 실행형 프로그램을 생성해야 할 때 특히 적합합니다.

예를 들어, 모바일 애플리케이션에서 Kotlin으로 작성된 공유 코드는 Android의 경우 Kotlin/JVM으로 JVM 바이트코드로 컴파일되고, iOS의 경우 Kotlin/Native로 네이티브 바이너리로 컴파일됩니다. 이를 통해 두 플랫폼 모두에서 Kotlin Multiplatform와의 통합이 원활해집니다.

![Kotlin/Native and Kotlin/JVM binaries](kotlin-native-and-jvm-binaries.png){width=350}

### 네이티브 플랫폼(iOS, macOS, Linux)용 Kotlin Multiplatform 모듈 컴파일 속도를 어떻게 높일 수 있나요?

[Kotlin/Native 컴파일 시간 개선 팁](https://kotlinlang.org/docs/native-improving-compilation-time.html)을 참조하세요.

## Compose Multiplatform

### Compose Multiplatform란 무엇인가요?

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)은 JetBrains가 개발한 현대적인 선언형 및 반응형 UI 프레임워크로, 적은 양의 Kotlin 코드로 사용자 인터페이스를 쉽게 구축할 수 있도록 합니다. 또한 UI를 한 번 작성하여 지원되는 모든 플랫폼(iOS, Android, 데스크톱(Windows, macOS, Linux) 및 웹)에서 실행할 수 있습니다.

### Jetpack Compose for Android와 어떤 관계가 있나요?

Compose Multiplatform는 Google이 개발한 Android UI 프레임워크인 [Jetpack Compose](https://developer.android.com/jetpack/compose)와 대부분의 API를 공유합니다. 실제로 Compose Multiplatform를 사용하여 Android를 타겟팅할 때 앱은 단순히 Jetpack Compose에서 실행됩니다.
Compose Multiplatform가 타겟팅하는 다른 플랫폼은 Android의 Jetpack Compose와 다른 내부 구현 세부 정보를 가질 수 있지만, 여전히 동일한 API를 제공합니다.

자세한 내용은 [프레임워크 상호 관계 개요](compose-multiplatform-and-jetpack-compose.md)를 참조하세요.

### 어떤 플랫폼 간에 UI를 공유할 수 있나요?

저희는 여러분이 Android, iOS, 데스크톱(Linux, macOS, Windows) 및 웹(Wasm 기반)과 같은 인기 있는 플랫폼들의 어떤 조합에서든 UI를 공유할 수 있는 옵션을 갖기를 바랍니다. 현재 Compose Multiplatform는 Android, iOS, 데스크톱에서만 Stable 상태입니다. 자세한 내용은 [지원되는 플랫폼](supported-platforms.md)을 참조하세요.

### Compose Multiplatform를 프로덕션 환경에서 사용할 수 있나요?

Compose Multiplatform의 Android, iOS, 데스크톱 타겟은 Stable 상태입니다. 프로덕션 환경에서 사용할 수 있습니다.

WebAssembly 기반의 웹용 Compose Multiplatform 버전은 알파(Alpha) 상태이며, 이는 현재 활발히 개발 중임을 의미합니다. 주의해서 사용해야 하며 마이그레이션 문제가 발생할 수 있습니다.
iOS, Android, 데스크톱용 Compose Multiplatform와 동일한 UI를 가집니다.

### 새로운 Compose Multiplatform 프로젝트는 어떻게 생성하나요?

[공유 로직과 UI를 사용하는 Compose Multiplatform 앱 생성](compose-multiplatform-create-first-app.md) 튜토리얼은 Android, iOS, 데스크톱용 Compose Multiplatform를 사용하여 Kotlin Multiplatform 프로젝트를 생성하기 위한 단계별 지침을 제공합니다.
Kotlin 개발자 옹호자인 Sebastian Aigner가 만든 [비디오 튜토리얼](https://www.youtube.com/watch?v=5_W5YKPShZ4)도 YouTube에서 시청할 수 있습니다.

### Compose Multiplatform로 앱을 빌드하는 데 어떤 IDE를 사용해야 하나요?

Android Studio IDE를 사용하는 것을 권장합니다. 자세한 내용은 [권장 IDE 및 코드 편집기](recommended-ides.md)를 참조하세요.

### 데모 애플리케이션을 사용해 볼 수 있나요? 어디서 찾을 수 있나요?

저희 [샘플](multiplatform-samples.md)을 가지고 사용해 볼 수 있습니다.

### Compose Multiplatform에는 위젯이 포함되어 있나요?

네, Compose Multiplatform는 [Material 3](https://m3.material.io/) 위젯을 완벽하게 지원합니다.

### Material 위젯의 모양을 어느 정도까지 사용자 정의할 수 있나요?

Material의 테마 기능을 사용하여 색상, 글꼴 및 패딩을 사용자 정의할 수 있습니다. 고유한 디자인을 만들고 싶다면 사용자 정의 위젯과 레이아웃을 생성할 수 있습니다.

### 기존 Kotlin Multiplatform 앱에서 UI를 공유할 수 있나요?

애플리케이션이 UI에 네이티브 API를 사용하는 경우(가장 일반적인 경우), Compose Multiplatform가 이에 대한 상호 운용성을 제공하므로 점진적으로 일부를 Compose Multiplatform로 다시 작성할 수 있습니다. Compose로 작성된 공통 UI를 래핑하는 특수 상호 운용 뷰(interop view)로 네이티브 UI를 대체할 수 있습니다.

### Jetpack Compose를 사용하는 기존 Android 애플리케이션이 있습니다. 다른 플랫폼으로 마이그레이션하려면 어떻게 해야 하나요?

앱 마이그레이션은 UI 마이그레이션과 로직 마이그레이션의 두 부분으로 구성됩니다. 마이그레이션의 복잡성은 애플리케이션의 복잡성과 사용 중인 Android 전용 라이브러리의 양에 따라 달라집니다.
대부분의 화면을 변경 없이 Compose Multiplatform로 마이그레이션할 수 있습니다. 모든 Jetpack Compose 위젯이 지원됩니다. 그러나 일부 API는 Android 타겟에서만 작동합니다. 이는 Android 전용이거나 아직 다른 플랫폼으로 포팅되지 않았을 수 있습니다. 예를 들어, 리소스 핸들링은 Android 전용이므로 [Compose Multiplatform 리소스 라이브러리](compose-multiplatform-resources.md)로 마이그레이션하거나 커뮤니티 솔루션을 사용해야 합니다. Android [내비게이션 라이브러리](https://developer.android.com/jetpack/androidx/releases/navigation) 또한 Android 전용이지만, [커뮤니티 대안](compose-navigation-routing.md)이 제공됩니다. Android에서만 사용 가능한 구성 요소에 대한 자세한 내용은 현재 [Android 전용 API 목록](compose-android-only-components.md)을 참조하세요.

비즈니스 로직을 [Kotlin Multiplatform로 마이그레이션](multiplatform-integrate-in-existing-app.md)해야 합니다. 코드를 공유 모듈로 옮기려고 하면 Android 종속성을 사용하는 부분이 컴파일되지 않으므로 다시 작성해야 합니다.

*   Android 전용 종속성을 사용하는 코드를 대신 멀티플랫폼 라이브러리를 사용하도록 다시 작성할 수 있습니다. 일부 라이브러리는 이미 Kotlin Multiplatform를 지원하므로 변경할 필요가 없습니다. [KMP-awesome](https://github.com/terrakok/kmp-awesome) 라이브러리 목록을 확인할 수 있습니다.
*   또는 공통 코드를 플랫폼별 로직과 분리하고 플랫폼에 따라 다르게 구현되는 [공통 인터페이스를 제공](multiplatform-connect-to-apis.md)할 수 있습니다. Android에서는 기존 기능을 사용할 수 있으며, iOS와 같은 다른 플랫폼에서는 공통 인터페이스에 대한 새로운 구현을 제공해야 합니다.

### 기존 iOS 앱에 Compose 화면을 통합할 수 있나요?

네. Compose Multiplatform는 다양한 통합 시나리오를 지원합니다. iOS UI 프레임워크와의 통합에 대한 자세한 내용은 [SwiftUI와의 통합](compose-swiftui-integration.md) 및 [UIKit과의 통합](compose-uikit-integration.md)을 참조하세요.

### UIKit 또는 SwiftUI 구성 요소를 Compose 화면에 통합할 수 있나요?

네, 가능합니다. [SwiftUI와의 통합](compose-swiftui-integration.md) 및 [UIKit과의 통합](compose-uikit-integration.md)을 참조하세요.

<!-- Need to revise
### What happens when my mobile OS updates and introduces new platform capabilities?

You can use them in platform-specific parts of your codebase once Kotlin supports them. We do our best to support them
in the upcoming Kotlin version. All new Android capabilities provide Kotlin or Java APIs, and wrappers over iOS APIs are
generated automatically.
-->

### 모바일 OS가 업데이트되어 새로운 플랫폼 기능 또는 시각적 스타일/동작이 변경되면 어떻게 되나요?

모든 구성 요소가 캔버스에 그려지기 때문에 OS 업데이트 후에도 UI는 동일하게 유지됩니다. 네이티브 iOS 구성 요소를 화면에 포함하는 경우, 업데이트가 해당 구성 요소의 외관에 영향을 미칠 수 있습니다.

## 향후 계획

### Kotlin Multiplatform의 진화 계획은 무엇인가요?

JetBrains는 멀티플랫폼 개발에 최고의 경험을 제공하고 멀티플랫폼 사용자의 기존 어려움을 해소하기 위해 많은 투자를 하고 있습니다. 핵심 Kotlin Multiplatform 기술, Apple 생태계와의 통합, 도구, 그리고 Compose Multiplatform UI 프레임워크를 개선할 계획을 가지고 있습니다. [저희 로드맵](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)을 확인하세요.

### Compose Multiplatform는 언제 Stable 상태가 되나요?

Compose Multiplatform는 Android, iOS, 데스크톱에서 Stable 상태이며, 웹 플랫폼 지원은 알파(Alpha) 상태입니다. 정확한 날짜는 추후 발표될 예정이며, 웹 플랫폼의 Stable 릴리스를 위해 노력하고 있습니다.

안정성 상태에 대한 자세한 내용은 [지원되는 플랫폼](supported-platforms.md)을 참조하세요.

### Kotlin 및 Compose Multiplatform의 웹 타겟 지원 계획은 어떻게 되나요?

현재 큰 잠재력을 보이는 WebAssembly(Wasm)에 자원을 집중하고 있습니다. 저희의 새로운 [Kotlin/Wasm 백엔드](https://kotlinlang.org/docs/wasm-overview.html)와 Wasm 기반의 [웹용 Compose Multiplatform](https://kotl.in/wasm-compose-example)를 사용해 볼 수 있습니다.

JS 타겟의 경우, Kotlin/JS 백엔드는 이미 Stable 상태에 도달했습니다. Compose Multiplatform에서는 리소스 제약으로 인해 JS Canvas에서 Wasm으로 초점을 전환했습니다. Wasm이 더 큰 가능성을 가지고 있다고 생각합니다.

또한 이전에는 웹용 Compose Multiplatform로 알려졌던 Compose HTML을 제공합니다. 이는 Kotlin/JS에서 DOM 작업을 위해 설계된 추가 라이브러리이며, 플랫폼 간에 UI를 공유하기 위한 용도는 아닙니다.

### 멀티플랫폼 개발을 위한 도구 개선 계획이 있나요?

네, 멀티플랫폼 도구와 관련된 현재의 어려움을 충분히 인지하고 있으며 여러 분야에서 개선 작업을 적극적으로 진행하고 있습니다.

### Swift 상호 운용성을 제공할 예정인가요?

네. Kotlin 코드를 Swift로 내보내는 데 중점을 두고 Swift와의 직접적인 상호 운용성을 제공하기 위한 다양한 접근 방식을 현재 조사하고 있습니다.