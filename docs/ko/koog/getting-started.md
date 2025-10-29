# 시작하기

이 가이드에서는 Koog를 설치하고 첫 번째 AI 에이전트를 생성하는 데 도움을 드립니다.

## 사전 준비 사항

시작하기 전에 다음 사항을 확인하세요:

- Gradle 또는 Maven이 포함된 작동 중인 Kotlin/JVM 프로젝트.
- Java 17 이상 설치.
- 선호하는 [LLM 공급자](llm-providers.md)의 유효한 API 키 (로컬에서 실행되는 Ollama에는 필요하지 않음).

## Koog 설치

Koog를 사용하려면 필요한 모든 종속성을 빌드 구성에 포함해야 합니다.

!!! note
    `LATEST_VERSION`을 Maven Central에 게시된 Koog의 최신 버전으로 교체하세요.

=== "Gradle (Kotlin DSL)"

    1. `build.gradle.kts` 파일에 종속성을 추가합니다.
    
        ```kotlin
        dependencies {
            implementation("ai.koog:koog-agents:LATEST_VERSION")
        }
        ```
    2. 저장소 목록에 `mavenCentral()`이 있는지 확인하세요.
    
        ```kotlin
        repositories {
            mavenCentral()
        }
        ```

=== "Gradle (Groovy)"

    1. `build.gradle` 파일에 종속성을 추가합니다.
    
        ```groovy
        dependencies {
            implementation 'ai.koog:koog-agents:LATEST_VERSION'
        }
        ```
    2. 저장소 목록에 `mavenCentral()`이 있는지 확인하세요.
        ```groovy
        repositories {
            mavenCentral()
        }
        ```

=== "Maven"

    1. `pom.xml` 파일에 종속성을 추가합니다.
    
        ```xml
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-agents-jvm</artifactId>
            <version>LATEST_VERSION</version>
        </dependency>
        ```
    2. 저장소 목록에 `mavenCentral()`이 있는지 확인하세요.

        ```xml
         <repositories>
            <repository>
                <id>mavenCentral</id>
                <url>https://repo1.maven.org/maven2/</url>
            </repository>
        </repositories>
        ```

!!! note
    Koog를 [Ktor 서버](ktor-plugin.md), [Spring 애플리케이션](spring-boot.md) 또는 [MCP 도구](model-context-protocol.md)와 통합할 때는 빌드 구성에 추가 종속성을 포함해야 합니다.
    정확한 종속성에 대해서는 Koog 문서의 관련 페이지를 참조하세요.

## API 키 설정

!!! tip
    API 키를 저장하려면 환경 변수 또는 보안 구성 관리 시스템을 사용하세요.
    소스 코드에 API 키를 직접 하드코딩하는 것을 피하세요.

