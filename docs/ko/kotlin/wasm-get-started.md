[//]: # (title: Kotlin/Wasm 및 Compose Multiplatform 시작하기)

> Kotlin/Wasm은 [알파(Alpha) 단계](components-stability.md)입니다. 언제든지 변경될 수 있습니다.
> 
> [Kotlin/Wasm 커뮤니티에 참여하세요.](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

이 튜토리얼에서는 [Kotlin/Wasm](wasm-overview.md)을 사용하여 IntelliJ IDEA에서 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 앱을 실행하고, [GitHub Pages](https://pages.github.com/)에 사이트로 게시할 아티팩트를 생성하는 방법을 보여줍니다.

## 시작하기 전에

Kotlin Multiplatform 위자드를 사용하여 프로젝트를 생성합니다.

1.  [Kotlin Multiplatform 위자드](https://kmp.jetbrains.com/#newProject)를 엽니다.
2.  **새 프로젝트(New Project)** 탭에서 프로젝트 이름과 ID를 원하는 대로 변경합니다. 이 튜토리얼에서는 이름을 "WasmDemo", ID를 "wasm.project.demo"로 설정합니다.

    > 이것은 프로젝트 디렉터리의 이름과 ID입니다. 그대로 두셔도 됩니다.
    >
    {style="tip"}

3.  **Web** 옵션을 선택합니다. 다른 옵션은 선택되지 않았는지 확인하세요.
4.  **Download** 버튼을 클릭하고 생성된 아카이브의 압축을 해제합니다.

    ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=400}

## IntelliJ IDEA에서 프로젝트 열기

1.  최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 다운로드하여 설치합니다.
2.  IntelliJ IDEA 시작 화면에서 **열기(Open)**를 클릭하거나 메뉴 바에서 **파일(File) | 열기(Open)**를 선택합니다.
3.  압축이 해제된 "WasmDemo" 폴더로 이동한 다음 **열기(Open)**를 클릭합니다.

## 애플리케이션 실행

1.  IntelliJ IDEA에서 **보기(View)** | **도구 창(Tool Windows)** | **Gradle**을 선택하여 **Gradle** 도구 창을 엽니다.
    
    프로젝트가 로드되면 Gradle 도구 창에서 Gradle 작업을 찾을 수 있습니다.

    > 작업이 성공적으로 로드되려면 Gradle JVM으로 Java 11 이상이 필요합니다.
    >
    {style="note"}

2.  **wasmdemo** | **작업(Tasks)** | **kotlin browser**에서 **wasmJsBrowserDevelopmentRun** 작업을 선택하고 실행합니다.

    ![Run the Gradle task](wasm-gradle-task-window.png){width=400}

    또는 `WasmDemo` 루트 디렉터리에서 터미널에 다음 명령을 실행할 수 있습니다.

    ```bash
    ./gradlew wasmJsBrowserDevelopmentRun -t
    ```

3.  애플리케이션이 시작되면 브라우저에서 다음 URL을 엽니다.

    ```bash
    http://localhost:8080/
    ```

    > 8080 포트를 사용할 수 없을 수 있으므로 포트 번호가 다를 수 있습니다. 실제 포트 번호는 Gradle 빌드 콘솔에 출력됩니다.
    >
    {style="tip"}

    "Click me!" 버튼이 표시됩니다. 클릭하세요.

    ![Click me](wasm-composeapp-browser-clickme.png){width=650}

    이제 Compose Multiplatform 로고가 표시됩니다.

    ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## 아티팩트 생성

**wasmdemo** | **작업(Tasks)** | **kotlin browser**에서 **wasmJsBrowserDistribution** 작업을 선택하고 실행합니다.

![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

또는 `WasmDemo` 루트 디렉터리에서 터미널에 다음 명령을 실행할 수 있습니다.

```bash
./gradlew wasmJsBrowserDistribution
```

애플리케이션 작업이 완료되면 생성된 아티팩트를 `composeApp/build/dist/wasmJs/productionExecutable` 디렉터리에서 찾을 수 있습니다.

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## GitHub Pages에 게시

1.  `productionExecutable` 디렉터리의 모든 내용을 사이트를 만들고자 하는 저장소에 복사합니다.
2.  [사이트 생성](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)을 위한 GitHub의 지침을 따르세요.

    > 변경 사항을 GitHub에 푸시한 후 사이트에 게시되기까지 최대 10분이 소요될 수 있습니다.
    >
    {style="note"}

3.  브라우저에서 GitHub Pages 도메인으로 이동합니다.

    ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=650}

    축하합니다! GitHub Pages에 아티팩트를 게시했습니다.

## 다음 단계는 무엇인가요?

*   [Compose Multiplatform을 사용하여 iOS와 Android 간에 UI를 공유하는 방법 알아보기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
*   더 많은 Kotlin/Wasm 예제를 사용해 보세요:

    *   [Compose 이미지 뷰어](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
    *   [Jetsnack 애플리케이션](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
    *   [Node.js 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
    *   [WASI 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
    *   [Compose 예제](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
*   Kotlin Slack의 Kotlin/Wasm 커뮤니티에 참여하세요:

    <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Kotlin/Wasm 커뮤니티에 참여하세요" style="block"/></a>