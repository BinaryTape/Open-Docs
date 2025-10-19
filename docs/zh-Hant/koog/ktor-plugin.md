# Ktor 整合：Koog 外掛程式

Koog 自然地融入您的 Ktor 伺服器，讓您能夠使用兩端慣用的 Kotlin API 撰寫伺服器端 AI 應用程式。

安裝 Koog 外掛程式一次，在 application.conf/YAML 或程式碼中配置您的 LLM 提供者，然後直接從您的路由呼叫代理程式。無需再在模組之間連接 LLM 客戶端——您的路由只需請求一個代理程式即可開始運作。

## 總覽

`koog-ktor` 模組為伺服器端代理程式開發提供了慣用的 Kotlin/Ktor 整合：

- 隨插即用的 Ktor 外掛程式：在您的 `Application` 中 `install(Koog)`
- 一流支援 OpenAI、Anthropic、Google、OpenRouter、DeepSeek 和 Ollama
- 透過 YAML/CONF 和/或程式碼進行集中式配置
- 代理程式設定，包含提示、工具、功能；路由的簡易擴充功能
- 直接 LLM 使用（執行、串流執行、審核）
- 僅限 JVM 的模型上下文協定 (MCP) 工具整合

## 新增依賴項

```kotlin
dependencies {
    implementation("ai.koog:koog-ktor:$koogVersion")
}
```

## 快速入門

1) 配置提供者（在 `application.yaml` 或 `application.conf` 中）

在 `koog.<provider>` 下使用巢狀鍵。外掛程式會自動擷取它們。

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

可選：配置當請求的提供者未配置時，由直接 LLM 呼叫所使用的備用。

```yaml
koog:
  llm:
    fallback:
      provider: openai
      # see Model identifiers section below
      model: openai.chat.gpt4_1
```

2) 安裝外掛程式並定義路由

```kotlin
fun Application.module() {
    install(Koog) {
        // 您也可以透過程式設計方式配置提供者（請參閱下文）
    }

    routing {
        route("/ai") {
            post("/chat") {
                val userInput = call.receiveText()
                // 使用特定模型建立並執行預設的單次執行代理程式
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

注意

- `aiAgent` 需要一個具體的模型 (`LLModel`) – 每個路由、每次使用選擇。
- 對於較低階的 LLM 存取，直接使用 `llm()` (`PromptExecutor`)。

## 從路由直接使用 LLM

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

    // 將所有助手訊息連接成單一字串
    val text = messages.joinToString(separator = "") { it.content }
    call.respond(HttpStatusCode.OK, text)
}
```

串流

```kotlin
get("/stream") {
    val flow = llm().executeStreaming(
        prompt("streaming") { user("Stream this response, please") },
        OpenRouterModels.GPT4o
    )

    // 範例：緩衝並作為一個區塊傳送
    val sb = StringBuilder()
    flow.collect { chunk -> sb.append(chunk) }
    call.respondText(sb.toString())
}
```

審核

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

## 程式設計配置（在程式碼中）

所有提供者和代理程式行為都可以透過 `install(Koog) {}` 進行配置。

```kotlin
install(Koog) {
    llm {
        openAI(apiKey = System.getenv("OPENAI_API_KEY") ?: "") {
            baseUrl = "https://api.openai.com"
            timeouts { // 如下所示的預設值
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

        // 可選的備用，由 PromptExecutor 在提供者未配置時使用
        fallback {
            provider = LLMProvider.OpenAI
            model = OpenAIModels.Chat.GPT4_1
        }
    }

    agentConfig {
        // 為您的代理程式提供一個可重複使用的基礎提示
        prompt(name = "agent") {
            system("You are a helpful server‑side agent")
        }

        // 限制失控的工具/迴圈
        maxAgentIterations = 10

        // 註冊代理程式預設可用的工具
        registerTools {
            // tool(::yourTool) // 有關詳細資訊請參閱工具總覽
        }

        // 安裝代理程式功能（追蹤等）
        // install(OpenTelemetry) { /* ... */ }
    }
}
```

## 配置中的模型識別碼（備用）

在 YAML/CONF 中配置 `llm.fallback` 時，請使用以下識別碼格式：
- OpenAI: openai.chat.gpt4_1, openai.reasoning.o3, openai.costoptimized.gpt4_1mini, openai.audio.gpt4oaudio, openai.moderation.omni
- Anthropic: anthropic.sonnet_3_7, anthropic.opus_4, anthropic.haiku_3_5
- Google: google.gemini2_5pro, google.gemini2_0flash001
- OpenRouter: openrouter.gpt4o, openrouter.gpt4, openrouter.claude3sonnet
- DeepSeek: deepseek.deepseek-chat, deepseek.deepseek-reasoner
- Ollama: ollama.meta.llama3.2, ollama.alibaba.qwq:32b, ollama.groq.llama3-grok-tool-use:8b

注意

- 對於 OpenAI，您必須包含類別 (chat, reasoning, costoptimized, audio, embeddings, moderation)。
- 對於 Ollama，`ollama.model` 和 `ollama.<maker>.<model>` 都受支援。

## MCP 工具（僅限 JVM）

在 JVM 上，您可以將 MCP 伺服器中的工具新增到您的代理程式工具註冊表中：

```kotlin
install(Koog) {
    agentConfig {
        mcp {
            // 透過 SSE 註冊
            sse("https://your-mcp-server.com/sse")

            // 或透過衍生的程序（stdio 傳輸）註冊
            // process(Runtime.getRuntime().exec("your-mcp-binary ..."))

            // 或從現有的 MCP 客戶端實例註冊
            // client(existingMcpClient)
        }
    }
}
```
## 為何選擇 Koog + Ktor？

- Kotlin 優先、型別安全的伺服器代理程式開發
- 集中式配置，具備清晰、可測試的路由程式碼
- 每個路由使用正確的模型，或自動備用以進行直接 LLM 呼叫
- 生產環境就緒的功能：工具、審核、串流和追蹤