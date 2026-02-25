# 快速入门

本指南将帮助您安装 Koog 并创建您的第一个 AI agent。

## 前提条件

在开始之前，请确保您具备以下条件：

- 一个可以正常运行的、使用 Gradle 或 Maven 的 Kotlin/JVM 项目。
- 已安装 Java 17+。
- 您首选的 [LLM 提供商](llm-providers.md) 的有效 API 密钥（本地运行的 Ollama 不需要）。

## 安装 Koog

要使用 Koog，您需要在构建配置中包含所有必要的依赖项。

!!! note
    请将 `LATEST_VERSION` 替换为在 Maven Central 上发布的 Koog 最新版本。

=== "Gradle (Kotlin DSL)"

    1. 将依赖项添加到 `build.gradle.kts` 文件中。
    
        ```kotlin
        dependencies {
            implementation("ai.koog:koog-agents:LATEST_VERSION")
        }
        ```
    2. 确保您的仓库列表中包含 `mavenCentral()`。
    
        ```kotlin
        repositories {
            mavenCentral()
        }
        ```

=== "Gradle (Groovy)"

    1. 将依赖项添加到 `build.gradle` 文件中。
    
        ```groovy
        dependencies {
            implementation 'ai.koog:koog-agents:LATEST_VERSION'
        }
        ```
    2. 确保您的仓库列表中包含 `mavenCentral()`。
        ```groovy
        repositories {
            mavenCentral()
        }
        ```

=== "Maven"

    1. 将依赖项添加到 `pom.xml` 文件中。
    
        ```xml
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-agents</artifactId>
            <version>LATEST_VERSION</version>
        </dependency>
        ```
    2. 确保您的仓库列表中包含 `mavenCentral()`。

        ```xml
         <repositories>
            <repository>
                <id>mavenCentral</id>
                <url>https://repo1.maven.org/maven2/</url>
            </repository>
        </repositories>
        ```

!!! note
    当将 Koog 与 [Ktor 服务器](ktor-plugin.md)、[Spring 应用程序](spring-boot.md)或 [MCP 工具](model-context-protocol.md)集成时，您需要在构建配置中包含额外的依赖项。有关确切的依赖项，请参阅 Koog 文档中的相关页面。

??? tip "每夜构建版本 (Nightly builds)"

    来自 develop 分支的每夜构建版本已发布到 [JetBrains Grazie Maven](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public) 仓库。
    
    要使用每夜构建版本，请将以下仓库添加到您的构建配置中：
    `https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public`。
    
    然后将您的 Koog 依赖项更新为所需的每夜构建版本。每夜构建版本遵循 `[next-major-version]-develop-[date]-[time]` 模式。
    
    您可以在[此处](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public/ai/koog/koog-agents/)浏览可用的每夜构建版本。

## 设置 API 密钥

!!! tip
    使用环境变量或安全配置管理系统来存储您的 API 密钥。避免将 API 密钥直接硬编码在源代码中。

