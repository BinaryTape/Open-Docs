[//]: # (title: 偵錯 Kotlin/Wasm 程式碼)

<primary-label ref="beta"/> 

本教學示範如何使用 IntelliJ IDEA 和瀏覽器
來偵錯您以 Kotlin/Wasm 建置的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式。

## 開始之前

1. [設定 Kotlin Multiplatform 開發環境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment)。
2. 按照說明 [建立一個以 Kotlin/Wasm 為目標的 Kotlin Multiplatform 專案](wasm-get-started.md#create-a-project)。

> * 在 IntelliJ IDEA 中偵錯 Kotlin/Wasm 程式碼從 IDE 2025.3 版本開始可用，目前處於 [搶先體驗計畫 (EAP)](https://www.jetbrains.com/resources/eap/) 階段，並將逐步趨於穩定。如果您是在不同版本的 IntelliJ IDEA 中建立 `WasmDemo` 專案，請切換到 2025.3 版本並在那裡開啟專案以繼續本教學。
> * 若要在 IntelliJ IDEA 中偵錯 Kotlin/Wasm 程式碼，您必須安裝 JavaScript Debugger 插件。 [請參閱有關該插件以及如何安裝它的更多資訊](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)。
>
{style="note"}

## 在 IntelliJ IDEA 中偵錯

您建立的 Kotlin Multiplatform 專案包含一個由 Kotlin/Wasm 支援的 Compose Multiplatform 應用程式。
您可以直接在 IntelliJ IDEA 中偵錯此應用程式，無需額外配置。

1. 在 IntelliJ IDEA 中，開啟要偵錯的 Kotlin 檔案。在本教學中，我們將使用 Kotlin Multiplatform 專案以下目錄中的 `Greeting.kt` 檔案：

   `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2. 按一下行號以在您要檢查的程式碼上設定中斷點。

   ![設定中斷點](wasm-breakpoints-intellij.png){width=650}

3. 在執行配置清單中，選取 **composeApp[wasmJs]**。
4. 按一下螢幕頂部的偵錯圖示，以偵錯模式執行程式碼。

   ![以偵錯模式執行](wasm-debug-run-configurations.png){width=600}

   應用程式啟動後，它會在新的瀏覽器視窗中開啟。

   ![瀏覽器中的 Compose 應用程式](wasm-composeapp-browser.png){width=600}

   同時，IntelliJ IDEA 中的 **Debug** 面板會自動開啟。

   ![Compose 應用程式偵錯器](wasm-debug-pane.png){width=600}

### 檢查您的應用程式

> 如果您正在[瀏覽器中偵錯](#debug-in-your-browser)，您可以按照相同的步驟檢查您的應用程式。
>
{style="note"}

1. 在應用程式的瀏覽器視窗中，按一下「**Click me!**」按鈕與應用程式互動。此動作會觸發程式碼執行，當執行到達中斷點時，偵錯程式會暫停。

2. 在偵錯窗格中，使用偵錯控制按鈕檢查中斷點處的變數和程式碼執行：
    * ![跳過](wasm-debug-step-over.png){width=30}{type="joined"} 跳過以執行目前行並在下一行暫停。
    * ![逐步執行](wasm-debug-step-into.png){width=30}{type="joined"} 逐步執行以更深入地調查函式。
    * ![跳出](wasm-debug-step-out.png){width=30}{type="joined"} 跳出以執行程式碼直到其退出目前函式。

3. 檢查 **Threads & Variables** 窗格。它有助於您追蹤函式呼叫序列並確定任何錯誤的位置。

   ![檢查執行緒與變數](wasm-debug-panes-intellij.png){width=700}

4. 更改您的程式碼並再次執行應用程式以驗證它是否按預期運作。
5. 完成偵錯後，按一下有中斷點的行號以移除中斷點。

## 在瀏覽器中偵錯

您也可以直接在瀏覽器中偵錯此 Compose Multiplatform 應用程式，無需額外配置。

當您執行開發 Gradle 任務 (`*DevRun`) 時，Kotlin 會自動將原始碼檔案提供給瀏覽器，
讓您能夠設定中斷點、檢查變數，
並逐步執行 Kotlin 程式碼。

在瀏覽器中提供 Kotlin/Wasm 專案原始碼的配置現在已包含在 Kotlin Gradle 插件中。
如果您之前將此配置新增到您的 `build.gradle.kts` 檔案中，則應將其移除以避免衝突。

> 本教學使用 Chrome 瀏覽器，但您應該能夠使用其他瀏覽器遵循這些步驟。如需更多資訊，請參閱 [瀏覽器版本](wasm-configuration.md#browser-versions)。
>
{style="tip"}

1. 按照說明 [執行 Compose Multiplatform 應用程式](wasm-get-started.md#run-the-application)。

2. 在應用程式的瀏覽器視窗中，按右鍵並選取 **Inspect** 動作以存取開發人員工具。
   或者，您可以使用 **F12** 快捷鍵或選取 **View** | **Developer** | **Developer Tools**。

3. 切換到 **Sources** 標籤頁並選取要偵錯的 Kotlin 檔案。在本教學中，我們將使用 `Greeting.kt` 檔案。

4. 按一下行號以在您要檢查的程式碼上設定中斷點。只有數字顏色較深的行才能設定中斷點 — 在此範例中為 4、7、8 和 9。

   ![設定中斷點](wasm-breakpoints-browser.png){width=700}

5. 檢查您的應用程式，類似於 [在 IntelliJ IDEA 中偵錯](#inspect-your-application)。

    在瀏覽器中偵錯時，用於追蹤函式呼叫序列並確定任何錯誤的窗格是 **Scope** 和 **Call Stack**。

   ![檢查呼叫堆疊](wasm-debug-scope.png){width=450}

### 使用自訂格式化程式

自訂格式化程式有助於在瀏覽器中偵錯 Kotlin/Wasm 程式碼時，以更使用者友善且易於理解的方式顯示和定位變數值。

自訂格式化程式在 Kotlin/Wasm 開發版本中預設啟用，但是
您仍然需要確保在瀏覽器的開發人員工具中啟用自訂格式化程式：

* 在 Chrome DevTools 中，於 **Settings | Preferences | Console** 尋找 **Custom formatters** 核取方塊：

  ![在 Chrome 中啟用自訂格式化程式](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中，於 **Settings | Advanced settings** 尋找 **Enable custom formatters** 核取方塊：

  ![在 Firefox 中啟用自訂格式化程式](wasm-custom-formatters-firefox.png){width=400}

此功能使用 [自訂格式化程式 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)，
並在 Firefox 和基於 Chromium 的瀏覽器中受到支援。

鑑於自訂格式化程式預設僅適用於 Kotlin/Wasm 開發版本，
如果您希望將它們用於生產版本，則需要調整您的 Gradle 配置。
將以下編譯器選項新增到 `wasmJs {}` 區塊中：

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

## 提供回饋

我們非常感謝您對偵錯體驗提出的任何回饋！

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [取得 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並在我們的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道中直接向開發人員提供您的回饋。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供您的回饋。

## 接下來是什麼？

* 在此 [YouTube 影片](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s) 中查看 Kotlin/Wasm 偵錯的實際操作。
* 嘗試更多 Kotlin/Wasm 範例：
  * [KotlinConf application](https://github.com/JetBrains/kotlinconf-app)
  * [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI example](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)