=== "OpenAI"

    [API 키](https://platform.openai.com/api-keys)를 가져와 환경 변수로 할당합니다.
    
    === "Linux/macOS"

        ```bash
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENAI_API_KEY "your-api-key"
        ```
    
    변경 사항을 적용하려면 터미널을 다시 시작하세요. 이제 API 키를 검색하고 사용하여 에이전트를 생성할 수 있습니다.   

=== "Anthropic"

    [API 키](https://console.anthropic.com/settings/keys)를 가져와 환경 변수로 할당합니다.

    === "Linux/macOS"

        ```bash
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx ANTHROPIC_API_KEY "your-api-key"
        ```
    
    변경 사항을 적용하려면 터미널을 다시 시작하세요. 이제 API 키를 검색하고 사용하여 에이전트를 생성할 수 있습니다.

=== "Google"

    [API 키](https://aistudio.google.com/app/api-keys)를 가져와 환경 변수로 할당합니다.

    === "Linux/macOS"

        ```bash
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx GOOGLE_API_KEY "your-api-key"
        ```

    변경 사항을 적용하려면 터미널을 다시 시작하세요. 이제 API 키를 검색하고 사용하여 에이전트를 생성할 수 있습니다.   

=== "DeepSeek"
    
    [API 키](https://platform.deepseek.com/api_keys)를 가져와 환경 변수로 할당합니다.

    === "Linux/macOS"

        ```bash
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx DEEPSEEK_API_KEY "your-api-key"
        ```

    변경 사항을 적용하려면 터미널을 다시 시작하세요. 이제 API 키를 검색하고 사용하여 에이전트를 생성할 수 있습니다.   

=== "OpenRouter"

    [API 키](https://openrouter.ai/keys)를 가져와 환경 변수로 할당합니다.

    === "Linux/macOS"

        ```bash
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENROUTER_API_KEY "your-api-key"
        ```

    변경 사항을 적용하려면 터미널을 다시 시작하세요. 이제 API 키를 검색하고 사용하여 에이전트를 생성할 수 있습니다.   

=== "Bedrock"

    유효한 [AWS 자격 증명](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_bedrock.html) (액세스 키 및 비밀 키)을 가져와 환경 변수로 할당합니다.

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

    변경 사항을 적용하려면 터미널을 다시 시작하세요. 이제 API 키를 검색하고 사용하여 에이전트를 생성할 수 있습니다.   

=== "Ollama"

    Ollama를 설치하고 API 키 없이 로컬에서 모델을 실행합니다.

    자세한 내용은 [Ollama 문서](https://docs.ollama.com/quickstart)를 참조하세요.

## 에이전트 생성 및 실행

=== "OpenAI"

    아래 예시는 [`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) 모델을 사용하여 간단한 AI 에이전트를 생성하고 실행합니다.

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

    이 예시는 다음 출력을 생성할 수 있습니다:
    
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

    아래 예시는 [`Claude Opus 4.1`](https://www.anthropic.com/news/claude-opus-4-1) 모델을 사용하여 간단한 AI 에이전트를 생성하고 실행합니다.

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

    이 예시는 다음 출력을 생성할 수 있습니다:

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

    아래 예시는 [`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) 모델을 사용하여 간단한 AI 에이전트를 생성하고 실행합니다.

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

    이 예시는 다음 출력을 생성할 수 있습니다:

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

    아래 예시는 `deepseek-chat` 모델을 사용하여 간단한 AI 에이전트를 생성하고 실행합니다.

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

    이 예시는 다음 출력을 생성할 수 있습니다:

    ```
    Hello! I'm here to assist you with a wide range of tasks, including answering questions, providing information, helping with problem-solving, offering creative ideas, and even just chatting. Whether you need help with research, writing, learning something new, or simply want to discuss a topic, feel free to ask—I’m happy to help! 😊
    ```

=== "OpenRouter"

    아래 예시는 [`GPT-4o`](https://openrouter.ai/openai/gpt-4o) 모델을 사용하여 간단한 AI 에이전트를 생성하고 실행합니다.

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

    이 예시는 다음 출력을 생성할 수 있습니다:

    ```
    I can answer questions, help with writing, solve problems, organize tasks, and more—just let me know what you need!
    ```

=== "Bedrock"

    아래 예시는 [`Claude Sonnet 4.5`](https://www.anthropic.com/news/claude-sonnet-4-5) 모델을 사용하여 간단한 AI 에이전트를 생성하고 실행합니다.

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

    이 예시는 다음 출력을 생성할 수 있습니다:

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

    아래 예시는 [`llama3.2`](https://ollama.com/library/llama3.2) 모델을 사용하여 간단한 AI 에이전트를 생성하고 실행합니다.

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

    이 예시는 다음 출력을 생성할 수 있습니다:

    ```
    I can assist with various tasks such as answering questions, providing information, and even helping with language-related tasks like proofreading or writing suggestions. What's on your mind today?
    ```

## 다음 단계

- Koog의 [주요 기능](key-features.md)을 살펴보세요.
- 사용 가능한 [에이전트 유형](basic-agents.md)에 대해 자세히 알아보세요.