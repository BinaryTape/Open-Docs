---
title: "用於數據分析的 Kotlin"
---
探索和分析資料可能不是您每天都會做的事情，但作為軟體開發人員，這是一項至關重要的技能。

讓我們思考一下資料分析是關鍵的軟體開發職責：在除錯時分析集合中實際包含的內容、深入研究記憶體傾印或資料庫，或者在使用 REST API 時接收包含大量資料的 JSON 檔案等等。

借助 Kotlin 的探索性資料分析（Exploratory Data Analysis，EDA）工具，例如 [Kotlin Notebooks](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe) 和 [Kandy](#kandy)，您可以
擁有一套豐富的功能，可以增強您的分析技能並在不同的情況下支援您：

* **載入、轉換和視覺化各種格式的資料：** 使用我們的 Kotlin EDA 工具，您可以執行諸如篩選、排序和聚合資料等任務。 我們的工具可以無縫地
在 IDE 中直接讀取來自不同檔案格式的資料，包括 CSV、JSON 和 TXT。

    Kandy（我們的繪圖工具）允許您建立各種圖表，以視覺化資料集並從中獲得見解。

* **高效地分析儲存在關聯式資料庫中的資料：** Kotlin DataFrame 無縫地與資料庫整合，並提供類似於 SQL 查詢的功能。
您可以直接從各種資料庫中檢索、操作和視覺化資料。

* **從 Web API 擷取和分析即時和動態資料集：** EDA 工具的靈活性允許透過 OpenAPI 等協定與外部 API 整合。
此功能可協助您從 Web API 擷取資料，然後根據您的需要清理和轉換資料。

您想試用我們的 Kotlin 工具進行資料分析嗎？

<a href="get-started-with-kotlin-notebooks"><img src="/img/kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook" /></a>

我們的 Kotlin 資料分析工具可讓您從頭到尾順利處理資料。 使用我們的 Kotlin Notebook 中簡單的拖放功能輕鬆地
檢索您的資料。 只需幾行程式碼即可清理、轉換和視覺化資料。
此外，只需點擊幾下即可匯出您的輸出圖表。

<img src="/img/data-analysis-notebook.gif" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

## Notebooks

_Notebooks_（筆記本）是互動式編輯器，可在單一環境中整合程式碼、圖形和文字。 使用筆記本時，
您可以執行程式碼儲存格並立即查看輸出。

Kotlin 提供不同的筆記本解決方案，例如 [Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore)
和 [Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel)，為資料檢索、轉換、探索、建模等提供便利的功能。
這些 Kotlin 筆記本解決方案基於我們的 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)。

您可以無縫地在 Kotlin Notebook、Datalore 和 Kotlin-Jupyter Notebook 之間共用您的程式碼。 在我們的其中一個 Kotlin 筆記本中建立專案，
並在另一個筆記本中繼續工作，而不會出現相容性問題。

受益於我們強大的 Kotlin 筆記本的功能以及使用 Kotlin 進行程式碼編寫的優勢。 Kotlin 與這些筆記本整合
以幫助您管理資料並與同事分享您的發現，同時建立您的資料科學和機器學習技能。

探索我們不同的 Kotlin 筆記本解決方案的功能，並選擇最符合您專案要求的解決方案。

<img src="/img/kotlin-notebook.png" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview) 是 IntelliJ IDEA 的一個外掛程式，可讓您在 Kotlin 中建立筆記本。 它提供我們的 IDE 體驗以及所有常見的 IDE 功能，
提供即時程式碼見解和專案整合。

### Kotlin notebooks in Datalore

透過 [Datalore](https://datalore.jetbrains.com/)，您可以直接在瀏覽器中使用 Kotlin，而無需額外安裝。
您還可以共用您的筆記本並遠端執行它們、與其他 Kotlin 筆記本即時協作、
在您編寫程式碼時接收智慧程式碼輔助，以及透過互動式或靜態報告匯出結果。

### Jupyter Notebook with Kotlin Kernel

[Jupyter Notebook](https://jupyter.org/) 是一個開放原始碼的 Web 應用程式，
可讓您建立和共用包含程式碼、
視覺化效果和 Markdown 文字的文件。
[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一個開放原始碼專案，可將 Kotlin
支援引入 Jupyter Notebook，以在 Jupyter 環境中利用 Kotlin 的強大功能。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 函式庫可讓您在 Kotlin 專案中操作結構化資料。 從資料建立和
清理到深入分析和特徵工程，此函式庫都能滿足您的需求。

使用 Kotlin DataFrame 函式庫，您可以處理不同的檔案格式，包括 CSV、JSON、XLS 和 XLSX。 此函式庫還簡化了資料檢索過程，
並能夠與 SQL 資料庫或 API 連接。

<img src="/img/data-analysis-dataframe-example.png" alt="Kotlin DataFrame" width="700" style={{verticalAlign: 'middle'}}/>

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一個開放原始碼的 Kotlin 函式庫，它提供了一個強大而靈活的 DSL，用於繪製各種型別的圖表。
此函式庫是一個簡單、慣用、可讀且型別安全的工具，用於視覺化資料。

Kandy 與 Kotlin Notebook、Datalore 和 Kotlin-Jupyter Notebook 無縫整合。 您還可以輕鬆地組合 Kandy 和
Kotlin DataFrame 函式庫來完成不同的資料相關任務。

<img src="/img/data-analysis-kandy-example.png" alt="Kandy" width="700" style={{verticalAlign: 'middle'}}/>

## 接下來

* [Get started with Kotlin Notebook](get-started-with-kotlin-notebooks)
* [Retrieve and transform data using the Kotlin DataFrame library](data-analysis-work-with-data-sources)
* [Visualize data using the Kandy library](data-analysis-visualization)
* [Learn more about Kotlin and Java libraries for data analysis](data-analysis-libraries)