=== "OpenAI"

    获取您的 [API 密钥](https://platform.openai.com/api-keys)并将其分配为环境变量。
    
    === "Linux/macOS"

        ```bash
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENAI_API_KEY "your-api-key"
        ```
    
    重启终端以应用更改。您现在可以获取并使用 API 密钥来创建 agent。   

=== "Anthropic"

    获取您的 [API 密钥](https://console.anthropic.com/settings/keys)并将其分配为环境变量。

    === "Linux/macOS"

        ```bash
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx ANTHROPIC_API_KEY "your-api-key"
        ```
    
    重启终端以应用更改。您现在可以获取并使用 API 密钥来创建 agent。

=== "Google"

    获取您的 [API 密钥](https://aistudio.google.com/app/api-keys)并将其分配为环境变量。

    === "Linux/macOS"

        ```bash
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx GOOGLE_API_KEY "your-api-key"
        ```

    重启终端以应用更改。您现在可以获取并使用 API 密钥来创建 agent。   

=== "DeepSeek"
    
    获取您的 [API 密钥](https://platform.deepseek.com/api_keys)并将其分配为环境变量。

    === "Linux/macOS"

        ```bash
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx DEEPSEEK_API_KEY "your-api-key"
        ```

    重启终端以应用更改。您现在可以获取并使用 API 密钥来创建 agent。   

=== "OpenRouter"

    获取您的 [API 密钥](https://openrouter.ai/keys)并将其分配为环境变量。

    === "Linux/macOS"

        ```bash
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENROUTER_API_KEY "your-api-key"
        ```

    重启终端以应用更改。您现在可以获取并使用 API 密钥来创建 agent。   

=== "Bedrock"

    获取有效的 [AWS 凭据](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_bedrock.html)（访问密钥和私有密钥）并将其分配为环境变量。

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

    重启终端以应用更改。您现在可以获取并使用 API 密钥来创建 agent。   

=== "Ollama"

    安装 Ollama 并直接在本地运行模型，无需 API 密钥。

    更多信息请参阅 [Ollama 文档](https://docs.ollama.com/quickstart)。

## 创建并运行 agent

=== "OpenAI"

    下面的示例使用 [`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) 模型创建并运行一个简单的 AI agent。

    <!--- CLEAR -->
    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 从 OPENAI_API_KEY 环境变量获取 API 密钥
        val apiKey = System.getenv("OPENAI_API_KEY")
            ?: error("API 密钥未设置。")
        
        // 创建 agent
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )
    
        // 运行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-01.kt -->

    该示例可以产生以下输出：
    
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

    下面的示例使用 [`Claude Opus 4.1`](https://www.anthropic.com/news/claude-opus-4-1) 模型创建并运行一个简单的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 从 ANTHROPIC_API_KEY 环境变量获取 API 密钥
        val apiKey = System.getenv("ANTHROPIC_API_KEY")
            ?: error("API 密钥未设置。")
        
        // 创建 agent
        val agent = AIAgent(
            promptExecutor = simpleAnthropicExecutor(apiKey),
            llmModel = AnthropicModels.Opus_4_1
        )
    
        // 运行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-02.kt -->

    该示例可以产生以下输出：

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

    下面的示例使用 [`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) 模型创建并运行一个简单的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 从 GOOGLE_API_KEY 环境变量获取 API 密钥
        val apiKey = System.getenv("GOOGLE_API_KEY")
            ?: error("API 密钥未设置。")
        
        // 创建 agent
        val agent = AIAgent(
            promptExecutor = simpleGoogleAIExecutor(apiKey),
            llmModel = GoogleModels.Gemini2_5Pro
        )
    
        // 运行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-03.kt -->

    该示例可以产生以下输出：

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

    下面的示例使用 `deepseek-chat` 模型创建并运行一个简单的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient
    import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 从 DEEPSEEK_API_KEY 环境变量获取 API 密钥
        val apiKey = System.getenv("DEEPSEEK_API_KEY")
            ?: error("API 密钥未设置。")
        
        // 创建 LLM 客户端
        val deepSeekClient = DeepSeekLLMClient(apiKey)
    
        // 创建 agent
        val agent = AIAgent(
            // 使用 LLM 客户端创建 prompt 执行器
            promptExecutor = MultiLLMPromptExecutor(deepSeekClient),
            // 提供模型
            llmModel = DeepSeekModels.DeepSeekChat
        )
    
        // 运行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-04.kt -->

    该示例可以产生以下输出：

    ```
    Hello! I'm here to assist you with a wide range of tasks, including answering questions, providing information, helping with problem-solving, offering creative ideas, and even just chatting. Whether you need help with research, writing, learning something new, or simply want to discuss a topic, feel free to ask—I’m happy to help! 😊
    ```

=== "OpenRouter"

    下面的示例使用 [`GPT-4o`](https://openrouter.ai/openai/gpt-4o) 模型创建并运行一个简单的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor
    import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 从 OPENROUTER_API_KEY 环境变量获取 API 密钥
        val apiKey = System.getenv("OPENROUTER_API_KEY")
            ?: error("API 密钥未设置。")
        
        // 创建 agent
        val agent = AIAgent(
            promptExecutor = simpleOpenRouterExecutor(apiKey),
            llmModel = OpenRouterModels.GPT4o
        )
    
        // 运行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-05.kt -->

    该示例可以产生以下输出：

    ```
    I can answer questions, help with writing, solve problems, organize tasks, and more—just let me know what you need!
    ```

=== "Bedrock"

    下面的示例使用 [`Claude Sonnet 4.5`](https://www.anthropic.com/news/claude-sonnet-4-5) 模型创建并运行一个简单的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor
    import ai.koog.prompt.executor.clients.bedrock.BedrockModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 从 AWS_BEDROCK_ACCESS_KEY 和 AWS_BEDROCK_SECRET_ACCESS_KEY 环境变量获取访问密钥
        val awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
            ?: error("访问密钥未设置。")
    
        val awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
            ?: error("私有访问密钥未设置。")
        
        // 创建 agent
        val agent = AIAgent(
            promptExecutor = simpleBedrockExecutor(awsAccessKeyId, awsSecretAccessKey),
            llmModel = BedrockModels.AnthropicClaude4_5Sonnet
        )
    
        // 运行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-06.kt -->

    该示例可以产生以下输出：

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

    下面的示例使用 [`llama3.2`](https://ollama.com/library/llama3.2) 模型创建并运行一个简单的 AI agent。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 创建 agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2
        )

        // 运行 agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-07.kt -->

    该示例可以产生以下输出：

    ```
    I can assist with various tasks such as answering questions, providing information, and even helping with language-related tasks like proofreading or writing suggestions. What's on your mind today?
    ```

## 后续步骤

- 探索 Koog 的[关键功能](key-features.md)。
- 详细了解可用的 [agent 类型](basic-agents.md)。