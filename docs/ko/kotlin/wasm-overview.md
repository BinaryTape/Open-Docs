---
title: Kotlin/Wasm
---
:::note
Kotlin/Wasm은 [Alpha](components-stability) 단계입니다.
언제든지 변경될 수 있습니다. 프로덕션 환경 이전 단계에서 사용할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에서 피드백을 보내주시면 감사하겠습니다.

[Kotlin/Wasm 커뮤니티에 참여하세요](https://slack-chats.kotlinlang.org/c/webassembly).

:::

Kotlin/Wasm은 Kotlin 코드를 [WebAssembly (Wasm)](https://webassembly.org/) 형식으로 컴파일하는 기능을 제공합니다.
Kotlin/Wasm을 사용하면 Wasm을 지원하고 Kotlin 요구 사항을 충족하는 다양한 환경 및 장치에서 실행되는 애플리케이션을 만들 수 있습니다.

Wasm은 스택 기반 가상 머신을 위한 이진 명령어 형식입니다. 이 형식은 자체 가상 머신에서 실행되므로 플랫폼에 독립적입니다. Wasm은 Kotlin 및 기타 언어에 컴파일 대상을 제공합니다.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)으로 빌드된 웹 애플리케이션을 개발하기 위해 브라우저와 같은 다양한 대상 환경에서 Kotlin/Wasm을 사용하거나 독립 실행형 Wasm 가상 머신에서 브라우저 외부에서 사용할 수 있습니다. 브라우저 외부의 경우 [WebAssembly System Interface (WASI)](https://wasi.dev/)는 플랫폼 API에 대한 액세스를 제공하며, 이를 활용할 수도 있습니다.

## Kotlin/Wasm 및 Compose Multiplatform

Kotlin을 사용하면 Compose Multiplatform 및 Kotlin/Wasm을 통해 모바일 및 데스크톱 사용자 인터페이스(UI)를 웹 프로젝트에서 빌드하고 재사용할 수 있습니다.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)은 Kotlin 및 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 하는 선언적 프레임워크로, UI를 한 번 구현하고 대상 플랫폼 전체에서 공유할 수 있습니다.

웹 플랫폼의 경우 Compose Multiplatform은 Kotlin/Wasm을 컴파일 대상으로 사용합니다. Kotlin/Wasm 및 Compose Multiplatform으로 빌드된 애플리케이션은 `wasm-js` 대상을 사용하고 브라우저에서 실행됩니다.

[Compose Multiplatform 및 Kotlin/Wasm으로 빌드된 애플리케이션의 온라인 데모를 살펴보세요](https://zal.im/wasm/jetsnack/)

<img src="/img/wasm-demo.png" alt="Kotlin/Wasm demo" width="700" style={{verticalAlign: 'middle'}}/>
:::tip
브라우저에서 Kotlin/Wasm으로 빌드된 애플리케이션을 실행하려면 새로운 가비지 컬렉션과 레거시 예외 처리 제안을 지원하는 브라우저 버전이 필요합니다. 브라우저 지원 상태를 확인하려면 [WebAssembly roadmap](https://webassembly.org/roadmap/)을 참조하세요.

:::

또한 가장 인기 있는 Kotlin 라이브러리를 Kotlin/Wasm에서 바로 사용할 수 있습니다. 다른 Kotlin 및 Multiplatform 프로젝트와 마찬가지로 빌드 스크립트에 종속성 선언을 포함할 수 있습니다. 자세한 내용은 [Adding dependencies on multiplatform libraries](multiplatform-add-dependencies)를 참조하세요.

직접 사용해 보시겠습니까?

<a href="wasm-get-started"><img src="/img/wasm-get-started-button.svg" width="600" alt="Get started with Kotlin/Wasm" /></a>

## Kotlin/Wasm 및 WASI

Kotlin/Wasm은 서버 측 애플리케이션을 위해 [WebAssembly System Interface (WASI)](https://wasi.dev/)를 사용합니다.
Kotlin/Wasm 및 WASI로 빌드된 애플리케이션은 Wasm-WASI 대상을 사용하여 WASI API를 호출하고 브라우저 환경 외부에서 애플리케이션을 실행할 수 있습니다.

Kotlin/Wasm은 WASI를 활용하여 플랫폼별 세부 정보를 추상화하므로 동일한 Kotlin 코드를 다양한 플랫폼에서 실행할 수 있습니다. 이를 통해 각 런타임에 대한 사용자 지정 처리 없이 Kotlin/Wasm의 범위를 웹 애플리케이션 이상으로 확장합니다.

WASI는 WebAssembly로 컴파일된 Kotlin 애플리케이션을 다양한 환경에서 실행하기 위한 안전한 표준 인터페이스를 제공합니다.

:::tip
Kotlin/Wasm 및 WASI가 실제로 작동하는 모습을 보려면 [Get started with Kotlin/Wasm and WASI tutorial](wasm-wasi)을 확인하세요.

:::

## Kotlin/Wasm 성능

Kotlin/Wasm은 아직 Alpha 단계이지만 Kotlin/Wasm에서 실행되는 Compose Multiplatform은 이미 고무적인 성능 특성을 보여주고 있습니다. 실행 속도가 JavaScript보다 빠르고 JVM에 접근하는 것을 확인할 수 있습니다.

<img src="/img/wasm-performance-compose.png" alt="Kotlin/Wasm performance" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin/Wasm에서 정기적으로 벤치마크를 실행하며 이러한 결과는 최신 버전의 Google Chrome에서 테스트한 결과입니다.

## Browser API support

Kotlin/Wasm 표준 라이브러리는 DOM API를 포함한 브라우저 API에 대한 선언을 제공합니다.
이러한 선언을 통해 Kotlin API를 직접 사용하여 다양한 브라우저 기능을 액세스하고 활용할 수 있습니다.
예를 들어 Kotlin/Wasm 애플리케이션에서 DOM 요소로 조작하거나 처음부터 이러한 선언을 정의하지 않고 API를 가져올 수 있습니다. 자세한 내용은 [Kotlin/Wasm browser example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)을 참조하세요.

브라우저 API 지원에 대한 선언은 JavaScript [interoperability capabilities](wasm-js-interop)를 사용하여 정의됩니다.
동일한 기능을 사용하여 사용자 지정 선언을 정의할 수 있습니다. 또한 Kotlin/Wasm–JavaScript 상호 운용성을 통해 JavaScript에서 Kotlin 코드를 사용할 수 있습니다. 자세한 내용은 [Use Kotlin code in JavaScript](wasm-js-interop#use-kotlin-code-in-javascript)를 참조하세요.

## Leave feedback

### Kotlin/Wasm feedback

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [Get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받아 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에서 개발자에게 직접 피드백을 제공하세요.
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에서 문제를 보고하세요.

### Compose Multiplatform feedback

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 공개 채널에서 피드백을 제공하세요.
* [GitHub에서 문제를 보고하세요](https://github.com/JetBrains/compose-multiplatform/issues).

## Learn more

* 이 [YouTube playlist](https://kotl.in/wasm-pl)에서 Kotlin/Wasm에 대해 자세히 알아보세요.
* GitHub 리포지토리에서 [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples)를 살펴보세요.