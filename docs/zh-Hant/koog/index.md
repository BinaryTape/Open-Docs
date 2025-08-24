# 總覽

Koog 是一個基於 Kotlin 的框架，旨在完全以慣用 Kotlin 語法建立並執行 AI 代理。它讓您能夠建立可與工具互動、處理複雜工作流程並與使用者溝通的代理。

該框架支援以下類型的代理：

*   單次執行代理：具有最少設定，處理單一輸入並提供回應。此類代理在單一工具呼叫週期內運作，以完成其任務並提供回應。
*   複雜工作流程代理：具有進階功能，支援自訂策略和設定。

## 主要功能

Koog 的主要功能包括：

-   **純 Kotlin 實現**：完全以自然且慣用的 Kotlin 語法建立 AI 代理。
-   **MCP 整合**：連接至 Model Control Protocol，以實現增強的模型管理。
-   **嵌入功能**：使用向量嵌入進行語義搜尋和知識檢索。
-   **自訂工具建立**：透過存取外部系統和 API 的工具擴展您的代理。
-   **開箱即用組件**：透過針對常見 AI 工程挑戰的預建解決方案加速開發。
-   **智慧歷史壓縮**：使用各種預建策略，在維持對話上下文的同時優化令牌使用。
-   **強大串流 API**：透過串流支援和平行工具呼叫，即時處理回應。
-   **持久代理記憶**：實現跨會話甚至不同代理的知識保留。
-   **全面追蹤**：透過詳細且可設定的追蹤，偵錯並監控代理執行。
-   **彈性圖形工作流程**：使用直觀的圖形化工作流程設計複雜的代理行為。
-   **模組化功能系統**：透過可組合架構自訂代理功能。
-   **可擴展架構**：處理從簡單聊天機器人到企業應用程式的工作負載。
-   **多平台**：透過 Kotlin Multiplatform 在 JVM、JS、WasmJS 目標上執行代理。

# 可用的 LLM 提供者和平台

您可以用來為代理功能提供動力的 LLM 提供者和平台：

-   Google
-   OpenAI
-   Anthropic
-   OpenRouter
-   Ollama

# 安裝

要使用 Koog，您需要在建置設定中包含所有必要的依賴項。

## Gradle

### Gradle (Kotlin DSL)

1.  將依賴項新增至 `build.gradle.kts` 檔案：

    ```
    dependencies {
        implementation("ai.koog:koog-agents:LATEST_VERSION")
    }
    ```

2.  確保您的儲存庫列表中包含 `mavenCentral()`。

### Gradle (Groovy)

1.  將依賴項新增至 `build.gradle` 檔案：

    ```
    dependencies {
        implementation 'ai.koog:koog-agents:LATEST_VERSION'
    }
    ```

2.  確保您的儲存庫列表中包含 `mavenCentral()`。

## Maven

1.  將依賴項新增至 `pom.xml` 檔案：

    ```
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>LATEST_VERSION</version>
    </dependency>
    ```

2.  確保您的儲存庫列表中包含 `mavenCentral`。

# 快速入門範例

為了幫助您開始使用 AI 代理，這是一個單次執行代理的快速範例：

!!! note
    在執行範例之前，請將相應的 API 金鑰設定為環境變數。詳細資訊請參閱 [開始使用](single-run-agents.md)。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        val apiKey = System.getenv("OPENAI_API_KEY") // 或 Anthropic, Google, OpenRouter 等。

        val agent = AIAgent(
            executor = simpleOpenAIExecutor(apiKey), // 或 Anthropic, Google, OpenRouter 等。
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```
<!--- KNIT example-index-01.kt -->
更多詳細資訊，請參閱 [開始使用](single-run-agents.md)。