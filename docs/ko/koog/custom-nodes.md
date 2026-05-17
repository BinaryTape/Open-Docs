# 커스텀 노드 구현

이 페이지에서는 Koog 프레임워크에서 자신만의 커스텀 노드(custom nodes)를 구현하는 방법에 대한 자세한 지침을 제공합니다. 
커스텀 노드를 사용하면 특정 작업을 수행하는 재사용 가능한 구성 요소를 생성하여 에이전트 워크플로의 기능을 확장할 수 있습니다.

그래프 노드가 무엇인지, 그 사용법 및 기존 기본 노드에 대해 자세히 알아보려면 [그래프 노드](nodes-and-components.md)를 참조하세요.

## 노드 아키텍처 개요

구현 세부 사항을 살펴보기 전에 Koog 프레임워크의 노드 아키텍처를 이해하는 것이 중요합니다. 노드는 에이전트 워크플로의 기본 빌딩 블록이며, 각 노드는 워크플로 내의 특정 작업 또는 변환을 나타냅니다. 노드 간의 실행 흐름을 정의하는 에지(edge)를 사용하여 노드들을 연결합니다.

각 노드는 입력을 받아 출력을 생성하는 `execute` 메서드를 가지며, 생성된 출력은 워크플로의 다음 노드로 전달됩니다.

## 커스텀 노드 구현하기

커스텀 노드 구현은 입력 데이터에 대해 기본적인 로직을 수행하고 출력을 반환하는 단순한 구현부터, 파라미터를 허용하고 실행 간에 상태를 유지하는 더 복잡한 노드 구현까지 다양합니다.

### 기본 노드 구현

그래프에서 커스텀 노드를 구현하고 자신만의 커스텀 로직을 정의하는 가장 간단한 방법은 다음 패턴을 사용하는 것입니다.

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
        // 처리 로직
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
            // 처리 로직
            return returnValue;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava01.java -->

위 코드는 미리 정의된 `Input` 및 `Output` 타입을 가진 커스텀 노드 `myNode`를 나타내며, 선택적으로 이름 문자열 파라미터(`node_name`)를 가집니다. Kotlin에서는 `node` DSL 함수를 사용합니다. Java에서는 `AIAgentNode.builder()` 패턴을 사용합니다.

실제 예시로, 문자열 입력을 받아 문자열의 길이를 반환하는 간단한 노드는 다음과 같습니다.

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
        // 처리 로직
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
            // 처리 로직
            return input.length();
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava02.java -->

커스텀 노드를 만드는 또 다른 방법은 이를 재사용 가능한 함수로 추출하는 것입니다. Kotlin에서는 `node` 함수를 호출하는 `AIAgentSubgraphBuilderBase`의 확장 함수를 정의합니다. Java에서는 노드 빌더 호출을 헬퍼 메서드(helper method)로 추출합니다.

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
        // 커스텀 로직
        input // 입력을 출력으로 반환 (패스스루)
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
            // 커스텀 로직
            return input; // 입력을 출력으로 반환 (패스스루)
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava03.java -->

이 방식은 커스텀 로직을 수행하지만 수정 없이 입력을 출력으로 반환하는 패스스루(pass-through) 노드를 생성합니다.

### 추가 인자가 있는 노드

동작을 커스터마이징하기 위해 인자(arguments)를 받는 노드를 생성할 수 있습니다.

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
        // 커스텀 로직에서 arg1과 arg2를 사용
        input // 입력을 출력으로 반환
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
            // 커스텀 로직에서 arg1과 arg2를 사용
            return input; // 입력을 출력으로 반환
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava04.java -->

### 파라미터화된 노드

제네릭 입력 및 출력 타입 파라미터를 가진 노드를 정의할 수 있습니다. Kotlin에서는 `reified` 타입 파라미터를 가진 `inline` 함수를 사용합니다. Java에서는 노드를 빌드할 때 타입을 명시적으로 지정합니다.

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
        // 추가 작업 수행
        // 입력을 출력으로 반환
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
    // Java에서는 노드를 빌드할 때 타입을 명시적으로 지정합니다.
    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 추가 작업 수행
            // 입력을 출력으로 반환
            return input;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava05.java -->

### 상태 유지 노드

노드가 실행 간에 상태를 유지해야 하는 경우, 클로저 변수(closure variables)를 사용할 수 있습니다. Kotlin에서는 감싸는 함수(enclosing function)에 변수를 선언합니다. Java에서는 람다 캡처 대상이 사실상 final(effectively final)이어야 하므로 `AtomicInteger`와 같은 스레드 안전한 래퍼를 사용합니다.

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
    // Java에서는 람다 캡처 대상이 사실상 final이어야 하므로 AtomicInteger(또는 유사한 클래스)를 사용합니다.
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

## 노드 입력 및 출력 타입

노드는 서로 다른 입력 및 출력 타입을 가질 수 있습니다. Kotlin과 Java 모두에서 이는 제네릭 타입 파라미터로 지정됩니다.

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
        // 처리 로직
        input.toInt() // 문자열을 정수로 변환
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
            // 처리 로직
            return Integer.parseInt(input); // 문자열을 정수로 변환
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava07.java -->

!!! note
    입력 및 출력 타입은 워크플로에서 노드가 다른 노드와 연결되는 방식을 결정합니다. 소스 노드의 출력 타입이 대상 노드의 입력 타입과 호환되는 경우에만 노드를 연결할 수 있습니다.

## 권장 사항

커스텀 노드를 구현할 때는 다음 권장 사항을 따르세요.

