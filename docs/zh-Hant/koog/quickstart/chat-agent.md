# 建立具備記憶功能的聊天代理

本指南將向您展示如何使用 [ChatMemory](../chat-memory.md) 功能來建立一個對話式聊天代理（Chat Agent），該代理能在多次互動中記住先前的訊息。

## 前置條件

--8<-- "quickstart-snippets.md:prerequisites"

## 安裝 Koog 與 Memory 功能

=== "Gradle (Kotlin)"

    ```kotlin title="build.gradle.kts"
    dependencies {
        implementation("ai.koog:koog-agents:0.7.0")
        implementation("ai.koog:agents-features-memory:0.7.0")
    }
    ```

=== "Gradle (Groovy)"

    ```groovy title="build.gradle"
    dependencies {
        implementation 'ai.koog:koog-agents:0.7.0'
        implementation 'ai.koog:agents-features-memory:0.7.0'
    }
    ```

=== "Maven"

    ```xml title="pom.xml"
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>0.7.0</version>
    </dependency>
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>agents-features-memory-jvm</artifactId>
        <version>0.7.0</version>
    </dependency>
    ```

## 設定 API 金鑰

--8<-- "quickstart-snippets.md:api-key"

## 您將建置的內容

一個命令列聊天代理，其具備以下特點：

- 在迴圈中接受使用者輸入
- 將每則訊息傳送至 LLM
- 在多次 `agent.run()` 呼叫之間記住完整的對話歷程記錄
- 使用滑動視窗來限制內容語境的大小

若沒有 ChatMemory，每次呼叫 `agent.run()` 都會啟動一個新的對話 —— 代理不會知道先前說過的話。ChatMemory 解決了這個問題，它會在每次執行前自動載入先前的訊息，並在執行後儲存更新的歷程記錄。

## 建立聊天代理

=== "OpenAI"

    <!--- INCLUDE
    import ai.koog.agents.chatMemory.feature.ChatMemory
    import ai.koog.agents.chatMemory.feature.InMemoryChatHistoryProvider
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    suspend fun main() {
        val sessionId = "my-conversation"

        val toolRegistry = ToolRegistry {
            // 在此處註冊您的工具
        }

        simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")).use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = OpenAIModels.Chat.GPT5_2,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20) // 僅保留最後 20 則訊息
                }
            }

            while (true) {
                print("您: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("助理: $reply
")
            }
        }
    }
    ```

=== "Anthropic"

    <!--- INCLUDE
    import ai.koog.agents.chatMemory.feature.ChatMemory
    import ai.koog.agents.chatMemory.feature.InMemoryChatHistoryProvider
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
    -->
    ```kotlin
    suspend fun main() {
        val sessionId = "my-conversation"

        val toolRegistry = ToolRegistry {
            // 在此處註冊您的工具
        }

        simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY")).use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = AnthropicModels.Sonnet4_1,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20)
                }
            }

            while (true) {
                print("您: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("助理: $reply
")
            }
        }
    }
    ```

=== "Google"

    <!--- INCLUDE
    import ai.koog.agents.chatMemory.feature.ChatMemory
    import ai.koog.agents.chatMemory.feature.InMemoryChatHistoryProvider
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
    -->
    ```kotlin
    suspend fun main() {
        val sessionId = "my-conversation"

        val toolRegistry = ToolRegistry {
            // 在此處註冊您的工具
        }

        simpleGoogleAIExecutor(System.getenv("GOOGLE_API_KEY")).use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = GoogleModels.Gemini2_5Pro,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20)
                }
            }

            while (true) {
                print("您: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("助理: $reply
")
            }
        }
    }
    ```

=== "Ollama"

    <!--- INCLUDE
    import ai.koog.agents.chatMemory.feature.ChatMemory
    import ai.koog.agents.chatMemory.feature.InMemoryChatHistoryProvider
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    -->
    ```kotlin
    suspend fun main() {
        val sessionId = "my-conversation"

        val toolRegistry = ToolRegistry {
            // 在此處註冊您的工具
        }

        simpleOllamaAIExecutor().use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = OllamaModels.Meta.LLAMA_3_2,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20)
                }
            }

            while (true) {
                print("您: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("助理: $reply
")
            }
        }
    }
    ```

## 運作原理

上述範例包含三個關鍵部分：

### 1. 安裝 ChatMemory

ChatMemory 被安裝為代理建置器（agent builder）區塊中的一個 [功能](../features-overview.md)：

```kotlin
AIAgent(
    promptExecutor = executor,
    llmModel = OpenAIModels.Chat.GPT5_2,
    systemPrompt = "You are a helpful assistant.",
    toolRegistry = toolRegistry,
) {
    install(ChatMemory) {
        windowSize(20) // 僅保留最後 20 則訊息
    }
}
```

`windowSize(20)` [前置處理器](../chat-memory.md#preprocessors) 確保對話內容語境保持在一定範圍內 —— 僅保留最後 20 則最近的訊息。若沒有此設定，隨著對話變長，提示詞的大小將會無限制地增長。

### 2. 使用一致的工作階段 ID

`agent.run()` 的第二個引數是工作階段 ID：

```kotlin
val reply = agent.run(input, sessionId)
```

ChatMemory 使用此 ID 來載入與儲存對話。具有相同工作階段 ID 的所有呼叫都會共享相同的歷程記錄。不同的工作階段 ID 則會產生完全隔離的對話。

### 3. 聊天迴圈

`while` 迴圈的每一次反覆運算：

1. 讀取使用者輸入
2. 呼叫 `agent.run(input, sessionId)` —— 在 LLM 看到提示詞之前，ChatMemory 會自動載入先前的歷程記錄
3. 列印回應
4. ChatMemory 自動儲存更新的歷程記錄（包括新的使用者訊息與助理回應）

## 工作階段範例

```
您: 我的名字是 Alice。
助理: 很高興見到您，Alice！今天有什麼我可以幫您的嗎？

您: 我最喜歡的顏色是什麼？是藍色。
助理: 明白了 —— 您最喜歡的顏色是藍色！

您: 我的名字是什麼？
助理: 您的名字是 Alice！
```

代理能正確回答「您的名字是 Alice！」，是因為 ChatMemory 在處理第三則訊息之前已載入先前的對話。

## 後續步驟

- 了解 [前置處理器](../chat-memory.md#preprocessors) 以篩選與轉換對話歷程記錄
- 實作 [自訂歷程記錄提供者](../chat-memory.md#custom-history-providers) 以進行持久化儲存
- 查看使用 Spring Boot 管理透過 HTTP 進行聊天工作階段的 [後端使用案例](../chat-memory.md#typical-use-case-backend-applications)
- 了解 [ChatMemory 與 Persistence 之間的差異](../chat-memory.md#chatmemory-vs-persistence)，以應對當機復原情境
- 探索 [Chat Memory](../chat-memory.md) 以獲取完整的功能參考