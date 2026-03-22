# W&B Weave 匯出器

Koog 提供內建支援，可將 agent 追蹤 (trace) 匯出至 [W&B Weave](https://wandb.ai/site/weave/)，這是 Weights & Biases 提供的開發者工具，用於 AI 應用程式的可觀測性與分析。  
透過 Weave 整合，您可以擷取提示、補全、系統內容與執行追蹤，並直接在您的 W&B 工作區中將其視覺化。

有關 Koog 的 OpenTelemetry 支援背景，請參閱 [OpenTelemetry 支援](https://docs.koog.ai/opentelemetry-support/)。

---

## 設定說明

1. 在 [https://wandb.ai](https://wandb.ai) 建立 W&B 帳戶。
2. 從 [https://wandb.ai/authorize](https://wandb.ai/authorize) 獲取您的 API 金鑰。
3. 透過造訪您的 W&B 儀表板 [https://wandb.ai/home](https://wandb.ai/home) 找到您的實體 (entity) 名稱。
   如果您使用的是個人帳戶，實體通常是您的使用者名稱，或者是您的團隊/組織名稱。
4. 為您的專案定義一個名稱。您不需要事先建立專案，當傳送第一個追蹤時，系統會自動建立。
5. 將 Weave 實體、專案名稱和 API 金鑰傳遞給 Weave 匯出器。
   這可以透過將它們作為參數提供給 `addWeaveExporter()` 函式來完成，
   或者透過設定如下所示的環境變數：

```bash
export WEAVE_API_KEY="<your-api-key>"
export WEAVE_ENTITY="<your-entity>"
export WEAVE_PROJECT_NAME="koog-tracing"
```
<!--- KNIT example-weave-exporter-01.txt -->

## 設定

要啟用 Weave 匯出，請安裝 **OpenTelemetry 功能**並新增 `WeaveExporter`。  
該匯出器透過 `OtlpHttpSpanExporter` 使用 Weave 的 OpenTelemetry 端點。

### 範例：具備 Weave 追蹤功能的 agent

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

## 哪些內容會被追蹤

啟用後，Weave 匯出器會擷取與 Koog 的一般 OpenTelemetry 整合相同的 span，包括：

- **Agent 生命週期事件**：agent 啟動、停止、錯誤
- **LLM 互動**：提示、補全、延遲
- **工具呼叫**：工具叫用的執行追蹤
- **系統內容**：例如模型名稱、環境、Koog 版本等元資料

出於安全原因，OpenTelemetry span 的某些內容預設會被遮蔽。
要讓內容在 Weave 中可用，請在 OpenTelemetry 設定中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，並將其 `verbose` 引數設為 `true`，如下所示：

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

在 W&B Weave 中視覺化時，追蹤如下所示：
![W&B Weave 追蹤](img/opentelemetry-weave-exporter-light.png#only-light)
![W&B Weave 追蹤](img/opentelemetry-weave-exporter-dark.png#only-dark)

有關更多詳細資訊，請參閱官方的 [Weave OpenTelemetry 文件](https://weave-docs.wandb.ai/guides/tracking/otel/)。

---

## 疑難排解

### Weave 中未出現追蹤
- 確認環境中已設定 `WEAVE_API_KEY`、`WEAVE_ENTITY` 和 `WEAVE_PROJECT_NAME`。
- 確保您的 W&B 帳戶有權存取指定的實體和專案。

### 身份驗證錯誤
- 檢查您的 `WEAVE_API_KEY` 是否有效。
- API 金鑰必須具有為所選實體寫入追蹤的權限。

### 連線問題
- 確保您的環境具有存取 W&B OpenTelemetry 擷取端點的網路存取權限。