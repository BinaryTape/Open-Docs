# Ktor 통합: Koog 플러그인

Koog는 Ktor 서버에 자연스럽게 통합되어 양쪽에서 관용적인 Kotlin API를 사용하여 서버 측 AI 애플리케이션을 작성할 수 있게 합니다.

Koog 플러그인을 한 번 설치하고, `application.conf` 또는 `application.yaml` 파일이나 코드에서 LLM 공급자를 구성한 다음, 라우트에서 직접 에이전트를 호출할 수 있습니다. 더 이상 모듈 간에 LLM 클라이언트를 연결할 필요 없이, 라우트에서 에이전트를 요청하기만 하면 준비 완료입니다.

## 개요

`koog-ktor` 모듈은 서버 측 에이전트 개발을 위한 관용적인 Kotlin/Ktor 통합 기능을 제공합니다:

- 드롭인 Ktor 플러그인: `Application`에서 `install(Koog)`
- OpenAI, Anthropic, Google, OpenRouter, DeepSeek 및 Ollama에 대한 일급 지원
- YAML/CONF 및/또는 코드를 통한 중앙 집중식 구성
- 프롬프트, 도구, 기능으로 에이전트 설정; 라우트를 위한 간단한 확장 함수
- 직접 LLM 사용 (`execute`, `executeStreaming`, `moderate`)
- JVM 전용 Model Context Protocol (MCP) 도구 통합

## 의존성 추가

```kotlin
dependencies {
    implementation("ai.koog:koog-ktor:$koogVersion")
}
```

## 빠른 시작

1) 공급자 구성 (`application.yaml` 또는 `application.conf` 파일에서)

`koog.<provider>` 아래에 중첩된 키를 사용하세요. 플러그인이 자동으로 이를 감지합니다.

```yaml
# application.yaml (Ktor config)
koog:
  openai:
    apikey: ${OPENAI_API_KEY}
    baseUrl: https://api.openai.com
  anthropic:
    apikey: ${ANTHROPIC_API_KEY}
    baseUrl: https://api.anthropic.com
  google:
    apikey: ${GOOGLE_API_KEY}
    baseUrl: https://generativelanguage.googleapis.com
  openrouter:
    apikey: ${OPENROUTER_API_KEY}
    baseUrl: https://openrouter.ai
  deepseek:
    apikey: ${DEEPSEEK_API_KEY}
    baseUrl: https://api.deepseek.com
  # Ollama is enabled when any koog.ollama.* key exists
  ollama:
    enable: true
    baseUrl: http://localhost:11434
```

선택 사항: 요청된 공급자가 구성되지 않았을 때 직접 LLM 호출에서 사용되는 폴백(fallback)을 구성합니다.

```yaml
koog:
  llm:
    fallback:
      provider: openai
      # see Model identifiers section below
      model: openai.chat.gpt4_1
```

2) 플러그인 설치 및 라우트 정의

```kotlin
fun Application.module() {
    install(Koog) {
        // You can also configure providers programmatically (see below)
    }

    routing {
        route("/ai") {
            post("/chat") {
                val userInput = call.receiveText()
                // Create and run a default single‑run agent using a specific model
                val output = aiAgent(
                    strategy = reActStrategy(),
                    model = OpenAIModels.Chat.GPT4_1,
                    input = userInput
                )
                call.respond(HttpStatusCode.OK, output)
            }
        }
    }
}
```

참고

- `aiAgent`는 구체적인 모델(`LLModel`)을 필요로 합니다. 라우트별, 사용별로 선택하세요.
- 하위 레벨 LLM 접근을 위해서는 `llm() (PromptExecutor)`를 직접 사용하세요.

## 라우트에서 직접 LLM 사용

```kotlin
post("/llm-chat") {
    val userInput = call.receiveText()

    val messages = llm().execute(
        prompt("chat") {
            system("You are a helpful assistant that clarifies questions")
            user(userInput)
        },
        GoogleModels.Gemini2_5Pro
    )

    // Join all assistant messages into a single string
    val text = messages.joinToString(separator = "") { it.content }
    call.respond(HttpStatusCode.OK, text)
}
```

스트리밍

```kotlin
get("/stream") {
    val flow = llm().executeStreaming(
        prompt("streaming") { user("Stream this response, please") },
        OpenRouterModels.GPT4o
    )

    // Example: buffer and send as one chunk
    val sb = StringBuilder()
    flow.collect { chunk -> sb.append(chunk) }
    call.respondText(sb.toString())
}
```

