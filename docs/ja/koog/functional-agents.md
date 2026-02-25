# 関数型エージェント (Functional agents)

関数型エージェントは、複雑なストラテジーグラフを構築することなく動作する軽量なAIエージェントです。
代わりに、エージェントのロジックは、ユーザー入力を処理し、LLMとやり取りし、必要に応じてツールを呼び出し、最終的な出力を生成するラムダ関数として実装されます。1回のLLM呼び出しを実行したり、複数のLLM呼び出しを順番に処理したり、ユーザー入力やLLM、ツールの出力に基づいてループしたりすることができます。

!!! tip
    - すでに最初のMVPとして[基本エージェント](basic-agents.md)を作成済みで、タスク固有の制限に直面している場合は、関数型エージェントを使用してカスタムロジックのプロトタイプを作成してください。履歴の圧縮や自動状態管理を含むKoogのほとんどの機能を使用しながら、純粋なKotlinでカスタム制御フローを実装できます。
    - 本番環境レベルのニーズについては、関数型エージェントをストラテジーグラフを備えた[複雑なワークフローエージェント](complex-workflow-agents.md)にリファクタリングしてください。これにより、制御可能なロールバックによる障害耐性を備えた永続化や、ネストされたグラフイベントによる高度なOpenTelemetryトレースが可能になります。

このページでは、最小限の関数型エージェントを作成し、それをツールで拡張するために必要な手順を説明します。

## 前提条件

開始する前に、以下が準備されていることを確認してください。

- 動作するKotlin/JVMプロジェクト。
- Java 17以上がインストールされていること。
- AIエージェントの実装に使用するLLMプロバイダーからの有効なAPIキー。利用可能なすべてのプロバイダーの一覧については、[LLMプロバイダー](llm-providers.md)を参照してください。
- (オプション) Ollamaプロバイダーを使用する場合は、Ollamaがローカルでインストールされ、実行されていること。

!!! tip
    APIキーを保存するには、環境変数または安全な構成管理システムを使用してください。
    ソースコードにAPIキーを直接ハードコードすることは避けてください。

## 依存関係の追加

`AIAgent` クラスは、Koogでエージェントを作成するためのメインクラスです。
クラスの機能を使用するには、ビルド構成に以下の依存関係を追加してください。

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```
利用可能なすべてのインストール方法については、[Koogのインストール](getting-started.md#install-koog)を参照してください。

## 最小限の関数型エージェントを作成する

最小限の関数型エージェントを作成するには、以下の手順を行います。

1. エージェントが処理する入力と出力の型を選択し、対応する `AIAgent<Input, Output>` インスタンスを作成します。
   このガイドでは、エージェントが `String` を受け取り `String` を返すことを意味する `AIAgent<String, String>` を使用します。
2. システムプロンプト、プロンプトエグゼキューター、LLMなどの必須パラメータを指定します。
3. `functionalStrategy {...}` DSLメソッドにラップされたラムダ関数でエージェントロジックを定義します。

以下は、ユーザーテキストを指定されたLLMに送信し、単一のアシスタントメッセージを返す最小限の関数型エージェントの例です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// AIAgentインスタンスを作成し、システムプロンプト、プロンプトエグゼキューター、LLMを指定します
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // エージェントのロジックを定義します
        // LLMを1回呼び出します
        val response = requestLLM(input)
        // レスポンスからアシスタントメッセージの内容を抽出して返します
        response.asAssistantMessage().content
    }
)

// ユーザー入力でエージェントを実行し、結果を出力します
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-01.kt -->

エージェントは次のような出力を生成します：

```
The answer to 12 × 9 is 108.
```

このエージェントは1回のLLM呼び出しを行い、アシスタントメッセージの内容を返します。
エージェントのロジックを拡張して、複数の連続したLLM呼び出しを処理することもできます。例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// AIAgentインスタンスを作成し、システムプロンプト、プロンプトエグゼキューター、LLMを指定します
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // エージェントのロジックを定義します
        // ユーザー入力に基づいて最初のドラフトを作成するための最初のLLM呼び出し
        val draft = requestLLM("Draft: $input").asAssistantMessage().content
        // ドラフトの内容でLLMを再度プロンプトして、ドラフトを改善するための2番目のLLM呼び出し
        val improved = requestLLM("Improve and clarify.").asAssistantMessage().content
        // 改善されたテキストを整形し、最終的な整形結果を返すための最後のLLM呼び出し
        requestLLM("Format the result as bold.").asAssistantMessage().content
    }
)

// ユーザー入力でエージェントを実行し、結果を出力します
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-02.kt -->

エージェントは次のような出力を生成します：

```
When multiplying 12 by 9, we can break it down as follows:

**12 (tens) × 9 = 108**

Alternatively, we can also use the distributive property to calculate this:

**(10 + 2) × 9**
= **10 × 9 + 2 × 9**
= **90 + 18**
= **108**
```

## ツールの追加

多くの場合、関数型エージェントはデータの読み書きやAPIの呼び出しなど、特定のタスクを完了させる必要があります。
Koogでは、このような機能をツールとして公開し、エージェントロジック内でLLMにそれらを呼び出させることができます。

この章では、上記で作成した最小限の関数型エージェントを取り上げ、ツールを使用してエージェントロジックを拡張する方法を示します。

1) アノテーションベースのツールを作成します。詳細は [アノテーションベースのツール](annotation-based-tools.md) を参照してください。

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

利用可能なツールの詳細については、[ツールの概要](tools-overview.md) を参照してください。

2) ツールを登録して、エージェントが利用できるようにします。

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

3) ツールレジストリをエージェントに渡し、LLMが利用可能なツールを要求して使用できるようにします。

4) エージェントロジックを拡張して、ツール呼び出しを識別し、要求されたツールを実行し、その結果をLLMに返し、ツール呼び出しがなくなるまでプロセスを繰り返します。

!!! note
    LLMがツール呼び出しを発行し続ける場合にのみループを使用してください。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
    strategy = functionalStrategy { input -> // ツール呼び出しで拡張されたエージェントロジックを定義します
        // ユーザー入力をLLMに送信します
        var responses = requestLLMMultiple(input)

        // LLMがツールを要求している間だけループします
        while (responses.containsToolCalls()) {
            // レスポンスからツール呼び出しを抽出します
            val pendingCalls = extractToolCalls(responses)
            // ツールを実行して結果を返します
            val results = executeMultipleTools(pendingCalls)
            // ツールの結果をLLMに送り返します。LLMはさらにツールを呼び出すか、最終的な出力を返す場合があります
            responses = sendMultipleToolResults(results)
        }

        // ツール呼び出しがなくなったら、レスポンスからアシスタントメッセージの内容を抽出して返します
        responses.single().asAssistantMessage().content
    }
)

// ユーザー入力でエージェントを実行し、結果を出力します
val reply = mathWithTools.run("Please multiply 12.5 and 4, then add 10 to the result.")
println(reply)
```
<!--- KNIT example-functional-agent-05.kt -->

エージェントは次のような出力を生成します：

```
Here is the step-by-step solution:

1. Multiply 12.5 and 4:
   12.5 × 4 = 50

2. Add 10 to the result:
   50 + 10 = 60
```

## 次のステップ

- [構造化出力API](structured-output.md) を使用して構造化データを返す方法を学びます。
- エージェントにさらに [ツール](tools-overview.md) を追加して試してみてください。
- [EventHandler](agent-events.md) 機能を使用してオブザーバビリティを向上させます。
- [履歴の圧縮](history-compression.md) を使用して、長期にわたる会話を処理する方法を学びます。