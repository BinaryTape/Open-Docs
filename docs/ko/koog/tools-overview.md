# 개요

에이전트(agent)는 도구를 사용하여 특정 작업을 수행하거나 외부 시스템에 액세스합니다.

## 도구 워크플로

Koog 프레임워크는 Kotlin 및 Java에서 도구 작업을 위한 다음과 같은 워크플로를 제공합니다:

1. 커스텀 도구를 생성하거나 내장 도구 중 하나를 사용합니다.
2. 도구 레지스트리(tool registry)에 도구를 추가합니다.
3. 도구 레지스트리를 에이전트에 전달합니다.
4. 에이전트와 함께 도구를 사용합니다.

### 사용 가능한 도구 유형

Koog 프레임워크에는 세 가지 유형의 도구가 있습니다:

- 에이전트-사용자 간의 상호작용 및 대화 관리를 위한 기능을 제공하는 **내장 도구(Built-in tools)**. 자세한 내용은 [내장 도구](built-in-tools.md)를 참조하세요.
- 함수를 LLM에 도구로 노출할 수 있게 해주는 **어노테이션 기반 커스텀 도구(Annotation-based custom tools)**. 자세한 내용은 [어노테이션 기반 도구](annotation-based-tools.md)를 참조하세요.
- 도구 파라미터, 메타데이터, 실행 로직 및 등록/호출 방식을 제어할 수 있는 **커스텀 도구**. 자세한 내용은 [클래스 기반 도구](class-based-tools.md)를 참조하세요.

### 도구 레지스트리

에이전트에서 도구를 사용하려면 먼저 도구 레지스트리에 도구를 추가해야 합니다.
도구 레지스트리는 에이전트가 사용할 수 있는 모든 도구를 관리합니다.

도구 레지스트리의 주요 특징:

- 도구를 조직화합니다.
- 여러 도구 레지스트리의 병합을 지원합니다.
- 이름이나 유형별로 도구를 검색하는 메서드를 제공합니다.

자세한 내용은 [ToolRegistry](api:agents-tools::ai.koog.agents.core.tools.ToolRegistry)를 참조하세요.

다음은 도구 레지스트리를 생성하고 도구를 추가하는 예시입니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    import ai.koog.agents.core.tools.reflect.tools
    class MyToolSet : ToolSet {
        @Tool
        fun myTool(): String {
            // 도구 구현
            return "Result"
        }
    }
    val myTool = MyToolSet()
    -->
    ```kotlin
    val toolRegistry = ToolRegistry {
        tools(myTool)
    }
    ```
    <!--- KNIT example-tools-overview-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // ToolSet 인스턴스 생성
    MyToolSet myTool = new MyToolSet();

    // ToolRegistry를 빌드하고 ToolSet에서 도구 등록
    ToolRegistry toolRegistry = ToolRegistry.builder()
        .tools(myTool)
        .build();
    ```
    <!--- KNIT example-tools-overview-java-01.java -->

여러 도구 레지스트리를 병합하려면 다음과 같이 하세요:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    import ai.koog.agents.core.tools.reflect.tools
    class FirstToolSet : ToolSet {
        @Tool
        fun firstSampleTool(): String {
            // 도구 구현
            return "First result"
        }
    }
    class SecondToolSet : ToolSet {
        @Tool
        fun secondSampleTool(): String {
            // 도구 구현
            return "Second result"
        }
    }
    val firstSampleTool = FirstToolSet()
    val secondSampleTool = SecondToolSet()
    -->
    ```kotlin
    val firstToolRegistry = ToolRegistry {
        tools(firstSampleTool)
    }
    
    val secondToolRegistry = ToolRegistry {
        tools(secondSampleTool)
    }
    
    val newRegistry = firstToolRegistry + secondToolRegistry
    ```
    <!--- KNIT example-tools-overview-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // ToolSet 인스턴스 생성
    FirstToolSet firstSampleTool = new FirstToolSet();
    SecondToolSet secondSampleTool = new SecondToolSet();

    // 개별 도구 레지스트리 빌드
    ToolRegistry firstToolRegistry = ToolRegistry.builder()
        .tools(firstSampleTool)
        .build();

    ToolRegistry secondToolRegistry = ToolRegistry.builder()
        .tools(secondSampleTool)
        .build();

    ToolRegistry newRegistry = firstToolRegistry.plus(secondToolRegistry);
    ```
    <!--- KNIT example-tools-overview-java-02.java -->

