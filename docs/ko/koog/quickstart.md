# 퀵스타트

이 가이드는 프로젝트에서 Koog를 사용하기 시작하는 방법을 안내합니다.

## 사전 준비 사항

--8<-- "quickstart-snippets.md:prerequisites"

## Koog 설치하기

--8<-- "quickstart-snippets.md:dependencies"

??? tip "나이틀리 빌드 (Nightly builds)"

    develop 브랜치의 나이틀리 빌드는 [JetBrains Grazie Maven](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public) 저장소에 배포됩니다.
    
    나이틀리 빌드를 사용하려면 빌드 구성에 다음 저장소를 추가하세요:
    `https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public`
    
    그 다음 Koog 의존성을 원하는 나이틀리 버전으로 업데이트하세요. 나이틀리 버전은 다음과 같은 형식을 따릅니다:
    `[next-major-version]-develop-[date]-[time]`
    
    사용 가능한 나이틀리 빌드는 [여기](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public/ai/koog/koog-agents/)에서 확인할 수 있습니다.

## API 키 설정하기

Koog를 사용하려면 [지원되는 LLM 제공자](llm-providers.md)의 API 키 또는 로컬에서 실행 중인 LLM이 필요합니다.

!!! warning "경고"
    소스 코드에 API 키를 하드코딩하지 마세요.
    API 키를 저장하려면 환경 변수를 사용하세요.

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

    [Amazon Bedrock API 키를 생성](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)하고 이를 `BEDROCK_API_KEY` 환경 변수에 할당하세요.

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

    [Ollama 문서](https://docs.ollama.com/quickstart)의 설명에 따라 Ollama에서 로컬 LLM을 실행하세요.

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
    안녕하세요! 무엇이든 도와드릴 준비가 되어 있습니다. 제가 도와드릴 수 있는 몇 가지 사항은 다음과 같습니다:

    - 질문에 답변하기.
    - 궁금한 개념이나 주제 설명하기.
    - 작업에 대한 단계별 지침 제공하기.
    - 조언, 메모 또는 아이디어 제안하기.
    - 조사 업무 지원 또는 복잡한 자료 요약하기.
    - 텍스트, 이메일 또는 기타 문서 작성 및 편집하기.
    - 창의적인 프로젝트나 솔루션 브레인스토밍하기.
    - 문제 풀이 또는 계산 수행하기.

    도움이 필요한 것이 있다면 말씀해 주세요!
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
    안녕하세요! 다음과 같은 일들을 도와드릴 수 있습니다:

    - **질문 답변** 및 주제 설명
    - **글쓰기** - 초안 작성, 편집, 교정
    - **학습** - 과제, 수학, 학습 보조
    - **문제 해결** 및 브레인스토밍
    - **조사** 및 정보 검색
    - **일반적인 작업** - 지침 제공, 계획 수립, 추천
    
    오늘은 어떤 도움이 필요하신가요?
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
    저는 언어 및 정보와 관련된 작업을 도와드릴 수 있는 AI입니다. 저에게 다음과 같은 것들을 요청하실 수 있습니다:

    *   **질문 답변**
    *   **텍스트 작성 및 편집** (이메일, 이야기, 코드 등)
    *   **아이디어 브레인스토밍**
    *   **긴 문서 요약**
    *   **계획 수립** (여행이나 프로젝트 등)
    *   **창의적인 파트너 역할**

    필요한 것이 있다면 말씀해 주세요.
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
            // LLM 클라이언트를 사용하여 프롬프트 실행기 생성
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
    안녕하세요! 질문 답변, 정보 제공, 문제 해결 지원, 창의적인 아이디어 제안, 그리고 간단한 대화까지 폭넓은 작업을 도와드릴 수 있습니다. 조사, 글쓰기, 새로운 학습에 도움이 필요하시거나 단순히 특정 주제에 대해 이야기하고 싶으시다면 언제든 편하게 말씀해 주세요. 기꺼이 도와드리겠습니다! 😊
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
    질문에 답하고, 글쓰기를 돕고, 문제를 해결하고, 작업을 정리하는 등 다양한 일을 도와드릴 수 있습니다. 무엇이 필요한지 알려주세요!
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
    안녕하세요! 저는 여러분을 돕는 보조자이며 다음과 같은 다양한 방법으로 도움을 드릴 수 있습니다:

    - **질문 답변** - 광범위한 주제(과학, 역사, 기술 등)에 대한 답변
    - **글쓰기 지원** - 이메일, 에세이, 창의적 콘텐츠 초안 작성 또는 텍스트 편집
    - **문제 해결** - 수학 문제 풀이, 논리 퍼즐 또는 문제 해결 지원
    - **학습 지원** - 개념 설명, 학습 노트 제공 또는 튜터링
    - **계획 및 정리** - 프로젝트, 일정 관리 또는 작업 세분화 지원
    - **코딩 지원** - 프로그래밍 개념 설명 또는 코드 디버깅 지원
    - **창의적 브레인스토밍** - 프로젝트, 이야기 또는 솔루션을 위한 아이디어 생성
    - **일반 대화** - 주제 토론 또는 일상적인 대화
    
     오늘은 어떤 도움을 드릴까요?
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
    다양한 주제와 작업을 도와드릴 수 있습니다. 예시는 다음과 같습니다:

    1. **질문 답변**: 역사, 과학, 기술, 문학 등 다양한 분야의 정보를 제공할 수 있습니다.
    2. **정의 제공**: 단어나 구절의 의미가 확실하지 않을 때 정의를 도와드릴 수 있습니다.
    3. **텍스트 생성**: 이메일 작성, 소셜 미디어 콘텐츠 제작, 이야기 구성 등 텍스트 생성을 도울 수 있습니다.
    4. **번역**: 텍스트를 한 언어에서 다른 언어로 번역할 수 있습니다.
    5. **대화**: 관심 있는 주제에 대해 대화하고 그에 맞춰 응답할 수 있습니다.
    6. **언어 연습**: 새로운 언어를 배우고 있다면 발음, 문법, 어휘 연습을 도울 수 있습니다.
    7. **브레인스토밍**: 문제에 부딪혔거나 프로젝트 아이디어가 필요할 때 해결책을 함께 고민할 수 있습니다.
    8. **요약**: 긴 텍스트를 요약하고 싶을 때 핵심 내용을 압축해 드릴 수 있습니다.
    
    지금 무슨 생각을 하고 계신가요? 특별히 도움이 필요한 부분이 있나요?
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
    질문 답변, 정보 제공, 그리고 교정이나 글쓰기 제안과 같은 언어 관련 작업 등 다양한 업무를 도와드릴 수 있습니다. 오늘 어떤 도움이 필요하신가요?
    ```

## 다음 단계

- [에이전트 구축](agents/index.md)에 대해 자세히 알아보기