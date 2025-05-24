---
title: "Kotlin Notebook"
---
[Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) 是一個 IntelliJ IDEA 的動態外掛程式（Plugin），它提供一個互動式環境來建立和編輯 Notebook，充分利用 Kotlin 的所有潛力。

:::note
Kotlin Notebook 外掛程式（Plugin）需要 IntelliJ IDEA Ultimate。

:::

準備好迎接流暢的程式碼編寫體驗吧！您可以在 IntelliJ IDEA 生態系統中開發和實驗 Kotlin 程式碼、接收即時輸出，並整合程式碼、視覺效果和文字。

<img src="/img/data-analysis-notebook.gif" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin Notebook 外掛程式（Plugin）提供[多種功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)來加速您的開發流程，例如：

* 在儲存格（Cell）中存取 API
* 透過點擊幾下匯入和匯出檔案
* 使用 REPL 指令快速探索專案
* 獲得豐富的輸出格式
* 使用註解（Annotation）或類似 Gradle 的語法直觀地管理依賴項（Dependency）
* 使用單行程式碼匯入各種程式庫（Library），甚至將新程式庫（Library）新增到您的專案中
* 透過錯誤訊息和追蹤（Traceback）取得除錯的見解

Kotlin Notebook 基於我們的 [Kotlin Kernel for Jupyter Notebooks](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)，使其易於與其他 [Kotlin notebook 解決方案](data-analysis-overview#notebooks)整合。
沒有相容性問題，您可以輕鬆地在 Kotlin Notebook、
[Datalore](https://datalore.jetbrains.com/) 和 [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter) 之間分享您的工作。

憑藉這些功能，您可以開始執行各種任務，從簡單的程式碼實驗到全面的資料專案。

深入研究以下各節，以了解您可以使用 Kotlin Notebook 實現哪些目標！

## 資料分析和視覺化

無論您是進行初步資料探索還是完成端到端（End-to-End）的資料分析專案，Kotlin Notebook 都能提供適合您的工具。

在 Kotlin Notebook 中，您可以直觀地整合[程式庫（Library）](data-analysis-libraries)，這些程式庫（Library）可讓您檢索、轉換、繪製和建模您的資料，同時獲得操作的即時輸出。

對於與分析相關的任務，[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 程式庫（Library）提供了強大的解決方案。此程式庫（Library）有助於載入、建立、篩選和清理結構化資料。

Kotlin DataFrame 還支援與 SQL 資料庫的無縫連接，並直接在 IDE 中從不同的檔案格式（包括 CSV、JSON 和 TXT）讀取資料。

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一個開源 Kotlin 程式庫（Library），可讓您建立各種圖表。
Kandy 的慣用、可讀且型別安全（Type-safe）的功能可讓您有效地視覺化資料並獲得寶貴的見解。

<img src="/img/data-analysis-kandy-example.png" alt="data-analytics-and-visualization" width="700" style={{verticalAlign: 'middle'}}/>

## 建立原型

Kotlin Notebook 提供了一個互動式環境，用於以小塊的形式執行程式碼並即時查看結果。
這種實務方法可在原型設計階段實現快速實驗和迭代。

借助 Kotlin Notebook，您可以在概念驗證階段儘早測試解決方案的概念。此外，Kotlin Notebook 支援協作和可重現的工作，從而能夠產生和評估新想法。

<img src="/img/kotlin-notebook-prototyping.png" alt="kotlin-notebook-prototyping" width="700" style={{verticalAlign: 'middle'}}/>

## 後端開發

Kotlin Notebook 能夠在儲存格（Cell）中呼叫 API 並使用 OpenAPI 等協定。它與外部服務和 API 互動的能力使其適用於某些後端開發場景，例如直接在您的 Notebook 環境中檢索資訊和讀取 JSON 檔案。

<img src="/img/kotlin-notebook-backend-development.png" alt="kotlin-notebook-backend-development" width="700" style={{verticalAlign: 'middle'}}/>

## 程式碼文件

在 Kotlin Notebook 中，您可以在程式碼儲存格（Cell）中包含內嵌註解和文字註解，以提供與程式碼片段相關的其他上下文、說明和指示。

您也可以在 Markdown 儲存格（Cell）中編寫文字，這些儲存格（Cell）支援豐富的格式選項，例如標題、清單、連結、圖像等。
要呈現 Markdown 儲存格（Cell）並查看格式化的文字，只需像執行程式碼儲存格（Cell）一樣執行它即可。

<img src="/img/kotlin-notebook-documentation.png" alt="kotlin-notebook-documenting" width="700" style={{verticalAlign: 'middle'}}/>

## 分享程式碼和輸出

鑑於 Kotlin Notebook 遵循通用的 Jupyter 格式，因此可以在不同的 Notebook 之間分享您的程式碼和輸出。
您可以使用任何 Jupyter 客戶端（例如 [Jupyter Notebook](https://jupyter.org/) 或 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)）開啟、編輯和執行 Kotlin Notebook。

您也可以透過與任何 Notebook 網路檢視器分享 `.ipynb` Notebook 檔案來分發您的工作。其中一個選項是 [GitHub](https://github.com/)，它原生呈現此格式。另一個選項是 [JetBrain's Datalore](https://datalore.jetbrains.com/) 平台，它有助於分享、執行和編輯具有進階功能的 Notebook，例如排定的 Notebook 執行。

<img src="/img/kotlin-notebook-sharing-datalore.png" alt="kotlin-notebook-sharing-datalore" width="700" style={{verticalAlign: 'middle'}}/>

## 接下來

* [了解 Kotlin Notebook 的用法和主要功能。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
* [試用 Kotlin Notebook。](get-started-with-kotlin-notebooks)
* [深入研究用於資料分析的 Kotlin。](data-analysis-overview)