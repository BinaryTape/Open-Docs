# Spring Boot 통합

Koog는 자동 구성 스타터(auto-configuration starter)를 통해 원활한 Spring Boot 통합을 제공하므로, 최소한의 설정으로 AI 에이전트를 Spring Boot 애플리케이션에 쉽게 통합할 수 있습니다.

## 개요

`koog-spring-boot-starter`는 애플리케이션 속성(application properties)을 기반으로 LLM 클라이언트를 자동으로 구성하고, 의존성 주입(dependency injection)을 위한 바로 사용할 수 있는 빈(bean)을 제공합니다. OpenAI, Anthropic, Google, OpenRouter, DeepSeek, Ollama를 포함한 모든 주요 LLM 제공업체를 지원합니다.

## 시작하기

### 1. 의존성 추가

`build.gradle.kts`에 Spring Boot 스타터를 추가합니다:

```kotlin
dependencies {
    implementation("ai.koog:koog-spring-boot-starter:$koogVersion")
}
```

### 2. 제공업체 구성

`application.properties`에 선호하는 LLM 제공업체를 구성합니다:

```properties
# OpenAI Configuration
ai.koog.openai.api-key=${OPENAI_API_KEY}
ai.koog.openai.base-url=https://api.openai.com
# Anthropic Configuration  
ai.koog.anthropic.api-key=${ANTHROPIC_API_KEY}
ai.koog.anthropic.base-url=https://api.anthropic.com
# Google Configuration
ai.koog.google.api-key=${GOOGLE_API_KEY}
ai.koog.google.base-url=https://generativelanguage.googleapis.com
# OpenRouter Configuration
ai.koog.openrouter.api-key=${OPENROUTER_API_KEY}
ai.koog.openrouter.base-url=https://openrouter.ai
# DeepSeek Configuration
ai.koog.deepseek.api-key=${DEEPSEEK_API_KEY}
ai.koog.deepseek.base-url=https://api.deepseek.com
# Ollama Configuration (local - no API key required)
ai.koog.ollama.base-url=http://localhost:11434
```

또는 YAML 형식(`application.yml`)으로:

```yaml
ai:
    koog:
        openai:
            api-key: ${OPENAI_API_KEY}
            base-url: https://api.openai.com
        anthropic:
            api-key: ${ANTHROPIC_API_KEY}
            base-url: https://api.anthropic.com
        google:
            api-key: ${GOOGLE_API_KEY}
            base-url: https://generativelanguage.googleapis.com
        openrouter:
            api-key: ${OPENROUTER_API_KEY}
            base-url: https://openrouter.ai
        deepseek:
            api-key: ${DEEPSEEK_API_KEY}
            base-url: https://api.deepseek.com
        ollama:
            base-url: http://localhost:11434
```

!!! tip "환경 변수"
API 키를 안전하게 보관하고 버전 관리에서 제외하려면 환경 변수를 사용하는 것이 좋습니다.

### 3. 주입 및 사용

자동 구성된 실행자를 서비스에 주입하여 사용합니다:

```kotlin
@Service
class AIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
    private val anthropicExecutor: SingleLLMPromptExecutor?
) {

    suspend fun generateResponse(input: String): String {
        val prompt = prompt {
            system("You are a helpful AI assistant")
            user(input)
        }

        return when {
            openAIExecutor != null -> {
                val result = openAIExecutor.execute(prompt)
                result.text
            }
            anthropicExecutor != null -> {
                val result = anthropicExecutor.execute(prompt)
                result.text
            }
            else -> throw IllegalStateException("No LLM provider configured")
        }
    }
}
```

## 고급 사용법

### REST 컨트롤러 예시

자동 구성된 실행자를 사용하여 채팅 엔드포인트를 생성합니다:

```kotlin
@RestController
@RequestMapping("/api/chat")
class ChatController(
    private val anthropicExecutor: SingleLLMPromptExecutor?
) {

    @PostMapping
    suspend fun chat(@RequestBody request: ChatRequest): ResponseEntity<ChatResponse> {
        return if (anthropicExecutor != null) {
            try {
                val prompt = prompt {
                    system("You are a helpful assistant")
                    user(request.message)
                }

                val result = anthropicExecutor.execute(prompt)
                ResponseEntity.ok(ChatResponse(result.text))
            } catch (e: Exception) {
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ChatResponse("Error processing request"))
            }
        } else {
            ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ChatResponse("AI service not configured"))
        }
    }
}

data class ChatRequest(val message: String)
data class ChatResponse(val response: String)
```

### 다중 제공업체 지원

대체(fallback) 로직으로 다중 제공업체를 처리합니다:

```kotlin
@Service
class RobustAIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
    private val anthropicExecutor: SingleLLMPromptExecutor?,
    private val openRouterExecutor: SingleLLMPromptExecutor?
) {

    suspend fun generateWithFallback(input: String): String {
        val prompt = prompt {
            system("You are a helpful AI assistant")
            user(input)
        }

        val executors = listOfNotNull(openAIExecutor, anthropicExecutor, openRouterExecutor)

        for (executor in executors) {
            try {
                val result = executor.execute(prompt)
                return result.text
            } catch (e: Exception) {
                logger.warn("Executor failed, trying next: ${e.message}")
                continue
            }
        }

        throw IllegalStateException("All AI providers failed")
    }

    companion object {
        private val logger = LoggerFactory.getLogger(RobustAIService::class.java)
    }
}
```

### 구성 속성

사용자 정의 로직을 위해 구성 속성(configuration properties)을 주입할 수도 있습니다:

