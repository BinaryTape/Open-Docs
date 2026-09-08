# 快速入门

本指南将帮助您在项目中快速上手 Koog。

## 前提条件 {id="prerequisites"}

--8<-- "quickstart-snippets.md:prerequisites"

## 安装 Koog {id="install-koog"}

--8<-- "quickstart-snippets.md:dependencies"

??? tip "模块版本控制"

    Koog 遵循语义化版本控制 (`X.Y.Z`)。稳定模块（例如 `1.0.0`）提供 API 稳定性保证；Beta 模块（例如 `1.0.0-beta`）则属于实验性模块，其 API 可能在不同版本间发生变化。

    有关详细信息，请参阅[模块版本控制](module-versioning.md)。

??? tip "Nightly 构建"

    develop 分支的 Nightly 构建会发布到 [JetBrains Grazie Maven](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public) 仓库。
    
    要使用 Nightly 构建，请将以下仓库添加到您的构建配置中：
    `https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public`。
    
    然后将 Koog 依赖项更新为所需的 Nightly 版本。Nightly 版本采用以下格式：
    `[next-major-version]-develop-[date]-[time]`。
    
    您可以[在此处](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public/ai/koog/koog-agents/)浏览可用的 Nightly 构建。

## 设置 API 密钥 {id="set-up-an-api-key"}

要使用 Koog，您需要受支持的 [LLM 提供商](llm-providers.md)所提供的 API 密钥，或者一个在本地运行的 LLM。

!!! warning
    请勿在源代码中硬编码 API 密钥。请使用环境变量存储 API 密钥。

