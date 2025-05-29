[//]: # (title: 문제 해결)

> Kotlin/Wasm은 [알파](components-stability.md) 단계입니다. 언제든지 변경될 수 있습니다. 프로덕션 이전의 시나리오에서 사용하십시오.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에 피드백을 주시면 감사하겠습니다.
>
{style="note"}

Kotlin/Wasm은 WebAssembly 내에서 개선 사항과 새로운 기능을 도입하기 위해 [가비지 컬렉션](#garbage-collection-proposal) 및 [예외 처리](#exception-handling-proposal)와 같은 새로운 [WebAssembly 제안](https://webassembly.org/roadmap/)에 의존합니다.

하지만 이러한 기능이 제대로 작동하도록 하려면 새로운 제안을 지원하는 환경이 필요합니다. 경우에 따라 제안과 호환되도록 환경을 설정해야 할 수도 있습니다.

## 브라우저 버전

Kotlin/Wasm로 빌드된 애플리케이션을 브라우저에서 실행하려면 새로운 [WebAssembly 가비지 컬렉션(WasmGC) 기능](https://github.com/WebAssembly/gc)을 지원하는 브라우저 버전이 필요합니다. 브라우저 버전이 새 WasmGC를 기본적으로 지원하는지 또는 환경을 변경해야 하는지 확인하십시오.

### Chrome

*   **버전 119 이상:**

    기본적으로 작동합니다.

*   **이전 버전:**

    > 이전 브라우저에서 애플리케이션을 실행하려면 Kotlin 버전이 1.9.20보다 이전이어야 합니다.
    >
    {style="note"}

    1.  브라우저에서 `chrome://flags/#enable-webassembly-garbage-collection`으로 이동합니다.
    2.  **WebAssembly Garbage Collection**을 활성화합니다.
    3.  브라우저를 다시 시작합니다.

### Chromium 기반

Edge, Brave, Opera, Samsung Internet과 같은 Chromium 기반 브라우저를 포함합니다.

*   **버전 119 이상:**

    기본적으로 작동합니다.

*   **이전 버전:**

    > 이전 브라우저에서 애플리케이션을 실행하려면 Kotlin 버전이 1.9.20보다 이전이어야 합니다.
    >
    {style="note"}

    `--js-flags=--experimental-wasm-gc` 명령줄 인수를 사용하여 애플리케이션을 실행합니다.

### Firefox

*   **버전 120 이상:**

    기본적으로 작동합니다.

*   **버전 119:**

    1.  브라우저에서 `about:config`로 이동합니다.
    2.  `javascript.options.wasm_gc` 옵션을 활성화합니다.
    3.  페이지를 새로 고칩니다.

### Safari/WebKit

*   **버전 18.2 이상:**

    기본적으로 작동합니다.

*   **이전 버전:**

    지원되지 않습니다.

> Safari 18.2는 iOS 18.2, iPadOS 18.2, visionOS 2.2, macOS 15.2, macOS Sonoma, macOS Ventura에서 사용할 수 있습니다.
> iOS 및 iPadOS에서는 Safari 18.2가 운영 체제에 포함되어 있습니다. Safari 18.2를 사용하려면 기기를 18.2 이상 버전으로 업데이트하십시오.
>
> 자세한 내용은 [Safari 릴리스 노트](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)를 참조하십시오.
>
{style="note"}

## Wasm 제안 지원

Kotlin/Wasm 개선 사항은 [WebAssembly 제안](https://webassembly.org/roadmap/)을 기반으로 합니다. 여기에서 WebAssembly의 가비지 컬렉션 및 (레거시) 예외 처리 제안에 대한 지원 세부 정보를 확인할 수 있습니다.

### 가비지 컬렉션 제안

Kotlin 1.9.20부터 Kotlin 툴체인은 [Wasm 가비지 컬렉션](https://github.com/WebAssembly/gc)(WasmGC) 제안의 최신 버전을 사용합니다.

이러한 이유로 Wasm 프로젝트를 최신 Kotlin 버전으로 업데이트할 것을 강력히 권장합니다. 또한 Wasm 환경과 함께 최신 버전의 브라우저를 사용할 것을 권장합니다.

### 예외 처리 제안

Kotlin 툴체인은 기본적으로 [레거시 예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)을 사용하며, 이는 생성된 Wasm 바이너리를 더 넓은 범위의 환경에서 실행할 수 있도록 합니다.

Kotlin 2.0.0부터 Kotlin/Wasm 내에서 새로운 버전의 Wasm [예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)에 대한 지원을 도입했습니다.

이 업데이트는 새로운 예외 처리 제안이 Kotlin 요구 사항과 일치하도록 보장하여 해당 제안의 최신 버전만 지원하는 가상 머신에서 Kotlin/Wasm을 사용할 수 있도록 합니다.

새로운 예외 처리 제안은 `-Xwasm-use-new-exception-proposal` 컴파일러 옵션을 사용하여 활성화됩니다. 기본적으로는 비활성화되어 있습니다.

<p>&nbsp;</p>

> [Kotlin/Wasm 예제](https://github.com/Kotlin/kotlin-wasm-examples#readme)에서 프로젝트 설정, 종속성 사용 및 기타 작업에 대해 자세히 알아보세요.
>
{style="tip"}

## 기본 임포트 사용

[Kotlin/Wasm 코드를 Javascript로 임포트](wasm-js-interop.md)하는 방식이 기본 내보내기에서 명명된 내보내기로 전환되었습니다.

기본 임포트를 계속 사용하려면 새 JavaScript 래퍼 모듈을 생성하십시오. 다음 스니펫이 포함된 `.mjs` 파일을 생성하십시오.

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

새 `.mjs` 파일을 리소스 폴더에 배치하면 빌드 프로세스 중에 자동으로 기본 `.mjs` 파일 옆에 배치됩니다.

`.mjs` 파일을 사용자 지정 위치에 배치할 수도 있습니다. 이 경우, 기본 `.mjs` 파일 옆으로 수동으로 이동하거나 임포트 문의 경로를 해당 위치와 일치하도록 조정해야 합니다.

## 느린 Kotlin/Wasm 컴파일

Kotlin/Wasm 프로젝트 작업 시 컴파일 시간이 느려질 수 있습니다. 이는 Kotlin/Wasm 툴체인이 변경 사항이 있을 때마다 전체 코드베이스를 다시 컴파일하기 때문에 발생합니다.

이 문제를 완화하기 위해 Kotlin/Wasm 타겟은 점진적 컴파일을 지원하며, 이를 통해 컴파일러는 마지막 컴파일 이후의 변경 사항과 관련된 파일만 다시 컴파일할 수 있습니다.

점진적 컴파일을 사용하면 컴파일 시간이 단축됩니다. 현재로서는 개발 속도를 두 배로 높이며, 향후 릴리스에서는 추가 개선을 계획하고 있습니다.

현재 설정에서 Wasm 타겟의 점진적 컴파일은 기본적으로 비활성화되어 있습니다.
활성화하려면 프로젝트의 `local.properties` 또는 `gradle.properties` 파일에 다음 줄을 추가하십시오.

```text
kotlin.incremental.wasm=true
```

> Kotlin/Wasm 점진적 컴파일을 사용해보고 [피드백을 공유해주세요](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback).
> 여러분의 의견은 이 기능이 더 빨리 안정화되고 기본적으로 활성화되는 데 도움이 됩니다.
>
{style="note"}