중재 (Moderation)

```kotlin
post("/moderated-chat") {
    val userInput = call.receiveText()

    val moderation = llm().moderate(
        prompt("moderation") { user(userInput) },
        OpenAIModels.Moderation.Omni
    )

    if (moderation.isHarmful) {
        call.respond(HttpStatusCode.BadRequest, "Harmful content detected")
        return@post
    }

    val output = aiAgent(
        strategy = reActStrategy(),
        model = OpenAIModels.Chat.GPT4_1,
        input = userInput
    )
    call.respond(HttpStatusCode.OK, output)
}
```

## 프로그래밍 방식 구성 (코드 내)

모든 공급자 및 에이전트 동작은 `install(Koog) {}`를 통해 구성할 수 있습니다.

```kotlin
install(Koog) {
    llm {
        openAI(apiKey = System.getenv("OPENAI_API_KEY") ?: "") {
            baseUrl = "https://api.openai.com"
            timeouts { // Default values shown below
                requestTimeout = 15.minutes
                connectTimeout = 60.seconds
                socketTimeout = 15.minutes
            }
        }
        anthropic(apiKey = System.getenv("ANTHROPIC_API_KEY") ?: "")
        google(apiKey = System.getenv("GOOGLE_API_KEY") ?: "")
        openRouter(apiKey = System.getenv("OPENROUTER_API_KEY") ?: "")
        deepSeek(apiKey = System.getenv("DEEPSEEK_API_KEY") ?: "")
        ollama { baseUrl = "http://localhost:11434" }

        // Optional fallback used by PromptExecutor when a provider isn’t configured
        fallback {
            provider = LLMProvider.OpenAI
            model = OpenAIModels.Chat.GPT4_1
        }
    }

    agentConfig {
        // Provide a reusable base prompt for your agents
        prompt(name = "agent") {
            system("You are a helpful server‑side agent")
        }

        // Limit runaway tools/loops
        maxAgentIterations = 10

        // Register tools available to agents by default
        registerTools {
            // tool(::yourTool) // see Tools Overview for details
        }

        // Install agent features (tracing, etc.)
        // install(OpenTelemetry) { /* ... */ }
    }
}
```

## 구성 (폴백) 내 모델 식별자

YAML/CONF에서 `llm.fallback`을 구성할 때는 다음 식별자 형식을 사용하세요.

- OpenAI: `openai.chat.gpt4_1`, `openai.reasoning.o3`, `openai.costoptimized.gpt4_1mini`, `openai.audio.gpt4oaudio`, `openai.moderation.omni`
- Anthropic: `anthropic.sonnet_3_7`, `anthropic.opus_4`, `anthropic.haiku_3_5`
- Google: `google.gemini2_5pro`, `google.gemini2_0flash001`
- OpenRouter: `openrouter.gpt4o`, `openrouter.gpt4`, `openrouter.claude3sonnet`
- DeepSeek: `deepseek.deepseek-chat`, `deepseek.deepseek-reasoner`
- Ollama: `ollama.meta.llama3.2`, `ollama.alibaba.qwq:32b`, `ollama.groq.llama3-grok-tool-use:8b`

참고

- OpenAI의 경우 카테고리(`chat`, `reasoning`, `costoptimized`, `audio`, `embeddings`, `moderation`)를 반드시 포함해야 합니다.
- Ollama의 경우, `ollama.model` 및 `ollama.<maker>.<model>` 모두 지원됩니다.

## MCP 도구 (JVM 전용)

JVM에서는 MCP 서버의 도구를 에이전트 도구 레지스트리에 추가할 수 있습니다:

```kotlin
install(Koog) {
    agentConfig {
        mcp {
            // Register via SSE
            sse("https://your-mcp-server.com/sse")

            // Or register via spawned process (stdio transport)
            // process(Runtime.getRuntime().exec("your-mcp-binary ..."))

            // Or from an existing MCP client instance
            // client(existingMcpClient)
        }
    }
}
```
## Koog + Ktor를 사용하는 이유?

- Kotlin 우선의, 타입 세이프(type-safe)한 서버 내 에이전트 개발
- 깔끔하고 테스트 가능한 라우트 코드와 중앙 집중식 구성
- 라우트별로 적절한 모델을 사용하거나, 직접 LLM 호출 시 자동으로 폴백 사용
- 프로덕션 준비 완료 기능: 도구, 중재(moderation), 스트리밍 및 추적(tracing)