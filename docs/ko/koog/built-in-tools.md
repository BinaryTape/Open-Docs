# 내장 도구

Koog 프레임워크는 에이전트와 사용자 간의 상호작용에서 흔히 발생하는 시나리오를 처리하는 Kotlin 및 Java용 내장 도구(built-in tools)를 제공합니다.

사용 가능한 내장 도구는 다음과 같습니다:

| 도구              | <div style="width:115px">이름</div> | 설명                                                                                                              |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser         | `__say_to_user__`                   | 에이전트가 사용자에게 메시지를 보낼 수 있게 합니다. 에이전트 메시지를 콘솔에 `Agent says: ` 접두사와 함께 출력합니다.    |
| AskUser           | `__ask_user__`                      | 에이전트가 사용자에게 입력을 요청할 수 있게 합니다. 에이전트 메시지를 콘솔에 출력하고 사용자의 응답을 기다립니다.           |
| ExitTool          | `__exit__`                          | 에이전트가 대화를 종료하고 세션을 마칠 수 있게 합니다.                                                                    |
| ReadFileTool      | `__read_file__`                     | 선택적인 줄 범위 지정을 통해 텍스트 파일을 읽습니다. 0부터 시작하는 줄 인덱싱을 사용하여 메타데이터와 함께 형식화된 콘텐츠를 반환합니다. |
| EditFileTool      | `__edit_file__`                     | 파일 내에서 특정한 텍스트를 한 번 교체합니다. 새 파일을 생성하거나 전체 내용을 교체할 수도 있습니다.                |
| ListDirectoryTool | `__list_directory__`                | 디렉터리 내용을 계층적 트리 구조로 나열하며, 선택적으로 깊이 제어 및 glob 필터링을 지원합니다.                          |
| WriteFileTool     | `__write_file__`                    | 파일에 텍스트 콘텐츠를 씁니다(필요한 경우 상위 디렉터리를 생성합니다).                                                   |

## 내장 도구 등록하기

다른 도구와 마찬가지로, 에이전트가 내장 도구를 사용할 수 있게 하려면 도구 레지스트리에 추가해야 합니다. 예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.ExitTool
import ai.koog.agents.ext.tool.file.ListDirectoryTool
import ai.koog.agents.ext.tool.file.ReadFileTool
import ai.koog.agents.ext.tool.file.WriteFileTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.rag.base.files.JVMFileSystemProvider

const val apiToken = ""

-->
```kotlin
// 모든 내장 도구를 포함하는 도구 레지스트리 생성
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// 에이전트 생성 시 레지스트리 전달
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

동일한 레지스트리 내에서 내장 도구와 커스텀 도구를 결합하여 Kotlin 및 Java 모두에서 에이전트를 위한 포괄적인 기능 세트를 구성할 수 있습니다.
커스텀 도구에 대해 더 자세히 알아보려면 [어노테이션 기반 도구(Annotation-based tools)](annotation-based-tools.md) 및 [클래스 기반 도구(Class-based tools)](class-based-tools.md)를 참조하세요.