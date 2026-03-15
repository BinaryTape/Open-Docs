# 自訂功能

功能提供了一種在執行時擴充和增強 AI 代理功能的方法。它們被設計為模組化且可組合，讓您可以根據需求進行混搭。

除了 Koog 開箱即用的[功能](features-overview.md)之外，您還可以透過擴充適當的功能介面來實作自己的功能。本頁面介紹了使用目前 Koog API 建立自訂功能的基礎組件。

## 功能介面

Koog 提供了以下介面，您可以透過擴充這些介面來實作自訂功能：

- [AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html)：代表特定於[已定義工作流的代理](agents/graph-based-agents.md)（以圖形為基礎的代理）的功能。
- [AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html)：代表可用於[功能性代理](agents/functional-agents.md)的功能。
- [AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html)：代表特定於[規劃代理](agents/planner-agents/index.md)的功能型別。

!!! note
    要建立一個可安裝在圖形代理、功能性代理和規劃代理中的自訂功能，您需要實作所有介面。

## 實作自訂功能

若要實作自訂功能，您需要按照以下步驟建立功能結構：

1. 建立功能類別。
2. 定義配置類別。配置類別是 [FeatureConfig](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/index.html) 類別的擴充。
3. 建立一個實作部分或全部以下介面的伴隨物件：[AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html)、[AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html)、[AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html)。
4. 為您的功能提供一個唯一的儲存金鑰（storage key），用於在代理管線中識別和擷取功能。此金鑰用於代理管線內部的內部 map，該 map 包含代理所有已註冊的功能。當您執行代理時，它需要處理所有已註冊的功能，而金鑰則用於從此 map 中擷取功能。
5. 實作必要的方法。

下方的程式碼範例展示了實作可安裝在圖形代理、功能性代理和規劃代理中的自訂功能之通用模式：

<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.agent.entity.createStorageKey
import ai.koog.agents.core.feature.AIAgentFunctionalFeature
import ai.koog.agents.core.feature.AIAgentGraphFeature
import ai.koog.agents.core.feature.AIAgentPlannerFeature
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.core.feature.pipeline.AIAgentFunctionalPipeline
import ai.koog.agents.core.feature.pipeline.AIAgentGraphPipeline
import ai.koog.agents.core.feature.pipeline.AIAgentPlannerPipeline
-->
```kotlin
class MyFeature(val someProperty: String) {
    class Config : FeatureConfig() {
        var configProperty: String = "default"
    }

    companion object Feature : AIAgentGraphFeature<Config, MyFeature>, AIAgentFunctionalFeature<Config, MyFeature>, AIAgentPlannerFeature<Config, MyFeature> {
        // 用於在上下文中擷取的唯一儲存金鑰
        override val key = createStorageKey<MyFeature>("my-feature")
        override fun createInitialConfig(agentConfig: AIAgentConfig): Config = Config()

        // 圖形代理的功能安裝
        override fun install(config: Config, pipeline: AIAgentGraphPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 事件處理常式實作
            }
            return feature
        }

        // 功能性代理的功能安裝
        override fun install(config: Config, pipeline: AIAgentFunctionalPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 事件處理常式實作
            }
            return feature
        }

        // 規劃代理的功能安裝
        override fun install(config: Config, pipeline: AIAgentPlannerPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 事件處理常式實作
            }
            return feature
        }
    }
}
```
<!--- KNIT example-custom-features-01.kt -->

建立代理時，使用 `install` 方法安裝您的功能：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.features.tracing.feature.Tracing

