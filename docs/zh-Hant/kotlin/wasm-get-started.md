[//]: # (title: 開始使用 Kotlin/Wasm 與 Compose Multiplatform)

> Kotlin/Wasm 處於 [Alpha](components-stability.md) 階段，可能隨時變更。
> 
> [加入 Kotlin/Wasm 社群。](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

本教學課程示範如何在 IntelliJ IDEA 中使用 [Kotlin/Wasm](wasm-overview.md) 執行 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式，並產生可在 [GitHub Pages](https://pages.github.com/) 上發佈為網站的成果物。

## 開始之前

使用 Kotlin Multiplatform 精靈建立專案：

1. 開啟 [Kotlin Multiplatform 精靈](https://kmp.jetbrains.com/#newProject)。
2. 在 **New Project** 索引標籤上，將專案名稱和 ID 變更為您的偏好設定。在本教學課程中，我們將名稱設為「WasmDemo」，ID 設為「wasm.project.demo」。

   > 這些是專案目錄的名稱和 ID。您也可以保持原樣。
   >
   {style="tip"}

3. 選取 **Web** 選項。請確保沒有選取其他選項。
4. 點擊 **Download** 按鈕並解壓縮產生的壓縮檔。

   ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=400}

## 在 IntelliJ IDEA 中開啟專案

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的歡迎畫面中，點擊 **Open** 或在選單列中選取 **File | Open**。
3. 導覽至已解壓縮的「WasmDemo」資料夾並點擊 **Open**。

## 執行應用程式

1. 在 IntelliJ IDEA 中，透過選取 **View** | **Tool Windows** | **Gradle** 開啟 **Gradle** 工具視窗。
   
   專案載入後，您可以在 Gradle 工具視窗中找到 Gradle 任務。

   > 您的 Gradle JVM 需要至少 Java 11 才能成功載入任務。
   >
   {style="note"}

2. 在 **wasmdemo** | **Tasks** | **kotlin browser** 中，選取並執行 **wasmJsBrowserDevelopmentRun** 任務。

   ![Run the Gradle task](wasm-gradle-task-window.png){width=400}

   或者，您可以在 `WasmDemo` 根目錄的終端機中執行以下指令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun -t
   ```

3. 應用程式啟動後，在您的瀏覽器中開啟以下 URL：

   ```bash
   http://localhost:8080/
   ```

   > 連接埠號碼可能因 8080 連接埠可能無法使用而有所不同。您可以在 Gradle 建置主控台中找到實際的連接埠號碼。
   >
   {style="tip"}

   您會看到一個「Click me!」按鈕。點擊它：

   ![Click me](wasm-composeapp-browser-clickme.png){width=650}

   現在您會看到 Compose Multiplatform 標誌：

   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## 產生成果物

在 **wasmdemo** | **Tasks** | **kotlin browser** 中，選取並執行 **wasmJsBrowserDistribution** 任務。

![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

或者，您可以在 `WasmDemo` 根目錄的終端機中執行以下指令：

```bash
./gradlew wasmJsBrowserDistribution
```

應用程式任務完成後，您可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目錄中找到產生的成果物：

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## 發佈到 GitHub Pages

1. 將 `productionExecutable` 目錄中的所有內容複製到您要建立網站的儲存庫中。
2. 依照 GitHub 的說明[建立您的網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)。

   > 將變更推送到 GitHub 後，您的網站可能需要長達 10 分鐘才能發佈。
   >
   {style="note"}

3. 在瀏覽器中，導覽至您的 GitHub Pages 網域。

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=650}

   恭喜！您已成功在 GitHub Pages 上發佈您的成果物。

## 接下來呢？

* [了解如何使用 Compose Multiplatform 在 iOS 和 Android 之間共用 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
* 嘗試更多 Kotlin/Wasm 範例：

  * Compose image viewer
  * Jetsnack application
  * Node.js example
  * WASI example
  * Compose example
* 在 Kotlin Slack 中加入 Kotlin/Wasm 社群：

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>