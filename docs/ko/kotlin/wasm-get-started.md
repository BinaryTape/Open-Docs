[//]: # (title: Kotlin/Wasm 및 Compose Multiplatform 시작하기)

> Kotlin/Wasm은 현재 [알파](components-stability.md) 단계입니다. 언제든지 변경될 수 있습니다.
> 
> [Kotlin/Wasm 커뮤니티에 참여하세요.](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

이 튜토리얼은 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 앱을 [Kotlin/Wasm](wasm-overview.md)과 함께 IntelliJ IDEA에서 실행하고, [GitHub Pages](https://pages.github.com/)에 사이트로 게시하기 위한 아티팩트를 생성하는 방법을 보여줍니다.

## 시작하기 전에

Kotlin Multiplatform 마법사를 사용하여 프로젝트를 생성합니다:

1. [Kotlin Multiplatform 마법사](https://kmp.jetbrains.com/#newProject)를 엽니다.
2. **New Project** 탭에서 프로젝트 이름과 ID를 원하는 대로 변경합니다. 이 튜토리얼에서는 이름을 "WasmDemo"로, ID를 "wasm.project.demo"로 설정합니다.

   > 이것들은 프로젝트 디렉터리의 이름과 ID입니다. 그대로 두셔도 됩니다.
   >
   {style="tip"}

3. **Web** 옵션을 선택합니다. 다른 옵션이 선택되지 않았는지 확인합니다.
4. **Download** 버튼을 클릭하고 결과 아카이브의 압축을 풉니다.

   ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=400}

## IntelliJ IDEA에서 프로젝트 열기

1. [IntelliJ IDEA](https://www.jetbrains.com/idea/)의 최신 버전을 다운로드하여 설치합니다.
2. IntelliJ IDEA의 시작 화면에서 **Open**을 클릭하거나 메뉴 바에서 **File | Open**을 선택합니다.
3. 압축 해제된 "WasmDemo" 폴더로 이동하여 **Open**을 클릭합니다.

## 애플리케이션 실행

1. IntelliJ IDEA에서 **View** | **Tool Windows** | **Gradle**을 선택하여 **Gradle** 도구 창을 엽니다.
   
   프로젝트가 로드되면 Gradle 도구 창에서 Gradle 작업을 찾을 수 있습니다.

   > 작업이 성공적으로 로드되려면 Gradle JVM으로 최소 Java 11이 필요합니다.
   >
   {style="note"}

2. **wasmdemo** | **Tasks** | **kotlin browser**에서 **wasmJsBrowserDevelopmentRun** 작업을 선택하여 실행합니다.

   ![Run the Gradle task](wasm-gradle-task-window.png){width=400}

   또는 `WasmDemo` 루트 디렉터리에서 터미널에 다음 명령어를 실행할 수 있습니다:

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun -t
   ```

3. 애플리케이션이 시작되면 브라우저에서 다음 URL을 엽니다:

   ```bash
   http://localhost:8080/
   ```

   > 8080 포트를 사용할 수 없을 경우 포트 번호는 달라질 수 있습니다. 실제 포트 번호는 Gradle 빌드 콘솔에 출력됩니다.
   >
   {style="tip"}

   “Click me!” 버튼이 보입니다. 클릭합니다:

   ![Click me](wasm-composeapp-browser-clickme.png){width=650}

   이제 Compose Multiplatform 로고가 보입니다:

   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## 아티팩트 생성

**wasmdemo** | **Tasks** | **kotlin browser**에서 **wasmJsBrowserDistribution** 작업을 선택하여 실행합니다.

![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

또는 `WasmDemo` 루트 디렉터리에서 터미널에 다음 명령어를 실행할 수 있습니다:

```bash
./gradlew wasmJsBrowserDistribution
```

애플리케이션 작업이 완료되면 생성된 아티팩트는 `composeApp/build/dist/wasmJs/productionExecutable` 디렉터리에서 찾을 수 있습니다:

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## GitHub Pages에 게시

1. `productionExecutable` 디렉터리의 모든 내용을 사이트를 생성하려는 저장소로 복사합니다.
2. GitHub의 지침에 따라 [사이트를 생성합니다](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site).

   > GitHub에 변경 사항을 푸시한 후 사이트에 변경 사항이 게시되기까지 최대 10분이 걸릴 수 있습니다.
   >
   {style="note"}

3. 브라우저에서 GitHub Pages 도메인으로 이동합니다.

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=650}

   축하합니다! GitHub Pages에 아티팩트를 게시했습니다.

## 다음 단계는?

Kotlin Slack의 Kotlin/Wasm 커뮤니티에 참여하세요:

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>

더 많은 Kotlin/Wasm 예시를 살펴보세요:

*   [Compose 이미지 뷰어](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
*   [Jetsnack 애플리케이션](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
*   [Node.js 예시](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
*   [WASI 예시](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
*   [Compose 예시](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)