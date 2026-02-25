[//]: # (title: 偵錯 Kotlin/Wasm 程式碼)

<primary-label ref="beta"/> 

本教學示範如何使用 IntelliJ IDEA 和瀏覽器來偵錯使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 建置的 Kotlin/Wasm 應用程式。

## 開始之前

1. [設定您的 Kotlin Multiplatform 開發環境](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)。
2. 按照說明[建立一個目標為 Kotlin/Wasm 的 Kotlin Multiplatform 專案](wasm-get-started.md#create-a-project)。

> * IntelliJ IDEA 的 Kotlin/Wasm 程式碼偵錯功能自 IDE 2025.3 版本起提供，目前處於[早期體驗計劃 (EAP)](https://www.jetbrains.com/resources/eap/)階段，並正在走向穩定版本。如果您是在不同版本的 IntelliJ IDEA 中建立 `WasmDemo` 專案，請切換到 2025.3 版本並在該處開啟專案以繼續本教學。
> * 若要在 IntelliJ IDEA 中偵錯 Kotlin/Wasm 程式碼，您必須安裝 JavaScript Debugger 外掛程式。[參閱更多關於此外掛程式的資訊以及如何安裝。](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)
>
{style="note"}

## 在 IntelliJ IDEA 中偵錯

您建立的 Kotlin Multiplatform 專案包含一個由 Kotlin/Wasm 驅動的 Compose Multiplatform 應用程式。您可以直接在 IntelliJ IDEA 中偵錯此應用程式，無需額外配置。

1. 在 IntelliJ IDEA 中，開啟要偵錯的 Kotlin 檔案。在本教學中，我們將使用 Kotlin Multiplatform 專案以下目錄中的 `Greeting.kt` 檔案：

   `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2. 點擊行號以在您想要檢查的程式碼上設定中斷點。

   ![設定中斷點](wasm-breakpoints-intellij.png){width=650}

3. 在執行配置清單中，選擇 **composeApp[wasmJs]**。
4. 點擊畫面頂端的偵錯圖示，以偵錯模式執行程式碼。

   ![以偵錯模式執行](wasm-debug-run-configurations.png){width=600}

   應用程式啟動後，會在新的瀏覽器視窗中開啟。

   ![瀏覽器中的 Compose 應用程式](wasm-composeapp-browser.png){width=600}

   同時，**Debug** 面板會在 IntelliJ IDEA 中自動開啟。

   ![Compose 應用程式偵錯工具](wasm-debug-pane.png){width=600}

### 檢查您的應用程式

> 如果您正在[瀏覽器中偵錯](#debug-in-your-browser)，可以按照相同的步驟來檢查您的應用程式。
>
{style="note"}

1. 在應用程式的瀏覽器視窗中，點擊 **Click me!** 按鈕與應用程式互動。此操作會觸發程式碼執行，且當執行到達中斷點時，偵錯工具會暫停。

2. 在偵錯窗格中，使用偵錯控制按鈕來檢查中斷點處的變數和程式碼執行情況：
    * ![單步越過](wasm-debug-step-over.png){width=30}{type="joined"} **單步越過**：執行目前行並在下一行暫停。
    * ![單步進入](wasm-debug-step-into.png){width=30}{type="joined"} **單步進入**：深入調查函式內部。
    * ![步出](wasm-debug-step-out.png){width=30}{type="joined"} **步出**：執行程式碼直到退出目前函式。

3. 檢查 **Threads & Variables** 窗格。它可以幫助您追蹤函式呼叫的順序並精確定位任何錯誤的位置。

   ![檢查 Threads & Variables](wasm-debug-panes-intellij.png){width=700}

4. 修改程式碼並再次執行應用程式以驗證其運作情況。
5. 完成偵錯後，點擊帶有中斷點的行號以移除中斷點。

## 在瀏覽器中偵錯

您也可以在瀏覽器中偵錯此 Compose Multiplatform 應用程式，無需額外配置。

當您執行開發 Gradle 任務 (`*DevRun`) 時，Kotlin 會自動將原始碼檔案提供給瀏覽器，讓您可以設定中斷點、檢查變數並單步執行 Kotlin 程式碼。

在瀏覽器中提供 Kotlin/Wasm 專案原始碼的配置現在已包含在 Kotlin Gradle 外掛程式中。如果您之前在 `build.gradle.kts` 檔案中手動新增了此配置，則應將其移除以避免衝突。

> 本教學使用 Chrome 瀏覽器，但您應該也可以使用其他瀏覽器遵循這些步驟。如需更多資訊，請參閱[瀏覽器版本](wasm-configuration.md#browser-versions)。
>
{style="tip"}

1. 按照說明[執行 Compose Multiplatform 應用程式](wasm-get-started.md#run-the-application)。

2. 在應用程式的瀏覽器視窗中，按右鍵並選擇**檢查**操作以存取開發者工具。或者，您可以使用 **F12** 快速鍵或選擇 **檢視** | **開發人員** | **開發者工具**。

3. 切換到 **Sources** 索引標籤並選擇要偵錯的 Kotlin 檔案。在本教學中，我們將使用 `Greeting.kt` 檔案。

4. 點擊行號以在您想要檢查的程式碼上設定中斷點。只有行號顏色較深的行才能設定中斷點 — 在此範例中為 4、7、8 和 9。

   ![設定中斷點](wasm-breakpoints-browser.png){width=700}

5. 檢查您的應用程式，方式與[在 IntelliJ IDEA 中偵錯](#inspect-your-application)相似。

    在瀏覽器中進行偵錯時，用於追蹤函式呼叫順序並定位錯誤的窗格為 **Scope** 和 **Call Stack**。

   ![檢查呼叫堆疊](wasm-debug-scope.png){width=450}

### 使用自訂格式化程序

在瀏覽器中偵錯 Kotlin/Wasm 程式碼時，自訂格式化程序有助於以更使用者友善且易於理解的方式顯示和定位變數值。

在 Kotlin/Wasm 開發組建中，自訂格式化程序預設為啟用，但您仍需確保在瀏覽器的開發者工具中已啟用自訂格式化程序：

* 在 Chrome DevTools 中，於 **Settings | Preferences | Console** 找到 **Custom formatters** 核取方塊：

  ![在 Chrome 中啟用自訂格式化程序](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中，於 **Settings | Advanced settings** 找到 **Enable custom formatters** 核取方塊：

  ![在 Firefox 中啟用自訂格式化程序](wasm-custom-formatters-firefox.png){width=400}

此功能使用[自訂格式化程序 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)，並支援 Firefox 與基於 Chromium 的瀏覽器。

鑑於自訂格式化程序預設僅適用於 Kotlin/Wasm 開發組建，如果您想在生產組建中使用它們，則需要調整 Gradle 配置。將以下編譯器選項新增至 `wasmJs {}` 區塊：

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

## 留下回饋

我們非常感謝您對偵錯體驗的任何回饋！

* ![Slack](slack.svg){width=25}{type="joined"} Slack：[獲取 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並在我們的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道中直接向開發者提供回饋。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供您的回饋。

## 下一步？

* 在這段 [YouTube 影片](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)中觀看 Kotlin/Wasm 偵錯的實際操作。
* 嘗試更多 Kotlin/Wasm 範例：
  * [KotlinConf 應用程式](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 圖片檢視器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack 應用程式](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 範例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 範例](https://github.com/Kotlin/kotlin-wasm-compose-template)