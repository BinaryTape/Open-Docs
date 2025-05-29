[//]: # (title: Kotlin Notebook)

Kotlin Notebook 提供了一個互動式環境，用於建立和編輯筆記本，充分發揮 Kotlin 的強大功能。

Kotlin Notebook 依賴於 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，
該外掛程式在 [IntelliJ IDEA 中預設捆綁並啟用](kotlin-notebook-set-up-env.md)。

準備好迎接無縫的程式碼體驗吧！你可以在 IntelliJ IDEA 生態系統中開發和實驗 Kotlin 程式碼，獲得即時輸出，並整合程式碼、視覺效果和文字。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

Kotlin Notebook 外掛程式提供了[各種功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)來加速你的開發過程，例如：

*   在儲存格 (cells) 內存取 API
*   輕點幾下即可匯入和匯出檔案
*   使用 REPL 命令進行快速專案探索
*   獲得豐富的輸出格式集
*   透過註解 (annotations) 或 Gradle 樣式語法直觀地管理依賴項 (dependencies)
*   僅用一行程式碼即可匯入各種函式庫 (libraries)，甚至為你的專案添加新的函式庫
*   透過錯誤訊息和追溯 (traceback) 獲得除錯 (debugging) 見解

Kotlin Notebook 基於我們的 [Kotlin Kernel for Jupyter Notebooks](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)，
使其易於與其他 [Kotlin 筆記本解決方案](data-analysis-overview.md#notebooks)整合。
在沒有相容性問題的情況下，你可以輕鬆地在 Kotlin Notebook、[Datalore](https://datalore.jetbrains.com/) 和 [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter) 之間分享你的工作。

憑藉這些能力，你可以執行各種任務，從簡單的程式碼實驗到全面的資料專案。

深入了解以下章節，探索使用 Kotlin Notebook 可以實現哪些目標！

## 資料分析與視覺化

無論你是進行初步的資料探索，還是完成一個端到端的資料分析專案，Kotlin Notebook 都為你提供了合適的工具。

在 Kotlin Notebook 中，你可以直觀地整合[函式庫](data-analysis-libraries.md)，這些函式庫讓你能夠擷取 (retrieve)、轉換 (transform)、繪製 (plot) 和建模 (model) 你的資料，同時獲得操作的即時輸出。

對於分析相關任務，[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 函式庫提供了強大的解決方案。此函式庫有助於載入、建立、篩選和清理結構化資料。

Kotlin DataFrame 還支援與 SQL 資料庫的無縫連接，並可直接在 IDE (整合式開發環境) 中從不同檔案格式（包括 CSV、JSON 和 TXT）讀取資料。

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一個開源 (open-source) 的 Kotlin 函式庫，允許你建立各種型別的圖表。
Kandy 慣用、可讀且型別安全 (type-safe) 的特性讓你可以有效地視覺化資料並獲得有價值的見解。

![data-analytics-and-visualization](data-analysis-kandy-example.png){width=700}

## 原型開發

Kotlin Notebook 提供了一個互動式環境，用於以小區塊 (small chunks) 執行程式碼並即時查看結果。
這種親身體驗的方法使得在原型開發階段能夠快速實驗和疊代 (iteration)。

在 Kotlin Notebook 的幫助下，你可以在概念構思階段就及早測試解決方案的概念。此外，Kotlin Notebook 支援協作式 (collaborative) 和可重現性 (reproducible) 工作，從而能夠生成和評估新的想法。

![kotlin-notebook-prototyping](kotlin-notebook-prototyping.png){width=700}

## 後端開發

Kotlin Notebook 提供了在儲存格中呼叫 API 以及與 OpenAPI 等協定 (protocols) 協作的能力。它與外部服務和 API 互動的能力使其對於某些後端開發情境非常有用，例如在筆記本環境中直接擷取資訊和讀取 JSON 檔案。

![kotlin-notebook-backend-development](kotlin-notebook-backend-development.png){width=700}

## 程式碼文件

在 Kotlin Notebook 中，你可以在程式碼儲存格內包含行內註解 (inline comments) 和文字註釋 (text annotations)，以提供與程式碼片段相關的額外上下文、解釋和指示。

你也可以在 Markdown 儲存格中撰寫文字，這些儲存格支援豐富的格式選項，如標題、列表、連結、圖片等。
要呈現 (render) Markdown 儲存格並查看格式化文字，只需像執行程式碼儲存格一樣執行它。

![kotlin-notebook-documenting](kotlin-notebook-documentation.png){width=700}

## 分享程式碼與輸出

鑑於 Kotlin Notebook 遵循通用 Jupyter 格式，因此可以在不同的筆記本之間分享你的程式碼和輸出。
你可以使用任何 Jupyter 客戶端（例如 [Jupyter Notebook](https://jupyter.org/) 或 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)）開啟、編輯和執行你的 Kotlin Notebook。

你也可以透過將 `.ipynb` 筆記本檔案分享給任何筆記本網路檢視器來分發你的工作。一個選項是 [GitHub](https://github.com/)，它原生渲染這種格式。另一個選項是 [JetBrain 的 Datalore](https://datalore.jetbrains.com/) 平台，它具有排程筆記本執行等進階功能，有助於分享、執行和編輯筆記本。

![kotlin-notebook-sharing-datalore](kotlin-notebook-sharing-datalore.png){width=700}

## 後續步驟

*   [了解 Kotlin Notebook 的使用方式和主要功能。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
*   [試用 Kotlin Notebook。](get-started-with-kotlin-notebooks.md)
*   [深入探討 Kotlin 進行資料分析。](data-analysis-overview.md)