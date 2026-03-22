# Spring AI 集成

Koog 提供了 Spring AI 集成 Starter，将 Spring AI 的模型抽象与 Koog 代理框架连接起来。
如果您已经使用 Spring AI 进行模型访问，这些 Starter 允许您在现有 Spring AI 配置之上接入 Koog 的代理编排（agent orchestration）——
而无需替换现有的 Spring AI 配置。

## 与 `koog-spring-boot-starter` 的区别

| | `koog-spring-boot-starter` | `koog-spring-ai` Starters |
|---|---|---|
| **LLM 传输** | Koog 自有的 HTTP 客户端（每个提供商一个：OpenAI、Anthropic、Google 等） | 委托给 Spring AI 的 `ChatModel` / `EmbeddingModel` —— 自动支持 Spring AI 支持的任何提供商 |
| **配置** | 每个提供商的 `ai.koog.*` 属性 | 由 Spring AI Starter 管理的标准 `spring.ai.*` 属性 |
| **适用场景** | 您希望 Koog 直接管理 LLM 连接 | 您已经使用 Spring AI 进行模型访问，并希望在其之上接入 Koog 的代理编排 |

这两种方法是相互独立的 —— 请根据您偏好的 LLM 连接管理方式选择其中之一。
有关直接使用 Koog Starter 的方法，请参阅 [Spring Boot 集成](spring-boot.md)。

## 可用 Starter

| 模块 | 用途 |
|---|---|
| `koog-spring-ai-starter-model-chat` | 将 Spring AI 的 `ChatModel`（可选 `ModerationModel`）适配为 Koog 的 `LLMClient` 和 `PromptExecutor` |
| `koog-spring-ai-starter-model-embedding` | 将 Spring AI 的 `EmbeddingModel` 适配为 Koog 的 `LLMEmbeddingProvider` |

每个 Starter 都是一个完全独立的 Spring Boot Starter，拥有自己的自动配置、配置属性和调度器管理。

## 聊天模型 Starter

### 概览

`koog-spring-ai-starter-model-chat` Starter 将 Spring AI 的聊天模型抽象与 Koog 代理框架连接起来。
它会自动配置：

- 一个委托给 Spring AI `ChatModel` 的 Koog `LLMClient` (`SpringAiLLMClient`)
- 一个由所有可用 `LLMClient` Bean 组装而成的 `PromptExecutor` (`MultiLLMPromptExecutor`)

工具始终由 Koog 代理框架执行 —— Spring AI 仅接收工具定义/架构（schema）。在所有携带工具的请求中，`internalToolExecutionEnabled` 标志都被设置为 `false`。

### 添加依赖项

在添加任何 Spring AI 模型 Starter（例如 Google）的同时添加以下依赖项：

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

请确保您的项目包含：

- Spring Boot 3（需要 Java 17 或更高版本）
- 2.3.10+ 版本的 Kotlin 库 (kotlin-stdlib)
- 您选择的提供商对应的 Spring AI 模型 Starter

### 支持的提供商
Anthropic, Azure OpenAI, Bedrock Converse, Deepseek, Google GenAI, HuggingFace, MiniMax, Mistral AI, OCI GenAI, Ollama, OpenAI, Vertex AI, ZhiPu AI

### 配置

根据需要修改您的 Spring Boot 属性：

```properties
# 填入您的 Gemini Developer API 密钥，或通过环境变量传递
spring.ai.google.genai.api-key=YOUR_GOOGLE_API_KEY
# 默认值
spring.ai.model.chat=google-genai
koog.spring.ai.chat.enabled=true
koog.spring.ai.chat.dispatcher.type=AUTO
```

如果您只有一个 `ChatModel` Bean，一切都会自动工作 —— 适配器会将其包装到 Koog `LLMClient` 中，并创建一个开箱即用的 `PromptExecutor`。

### 使用示例

注入 `PromptExecutor` 并使用它运行 Koog 代理：

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

或者提供您自己的 `PromptExecutor` Bean 来完全覆盖自动配置的 Bean。

### 配置属性 (`koog.spring.ai.chat`)

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `enabled` | `Boolean` | `true` | 启用/禁用聊天自动配置 |
| `chat-model-bean-name` | `String?` | `null` | 要使用的 `ChatModel` 的 Bean 名称（用于多模型上下文） |
| `moderation-model-bean-name` | `String?` | `null` | 要使用的 `ModerationModel` 的 Bean 名称（用于多模型上下文） |
| `provider` | `String?` | `null` | LLM 提供商 ID（例如 `openai`、`anthropic`、`google`）。设置后，将覆盖从 `ChatModel` 类名进行的自动检测。如果自动检测失败，则回退到 `spring-ai`。 |
| `dispatcher.type` | `AUTO` / `IO` | `AUTO` | 用于阻塞模型调用的调度器 |
| `dispatcher.parallelism` | `Int` | `0` (= 无限制) | `IO` 调度器的最大并发数（0 = 无限制） |

### 调度器类型

- **`AUTO`**（默认）：如果可用，则使用 Spring 管理的 `AsyncTaskExecutor`（例如，当 Spring Boot 3.2+ 中 `spring.threads.virtual.enabled=true` 时），否则回退到 `Dispatchers.IO`。这让您可以通过一个标准的 Spring Boot 属性来选用虚拟线程。
- **`IO`**：始终使用 `Dispatchers.IO`。当 `dispatcher.parallelism` 大于 0 时，使用 `Dispatchers.IO.limitedParallelism(parallelism)` 来限制并发。

### 多模型上下文

当注册了多个 `ChatModel` 或 `ModerationModel` Bean 时，请指定要使用的 Bean：

```properties
koog.spring.ai.chat.chat-model-bean-name=openAiChatModel
koog.spring.ai.chat.moderation-model-bean-name=openAiModerationModel
```

如果没有选择器，自动配置仅在存在单个候选对象时才会激活。

### 扩展点

- **`ChatOptionsCustomizer`**：注册一个实现此函数式接口的 Spring Bean，以应用特定于提供商的 `ChatOptions` 调整：

=== "Kotlin"

    ```kotlin
    @Bean
    fun chatOptionsCustomizer() = ChatOptionsCustomizer { options, params, model ->
        // 根据模型或请求参数应用自定义选项
        options
    }
    ```

=== "Java"

    ```java
    @Bean
    public ChatOptionsCustomizer chatOptionsCustomizer() {
        return (options, params, model) -> {
            // 根据模型或请求参数应用自定义选项
            return options;
        };
    }
    ```

  自动配置会通过可选注入自动获取它。

- **自定义 `LLMClient`**：注册您自己的 `LLMClient` Bean 以完全覆盖自动配置的适配器。
- **自定义 `PromptExecutor`**：注册您自己的 `PromptExecutor` Bean 以覆盖自动配置的 `MultiLLMPromptExecutor`。

## 后续步骤

- 了解 [基础代理](agents/basic-agents.md) 以构建最小化 AI 工作流
- 探索用于高级用例的 [基于图的代理](agents/graph-based-agents.md)
- 查看 [工具概览](tools-overview.md) 以扩展代理的能力
- 查看 [示例](examples.md) 以了解真实世界的实现
- 阅读 [Spring Boot 集成](spring-boot.md) 指南以了解直接使用 Koog Starter 的方法