---
title: "開始使用 Kotlin/Wasm 與 Compose Multiplatform"
---
:::note
Kotlin/Wasm 處於 [Alpha](components-stability) 階段。它隨時可能變更。

[加入 Kotlin/Wasm 社群。](https://slack-chats.kotlinlang.org/c/webassembly)

:::

本教學將示範如何在 IntelliJ IDEA 中執行使用 [Kotlin/Wasm](wasm-overview) 的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式，並產生成品以作為網站發佈在 [GitHub Pages](https://pages.github.com/) 上。

## 開始之前

使用 Kotlin Multiplatform 精靈建立專案：

1. 開啟 [Kotlin Multiplatform 精靈](https://kmp.jetbrains.com/#newProject)。
2. 在 **New Project**（新增專案）標籤上，依照您的喜好變更專案名稱和 ID。在本教學中，我們將名稱設定為 "WasmDemo"，ID 設定為 "wasm.project.demo"。

   > 這些是專案目錄的名稱和 ID。您也可以保持它們不變。
   >
   

3. 選擇 **Web** 選項。請確保未選擇其他選項。
4. 點擊 **Download**（下載）按鈕並解壓縮產生的封存檔。

<img src="/img/wasm-compose-web-wizard.png" alt="Kotlin Multiplatform wizard" width="400" style={{verticalAlign: 'middle'}}/>

## 在 IntelliJ IDEA 中開啟專案

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的歡迎畫面中，點擊 **Open**（開啟）或在選單列中選擇 **File | Open**（檔案 | 開啟）。
3. 導覽至解壓縮後的 "WasmDemo" 資料夾，然後點擊 **Open**（開啟）。

## 執行應用程式

1. 在 IntelliJ IDEA 中，透過選擇 **View**（檢視）| **Tool Windows**（工具視窗）| **Gradle** 來開啟 **Gradle** 工具視窗。
   
   專案載入後，您可以在 Gradle 工具視窗中找到 Gradle 任務。

   > 您需要至少 Java 11 作為 Gradle JVM，才能成功載入任務。
   >
   

2. 在 **composeApp** | **Tasks**（任務）| **kotlin browser**（kotlin 瀏覽器）中，選擇並執行 **wasmJsBrowserDevelopmentRun** 任務。

   <img src="/img/wasm-gradle-task-window.png" alt="Run the Gradle task" width="600" style={{verticalAlign: 'middle'}}/>

   或者，您可以從 `WasmDemo` 根目錄的終端機中執行以下命令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun -t
   ```

3. 應用程式啟動後，在您的瀏覽器中開啟以下 URL：

   ```bash
   http://localhost:8080/
   ```

   > 埠號可能會有所不同，因為 8080 埠可能無法使用。您可以在 Gradle 建置主控台中找到實際列印出的埠號。
   >
   

   您會看到一個 "Click me!"（點我！）按鈕。點擊它：

   <img src="/img/wasm-composeapp-browser-clickme.png" alt="Click me" width="650" style={{verticalAlign: 'middle'}}/>

   現在您會看到 Compose Multiplatform 的標誌：

   <img src="/img/wasm-composeapp-browser.png" alt="Compose app in browser" width="650" style={{verticalAlign: 'middle'}}/>

## 產生成品

在 **composeApp** | **Tasks**（任務）| **kotlin browser**（kotlin 瀏覽器）中，選擇並執行 **wasmJsBrowserDistribution** 任務。

<img src="/img/wasm-gradle-task-window-compose.png" alt="Run the Gradle task" width="600" style={{verticalAlign: 'middle'}}/>

或者，您可以從 `WasmDemo` 根目錄的終端機中執行以下命令：

```bash
./gradlew wasmJsBrowserDistribution
```

應用程式任務完成後，您可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目錄中找到產生的成品：

<img src="/img/wasm-composeapp-directory.png" alt="Artifacts directory" width="600" style={{verticalAlign: 'middle'}}/>

## 發佈在 GitHub Pages 上

1. 將 `productionExecutable` 目錄中的所有內容複製到您要建立網站的儲存庫中。
2. 按照 GitHub 的說明來[建立您的網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)。

   > 將變更推送至 GitHub 後，最多可能需要 10 分鐘才能將變更發佈到您的網站。
   >
   

3. 在瀏覽器中，導覽至您的 GitHub Pages 網域。

   <img src="/img/wasm-composeapp-github-clickme.png" alt="Navigate to GitHub pages" width="650" style={{verticalAlign: 'middle'}}/>

   恭喜！您已將您的成品發佈在 GitHub Pages 上。

## 接下來呢？

在 Kotlin Slack 中加入 Kotlin/Wasm 社群：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="/img/join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" /></a>

嘗試更多 Kotlin/Wasm 範例：

* [Compose 圖片檢視器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack 應用程式](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Compose 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
  ```