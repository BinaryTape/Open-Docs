[//]: # (title: Kotlin/Wasm 코드 디버그)

<primary-label ref="beta"/> 

이 튜토리얼에서는 IntelliJ IDEA와 브라우저를 사용하여 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)으로 빌드된 Kotlin/Wasm 애플리케이션을 디버그하는 방법을 설명합니다.

## 시작하기 전에

1. [Kotlin 멀티플랫폼 개발을 위한 환경을 설정](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)하세요.
2. 지침에 따라 [Kotlin/Wasm을 타겟으로 하는 Kotlin 멀티플랫폼 프로젝트를 생성](wasm-get-started.md#create-a-project)하세요.

> * IntelliJ IDEA에서 Kotlin/Wasm 코드를 디버깅하는 기능은 현재 [조기 액세스 프로그램(EAP)](https://www.jetbrains.com/resources/eap/) 중이며 안정화 버전 출시를 앞두고 있는 IDE 버전 2025.3부터 사용할 수 있습니다. 다른 버전의 IntelliJ IDEA에서 `WasmDemo` 프로젝트를 생성했다면, 이 튜토리얼을 계속 진행하기 위해 버전 2025.3으로 전환하고 프로젝트를 여세요.
> * IntelliJ IDEA에서 Kotlin/Wasm 코드를 디버그하려면 JavaScript Debugger 플러그인이 설치되어 있어야 합니다. [플러그인에 대한 추가 정보 및 설치 방법은 여기를 참조하세요.](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)
>
{style="note"}

## IntelliJ IDEA에서 디버그하기

생성한 Kotlin 멀티플랫폼 프로젝트에는 Kotlin/Wasm 기반의 Compose Multiplatform 애플리케이션이 포함되어 있습니다. 별도의 추가 설정 없이 IntelliJ IDEA에서 이 애플리케이션을 바로 디버그할 수 있습니다.

1. IntelliJ IDEA에서 디버그할 Kotlin 파일을 엽니다. 이 튜토리얼에서는 Kotlin 멀티플랫폼 프로젝트의 다음 디렉터리에 있는 `Greeting.kt` 파일을 사용합니다.

   `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2. 조사하려는 코드의 줄 번호를 클릭하여 중단점(breakpoint)을 설정합니다.

   ![중단점 설정](wasm-breakpoints-intellij.png){width=650}

3. 실행 구성(run configurations) 목록에서 **composeApp[wasmJs]**를 선택합니다.
4. 화면 상단의 디버그 아이콘을 클릭하여 디버그 모드로 코드를 실행합니다.

   ![디버그 모드로 실행](wasm-debug-run-configurations.png){width=600}

   애플리케이션이 시작되면 새 브라우저 창에서 열립니다.

   ![브라우저에서의 Compose 앱](wasm-composeapp-browser.png){width=600}

   또한 IntelliJ IDEA에서 **Debug** 패널이 자동으로 열립니다.

   ![Compose 앱 디버거](wasm-debug-pane.png){width=600}

### 애플리케이션 검사하기

> [브라우저에서 디버깅](#debug-in-your-browser)하는 경우에도 동일한 단계로 애플리케이션을 검사할 수 있습니다.
>
{style="note"}

1. 애플리케이션의 브라우저 창에서 **Click me!** 버튼을 클릭하여 애플리케이션과 상호작용합니다. 이 동작은 코드 실행을 트리거하며, 실행이 중단점에 도달하면 디버거가 일시 중지됩니다.

2. 디버깅 패널에서 디버깅 제어 버튼을 사용하여 중단점에서의 변수와 코드 실행을 검사합니다.
    * ![Step over](wasm-debug-step-over.png){width=30}{type="joined"} **Step over**: 현재 줄을 실행하고 다음 줄에서 멈춥니다.
    * ![Step into](wasm-debug-step-into.png){width=30}{type="joined"} **Step into**: 함수 내부를 더 자세히 조사합니다.
    * ![Step out](wasm-debug-step-out.png){width=30}{type="joined"} **Step out**: 현재 함수를 빠져나갈 때까지 코드를 실행합니다.

3. **Threads & Variables** 패널을 확인하세요. 함수 호출 순서를 추적하고 오류 위치를 정확히 찾아내는 데 도움이 됩니다.

   ![Threads & Variables 확인](wasm-debug-panes-intellij.png){width=700}

4. 코드를 변경하고 애플리케이션을 다시 실행하여 어떻게 작동하는지 확인하세요.
5. 디버깅이 끝나면 중단점이 있는 줄 번호를 다시 클릭하여 중단점을 제거합니다.

## 브라우저에서 디버그하기

별도의 추가 설정 없이 브라우저에서도 이 Compose Multiplatform 애플리케이션을 디버그할 수 있습니다. 

개발용 Gradle 태스크(`*DevRun`)를 실행하면 Kotlin은 소스 파일을 브라우저에 자동으로 제공하여 중단점을 설정하고, 변수를 검사하며, Kotlin 코드를 단계별로 실행할 수 있게 해줍니다.

브라우저에서 Kotlin/Wasm 프로젝트 소스를 제공하기 위한 설정은 이제 Kotlin Gradle 플러그인에 포함되어 있습니다. 이전에 `build.gradle.kts` 파일에 이 설정을 직접 추가했다면 충돌을 피하기 위해 제거해야 합니다.

> 이 튜토리얼에서는 Chrome 브라우저를 사용하지만, 다른 브라우저에서도 다음 단계들을 수행할 수 있습니다. 자세한 내용은 [브라우저 버전](wasm-configuration.md#browser-versions)을 참조하세요.
>
{style="tip"}

1. 지침에 따라 [Compose Multiplatform 애플리케이션을 실행](wasm-get-started.md#run-the-application)합니다.

2. 애플리케이션의 브라우저 창에서 마우스 오른쪽 버튼을 클릭하고 **검사(Inspect)**를 선택하여 개발자 도구에 액세스합니다. 또는 **F12** 단축키를 사용하거나 **보기(View)** | **개발자(Developer)** | **개발자 도구(Developer Tools)**를 선택할 수 있습니다.

3. **Sources** 탭으로 전환하고 디버그할 Kotlin 파일을 선택합니다. 이 튜토리얼에서는 `Greeting.kt` 파일을 사용합니다.

4. 조사하려는 코드의 줄 번호를 클릭하여 중단점을 설정합니다. 숫자가 더 어둡게 표시된 줄에만 중단점을 설정할 수 있습니다. 이 예시에서는 4, 7, 8, 9번 줄입니다.

   ![중단점 설정](wasm-breakpoints-browser.png){width=700}

5. [IntelliJ IDEA에서 디버그하기](#inspect-your-application)와 유사한 방식으로 애플리케이션을 검사합니다.

    브라우저에서 디버깅할 때 함수 호출 순서를 추적하고 오류를 찾는 패널은 **Scope**와 **Call Stack**입니다.

   ![Call Stack 확인](wasm-debug-scope.png){width=450}

### 사용자 정의 포맷터(Custom formatters) 사용하기

사용자 정의 포맷터를 사용하면 브라우저에서 Kotlin/Wasm 코드를 디버깅할 때 변수 값을 더 사용자 친화적이고 이해하기 쉬운 방식으로 표시하고 찾을 수 있습니다.

사용자 정의 포맷터는 Kotlin/Wasm 개발 빌드에서 기본적으로 활성화되어 있지만, 브라우저의 개발자 도구에서도 사용자 정의 포맷터가 활성화되어 있는지 확인해야 합니다.

* Chrome 개발자 도구(DevTools)의 경우, **Settings | Preferences | Console**에서 **Custom formatters** 체크박스를 찾으세요.

  ![Chrome에서 사용자 정의 포맷터 활성화](wasm-custom-formatters-chrome.png){width=400}

* Firefox 개발자 도구(DevTools)의 경우, **Settings | Advanced settings**에서 **Enable custom formatters** 체크박스를 찾으세요.

  ![Firefox에서 사용자 정의 포맷터 활성화](wasm-custom-formatters-firefox.png){width=400}

이 기능은 [custom formatters API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)를 사용하며, Firefox 및 Chromium 기반 브라우저에서 지원됩니다.

사용자 정의 포맷터는 기본적으로 Kotlin/Wasm 개발 빌드에서만 작동하므로, 프로덕션 빌드에서 사용하려면 Gradle 구성을 조정해야 합니다. `wasmJs {}` 블록에 다음 컴파일러 옵션을 추가하세요.

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

## 의견 보내기

디버깅 경험에 대한 어떠한 피드백도 환영합니다!

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack 초대 링크](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 통해 가입하고 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에서 개발자들에게 직접 피드백을 전달해 주세요.
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에 피드백을 남겨주세요.

## 다음 단계

* 이 [YouTube 동영상](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)에서 실제 Kotlin/Wasm 디버깅을 확인해 보세요.
* 더 많은 Kotlin/Wasm 예제를 살펴보세요:
  * [KotlinConf 애플리케이션](https://github.com/JetBrains/kotlinconf-app)
  * [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Node.js 예제](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 예제](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 예제](https://github.com/Kotlin/kotlin-wasm-compose-template)