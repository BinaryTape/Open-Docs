# 以類別為基礎的工具

本節說明專為需要更高靈活度與自訂行為的情境而設計的 API。
透過 Kotlin 中的這種方法，您可以完全控制工具，包括其參數、元資料、執行邏輯，以及如何註冊與叫用工具。在 Java 中，工具是使用以註解為基礎的方法並配合以反射為基礎的註冊來建立的。

這種程度的控制非常適合建立擴展基本使用案例的複雜工具，進而實現與代理程式工作階段和工作流程的無縫整合。

本頁面說明如何實作 Kotlin 與 Java 工具、透過註冊表管理工具、呼叫工具，以及在以節點為基礎的代理程式架構中使用工具。

!!! note
    此 API 在 Kotlin 中是多平台的。Java 工具是使用以註解為基礎的方法實作，並透過反射進行註冊。這讓您可以在 Kotlin 的不同平台間使用相同的工具，而 Java 則提供完整的 JVM 互通性。

## 工具實作

Koog 架構提供以下實作工具的方法：

對於 Kotlin：

* 為所有工具使用基底類別 `Tool`。當您需要傳回非文字結果或需要完全控制工具行為時，應使用此類別。
* 使用擴展自基底 `Tool` 類別的 `SimpleTool` 類別，其簡化了傳回文字結果的工具建立過程。對於工具僅需傳回文字的情境，您應使用此方法。

這兩種方法都使用相同的核心組件，但在實作和傳回的結果方面有所不同。

對於 Java：

* 使用以註解為基礎的方法 (`@Tool` 與 `@LLMDescription`) 並配合以反射為基礎的註冊。這是 Java 互通性的推薦方法，因為由於 `suspend` 函式的限制，不支援從 Java 繼承 Kotlin 的 `Tool` 或 `SimpleTool` 子類別。

### Tool 類別 (Kotlin)

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象類別是在 Kotlin 中建立工具的基底類別。
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