1. **노드의 집중성 유지**: 각 노드는 단일하고 잘 정의된 작업을 수행해야 합니다.
2. **서술적인 이름 사용**: 노드 이름은 그 목적을 명확하게 나타내야 합니다.
3. **파라미터 문서화**: 모든 파라미터에 대해 명확한 설명을 제공하세요.
4. **적절한 에러 처리**: 워크플로 실패를 방지하기 위해 적절한 에러 처리를 구현하세요.
5. **노드 재사용성 고려**: 노드를 서로 다른 워크플로에서 재사용할 수 있도록 설계하세요.
6. **타입 파라미터 활용**: 노드를 더 유연하게 만들기 위해 적절한 경우 제네릭 타입 파라미터를 사용하세요.
7. **기본값 제공**: 가능한 경우 파라미터에 대해 합리적인 기본값을 제공하세요.

## 일반적인 패턴

다음 섹션에서는 커스텀 노드를 구현하기 위한 몇 가지 일반적인 패턴을 제공합니다.

### 패스스루 노드 (Pass-through nodes)

작업을 수행하지만 입력을 그대로 출력으로 반환하는 노드입니다.

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
        input // 입력을 출력으로 반환
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
            return input; // 입력을 출력으로 반환
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava08.java -->

### 변환 노드 (Transformation nodes)

입력 데이터를 변환하여 수정된 출력을 생성하는 노드입니다.

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
        input.uppercase() // 입력을 대문자로 변환
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
            return input.toUpperCase(); // 입력을 대문자로 변환
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava09.java -->

### LLM 상호작용 노드 (LLM interaction nodes)

LLM과 상호작용하는 노드입니다. Kotlin에서는 LLM 세션에 대해 미세한 제어가 가능합니다. Java에서는 일반적으로 프롬프트 구성을 자동으로 처리하는 `AIAgentNode.llmRequest()`와 같은 미리 빌드된 팩토리 메서드를 사용합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.prompt.message.MessagePart
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
            response.parts.filterIsInstance<MessagePart.Text>().joinToString("
") { it.text }
        }
    }
    ```
    <!--- KNIT example-custom-nodes-10.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.message.Message;
    import ai.koog.prompt.message.MessagePart;
    import java.util.stream.Collectors;
    class exampleCustomNodesJava10 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Java에서 LLM 상호작용은 미리 빌드된 팩토리 노드를 사용하여 처리됩니다.
    // AIAgentNode.llmRequest()는 입력 문자열을 LLM에 사용자 메시지로 보내고
    // 그 응답을 반환하는 노드를 생성합니다. 프롬프트 텍스트는 노드가 그래프에서
    // 실행될 때 노드의 입력으로 제공됩니다.
    var summarizeTextNode = AIAgentNode.llmRequest("node_name");

    // LLM 응답에서 텍스트 콘텐츠를 추출하려면 별도의 노드를 체이닝합니다.
    var extractContent = AIAgentNode.builder("extract-content")
        .withInput(Message.Assistant.class)
        .withOutput(String.class)
        .withAction((response, ctx) -> response.getParts().stream()
            .filter(p -> p instanceof MessagePart.Text)
            .map(p -> ((MessagePart.Text) p).getText())
            .collect(Collectors.joining()))
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava10.java -->

!!! note
    위 Kotlin 예제는 LLM 세션에 대한 미세한 제어(커스텀 프롬프트 구성, 명시적 `requestLLMWithoutTools` 호출)를 보여줍니다. Java API는 프롬프트 구성을 자동으로 처리하는 `AIAgentNode.llmRequest()`와 같은 고수준 팩토리 메서드를 제공하며, 여기서는 입력 문자열이 사용자 메시지가 됩니다. 고급 프롬프트 커스터마이징이 필요한 경우 여러 노드를 구성하거나 커스텀 서브그래프를 사용하세요.

### 도구 실행 노드 (Tool run node)

도구를 실행하는 커스텀 노드입니다. Kotlin에서는 도구 호출을 수동으로 구성하고 실행할 수 있습니다. Java에서는 일반적으로 도구 조율을 LLM에 위임하는 서브그래프를 사용합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.prompt.message.MessagePart
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
        val toolCall = MessagePart.Tool.Call(
            id = UUID.randomUUID().toString(),
            tool = toolName,
            args = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42)) // 입력을 도구 인자로 사용
        )

        val result = environment.executeTool(toolCall)
        result.output
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
    // Java 빌더 API를 통해서는 Kotlin 예제에서 보여주는 직접적인 도구 실행이 지원되지 않습니다.
    // 대신, 도구 호출을 LLM에 위임하는 서브그래프를 사용하세요.
    // LLM이 도구를 언제 어떻게 호출할지 결정하게 됩니다.
    var toolSubgraph = AIAgentSubgraph.builder("tool-subgraph")
        .withInput(String.class)
        .withOutput(String.class)
        .withTask(input -> "Use my_tool with input: " + input)
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava11.java -->

!!! note
    Kotlin 예제는 `MessagePart.Tool.Call`을 수동으로 생성하고 `environment.executeTool()`을 호출하여 저수준 도구 실행을 수행하는 방식을 보여줍니다. Java API는 LLM이 도구 호출을 자동으로 조율하는 `withTask()`와 함께 서브그래프를 사용하는 고수준 접근 방식을 권장합니다. 사용 가능한 도구를 제한하려면 `.withInput()` 전에 `.limitedTools(List.of(myTool))`를 체이닝하세요.