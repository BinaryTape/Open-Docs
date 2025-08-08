# Kotlin Multiplatform 프로젝트를 위한 올바른 웹 타겟 선택

Kotlin Multiplatform (KMP)는 웹 개발을 위한 두 가지 접근 방식을 제공합니다:

*   JavaScript 기반 (Kotlin/JS 컴파일러 사용)
*   WebAssembly 기반 (Kotlin/Wasm 컴파일러 사용)

두 옵션 모두 웹 애플리케이션에서 공유 코드를 사용할 수 있게 합니다.
하지만 성능, 상호 운용성, 애플리케이션 크기, 대상 브라우저 지원 등 여러 중요한 면에서 차이가 있습니다.
이 가이드는 각 타겟을 언제 사용해야 하는지, 그리고 적절한 선택을 통해 요구 사항을 충족하는 방법을 설명합니다.

### 빠른 가이드

아래 표는 사용 사례별 권장 타겟을 요약한 것입니다:

| 사용 사례                            | 권장 타겟 | 이유                                                                                                                                                                                                                           |
| :----------------------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 비즈니스 로직 공유, UI는 네이티브    | JS        | JavaScript와의 직관적인 상호 운용성과 최소한의 오버헤드 제공                                                                                                                                                            |
| UI 및 비즈니스 로직 모두 공유        | Wasm      | [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)를 사용한 렌더링에 더 나은 성능 제공                                                                                                               |
| 공유 불가능한 UI                     | JS        | [Kobweb](https://kobweb.varabyte.com/), [Kilua](https://kilua.dev/), [React](https://kotlinlang.org/docs/js-react.html)와 같은 HTML 기반 프레임워크로 UI를 구축하고, 기존 JS 생태계 및 도구를 활용할 수 있습니다. |

## Kotlin/JS를 선택해야 하는 경우

Kotlin/JS는 다음과 같은 목표가 있다면 훌륭한 솔루션이 됩니다:

*   [JavaScript/TypeScript 코드베이스와 비즈니스 로직 공유](#share-business-logic-with-a-javascript-typescript-codebase)
*   [Kotlin으로 공유 불가능한 웹 앱 구축](#build-web-apps-with-kotlin-without-sharing-the-code)

### JavaScript/TypeScript 코드베이스와 비즈니스 로직 공유

네이티브 JavaScript/TypeScript 기반 애플리케이션과 Kotlin 코드 조각(예: 도메인 또는 데이터 로직)을 공유하고 싶다면,
JS 타겟은 다음을 제공합니다:

*   JavaScript/TypeScript와의 직관적인 상호 운용성.
*   상호 운용성에서 최소한의 오버헤드 (예: 불필요한 데이터 복사 없음). 이를 통해 코드가 JS 기반 워크플로에 원활하게 통합될 수 있습니다.

### 코드 공유 없이 Kotlin으로 웹 앱 구축

Kotlin을 사용하여 전체 웹 앱을 구축하려는 팀에게는,
다른 플랫폼(iOS, Android 또는 데스크톱)과 코드를 공유할 의도가 없는 경우 HTML 기반 솔루션이 더 나은 선택일 수 있습니다.
이는 SEO와 접근성을 향상시키고, 기본적으로 원활한 브라우저 통합을 제공합니다 (예: "페이지 내 검색" 기능 또는 페이지 번역).
이 경우 Kotlin/JS는 몇 가지 옵션을 제공합니다. 다음을 수행할 수 있습니다:

*   [Kobweb](https://kobweb.varabyte.com/) 또는 [Kilua](https://kilua.dev/)와 같은 Compose HTML 기반 프레임워크를 사용하여,
    익숙한 Compose Multiplatform 아키텍처를 사용하여 UI를 구축할 수 있습니다.
*   Kotlin 래퍼를 사용하여 React 기반 솔루션을 활용하고 [Kotlin으로 React 컴포넌트 구축](https://kotlinlang.org/docs/js-react.html)할 수 있습니다.

## Kotlin/Wasm을 선택해야 하는 경우

### Compose Multiplatform로 크로스 플랫폼 앱 구축

웹을 포함한 여러 플랫폼에서 로직과 UI를 모두 공유하고 싶다면,
Kotlin/Wasm과 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)를 결합하는 것이 좋은 방법입니다:

*   UI 경험이 플랫폼 전반에 걸쳐 더 일관됩니다.
*   향상된 렌더링과 부드럽고 반응성이 뛰어난 애니메이션을 위해 Wasm을 활용할 수 있습니다.
*   [WasmGC](https://developer.chrome.com/blog/wasmgc)에 대한 브라우저 지원이 성숙해졌으므로,
    Kotlin/Wasm이 거의 네이티브에 가까운 성능으로 모든 주요 최신 브라우저에서 실행될 수 있습니다.

이전 브라우저 버전 지원 요구 사항이 있는 프로젝트의 경우, Compose Multiplatform의 호환 모드를 사용할 수 있습니다:
최신 브라우저에서는 Wasm으로 UI를 구축하고, 이전 브라우저에서는 JS로 정상적으로 폴백(fallback)하도록 할 수 있습니다.
또한 프로젝트에서 Wasm과 JS 타겟 간에 공통 로직을 공유할 수 있습니다.

> 어떤 경로를 선택해야 할지 여전히 확실하지 않으신가요? 저희 [Slack 커뮤니티](https://slack-chats.kotlinlang.org)에 참여하여
> 올바른 타겟을 선택하는 데 대한 주요 차이점, 성능 고려 사항 및 모범 사례에 대해 질문해 보세요.
>
{style="note"}