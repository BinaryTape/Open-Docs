# LLM 세션 및 수동 이력 관리

이 페이지에서는 읽기 및 쓰기 세션 작업 방법, 대화 이력 관리, 언어 모델에 대한 요청 수행 등을 포함하여 LLM 세션에 대한 자세한 정보를 제공합니다.

## 서론

LLM 세션은 언어 모델(LLM)과 상호작용하는 구조화된 방법을 제공하는 핵심 개념입니다. 세션은 대화 이력을 관리하고, LLM에 대한 요청을 처리하며, 도구 실행 및 응답 처리를 위한 일관된 인터페이스를 제공합니다.

## LLM 세션 이해하기

LLM 세션은 언어 모델과 상호작용하기 위한 컨텍스트(context)를 나타냅니다. 세션은 다음 항목들을 캡슐화합니다:

- 대화 이력 (프롬프트)
- 사용 가능한 도구
- LLM에 요청을 보내는 메서드
- 대화 이력을 업데이트하는 메서드
- 도구를 실행하는 메서드

세션은 `AIAgentLLMContext` 클래스에 의해 관리되며, 이 클래스는 읽기 및 쓰기 세션을 생성하는 메서드를 제공합니다.

### 세션 유형

Koog 프레임워크는 두 가지 유형의 세션을 제공합니다:

1.  **쓰기 세션** (`AIAgentLLMWriteSession`): 프롬프트와 도구를 수정하고, LLM 요청을 보내며, 도구를 실행할 수 있습니다. 쓰기 세션에서 변경된 사항은 LLM 컨텍스트에 다시 저장됩니다.

2.  **읽기 세션** (`AIAgentLLMReadSession`): 프롬프트와 도구에 대해 읽기 전용 접근을 제공합니다. 변경 사항을 만들지 않고 현재 상태를 조사할 때 유용합니다.

핵심적인 차이점은 쓰기 세션은 대화 이력을 수정할 수 있는 반면, 읽기 세션은 수정할 수 없다는 점입니다.

### 세션 생명주기

세션은 정의된 생명주기를 가집니다:

1.  **생성**: `llm.writeSession { ... }` 또는 `llm.readSession { ... }` 등을 사용하여 세션이 생성됩니다.
2.  **활성 단계**: 람다 블록이 실행되는 동안 세션이 활성화됩니다.
3.  **종료**: 람다 블록이 완료되면 세션이 자동으로 닫힙니다.

세션은 `AutoCloseable` 인터페이스를 구현하므로, 예외가 발생하더라도 적절하게 정리(clean up)되도록 보장합니다.

## LLM 세션 작업하기

### 세션 생성하기

