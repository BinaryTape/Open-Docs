# 以類別為基礎的工具

本節說明專為需要更高靈活度與自訂行為的情境而設計的 API。
透過這種方式，您可以完全控制工具，包括其參數、元資料、執行邏輯，以及如何註冊與叫用工具。

這種程度的控制非常適合建立擴展基本使用案例的複雜工具，進而實現與代理程式工作階段和工作流程的無縫整合。

本頁面說明如何實作工具、透過註冊表管理工具、呼叫工具，以及在以節點為基礎的代理程式架構中使用工具。

!!! note
    此 API 是多平台的。這讓您可以在不同的平台間使用相同的工具。

## 工具實作

Koog 架構提供以下實作工具的方法：

* 為所有工具使用基底類別 `Tool`。當您需要傳回非文字結果或需要完全控制工具行為時，應使用此類別。
* 使用擴展自 `Tool` 基底類別的 `SimpleTool` 類別，其簡化了傳回文字結果的工具建立過程。對於工具僅需傳回文字的情境，您應使用此方法。

這兩種方法都使用相同的核心元件，但在實作和傳回的結果方面有所不同。

### Tool 類別

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象類別是 Koog 中建立工具的基底類別。
它讓您可以建立接受特定引數型別 (`Args`) 並傳回各種型別結果 (`Result`) 的工具。

每個工具由以下組件組成：

| <div style="width:110px">組件</div> | 描述                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定義工具所需引數的可序列化資料類別。                                                                                                                                                                                                                                                                                                                                                                                           |
| `Result`                                 | 工具傳回結果的可序列化型別。如果您想要以自訂格式呈現工具結果，請繼承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) 類別並實作 `textForLLM(): String` 方法。                                                                                                          |
| `argsSerializer`                         | 覆寫的變數，定義如何還原序列化工具的引數。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                          |
| `resultSerializer`                       | 覆寫的變數，定義如何還原序列化工具的結果。另請參閱 [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html)。如果您選擇繼承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html)，請考慮使用 `ToolResultUtils.toTextSerializer()`。 |
| `descriptor`                             | 覆寫的變數，指定工具元資料：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (預設為空)<br/>- `optionalParameters` (預設為空)<br/>另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                                                                                                                               |
| `execute()`                              | 實作工具邏輯的函式。它接受型別為 `Args` 的引數並傳回型別為 `Result` 的結果。另請參閱 [execute()]()。                                                                                                                                                                                                                                                                                 |

!!! tip
    請確保您的工具具有清晰的描述和定義良好的參數名稱，以便 LLM 更容易理解並正確使用它們。

#### 使用範例

以下是使用 `Tool` 類別實作自訂工具的範例，該工具會傳回數值結果：

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
-->
```kotlin
// 實作一個簡單的計算機工具，可將兩個數字相加
object CalculatorTool : Tool<CalculatorTool.Args, Int>(
    argsType = typeToken<Args>(),
    resultType = typeToken<Int>(),
    name = "calculator",
    description = "A simple calculator that can add two digits (0-9)."
) {

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

    // 將兩個數字相加的函式
    override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

實作工具後，您需要將其新增至工具註冊表，然後與代理程式搭配使用。詳情請參閱[工具註冊表](tools-overview.md#tool-registry)。

欲了解更多詳情，請參閱 [API 參考文件](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

### SimpleTool 類別

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象類別擴展了 `Tool<Args, ToolResult.Text>`，並簡化了傳回文字結果的工具建立過程。

每個簡單工具由以下組件組成：

| <div style="width:110px">組件</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定義自訂工具所需引數的可序列化資料類別。                                                                                                                                                                                                                         |
| `argsSerializer`                         | 覆寫的變數，定義如何序列化工具的引數。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                             | 覆寫的變數，指定工具元資料：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (預設為空)<br/> - `optionalParameters` (預設為空)<br/> 另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                            | 覆寫的函式，描述工具執行的主要操作。它接受型別為 `Args` 的引數並傳回一個 `String`。另請參閱 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! tip
    請確保您的工具具有清晰的描述 and 定義良好的參數名稱，以便 LLM 更容易理解並正確使用它們。

#### 使用範例 

以下是使用 `SimpleTool` 實作自訂工具的範例：

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
-->
```kotlin
// 建立一個將字串運算式轉換為 double 值的工具
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(
    argsType = typeToken<Args>(),
    name = "cast_to_double",
    description = "casts the passed expression to double or returns 0.0 if the expression is not castable"
) {
    // 定義工具引數
    @Serializable
    data class Args(
        @property:LLMDescription("An expression to case to double")
        val expression: String,
        @property:LLMDescription("A comment on how to process the expression")
        val comment: String
    )

    // 使用提供的引數執行工具的函式
    override suspend fun execute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }

    // 將字串運算式轉換為 double 值的函式
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

### 以自訂格式將工具結果傳送至 LLM

如果您對傳送至 LLM 的 JSON 結果不滿意（在某些情況下，如果工具輸出結構化為 Markdown 等格式，LLM 的運作效果可能會更好），您必須遵循以下步驟：
1. 實作 `ToolResult.TextSerializable` 介面，並覆寫 `textForLLM()` 方法
2. 使用 `ToolResultUtils.toTextSerializer<T>()` 覆寫 `resultSerializer`

#### 範例

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.prompt.markdown.markdown
-->
```kotlin
// 編輯檔案的工具
object EditFile : Tool<EditFile.Args, EditFile.Result>(
    argsType = typeToken<Args>(),
    resultType = typeToken<Result>(),
    name = "edit_file",
    description = "Edits the given file"
) {
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

        // 工具完成後 LLM 可見的文字輸出（Markdown 格式）。
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

    // 使用提供的引數執行工具的函式
    override suspend fun execute(args: Args): Result {
        return TODO("Implement file edit")
    }
}
```
<!--- KNIT example-class-based-tools-03.kt -->

實作工具後，您需要將其新增至工具註冊表，然後與代理程式搭配使用。
詳情請參閱[工具註冊表](tools-overview.md#tool-registry)。