val MyFeature = Tracing
var configProperty = ""
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o
) {
    install(MyFeature) {
        configProperty = "value"
    }
}
```
<!--- KNIT example-custom-features-02.kt -->

### 管線攔截器

攔截器代表代理生命週期中的各個點，您可以在這些點掛勾（hook）到代理執行管線以實作自訂邏輯。Koog 包含一系列預定義的攔截器，可用於觀察各種事件。

以下是您可以從功能的 `install` 方法中註冊的攔截器。列出的攔截器依型別分組，並適用於圖形代理、功能性代理和規劃代理管線。為了在開發實際功能時減少雜訊並優化成本，請僅註冊功能所需的攔截器。

代理與環境生命週期：

- `interceptEnvironmentCreated`：在環境建立時轉換代理環境。
- `interceptAgentStarting`：在代理執行開始前叫用。
- `interceptAgentCompleted`：在代理執行成功完成時叫用。
- `interceptAgentExecutionFailed`：在代理執行失敗時叫用。
- `interceptAgentClosing`：在代理執行關閉前叫用（清理點）。

策略生命週期： 

- `interceptStrategyStarting`：在策略執行開始前叫用。
- `interceptStrategyCompleted`：在策略執行成功完成時叫用。

LLM 呼叫生命週期：

- `interceptLLMCallStarting`：在 LLM 呼叫前叫用。
- `interceptLLMCallCompleted`：在 LLM 呼叫後叫用。

LLM 串流生命週期：

- `interceptLLMStreamingStarting`：在串流開始前叫用。
- `interceptLLMStreamingFrameReceived`：為每個接收到的串流影格叫用。
- `interceptLLMStreamingFailed`：在串流失敗時叫用。
- `interceptLLMStreamingCompleted`：在串流完成後叫用。

工具呼叫生命週期：

- `interceptToolCallStarting`：在工具呼叫前叫用。
- `interceptToolValidationFailed`：在工具輸入驗證失敗時叫用。
- `interceptToolCallFailed`：在工具執行失敗時叫用。
- `interceptToolCallCompleted`：在工具完成後（帶有結果）叫用。

#### 特定於圖形代理的攔截器

以下攔截器僅在 `AIAgentGraphPipeline` 上可用，讓您可以觀察節點和子圖的生命週期事件。

節點執行生命週期：

- `interceptNodeExecutionStarting`：在節點開始執行前叫用。
- `interceptNodeExecutionCompleted`：在節點執行完成後叫用。
- `interceptNodeExecutionFailed`：在節點執行失敗並出現錯誤時叫用。

子圖執行生命週期：

- `interceptSubgraphExecutionStarting`：在子圖開始執行前立即叫用。
- `interceptSubgraphExecutionCompleted`：在子圖執行完成後叫用。
- `interceptSubgraphExecutionFailed`：在子圖執行失敗時叫用。

功能若要處理特定型別的事件，需要註冊對應的管線攔截器。

### 篩選代理事件

在代理中安裝功能時，您可能不想處理功能中註冊的所有事件。若要篩選掉某些事件，可以使用 [FeatureConfig.setEventFilter](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/set-event-filter.html) 函式套用篩選器。

以下範例展示如何讓功能僅允許 LLM 呼叫開始與結束事件：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.AgentLifecycleEventType
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.features.tracing.feature.Tracing

typealias MyFeature = Tracing

suspend fun main() {
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
        llmModel = OpenAIModels.Chat.GPT4o
    ) {
        install(Tracing) {
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
install(MyFeature) {
    setEventFilter { context ->
        context.eventType is AgentLifecycleEventType.LLMCallStarting ||
            context.eventType is AgentLifecycleEventType.LLMCallCompleted
    }
}
```
<!--- KNIT example-custom-features-03.kt -->

#### 停用功能的事件篩選

如果您的功能邏輯依賴完整的代理事件結構，事件篩選可能會導致非預期的行為。為了防止這種情況，您需要在實作功能時停用事件篩選，方法是在功能配置中覆寫 `setEventFilter`，以忽略安裝功能時設定的任何自訂篩選器。

依賴處理整個代理事件串流的功能範例是 [OpenTelemetry](opentelemetry-support.md)，因為它使用完整的代理事件結構來組成跨度（span）的繼承結構。

以下是停用功能事件篩選的範例：

<!--- INCLUDE
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.core.feature.handler.AgentLifecycleEventContext
-->
```kotlin
class MyFeatureConfig : FeatureConfig() {
    override fun setEventFilter(filter: (AgentLifecycleEventContext) -> Boolean) {
        // 停用功能的事件篩選
        throw UnsupportedOperationException("Event filtering is not allowed.")
    }
}
```
<!--- KNIT example-custom-features-04.kt -->

