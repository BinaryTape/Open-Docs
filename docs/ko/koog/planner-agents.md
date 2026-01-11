# 플래너 에이전트

플래너 에이전트는 반복적인 계획 주기를 통해 다단계 작업을 계획하고 실행할 수 있는 AI 에이전트입니다. 이들은 지속적으로 계획을 수립하거나 업데이트하고, 단계를 실행하며, 목표가 달성되었는지 확인합니다.

플래너 에이전트는 상위 수준 목표를 더 작고 실행 가능한 단계로 분해하고, 각 단계의 결과에 따라 계획을 조정해야 하는 복잡한 작업에 적합합니다.

## 사전 준비 사항

시작하기 전에 다음 사항이 준비되었는지 확인하세요.

-   작동하는 Kotlin/JVM 프로젝트.
-   Java 17+ 설치.
-   AI 에이전트 구현에 사용될 LLM 공급자의 유효한 API 키. 사용 가능한 모든 공급자 목록은 [LLM 공급자](llm-providers.md)를 참조하세요.

!!! tip
    API 키는 환경 변수 또는 보안 구성 관리 시스템을 사용하여 저장하세요.
    소스 코드에 API 키를 직접 하드코딩하는 것을 피하세요.

## 종속성 추가

플래너 에이전트를 사용하려면 빌드 구성에 다음 종속성을 포함하세요.

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
    implementation("ai.koog.agents:agents-planner:$koog_version")
    // Include Ktor client dependency explicitly
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

