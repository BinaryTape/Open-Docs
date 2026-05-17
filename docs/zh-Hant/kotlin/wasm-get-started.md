[//]: # (title: Kotlin/Wasm 與 Compose Multiplatform 快速入門)

<primary-label ref="beta"/> 

本教學將示範如何在 IntelliJ IDEA 中透過 [](wasm-overview.md) 執行 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式，並產生可作為網站一部分發佈的構件。

## 建立專案

1. [設定您的 Kotlin Multiplatform 開發環境](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，選擇 **File | New | Project**。
3. 在左側面板中，選擇 **Kotlin Multiplatform**。

   > 如果您未使用 Kotlin Multiplatform IDE 外掛程式，可以使用 [KMP web wizard](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true) 產生相同的專案。
   >
   {style="note"}

4. 在 **New Project** 視窗中指定以下欄位：

   * **Name：** WasmDemo
   * **Group：** wasm.project.demo

   > 如果您使用 web wizard，請指定「WasmDemo」作為 **Project Name**，並指定「wasm.project.demo」作為 **Project ID**。
   >
   {style="note"}

5. 選擇 **Web** 目標並切換至 **Share UI** 分頁。確保未勾選其他選項。
6. 點擊 **Create**。

   ![Kotlin Multiplatform 精靈](wasm-kmp-wizard.png){width=600}

## 執行應用程式

專案載入後，在執行組態清單中選擇 **webApp [wasmJs]** 並點擊 **Run**。

![在 Web 上執行 Compose Multiplatform 應用程式](compose-run-web-light.png){width=300}

Web 應用程式會自動在瀏覽器中開啟。或者，您也可以在執行完成後於瀏覽器中開啟以下網址：

```shell
   http://localhost:8080/
```
> 連接埠號碼可能有所不同，因為 8080 連接埠可能已被占用。
> 您可以在 Gradle 建置的輸出中找到實際的連接埠號碼。
>
{style="tip"}

點擊「Click me!」按鈕：

![點擊按鈕](wasm-composeapp-browser-clickme.png){width=600}

隨即會顯示 Compose Multiplatform 標誌：

![瀏覽器中的 Compose 應用程式](wasm-composeapp-browser.png){width=600}

## 產生構件

產生專案構件以發佈至網站：

1. 透過選擇 **View** | **Tool Windows** | **Gradle** 開啟 **Gradle** 工具視窗。
2. 在 **wasmdemo** | **Tasks** | **kotlin browser** 中，選擇並執行 **wasmJsBrowserDistribution** 任務。

   > 您至少需要 Java 11 作為 Gradle JVM 才能成功載入任務，通常我們建議 Compose Multiplatform 專案至少使用 Java 17。
   >
   {style="note"}

   ![執行 Gradle 任務](wasm-gradle-task-window-compose.png){width=400}

   或者，您也可以從 `WasmDemo` 根目錄在終端執行以下指令：

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

當應用程式任務完成後，您可以在 `webApp/build/dist/wasmJs/productionExecutable` 目錄中找到產生的構件：

![構件目錄](wasm-composeapp-directory.png){width=400}

## 發佈應用程式

使用產生的構件來部署您的 Kotlin/Wasm 應用程式。選擇您偏好的發佈方式，並按照指示部署構件。可用的選項包括：

* [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

建立網站後，開啟瀏覽器並導覽至該平台的頁面網域。例如使用 GitHub pages：

   ![導覽至 GitHub pages](wasm-composeapp-github-clickme.png){width=600}

   恭喜！您已成功發佈構件。

## 後續步驟

* [了解如何使用 Compose Multiplatform 在 iOS 與 Android 之間共享 UI](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
* 嘗試更多 Kotlin/Wasm 範例：

  * [KotlinConf 應用程式](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 圖片檢視器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 範例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 範例](https://github.com/Kotlin/kotlin-wasm-compose-template)

* 加入 Kotlin Slack 的 Kotlin/Wasm 社群：

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 社群" style="block"/></a>