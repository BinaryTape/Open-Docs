# 快速入门

本指南将帮助您开始在项目中使用 Koog。

## 前提条件

--8<-- "quickstart-snippets.md:prerequisites"

## 安装 Koog

--8<-- "quickstart-snippets.md:dependencies"

??? tip "每夜构建"

    来自 develop 分支的每夜构建已发布到 [JetBrains Grazie Maven](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public) 仓库。
    
    要使用每夜构建，请将以下仓库添加到您的构建配置中：
    `https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public`。
    
    然后将您的 Koog 依赖项更新为所需的每夜版本。每夜版本的格式如下：
    `[next-major-version]-develop-[date]-[time]`。
    
    您可以[在此处](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public/ai/koog/koog-agents/)浏览可用的每夜构建。

## 设置 API 密钥

Koog 需要 [受支持的 LLM 提供者](llm-providers.md) 提供的 API 密钥或本地运行的 LLM。

!!! warning
    避免在源代码中硬编码 API 密钥。使用环境变量存储 API 密钥。

=== "OpenAI"

    获取您的 [OpenAI API 密钥](https://platform.openai.com/api-keys) 并将其分配给 `OPENAI_API_KEY` 环境变量。
    
    === "Linux/macOS"

        ```shell
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx OPENAI_API_KEY "your-api-key"
        ```

=== "Anthropic"

    获取您的 [Anthropic API 密钥](https://console.anthropic.com/settings/keys) 并将其分配给 `ANTHROPIC_API_KEY` 环境变量。

    === "Linux/macOS"

        ```shell
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx ANTHROPIC_API_KEY "your-api-key"
        ```

=== "Google"

    获取您的 [Gemini API 密钥](https://aistudio.google.com/app/api-keys) 并将其分配给 `GOOGLE_API_KEY` 环境变量。

    === "Linux/macOS"

        ```shell
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx GOOGLE_API_KEY "your-api-key"
        ```  

=== "DeepSeek"

    获取您的 [DeepSeek API 密钥](https://platform.deepseek.com/api_keys) 并将其分配给 `DEEPSEEK_API_KEY` 环境变量。

    === "Linux/macOS"

        ```shell
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx DEEPSEEK_API_KEY "your-api-key"
        ``` 

=== "OpenRouter"

    获取您的 [OpenRouter API 密钥](https://openrouter.ai/keys) 并将其分配给 `OPENROUTER_API_KEY` 环境变量。

    === "Linux/macOS"

        ```shell
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx OPENROUTER_API_KEY "your-api-key"
        ```  

=== "Bedrock"

    [生成 Amazon Bedrock API 密钥](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) 并将其分配给 `BEDROCK_API_KEY` 环境变量。

    === "Linux/macOS"

        ```shell
        export BEDROCK_API_KEY=your-api-key
        ``` 

    === "Windows"

        ```cmd
        setx BEDROCK_API_KEY "your-api-key"
        ```  

=== "Mistral"

    获取您的 [Mistral API 密钥](https://console.mistral.ai/api-keys) 并将其分配给 `MISTRAL_API_KEY` 环境变量。

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

    按照 [Ollama 文档](https://docs.ollama.com/quickstart) 中的说明在 Ollama 中运行本地 LLM。

## 创建您的第一个 Koog 智能体

=== "OpenAI"

    以下示例演示了如何通过 OpenAI API 使用 [`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
        import ai.koog.prompt.executor.clients.openai.OpenAIModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 OPENAI_API_KEY 环境变量获取 OpenAI API 密钥
            val apiKey = System.getenv("OPENAI_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = simpleOpenAIExecutor(apiKey),
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
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 从 OPENAI_API_KEY 环境变量获取 OpenAI API 密钥
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleOpenAIExecutor(apiKey))
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
        import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
        import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 ANTHROPIC_API_KEY 环境变量获取 Anthropic API 密钥
            val apiKey = System.getenv("ANTHROPIC_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = simpleAnthropicExecutor(apiKey),
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
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 从 ANTHROPIC_API_KEY 环境变量获取 Anthropic API 密钥
        String apiKey = System.getenv("ANTHROPIC_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleAnthropicExecutor(apiKey))
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

=== "Google"

    以下示例演示了如何通过 Gemini API 使用 [`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
        import ai.koog.prompt.executor.clients.google.GoogleModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 GOOGLE_API_KEY 环境变量获取 Gemini API 密钥
            val apiKey = System.getenv("GOOGLE_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = simpleGoogleAIExecutor(apiKey),
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
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 从 GOOGLE_API_KEY 环境变量获取 Gemini API 密钥
        String apiKey = System.getenv("GOOGLE_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleGoogleAIExecutor(apiKey))
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

=== "DeepSeek"

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
            
            // 创建 LLM 客户端
            val deepSeekClient = DeepSeekLLMClient(apiKey)
        
            // 创建智能体
            val agent = AIAgent(
                // 使用 LLM 客户端创建提示执行器 (prompt executor)
                promptExecutor = MultiLLMPromptExecutor(deepSeekClient),
                // 提供模型
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
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 从 DEEPSEEK_API_KEY 环境变量获取 DeepSeek API 密钥
        String apiKey = System.getenv("DEEPSEEK_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建 LLM 客户端
        DeepSeekLLMClient deepSeekClient = deepSeekClient(apiKey);

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            // 使用 LLM 客户端创建提示执行器 (prompt executor)
            .promptExecutor(new MultiLLMPromptExecutor(deepSeekClient))
            // 提供模型
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
        import ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor
        import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 OPENROUTER_API_KEY 环境变量获取 OpenRouter API 密钥
            val apiKey = System.getenv("OPENROUTER_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = simpleOpenRouterExecutor(apiKey),
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
        /**
        -->
        <!--- SUFFIX
        **/
        -->
        ```java
        // 从 OPENROUTER_API_KEY 环境变量获取 OpenRouter API 密钥
        String apiKey = System.getenv("OPENROUTER_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleOpenRouterExecutor(apiKey))
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
        import ai.koog.prompt.executor.llms.all.simpleBedrockExecutorWithBearerToken
        import ai.koog.prompt.executor.clients.bedrock.BedrockModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 BEDROCK_API_KEY 环境变量获取 Bedrock API 密钥
            val apiKey = System.getenv("BEDROCK_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = simpleBedrockExecutorWithBearerToken(apiKey),
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
        /**
        -->
        <!--- SUFFIX
        **/
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

=== "Mistral"

    以下示例演示了如何通过 Mistral AI API 使用 [`Mistral Medium 3.1`](https://docs.mistral.ai/models/mistral-medium-3-1-25-08) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleMistralAIExecutor
        import ai.koog.prompt.executor.clients.mistralai.MistralAIModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 从 MISTRAL_API_KEY 环境变量获取 Mistral AI API 密钥
            val apiKey = System.getenv("MISTRAL_API_KEY")
                ?: error("未设置 API 密钥。")
            
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = simpleMistralAIExecutor(apiKey),
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
        /**
        -->
        <!--- SUFFIX
        **/
        -->   
        ```java
        // 从 MISTRAL_API_KEY 环境变量获取 Mistral AI API 密钥
        String apiKey = System.getenv("MISTRAL_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("未设置 API 密钥。");
        }

        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleMistralAIExecutor(apiKey))
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

    以下示例演示了如何使用通过 Ollama 本地运行的 [`llama3.2`](https://ollama.com/library/llama3.2) 模型创建并运行一个简单的 Koog 智能体。

    === "Kotlin"

        <!--- INCLUDE
        import ai.koog.agents.core.agent.AIAgent
        import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
        import ai.koog.prompt.executor.ollama.client.OllamaModels
        import kotlinx.coroutines.runBlocking
        -->
        ```kotlin
        fun main() = runBlocking {
            // 创建智能体
            val agent = AIAgent(
                promptExecutor = simpleOllamaAIExecutor(),
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
        /**
        -->
        <!--- SUFFIX
        **/
        -->  
        ```java
        // 创建智能体
        AIAgent<String, String> agent = AIAgent.builder()
            .promptExecutor(simpleOllamaAIExecutor("http://localhost:11434"))
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

## 后续步骤

- 详细了解 [智能体类型](agents/index.md)