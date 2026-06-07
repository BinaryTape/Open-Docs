# 以類別為基礎的工具

本節說明針對需要增強的靈活性與自定義行為之案例所設計的 API。
在 Kotlin 中使用此方法，您可以完全控制工具，包括其參數、元資料、執行邏輯以及如何註冊與叫用。在 Java 中，工具是使用基於註解的方法與基於反射的註冊來建立的。

這種程度的控制非常適合建立擴展基本使用案例的複雜工具，並能無縫整合到代理工作階段與工作流程中。

此頁面描述如何在 Kotlin 與 Java 中實作工具、透過註冊表管理工具、呼叫工具，以及在基於節點的代理架構中使用工具。

!!! note
    此 API 對 Kotlin 是跨平台的。Java 工具是使用基於註解的方法實作，並透過反射註冊。這讓您可以在 Kotlin 的不同平台間使用相同的工具，而 Java 則提供完整的 JVM 互通性。

## 工具實作

Koog 架構提供以下實作工具的方法：

對於 Kotlin：

* 使用所有工具的基底類別 `Tool`。當您需要傳回非文字結果或需要完全控制工具行為時，應使用此類別。
* 使用擴展自 `Tool` 基底類別的 `SimpleTool` 類別，它簡化了傳回文字結果之工具的建立。您應該在工具僅需傳回字串的情況下使用此方法。

這兩種方法都使用相同的核心組建，但在實作與傳回的結果上有所不同。

對於 Java：

* 使用基於註解的方法（`@Tool` 與 `@LLMDescription`）與基於反射的註冊。這是 Java 互通性的建議方法，因為由於暫停函式的限制，不支援從 Java 繼承 Kotlin 的 `Tool` 或 `SimpleTool` 子類別。

### Tool 類別 (Kotlin)

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象類別是 Kotlin 中建立工具的基底類別。
它讓您建立接受特定引數型別 (`Args`) 並傳回各種型別結果 (`Result`) 的工具。

每個工具由以下組建組成：

| <div style="width:110px">組建</div> | 描述                                                                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定義工具所需引數的可序列化資料類別。                                                                                                                                                                                                                                                                                                                                                             |
| `Result`                                 | 工具傳回之結果的可序列化型別。如果您想要以自定義格式呈現工具結果，請繼承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) 類別並實作 `textForLLM(): String` 方法。                                                                                                           |
| `argsSerializer`                         | 已覆寫的變數，定義工具引數如何反序列化。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                                                                                                                        |
| `resultSerializer`                       | 已覆寫的變數，定義工具結果如何反序列化。另請參閱 [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html)。如果您選擇繼承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html)，請考慮使用 `ToolResultUtils.toTextSerializer()`。 |
| `descriptor`                             | 指定工具元資料的已覆寫變數：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（預設為空）<br/>- `optionalParameters`（預設為空）<br/>另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                                                                                                                                |
| `execute()`                              | 實作工具邏輯的函式。它接收型別為 `Args` 的引數並傳回型別為 `Result` 的結果。另請參閱 [execute()]()。                                                                                                                                                                                                                                                                                  |

