[//]: # (title: Kotlin 適用於 AI 驅動的應用程式開發)

Kotlin 為建構 AI 驅動的應用程式提供了現代且務實的基礎。
它可跨平台使用，與既有的 AI 框架良好整合，並支援常見的 AI 開發模式。

## Koog

[Koog](https://koog.ai) 是 JetBrains 推出的一個開源框架，用於建構從簡單到複雜的 AI 代理程式。
它提供多平台支援、Spring Boot 和 Ktor 整合、慣用的 DSL，
以及開箱即用的生產就緒功能。

### 在幾行程式碼中建立一個簡單的代理程式

```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            // Use Anthropic, Google, OpenRouter, or any other provider
            executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```

<a href="https://docs.koog.ai/getting-started/"><img src="get-started-with-koog.svg" width="700" alt="開始使用 Koog" style="block"/></a>

### 主要功能

*   **支援多平台開發**。多平台支援可讓 JVM、JavaScript、
    WebAssembly、Android 和 iOS 進行代理式應用程式開發。
*   **可靠性與容錯能力**。憑藉內建的重試機制，Koog 讓開發者能夠處理逾時或工具錯誤等失敗情況。
    代理程式持久性使得恢復完整的代理程式狀態機成為可能，而不僅僅是聊天訊息。
*   **針對長上下文的內建歷史記錄壓縮技術**。Koog 附帶進階策略，用於壓縮和
    管理長時間執行的對話，無需額外設定。
*   **企業級整合**。Koog 與流行的 JVM 框架（如 [Spring Boot](https://spring.io/projects/spring-boot) 和 [Ktor](https://ktor.io)）整合。
*   **具備 OpenTelemetry 匯出器的可觀測性**。Koog 提供與流行的可觀測性供應商（例如
    W&B Weave 和 Langfuse）的開箱即用整合，用於監控和偵錯 AI 應用程式。
*   **LLM 切換與無縫歷史記錄適應**。Koog 允許隨時切換到不同的 LLM，並使用一組新的工具，
    而不會丟失現有的對話歷史記錄。
    它還可以在多個 LLM 供應商（包括 OpenAI、Anthropic、Google 及其他）之間重新路由。
    您可以透過 Koog 與 Ollama 的整合，使用本地模型在本地執行代理程式。
*   **與 JVM 和 Kotlin 應用程式整合**。Koog 提供專為 JVM 和 Kotlin 開發者設計的慣用、型別安全的 DSL。
*   **模型上下文協定 (MCP) 整合**。Koog 支援在代理程式中使用 MCP 工具。
*   **知識檢索與記憶**。透過嵌入、排名文件儲存和共享代理程式記憶體，
    Koog 本身可在對話中主動保留知識。
*   **串流功能**。Koog 讓開發者能夠透過串流支援和並行工具呼叫來即時處理回應。

### 從何開始

*   在 [總覽](https://docs.koog.ai/) 中探索 Koog 的功能。
*   透過 [入門指南](https://docs.koog.ai/getting-started/) 建構您的第一個 Koog 代理程式。
*   在 [Koog 版本說明](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md) 中查看最新更新。
*   從 [範例](https://docs.koog.ai/examples/) 中學習。

## 模型上下文協定 (MCP) Kotlin SDK

[MCP Kotlin SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 是模型上下文協定的 Kotlin 多平台實作。
該 SDK 讓開發者能夠在 Kotlin 中建構 AI 驅動的應用程式，並將其與 JVM、WebAssembly 和 iOS 上的 LLM 介面整合。

透過 MCP Kotlin SDK，您可以：

*   透過將上下文處理與 LLM 互動分離，以結構化和標準化的方式向 LLM 提供上下文。
*   建構從現有伺服器消費資源的 MCP 用戶端。
*   建立將提示、工具和資源公開給 LLM 的 MCP 伺服器。
*   使用標準通訊傳輸方式，例如 stdio、SSE 和 WebSocket。
*   處理所有 MCP 協定訊息和生命週期事件。

## 探索其他 AI 驅動的應用程式情境

由於 Java 的無縫互通性與 Kotlin 多平台，您可以將 Kotlin 與既有的 AI SDK 和框架結合，
建構後端和桌面/行動使用者介面，並採用 RAG 和代理式工作流程等模式。

> 您可以探索並執行來自 [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 儲存庫的範例。
> 每個專案都是獨立的。您可以將每個專案用作建構基於 Kotlin 的 AI 應用程式的參考或範本。

### 連接到主要的模型供應商

使用 Kotlin 連接到主要的模型供應商，例如 OpenAI、Anthropic、Google 及其他：

*   [OpenAI](https://github.com/openai/openai-java) — OpenAI API 的官方 Java SDK。它涵蓋回應和聊天、圖像和音訊。
*   [Anthropic (Claude)](https://github.com/anthropics/anthropic-sdk-java) — Claude Messages API 的官方 Java SDK。它包含用於 Vertex AI 和 Bedrock 整合的模組。
*   [Google AI (Gemini / Vertex AI)](https://github.com/googleapis/java-genai) — 官方 Java SDK，帶有一個單一用戶端，可在 Gemini API 和 Vertex AI 之間切換。
*   [Azure OpenAI](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai) — Azure OpenAI Service 的官方 Java 用戶端。它支援聊天補全和嵌入。
*   [AWS Bedrock](https://github.com/aws/aws-sdk-kotlin) — 呼叫基礎模型的官方 SDK。它包含用於 Bedrock 和 Bedrock Runtime 的 Kotlin SDK 和 Java SDK。

### 建立 RAG 管道和代理式應用程式

*   [Spring AI](https://github.com/spring-projects/spring-ai) — 針對提示、聊天、嵌入、工具和函式呼叫以及向量儲存的多供應商抽象。
*   [LangChain4j](https://docs.langchain4j.dev/tutorials/kotlin/) — 帶有 Kotlin 擴充功能的 JVM 工具包，用於提示、工具、檢索增強生成 (RAG) 管道和代理程式。

## 接下來

*   完成 [建立一個使用 Spring AI 回答問題的 Kotlin 應用程式](spring-ai-guide.md)
    教學課程，以了解如何在 IntelliJ IDEA 中使用 Spring AI 與 Kotlin。
*   加入 [Kotlin 社群](https://kotlinlang.org/community/)，與其他使用 Kotlin 建構 AI 應用程式的開發者交流。