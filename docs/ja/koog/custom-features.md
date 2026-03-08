# カスタム機能

機能（Feature）は、実行時にAIエージェントの機能を拡張および強化する方法を提供します。これらはモジュール式で構成可能（composable）になるように設計されており、ニーズに応じて組み合わせて使用できます。

Koogで標準提供されている[機能](features-overview.md)に加えて、適切な機能インターフェースを拡張することで、独自の機能を実装することもできます。このページでは、現在のKoog APIを使用して独自の機能を作成するための基本的な構成要素を紹介します。

## 機能インターフェース

Koogは、カスタム機能を実装するために拡張できる以下のインターフェースを提供しています。

- [AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html): [ワークフローが定義されたエージェント](agents/graph-based-agents.md)（グラフベースのエージェント）に特有の機能を表します。
- [AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html): [関数型エージェント](agents/functional-agents.md)で使用できる機能を表します。
- [AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html): [プランナーエージェント](agents/planner-agents/index.md)に特有の機能タイプを表します。

!!! note
    グラフベース、関数型、およびプランナーエージェントのすべてにインストール可能なカスタム機能を作成するには、すべてのインターフェースを実装する必要があります。

## カスタム機能の実装

カスタム機能を実装するには、以下の手順に従って機能の構造を作成する必要があります。

1. 機能クラスを作成する。
2. 設定（configuration）クラスを定義する。設定クラスは [FeatureConfig](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/index.html) クラスを継承します。
3. 以下のインターフェースの一部またはすべてを実装するコンパニオンオブジェクトを作成する：[AIAgentGraphFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-graph-feature/index.html)、[AIAgentFunctionalFeature](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature/-a-i-agent-functional-feature/index.html)、[AIAgentPlannerFeature](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-feature/index.html)。
4. 機能に一意のストレージキー（storage key）を付与する。これは、エージェントパイプラインでの機能の識別と取得に使用されます。このキーは、エージェントに登録されたすべての機能を含む、エージェントパイプライン内の内部マップで使用されます。エージェントを実行する際、登録されたすべての機能を処理する必要があり、このキーを使用してマップから機能を取得します。
5. 必要なメソッドを実装する。