사용 가능한 모든 설치 방법은 [Koog 설치](getting-started.md#install-koog)를 참조하세요.

## 플래너 에이전트 작동 방식

플래너 에이전트는 반복적인 계획 주기를 통해 작동합니다.

1.  **계획 수립**: 플래너는 현재 상태를 기반으로 계획을 생성하거나 업데이트합니다.
2.  **단계 실행**: 플래너는 계획의 단일 단계를 실행하여 상태를 업데이트합니다.
3.  **완료 확인**: 플래너는 목표 조건에 대해 상태를 확인하여 목표가 달성되었는지 판단합니다.
4.  **반복**: 목표가 달성되지 않으면 1단계부터 주기가 반복됩니다.

## 단순 LLM 기반 플래너

단순 LLM 기반 플래너는 LLM을 사용하여 계획을 생성하고 평가합니다. 이들은 문자열 상태(string state), 즉 단일 `String`에서 작동하며 LLM 요청을 통해 단계를 실행합니다.
기본적으로 Koog는 `SimpleLLMPlanner`와 `SimpleLLMWithCriticPlanner`의 두 가지 단순 플래너를 제공합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.planner.AIAgentPlannerStrategy
import ai.koog.agents.planner.PlannerAIAgent
import ai.koog.agents.planner.llm.SimpleLLMPlanner
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

suspend fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
// 플래너 생성
val planner = SimpleLLMPlanner()

// 플래너 전략으로 래핑
val strategy = AIAgentPlannerStrategy(
    name = "simple-planner",
    planner = planner
)

// 에이전트 구성
val agentConfig = AIAgentConfig(
    prompt = prompt("planner") {
        system("You are a helpful planning assistant.")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50
)

// 플래너 에이전트 생성
val agent = PlannerAIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    strategy = strategy,
    agentConfig = agentConfig
)

// 작업으로 에이전트 실행
val result = agent.run("Create a plan to organize a team meeting")
println(result)
```
<!--- KNIT example-planner-01.kt -->

## GOAP (목표 지향 행동 계획)

GOAP는 A* 탐색을 사용하여 최적의 행동 시퀀스를 찾는 알고리즘적 계획 접근 방식입니다. LLM을 사용하여 계획을 생성하는 대신, GOAP는 사전 정의된 목표와 행동을 기반으로 행동 시퀀스를 자동으로 발견합니다.

### 핵심 개념

GOAP 플래너는 세 가지 주요 개념을 사용합니다.

-   **상태 (State)**: 세상의 현재 상태를 나타냅니다.
-   **행동 (Actions)**: 전제 조건, 효과(믿음), 비용, 실행 로직을 포함하여 무엇을 할 수 있는지를 정의합니다.
-   **목표 (Goals)**: 목표 조건, 휴리스틱 비용, 가치 함수를 정의합니다.

플래너는 A* 탐색을 사용하여 총 비용을 최소화하면서 목표 조건을 만족시키는 행동 시퀀스를 찾습니다.

### GOAP 에이전트 생성하기

GOAP 에이전트를 생성하려면 다음을 수행해야 합니다.

1.  상태 유형을 정의합니다.
2.  전제 조건과 효과를 포함하는 행동을 정의합니다.
3.  완료 조건을 포함하는 목표를 정의합니다.
4.  DSL을 사용하여 GOAP 플래너를 생성합니다.
5.  이를 플래너 전략과 에이전트로 래핑합니다.

다음 예시에서 GOAP는 상위 수준 계획 (개요 → 초안 → 검토 → 게시)을 처리하고, LLM은 각 행동 내에서 실제 콘텐츠 생성을 수행합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.agent.context.AIAgentFunctionalContext
import ai.koog.agents.planner.AIAgentPlannerStrategy
import ai.koog.agents.planner.PlannerAIAgent
import ai.koog.agents.planner.goap.goap
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
import kotlin.reflect.typeOf

suspend fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
// 콘텐츠 생성을 위한 상태 정의
data class ContentState(
    val topic: String,
    val hasOutline: Boolean = false,
    val outline: String = "",
    val hasDraft: Boolean = false,
    val draft: String = "",
    val hasReview: Boolean = false,
    val isPublished: Boolean = false
)

// LLM 기반 행동으로 GOAP 플래너 생성
val planner = goap<ContentState>(typeOf<ContentState>()) {
    action(
        name = "Create outline",
        precondition = { state -> !state.hasOutline },
        belief = { state -> state.copy(hasOutline = true, outline = "Outline") },
        cost = { 1.0 }
    ) { ctx, state ->
        // LLM을 사용하여 개요 생성
        val response = ctx.llm.writeSession {
            appendPrompt {
                user("Create a detailed outline for an article about: ${state.topic}")
            }
            requestLLM()
        }
        state.copy(hasOutline = true, outline = response.content)
    }

    action(
        name = "Write draft",
        precondition = { state -> state.hasOutline && !state.hasDraft },
        belief = { state -> state.copy(hasDraft = true, draft = "Draft") },
        cost = { 2.0 }
    ) { ctx, state ->
        // LLM을 사용하여 초안 작성
        val response = ctx.llm.writeSession {
            appendPrompt {
                user("Write an article based on this outline:
${state.outline}")
            }
            requestLLM()
        }
        state.copy(hasDraft = true, draft = response.content)
    }

    action(
        name = "Review content",
        precondition = { state -> state.hasDraft && !state.hasReview },
        belief = { state -> state.copy(hasReview = true) },
        cost = { 1.0 }
    ) { ctx, state ->
        // LLM을 사용하여 초안 검토
        val response = ctx.llm.writeSession {
            appendPrompt {
                user("Review this article and suggest improvements:
${state.draft}")
            }
            requestLLM()
        }
        println("Review feedback: ${response.content}")
        state.copy(hasReview = true)
    }

    action(
        name = "Publish",
        precondition = { state -> state.hasReview && !state.isPublished },
        belief = { state -> state.copy(isPublished = true) },
        cost = { 1.0 }
    ) { ctx, state ->
        println("Publishing article...")
        state.copy(isPublished = true)
    }

    goal(
        name = "Published article",
        description = "Complete and publish the article",
        condition = { state -> state.isPublished }
    )
}

// 에이전트 생성 및 실행
val strategy = AIAgentPlannerStrategy("content-planner", planner)
val agentConfig = AIAgentConfig(
    prompt = prompt("writer") {
        system("You are a professional content writer.")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 20
)

val agent = PlannerAIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    strategy = strategy,
    agentConfig = agentConfig
)

val result = agent.run(ContentState(topic = "The Future of AI in Software Development"))
println("Final state: $result")
```
<!--- KNIT example-planner-02.kt -->

## 고급 GOAP 기능

### 사용자 정의 비용 함수

플래너를 안내하기 위해 행동과 목표에 대한 사용자 정의 비용 함수를 정의할 수 있습니다.

```kotlin
action(
    name = "Expensive operation",
    precondition = { true },
    belief = { state -> state.copy(operationDone = true) },
    cost = { state ->
        // 상태에 기반한 동적 비용
        if (state.hasOptimization) 1.0 else 10.0
    }
) { ctx, state ->
    // 행동 실행
    state.copy(operationDone = true)
}
```

### 상태 믿음 대 실제 실행

GOAP는 믿음 (낙관적인 예측)과 실제 실행을 구분합니다.

-   **믿음 (Belief)**: 플래너가 일어날 것이라고 생각하는 것 (계획 수립에 사용)
-   **실행 (Execution)**: 실제로 발생하는 것 (실제 상태 업데이트에 사용)

이를 통해 플래너는 예상 결과에 기반하여 계획을 세우면서 실제 결과를 적절하게 처리할 수 있습니다.

```kotlin
action(
    name = "Attempt complex task",
    precondition = { state -> !state.taskComplete },
    belief = { state ->
        // 낙관적인 믿음: 작업이 성공할 것임
        state.copy(taskComplete = true)
    },
    cost = { 5.0 }
) { ctx, state ->
    // 실제 실행은 실패하거나 다른 결과를 가질 수 있음
    val success = performComplexTask()
    state.copy(
        taskComplete = success,
        attempts = state.attempts + 1
    )
}