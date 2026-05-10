# 自訂節點實作

本頁面提供如何在 Koog 架構中實作自訂節點的詳細說明。
自訂節點可讓您透過建立執行特定作業的可重複使用元件，來擴充 agent 工作流程的功能。

若要進一步了解圖形節點是什麼、其用法以及現有的預設節點，請參閱[圖形節點](nodes-and-components.md)。

## 節點架構總覽

在深入研究實作細節之前，了解 Koog 架構中的節點架構非常重要。節點是 agent 工作流程的基本建構區塊，每個節點代表工作流程中的特定作業或轉換。您可以使用「邊」（edge）來連接節點，這定義了節點之間的執行流程。

每個節點都有一個 `execute` 方法，該方法接收輸入並產生輸出，然後傳遞給工作流程中的下一個節點。

## 實作自訂節點

自訂節點的實作範圍很廣，從對輸入資料執行基本邏輯並回傳輸出的簡單實作，到接受參數並在執行之間維持狀態的複雜節點實作。

### 基本節點實作

在圖形中實作自訂節點並定義自訂邏輯最簡單的方法是使用以下模式：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    typealias Input = String
    typealias Output = Int
    val returnValue = 42
    val str = strategy<Input, Output>("my-strategy") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val myNode by node<Input, Output>("node_name") { input ->
        // 處理中
        returnValue
    }
    ```
    <!--- KNIT example-custom-nodes-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava01 {
        static class Input {}
        static class Output {}
        static Output returnValue = new Output();
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myNode = AIAgentNode.builder("node_name")
        .withInput(Input.class)
        .withOutput(Output.class)
        .withAction((input, ctx) -> {
            // 處理中
            return returnValue;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava01.java -->

上述程式碼代表一個具有預定義 `Input` 和 `Output` 型別的自訂節點 `myNode`，並帶有選用的名稱字串參數 (`node_name`)。在 Kotlin 中，您可以使用 `node` DSL 函式；在 Java 中，則使用 `AIAgentNode.builder()` 模式。

在實際範例中，這是一個接收字串輸入並回傳輸入長度的簡單節點：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val str = strategy<String, Int>("my-strategy") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val myNode by node<String, Int>("node_name") { input ->
        // 處理中
        input.length
    }
    ```
    <!--- KNIT example-custom-nodes-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava02 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(Integer.class)
        .withAction((input, ctx) -> {
            // 處理中
            return input.length();
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava02.java -->

建立自訂節點的另一種方法是將其提取為可重複使用的函式。在 Kotlin 中，您可以在 `AIAgentSubgraphBuilderBase` 上定義一個呼叫 `node` 函式的擴充函式；在 Java 中，則將節點建置器呼叫提取到幫助方法中。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    typealias Input = String
    typealias Output = String
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    fun AIAgentSubgraphBuilderBase<*, *>.myCustomNode(
        name: String? = null
    ): AIAgentNodeDelegate<Input, Output> = node(name) { input ->
        // 自訂邏輯
        input // 將輸入作為輸出回傳（直接傳通）
    }

    val myCustomNode by myCustomNode("node_name")
    ```
    <!--- KNIT example-custom-nodes-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava03 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 自訂邏輯
            return input; // 將輸入作為輸出回傳（直接傳通）
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava03.java -->

這會建立一個執行某些自訂邏輯但將輸入作為輸出原樣回傳（不經修改）的傳通節點。

### 帶有額外引數的節點

您可以建立接受引數以自訂其行為的節點：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    typealias Input = String
    typealias Output = String
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
        fun AIAgentSubgraphBuilderBase<*, *>.myNodeWithArguments(
        name: String? = null,
        arg1: String,
        arg2: Int
    ): AIAgentNodeDelegate<Input, Output> = node(name) { input ->
        // 在自訂邏輯中使用 arg1 和 arg2
        input // 將輸入作為輸出回傳
    }

    val myCustomNode by myNodeWithArguments("node_name", arg1 = "value1", arg2 = 42)
    ```
    <!--- KNIT example-custom-nodes-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava04 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    String arg1 = "value1";
    int arg2 = 42;

    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 在自訂邏輯中使用 arg1 和 arg2
            return input; // 將輸入作為輸出回傳
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava04.java -->

### 參數化節點

您可以定義具有泛型輸入和輸出型別參數的節點。在 Kotlin 中，您可以使用帶有 `reified` 型別參數的 `inline` 函式；在 Java 中，則在建置節點時明確指定型別。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    -->
    ```kotlin
    inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.myParameterizedNode(
        name: String? = null,
    ): AIAgentNodeDelegate<T, T> = node(name) { input ->
        // 執行一些額外操作
        // 將輸入作為輸出回傳
        input
    }

    val strategy = strategy<String, String>("strategy_name") {
        val myCustomNode by myParameterizedNode<String>("node_name")
    }
    ```
    <!--- KNIT example-custom-nodes-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava05 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 在 Java 中，建置節點時需明確指定型別
    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 執行一些額外操作
            // 將輸入作為輸出回傳
            return input;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava05.java -->

### 具狀態節點

如果您的節點需要在執行之間維持狀態，您可以使用閉包變數。在 Kotlin 中，您在封閉函式中宣告變數；在 Java 中，由於 lambda 擷取必須是有效最終（effectively final）的，因此請使用 `AtomicInteger` 之類的執行緒安全包裝函式。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.node
    typealias Input = Unit
    typealias Output = Unit
    -->
    ```kotlin
    fun AIAgentSubgraphBuilderBase<*, *>.myStatefulNode(
        name: String? = null
    ): AIAgentNodeDelegate<Input, Output> {
        var counter = 0

        return node(name) { input ->
            counter++
            println("Node executed $counter times")
            input
        }
    }
    ```
    <!--- KNIT example-custom-nodes-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import java.util.concurrent.atomic.AtomicInteger;
    class exampleCustomNodesJava06 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 在 Java 中，請使用 AtomicInteger（或類似工具），因為 lambda 擷取必須是有效最終（effectively final）的
    AtomicInteger counter = new AtomicInteger(0);

    var myStatefulNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            int count = counter.incrementAndGet();
            System.out.println("Node executed " + count + " times");
            return input;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava06.java -->

## 節點輸入與輸出型別

節點可以具有不同的輸入和輸出型別。在 Kotlin 和 Java 中，這些型別都被指定為泛型型別參數：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val stringToIntNode by node<String, Int>("node_name") { input: String ->
        // 處理中
        input.toInt() // 將字串轉換為整數
    }
    ```
    <!--- KNIT example-custom-nodes-07.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava07 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var stringToIntNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(Integer.class)
        .withAction((input, ctx) -> {
            // 處理中
            return Integer.parseInt(input); // 將字串轉換為整數
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava07.java -->

!!! note
    輸入和輸出型別決定了節點如何與工作流程中的其他節點連接。僅當來源節點的輸出型別與目標節點的輸入型別相容時，才能連接節點。

## 最佳實務

實作自訂節點時，請遵循以下最佳實務：

1. **保持節點功能集中**：每個節點應執行單一且定義明確的作業。
2. **使用具描述性的名稱**：節點名稱應清楚表明其用途。
3. **編寫參數文件**：為所有參數提供清楚的文件說明。
4. **優雅地處理錯誤**：實作適當的錯誤處理以防止工作流程失敗。
5. **使節點可重複使用**：設計可在不同工作流程中重複使用的節點。
6. **使用型別參數**：在適當的時候使用泛型型別參數，使節點更加靈活。
7. **提供預設值**：盡可能為參數提供合理的預設值。

## 常見模式

以下章節提供了一些實作自訂節點的常見模式。

### 傳通節點

執行作業但將輸入作為輸出回傳的節點。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val loggingNode by node<String, String>("node_name") { input ->
        println("Processing input: $input")
        input // 將輸入作為輸出回傳
    }
    ```
    <!--- KNIT example-custom-nodes-08.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava08 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var loggingNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            System.out.println("Processing input: " + input);
            return input; // 將輸入作為輸出回傳
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava08.java -->

### 轉換節點

將輸入資料進行轉換並產生修改後輸出的節點。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val upperCaseNode by node<String, String>("node_name") { input ->
        println("Processing input: $input")
        input.uppercase() // 將輸入轉換為大寫
    }
    ```
    <!--- KNIT example-custom-nodes-09.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava09 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var upperCaseNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            System.out.println("Processing input: " + input);
            return input.toUpperCase(); // 將輸入轉換為大寫
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava09.java -->

### LLM 互動節點

與 LLM 進行互動的節點。在 Kotlin 中，您可以對 LLM 工作階段進行細粒度控制；在 Java 中，通常使用預先建置的工廠方法（如 `AIAgentNode.llmRequest()`），這些方法會自動處理提示詞建構。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val summarizeTextNode by node<String, String>("node_name") { input ->
        llm.writeSession {
            appendPrompt {
                user("Please summarize the following text: $input")
            }

            val response = requestLLMWithoutTools()
            response.content
        }
    }
    ```
    <!--- KNIT example-custom-nodes-10.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.message.Message;
    class exampleCustomNodesJava10 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 在 Java 中，LLM 互動是使用預先建置的工廠節點來處理的。
    // AIAgentNode.llmRequest() 會建立一個節點，將輸入字串作為使用者
    // 訊息發送到 LLM 並回傳回應。提示詞文字是在圖形中執行時
    // 作為節點的輸入提供的。
    var summarizeTextNode = AIAgentNode.llmRequest(true, "node_name");

    // 若要從 LLM 回應中提取文字內容，請串接一個單獨的節點：
    var extractContent = AIAgentNode.builder("extract-content")
        .withInput(Message.Response.class)
        .withOutput(String.class)
        .withAction((response, ctx) -> response.getContent())
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava10.java -->

!!! note
    上面的 Kotlin 範例顯示了對 LLM 工作階段的細粒度控制（自訂提示詞建構、顯式 `requestLLMWithoutTools` 呼叫）。Java API 提供較高階的工廠方法，例如 `AIAgentNode.llmRequest()`，可自動處理提示詞建構 — 輸入字串會成為使用者訊息。對於進階提示詞自訂，請組合多個節點或使用自訂子圖。

### 工具執行節點

執行工具的自訂節點。在 Kotlin 中，您可以手動建構工具呼叫並執行它們；在 Java 中，通常使用將工具編排委派給 LLM 的子圖。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.prompt.message.Message
    import ai.koog.prompt.message.ResponseMetaInfo
    import ai.koog.utils.time.KoogClock
    import kotlinx.serialization.Serializable
    import kotlinx.serialization.json.Json
    import java.util.*
    val toolName = "my-custom-tool"
    @Serializable
    data class ToolArgs(val arg1: String, val arg2: Int)
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val nodeExecuteCustomTool by node<String, String>("node_name") { input ->
        val toolCall = Message.Tool.Call(
            id = UUID.randomUUID().toString(),
            tool = toolName,
            metaInfo = ResponseMetaInfo.create(KoogClock.System),
            content = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42)) // 使用輸入作為工具引數
        )

        val result = environment.executeTool(toolCall)
        result.content
    }
    ```
    <!--- KNIT example-custom-nodes-11.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    class exampleCustomNodesJava11 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 在 Java 中，無法透過 Java 建置器 API 直接執行工具（如 Kotlin 範例所示）。
    // 相反地，請使用將工具呼叫委派給 LLM 的子圖，
    // LLM 會決定何時以及如何呼叫工具：
    var toolSubgraph = AIAgentSubgraph.builder("tool-subgraph")
        .withInput(String.class)
        .withOutput(String.class)
        .withTask(input -> "Use my_tool with input: " + input)
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava11.java -->

!!! note
    Kotlin 範例示範了透過手動建構 `Message.Tool.Call` 並呼叫 `environment.executeTool()` 來進行低階工具執行。Java API 鼓勵使用帶有 `withTask()` 的子圖這種較高階的方法，由 LLM 自動編排工具呼叫。若要限制哪些工具可用，請在 `.withInput()` 之前串接 `.limitedTools(List.of(myTool))`。