[//]: # (title: Kotlin 資料分析)

探索與分析資料可能不是您每天都會做的事，但這是身為軟體開發人員所必須具備的一項關鍵技能。

讓我們思考一下資料分析在軟體開發職責中扮演關鍵角色的情況：例如在偵錯時分析集合內部的實際內容、挖掘記憶體傾印或資料庫，或是在處理 REST API 時收到包含大量資料的 JSON 檔案等等。

藉由 Kotlin 的探索性資料分析 (EDA) 工具，例如 [Kotlin notebook](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe) 以及 [Kandy](#kandy)，您擁有一套豐富的功能來增強分析技能，並在不同情境下提供支援：

* **載入、轉換與視覺化各種格式的資料：** 透過我們的 Kotlin EDA 工具，您可以執行篩選、排序與聚合資料等任務。我們的工具可以從各種檔案格式（包括 CSV、JSON 與 TXT）直接在 IDE 中無縫讀取資料。

    Kandy 是我們的繪圖工具，可讓您建立各式各樣的圖表，以視覺化方式從資料集中獲取洞察。

* **高效分析儲存在關聯式資料庫中的資料：** Kotlin DataFrame 與資料庫無縫整合，並提供類似 SQL 查詢的功能。您可以直接從各種資料庫中檢索、操作與視覺化資料。

* **從 Web API 獲取並分析即時與動態資料集：** EDA 工具的靈活性允許透過 OpenAPI 等協定與外部 API 整合。此功能可協助您從 Web API 獲取資料，接著根據需求清理與轉換資料。

您想嘗試我們的 Kotlin 資料分析工具嗎？

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="開始使用 Kotlin Notebook" style="block"/></a>

我們的 Kotlin 資料分析工具讓您能從頭到尾順暢地處理資料。在我們的 Kotlin Notebook 中使用簡單的拖放功能即可毫不費力地獲取資料。只需幾行程式碼即可進行清理、轉換與視覺化。此外，只需點擊幾下即可匯出輸出的圖表。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## Notebooks

*notebook* 是一種互動式文件，您可以在其中將可執行的 Kotlin 程式碼與文字、視覺化內容及結果結合在一起。您可以將其視為 Kotlin REPL 的延伸，並增加了將程式碼組織成程式碼資料格、使用 Markdown 編寫文件，以及在產生程式碼的旁即時顯示輸出（從文字到圖表）的能力。

Kotlin 提供不同的 notebook 解決方案，例如 [Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore) 以及 [Jupyter Notebook 與 Kotlin Kernel](#jupyter-notebook-with-kotlin-kernel)，為資料檢索、轉換、探索、建模等提供便利的功能。這些 Kotlin notebook 解決方案均基於我們的 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)。

您可以在 Kotlin Notebook、Datalore 與 Kotlin-Jupyter Notebook 之間無縫分享您的程式碼。在其中一個 Kotlin notebook 中建立專案，即可在另一個 notebook 中繼續工作，而不會有相容性問題。

受益於我們強大的 Kotlin notebook 功能以及使用 Kotlin 編碼的優勢。Kotlin 與這些 notebook 整合，可協助您管理資料並與同事分享發現，同時建立您的資料科學與機器學習技能。

探索我們不同 Kotlin notebook 解決方案的功能，並選擇最符合您專案需求的方案。

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview.md) 是一款 IntelliJ IDEA 的外掛程式，可讓您在 Kotlin 中建立 notebook。它提供具備所有常用 IDE 功能的 IDE 體驗，提供即時的程式碼洞察與專案整合。

### Datalore 中的 Kotlin notebook

透過 [Datalore](https://datalore.jetbrains.com/)，您可以直接在瀏覽器中使用 Kotlin，開箱即用，無需額外安裝。您還可以分享您的 notebook 並遠端執行、與其他 Kotlin notebook 即時協作、在編寫程式碼時獲得智慧編碼輔助，並透過互動式或靜態報告匯出結果。

### 帶有 Kotlin Kernel 的 Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/) 是一款開源 Web 應用程式，可讓您建立與分享包含程式碼、視覺化內容及 Markdown 文字的文件。[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一個開源專案，它為 Jupyter Notebook 帶來了 Kotlin 支援，以便在 Jupyter 環境中發揮 Kotlin 的力量。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 程式庫可讓您在 Kotlin 專案中操作結構化資料。從資料建立與清理，到深入分析與特徵工程，此程式庫都能滿足您的需求。

藉由 Kotlin DataFrame 程式庫，您可以處理不同的檔案格式，包括 CSV、JSON、XLS 與 XLSX。此程式庫還能與 SQL 資料庫或 API 連接，促進資料檢索過程。

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一個開源 Kotlin 程式庫，提供強大且靈活的 DSL，用於繪製各種類型的圖表。此程式庫是一個簡單、慣用、易讀且型別安全的工具，用於視覺化資料。

Kandy 與 Kotlin Notebook、Datalore 及 Kotlin-Jupyter Notebook 無縫整合。您還可以輕鬆結合 Kandy 與 Kotlin DataFrame 程式庫來完成不同的資料相關任務。

![Kandy](data-analysis-kandy-example.png){width=700}

## 下一步

* [開始使用 Kotlin Notebook](get-started-with-kotlin-notebooks.md)
* [使用 Kotlin DataFrame 程式庫檢索與轉換資料](data-analysis-work-with-data-sources.md)
* [使用 Kandy 程式庫視覺化資料](data-analysis-visualization.md)
* [進一步了解用於資料分析的 Kotlin 與 Java 程式庫](data-analysis-libraries.md)