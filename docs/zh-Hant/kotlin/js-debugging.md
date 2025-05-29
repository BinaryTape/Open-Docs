[//]: # (title: 偵錯 Kotlin/JS 程式碼)

JavaScript 原始碼對應 (source maps) 提供了打包工具 (bundlers) 或壓縮工具 (minifiers) 所產生的壓縮後程式碼與開發者實際使用的原始碼之間的映射關係。透過這種方式，原始碼對應支援在程式碼執行期間進行偵錯。

Kotlin 多平台 Gradle 外掛程式會自動為專案建置產生原始碼對應，無需任何額外配置即可使用。

## 在瀏覽器中偵錯

大多數現代瀏覽器都提供了工具，允許檢查頁面內容並偵錯在頁面上執行的程式碼。有關更多詳細資訊，請參閱您的瀏覽器說明文件。

要在瀏覽器中偵錯 Kotlin/JS：

1.  透過呼叫其中一個可用的 _執行_ Gradle 任務來執行專案，例如在多平台專案中的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
    了解更多關於[執行 Kotlin/JS](running-kotlin-js.md#run-the-browser-target) 的資訊。
2.  導航到瀏覽器中的頁面並啟動其開發者工具（例如，右鍵點擊並選擇 **檢查** 動作）。了解如何在常見瀏覽器中[尋找開發者工具](https://balsamiq.com/support/faqs/browserconsole/)。
3.  如果您的程式正在向主控台記錄資訊，請導航到 **主控台** 分頁以查看此輸出。
    根據您的瀏覽器，這些日誌可以參照其來源的 Kotlin 原始碼檔案和行號：

![Chrome 開發者工具主控台](devtools-console.png){width="600"}

4.  點擊右側的檔案參照以導航到對應的程式碼行。
    或者，您可以手動切換到 **來源** 分頁並在檔案樹中找到您需要的檔案。導航到 Kotlin 檔案會顯示常規的 Kotlin 程式碼（而非壓縮過的 JavaScript）：

![在 Chrome 開發者工具中偵錯](devtools-sources.png){width="600"}

您現在可以開始偵錯程式了。透過點擊其中一個行號來設定中斷點。
開發者工具甚至支援在語句內設定中斷點。與常規 JavaScript 程式碼一樣，任何設定的中斷點都會在頁面重新載入後仍然存在。這也使得偵錯 Kotlin 的 `main()` 方法成為可能，該方法在腳本首次載入時執行。

## 在 IDE 中偵錯

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) 提供了強大的工具集，用於在開發過程中偵錯程式碼。

要在 IntelliJ IDEA 中偵錯 Kotlin/JS，您需要一個 **JavaScript 偵錯** 配置。要新增這樣的偵錯配置：

1.  前往 **執行 | 編輯配置**。
2.  點擊 **+** 並選擇 **JavaScript 偵錯**。
3.  指定配置**名稱** 並提供專案運行的 **URL**（預設為 `http://localhost:8080`）。

![JavaScript 偵錯配置](debug-config.png){width=700}

4.  儲存配置。

了解更多關於[設定 JavaScript 偵錯配置](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)的資訊。

現在您已準備好偵錯您的專案！

1.  透過呼叫其中一個可用的 _執行_ Gradle 任務來執行專案，例如在多平台專案中的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
    了解更多關於[執行 Kotlin/JS](running-kotlin-js.md#run-the-browser-target) 的資訊。
2.  透過執行您之前建立的 JavaScript 偵錯配置來啟動偵錯會話：

![JavaScript 偵錯配置](debug-config-run.png){width=700}

3.  您可以在 IntelliJ IDEA 的 **偵錯** 視窗中看到程式的主控台輸出。輸出項目參照了其來源的 Kotlin 原始碼檔案和行號：

![IDE 中的 JavaScript 偵錯輸出](ide-console-output.png){width=700}

4.  點擊右側的檔案參照以導航到對應的程式碼行。

您現在可以使用 IDE 提供的一整套工具來開始偵錯程式：中斷點、步進、表達式求值等等。了解更多關於[在 IntelliJ IDEA 中偵錯](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)的資訊。

> 由於 IntelliJ IDEA 中目前 JavaScript 偵錯器的限制，您可能需要重新執行 JavaScript 偵錯以使執行在中斷點處停止。
>
{style="note"}

## 在 Node.js 中偵錯

如果您的專案目標是 Node.js，您可以在此執行時環境中偵錯它。

要偵錯目標 Node.js 的 Kotlin/JS 應用程式：

1.  透過執行 `build` Gradle 任務來建置專案。
2.  在您專案目錄內部的 `build/js/packages/your-module/kotlin/` 目錄中找到 Node.js 的生成 `.js` 檔案。
3.  按照 [Node.js 偵錯指南](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides) 中的說明在 Node.js 中偵錯它。

## 接下來呢？

既然您知道了如何啟動 Kotlin/JS 專案的偵錯會話，接下來請學習如何有效利用偵錯工具：

*   了解如何在 [Google Chrome 中偵錯 JavaScript](https://developer.chrome.com/docs/devtools/javascript/)
*   熟悉 [IntelliJ IDEA JavaScript 偵錯器](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)
*   了解如何[在 Node.js 中偵錯](https://nodejs.org/en/docs/guides/debugging-getting-started/)。

## 如果您遇到任何問題

如果您在偵錯 Kotlin/JS 方面遇到任何問題，請將其報告給我們的問題追蹤器 [YouTrack](https://kotl.in/issue)