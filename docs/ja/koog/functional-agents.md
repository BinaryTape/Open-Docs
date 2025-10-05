# 機能エージェント

機能エージェントは、複雑な戦略グラフを構築することなく動作する軽量なAIエージェントです。
代わりに、エージェントロジックは、ユーザー入力を処理し、LLMと対話し、
必要に応じてツールを呼び出し、最終的な出力を生成するラムダ関数として実装されます。単一のLLM呼び出しを実行したり、複数のLLM呼び出しを連続して処理したり、
ユーザー入力、LLM、およびツール出力に基づいてループしたりすることができます。

!!! tip
    - 既にシンプルな[シングルランエージェント](single-run-agents.md)を最初のMVPとして持っているが、タスク固有の制限に直面している場合は、機能エージェントを使用してカスタムロジックをプロトタイプ作成してください。履歴圧縮や自動状態管理を含むKoogのほとんどの機能を使用しながら、純粋なKotlinでカスタム制御フローを実装できます。
    - 実運用レベルのニーズに対しては、フォールトトレランスのための制御可能なロールバックによる永続性と、ネストされたグラフイベントによる高度なOpenTelemetryトレースを提供するため、機能エージェントを戦略グラフを持つ[複雑なワークフローエージェント](complex-workflow-agents.md)にリファクタリングしてください。

このページでは、最小限の機能エージェントを作成し、それをツールで拡張するために必要な手順を説明します。

## 前提条件

開始する前に、以下が揃っていることを確認してください。

- Gradleを使用した動作可能なKotlin/JVMプロジェクト。
- Java 17以降がインストールされていること。
- AIエージェントを実装するために使用するLLMプロバイダーからの有効なAPIキー。利用可能なすべてのプロバイダーのリストについては、[概要](index.md)を参照してください。
- (任意) Ollamaを使用する場合、Ollamaがローカルにインストールされ、実行されていること。

!!! tip
    APIキーは環境変数または安全な構成管理システムを使用して保存してください。
    ソースコードにAPIキーを直接ハードコーディングすることは避けてください。

## 依存関係を追加する

`AIAgent`クラスは、Koogでエージェントを作成するためのメインクラスです。
クラスの機能を使用するには、ビルド構成に以下の依存関係を含めてください。

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```
利用可能なすべてのインストール方法については、[インストール](index.md#installation)を参照してください。

## 最小限の機能エージェントを作成する

最小限の機能エージェントを作成するには、以下を実行します。

1.  エージェントが処理する入力および出力タイプを選択し、対応する`AIAgent<Input, Output>`インスタンスを作成します。
    このガイドでは`AIAgent<String, String>`を使用します。これは、エージェントが`String`を受け取り、`String`を返すことを意味します。
2.  システムプロンプト、プロンプトエグゼキューター、LLMを含む必要なパラメーターを指定します。
3.  `functionalStrategy {...}` DSLメソッドにラップされたラムダ関数でエージェントロジックを定義します。

以下は、ユーザーテキストを指定されたLLMに送信し、単一のアシスタントメッセージを返す最小限の機能エージェントの例です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.agent.asAssistantMessage
import ai.koog.agents.core.agent.requestLLM
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// AIAgentインスタンスを作成し、システムプロンプト、プロンプトエグゼキューター、LLMを提供する
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // エージェントロジックを定義
        // 1回のLLM呼び出しを行う
        val response = requestLLM(input)
        // レスポンスからアシスタントメッセージの内容を抽出し、返す
        response.asAssistantMessage().content
    }
)

// ユーザー入力でエージェントを実行し、結果を出力する
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-01.kt -->

エージェントは以下の出力を生成できます。

```
The answer to 12 × 9 is 108.
```

このエージェントは1回のLLM呼び出しを行い、アシスタントメッセージの内容を返します。
複数の連続したLLM呼び出しを処理するようにエージェントロジックを拡張できます。例:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.agent.asAssistantMessage
import ai.koog.agents.core.agent.requestLLM
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// AIAgentインスタンスを作成し、システムプロンプト、プロンプトエグゼキューター、LLMを提供する
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // エージェントロジックを定義
        // ユーザー入力に基づいて最初のドラフトを生成する最初のLLM呼び出し
        val draft = requestLLM("Draft: $input").asAssistantMessage().content
        // ドラフトの内容を再度LLMにプロンプトして、ドラフトを改善する2番目のLLM呼び出し
        val improved = requestLLM("Improve and clarify: $draft").asAssistantMessage().content
        // 改善されたテキストをフォーマットし、最終的なフォーマットされた結果を返す最後のLLM呼び出し
        requestLLM("Format the result as bold: $improved").asAssistantMessage().content
    }
)

// ユーザー入力でエージェントを実行し、結果を出力する
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-02.kt -->

エージェントは以下の出力を生成できます。

```
When multiplying 12 by 9, we can break it down as follows:

