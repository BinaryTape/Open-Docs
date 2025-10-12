# 基於類別的工具

本節說明專為需要增強靈活性和自訂行為的場景而設計的 API。透過這種方法，您可以完全控制一個工具，包括其參數、中繼資料、執行邏輯，以及如何註冊和呼叫它。

這種程度的控制非常適合建立能擴展基本使用案例的複雜工具，實現與代理程式會話和工作流程的無縫整合。

本頁說明如何實作工具、透過登錄檔管理工具、呼叫它們，以及在基於節點的代理程式架構中使用。

!!! note
    此 API 為多平台。這讓您可以在不同平台間使用相同的工具。

## 工具實作

Koog 框架提供以下實作工具的方法：

*   使用 `Tool` 作為所有工具的基礎類別。當您需要傳回非文字結果或需要完全控制工具行為時，應使用此類別。
*   使用 `SimpleTool` 類別，它擴展了基礎 `Tool` 類別，並簡化了傳回文字結果的工具建立。當工具只需要傳回文字時，應使用此方法。

這兩種方法都使用相同的核心元件，但在實作和傳回結果方面有所不同。

### Tool 類別

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象類別是 Koog 中建立工具的基礎類別。它讓您可以建立接受特定引數類型 (`Args`) 並傳回各種類型結果 (`Result`) 的工具。

每個工具包含以下元件：

| <div style="width:110px">元件</div> | 描述                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定義工具所需引數的可序列化資料類別。                                                                                                                                                                                                                                                                                                                                                                                           |
| `Result`                                 | 工具傳回的可序列化結果類型。如果您想以自訂格式呈現工具結果，請繼承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) 類別並實作 `textForLLM(): String` 方法。                                                                                                          |
| `argsSerializer`                         | 定義工具引數如何反序列化的覆寫變數。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                                                                                                                                                                                     |
| `resultSerializer`                       | 定義工具結果如何反序列化的覆寫變數。另請參閱 [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html)。如果您選擇繼承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html)，請考慮使用 `ToolResultUtils.toTextSerializer()`。 |
| `descriptor`                             | 指定工具中繼資料的覆寫變數：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (預設為空)<br/>- `optionalParameters` (預設為空)<br/>另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                                                                                                                                                                                             |
| `execute()`                              | 實作工具邏輯的函式。它接受類型為 `Args` 的引數並傳回類型為 `Result` 的結果。另請參閱 [execute()]()。                                                                                                                                                                                                                                                                                                                                               |

!!! tip
    請確保您的工具具有清晰的描述和定義明確的參數名稱，以便 LLM 更容易理解和正確使用它們。

#### 使用範例

