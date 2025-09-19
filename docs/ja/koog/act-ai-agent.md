# FunctionalAIAgent: シングルランエージェントを段階的に構築する方法

FunctionalAIAgentは、シンプルなループで制御する軽量な非グラフエージェントです。次のような場合に利用できます。
- カスタムループ内でLLMを1回または数回呼び出す場合。
- オプションでLLMの実行間にツールを呼び出す場合。
- 完全なストラテジーグラフを構築せずに、最終的な値（文字列、データクラスなど）を返す場合。

このガイドで学ぶこと：
1) 「Hello, World」FunctionalAIAgentを作成する。
2) ツールを追加し、エージェントにそれを呼び出させる。
3) 動作を監視するための機能（イベントハンドラー）を追加する。
4) 履歴圧縮でコンテキストを制御する。
5) 一般的なレシピ、落とし穴、よくある質問を学ぶ。

## 1) 前提条件
PromptExecutor（実際にLLMと対話するオブジェクト）が必要です。ローカルでの実験には、Ollamaエクゼキューターを使用できます。

```kotlin
val exec = simpleOllamaAIExecutor()
```

また、モデルを選択する必要があります。例えば：

```kotlin
val model = OllamaModels.Meta.LLAMA_3_2
```

以上です — これら両方をエージェントファクトリーに注入します。

## 2) 初めてのエージェント（Hello, World）
目標：ユーザーのテキストをLLMに送信し、単一のアシスタントメッセージを文字列として返す。

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

何が起こるか？
- `requestLLMMultiple(input)`はユーザー入力を送信し、1つ以上のアシスタントメッセージを受信します。
- 唯一のメッセージの内容を返します（典型的なワンショットフロー）。

ヒント：構造化データを返したい場合は、コンテンツを解析するか、Structured Data APIを使用してください。

## 3) ツールを追加する（エージェントが関数を呼び出す方法）
目標：ツールを介してモデルが小型デバイスを操作できるようにする。

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

動作の仕組み
- `containsToolCalls()`はLLMからのツール呼び出しメッセージを検出します。
- `extractToolCalls(...)`はどのツールをどのような引数で実行するかを読み取ります。
- `executeMultipleTools(...)`はToolRegistryに対してそれらを実行します。
- `sendMultipleToolResults(...)`は結果をLLMに送り返し、次の応答を取得します。

## 4) 機能（EventHandler）で動作を監視する
目標：すべてのツール呼び出しをコンソールに出力する。

```kotlin
val observed = functionalAIAgent<String, String>(
    prompt = "...",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools,
    featureContext = {
        install(EventHandler) {
            onToolCall { e -> println("Tool called: ${'```}{e.tool.name}, args: ${'```}{e.toolArgs}") }
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

この方法でインストールできる他の機能には、ストリーミングトークンやトレースなどがあります。関連ドキュメントをサイドバーで参照してください。

## 5) コンテキストを制御下に置く（履歴圧縮）
長い会話は、モデルのコンテキストウィンドウを超える可能性があります。トークン使用量を使用して、履歴をいつ圧縮するかを決定します。

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

使用するモデルとプロンプトサイズに適したしきい値を使用してください。

## 一般的なレシピ
- 構造化された出力を返す
  - LLMにJSONをフォーマットするよう依頼して解析するか、Structured Data APIを使用します。
- ツール入力を検証する
  - ツール関数で検証を実行し、明確なエラーメッセージを返します。
- リクエストごとに1つのエージェントインスタンス
  - 各エージェントインスタンスは一度にシングルランです。並行処理が必要な場合は、新しいインスタンスを作成してください。
- カスタム出力タイプ
  - `functionalAIAgent<String, MyResult>`を変更し、ループからデータクラスを返します。

## トラブルシューティングと落とし穴
- 「エージェントはすでに実行中です」
  - FunctionalAIAgentは、同じインスタンスでの並行実行を防ぎます。並列コルーチン間で単一のインスタンスを共有しないでください。実行ごとに新しいエージェントを作成するか、完了を待機してください。
- 空または予期しないモデル出力
  - システムプロンプトを確認してください。中間応答を出力してください。Few-shotの例を追加することを検討してください。
- ループが終了しない
  - ツール呼び出しがない場合に中断することを確実にしてください。安全のためにガード/タイムアウトを追加してください。
- コンテキストのオーバーフロー
  - `latestTokenUsage()`を監視し、`compressHistory()`を呼び出してください。

## リファレンス（クイック）
コンストラクター

```kotlin
fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    agentConfig: AIAgentConfigBase,
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
- `FunctionalAIAgent<Input, Output>`
- `AIAgentFunctionalContext`
- `AIAgentConfig` / `AIAgentConfigBase`
- `PromptExecutor`
- `ToolRegistry`
- `FeatureContext` and feature interfaces

ソースコードを参照: `agents/agents-core/src/commonMain/kotlin/ai/koog/agents/core/agent/FunctionalAIAgent.kt`