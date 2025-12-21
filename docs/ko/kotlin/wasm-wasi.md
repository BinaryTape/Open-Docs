[//]: # (title: Kotlin/Wasm 및 WASI 시작하기)

<primary-label ref="beta"/> 

이 튜토리얼에서는 다양한 WebAssembly 가상 머신에서 [WebAssembly System Interface (WASI)](https://wasi.dev/)를 사용하여 간단한 [Kotlin/Wasm](wasm-overview.md) 애플리케이션을 실행하는 방법을 보여줍니다.

[Node.js](https://nodejs.org/en), [Deno](https://deno.com/), 그리고 [WasmEdge](https://wasmedge.org/) 가상 머신에서 실행되는 애플리케이션 예시를 찾을 수 있습니다. 결과물은 표준 WASI API를 사용하는 간단한 애플리케이션입니다.

현재 Kotlin/Wasm은 Preview 1으로도 알려진 WASI 0.1을 지원합니다. WASI 0.2 지원은 향후 릴리스에서 예정되어 있습니다. [WASI 0.2 지원에 대한 업데이트는 이 YouTrack 이슈를 팔로우하세요](https://youtrack.jetbrains.com/issue/KT-64568).

[`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi) 타겟은 [기본적으로 새로운 예외 처리 제안을 사용](wasm-configuration.md#exception-handling-proposal)하여 최신 WebAssembly 런타임과의 더 나은 호환성을 보장합니다.

> Kotlin/Wasm 툴체인은 Node.js 태스크(`wasmWasiNode*`)를 기본적으로 제공합니다.
> Deno 또는 WasmEdge를 활용하는 다른 태스크 변형은 프로젝트에 사용자 지정 태스크로 포함되어 있습니다.
>
{style="tip"}

## 시작하기 전에

1. [IntelliJ IDEA](https://www.jetbrains.com/idea/)의 최신 버전을 다운로드하여 설치합니다.

2. IntelliJ IDEA에서 **File | New | Project from Version Control**을 선택하여 [Kotlin/Wasm WASI 템플릿 저장소](https://github.com/Kotlin/kotlin-wasm-wasi-template)를 복제합니다.

   명령줄에서 복제할 수도 있습니다:
   
   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## 애플리케이션 실행하기

1. **View** | **Tool Windows** | **Gradle**을 선택하여 **Gradle** 도구 창을 엽니다. 
   
   프로젝트가 로드되면 **Gradle** 도구 창에서 **kotlin-wasm-wasi-example** 아래의 Gradle 태스크를 찾을 수 있습니다.

   > 태스크가 성공적으로 로드되려면 Gradle JVM으로 최소 Java 11이 필요합니다.
   >
   {style="note"}

2. **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node**에서 다음 Gradle 태스크 중 하나를 선택하여 실행합니다.

   * Node.js에서 애플리케이션을 실행하려면 **wasmWasiNodeRun**을 선택합니다.
   * Deno에서 애플리케이션을 실행하려면 **wasmWasiDenoRun**을 선택합니다.
   * WasmEdge에서 애플리케이션을 실행하려면 **wasmWasiWasmEdgeRun**을 선택합니다.

     > Windows 플랫폼에서 Deno를 사용할 경우, `deno.exe`가 설치되어 있는지 확인하세요. 자세한 내용은 [Deno 설치 문서](https://docs.deno.com/runtime/manual/getting_started/installation)를 참조하세요.
     >
     {style="tip"}

   ![Kotlin/Wasm and WASI tasks](wasm-wasi-gradle-task.png){width=600}
   
또는 ` kotlin-wasm-wasi-template` 루트 디렉토리에서 터미널에 다음 명령 중 하나를 실행합니다:

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

애플리케이션이 성공적으로 빌드되면 터미널에 메시지가 표시됩니다:

![Kotlin/Wasm and WASI app](wasm-wasi-app-terminal.png){width=600}

## 애플리케이션 테스트하기

다양한 가상 머신에서 Kotlin/Wasm 애플리케이션이 올바르게 작동하는지 테스트할 수도 있습니다.

Gradle 도구 창에서 **kotlin-wasm-wasi-example** | **Tasks** | **verification** 아래의 다음 Gradle 태스크 중 하나를 실행합니다:

* Node.js에서 애플리케이션을 테스트하려면 **wasmWasiNodeTest**를 선택합니다.
* Deno에서 애플리케이션을 테스트하려면 **wasmWasiDenoTest**를 선택합니다.
* WasmEdge에서 애플리케이션을 테스트하려면 **wasmWasiWasmEdgeTest**를 선택합니다.

![Kotlin/Wasm and WASI test tasks](wasm-wasi-testing-task.png){width=600}

또는 ` kotlin-wasm-wasi-template` 루트 디렉토리에서 터미널에 다음 명령 중 하나를 실행합니다:
    
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

터미널에 테스트 결과가 표시됩니다:

![Kotlin/Wasm and WASI test](wasm-wasi-tests-results.png){width=600}

## 다음 단계

Kotlin Slack의 Kotlin/Wasm 커뮤니티에 참여하세요:

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>

더 많은 Kotlin/Wasm 예시를 시도해 보세요:

* [Compose 이미지 뷰어](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack 애플리케이션](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js 예시](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose 예시](https://github.com/Kotlin/kotlin-wasm-compose-template)