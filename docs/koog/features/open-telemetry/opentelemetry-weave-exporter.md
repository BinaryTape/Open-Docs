# W&B Weave 导出器

Koog 内置支持将智能体跟踪导出到 [W&B Weave](https://wandb.ai/site/weave/)，这是 Weights & Biases 推出的一款用于 AI 应用程序可观测性和分析的开发者工具。
通过 Weave 集成，您可以捕获提示词、补全、系统上下文和执行跟踪，并直接在 W&B 工作区中对它们进行可视化处理。

有关 Koog 的 OpenTelemetry 支持的背景信息，请参阅 [OpenTelemetry 支持](https://docs.koog.ai/opentelemetry-support/)。

---

## 设置说明

1. 在 [https://wandb.ai](https://wandb.ai) 注册一个 W&B 帐号。
2. 从 [https://wandb.ai/authorize](https://wandb.ai/authorize) 获取您的 API 密钥。
3. 通过访问 [https://wandb.ai/home](https://wandb.ai/home) 上的 W&B 仪表板来查找您的实体名称。
   如果是个人帐户，实体通常是您的用户名，或者是您的团队/组织名称。
4. 为您的项目定义一个名称。您不必提前创建项目，当第一条跟踪发送时，项目将自动创建。
5. 将 Weave 实体、项目名称和 API 密钥传递给 Weave 导出器。
   这可以通过将它们作为参数提供给 `addWeaveExporter()` 函数，或通过设置如下所示的环境变量来完成：

```bash
export WEAVE_API_KEY="<your-api-key>"
export WEAVE_ENTITY="<your-entity>"
export WEAVE_PROJECT_NAME="koog-tracing"
```
<!--- KNIT example-weave-exporter-01.txt -->

## 配置

要启用 Weave 导出，请安装 **OpenTelemetry 功能**并添加 `WeaveExporter`。  
该导出器通过 `OtlpHttpSpanExporter` 使用 Weave 的 OpenTelemetry 端点。

### 示例：带有 Weave 跟踪的智能体

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    fun main() = runBlocking {
        val entity = System.getenv()["WEAVE_ENTITY"] 
            ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
        
        val projectName = System.getenv()["WEAVE_PROJECT_NAME"] 
            ?: "koog-tracing"
        
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                addWeaveExporter()
            }
        }
    
        println("Running agent with Weave tracing")
    
        val result = agent.run("Tell me a joke about programming")
        println("Result: $result
See traces on https://wandb.ai/$entity/$projectName/weave/traces")
    }
    ```
    <!--- KNIT example-weave-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.Optional;
    public class exampleWeaveExporterJava01 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var entity = Optional.ofNullable(System.getenv("WEAVE_ENTITY"))
            .filter(env -> !env.isBlank())
            .orElseThrow(() -> new IllegalArgumentException("WEAVE_ENTITY is not set"));

        var projectName = Optional.ofNullable(System.getenv("WEAVE_PROJECT_NAME"))
            .filter(env -> !env.isBlank())
            .orElse("koog-tracing");

        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .systemPrompt("You are a helpful assistant.")
            .install(OpenTelemetry.Feature, config ->
                config.addWeaveExporter(null, entity, projectName)
            )
            .build();

        System.out.println("Running agent with Weave tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces on https://wandb.ai/" + entity + "/" + projectName + "/weave/traces");
    }
    ```
    <!--- KNIT exampleWeaveExporterJava01.java -->

## 跟踪的内容

启用后，Weave 导出器会捕获与 Koog 通用 OpenTelemetry 集成相同的 span，包括：

- **智能体生命周期事件**：智能体启动、停止、错误
- **LLM 交互**：提示词、补全、延迟
- **工具调用**：工具调用的执行跟踪
- **系统上下文**：模型名称、环境、Koog 版本等元数据

出于安全原因，默认会对 OpenTelemetry span 的某些内容进行脱敏处理。
要在 Weave 中显示这些内容，请在 OpenTelemetry 配置中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，并将其 `verbose` 参数设置为 `true`，如下所示：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        addWeaveExporter()
        setVerbose(true)
    }
    ```
    <!--- KNIT example-weave-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleWeaveExporterJava02 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .systemPrompt("You are a helpful assistant.")
                .llmModel(OpenAIModels.Chat.GPT4oMini)
                .
    -->
    <!--- SUFFIX
            .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addWeaveExporter();
        config.setVerbose(true);
    })
    ```
    <!--- KNIT exampleWeaveExporterJava02.java -->

在 W&B Weave 中进行可视化时，跟踪显示如下：
![W&B Weave 跟踪](img/opentelemetry-weave-exporter-light.png#only-light)
![W&B Weave 跟踪](img/opentelemetry-weave-exporter-dark.png#only-dark)

有关更多详细信息，请参阅官方 [Weave OpenTelemetry 文档](https://weave-docs.wandb.ai/guides/tracking/otel/)。

---

## 故障排除

### Weave 中未显示任何跟踪
- 确认您的环境中设置了 `WEAVE_API_KEY`、`WEAVE_ENTITY` 和 `WEAVE_PROJECT_NAME`。
- 确保您的 W&B 帐户具有访问指定实体和项目的权限。

### 身份验证错误
- 检查您的 `WEAVE_API_KEY` 是否有效。
- API 密钥必须具有为所选实体写入跟踪的权限。

### 连接问题
- 确保您的环境具有访问 W&B OpenTelemetry 摄取端点的网络权限。