=== "OpenAI"

    获取您的 [OpenAI API 密钥](https://platform.openai.com/api-keys)，并将其设置为 `OPENAI_API_KEY` 环境变量的值。
    
    === "Linux/macOS"

        ```shell
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx OPENAI_API_KEY "your-api-key"
        ```

=== "Anthropic"

    获取您的 [Anthropic API 密钥](https://console.anthropic.com/settings/keys)，并将其设置为 `ANTHROPIC_API_KEY` 环境变量的值。

    === "Linux/macOS"

        ```shell
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx ANTHROPIC_API_KEY "your-api-key"
        ```

=== "Google β"

    获取您的 [Gemini API 密钥](https://aistudio.google.com/app/api-keys)，并将其设置为 `GOOGLE_API_KEY` 环境变量的值。

    === "Linux/macOS"

        ```shell
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx GOOGLE_API_KEY "your-api-key"
        ```  

=== "DeepSeek β"

    获取您的 [DeepSeek API 密钥](https://platform.deepseek.com/api_keys)，并将其设置为 `DEEPSEEK_API_KEY` 环境变量的值。

    === "Linux/macOS"

        ```shell
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx DEEPSEEK_API_KEY "your-api-key"
        ``` 

=== "OpenRouter"

    获取您的 [OpenRouter API 密钥](https://openrouter.ai/keys)，并将其设置为 `OPENROUTER_API_KEY` 环境变量的值。

    === "Linux/macOS"

        ```shell
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx OPENROUTER_API_KEY "your-api-key"
        ```  

=== "Bedrock"

    [生成 Amazon Bedrock API 密钥](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)，并将其设置为 `BEDROCK_API_KEY` 环境变量的值。

    === "Linux/macOS"

        ```shell
        export BEDROCK_API_KEY=your-api-key
        ``` 

    === "Windows"

        ```cmd
        setx BEDROCK_API_KEY "your-api-key"
        ```  

=== "Mistral β"

    获取您的 [Mistral API 密钥](https://console.mistral.ai/api-keys)，并将其设置为 `MISTRAL_API_KEY` 环境变量的值。

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

    按照 [Ollama 文档](https://docs.ollama.com/quickstart)中的说明，通过 Ollama 在本地运行 LLM。

## 创建您的第一个 Koog 智能体 {id="create-your-first-koog-agent"}

=== "OpenAI"

    以下示例演示了如何通过 OpenAI API 使用 [`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
        import ai.koog.prompt.executor.clients.openai.OpenAIModels
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 OPENAI_API_KEY 环境变量获取 OpenAI API 密钥
            val apiKey = System.getenv("OPENAI_API_KEY")
                ?: error("未设置 API 密钥。")

            // 创建智能体
            val agent = AIAgent(
                promptExecutor = MultiLLMPromptExecutor(OpenAILLMClient(apiKey)),
                llmModel = OpenAIModels.Chat.GPT4o
            )
        
            // 运行智能体
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-01.kt -->

    === "Java"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent;
        import ai.koog.prompt.executor.clients.openai.OpenAIModels;
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor;
        import static ai.koog.prompt.executor.clients.openai.OpenAIClientFactory.openAIClient;
        class exampleGettingStartedJava01 {
            public static void main(String[] args) {
        -->
        <!--- SUFFIX
            }
        }
        -->
        ```java
        // 从 OPENAI_API_KEY 环境变量获取 OpenAI API 密钥
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(new MultiLLMPromptExecutor(openAIClient(apiKey)))
            .llmModel(OpenAIModels.Chat.GPT4o)
            .build();

        // 运行智能体
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-01.java -->

    该示例可能会产生以下输出：
    
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

    以下示例演示了如何通过 Anthropic API 使用 [`Claude Opus 4.1`](https://www.anthropic.com/news/claude-opus-4-1) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
        import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 ANTHROPIC_API_KEY 环境变量获取 Anthropic API 密钥
            val apiKey = System.getenv("ANTHROPIC_API_KEY")
                ?: error("未设置 API 密钥。")

            // 创建智能体
            val agent = AIAgent(
                promptExecutor = MultiLLMPromptExecutor(AnthropicLLMClient(apiKey)),
                llmModel = AnthropicModels.Opus_4_1
            )
        
            // 运行智能体
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-02.kt -->

    === "Java"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent;
        import ai.koog.prompt.executor.clients.anthropic.AnthropicModels;
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor;
        import static ai.koog.prompt.executor.clients.anthropic.AnthropicClientFactory.anthropicClient;
        class exampleGettingStartedJava02 {
            public static void main(String[] args) {
        -->
        <!--- SUFFIX
            }
        }
        -->
        ```java
        // 从 ANTHROPIC_API_KEY 环境变量获取 Anthropic API 密钥
        String apiKey = System.getenv("ANTHROPIC_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(new MultiLLMPromptExecutor(anthropicClient(apiKey)))
            .llmModel(AnthropicModels.Opus_4_1)
            .build();

        // 运行智能体
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-02.java -->

    该示例可能会产生以下输出：

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

=== "Google β"

    以下示例演示了如何通过 Gemini API 使用 [`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.clients.google.GoogleLLMClient
        import ai.koog.prompt.executor.clients.google.GoogleModels
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 GOOGLE_API_KEY 环境变量获取 Gemini API 密钥
            val apiKey = System.getenv("GOOGLE_API_KEY")
                ?: error("未设置 API 密钥。")

            // 创建智能体
            val agent = AIAgent(
                promptExecutor = MultiLLMPromptExecutor(GoogleLLMClient(apiKey)),
                llmModel = GoogleModels.Gemini2_5Pro
            )
        
            // 运行智能体
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-03.kt -->

    === "Java"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent;
        import ai.koog.prompt.executor.clients.google.GoogleModels;
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor;
        import static ai.koog.prompt.executor.clients.google.GoogleClientFactory.googleClient;
        class exampleGettingStartedJava03 {
            public static void main(String[] args) {
        -->
        <!--- SUFFIX
            }
        }
        -->
        ```java
        // 从 GOOGLE_API_KEY 环境变量获取 Gemini API 密钥
        String apiKey = System.getenv("GOOGLE_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(new MultiLLMPromptExecutor(googleClient(apiKey)))
            .llmModel(GoogleModels.Gemini2_5Pro)
            .build();

        // 运行智能体
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-03.java -->

    该示例可能会产生以下输出：

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

=== "DeepSeek β"

    以下示例演示了如何通过 DeepSeek API 使用 `deepseek-v4-flash` 模型创建并运行一个简单的 Koog 智能体。

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
            // 从 DEEPSEEK_API_KEY 环境变量获取 DeepSeek API 密钥
            val apiKey = System.getenv("DEEPSEEK_API_KEY")
                ?: error("未设置 API 密钥。")

            // 创建智能体
            val agent = AIAgent(
                promptExecutor = MultiLLMPromptExecutor(DeepSeekLLMClient(apiKey)),
                llmModel = DeepSeekModels.DeepSeekV4Flash
            )

            // 运行智能体
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-04.kt -->

    === "Java"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent;
        import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels;
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor;
        import static ai.koog.prompt.executor.clients.deepseek.DeepSeekClientFactory.deepSeekClient;
        class exampleGettingStartedJava04 {
            public static void main(String[] args) {
        -->
        <!--- SUFFIX
            }
        }
        -->
        ```java
        // 从 DEEPSEEK_API_KEY 环境变量获取 DeepSeek API 密钥
        String apiKey = System.getenv("DEEPSEEK_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(new MultiLLMPromptExecutor(deepSeekClient(apiKey)))
            .llmModel(DeepSeekModels.DeepSeekV4Flash)
            .build();

        // 运行智能体
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-04.java -->

    该示例可能会产生以下输出：

    ```
    Hello! I'm here to assist you with a wide range of tasks, including answering questions, providing information, helping with problem-solving, offering creative ideas, and even just chatting. Whether you need help with research, writing, learning something new, or simply want to discuss a topic, feel free to ask—I’m happy to help! 😊
    ```
    <!--- KNIT example-getting-started-05.txt -->

=== "OpenRouter"

    以下示例演示了如何通过 OpenRouter API 使用 [`GPT-4o`](https://openrouter.ai/openai/gpt-4o) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.clients.openrouter.OpenRouterLLMClient
        import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 OPENROUTER_API_KEY 环境变量获取 OpenRouter API 密钥
            val apiKey = System.getenv("OPENROUTER_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = MultiLLMPromptExecutor(OpenRouterLLMClient(apiKey)),
                llmModel = OpenRouterModels.GPT4o
            )
        
            // 运行智能体
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-05.kt -->

    === "Java"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent;
        import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels;
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor;
        import static ai.koog.prompt.executor.clients.openrouter.OpenRouterClientFactory.openRouterClient;
        class exampleGettingStartedJava05 {
            public static void main(String[] args) {
        -->
        <!--- SUFFIX
            }
        }
        -->
        ```java
        // 从 OPENROUTER_API_KEY 环境变量获取 OpenRouter API 密钥
        String apiKey = System.getenv("OPENROUTER_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(new MultiLLMPromptExecutor(openRouterClient(apiKey)))
            .llmModel(OpenRouterModels.GPT4o)
            .build();

        // 运行智能体
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-05.java -->

    该示例可能会产生以下输出：

    ```
    I can answer questions, help with writing, solve problems, organize tasks, and more—just let me know what you need!
    ```
    <!--- KNIT example-getting-started-06.txt -->

=== "Bedrock"

    以下示例演示了如何通过 Bedrock API 使用 [`Claude Sonnet 4.5`](https://www.anthropic.com/news/claude-sonnet-4-5) 模型创建并运行一个简单的 Koog 智能体。
    
    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
        import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
        import ai.koog.prompt.executor.clients.bedrock.BedrockModels
        import ai.koog.prompt.executor.clients.bedrock.StaticBearerTokenProvider
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 BEDROCK_API_KEY 环境变量获取 Bedrock API 密钥
            val apiKey = System.getenv("BEDROCK_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = MultiLLMPromptExecutor(
                    BedrockLLMClient(
                        StaticBearerTokenProvider(apiKey),
                        BedrockClientSettings()
                    )
                ),
                llmModel = BedrockModels.AnthropicClaude4_5Sonnet
            )
        
            // 运行智能体
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-06.kt -->

    === "Java"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent;
        import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings;
        import ai.koog.prompt.executor.clients.bedrock.BedrockModels;
        import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleBedrockExecutorWithBearerToken;
        class exampleGettingStartedJava06 {
            public static void main(String[] args) {
        -->
        <!--- SUFFIX
            }
        }
        -->
        ```java
        // 从 BEDROCK_API_KEY 环境变量获取 Bedrock API 密钥
        String apiKey = System.getenv("BEDROCK_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleBedrockExecutorWithBearerToken(apiKey, new BedrockClientSettings()))
            .llmModel(BedrockModels.INSTANCE.getAnthropicClaude4_5Sonnet())
            .build();

        // 运行智能体
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-06.java -->

    该示例可能会产生以下输出：

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

=== "Mistral β"

    以下示例演示了如何通过 Mistral AI API 使用 [`Mistral Medium 3.1`](https://docs.mistral.ai/models/mistral-medium-3-1-25-08) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.clients.mistralai.MistralAILLMClient
        import ai.koog.prompt.executor.clients.mistralai.MistralAIModels
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 MISTRAL_API_KEY 环境变量获取 Mistral AI API 密钥
            val apiKey = System.getenv("MISTRAL_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = MultiLLMPromptExecutor(MistralAILLMClient(apiKey)),
                llmModel = MistralAIModels.Chat.MistralMedium31
            )
        
            // 运行智能体
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-07.kt -->
    
    === "Java"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent;
        import ai.koog.prompt.executor.clients.mistralai.MistralAIModels;
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor;
        import static ai.koog.prompt.executor.clients.mistralai.MistralAIClientFactory.mistralAIClient;
        class exampleGettingStartedJava07 {
            public static void main(String[] args) {
        -->
        <!--- SUFFIX
            }
        }
        -->
        ```java
        // 从 MISTRAL_API_KEY 环境变量获取 Mistral AI API 密钥
        String apiKey = System.getenv("MISTRAL_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(new MultiLLMPromptExecutor(mistralAIClient(apiKey)))
            .llmModel(MistralAIModels.Chat.MistralMedium31)
            .build();

        // 运行智能体
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-07.java -->

    该示例可能会产生以下输出：

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

    以下示例演示了如何使用通过 Ollama 在本地运行的 [`llama3.2`](https://ollama.com/library/llama3.2) 模型，创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
        import ai.koog.prompt.executor.ollama.client.OllamaClient
        import ai.koog.prompt.executor.ollama.client.OllamaModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = MultiLLMPromptExecutor(OllamaClient()),
                llmModel = OllamaModels.Meta.LLAMA_3_2
            )

            // 运行智能体
            val result = agent.run("Hello! How can you help me?")
            println(result)
        }
        ```
        <!--- KNIT example-getting-started-08.kt -->

    === "Java"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent;
        import ai.koog.prompt.executor.ollama.client.OllamaModels;
        import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor;
        import static ai.koog.prompt.executor.ollama.client.OllamaClientFactory.ollamaClient;
        class exampleGettingStartedJava08 {
            public static void main(String[] args) {
        -->
        <!--- SUFFIX
            }
        }
        -->
        ```java
        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(new MultiLLMPromptExecutor(ollamaClient("http://localhost:11434")))
            .llmModel(OllamaModels.Meta.LLAMA_3_2)
            .build();

        // 运行智能体
        String result = agent.run("Hello! How can you help me?");
        System.out.println(result);
        ```
        <!--- KNIT example-getting-started-java-08.java -->

    该示例可能会产生以下输出：

    ```
    I can assist with various tasks such as answering questions, providing information, and even helping with language-related tasks like proofreading or writing suggestions. What's on your mind today?
    ```
    <!--- KNIT example-getting-started-09.txt -->

## 后续步骤 {id="next-steps"}

- 详细了解 [智能体类型](agents/index.md)
