# 간단한 진공 청소기 에이전트 구축하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button }

이 노트북에서는 새로운 Kotlin 에이전트 프레임워크를 사용하여 기본적인 반응형 에이전트를 구현하는 방법을 살펴봅니다.
예제는 고전적인 "진공 청소기 세계" 문제 —
깨끗하거나 더러울 수 있는 두 개의 구역이 있는 간단한 환경과 이를 청소해야 하는 에이전트입니다.

먼저 환경 모델을 이해해 봅시다.

```kotlin
import kotlin.random.Random

/**
 * Represents a simple vacuum world with two locations (A and B).
 *
 * The environment tracks:
 * - The current location of the vacuum agent ('A' or 'B')
 * - The cleanliness status of each location (true = dirty, false = clean)
 */
class VacuumEnv {
    var location: Char = 'A'
        private set

    private val status = mutableMapOf(
        'A' to Random.nextBoolean(),
        'B' to Random.nextBoolean()
    )

    fun percept(): Pair<Char, Boolean> = location to status.getValue(location)

    fun clean(): String {
        status[location] = false
        return "cleaned"
    }

    fun moveLeft(): String {
        location = 'A'
        return "move to A"
    }

    fun moveRight(): String {
        location = 'B'
        return "move to B"
    }

    fun isClean(): Boolean = status.values.all { it }

    fun worldLayout(): String = "${status.keys}"

    override fun toString(): String = "location=$location, dirtyA=${status['A']}, dirtyB=${status['B']}"
}
```

`VacuumEnv` 클래스는 우리의 간단한 세계를 모델링합니다:
- 두 구역은 'A'와 'B' 문자로 표현됩니다.
- 각 구역은 깨끗하거나 더러울 수 있습니다 (무작위로 초기화됨).
- 에이전트는 언제든지 두 구역 중 한 곳에 있을 수 있습니다.
- 에이전트는 현재 위치와 더러운지 여부를 지각할 수 있습니다.
- 에이전트는 특정 구역으로 이동하거나 현재 구역을 청소하는 등의 행동을 취할 수 있습니다.

## 진공 청소기 에이전트용 도구 생성
이제 AI 에이전트가 환경과 상호작용하는 데 사용할 도구를 정의해 봅시다.

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

/**
 * Provides tools for the LLM agent to control the vacuum robot.
 * All methods either mutate or read from the VacuumEnv passed to the constructor.
 */
@LLMDescription("Tools for controlling a two-cell vacuum world")
class VacuumTools(private val env: VacuumEnv) : ToolSet {

    @Tool
    @LLMDescription("Returns current location and whether it is dirty")
    fun sense(): String {
        val (loc, dirty) = env.percept()
        return "location=$loc, dirty=$dirty, locations=${env.worldLayout()}"
    }

    @Tool
    @LLMDescription("Cleans the current cell")
    fun clean(): String = env.clean()

    @Tool
    @LLMDescription("Moves the agent to cell A")
    fun moveLeft(): String = env.moveLeft()

    @Tool
    @LLMDescription("Moves the agent to cell B")
    fun moveRight(): String = env.moveRight()
}
```

`VacuumTools` 클래스는 LLM 에이전트와 환경 사이에 인터페이스를 생성합니다:

- Kotlin AI 에이전트 프레임워크의 `ToolSet`을 구현합니다.
- 각 도구는 `@Tool`로 어노테이트되어 있으며 LLM을 위한 설명이 있습니다.
- 이 도구들은 에이전트가 환경을 감지하고 행동을 취할 수 있게 합니다.
- 각 메서드는 행동의 결과를 설명하는 문자열을 반환합니다.

## 에이전트 설정하기
다음으로 AI 에이전트를 구성하고 생성합니다.

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools
import ai.koog.agents.ext.agent.chatAgentStrategy
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.params.LLMParams

val env = VacuumEnv()
val apiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")
val executor = simpleOpenAIExecutor(apiToken = apiToken)

val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tools(VacuumTools(env).asTools())
}

val systemVacuumPrompt = """
    You are a reflex vacuum-cleaner agent living in a two-cell world labelled A and B.
    Your goal: make both cells clean, using the provided tools.
    First, call sense() to inspect where you are. Then decide: if dirty → clean(); else moveLeft()/moveRight().
    Continue until both cells are clean, then tell the user "done".
    Use sayToUser to inform the user about each step.
""".trimIndent()

val agentConfig = AIAgentConfig(
    prompt = prompt("chat", params = LLMParams(temperature = 1.0)) {
        system(systemVacuumPrompt)
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50,
)

val agent = AIAgent(
    promptExecutor = executor,
    strategy = chatAgentStrategy(),
    agentConfig = agentConfig,
    toolRegistry = toolRegistry
)
```

이 설정에서는:

1. 환경의 인스턴스를 생성합니다.
2. OpenAI의 GPT-4o 모델에 대한 연결을 설정합니다.
3. 에이전트가 사용할 수 있는 도구를 등록합니다.
4. 에이전트에게 목표와 행동 규칙을 제공하는 시스템 프롬프트를 정의합니다.
5. 채팅 전략을 사용하여 `AIAgent` 생성자로 에이전트를 생성합니다.

## 에이전트 실행하기

마지막으로 에이전트를 실행해 봅시다.

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("Start cleaning, please")
}
```

    에이전트 말: 현재 구역 A에 있습니다. 이미 깨끗합니다.
    에이전트 말: 구역 B로 이동했습니다. 이미 깨끗합니다.

이 코드를 실행하면:

1. 에이전트가 청소를 시작하라는 초기 프롬프트를 받습니다.
2. 도구를 사용하여 환경을 감지하고 결정을 내립니다.
3. 두 구역이 모두 깨끗해질 때까지 청소를 계속합니다.
4. 이 과정 내내 사용자에게 진행 상황을 알립니다.

```kotlin
// 마지막으로 env 상태를 출력하여 작업이 완료되었는지 확인할 수 있습니다.

env
```

    location=B, dirtyA=false, dirtyB=false