**12 (tens) × 9 = 108**

Alternatively, we can also use the distributive property to calculate this:

**(10 + 2) × 9**
= **10 × 9 + 2 × 9**
= **90 + 18**
= **108**
```

## ツールを追加する

多くの場合、機能エージェントは、データの読み書きやAPIの呼び出しなど、特定のタスクを完了する必要があります。
Koogでは、そのような機能をツールとして公開し、LLMがエージェントロジック内でそれらを呼び出せるようにします。

この章では、上記で作成した最小限の機能エージェントを例にとり、ツールを使用してエージェントロジックを拡張する方法を示します。

1) アノテーションベースのツールを作成します。詳細については、[アノテーションベースのツール](annotation-based-tools.md)を参照してください。

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
--> 
```kotlin
@LLMDescription("Simple multiplier")
class MathTools : ToolSet {
    @Tool
    @LLMDescription("Multiplies two numbers and returns the result")
    fun multiply(a: Int, b: Int): Int {
        val result = a * b
        return result
    }
}
```
<!--- KNIT example-functional-agent-03.kt -->

利用可能なツールについてさらに学ぶには、[ツール概要](tools-overview.md)を参照してください。

2) ツールを登録して、エージェントで利用できるようにします。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val toolRegistry = ToolRegistry {
    tools(MathTools())
}
```
<!--- KNIT example-functional-agent-04.kt -->

3) ツールレジストリをエージェントに渡して、LLMが利用可能なツールをリクエストおよび使用できるようにします。

4) ツール呼び出しを識別し、リクエストされたツールを実行し、その結果をLLMに送り返し、ツール呼び出しがなくなるまでプロセスを繰り返すようにエージェントロジックを拡張します。

!!! note
    LLMがツール呼び出しを発行し続ける場合にのみ、ループを使用してください。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.agent.asAssistantMessage
import ai.koog.agents.core.agent.containsToolCalls
import ai.koog.agents.core.agent.executeMultipleTools
import ai.koog.agents.core.agent.extractToolCalls
import ai.koog.agents.core.agent.requestLLMMultiple
import ai.koog.agents.core.agent.sendMultipleToolResults
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val toolRegistry = ToolRegistry {
            tools(MathTools())
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val mathWithTools = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant. When multiplication is needed, use the multiplication tool.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    toolRegistry = toolRegistry,
    strategy = functionalStrategy { input -> // ツール呼び出しで拡張されたエージェントロジックを定義
        // ユーザー入力をLLMに送信
        var responses = requestLLMMultiple(input)
        
        // LLMがツールをリクエストしている間だけループする
        while (responses.containsToolCalls()) {
            // レスポンスからツール呼び出しを抽出
            val pendingCalls = extractToolCalls(responses)
            // ツールを実行し、結果を返す
            val results = executeMultipleTools(pendingCalls)
            // ツール結果をLLMに送り返します。LLMはさらにツールを呼び出すか、最終出力を返す場合があります
            responses = sendMultipleToolResults(results)
        }

        // ツール呼び出しが残っていない場合、レスポンスからアシスタントメッセージの内容を抽出して返す
        responses.single().asAssistantMessage().content
    }
)

// ユーザー入力でエージェントを実行し、結果を出力する
val reply = mathWithTools.run("Please multiply 12.5 and 4, then add 10 to the result.")
println(reply)
```
<!--- KNIT example-functional-agent-05.kt -->

エージェントは以下の出力を生成できます。

```
Here is the step-by-step solution:

1. Multiply 12.5 and 4:
   12.5 × 4 = 50

2. Add 10 to the result:
   50 + 10 = 60
```

## 次のステップ

- [構造化出力API](structured-output.md)を使用して構造化データを返す方法を学びます。
- エージェントにさらに[ツール](tools-overview.md)を追加する実験をします。
- [EventHandler](agent-events.md)機能で可観測性を向上させます。
- [履歴圧縮](history-compression.md)で長期間の会話を処理する方法を学びます。