[//]: # (title: Kotlin/Wasm)

<primary-label ref="beta"/> 

Kotlin/Wasm은 Kotlin 코드를 [WebAssembly (Wasm)](https://webassembly.org/) 형식으로 컴파일할 수 있는 기능을 제공합니다. 
Kotlin/Wasm을 사용하면 Wasm을 지원하고 Kotlin의 요구 사항을 충족하는 다양한 환경 및 장치에서 실행되는 애플리케이션을 만들 수 있습니다.

Wasm은 스택 기반 가상 머신(stack-based virtual machine)을 위한 바이너리 명령어 형식입니다. 이 형식은 자체 가상 머신에서 실행되므로 플랫폼에 독립적입니다. Wasm은 Kotlin 및 기타 언어에 컴파일 대상(compilation target)을 제공합니다. 

Kotlin/Wasm은 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)으로 빌드된 웹 애플리케이션 개발을 위한 브라우저나, 브라우저 외부의 독립형 Wasm 가상 머신과 같은 다양한 대상 환경에서 사용할 수 있습니다. 브라우저 외부 환경의 경우, [WebAssembly System Interface (WASI)](https://wasi.dev/)를 통해 플랫폼 API에 접근할 수 있으며 이를 활용할 수도 있습니다.

> Kotlin/Wasm으로 빌드된 애플리케이션을 브라우저에서 실행하려면, WebAssembly의 가비지 컬렉션(garbage collection) 및 레거시 예외 처리 제안(legacy exception handling proposals)을 지원하는 [브라우저 버전](wasm-configuration.md#browser-versions)이 필요합니다. 브라우저 지원 상태를 확인하려면 [WebAssembly 로드맵](https://webassembly.org/roadmap/)을 참고하세요.
>
{style="tip"}

## Kotlin/Wasm 및 Compose Multiplatform

Kotlin을 사용하면 Compose Multiplatform 및 Kotlin/Wasm을 통해 웹 프로젝트에서 모바일 및 데스크톱 사용자 인터페이스(UI)를 빌드하고 재사용할 수 있습니다.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)은 Kotlin 및 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 하는 선언형 프레임워크(declarative framework)로, UI를 한 번만 구현하면 타겟팅하는 모든 플랫폼에서 공유할 수 있습니다. 

웹 플랫폼의 경우, Compose Multiplatform은 Kotlin/Wasm을 컴파일 대상으로 사용합니다. Kotlin/Wasm 및 Compose Multiplatform으로 빌드된 애플리케이션은 `wasm-js` 대상을 사용하며 브라우저에서 실행됩니다.

또한, 가장 인기 있는 Kotlin 라이브러리들을 Kotlin/Wasm에서 즉시 사용할 수 있습니다. 다른 Kotlin 및 멀티플랫폼 프로젝트와 마찬가지로 빌드 스크립트에 의존성 선언을 포함할 수 있습니다. 자세한 내용은 [멀티플랫폼 라이브러리에 의존성 추가하기](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)를 참고하세요.

직접 시도해 보시겠습니까?

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="Get started with Kotlin/Wasm" style="block"/></a>

## Kotlin/Wasm 및 WASI

Kotlin/Wasm은 서버 측 애플리케이션을 위해 [WebAssembly System Interface (WASI)](https://wasi.dev/)를 사용합니다. Kotlin/Wasm 및 WASI로 빌드된 애플리케이션은 Wasm-WASI 대상을 사용하므로, WASI API를 호출하고 브라우저 환경 밖에서 애플리케이션을 실행할 수 있습니다.

Kotlin/Wasm은 WASI를 활용하여 플랫폼 고유의 상세 정보를 추상화함으로써, 동일한 Kotlin 코드가 다양한 플랫폼에서 실행될 수 있도록 합니다. 이를 통해 각 런타임에 대한 별도의 처리 없이도 Kotlin/Wasm의 도달 범위를 웹 애플리케이션 너머로 확장할 수 있습니다.

WASI는 WebAssembly로 컴파일된 Kotlin 애플리케이션을 다양한 환경에서 실행하기 위한 안전한 표준 인터페이스를 제공합니다.

> Kotlin/Wasm 및 WASI가 실제로 작동하는 모습을 보려면 [Kotlin/Wasm 및 WASI 시작하기 튜토리얼](wasm-wasi.md)을 확인하세요.
>
{style="tip"}

## Kotlin/Wasm 성능

Kotlin/Wasm은 아직 베타(Beta) 단계이지만, Kotlin/Wasm에서 실행되는 Compose Multiplatform은 이미 고무적인 성능 특성을 보여주고 있습니다. 실행 속도가 JavaScript를 능가하며 JVM의 속도에 근접하고 있음을 확인할 수 있습니다.

![Kotlin/Wasm performance](wasm-performance-compose.png){width=700}

Google Chrome의 최신 버전 테스트 환경에서 정기적으로 Kotlin/Wasm 벤치마크를 실행하고 있으며, 위 결과는 해당 테스트를 통해 도출되었습니다.

## 브라우저 API 지원

Kotlin/Wasm 표준 라이브러리는 DOM API를 포함한 브라우저 API에 대한 선언을 제공합니다. 이러한 선언을 통해 Kotlin API를 직접 사용하여 다양한 브라우저 기능을 접근하고 활용할 수 있습니다. 예를 들어, Kotlin/Wasm 애플리케이션에서 이러한 선언을 처음부터 정의하지 않고도 DOM 요소를 조작하거나 fetch API를 사용할 수 있습니다. 자세한 내용은 [Kotlin/Wasm 브라우저 예제](https://github.com/Kotlin/kotlin-wasm-browser-template)를 참고하세요.

브라우저 API 지원을 위한 선언은 JavaScript [상호 운용성(interoperability) 기능](wasm-js-interop.md)을 사용하여 정의됩니다. 동일한 기능을 사용하여 사용자 정의 선언을 정의할 수도 있습니다. 또한, Kotlin/Wasm–JavaScript 상호 운용성을 통해 JavaScript에서 Kotlin 코드를 사용할 수 있습니다. 자세한 내용은 [JavaScript에서 Kotlin 코드 사용하기](wasm-js-interop.md#use-kotlin-code-in-javascript)를 참고하세요.

## 피드백 남기기

### Kotlin/Wasm 피드백

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack 초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 후 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에서 개발자들에게 직접 피드백을 남겨주세요.
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에서 문제를 보고해 주세요.

### Compose Multiplatform 피드백

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 공개 채널에서 피드백을 남겨주세요.
* [GitHub에서 문제를 보고해 주세요](https://github.com/JetBrains/compose-multiplatform/issues).

## 더 알아보기

* [YouTube 재생목록](https://kotl.in/wasm-pl)에서 Kotlin/Wasm에 대해 더 자세히 알아보세요.
* GitHub 저장소에서 [Kotlin/Wasm 예제](https://github.com/Kotlin/kotlin-wasm-examples)를 살펴보세요.