[//]: # (title: 開始使用 Kotlin/Wasm 與 Compose Multiplatform)

<primary-label ref="beta"/> 

本教學課程示範如何在 IntelliJ IDEA 中使用 [Kotlin/Wasm](wasm-overview.md) 執行 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式，並產生可用於發佈為網站的成果物。

## 建立專案

1. [設定您的 Kotlin Multiplatform 開發環境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，選取 **File | New | Project**。
3. 在左側面板中，選取 **Kotlin Multiplatform**。

   > 如果您未使用 Kotlin Multiplatform IDE 外掛程式，可以使用 [KMP 網頁精靈](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true) 產生相同的專案。
   >
   {style="note"}

4. 在 **New Project** 視窗中指定以下欄位：

   * **名稱：** WasmDemo
   * **群組：** wasm.project.demo
   * **成果物：** wasmdemo

   > 如果您使用網頁精靈，請將「WasmDemo」指定為專案名稱，並將「wasm.project.demo」指定為專案 ID。
   >
   {style="note"}

5. 選取 **Web** 目標和 **Share UI** 索引標籤。請確保沒有選取其他選項。
6. 點擊 **Create**。

   ![Kotlin Multiplatform wizard](wasm-kmp-wizard.png){width=600}

## 執行應用程式

專案載入後，從執行設定列表中選取 **composeApp [wasmJs]**，然後點擊 **Run**。

![Run the Compose Multiplatform app on web](compose-run-web-black.png){width=300}

網頁應用程式將自動在您的瀏覽器中開啟。或者，在執行完成後，您也可以在瀏覽器中開啟以下 URL：

```shell
   http://localhost:8080/
```
> 連接埠號碼可能因 8080 連接埠可能無法使用而有所不同。您可以在 Gradle 建置主控台中找到實際的連接埠號碼。
>
{style="tip"}

點擊「Click me!」按鈕：

![Click me](wasm-composeapp-browser-clickme.png){width=600}

它會顯示 Compose Multiplatform 標誌：

![Compose app in browser](wasm-composeapp-browser.png){width=600}

## 產生成果物

產出您專案的成果物，以發佈到網站上：

1. 透過選取 **View** | **Tool Windows** | **Gradle** 開啟 **Gradle** 工具視窗。
2. 在 **wasmdemo** | **Tasks** | **kotlin browser** 中，選取並執行 **wasmJsBrowserDistribution** 任務。

   > 您的 Gradle JVM 需要至少 Java 11 才能成功載入任務，而一般而言，對於 Compose Multiplatform 專案，我們建議至少 Java 17。
   >
   {style="note"}

   ![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

   或者，您可以在 `WasmDemo` 根目錄的終端機中執行以下指令：

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

應用程式任務完成後，您可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目錄中找到產生的成果物：

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## 發佈應用程式

使用產生的成果物來部署您的 Kotlin/Wasm 應用程式。選擇您偏好的發佈選項，並依照說明部署成果物。一些替代方案有：

* [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

您的網站建立後，開啟瀏覽器並導覽至您平台的頁面網域。例如，GitHub Pages：

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=600}

   恭喜！您已發佈您的成果物。

## 接下來呢？

* [了解如何使用 Compose Multiplatform 在 iOS 和 Android 之間共用 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
* 嘗試更多 Kotlin/Wasm 範例：

  * [KotlinConf 應用程式](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 圖片檢視器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack 應用程式](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 範例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 範例](https://github.com/Kotlin/kotlin-wasm-compose-template)

* 在 Kotlin Slack 中加入 Kotlin/Wasm 社群：

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>