## 範例：基本的記錄功能

以下範例展示如何實作一個記錄代理生命週期事件的基本記錄功能。由於該功能應可用於圖形代理、功能性代理和規劃代理，因此所有代理型別通用的攔截器皆在 `installCommon` 方法中實作，以避免程式碼重複。特定於個別代理型別的攔截器則在 `installGraphPipeline`、`installFunctionalPipeline` 和 `installPlannerPipeline` 方法中實作。

<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.agent.entity.createStorageKey
import ai.koog.agents.core.feature.AIAgentFunctionalFeature
import ai.koog.agents.core.feature.AIAgentGraphFeature
import ai.koog.agents.core.feature.AIAgentPlannerFeature
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.core.feature.pipeline.AIAgentFunctionalPipeline
import ai.koog.agents.core.feature.pipeline.AIAgentGraphPipeline
import ai.koog.agents.core.feature.pipeline.AIAgentPlannerPipeline
import ai.koog.agents.core.feature.pipeline.AIAgentPipeline
import io.github.oshai.kotlinlogging.KLogger
import io.github.oshai.kotlinlogging.KotlinLogging
-->
```kotlin
class LoggingFeature(val loggerName: String) {
    class Config : FeatureConfig() {
        var loggerName: String = "agent-logs"
    }

    companion object Feature :
        AIAgentGraphFeature<Config, LoggingFeature>,
        AIAgentFunctionalFeature<Config, LoggingFeature>,
        AIAgentPlannerFeature<Config, LoggingFeature> {

        override val key = createStorageKey<LoggingFeature>("logging-feature")

        override fun createInitialConfig(agentConfig: AIAgentConfig): Config = Config()

        override fun install(config: Config, pipeline: AIAgentGraphPipeline) : LoggingFeature {
            val logging = LoggingFeature(config.loggerName)
            val logger = KotlinLogging.logger(config.loggerName)

            installGraphPipeline(pipeline, logger)

            return logging
        }

        override fun install(config: Config, pipeline: AIAgentFunctionalPipeline) : LoggingFeature {
            val logging = LoggingFeature(config.loggerName)
            val logger = KotlinLogging.logger(config.loggerName)

            installFunctionalPipeline(pipeline, logger)

            return logging
        }

        override fun install(config: Config, pipeline: AIAgentPlannerPipeline) : LoggingFeature {
            val logging = LoggingFeature(config.loggerName)
            val logger = KotlinLogging.logger(config.loggerName)

            installPlannerPipeline(pipeline, logger)

            return logging
        }

        private fun installCommon(
            pipeline: AIAgentPipeline,
            logger: KLogger,
        ) {
            pipeline.interceptAgentStarting(this) { e ->
                logger.info { "Agent starting: runId=${e.runId}" }
            }
            pipeline.interceptStrategyStarting(this) { e ->
                logger.info { "Strategy ${e.strategy.name} starting" }
            }
            pipeline.interceptLLMCallStarting(this) { e ->
                logger.info { "Making LLM call with ${e.tools.size} tools" }
            }
            pipeline.interceptLLMCallCompleted(this) { e ->
                logger.info { "Received ${e.responses.size} response(s)" }
            }
        }

        private fun installGraphPipeline(
            pipeline: AIAgentGraphPipeline,
            logger: KLogger,
        ) {
            installCommon(pipeline, logger)

            pipeline.interceptNodeExecutionStarting(this) { e ->
                logger.info { "Node ${e.node.name} input: ${e.input}" }
            }
            pipeline.interceptNodeExecutionCompleted(this) { e ->
                logger.info { "Node ${e.node.name} output: ${e.output}" }
            }
        }

        private fun installFunctionalPipeline(
            pipeline: AIAgentFunctionalPipeline,
            logger: KLogger
        ) {
            installCommon(pipeline, logger)
        }

        private fun installPlannerPipeline(
            pipeline: AIAgentPlannerPipeline,
            logger: KLogger
        ) {
            installCommon(pipeline, logger)
        }
    }
}
```
<!--- KNIT example-custom-features-05.kt -->