!!! note "Java 實作"
    在 Java 中，請使用帶有 `@Tool` 與 `@LLMDescription` 的基於註解的方法，而非繼承 `Tool<Args, Result>`。架構會透過反射自動處理序列化與註冊。如需更多詳細資訊，請參閱下方的[基於註解的方法 (Java)](#annotation-based-methods-java)。

!!! tip
    確保您的工具有清楚的描述與定義良好的參數名稱，以便讓 LLM 更容易理解並正確使用它們。在 Kotlin 中使用 `descriptor` 屬性；在 Java 中使用 `@LLMDescription` 註解。

#### 使用範例

以下是使用 `Tool` 類別實作自定義工具並傳回數值結果的範例：

=== "Kotlin"

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
    // 實作一個簡單的計算器工具來將兩個數字相加
    object CalculatorTool : Tool<CalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "calculator",
        description = "一個簡單的計算器，可以將兩個數字相加 (0-9)。"
    ) {

        // 計算器工具的引數
        @Serializable
        data class Args(
            @property:LLMDescription("第一個要相加的數字 (0-9)")
            val digit1: Int,
            @property:LLMDescription("第二個要相加的數字 (0-9)")
            val digit2: Int
        ) {
            init {
                require(digit1 in 0..9) { "digit1 必須是單個數字 (0-9)" }
                require(digit2 in 0..9) { "digit2 必須是單個數字 (0-9)" }
            }
        }

        // 相加兩個數字的函式
        override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
    }
    ```
    <!--- KNIT example-class-based-tools-01.kt -->

實作工具後，您需要將其新增至工具註冊表，然後搭配代理使用。詳細資訊請參閱[工具註冊表](../tools/index.md#tool-registry)。

如需更多詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

#### 從工具讀取代理內容

需要代理完整狀態（LLM 內容、執行 ID、配置、存儲等）的工具應繼承 `AgentContextAwareTool<Args, Result>` 而非 `Tool<Args, Result>`。架構會注入驅動呼叫的即時 `AIAgentContext`，工具會將其作為具型別的參數接收，而不是從引數架構中讀取。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.context.AIAgentContext
    import ai.koog.agents.core.agent.tools.AgentContextAwareTool
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    // 讀取驅動呼叫的即時 AIAgentContext 的工具。
    object TracingCalculatorTool : AgentContextAwareTool<TracingCalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "tracing_calculator",
        description = "將兩個數字相加並發出一行標記有代理執行 ID 的日誌。"
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("第一個要相加的數字 (0-9)")
            val digit1: Int,
            @property:LLMDescription("第二個要相加的數字 (0-9)")
            val digit2: Int
        )

        override suspend fun execute(args: Args, context: AIAgentContext): Int {
            val runId = context.runId
            // ... 將 runId 用於橫切內容 (日誌、執行緒、關聯)
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-01.kt -->

`AgentContextAwareTool` 由架構透過每個呼叫的 `ToolCallMetadata` 側向通道進行調度，該通道由架構代表工具進行管理。在代理執行之外叫用此類工具會拋出 `IllegalStateException`，因為沒有注入 `AIAgentContext`；正式環境程式碼應一律透過 `ContextualAgentEnvironment`，單元測試則可以透過 `ToolCallMetadata.of(AgentContextAwareTool.AgentContextKey to context)` 明確提供內容。

#### 讀取原始的單次呼叫元資料

少數工具希望讀取由呼叫者或功能貢獻的 *非* 代理內容項目（例如由觀測功能貢獻的分散式執行緒 span ID）。這些工具直接繼承 `ToolBase<Args, Result>`，它會公開完整的 `ToolCallMetadata` 包：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolBase
    import ai.koog.agents.core.tools.ToolCallMetadata
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    object SpanAwareCalculatorTool : ToolBase<SpanAwareCalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "span_aware_calculator",
        description = "將兩個數字相加，從呼叫者或功能元資料傳遞追蹤 span ID。"
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("第一個要相加的數字 (0-9)")
            val digit1: Int,
            @property:LLMDescription("第二個要相加的數字 (0-9)")
            val digit2: Int
        )

        override suspend fun execute(args: Args, metadata: ToolCallMetadata): Int {
            val traceSpanId = metadata["trace.span.id"] as? String
            // ... 將 traceSpanId 用於橫切內容 (日誌、執行緒、關聯)
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-02.kt -->

呼叫者可以透過 `SafeTool.execute(args, serializer, metadata)` 或直接透過 `AIAgentEnvironment.executeTool(toolCall, metadata)` 傳遞元資料。各項功能可以在安裝期間透過呼叫 `pipeline.provideToolCallMetadata(this) { eventContext -> mapOf(...) }` 為每次工具呼叫貢獻元資料。當索引鍵衝突時，呼叫者提供的元資料優先於功能貢獻。

現有繼承 `Tool<Args, Result>` 並覆寫 `execute(args)` 的工具仍可照常運作：架構會透過相同路徑調度它們並捨棄任何 `ToolCallMetadata`。若要啟用元資料功能，請切換至 `AgentContextAwareTool`（具型別的內容存取）或 `ToolBase`（原始包存取）。

### SimpleTool 類別 (Kotlin)

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象類別繼承自 `Tool<Args, ToolResult.Text>`，並簡化了傳回文字結果之工具的建立。

每個簡單工具由以下組建組成：

| <div style="width:110px">組建</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定義自定義工具所需引數的可序列化資料類別。                                                                                                                                                                                                                         |
| `argsSerializer`                         | 已覆寫的變數，定義工具引數如何序列化。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                             | 指定工具元資料的已覆寫變數：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（預設為空）<br/> - `optionalParameters`（預設為空）<br/> 另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                            | 已覆寫的函式，描述工具執行的主要操作。它接收型別為 `Args` 的引數並傳回一個 `String`。另請參閱 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! note "Java 實作"
    在 Java 中，對等的方法是使用傳回 `String` 的基於註解的方法。架構會自動處理文字結果的封裝。如需更多詳細資訊，請參閱下方的[基於註解的方法 (Java)](#annotation-based-methods-java)。

!!! tip
    確保您的工具有清楚的描述與定義良好的參數名稱，以便讓 LLM 更容易理解並正確使用它們。在 Kotlin 中使用 `descriptor` 與建構函式參數；在 Java 中使用 `@Tool` 與 `@LLMDescription` 註解。

#### 使用範例 

以下是在 Kotlin 中使用 `SimpleTool` 實作自定義工具的範例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.SimpleTool
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    // 建立一個工具，將字串運算式轉換為 Double 值
    object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(
        argsType = typeToken<Args>(),
        name = "cast_to_double",
        description = "將傳入的運算式轉換為 Double，如果無法轉換則傳回 0.0"
    ) {
        // 定義工具引數
        @Serializable
        data class Args(
            @property:LLMDescription("要轉換為 Double 的運算式")
            val expression: String,
            @property:LLMDescription("關於如何處理該運算式的註釋")
            val comment: String
        )

        // 使用提供的引數執行工具的函式
        override suspend fun execute(args: Args): String {
            return "結果: ${castToDouble(args.expression)}, " + "註釋為: ${args.comment}"
        }

        // 將字串運算式轉換為 Double 值的函式
        private fun castToDouble(expression: String): Double {
            return expression.toDoubleOrNull() ?: 0.0
        }
    }
    ```
    <!--- KNIT example-class-based-tools-02.kt -->