세션은 `AIAgentLLMContext` 클래스의 메서드를 사용하여 생성됩니다:
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
    // 쓰기 세션 생성
    llm.writeSession {
        // 세션 코드 작성
    }

    // 읽기 세션 생성
    llm.readSession {
        // 세션 코드 작성
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
    // 쓰기 세션 생성
    ctx.getLlm().writeSession(session -> {
        // 세션 코드 작성
        return null;
    });

    // 읽기 세션 생성
    ctx.getLlm().readSession(session -> {
        // 세션 코드 작성
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava01.java -->

이 함수들은 세션의 컨텍스트 내에서 실행되는 람다 블록을 인자로 받습니다. 블록이 완료되면 세션은 자동으로 닫힙니다.

### 세션 범위 및 스레드 안전성

세션은 스레드 안전성(thread safety)을 보장하기 위해 읽기-쓰기 잠금(read-write lock)을 사용합니다:

- 여러 개의 읽기 세션이 동시에 활성화될 수 있습니다.
- 한 번에 하나의 쓰기 세션만 활성화될 수 있습니다.
- 쓰기 세션은 다른 모든 세션(읽기 및 쓰기 모두)을 차단합니다.

이를 통해 동시 수정으로 인해 대화 이력이 손상되지 않도록 보장합니다.

### 세션 속성 접근하기

세션 내에서 프롬프트와 도구에 접근할 수 있습니다:

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

쓰기 세션에서는 이러한 속성들을 수정할 수도 있습니다:

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
        // 프롬프트 수정
        appendPrompt {
            user("New user message")
        }

        // 도구 수정
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
        // 프롬프트 수정
        session.appendPrompt(promptBuilder -> {
            promptBuilder.user("New user message");
            return null;
        });

        // 도구 수정
        session.setTools(newTools);
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava03.java -->

더 자세한 정보는 [AIAgentLLMReadSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMReadSession) 및 [AIAgentLLMWriteSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession)에 대한 상세 API 레퍼런스를 참조하세요.

## LLM 요청 수행하기

### 기본 요청 메서드

LLM 요청을 수행하기 위해 가장 흔히 사용되는 메서드는 다음과 같습니다:

1. `requestLLM()`: 현재 프롬프트와 도구를 사용하여 LLM에 요청을 보내고, 응답을 반환합니다.

2. `requestLLMWithoutTools()`: 도구 없이 현재 프롬프트만 사용하여 LLM에 요청을 보내고, 단일 응답을 반환합니다.

3. `requestLLMForceOneTool()`: 현재 프롬프트와 도구를 사용하여 LLM에 요청을 보내며, 하나의 도구 사용을 강제합니다.

4. `requestLLMOnlyCallingTools()`: 도구만 사용하여 처리되어야 하는 요청을 LLM에 보냅니다.

예시:

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
        // 도구가 활성화된 상태로 요청 수행
        val response = requestLLM()

        // 도구 없이 요청 수행
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
        // 도구가 활성화된 상태로 요청 수행
        var response = session.requestLLM();

        // 도구 없이 요청 수행
        var responseWithoutTools = session.requestLLMWithoutTools();

        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava04.java -->

### 요청 작동 방식

LLM 요청은 요청 메서드 중 하나를 명시적으로 호출할 때 발생합니다. 이해해야 할 핵심 사항은 다음과 같습니다:

1. **명시적 호출**: 요청은 `requestLLM()`, `requestLLMWithoutTools()` 등과 같은 메서드를 호출할 때만 발생합니다.
2. **즉각적 실행**: 요청 메서드를 호출하면 요청이 즉시 수행되며, 응답을 받을 때까지 메서드가 차단(block)됩니다.
3. **자동 이력 업데이트**: 쓰기 세션에서 응답은 대화 이력에 자동으로 추가됩니다.

### 도구를 사용한 요청 메서드

도구가 활성화된 상태에서 요청을 보낼 때, LLM은 텍스트 응답 대신 도구 호출(tool call)로 응답할 수 있습니다. 요청 메서드는 이를 투명하게 처리합니다:

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

        // 응답은 도구 호출 및/또는 텍스트를 포함할 수 있습니다.
        val toolCalls = response.parts.filterIsInstance<MessagePart.Tool.Call>()
        if (toolCalls.isNotEmpty()) {
            // 도구 호출 처리
        } else {
            // 텍스트 응답 처리
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

        // 응답 파트는 도구 호출이나 텍스트 콘텐츠를 포함할 수 있습니다.
        boolean hasToolCall = response.getParts().stream()
            .anyMatch(p -> p instanceof MessagePart.Tool.Call);
        if (hasToolCall) {
            // 도구 호출 처리
        } else {
            // 텍스트 응답 처리
        }
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava05.java -->

실제로는 에이전트 그래프가 이러한 라우팅을 자동으로 처리하므로 응답 유형을 수동으로 확인할 필요가 없는 경우가 많습니다.

### 구조화된 및 스트리밍 요청

더 고급 사용 사례를 위해 구조화된 요청 및 스트리밍 요청을 위한 메서드를 제공합니다:

1. `requestLLMStructured()`: LLM이 특정 구조화된 형식으로 응답을 제공하도록 요청합니다.

2. `requestLLMStructuredOneShot()`: `requestLLMStructured()`와 유사하지만 재시도나 수정 과정이 없습니다.

3. `requestLLMStreaming()`: LLM에 스트리밍 요청을 보내고 응답 청크(chunk)의 플로우(flow)를 반환합니다. 스트리밍에 대한 자세한 내용은 [Streaming API](streaming-api.md) 페이지에서 확인할 수 있습니다.

예시:

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
        // 구조화된 요청 수행
        val structuredResponse = requestLLMStructured<JokeRating>()

        // 스트리밍 요청 수행
        val responseStream = requestLLMStreaming()
        responseStream.collect { chunk ->
            // 각 청크가 도착할 때마다 처리
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
        // 도구 없는 요청 수행
        var responseWithoutTools = session.requestLLMWithoutTools();

        // 스트리밍 요청 수행
        var responseStream = session.requestLLMStreaming();
        // Flow.Publisher<StreamFrame>으로부터 청크 처리
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava06.java -->

## 대화 이력 관리하기

### 프롬프트 업데이트하기

쓰기 세션에서는 `appendPrompt` 메서드를 사용하여 프롬프트(대화 이력)에 메시지를 추가할 수 있습니다:

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
            // 시스템 메시지 추가
            system("You are a helpful assistant.")

            // 사용자 메시지 추가
            user("Hello, can you help me with a coding question?")

            // 어시스턴트 메시지 추가
            assistant("Of course! What's your question?")

            // 도구 결과 추가
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
            // 시스템 메시지 추가
            promptBuilder.system("You are a helpful assistant.");

            // 사용자 메시지 추가
            promptBuilder.user("Hello, can you help me with a coding question?");

            // 어시스턴트 메시지 추가
            promptBuilder.assistant("Of course! What's your question?");

            // 도구 실행 후 후속 컨텍스트 추가
            promptBuilder.assistant("Tool execution completed successfully.");
            return null;
        });
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava07.java -->

또한 `prompt` 속성에 새 `Prompt` 객체를 할당하여 프롬프트를 완전히 다시 작성할 수도 있습니다:

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
        // 이전 프롬프트를 기반으로 새 프롬프트 생성
        prompt = prompt.copy(messages = filteredMessages)
    }
    ```
    <!--- KNIT example-sessions-08.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.Prompt;
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
        // 프롬프트를 재빌드하고 교체 (Java에서의 수동 다시 쓰기 방식)
        session.setPrompt(
            Prompt.builder(oldPrompt.getId())
                .user("Retained summary of previous conversation")
                .build()
        );
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava08.java -->

### 응답 시 자동 이력 업데이트

쓰기 세션에서 LLM 요청을 수행하면 응답이 대화 이력에 자동으로 추가됩니다:

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
        // 사용자 메시지 추가
        appendPrompt {
            user("What's the capital of France?")
        }

        // 요청 수행 – 응답이 자동으로 이력에 추가됩니다.
        val response = requestLLM()

        // 이제 프롬프트에는 사용자 메시지와 모델의 응답이 모두 포함됩니다.
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
        // 사용자 메시지 추가
        session.appendPrompt(promptBuilder -> {
            promptBuilder.user("What's the capital of France?");
            return null;
        });

        // 요청 수행 – 응답이 자동으로 이력에 추가됩니다.
        var response = session.requestLLM();

        // 이제 프롬프트에는 사용자 메시지와 모델의 응답이 모두 포함됩니다.
        return null;
    });
    ```
    <!--- KNIT exampleSessionsJava09.java -->

이 자동 이력 업데이트는 쓰기 세션의 핵심 기능으로, 대화가 자연스럽게 이어지도록 보장합니다.

### 이력 압축

장기 대화의 경우 이력이 커져서 많은 토큰을 소비할 수 있습니다. 플랫폼은 이력을 압축하기 위한 메서드를 제공합니다:

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
        // TLDR 방식을 사용하여 이력 압축
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
    // 이력 압축을 위해 전용 Java 노드를 사용합니다.
    var compressHistory = AIAgentNode.llmCompressHistory("compressHistory");
    ```
    <!--- KNIT exampleSessionsJava10.java -->

또한 전략 그래프의 `nodeLLMCompressHistory` 노드를 사용하여 특정 시점에서 이력을 압축할 수도 있습니다.

이력 압축 및 압축 전략에 대한 자세한 내용은 [이력 압축](history-compression.md)을 참조하세요.

## 세션에서 도구 실행하기

### 도구 호출하기

쓰기 세션은 도구를 호출하기 위한 여러 메서드를 제공합니다:

1. `callTool(tool, args)`: 참조로 도구를 호출합니다.

2. `callTool(toolName, args)`: 이름으로 도구를 호출합니다.

3. `callTool(toolClass, args)`: 클래스로 도구를 호출합니다.

4. `callToolRaw(toolName, args)`: 이름으로 도구를 호출하고 원시 문자열 결과를 반환합니다.

예시:

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
        // 참조로 도구 호출
        val result = callTool(myTool, myArgs)

        // 이름으로 도구 호출
        val result2 = callTool("myToolName", myArgs)

        // 클래스로 도구 호출
        val result3 = callTool(MyTool::class, myArgs)

        // 도구를 호출하고 원시 결과 가져오기
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
    // Java는 그래프 전략에서 전용 도구 실행 노드를 사용합니다.
    var executeTool = AIAgentNode.executeTools("executeTool");
    var sendToolResult = AIAgentNode.llmSendToolResults("sendToolResult");
    ```
    <!--- KNIT exampleSessionsJava11.java -->

### 병렬 도구 실행

여러 도구를 병렬로 실행하기 위해, 쓰기 세션은 `Flow`에 대한 확장 함수를 제공합니다:

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
        // 도구를 병렬로 실행
        parseDataToArgs(data).toParallelToolCalls(MyTool::class).collect { result ->
            // 각 결과 처리
        }

        // 도구를 병렬로 실행하고 원시 결과 가져오기
        parseDataToArgs(data).toParallelToolCallsRaw(MyTool::class).collect { rawResult ->
            // 각 원시 결과 처리
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
    // 병렬 다중 도구 실행에 대응하는 Java: executeTools 노드를 사용합니다.
    var executeMultipleTools = AIAgentNode.executeTools("executeMultipleTools");
    ```
    <!--- KNIT exampleSessionsJava12.java -->

이는 대량의 데이터를 효율적으로 처리할 때 유용합니다.

## 권장 사항

LLM 세션으로 작업할 때는 다음 권장 사항을 따르세요:

1. **적절한 세션 유형 사용**: 대화 이력을 수정해야 할 때는 쓰기 세션을 사용하고, 읽기만 필요할 때는 읽기 세션을 사용하세요.

2. **세션을 짧게 유지**: 세션은 특정 작업에 집중해야 하며, 리소스를 해제하기 위해 가능한 한 빨리 닫아야 합니다.

3. **예외 처리**: 리소스 누수를 방지하기 위해 세션 내에서 예외를 처리해야 합니다.

4. **이력 크기 관리**: 장기 대화의 경우 이력 압축을 사용하여 토큰 사용량을 줄이세요.

5. **고수준 추상화 선호**: 가능하면 노드 기반 API를 사용하세요. 예를 들어, 세션을 직접 다루는 대신 `nodeLLMRequest`를 사용하세요.

6. **스레드 안전성 유의**: 쓰기 세션은 다른 세션을 차단하므로 쓰기 작업을 가능한 한 짧게 유지하세요.

7. **복잡한 데이터에는 구조화된 요청 사용**: LLM이 구조화된 데이터를 반환해야 할 때는 자유 형식 텍스트를 파싱하는 대신 `requestLLMStructured`를 사용하세요.

8. **긴 응답에는 스트리밍 사용**: 응답이 길어질 경우 `requestLLMStreaming`을 사용하여 응답이 도착하는 대로 처리하세요.

## 문제 해결

### 세션이 이미 닫힘 (Session already closed)

`Cannot use session after it was closed`와 같은 오류가 발생하면 람다 블록이 완료된 후에 세션을 사용하려고 하는 것입니다. 모든 세션 작업이 세션 블록 내에서 수행되는지 확인하세요.

### 이력이 너무 큼 (History too large)

이력이 너무 커져서 너무 많은 토큰을 소비하는 경우 이력 압축 기술을 사용하세요:

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
    // Java 압축 노드를 사용하여 최근 이력을 압축합니다.
    var compressHistory = AIAgentNode.llmCompressHistory("compressHistory");
    ```
    <!--- KNIT exampleSessionsJava13.java -->

더 자세한 정보는 [이력 압축](history-compression.md)을 참조하세요.

### 도구를 찾을 수 없음 (Tool not found)

도구를 찾을 수 없다는 오류가 발생하면 다음 사항을 확인하세요:

- 도구가 도구 레지스트리(tool registry)에 올바르게 등록되었는지 확인합니다.
- 올바른 도구 이름이나 클래스를 사용하고 있는지 확인합니다.

## API 문서

더 자세한 정보는 [AIAgentLLMSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMSession) 및 [AIAgentLLMContext](api:agents-core::ai.koog.agents.core.agent.context.AIAgentLLMContext) 전체 레퍼런스를 참조하세요.