[//]: # (title: Kotlin/Wasm 및 Compose Multiplatform 시작하기)

<primary-label ref="beta"/> 

이 튜토리얼에서는 IntelliJ IDEA에서 [](wasm-overview.md)을 활용한 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 앱을 실행하고, 웹사이트의 일부로 게시할 아티팩트(artifact)를 생성하는 방법을 설명합니다.

## 프로젝트 생성하기

1. [Kotlin Multiplatform 개발을 위한 환경을 설정](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)하세요.
2. IntelliJ IDEA에서 **File | New | Project**를 선택합니다.
3. 왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.

   > Kotlin Multiplatform IDE 플러그인을 사용하지 않는 경우, [KMP 웹 마법사](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true)를 사용하여 동일한 프로젝트를 생성할 수 있습니다.
   >
   {style="note"}

4. **New Project** 창에서 다음 필드를 지정합니다.

   * **Name:** WasmDemo
   * **Group:** wasm.project.demo
   * **Artifact:** wasmdemo

   > 웹 마법사를 사용하는 경우, Project Name으로 "WasmDemo"를, Project ID로 "wasm.project.demo"를 지정하세요.
   >
   {style="note"}

5. **Web** 타겟과 **Share UI** 탭을 선택합니다. 다른 옵션이 선택되지 않았는지 확인하세요.
6. **Create**를 클릭합니다.

   ![Kotlin Multiplatform 마법사](wasm-kmp-wizard.png){width=600}

## 애플리케이션 실행하기

프로젝트가 로드되면 실행 구성 목록에서 **composeApp [wasmJs]**를 선택하고 **Run**을 클릭합니다.

![웹에서 Compose Multiplatform 앱 실행](compose-run-web-black.png){width=300}

웹 애플리케이션이 브라우저에서 자동으로 열립니다. 또는 실행이 완료된 후 브라우저에서 다음 URL을 직접 열 수 있습니다.

```shell
   http://localhost:8080/
```
> 8080 포트를 사용할 수 없는 경우 포트 번호가 달라질 수 있습니다.
> 실제 포트 번호는 Gradle 빌드 출력 결과에서 확인할 수 있습니다.
>
{style="tip"}

"Click me!" 버튼을 클릭해 보세요.

![Click me 버튼](wasm-composeapp-browser-clickme.png){width=600}

Compose Multiplatform 로고가 나타납니다.

![브라우저의 Compose 앱](wasm-composeapp-browser.png){width=600}

## 아티팩트 생성하기

웹사이트에 게시할 프로젝트 아티팩트를 생성합니다.

1. **View** | **Tool Windows** | **Gradle**을 선택하여 **Gradle** 도구 창을 엽니다.
2. **wasmdemo** | **Tasks** | **kotlin browser**에서 **wasmJsBrowserDistribution** 태스크를 선택하여 실행합니다.

   > 태스크를 성공적으로 로드하려면 Gradle JVM으로 적어도 Java 11 이상이 필요하며, 일반적으로 Compose Multiplatform 프로젝트에는 Java 17 이상을 권장합니다.
   >
   {style="note"}

   ![Gradle 태스크 실행](wasm-gradle-task-window-compose.png){width=400}

   또는 `WasmDemo` 루트 디렉터리의 터미널에서 다음 명령을 실행할 수도 있습니다.

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

애플리케이션 태스크가 완료되면 `composeApp/build/dist/wasmJs/productionExecutable` 디렉터리에서 생성된 아티팩트를 확인할 수 있습니다.

![아티팩트 디렉터리](wasm-composeapp-directory.png){width=400}

## 애플리케이션 게시하기

생성된 아티팩트를 사용하여 Kotlin/Wasm 애플리케이션을 배포하세요. 선호하는 게시 옵션을 선택하고 안내에 따라 아티팩트를 배포합니다. 몇 가지 대안은 다음과 같습니다.

* [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

사이트가 생성되면 브라우저를 열고 해당 플랫폼의 페이지 도메인으로 이동합니다. 예를 들어 GitHub Pages의 경우 다음과 같습니다.

   ![GitHub Pages로 이동](wasm-composeapp-github-clickme.png){width=600}

   축하합니다! 아티팩트 게시를 완료했습니다.

## 다음 단계

* [Compose Multiplatform을 사용하여 iOS와 Android 간에 UI를 공유하는 방법 알아보기](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
* 더 많은 Kotlin/Wasm 예제 살펴보기:

  * [KotlinConf 애플리케이션](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 이미지 뷰어](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Node.js 예제](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 예제](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 예제](https://github.com/Kotlin/kotlin-wasm-compose-template)

* Kotlin Slack의 Kotlin/Wasm 커뮤니티에 참여하세요:

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Kotlin/Wasm 커뮤니티 참여하기" style="block"/></a>