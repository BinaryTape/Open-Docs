[//]: # (title: 지원되는 버전 및 구성)

<primary-label ref="beta"/> 

이 페이지에서는 Kotlin/Wasm을 사용한 효율적인 개발을 위한 [WebAssembly 제안](https://webassembly.org/roadmap/), 지원되는 브라우저 및 구성 권장 사항에 대한 세부 정보를 제공합니다.

## 브라우저 버전

Kotlin/Wasm은 WebAssembly 내에서 개선 사항 및 새로운 기능을 도입하기 위해 [가비지 컬렉션 (WasmGC)](#garbage-collection-proposal) 및 [예외 처리](#exception-handling-proposal)와 같은 최신 WebAssembly 제안에 의존합니다.

이러한 기능이 제대로 작동하는지 확인하려면 최신 제안을 지원하는 환경을 제공하세요. 사용 중인 브라우저 버전이 새 WasmGC를 기본적으로 지원하는지 또는 환경을 변경해야 하는지 확인하세요.

### Chrome 

* **버전 119 이상:**

  기본적으로 작동합니다.

* **이전 버전:**

  > 이전 브라우저에서 애플리케이션을 실행하려면 1.9.20 이전 버전의 Kotlin이 필요합니다.
  >
  {style="note"}

  1. 브라우저에서 `chrome://flags/#enable-webassembly-garbage-collection`으로 이동합니다.
  2. **WebAssembly Garbage Collection**을 활성화합니다.
  3. 브라우저를 다시 시작합니다.

### Chromium 기반

Edge, Brave, Opera 또는 Samsung Internet과 같은 Chromium 기반 브라우저를 포함합니다.

* **버전 119 이상:**

  기본적으로 작동합니다.

* **이전 버전:**

   > 이전 브라우저에서 애플리케이션을 실행하려면 1.9.20 이전 버전의 Kotlin이 필요합니다.
   >
   {style="note"}

  `--js-flags=--experimental-wasm-gc` 명령줄 인수를 사용하여 애플리케이션을 실행합니다.

### Firefox

* **버전 120 이상:**

  기본적으로 작동합니다.

* **버전 119:**

  1. 브라우저에서 `about:config`로 이동합니다.
  2. `javascript.options.wasm_gc` 옵션을 활성화합니다.
  3. 페이지를 새로 고칩니다.

### Safari/WebKit

* **버전 18.2 이상:**

  기본적으로 작동합니다.

* **이전 버전:**

   지원되지 않습니다.

> Safari 18.2는 iOS 18.2, iPadOS 18.2, visionOS 2.2, macOS 15.2, macOS Sonoma 및 macOS Ventura에서 사용할 수 있습니다.
> iOS 및 iPadOS에서는 Safari 18.2가 운영 체제에 번들로 제공됩니다. 이를 사용하려면 기기를 버전 18.2 이상으로 업데이트하세요.
>
> 자세한 내용은 [Safari 릴리스 정보](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)를 참조하세요.
>
{style="note"}

## Wasm 제안 지원

Kotlin/Wasm의 개선 사항은 [WebAssembly 제안](https://webassembly.org/roadmap/)을 기반으로 합니다. 여기에서는 WebAssembly의 가비지 컬렉션 및 (레거시) 예외 처리 제안에 대한 지원 세부 정보를 찾을 수 있습니다.

### 가비지 컬렉션 제안

Kotlin 1.9.20부터 Kotlin 툴체인은 [Wasm 가비지 컬렉션](https://github.com/WebAssembly/gc) (WasmGC) 제안의 최신 버전을 사용합니다.

이러한 이유로 Wasm 프로젝트를 최신 Kotlin 버전으로 업데이트할 것을 강력히 권장합니다. 또한 Wasm 환경과 함께 최신 버전의 브라우저를 사용할 것을 권장합니다.

### 예외 처리 제안

Kotlin 툴체인은 기본적으로 [레거시 예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)을 사용하며, 이는 생성된 Wasm 바이너리를 더 넓은 범위의 환경에서 실행할 수 있도록 합니다.

Kotlin 2.0.0부터 Kotlin/Wasm 내에서 새로운 버전의 Wasm [예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)에 대한 지원을 도입했습니다.

이 업데이트는 새로운 예외 처리 제안이 Kotlin 요구 사항에 부합하도록 보장하여, 최신 버전의 제안만 지원하는 가상 머신에서 Kotlin/Wasm을 사용할 수 있도록 합니다.

새로운 예외 처리 제안은 `-Xwasm-use-new-exception-proposal` 컴파일러 옵션을 사용하여 활성화됩니다. 기본적으로 비활성화되어 있습니다.

<p>&nbsp;</p>

> 프로젝트 설정, 종속성 사용 및 기타 작업에 대한 자세한 내용은
> [Kotlin/Wasm 예제](https://github.com/Kotlin/kotlin-wasm-examples#readme)에서 알아보세요.
>
{style="tip"}

## 기본 임포트 사용

[Kotlin/Wasm 코드를 Javascript로 임포트하는](wasm-js-interop.md) 방식은 기본 export에서 명명된 export로 변경되었습니다.

여전히 기본 임포트를 사용하려면 새 JavaScript 래퍼 모듈을 생성하세요. 다음 스니펫으로 `.mjs` 파일을 생성합니다.

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

새 `.mjs` 파일을 `resources` 폴더에 배치하면 빌드 프로세스 중에 자동으로 기본 `.mjs` 파일 옆에 배치됩니다.

`.mjs` 파일을 사용자 지정 위치에 배치할 수도 있습니다. 이 경우 수동으로 기본 `.mjs` 파일 옆으로 이동하거나 임포트 구문의 경로를 위치에 맞게 조정해야 합니다.

## 느린 Kotlin/Wasm 컴파일

Kotlin/Wasm 프로젝트 작업을 할 때 컴파일 시간이 느려질 수 있습니다. 이는 Kotlin/Wasm 툴체인이 변경 사항이 있을 때마다 전체 코드베이스를 다시 컴파일하기 때문에 발생합니다.

이 문제를 완화하기 위해 Kotlin/Wasm 타겟은 증분 컴파일을 지원하며, 이를 통해 컴파일러는 마지막 컴파일 이후 변경 사항과 관련된 파일만 다시 컴파일할 수 있습니다.

증분 컴파일을 사용하면 컴파일 시간이 단축됩니다. 현재로서는 개발 속도를 두 배로 높이며, 향후 릴리스에서는 더 개선할 계획입니다.

현재 설정에서 Wasm 타겟에 대한 증분 컴파일은 기본적으로 비활성화되어 있습니다. 이를 활성화하려면 프로젝트의 `local.properties` 또는 `gradle.properties` 파일에 다음 줄을 추가합니다.

```text
kotlin.incremental.wasm=true
```

> Kotlin/Wasm 증분 컴파일을 사용해 보고 [피드백을 공유해 주세요](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback).
> 여러분의 의견은 이 기능을 더 빨리 안정화하고 기본적으로 활성화하는 데 도움이 됩니다.
>
{style="note"}

## 정규화된 클래스 이름의 진단

Kotlin/Wasm에서는 애플리케이션 크기가 증가하는 것을 방지하기 위해 컴파일러가 기본적으로 생성된 바이너리에 클래스의 정규화된 이름 (FQNs)을 저장하지 않습니다.

이러한 이유로, 정규화된 이름 기능을 명시적으로 활성화하지 않으면 Kotlin/Wasm 프로젝트에서 `KClass::qualifiedName` 속성을 호출할 때 컴파일러가 오류를 보고합니다.

이 진단 기능은 기본적으로 활성화되어 있으며, 오류는 자동으로 보고됩니다. 이 진단 기능을 비활성화하고 Kotlin/Wasm에서 `qualifiedName`을 허용하려면 `build.gradle.kts` 파일에 다음 옵션을 추가하여 컴파일러가 모든 클래스의 정규화된 이름을 저장하도록 지시합니다.

```kotlin
// build.gradle.kts
kotlin {
   wasmJs {
       ...
       compilerOptions {
           freeCompilerArgs.add("-Xwasm-kclass-fqn")
       }
   }
}
```

이 옵션을 활성화하면 애플리케이션 크기가 증가한다는 점을 유의하세요.

## 배열 범위를 벗어난 접근 및 트랩

Kotlin/Wasm에서 인덱스가 범위를 벗어난 배열에 접근하면 일반적인 Kotlin 예외 대신 WebAssembly 트랩이 트리거됩니다. 트랩은 현재 실행 스택을 즉시 중지시킵니다.

JavaScript 환경에서 실행할 때 이러한 트랩은 `WebAssembly.RuntimeError`로 나타나며 JavaScript 측에서 잡을 수 있습니다.

Kotlin/Wasm 환경에서 이러한 트랩을 피하려면 실행 파일을 링크할 때 명령줄에서 다음 컴파일러 옵션을 사용하세요.

```
-Xwasm-enable-array-range-checks
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가합니다.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwasm-enable-array-range-checks")
    }
}
```

이 컴파일러 옵션을 활성화하면 트랩 대신 `IndexOutOfBoundsException`이 발생합니다.

자세한 내용은 이 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-73452/K-Wasm-turning-on-range-checks-by-default)에서 확인하고 피드백을 공유하세요.

## 실험적 어노테이션

Kotlin/Wasm은 일반 WebAssembly 상호 운용성을 위한 여러 실험적 어노테이션을 제공합니다.

`@WasmImport` 및 `@WasmExport`는 Kotlin/Wasm 모듈 외부에서 정의된 함수를 호출하고, 각각 Kotlin 함수를 호스트 또는 다른 Wasm 모듈에 노출할 수 있도록 합니다.

이러한 메커니즘은 아직 발전 중이므로 모든 어노테이션은 실험적으로 표시됩니다. 명시적으로 [옵트인하여 사용](opt-in-requirements.md)해야 하며, 해당 디자인이나 동작은 향후 Kotlin 버전에서 변경될 수 있습니다.

## 디버깅 중 다시 로드

[현대 브라우저](#browser-versions)에서 애플리케이션을 [디버깅](wasm-debugging.md)하는 것은 즉시 작동합니다. 개발 Gradle 태스크(`*DevRun`)를 실행하면 Kotlin은 소스 파일을 브라우저에 자동으로 제공합니다.

하지만 기본적으로 소스를 제공하면 [Kotlin 컴파일 및 번들링이 완료되기 전에 브라우저에서 애플리케이션이 반복적으로 다시 로드되는 현상](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0)이 발생할 수 있습니다. 해결책으로, webpack 구성을 조정하여 Kotlin 소스 파일을 무시하고 제공되는 정적 파일에 대한 감시를 비활성화하세요. 프로젝트의 루트에 있는 `webpack.config.d` 디렉토리에 다음 내용을 담은 `.js` 파일을 추가합니다.

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
            return {
                directory: file,
                watch: false,
            }
        } else {
            return file
        }
    })
}