!!! note "Java 實作"
    在 Java 中，請使用以 `@Tool` 與 `@LLMDescription` 為基礎的註解方法，而非繼承 `Tool<Args, Result>`。架構會透過反射自動處理序列化與註冊。欲了解更多詳情，請參閱下方的[以註解為基礎的方法](#annotation-based-methods-java)。

!!! tip
    請確保您的工具具有清晰的描述和定義良好的參數名稱，以便 LLM 更容易理解並正確使用它們。在 Kotlin 中，請使用 `descriptor` 屬性；在 Java 中，請使用 `@LLMDescription` 註解。

#### 使用範例

以下是使用 `Tool` 類別實作自訂工具的範例，該工具會傳回數值結果：

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

#### 從工具中讀取代理程式內容

需要代理程式完整狀態（LLM 內容、執行 ID、配置、存儲等）的工具應繼承 `AgentContextAwareTool<Args, Result>` 而非 `Tool<Args, Result>`。架構會注入驅動該呼叫的即時 `AIAgentContext`，而工具會將其作為具型別的參數接收，而不是從引數架構中讀取。

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
        description = "Adds two digits and emits a log line tagged with the agent run id."
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("The first digit to add (0-9)")
            val digit1: Int,
            @property:LLMDescription("The second digit to add (0-9)")
            val digit2: Int
        )

        override suspend fun execute(args: Args, context: AIAgentContext): Int {
            val runId = context.runId
            // ... 將 runId 用於橫切內容（記錄、追蹤、關聯）
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-01.kt -->

`AgentContextAwareTool` 由架構透過每次呼叫的 `ToolCallMetadata` 側向管道進行分派，架構會代表工具管理此管道。在代理程式執行之外叫用此類工具會拋出 `IllegalStateException`，因為沒有注入 `AIAgentContext`；正式環境程式碼應始終透過 `ContextualAgentEnvironment` 執行，而單元測試可以透過 `ToolCallMetadata.of(AgentContextAwareTool.AgentContextKey to context)` 明確提供內容。

#### 讀取原始的每次呼叫元資料

少數工具希望讀取呼叫者或功能提供的 *非* 代理程式內容項目（例如由可觀測性功能提供的分散式追蹤 span ID）。這些工具直接繼承 `ToolBase<Args, Result>`，它會公開完整的 `ToolCallMetadata` 集合：

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
        description = "Adds two digits, propagating a tracing span id from caller or feature metadata."
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("The first digit to add (0-9)")
            val digit1: Int,
            @property:LLMDescription("The second digit to add (0-9)")
            val digit2: Int
        )

        override suspend fun execute(args: Args, metadata: ToolCallMetadata): Int {
            val traceSpanId = metadata["trace.span.id"] as? String
            // ... 將 traceSpanId 用於橫切內容（記錄、追蹤、關聯）
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-02.kt -->

呼叫者可以透過 `SafeTool.execute(args, serializer, metadata)` 或直接透過 `AIAgentEnvironment.executeTool(toolCall, metadata)` 傳遞元資料。功能可以在安裝期間透過呼叫 `pipeline.provideToolCallMetadata(this) { eventContext -> mapOf(...) }` 為每次工具呼叫提供元資料。當鍵衝突時，呼叫者提供的元資料優先於功能提供的元資料。

現有繼承 `Tool<Args, Result>` 並覆寫 `execute(args)` 的工具仍可照常運作：架構會透過相同的路徑分派它們，並捨棄任何 `ToolCallMetadata`。若要啟用元資料支援，請切換至 `AgentContextAwareTool`（具型別的內容存取）或 `ToolBase`（原始集合存取）。

### SimpleTool 類別 (Kotlin)

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象類別擴展了 `Tool<Args, ToolResult.Text>`，並簡化了傳回文字結果的工具建立過程。

每個簡單工具由以下組件組成：

| <div style="width:110px">組件</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定義自訂工具所需引數的可序列化資料類別。                                                                                                                                                                                                                         |
| `argsSerializer`                         | 覆寫的變數，定義如何序列化工具的引數。另請參閱 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                             | 覆寫的變數，指定工具元資料：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (預設為空)<br/> - `optionalParameters` (預設為空)<br/> 另請參閱 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                            | 覆寫的函式，描述工具執行的主要操作。它接受型別為 `Args` 的引數並傳回一個 `String`。另請參閱 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! note "Java 實作"
    在 Java 中，對等的方法是使用傳回 `String` 的註解型方法。架構會自動處理文字結果的封裝。欲了解更多詳情，請參閱下方的[以註解為基礎的方法](#annotation-based-methods-java)。

!!! tip
    請確保您的工具具有清晰的描述和定義良好的參數名稱，以便 LLM 更容易理解並正確使用它們。在 Kotlin 中，請使用 `descriptor` 和建構函式參數；在 Java 中，請使用 `@Tool` 與 `@LLMDescription` 註解。

#### 使用範例 

以下是在 Kotlin 中使用 `SimpleTool` 實作自訂工具的範例：

=== "Kotlin"

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

### 以註解為基礎的方法 (Java)

若要在 Java 中實作工具，請使用 `@Tool` 與 `@LLMDescription` 註解方法，而非繼承 `Tool` 或 `SimpleTool`。Koog 會透過反射自動處理序列化與註冊。欲了解更多關於實作的資訊，請參閱下方的 Java 範例。

#### 使用範例

這是 Java 中的工具實作範例，等同於在 Kotlin 中使用 `Tool` 類別。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // Java 等效實作：將工具實作為 Java 方法，並透過 ToolRegistry.builder() 註冊。
    // 這是推薦的 Java 互通方式，而非繼承 Kotlin 的 Tool 基底類別。
    public final class CalculatorTool {
        private CalculatorTool() {}
    
        @Tool(customName = "calculator")
        @LLMDescription(description = "A simple calculator that can add two digits (0-9).")
        public static int calculator(
                @LLMDescription(description = "The first digit to add (0-9)") int digit1,
                @LLMDescription(description = "The second digit to add (0-9)") int digit2
        ) {
            if (digit1 < 0 || digit1 > 9) throw new IllegalArgumentException("digit1 must be a single digit (0-9)");
            if (digit2 < 0 || digit2 > 9) throw new IllegalArgumentException("digit2 must be a single digit (0-9)");
            return digit1 + digit2;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CalculatorTool.class.getMethod("calculator", int.class, int.class))
                .build();
        }
    }
    // 注意：不支援從 Java 繼承 Kotlin 的 Tool<TArgs, TResult> 並覆寫 suspend execute(...)。
    // Java 互通使用以反射為基礎的 Java 方法註冊作為工具。
    ```
    <!--- KNIT example-class-based-tools-java-01.java -->

以下是 Java 中的工具實作範例，等同於在 Kotlin 中使用 `SimpleTool` 類別。此範例實作了一個傳回文字結果的簡單工具。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // SimpleTool 的 Java 等效實作：提供一個 Java 方法並將其註冊為工具。
    public final class CastToDoubleTool {
        private CastToDoubleTool() {}
    
        @Tool(customName = "cast_to_double")
        @LLMDescription(description = "casts the passed expression to double or returns 0.0 if the expression is not castable")
        public static String castToDouble(
                @LLMDescription(description = "An expression to case to double") String expression,
                @LLMDescription(description = "A comment on how to process the expression") String comment
        ) {
            double value;
            try {
                value = Double.parseDouble(expression);
            } catch (Exception e) {
                value = 0.0;
            }
            return "Result: " + value + ", the comment was: " + comment;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CastToDoubleTool.class.getMethod("castToDouble", String.class, String.class))
                .build();
        }
    }
    // 注意：不需要從 Java 擴充 Kotlin 的 SimpleTool<TArgs>；註冊 Java 方法是更道地的方法。
    ```
    <!--- KNIT example-class-based-tools-java-02.java -->

### 以自訂格式將工具結果傳送至 LLM

對於 Kotlin：

如果您對傳送至 LLM 的 JSON 結果不滿意（在某些情況下，如果工具輸出結構化為 Markdown 等格式，LLM 的運作效果可能會更好），您必須遵循以下步驟：

1. 實作 `ToolResult.TextSerializable` 介面，並覆寫 `textForLLM()` 方法
2. 使用 `ToolResultUtils.toTextSerializer<T>()` 覆寫 `resultSerializer`

對於 Java：

直接從您的註解方法傳回格式化文字（例如 Markdown）作為 `String`。架構會自動處理此操作。

#### 範例

以下範例展示了 Kotlin 和 Java 中的自訂格式化輸出：

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

    // Java 等效實作：直接從 Java 方法傳回 Markdown 文字給 LLM，並將其註冊為工具。
    // 這避免了需要自訂的可序列化 Result 型別（這需要 Kotlin 序列化支援）。
    public final class EditFile {
        private EditFile() {}

        @Tool(customName = "edit_file")
        @LLMDescription(description = "Edits the given file")
        public static String editFile(
                String path,
                String original,
                String replacement
        ) {
            // TODO: 實作檔案編輯邏輯；以下是說明 Markdown 輸出的占位符號
            boolean success = false;
            if (success) {
                return "**Successfully** edited file (patch applied)";
            } else {
                return "File was **not** modified (patch application failed: reason)";
            }
        }

        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(EditFile.class.getMethod("editFile", String.class, String.class, String.class))
                .build();
        }
    }
    // 注意：如果您需要從 Java 取得結構化的自訂 Result 物件，您必須公開一個 Kotlin @Serializable 型別
    // 或另一個可感知序列化程式的型別。傳回 String 在 Koog 的 Java 互通中可以開箱即用。
    ```
    <!--- KNIT example-class-based-tools-java-03.java -->

在 Kotlin 或 Java 中實作工具後，您需要將其新增至工具註冊表，然後與代理程式搭配使用。
詳情請參閱[工具註冊表](tools-overview.md#tool-registry)。