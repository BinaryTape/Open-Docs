# Langfuse 匯出器

Koog 提供內建支援，可將 agent 追蹤匯出至 [Langfuse](https://langfuse.com/)，這是一個用於 AI 應用程式可觀測性與分析的平台。
透過 Langfuse 整合，您可以視覺化、分析並偵錯您的 Koog agent 如何與 LLM、API 及其他組件互動。

如需 Koog OpenTelemetry 支援的背景資訊，請參閱 [OpenTelemetry 支援](https://docs.koog.ai/opentelemetry-support/)。

---

## 設定說明

1. 建立 Langfuse 專案。請按照 [在 Langfuse 中建立新專案](https://langfuse.com/docs/get-started#create-new-project-in-langfuse) 的設定指南進行操作。
2. 獲取 API 憑據。按照 [Langfuse API 金鑰在哪裡？](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 中的說明，取得您的 Langfuse `public key` 與 `secret key`。
3. 將 Langfuse 主機、私鑰和金鑰傳遞給 Langfuse 匯出器。
   這可以透過將它們作為參數提供給 `addLangfuseExporter()` 函式來完成，或者按照下文所示設定環境變數：

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```
<!--- KNIT example-langfuse-exporter-01.txt -->

## 配置

要啟用 Langfuse 匯出，請安裝 **OpenTelemetry feature** 並新增 `LangfuseExporter`。  
此匯出器在底層使用 `OtlpHttpSpanExporter` 將追蹤發送到 Langfuse 的 OpenTelemetry 端點。

### 範例：帶有 Langfuse 追蹤的 agent

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
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                addLangfuseExporter()
            }
        }
    
        println("Running agent with Langfuse tracing")
    
        val result = agent.run("Tell me a joke about programming")
        println("Result: $result
See traces on the Langfuse instance")
    }
    ```
    <!--- KNIT example-langfuse-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleLangfuseExporterJava01 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .systemPrompt("You are a code assistant. Provide concise code examples.")
            .install(OpenTelemetry.Feature, config ->
                config.addLangfuseExporter()
            )
            .build();

        System.out.println("Running agent with Langfuse tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces on the Langfuse instance");
    }
    ```
    <!--- KNIT exampleLangfuseExporterJava01.java -->

## 追蹤屬性

Langfuse 使用追蹤層級屬性，透過工作階段、環境、標籤及其他元資料等功能來增強可觀測性。
`addLangfuseExporter` 函式支援一個 `traceAttributes` 參數，該參數接受 `CustomAttribute` 物件清單。

這些屬性會被新增到每條追蹤的根 `InvokeAgentSpan` span 中，並啟用 Langfuse 的進階功能。您可以傳遞任何 Langfuse 支援的屬性 - 請參閱 [Langfuse OpenTelemetry 文件中的完整列表](https://langfuse.com/integrations/native/opentelemetry#trace-level-attributes)。

常見屬性：
- **工作階段** (`langfuse.session.id`)：將相關追蹤分組，以便進行聚合指標、成本分析和評分。
- **環境**：將生產環境追蹤與開發和暫存（staging）隔離，以便進行更清晰的分析。
- **標籤** (`langfuse.trace.tags`)：使用功能名稱、實驗 ID 或客戶細分標記追蹤（字串陣列）。

### 帶有工作階段和標籤的範例

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    import java.util.UUID
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    fun main() = runBlocking {
        val sessionId = UUID.randomUUID().toString()
    
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a helpful assistant."
        ) {
            install(OpenTelemetry) {
                addLangfuseExporter(
                    traceAttributes = listOf(
                        CustomAttribute("langfuse.session.id", sessionId),
                        CustomAttribute("langfuse.trace.tags", listOf("chat", "kotlin", "production"))
                    )
                )
            }
        }
    
        println("Running agent with Langfuse tracing")

        // Multiple runs with the same session ID will be grouped in Langfuse
        agent.run("What is Kotlin?")
        agent.run("Show me a coroutine example")
    }
    ```
    <!--- KNIT example-langfuse-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleLangfuseExporterJava02 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var sessionId = UUID.randomUUID().toString();

        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .systemPrompt("You are a helpful assistant.")
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .install(OpenTelemetry.Feature, config ->
                config.addLangfuseExporter(
                    null, null, null, null,
                    List.of(
                        new CustomAttribute("langfuse.session.id", sessionId),
                        new CustomAttribute("langfuse.trace.tags", List.of("chat", "kotlin", "production"))
                    )
                ))
            .build();

        System.out.println("Running agent with Langfuse tracing");

        // Multiple runs with the same session ID will be grouped in Langfuse
        agent.run("How to setup Langfuse integration in Koog agent?");
        agent.run("Show me a Java API  example");
    }
    ```
    <!--- KNIT exampleLangfuseExporterJava02.java -->

## 追蹤內容

啟用後，Langfuse 匯出器會擷取與 Koog 常規 OpenTelemetry 整合相同的 span，包括：

- **Agent 生命週期事件**：agent 啟動、停止、錯誤
- **LLM 互動**：提示、回應、token 使用量、延遲
- **工具呼叫**：工具叫用的執行追蹤
- **系統上下文**：元資料，例如模型名稱、環境、Koog 版本

Koog 還會擷取 Langfuse 顯示 [Agent 圖表](https://langfuse.com/docs/observability/features/agent-graphs) 所需的 span 屬性。

出於安全性考量，預設情況下會屏蔽 OpenTelemetry span 的某些內容。
要使內容在 Langfuse 中可用，請在 OpenTelemetry 配置中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，並將其 `verbose` 引數設置為 `true`，如下所示：

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
        addLangfuseExporter()
        setVerbose(true)
    }
    ```
    <!--- KNIT example-langfuse-exporter-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleLangfuseExporterJava03 {
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
        config.addLangfuseExporter();
        config.setVerbose(true);
    })
    ```
    <!--- KNIT exampleLangfuseExporterJava03.java -->

在 Langfuse 中視覺化時，追蹤如下所示：
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/opentelemetry-langfuse-exporter-dark.png#only-dark)

有關 Langfuse OpenTelemetry 追蹤的更多詳細資訊，請參閱：  
[Langfuse OpenTelemetry 文件](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint)。

---

## 疑難排解

### Langfuse 中未顯示追蹤
- 請仔細檢查您的環境中是否已設定 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 與 `LANGFUSE_SECRET_KEY`。
- 如果在自我託管的 Langfuse 上執行，請確認您的應用程式環境可以連通 `LANGFUSE_HOST`。
- 驗證 public/secret key 配對是否屬於正確的專案。