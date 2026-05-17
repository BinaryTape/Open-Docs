# 基礎 Agent

基礎 Agent 使用預定義的策略與簡單的執行流程，適用於大多數常見的使用案例。
它接受字串輸入（問題、請求或任務描述），並將此輸入傳送至配置的 LLM。
LLM 可能決定呼叫提供的工具。
Agent 將執行工具並將結果回傳給 LLM。
這會重複進行，直到 LLM 不再請求任何工具呼叫並傳回字串回應。
接著 Agent 會輸出此回應。

在 [基於圖的 Agent](graph-based-agents.md) 中，
您可以查看如何重新建立基礎 Agent 所使用的預定義策略圖。

??? note "先決條件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    此頁面上的範例假設您已設定 `OPENAI_API_KEY` 環境變數。

## 建立最簡 Agent

若要建立最基本的 Agent，請具現化 [`AIAgent`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/index.html)
並為 [prompt 執行器](../prompts/prompt-executors.md)提供一個 [語言模型](../model-capabilities.md#creating-a-model-llmodel-configuration)：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        llmModel = OpenAIModels.Chat.GPT4o
    )
    ```

    此 Agent 預期以字串作為輸入，並傳回字串作為輸出。
    若要執行 Agent，請對某些使用者輸入使用 `run()` 函式：

    ```kotlin
    fun main() = runBlocking {
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-basic-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava01 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .llmModel(OpenAIModels.Chat.GPT4o)
        .build();
    ```

    此 Agent 預期以字串作為輸入，並傳回字串作為輸出。
    若要執行 Agent，請對某些使用者輸入使用 `run()` 方法：

    ```java
    String result = agent.run("Hello! How can you help me?");
    System.out.println(result);
    ```
    <!--- KNIT exampleBasicJava01.java -->

Agent 將傳回通用的回答，例如：

```text
我可以在廣泛的主題和任務上提供協助。以下是一些範例：

1. **回答問題**：我可以提供各個領域的資訊，從科學、歷史到娛樂與文化。
2. **產生文字**：我可以協助寫作任務，例如建議替換詞句、提供定義，甚至創作整篇文章或故事。
3. **翻譯**：我可以將文字從一種語言翻譯成另一種語言，包括常見的語言，例如西班牙文、法文、德文、中文等。
4. **對話**：我可以進行聽起來很自然的對話，利用上下文和理解力來回應問題與陳述。
5. **腦力激盪**：我可以為創意專案產生想法，例如寫故事、作曲或構思商業點子。
6. **學習**：我可以協助語言學習，解釋文法規則、詞彙和發音。
7. **計算**：我可以執行數學計算，包括基礎算術、代數以及更進階的數學概念。

您在想什麼呢？是否有特定問題、主題或任務想要處理？
```
<!--- KNIT example-basic-01.txt -->

## 加入系統 prompt

提供 [系統訊息](../prompts/prompt-creation/index.md#system-message) 來定義 Agent 的角色，
以及與任務相關的目的、內容和指令。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o
    )
    ```
    <!--- KNIT example-basic-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava02 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .build();
    ```
    <!--- KNIT exampleBasicJava02.java -->

系統 prompt 中的指令將引導 Agent 的回應：

```text
我來幫你探索網路迷因的瘋狂世界！

你在想什麼呢？是想了解某個特定的迷因，還是需要尋找熱門笑話的協助，或者想要一些流行迷因的推薦？讓我知道，我會盡力帶給你一些笑料！
```
<!--- KNIT example-basic-02.txt -->

## 配置 LLM 輸出

您可以直接向 Agent 建構函式 (Kotlin) 或透過 builder 方法 (Java) 提供一些 [LLM 參數](../llm-parameters.md#llm-parameter-reference)，
以自訂 LLM 的行為。
例如，使用 `temperature` 參數來調整產生回應的隨機性：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7
    )
    ```
    <!--- KNIT example-basic-java-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava03 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .temperature(0.7)
        .build();
    ```
    <!--- KNIT exampleBasicJava03.java -->

以下是不同溫度（temperature）值的回應範例：

=== "0.4"
    
    ```text
    我來幫你探索網路迷因的瘋狂世界！無論你是在尋找解釋、範例，還是只想和別人分享迷因，我都是你的首選專家。你在想什麼呢？有沒有哪個特定的迷因讓你感到好奇？或者你需要一些與迷因相關的建議？儘管開口！
    ```
    <!--- KNIT example-basic-03.txt -->

=== "0.7"

    ```text
    我來幫你探索網路迷因的瘋狂世界！
    
    你在想什麼呢？需要幫忙理解特定的迷因、尋找熱門笑話或趨勢，甚至想創造自己的迷因嗎？讓我們開始這場迷因派對吧！
    ```
    <!--- KNIT example-basic-04.txt -->

=== "1.0"

    ```text
    我很樂意幫你探索網路迷因的瘋狂世界！
    
    無論你是想尋找經典迷因的解釋、新迷因的建議，還是只想討論你最喜歡的迷因文化趨勢，我都在這裡為你提供協助。你在想什麼呢？
    
    你對迷因有特定的問題嗎（例如：「這個迷因是什麼意思？」），或者你正在尋找一些迷因相關的推薦（例如：「你能推薦一個有趣的迷因分享給朋友嗎？」）。讓我知道我該如何提供協助！
    ```
    <!--- KNIT example-basic-05.txt -->

## 加入工具

Agent 可以使用 [工具](../tools-overview.md) 來執行特定任務。

首先，透過使用 [`@Tool`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools.annotations/-tool/index.html) 註解標註函式 (Kotlin) 或方法 (Java) 來建立工具：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    -->
    ```kotlin
    @Tool
    @LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
    fun askUser(
        @LLMDescription("Question from the agent")
        question: String
    ): String {
        println(question)
        return readln()
    }
    ```

    接著，使用 [`ToolRegistry`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html) 使此工具可供 Agent 使用：

    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = ToolRegistry {
            tool(::askUser)
        }
    )
    ```
    <!--- KNIT example-basic-03.kt -->

    在範例中，`askUser` 是一個工具，可協助 Agent 透過列印至主控台以及從主控台讀取，與使用者保持對話。
    如果 Agent 決定向使用者提問，
    它可以呼叫此工具，該工具會透過 `println()` 寫入 `stdout` 並透過 `readln()` 從 `stdin` 讀取。

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import java.util.Scanner;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava04 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 建立一個 ToolSet 類別
    class UserConversationTools implements ToolSet {
        @Tool
        @LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
        public String askUser(
            @LLMDescription("Question from the agent")
            String question
        ) {
            System.out.println(question);
            Scanner scanner = new Scanner(System.in);
            return scanner.nextLine();
        }
    }
    ```
    
    接著，使用 [`ToolRegistry`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html) 使此工具可供 Agent 使用：

    ```java
    UserConversationTools askUser = new UserConversationTools();

    ToolRegistry toolRegistry = ToolRegistry.builder()
            .tools(askUser)
            .build();

    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .temperature(0.7)
        .toolRegistry(toolRegistry)
        .build();
    ```
    <!--- KNIT exampleBasicJava04.java -->

    在範例中，`askUser` 是一個工具，可協助 Agent 透過列印至主控台以及從主控台讀取，與使用者保持對話。

以下是與 Agent 互動的範例：

```text
Agent: Which meme would you like me to explain? Please choose from: Grumpy Cat, Success Kid, or Doge.

User: Explain Doge

Agent:

**Doge**

Doge 是一個受歡迎的網路迷因，起源於 2013 年的圖片討論板網站 4chan。該迷因包含一張柴犬的照片，並配上以俏皮、誇張風格撰寫的標題。

Doge 迷因的典型格式包括：

* 一張柴犬的照片
* 全部大寫的標題，使用刻意簡化且稚氣的語氣
* 誇張或編造的單詞或片語，通常用於傳達幽默或荒誕的想法

Doge 迷因的範例可能包括：

* "Such wow. Such happy."
* "I had fun today!"
* "Wow, I am good at napping."

該迷因以輕鬆俏皮的語調著稱，常用於表達興奮、快樂或愚蠢。此迷因已成為一種文化現象，網路上出現了無數的變體和模仿。
```
<!--- KNIT example-basic-06.txt -->

## 調整 Agent 迭代次數

為了避免無限迴圈，Koog 允許任何 Agent 執行有限次數的步驟（預設為 50 次）。
如果您預期 Agent 需要更多步驟（例如工具呼叫和 LLM 請求），請使用 `maxIterations` 參數來增加此限制；
對於僅需要幾個步驟的 Agent，則減少此限制。
例如，此處描述的簡單 Agent 不太可能需要超過 10 個步驟：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    @Tool
    @LLMDescription("Asks the user a question by sending it to stdout and returns the answer from stdin")
    fun askUser(
        @LLMDescription("Question from the agent")
        question: String
    ): String {
        println(question)
        return readln()
    }
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = ToolRegistry {
            tool(::askUser)
        },
        maxIterations = 10
    )
    ```
    <!--- KNIT example-basic-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import java.util.Scanner;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava05 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 建立一個 ToolSet 類別
    class UserConversationTools implements ToolSet {
        @Tool
        @LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
        public String askUser(
            @LLMDescription("Question from the agent")
            String question
        ) {
            System.out.println(question);
            Scanner scanner = new Scanner(System.in);
            return scanner.nextLine();
        }
    }

    // 在 main 方法中：
    UserConversationTools askUser = new UserConversationTools();

    ToolRegistry toolRegistry = ToolRegistry.builder()
            .tools(askUser)
            .build();

    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .temperature(0.7)
        .toolRegistry(toolRegistry)
        .maxIterations(10)
        .build();
    ```
    <!--- KNIT exampleBasicJava05.java -->

!!! tip

    除了將模型、溫度、最大迭代次數和其他參數直接傳遞給 Kotlin 建構函式或 Java builder 之外，
    您也可以將其定義並作為單獨的配置物件傳遞。
    如需更多資訊，請參閱 [Agent 配置](index.md#agent-configuration)。

## 處理 Agent 執行期間的事件

為了協助測試和偵錯，以及為鏈式 Agent 互動建立掛鉤 (hook)，
Koog 提供了 [EventHandler](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler/index.html) 功能。

=== "Kotlin"

    在 Agent 建構函式 lambda 中呼叫 `handleEvents()` 函式以安裝該功能並註冊事件處理常式：

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.features.eventHandler.feature.handleEvents
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    @Tool
    @LLMDescription("Asks the user a question by sending it to stdout and returns the answer from stdin")
    fun askUser(
        @LLMDescription("Question from the agent")
        question: String
    ): String {
        println(question)
        return readln()
    }
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = ToolRegistry {
            tool(::askUser)
        },
        maxIterations = 10
    ){
        handleEvents {
            // 處理工具呼叫
            onToolCallStarting { eventContext ->
                println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
            }
        }
    }
    ```
    <!--- KNIT example-basic-05.kt -->

=== "Java"
    在 Agent builder 上使用 `.install()` 方法，以透過 `EventHandler.Feature` 註冊事件處理常式：

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.agents.features.eventHandler.feature.EventHandler;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import java.util.Scanner;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava06 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 建立一個 ToolSet 類別
    class UserConversationTools implements ToolSet {
        @Tool
        @LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
        public String askUser(
            @LLMDescription("Question from the agent")
            String question
        ) {
            System.out.println(question);
            Scanner scanner = new Scanner(System.in);
            return scanner.nextLine();
        }
    }

    // 在 main 方法中：
    UserConversationTools askUser = new UserConversationTools();

    ToolRegistry toolRegistry = ToolRegistry.builder()
            .tools(askUser)
            .build();

    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .temperature(0.7)
        .toolRegistry(toolRegistry)
        .maxIterations(10)
        .install(EventHandler.Feature, config -> {
            config.onToolCallStarting(eventContext -> {
                System.out.println("Tool called: " + eventContext.getToolName() +
                    " with args " + eventContext.getToolArgs());
            });
        })
        .build();
    ```
    <!--- KNIT exampleBasicJava06.java -->

現在當 Agent 呼叫 `askUser` 工具時，會輸出類似以下的內容：

```text
Tool called: askUser with args {"question":"Which meme would you like me to explain?"}
```
<!--- KNIT example-basic-07.txt -->

如需更多關於 Koog Agent 功能的資訊，請參閱 [功能](../features/index.md)。

## 後續步驟

- 進一步了解如何建置 [基於圖的 Agent](graph-based-agents.md) 與 [功能性 Agent](functional-agents.md)