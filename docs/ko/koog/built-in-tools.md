# 내장 도구

Koog 프레임워크는 에이전트와 사용자 간의 일반적인 상호작용 시나리오를 처리하는 내장 도구를 제공합니다.

다음 내장 도구들을 사용할 수 있습니다:

| 도구      | <div style="width:115px">이름</div> | 설명                                                                                                           |
|-----------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| SayToUser | `__say_to_user__`                   | 에이전트가 사용자에게 메시지를 보낼 수 있도록 합니다. 에이전트 메시지를 `Agent says: ` 접두사와 함께 콘솔에 출력합니다. |
| AskUser   | `__ask_user__`                      | 에이전트가 사용자에게 입력을 요청할 수 있도록 합니다. 에이전트 메시지를 콘솔에 출력하고 사용자 응답을 기다립니다.        |
| ExitTool  | `__exit__`                          | 에이전트가 대화를 종료하고 세션을 마칠 수 있도록 합니다.                                                     |

## 내장 도구 등록하기

다른 모든 도구와 마찬가지로, 내장 도구는 에이전트가 사용할 수 있도록 도구 레지스트리에 추가되어야 합니다. 다음은 예시입니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.ExitTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiToken = ""

-->
```kotlin
// 모든 내장 도구를 포함하는 도구 레지스트리 생성
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
}

// 에이전트 생성 시 레지스트리 전달
val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

내장 도구와 커스텀 도구를 동일한 레지스트리에서 결합하여 에이전트의 포괄적인 기능 세트를 만들 수 있습니다.
커스텀 도구에 대해 더 자세히 알아보려면 [어노테이션 기반 도구](annotation-based-tools.md) 및 [클래스 기반 도구](class-based-tools.md)를 참조하세요.