以下是在代理中安裝自訂記錄功能的範例。此範例展示了基本的功能安裝，以及自訂配置屬性 `loggerName`，讓您可以指定記錄器的名稱：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.agent.entity.createStorageKey
import ai.koog.agents.core.feature.AIAgentFunctionalFeature
import ai.koog.agents.core.feature.AIAgentGraphFeature
import ai.koog.agents.core.feature.AIAgentPlannerFeature
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.core.feature.pipeline.AIAgentFunctionalPipeline
import ai.koog.agents.core.feature.pipeline.AIAgentGraphPipeline
import ai.koog.agents.core.feature.pipeline.AIAgentPlannerPipeline
import ai.koog.agents.core.feature.pipeline.AIAgentPipeline
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.github.oshai.kotlinlogging.KLogger
import io.github.oshai.kotlinlogging.KotlinLogging

class LoggingFeature(val loggerName: String) {
    class Config : FeatureConfig() {
        var loggerName: String = "agent-logs"
    }

    companion object Feature :
        AIAgentGraphFeature<Config, LoggingFeature>,
        AIAgentFunctionalFeature<Config, LoggingFeature>,
        AIAgentPlannerFeature<Config, LoggingFeature> {

        override val key = createStorageKey<LoggingFeature>("logging-feature")

        override fun createInitialConfig(agentConfig: AIAgentConfig): Config = Config()

        override fun install(config: Config, pipeline: AIAgentGraphPipeline) : LoggingFeature {
            val logging = LoggingFeature(config.loggerName)
            val logger = KotlinLogging.logger(config.loggerName)

            installGraphPipeline(pipeline, logger)

            return logging
        }

        override fun install(config: Config, pipeline: AIAgentFunctionalPipeline) : LoggingFeature {
            val logging = LoggingFeature(config.loggerName)
            val logger = KotlinLogging.logger(config.loggerName)

            installFunctionalPipeline(pipeline, logger)

            return logging
        }

        override fun install(config: Config, pipeline: AIAgentPlannerPipeline) : LoggingFeature {
            val logging = LoggingFeature(config.loggerName)
            val logger = KotlinLogging.logger(config.loggerName)

            installPlannerPipeline(pipeline, logger)

            return logging
        }

        private fun installCommon(
            pipeline: AIAgentPipeline,
            logger: KLogger,
        ) {
            pipeline.interceptAgentStarting(this) { e ->
                logger.info { "Agent starting: runId=${e.runId}" }
            }
            pipeline.interceptStrategyStarting(this) { e ->
                logger.info { "Strategy ${e.strategy.name} starting" }
            }
            pipeline.interceptLLMCallStarting(this) { e ->
                logger.info { "Making LLM call with ${e.tools.size} tools" }
            }
            pipeline.interceptLLMCallCompleted(this) { e ->
                logger.info { "Received ${e.responses.size} response(s)" }
            }
        }

        private fun installGraphPipeline(
            pipeline: AIAgentGraphPipeline,
            logger: KLogger,
        ) {
            installCommon(pipeline, logger)

            pipeline.interceptNodeExecutionStarting(this) { e ->
                logger.info { "Node ${e.node.name} input: ${e.input}" }
            }
            pipeline.interceptNodeExecutionCompleted(this) { e ->
                logger.info { "Node ${e.node.name} output: ${e.output}" }
            }
        }

        private fun installFunctionalPipeline(
            pipeline: AIAgentFunctionalPipeline,
            logger: KLogger
        ) {
            installCommon(pipeline, logger)
        }

        private fun installPlannerPipeline(
            pipeline: AIAgentPlannerPipeline,
            logger: KLogger
        ) {
            installCommon(pipeline, logger)
        }
    }
}

suspend fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o
) {
    install(LoggingFeature) {
        loggerName = "my-custom-logger"
    }
}

agent.run("What is Kotlin?")
```
<!--- KNIT example-custom-features-06.kt -->