### 基於註解的方法 (Java)

要在 Java 中實作工具，請使用帶有 `@Tool` 與 `@LLMDescription` 的基於註解的方法，而非繼承 `Tool` 或 `SimpleTool`。Koog 會透過反射自動處理序列化與註冊。若要進一步了解實作方式，請參閱下方的 Java 範例。

#### 使用範例

這是 Java 中的工具實作範例，相當於 Kotlin 中的 `Tool` 類別用法。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // Java 對等實作：將工具實作為 Java 方法並透過 ToolRegistry.builder() 進行註冊。
    // 這是建議的 Java 互通路徑，而非繼承 Kotlin 的 Tool 基底類別。
    public final class CalculatorTool {
        private CalculatorTool() {}
    
        @Tool(customName = "calculator")
        @LLMDescription(description = "一個簡單的計算器，可以將兩個數字相加 (0-9)。")
        public static int calculator(
                @LLMDescription(description = "第一個要相加的數字 (0-9)") int digit1,
                @LLMDescription(description = "第二個要相加的數字 (0-9)") int digit2
        ) {
            if (digit1 < 0 || digit1 > 9) throw new IllegalArgumentException("digit1 必須是單個數字 (0-9)");
            if (digit2 < 0 || digit2 > 9) throw new IllegalArgumentException("digit2 必須是單個數字 (0-9)");
            return digit1 + digit2;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CalculatorTool.class.getMethod("calculator", int.class, int.class))
                .build();
        }
    }
    // 注意：不支援從 Java 繼承 Kotlin 的 Tool<TArgs, TResult> 並覆寫 suspend execute(...)。
    // Java 互通性使用基於反射的 Java 方法註冊作為工具。
    ```
    <!--- KNIT example-class-based-tools-java-01.java -->

以下是 Java 中的工具實作範例，相當於 Kotlin 中的 `SimpleTool` 類別用法。此範例實作了一個傳回文字結果的簡單工具。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // SimpleTool 的 Java 對等實作：提供一個 Java 方法並將其註冊為工具。
    public final class CastToDoubleTool {
        private CastToDoubleTool() {}
    
        @Tool(customName = "cast_to_double")
        @LLMDescription(description = "將傳入的運算式轉換為 Double，如果無法轉換則傳回 0.0")
        public static String castToDouble(
                @LLMDescription(description = "要轉換為 Double 的運算式") String expression,
                @LLMDescription(description = "關於如何處理該運算式的註釋") String comment
        ) {
            double value;
            try {
                value = Double.parseDouble(expression);
            } catch (Exception e) {
                value = 0.0;
            }
            return "結果: " + value + ", 註釋為: " + comment;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CastToDoubleTool.class.getMethod("castToDouble", String.class, String.class))
                .build();
        }
    }
    // 注意：不需要從 Java 繼承 Kotlin 的 SimpleTool<TArgs>；註冊 Java 方法才是慣用做法。
    ```
    <!--- KNIT example-class-based-tools-java-02.java -->

