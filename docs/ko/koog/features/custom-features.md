# 커스텀 기능

기능(Feature)은 런타임에 AI 에이전트의 기능을 확장하고 강화하는 방법을 제공합니다. 기능은 모듈식(modular)이며 조합 가능하도록(composable) 설계되어 있어, 필요에 따라 믹스 앤 매치할 수 있습니다.

Koog에서 기본적으로 제공하는 [기능](index.md) 외에도, 적절한 기능 인터페이스를 확장하여 직접 커스텀 기능을 구현할 수 있습니다. 이 페이지에서는 현재 Koog API를 사용하여 직접 기능을 만들기 위한 기본 구성 요소를 소개합니다.

## 기능 인터페이스

Koog는 커스텀 기능을 구현하기 위해 확장할 수 있는 다음과 같은 인터페이스를 제공합니다:

- [AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html): [워크플로가 정의된 에이전트](../agents/graph-based-agents.md)(그래프 기반 에이전트) 전용 기능을 나타냅니다.
- [AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html): [함수형 에이전트](../agents/functional-agents.md)에서 사용할 수 있는 기능을 나타냅니다.
- [AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html): [플래너 에이전트](../agents/planner-agents/index.md) 전용 기능 타입을 나타냅니다.

!!! note
    그래프 기반, 함수형 및 플래너 에이전트에 모두 설치할 수 있는 커스텀 기능을 만들려면 모든 인터페이스를 구현해야 합니다.

## 커스텀 기능 구현하기

커스텀 기능을 구현하려면 다음 단계에 따라 기능 구조를 만들어야 합니다:

1. 기능 클래스를 생성합니다.
2. 설정(configuration) 클래스를 정의합니다. 설정 클래스는 [FeatureConfig](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/index.html) 클래스의 확장입니다.
3. 다음 인터페이스 중 일부 또는 전체를 구현하는 컴패니언 객체(companion object)를 생성합니다: [AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html), [AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html), [AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html).
4. 에이전트 파이프라인에서 기능을 식별하고 검색하는 데 사용되는 고유한 스토리지 키(storage key)를 기능에 부여합니다. 이 키는 에이전트에 등록된 모든 기능이 포함된 에이전트 파이프라인 내부 맵에서 사용됩니다. 에이전트를 실행할 때 등록된 모든 기능을 프로세싱해야 하며, 이때 이 맵에서 기능을 검색하기 위해 키가 사용됩니다.
5. 필요한 메서드들을 구현합니다.

