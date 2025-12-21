[//]: # (title: 개요)

Kotlin Multiplatform를 통해 Kotlin은 웹 개발을 위한 두 가지 접근 방식을 제공합니다.

* [JavaScript 기반 (Kotlin/JS 컴파일러 사용)](#kotlin-js)
* [WebAssembly 기반 (Kotlin/Wasm 컴파일러 사용)](#kotlin-wasm)

두 접근 방식 모두 웹 앱에서 코드를 공유할 수 있지만, 지원하는 사용 사례가 다릅니다. 또한 대상 브라우저 지원과 같은 기술적 측면에서도 차이가 있습니다.

## Kotlin/JS

[Kotlin/JS](js-overview.md)는 코드, 표준 라이브러리 및 모든 지원되는 의존성을 JS로 트랜스파일링하여 JavaScript (JS) 환경에서 Kotlin 앱을 실행할 수 있도록 합니다.

Kotlin/JS로 개발할 때, 앱을 브라우저나 Node.js 환경에서 실행할 수 있습니다.

> Kotlin/JS 타겟 구성에 대한 정보는 [Gradle 프로젝트 구성](gradle-configure-project.md#targeting-javascript) 가이드를 참조하세요.
>
{style="tip"}

### Kotlin/JS 사용 사례

Kotlin/JS는 다음을 목표로 할 때 적합합니다.

* [JavaScript/TypeScript 코드베이스와 비즈니스 로직 공유](#share-business-logic-with-a-javascript-typescript-codebase).
* [Kotlin으로 공유 불가능한 웹 앱 빌드](#build-web-apps-with-kotlin-without-sharing-the-code).

#### JavaScript/TypeScript 코드베이스와 비즈니스 로직 공유

네이티브 JavaScript/TypeScript 앱과 Kotlin 코드(도메인 또는 데이터 로직과 같은)를 공유해야 하는 경우, Kotlin/JS 타겟은 다음을 제공합니다.

* JavaScript/TypeScript와의 직접적인 상호 운용성.
* 상호 운용성에서 최소한의 오버헤드 (예: 불필요한 데이터 복사 방지). 이를 통해 공유 코드가 JS 기반 워크플로에 원활하게 통합될 수 있습니다.

#### 코드를 공유하지 않고 Kotlin으로 웹 앱 빌드

웹 앱이 다른 플랫폼(iOS, Android 또는 데스크톱)과 공유되지 않고 전적으로 Kotlin으로 구현되는 프로젝트의 경우, HTML 기반 솔루션이 더 나은 제어 기능을 제공합니다.

HTML 기반 솔루션은 SEO 및 접근성을 향상시킵니다. 또한 페이지에서 찾기 및 페이지 번역과 같은 기능을 포함하여 더 나은 브라우저 통합을 제공합니다.

HTML 기반 솔루션의 경우 Kotlin/JS는 여러 접근 방식을 지원합니다.

* [Kobweb](https://kobweb.varabyte.com/) 또는 [Kilua](https://kilua.dev/)와 같은 Compose HTML 기반 프레임워크를 사용하여 Compose 스타일 아키텍처로 UI를 빌드합니다.
* Kotlin 래퍼와 함께 React 기반 솔루션을 사용하여 [Kotlin으로 React 컴포넌트](https://kotlinlang.org/docs/js-react.html)를 구현합니다.

## Kotlin/Wasm
<primary-label ref="beta"/> 

[](wasm-overview.md)는 Kotlin 코드를 WebAssembly (Wasm)로 컴파일하여 Wasm을 지원하는 환경 및 장치에서 앱을 실행할 수 있도록 하며, Kotlin의 요구 사항을 충족합니다.

브라우저에서 Kotlin/Wasm을 사용하면 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)으로 웹 앱을 빌드할 수 있습니다. 브라우저 외부에서는 [WebAssembly System Interface (WASI)](https://wasi.dev/)를 사용하여 플랫폼 API에 액세스하는 독립형 Wasm 가상 머신에서 실행됩니다.

Kotlin/Wasm으로 개발할 때, 다음을 타겟팅할 수 있습니다.

* **`wasmJs`**: 브라우저 또는 Node.js에서 실행하기 위함.
* **`wasmWasi`**: Wasmtime, WasmEdge 등과 같이 WASI를 지원하는 Wasm 환경에서 실행하기 위함.

> Kotlin/Wasm 타겟 구성에 대한 정보는 [Gradle 프로젝트 구성](gradle-configure-project.md#targeting-webassembly) 가이드를 참조하세요.
>
{style="tip"}

### Kotlin/Wasm 사용 사례

여러 플랫폼에서 로직과 UI를 모두 공유하려면 Kotlin/Wasm을 사용하세요.

#### Compose Multiplatform으로 크로스 플랫폼 앱 빌드

웹을 포함한 여러 플랫폼에서 로직과 UI를 모두 공유하려는 경우, [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)을 사용하는 Kotlin/Wasm은 공유 UI 레이어를 제공합니다.

* 모든 플랫폼에 대한 일관된 UI 구현을 보장합니다.
* 반응형 애니메이션과 같은 향상된 렌더링 및 더 부드러운 UI 업데이트를 위해 Wasm을 사용합니다.
* [WebAssembly Garbage Collection (WasmGC)](https://developer.chrome.com/blog/wasmgc) 제안의 최신 버전을 지원하여 Kotlin/Wasm이 모든 주요 최신 브라우저에서 실행될 수 있도록 합니다.

## 웹 접근 방식 선택

아래 표는 사용 사례에 따라 권장 타겟을 요약합니다.

| 사용 사례                                        | 권장 타겟      | 설명                                                                                                                                                                                                               |
|-------------------------------------------------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 비즈니스 로직 공유, 웹 네이티브 UI 사용               | Kotlin/JS      | JS와의 간단한 상호 운용성(interop) 및 최소한의 오버헤드를 제공합니다.                                                                                                                                                              |
| UI와 비즈니스 로직 모두 공유                        | Kotlin/Wasm    | [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)을 사용한 렌더링에 더 나은 성능을 제공합니다.                                                                                                 |
| 공유 불가능한 UI                                | Kotlin/JS      | [Kobweb](https://kobweb.varabyte.com/), [Kilua](https://kilua.dev/), [React](https://kotlinlang.org/docs/js-react.html)와 같은 HTML 기반 프레임워크를 사용하여 UI를 빌드할 수 있으며, 기존 JS 생태계 및 도구를 활용합니다. |

> 적절한 타겟 선택에 대한 지침이 필요하면 [Slack 커뮤니티](https://slack-chats.kotlinlang.org/c/multiplatform)에 참여하세요.
> 플랫폼 차이점, 성능 고려 사항, 특정 사용 사례에 대한 권장 사례에 대해 질문할 수 있습니다.
>
{style="note"}

## 웹 타겟용 호환성 모드

웹 앱이 기본적으로 모든 브라우저에서 작동하도록 호환성 모드를 활성화할 수 있습니다. 이 모드에서는 최신 브라우저용 UI를 Wasm으로 빌드할 수 있으며, 구형 브라우저는 JS로 대체됩니다.

호환성 모드는 `js` 및 `wasmJs` 타겟 모두에 대한 교차 컴파일을 통해 달성됩니다. [웹용 호환성 모드 및 활성화 방법에 대한 자세한 정보 확인](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets).