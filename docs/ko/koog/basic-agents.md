# 기본 에이전트

`AIAgent` 클래스는 Kotlin 애플리케이션에서 AI 에이전트를 생성할 수 있게 해주는 핵심 컴포넌트입니다.

최소한의 구성으로 간단한 에이전트를 빌드하거나, 커스텀 전략, 도구, 구성 및 커스텀 입력/출력 타입을 정의하여 고급 기능을 갖춘 정교한 에이전트를 만들 수 있습니다.

이 페이지에서는 도구와 구성을 맞춤 설정할 수 있는 기본 에이전트를 생성하는 데 필요한 단계를 안내합니다.

기본 에이전트는 단일 입력을 처리하고 응답을 제공합니다. 이 에이전트는 작업을 완료하고 응답을 제공하기 위해 도구 호출(tool-calling)의 단일 사이클 내에서 작동합니다. 에이전트는 메시지 또는 도구 결과(tool result)를 반환할 수 있습니다. 도구 결과는 도구 레지스트리(tool registry)가 에이전트에 제공된 경우에 반환됩니다.

실험을 위한 간단한 에이전트를 빌드하는 것이 목표라면, 에이전트 생성 시 프롬프트 실행기(prompt executor)와 LLM만 제공하면 됩니다. 하지만 더 많은 유연성과 커스터마이징을 원한다면 선택적 파라미터를 전달하여 에이전트를 구성할 수 있습니다. 구성 옵션에 대해 자세히 알아보려면 [API 레퍼런스](api:agents-core::ai.koog.agents.core.agent.AIAgent)를 참조하세요.

## 사전 요구 사항

- AI 에이전트를 구현하는 데 사용되는 LLM 공급자의 유효한 API 키가 있어야 합니다. 사용 가능한 모든 공급자 목록은 [LLM 공급자](llm-providers.md)를 참조하세요.

!!! tip
    API 키를 저장하려면 환경 변수나 보안 구성 관리 시스템을 사용하세요. 소스 코드에 API 키를 직접 하드코딩하지 마십시오.

## 기본 에이전트 생성하기

### 1. 종속성 추가

`AIAgent` 기능을 사용하려면 빌드 구성에 필요한 모든 종속성을 포함하세요.

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

사용 가능한 모든 설치 방법은 [Koog 설치하기](getting-started.md#install-koog)를 참조하세요.

### 2. 에이전트 생성

에이전트를 생성하려면 `AIAgent` 클래스의 인스턴스를 생성하고 `promptExecutor` 및 `llmModel` 파라미터를 제공합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-basic-01.kt -->

### 3. 시스템 프롬프트 추가

시스템 프롬프트(system prompt)는 에이전트의 동작을 정의하는 데 사용됩니다. 프롬프트를 제공하려면 `systemPrompt` 파라미터를 사용하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-basic-02.kt -->

### 4. LLM 출력 구성

`temperature` 파라미터를 사용하여 LLM 출력 생성의 온도(temperature)를 설정합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7
)
```
<!--- KNIT example-basic-03.kt -->

### 5. 도구 추가

에이전트는 특정 작업을 완료하기 위해 도구(tool)를 사용합니다. 내장 도구를 사용하거나 필요한 경우 커스텀 도구를 직접 구현할 수 있습니다.

도구를 구성하려면 에이전트가 사용할 수 있는 도구를 정의하는 `toolRegistry` 파라미터를 사용하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    }
)
```
<!--- KNIT example-basic-04.kt -->
이 예제에서 `SayToUser`는 내장 도구입니다. 커스텀 도구를 만드는 방법을 알아보려면 [도구(Tools)](tools-overview.md)를 참조하세요.

### 6. 에이전트 반복 횟수 조정

`maxIterations` 파라미터를 사용하여 에이전트가 강제로 중단되기 전까지 수행할 수 있는 최대 단계(step) 수를 제공합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    },
    maxIterations = 30
)
```
<!--- KNIT example-basic-05.kt -->

### 7. 에이전트 런타임 중 이벤트 처리

기본 에이전트는 커스텀 이벤트 핸들러(event handler)를 지원합니다. 에이전트 생성 시 이벤트 핸들러가 필수 사항은 아니지만, 테스트, 디버깅 또는 체인형 에이전트 상호작용을 위한 훅(hook)을 만드는 데 유용할 수 있습니다.

에이전트 상호작용 모니터링을 위해 `EventHandler` 기능을 사용하는 방법에 대한 자세한 내용은 [이벤트 핸들러(Event Handlers)](agent-event-handlers.md)를 참조하세요.

### 8. 에이전트 실행

에이전트를 실행하려면 `run()` 함수를 사용하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    },
    maxIterations = 100
)

fun main() = runBlocking {
    val result = agent.run("Hello! How can you help me?")
}
```
<!--- KNIT example-basic-06.kt -->

에이전트는 다음과 같은 출력을 생성합니다.

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?