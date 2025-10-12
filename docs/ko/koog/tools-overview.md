# 개요

 에이전트는 특정 작업을 수행하거나 외부 시스템에 접근하기 위해 도구를 사용합니다.

## 도구 워크플로

Koog 프레임워크는 도구 작업을 위한 다음 워크플로를 제공합니다:

1.  커스텀 도구를 생성하거나 내장 도구 중 하나를 사용합니다.
2.  도구를 도구 레지스트리에 추가합니다.
3.  도구 레지스트리를 에이전트에 전달합니다.
4.  에이전트와 함께 도구를 사용합니다.

### 사용 가능한 도구 유형

Koog 프레임워크에는 세 가지 유형의 도구가 있습니다:

-   에이전트-사용자 상호 작용 및 대화 관리를 위한 기능을 제공하는 내장 도구입니다. 자세한 내용은 [내장 도구](built-in-tools.md)를 참조하세요.
-   함수를 LLM에 도구로 노출할 수 있는 어노테이션 기반 커스텀 도구입니다. 자세한 내용은 [어노테이션 기반 도구](annotation-based-tools.md)를 참조하세요.
-   도구 매개변수, 메타데이터, 실행 로직, 그리고 등록되고 호출되는 방식을 제어할 수 있는 커스텀 도구입니다. 자세한 내용은 [클래스 기반 도구](class-based-tools.md)를 참조하세요.

### 도구 레지스트리

에이전트에서 도구를 사용하려면 먼저 도구 레지스트리에 추가해야 합니다.
도구 레지스트리는 에이전트가 사용할 수 있는 모든 도구를 관리합니다.

도구 레지스트리의 주요 기능:

-   도구를 구성합니다.
-   여러 도구 레지스트리 병합을 지원합니다.
-   이름 또는 유형으로 도구를 검색하는 메서드를 제공합니다.

더 자세한 내용은 [ToolRegistry](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html)를 참조하세요.

다음은 도구 레지스트리를 만들고 도구를 추가하는 방법의 예시입니다:

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
-->
```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
}
```
<!--- KNIT example-tools-overview-01.kt -->

여러 도구 레지스트리를 병합하려면 다음과 같이 하세요:

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias FirstSampleTool = AskUser
typealias SecondSampleTool = SayToUser
-->
```kotlin
val firstToolRegistry = ToolRegistry {
    tool(FirstSampleTool)
}

val secondToolRegistry = ToolRegistry {
    tool(SecondSampleTool)
}

val newRegistry = firstToolRegistry + secondToolRegistry
```
<!--- KNIT example-tools-overview-02.kt -->

### 에이전트에 도구 전달하기

