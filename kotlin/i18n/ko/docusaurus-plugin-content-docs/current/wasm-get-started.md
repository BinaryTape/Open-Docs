---
title: "Kotlin/Wasm 및 Compose Multiplatform 시작하기"
---
:::note
Kotlin/Wasm은 [Alpha](components-stability) 단계입니다. 언제든지 변경될 수 있습니다.

[Kotlin/Wasm 커뮤니티에 참여하세요.](https://slack-chats.kotlinlang.org/c/webassembly)

:::

이 튜토리얼에서는 IntelliJ IDEA에서 [Kotlin/Wasm](wasm-overview)으로 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 앱을 실행하고, [GitHub pages](https://pages.github.com/)에 사이트로 게시할 아티팩트를 생성하는 방법을 보여줍니다.

## 시작하기 전에

Kotlin Multiplatform wizard를 사용하여 프로젝트를 생성합니다.

1. [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/#newProject)를 엽니다.
2. **New Project** 탭에서 프로젝트 이름과 ID를 원하는 대로 변경합니다. 이 튜토리얼에서는 이름을 "WasmDemo"로, ID를 "wasm.project.demo"로 설정합니다.

   > 이것들은 프로젝트 디렉토리의 이름과 ID입니다. 그대로 두어도 됩니다.
   >
   

3. **Web** 옵션을 선택합니다. 다른 옵션은 선택하지 않았는지 확인합니다.
4. **Download** 버튼을 클릭하고 결과 아카이브의 압축을 풉니다.

<img src="/img/wasm-compose-web-wizard.png" alt="Kotlin Multiplatform wizard" width="400" style={{verticalAlign: 'middle'}}/>

## IntelliJ IDEA에서 프로젝트 열기

1. 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 다운로드하여 설치합니다.
2. IntelliJ IDEA의 Welcome 화면에서 **Open**을 클릭하거나 메뉴 모음에서 **File | Open**을 선택합니다.
3. 압축을 푼 "WasmDemo" 폴더로 이동하여 **Open**을 클릭합니다.

## 애플리케이션 실행

1. IntelliJ IDEA에서 **View** | **Tool Windows** | **Gradle**을 선택하여 **Gradle** 도구 창을 엽니다.
   
   프로젝트가 로드되면 Gradle 도구 창에서 Gradle 작업을 찾을 수 있습니다.

   > 작업이 성공적으로 로드되려면 Gradle JVM으로 Java 11 이상이 필요합니다.
   >
   

2. **composeApp** | **Tasks** | **kotlin browser**에서 **wasmJsBrowserDevelopmentRun** 작업을 선택하고 실행합니다.

   <img src="/img/wasm-gradle-task-window.png" alt="Run the Gradle task" width="600" style={{verticalAlign: 'middle'}}/>

   또는 `WasmDemo` 루트 디렉토리에서 터미널에 다음 명령을 실행할 수 있습니다.

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun -t
   ```

3. 애플리케이션이 시작되면 브라우저에서 다음 URL을 엽니다.

   ```bash
   http://localhost:8080/
   ```

   > 8080 포트를 사용할 수 없기 때문에 포트 번호가 다를 수 있습니다. 실제 포트 번호는 Gradle 빌드 콘솔에 출력됩니다.
   >
   

   "Click me!" 버튼이 보입니다. 클릭하세요.

   <img src="/img/wasm-composeapp-browser-clickme.png" alt="Click me" width="650" style={{verticalAlign: 'middle'}}/>

   이제 Compose Multiplatform 로고가 보입니다.

   <img src="/img/wasm-composeapp-browser.png" alt="Compose app in browser" width="650" style={{verticalAlign: 'middle'}}/>

## 아티팩트 생성

**composeApp** | **Tasks** | **kotlin browser**에서 **wasmJsBrowserDistribution** 작업을 선택하고 실행합니다.

<img src="/img/wasm-gradle-task-window-compose.png" alt="Run the Gradle task" width="600" style={{verticalAlign: 'middle'}}/>

또는 `WasmDemo` 루트 디렉토리에서 터미널에 다음 명령을 실행할 수 있습니다.

```bash
./gradlew wasmJsBrowserDistribution
```

애플리케이션 작업이 완료되면 `composeApp/build/dist/wasmJs/productionExecutable` 디렉토리에서 생성된 아티팩트를 찾을 수 있습니다.

<img src="/img/wasm-composeapp-directory.png" alt="Artifacts directory" width="600" style={{verticalAlign: 'middle'}}/>

## GitHub pages에 게시

1. `productionExecutable` 디렉토리의 모든 내용을 사이트를 만들려는 저장소에 복사합니다.
2. [사이트 생성](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)에 대한 GitHub의 지침을 따르세요.

   > GitHub에 변경 사항을 푸시한 후 사이트 변경 사항이 게시되는 데 최대 10분이 걸릴 수 있습니다.
   >
   

3. 브라우저에서 GitHub pages 도메인으로 이동합니다.

   <img src="/img/wasm-composeapp-github-clickme.png" alt="Navigate to GitHub pages" width="650" style={{verticalAlign: 'middle'}}/>

   축하합니다! GitHub pages에 아티팩트를 게시했습니다.

## 다음 단계

Kotlin Slack에서 Kotlin/Wasm 커뮤니티에 참여하세요.

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="/img/join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" /></a>

더 많은 Kotlin/Wasm 예제를 사용해 보세요.

* [Compose 이미지 뷰어](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack 애플리케이션](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Compose 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
  ```