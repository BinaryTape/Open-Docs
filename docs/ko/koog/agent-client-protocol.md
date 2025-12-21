# 에이전트 클라이언트 프로토콜

에이전트 클라이언트 프로토콜(ACP)은 클라이언트 애플리케이션이 일관된 양방향 인터페이스를 통해 AI 에이전트와 통신할 수 있도록 지원하는 표준화된 프로토콜입니다.

ACP는 에이전트가 클라이언트와 상호 작용하는 구조화된 방식을 제공하며, 실시간 이벤트 스트리밍, 도구 호출 알림 및 세션 수명 주기 관리를 지원합니다.

Koog 프레임워크는 ACP와의 통합을 제공하여, 표준화된 클라이언트 애플리케이션과 통신할 수 있는 ACP를 준수하는 에이전트를 구축할 수 있도록 지원합니다.

프로토콜에 대해 더 알아보려면 [Agent Client Protocol](https://agentclientprotocol.com) 문서를 참조하세요.

## Koog와 통합

Koog 프레임워크는 `agents-features-acp` 모듈에 있는 추가 API 확장을 통해 [ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk)를 사용하여 ACP와 통합됩니다.

이 통합을 통해 Koog 에이전트는 다음을 수행할 수 있습니다.

*   ACP를 준수하는 클라이언트 애플리케이션과 통신
*   에이전트 실행에 대한 실시간 업데이트 전송 (도구 호출, 생각, 완료)
*   표준 ACP 이벤트 및 알림 자동 처리
*   Koog 메시지 형식과 ACP 콘텐츠 블록 간 변환

### 주요 구성 요소

Koog의 ACP 통합에 대한 주요 구성 요소는 다음과 같습니다.

| 구성 요소                                                                                                                                         | 설명                                                                            |
|:--------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------|
| [`AcpAgent`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/index.html)                                   | Koog 에이전트와 ACP 클라이언트 간 통신을 가능하게 하는 주요 기능입니다.       |
| [`MessageConverters`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-message-converters/index.html)                 | Koog 및 ACP 형식 간 메시지 변환 유틸리티입니다.                        |
| [`AcpConfig`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/-acp-config/index.html)                      | `AcpAgent` 기능의 구성 클래스입니다.                                          |

## 시작하기

ACP 종속성은 `koog-agents` 메타 종속성에 기본적으로 포함되지 않습니다.
프로젝트에 ACP 모듈을 명시적으로 추가해야 합니다.

### 종속성

프로젝트에서 ACP를 사용하려면 다음 종속성을 추가하세요.

<!--- INCLUDE
/**
-->
<!--- SUFFIX
**/
-->
```kotlin
dependencies {
    implementation("ai.koog:agents-features-acp:$koogVersion")
}
```
<!--- KNIT example-agent-client-protocol-01.kt -->

### 1. ACP 에이전트 지원 구현

Koog ACP 통합은 [Kotlin ACP SDK](https://github.com/agentclientprotocol/kotlin-sdk)를 기반으로 합니다.
SDK는 에이전트를 ACP 클라이언트에 연결하기 위해 구현해야 하는 `AgentSupport` 및 `AgentSession` 인터페이스를 제공합니다.
`AgentSupport`는 에이전트 세션 생성 및 로딩을 관리합니다. 인터페이스 구현은 거의 모든 에이전트에 대해 동일하며, 아래에서 예시 구현을 제공하겠습니다.
`AgentSession`은 에이전트 인스턴스화, 호출 및 런타임을 제어합니다. `prompt` 메서드 내에서 Koog 에이전트를 정의하고 실행합니다.

Koog와 함께 ACP를 사용하려면 ACP SDK의 `AgentSupport` 및 `AgentSession` 인터페이스를 구현해야 합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.features.acp.AcpAgent
import ai.koog.agents.features.acp.toKoogMessage
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.model.PromptExecutor
import com.agentclientprotocol.agent.AgentSession
import com.agentclientprotocol.common.Event
import com.agentclientprotocol.model.ContentBlock
import com.agentclientprotocol.model.SessionId
import com.agentclientprotocol.protocol.Protocol
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.channelFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.datetime.Clock
import kotlinx.serialization.json.JsonElement
import ai.koog.agents.core.dsl.builder.strategy

val promptExecutor: PromptExecutor = TODO()
val protocol: Protocol = TODO()
val clock: Clock = Clock.System
-->
```kotlin
// Koog 에이전트의 수명 주기를 관리하기 위해 AgentSession을 구현합니다.
class KoogAgentSession(
    override val sessionId: SessionId,
    private val promptExecutor: PromptExecutor,
    private val protocol: Protocol,
    private val clock: Clock,
) : AgentSession {

    private var agentJob: Deferred<Unit>? = null
    private val agentMutex = Mutex()

    override suspend fun prompt(
        content: List<ContentBlock>,
        _meta: JsonElement?
    ): Flow<Event> = channelFlow {
        val agentConfig = AIAgentConfig(
            prompt = prompt("acp") {
                system("You are a helpful assistant.")
            }.appendPrompt(content),
            model = OpenAIModels.Chat.GPT4o,
            maxAgentIterations = 1000
        )

        agentMutex.withLock {
            val agent = AIAgent(
                promptExecutor = promptExecutor,
                agentConfig = agentConfig,
                strategy = myStrategy()
            ) {
                install(AcpAgent) {
                    this.sessionId = this@KoogAgentSession.sessionId.value
                    this.protocol = this@KoogAgentSession.protocol
                    this.eventsProducer = this@channelFlow
                    this.setDefaultNotifications = true
                }
            }

            agentJob = async { agent.run(Unit) }
            agentJob?.await()
        }
    }

    private fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
        return withMessages { messages ->
            messages + listOf(content.toKoogMessage(clock))
        }
    }
    
    private fun myStrategy() = strategy<Unit, Unit>("") {
        // Define your strategy here
    }    
    override suspend fun cancel() {
        agentJob?.cancel()
    }
}
```
<!--- KNIT example-agent-client-protocol-02.kt -->

### 2. `AcpAgent` 기능 구성

`AcpAgent` 기능은 `AcpConfig`를 통해 구성할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy
import ai.koog.agents.features.acp.AcpAgent
import ai.koog.prompt.executor.model.PromptExecutor
import com.agentclientprotocol.protocol.Protocol
import kotlinx.coroutines.flow.channelFlow

val promptExecutor: PromptExecutor = TODO()
val protocol: Protocol = TODO()
val sessionIdValue: String = "session-123"
val agentConfig: AIAgentConfig = TODO()
private fun myStrategy(): AIAgentGraphStrategy<Unit, Unit> = TODO()

suspend fun main() = channelFlow {
-->
<!--- SUFFIX
}
-->
```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    agentConfig = agentConfig,
    strategy = myStrategy()
) {
    install(AcpAgent) {
        // 필수: ACP 연결을 위한 고유 세션 식별자
        this.sessionId = sessionIdValue

        // 필수: 요청 및 알림을 보내는 데 사용되는 프로토콜 인스턴스
        this.protocol = protocol

        // 필수: 이벤트를 보내기 위한 코루틴 기반 프로듀서 스코프
        this.eventsProducer = this@channelFlow

        // 선택 사항: 기본 알림 핸들러 등록 여부 (기본값: true)
        this.setDefaultNotifications = true
    }
}
```
<!--- KNIT example-agent-client-protocol-03.kt -->

주요 구성 옵션:

-   `sessionId`: ACP 연결을 위한 고유 세션 식별자
-   `protocol`: ACP 클라이언트에 요청 및 알림을 보내는 데 사용되는 프로토콜 인스턴스
-   `eventsProducer`: 이벤트를 보내기 위한 코루틴 기반 프로듀서 스코프
-   `setDefaultNotifications`: 기본 알림 핸들러 등록 여부 (기본값: `true`)

### 3. 들어오는 프롬프트 처리

제공된 확장 함수를 사용하여 ACP 콘텐츠 블록을 Koog 메시지로 변환합니다.

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogMessage
import ai.koog.prompt.dsl.Prompt
import com.agentclientprotocol.model.ContentBlock
import kotlinx.datetime.Clock

val clock: Clock = Clock.System
val existingPrompt: Prompt = TODO()
val acpContent: List<ContentBlock> = TODO()
-->
```kotlin
// ACP 콘텐츠 블록을 Koog 메시지로 변환
val koogMessage = acpContent.toKoogMessage(clock)

// 기존 프롬프트에 추가
fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
    return withMessages { messages ->
        messages + listOf(content.toKoogMessage(clock))
    }
}
```
<!--- KNIT example-agent-client-protocol-04.kt -->

## 기본 알림 핸들러

`setDefaultNotifications`가 활성화되면 `AcpAgent` 기능은 다음을 자동으로 처리합니다.

1.  **에이전트 완료**: 에이전트가 성공적으로 완료되면 `StopReason.END_TURN`과 함께 `PromptResponseEvent`를 전송합니다.
2.  **에이전트 실행 실패**: 적절한 중단 이유와 함께 `PromptResponseEvent`를 전송합니다.
    -   최대 반복 횟수 초과 시 `StopReason.MAX_TURN_REQUESTS`
    -   기타 실행 실패 시 `StopReason.REFUSAL`
3.  **LLM 응답**: LLM 응답을 ACP 이벤트 (텍스트, 도구 호출, 추론)로 변환하여 전송합니다.
4.  **도구 호출 수명 주기**: 도구 호출 상태 변경 사항을 보고합니다.
    -   도구 호출 시작 시 `ToolCallStatus.IN_PROGRESS`
    -   도구 호출 성공 시 `ToolCallStatus.COMPLETED`
    -   도구 호출 실패 시 `ToolCallStatus.FAILED`

## 사용자 지정 이벤트 전송

`sendEvent` 메서드를 사용하여 ACP 클라이언트에 사용자 지정 이벤트를 보낼 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.features.acp.withAcpAgent
import ai.koog.prompt.executor.model.PromptExecutor
import com.agentclientprotocol.common.Event
import com.agentclientprotocol.model.Plan
import com.agentclientprotocol.model.SessionUpdate

val promptExecutor: PromptExecutor = TODO()
val agent: AIAgent<Unit, Unit> = TODO()
val plan: Plan = TODO()

val str = strategy<Unit, Unit>("example-agent") {
// Access the ACP feature and send custom events
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// ACP 기능에 액세스하여 사용자 지정 이벤트를 보냅니다.
withAcpAgent {
    sendEvent(
        Event.SessionUpdateEvent(
            SessionUpdate.PlanUpdate(plan.entries)
        )
    )
}
```
<!--- KNIT example-agent-client-protocol-05.kt -->

또한, `withAcpAgent` 내에서 `protocol`을 사용하여 사용자 지정 알림이나 요청을 보낼 수 있습니다.
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.features.acp.withAcpAgent
import ai.koog.prompt.executor.model.PromptExecutor
import com.agentclientprotocol.model.AcpMethod
import com.agentclientprotocol.model.AuthMethodId
import com.agentclientprotocol.model.AuthenticateRequest
import com.agentclientprotocol.model.AuthenticateResponse
import com.agentclientprotocol.model.Plan
import com.agentclientprotocol.protocol.sendRequest

val promptExecutor: PromptExecutor = TODO()
val agent: AIAgent<Unit, Unit> = TODO()
val plan: Plan = TODO()

val str = strategy<Unit, Unit>("example-agent") {
// Access the ACP feature and send custom events
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// ACP 기능에 액세스하여 사용자 지정 이벤트를 보냅니다.
withAcpAgent {
    protocol.sendRequest<AuthenticateRequest, AuthenticateResponse>(
        AcpMethod.AgentMethods.Authenticate,
        AuthenticateRequest(methodId = AuthMethodId("Google"))
    )
}
```
<!--- KNIT example-agent-client-protocol-06.kt -->

## 메시지 변환

이 모듈은 Koog 및 ACP 메시지 형식 간 변환 유틸리티를 제공합니다.

### ACP에서 Koog으로

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogContentPart
import ai.koog.agents.features.acp.toKoogMessage
import com.agentclientprotocol.model.ContentBlock
import kotlinx.datetime.Clock

val clock: Clock = Clock.System
val acpContentBlocks: List<ContentBlock> = TODO()
val acpContentBlock: ContentBlock = TODO()
-->
```kotlin
// ACP 콘텐츠 블록을 Koog 메시지로 변환
val koogMessage = acpContentBlocks.toKoogMessage(clock)

// 단일 ACP 콘텐츠 블록을 Koog 콘텐츠 파트로 변환
val contentPart = acpContentBlock.toKoogContentPart()
```
<!--- KNIT example-agent-client-protocol-07.kt -->

### Koog에서 ACP로

<!--- INCLUDE
import ai.koog.agents.features.acp.toAcpContentBlock
import ai.koog.agents.features.acp.toAcpEvents
import ai.koog.prompt.message.ContentPart
import ai.koog.prompt.message.Message

val koogResponseMessage: Message.Assistant = TODO()
val koogContentPart: ContentPart = TODO()
-->
```kotlin
// Koog 응답 메시지를 ACP 이벤트로 변환
val acpEvents = koogResponseMessage.toAcpEvents()

// Koog 콘텐츠 파트를 ACP 콘텐츠 블록으로 변환
val acpContentBlock = koogContentPart.toAcpContentBlock()
```
<!--- KNIT example-agent-client-protocol-08.kt -->

## 중요 참고 사항

### 이벤트 스트리밍을 위해 `channelFlow` 사용

다른 코루틴에서 이벤트를 보낼 수 있도록 `channelFlow`를 사용합니다.

```kotlin
override suspend fun prompt(
    content: List<ContentBlock>,
    _meta: JsonElement?
): Flow<Event> = channelFlow {
    // `this@channelFlow`를 `eventsProducer`로 사용하여 `AcpAgent`를 설치합니다.
}
```

### 에이전트 실행 동기화

이전 실행이 완료될 때까지 프로토콜이 새 실행을 트리거해서는 안 되므로, 뮤텍스를 사용하여 에이전트 인스턴스에 대한 접근을 동기화합니다.

```kotlin
private val agentMutex = Mutex()

agentMutex.withLock {
    // 에이전트 생성 및 실행
}
```

### 수동 알림 처리

사용자 지정 알림 처리가 필요한 경우 `setDefaultNotifications = false`로 설정하고 사양에 따라 모든 에이전트 이벤트를 처리합니다.

```kotlin
install(AcpAgent) {
    this.setDefaultNotifications = false
    // 사용자 지정 이벤트 처리 구현
}
```

## 플랫폼 지원

ACP 기능은 현재 JVM 플랫폼에서만 사용할 수 있습니다. 이는 JVM에 특화된 ACP Kotlin SDK에 의존하기 때문입니다.

## 사용 예시

완전히 작동하는 예제는 [Koog 저장소](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/acp)에서 찾을 수 있습니다.

### 예제 실행

1.  ACP 예제 애플리케이션을 실행합니다.
```shell
./gradlew :examples:simple-examples:run
```

2.  ACP 에이전트에 대한 요청을 입력합니다.
```shell
Move file `my-file.md` to folder `my-folder` and append title '## My File' to the file content
```

3.  콘솔에서 에이전트 실행, 도구 호출 및 완료 상태를 보여주는 이벤트 추적을 확인합니다.