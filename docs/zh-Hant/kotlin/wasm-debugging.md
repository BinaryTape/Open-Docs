[//]: # (title: 偵錯 Kotlin/Wasm 程式碼)

> Kotlin/Wasm 處於 [Alpha](components-stability.md) 階段。它隨時可能更改。
>
{style="note"}

本教學示範如何使用瀏覽器偵錯以 Kotlin/Wasm 建置的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式。

## 開始之前

使用 Kotlin Multiplatform wizard 建立專案：

1. 開啟 [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/#newProject)。
2. 在 **New Project** 標籤頁中，依偏好變更專案名稱與 ID。在本教學中，我們將名稱設定為「WasmDemo」，ID 設定為「wasm.project.demo」。

   > 這些是專案目錄的名稱和 ID。您也可以保留它們不變。
   >
   {style="tip"}

3. 選取 **Web** 選項。請確保沒有選取其他選項。
4. 按一下 **Download** 按鈕並解壓縮產生的壓縮檔。

   ![Kotlin Multiplatform 專案建立精靈](wasm-compose-web-wizard.png){width=450}

## 在 IntelliJ IDEA 中開啟專案

1. 下載並安裝最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的歡迎畫面中，按一下 **Open** 或在選單列中選取 **File | Open**。
3. 導覽至解壓縮後的「WasmDemo」資料夾，然後按一下 **Open**。

## 執行應用程式

1. 在 IntelliJ IDEA 中，透過選取 **View** | **Tool Windows** | **Gradle** 開啟 **Gradle** 工具視窗。

   > 您需要至少 Java 11 作為您的 Gradle JVM，以便任務成功載入。
   >
   {style="note"}

2. 在 **composeApp** | **Tasks** | **kotlin browser** 中，選取並執行 **wasmJsBrowserDevelopmentRun** 任務。

   ![執行 Gradle 任務](wasm-gradle-task-window.png){width=450}

   或者，您可以在 `WasmDemo` 根目錄下的終端機中執行以下命令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. 應用程式啟動後，在您的瀏覽器中開啟以下 URL：

   ```bash
   http://localhost:8080/
   ```

   > 連接埠號碼可能不同，因為 8080 連接埠可能不可用。您可以在 Gradle 建置控制台中找到實際的連接埠號碼。
   >
   {style="tip"}

   您會看到一個「Click me!」按鈕。點擊它：

   ![點擊我](wasm-composeapp-browser-clickme.png){width=550}

   現在您會看到 Compose Multiplatform 標誌：

   ![瀏覽器中的 Compose 應用程式](wasm-composeapp-browser.png){width=550}

## 在瀏覽器中偵錯

> 目前，偵錯僅在您的瀏覽器中可用。未來，您將能夠在 [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) 中偵錯您的程式碼。
>
{style="note"}

您可以直接在瀏覽器中偵錯此 Compose Multiplatform 應用程式，無需額外配置。

然而，對於其他專案，您可能需要在 Gradle 建置檔案中配置額外設定。有關如何配置瀏覽器以進行偵錯的更多資訊，請展開下一節。

### 配置您的瀏覽器以進行偵錯 {initial-collapse-state="collapsed" collapsible="true"}

#### 啟用專案原始碼的存取

預設情況下，瀏覽器無法存取偵錯所需的部分專案原始碼。為了提供存取權，您可以配置 Webpack DevServer 來提供這些原始碼。在 `ComposeApp` 目錄中，將以下程式碼片段新增到您的 `build.gradle.kts` 檔案中。

將此匯入作為頂層宣告新增：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

將此程式碼片段新增到 `commonWebpackConfig{}` 區塊內，該區塊位於 `kotlin{}` 中的 `wasmJs{}` 目標 DSL 和 `browser{}` 平台 DSL 中：

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

結果程式碼區塊如下所示：

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
{initial-collapse-state="collapsed" collapsible="true"}

> 目前，您無法偵錯函式庫原始碼。[我們將在未來支援此功能](https://youtrack.jetbrains.com/issue/KT-64685)。
>
{style="note"}

#### 使用自訂格式化程式

自訂格式化程式有助於在偵錯 Kotlin/Wasm 程式碼時，以更使用者友善且易於理解的方式顯示和定位變數值。

自訂格式化程式在開發版本中預設啟用，因此您不需要額外的 Gradle 配置。

此功能在 Firefox 和基於 Chromium 的瀏覽器中受到支援，因為它使用了 [自訂格式化程式 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)。

若要使用此功能，請確保在您瀏覽器的開發人員工具中啟用自訂格式化程式：

* 在 Chrome DevTools 中，於 **Settings | Preferences | Console** 尋找自訂格式化程式的核取方塊：

  ![在 Chrome 中啟用自訂格式化程式](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中，於 **Settings | Advanced settings** 尋找自訂格式化程式的核取方塊：

  ![在 Firefox 中啟用自訂格式化程式](wasm-custom-formatters-firefox.png){width=400}

自訂格式化程式適用於 Kotlin/Wasm 開發版本。如果您對生產版本有特定要求，您需要相應地調整您的 Gradle 配置。將以下編譯器選項新增到 `wasmJs {}` 區塊中：

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

啟用自訂格式化程式後，您可以繼續進行偵錯教學。

### 偵錯您的 Kotlin/Wasm 應用程式

> 本教學使用 Chrome 瀏覽器，但您應該能夠使用其他瀏覽器遵循這些步驟。如需更多資訊，請參閱 [Browser versions](wasm-troubleshooting.md#browser-versions)。
>
{style="tip"}

1. 在應用程式的瀏覽器視窗中，按右鍵並選取 **Inspect** 動作以存取開發人員工具。或者，您可以使用 **F12** 快捷鍵或選取 **View | Developer | Developer Tools**。

2. 切換到 **Sources** 標籤頁並選取要偵錯的 Kotlin 檔案。在本教學中，我們將使用 `Greeting.kt` 檔案。

3. 按一下行號以在您要檢查的程式碼上設定中斷點。只有數字顏色較深的行可以設定中斷點。

   ![設定中斷點](wasm-breakpoints.png){width=700}

4. 按一下 **Click me!** 按鈕與應用程式互動。此動作會觸發程式碼執行，當執行到達中斷點時，偵錯程式會暫停。

5. 在偵錯窗格中，使用偵錯控制按鈕檢查中斷點處的變數和程式碼執行：
   * ![逐步執行](wasm-step-into.png){width=30}{type="joined"} 逐步執行以更深入地調查函式。
   * ![跳過](wasm-step-over.png){width=30}{type="joined"} 跳過以執行目前行並在下一行暫停。
   * ![跳出](wasm-step-out.png){width=30}{type="joined"} 跳出以執行程式碼直到其退出目前函式。

   ![偵錯控制](wasm-debug-controls.png){width=450}

6. 檢查 **Call stack** 和 **Scope** 窗格以追蹤函式呼叫序列並確定任何錯誤的位置。

   ![檢查呼叫堆疊](wasm-debug-scope.png){width=450}

   為了更好地視覺化變數值，請參閱 [配置您的瀏覽器以進行偵錯](#configure-your-browser-for-debugging) 區段中的 _使用自訂格式化程式_。

7. 更改您的程式碼並再次[執行應用程式](#run-the-application)以驗證一切是否按預期運作。
8. 按一下有中斷點的行號以移除中斷點。

## 提供回饋

我們非常感謝您對偵錯體驗提出的任何回饋！

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [取得 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並在我們的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道中直接向開發人員提供您的回饋。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供您的回饋。

## 接下來是什麼？

* 在此 [YouTube 影片](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s) 中查看 Kotlin/Wasm 偵錯的實際操作。
* 嘗試我們 `kotlin-wasm-examples` 儲存庫中的 Kotlin/Wasm 範例：
   * [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)