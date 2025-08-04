[//]: # (title: 偵錯 Kotlin/JS 程式碼)

JavaScript 原始碼對應 (source maps) 提供了捆綁器或最小化工具產生的最小化程式碼與開發人員實際使用的原始碼之間的映射。透過這種方式，原始碼對應可在程式碼執行期間支援偵錯。

Kotlin Multiplatform Gradle 外掛程式會自動為專案建構產生原始碼對應，使其無需任何額外設定即可使用。

## 在瀏覽器中偵錯

大多數現代瀏覽器都提供了工具，允許檢查頁面內容並偵錯在其上執行的程式碼。詳情請參閱您的瀏覽器文件。

若要在瀏覽器中偵錯 Kotlin/JS：

1. 透過呼叫其中一個可用的 `_run_` Gradle 任務來執行專案，例如在多平台專案中的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
   深入了解 [執行 Kotlin/JS](running-kotlin-js.md#run-the-browser-target)。
2. 在瀏覽器中導覽至頁面並啟動其開發人員工具 (例如，透過右鍵點擊並選擇「**檢查**」動作)。了解如何在常用瀏覽器中 [尋找開發人員工具](https://balsamiq.com/support/faqs/browserconsole/)。
3. 如果您的程式正在將資訊記錄到主控台，請導覽至「**主控台**」分頁以查看此輸出。根據您的瀏覽器，這些日誌可以參考其來源的 Kotlin 原始檔和行：

![Chrome 開發人員工具主控台](devtools-console.png){width="600"}

4. 點擊右側的檔案參考以導覽至程式碼的對應行。或者，您可以手動切換到「**來源**」分頁並在檔案樹中找到您需要的檔案。導覽至 Kotlin 檔案會顯示常規的 Kotlin 程式碼 (而不是最小化 JavaScript)：

![在 Chrome 開發人員工具中偵錯](devtools-sources.png){width="600"}

您現在可以開始偵錯程式了。透過點擊其中一個行號來設定中斷點。開發人員工具甚至支援在語句中設定中斷點。如同常規 JavaScript 程式碼一樣，任何已設定的中斷點將在頁面重新載入後仍然存在。這也使得偵錯 Kotlin 的 `main()` 方法成為可能，該方法在腳本首次載入時執行。

## 在 IDE 中偵錯

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) 提供了一套強大的工具，用於在開發期間偵錯程式碼。

若要在 IntelliJ IDEA 中偵錯 Kotlin/JS，您需要一個「**JavaScript 偵錯**」設定。若要新增此類偵錯設定：

1. 進入「**執行 | 編輯組態 (Run | Edit Configurations)**」。
2. 點擊「**+**」並選擇「**JavaScript 偵錯**」。
3. 指定設定「**名稱**」並提供專案執行的「**URL**」（預設為 `http://localhost:8080`）。

![JavaScript 偵錯設定](debug-config.png){width=700}

4. 儲存設定。

深入了解 [設定 JavaScript 偵錯組態](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)。

現在您已準備好偵錯您的專案！

1. 透過呼叫其中一個可用的 `_run_` Gradle 任務來執行專案，例如在多平台專案中的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
   深入了解 [執行 Kotlin/JS](running-kotlin-js.md#run-the-browser-target)。
2. 透過執行您之前建立的 JavaScript 偵錯設定來啟動偵錯會話：

![JavaScript 偵錯設定](debug-config-run.png){width=700}

3. 您可以在 IntelliJ IDEA 的「**偵錯**」視窗中看到程式的主控台輸出。輸出項目參考其來源的 Kotlin 原始檔和行：

![IDE 中的 JavaScript 偵錯輸出](ide-console-output.png){width=700}

4. 點擊右側的檔案參考以導覽至程式碼的對應行。

您現在可以使用 IDE 提供的整套工具開始偵錯程式：中斷點、步進、表達式評估等等。深入了解 [在 IntelliJ IDEA 中偵錯](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)。

> 由於 IntelliJ IDEA 中目前 JavaScript 偵錯器的限制，您可能需要重新執行 JavaScript 偵錯，才能使執行在中斷點處停止。
>
{style="note"}

## 在 Node.js 中偵錯

如果您的專案目標是 Node.js，您可以在此執行環境中偵錯它。

若要偵錯目標為 Node.js 的 Kotlin/JS 應用程式：

1. 透過執行 `build` Gradle 任務來建構專案。
2. 在專案目錄內的 `build/js/packages/your-module/kotlin/` 目錄中找到 Node.js 的結果 `.js` 檔案。
3. 如 [Node.js 偵錯指南](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides) 中所述，在 Node.js 中偵錯它。

## 接下來是什麼？

既然您已經知道如何開始 Kotlin/JS 專案的偵錯會話，請學習如何有效地利用偵錯工具：

* 學習如何在 [Google Chrome 中偵錯 JavaScript](https://developer.chrome.com/docs/devtools/javascript/)
* 熟悉 [IntelliJ IDEA JavaScript 偵錯器](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)
* 學習如何在 [Node.js 中偵錯](https://nodejs.org/en/docs/guides/debugging-getting-started/)。

## 如果您遇到任何問題

如果您在偵錯 Kotlin/JS 時遇到任何問題，請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告。