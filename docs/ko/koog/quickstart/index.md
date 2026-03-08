# 빠른 시작(Quickstart)

이 가이드는 프로젝트에서 Koog를 사용하기 위한 시작 방법을 안내합니다.

## 사전 준비 사항(Prerequisites)

--8<-- "quickstart-snippets.md:prerequisites"

## Koog 설치하기

--8<-- "quickstart-snippets.md:dependencies"

??? tip "나이틀리 빌드(Nightly builds)"

    develop 브랜치의 나이틀리 빌드는 [JetBrains Grazie Maven](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public) 저장소에 배포됩니다.
    
    나이틀리 빌드를 사용하려면 빌드 설정에 다음 저장소를 추가하세요:
    `https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public`.
    
    그런 다음 Koog 의존성을 원하는 나이틀리 버전으로 업데이트하세요. 나이틀리 버전은 다음 패턴을 따릅니다:
    `[next-major-version]-develop-[date]-[time]`.
    
    사용 가능한 나이틀리 빌드는 [여기](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public/ai/koog/koog-agents/)에서 찾아볼 수 있습니다.

## API 키 설정하기

Koog를 사용하려면 [지원되는 LLM 제공자](../llm-providers.md)의 API 키 또는 로컬에서 실행 중인 LLM이 필요합니다.

!!! warning
    소스 코드에 API 키를 하드코딩하지 마세요.
    API 키를 저장할 때는 환경 변수를 사용하세요.

