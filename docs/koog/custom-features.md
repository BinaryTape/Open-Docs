# 自定义功能

功能 (Feature) 提供了一种在运行时扩展和增强 AI 智能体功能的方式。它们被设计为模块化且可组合的，允许您根据需要进行混合与匹配。

除了 Koog [开箱即用](features-overview.md)提供的功能外，您还可以通过扩展适当的功能接口来实现自己的功能。本页面介绍了使用当前 Koog API 构建自定义功能的基本构建块。

## 功能接口

Koog 提供了以下接口，您可以扩展这些接口来实现自定义功能：

- [AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html)：表示特定于[已定义工作流的智能体](agents/graph-based-agents.md)（基于图的智能体）的功能。
- [AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html)：表示可用于[函数式智能体](agents/functional-agents.md)的功能。
- [AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html)：表示特定于[规划器智能体](agents/planner-agents/index.md)的功能类型。

!!! note
    要创建一个可以安装在基于图的、函数式的和规划器智能体中的自定义功能，您需要实现所有接口。

## 实现自定义功能

要实现自定义功能，您需要按照以下步骤创建功能结构：

1. 创建一个功能类。
2. 定义一个配置类。配置类是 [FeatureConfig](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/index.html) 类的扩展。
3. 创建一个实现以下部分或全部接口的伴生对象：[AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html)、[AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html)、[AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html)。
4. 为您的功能提供一个唯一的存储键（storage key），用于在智能体流水线中进行功能标识和检索。该键用于智能体流水线内部的 map 中，该 map 包含智能体的所有已注册功能。运行智能体时，它需要处理所有已注册的功能，而该键用于从该 map 中检索功能。
5. 实现所需的方法。

下面的代码示例展示了实现可安装在基于图的、函数式和规划器智能体中的自定义功能的通用模式：

<!--- INCLUDE
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
        override fun createInitialConfig(): Config = Config()

        // 针对基于图的智能体的功能安装
        override fun install(config: Config, pipeline: AIAgentGraphPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 事件处理程序实现
            }
            return feature
        }

        // 针对函数式智能体的功能安装
        override fun install(config: Config, pipeline: AIAgentFunctionalPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 事件处理程序实现
            }
            return feature
        }

        // 针对规划器智能体的功能安装
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

在创建智能体时，使用 `install` 方法安装您的功能：

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

拦截器代表了智能体生命周期中的各个点，您可以挂载到智能体执行流水线中以实现自定义逻辑。Koog 包含一系列预定义的拦截器，可用于观察各种事件。

以下是您可以从功能的 `install` 方法中注册的拦截器。所列拦截器按类型分组，适用于基于图的、函数式和规划器智能体流水线。为了在开发实际功能时减少干扰并优化成本，请仅注册功能所需的拦截器。

智能体和环境生命周期：

- `interceptEnvironmentCreated`：在创建智能体环境时对其进行转换。
- `interceptAgentStarting`：在智能体运行开始前调用。
- `interceptAgentCompleted`：在智能体运行成功完成时调用。
- `interceptAgentExecutionFailed`：在智能体运行失败时调用。
- `interceptAgentClosing`：在智能体运行关闭之前调用（清理点）。

策略生命周期：

- `interceptStrategyStarting`：在策略执行开始前调用。
- `interceptStrategyCompleted`：在策略执行成功完成时调用。

LLM 调用生命周期：

- `interceptLLMCallStarting`：在 LLM 调用之前调用。
- `interceptLLMCallCompleted`：在 LLM 调用之后调用。

LLM 流式传输生命周期：

- `interceptLLMStreamingStarting`：在流式传输开始前调用。
- `interceptLLMStreamingFrameReceived`：为每个接收到的流框架调用。
- `interceptLLMStreamingFailed`：在流式传输失败时调用。
- `interceptLLMStreamingCompleted`：在流式传输完成后调用。

工具调用生命周期：

- `interceptToolCallStarting`：在工具调用之前调用。
- `interceptToolValidationFailed`：在工具输入验证失败时调用。
- `interceptToolCallFailed`：在工具执行失败时调用。
- `interceptToolCallCompleted`：在工具完成（并返回结果）后调用。

#### 特定于基于图的智能体的拦截器

以下拦截器仅在 `AIAgentGraphPipeline` 上可用，允许您观察节点和子图的生命周期事件。

节点执行生命周期：

- `interceptNodeExecutionStarting`：在节点开始执行之前调用。
- `interceptNodeExecutionCompleted`：在节点完成执行之后调用。
- `interceptNodeExecutionFailed`：在节点执行因错误而失败时调用。

子图执行生命周期：

- `interceptSubgraphExecutionStarting`：在子图开始执行之前调用。
- `interceptSubgraphExecutionCompleted`：在子图执行完成后调用。
- `interceptSubgraphExecutionFailed`：在子图执行失败时调用。

为了让功能处理特定类型的事件，它需要注册相应的流水线拦截器。

### 过滤智能体事件

在智能体中安装功能时，您可能不想处理该功能中注册的所有事件。要过滤掉某些事件，可以使用 [FeatureConfig.setEventFilter](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/set-event-filter.html) 函数应用过滤器。

以下示例展示了如何为某个功能仅允许 LLM 调用开始和结束事件：

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

#### 禁用功能的事件过滤

如果您的功能逻辑依赖于完整的智能体事件结构，事件过滤可能会导致意外行为。为了防止这种情况，您需要在实现功能时禁用事件过滤，方法是在功能配置中重写 `setEventFilter`，以忽略安装功能时设置的任何自定义过滤器。

依赖于处理整个智能体事件流的一个功能示例是 [OpenTelemetry](opentelemetry-support.md)，因为它使用完整的智能体事件结构来组合 span 的继承结构。

以下是如何禁用功能的事件过滤的示例：

<!--- INCLUDE
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.core.feature.handler.AgentLifecycleEventContext
-->
```kotlin
class MyFeatureConfig : FeatureConfig() {
    override fun setEventFilter(filter: (AgentLifecycleEventContext) -> Boolean) {
        // 停用该功能的事件过滤
        throw UnsupportedOperationException("Event filtering is not allowed.")
    }
}
```
<!--- KNIT example-custom-features-04.kt -->

## 示例：一个基础日志记录功能

下面的示例展示了如何实现一个记录智能体生命周期事件的基础日志记录功能。由于该功能应适用于基于图的、函数式和规划器智能体，因此所有智能体类型通用的拦截器都在 `installCommon` 方法中实现，以避免代码重复。特定于各个智能体类型的拦截器分别在 `installGraphPipeline`、`installFunctionalPipeline` 和 `installPlannerPipeline` 方法中实现。

<!--- INCLUDE
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

        override fun createInitialConfig(): Config = Config()

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

以下是在智能体中安装自定义日志记录功能的示例。该示例展示了基础的功能安装，以及允许您指定日志记录器名称的自定义配置属性 `loggerName`：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
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

        override fun createInitialConfig(): Config = Config()

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