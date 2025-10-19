# 總覽

Koog 是一個開源的 JetBrains 框架，旨在完全以慣用 Kotlin 語法建立並執行 AI 代理。它讓您能夠建立可與工具互動、處理複雜工作流程並與使用者溝通的代理。

該框架支援以下類型的代理：

*   單次執行代理，具有最少設定，處理單一輸入並提供回應。此類代理在單一工具呼叫週期內運作，以完成其任務並提供回應。
*   功能型代理，具有由 lambda 函式定義的輕量、可自訂邏輯，用於處理使用者輸入、與 LLM 互動、呼叫工具並產生最終輸出。
*   複雜工作流程代理，具有進階功能，支援自訂策略和設定。

## 主要功能

Koog 的主要功能包括：

-   **多平台開發**：透過 Kotlin Multiplatform 在 JVM、JS、WasmJS、Android 和 iOS 目標上部署代理。
-   **可靠性與容錯能力**：透過內建重試處理故障，並利用代理持久化功能在執行期間的特定點恢復代理狀態。
-   **智慧歷史壓縮**：使用先進的內建歷史壓縮技術，在長期對話中保持上下文的同時優化令牌使用。
-   **企業級整合**：利用與 Spring Boot 和 Ktor 等流行 JVM 框架的整合，將 Koog 嵌入您的應用程式。
-   **透過 OpenTelemetry 匯出器的可觀察性**：透過內建支援流行的可觀察性提供者 (W&B Weave, Langfuse) 監控和偵錯應用程式。
-   **LLM 切換與無縫歷史適應**：可以在任何時候切換到不同的 LLM，而不會丟失現有的對話歷史，或在多個 LLM 提供者之間重新路由。
-   **與 JVM 和 Kotlin 應用程式的整合**：使用專為 JVM 和 Kotlin 開發者設計的慣用、型別安全 Kotlin DSL 建立 AI 代理。
-   **Model Context Protocol 整合**：在 AI 代理中使用 Model Context Protocol (MCP) 工具。
-   **知識檢索與記憶**：使用向量嵌入、分級文件儲存和共享代理記憶，在對話中保留和檢索知識。
-   **強大串流 API**：透過串流支援和平行工具呼叫，即時處理回應。
-   **模組化功能系統**：透過可組合架構自訂代理功能。
-   **彈性圖形工作流程**：使用直觀的圖形化工作流程設計複雜的代理行為。
-   **自訂工具建立**：透過存取外部系統和 API 的工具增強您的代理。
-   **全面追蹤**：透過詳細且可設定的追蹤，偵錯並監控代理執行。

## 可用的 LLM 提供者和平台

您可以用來為代理功能提供動力的 LLM 提供者和平台：

-   Google
-   OpenAI
-   Anthropic
-   DeepSeek
-   OpenRouter
-   Ollama
-   Bedrock

如需有關如何將這些提供者與專用 LLM 用戶端搭配使用的詳細指南，請參閱 [使用 LLM 用戶端執行提示](prompt-api.md#running-prompts-with-llm-clients)。

## 安裝

要使用 Koog，您需要在建置設定中包含所有必要的依賴項。

**請注意！** Ktor [client](https://ktor.io/docs/client-engines.html) 和 [server](https://ktor.io/docs/server-engines.html) 引擎依賴項預設情況下不包含在函式庫中，因此您應該自行添加您選擇的引擎。

### Gradle

#### Gradle (Kotlin DSL)

1.  將依賴項新增至 `build.gradle.kts` 檔案：

    ```
    dependencies {
        implementation("ai.koog:koog-agents:LATEST_VERSION")
       // 明確包含 Ktor client 依賴項
        implementation("io.ktor:ktor-client-cio:$ktor_version")
    }
    ```
    Ktor [client](https://ktor.io/docs/client-engines.html) 和 [server](https://ktor.io/docs/server-engines.html) 引擎依賴項預設情況下不包含在函式庫中，因此您應該自行添加您選擇的引擎。

2.  確保您的儲存庫列表中包含 `mavenCentral()`。

#### Gradle (Groovy)

1.  將依賴項新增至 `build.gradle` 檔案：

    ```
    dependencies {
        implementation 'ai.koog:koog-agents:LATEST_VERSION'
        implementation 'io.ktor:ktor-client-cio:KTOR_VERSION'
    }
    ```

2.  確保您的儲存庫列表中包含 `mavenCentral()`。

### Maven

1.  將依賴項新增至 `pom.xml` 檔案：

    ```xml
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>LATEST_VERSION</version>
    </dependency>
    ```

2.  新增 Ktor 依賴項。請在此處查看 Ktor 版本 [here](https://mvnrepository.com/artifact/io.ktor/ktor-bom)。
    ```xml
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-bom</artifactId>
                <version>KTOR_VERSION</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
   
    <dependencies>
        <dependency>
            <groupId>io.ktor</groupId>
            <artifactId>ktor-client-cio-jvm</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- 如果您正在使用 MCP 等功能，請新增 Ktor 伺服器依賴項 -->
        <dependency>
            <groupId>io.ktor</groupId>
            <artifactId>ktor-server-netty-jvm</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

    ```

2.  確保您的儲存庫列表中包含 `mavenCentral`。

## 快速入門範例

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
        val apiKey = System.getenv("OPENAI_API_KEY") // 或 Anthropic、Google、OpenRouter 等。

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey), // 或 Anthropic、Google、OpenRouter 等。
            systemPrompt = "您是一個樂於助人的助手。簡潔地回答用戶問題。",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```
<!--- KNIT example-index-01.kt -->
更多詳細資訊，請參閱 [開始使用](single-run-agents.md)。