# 메모리 기능을 갖춘 채팅 에이전트 구축하기

이 가이드는 [ChatMemory](../chat-memory.md) 기능을 사용하여 여러 상호작용에 걸쳐 이전 메시지를 기억하는 대화형 채팅 에이전트를 만드는 방법을 설명합니다.

## 필수 요건 (Prerequisites)

--8<-- "quickstart-snippets.md:prerequisites"

## Koog 및 Memory 기능 설치하기

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

## API 키 설정하기

--8<-- "quickstart-snippets.md:api-key"

## 구축할 내용

다음과 같은 기능을 가진 명령줄(command-line) 채팅 에이전트를 구축합니다.

- 루프 내에서 사용자 입력을 받음
- 각 메시지를 LLM에 전송
- 여러 번의 `agent.run()` 호출에 걸쳐 전체 대화 이력을 기억
- 슬라이딩 윈도우(sliding window)를 사용하여 컨텍스트 크기를 제한

ChatMemory가 없으면 `agent.run()`을 호출할 때마다 새로운 대화가 시작됩니다. 즉, 에이전트는 이전에 어떤 대화가 오갔는지 알지 못합니다. ChatMemory는 각 실행 전에 이전 메시지를 자동으로 로드하고, 실행 후 업데이트된 이력을 저장하여 이 문제를 해결합니다.

## 채팅 에이전트 생성하기

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
            // 여기에 도구를 등록하세요
        }

        simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")).use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = OpenAIModels.Chat.GPT5_2,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20) // 마지막 20개의 메시지만 유지
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
            // 여기에 도구를 등록하세요
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
            // 여기에 도구를 등록하세요
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
            // 여기에 도구를 등록하세요
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

## 작동 방식

위 예제에는 세 가지 핵심 부분이 있습니다.

### 1. ChatMemory 설치

ChatMemory는 에이전트 빌더 블록 내에서 [기능(feature)](../features-overview.md)으로 설치됩니다.

```kotlin
AIAgent(
    promptExecutor = executor,
    llmModel = OpenAIModels.Chat.GPT5_2,
    systemPrompt = "You are a helpful assistant.",
    toolRegistry = toolRegistry,
) {
    install(ChatMemory) {
        windowSize(20) // 마지막 20개의 메시지만 유지
    }
}
```

`windowSize(20)` [전처리기(preprocessor)](../chat-memory.md#preprocessors)는 대화 컨텍스트가 일정 범위를 넘지 않도록 보장하여 가장 최근의 메시지 20개만 유지합니다. 이것이 없으면 대화가 길어질수록 프롬프트 크기가 무한정 커지게 됩니다.

### 2. 일관된 세션 ID 사용

`agent.run()`의 두 번째 인자는 세션 ID입니다.

```kotlin
val reply = agent.run(input, sessionId)
```

ChatMemory는 이 ID를 사용하여 대화 내용을 로드하고 저장합니다. 동일한 세션 ID를 가진 모든 호출은 같은 이력을 공유합니다. 세션 ID가 다르면 완전히 분리된 대화가 생성됩니다.

### 3. 채팅 루프

`while` 루프의 각 반복 단계는 다음과 같습니다.

1. 사용자 입력을 읽습니다.
2. `agent.run(input, sessionId)`를 호출합니다. ChatMemory는 LLM이 프롬프트를 보기 전에 이전 이력을 자동으로 로드합니다.
3. 응답을 출력합니다.
4. ChatMemory가 업데이트된 이력(새로운 사용자 메시지와 어시스턴트 응답 포함)을 자동으로 저장합니다.

## 세션 예시

```
You: My name is Alice.
Assistant: Nice to meet you, Alice! How can I help you today?

You: What's my favorite color? It's blue.
Assistant: Got it — your favorite color is blue!

You: What's my name?
Assistant: Your name is Alice!
```

에이전트는 세 번째 메시지를 처리하기 전에 ChatMemory가 이전 대화 내용들을 로드했기 때문에 "Your name is Alice!"라고 정확하게 대답할 수 있습니다.

## 다음 단계

- 대화 이력을 필터링하고 변환하는 [전처리기(preprocessors)](../chat-memory.md#preprocessors)에 대해 알아보세요.
- 영구 저장을 위한 [커스텀 이력 공급자(custom history provider)](../chat-memory.md#custom-history-providers)를 구현해 보세요.
- HTTP를 통해 채팅 세션을 관리하는 [Spring Boot 기반 백엔드 사용 사례](../chat-memory.md#typical-use-case-backend-applications)를 확인해 보세요.
- 장애 복구 시나리오를 위한 [ChatMemory와 Persistence의 차이점](../chat-memory.md#chatmemory-vs-persistence)을 이해해 보세요.
- 전체 기능 레퍼런스는 [Chat Memory](../chat-memory.md)를 탐색해 보세요.