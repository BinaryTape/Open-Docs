# はじめに

このガイドでは、Koog のインストール方法と、最初の AI エージェントの作成方法を説明します。

## 前提条件

開始する前に、以下のものがあることを確認してください。

- Gradle または Maven を使用した動作可能な Kotlin/JVM プロジェクト。
- Java 17 以降がインストールされていること。
- ご希望の [LLM プロバイダー](llm-providers.md) の有効な API キー（ローカルで実行される Ollama の場合は不要）。

## Koog のインストール

Koog を使用するには、必要なすべての依存関係をビルド構成に含める必要があります。

!!! note
    `LATEST_VERSION` は、Maven Central で公開されている Koog の最新バージョンに置き換えてください。

=== "Gradle (Kotlin DSL)"

    1. `build.gradle.kts` ファイルに依存関係を追加します。
    
        ```kotlin
        dependencies {
            implementation("ai.koog:koog-agents:LATEST_VERSION")
        }
        ```
    2. リポジトリのリストに `mavenCentral()` が含まれていることを確認してください。
    
        ```kotlin
        repositories {
            mavenCentral()
        }
        ```

=== "Gradle (Groovy)"

    1. `build.gradle` ファイルに依存関係を追加します。
    
        ```groovy
        dependencies {
            implementation 'ai.koog:koog-agents:LATEST_VERSION'
        }
        ```
    2. リポジトリのリストに `mavenCentral()` が含まれていることを確認してください。
        ```groovy
        repositories {
            mavenCentral()
        }
        ```

=== "Maven"

    1. `pom.xml` ファイルに依存関係を追加します。
    
        ```xml
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-agents-jvm</artifactId>
            <version>LATEST_VERSION</version>
        </dependency>
        ```
    2. リポジトリのリストに `mavenCentral()` が含まれていることを確認してください。

        ```xml
         <repositories>
            <repository>
                <id>mavenCentral</id>
                <url>https://repo1.maven.org/maven2/</url>
            </repository>
        </repositories>
        ```

!!! note
    Koog を [Ktor サーバー](ktor-plugin.md)、[Spring アプリケーション](spring-boot.md)、または [MCP ツール](model-context-protocol.md) と統合する場合、
    追加の依存関係をビルド構成に含める必要があります。
    正確な依存関係については、Koog ドキュメントの関連ページを参照してください。

## API キーの設定

!!! tip
    API キーの保存には、環境変数または安全な構成管理システムを使用してください。
    API キーをソースコードに直接ハードコーディングすることは避けてください。

