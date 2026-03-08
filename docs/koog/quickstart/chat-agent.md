# 构建带记忆功能的聊天智能体

本指南将向您展示如何使用 [ChatMemory](../chat-memory.md) 功能创建一个能在多次交互中记住之前消息的对话式聊天智能体。

## 先决条件

--8<-- "quickstart-snippets.md:prerequisites"

## 安装 Koog 与 Memory 功能

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

## 设置 API 密钥

--8<-- "quickstart-snippets.md:api-key"

## 您将构建的内容

一个命令行聊天智能体，它能够：

- 在循环中接受用户输入
- 将每条消息发送给 LLM
- 在跨 `agent.run()` 调用时记住完整的对话历史记录
- 使用滑动窗口限制上下文大小

如果没有 ChatMemory，每次调用 `agent.run()` 都会启动一个全新的对话 —— 智能体不知道之前说过什么。ChatMemory 通过在每次运行前自动加载之前的消息，并在运行后存储更新的历史记录来解决这个问题。

## 创建聊天智能体

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
            // 在此处注册您的工具
        }

        simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")).use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = OpenAIModels.Chat.GPT5_2,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20) // 仅保留最后 20 条消息
                }
            }

            while (true) {
                print("You: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("Assistant: $reply
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
            // 在此处注册您的工具
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
                print("You: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("Assistant: $reply
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
            // 在此处注册您的工具
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
                print("You: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("Assistant: $reply
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
            // 在此处注册您的工具
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
                print("You: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("Assistant: $reply
")
            }
        }
    }
    ```

## 工作原理

上述示例包含三个关键部分：

### 1. 安装 ChatMemory

ChatMemory 作为 [功能](../features-overview.md) 安装在智能体构建器块内：

```kotlin
AIAgent(
    promptExecutor = executor,
    llmModel = OpenAIModels.Chat.GPT5_2,
    systemPrompt = "You are a helpful assistant.",
    toolRegistry = toolRegistry,
) {
    install(ChatMemory) {
        windowSize(20) // 仅保留最后 20 条消息
    }
}
```

`windowSize(20)` [预处理程序](../chat-memory.md#preprocessors) 确保对话上下文保持在界限内 —— 仅保留最近的 20 条消息。如果不这样做，随着对话变长，提示词的大小会无限制增长。

### 2. 使用一致的会话 ID

`agent.run()` 的第二个参数是会话 ID：

```kotlin
val reply = agent.run(input, sessionId)
```

ChatMemory 使用此 ID 来加载和存储对话。所有具有相同会话 ID 的调用都共享相同的历史记录。不同的会话 ID 会产生完全隔离的对话。

### 3. 聊天循环

每次 `while` 循环迭代：

1. 读取用户输入
2. 调用 `agent.run(input, sessionId)` —— ChatMemory 在 LLM 看到提示词之前自动加载之前的历史记录
3. 打印响应
4. ChatMemory 自动存储更新后的历史记录（包括新的用户消息和助手响应）

## 示例会话

```
You: My name is Alice.
Assistant: Nice to meet you, Alice! How can I help you today?

You: What's my favorite color? It's blue.
Assistant: Got it — your favorite color is blue!

You: What's my name?
Assistant: Your name is Alice!
```

智能体正确回答了 “Your name is Alice!”，因为 ChatMemory 在处理第三条消息之前加载了早期的对话内容。

## 后续步骤

- 了解 [预处理程序](../chat-memory.md#preprocessors) 以过滤和转换对话历史记录
- 实现 [自定义历史记录提供程序](../chat-memory.md#custom-history-providers) 以进行持久化存储
- 查看配合 Spring Boot 管理通过 HTTP 进行聊天会话的 [后端用例](../chat-memory.md#typical-use-case-backend-applications)
- 了解崩溃恢复场景下 [ChatMemory 与持久化的区别](../chat-memory.md#chatmemory-vs-persistence)
- 探索 [Chat Memory](../chat-memory.md) 以获取完整的功能参考