# 快速入門

本指南將協助您安裝 Koog 並建立您的第一個 AI agent。

## 先決條件

在開始之前，請確保您具備以下條件：

- 一個可運行的 Kotlin/JVM 專案，並使用 Gradle 或 Maven。
- 已安裝 Java 17+。
- 您偏好的 [LLM 提供者](llm-providers.md) 的有效 API 金鑰（在本地運行的 Ollama 不需要）。

## 安裝 Koog

要使用 Koog，您需要在您的組建組態中包含所有必要的相依性。

!!! note
    請將 `LATEST_VERSION` 替換為發佈在 Maven Central 上的最新 Koog 版本。

=== "Gradle (Kotlin DSL)"

    1. 將相依性新增至 `build.gradle.kts` 檔案。
    
        ```kotlin
        dependencies {
            implementation("ai.koog:koog-agents:LATEST_VERSION")
        }
        ```
    2. 確保您的存儲庫清單中包含 `mavenCentral()`。
    
        ```kotlin
        repositories {
            mavenCentral()
        }
        ```

=== "Gradle (Groovy)"

    1. 將相依性新增至 `build.gradle` 檔案。
    
        ```groovy
        dependencies {
            implementation 'ai.koog:koog-agents:LATEST_VERSION'
        }
        ```
    2. 確保您的存儲庫清單中包含 `mavenCentral()`。
        ```groovy
        repositories {
            mavenCentral()
        }
        ```

=== "Maven"

    1. 將相依性新增至 `pom.xml` 檔案。
    
        ```xml
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-agents</artifactId>
            <version>LATEST_VERSION</version>
        </dependency>
        ```
    2. 確保您的存儲庫清單中包含 `mavenCentral()`。

        ```xml
         <repositories>
            <repository>
                <id>mavenCentral</id>
                <url>https://repo1.maven.org/maven2/</url>
            </repository>
        </repositories>
        ```

!!! note
    當將 Koog 與 [Ktor 伺服器](ktor-plugin.md)、[Spring 應用程式](spring-boot.md) 或 [MCP 工具](model-context-protocol.md) 整合時，
    您需要在組建組態中包含額外的相依性。
    有關確切的相依性，請參閱 Koog 文件中的相關頁面。

??? tip "每夜組建 (Nightly builds)"

    來自 develop 分支的每夜組建已發佈到 [JetBrains Grazie Maven](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public) 存儲庫。
    
    要使用每夜組建，請將以下存儲庫新增到您的組建組態：
    `https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public`。
    
    然後將您的 Koog 相依性更新為所需的每夜版本。每夜版本遵循以下模式：
    `[next-major-version]-develop-[date]-[time]`。
    
    您可以在[此處](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public/ai/koog/koog-agents/)瀏覽可用的每夜組建。

## 設定 API 金鑰

!!! tip
    請使用環境變數或安全的配置管理系統來儲存您的 API 金鑰。
    避免直接在原始碼中寫死 API 金鑰。

