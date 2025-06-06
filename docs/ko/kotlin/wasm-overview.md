[//]: # (title: Kotlin/Wasm)

> Kotlin/Wasm은 [알파](components-stability.md) 단계에 있습니다.
> 언제든지 변경될 수 있습니다. 프로덕션 이전 시나리오에서 사용할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에 피드백을 주시면 감사하겠습니다.
>
> [Kotlin/Wasm 커뮤니티에 참여하기](https://slack-chats.kotlinlang.org/c/webassembly).
>
{style="note"}

Kotlin/Wasm은 Kotlin 코드를 [WebAssembly (Wasm)](https://webassembly.org/) 형식으로 컴파일하는 기능을 제공합니다.
Kotlin/Wasm을 사용하면 Wasm을 지원하고 Kotlin의 요구 사항을 충족하는
다양한 환경과 기기에서 실행되는 애플리케이션을 만들 수 있습니다.

Wasm은 스택 기반 가상 머신을 위한 바이너리 명령어 형식입니다. 이 형식은 자체 가상 머신에서 실행되므로 플랫폼 독립적입니다. Wasm은 Kotlin 및 기타 언어에 컴파일 대상을 제공합니다.

Kotlin/Wasm은 브라우저와 같은 다양한 대상 환경에서 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)으로 빌드된 웹 애플리케이션을 개발하거나, 브라우저 외부의 독립형 Wasm 가상 머신에서 사용할 수 있습니다. 브라우저 외부의 경우, [WebAssembly System Interface (WASI)](https://wasi.dev/)가 플랫폼 API에 대한 접근을 제공하며, 이를 활용할 수도 있습니다.

## Kotlin/Wasm과 Compose Multiplatform

Kotlin을 사용하면 Compose Multiplatform 및 Kotlin/Wasm을 통해 애플리케이션을 빌드하고 모바일 및 데스크톱 사용자 인터페이스(UI)를 웹 프로젝트에서 재사용할 수 있습니다.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)은 Kotlin과 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 하는 선언형 프레임워크로, UI를 한 번 구현하여 대상 플랫폼 전반에 걸쳐 공유할 수 있습니다.

웹 플랫폼의 경우 Compose Multiplatform는 Kotlin/Wasm을 컴파일 대상으로 사용합니다. Kotlin/Wasm 및 Compose Multiplatform로 빌드된 애플리케이션은 `wasm-js` 대상을 사용하며 브라우저에서 실행됩니다.

[Compose Multiplatform 및 Kotlin/Wasm으로 빌드된 애플리케이션의 온라인 데모 살펴보기](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm 데모](wasm-demo.png){width=700}

> 브라우저에서 Kotlin/Wasm으로 빌드된 애플리케이션을 실행하려면, 새로운 가비지 컬렉션 및 레거시 예외 처리 제안을 지원하는 브라우저 버전이 필요합니다. 브라우저 지원 상태를 확인하려면 [WebAssembly 로드맵](https://webassembly.org/roadmap/)을 참조하세요.
>
{style="tip"}

또한, 가장 인기 있는 Kotlin 라이브러리를 Kotlin/Wasm에서 즉시 사용할 수 있습니다. 다른 Kotlin 및 멀티플랫폼 프로젝트에서와 마찬가지로, 빌드 스크립트에 종속성 선언을 포함할 수 있습니다. 자세한 내용은 [멀티플랫폼 라이브러리에 종속성 추가](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-add-dependencies.html)를 참조하세요.

직접 시도해 보시겠어요?

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="Kotlin/Wasm 시작하기" style="block"/></a>

## Kotlin/Wasm과 WASI

Kotlin/Wasm은 서버 측 애플리케이션을 위해 [WebAssembly System Interface (WASI)](https://wasi.dev/)를 사용합니다.
Kotlin/Wasm 및 WASI로 빌드된 애플리케이션은 Wasm-WASI 대상을 사용하므로, WASI API를 호출하고 브라우저 환경 외부에서 애플리케이션을 실행할 수 있습니다.

Kotlin/Wasm은 WASI를 활용하여 플랫폼별 세부 정보를 추상화함으로써 동일한 Kotlin 코드가 다양한 플랫폼에서 실행될 수 있도록 합니다. 이를 통해 각 런타임에 대한 사용자 지정 처리가 필요 없이 웹 애플리케이션을 넘어 Kotlin/Wasm의 도달 범위를 확장합니다.

WASI는 WebAssembly로 컴파일된 Kotlin 애플리케이션이 다양한 환경에서 실행될 수 있도록 보안 표준 인터페이스를 제공합니다.

> Kotlin/Wasm 및 WASI의 실제 작동을 확인하려면 [Kotlin/Wasm 및 WASI 시작 튜토리얼](wasm-wasi.md)을 확인하세요.
>
{style="tip"}

## Kotlin/Wasm 성능

Kotlin/Wasm은 아직 알파 단계에 있지만, Kotlin/Wasm에서 실행되는 Compose Multiplatform는 이미 고무적인 성능 특성을 보여줍니다. 실행 속도가 JavaScript보다 우수하고 JVM에 근접하는 것을 확인할 수 있습니다.

![Kotlin/Wasm 성능](wasm-performance-compose.png){width=700}

저희는 Kotlin/Wasm에 대해 정기적으로 벤치마크를 실행하며, 이 결과는 Google Chrome 최신 버전에서 진행된 테스트에서 얻은 것입니다.

## 브라우저 API 지원

Kotlin/Wasm 표준 라이브러리는 DOM API를 포함한 브라우저 API 선언을 제공합니다.
이 선언을 통해 Kotlin API를 직접 사용하여 다양한 브라우저 기능을 접근하고 활용할 수 있습니다. 예를 들어, Kotlin/Wasm 애플리케이션에서 DOM 요소 조작이나 API 가져오기를 이러한 선언을 처음부터 정의할 필요 없이 사용할 수 있습니다. 자세한 내용은 [Kotlin/Wasm 브라우저 예시](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)를 참조하세요.

브라우저 API 지원을 위한 선언은 JavaScript [상호 운용성 기능](wasm-js-interop.md)을 사용하여 정의됩니다. 동일한 기능을 사용하여 자신만의 선언을 정의할 수 있습니다. 또한, Kotlin/Wasm-JavaScript 상호 운용성을 통해 JavaScript에서 Kotlin 코드를 사용할 수 있습니다. 자세한 내용은 [JavaScript에서 Kotlin 코드 사용](wasm-js-interop.md#use-kotlin-code-in-javascript)을 참조하세요.

## 피드백 남기기

### Kotlin/Wasm 피드백

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack 초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 및 저희의 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에서 개발자에게 직접 피드백을 제공해주세요.
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에 모든 문제를 보고해주세요.

### Compose Multiplatform 피드백

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 공개 채널에 피드백을 제공해주세요.
* [GitHub](https://github.com/JetBrains/compose-multiplatform/issues)에 모든 문제를 보고해주세요.

## 더 알아보기

* 이 [YouTube 재생목록](https://kotl.in/wasm-pl)에서 Kotlin/Wasm에 대해 더 알아보세요.
* 저희 [GitHub 리포지토리](https://github.com/Kotlin/kotlin-wasm-examples)에서 Kotlin/Wasm 예시를 살펴보세요.