### 以自定義格式將工具結果發送至 LLM

對於 Kotlin：

如果您對發送到 LLM 的 JSON 結果不滿意（在某些情況下，如果工具輸出結構化為 Markdown 等格式，LLM 的運作效果可能會更好），則必須遵循以下步驟：

1. 實作 `ToolResult.TextSerializable` 介面，並覆寫 `textForLLM()` 方法
2. 使用 `ToolResultUtils.toTextSerializer<T>()` 覆寫 `resultSerializer`

對於 Java：

直接從您的註解方法傳回格式化文字（例如 Markdown）作為 `String`。架構會自動處理此問題。

#### 範例

以下範例展示了 Kotlin 與 Java 中的自定義格式化輸出：

=== "Kotlin"

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
    // 一個編輯檔案的工具
    object EditFile : Tool<EditFile.Args, EditFile.Result>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Result>(),
        name = "edit_file",
        description = "編輯指定的檔案"
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
                        bold("成功").text(" 編輯檔案（已套用修補）")
                    }
                } else {
                    line {
                        text("檔案 ")
                            .bold("未")
                            .text(" 被修改（修補套用失敗：${(patchApplyResult as PatchApplyResult.Failure).reason}）")
                    }
                }
            }

            override fun toString(): String = textForLLM()
        }

        // 使用提供的引數執行工具的函式
        override suspend fun execute(args: Args): Result {
            return TODO("實作檔案編輯")
        }
    }
    ```
    <!--- KNIT example-class-based-tools-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;

    // Java 對等實作：直接從 Java 方法傳回 Markdown 文字給 LLM，並將其註冊為工具。
    // 這避免了需要自定義的可序列化 Result 型別（這需要 Kotlin 序列化支援）。
    public final class EditFile {
        private EditFile() {}

        @Tool(customName = "edit_file")
        @LLMDescription(description = "編輯指定的檔案")
        public static String editFile(
                String path,
                String original,
                String replacement
        ) {
            // TODO: 實作檔案編輯邏輯；以下是說明 Markdown 輸出的預留位置
            boolean success = false;
            if (success) {
                return "**成功** 編輯檔案（已套用修補）";
            } else {
                return "檔案 **未** 被修改（修補套用失敗：原因）";
            }
        }

        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(EditFile.class.getMethod("editFile", String.class, String.class, String.class))
                .build();
        }
    }
    // 注意：如果您需要從 Java 取得結構化的自定義 Result 物件，則必須公開 Kotlin @Serializable 型別
    // 或另一個可感知序列化程式的型別。傳回字串在 Koog 的 Java 互通性中是開箱即用的。
    ```
    <!--- KNIT example-class-based-tools-java-03.java -->

在 Kotlin 或 Java 中實作工具後，您需要將其新增至工具註冊表，然後搭配代理使用。
詳細資訊請參閱[工具註冊表](../tools/index#tool-registry)。