=== "OpenAI"

    [OpenAI API 키](https://platform.openai.com/api-keys)를 발급받아 `OPENAI_API_KEY` 환경 변수에 할당하세요.
    
    === "Linux/macOS"

        ```shell
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx OPENAI_API_KEY "your-api-key"
        ```

=== "Anthropic"

    [Anthropic API 키](https://console.anthropic.com/settings/keys)를 발급받아 `ANTHROPIC_API_KEY` 환경 변수에 할당하세요.

    === "Linux/macOS"

        ```shell
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx ANTHROPIC_API_KEY "your-api-key"
        ```

=== "Google"

    [Gemini API 키](https://aistudio.google.com/app/api-keys)를 발급받아 `GOOGLE_API_KEY` 환경 변수에 할당하세요.

    === "Linux/macOS"

        ```shell
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx GOOGLE_API_KEY "your-api-key"
        ```  

=== "DeepSeek"

    [DeepSeek API 키](https://platform.deepseek.com/api_keys)를 발급받아 `DEEPSEEK_API_KEY` 환경 변수에 할당하세요.

    === "Linux/macOS"

        ```shell
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx DEEPSEEK_API_KEY "your-api-key"
        ``` 

=== "OpenRouter"

    [OpenRouter API 키](https://openrouter.ai/keys)를 발급받아 `OPENROUTER_API_KEY` 환경 변수에 할당하세요.

    === "Linux/macOS"

        ```shell
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```cmd
        setx OPENROUTER_API_KEY "your-api-key"
        ```  

=== "Bedrock"

    [Amazon Bedrock API 키를 생성](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)하고 `BEDROCK_API_KEY` 환경 변수에 할당하세요.

    === "Linux/macOS"

        ```shell
        export BEDROCK_API_KEY=your-api-key
        ``` 

    === "Windows"

        ```cmd
        setx BEDROCK_API_KEY "your-api-key"
        ```  

=== "Mistral"

    [Mistral API 키](https://console.mistral.ai/api-keys)를 발급받아 `MISTRAL_API_KEY` 환경 변수에 할당하세요.

    === "Linux/macOS"

        ```shell
        export MISTRAL_API_KEY=your-api-key
        ``` 

    === "Windows"

        ```cmd
        setx MISTRAL_API_KEY "your-api-key"
        ``` 

=== "Ollama"

    [Ollama 문서](https://docs.ollama.com/quickstart)의 설명에 따라 로컬 LLM을 Ollama에서 실행하세요.

## 첫 번째 Koog 에이전트 만들기

=== "OpenAI"

    다음 예제는 OpenAI API를 통해 [`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) 모델을 사용하는 간단한 Koog 에이전트를 생성하고 실행합니다.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // OPENAI_API_KEY 환경 변수에서 OpenAI API 키를 가져옵니다.
        val apiKey = System.getenv("OPENAI_API_KEY")
            ?: error("API 키가 설정되지 않았습니다.")
        
        // 에이전트 생성
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )
    
        // 에이전트 실행
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-01.kt -->

    이 예제는 다음과 같은 출력을 생성할 수 있습니다:
    
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

    다음 예제는 Anthropic API를 통해 [`Claude Opus 4.1`](https://www.anthropic.com/news/claude-opus-4-1) 모델을 사용하는 간단한 Koog 에이전트를 생성하고 실행합니다.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // ANTHROPIC_API_KEY 환경 변수에서 Anthropic API 키를 가져옵니다.
        val apiKey = System.getenv("ANTHROPIC_API_KEY")
            ?: error("API 키가 설정되지 않았습니다.")
        
        // 에이전트 생성
        val agent = AIAgent(
            promptExecutor = simpleAnthropicExecutor(apiKey),
            llmModel = AnthropicModels.Opus_4_1
        )
    
        // 에이전트 실행
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-02.kt -->

    이 예제는 다음과 같은 출력을 생성할 수 있습니다:

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

    다음 예제는 Gemini API를 통해 [`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) 모델을 사용하는 간단한 Koog 에이전트를 생성하고 실행합니다.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // GOOGLE_API_KEY 환경 변수에서 Gemini API 키를 가져옵니다.
        val apiKey = System.getenv("GOOGLE_API_KEY")
            ?: error("API 키가 설정되지 않았습니다.")
        
        // 에이전트 생성
        val agent = AIAgent(
            promptExecutor = simpleGoogleAIExecutor(apiKey),
            llmModel = GoogleModels.Gemini2_5Pro
        )
    
        // 에이전트 실행
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-03.kt -->

    이 예제는 다음과 같은 출력을 생성할 수 있습니다:

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

    다음 예제는 DeepSeek API를 통해 `deepseek-chat` 모델을 사용하는 간단한 Koog 에이전트를 생성하고 실행합니다.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient
    import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // DEEPSEEK_API_KEY 환경 변수에서 DeepSeek API 키를 가져옵니다.
        val apiKey = System.getenv("DEEPSEEK_API_KEY")
            ?: error("API 키가 설정되지 않았습니다.")
        
        // LLM 클라이언트 생성
        val deepSeekClient = DeepSeekLLMClient(apiKey)
    
        // 에이전트 생성
        val agent = AIAgent(
            // LLM 클라이언트를 사용하여 프롬프트 실행기(prompt executor) 생성
            promptExecutor = MultiLLMPromptExecutor(deepSeekClient),
            // 모델 제공
            llmModel = DeepSeekModels.DeepSeekChat
        )
    
        // 에이전트 실행
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-04.kt -->

    이 예제는 다음과 같은 출력을 생성할 수 있습니다:

    ```
    Hello! I'm here to assist you with a wide range of tasks, including answering questions, providing information, helping with problem-solving, offering creative ideas, and even just chatting. Whether you need help with research, writing, learning something new, or simply want to discuss a topic, feel free to ask—I’m happy to help! 😊
    ```

=== "OpenRouter"

    다음 예제는 OpenRouter API를 통해 [`GPT-4o`](https://openrouter.ai/openai/gpt-4o) 모델을 사용하는 간단한 Koog 에이전트를 생성하고 실행합니다.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor
    import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // OPENROUTER_API_KEY 환경 변수에서 OpenRouter API 키를 가져옵니다.
        val apiKey = System.getenv("OPENROUTER_API_KEY")
            ?: error("API 키가 설정되지 않았습니다.")
        
        // 에이전트 생성
        val agent = AIAgent(
            promptExecutor = simpleOpenRouterExecutor(apiKey),
            llmModel = OpenRouterModels.GPT4o
        )
    
        // 에이전트 실행
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-05.kt -->

    이 예제는 다음과 같은 출력을 생성할 수 있습니다:

    ```
    I can answer questions, help with writing, solve problems, organize tasks, and more—just let me know what you need!
    ```

=== "Bedrock"

    다음 예제는 Bedrock API를 통해 [`Claude Sonnet 4.5`](https://www.anthropic.com/news/claude-sonnet-4-5) 모델을 사용하는 간단한 Koog 에이전트를 생성하고 실행합니다.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleBedrockExecutorWithBearerToken
    import ai.koog.prompt.executor.clients.bedrock.BedrockModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // BEDROCK_API_KEY 환경 변수에서 Bedrock API 키를 가져옵니다.
        val apiKey = System.getenv("BEDROCK_API_KEY")
            ?: error("API 키가 설정되지 않았습니다.")
        
        // 에이전트 생성
        val agent = AIAgent(
            promptExecutor = simpleBedrockExecutorWithBearerToken(apiKey),
            llmModel = BedrockModels.AnthropicClaude4_5Sonnet
        )
    
        // 에이전트 실행
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-06.kt -->

    이 예제는 다음과 같은 출력을 생성할 수 있습니다:

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

=== "Mistral"

    다음 예제는 Mistral AI API를 통해 [`Mistral Medium 3.1`](https://docs.mistral.ai/models/mistral-medium-3-1-25-08) 모델을 사용하는 간단한 Koog 에이전트를 생성하고 실행합니다.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleMistralAIExecutor
    import ai.koog.prompt.executor.clients.mistralai.MistralAIModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // MISTRAL_API_KEY 환경 변수에서 Mistral AI API 키를 가져옵니다.
        val apiKey = System.getenv("MISTRAL_API_KEY")
            ?: error("API 키가 설정되지 않았습니다.")
        
        // 에이전트 생성
        val agent = AIAgent(
            promptExecutor = simpleMistralAIExecutor(apiKey),
            llmModel = MistralAIModels.Chat.MistralMedium31
        )
    
        // 에이전트 실행
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-07.kt -->

    이 예제는 다음과 같은 출력을 생성할 수 있습니다:

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

=== "Ollama"

    다음 예제는 Ollama를 통해 로컬에서 실행되는 [`llama3.2`](https://ollama.com/library/llama3.2) 모델을 사용하는 간단한 Koog 에이전트를 생성하고 실행합니다.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // 에이전트 생성
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2
        )

        // 에이전트 실행
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-08.kt -->

    이 예제는 다음과 같은 출력을 생성할 수 있습니다:

    ```
    I can assist with various tasks such as answering questions, providing information, and even helping with language-related tasks like proofreading or writing suggestions. What's on your mind today?
    ```

## 다음 단계

- [메모리 기능이 있는 채팅 에이전트 만들기](chat-agent.md) — 이전 메시지를 기억하는 대화형 에이전트 만들기
- [에이전트 구축](../agents/index.md)에 대해 더 알아보기