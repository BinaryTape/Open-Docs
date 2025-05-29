[//]: # (title: 開始使用 Kotlin/Wasm 與 Compose Multiplatform)

> Kotlin/Wasm 處於 [Alpha](components-stability.md) 階段。它可能隨時變更。
> 
> [加入 Kotlin/Wasm 社群。](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

本教學示範如何執行一個 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式，搭配 [Kotlin/Wasm](wasm-overview.md) 在 IntelliJ IDEA 中，並產生發佈成品 (artifacts) 以便在 [GitHub pages](https://pages.github.com/) 上作為網站發佈。

## 開始之前

使用 Kotlin Multiplatform 精靈建立專案：

1. 開啟 [Kotlin Multiplatform 精靈](https://kmp.jetbrains.com/#newProject)。
2. 在 **New Project** 標籤頁上，將專案名稱和 ID 變更為您的偏好設定。在本教學中，我們將名稱設為 "WasmDemo"，ID 設為 "wasm.project.demo"。

   > 這些是專案目錄的名稱和 ID。您也可以保留它們不變。
   >
   {style="tip"}

3. 選取 **Web** 選項。確保沒有選取其他選項。
4. 按下 **Download** 按鈕並解壓縮產生的壓縮檔 (archive)。

   ![Kotlin Multiplatform 精靈](wasm-compose-web-wizard.png){width=400}

## 在 IntelliJ IDEA 中開啟專案

1. 下載並安裝最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的歡迎畫面 (Welcome screen) 上，點擊 **Open** 或在選單列中選擇 **File | Open**。
3. 導覽至解壓縮後的 "WasmDemo" 資料夾並點擊 **Open**。

## 執行應用程式

1. 在 IntelliJ IDEA 中，透過選擇 **View** | **Tool Windows** | **Gradle** 開啟 **Gradle** 工具視窗。
   
   一旦專案載入，您可以在 Gradle 工具視窗中找到 Gradle 任務 (tasks)。

   > 您需要至少 Java 11 作為您的 Gradle JVM，才能成功載入任務。
   >
   {style="note"}

2. 在 **wasmdemo** | **Tasks** | **kotlin browser** 中，選擇並執行 **wasmJsBrowserDevelopmentRun** 任務。

   ![執行 Gradle 任務](wasm-gradle-task-window.png){width=400}

   或者，您可以從 `WasmDemo` 根目錄在終端機 (terminal) 中執行以下指令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun -t
   ```

3. 應用程式啟動後，在瀏覽器中開啟以下 URL：

   ```bash
   http://localhost:8080/
   ```

   > 連接埠 (port) 號碼可能不同，因為 8080 連接埠可能不可用。您可以在 Gradle 建置控制台 (build console) 中找到實際的連接埠號碼。
   >
   {style="tip"}

   您會看到一個「Click me!」按鈕。點擊它：

   ![點擊我](wasm-composeapp-browser-clickme.png){width=650}

   現在您會看到 Compose Multiplatform 標誌：

   ![瀏覽器中的 Compose 應用程式](wasm-composeapp-browser.png){width=650}

## 產生發佈成品

在 **wasmdemo** | **Tasks** | **kotlin browser** 中，選擇並執行 **wasmJsBrowserDistribution** 任務。

![執行 Gradle 任務](wasm-gradle-task-window-compose.png){width=400}

或者，您可以從 `WasmDemo` 根目錄在終端機中執行以下指令：

```bash
./gradlew wasmJsBrowserDistribution
```

應用程式任務完成後，您可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目錄中找到產生的發佈成品：

![發佈成品目錄](wasm-composeapp-directory.png){width=400}

## 發佈到 GitHub pages

1. 將 `productionExecutable` 目錄中的所有內容複製到您要建立網站的儲存庫 (repository) 中。
2. 按照 GitHub 的說明 [建立您的網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)。

   > 將變更推送到 GitHub 後，您的網站可能需要長達 10 分鐘才能發佈變更。
   >
   {style="note"}

3. 在瀏覽器中，導覽至您的 GitHub pages 網域。

   ![導覽至 GitHub pages](wasm-composeapp-github-clickme.png){width=650}

   恭喜！您已將發佈成品發佈到 GitHub pages。

## 接下來

加入 Kotlin Slack 中的 Kotlin/Wasm 社群：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 社群" style="block"/></a>

嘗試更多 Kotlin/Wasm 範例：

* [Compose 圖片檢視器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack 應用程式](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Compose 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)