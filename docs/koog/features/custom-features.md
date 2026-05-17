# 自定义特性

特性提供了一种在运行时扩展和增强 AI 代理功能的方法。它们被设计为模块化且可组合，允许您根据需要进行混合和匹配。

除了 Koog 开箱即用的[特性](index.md)外，您还可以通过扩展适当的特性接口来实现自己的特性。本页面介绍了使用当前 Koog API 构建自定义特性的基本组件。

## 特性接口

Koog 提供了以下接口，您可以扩展这些接口来实现自定义特性：

- [AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html)：表示特定于[已定义工作流的代理](../agents/graph-based-agents.md)（基于图的代理）的特性。
- [AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html)：表示可用于[函数式代理](../agents/functional-agents.md)的特性。
- [AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html)：表示特定于[规划器代理](../agents/planner-agents/index.md)的特性类型。

!!! note
    要创建一个可以安装在基于图的代理、函数式代理和规划器代理中的自定义特性，您需要实现所有接口。

## 实现自定义特性

要实现自定义特性，您需要按照以下步骤创建特性结构：

1. 创建特性类。
2. 定义配置类。配置类是 [FeatureConfig](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/index.html) 类的扩展。
3. 创建一个实现以下部分或全部接口的伴生对象：[AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html)、[AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html)、[AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html)。
4. 为您的特性提供一个唯一的存储键 (storage key)，用于在代理流水线中进行特性识别和检索。该键用于代理流水线内部的 map 中，该 map 包含代理的所有已注册特性。运行代理时，它需要处理所有已注册特性，而该键则用于从该 map 中检索特性。
5. 实现所需的方法。

下面的代码示例展示了实现自定义特性的通用模式，该特性可以安装在基于图的代理、函数式代理和规划器代理中：

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
        // 用于在上下文中检索的唯一存储键
        override val key = createStorageKey<MyFeature>("my-feature")
        override fun createInitialConfig(agentConfig: AIAgentConfig): Config = Config()

        // 针对基于图的代理的特性安装
        override fun install(config: Config, pipeline: AIAgentGraphPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 事件处理程序实现
            }
            return feature
        }

        // 针对函数式代理的特性安装
        override fun install(config: Config, pipeline: AIAgentFunctionalPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 事件处理程序实现
            }
            return feature
        }

        // 针对规划器代理的特性安装
        override fun install(config: Config, pipeline: AIAgentPlannerPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 事件处理程序实现
            }
            return feature
        }
    }
}
```
<!--- KNIT example-custom-features-01.kt -->

创建代理时，使用 `install` 方法安装您的特性：

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

### 流水线拦截器

拦截器代表了代理生命周期中的各个点，您可以挂载到代理执行流水线中以实现自定义逻辑。Koog 包含一系列预定义的拦截器，您可以使用它们来观察各种事件。

以下是您可以从特性的 `install` 方法中注册的拦截器。列出的拦截器按类型分组，适用于基于图的代理、函数式代理和规划器代理流水线。为了在开发实际特性时减少噪音并优化成本，请仅注册特性所需的拦截器。

代理和环境生命周期：

- `interceptEnvironmentCreated`：在代理环境创建时对其进行转换。
- `interceptAgentStarting`：在代理运行开始前调用。
- `interceptAgentCompleted`：在代理运行成功完成时调用。
- `interceptAgentExecutionFailed`：在代理运行失败时调用。
- `interceptAgentClosing`：在代理运行关闭前调用（清理点）。

策略生命周期：

- `interceptStrategyStarting`：在策略执行开始前调用。
- `interceptStrategyCompleted`：在策略执行成功完成时调用。

LLM 调用生命周期：

- `interceptLLMCallStarting`：在 LLM 调用前调用。
- `interceptLLMCallFailed`：在 LLM 调用失败时调用（底层 prompt 执行器或审查调用抛出异常）。
- `interceptLLMCallCompleted`：在 LLM 调用后调用。

LLM 流式传输生命周期：

- `interceptLLMStreamingStarting`：在流式传输开始前调用。
- `interceptLLMStreamingFrameReceived`：为每个接收到的流帧调用。
- `interceptLLMStreamingFailed`：在流式传输失败时调用。
- `interceptLLMStreamingCompleted`：在流式传输完成后调用。

工具调用生命周期：

- `interceptToolCallStarting`：在工具调用前调用。
- `interceptToolValidationFailed`：在工具输入验证失败时调用。
- `interceptToolCallFailed`：在工具执行失败时调用。
- `interceptToolCallCompleted`：在工具完成（带结果）后调用。

#### 特定于基于图的代理的拦截器

以下拦截器仅在 `AIAgentGraphPipeline` 上可用，允许您观察节点和子图的生命周期事件。

节点执行生命周期：

- `interceptNodeExecutionStarting`：在节点开始执行前调用。
- `interceptNodeExecutionCompleted`：在节点执行完成后调用。
- `interceptNodeExecutionFailed`：在节点执行失败并报错时调用。

子图执行生命周期：

- `interceptSubgraphExecutionStarting`：在子图开始执行前调用。
- `interceptSubgraphExecutionCompleted`：在子图执行完成后调用。
- `interceptSubgraphExecutionFailed`：在子图执行失败时调用。

为了让特性处理特定类型的事件，它需要注册相应的流水线拦截器。

### 过滤代理事件

在代理中安装特性时，您可能不想处理该特性中注册的所有事件。要过滤掉某些事件，您可以使用 [FeatureConfig.setEventFilter](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/set-event-filter.html) 函数应用过滤器。

以下示例展示了如何仅允许特性的 LLM 调用开始和结束事件：

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

#### 禁用特性的事件过滤

如果您的特性逻辑依赖于完整的代理事件结构，事件过滤可能会导致非预期的行为。为了防止这种情况，您需要在实现特性时通过在特性配置中重写 `setEventFilter` 来禁用事件过滤，从而忽略安装特性时设置的任何自定义过滤器。

依赖于处理整个代理事件流的一个特性示例是 [OpenTelemetry](open-telemetry/index.md)，因为它使用完整的代理事件结构来组合 span 的继承结构。

以下是如何禁用特性的事件过滤的示例：

<!--- INCLUDE
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.core.feature.handler.AgentLifecycleEventContext
-->
```kotlin
class MyFeatureConfig : FeatureConfig() {
    override fun setEventFilter(filter: (AgentLifecycleEventContext) -> Boolean) {
        // 停用该特性的事件过滤
        throw UnsupportedOperationException("Event filtering is not allowed.")
    }
}
```
<!--- KNIT example-custom-features-04.kt -->

## 示例：基础日志特性

以下示例展示了如何实现一个基础日志特性，该特性用于记录代理生命周期事件。由于该特性应可用于基于图的代理、函数式代理和规划器代理，因此所有代理类型通用的拦截器都在 `installCommon` 方法中实现，以避免代码重复。特定于各代理类型的拦截器则在 `installGraphPipeline`、`installFunctionalPipeline` 和 `installPlannerPipeline` 方法中实现。

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
                logger.info { "Received response: ${e.response != null}" }
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

以下是在代理中安装自定义日志特性的示例。该示例展示了基本的特性安装，以及自定义配置属性 `loggerName`，它允许您指定记录器的名称：

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
                logger.info { "Received response: ${e.response != null}" }
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