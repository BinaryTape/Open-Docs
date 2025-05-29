[//]: # (title: 偵錯 Kotlin/Wasm 程式碼)

> Kotlin/Wasm 處於 [Alpha 版本](components-stability.md)。它可能隨時會有所變動。
>
{style="note"}

本教學示範如何使用您的瀏覽器來偵錯使用 Kotlin/Wasm 建置的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 應用程式。

## 開始之前

使用 Kotlin 多平台精靈建立專案：

1. 開啟 [Kotlin 多平台精靈](https://kmp.jetbrains.com/#newProject)。
2. 在「**新專案**」分頁中，依您的偏好變更專案名稱和 ID。在此教學中，我們將名稱設定為 "WasmDemo"，ID 設定為 "wasm.project.demo"。

   > 這些是專案目錄的名稱和 ID。您也可以保留它們的現狀。
   >
   {style="tip"}

3. 選取「**Web**」選項。請確認沒有選取其他選項。
4. 點擊「**下載**」按鈕並解壓縮生成的壓縮檔。

   ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=450}

## 在 IntelliJ IDEA 中開啟專案

1. 下載並安裝最新版本 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的歡迎畫面中，點擊「**開啟**」或在選單列中選取「**檔案 | 開啟**」。
3. 導覽至已解壓縮的 "WasmDemo" 資料夾，然後點擊「**開啟**」。

## 執行應用程式

1. 在 IntelliJ IDEA 中，透過選取「**檢視** | **工具視窗** | **Gradle**」來開啟「**Gradle**」工具視窗。

   > 您需要至少 Java 11 作為您的 Gradle JVM，任務才能成功載入。
   >
   {style="note"}

2. 在 **composeApp** | **Tasks** | **kotlin browser** 中，選取並執行 **wasmJsBrowserDevelopmentRun** 任務。

   ![Run the Gradle task](wasm-gradle-task-window.png){width=450}

   或者，您可以在 `WasmDemo` 根目錄下的終端機中執行以下指令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. 應用程式啟動後，在您的瀏覽器中開啟以下 URL：

   ```bash
   http://localhost:8080/
   ```

   > 連接埠號碼可能會有所不同，因為 8080 連接埠可能無法使用。您可以在 Gradle 建置控制台中找到實際的連接埠號碼。
   >
   {style="tip"}

   您會看到一個「Click me!」按鈕。點擊它：

   ![Click me](wasm-composeapp-browser-clickme.png){width=550}

   現在您會看到 Compose Multiplatform 標誌：

   ![Compose app in browser](wasm-composeapp-browser.png){width=550}

## 在瀏覽器中偵錯

> 目前，偵錯功能僅在您的瀏覽器中可用。未來，您將能夠在 [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) 中偵錯您的程式碼。
>
{style="note"}

您可以開箱即用地在瀏覽器中偵錯此 Compose Multiplatform 應用程式，無需額外配置。

然而，對於其他專案，您可能需要在 Gradle 建置檔案中配置額外設定。有關如何配置瀏覽器以進行偵錯的更多資訊，請展開下一節。

### 配置您的瀏覽器以進行偵錯 {initial-collapse-state="collapsed" collapsible="true"}

#### 啟用對專案原始碼的存取

預設情況下，瀏覽器無法存取偵錯所需的某些專案原始碼。為了提供存取權，您可以配置 Webpack DevServer 來提供這些原始碼。在 `ComposeApp` 目錄中，將以下程式碼片段新增到您的 `build.gradle.kts` 檔案中。

將此匯入作為頂層宣告新增：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

將此程式碼片段新增到 `commonWebpackConfig{}` 區塊內，此區塊位於 `kotlin{}` 內的 `wasmJs{}` 目標 DSL 和 `browser{}` 平台 DSL 中：

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

> 目前，您無法偵錯函式庫原始碼。 [我們將在未來支援此功能](https://youtrack.jetbrains.com/issue/KT-64685)。
>
{style="note"}

#### 使用自訂格式器

自訂格式器有助於在偵錯 Kotlin/Wasm 程式碼時，以更使用者友善且易於理解的方式顯示和定位變數值。

自訂格式器在開發建置中預設啟用，因此您不需要額外的 Gradle 配置。

此功能支援 Firefox 和基於 Chromium 的瀏覽器，因為它使用了 [自訂格式器 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)。

若要使用此功能，請確保在瀏覽器的開發人員工具中啟用自訂格式器：

* 在 Chrome 開發人員工具中，在「**設定 | 偏好設定 | 控制台**」中找到自訂格式器核取方塊：

  ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox 開發人員工具中，在「**設定 | 進階設定**」中找到自訂格式器核取方塊：

  ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

自訂格式器適用於 Kotlin/Wasm 開發建置。如果您對生產建置有特定要求，您需要相應地調整 Gradle 配置。將以下編譯器選項新增到 `wasmJs {}` 區塊中：

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

啟用自訂格式器後，您可以繼續進行偵錯教學。

### 偵錯您的 Kotlin/Wasm 應用程式

> 本教學使用 Chrome 瀏覽器，但您應該能夠使用其他瀏覽器遵循這些步驟。有關更多資訊，請參閱 [瀏覽器版本](wasm-troubleshooting.md#browser-versions)。
>
{style="tip"}

1. 在應用程式的瀏覽器視窗中，右鍵點擊並選取「**檢查**」動作以存取開發人員工具。或者，您可以使用 **F12** 快捷鍵或選取「**檢視** | **開發人員** | **開發人員工具**」。

2. 切換到「**來源**」分頁，並選取要偵錯的 Kotlin 檔案。在本教學中，我們將使用 `Greeting.kt` 檔案。

3. 點擊行號以在您想要檢查的程式碼上設定中斷點。只有數字顏色較深的行才能設定中斷點。

   ![Set breakpoints](wasm-breakpoints.png){width=700}

4. 點擊「**Click me!**」按鈕與應用程式互動。此動作會觸發程式碼執行，當執行到達中斷點時，偵錯工具會暫停。

5. 在偵錯窗格中，使用偵錯控制按鈕檢查中斷點處的變數和程式碼執行情況：
   * ![Step into](wasm-step-into.png){width=30}{type="joined"} **逐步進入**以更深入地調查函式。
   * ![Step over](wasm-step-over.png){width=30}{type="joined"} **逐步執行**目前行並在下一行暫停。
   * ![Step out](wasm-step-out.png){width=30}{type="joined"} **逐步跳出**執行程式碼直到其退出目前函式。

   ![Debug controls](wasm-debug-controls.png){width=450}

6. 檢查「**呼叫堆疊**」和「**作用域**」窗格，以追蹤函式呼叫序列並找出任何錯誤的位置。

   ![Check call stack](wasm-debug-scope.png){width=450}

   為了改進變數值的視覺化效果，請參閱 [配置您的瀏覽器以進行偵錯](#configure-your-browser-for-debugging) 小節中的《使用自訂格式器》。

7. 更改您的程式碼並 [再次執行應用程式](#run-the-application) 以驗證一切是否如預期般運作。
8. 點擊有中斷點的行號以移除中斷點。

## 提供回饋

我們非常感謝您提供的任何回饋，關於您的偵錯體驗！

* ![Slack](slack.svg){width=25}{type="joined"} Slack：[取得 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)，並直接在我們的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道中向開發人員提供您的回饋。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供您的回饋。

## 接下來是什麼？

* 觀看此 [YouTube 影片](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s) 以了解 Kotlin/Wasm 偵錯的實際操作。
* 嘗試我們 `kotlin-wasm-examples` 儲存庫中的 Kotlin/Wasm 範例：
   * [Compose 圖片檢視器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack 應用程式](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose 範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)