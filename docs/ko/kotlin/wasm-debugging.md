[//]: # (title: Kotlin/Wasm 코드 디버그)

<primary-label ref="beta"/>

이 튜토리얼에서는 IntelliJ IDEA와 브라우저를 사용하여 Kotlin/Wasm으로 빌드된 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 애플리케이션을 디버그하는 방법을 보여줍니다.

## 시작하기 전에

1.  [Kotlin Multiplatform 개발 환경을 설정](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment)합니다.
2.  [Kotlin/Wasm을 대상으로 하는 Kotlin Multiplatform 프로젝트를 생성](wasm-get-started.md#create-a-project)하는 지침을 따릅니다.

> *   IntelliJ IDEA에서 Kotlin/Wasm 코드 디버깅은 IDE 버전 2025.3부터 사용할 수 있으며, 현재 [EAP(Early Access Program)](https://www.jetbrains.com/resources/eap/)에 있으며 안정화 단계에 있습니다.
>     다른 IntelliJ IDEA 버전에서 `WasmDemo` 프로젝트를 생성했다면, 버전 2025.3으로 전환하여 프로젝트를 열고 이 튜토리얼을 계속 진행하세요.
> *   IntelliJ IDEA에서 Kotlin/Wasm 코드를 디버그하려면 JavaScript Debugger 플러그인이 설치되어 있어야 합니다.
>     [플러그인 및 설치 방법에 대한 자세한 내용](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)을 참조하세요.
>
{style="note"}

## IntelliJ IDEA에서 디버그

생성한 Kotlin Multiplatform 프로젝트에는 Kotlin/Wasm 기반의 Compose Multiplatform 애플리케이션이 포함되어 있습니다. 추가 설정 없이 IntelliJ IDEA에서 이 애플리케이션을 바로 디버그할 수 있습니다.

1.  IntelliJ IDEA에서 디버그할 Kotlin 파일을 엽니다. 이 튜토리얼에서는 Kotlin Multiplatform 프로젝트의 다음 디렉토리에 있는 `Greeting.kt` 파일을 사용하겠습니다:

    `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2.  검사하려는 코드에 중단점을 설정하려면 줄 번호를 클릭하세요.

    ![Set breakpoints](wasm-breakpoints-intellij.png){width=650}

3.  실행 구성 목록에서 **composeApp[wasmJs]**를 선택합니다.
4.  화면 상단의 디버그 아이콘을 클릭하여 디버그 모드로 코드를 실행합니다.

    ![Run in debug mode](wasm-debug-run-configurations.png){width=600}

    애플리케이션이 시작되면 새 브라우저 창에서 열립니다.

    ![Compose app in browser](wasm-composeapp-browser.png){width=600}

    또한 IntelliJ IDEA에서 **디버그** 패널이 자동으로 열립니다.

    ![Compose app debugger](wasm-debug-pane.png){width=600}

### 애플리케이션 검사

> [브라우저에서 디버깅](#debug-in-your-browser)하는 경우, 애플리케이션 검사를 위해 동일한 단계를 따를 수 있습니다.
>
{style="note"}

1.  애플리케이션의 브라우저 창에서 **Click me!** 버튼을 클릭하여 애플리케이션과 상호작용합니다. 이 동작은 코드 실행을 트리거하며, 실행이 중단점에 도달하면 디버거가 일시 중지됩니다.

2.  디버깅 패널에서 디버깅 제어 버튼을 사용하여 중단점에서 변수와 코드 실행을 검사합니다:
    *   ![Step over](wasm-debug-step-over.png){width=30}{type="joined"} Step over를 사용하여 현재 줄을 실행하고 다음 줄에서 일시 중지합니다.
    *   ![Step into](wasm-debug-step-into.png){width=30}{type="joined"} Step into를 사용하여 함수를 더 깊이 조사합니다.
    *   ![Step out](wasm-debug-step-out.png){width=30}{type="joined"} Step out을 사용하여 현재 함수를 종료할 때까지 코드를 실행합니다.

3.  **스레드 및 변수** 패널을 확인하세요. 이것은 함수 호출 순서를 추적하고 오류의 위치를 파악하는 데 도움이 됩니다.

    ![Check Threads & Variables](wasm-debug-panes-intellij.png){width=700}

4.  코드를 변경하고 애플리케이션을 다시 실행하여 어떻게 작동하는지 확인합니다.
5.  디버깅을 마쳤으면 중단점이 설정된 줄 번호를 클릭하여 중단점을 제거합니다.

## 브라우저에서 디버그

추가 설정 없이 브라우저에서 이 Compose Multiplatform 애플리케이션을 디버그할 수도 있습니다.

개발 Gradle 작업(`*DevRun`)을 실행하면 Kotlin은 소스 파일을 브라우저에 자동으로 제공하여 중단점을 설정하고, 변수를 검사하고, Kotlin 코드를 단계별로 실행할 수 있도록 합니다.

브라우저에서 Kotlin/Wasm 프로젝트 소스를 제공하는 구성은 이제 Kotlin Gradle 플러그인에 포함되어 있습니다. 이전에 이 구성을 `build.gradle.kts` 파일에 추가했다면, 충돌을 피하기 위해 제거해야 합니다.

> 이 튜토리얼에서는 Chrome 브라우저를 사용하지만, 다른 브라우저에서도 이 단계를 따를 수 있어야 합니다. 자세한 내용은 [브라우저 버전](wasm-configuration.md#browser-versions)을 참조하세요.
>
{style="tip"}

1.  [Compose Multiplatform 애플리케이션 실행](wasm-get-started.md#run-the-application) 지침을 따르세요.

2.  애플리케이션의 브라우저 창에서 마우스 오른쪽 버튼을 클릭하고 **Inspect** 작업을 선택하여 개발자 도구에 접근합니다. 또는 **F12** 단축키를 사용하거나 **View** | **Developer** | **Developer Tools**를 선택할 수 있습니다.

3.  **Sources** 탭으로 전환하여 디버그할 Kotlin 파일을 선택합니다. 이 튜토리얼에서는 `Greeting.kt` 파일을 사용할 것입니다.

4.  검사하려는 코드에 중단점을 설정하려면 줄 번호를 클릭하세요. 더 어두운 숫자의 줄에만 중단점을 설정할 수 있습니다. 이 예시에서는 4, 7, 8, 9번 줄입니다.

    ![Set breakpoints](wasm-breakpoints-browser.png){width=700}

5.  [IntelliJ IDEA에서 디버깅](#inspect-your-application)하는 것과 유사하게 애플리케이션을 검사합니다.

    브라우저에서 디버깅할 때, 함수 호출 순서를 추적하고 오류를 파악하는 패널은 **Scope** 및 **Call Stack**입니다.

    ![Check the call stack](wasm-debug-scope.png){width=450}

### 커스텀 포맷터 사용

커스텀 포맷터는 브라우저에서 Kotlin/Wasm 코드를 디버깅할 때 변수 값을 더 사용자 친화적이고 이해하기 쉽게 표시하고 찾을 수 있도록 돕습니다.

커스텀 포맷터는 Kotlin/Wasm 개발 빌드에서 기본적으로 활성화되어 있지만, 브라우저의 개발자 도구에서 커스텀 포맷터가 활성화되어 있는지 확인해야 합니다:

*   Chrome DevTools에서 **Settings | Preferences | Console**에서 **Custom formatters** 체크박스를 찾으세요:

    ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

*   Firefox DevTools에서 **Settings | Advanced settings**에서 **Enable custom formatters** 체크박스를 찾으세요:

    ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

이 기능은 [커스텀 포맷터 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)를 사용하며, Firefox 및 Chromium 기반 브라우저에서 지원됩니다.

커스텀 포맷터는 기본적으로 Kotlin/Wasm 개발 빌드에서만 작동하므로, 프로덕션 빌드에서 사용하려면 Gradle 구성을 조정해야 합니다. `wasmJs {}` 블록에 다음 컴파일러 옵션을 추가하세요:

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

## 피드백 남기기

디버깅 경험에 대한 피드백을 주시면 감사하겠습니다!

*   ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack 초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받아 저희 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에서 개발자에게 직접 피드백을 제공하세요.
*   [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에 피드백을 제공하세요.

## 다음 단계

*   이 [YouTube 비디오](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)에서 Kotlin/Wasm 디버깅 실습을 확인하세요.
*   더 많은 Kotlin/Wasm 예제를 시도해보세요:
    *   [KotlinConf 애플리케이션](https://github.com/JetBrains/kotlinconf-app)
    *   [Compose 이미지 뷰어](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
    *   [Jetsnack 애플리케이션](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
    *   [Node.js 예제](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
    *   [WASI 예제](https://github.com/Kotlin/kotlin-wasm-wasi-template)
    *   [Compose 예제](https://github.com/Kotlin/kotlin-wasm-compose-template)