에이전트가 도구를 사용할 수 있도록 하려면 에이전트를 생성할 때 해당 도구가 포함된 도구 레지스트리를 인자로 제공해야 합니다:

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
    // 도구 레지스트리를 에이전트에 전달
    toolRegistry = toolRegistry
)
```
<!--- KNIT example-tools-overview-03.kt -->

### 도구 호출하기

에이전트 코드 내에서 도구를 호출하는 여러 가지 방법이 있습니다. 권장되는 접근 방식은 도구를 직접 호출하는 대신 에이전트 컨텍스트에서 제공되는 메서드를 사용하는 것입니다. 이는 에이전트 환경 내에서 도구 작업의 적절한 처리를 보장하기 때문입니다.

!!! tip
    에이전트 오류를 방지하려면 도구에 적절한 [오류 처리](agent-event-handlers.md)가 구현되었는지 확인하세요.

도구는 `AIAgentLLMWriteSession`으로 표현되는 특정 세션 컨텍스트 내에서 호출됩니다.
이는 도구 호출을 위한 여러 메서드를 제공하며, 따라서 다음을 수행할 수 있습니다:

-   주어진 인수로 도구를 호출합니다.
-   이름과 주어진 인수로 도구를 호출합니다.
-   제공된 도구 클래스와 인수로 도구를 호출합니다.
-   지정된 유형의 도구를 주어진 인수로 호출합니다.
-   원시 문자열 결과를 반환하는 도구를 호출합니다.

더 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html)를 참조하세요.

#### 병렬 도구 호출

또한 `toParallelToolCallsRaw` 확장 기능을 사용하여 도구를 병렬로 호출할 수 있습니다. 예를 들어:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.SimpleTool
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
data class Book(
    val title: String,
    val author: String,
    val description: String
)

class BookTool() : SimpleTool<Book>() {
    companion object {
        const val NAME = "book"
    }

    override suspend fun doExecute(args: Book): String {
        println("${args.title} by ${args.author}:
 ${args.description}")
        return "Done"
    }

    override val argsSerializer: KSerializer<Book>
        get() = Book.serializer()

    override val name = NAME
    override val description = "A tool to parse book information from Markdown"
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

#### 노드에서 도구 호출하기

노드를 사용하여 에이전트 워크플로를 구축할 때, 도구를 호출하기 위해 특별한 노드를 사용할 수 있습니다:

*   **nodeExecuteTool**: 단일 도구 호출을 수행하고 그 결과를 반환합니다. 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)를 참조하세요.

*   **nodeExecuteSingleTool**: 제공된 인수로 특정 도구를 호출합니다. 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-single-tool.html)를 참조하세요.

*   **nodeExecuteMultipleTools**: 여러 도구 호출을 수행하고 그 결과를 반환합니다. 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)를 참조하세요.

*   **nodeLLMSendToolResult**: 도구 결과를 LLM에 보내고 응답을 받습니다. 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)를 참조하세요.

*   **nodeLLMSendMultipleToolResults**: 여러 도구 결과를 LLM에 보냅니다. 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)를 참조하세요.

## 에이전트를 도구로 사용하기

이 프레임워크는 모든 AI 에이전트를 다른 에이전트가 사용할 수 있는 도구로 변환하는 기능을 제공합니다. 이 강력한 기능을 통해 전문 에이전트가 상위 수준의 오케스트레이션 에이전트에 의해 도구로 호출될 수 있는 계층적 에이전트 아키텍처를 생성할 수 있습니다.

### 에이전트를 도구로 변환하기

에이전트를 도구로 변환하려면 `AIAgentService`의 `createAgentTool()` 함수를 사용하세요:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.AIAgentService
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
val analysisToolRegistry = ToolRegistry {}

-->
```kotlin
// 재무 분석 에이전트 생성을 담당하는 전문 에이전트 서비스를 생성합니다.
val analysisAgentService = AIAgentService(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a financial analysis specialist.",
    toolRegistry = analysisToolRegistry
)

// 호출 시 재무 분석 에이전트를 실행하는 도구를 생성합니다.
val analysisAgentTool = analysisAgentService.createAgentTool(
    agentName = "analyzeTransactions",
    agentDescription = "금융 거래 분석을 수행합니다",
    inputDescription = "거래 분석 요청",
)
```
<!--- KNIT example-tools-overview-05.kt -->

### 다른 에이전트에서 에이전트 도구 사용하기

도구로 변환되면, 에이전트 도구를 다른 에이전트의 도구 레지스트리에 추가할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.example.exampleToolsOverview05.analysisAgentTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

-->
```kotlin
// 전문 에이전트를 도구로 사용할 수 있는 코디네이터 에이전트를 생성합니다.
val coordinatorAgent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You coordinate different specialized services.",
    toolRegistry = ToolRegistry {
        tool(analysisAgentTool)
        // 필요에 따라 다른 도구를 추가
    }
)
```
<!--- KNIT example-tools-overview-06.kt -->

### 에이전트 도구 실행

에이전트 도구가 호출될 때:

1.  입력 디스크립터에 따라 인자가 역직렬화됩니다.
2.  역직렬화된 입력으로 래핑된 에이전트가 실행됩니다.
3.  에이전트의 출력이 직렬화되어 도구 결과로 반환됩니다.

### 에이전트를 도구로 사용하는 이점

-   **모듈성**: 복잡한 워크플로를 전문 에이전트로 분할합니다.
-   **재사용성**: 여러 코디네이터 에이전트에서 동일한 전문 에이전트를 재사용할 수 있습니다.
-   **관심사 분리**: 각 에이전트는 특정 도메인에 집중할 수 있습니다.