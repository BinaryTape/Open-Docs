# Ktor 集成：Koog 插件

Koog 自然地融入你的 Ktor 服务器，使你能够使用惯用的 Kotlin API 从两端编写服务器端 AI 应用程序。

只需安装一次 Koog 插件，在 `application.conf`/YAML 或代码中配置你的 LLM 提供商，然后就可以直接从你的路由中调用智能体。无需再在模块间布线 LLM 客户端——你的路由只需请求一个智能体即可开始工作。

## 概述

`koog-ktor` 模块为服务器端智能体开发提供惯用的 Kotlin/Ktor 集成：

- 即插即用的 Ktor 插件：在你的 Application 中 `install(Koog)`
- 对 OpenAI、Anthropic、Google、OpenRouter、DeepSeek 和 Ollama 的一流支持
- 通过 YAML/CONF 和/或代码进行的集中式配置
- 智能体设置，包括 Prompt、工具、特性；为路由提供简单的扩展函数
- 直接使用 LLM（execute、executeStreaming、moderate）
- 仅限 JVM 的 Model Context Protocol (MCP) 工具集成

## 添加依赖项

```kotlin
dependencies {
    implementation("ai.koog:koog-ktor:$koogVersion")
}
```

## 快速开始

1) 配置提供商（在 `application.yaml` 或 `application.conf` 中）

使用 `koog.<provider>` 下的嵌套键。插件会自动识别它们。

```yaml
# application.yaml (Ktor 配置)
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
  # 当任何 koog.ollama.* 键存在时，Ollama 都会启用
  ollama:
    enable: true
    baseUrl: http://localhost:11434
```

可选：当请求的提供商未配置时，可配置直接 LLM 调用使用的回退。

```yaml
koog:
  llm:
    fallback:
      provider: openai
      # 详见下文“模型标识符”一节
      model: openai.chat.gpt4_1
```

2) 安装插件并定义路由

```kotlin
fun Application.module() {
    install(Koog) {
        // 你也可以通过代码编程配置提供商（详见下文）
    }

    routing {
        route("/ai") {
            post("/chat") {
                val userInput = call.receiveText()
                // 使用特定模型创建并运行一个默认的单次运行智能体
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

- aiAgent 需要一个具体的模型 (LLMModel)——根据每个路由、每次使用进行选择。
- 对于更底层的 LLM 访问，请直接使用 llm() (PromptExecutor)。

## 从路由直接使用 LLM

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

    // 将所有助手消息连接成一个字符串
    val text = messages.joinToString(separator = "") { it.content }
    call.respond(HttpStatusCode.OK, text)
}
```

流式传输

```kotlin
get("/stream") {
    val flow = llm().executeStreaming(
        prompt("streaming") { user("Stream this response, please") },
        OpenRouterModels.GPT4o
    )

    // 示例：缓冲并作为一个数据块发送
    val sb = StringBuilder()
    flow.collect { chunk -> sb.append(chunk) }
    call.respondText(sb.toString())
}
```

内容审核

```kotlin
post("/moderated-chat") {
    val userInput = call.receiveText()

    val moderation = llm().moderate(
        prompt("moderation") { user(userInput) },
        OpenAIModels.Moderation.Omni
    )

    if (moderation.isHarmful) {
        call.respond(HttpStatusCode.BadRequest, "检测到有害内容")
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

## 编程配置（在代码中）

所有提供商和智能体行为都可以通过 install(Koog) {} 来配置。

```kotlin
install(Koog) {
    llm {
        openAI(apiKey = System.getenv("OPENAI_API_KEY") ?: "") {
            baseUrl = "https://api.openai.com"
            timeouts { // 下面显示了默认值
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

        // 可选的回退 (fallback)，当提供商未配置时由 PromptExecutor 使用
        fallback {
            provider = LLMProvider.OpenAI
            model = OpenAIModels.Chat.GPT4_1
        }
    }

    agentConfig {
        // 为你的智能体提供一个可重用的基础 Prompt
        prompt(name = "agent") {
            system("You are a helpful server‑side agent")
        }

        // 限制失控的工具/循环
        maxAgentIterations = 10

        // 注册智能体默认可用的工具
        registerTools {
            // tool(::yourTool) // 详见“工具概述”以了解详情
        }

        // 安装智能体特性（例如追踪等）
        // install(OpenTelemetry) { /* ... */ }
    }
}
```

## 配置中的模型标识符（回退）

在 YAML/CONF 中配置 llm.fallback 时，请使用这些标识符格式：

- OpenAI: openai.chat.gpt4_1, openai.reasoning.o3, openai.costoptimized.gpt4_1mini, openai.audio.gpt4oaudio, openai.moderation.omni
- Anthropic: anthropic.sonnet_3_7, anthropic.opus_4, anthropic.haiku_3_5
- Google: google.gemini2_5pro, google.gemini2_0flash001
- OpenRouter: openrouter.gpt4o, openrouter.gpt4, openrouter.claude3sonnet
- DeepSeek: deepseek.deepseek-chat, deepseek.deepseek-reasoner
- Ollama: ollama.meta.llama3.2, ollama.alibaba.qwq:32b, ollama.groq.llama3-grok-tool-use:8b

注意

- 对于 OpenAI，你必须包含类别（chat、reasoning、costoptimized、audio、embeddings、moderation）。
- 对于 Ollama，`ollama.model` 和 `ollama.<maker>.<model>` 都受支持。

## MCP 工具（仅限 JVM）

在 JVM 上，你可以将 MCP 服务器中的工具添加到你的智能体工具注册表：

```kotlin
install(Koog) {
    agentConfig {
        mcp {
            // 通过 SSE 注册
            sse("https://your-mcp-server.com/sse")

            // 或者通过派生进程（stdio 传输）注册
            // process(Runtime.getRuntime().exec("your-mcp-binary ..."))

            // 或者从现有 MCP 客户端实例注册
            // client(existingMcpClient)
        }
    }
}
```
## 为什么选择 Koog + Ktor？

- 服务器中智能体的 Kotlin 优先、类型安全开发
- 集中式配置，路由代码整洁、可测试
- 为每个路由使用正确的模型，或在直接 LLM 调用时自动回退
- 生产就绪的特性：工具、内容审核、流式传输和追踪