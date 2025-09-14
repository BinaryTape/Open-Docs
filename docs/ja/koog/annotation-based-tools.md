# アノテーションベースのツール

アノテーションベースのツールは、大規模言語モデル（LLM）に機能をツールとして公開するための宣言的な方法を提供します。
アノテーションを使用することで、任意の関数をLLMが理解し、利用できるツールに変換できます。

このアプローチは、ツール記述を手動で実装することなく、既存の機能をLLMに公開する必要がある場合に役立ちます。

!!! note
    アノテーションベースのツールはJVM専用であり、他のプラットフォームでは利用できません。マルチプラットフォームサポートについては、[クラスベースのツールAPI](class-based-tools.md)を使用してください。

## 主要なアノテーション

プロジェクトでアノテーションベースのツールを使い始めるには、以下の主要なアノテーションを理解する必要があります。

| アノテーション        | 説明                                                             |
|-------------------|-------------------------------------------------------------------------|
| `@Tool`           | LLMにツールとして公開すべき関数をマークします。                |
| `@LLMDescription` | ツールとそのコンポーネントに関する記述情報を提供します。 |

## @Toolアノテーション

`@Tool`アノテーションは、LLMにツールとして公開すべき関数をマークするために使用されます。
`@Tool`でアノテーションされた関数は、`ToolSet`インターフェースを実装するオブジェクトからリフレクションによって収集されます。詳細については、「[ToolSetインターフェースの実装](#implement-the-toolset-interface)」を参照してください。

### 定義

<!--- INCLUDE
-->
```kotlin
@Target(AnnotationTarget.FUNCTION)
public annotation class Tool(val customName: String = "")
```
<!--- KNIT example-annotation-based-tools-01.kt -->

### パラメーター

| <div style="width:100px">名前</div> | 必須 | 説明                                                                              |
|-------------------------------------|----------|------------------------------------------------------------------------------------------|
| `customName`                        | いいえ       | ツールにカスタム名を指定します。指定しない場合、関数の名前が使用されます。 |

### 使用法

関数をツールとしてマークするには、`ToolSet`インターフェースを実装するクラスでその関数に`@Tool`アノテーションを適用します。
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyToolSet : ToolSet {
    @Tool
    fun myTool(): String {
        // ツール実装
        return "Result"
    }

    @Tool(customName = "customToolName")
    fun anotherTool(): String {
        // ツール実装
        return "Result"
    }
}
```
<!--- KNIT example-annotation-based-tools-02.kt -->

## @LLMDescriptionアノテーション

`@LLMDescription`アノテーションは、コード要素（クラス、関数、パラメーターなど）に関する記述情報をLLMに提供します。
これにより、LLMはこれらの要素の目的と使用法を理解するのに役立ちます。

### 定義

<!--- INCLUDE
-->
```kotlin
@Target(
    AnnotationTarget.PROPERTY,
    AnnotationTarget.CLASS,
    AnnotationTarget.PROPERTY,
    AnnotationTarget.TYPE,
    AnnotationTarget.VALUE_PARAMETER,
    AnnotationTarget.FUNCTION
)
public annotation class LLMDescription(val description: String)
```
<!--- KNIT example-annotation-based-tools-03.kt -->

### パラメーター

| 名前          | 必須 | 説明                                    |
|---------------|----------|------------------------------------------------|
| `description` | はい      | アノテーションされた要素を記述する文字列。 |

### 使用法

`@LLMDescription`アノテーションは、さまざまなレベルで適用できます。例：

* 関数レベル：
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("Performs a specific operation and returns the result")
fun myTool(): String {
    // 関数実装
    return "Result"
}
```
<!--- KNIT example-annotation-based-tools-04.kt -->

* パラメーターレベル：

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("Processes input data")
fun processTool(
    @LLMDescription("The input data to process")
    input: String,

    @LLMDescription("Optional configuration parameters")
    config: String = ""
): String {
    // 関数実装
    return "Processed: $input with config: $config"
}
```
<!--- KNIT example-annotation-based-tools-05.kt -->

## ツールの作成

### 1. ToolSetインターフェースを実装する

[`ToolSet`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools.reflect/-tool-set/index.html)インターフェースを実装するクラスを作成します。
このインターフェースは、クラスがツールのコンテナーであることを示します。

<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    // ここにツールを追加します
}
```
<!--- KNIT example-annotation-based-tools-06.kt -->

### 2. ツール関数を追加する

クラスに関数を追加し、`@Tool`でアノテーションを付けてツールとして公開します。

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    @Tool
    fun getWeather(location: String): String {
        // 実際の実装では、天気APIを呼び出すことになります
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-07.kt -->

### 3. 説明を追加する

LLMにコンテキストを提供するために、`@LLMDescription`アノテーションを追加します。
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@LLMDescription("Tools for getting weather information")
class MyFirstToolSet : ToolSet {
    @Tool
    @LLMDescription("Get the current weather for a location")
    fun getWeather(
        @LLMDescription("The city and state/country")
        location: String
    ): String {
        // 実際の実装では、天気APIを呼び出すことになります
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-08.kt -->

### 4. エージェントでツールを使用する

これで、エージェントでツールを使用できるようになります。
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.example.exampleAnnotationBasedTools06.MyFirstToolSet
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

const val apiToken = ""
-->
```kotlin
fun main() {
    runBlocking {
        // ツールセットを作成します
        val weatherTools = MyFirstToolSet()

        // ツールを使用してエージェントを作成します

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiToken),
            systemPrompt = "Provide weather information for a given location.",
            llmModel = OpenAIModels.Chat.GPT4o,
            toolRegistry = ToolRegistry {
                tools(weatherTools)
            }
        )

        // エージェントが天気ツールを使用できるようになります
        agent.run("What's the weather like in New York?")
    }
}
```
<!--- KNIT example-annotation-based-tools-09.kt -->

## 使用例

ここでは、ツールアノテーションの実際の使用例をいくつか紹介します。

### 基本的な例: スイッチコントローラー

この例は、スイッチを制御するためのシンプルなツールセットを示しています。
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool

class Switch(private var state: Boolean) {
    fun switch(state: Boolean) {
        this.state = state
    }
    
    fun isOn(): Boolean {
        return state
    }
}
-->
```kotlin
@LLMDescription("Tools for controlling a switch")
class SwitchTools(val switch: Switch) : ToolSet {
    @Tool
    @LLMDescription("Switches the state of the switch")
    fun switch(
        @LLMDescription("The state to set (true for on, false for off)")
        state: Boolean
    ): String {
        switch.switch(state)
        return "Switched to ${if (state) "on" else "off"}"
    }

    @Tool
    @LLMDescription("Returns the current state of the switch")
    fun switchState(): String {
        return "Switch is ${if (switch.isOn()) "on" else "off"}"
    }
}
```
<!--- KNIT example-annotation-based-tools-10.kt -->

LLMがスイッチを制御する必要がある場合、提供された記述から以下の情報を理解できます。

*   ツールの目的と機能。
*   ツールを使用するために必要なパラメーター。
*   各パラメーターに許容される値。
*   実行時に期待される戻り値。

### 高度な例: 診断ツール

この例は、デバイスの診断のためのより複雑なツールセットを示しています。
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@LLMDescription("Tools for performing diagnostics and troubleshooting on devices")
class DiagnosticToolSet : ToolSet {
    @Tool
    @LLMDescription("Run diagnostic on a device to check its status and identify any issues")
    fun runDiagnostic(
        @LLMDescription("The ID of the device to diagnose")
        deviceId: String,

        @LLMDescription("Additional information for the diagnostic (optional)")
        additionalInfo: String = ""
    ): String {
        // 実装
        return "Diagnostic results for device $deviceId"
    }

    @Tool
    @LLMDescription("Analyze an error code to determine its meaning and possible solutions")
    fun analyzeError(
        @LLMDescription("The error code to analyze (e.g., 'E1001')")
        errorCode: String
    ): String {
        // 実装
        return "Analysis of error code $errorCode"
    }
}
```
<!--- KNIT example-annotation-based-tools-11.kt -->

## ベストプラクティス

*   **明確な説明を提供する**: ツール、パラメーター、および戻り値の目的と動作を説明する、明確で簡潔な説明を記述します。
*   **すべてのパラメーターを記述する**: LLMが各パラメーターの目的を理解できるよう、すべてのパラメーターに`@LLMDescription`を追加します。
*   **一貫した命名を使用する**: ツールとパラメーターに一貫した命名規則を使用し、より直感的にします。
*   **関連ツールをグループ化する**: 関連するツールを同じ`ToolSet`実装にグループ化し、クラスレベルの記述を提供します。
*   **情報量の多い結果を返す**: ツールの戻り値が操作の結果に関する明確な情報を提供するようにします。
*   **エラーを適切に処理する**: ツールにエラー処理を含め、情報量の多いエラーメッセージを返します。
*   **デフォルト値を文書化する**: パラメーターにデフォルト値がある場合は、記述にそれを文書化します。
*   **ツールを集中させる**: 各ツールは、多くのことを一度に行うのではなく、特定の明確に定義されたタスクを実行するようにします。

## よくある問題のトラブルシューティング

ツールアノテーションを使用する際、いくつかのよくある問題に遭遇する可能性があります。

### ツールが認識されない

エージェントがツールを認識しない場合は、以下を確認してください。

*   クラスが`ToolSet`インターフェースを実装していること。
*   すべてのツール関数が`@Tool`でアノテーションされていること。
*   ツール関数が適切な戻り値の型を持っていること（簡潔さのために`String`が推奨されます）。
*   ツールがエージェントに正しく登録されていること。

### 不明瞭なツール記述

LLMがツールを正しく使用しない、または目的を誤解している場合は、以下を試してください。

*   `@LLMDescription`アノテーションをより具体的かつ明確にするように改善します。
*   適切な場合は、記述に例を含めます。
*   記述にパラメーターの制約（例：「"正の数である必要があります"」）を指定します。
*   記述全体で一貫した用語を使用します。

### パラメーターの型に関する問題

LLMが誤ったパラメーターの型を提供する場合、以下を試してください。

*   可能な場合は、シンプルなパラメーターの型（`String`、`Boolean`、`Int`）を使用します。
*   パラメーター記述で期待される形式を明確に記述します。
*   複雑な型の場合は、特定の形式を持つ`String`パラメーターを使用し、ツール内でそれらを解析することを検討します。
*   パラメーター記述に有効な入力例を含めます。

### パフォーマンスの問題

ツールがパフォーマンスの問題を引き起こす場合は、以下を試してください。

*   ツールの実装を軽量に保ちます。
*   リソースを大量に消費する操作の場合は、非同期処理の実装を検討します。
*   適切な場合は結果をキャッシュします。
*   ボトルネックを特定するためにツールの使用状況をログに記録します。