[//]: # (title: Kotlin 用於資料分析)

探索和分析資料可能不是您每天都會做的事情，但它是身為軟體開發人員所必需的關鍵技能。

讓我們思考一下資料分析很重要的軟體開發職責：在除錯時分析集合 (collections) 內實際內容、深入探究記憶體傾印 (memory dumps) 或資料庫、或者在處理 REST API 時接收包含大量資料的 JSON 檔案，僅舉數例。

借助 Kotlin 的探索性資料分析 (Exploratory Data Analysis, EDA) 工具，例如 [Kotlin 筆記本](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe) 和 [Kandy](#kandy)，您可以掌握豐富的功能集，以提升您的分析技能並在不同情境中為您提供支援：

*   **載入、轉換及視覺化各種格式的資料：** 借助我們的 Kotlin EDA 工具，您可以執行篩選、排序及彙總資料等任務。我們的工具可以輕鬆地直接在 IDE 中從不同的檔案格式（包括 CSV、JSON 和 TXT）讀取資料。

    Kandy，我們的繪圖工具，可讓您建立各種圖表，以視覺化資料集並從中獲得洞察。

*   **高效分析儲存在關聯式資料庫中的資料：** Kotlin DataFrame 可與資料庫無縫整合，並提供類似於 SQL 查詢的功能。您可以直接從各種資料庫中擷取、操作和視覺化資料。

*   **從 Web API 擷取並分析即時和動態資料集：** EDA 工具的靈活性允許透過 OpenAPI 等協定與外部 API 整合。此功能可幫助您從 Web API 擷取資料，然後根據您的需求清理和轉換資料。

您想試用我們的 Kotlin 資料分析工具嗎？

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="開始使用 Kotlin Notebook" style="block"/></a>

我們的 Kotlin 資料分析工具讓您流暢地處理您的資料，從頭到尾。只需在我們的 Kotlin Notebook 中使用簡單的拖放功能，即可輕鬆擷取您的資料。只需幾行程式碼即可清理、轉換和視覺化資料。此外，只需點擊幾下即可匯出您的輸出圖表。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## 筆記本

_筆記本_ 是將程式碼、圖形和文字整合在單一環境中的互動式編輯器。使用筆記本時，您可以執行程式碼單元 (code cells) 並立即看到輸出。

Kotlin 提供不同的筆記本解決方案，例如 [Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore) 和 [Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel)，為資料擷取、轉換、探索、建模等提供便利的功能。這些 Kotlin 筆記本解決方案基於我們的 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)。

您可以在 Kotlin Notebook、Datalore 和 Kotlin-Jupyter Notebook 之間無縫地共用您的程式碼。在我們的其中一個 Kotlin 筆記本中建立專案，並在另一個筆記本中繼續工作，而沒有相容性問題。

受益於我們強大的 Kotlin 筆記本的功能以及使用 Kotlin 編碼的優點。Kotlin 與這些筆記本整合，幫助您管理資料並與同事分享您的發現，同時建立您的資料科學和機器學習技能。

探索我們不同 Kotlin 筆記本解決方案的功能，並選擇最符合您的專案需求的一個。

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview.md) 是適用於 IntelliJ IDEA 的外掛程式，可讓您在 Kotlin 中建立筆記本。它提供了我們的 IDE 體驗，具有所有常見的 IDE 功能，提供即時程式碼洞察和專案整合。

### Datalore 中的 Kotlin 筆記本

透過 [Datalore](https://datalore.jetbrains.com/)，您可以開箱即用地在瀏覽器中使用 Kotlin，無需額外安裝。您還可以共用您的筆記本並遠端執行它們，與其他 Kotlin 筆記本即時協作，在您撰寫程式碼時接收智慧程式碼輔助，並透過互動式或靜態報告匯出結果。

### 帶有 Kotlin Kernel 的 Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/) 是一個開源 Web 應用程式，可讓您建立和分享包含程式碼、視覺化和 Markdown 文字的檔案。[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一個開源專案，為 Jupyter Notebook 帶來 Kotlin 支援，以便在 Jupyter 環境中發揮 Kotlin 的強大功能。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 程式庫可讓您在 Kotlin 專案中操作結構化資料。從資料建立和清理到深入分析和特徵工程 (feature engineering)，此程式庫都能滿足您的需求。

借助 Kotlin DataFrame 程式庫，您可以處理不同的檔案格式，包括 CSV、JSON、XLS 和 XLSX。此程式庫還透過其能夠連接 SQL 資料庫或 API 的功能，簡化資料擷取過程。

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一個開源 Kotlin 程式庫，為繪製各種圖表提供強大且靈活的 DSL (Domain-Specific Language)。此程式庫是一個簡單、慣用、可讀且型別安全 (type-safe) 的工具，用於視覺化資料。

Kandy 與 Kotlin Notebook、Datalore 和 Kotlin-Jupyter Notebook 無縫整合。您還可以輕鬆結合 Kandy 和 Kotlin DataFrame 程式庫來完成不同的資料相關任務。

![Kandy](data-analysis-kandy-example.png){width=700}

## 後續步驟

*   [開始使用 Kotlin Notebook](get-started-with-kotlin-notebooks.md)
*   [使用 Kotlin DataFrame 程式庫擷取和轉換資料](data-analysis-work-with-data-sources.md)
*   [使用 Kandy 程式庫視覺化資料](data-analysis-visualization.md)
*   [了解更多關於 Kotlin 和 Java 資料分析程式庫的資訊](data-analysis-libraries.md)