---
title: "Kotlin/Wasm 코드 디버깅"
---
:::note
Kotlin/Wasm은 [Alpha](components-stability) 버전입니다. 언제든지 변경될 수 있습니다.

:::

이 튜토리얼에서는 브라우저를 사용하여 Kotlin/Wasm으로 빌드된 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 애플리케이션을 디버깅하는 방법을 보여줍니다.

## 시작하기 전에

Kotlin Multiplatform 마법사를 사용하여 프로젝트를 만드세요.

1. [Kotlin Multiplatform 마법사](https://kmp.jetbrains.com/#newProject)를 엽니다.
2. **New Project** 탭에서 프로젝트 이름과 ID를 원하는 대로 변경합니다. 이 튜토리얼에서는 이름을 "WasmDemo"로, ID를 "wasm.project.demo"로 설정합니다.

   > 이들은 프로젝트 디렉터리의 이름과 ID입니다. 그대로 두어도 됩니다.
   >
   

3. **Web** 옵션을 선택합니다. 다른 옵션은 선택하지 않았는지 확인합니다.
4. **Download** 버튼을 클릭하고 결과 아카이브의 압축을 풉니다.

<img src="/img/wasm-compose-web-wizard.png" alt="Kotlin Multiplatform wizard" width="400" style={{verticalAlign: 'middle'}}/>

## IntelliJ IDEA에서 프로젝트 열기

1. 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 다운로드하여 설치합니다.
2. IntelliJ IDEA의 시작 화면에서 **Open**을 클릭하거나 메뉴 모음에서 **File | Open**을 선택합니다.
3. 압축을 푼 "WasmDemo" 폴더로 이동하여 **Open**을 클릭합니다.

## 애플리케이션 실행

1. IntelliJ IDEA에서 **View** | **Tool Windows** | **Gradle**을 선택하여 **Gradle** 도구 창을 엽니다.

   > 작업이 성공적으로 로드되려면 Gradle JVM으로 Java 11 이상이 필요합니다.
   >
   

2. **composeApp** | **Tasks** | **kotlin browser**에서 **wasmJsBrowserDevelopmentRun** 작업을 선택하고 실행합니다.

   <img src="/img/wasm-gradle-task-window.png" alt="Run the Gradle task" width="550" style={{verticalAlign: 'middle'}}/>

   또는 `WasmDemo` 루트 디렉터리에서 터미널에 다음 명령을 실행할 수 있습니다.

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. 애플리케이션이 시작되면 브라우저에서 다음 URL을 엽니다.

   ```bash
   http://localhost:8080/
   ```

   > 8080 포트를 사용할 수 없기 때문에 포트 번호가 다를 수 있습니다. Gradle 빌드 콘솔에 인쇄된 실제 포트 번호를 찾을 수 있습니다.
   >
   

   "Click me!" 버튼이 표시됩니다. 클릭하세요.

   <img src="/img/wasm-composeapp-browser-clickme.png" alt="Click me" width="550" style={{verticalAlign: 'middle'}}/>

   이제 Compose Multiplatform 로고가 표시됩니다.

   <img src="/img/wasm-composeapp-browser.png" alt="Compose app in browser" width="550" style={{verticalAlign: 'middle'}}/>

## 브라우저에서 디버깅

:::note
현재 디버깅은 브라우저에서만 사용할 수 있습니다. 앞으로는 [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA)에서 코드를 디버깅할 수 있습니다.

:::

추가 구성 없이 바로 브라우저에서 이 Compose Multiplatform 애플리케이션을 디버깅할 수 있습니다.

그러나 다른 프로젝트의 경우 Gradle 빌드 파일에서 추가 설정을 구성해야 할 수 있습니다. 디버깅을 위해 브라우저를 구성하는 방법에 대한 자세한 내용은 다음 섹션을 확장하세요.

### 디버깅을 위해 브라우저 구성

#### 프로젝트 소스에 대한 액세스 활성화

기본적으로 브라우저는 디버깅에 필요한 일부 프로젝트 소스에 액세스할 수 없습니다. 액세스를 제공하려면 Webpack DevServer가 이러한 소스를 제공하도록 구성할 수 있습니다. `ComposeApp` 디렉터리에서 `build.gradle.kts` 파일에 다음 코드 스니펫을 추가합니다.

다음 import를 최상위 선언으로 추가합니다.

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

`kotlin{}` 내의 `wasmJs{}` 대상 DSL 및 `browser{}` 플랫폼 DSL에 있는 `commonWebpackConfig{}` 블록 내에 다음 코드 스니펫을 추가합니다.

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

결과 코드 블록은 다음과 같습니다.

```kotlin
kotlin {
    @OptIn(ExperimentalWasmDsl::class)
    wasmJs {
        moduleName = "composeApp"
        browser {
            commonWebpackConfig {
                outputFileName = "composeApp.js"
                devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
                    static = (static ?: mutableListOf()).apply { 
                        // Serve sources to debug inside browser
                        add(project.rootDir.path)
                        add(project.projectDir.path)
                    }
                } 
            }
        }
    }
}
```

:::note
현재 라이브러리 소스를 디버깅할 수 없습니다.
[향후 지원할 예정입니다](https://youtrack.jetbrains.com/issue/KT-64685).

:::

#### 사용자 정의 포맷터 사용

사용자 정의 포맷터는 Kotlin/Wasm 코드를 디버깅할 때 변수 값을 보다 사용자 친화적이고 이해하기 쉬운 방식으로 표시하고 찾는 데 도움이 됩니다.

사용자 정의 포맷터는 개발 빌드에서 기본적으로 활성화되어 있으므로 추가 Gradle 구성이 필요하지 않습니다.

이 기능은 [사용자 정의 포맷터 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)를 사용하므로 Firefox 및 Chromium 기반 브라우저에서 지원됩니다.

이 기능을 사용하려면 브라우저의 개발자 도구에서 사용자 정의 포맷터가 활성화되어 있는지 확인하세요.

* Chrome DevTools에서 **Settings | Preferences | Console**에서 사용자 정의 포맷터 확인란을 찾습니다.

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Enable custom formatters in Chrome" width="400" style={{verticalAlign: 'middle'}}/>

* Firefox DevTools에서 **Settings | Advanced settings**에서 사용자 정의 포맷터 확인란을 찾습니다.

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Enable custom formatters in Firefox" width="400" style={{verticalAlign: 'middle'}}/>

사용자 정의 포맷터는 Kotlin/Wasm 개발 빌드에서 작동합니다. 프로덕션 빌드에 대한 특정 요구 사항이 있는 경우 Gradle 구성을 적절히 조정해야 합니다. `wasmJs {}` 블록에 다음 컴파일러 옵션을 추가합니다.

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

사용자 정의 포맷터를 활성화한 후에는 디버깅 튜토리얼을 계속할 수 있습니다.

### Kotlin/Wasm 애플리케이션 디버깅

:::tip
이 튜토리얼에서는 Chrome 브라우저를 사용하지만 다른 브라우저에서도 이 단계를 따를 수 있습니다. 자세한 내용은 [브라우저 버전](wasm-troubleshooting#browser-versions)을 참조하세요.

:::

1. 애플리케이션의 브라우저 창에서 마우스 오른쪽 버튼을 클릭하고 **Inspect** 작업을 선택하여 개발자 도구에 액세스합니다.
   또는 **F12** 바로 가기를 사용하거나 **View** | **Developer** | **Developer Tools**를 선택할 수 있습니다.

2. **Sources** 탭으로 전환하고 디버깅할 Kotlin 파일을 선택합니다. 이 튜토리얼에서는 `Greeting.kt` 파일로 작업합니다.

3. 검사할 코드 줄에 중단점을 설정하려면 줄 번호를 클릭합니다. 더 어두운 숫자 줄만 중단점을 가질 수 있습니다.

   <img src="/img/wasm-breakpoints.png" alt="Set breakpoints" width="600" style={{verticalAlign: 'middle'}}/>

4. **Click me!** 버튼을 클릭하여 애플리케이션과 상호 작용합니다. 이 작업은 코드 실행을 트리거하고 실행이 중단점에 도달하면 디버거가 일시 중지됩니다.

5. 디버깅 창에서 디버깅 제어 버튼을 사용하여 변수와 코드 실행을 중단점에서 검사합니다.
   * <img src="/img/wasm-step-into.png" alt="Step into" width="30" style={{verticalAlign: 'middle'}}/> Step into를 사용하여 함수를 더 자세히 조사합니다.
   * <img src="/img/wasm-step-over.png" alt="Step over" width="30" style={{verticalAlign: 'middle'}}/> Step over를 사용하여 현재 줄을 실행하고 다음 줄에서 일시 중지합니다.
   * <img src="/img/wasm-step-out.png" alt="Step out" width="30" style={{verticalAlign: 'middle'}}/> Step out을 사용하여 코드가 현재 함수를 종료할 때까지 실행합니다.

   <img src="/img/wasm-debug-controls.png" alt="Debug controls" width="600" style={{verticalAlign: 'middle'}}/>

6. **Call stack** 및 **Scope** 창을 확인하여 함수 호출 시퀀스를 추적하고 오류 위치를 정확히 찾아냅니다.

   <img src="/img/wasm-debug-scope.png" alt="Check call stack" width="550" style={{verticalAlign: 'middle'}}/>

   변수 값의 시각화를 개선하려면 [디버깅을 위해 브라우저 구성](#configure-your-browser-for-debugging) 섹션 내에서 _사용자 정의 포맷터 사용_을 참조하세요.

7. 코드를 변경하고 [애플리케이션을 다시 실행](#run-the-application)하여 모든 것이 예상대로 작동하는지 확인합니다.
8. 중단점을 제거하려면 중단점이 있는 줄 번호를 클릭합니다.

## 피드백 남기기

디버깅 경험에 대한 피드백을 보내주시면 감사하겠습니다!

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [Slack 초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 및 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에서 개발자에게 직접 피드백을 제공하세요.
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에서 피드백을 제공하세요.

## 다음 단계

* 이 [YouTube 비디오](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)에서 Kotlin/Wasm 디버깅을 실제로 확인하세요.
* `kotlin-wasm-examples` 리포지토리에서 Kotlin/Wasm 예제를 사용해 보세요.
   * [Compose 이미지 뷰어](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack 애플리케이션](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)

  ```