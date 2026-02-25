[//]: # (title: 개요)

코틀린(Kotlin)은 코틀린 멀티플랫폼(Kotlin Multiplatform)을 통해 웹 개발을 위한 두 가지 접근 방식을 제공합니다.

* [JavaScript 기반 (Kotlin/JS 컴파일러 사용)](#kotlin-js)
* [WebAssembly 기반 (Kotlin/Wasm 컴파일러 사용)](#kotlin-wasm)

두 방식 모두 웹 앱에서 코드를 공유할 수 있게 해주지만, 지원하는 유스케이스가 서로 다릅니다. 또한 타겟 브라우저 지원과 같은 기술적인 측면에서도 차이가 있습니다.

## Kotlin/JS

[Kotlin/JS](js-overview.md)는 코드, 표준 라이브러리 및 모든 지원되는 의존성을 JavaScript(JS)로 트랜스파일(transpiling)하여 JS 환경에서 코틀린 앱을 실행할 수 있게 합니다.

Kotlin/JS로 개발할 때, 브라우저 또는 Node.js 환경에서 앱을 실행할 수 있습니다.

> Kotlin/JS 타겟 구성에 대한 정보는 [Gradle 프로젝트 구성](gradle-configure-project.md#targeting-javascript) 가이드를 참조하세요.
>
{style="tip"}

### Kotlin/JS 유스케이스

Kotlin/JS는 다음과 같은 목표가 있을 때 적합합니다.

* [JavaScript/TypeScript 코드베이스와 비즈니스 로직 공유](#share-business-logic-with-a-javascript-typescript-codebase).
* [코드를 공유하지 않고 코틀린으로 웹 앱 구축](#build-web-apps-with-kotlin-without-sharing-the-code).

#### JavaScript/TypeScript 코드베이스와 비즈니스 로직 공유

도메인이나 데이터 로직과 같은 코틀린 코드를 네이티브 JavaScript/TypeScript 앱과 공유해야 하는 경우, Kotlin/JS 타겟은 다음을 제공합니다.

* JavaScript/TypeScript와의 직접적인 상호 운용성(interoperability).
* 상호 운용성에서의 최소한의 오버헤드(예: 불필요한 데이터 복사 방지). 이를 통해 공유 코드가 JS 기반 워크플로우에 매끄럽게 통합될 수 있습니다.

#### 코드를 공유하지 않고 코틀린으로 웹 앱 구축

다른 플랫폼(iOS, Android 또는 데스크톱)과 공유하지 않고 웹 앱 전체를 코틀린으로 구현하는 프로젝트의 경우, HTML 기반 솔루션이 더 나은 제어 기능을 제공합니다.

HTML 기반 솔루션은 SEO 및 접근성을 개선합니다. 또한 페이지 내 찾기 및 페이지 번역과 같은 기능을 포함하여 더 나은 브라우저 통합을 제공합니다.

HTML 기반 솔루션의 경우, Kotlin/JS는 여러 접근 방식을 지원합니다.

* [Kobweb](https://kobweb.varabyte.com/) 또는 [Kilua](https://kilua.dev/)와 같은 Compose HTML 기반 프레임워크를 사용하여 Compose 스타일의 아키처로 UI를 구축합니다.
* 코틀린 래퍼(wrapper)가 있는 React 기반 솔루션을 사용하여 [코틀린으로 React 컴포넌트 구현](https://kotlinlang.org/docs/js-react.html)합니다.

## Kotlin/Wasm
<primary-label ref="beta"/> 

[Kotlin/Wasm](wasm-overview.md)은 코틀린 코드를 WebAssembly(Wasm)로 컴파일하여, 코틀린의 요구 사항을 충족하면서 Wasm을 지원하는 환경과 기기에서 앱이 실행될 수 있도록 합니다.

브라우저에서 Kotlin/Wasm을 사용하면 [Compose 멀티플랫폼(Compose Multiplatform)](https://kotlinlang.org/compose-multiplatform/)으로 웹 앱을 구축할 수 있습니다. 브라우저 외부에서는 독립형 Wasm 가상 머신에서 실행되며, 플랫폼 API에 액세스하기 위해 [WebAssembly 시스템 인터페이스(WASI, WebAssembly System Interface)](https://wasi.dev/)를 사용합니다.

Kotlin/Wasm으로 개발할 때 다음을 타겟팅할 수 있습니다.

* **`wasmJs`**: 브라우저 또는 Node.js에서 실행하기 위함.
* **`wasmWasi`**: Wasmtime, WasmEdge 등 WASI를 지원하는 Wasm 환경에서 실행하기 위함.

> Kotlin/Wasm 타겟 구성에 대한 정보는 [Gradle 프로젝트 구성](gradle-configure-project.md#targeting-webassembly) 가이드를 참조하세요.
>
{style="tip"}

### Kotlin/Wasm 유스케이스

로직과 UI를 여러 플랫폼에서 모두 공유하려는 경우 Kotlin/Wasm을 사용하세요.

#### Compose 멀티플랫폼으로 크로스 플랫폼 앱 구축

웹을 포함한 여러 플랫폼에서 로직과 UI를 모두 공유하고 싶다면, [Compose 멀티플랫폼](https://kotlinlang.org/compose-multiplatform/)과 함께 Kotlin/Wasm을 사용하여 공유 UI 레이어를 제공할 수 있습니다.

* 모든 플랫폼에 대해 일관된 UI 구현 보장.
* 렌더링 개선 및 반응형 애니메이션과 같은 더 부드러운 UI 업데이트를 위해 Wasm 사용.
* 최신 버전의 [WebAssembly Garbage Collection (WasmGC)](https://developer.chrome.com/blog/wasmgc) 제안을 지원하여 Kotlin/Wasm이 모든 주요 최신 브라우저에서 실행될 수 있도록 합니다.

## 웹 접근 방식 선택

아래 표는 유스케이스에 따른 권장 타겟을 요약한 것입니다.

| 유스케이스 | 권장 타겟 | 설명 |
|-------------------------------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 비즈니스 로직은 공유하지만, 웹 네이티브 UI를 사용하는 경우 | Kotlin/JS | JS와의 직접적인 상호 운용성과 최소한의 오버헤드를 제공합니다. |
| UI와 비즈니스 로직을 모두 공유하는 경우 | Kotlin/Wasm | [Compose 멀티플랫폼](https://kotlinlang.org/compose-multiplatform/)을 통해 렌더링에 더 나은 성능을 제공합니다. |
| 공유하지 않는 UI | Kotlin/JS | 기존 JS 생태계와 툴링을 사용하여 [Kobweb](https://kobweb.varabyte.com/), [Kilua](https://kilua.dev/) 또는 [React](https://kotlinlang.org/docs/js-react.html)와 같은 HTML 기반 프레임워크로 UI를 구축할 수 있게 해줍니다. |

> 적절한 타겟을 선택하는 데 도움이 필요하다면 [Slack 커뮤니티](https://slack-chats.kotlinlang.org/c/multiplatform)에 참여하세요. 플랫폼 차이점, 성능 고려 사항 및 특정 유스케이스에 대한 권장 실습 사례에 대해 질문할 수 있습니다.
>
{style="note"}

## 웹 타겟을 위한 호환성 모드

웹 앱에 호환성 모드(compatibility mode)를 활성화하여 모든 브라우저에서 즉시 작동하도록 할 수 있습니다. 이 모드에서는 최신 브라우저를 위해 Wasm으로 UI를 빌드하고, 오래된 브라우저에서는 JS로 폴백(fallback)되도록 할 수 있습니다. 

호환성 모드는 `js` 및 `wasmJs` 타겟 모두에 대한 교차 컴파일(cross-compilation)을 통해 이루어집니다.
[웹용 호환성 모드와 활성화 방법에 대해 자세히 알아보기](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets).