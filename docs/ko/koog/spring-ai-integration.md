# Spring AI 통합

Koog는 Spring AI의 모델 추상화와 Koog 에이전트 프레임워크를 연결하는 Spring AI 통합 스타터를 제공합니다.
이미 모델 접근을 위해 Spring AI를 사용하고 있다면, 기존 Spring AI 설정을 교체하지 않고도 Koog의 에이전트 오케스트레이션을 그 위에 얹어 사용할 수 있습니다.

## `koog-spring-boot-starter`와의 차이점

| | `koog-spring-boot-starter` | `koog-spring-ai` 스타터 |
|---|---|---|
| **LLM 전송(Transport)** | Koog 자체 HTTP 클라이언트 (OpenAI, Anthropic, Google 등 제공자별로 개별 존재) | Spring AI의 `ChatModel` / `EmbeddingModel`에 위임 — Spring AI가 지원하는 모든 제공자를 자동으로 사용 가능 |
| **설정** | 제공자별 `ai.koog.*` 속성 | Spring AI 스타터에 의해 관리되는 표준 `spring.ai.*` 속성 |
| **사용 시점** | Koog가 LLM 연결을 직접 관리하길 원할 때 | 이미 Spring AI를 모델 접근에 사용 중이며, 그 위에 Koog의 에이전트 오케스트레이션을 추가하고 싶을 때 |

두 방식은 독립적입니다. LLM 연결 관리 선호도에 따라 하나를 선택하세요.
직접적인 Koog 스타터 접근 방식은 [Spring Boot 통합](spring-boot.md)을 참조하세요.

## 사용 가능한 스타터

| 모듈 | 용도 |
|---|---|
| `koog-spring-ai-starter-model-chat` | Spring AI `ChatModel`(선택 사항인 `ModerationModel` 포함)을 Koog `LLMClient` 및 `PromptExecutor`로 변환 |
| `koog-spring-ai-starter-model-embedding` | Spring AI `EmbeddingModel`을 Koog `LLMEmbeddingProvider`로 변환 |

각 스타터는 자체 자동 설정(auto-configuration), 설정 속성 및 디스패처(dispatcher) 관리를 포함하는 완전 독립적인 Spring Boot 스타터입니다.

## Chat Model 스타터

### 개요

`koog-spring-ai-starter-model-chat` 스타터는 Spring AI의 채팅 모델 추상화와 Koog 에이전트 프레임워크를 연결합니다.
다음을 자동으로 설정합니다:

- Spring AI `ChatModel`에 위임하는 Koog `LLMClient` (`SpringAiLLMClient`)
- 사용 가능한 모든 `LLMClient` 빈(bean)들로 조립된 `PromptExecutor` (`MultiLLMPromptExecutor`)

도구(Tools)는 항상 Koog 에이전트 프레임워크에 의해 실행됩니다. Spring AI는 도구 정의 및 스키마(schema)만 전달받습니다. 모든 도구 포함 요청에서 `internalToolExecutionEnabled` 플래그는 `false`로 설정됩니다.

### 의존성 추가

Spring AI 모델 스타터(예: Google용)와 함께 의존성을 추가합니다:

=== "Gradle (Kotlin DSL)"

    ```kotlin
    // build.gradle.kts
    dependencies {
        implementation("ai.koog:koog-agents-jvm:$koogVersion")
        implementation("ai.koog:koog-spring-ai-starter-model-chat:$koogVersion")
        implementation("org.springframework.ai:spring-ai-starter-model-google-genai")
    }
    ```

=== "Maven"

    ```xml
    <dependencies>
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-agents-jvm</artifactId>
            <version>${koog.version}</version>
        </dependency>
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-spring-ai-starter-model-chat</artifactId>
            <version>${koog.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-model-google-genai</artifactId>
        </dependency>
    </dependencies>
    ```

프로젝트가 다음 사항을 충족하는지 확인하세요:

- Spring Boot 3 (Java 17 이상 필요)
- Kotlin 라이브러리 버전 2.3.10+ (kotlin-stdlib)
- 선택한 제공자를 위한 Spring AI 모델 스타터

### 지원되는 제공자
Anthropic, Azure OpenAI, Bedrock Converse, Deepseek, Google GenAI, HuggingFace, MiniMax, Mistral AI, OCI GenAI, Ollama, OpenAI, Vertex AI, ZhiPu AI

### 설정

필요에 따라 Spring Boot 속성을 수정하세요:

```properties
# Gemini Developer API 키를 입력하거나 환경 변수를 통해 전달하세요.
spring.ai.google.genai.api-key=YOUR_GOOGLE_API_KEY
# 기본값들
spring.ai.model.chat=google-genai
koog.spring.ai.chat.enabled=true
koog.spring.ai.chat.dispatcher.type=AUTO
```

단일 `ChatModel` 빈이 있는 경우 모든 것이 자동으로 작동합니다. 어댑터가 이를 Koog `LLMClient`로 감싸고 즉시 사용 가능한 `PromptExecutor`를 생성합니다.

### 사용 예시

`PromptExecutor`를 주입받아 Koog 에이전트를 실행하는 데 사용하세요:

=== "Kotlin"

    ```kotlin
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import ai.koog.prompt.executor.model.PromptExecutor
    import org.springframework.stereotype.Service

    @Service
    class MyAgentService(private val promptExecutor: PromptExecutor) {

        suspend fun askAgent(userMessage: String): String {
            val agent = AIAgent(
                promptExecutor = promptExecutor,
                llmModel = GoogleModels.Gemini2_5Flash,
                systemPrompt = "You are a helpful assistant."
            )

            return agent.run(userMessage)
        }
    }
    ```

=== "Java"

    ```java
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.google.GoogleModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import org.springframework.stereotype.Service;

    @Service
    public class MyAgentService {
        private final PromptExecutor promptExecutor;

        public MyAgentService(PromptExecutor promptExecutor) {
            this.promptExecutor = promptExecutor;
        }

        public String askAgent(String userMessage) {
            var agent = AIAgent.builder()
                    .promptExecutor(promptExecutor)
                    .llmModel(GoogleModels.Gemini2_5Flash)
                    .systemPrompt("You are a helpful assistant.")
                    .build();

            return agent.run(userMessage);
        }
    }
    ```

또는 고유한 `PromptExecutor` 빈을 직접 제공하여 자동 설정된 빈을 완전히 대체할 수 있습니다.

### 설정 속성 (`koog.spring.ai.chat`)

| 속성 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `enabled` | `Boolean` | `true` | 채팅 자동 설정 활성화/비활성화 |
| `chat-model-bean-name` | `String?` | `null` | 사용할 `ChatModel`의 빈 이름 (다중 모델 컨텍스트용) |
| `moderation-model-bean-name` | `String?` | `null` | 사용할 `ModerationModel`의 빈 이름 (다중 모델 컨텍스트용) |
| `provider` | `String?` | `null` | LLM 제공자 ID (예: `openai`, `anthropic`, `google`). 설정 시 `ChatModel` 클래스 이름 기반의 자동 감지보다 우선합니다. 자동 감지 실패 시 `spring-ai`로 기본 설정됩니다. |
| `dispatcher.type` | `AUTO` / `IO` | `AUTO` | 블로킹 모델 호출을 위한 디스패처 |
| `dispatcher.parallelism` | `Int` | `0` (= 제한 없음) | `IO` 디스패처의 최대 동시성 (0 = 제한 없음) |

### 디스패처 타입

- **`AUTO`** (기본값): 가능한 경우 Spring이 관리하는 `AsyncTaskExecutor`를 사용하며(예: Spring Boot 3.2+에서 `spring.threads.virtual.enabled=true`인 경우), 그렇지 않으면 `Dispatchers.IO`로 대체됩니다. 이를 통해 표준 Spring Boot 속성 하나만으로 가상 스레드(virtual threads)를 선택적으로 사용할 수 있습니다.
- **`IO`**: 항상 `Dispatchers.IO`를 사용합니다. `dispatcher.parallelism`이 0보다 큰 경우, `Dispatchers.IO.limitedParallelism(parallelism)`을 사용하여 동시성을 제한합니다.

### 다중 모델 컨텍스트

여러 개의 `ChatModel` 또는 `ModerationModel` 빈이 등록된 경우, 사용할 빈을 지정하세요:

```properties
koog.spring.ai.chat.chat-model-bean-name=openAiChatModel
koog.spring.ai.chat.moderation-model-bean-name=openAiModerationModel
```

선택자가 없으면 자동 설정은 후보가 하나만 존재할 때만 활성화됩니다.

### 확장 포인트

- **`ChatOptionsCustomizer`**: 이 함수형 인터페이스를 구현하는 Spring 빈을 등록하여 제공자별 `ChatOptions` 튜닝을 적용할 수 있습니다:

=== "Kotlin"

    ```kotlin
    @Bean
    fun chatOptionsCustomizer() = ChatOptionsCustomizer { options, params, model ->
        // 모델 또는 요청 파라미터에 따라 커스텀 옵션 적용
        options
    }
    ```

=== "Java"

    ```java
    @Bean
    public ChatOptionsCustomizer chatOptionsCustomizer() {
        return (options, params, model) -> {
            // 모델 또는 요청 파라미터에 따라 커스텀 옵션 적용
            return options;
        };
    }
    ```

  자동 설정 기능이 선택적 주입(optional injection)을 통해 이를 자동으로 감지하여 적용합니다.

- **커스텀 `LLMClient`**: 고유한 `LLMClient` 빈을 등록하여 자동 설정된 어댑터를 완전히 대체할 수 있습니다.
- **커스텀 `PromptExecutor`**: 고유한 `PromptExecutor` 빈을 등록하여 자동 설정된 `MultiLLMPromptExecutor`를 완전히 대체할 수 있습니다.

## 다음 단계

- 최소한의 AI 워크플로우 구축을 위한 [기본 에이전트](agents/basic-agents.md) 알아보기
- 고급 유스케이스를 위한 [그래프 기반 에이전트](agents/graph-based-agents.md) 탐색하기
- 에이전트 기능 확장을 위한 [도구 개요](tools-overview.md) 확인하기
- 실제 구현 사례를 위해 [예제](examples.md) 확인하기
- 직접적인 Koog 스타터 접근 방식을 위해 [Spring Boot 통합](spring-boot.md) 가이드 읽어보기