### 에이전트에 도구 전달하기

에이전트가 도구를 사용할 수 있게 하려면, 에이전트를 생성할 때 해당 도구가 포함된 도구 레지스트리를 인자로 제공해야 합니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleToolsOverview01.toolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    // 에이전트 초기화
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        systemPrompt = "You are a helpful assistant with strong mathematical skills.",
        llmModel = OpenAIModels.Chat.GPT4o,
        // 에이전트에 도구 레지스트리 전달
        toolRegistry = toolRegistry
    )
    ```
    <!--- KNIT example-tools-overview-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are a helpful assistant with strong mathematical skills.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .toolRegistry(ToolRegistry.builder()
            .tools(secondSampleTool)
            .build()
        )
        .build();
    ```
    <!--- KNIT example-tools-overview-java-03.java -->

### 도구 호출하기

에이전트 코드 내에서 도구를 호출하는 방법은 여러 가지가 있습니다. 권장되는 방법은 도구를 직접 호출하는 대신 에이전트 컨텍스트(context)에서 제공하는 메서드를 사용하는 것입니다. 이는 에이전트 환경 내에서 도구 작업이 적절하게 처리되도록 보장합니다.

!!! tip
    에이전트의 실패를 방지하기 위해 도구 내에 적절한 [오류 처리](features/agent-event-handlers.md)를 구현했는지 확인하세요.

도구는 `AIAgentLLMWriteSession`으로 표현되는 특정 세션 컨텍스트 내에서 호출됩니다.
여기에서는 다음과 같이 도구를 호출할 수 있는 여러 메서드를 제공합니다:

- 주어진 인자로 도구 호출.
- 이름과 주어진 인자로 도구 호출.
- 제공된 도구 클래스와 인자로 도구 호출.
- 지정된 유형의 도구를 주어진 인자와 함께 호출.
- 원시 문자열(raw string) 결과를 반환하는 도구 호출.

자세한 내용은 [AIAgentLLMWriteSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession) API 레퍼런스를 참조하세요.

#### 병렬 도구 호출

