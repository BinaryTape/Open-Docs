# Agents

AIエージェントは、推論、意思決定、環境との相互作用を行い、特定の目標を達成するために行動を起こすことができる自律的なシステムです。
Koogにおいて、AIエージェントは単なるLLMのラッパーではありません。
それはJVMエコシステム向けに設計された、構造化された型安全なステートマシンです。

Koogのエージェントは、以下のコア概念を中心に構築されています。

- [プロンプトエクゼキューター](../prompts/prompt-executors.md)は、プロンプトの管理と実行を行い、エージェントが推論や意思決定のためにLLMと対話できるようにします。
- [ストラテジー](../nodes-and-components.md)は、エージェントのワークフローを定義します。
  これは、有向グラフ、関数、またはプランナーの形式をとることができます。
  [エージェントの種類](#agent-types)を参照してください。
- エージェントは、外部のデータソースやサービスと相互作用するために[ツール](../tools-overview.md)を使用できます。
- [フィーチャー](../features-overview.md)を使用して、AIエージェントの機能を拡張および強化できます。

!!! tip

    最小限のエージェントの作成と実行に関する情報については、[クイックスタート](../quickstart.md)を参照してください。

## Agent types

実行する必要があるタスクに応じて、Koogはいくつかのエージェントタイプを提供しています。

- [基本エージェント (Basic agents)](basic-agents.md)は、カスタムロジックを必要としない単純なタスクに最適です。
  これらのエージェントは、ほとんどの一般的なユースケースで機能する事前定義されたストラテジーを実装しています。
- [グラフベースエージェント (Graph-based agents)](graph-based-agents.md)は、エージェントのワークフロー、状態管理、および可視化を完全に制御し、柔軟性を提供します。
- [関数型エージェント (Functional agents)](functional-agents.md)は、エージェントのコンテキストにアクセスできる関数として、カスタムロジックのプロトタイプを迅速に作成することを可能にします。
- [プランナーエージェント (Planner agents)](planner-agents/index.md)は、望ましい最終状態に達するまで、反復的なサイクルを通じて多段階のタスクを自律的に計画および実行できます。

## Agent configuration

エージェント設定（Agent configuration）は、初期プロンプト、言語モデル、反復制限などのエージェントの実行パラメータを定義します。

!!! tip

    最小限のエージェントの作成と実行に関する情報については、[クイックスタート](../quickstart.md)を参照してください。

シンプルなエージェントの場合、必須のプロンプトエクゼキューターと言語モデルに加えて、初期システムプロンプトやその他のパラメータをエージェントのコンストラクタで直接指定できます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    temperature = 0.7,
    maxIterations = 10
)
```
<!--- KNIT example-agent-config-01.kt -->

あるいは、[`AIAgentConfig`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.config/-a-i-agent-config/index.html) のインスタンスを作成して、エージェントの動作とパラメータをより細かく定義し、それをエージェントのコンストラクタに渡すこともできます。
これにより、複数のメッセージを含む複雑なプロンプト、会話履歴、LLMパラメータ、および追加の実行パラメータを定義できるようになります。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt(
        id = "assistant",
        params = LLMParams(
            temperature = 0.7
        )
    ) {
        system("You are a helpful assistant.")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    agentConfig = agentConfig
)
```
<!--- KNIT example-agent-config-02.kt -->

`AIAgentConfig` のパラメータは以下の通りです。

- `prompt` は、初期[プロンプト](../prompts/prompt-creation/index.md)と[LLMパラメータ](../llm-parameters.md)を定義します。

- `model` は、エージェントが対話する言語モデルを指定します。
  定義済みのモデルのいずれかを使用するか、[カスタムモデル設定を作成](../model-capabilities.md#creating-a-model-llmodel-configuration)できます。

- `maxAgentIterations` は、エージェントが終了するまでに実行できる最大ステップ数を制限します。
  各ステップは、エージェントのワークフローにおける[ノード](../nodes-and-components.md)です。

- `missingToolsConversionStrategy` は、エージェントの実行中に欠落しているツールを処理するための戦略を定義します。

[//]: # (TODO: ツールセクションに欠落しているツールについて書き、ここからリンクする)

- `responseProcessor` は、カスタムレスポンスプロセッサを定義するために使用できます。
  例えば、レスポンス内容のモデレートやバリデーション、レスポンス形式の変更、またはレスポンスのログ記録などを行うことができます。

[//]: # (TODO: レスポンス処理についてどこかに書く？)