以下是使用 `Tool` 類別並傳回數值結果的自訂工具實作範例：

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription
-->
```kotlin
// 實作一個簡單的計算機工具，可以加兩個數字
object CalculatorTool : Tool<CalculatorTool.Args, Int>() {
    
    // 計算機工具的引數
    @Serializable
    data class Args(
        @property:LLMDescription("The first digit to add (0-9)")
        val digit1: Int,
        @property:LLMDescription("The second digit to add (0-9)")
        val digit2: Int
    ) {
        init {
            require(digit1 in 0..9) { "digit1 must be a single digit (0-9)" }
            require(digit2 in 0..9) { "digit2 must be a single digit (0-9)" }
        }
    }

    // Args 類別的序列化器
    override val argsSerializer = Args.serializer()
    override val resultSerializer = Int.serializer()
    
    // 工具的名稱，LLM 可見 (預設將從類別名稱衍生)
    override val name = "calculator"
    // 工具的描述，LLM 可見。必填
    override val description = "A simple calculator that can add two digits (0-9)."

    // 加兩個數字的函式
    override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

實作工具後，您需要將其新增到工具登錄檔中，然後與代理程式一起使用。有關詳細資訊，請參閱 [工具登錄檔](tools-overview.md#tool-registry)。

有關更多詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

### SimpleTool 類別

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象類別擴展了 `Tool<Args, ToolResult.Text>`，並簡化了傳回文字結果的工具建立。

每個簡單工具包含以下元件：

| <div style="width:110px">元件</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定義自訂工具所需引數的可序列化資料類別。                                                                                                                                                                                                                                                        |
| `argsSerializer`                         | 定義工具引數如何序列化的覆寫變數。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                             | 指定工具中繼資料的覆寫變數：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (預設為空)<br/> - `optionalParameters` (預設為空)<br/> 另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                            | 描述工具執行主要動作的覆寫函式。它接受類型為 `Args` 的引數並傳回 `String`。另請參閱 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! tip
    請確保您的工具具有清晰的描述和定義明確的參數名稱，以便 LLM 更容易理解和正確使用它們。

#### 使用範例

以下是使用 `SimpleTool` 的自訂工具實作範例：

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.Serializable
-->
```kotlin
// 建立一個將字串表達式轉換為雙精度浮點數值的工具
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>() {
    // 定義工具引數
    @Serializable
    data class Args(
        @property:LLMDescription("An expression to case to double")
        val expression: String,
        @property:LLMDescription("A comment on how to process the expression")
        val comment: String
    )

    // Args 類別的序列化器
    override val argsSerializer = Args.serializer()

    // 工具的描述，LLM 可見
    override val description = "將傳入的表達式轉換為雙精度浮點數，如果無法轉換則傳回 0.0"
    
    // 使用提供的引數執行工具的函式
    override suspend fun doExecute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }
    
    // 將字串表達式轉換為雙精度浮點數值的函式
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

### 以自訂格式將工具結果傳送至 LLM

如果您對傳送給 LLM 的 JSON 結果不滿意 (例如，在某些情況下，如果工具輸出結構化為 Markdown，LLM 能更好地運作)，您必須遵循以下步驟：
1. 實作 `ToolResult.TextSerializable` 介面，並覆寫 `textForLLM()` 方法
2. 使用 `ToolResultUtils.toTextSerializer<T>()` 覆寫 `resultSerializer`

#### 範例

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.prompt.markdown.markdown
-->
```kotlin
// 一個編輯檔案的工具
object EditFile : Tool<EditFile.Args, EditFile.Result>() {
    // 定義工具引數
    @Serializable
    public data class Args(
        val path: String,
        val original: String,
        val replacement: String
    )

    @Serializable
    public data class Result(
        private val patchApplyResult: PatchApplyResult
    ) {

        @Serializable
        public sealed interface PatchApplyResult {
            @Serializable
            public data class Success(val updatedContent: String) : PatchApplyResult

            @Serializable
            public sealed class Failure(public val reason: String) : PatchApplyResult
        }

        // 工具完成後，LLM 將會看見的文字輸出 (Markdown 格式)。
        fun textForLLM(): String = markdown {
            if (patchApplyResult is PatchApplyResult.Success) {
                line {
                    bold("Successfully").text(" edited file (patch applied)")
                }
            } else {
                line {
                    text("File was ")
                        .bold("not")
                        .text(" modified (patch application failed: ${(patchApplyResult as PatchApplyResult.Failure).reason})")
                }
            }
        }

        override fun toString(): String = textForLLM()
    }

    // args 和 Result 類別的序列化器
    override val argsSerializer = Args.serializer()
    override val resultSerializer = Result.serializer()

    // 工具的描述，LLM 可見
    override val description = "Edits the given file"

    // 使用提供的引數執行工具的函式
    override suspend fun execute(args: Args): Result {
        return TODO("實作檔案編輯")
    }
}
```
<!--- KNIT example-class-based-tools-03.kt -->

實作工具後，您需要將其新增到工具登錄檔中，然後與代理程式一起使用。有關詳細資訊，請參閱 [工具登錄檔](tools-overview.md#tool-registry)。