=== "OpenAI"

    獲取您的 [API 金鑰](https://platform.openai.com/api-keys) 並將其指派為環境變數。
    
    === "Linux/macOS"

        ```bash
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENAI_API_KEY "your-api-key"
        ```
    
    重啟您的終端以套用變更。您現在可以檢索並使用該 API 金鑰來建立 agent。   

=== "Anthropic"

    獲取您的 [API 金鑰](https://console.anthropic.com/settings/keys) 並將其指派為環境變數。

    === "Linux/macOS"

        ```bash
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx ANTHROPIC_API_KEY "your-api-key"
        ```
    
    重啟您的終端以套用變更。您現在可以檢索並使用該 API 金鑰來建立 agent。

=== "Google"

    獲取您的 [API 金鑰](https://aistudio.google.com/app/api-keys) 並將其指派為環境變數。

    === "Linux/macOS"

        ```bash
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx GOOGLE_API_KEY "your-api-key"
        ```

    重啟您的終端以套用變更。您現在可以檢索並使用該 API 金鑰來建立 agent。   

=== "DeepSeek"
    
    獲取您的 [API 金鑰](https://platform.deepseek.com/api_keys) 並將其指派為環境變數。

    === "Linux/macOS"

        ```bash
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx DEEPSEEK_API_KEY "your-api-key"
        ```

    重啟您的終端以套用變更。您現在可以檢索並使用該 API 金鑰來建立 agent。   

=== "OpenRouter"

    獲取您的 [API 金鑰](https://openrouter.ai/keys) 並將其指派為環境變數。

    === "Linux/macOS"

        ```bash
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENROUTER_API_KEY "your-api-key"
        ```

    重啟您的終端以套用變更。您現在可以檢索並使用該 API 金鑰來建立 agent。   

=== "Bedrock"

    獲取有效的 [AWS 憑據](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_bedrock.html)（存取金鑰與私密存取金鑰）並將其指派為環境變數。

    === "Linux/macOS"

        ```bash
        export AWS_BEDROCK_ACCESS_KEY=your-access-key
        export AWS_BEDROCK_SECRET_ACCESS_KEY=your-secret-access-key
        ``` 

    === "Windows"

        ```shell
        setx AWS_BEDROCK_ACCESS_KEY "your-access-key"
        setx AWS_BEDROCK_SECRET_ACCESS_KEY "your-secret-access-key"
        ```

    重啟您的終端以套用變更。您現在可以檢索並使用該 API 金鑰來建立 agent。   

=== "Ollama"

    安裝 Ollama 並在本地執行模型，無需 API 金鑰。

    如需更多資訊，請參閱 [Ollama 文件](https://docs.ollama.com/quickstart)。

## 建立並執行 agent

=== "OpenAI"

    下方的範例使用 [`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) 模型建立並執行一個簡單的 AI agent。

    <!--- CLEAR -->
    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 從 OPENAI_API_KEY 環境變數獲取 API 金鑰
        val apiKey = System.getenv("OPENAI_API_KEY")
            ?: error("The API key is not set.")
        
        // 建立一個 agent
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )
    
        // 執行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-01.kt -->

    該範例可能會產生以下輸出：
    
    ```
    Hello! I'm here to help you with whatever you need. Here are just a few things I can do:

    - Answer questions.
    - Explain concepts or topics you're curious about.
    - Provide step-by-step instructions for tasks.
    - Offer advice, notes, or ideas.
    - Help with research or summarize complex material.
    - Write or edit text, emails, or other documents.
    - Brainstorm creative projects or solutions.
    - Solve problems or calculations.

    Let me know what you need help with—I’m here for you!
    ```

=== "Anthropic"

    下方的範例使用 [`Claude Opus 4.1`](https://www.anthropic.com/news/claude-opus-4-1) 模型建立並執行一個簡單的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 從 ANTHROPIC_API_KEY 環境變數獲取 API 金鑰
        val apiKey = System.getenv("ANTHROPIC_API_KEY")
            ?: error("The API key is not set.")
        
        // 建立一個 agent
        val agent = AIAgent(
            promptExecutor = simpleAnthropicExecutor(apiKey),
            llmModel = AnthropicModels.Opus_4_1
        )
    
        // 執行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-02.kt -->

    該範例可能會產生以下輸出：

    ```
    Hello! I can help you with:

    - **Answering questions** and explaining topics
    - **Writing** - drafting, editing, proofreading
    - **Learning** - homework, math, study help
    - **Problem-solving** and brainstorming
    - **Research** and information finding
    - **General tasks** - instructions, planning, recommendations
    
    What do you need help with today?
    ```

=== "Google"

    下方的範例使用 [`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) 模型建立並執行一個簡單的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 從 GOOGLE_API_KEY 環境變數獲取 API 金鑰
        val apiKey = System.getenv("GOOGLE_API_KEY")
            ?: error("The API key is not set.")
        
        // 建立一個 agent
        val agent = AIAgent(
            promptExecutor = simpleGoogleAIExecutor(apiKey),
            llmModel = GoogleModels.Gemini2_5Pro
        )
    
        // 執行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-03.kt -->

    該範例可能會產生以下輸出：

    ```
    I'm an AI that can help you with tasks involving language and information. You can ask me to:

    *   **Answer questions**
    *   **Write or edit text** (emails, stories, code, etc.)
    *   **Brainstorm ideas**
    *   **Summarize long documents**
    *   **Plan things** (like trips or projects)
    *   **Be a creative partner**

    Just tell me what you need
    ```

=== "DeepSeek"

    下方的範例使用 `deepseek-chat` 模型建立並執行一個簡單的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient
    import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 從 DEEPSEEK_API_KEY 環境變數獲取 API 金鑰
        val apiKey = System.getenv("DEEPSEEK_API_KEY")
            ?: error("The API key is not set.")
        
        // 建立一個 LLM 用戶端
        val deepSeekClient = DeepSeekLLMClient(apiKey)
    
        // 建立一個 agent
        val agent = AIAgent(
            // 使用 LLM 用戶端建立一個 prompt 執行器
            promptExecutor = MultiLLMPromptExecutor(deepSeekClient),
            // 提供一個模型
            llmModel = DeepSeekModels.DeepSeekChat
        )
    
        // 執行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-04.kt -->

    該範例可能會產生以下輸出：

    ```
    Hello! I'm here to assist you with a wide range of tasks, including answering questions, providing information, helping with problem-solving, offering creative ideas, and even just chatting. Whether you need help with research, writing, learning something new, or simply want to discuss a topic, feel free to ask—I’m happy to help! 😊
    ```

=== "OpenRouter"

    下方的範例使用 [`GPT-4o`](https://openrouter.ai/openai/gpt-4o) 模型建立並執行一個簡單的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor
    import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 從 OPENROUTER_API_KEY 環境變數獲取 API 金鑰
        val apiKey = System.getenv("OPENROUTER_API_KEY")
            ?: error("The API key is not set.")
        
        // 建立一個 agent
        val agent = AIAgent(
            promptExecutor = simpleOpenRouterExecutor(apiKey),
            llmModel = OpenRouterModels.GPT4o
        )
    
        // 執行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-05.kt -->

    該範例可能會產生以下輸出：

    ```
    I can answer questions, help with writing, solve problems, organize tasks, and more—just let me know what you need!
    ```

=== "Bedrock"

    下方的範例使用 [`Claude Sonnet 4.5`](https://www.anthropic.com/news/claude-sonnet-4-5) 模型建立並執行一個簡單的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor
    import ai.koog.prompt.executor.clients.bedrock.BedrockModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 從 AWS_BEDROCK_ACCESS_KEY 與 AWS_BEDROCK_SECRET_ACCESS_KEY 環境變數獲取存取金鑰
        val awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
            ?: error("The access key is not set.")
    
        val awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
            ?: error("The secret access key is not set.")
        
        // 建立一個 agent
        val agent = AIAgent(
            promptExecutor = simpleBedrockExecutor(awsAccessKeyId, awsSecretAccessKey),
            llmModel = BedrockModels.AnthropicClaude4_5Sonnet
        )
    
        // 執行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-06.kt -->

    該範例可能會產生以下輸出：

    ```
    Hello! I'm a helpful assistant and I can assist you in many ways, including:

    - **Answering questions** on a wide range of topics (science, history, technology, etc.)
    - **Writing help** - drafting emails, essays, creative content, or editing text
    - **Problem-solving** - working through math problems, logic puzzles, or troubleshooting issues
    - **Learning support** - explaining concepts, providing study notes, or tutoring
    - **Planning & organizing** - helping with projects, schedules, or breaking down tasks
    - **Coding assistance** - explaining programming concepts or helping debug code
    - **Creative brainstorming** - generating ideas for projects, stories, or solutions
    - **General conversation** - discussing topics or just chatting
    
     What would you like help with today?
    ```

=== "Ollama"

    下方的範例使用 [`llama3.2`](https://ollama.com/library/llama3.2) 模型建立並執行一個簡單的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 建立一個 agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2
        )

        // 執行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-07.kt -->

    該範例可能會產生以下輸出：

    ```
    I can assist with various tasks such as answering questions, providing information, and even helping with language-related tasks like proofreading or writing suggestions. What's on your mind today?
    ```

## 下一步

- 探索 Koog 的[主要特性](key-features.md)。
- 進一步了解可用的 [agent 類型](basic-agents.md)。