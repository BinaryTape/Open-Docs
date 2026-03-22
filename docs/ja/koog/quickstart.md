# クイックスタート

このガイドでは、プロジェクトで Koog の使用を開始する方法を説明します。

## 前提条件

--8<-- "quickstart-snippets.md:prerequisites"

## Koog のインストール

--8<-- "quickstart-snippets.md:dependencies"

??? tip "ナイトリービルド"

    develop ブランチからのナイトリービルドは、[JetBrains Grazie Maven](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public) リポジトリに公開されています。
    
    ナイトリービルドを使用するには、ビルド構成に以下のリポジトリを追加してください：
    `https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public`。
    
    次に、Koog の依存関係を目的のナイトリーバージョンに更新します。ナイトリーバージョンは以下のパターンに従います：
    `[次期メジャーバージョン]-develop-[日付]-[時刻]`。
    
    利用可能なナイトリービルドは[こちら](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public/ai/koog/koog-agents/)で確認できます。

## API キーの設定

Koog を使用するには、[サポートされている LLM プロバイダー](llm-providers.md)の API キー、またはローカルで実行されている LLM のいずれかが必要です。

!!! warning
    ソースコードに API キーをハードコードしないでください。
    API キーの保存には環境変数を使用してください。

=== "OpenAI"

    [OpenAI API キー](https://platform.openai.com/api-keys)を取得し、それを環境変数 `OPENAI_API_KEY` に割り当てます。
    
    === "Linux/macOS"

        ```shell
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx OPENAI_API_KEY "your-api-key"
        ```

=== "Anthropic"

    [Anthropic API キー](https://console.anthropic.com/settings/keys)を取得し、それを環境変数 `ANTHROPIC_API_KEY` に割り当てます。

    === "Linux/macOS"

        ```shell
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx ANTHROPIC_API_KEY "your-api-key"
        ```

=== "Google"

    [Gemini API キー](https://aistudio.google.com/app/api-keys)を取得し、それを環境変数 `GOOGLE_API_KEY` に割り当てます。

    === "Linux/macOS"

        ```shell
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx GOOGLE_API_KEY "your-api-key"
        ```  

=== "DeepSeek"

    [DeepSeek API キー](https://platform.deepseek.com/api_keys)を取得し、それを環境変数 `DEEPSEEK_API_KEY` に割り当てます。

    === "Linux/macOS"

        ```shell
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx DEEPSEEK_API_KEY "your-api-key"
        ``` 

=== "OpenRouter"

    [OpenRouter API キー](https://openrouter.ai/keys)を取得し、それを環境変数 `OPENROUTER_API_KEY` に割り当てます。

    === "Linux/macOS"

        ```shell
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx OPENROUTER_API_KEY "your-api-key"
        ```  

=== "Bedrock"

    [Amazon Bedrock API キーを生成](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)し、それを環境変数 `BEDROCK_API_KEY` に割り当てます。

    === "Linux/macOS"

        ```shell
        export BEDROCK_API_KEY=your-api-key
        ``` 

    === "Windows"

        ```cmd
        setx BEDROCK_API_KEY "your-api-key"
        ```  

=== "Mistral"

    [Mistral API キー](https://console.mistral.ai/api-keys)を取得し、それを環境変数 `MISTRAL_API_KEY` に割り当てます。

    === "Linux/macOS"

        ```shell
        export MISTRAL_API_KEY=your-api-key
        ``` 

    === "Windows"

        ```cmd
        setx MISTRAL_API_KEY "your-api-key"
        ``` 
        <!--- KNIT example-getting-started-01.txt -->

=== "Ollama"

    [Ollama のドキュメント](https://docs.ollama.com/quickstart)に従って、Ollama でローカル LLM を実行します。

## 初めての Koog エージェントの作成

=== "OpenAI"

    以下の例では、OpenAI API を介して [`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) モデルを使用し、シンプルな Koog エージェントを作成して実行します。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
        import ai.koog.prompt.executor.clients.openai.OpenAIModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 環境変数 OPENAI_API_KEY から OpenAI API キーを取得します
            val apiKey = System.getenv("OPENAI_API_KEY")
                ?: error("The API key is not set.")
            
            // エージェントを作成します
            val agent = AIAgent(
                promptExecutor = simpleOpenAIExecutor(apiKey),
                llmModel = OpenAIModels.Chat.GPT4o
            )
        
            // エージェントを実行します
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-01.kt -->

    === "Java"

        <!--- INCLUDE
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 環境変数 OPENAI_API_KEY から OpenAI API キーを取得します
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("The API key is not set.");
        }

        // エージェントを作成します
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleOpenAIExecutor(apiKey))
            .llmModel(OpenAIModels.Chat.GPT4o)
            .build();

        // エージェントを実行します
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-01.java -->

    この例では、以下のような出力が生成されます：
    
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
    <!--- KNIT example-getting-started-02.txt -->

=== "Anthropic"

    以下の例では、Anthropic API を介して [`Claude Opus 4.1`](https://www.anthropic.com/news/claude-opus-4-1) モデルを使用し、シンプルな Koog エージェントを作成して実行します。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
        import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 環境変数 ANTHROPIC_API_KEY から Anthropic API キーを取得します
            val apiKey = System.getenv("ANTHROPIC_API_KEY")
                ?: error("The API key is not set.")
            
            // エージェントを作成します
            val agent = AIAgent(
                promptExecutor = simpleAnthropicExecutor(apiKey),
                llmModel = AnthropicModels.Opus_4_1
            )
        
            // エージェントを実行します
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-02.kt -->

    === "Java"

        <!--- INCLUDE
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 環境変数 ANTHROPIC_API_KEY から Anthropic API キーを取得します
        String apiKey = System.getenv("ANTHROPIC_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("The API key is not set.");
        }

        // エージェントを作成します
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleAnthropicExecutor(apiKey))
            .llmModel(AnthropicModels.Opus_4_1)
            .build();

        // エージェントを実行します
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-02.java -->

    この例では、以下のような出力が生成されます：

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
    <!--- KNIT example-getting-started-03.txt -->

=== "Google"

    以下の例では、Gemini API を介して [`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) モデルを使用し、シンプルな Koog エージェントを作成して実行します。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
        import ai.koog.prompt.executor.clients.google.GoogleModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 環境変数 GOOGLE_API_KEY から Gemini API キーを取得します
            val apiKey = System.getenv("GOOGLE_API_KEY")
                ?: error("The API key is not set.")
            
            // エージェントを作成します
            val agent = AIAgent(
                promptExecutor = simpleGoogleAIExecutor(apiKey),
                llmModel = GoogleModels.Gemini2_5Pro
            )
        
            // エージェントを実行します
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-03.kt -->

    === "Java"

        <!--- INCLUDE
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 環境変数 GOOGLE_API_KEY から Gemini API キーを取得します
        String apiKey = System.getenv("GOOGLE_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("The API key is not set.");
        }

        // エージェントを作成します
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleGoogleAIExecutor(apiKey))
            .llmModel(GoogleModels.Gemini2_5Pro)
            .build();

        // エージェントを実行します
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-03.java -->

    この例では、以下のような出力が生成されます：

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
    <!--- KNIT example-getting-started-04.txt -->

=== "DeepSeek"

    以下の例では、DeepSeek API を介して `deepseek-chat` モデルを使用し、シンプルな Koog エージェントを作成して実行します。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
        import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 環境変数 DEEPSEEK_API_KEY から DeepSeek API キーを取得します
            val apiKey = System.getenv("DEEPSEEK_API_KEY")
                ?: error("The API key is not set.")
            
            // LLM クライアントを作成します
            val deepSeekClient = DeepSeekLLMClient(apiKey)
        
            // エージェントを作成します
            val agent = AIAgent(
                // LLM クライアントを使用してプロンプトエグゼキューターを作成します
                promptExecutor = MultiLLMPromptExecutor(deepSeekClient),
                // モデルを指定します
                llmModel = DeepSeekModels.DeepSeekChat
            )
        
            // エージェントを実行します
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-04.kt -->

    === "Java"

        <!--- INCLUDE
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 環境変数 DEEPSEEK_API_KEY から DeepSeek API キーを取得します
        String apiKey = System.getenv("DEEPSEEK_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("The API key is not set.");
        }

        // LLM クライアントを作成します
        DeepSeekLLMClient deepSeekClient = new DeepSeekLLMClient(apiKey);

        // エージェントを作成します
        AIAgent<String, String> agent = AIAgent.builder()
            // LLM クライアントを使用してプロンプトエグゼキューターを作成します
            .promptExecutor(new MultiLLMPromptExecutor(deepSeekClient))
            // モデルを指定します
            .llmModel(DeepSeekModels.DeepSeekChat)
            .build();

        // エージェントを実行します
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-04.java -->

    この例では、以下のような出力が生成されます：

    ```
    Hello! I'm here to assist you with a wide range of tasks, including answering questions, providing information, helping with problem-solving, offering creative ideas, and even just chatting. Whether you need help with research, writing, learning something new, or simply want to discuss a topic, feel free to ask—I’m happy to help! 😊
    ```
    <!--- KNIT example-getting-started-05.txt -->

=== "OpenRouter"

    以下の例では、OpenRouter API を介して [`GPT-4o`](https://openrouter.ai/openai/gpt-4o) モデルを使用し、シンプルな Koog エージェントを作成して実行します。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor
        import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 環境変数 OPENROUTER_API_KEY から OpenRouter API キーを取得します
            val apiKey = System.getenv("OPENROUTER_API_KEY")
                ?: error("The API key is not set.")
            
            // エージェントを作成します
            val agent = AIAgent(
                promptExecutor = simpleOpenRouterExecutor(apiKey),
                llmModel = OpenRouterModels.GPT4o
            )
        
            // エージェントを実行します
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-05.kt -->

    === "Java"

        <!--- INCLUDE
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 環境変数 OPENROUTER_API_KEY から OpenRouter API キーを取得します
        String apiKey = System.getenv("OPENROUTER_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("The API key is not set.");
        }

        // エージェントを作成します
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleOpenRouterExecutor(apiKey))
            .llmModel(OpenRouterModels.GPT4o)
            .build();

        // エージェントを実行します
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-05.java -->

    この例では、以下のような出力が生成されます：

    ```
    I can answer questions, help with writing, solve problems, organize tasks, and more—just let me know what you need!
    ```
    <!--- KNIT example-getting-started-06.txt -->

=== "Bedrock"

    以下の例では、Bedrock API を介して [`Claude Sonnet 4.5`](https://www.anthropic.com/news/claude-sonnet-4-5) モデルを使用し、シンプルな Koog エージェントを作成して実行します。
    
    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleBedrockExecutorWithBearerToken
        import ai.koog.prompt.executor.clients.bedrock.BedrockModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 環境変数 BEDROCK_API_KEY から Bedrock API キーを取得します
            val apiKey = System.getenv("BEDROCK_API_KEY")
                ?: error("The API key is not set.")
            
            // エージェントを作成します
            val agent = AIAgent(
                promptExecutor = simpleBedrockExecutorWithBearerToken(apiKey),
                llmModel = BedrockModels.AnthropicClaude4_5Sonnet
            )
        
            // エージェントを実行します
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-06.kt -->

    === "Java"

        <!--- INCLUDE
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 環境変数 BEDROCK_API_KEY から Bedrock API キーを取得します
        String apiKey = System.getenv("BEDROCK_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("The API key is not set.");
        }

        // エージェントを作成します
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleBedrockExecutorWithBearerToken(apiKey, new BedrockClientSettings()))
            .llmModel(BedrockModels.INSTANCE.getAnthropicClaude4_5Sonnet())
            .build();

        // エージェントを実行します
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-06.java -->

    この例では、以下のような出力が生成されます：

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
    <!--- KNIT example-getting-started-07.txt -->

=== "Mistral"

    以下の例では、Mistral AI API を介して [`Mistral Medium 3.1`](https://docs.mistral.ai/models/mistral-medium-3-1-25-08) モデルを使用し、シンプルな Koog エージェントを作成して実行します。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleMistralAIExecutor
        import ai.koog.prompt.executor.clients.mistralai.MistralAIModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 環境変数 MISTRAL_API_KEY から Mistral AI API キーを取得します
            val apiKey = System.getenv("MISTRAL_API_KEY")
                ?: error("The API key is not set.")
            
            // エージェントを作成します
            val agent = AIAgent(
                promptExecutor = simpleMistralAIExecutor(apiKey),
                llmModel = MistralAIModels.Chat.MistralMedium31
            )
        
            // エージェントを実行します
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-07.kt -->
    
    === "Java"

        <!--- INCLUDE
        /**
        -->
        <!--- SUFFIX
        **/
        -->   
        ```java
        // 環境変数 MISTRAL_API_KEY から Mistral AI API キーを取得します
        String apiKey = System.getenv("MISTRAL_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("The API key is not set.");
        }

        // エージェントを作成します
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleMistralAIExecutor(apiKey))
            .llmModel(MistralAIModels.Chat.MistralMedium31)
            .build();

        // エージェントを実行します
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-07.java -->

    この例では、以下のような出力が生成されます：

    ```
    I can assist you with a wide range of topics and tasks. Here are some examples:

    1. **Answering questions**: I can provide information on various subjects, including history, science, technology, literature, and more.
    2. **Providing definitions**: If you're unsure about the meaning of a word or phrase, I can help define it for you.
    3. **Generating text**: Whether it's writing an email, creating content for social media, or composing a story, I can help with text generation.
    4. **Translation**: I can translate text from one language to another.
    5. **Conversation**: We can have a chat about any topic that interests you, and I'll respond accordingly.
    6. **Language practice**: If you're learning a new language, I can help with pronunciation, grammar, and vocabulary practice.
    7. **Brainstorming**: If you're stuck on a problem or need ideas for a project, I can help brainstorm solutions.
    8. **Summarization**: If you have a long piece of text and want a summary, I can condense it for you.
    
    What's on your mind? Is there something specific you'd like help with?
    ```
    <!--- KNIT example-getting-started-08.txt -->

=== "Ollama"

    以下の例では、Ollama を介してローカルで実行されている [`llama3.2`](https://ollama.com/library/llama3.2) モデルを使用し、シンプルな Koog エージェントを作成して実行します。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
        import ai.koog.prompt.executor.ollama.client.OllamaModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // エージェントを作成します
            val agent = AIAgent(
                promptExecutor = simpleOllamaAIExecutor(),
                llmModel = OllamaModels.Meta.LLAMA_3_2
            )

            // エージェントを実行します
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-08.kt -->

    === "Java"

        <!--- INCLUDE
        /**
        -->
        <!--- SUFFIX
        **/
        -->  
        ```java
        // エージェントを作成します
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleOllamaAIExecutor("http://localhost:11434"))
            .llmModel(OllamaModels.Meta.LLAMA_3_2)
            .build();

        // エージェントを実行します
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-08.java -->

    この例では、以下のような出力が生成されます：

    ```
    I can assist with various tasks such as answering questions, providing information, and even helping with language-related tasks like proofreading or writing suggestions. What's on your mind today?
    ```
    <!--- KNIT example-getting-started-09.txt -->

## 次のステップ

- [エージェントの種類](agents/index.md)について詳しく学ぶ