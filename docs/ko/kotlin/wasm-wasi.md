---
title: "Kotlin/Wasm 및 WASI 시작하기"
---
:::note
Kotlin/Wasm은 [Alpha](components-stability) 단계입니다. 언제든지 변경될 수 있습니다.

[Kotlin/Wasm 커뮤니티에 참여하세요.](https://slack-chats.kotlinlang.org/c/webassembly)

:::

이 튜토리얼에서는 다양한 WebAssembly 가상 머신에서 [WebAssembly System Interface (WASI)](https://wasi.dev/)를 사용하여 간단한 [Kotlin/Wasm](wasm-overview) 애플리케이션을 실행하는 방법을 보여줍니다.

[Node.js](https://nodejs.org/en), [Deno](https://deno.com/),
[WasmEdge](https://wasmedge.org/) 가상 머신에서 실행되는 애플리케이션의 예시를 찾을 수 있습니다. 출력은 표준 WASI API를 사용하는 간단한 애플리케이션입니다.

현재 Kotlin/Wasm은 Preview 1이라고도 하는 WASI 0.1을 지원합니다.
[WASI 0.2 지원은 향후 릴리스에서 계획 중입니다](https://youtrack.jetbrains.com/issue/KT-64568).

:::tip
Kotlin/Wasm 툴체인은 기본적으로 Node.js 작업(`wasmWasiNode*`)을 제공합니다.
Deno 또는 WasmEdge를 활용하는 것과 같은 프로젝트의 다른 작업 변형은 사용자 지정 작업으로 포함됩니다.

:::

## 시작하기 전에

1. 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 다운로드하여 설치합니다.

2. IntelliJ IDEA에서 **File | New | Project from Version Control**을 선택하여 [Kotlin/Wasm WASI 템플릿 저장소](https://github.com/Kotlin/kotlin-wasm-wasi-template)를 복제합니다.

   또는 명령줄에서 복제할 수도 있습니다.
   
   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## 애플리케이션 실행

1. **View** | **Tool Windows** | **Gradle**을 선택하여 **Gradle** 도구 창을 엽니다.
   
   **Gradle** 도구 창에서 프로젝트가 로드되면 **kotlin-wasm-wasi-example** 아래에서 Gradle 작업을 찾을 수 있습니다.

   > 작업을 성공적으로 로드하려면 Gradle JVM으로 Java 11 이상이 필요합니다.
   >
   

2. **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node**에서 다음 Gradle 작업 중 하나를 선택하여 실행합니다.

   * Node.js에서 애플리케이션을 실행하려면 **wasmWasiNodeRun**을 선택합니다.
   * Deno에서 애플리케이션을 실행하려면 **wasmWasiDenoRun**을 선택합니다.
   * WasmEdge에서 애플리케이션을 실행하려면 **wasmWasiWasmEdgeRun**을 선택합니다.

     > Windows 플랫폼에서 Deno를 사용하는 경우 `deno.exe`가 설치되어 있는지 확인하세요. 자세한 내용은
     > [Deno 설치 설명서](https://docs.deno.com/runtime/manual/getting_started/installation)를 참조하세요.
     >
     

   <img src="/img/wasm-wasi-gradle-task.png" alt="Kotlin/Wasm and WASI tasks" width="600" style={{verticalAlign: 'middle'}}/>
   
또는 ` kotlin-wasm-wasi-template` 루트 디렉토리에서 터미널에 다음 명령 중 하나를 실행합니다.

* Node.js에서 애플리케이션을 실행하려면:

  ```bash
  ./gradlew wasmWasiNodeRun
  ```

* Deno에서 애플리케이션을 실행하려면:

  ```bash
  ./gradlew wasmWasiDenoRun
  ```

* WasmEdge에서 애플리케이션을 실행하려면:

  ```bash
  ./gradlew wasmWasiWasmEdgeRun
  ```

애플리케이션이 성공적으로 빌드되면 터미널에 메시지가 표시됩니다.

<img src="/img/wasm-wasi-app-terminal.png" alt="Kotlin/Wasm and WASI app" width="600" style={{verticalAlign: 'middle'}}/>

## 애플리케이션 테스트

다양한 가상 머신에서 Kotlin/Wasm 애플리케이션이 올바르게 작동하는지 테스트할 수도 있습니다.

Gradle 도구 창에서 **kotlin-wasm-wasi-example** | **Tasks** | **verification**에서 다음 Gradle 작업 중 하나를 실행합니다.

* Node.js에서 애플리케이션을 테스트하려면 **wasmWasiNodeTest**를 선택합니다.
* Deno에서 애플리케이션을 테스트하려면 **wasmWasiDenoTest**를 선택합니다.
* WasmEdge에서 애플리케이션을 테스트하려면 **wasmWasiWasmEdgeTest**를 선택합니다.

<img src="/img/wasm-wasi-testing-task.png" alt="Kotlin/Wasm and WASI test tasks" width="600" style={{verticalAlign: 'middle'}}/>

또는 ` kotlin-wasm-wasi-template` 루트 디렉토리에서 터미널에 다음 명령 중 하나를 실행합니다.
    
* Node.js에서 애플리케이션을 테스트하려면:

  ```bash
  ./gradlew wasmWasiNodeTest
  ```
   
* Deno에서 애플리케이션을 테스트하려면:
   
  ```bash
  ./gradlew wasmWasiDenoTest
  ```

* WasmEdge에서 애플리케이션을 테스트하려면:

  ```bash
  ./gradlew wasmWasiWasmEdgeTest
  ```

터미널에 테스트 결과가 표시됩니다.

<img src="/img/wasm-wasi-tests-results.png" alt="Kotlin/Wasm and WASI test" width="600" style={{verticalAlign: 'middle'}}/>

## 다음 단계

Kotlin Slack에서 Kotlin/Wasm 커뮤니티에 참여하세요.

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="/img/join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" /></a>

더 많은 Kotlin/Wasm 예제를 사용해 보세요.

* [Compose 이미지 뷰어](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack 애플리케이션](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js 예제](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose 예제](https://github.com/Kotlin/kotlin-wasm-compose-template)
  ```