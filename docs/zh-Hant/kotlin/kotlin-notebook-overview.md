[//]: # (title: Kotlin Notebook)

Kotlin Notebook 提供了一個互動式環境，用於建立和編輯筆記本，充分發揮 Kotlin 的強大功能。

Kotlin Notebook 仰賴 [Kotlin Notebook 外掛程式](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)，此程式已預先綑綁並 [預設在 IntelliJ IDEA 中啟用](kotlin-notebook-set-up-env.md)。

準備好迎接流暢的編碼體驗，您可以在 IntelliJ IDEA 生態系統內開發和試驗 Kotlin 程式碼、即時接收輸出，並整合程式碼、視覺效果和文字。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

Kotlin Notebook 外掛程式隨附[各種功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)，可提升您的開發流程，例如：

*   在儲存格內存取 API
*   輕鬆點擊即可匯入和匯出檔案
*   使用 REPL 命令進行快速專案探索
*   獲得豐富的輸出格式集
*   使用註解或類似 Gradle 的語法直覺地管理依賴項
*   僅需一行程式碼即可匯入各種程式庫，甚至將新的程式庫新增至您的專案
*   透過錯誤訊息和追溯獲取偵錯見解

Kotlin Notebook 基於我們的 [Kotlin Kernel for Jupyter Notebooks](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)，使其易於與其他 [Kotlin 筆記本解決方案](data-analysis-overview.md#notebooks)整合。沒有相容性問題，您可以在 Kotlin Notebook、[Datalore](https://datalore.jetbrains.com/) 和 [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter) 之間輕鬆分享您的工作。

憑藉這些功能，您可以執行各種任務，從簡單的程式碼試驗到全面的資料專案。

深入探索以下章節，以發現您能用 Kotlin Notebook 實現什麼！

## 資料分析與視覺化

無論您是進行初步資料探索還是完成端對端資料分析專案，Kotlin Notebook 都具備適合您的工具。

在 Kotlin Notebook 中，您可以直覺地整合[程式庫](data-analysis-libraries.md)，讓您能夠擷取、轉換、繪圖和建模您的資料，同時即時取得操作的輸出。

對於分析相關任務，[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 程式庫提供了強大的解決方案。此程式庫有助於載入、建立、篩選和清理結構化資料。

Kotlin DataFrame 還支援與 SQL 資料庫無縫連接，並直接在 IDE 中從不同檔案格式（包括 CSV、JSON 和 TXT）讀取資料。

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一個開源 Kotlin 程式庫，允許您建立各種型別的圖表。Kandy 慣用、可讀且型別安全的特性讓您可以有效地視覺化資料並獲得有價值的見解。

![data-analytics-and-visualization](data-analysis-kandy-example.png){width=700}

## 原型開發

Kotlin Notebook 提供了一個互動式環境，用於以小塊方式執行程式碼並即時查看結果。這種親身體驗的方法實現了在原型開發階段的快速試驗和迭代。

在 Kotlin Notebook 的幫助下，您可以在構思階段的早期測試解決方案的概念。此外，Kotlin Notebook 支援協作和可重現的工作，能夠產生並評估新想法。

![kotlin-notebook-prototyping](kotlin-notebook-prototyping.png){width=700}

## 後端開發

Kotlin Notebook 提供了在儲存格內呼叫 API 並處理像 OpenAPI 這樣的協定的功能。其與外部服務和 API 互動的能力使其適用於某些後端開發場景，例如直接在筆記本環境中擷取資訊和讀取 JSON 檔案。

![kotlin-notebook-backend-development](kotlin-notebook-backend-development.png){width=700}

## 程式碼文件

在 Kotlin Notebook 中，您可以在程式碼儲存格內包含行內註解和文字註釋，以提供與程式碼片段相關的額外背景資訊、解釋和說明。

您還可以在 Markdown 儲存格中撰寫文字，這些儲存格支援豐富的格式設定選項，例如標題、列表、連結、圖像等。若要渲染 Markdown 儲存格並查看格式化文字，只需像執行程式碼儲存格一樣執行它。

![kotlin-notebook-documenting](kotlin-notebook-documentation.png){width=700}

## 分享程式碼和輸出

由於 Kotlin Notebook 遵循通用的 Jupyter 格式，因此可以在不同的筆記本之間分享您的程式碼和輸出。您可以使用任何 Jupyter 用戶端開啟、編輯和執行您的 Kotlin Notebook，例如 [Jupyter Notebook](https://jupyter.org/) 或 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)。

您還可以透過與任何筆記本網路檢視器分享 `.ipynb` 筆記本檔案來分發您的工作。一個選項是 [GitHub](https://github.com/)，它原生支援渲染此格式。另一個選項是 [JetBrain 的 Datalore](https://datalore.jetbrains.com/) 平台，它有助於分享、執行和編輯筆記本，並提供排程的筆記本執行等進階功能。

![kotlin-notebook-sharing-datalore](kotlin-notebook-sharing-datalore.png){width=700}

## 接下來

*   [了解 Kotlin Notebook 的用法和主要功能。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
*   [試用 Kotlin Notebook。](get-started-with-kotlin-notebooks.md)
*   [深入探討 Kotlin 進行資料分析。](data-analysis-overview.md)