```kotlin
@Service
class ConfigurableAIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
    @Value("\${ai.koog.openai.api-key:}") private val openAIKey: String
) {

    fun isOpenAIConfigured(): Boolean = openAIKey.isNotBlank() && openAIExecutor != null

    suspend fun processIfConfigured(input: String): String? {
        return if (isOpenAIConfigured()) {
            val result = openAIExecutor!!.execute(prompt { user(input) })
            result.text
        } else {
            null
        }
    }
}
```

## 구성 참조

### 사용 가능한 속성

| 속성                            | 설명          | 빈 조건                                                         | 기본값                                     |
|-------------------------------|---------------|-----------------------------------------------------------------|--------------------------------------------|
| `ai.koog.openai.api-key`      | OpenAI API 키 | `openAIExecutor` 빈에 필요함                                    | -                                          |
| `ai.koog.openai.base-url`     | OpenAI 기본 URL | 선택 사항                                                       | `https://api.openai.com`                   |
| `ai.koog.anthropic.api-key`   | Anthropic API 키 | `anthropicExecutor` 빈에 필요함                                 | -                                          |
| `ai.koog.anthropic.base-url`  | Anthropic 기본 URL | 선택 사항                                                       | `https://api.anthropic.com`                |
| `ai.koog.google.api-key`      | Google API 키 | `googleExecutor` 빈에 필요함                                    | -                                          |
| `ai.koog.google.base-url`     | Google 기본 URL | 선택 사항                                                       | `https://generativelanguage.googleapis.com` |
| `ai.koog.openrouter.api-key`  | OpenRouter API 키 | `openRouterExecutor` 빈에 필요함                                | -                                          |
| `ai.koog.openrouter.base-url` | OpenRouter 기본 URL | 선택 사항                                                       | `https://openrouter.ai`                    |
| `ai.koog.deepseek.api-key`    | DeepSeek API 키 | `deepSeekExecutor` 빈에 필요함                                  | -                                          |
| `ai.koog.deepseek.base-url`   | DeepSeek 기본 URL | 선택 사항                                                       | `https://api.deepseek.com`                 |
| `ai.koog.ollama.base-url`     | Ollama 기본 URL | `ai.koog.ollama.*` 속성이 있으면 `ollamaExecutor` 빈 활성화 | `http://localhost:11434`                   |

### 빈 이름

자동 구성은 (구성된 경우) 다음 빈을 생성합니다:

- `openAIExecutor` - OpenAI 실행자 (`ai.koog.openai.api-key` 필요)
- `anthropicExecutor` - Anthropic 실행자 (`ai.koog.anthropic.api-key` 필요)
- `googleExecutor` - Google 실행자 (`ai.koog.google.api-key` 필요)
- `openRouterExecutor` - OpenRouter 실행자 (`ai.koog.openrouter.api-key` 필요)
- `deepSeekExecutor` - DeepSeek 실행자 (`ai.koog.deepseek.api-key` 필요)
- `ollamaExecutor` - Ollama 실행자 (모든 `ai.koog.ollama.*` 속성 필요)

## 문제 해결

### 일반적인 문제

**빈을 찾을 수 없음 오류 (Bean not found error):**

```
No qualifying bean of type 'SingleLLMPromptExecutor' available
```

**해결책:** 속성 파일에 하나 이상의 제공업체를 구성했는지 확인하세요.

**다중 빈 오류 (Multiple beans error):**

```
Multiple qualifying beans of type 'SingleLLMPromptExecutor' available
```

**해결책:** `@Qualifier`를 사용하여 원하는 빈을 지정하세요:

```kotlin
@Service
class MyService(
    @Qualifier("openAIExecutor") private val openAIExecutor: SingleLLMPromptExecutor,
    @Qualifier("anthropicExecutor") private val anthropicExecutor: SingleLLMPromptExecutor
) {
    // ...
}
```

**API 키가 로드되지 않음 (API key not loaded):**

```
API key is required but not provided
```

**해결책:** 환경 변수가 제대로 설정되어 있고 Spring Boot 애플리케이션에서 접근 가능한지 확인하세요.

## 모범 사례

1.  **환경 변수**: API 키에 대해 항상 환경 변수를 사용하세요
2.  **널러블 주입**: 널러블 타입(`SingleLLMPromptExecutor?`)을 사용하여 제공업체가 구성되지 않은 경우를 처리하세요
3.  **대체 로직**: 다중 제공업체를 사용할 때 대체(fallback) 메커니즘을 구현하세요
4.  **오류 처리**: 프로덕션 코드에서는 항상 실행자 호출을 try-catch 블록으로 감싸세요
5.  **테스트**: 실제 API 호출을 피하기 위해 테스트에서 모의 객체(mock)를 사용하세요
6.  **구성 유효성 검사**: 사용하기 전에 실행자가 사용 가능한지 확인하세요

## 다음 단계

-   기본 AI 워크플로를 구축하려면 [단일 실행 에이전트(Single Run Agents)](single-run-agents.md)에 대해 알아보세요.
-   고급 사용 사례를 위해 [복합 워크플로 에이전트(Complex Workflow Agents)](complex-workflow-agents.md)를 탐색하세요.
-   에이전트의 기능을 확장하려면 [도구 개요(Tools Overview)](tools-overview.md)를 참조하세요.
-   실제 구현 예시는 [예제(Examples)](examples.md)를 확인하세요.
-   프레임워크를 더 잘 이해하려면 [핵심 개념(Key Concepts)](key-concepts.md)을 읽어보세요.