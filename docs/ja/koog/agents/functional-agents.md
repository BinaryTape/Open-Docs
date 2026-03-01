# 関数型エージェント

関数型エージェントでは、ユーザー入力の処理、LLMとのやり取り、必要に応じたツールの呼び出し、および最終的な出力の生成を行う関数としてロジックを実装します。
[グラフベースのエージェント](graph-based-agents.md)と比較すると、通常、プロトタイピングをより迅速に行うことができますが、以下のようなデメリットがあります。

- 視覚化が容易ではない
- 状態の永続化がない

??? note "前提条件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    このページの例では、Ollamaを介してLlama 3.2をローカルで実行していることを前提としています。

このページでは、エージェントのカスタムロジックを迅速にプロトタイプするための関数型戦略の実装方法について説明します。

## 最小限の関数型エージェントを作成する

最小限の関数型エージェントを作成するには、[基本エージェント](basic-agents.md)と同じ[`AIAgent`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/index.html)インターフェースを使用し、[`AIAgentFunctionalStrategy`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent-functional-strategy/index.html)のインスタンスを渡します。
最も便利な方法は、`functionalStrategy {...}` DSLメソッドを使用することです。

例えば、文字列の入力を受け取り文字列を出力する、1回のLLM呼び出しを行い、レスポンスからアシスタントメッセージの内容を返す関数型戦略を定義する方法は以下の通りです。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking
-->
```kotlin
val strategy = functionalStrategy<String, String> { input ->
    val response = requestLLM(input)
    response.asAssistantMessage().content
}

val mathAgent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = strategy
)

fun main() = runBlocking {
    val result = mathAgent.run("What is 12 × 9?")
    println(result)
}
```
<!--- KNIT example-functional-agent-01.kt -->

エージェントは以下のような出力を生成します。

```text
The answer to 12 × 9 is 108.
```

## 連続したLLM呼び出しを行う

前述の戦略を拡張して、複数のLLM呼び出しを連続して行うことができます。

<!--- INCLUDE
import ai.koog.agents.core.agent.functionalStrategy
-->
```kotlin
val strategy = functionalStrategy<String, String> { input ->
    // 最初のLLM呼び出しは、ユーザー入力に基づいて初期ドラフトを生成します
    val draft = requestLLM("Draft: $input").asAssistantMessage().content
    // 2番目のLLM呼び出しは、初期ドラフトを改善します
    val improved = requestLLM("Improve and clarify.").asAssistantMessage().content
    // 最後のLLM呼び出しは、改善されたテキストを整形して結果を返します
    requestLLM("Format the result as bold.").asAssistantMessage().content
}
```
<!--- KNIT example-functional-agent-02.kt -->

エージェントは以下のような出力を生成します。

```text
To calculate the product of 12 and 9, we multiply these two numbers together.

12 × 9 = **108**
```

## ツールの追加

多くの場合、関数型エージェントはデータの読み書き、APIの呼び出し、その他の決定論的な操作など、特定のタスクを完了させる必要があります。
Koogでは、このような機能を[ツール](../tools-overview.md)として公開し、いつ呼び出すかをLLMに判断させます。

必要な手順は以下の通りです。

1. [アノテーションベースのツール](../annotation-based-tools.md)を作成します。
2. それをツールレジストリに追加し、レジストリをエージェントに渡します。
3. エージェントの戦略がLLMのレスポンス内のツール呼び出しを識別し、要求されたツールを実行し、その結果をLLMに送り返し、ツール呼び出しがなくなるまでこのプロセスを繰り返すようにします。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tool
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking
-->
```kotlin
@LLMDescription("Tools for performing math operations")
class MathTools : ToolSet {
    @Tool
    @LLMDescription("Multiplies two numbers and returns the result")
    fun multiply(a: Int, b: Int): Int {
        // これは必須ではありませんが、コンソール出力でツールの呼び出しを確認するのに役立ちます
        println("Multiplying $a and $b...")
        return a * b
    }
}

val toolRegistry = ToolRegistry {
    tool(MathTools()::multiply)
}

val strategy = functionalStrategy<String, String> { input ->
    // ユーザー入力をLLMに送信
    var responses = requestLLMMultiple(input)

    // LLMがツールを要求している間のみループ
    while (responses.containsToolCalls()) {
        // レスポンスからツール呼び出しを抽出
        val pendingCalls = extractToolCalls(responses)
        // ツールを実行して結果を返す
        val results = executeMultipleTools(pendingCalls)
        // ツールの結果をLLMに送り返す。LLMはさらにツールを呼び出すか、最終的な出力を返す場合があります
        responses = sendMultipleToolResults(results)
    }

    // ツール呼び出しがなくなったら、レスポンスから単一のアシスタントメッセージの内容を抽出して返す
    responses.single().asAssistantMessage().content
}

val mathAgentWithTools = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    toolRegistry = toolRegistry,
    strategy = strategy
)

fun main() = runBlocking {
    val result = mathAgentWithTools.run("Multiply 3 by 4, then multiply the result by 5.")
    println(result)
}
```
<!--- KNIT example-functional-agent-03.kt -->

エージェントは以下のような出力を生成します。

```text
Multiplying 3 and 4...
Multiplying 12 and 5...
The result of multiplying 3 by 4 is 12. Multiplying 12 by 5 gives us a final answer of 60.
```

## 次のステップ

- [グラフベースのエージェント](graph-based-agents.md)の作成方法を学ぶ