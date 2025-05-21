---
title: "除錯 Kotlin/Wasm 程式碼"
---
:::note
Kotlin/Wasm 處於 [Alpha](components-stability) 階段。 它隨時可能變更。

:::

本教學將示範如何使用瀏覽器來偵錯使用 Kotlin/Wasm 建構的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式。

## 開始之前

使用 Kotlin Multiplatform 精靈建立專案：

1. 開啟 [Kotlin Multiplatform 精靈](https://kmp.jetbrains.com/#newProject)。
2. 在 **New Project (新增專案)** 標籤上，依照您的偏好變更專案名稱和 ID。 在本教學中，我們將名稱設定為 "WasmDemo"，ID 設定為 "wasm.project.demo"。

   > 這些是專案目錄的名稱和 ID。 您也可以保留預設值。
   >
   

3. 選取 **Web** 選項。 確定未選取其他選項。
4. 按一下 **Download (下載)** 按鈕，然後解壓縮產生的封存檔。

<img src="/img/wasm-compose-web-wizard.png" alt="Kotlin Multiplatform wizard" width="400" style={{verticalAlign: 'middle'}}/>

## 在 IntelliJ IDEA 中開啟專案

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的歡迎畫面中，按一下 **Open (開啟)**，或在功能表列中選取 **File | Open (檔案 | 開啟)**。
3. 導覽至解壓縮的 "WasmDemo" 資料夾，然後按一下 **Open (開啟)**。

## 執行應用程式

1. 在 IntelliJ IDEA 中，選取 **View (檢視)** | **Tool Windows (工具視窗)** | **Gradle**，開啟 **Gradle** 工具視窗。

   > 您需要至少 Java 11 作為 Gradle JVM，才能成功載入工作。
   >
   

2. 在 **composeApp** | **Tasks (工作)** | **kotlin browser** 中，選取並執行 **wasmJsBrowserDevelopmentRun** 工作。

   <img src="/img/wasm-gradle-task-window.png" alt="Run the Gradle task" width="550" style={{verticalAlign: 'middle'}}/>

   或者，您可以在終端機中從 `WasmDemo` 根目錄執行下列命令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. 應用程式啟動後，在瀏覽器中開啟下列 URL：

   ```bash
   http://localhost:8080/
   ```

   > 連接埠號碼可能會有所不同，因為 8080 連接埠可能無法使用。 您可以在 Gradle 組建主控台中找到列印的實際連接埠號碼。
   >
   

   您會看到一個 "Click me! (點我！)" 按鈕。 按一下它：

   <img src="/img/wasm-composeapp-browser-clickme.png" alt="Click me" width="550" style={{verticalAlign: 'middle'}}/>

   現在您會看到 Compose Multiplatform 標誌：

   <img src="/img/wasm-composeapp-browser.png" alt="Compose app in browser" width="550" style={{verticalAlign: 'middle'}}/>

## 在瀏覽器中偵錯

:::note
目前，偵錯僅適用於您的瀏覽器。 未來，您將能夠在 [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) 中偵錯程式碼。

:::

您可以直接在瀏覽器中偵錯此 Compose Multiplatform 應用程式，而無需其他組態。

但是，對於其他專案，您可能需要在 Gradle 組建檔案中設定其他設定。 如需有關如何設定瀏覽器以進行偵錯的詳細資訊，請展開下一個區段。

### 設定您的瀏覽器以進行偵錯

#### 啟用對專案來源的存取

依預設，瀏覽器無法存取偵錯所需的部分專案來源。 若要提供存取權，您可以設定 Webpack DevServer 以提供這些來源。 在 `ComposeApp` 目錄中，將下列程式碼片段新增至您的 `build.gradle.kts` 檔案。

將此匯入新增為最上層宣告：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

將此程式碼片段新增至位於 `kotlin{}` 內的 `wasmJs{}` 目標 DSL 和 `browser{}` 平台 DSL 中的 `commonWebpackConfig{}` 區塊內：

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

產生的程式碼區塊如下所示：

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
目前，您無法偵錯函式庫來源。
[我們將在未來支援此功能](https://youtrack.jetbrains.com/issue/KT-64685)。

:::

#### 使用自訂格式器

自訂格式器有助於在偵錯 Kotlin/Wasm 程式碼時，以更使用者友善且易於理解的方式顯示和尋找變數值。

依預設，會在開發組建中啟用自訂格式器，因此您不需要其他 Gradle 組態。

此功能在 Firefox 和 Chromium 型瀏覽器中受到支援，因為它使用 [自訂格式器 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)。

若要使用此功能，請確定在瀏覽器的開發人員工具中啟用自訂格式器：

* 在 Chrome DevTools 中，在 **Settings (設定) | Preferences (偏好設定) | Console (主控台)** 中尋找自訂格式器核取方塊：

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Enable custom formatters in Chrome" width="400" style={{verticalAlign: 'middle'}}/>

* 在 Firefox DevTools 中，在 **Settings (設定) | Advanced settings (進階設定)** 中尋找自訂格式器核取方塊：

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Enable custom formatters in Firefox" width="400" style={{verticalAlign: 'middle'}}/>

自訂格式器適用於 Kotlin/Wasm 開發組建。 如果您對生產組建有特定需求，則需要相應地調整 Gradle 組態。 將下列編譯器選項新增至 `wasmJs {}` 區塊：

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

啟用自訂格式器後，您可以繼續進行偵錯教學課程。

### 偵錯您的 Kotlin/Wasm 應用程式

:::tip
本教學課程使用 Chrome 瀏覽器，但您應該能夠使用其他瀏覽器依照這些步驟進行。 如需更多資訊，請參閱 [瀏覽器版本](wasm-troubleshooting#browser-versions)。

:::

1. 在應用程式的瀏覽器視窗中，按一下滑鼠右鍵並選取 **Inspect (檢查)** 動作以存取開發人員工具。
   或者，您可以使用 **F12** 快捷鍵或選取 **View (檢視)** | **Developer (開發人員)** | **Developer Tools (開發人員工具)**。

2. 切換到 **Sources (來源)** 標籤，然後選取要偵錯的 Kotlin 檔案。 在本教學課程中，我們將使用 `Greeting.kt` 檔案。

3. 按一下行號以在您要檢查的程式碼上設定中斷點。 只有具有較深數字的行才能有中斷點。

   <img src="/img/wasm-breakpoints.png" alt="Set breakpoints" width="600" style={{verticalAlign: 'middle'}}/>

4. 按一下 **Click me! (點我！)** 按鈕以與應用程式互動。 此動作會觸發程式碼的執行，並且偵錯工具會在執行到達中斷點時暫停。

5. 在偵錯窗格中，使用偵錯控制按鈕來檢查中斷點上的變數和程式碼執行：
   * <img src="/img/wasm-step-into.png" alt="Step into" width="30" style={{verticalAlign: 'middle'}}/> 逐步執行 (Step into) 以更深入地調查函式。
   * <img src="/img/wasm-step-over.png" alt="Step over" width="30" style={{verticalAlign: 'middle'}}/> 逐步略過 (Step over) 以執行目前行，然後在下一行暫停。
   * <img src="/img/wasm-step-out.png" alt="Step out" width="30" style={{verticalAlign: 'middle'}}/> 逐步跳出 (Step out) 以執行程式碼，直到它結束目前的函式。

   <img src="/img/wasm-debug-controls.png" alt="Debug controls" width="600" style={{verticalAlign: 'middle'}}/>

6. 檢查 **Call stack (呼叫堆疊)** 和 **Scope (範圍)** 窗格，以追蹤函式呼叫的順序並找出任何錯誤的位置。

   <img src="/img/wasm-debug-scope.png" alt="Check call stack" width="550" style={{verticalAlign: 'middle'}}/>

   為了改善變數值的視覺化，請參閱 [設定您的瀏覽器以進行偵錯](#configure-your-browser-for-debugging) 區段中的 _使用自訂格式器_。

7. 變更您的程式碼並再次 [執行應用程式](#run-the-application)，以驗證一切是否如預期般運作。
8. 按一下具有中斷點的行號以移除中斷點。

## 留下意見反應

我們將感謝您對偵錯體驗的任何意見反應！

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[取得 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)，並在我們的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道中直接向開發人員提供您的意見反應。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供您的意見反應。

## 接下來呢？

* 在此 [YouTube 影片](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s) 中查看 Kotlin/Wasm 偵錯的實際運作。
* 試用來自我們 `kotlin-wasm-examples` 儲存庫的 Kotlin/Wasm 範例：
   * [Compose 影像檢視器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack 應用程式](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)

  ```