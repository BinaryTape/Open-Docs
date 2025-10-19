# 단일 실행 에이전트

`AIAgent` 클래스는 Kotlin 애플리케이션에서 AI 에이전트를 생성할 수 있도록 해주는 핵심 구성 요소입니다.

최소한의 설정으로 간단한 에이전트를 구축하거나, 사용자 지정 전략, 도구, 구성, 그리고 사용자 지정 입/출력 유형을 정의하여 고급 기능을 갖춘 정교한 에이전트를 만들 수 있습니다.

이 페이지에서는 사용자 지정 도구 및 구성으로 단일 실행 에이전트를 생성하는 데 필요한 단계를 안내합니다.

단일 실행 에이전트는 단일 입력을 처리하고 응답을 제공합니다.
작업을 완료하고 응답을 제공하기 위해 단일 도구 호출 주기 내에서 작동합니다.
이 에이전트는 메시지 또는 도구 결과 중 하나를 반환할 수 있습니다.
도구 레지스트리가 에이전트에 제공되면 도구 결과가 반환됩니다.

간단한 에이전트를 구축하여 실험하는 것이 목표라면, 에이전트 생성 시 프롬프트 실행기(prompt executor)와 LLM만 제공해도 됩니다.
하지만 더 많은 유연성과 사용자 지정을 원한다면, 선택적 매개변수를 전달하여 에이전트를 구성할 수 있습니다.
구성 옵션에 대한 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/-a-i-agent.html)를 참조하세요.

## 전제 조건

- AI 에이전트 구현에 사용될 LLM 공급자로부터 유효한 API 키를 가지고 있어야 합니다. 사용 가능한 모든 공급자 목록은 [개요](index.md)를 참조하세요.

!!! tip
    API 키는 환경 변수 또는 보안 구성 관리 시스템을 사용하여 저장하세요.
    소스 코드에 API 키를 직접 하드코딩하는 것을 피하세요.

## 단일 실행 에이전트 생성

### 1. 의존성 추가

`AIAgent` 기능을 사용하려면 빌드 구성에 필요한 모든 의존성을 포함하세요.

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
    // include Ktor client dependency explicitly
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

사용 가능한 모든 설치 방법은 [설치](index.md#installation)를 참조하세요.

### 2. 에이전트 생성

에이전트를 생성하려면 `AIAgent` 클래스의 인스턴스를 생성하고 `promptExecutor` 및 `llmModel` 매개변수를 제공하세요.

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
<!--- KNIT example-single-run-01.kt -->

### 3. 시스템 프롬프트 추가

시스템 프롬프트는 에이전트 동작을 정의하는 데 사용됩니다. 프롬프트를 제공하려면 `systemPrompt` 매개변수를 사용하세요.

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
<!--- KNIT example-single-run-02.kt -->

### 4. LLM 출력 구성

`temperature` 매개변수를 사용하여 LLM 출력 생성의 온도를 제공하세요.

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
<!--- KNIT example-single-run-03.kt -->

### 5. 도구 추가

에이전트는 특정 작업을 완료하기 위해 도구를 사용합니다.
내장 도구를 사용하거나 필요한 경우 자신만의 사용자 지정 도구를 구현할 수 있습니다.

도구를 구성하려면 에이전트가 사용할 수 있는 도구를 정의하는 `toolRegistry` 매개변수를 사용하세요.

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
<!--- KNIT example-single-run-04.kt -->
예시에서 `SayToUser`는 내장 도구입니다. 사용자 지정 도구를 생성하는 방법을 알아보려면 [도구](tools-overview.md)를 참조하세요.

### 6. 에이전트 반복 횟수 조정

`maxIterations` 매개변수를 사용하여 에이전트가 강제로 중지되기 전에 수행할 수 있는 최대 단계 수를 제공하세요.

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
<!--- KNIT example-single-run-05.kt -->

### 7. 에이전트 런타임 중 이벤트 처리

단일 실행 에이전트는 사용자 지정 이벤트 핸들러를 지원합니다.
에이전트를 생성하는 데 이벤트 핸들러가 필수는 아니지만, 테스트, 디버깅 또는 연쇄 에이전트 상호작용을 위한 훅(hook)을 만드는 데 유용할 수 있습니다.

에이전트 상호작용을 모니터링하기 위해 `EventHandler` 기능을 사용하는 방법에 대한 자세한 내용은 [이벤트 핸들러](agent-event-handlers.md)를 참조하세요.

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
<!--- KNIT example-single-run-06.kt -->

에이전트는 다음 출력을 생성합니다:

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?