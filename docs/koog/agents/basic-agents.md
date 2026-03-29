# 基础 Agent

基础 Agent 使用预定义的策略和简单的执行流程，适用于大多数常见的用例。
它接收字符串输入（问题、请求或任务描述），并将该输入发送到配置的 LLM。
LLM 可能会决定调用提供的工具。
Agent 将执行工具并将结果发送回 LLM。
这将重复进行，直到 LLM 不再请求任何工具调用并返回字符串响应。
Agent 然后输出该响应。

在[基于图的 Agent](graph-based-agents.md)中，你可以了解如何重新创建基础 Agent 所使用的预定义策略图。

??? note "前提条件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    本页示例假设你已设置 `OPENAI_API_KEY` 环境变量。

## 创建最小化 Agent

要创建最基础的 Agent，请实例化 [`AIAgent`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/index.html)，并为[提示词执行器](../prompts/prompt-executors.md)提供一个[语言模型](../model-capabilities.md#creating-a-model-llmodel-configuration)：

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

    此 Agent 期望将字符串作为输入，并返回字符串作为输出。
    要运行该 Agent，请使用带有用户输入的 `run()` 函数：

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
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutorsKt.simpleOpenAIExecutor;
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

    此 Agent 期望将字符串作为输入，并返回字符串作为输出。
    要运行该 Agent，请使用带有用户输入的 `run()` 方法：

    ```java
    String result = agent.run("Hello! How can you help me?");
    System.out.println(result);
    ```
    <!--- KNIT exampleBasicJava01.java -->

Agent 将返回一个通用的回答，例如：

```text
I can assist with a wide range of topics and tasks. Here are some examples:

1. **Answering questions**: I can provide information on various subjects, from science and history to entertainment and culture.
2. **Generating text**: I can help with writing tasks, such as suggesting alternative phrases, providing definitions, or even creating entire articles or stories.
3. **Translation**: I can translate text from one language to another, including popular languages such as Spanish, French, German, Chinese, and many more.
4. **Conversation**: I can engage in natural-sounding conversations, using context and understanding to respond to questions and statements.
5. **Brainstorming**: I can help generate ideas for creative projects, such as writing stories, composing music, or coming up with business ideas.
6. **Learning**: I can help with language learning, explaining grammar rules, vocabulary, and pronunciation.
7. **Calculations**: I can perform mathematical calculations, including basic arithmetic, algebra, and more advanced math concepts.

What's on your mind? Do you have a specific question, topic, or task you'd like to tackle?
```
<!--- KNIT example-basic-01.txt -->

## 添加系统提示词

提供[系统消息](../prompts/prompt-creation/index.md#system-message)以定义 Agent 的角色，以及与任务相关的目的、上下文和指令。

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
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutorsKt.simpleOpenAIExecutor;
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

系统提示词中的指令将引导 Agent 的响应：

```text
I'm here to help you navigate the wild world of internet memes!

What's on your mind? Are you trying to understand a specific meme, need help finding a popular joke, or perhaps want some recommendations for trending memes? Let me know, and I'll do my best to provide you with some LOLs!
```
<!--- KNIT example-basic-02.txt -->

## 配置 LLM 输出

你可以直接在 Agent 构造函数 (Kotlin) 或通过 builder 方法 (Java) 提供一些 [LLM 参数](../llm-parameters.md#llm-parameter-reference)，以自定义 LLM 的行为。
例如，使用 `temperature` 参数来调整生成的响应的随机性：

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
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutorsKt.simpleOpenAIExecutor;
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

以下是不同温度值的一些响应示例：

=== "0.4"
    
    ```text
    I'm here to help you navigate the wild world of internet memes! Whether you're looking for explanations, examples, or just want to share a meme with someone, I'm your go-to expert. What's on your mind? Got a specific meme in mind that's got you curious? Or maybe you need some meme-related advice? Fire away!
    ```
    <!--- KNIT example-basic-03.txt -->

=== "0.7"

    ```text
    I'm here to help you navigate the wild world of internet memes!
    
    What's on your mind? Need help understanding a specific meme, finding a popular joke or trend, or maybe even creating your own meme? Let's get this meme party started!
    ```
    <!--- KNIT example-basic-04.txt -->

=== "1.0"

    ```text
    I'd be happy to help you navigate the wild world of internet memes!
    
    Whether you're looking for explanations of classic memes, suggestions for new ones to try out, or just want to discuss your favorite meme culture trends, I'm here to assist. What's on your mind?
    
    Do you have a specific question about memes (e.g., "What does this meme mean?"), or are you looking for some meme-related recommendations (e.g., "Can you recommend a funny meme to share with friends?"). Let me know how I can help!
    ```
    <!--- KNIT example-basic-05.txt -->

## 添加工具

Agent 可以使用[工具](../tools-overview.md)来执行特定任务。

首先，通过使用 [`@Tool`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools.annotations/-tool/index.html) 注解标记函数 (Kotlin) 或方法 (Java) 来创建工具：

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

    然后，使用 [`ToolRegistry`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html) 使该工具对 Agent 可用：

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

    在这个示例中，`askUser` 是一个工具，它通过向控制台输出内容并从中读取内容，帮助 Agent 与用户保持对话。
    如果 Agent 决定向用户提问，它可以调用此工具，该工具通过 `println()` 写入 `stdout` 并通过 `readln()` 从 `stdin` 读取内容。

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import java.util.Scanner;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutorsKt.simpleOpenAIExecutor;
    class exampleBasicJava04 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 创建一个 ToolSet 类
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
    
    然后，使用 [`ToolRegistry`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html) 使该工具对 Agent 可用：

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

    在这个示例中，`askUser` 是一个工具，它通过向控制台输出内容并从中读取内容，帮助 Agent 与用户保持对话。

以下是与 Agent 交互的示例：

```text
Agent: Which meme would you like me to explain? Please choose from: Grumpy Cat, Success Kid, or Doge.

User: Explain Doge

Agent:

**Doge**

Doge is a popular internet meme that originated on the imageboard website 4chan in 2013. The meme features a picture of a Shiba Inu dog with a caption written in a playful, exaggerated style.

The typical format of a Doge meme includes:

* A photo of a Shiba Inu dog
* A caption written in all capital letters, using a intentionally simplistic and childlike tone
* Exaggerated or made-up words or phrases, often used to convey a humorous or nonsensical idea

Examples of Doge memes might include:

* "Such wow. Such happy."
* "I had fun today!"
* "Wow, I am good at napping."

The meme is known for its lighthearted and playful tone, and is often used to express excitement, happiness, or silliness. The meme has since become a cultural phenomenon, with countless variations and parodies emerging online.
```
<!--- KNIT example-basic-06.txt -->

## 调整 Agent 迭代次数

为了避免无限循环，Koog 允许任何 Agent 执行有限数量的步骤（默认为 50 次）。
如果你预计 Agent 需要更多步骤（例如工具调用和 LLM 请求），请使用 `maxIterations` 参数来增加此限制，或者对于只需要几个步骤的 Agent 减小该限制。
例如，这里描述的简单 Agent 不太可能需要超过 10 个步骤：

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
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutorsKt.simpleOpenAIExecutor;
    class exampleBasicJava05 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 创建一个 ToolSet 类
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

    你可以定义这些参数并将其作为单独的配置对象进行传递，而不是将模型、温度、最大迭代次数和其他参数直接传递给 Kotlin 构造函数或 Java builder。
    有关更多信息，请参阅 [Agent 配置](index.md#agent-configuration)。

## 处理 Agent 运行时的事件

为了辅助测试和调试，以及为链式 Agent 交互创建钩子，Koog 提供了 [EventHandler](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler/index.html) 功能。

=== "Kotlin"

    在 Agent 构造函数 lambda 中调用 `handleEvents()` 函数即可安装该功能并注册事件处理程序：

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
            // 处理工具调用
            onToolCallStarting { eventContext ->
                println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
            }
        }
    }
    ```
    <!--- KNIT example-basic-05.kt -->

=== "Java"
    在 Agent 构建器上使用 `.install()` 方法，通过 `EventHandler.Feature` 注册事件处理程序：

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.agents.features.eventHandler.feature.EventHandler;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import java.util.Scanner;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutorsKt.simpleOpenAIExecutor;
    class exampleBasicJava06 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 创建一个 ToolSet 类
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

现在，当 Agent 调用 `askUser` 工具时，它将输出类似于以下内容的信息：

```text
Tool called: askUser with args {"question":"Which meme would you like me to explain?"}
```
<!--- KNIT example-basic-07.txt -->

有关 Koog Agent 功能的更多信息，请参阅[功能](../features/index.md)。

## 后续步骤

- 详细了解如何构建[基于图的 Agent](graph-based-agents.md)和[函数式 Agent](functional-agents.md)