아래 코드 샘플은 그래프 기반, 함수형 및 플래너 에이전트에 설치할 수 있는 커스텀 기능을 구현하는 일반적인 패턴을 보여줍니다:

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
        // 컨텍스트에서 검색을 위한 고유 스토리지 키
        override val key = createStorageKey<MyFeature>("my-feature")
        override fun createInitialConfig(agentConfig: AIAgentConfig): Config = Config()

        // 그래프 기반 에이전트를 위한 기능 설치
        override fun install(config: Config, pipeline: AIAgentGraphPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 이벤트 핸들러 구현
            }
            return feature
        }

        // 함수형 에이전트를 위한 기능 설치
        override fun install(config: Config, pipeline: AIAgentFunctionalPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 이벤트 핸들러 구현
            }
            return feature
        }

        // 플래너 에이전트를 위한 기능 설치
        override fun install(config: Config, pipeline: AIAgentPlannerPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // 이벤트 핸들러 구현
            }
            return feature
        }
    }
}
```
<!--- KNIT example-custom-features-01.kt -->

에이전트를 생성할 때, `install` 메서드를 사용하여 기능을 설치합니다:

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

### 파이프라인 인터셉터

인터셉터는 에이전트 실행 파이프라인에 연결하여 커스텀 로직을 구현할 수 있는 에이전트 생명주기(lifecycle)의 다양한 지점을 나타냅니다. Koog에는 다양한 이벤트를 관찰하는 데 사용할 수 있는 일련의 사전 정의된 인터셉터가 포함되어 있습니다.

아래는 기능의 `install` 메서드에서 등록할 수 있는 인터셉터들입니다. 나열된 인터셉터들은 유형별로 그룹화되어 있으며 그래프 기반, 함수형 및 플래너 에이전트 파이프라인에 적용됩니다. 실제 기능을 개발할 때 노이즈를 줄이고 비용을 최적화하려면 기능에 필요한 인터셉터만 등록하십시오.

에이전트 및 환경 생명주기:

- `interceptEnvironmentCreated`: 에이전트 환경이 생성될 때 이를 변환합니다.
- `interceptAgentStarting`: 에이전트 실행이 시작되기 전에 호출됩니다.
- `interceptAgentCompleted`: 에이전트 실행이 성공적으로 완료되었을 때 호출됩니다.
- `interceptAgentExecutionFailed`: 에이전트 실행이 실패했을 때 호출됩니다.
- `interceptAgentClosing`: 에이전트 실행이 종료되기 직전에 호출됩니다(정리 지점).

전략(Strategy) 생명주기: 

- `interceptStrategyStarting`: 전략 실행이 시작되기 전에 호출됩니다.
- `interceptStrategyCompleted`: 전략 실행이 성공적으로 완료되었을 때 호출됩니다.

LLM 호출 생명주기:

- `interceptLLMCallStarting`: LLM 호출 전에 호출됩니다.
- `interceptLLMCallCompleted`: LLM 호출 후에 호출됩니다.

LLM 스트리밍 생명주기:

- `interceptLLMStreamingStarting`: 스트리밍이 시작되기 전에 호출됩니다.
- `interceptLLMStreamingFrameReceived`: 수신된 각 스트림 프레임에 대해 호출됩니다.
- `interceptLLMStreamingFailed`: 스트리밍이 실패했을 때 호출됩니다.
- `interceptLLMStreamingCompleted`: 스트리밍이 완료된 후에 호출됩니다.

도구(Tool) 호출 생명주기:

- `interceptToolCallStarting`: 도구 호출 전에 호출됩니다.
- `interceptToolValidationFailed`: 도구 입력 유효성 검사가 실패했을 때 호출됩니다.
- `interceptToolCallFailed`: 도구 실행이 실패했을 때 호출됩니다.
- `interceptToolCallCompleted`: 도구가 (결과와 함께) 완료된 후에 호출됩니다.

#### 그래프 기반 에이전트 전용 인터셉터

다음 인터셉터들은 `AIAgentGraphPipeline`에서만 사용할 수 있으며 노드 및 서브그래프 생명주기 이벤트를 관찰할 수 있게 해줍니다.

노드 실행 생명주기:

- `interceptNodeExecutionStarting`: 노드 실행이 시작되기 전에 호출됩니다.
- `interceptNodeExecutionCompleted`: 노드 실행이 끝난 후에 호출됩니다.
- `interceptNodeExecutionFailed`: 노드 실행이 오류로 실패했을 때 호출됩니다.

서브그래프 실행 생명주기:

- `interceptSubgraphExecutionStarting`: 서브그래프 실행이 시작되기 직전에 호출됩니다.
- `interceptSubgraphExecutionCompleted`: 서브그래프 실행이 완료된 후에 호출됩니다.
- `interceptSubgraphExecutionFailed`: 서브그래프 실행이 실패했을 때 호출됩니다.

기능이 특정 유형의 이벤트를 처리하려면 해당 파이프라인 인터셉터를 등록해야 합니다.

### 에이전트 이벤트 필터링

에이전트에 기능을 설치할 때, 기능에 등록된 모든 이벤트를 처리하고 싶지 않을 수 있습니다. 일부 이벤트를 걸러내려면 [FeatureConfig.setEventFilter](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/set-event-filter.html) 함수를 사용하여 필터를 적용합니다.

다음 예제는 기능에 대해 LLM 호출 시작 및 종료 이벤트만 허용하는 방법을 보여줍니다:

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

#### 기능에 대한 이벤트 필터링 비활성화

기능 로직이 전체 에이전트 이벤트 구조에 의존하는 경우, 이벤트 필터링이 예기치 않은 동작을 유발할 수 있습니다. 이를 방지하려면 기능을 구현할 때 기능 설정에서 `setEventFilter`를 오버라이드하여 기능을 설치할 때 설정된 커스텀 필터를 무시하도록 하여 이벤트 필터링을 비활성화해야 합니다.

전체 에이전트 이벤트 스트림 처리에 의존하는 기능의 예로 [OpenTelemetry](open-telemetry/index.md)가 있는데, 이는 상속된 스팬(span) 구조를 구성하기 위해 전체 에이전트 이벤트 구조를 사용하기 때문입니다.

다음은 기능에 대한 이벤트 필터링을 비활성화하는 예제입니다:

<!--- INCLUDE
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.core.feature.handler.AgentLifecycleEventContext
-->
```kotlin
class MyFeatureConfig : FeatureConfig() {
    override fun setEventFilter(filter: (AgentLifecycleEventContext) -> Boolean) {
        // 기능을 위한 이벤트 필터링 비활성화
        throw UnsupportedOperationException("Event filtering is not allowed.")
    }
}
```
<!--- KNIT example-custom-features-04.kt -->

## 예제: 기본 로깅 기능

다음 예제는 에이전트 생명주기 이벤트를 기록하는 기본 로깅 기능을 구현하는 방법을 보여줍니다. 이 기능은 그래프 기반, 함수형 및 플래너 에이전트에서 모두 사용할 수 있어야 하므로, 코드 중복을 피하기 위해 모든 에이전트 유형에 공통적인 인터셉터는 `installCommon` 메서드에 구현되었습니다. 개별 에이전트 유형에 특화된 인터셉터는 `installGraphPipeline`, `installFunctionalPipeline` 및 `installPlannerPipeline` 메서드에 구현되었습니다.

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

다음은 에이전트에 커스텀 로깅 기능을 설치하는 예제입니다. 이 예제는 기본적인 기능 설치와 함께 로거의 이름을 지정할 수 있게 해주는 커스텀 설정 속성인 `loggerName`을 사용하는 방법을 보여줍니다:

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