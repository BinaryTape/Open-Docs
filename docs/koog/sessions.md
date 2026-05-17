# LLM 会话与手动历史记录管理

本页面提供了有关 LLM 会话的详细信息，包括如何使用读取和写入会话、管理对话历史记录以及向语言模型发起请求。

## 简介

LLM 会话是一个基本概念，它提供了一种与语言模型 (LLM) 交互的结构化方式。它们管理对话历史记录，处理对 LLM 的请求，并为运行工具和处理响应提供一致的接口。

## 理解 LLM 会话

LLM 会话代表了与语言模型交互的上下文。它封装了：

- 对话历史记录 (prompt)
- 可用的工具
- 向 LLM 发起请求的方法
- 更新对话历史记录的方法
- 运行工具的方法

会话由 `AIAgentLLMContext` 类管理，该类提供了创建读取和写入会话的方法。

### 会话类型

Koog 框架提供了两种类型的会话：

1. **写入会话** (`AIAgentLLMWriteSession`)：允许修改 prompt 和工具、发起 LLM 请求以及运行工具。在写入会话中所做的更改会被持久化回 LLM 上下文中。

2. **读取会话** (`AIAgentLLMReadSession`)：提供对 prompt 和工具的只读访问。它们对于在不进行更改的情况下检查当前状态非常有用。

核心区别在于写入会话可以修改对话历史记录，而读取会话则不能。

### 会话生命周期

会话具有定义的生命周期：

1. **创建**：创建一个会话，例如使用 `llm.writeSession { ... }` 或 `llm.readSession { ... }`。
2. **活跃阶段**：会话在 lambda 块执行期间处于活跃状态。
3. **终止**：lambda 块完成后，会话会自动关闭。

会话实现了 `AutoCloseable` 接口，确保即使发生异常也能被正确清理。

## 使用 LLM 会话

### 创建会话

