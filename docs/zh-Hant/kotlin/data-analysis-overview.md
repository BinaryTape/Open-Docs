[//]: # (title: 用於資料分析的 Kotlin)

探索和分析資料可能不是您每天都會做的事情，但作為軟體開發人員，這是一項您所需的關鍵技能。

讓我們思考一下資料分析很重要的軟體開發職責：在偵錯時分析集合中的實際內容、深入研究記憶體轉儲或資料庫，或者在處理 REST API 時接收包含大量資料的 JSON 檔案，這只是其中一部分。

透過 Kotlin 的探索性資料分析 (EDA) 工具，例如 [Kotlin notebooks](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe) 和 [Kandy](#kandy)，您擁有一套豐富的功能來提升您的分析技能，並在不同的情境中為您提供支援：

*   **載入、轉換和視覺化各種格式的資料：** 透過我們的 Kotlin EDA 工具，您可以執行篩選、排序和聚合資料等任務。我們的工具可以在 IDE 中無縫讀取各種檔案格式的資料，包括 CSV、JSON 和 TXT。

    Kandy 是我們的繪圖工具，它允許您建立各種圖表，以視覺化並從資料集中獲得洞見。

*   **高效分析儲存在關聯式資料庫中的資料：** Kotlin DataFrame 與資料庫無縫整合，並提供類似 SQL 查詢的功能。您可以直接從各種資料庫中擷取、操作和視覺化資料。

*   **從網路 API 擷取並分析即時和動態資料集：** EDA 工具的靈活性允許透過 OpenAPI 等協定與外部 API 整合。此功能可協助您從網路 API 擷取資料，然後清理並轉換資料以符合您的需求。

您想嘗試我們的 Kotlin 資料分析工具嗎？

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="開始使用 Kotlin Notebook" style="block"/></a>

我們的 Kotlin 資料分析工具讓您可以順暢地處理資料，從開始到結束。在我們的 Kotlin Notebook 中，只需簡單的拖放功能即可輕鬆擷取您的資料。只需幾行程式碼即可清理、轉換並視覺化它。此外，只需點擊幾下即可匯出您的輸出圖表。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## 筆記本

_筆記本_ 是一種互動式文件，您可以在其中混合可執行的 Kotlin 程式碼、文字、視覺化內容和結果。您可以將其視為一個 Kotlin REPL，它擴展了將程式碼組織到單元格中、使用 Markdown 進行文件編寫，並立即顯示輸出（從文字到圖表）的功能，與產生這些輸出的程式碼並列。

Kotlin 提供不同的筆記本解決方案，例如 [Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore) 和 [Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel)，提供方便的資料擷取、轉換、探索、模型建構等功能。這些 Kotlin 筆記本解決方案基於我們的 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)。

您可以在 Kotlin Notebook、Datalore 和 Kotlin-Jupyter Notebook 之間無縫共享您的程式碼。在我們的其中一個 Kotlin 筆記本中建立專案，並在另一個筆記本中繼續工作而沒有相容性問題。

受益於我們強大 Kotlin 筆記本的功能以及使用 Kotlin 編碼的優點。Kotlin 與這些筆記本整合，幫助您管理資料並與同事分享您的發現，同時建立您的資料科學和機器學習技能。

探索我們不同 Kotlin 筆記本解決方案的功能，並選擇最符合您專案需求的方案。

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview.md) 是 IntelliJ IDEA 的外掛程式，允許您在 Kotlin 中建立筆記本。它提供了我們的 IDE 體驗以及所有常見的 IDE 功能，提供即時程式碼洞察和專案整合。

### Datalore 中的 Kotlin 筆記本

透過 [Datalore](https://datalore.jetbrains.com/)，您可以開箱即用地在瀏覽器中使用 Kotlin，無需額外安裝。您還可以共享您的筆記本並遠端執行它們，與其他 Kotlin 筆記本即時協作，在編寫程式碼時獲得智慧程式碼協助，並透過互動式或靜態報告匯出結果。

### 帶有 Kotlin Kernel 的 Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/) 是一個開源網頁應用程式，允許您建立和共享包含程式碼、視覺化和 Markdown 文字的文件。[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一個開源專案，它為 Jupyter Notebook 帶來了 Kotlin 支援，以在 Jupyter 環境中發揮 Kotlin 的強大功能。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 函式庫可讓您在 Kotlin 專案中操作結構化資料。從資料建立、清理到深入分析和特徵工程，此函式庫都能滿足您的需求。

透過 Kotlin DataFrame 函式庫，您可以處理不同的檔案格式，包括 CSV、JSON、XLS 和 XLSX。此函式庫還能透過其連接 SQL 資料庫或 API 的能力，簡化了資料擷取過程。

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一個開源 Kotlin 函式庫，為繪製各種圖表提供了強大且靈活的 DSL。此函式庫是一個簡單、慣用、可讀且型別安全的工具，用於視覺化資料。

Kandy 與 Kotlin Notebook、Datalore 和 Kotlin-Jupyter Notebook 無縫整合。您還可以輕鬆結合 Kandy 和 Kotlin DataFrame 函式庫來完成不同的資料相關任務。

![Kandy](data-analysis-kandy-example.png){width=700}

## 後續步驟

*   [開始使用 Kotlin Notebook](get-started-with-kotlin-notebooks.md)
*   [使用 Kotlin DataFrame 函式庫擷取和轉換資料](data-analysis-work-with-data-sources.md)
*   [使用 Kandy 函式庫視覺化資料](data-analysis-visualization.md)
*   [瞭解更多關於用於資料分析的 Kotlin 和 Java 函式庫](data-analysis-libraries.md)