以下のコードサンプルは、グラフベース、関数型、およびプランナーエージェントにインストール可能なカスタム機能を実装する際の一般的なパターンを示しています。

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
        // コンテキスト内での取得に使用される一意のストレージキー
        override val key = createStorageKey<MyFeature>("my-feature")
        override fun createInitialConfig(): Config = Config()

        // グラフベースエージェントへの機能のインストール
        override fun install(config: Config, pipeline: AIAgentGraphPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // イベントハンドラの実装
            }
            return feature
        }

        // 関数型エージェントへの機能のインストール
        override fun install(config: Config, pipeline: AIAgentFunctionalPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // イベントハンドラの実装
            }
            return feature
        }

        // プランナーエージェントへの機能のインストール
        override fun install(config: Config, pipeline: AIAgentPlannerPipeline) : MyFeature {
            val feature = MyFeature(config.configProperty)

            pipeline.interceptAgentStarting(this) { context ->
                // イベントハンドラの実装
            }
            return feature
        }
    }
}
```
<!--- KNIT example-custom-features-01.kt -->

エージェントを作成する際、`install` メソッドを使用して機能をインストールします。

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

### パイプラインインターセプター

インターセプター（Interceptor）は、エージェントの実行パイプラインにフックしてカスタムロジックを実装できる、エージェントのライフサイクルにおけるさまざまなポイントを表します。Koogには、さまざまなイベントを監視するために使用できる一連の定義済みインターセプターが含まれています。

以下は、機能の `install` メソッドから登録できるインターセプターです。リストされているインターセプターはタイプ別にグループ化されており、グラフベース、関数型、およびプランナーエージェントのパイプラインに適用されます。実際の機能を開発する際のノイズを減らし、コストを最適化するために、その機能に必要なインターセプターのみを登録してください。

エージェントおよび環境のライフサイクル：

- `interceptEnvironmentCreated`: エージェント環境が作成されたときに、その環境を変換します。
- `interceptAgentStarting`: エージェントの実行が開始される前に呼び出されます。
- `interceptAgentCompleted`: エージェントの実行が正常に完了したときに呼び出されます。
- `interceptAgentExecutionFailed`: エージェントの実行が失敗したときに呼び出されます。
- `interceptAgentClosing`: エージェントの実行が終了する直前に呼び出されます（クリーンアップポイント）。

ストラテジーのライフサイクル：

- `interceptStrategyStarting`: ストラテジーの実行が開始される前に呼び出されます。
- `interceptStrategyCompleted`: ストラテジーの実行が正常に完了したときに呼び出されます。

LLM呼び出しのライフサイクル：

- `interceptLLMCallStarting`: LLM呼び出しの前に呼び出されます。
- `interceptLLMCallCompleted`: LLM呼び出しの後に呼び出されます。

LLMストリーミングのライフサイクル：

- `interceptLLMStreamingStarting`: ストリーミングが開始される前に呼び出されます。
- `interceptLLMStreamingFrameReceived`: ストリームフレームを受信するたびに呼び出されます。
- `interceptLLMStreamingFailed`: ストリーミングが失敗したときに呼び出されます。
- `interceptLLMStreamingCompleted`: ストリーミングが完了した後に呼び出されます。

ツール呼び出しのライフサイクル：

- `interceptToolCallStarting`: ツール呼び出しの前に呼び出されます。
- `interceptToolValidationFailed`: ツールの入力検証が失敗したときに呼び出されます。
- `interceptToolCallFailed`: ツールの実行が失敗したときに呼び出されます。
- `interceptToolCallCompleted`: ツールが完了した（結果が得られた）後に呼び出されます。

#### グラフベースエージェント専用のインターセプター

以下のインターセプターは `AIAgentGraphPipeline` でのみ使用可能で、ノードおよびサブグラフのライフサイクルイベントを監視できます。

ノード実行のライフサイクル：

- `interceptNodeExecutionStarting`: ノードの実行が開始される前に呼び出されます。
- `interceptNodeExecutionCompleted`: ノードの実行が終了した後に呼び出されます。
- `interceptNodeExecutionFailed`: ノードの実行がエラーで失敗したときに呼び出されます。

サブグラフ実行のライフサイクル：

- `interceptSubgraphExecutionStarting`: サブグラフの実行が開始される直前に呼び出されます。
- `interceptSubgraphExecutionCompleted`: サブグラフの実行が完了した後に呼び出されます。
- `interceptSubgraphExecutionFailed`: サブグラフの実行が失敗したときに呼び出されます。

機能が特定のタイプのイベントを処理するには、対応するパイプラインインターセプターを登録する必要があります。

### エージェントイベントのフィルタリング

エージェントに機能をインストールする際、その機能に登録されているすべてのイベントを処理したくない場合があります。一部のイベントを除外するには、[FeatureConfig.setEventFilter](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.feature.config/-feature-config/set-event-filter.html) 関数を使用してフィルターを適用します。

以下の例は、ある機能に対してLLM呼び出しの開始イベントと終了イベントのみを許可する方法を示しています。

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

#### 機能のイベントフィルタリングを無効にする

機能のロジックが完全なエージェントイベント構造に依存している場合、イベントフィルタリングが予期しない動作を引き起こす可能性があります。これを防ぐには、機能の設定で `setEventFilter` をオーバーライドし、機能のインストール時に設定されたカスタムフィルターを無視するようにして、機能を実装する際にイベントフィルタリングを無効にする必要があります。

エージェントイベントストリーム全体の処理に依存する機能の例としては [OpenTelemetry](opentelemetry-support.md) があります。これは、スパンの継承構造を構成するために完全なエージェントイベント構造を使用するためです。

以下は、機能のイベントフィルタリングを無効にする方法の例です。

<!--- INCLUDE
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.core.feature.handler.AgentLifecycleEventContext
-->
```kotlin
class MyFeatureConfig : FeatureConfig() {
    override fun setEventFilter(filter: (AgentLifecycleEventContext) -> Boolean) {
        // この機能のイベントフィルタリングを無効化する
        throw UnsupportedOperationException("Event filtering is not allowed.")
    }
}
```
<!--- KNIT example-custom-features-04.kt -->

## 例：基本的なロギング機能

以下の例は、エージェントのライフサイクルイベントを記録する基本的なロギング機能を実装する方法を示しています。この機能はグラフベース、関数型、およびプランナーエージェントで利用可能である必要があるため、コードの重複を避けるために、すべてのエージェントタイプに共通のインターセプターを `installCommon` メソッドで実装しています。個々のエージェントタイプに固有のインターセプターは、`installGraphPipeline`、`installFunctionalPipeline`、および `installPlannerPipeline` メソッドで実装されています。

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

以下は、カスタムロギング機能をエージェントにインストールする方法の例です。この例では、基本的な機能のインストールとともに、ロガーの名前を指定できるカスタム設定プロパティ `loggerName` を使用しています。

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