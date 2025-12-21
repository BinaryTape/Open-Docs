# 基本的なエージェント

`AIAgent` クラスは、KotlinアプリケーションでAIエージェントを作成するためのコアコンポーネントです。

最小限の設定でシンプルなエージェントを構築したり、カスタム戦略、ツール、設定、カスタム入出力タイプを定義することで、高度な機能を備えた洗練されたエージェントを作成できます。

このページでは、カスタマイズ可能なツールと設定を備えた基本的なエージェントを作成するために必要な手順を説明します。

基本的なエージェントは単一の入力を処理し、応答を提供します。
タスクを完了して応答を提供するために、ツール呼び出しの単一サイクル内で動作します。
このエージェントは、メッセージまたはツール結果のいずれかを返すことができます。
ツールレジストリがエージェントに提供されている場合、ツール結果が返されます。

もし実験用のシンプルなエージェントを構築することが目的であれば、エージェントを作成する際にプロンプトエグゼキュータとLLMのみを提供することができます。
しかし、より柔軟性とカスタマイズ性を求める場合は、オプションのパラメータを渡してエージェントを設定できます。
設定オプションの詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/-a-i-agent.html)を参照してください。

## 前提条件

- AIエージェントの実装に使用するLLMプロバイダの有効なAPIキーを持っていること。利用可能なすべてのプロバイダのリストについては、[LLMプロバイダ](llm-providers.md)を参照してください。

!!! tip
    APIキーの保存には、環境変数または安全な設定管理システムを使用してください。
    ソースコードにAPIキーを直接ハードコーディングすることは避けてください。

## 基本的なエージェントの作成

### 1. 依存関係の追加

`AIAgent` の機能を使用するには、必要なすべての依存関係をビルド設定に含めます。

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
}
```

利用可能なすべてのインストール方法については、[Koogのインストール](getting-started.md#install-koog)を参照してください。

### 2. エージェントの作成

エージェントを作成するには、`AIAgent` クラスのインスタンスを作成し、`executor` および `llmModel` パラメータを提供します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-basic-01.kt -->

### 3. システムプロンプトの追加

システムプロンプトはエージェントの動作を定義するために使用されます。プロンプトを提供するには、`systemPrompt` パラメータを使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "あなたは役立つアシスタントです。ユーザーの質問に簡潔に答えてください。",
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-basic-02.kt -->

### 4. LLM出力の設定

`temperature` パラメータを使用して、LLM出力生成の温度を提供します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "あなたは役立つアシスタントです。ユーザーの質問に簡潔に答えてください。",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7
)
```
<!--- KNIT example-basic-03.kt -->

### 5. ツールの追加

エージェントは特定のタスクを完了するためにツールを使用します。
必要に応じて、組み込みツールを使用したり、独自のカスタムツールを実装したりできます。

ツールを設定するには、エージェントが利用できるツールを定義する `toolRegistry` パラメータを使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "あなたは役立つアシスタントです。ユーザーの質問に簡潔に答えてください。",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    }
)
```
<!--- KNIT example-basic-04.kt -->
この例では、`SayToUser` は組み込みツールです。カスタムツールの作成方法については、[ツール](tools-overview.md)を参照してください。

### 6. エージェントのイテレーションの調整

`maxIterations` パラメータを使用して、エージェントが強制的に停止されるまでに実行できるステップの最大回数を提供します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "あなたは役立つアシスタントです。ユーザーの質問に簡潔に答えてください。",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    },
    maxIterations = 30
)
```
<!--- KNIT example-basic-05.kt -->

### 7. エージェントの実行時のイベント処理

基本的なエージェントはカスタムイベントハンドラをサポートしています。
イベントハンドラはエージェントの作成には必須ではありませんが、テスト、デバッグ、またはチェインされたエージェントのインタラクションのためのフックを作成するのに役立つ場合があります。

エージェントのインタラクションを監視するための `EventHandler` 機能の使用方法の詳細については、[イベントハンドラ](agent-event-handlers.md)を参照してください。

### 8. エージェントの実行

エージェントを実行するには、`run()` 関数を使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "あなたは役立つアシスタントです。ユーザーの質問に簡潔に答えてください。",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    },
    maxIterations = 100
)

fun main() = runBlocking {
    val result = agent.run("こんにちは！どのようなお手伝いができますか？")
}
```
<!--- KNIT example-basic-06.kt -->

エージェントは以下の出力を生成します。

```
Agent says: こんにちは！様々なタスクでお手伝いするためにここにいます。質問がある場合、情報が必要な場合、または特定のタスクで助けが必要な場合でも、お気軽にお尋ねください。本日はどのようなお手伝いができますか？