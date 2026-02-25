# 간단한 진공청소기 에이전트 만들기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button }

이 노트북에서는 새로운 Kotlin 에이전트 프레임워크를 사용하여 기본적인 반응형 에이전트(reflex agent)를 구현하는 방법을 살펴봅니다.
예제로는 클래식한 "진공청소기 세계(vacuum world)" 문제를 사용합니다.
이는 두 개의 위치가 깨끗하거나 더러울 수 있는 단순한 환경과, 이를 청소해야 하는 에이전트로 구성됩니다.

먼저, 환경 모델을 이해해 봅시다:

```kotlin
import kotlin.random.Random

/**
 * 두 개의 위치(A와 B)가 있는 간단한 진공청소기 세계를 나타냅니다.
 *
 * 환경은 다음을 추적합니다:
 * - 진공청소기 에이전트의 현재 위치 ('A' 또는 'B')
 * - 각 위치의 청결 상태 (true = 더러움, false = 깨끗함)
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

`VacuumEnv` 클래스는 다음과 같이 단순한 세계를 모델링합니다:
- 두 위치는 문자 'A'와 'B'로 표현됩니다.
- 각 위치는 깨끗하거나 더러울 수 있습니다 (무작위로 초기화됨).
- 에이전트는 주어진 시간에 어느 한 위치에 있을 수 있습니다.
- 에이전트는 현재 위치와 그곳이 더러운지 여부를 인지(perceive)할 수 있습니다.
- 에이전트는 특정 위치로 이동하거나 현재 위치를 청소하는 액션을 취할 수 있습니다.

## 진공청소기 에이전트를 위한 도구 만들기
이제 AI 에이전트가 환경과 상호작용하기 위해 사용할 도구(tools)를 정의해 보겠습니다:

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

/**
 * LLM 에이전트가 진공청소기 로봇을 제어할 수 있는 도구를 제공합니다.
 * 모든 메서드는 생성자에 전달된 VacuumEnv를 수정하거나 읽습니다.
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

`VacuumTools` 클래스는 LLM 에이전트와 환경 사이의 인터페이스를 생성합니다:

- Kotlin AI 에이전트 프레임워크의 `ToolSet`을 구현합니다.
- 각 도구(tool)는 `@Tool` 어노테이션이 붙어 있으며 LLM을 위한 설명을 포함하고 있습니다.
- 이러한 도구들을 통해 에이전트는 환경을 감지하고 액션을 취할 수 있습니다.
- 각 메서드는 액션의 결과를 설명하는 문자열을 반환합니다.

## 에이전트 설정하기
다음으로, AI 에이전트를 구성하고 생성해 보겠습니다:

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

이 설정에서:

1. 환경의 인스턴스를 생성합니다.
2. OpenAI의 GPT-4o 모델과의 연결을 설정합니다.
3. 에이전트가 사용할 수 있는 도구들을 등록합니다.
4. 에이전트의 목표와 행동 규칙을 부여하는 시스템 프롬프트를 정의합니다.
5. 채팅 전략(chat strategy)과 함께 `AIAgent` 생성자를 사용하여 에이전트를 생성합니다.

## 에이전트 실행하기

마지막으로, 에이전트를 실행해 봅시다:

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("Start cleaning, please")
}
```

    에이전트: 현재 A 칸에 있습니다. 이미 깨끗합니다.
    에이전트: B 칸으로 이동했습니다. 이미 깨끗합니다.

이 코드를 실행하면:

1. 에이전트는 청소를 시작하라는 초기 프롬프트를 받습니다.
2. 도구를 사용하여 환경을 감지하고 결정을 내립니다.
3. 두 칸이 모두 깨끗해질 때까지 청소를 계속합니다.
4. 과정 전반에 걸쳐 사용자에게 자신이 무엇을 하고 있는지 계속 알립니다.

```kotlin
// 마지막으로 환경 상태를 출력하여 작업이 완료되었는지 확인할 수 있습니다.

env
```

    location=B, dirtyA=false, dirtyB=false