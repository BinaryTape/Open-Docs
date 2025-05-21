---
title: "除錯 Kotlin/JS 程式碼"
---
JavaScript 的 Source Map（原始碼對應）提供了 Bundler（打包器）或 Minifier（壓縮器）產生的精簡程式碼與開發人員使用的實際原始碼之間的映射。 這樣，Source Map 就能支援在程式碼執行期間進行偵錯。

Kotlin Multiplatform Gradle 外掛程式會自動為專案建置產生 Source Map，無需任何額外設定即可使用。

## 在瀏覽器中偵錯

大多數現代瀏覽器都提供工具，可以檢查頁面內容並偵錯在其上執行的程式碼。 請參閱您的瀏覽器文件以取得更多詳細資訊。

若要在瀏覽器中偵錯 Kotlin/JS：

1. 呼叫其中一個可用的 _run_ Gradle Task（任務）來執行專案，例如，在多平台專案中的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
   深入瞭解[執行 Kotlin/JS](running-kotlin-js#run-the-browser-target)。
2. 在瀏覽器中導覽至頁面，然後啟動其開發人員工具（例如，右鍵點擊並選擇 **Inspect（檢查）** 動作）。 瞭解如何在熱門瀏覽器中[尋找開發人員工具](https://balsamiq.com/support/faqs/browserconsole/)。
3. 如果您的程式將資訊記錄到 Console（主控台），請導覽至 **Console（主控台）** 標籤以查看此輸出。 根據您的瀏覽器，這些日誌可以參考它們來自的 Kotlin 原始檔和行：

<img src="/img/devtools-console.png" alt="Chrome DevTools console" width="600" style={{verticalAlign: 'middle'}}/>

4. 點擊右側的檔案參考以導覽至對應的程式碼行。
   或者，您可以手動切換到 **Sources（來源）** 標籤，並在檔案樹中找到您需要的檔案。 導覽至 Kotlin 檔案會向您顯示常規 Kotlin 程式碼（而不是精簡的 JavaScript）：

<img src="/img/devtools-sources.png" alt="Debugging in Chrome DevTools" width="600" style={{verticalAlign: 'middle'}}/>

您現在可以開始偵錯程式。 點擊其中一個行號來設定中斷點。
開發人員工具甚至支援在陳述式中設定中斷點。 與常規 JavaScript 程式碼一樣，任何設定的中斷點都將在頁面重新載入後持續存在。 這也使得可以偵錯 Kotlin 的 `main()` 方法，該方法在首次載入腳本時執行。

## 在 IDE 中偵錯

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) 提供了一套強大的工具，可在開發期間偵錯程式碼。

若要在 IntelliJ IDEA 中偵錯 Kotlin/JS，您需要一個 **JavaScript Debug（JavaScript 偵錯）** 設定。 若要新增此類偵錯設定：

1. 轉到 **Run | Edit Configurations（執行 | 編輯設定）**。
2. 點擊 **+** 並選擇 **JavaScript Debug（JavaScript 偵錯）**。
3. 指定設定 **Name（名稱）**，並提供專案運行的 **URL**（預設為 `http://localhost:8080`）。

<img src="/img/debug-config.png" alt="JavaScript debug configuration" width="700" style={{verticalAlign: 'middle'}}/>

4. 儲存設定。

深入瞭解[設定 JavaScript 偵錯設定](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)。

現在您已準備好偵錯您的專案！

1. 呼叫其中一個可用的 _run_ Gradle Task（任務）來執行專案，例如，在多平台專案中的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
   深入瞭解[執行 Kotlin/JS](running-kotlin-js#run-the-browser-target)。
2. 透過執行您先前建立的 JavaScript 偵錯設定來啟動偵錯會話：

<img src="/img/debug-config-run.png" alt="JavaScript debug configuration" width="700" style={{verticalAlign: 'middle'}}/>

3. 您可以在 IntelliJ IDEA 的 **Debug（偵錯）** 視窗中看到程式的 Console（主控台）輸出。 輸出項目參考它們來自的 Kotlin 原始檔和行：

<img src="/img/ide-console-output.png" alt="JavaScript debug output in the IDE" width="700" style={{verticalAlign: 'middle'}}/>

4. 點擊右側的檔案參考以導覽至對應的程式碼行。

您現在可以使用 IDE 提供的全套工具開始偵錯程式：中斷點、單步執行、表達式求值等等。 深入瞭解[在 IntelliJ IDEA 中偵錯](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)。

:::note
由於 IntelliJ IDEA 中目前 JavaScript 偵錯器的限制，您可能需要重新執行 JavaScript 偵錯，才能使執行停止在中斷點上。

:::

## 在 Node.js 中偵錯

如果您的專案以 Node.js 為目標，您可以在此 Runtime（執行時環境）中進行偵錯。

若要偵錯以 Node.js 為目標的 Kotlin/JS 應用程式：

1. 透過執行 `build` Gradle Task（任務）來建置專案。
2. 在專案目錄內的 `build/js/packages/your-module/kotlin/` 目錄中找到 Node.js 的結果 `.js` 檔案。
3. 在 Node.js 中對其進行偵錯，如 [Node.js Debugging Guide（Node.js 偵錯指南）](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides) 中所述。

## 接下來是什麼？

現在您知道如何使用 Kotlin/JS 專案啟動偵錯會話，請學習如何有效地使用偵錯工具：

* 瞭解如何在 [Google Chrome 中偵錯 JavaScript](https://developer.chrome.com/docs/devtools/javascript/)
* 熟悉 [IntelliJ IDEA JavaScript 偵錯器](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)
* 瞭解如何在 [Node.js 中偵錯](https://nodejs.org/en/docs/guides/debugging-getting-started/)。

## 如果您遇到任何問題

如果您在偵錯 Kotlin/JS 時遇到任何問題，請將其報告給我們的 Issue Tracker（問題追蹤器），[YouTrack](https://kotl.in/issue)