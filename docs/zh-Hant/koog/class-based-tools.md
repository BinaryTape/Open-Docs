# 基於類別的工具

本節說明針對需要增強靈活性和自訂行為的場景而設計的 API。透過這種方法，您可以完全控制一個工具，包括其參數、中繼資料、執行邏輯，以及如何註冊和呼叫它。

這種程度的控制非常適合建立能擴展基本使用案例的複雜工具，實現與代理程式會話和工作流程的無縫整合。

本頁說明如何實作工具、透過登錄檔管理工具、呼叫它們，以及在基於節點的代理程式架構中使用。

!!! note
    此 API 為多平台。這讓您可以在不同平台間使用相同的工具。

## 工具實作

Koog 框架提供以下實作工具的方法：

*   將 `Tool` 作為所有工具的基礎類別。當您需要傳回非文字結果或需要完全控制工具行為時，應使用此類別。
*   使用 `SimpleTool` 類別，它擴展了基礎 `Tool` 類別，並簡化了傳回文字結果的工具建立。當工具只需要傳回文字時，應使用此方法。

這兩種方法都使用相同的核心元件，但在實作和傳回結果方面有所不同。

### Tool 類別

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象類別是 Koog 中建立工具的基礎類別。它讓您可以建立接受特定引數類型 (`Args`) 並傳回各種類型結果 (`Result`) 的工具。

每個工具包含以下元件：

| <div style="width:110px">元件</div> | 描述                                                                                                                                                                                                                                                                                                                   |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                             | 定義工具所需引數的可序列化資料類別。此類別必須實作 [`ToolArgs`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/-args/index.html) 介面。對於不需要引數的工具，您可以使用內建的 `ToolArgs.Empty` 實作。 |
| `Result`                           | 工具傳回的結果類型。這必須實作 [`ToolResult`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/index.html) 介面，該介面可以是 `ToolResult.Text`、`ToolResult.Boolean`、`ToolResult.Number` 或 `ToolResult.JSONSerializable` 的自訂實作。 |
| `argsSerializer`                   | 定義工具引數如何反序列化的覆寫變數。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                  |
| `descriptor`                       | 指定工具中繼資料的覆寫變數：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (預設為空)<br/>- `optionalParameters` (預設為空)<br/>另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                        |
| `execute()`                        | 實作工具邏輯的函式。它接受類型為 `Args` 的引數並傳回類型為 `Result` 的結果。另請參閱 [execute()]()。                                                                                                                                         |

!!! tip
    請確保您的工具具有清晰的描述和定義明確的參數名稱，以便 LLM 更容易理解和正確使用它們。

#### 使用範例

以下是使用 `Tool` 類別並傳回數值結果的自訂工具實作範例：

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.tools.ToolResult
import kotlinx.serialization.Serializable
-->
```kotlin
// Implement a simple calculator tool that adds two digits
object CalculatorTool : Tool<CalculatorTool.Args, ToolResult.Number>() {
    
    // Arguments for the calculator tool
    @Serializable
    data class Args(
        val digit1: Int,
        val digit2: Int
    ) : ToolArgs {
        init {
            require(digit1 in 0..9) { "digit1 must be a single digit (0-9)" }
            require(digit2 in 0..9) { "digit2 must be a single digit (0-9)" }
        }
    }

    // Serializer for the Args class
    override val argsSerializer = Args.serializer()

    // Tool descriptor
    override val descriptor: ToolDescriptor = ToolDescriptor(
        name = "calculator",
        description = "A simple calculator that can add two digits (0-9).",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "digit1",
                description = "The first digit to add (0-9)",
                type = ToolParameterType.Integer
            ),
            ToolParameterDescriptor(
                name = "digit2",
                description = "The second digit to add (0-9)",
                type = ToolParameterType.Integer
            )
        )
    )

    // Function to add two digits
    override suspend fun execute(args: Args): ToolResult.Number {
        val sum = args.digit1 + args.digit2
        return ToolResult.Number(sum)
    }
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

實作工具後，您需要將其新增到工具登錄檔中，然後與代理程式一起使用。有關詳細資訊，請參閱 [工具登錄檔](tools-overview.md#tool-registry)。

有關更多詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

### SimpleTool 類別

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象類別擴展了 `Tool<Args, ToolResult.Text>`，並簡化了傳回文字結果的工具建立。

每個簡單工具包含以下元件：

| <div style="width:110px">元件</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                             | 定義自訂工具所需引數的可序列化資料類別。                                                                                                                                                                                                                                                        |
| `argsSerializer`                   | 定義工具引數如何序列化的覆寫變數。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                       | 指定工具中繼資料的覆寫變數：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (預設為空)<br/>- `optionalParameters` (預設為空)<br/>另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                      | 描述工具執行主要動作的覆寫函式。它接受類型為 `Args` 的引數並傳回 `String`。另請參閱 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! tip
    請確保您的工具具有清晰的描述和定義明確的參數名稱，以便 LLM 更容易理解和正確使用它們。

#### 使用範例 

以下是使用 `SimpleTool` 的自訂工具實作範例：

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
-->
```kotlin
// Create a tool that casts a string expression to a double value
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>() {
    // Define tool arguments
    @Serializable
    data class Args(val expression: String, val comment: String) : ToolArgs

    // Serializer for the Args class
    override val argsSerializer = Args.serializer()

    // Tool descriptor
    override val descriptor = ToolDescriptor(
        name = "cast_to_double",
        description = "casts the passed expression to double or returns 0.0 if the expression is not castable",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "expression", description = "An expression to case to double", type = ToolParameterType.String
            )
        ),
        optionalParameters = listOf(
            ToolParameterDescriptor(
                name = "comment",
                description = "A comment on how to process the expression",
                type = ToolParameterType.String
            )
        )
    )
    
    // Function that executes the tool with the provided arguments
    override suspend fun doExecute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }
    
    // Function to cast a string expression to a double value
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

實作工具後，您需要將其新增到工具登錄檔中，然後與代理程式一起使用。有關詳細資訊，請參閱 [工具登錄檔](tools-overview.md#tool-registry)。