`toParallelToolCallsRaw` 확장 기능을 사용하여 도구를 병렬로 호출할 수도 있습니다. 예시:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.tools.SimpleTool
    import kotlinx.coroutines.flow.collect
    import kotlinx.coroutines.flow.flow
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    @Serializable
    data class Book(
        val title: String,
        val author: String,
        val description: String
    )
    
    class BookTool() : SimpleTool<Book>(
        argsType = typeToken<Book>(),
        name = NAME,
        description = "A tool to parse book information from Markdown"
    ) {
        companion object {
            const val NAME = "book"
        }
    
        override suspend fun execute(args: Book): String {
            println("${args.title} by ${args.author}:
 ${args.description}")
            return "Done"
        }
    }
    
    val strategy = strategy<Unit, Unit>("strategy-name") {
    
        /*...*/
    
        val myNode by node<Unit, Unit> { _ ->
            llm.writeSession {
                flow {
                    emit(Book("Book 1", "Author 1", "Description 1"))
                }.toParallelToolCallsRaw(BookTool::class).collect()
            }
        }
    }
    
    ```
    <!--- KNIT example-tools-overview-04.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-tools-overview-java-04.java -->

#### 노드에서 도구 호출하기

노드(node)를 사용하여 에이전트 워크플로를 구축할 때, 도구 호출을 위해 특별한 노드를 사용할 수 있습니다:

* **nodeExecuteTool**: 단일 도구 호출을 수행하고 그 결과를 반환합니다. 자세한 내용은 [API 레퍼런스](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteTool)를 참조하세요.

* **nodeExecuteSingleTool**: 제공된 인자로 특정 도구를 호출합니다. 자세한 내용은 [API 레퍼런스](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteSingleTool)를 참조하세요.

* **nodeExecuteMultipleTools**: 여러 도구 호출을 수행하고 그 결과를 반환합니다. 자세한 내용은 [API 레퍼런스](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools)를 참조하세요.

* **nodeLLMSendToolResult**: 도구 결과를 LLM에 보내고 응답을 받습니다. 자세한 내용은 [API 레퍼런스](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult)를 참조하세요.

* **nodeLLMSendMultipleToolResults**: 여러 도구 결과를 LLM에 보냅니다. 자세한 내용은 [API 레퍼런스](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults)를 참조하세요.

## 에이전트를 도구로 사용하기

이 프레임워크는 모든 AI 에이전트를 다른 에이전트가 사용할 수 있는 도구로 변환하는 기능을 제공합니다. 
이 강력한 기능을 통해 전문화된 에이전트가 상위 수준의 오케스트레이션(orchestration) 에이전트에 의해 도구처럼 호출되는 계층적 에이전트 구조를 만들 수 있습니다.

### 에이전트를 도구로 변환하기

에이전트를 도구로 변환하려면 `AIAgentService`와 `createAgentTool()` 확장 함수를 사용합니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.agent.AIAgentService
    import ai.koog.agents.core.agent.createAgentTool
    import ai.koog.agents.core.tools.ToolParameterDescriptor
    import ai.koog.agents.core.tools.ToolParameterType
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.serialization.typeToken
    const val apiKey = ""
    val analysisToolRegistry = ToolRegistry {}
    -->
    ```kotlin
    // 금융 분석 에이전트 생성을 담당하는 전문 에이전트 서비스 생성
    val analysisAgentService = AIAgentService(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a financial analysis specialist.",
        toolRegistry = analysisToolRegistry
    )
    
    // 호출 시 금융 분석 에이전트를 실행하는 도구 생성
    val analysisAgentTool = analysisAgentService.createAgentTool(
        agentName = "analyzeTransactions",
        agentDescription = "Performs financial transaction analysis",
        inputDescription = "Transaction analysis request",
        inputType = typeToken<String>(),
    )
    ```
    <!--- KNIT example-tools-overview-05.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-tools-overview-java-05.java -->

### 다른 에이전트에서 에이전트 도구 사용하기

도구로 변환된 후에는 해당 에이전트 도구를 다른 에이전트의 도구 레지스트리에 추가할 수 있습니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.example.exampleToolsOverview05.analysisAgentTool
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    const val apiKey = ""
    -->
    ```kotlin
    // 전문화된 에이전트를 도구로 사용할 수 있는 코디네이터 에이전트 생성
    val coordinatorAgent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You coordinate different specialized services.",
        toolRegistry = ToolRegistry {
            tool(analysisAgentTool)
            // 필요에 따라 다른 도구 추가
        }
    )
    ```
    <!--- KNIT example-tools-overview-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-tools-overview-java-06.java -->

### 에이전트 도구 실행

에이전트 도구가 호출되면:

1. 인자가 입력 디스크립터(input descriptor)에 따라 역직렬화(deserialized)됩니다.
2. 래핑된 에이전트가 역직렬화된 입력을 사용하여 실행됩니다.
3. 에이전트의 출력이 직렬화(serialized)되어 도구 결과로 반환됩니다.

### 에이전트를 도구로 사용할 때의 이점

- **모듈성**: 복잡한 워크플로를 전문화된 에이전트로 분할합니다.
- **재사용성**: 동일한 전문 에이전트를 여러 코디네이터 에이전트에서 사용합니다.
- **관심사 분리**: 각 에이전트는 특정 도메인에 집중할 수 있습니다.