=== "OpenAI"

    [API キー](https://platform.openai.com/api-keys) を取得し、環境変数として割り当てます。
    
    === "Linux/macOS"

        ```bash
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENAI_API_KEY "your-api-key"
        ```
    
    変更を適用するためにターミナルを再起動してください。これで API キーを取得して、エージェントの作成に使用できます。

=== "Anthropic"

    [API キー](https://console.anthropic.com/settings/keys) を取得し、環境変数として割り当てます。

    === "Linux/macOS"

        ```bash
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx ANTHROPIC_API_KEY "your-api-key"
        ```
    
    変更を適用するためにターミナルを再起動してください。これで API キーを取得して、エージェントの作成に使用できます。

=== "Google"

    [API キー](https://aistudio.google.com/app/api-keys) を取得し、環境変数として割り当てます。

    === "Linux/macOS"

        ```bash
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx GOOGLE_API_KEY "your-api-key"
        ```

    変更を適用するためにターミナルを再起動してください。これで API キーを取得して、エージェントの作成に使用できます。

=== "DeepSeek"
    
    [API キー](https://platform.deepseek.com/api_keys) を取得し、環境変数として割り当てます。

    === "Linux/macOS"

        ```bash
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx DEEPSEEK_API_KEY "your-api-key"
        ```

    変更を適用するためにターミナルを再起動してください。これで API キーを取得して、エージェントの作成に使用できます。

=== "OpenRouter"

    [API キー](https://openrouter.ai/keys) を取得し、環境変数として割り当てます。

    === "Linux/macOS"

        ```bash
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENROUTER_API_KEY "your-api-key"
        ```

    変更を適用するためにターミナルを再起動してください。これで API キーを取得して、エージェントの作成に使用できます。

=== "Bedrock"

    有効な [AWS 認証情報](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_bedrock.html)（アクセスキーとシークレットキー）を取得し、環境変数として割り当てます。

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

    変更を適用するためにターミナルを再起動してください。これで API キーを取得して、エージェントの作成に使用できます。

=== "Ollama"

    Ollama をインストールし、API キーなしでローカルでモデルを実行します。

    詳細については、[Ollama ドキュメント](https://docs.ollama.com/quickstart) を参照してください。

## エージェントの作成と実行

=== "OpenAI"

    以下の例では、[`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) モデルを使用してシンプルな AI エージェントを作成し、実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // Get an API key from the OPENAI_API_KEY environment variable
        val apiKey = System.getenv("OPENAI_API_KEY")
            ?: error("The API key is not set.")
        
        // Create an agent
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )
    
        // Run the agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-01.kt -->

    この例は以下の出力を生成します。
    
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

    以下の例では、[`Claude Opus 4.1`](https://www.anthropic.com/news/claude-opus-4-1) モデルを使用してシンプルな AI エージェントを作成し、実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // Get an API key from the ANTHROPIC_API_KEY environment variable
        val apiKey = System.getenv("ANTHROPIC_API_KEY")
            ?: error("The API key is not set.")
        
        // Create an agent
        val agent = AIAgent(
            promptExecutor = simpleAnthropicExecutor(apiKey),
            llmModel = AnthropicModels.Opus_4_1
        )
    
        // Run the agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-02.kt -->

    この例は以下の出力を生成します。

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

    以下の例では、[`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) モデルを使用してシンプルな AI エージェントを作成し、実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // Get an API key from the GOOGLE_API_KEY environment variable
        val apiKey = System.getenv("GOOGLE_API_KEY")
            ?: error("The API key is not set.")
        
        // Create an agent
        val agent = AIAgent(
            promptExecutor = simpleGoogleAIExecutor(apiKey),
            llmModel = GoogleModels.Gemini2_5Pro
        )
    
        // Run the agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-03.kt -->

    この例は以下の出力を生成します。

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

    以下の例では、`deepseek-chat` モデルを使用してシンプルな AI エージェントを作成し、実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient
    import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // Get an API key from the DEEPSEEK_API_KEY environment variable
        val apiKey = System.getenv("DEEPSEEK_API_KEY")
            ?: error("The API key is not set.")
        
        // Create an LLM client
        val deepSeekClient = DeepSeekLLMClient(apiKey)
    
        // Create an agent
        val agent = AIAgent(
            // Create a prompt executor using the LLM client
            promptExecutor = SingleLLMPromptExecutor(deepSeekClient),
            // Provide a model
            llmModel = DeepSeekModels.DeepSeekChat
        )
    
        // Run the agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-04.kt -->

    この例は以下の出力を生成します。

    ```
    Hello! I'm here to assist you with a wide range of tasks, including answering questions, providing information, helping with problem-solving, offering creative ideas, and even just chatting. Whether you need help with research, writing, learning something new, or simply want to discuss a topic, feel free to ask—I’m happy to help! 😊
    ```

=== "OpenRouter"

    以下の例では、[`GPT-4o`](https://openrouter.ai/openai/gpt-4o) モデルを使用してシンプルな AI エージェントを作成し、実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor
    import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // Get an API key from the OPENROUTER_API_KEY environment variable
        val apiKey = System.getenv("OPENROUTER_API_KEY")
            ?: error("The API key is not set.")
        
        // Create an agent
        val agent = AIAgent(
            promptExecutor = simpleOpenRouterExecutor(apiKey),
            llmModel = OpenRouterModels.GPT4o
        )
    
        // Run the agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-05.kt -->

    この例は以下の出力を生成します。

    ```
    I can answer questions, help with writing, solve problems, organize tasks, and more—just let me know what you need!
    ```

=== "Bedrock"

    以下の例では、[`Claude Sonnet 4.5`](https://www.anthropic.com/news/claude-sonnet-4-5) モデルを使用してシンプルな AI エージェントを作成し、実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor
    import ai.koog.prompt.executor.clients.bedrock.BedrockModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // Get access keys from the AWS_BEDROCK_ACCESS_KEY and AWS_BEDROCK_SECRET_ACCESS_KEY environment variables
        val awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
            ?: error("The access key is not set.")
    
        val awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
            ?: error("The secret access key is not set.")
        
        // Create an agent
        val agent = AIAgent(
            promptExecutor = simpleBedrockExecutor(awsAccessKeyId, awsSecretAccessKey),
            llmModel = BedrockModels.AnthropicClaude4_5Sonnet
        )
    
        // Run the agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-06.kt -->

    この例は以下の出力を生成します。

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

    以下の例では、[`llama3.2`](https://ollama.com/library/llama3.2) モデルを使用してシンプルな AI エージェントを作成し、実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.llm.OllamaModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // Create an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2
        )

        // Run the agent
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-07.kt -->

    この例は以下の出力を生成します。

    ```
    I can assist with various tasks such as answering questions, providing information, and even helping with language-related tasks like proofreading or writing suggestions. What's on your mind today?
    ```

## 次のステップ

- Koog の [主要な機能](key-features.md) を調べる。
- 利用可能な [エージェントの種類](basic-agents.md) について詳しく学ぶ。