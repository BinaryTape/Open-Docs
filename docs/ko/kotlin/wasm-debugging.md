[//]: # (title: Kotlin/Wasm 코드 디버그)

> Kotlin/Wasm은 [알파](components-stability.md) 단계입니다. 언제든지 변경될 수 있습니다.
>
{style="note"}

이 튜토리얼에서는 Kotlin/Wasm으로 빌드된 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 애플리케이션을 브라우저에서 디버그하는 방법을 보여줍니다.

## 시작하기 전에

Kotlin Multiplatform 마법사를 사용하여 프로젝트를 생성하세요:

1. [Kotlin Multiplatform 마법사](https://kmp.jetbrains.com/#newProject)를 엽니다.
2. **New Project** 탭에서 프로젝트 이름과 ID를 원하는 대로 변경합니다. 이 튜토리얼에서는 이름을 "WasmDemo"로, ID를 "wasm.project.demo"로 설정합니다.

   > 이것은 프로젝트 디렉토리의 이름과 ID입니다. 그대로 두셔도 됩니다.
   >
   {style="tip"}

3. **Web** 옵션을 선택합니다. 다른 옵션은 선택되지 않았는지 확인합니다.
4. **Download** 버튼을 클릭하고 결과 아카이브의 압축을 해제합니다.

   ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=450}

## IntelliJ IDEA에서 프로젝트 열기

1. 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 다운로드하여 설치합니다.
2. IntelliJ IDEA 시작 화면에서 **Open**을 클릭하거나 메뉴 바에서 **File | Open**을 선택합니다.
3. 압축을 해제한 "WasmDemo" 폴더로 이동하여 **Open**을 클릭합니다.

## 애플리케이션 실행

1. IntelliJ IDEA에서 **View** | **Tool Windows** | **Gradle**을 선택하여 **Gradle** 도구 창을 엽니다.

   > 작업이 성공적으로 로드되려면 Gradle JVM으로 최소 Java 11이 필요합니다.
   >
   {style="note"}

2. **composeApp** | **Tasks** | **kotlin browser**에서 **wasmJsBrowserDevelopmentRun** 작업을 선택하고 실행합니다.

   ![Run the Gradle task](wasm-gradle-task-window.png){width=450}

   또는 `WasmDemo` 루트 디렉토리에서 터미널에 다음 명령어를 실행할 수 있습니다:

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. 애플리케이션이 시작되면 브라우저에서 다음 URL을 엽니다:

   ```bash
   http://localhost:8080/
   ```

   > 포트 번호는 8080 포트가 사용 불가능할 수 있으므로 달라질 수 있습니다. 실제 포트 번호는 Gradle 빌드 콘솔에 출력됩니다.
   >
   {style="tip"}

   "Click me!" 버튼이 보입니다. 클릭하세요:

   ![Click me](wasm-composeapp-browser-clickme.png){width=550}

   이제 Compose Multiplatform 로고가 보입니다:

   ![Compose app in browser](wasm-composeapp-browser.png){width=550}

## 브라우저에서 디버그

> 현재 디버깅은 브라우저에서만 가능합니다. 향후 [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA)에서도 코드를 디버그할 수 있게 될 것입니다.
>
{style="note"}

별도의 설정 없이 브라우저에서 이 Compose Multiplatform 애플리케이션을 즉시 디버그할 수 있습니다.

하지만 다른 프로젝트의 경우, Gradle 빌드 파일에 추가 설정을 구성해야 할 수도 있습니다. 브라우저 디버깅 구성 방법에 대한 자세한 내용은 다음 섹션을 펼쳐보세요.

### 브라우저 디버깅 구성 {initial-collapse-state="collapsed" collapsible="true"}

#### 프로젝트 소스에 대한 접근 활성화

기본적으로 브라우저는 디버깅에 필요한 프로젝트의 일부 소스에 접근할 수 없습니다. 접근을 제공하려면 Webpack DevServer가 이러한 소스를 제공하도록 구성할 수 있습니다. `ComposeApp` 디렉토리에 있는 `build.gradle.kts` 파일에 다음 코드 스니펫을 추가하세요.

다음 import 문을 최상위 선언으로 추가합니다:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

`kotlin{}` 내의 `wasmJs{}` 타겟 DSL 및 `browser{}` 플랫폼 DSL 안에 있는 `commonWebpackConfig{}` 블록 내부에 이 코드 스니펫을 추가합니다:

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

결과적인 코드 블록은 다음과 같습니다:

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
{initial-collapse-state="collapsed" collapsible="true"}

> 현재 라이브러리 소스를 디버그할 수 없습니다. [향후 지원될 예정입니다](https://youtrack.jetbrains.com/issue/KT-64685).
>
{style="note"}

#### 커스텀 포맷터 사용

커스텀 포맷터는 Kotlin/Wasm 코드를 디버깅할 때 변수 값을 더 사용자 친화적이고 이해하기 쉽게 표시하고 찾을 수 있도록 돕습니다.

커스텀 포맷터는 개발 빌드에서 기본적으로 활성화되어 있으므로, 추가적인 Gradle 구성이 필요하지 않습니다.

이 기능은 [커스텀 포맷터 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)를 사용하므로 Firefox 및 Chromium 기반 브라우저에서 지원됩니다.

이 기능을 사용하려면 브라우저의 개발자 도구에서 커스텀 포맷터가 활성화되어 있는지 확인하세요:

* Chrome DevTools에서 **Settings | Preferences | Console**에서 커스텀 포맷터 체크박스를 찾으세요:

  ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

* Firefox DevTools에서 **Settings | Advanced settings**에서 커스텀 포맷터 체크박스를 찾으세요:

  ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

커스텀 포맷터는 Kotlin/Wasm 개발 빌드에서 작동합니다. 프로덕션 빌드에 대한 특정 요구사항이 있는 경우, 그에 따라 Gradle 구성을 조정해야 합니다. `wasmJs {}` 블록에 다음 컴파일러 옵션을 추가하세요:

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

커스텀 포맷터를 활성화한 후, 디버깅 튜토리얼을 계속 진행할 수 있습니다.

### Kotlin/Wasm 애플리케이션 디버그

> 이 튜토리얼은 Chrome 브라우저를 사용하지만, 다른 브라우저에서도 이 단계를 따를 수 있어야 합니다. 자세한 내용은 [브라우저 버전](wasm-troubleshooting.md#browser-versions)을 참조하세요.
>
{style="tip"}

1. 애플리케이션의 브라우저 창에서 마우스 오른쪽 버튼을 클릭하고 **Inspect** 작업을 선택하여 개발자 도구에 접근합니다.
   또는 **F12** 단축키를 사용하거나 **View | Developer | Developer Tools**를 선택할 수 있습니다.

2. **Sources** 탭으로 전환하여 디버그할 Kotlin 파일을 선택합니다. 이 튜토리얼에서는 `Greeting.kt` 파일을 사용할 것입니다.

3. 줄 번호를 클릭하여 검사하려는 코드에 중단점(breakpoint)을 설정합니다. 숫자가 더 어두운 줄에만 중단점을 설정할 수 있습니다.

   ![Set breakpoints](wasm-breakpoints.png){width=700}

4. **Click me!** 버튼을 클릭하여 애플리케이션과 상호작용합니다. 이 동작은 코드 실행을 트리거하며, 실행이 중단점에 도달하면 디버거가 일시 중지됩니다.

5. 디버깅 창에서 디버깅 제어 버튼을 사용하여 중단점에서 변수와 코드 실행을 검사합니다:
   * ![Step into](wasm-step-into.png){width=30}{type="joined"} 함수를 더 깊이 조사하려면 Step into를 사용합니다.
   * ![Step over](wasm-step-over.png){width=30}{type="joined"} 현재 줄을 실행하고 다음 줄에서 일시 중지하려면 Step over를 사용합니다.
   * ![Step out](wasm-step-out.png){width=30}{type="joined"} 현재 함수를 종료할 때까지 코드를 실행하려면 Step out을 사용합니다.

   ![Debug controls](wasm-debug-controls.png){width=450}

6. **Call stack** 및 **Scope** 창을 확인하여 함수 호출 순서를 추적하고 오류의 위치를 파악합니다.

   ![Check call stack](wasm-debug-scope.png){width=450}

   변수 값의 향상된 시각화를 위해 [브라우저 디버깅 구성](#configure-your-browser-for-debugging) 섹션 내의 _커스텀 포맷터 사용_을 참조하세요.

7. 코드를 변경하고 [애플리케이션을 다시 실행](#run-the-application)하여 모든 것이 예상대로 작동하는지 확인합니다.
8. 중단점이 설정된 줄 번호를 클릭하여 중단점을 제거합니다.

## 피드백 남기기

디버깅 경험에 대한 피드백을 주시면 감사하겠습니다!

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack 초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받아 저희 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에서 개발자에게 직접 피드백을 제공하세요.
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에 피드백을 제공하세요.

## 다음 단계

* 이 [YouTube 비디오](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)에서 Kotlin/Wasm 디버깅 실습을 확인하세요.
* `kotlin-wasm-examples` 저장소에서 Kotlin/Wasm 예제를 시도해보세요:
   * [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)