[//]: # (title: Kotlin 用於 AI 驅動的應用程式開發)

Kotlin 為建構 AI 驅動的應用程式提供了現代且務實的基礎。它可以在多個平台中使用，與既有的 AI 框架良好整合，並支援常見的 AI 開發模式。

> 本頁介紹 Kotlin 如何在實際的 AI 情境中使用，並附有來自
> [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 儲存庫的實例。
> 
{style="note"}

## Kotlin AI 代理式框架 – Koog

[Koog](https://koog.ai) 是一個基於 Kotlin 的框架，用於在本地端建立和執行 AI 代理程式，無需外部服務。Koog 是 JetBrains 創新的開源代理式框架，它使開發人員能夠在 JVM 生態系統中建構 AI 代理程式。它提供了純 Kotlin 實作，用於建構能夠與工具互動、處理複雜工作流程並與使用者通訊的智慧型代理程式。

## 更多使用情境

還有許多其他使用情境，Kotlin 可以協助 AI 開發。從將語言模型整合到後端服務，到建構 AI 驅動的使用者介面，這些範例展示了 Kotlin 在各種 AI 應用程式中的多功能性。

### 檢索增強生成

使用 Kotlin 建構檢索增強生成 (RAG) 管線，將語言模型連接到文件、向量儲存或 API 等外部來源。例如：

*   [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo)：一個 Spring Boot 應用程式，將 Kotlin 標準函式庫文件載入到向量儲存中，並支援基於文件的問答。
*   [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot)：一個使用 LangChain4j 的最小 RAG 範例。

### 基於代理程式的應用程式

使用 Kotlin 建構能夠使用語言模型和工具進行推理、規劃和行動的 AI 代理程式。例如：

*   [`koog`](https://github.com/JetBrains/koog)：展示如何使用 Kotlin 代理式框架 Koog 來建構 AI 代理程式。
*   [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot)：包含一個使用 LangChain4j 建構的簡單工具使用代理程式。

### 思維鏈提示

實作結構化的提示技術，引導語言模型進行多步驟推理。例如：

*   [`LangChain4j_Overview.ipynb`](https://github.com/Kotlin/Kotlin-AI-Examples/blob/master/notebooks/langchain4j/LangChain4j_Overview.ipynb)：一個展示思維鏈和結構化輸出的 Kotlin Notebook。

### 後端服務中的 LLMs

使用 Kotlin 和 Spring 將大型語言模型 (LLMs) 整合到業務邏輯或 REST API 中。例如：

*   [`spring-ai-examples`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/spring-ai-examples)：包含分類、聊天和摘要範例。
*   [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo)：展示大型語言模型 (LLM) 回應與應用程式邏輯的完整整合。

### 結合 AI 的多平台使用者介面

使用 Compose Multiplatform 以 Kotlin 建構互動式的 AI 驅動使用者介面。例如：

*   [`mcp-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/mcp/mcp-demo)：一個連接到 Claude 和 OpenAI，並使用 Compose Multiplatform 呈現回應的桌面使用者介面。

## 探索範例

您可以探索並執行來自 [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 儲存庫的範例。每個專案都是獨立的。您可以將每個專案作為建構基於 Kotlin 的 AI 應用程式的參考或範本。

## 後續步驟

*   完成 [建構一個使用 Spring AI 的 Kotlin 應用程式，以回答基於 Qdrant 中儲存文件的問題](spring-ai-guide.md) 教程，以了解更多關於如何在 IntelliJ IDEA 中使用 Spring AI 與 Kotlin 的資訊
*   加入 [Kotlin 社群](https://kotlinlang.org/community/)，與其他使用 Kotlin 建構 AI 應用程式的開發人員聯繫