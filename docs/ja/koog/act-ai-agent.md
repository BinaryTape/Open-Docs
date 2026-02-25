# FunctionalAIAgent: シングルラン（単発実行）エージェントをステップバイステップで構築する方法

FunctionalAIAgentは、シンプルなループで制御可能な、軽量の非グラフ型エージェントです。以下の用途に適しています：
- カスタムループ内でLLMを1回、または数回呼び出したい場合
- LLMのターンの間に、オプションでツールを呼び出したい場合
- 完全な戦略グラフを構築せずに、最終的な値（文字列、データクラスなど）を返したい場合

このガイドで行うこと：
1) 「Hello, World」レベルのFunctionalAIAgentを作成する。
2) ツールを追加し、エージェントに呼び出させる。
3) 動作を観察するための機能（イベントハンドラー）を追加する。
4) 履歴の圧縮によってコンテキストを制御する。
5) 一般的なレシピ、注意点、FAQを学ぶ。

## 1) 事前準備
PromptExecutor（実際にLLMと通信を行うオブジェクト）が必要です。ローカルで試す場合は、Ollamaエグゼキューターを使用できます：

```kotlin
val exec = simpleOllamaAIExecutor()
```

また、モデルを選択する必要があります。例：

```kotlin
val model = OllamaModels.Meta.LLAMA_3_2
```

準備はこれだけです。これら両方をエージェントファクトリに注入します。

## 2) 最初のエージェント（Hello, World）
目的：ユーザーのテキストをLLMに送信し、単一のアシスタントメッセージを文字列として返します。

```kotlin
val agent = functionalAIAgent<String, String>(
    prompt = "You are a helpful assistant.",
    promptExecutor = exec,
    model = model
) { input ->
    val responses = requestLLMMultiple(input)
    responses.single().asAssistantMessage().content
}

val result = agent.run("Say hi in one sentence")
println(result)
```

何が起きているのか？
- `requestLLMMultiple(input)` はユーザー入力を送信し、1つ以上のアシスタントメッセージを受信します。
- 唯一のメッセージの内容を返します（典型的なワンショットの流れです）。

ヒント：構造化データを返したい場合は、コンテンツをパースするか、Structured Data APIを使用してください。

## 3) ツールの追加（エージェントによる関数の呼び出し）
目的：ツールを介して、モデルに小さなデバイスを操作させます。

```kotlin
class Switch {
    private var on = false
    fun on() { on = true }
    fun off() { on = false }
    fun isOn() = on
}

class SwitchTools(private val sw: Switch) {
    fun turn_on() = run { sw.on(); "ok" }
    fun turn_off() = run { sw.off(); "ok" }
    fun state() = if (sw.isOn()) "on" else "off"
}

val sw = Switch()
val tools = ToolRegistry { tools(SwitchTools(sw).asTools()) }

val toolAgent = functionalAIAgent<String, String>(
    prompt = "You're responsible for running a Switch device and perform operations on it by request.",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools
) { input ->
    var responses = requestLLMMultiple(input)

    while (responses.containsToolCalls()) {
        val pending = extractToolCalls(responses)
        val results = executeMultipleTools(pending)
        responses = sendMultipleToolResults(results)
    }

    responses.single().asAssistantMessage().content
}

val out = toolAgent.run("Turn switch on")
println(out)
println("Switch is ${if (sw.isOn()) "on" else "off"}")
```

仕組み
- `containsToolCalls()` はLLMからのツール呼び出しメッセージを検出します。
- `extractToolCalls(...)` は、どのツールをどの引数で実行するかを読み取ります。
- `executeMultipleTools(...)` は、`ToolRegistry` に対してそれらを実行します。
- `sendMultipleToolResults(...)` は結果をLLMに返し、次のレスポンスを取得します。

## 4) フィーチャー（EventHandler）による動作の観察
目的：すべてのツール呼び出しをコンソールに出力します。

```kotlin
val observed = functionalAIAgent<String, String>(
    prompt = "...",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools,
    featureContext = {
        install(EventHandler) {
            onToolCallStarting { e -> println("Tool called: ${'
    ```}{e.tool.name}, args: ${'
    ```}{e.toolArgs}") }
        }
    }
) { input ->
    var responses = requestLLMMultiple(input)
    while (responses.containsToolCalls()) {
        val pending = extractToolCalls(responses)
        val results = executeMultipleTools(pending)
        responses = sendMultipleToolResults(results)
    }
    responses.single().asAssistantMessage().content
}
```

この方法でインストールできる他の機能には、トークンのストリーミングやトレーシングなどがあります。サイドバーの関連ドキュメントを参照してください。

## 5) コンテキストの制御（履歴の圧縮）
会話が長くなると、モデルのコンテキストウィンドウを超える可能性があります。トークン使用量を確認して、履歴を圧縮するタイミングを決定します：

```kotlin
var responses = requestLLMMultiple(input)

while (responses.containsToolCalls()) {
    if (latestTokenUsage() > 100_000) {
        compressHistory()
    }
    val pending = extractToolCalls(responses)
    val results = executeMultipleTools(pending)
    responses = sendMultipleToolResults(results)
}
```

使用しているモデルとプロンプトのサイズに適したしきい値を使用してください。

## 一般的なレシピ
- **構造化された出力を返す**
  - LLMにJSON形式にするよう指示してパースするか、Structured Data APIを使用します。
- **ツール入力のバリデーション**
  - ツール関数内でバリデーションを行い、明確なエラーメッセージを返します。
- **リクエストごとに1つのエージェントインスタンスを作成する**
  - 各エージェントインスタンスは、一度に1つの実行（single-run）のみを想定しています。並行処理が必要な場合は、新しいインスタンスを作成してください。
- **カスタム出力型**
  - `functionalAIAgent<String, MyResult>` のように変更し、ループからデータクラスを返します。

## トラブルシューティングと注意点
- **「Agent is already running（エージェントは既に実行中です）」**
  - FunctionalAIAgentは、同じインスタンスでの並行実行を防止します。並行するコルーチン間で1つのインスタンスを共有しないでください。実行ごとに新しいエージェントを作成するか、完了を待機してください。
- **モデルの出力が空、または予期しない内容である**
  - システムプロンプトを確認してください。中間レスポンスをプリントして確認します。フューショット（few-shot）の例を追加することを検討してください。
- **ループが終わらない**
  - ツール呼び出しがなくなったときに必ずブレイクするようにしてください。安全のためにガードやタイムアウトを追加してください。
- **コンテキストのオーバーフロー**
  - `latestTokenUsage()` を監視し、`compressHistory()` を呼び出してください。

## リファレンス（クイック）
コンストラクタ

```kotlin
fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    agentConfig: AIAgentConfig,
    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,
    loop: suspend AIAgentFunctionalContext.(input: Input) -> Output
): AIAgent<Input, Output>

fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,
    prompt: String = "",
    model: LLModel = OpenAIModels.Chat.GPT4o,
    featureContext: FeatureContext.() -> Unit = {},
    func: suspend AIAgentFunctionalContext.(input: Input) -> Output,
): AIAgent<Input, Output>
```

重要な型
- FunctionalAIAgent<Input, Output>
- AIAgentFunctionalContext
- AIAgentConfig / AIAgentConfigBase
- PromptExecutor
- ToolRegistry
- FeatureContext および機能インターフェース

ソースを参照：`agents/agents-core/src/commonMain/kotlin/ai/koog/agents/core/agent/FunctionalAIAgent.kt`