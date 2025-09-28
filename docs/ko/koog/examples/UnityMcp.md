# Unity + Koog: Kotlin 에이전트로 게임 구동

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/UnityMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/UnityMcp.ipynb
){ .md-button }

이 노트북은 Model Context Protocol (MCP)을 사용하여 Koog로 Unity에 능숙한 AI 에이전트를 구축하는 과정을 안내합니다. Unity MCP 서버에 연결하고, 도구를 탐색하며, LLM(거대 언어 모델)으로 계획을 세운 다음, 현재 열려 있는 씬에 대해 액션을 실행합니다.

> 사전 준비 사항
> - Unity-MCP 서버 플러그인이 설치된 Unity 프로젝트
> - JDK 17 이상
> - `OPENAI_API_KEY` 환경 변수에 OpenAI API 키가 설정되어 있어야 합니다.

```kotlin
%useLatestDescriptors
%use koog

```

```kotlin
lateinit var process: Process

```

## 1) OpenAI API 키 제공
노트북 외부에 시크릿을 보관할 수 있도록 `OPENAI_API_KEY` 환경 변수에서 API 키를 읽어옵니다.

```kotlin
val token = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")
val executor = simpleOpenAIExecutor(token)
```

## 2) Unity 에이전트 구성
Unity용 간결한 시스템 프롬프트와 에이전트 설정을 정의합니다.

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("cook_agent_system_prompt") {
        system {
            "You are a Unity assistant. You can execute different tasks by interacting with tools from the Unity engine."
        }
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 1000
)
```

```kotlin

```

## 3) Unity MCP 서버 시작
Unity 프로젝트 디렉터리에서 Unity MCP 서버를 시작하고 stdio를 통해 연결합니다.

```kotlin
// https://github.com/IvanMurzak/Unity-MCP
val pathToUnityProject = "path/to/unity/project"
val process = ProcessBuilder(
    "$pathToUnityProject/com.ivanmurzak.unity.mcp.server/bin~/Release/net9.0/com.IvanMurzak.Unity.MCP.Server",
    "60606"
).start()
```

## 4) Koog에서 연결하고 에이전트 실행
Unity MCP 서버에서 도구를 탐색하고, 간단한 '계획 우선' 전략을 구축하며, 열려 있는 씬을 수정하는 데 도구만 사용하는 에이전트를 실행합니다.

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    // MCP 서버의 도구로 ToolRegistry 생성
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultStdioTransport(process)
    )

    toolRegistry.tools.forEach {
        println(it.name)
        println(it.descriptor)
    }

    val strategy = strategy<String, String>("unity_interaction") {
        val nodePlanIngredients by nodeLLMRequest(allowToolCalls = false)
        val interactionWithUnity by subgraphWithTask<String, String>(
            // 계획에 따라 작업
            tools = toolRegistry.tools,
        ) { input ->
            "Start interacting with Unity according to the plan: $input"
        }

        edge(
            nodeStart forwardTo nodePlanIngredients transformed {
                "Create detailed plan for " + agentInput + "" +
                    "using the following tools: ${toolRegistry.tools.joinToString("
") {
                        it.name + "
description:" + it.descriptor
                    }}"
            }
        )
        edge(nodePlanIngredients forwardTo interactionWithUnity onAssistantMessage { true })
        edge(interactionWithUnity forwardTo nodeFinish)
    }

    val agent = AIAgent(
        promptExecutor = executor,
        strategy = strategy,
        agentConfig = agentConfig,
        toolRegistry = toolRegistry,
        installFeatures = {
            install(Tracing)

            install(EventHandler) {
                onBeforeAgentStarted { eventContext ->
                    println("OnBeforeAgentStarted first (strategy: ${strategy.name})")
                }

                onBeforeAgentStarted { eventContext ->
                    println("OnBeforeAgentStarted second (strategy: ${strategy.name})")
                }

                onAgentFinished { eventContext ->
                    println(
                        "OnAgentFinished (agent id: ${eventContext.agentId}, result: ${eventContext.result})"
                    )
                }
            }
        }
    )

    val result = agent.run(
        " extend current opened scene for the towerdefence game. " +
            "Add more placements for the towers, change the path for the enemies"
    )

    result
}
```

## 5) MCP 프로세스 종료
실행이 끝날 때 외부 Unity MCP 서버 프로세스를 항상 정리해야 합니다.

```kotlin
// Unity MCP 프로세스 종료
process.destroy()