会话是使用 `AIAgentLLMContext` 类的方法创建的：
=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    // 创建写入会话
    llm.writeSession {
        // 此处编写会话代码
    }

    // 创建读取会话
    llm.readSession {
        // 此处编写会话代码
    }
    ```
    <!--- KNIT example-sessions-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava01 {
        public static void main(String[] args) {
            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    // 创建写入会话
    ctx.getLlm().writeSession(session -> {
        // 此处编写会话代码
        return null;
    });

    // 创建读取会话
    ctx.getLlm().readSession(session -> {
        // 此处编写会话代码
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava01.java -->

这些函数接收一个在会话上下文中运行的 lambda 块。当该块完成时，会话会自动关闭。

### 会话作用域与线程安全

会话使用读写锁来确保线程安全：

- 多个读取会话可以同时处于活跃状态。
- 同一时间只能有一个写入会话处于活跃状态。
- 写入会话会阻塞所有其他会话（包括读取和写入）。

这确保了对话历史记录不会因并发修改而损坏。

### 访问会话属性

在会话中，你可以访问 prompt 和工具：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.readSession {
        val messageCount = prompt.messages.size
        val availableTools = tools.map { it.name }
    }
    ```
    <!--- KNIT example-sessions-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava02 {
        public static void main(String[] args) {
            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    ctx.getLlm().readSession(session -> {
        int messageCount = session.getPrompt().getMessages().size();
        var availableTools = session.getTools().stream().map(tool -> tool.getName()).toList();
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava02.java -->

在写入会话中，你还可以修改这些属性：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.tools.ToolDescriptor

    val newTools = listOf<ToolDescriptor>()

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        // 修改 prompt
        appendPrompt {
            user("New user message")
        }

        // 修改工具
        tools = newTools
    }
    ```
    <!--- KNIT example-sessions-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.tools.ToolDescriptor;
    import java.util.Collections;
    class exampleSessionsJava03 {
        public static void main(String[] args) {
            var newTools = Collections.<ToolDescriptor>emptyList();

            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        // 修改 prompt
        session.appendPrompt(promptBuilder -> {
            promptBuilder.user("New user message");
            return null;
        });

        // 修改工具
        session.setTools(newTools);
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava03.java -->

有关更多信息，请参阅 [AIAgentLLMReadSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMReadSession) 和 [AIAgentLLMWriteSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession) 的详细 API 参考。

## 发起 LLM 请求

### 基础请求方法

最常用的发起 LLM 请求的方法是：

1. `requestLLM()`：使用当前的 prompt 和工具向 LLM 发起请求，返回一个响应。

2. `requestLLMWithoutTools()`：使用当前的 prompt 但不使用任何工具向 LLM 发起请求，返回单个响应。

3. `requestLLMForceOneTool()`：使用当前的 prompt 和工具向 LLM 发起请求，强制使用一个工具。

4. `requestLLMOnlyCallingTools()`：向 LLM 发起请求，且该请求应仅通过使用工具来处理。

示例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        // 在启用工具的情况下发起请求
        val response = requestLLM()

        // 在不使用工具的情况下发起请求
        val responseWithoutTools = requestLLMWithoutTools()
    }
    ```
    <!--- KNIT example-sessions-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.message.Message;
    class exampleSessionsJava04 {
        public static void main(String[] args) {
            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        // 在启用工具的情况下发起请求
        var response = session.requestLLM();

        // 在不使用工具的情况下发起请求
        var responseWithoutTools = session.requestLLMWithoutTools();

        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava04.java -->

### 请求如何工作

当你显式调用其中一个请求方法时，就会发起 LLM 请求。需要理解的关键点有：

1. **显式调用**：只有当你调用诸如 `requestLLM()`、`requestLLMWithoutTools()` 等方法时，才会发生请求。
2. **立即执行**：当你调用请求方法时，请求会立即发起，并且该方法会阻塞，直到收到响应。
3. **自动历史记录更新**：在写入会话中，响应会自动添加到对话历史记录中。

### 带有工具的请求方法

在启用工具的情况下发起请求时，LLM 可能会返回工具调用而非文本响应。请求方法会透明地处理这一点：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.prompt.message.MessagePart

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        val response = requestLLM()

        // 响应可能包含工具调用和/或文本
        val toolCalls = response.parts.filterIsInstance<MessagePart.Tool.Call>()
        if (toolCalls.isNotEmpty()) {
            // 处理工具调用
        } else {
            // 处理文本响应
        }
    }
    ```
    <!--- KNIT example-sessions-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.message.Message;
    import ai.koog.prompt.message.MessagePart;
    class exampleSessionsJava05 {
        public static void main(String[] args) {
            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        var response = session.requestLLM();

        // 响应部分可能包含工具调用或文本内容
        boolean hasToolCall = response.getParts().stream()
            .anyMatch(p -> p instanceof MessagePart.Tool.Call);
        if (hasToolCall) {
            // 处理工具调用
        } else {
            // 处理文本响应
        }
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava05.java -->

在实践中，你通常不需要手动检查响应类型，因为代理图会自动处理此路由。

### 结构化与流式请求

对于更高级的用例，平台提供了结构化和流式请求的方法：

1. `requestLLMStructured()`：请求 LLM 以特定的结构化格式提供响应。

2. `requestLLMStructuredOneShot()`：与 `requestLLMStructured()` 类似，但没有重试或修正。

3. `requestLLMStreaming()`：向 LLM 发起流式请求，返回响应分块流 (flow)。你可以在 [流式传输 API](streaming-api.md) 页面上了解更多关于流式传输的信息。

示例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.example.exampleParallelNodeExecution07.JokeRating

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        // 发起结构化请求
        val structuredResponse = requestLLMStructured<JokeRating>()

        // 发起流式请求
        val responseStream = requestLLMStreaming()
        responseStream.collect { chunk ->
            // 在每个分块到达时进行处理
        }
    }
    ```
    <!--- KNIT example-sessions-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava06 {
        public static void main(String[] args) {
            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        // 发起非工具请求
        var responseWithoutTools = session.requestLLMWithoutTools();

        // 发起流式请求
        var responseStream = session.requestLLMStreaming();
        // 处理来自 Flow.Publisher<StreamFrame> 的分块
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava06.java -->

## 管理对话历史记录

### 更新 prompt

在写入会话中，你可以使用 `appendPrompt` 方法向 prompt（对话历史记录）添加消息：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.prompt.message.MessagePart

    val myToolResult = MessagePart.Tool.Result(
        id = "",
        tool = "",
        output = "",
    )

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        appendPrompt {
            // 添加系统消息
            system("You are a helpful assistant.")

            // 添加用户消息
            user("Hello, can you help me with a coding question?")

            // 添加助手消息
            assistant("Of course! What's your question?")

            // 添加工具结果
            toolResult(myToolResult)
        }
    }
    ```
    <!--- KNIT example-sessions-07.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava07 {
        public static void main(String[] args) {
            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        session.appendPrompt(promptBuilder -> {
            // 添加系统消息
            promptBuilder.system("You are a helpful assistant.");

            // 添加用户消息
            promptBuilder.user("Hello, can you help me with a coding question?");

            // 添加助手消息
            promptBuilder.assistant("Of course! What's your question?");

            // 在工具执行后添加后续上下文
            promptBuilder.assistant("Tool execution completed successfully.");
            return null;
        });
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava07.java -->

你还可以通过向 `prompt` 属性分配一个新的 `Prompt` 对象来完全重写 prompt：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.prompt.message.Message

    val filteredMessages = emptyList<Message>()

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        // 基于旧 prompt 创建新 prompt
        prompt = prompt.copy(messages = filteredMessages)
    }
    ```
    <!--- KNIT example-sessions-08.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.dsl.Prompt;
    class exampleSessionsJava08 {
        public static void main(String[] args) {
            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        var oldPrompt = session.getPrompt();
        // 重新构建并替换 prompt（Java 中的手动重写方式）
        session.setPrompt(
            Prompt.builder(oldPrompt.getId())
                .user("Retained summary of previous conversation")
                .build()
        );
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava08.java -->

### 响应时的自动历史记录更新

当你在写入会话中发起 LLM 请求时，响应会自动添加到对话历史记录中：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        // 添加用户消息
        appendPrompt {
            user("What's the capital of France?")
        }

        // 发起请求 – 响应会自动添加到历史记录中
        val response = requestLLM()

        // prompt 现在同时包含了用户消息和模型响应
    }
    ```
    <!--- KNIT example-sessions-09.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava09 {
        public static void main(String[] args) {
            var node = AIAgentNode.builder("node_name")
                .withInput(String.class)
                .withOutput(Void.class)
                .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
                })
                .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        // 添加用户消息
        session.appendPrompt(promptBuilder -> {
            promptBuilder.user("What's the capital of France?");
            return null;
        });

        // 发起请求 – 响应会自动添加到历史记录中
        var response = session.requestLLM();

        // prompt 现在同时包含了用户消息和模型响应
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava09.java -->

这种自动历史记录更新是写入会话的核心特性，确保了对话的自然流转。

### 历史记录压缩

对于长期运行的对话，历史记录可能会变得很大并消耗大量 token。平台提供了压缩历史记录的方法：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        // 使用 TLDR 方法压缩历史记录
        replaceHistoryWithTLDR(HistoryCompressionStrategy.WholeHistory, preserveMemory = true)
    }
    ```
    <!--- KNIT example-sessions-10.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava10 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 使用专用的 Java 节点进行历史记录压缩。
    var compressHistory = AIAgentNode.llmCompressHistory("compressHistory");
    ```
    <!--- KNIT exampleSessionsJava10.java -->

你还可以在策略图中使用 `nodeLLMCompressHistory` 节点在特定点压缩历史记录。

有关历史记录压缩和压缩策略的更多信息，请参阅[历史记录压缩](history-compression.md)。

## 在会话中运行工具

### 调用工具

写入会话提供了几种调用工具的方法：

1. `callTool(tool, args)`：通过引用调用工具。

2. `callTool(toolName, args)`：通过名称调用工具。

3. `callTool(toolClass, args)`：通过类调用工具。

4. `callToolRaw(toolName, args)`：通过名称调用工具并返回原始字符串结果。

示例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.core.agent.session.callTool
    import ai.koog.agents.core.agent.session.callToolRaw

    val myTool = AskUser
    val myArgs = AskUser.Args("this is a string")

    typealias MyTool = AskUser

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        // 通过引用调用工具
        val result = callTool(myTool, myArgs)

        // 通过名称调用工具
        val result2 = callTool("myToolName", myArgs)

        // 通过类调用工具
        val result3 = callTool(MyTool::class, myArgs)

        // 调用工具并获取原始结果
        val rawResult = callToolRaw("myToolName", myArgs)
    }
    ```
    <!--- KNIT example-sessions-11.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava11 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Java 在图策略中使用专用的工具执行节点。
    var executeTool = AIAgentNode.executeTools("executeTool");
    var sendToolResult = AIAgentNode.llmRequest("sendToolResult");
    ```
    <!--- KNIT exampleSessionsJava11.java -->

### 并行工具运行

为了并行运行多个工具，写入会话在 `Flow` 上提供了扩展函数：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.ext.tool.AskUser
    import kotlinx.coroutines.flow.flow

    typealias MyTool = AskUser

    val data = ""
    fun parseDataToArgs(data: String) = flow { emit(AskUser.Args(data)) }

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        // 并行运行工具
        parseDataToArgs(data).toParallelToolCalls(MyTool::class).collect { result ->
            // 处理每个结果
        }

        // 并行运行工具并获取原始结果
        parseDataToArgs(data).toParallelToolCallsRaw(MyTool::class).collect { rawResult ->
            // 处理每个原始结果
        }
    }
    ```
    <!--- KNIT example-sessions-12.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava12 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Java 中并行执行多个工具的等效方式：使用 executeTools 节点。
    var executeMultipleTools = AIAgentNode.executeTools("executeMultipleTools");
    ```
    <!--- KNIT exampleSessionsJava12.java -->

这对于高效处理大量数据非常有用。

## 最佳做法

使用 LLM 会话时，请遵循以下最佳做法：

1. **使用正确的会话类型**：当你需要修改对话历史记录时，请使用写入会话；当你只需要读取它时，请使用读取会话。

2. **保持会话简短**：会话应专注于特定任务，并尽快关闭以释放资源。

3. **处理异常**：确保在会话中处理异常，以防止资源泄露。

4. **管理历史记录大小**：对于长期运行的对话，请使用历史记录压缩以减少 token 使用。

5. **优先使用高层级抽象**：尽可能使用基于节点的 API。例如，使用 `nodeLLMRequest` 而不是直接操作会话。

6. **注意线程安全**：请记住，写入会话会阻塞其他会话，因此请尽可能缩短写入操作。

7. **为复杂数据使用结构化请求**：当你需要 LLM 返回结构化数据时，请使用 `requestLLMStructured` 而不是解析自由格式的文本。

8. **为长响应使用流式传输**：对于长响应，请使用 `requestLLMStreaming` 以在响应到达时对其进行处理。

## 故障排除

### 会话已关闭

如果你看到类似 `Cannot use session after it was closed` 的错误，说明你正尝试在 lambda 块完成后使用会话。请确保所有会话操作都在会话块内执行。

### 历史记录过大

如果你的历史记录变得太大并消耗过多的 token，请使用历史记录压缩技术：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy

    val strategy = strategy<Unit, Unit>("strategy-name") {
        val node by node<Unit, Unit> {
    -->
    <!--- SUFFIX
       }
    }
    -->
    ```kotlin
    llm.writeSession {
        replaceHistoryWithTLDR(HistoryCompressionStrategy.FromLastNMessages(10), preserveMemory = true)
    }
    ```
    <!--- KNIT example-sessions-13.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleSessionsJava13 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 使用 Java 压缩节点压缩最近的历史记录。
    var compressHistory = AIAgentNode.llmCompressHistory("compressHistory");
    ```
    <!--- KNIT exampleSessionsJava13.java -->

有关更多信息，请参阅[历史记录压缩](history-compression.md)

### 找不到工具

如果你看到有关找不到工具的错误，请检查：

- 工具是否已在工具注册表中正确注册。
- 你使用的是否为正确的工具名称或类。

## API 文档

有关更多信息，请参阅完整的 [AIAgentLLMSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMSession) 和 [AIAgentLLMContext](api:agents-core::ai.koog.agents.core.agent.context.AIAgentLLMContext) 参考。