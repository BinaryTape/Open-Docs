---
status: beta
---

# Agent Client Protocol

--8<-- "versioning-snippets.md:beta"

Agent Client Protocol (ACP)은 클라이언트 애플리케이션이 일관된 양방향 인터페이스를 통해 AI 에이전트와 통신할 수 있게 해주는 오픈 소스 표준 프로토콜입니다.
Koog 에이전트에 ACP를 구현하면 IDE와 같은 ACP 준수(ACP-compliant) 환경에 쉽게 통합할 수 있습니다.

자세한 정보는 [Agent Client Protocol] 문서를 참조하세요.

## Koog와 통합

Koog 프레임워크는 추가 API 확장과 함께 [ACP Kotlin SDK]를 사용하여 ACP와 통합됩니다.
이 통합은 다음 기능을 제공합니다:

* ACP 준수 클라이언트 애플리케이션과 Koog 에이전트 간의 표준화된 통신
* 도구 호출(tool calls), 에이전트 생각(thoughts), 완료(completions)에 대한 자동 실행 업데이트
* Koog의 멀티모달 메시지 형식과 ACP의 콘텐츠 블록(content blocks) 간의 원활한 메시지 변환
* Koog 에이전트 상태와 ACP 세션 이벤트 간의 수명 주기(lifecycle) 매핑

!!! note

    [ACP Kotlin SDK]는 JVM 전용이므로, ACP 통합은 현재 JVM 플랫폼에서만 사용할 수 있습니다.

### 의존성 추가

ACP 지원은 기본적으로 Koog에서 제공되지 않는 선택적 [기능(feature)](features/index.md)입니다.
Koog 에이전트에 ACP를 구현하려면 [ai.koog:agents-features-acp](https://mvnrepository.com/artifact/ai.koog/agents-features-acp)에 대한 의존성을 추가하세요. 이 모듈은 내부적으로 [com.agentclientprotocol:acp](https://mvnrepository.com/artifact/com.agentclientprotocol:acp)에 대한 의존성을 가집니다.

예를 들어, `build.gradle.kts`의 경우 다음과 같습니다.

```kotlin
dependencies {
    implementation("ai.koog:agents-features-acp:$koogVersion")
}
```

### Koog 에이전트에 ACP 활성화

Koog 에이전트의 내부 [이벤트 시스템](agent-events.md)을 ACP 프로토콜과 연결하려면 `ai.koog.agents.features.acp.AcpAgent` 기능을 설치하세요.
설치되면 도구 호출이나 LLM 응답과 같은 수명 주기 이벤트를 수신 대기하고 이를 ACP 클라이언트로 전송합니다.

<!--- CLEAR -->
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.acp.AcpAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o
) {
    install(AcpAgent) {
        this.sessionId = sessionId
        this.protocol = protocol
        this.eventsProducer = eventsProducer
        this.setDefaultNotifications = true
    }
}
```
<!--- KNIT example-agent-client-protocol-01.kt -->

주요 구성 옵션:

*   **`sessionId`**: 현재 대화 세션을 식별하는 고유 문자열입니다.
*   **`protocol`**: 로우 레벨(low-level) 통신에 사용되는 [`com.agentclientprotocol.protocol.Protocol`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/protocol/Protocol.kt)의 인스턴스입니다.
*   **`eventsProducer`**: ACP 이벤트가 전송되는 `kotlinx.coroutines.channels.ProducerScope<Event>`입니다.
    자세한 내용은 [이벤트 스트리밍](#event-streaming)을 참조하세요.
*   **`setDefaultNotifications`**: 에이전트 수명 주기 이벤트에 대해 기본 알림 핸들러를 등록할지 여부입니다.
    자세한 내용은 [에이전트 알림 처리](#handling-agent-notifications)를 참조하세요.

이 에이전트는 다음 장에서 설명하는 ACP 세션의 스코프 내에서 실행되어야 합니다.

### ACP 지원 에이전트 구현

Koog 에이전트를 ACP 클라이언트에 연결하려면 [ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk)의 두 가지 핵심 인터페이스를 구현해야 합니다.

- [`AgentSupport`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/agent/AgentSupport.kt):
  에이전트의 식별 정보, 기능 및 세션 수명 주기(세션 생성 또는 로드)를 관리합니다.
- [`AgentSession`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/agent/AgentSession.kt):
  단일 대화 세션을 관리하고, `prompt` 실행을 처리하며, 취소를 관리합니다.

`AgentSession`의 `prompt()` 메서드 내부에서 ACP 지원 Koog 에이전트를 초기화하고 실행해야 합니다. 다음은 예시입니다.

=== "AgentSession"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.agent.config.AIAgentConfig
    import ai.koog.agents.features.acp.AcpAgent
    import ai.koog.agents.features.acp.toKoogMessage
    import ai.koog.prompt.Prompt
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
    import ai.koog.utils.time.KoogClock
    import kotlinx.serialization.json.JsonElement
    -->
    ```kotlin
    class MyAgentSession(
        override val sessionId: SessionId,
        private val promptExecutor: PromptExecutor,
        private val protocol: Protocol,
        private val clock: KoogClock
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
    
            // 한 번에 하나의 에이전트 세션만 실행되도록 보장
            agentMutex.withLock {
                val agent = AIAgent(
                    promptExecutor = promptExecutor,
                    agentConfig = agentConfig
                ) {
                    install(AcpAgent) {
                        this.sessionId = this@MyAgentSession.sessionId.value
                        this.protocol = this@MyAgentSession.protocol
                        this.eventsProducer = this@channelFlow
                        this.setDefaultNotifications = true
                    }
                }

                agentJob = async { agent.run("Hello. How can you help me?") }
                agentJob?.await()
            }
        }
    
        private fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
            return withMessages { messages ->
                messages + listOf(content.toKoogMessage(clock))
            }
        }
    
        override suspend fun cancel() {
            agentJob?.cancel()
        }
    }
    ```
    <!--- KNIT example-agent-client-protocol-02.kt -->

=== "AgentSupport"

    <!--- INCLUDE
    import ai.koog.prompt.executor.model.PromptExecutor
    import com.agentclientprotocol.agent.AgentInfo
    import com.agentclientprotocol.agent.AgentSession
    import com.agentclientprotocol.agent.AgentSupport
    import com.agentclientprotocol.client.ClientInfo
    import com.agentclientprotocol.common.Event
    import com.agentclientprotocol.common.SessionCreationParameters
    import com.agentclientprotocol.model.AgentCapabilities
    import com.agentclientprotocol.model.ContentBlock
    import com.agentclientprotocol.model.LATEST_PROTOCOL_VERSION
    import com.agentclientprotocol.model.PromptCapabilities
    import com.agentclientprotocol.model.SessionId
    import com.agentclientprotocol.protocol.Protocol
    import kotlinx.coroutines.flow.Flow
    import kotlinx.serialization.json.JsonElement
    import ai.koog.utils.time.KoogClock
    import kotlin.uuid.ExperimentalUuidApi
    import kotlin.uuid.Uuid
    class MyAgentSession(
        override val sessionId: SessionId,
        private val promptExecutor: PromptExecutor,
        private val protocol: Protocol,
        private val clock: KoogClock
    ): AgentSession {
        override suspend fun prompt(
            content: List<ContentBlock>,
            _meta: JsonElement?
        ): Flow<Event> {
            TODO("Not yet implemented")
        }
    }
    -->
    ```kotlin
    class MyAgentSupport(
        private val promptExecutor: PromptExecutor,
        private val clock: KoogClock,
        private val protocol: Protocol,
    ) : AgentSupport {
    
        override suspend fun initialize(clientInfo: ClientInfo): AgentInfo {
            return AgentInfo(
                protocolVersion = LATEST_PROTOCOL_VERSION,
                capabilities = AgentCapabilities(
                    loadSession = false, // 세션 지속성을 구현하는 경우 true로 설정
                    promptCapabilities = PromptCapabilities(
                        audio = false,
                        image = false,
                        embeddedContext = true
                    )
                )
            )
        }
    
        @OptIn(ExperimentalUuidApi::class)
        override suspend fun createSession(sessionParameters: SessionCreationParameters): AgentSession {
            val sessionId = SessionId(Uuid.random().toString())
            return MyAgentSession(sessionId, promptExecutor, protocol, clock)
        }
    
        override suspend fun loadSession(sessionId: SessionId, sessionParameters: SessionCreationParameters): AgentSession {
            throw UnsupportedOperationException("Session loading not implemented")
        }
    }
    ```
    <!--- KNIT example-agent-client-protocol-03.kt -->

## 이벤트 스트리밍

예제의 `AgentSession`은 이벤트의 `channelFlow`를 반환하는 `prompt()` 함수를 정의합니다.
그런 다음 `this@channelFlow`를 `eventsProducer`로 사용하여 `AcpAgent` 기능을 설치합니다.
이를 통해 서로 다른 코루틴에서 이벤트를 보낼 수 있습니다.

## 실행 동기화

예제의 `AgentSession`은 뮤텍스(mutex)를 사용하여 에이전트 인스턴스에 대한 액세스를 동기화합니다. 이는 ACP가 이전 실행이 끝날 때까지 새로운 에이전트 실행을 트리거해서는 안 되기 때문입니다. 이를 위해 에이전트 생성 및 실행은 정의된 뮤텍스에 대한 `withLock` 스코프 내에서 이루어집니다.

또한 에이전트가 중간에 조기 취소되지 않도록, `channelFlow` 스코프 내에서 `agentJob`이라는 지연된 작업(deferred job)으로 에이전트를 비동기적으로 실행합니다.

## ACP 클라이언트 입력 처리

ACP 클라이언트는 사용자 입력을 [`ContentBlock`](https://agentclientprotocol.com/protocol/schema#contentblock) 객체 리스트로 보냅니다.
이를 Koog에서 처리하려면 `List<ContentBlock>.toKoogMessage()` 확장 함수를 사용하여 ACP 콘텐츠 블록을 [`Message.User`](api:prompt-model::ai.koog.prompt.message.Message.User)로 변환하고 [에이전트의 프롬프트](prompts/index.md)에 추가합니다.

예제의 `AgentSession`은 ACP 세션에서 초기 에이전트 프롬프트를 확장하는 비공개 함수를 정의합니다.

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogMessage
import ai.koog.prompt.Prompt
import com.agentclientprotocol.model.ContentBlock
import ai.koog.utils.time.KoogClock

val clock: KoogClock = KoogClock.System
-->
```kotlin
private fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
    return withMessages { messages ->
        messages + listOf(content.toKoogMessage(clock))
    }
}
```
<!--- KNIT example-agent-client-protocol-04.kt -->

!!! note

    메시지에 타임스탬프를 기록하려면 `KoogClock` 인스턴스가 필요합니다.

자세한 내용은 [메시지 변환](#converting-messages)을 참조하세요.

## 메시지 변환

`agents-features-acp` 모듈은 Koog의 내부 메시지 유형과 [ACP 콘텐츠 블록](https://agentclientprotocol.com/protocol/content) 간을 원활하게 변환하는 확장 함수를 제공합니다.

ACP 클라이언트로부터 입력을 받을 때 다음 함수를 사용하세요:

- `List<ContentBlock>.toKoogMessage()`: ACP 콘텐츠 블록 리스트를 [`Message.User`](api:prompt-model::ai.koog.prompt.message.Message.User)로 변환합니다.
- `ContentBlock.toKoogContentPart()`: 단일 ACP 콘텐츠 블록을 [`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart)로 변환합니다.

Koog 메시지에서 ACP 이벤트나 콘텐츠 블록을 구성할 때 다음 함수를 사용하세요:

- `Message.Response.toAcpEvents()`: [`Message.Response`](api:prompt-model::ai.koog.prompt.message.Message.Response)를 ACP 세션 업데이트 이벤트 리스트로 변환합니다.
- `ContentPart.toAcpContentBlock()`: [`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart)를 단일 ACP 콘텐츠 블록으로 변환합니다.

## 에이전트 알림 처리

기본적으로 `setDefaultNotifications`는 `true`로 설정되어 있으며, ACP 지원 에이전트는 다음 알림을 자동으로 처리합니다.

- **에이전트 완료**

    에이전트가 성공적으로 완료되면 `StopReason.END_TURN`과 함께 `PromptResponseEvent`를 보냅니다.

- **에이전트 실행 실패**

    적절한 중단 사유와 함께 `PromptResponseEvent`를 보냅니다.

    - 에이전트가 최대 반복 횟수를 초과하면 `StopReason.MAX_TURN_REQUESTS`
    - 기타 실행 실패 시 `StopReason.REFUSAL`
  
- **LLM 응답**

    LLM 응답을 ACP 이벤트(텍스트, 도구 호출, 추론)로 변환하여 전송합니다.

- **도구 호출 수명 주기**

    도구 호출 상태 변경을 보고합니다.

    - 도구 호출 시작 시 `ToolCallStatus.IN_PROGRESS`
    - 도구 호출 성공 시 `ToolCallStatus.COMPLETED`
    - 도구 호출 실패 시 `ToolCallStatus.FAILED`

알림 처리를 커스텀하고 싶다면, `setDefaultNotifications = false`로 설정하고 사양에 따라 에이전트 이벤트를 직접 처리하세요.

## 커스텀 이벤트 전송

자동 알림 외에도, 에이전트 실행 중 어느 시점에서든 `withAcpAgent` 블록 내의 `sendEvent`를 사용하여 ACP 클라이언트에 커스텀 이벤트를 보낼 수 있습니다. 이는 진행 상황 업데이트, 커스텀 상태 메시지 또는 계획 업데이트 등에 유용합니다.

예를 들어 노드와 같은 `AIAgentContext` 내부에서 수행할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.features.acp.withAcpAgent
import com.agentclientprotocol.common.Event
import com.agentclientprotocol.model.Plan
import com.agentclientprotocol.model.SessionUpdate
import com.agentclientprotocol.protocol.sendRequest
-->
```kotlin
val plan: Plan = TODO()

val strategy = strategy<Unit, Unit>("my-strategy") {
    val node by node<Unit, Unit> {
        withAcpAgent {
            sendEvent(
                Event.SessionUpdateEvent(
                    SessionUpdate.PlanUpdate(plan.entries)
                )
            )
        }
    }
}
```
<!--- KNIT example-agent-client-protocol-05.kt -->

또한 기저의 `protocol`에 접근하여 인증 요청과 같은 커스텀 요청을 클라이언트에 보낼 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.features.acp.withAcpAgent
import com.agentclientprotocol.model.AcpMethod
import com.agentclientprotocol.model.AuthMethodId
import com.agentclientprotocol.model.AuthenticateRequest
import com.agentclientprotocol.protocol.sendRequest
-->
```kotlin
val strategy = strategy<Unit, Unit>("my-strategy") {
    val node by node<Unit, Unit> {
        withAcpAgent {
            protocol.sendRequest(
                AcpMethod.AgentMethods.Authenticate,
                AuthenticateRequest(methodId = AuthMethodId("Google"))
            )
        }
    }
}
```
<!--- KNIT example-agent-client-protocol-06.kt -->

## 예제

Koog 저장소의 [/examples](https://github.com/JetBrains/koog/tree/develop/examples/) 아래에서 작동하는 Koog 에이전트 예제를 찾을 수 있습니다.

### 콘솔 기반 ACP 클라이언트 실행하기

이 예제는 단순한 Koog 에이전트와 상호작용하는 콘솔 기반 ACP 클라이언트를 실행합니다.

1. [/examples/simple-examples](https://github.com/JetBrains/koog/blob/develop/examples/simple-examples/)를 엽니다.
2. LLM 제공자를 위한 API 키 구성에 관한 정보는 [README](https://github.com/JetBrains/koog/blob/develop/examples/simple-examples/README.md)를 참조하세요.
3. `runExampleAcpApp` Gradle 태스크를 실행합니다.
4. 콘솔에서 ACP 클라이언트가 시작되면 다음과 같이 에이전트에 요청을 입력합니다.
    ```text
    List files in the current directory and create a new file named 'acp-test.txt' with the content 'Hello from ACP!'.
    ```
5. 콘솔에서 Koog 이벤트가 ACP 이벤트로 변환되어 클라이언트로 전송되는 이벤트 추적을 확인합니다.

### ACP 지원 Koog 에이전트를 JetBrains IDE에 연결하기

이 예제는 ACP 지원 에이전트를 생성하고 IntelliJ IDEA에 연결하는 방법을 보여줍니다.

1. [/examples/acp-agent](https://github.com/JetBrains/koog/tree/develop/examples/acp-agent)를 엽니다.
2. `installDist` Gradle 태스크를 실행합니다.
3. 그러면 에이전트 실행 파일이 생성됩니다: `build/install/acp-agent/bin/acp-agent` (Windows의 경우 `acp-agent.bat`).
4. IntelliJ IDEA (또는 다른 JetBrains IDE)를 엽니다.
5. **AI Chat** > **Options** > **Add Custom Agent**로 이동합니다.
6. 열린 `acp.json` 파일에 다음 내용을 붙여넣습니다.

    ```json
    {
        "agent_servers": {
            "Koog Agent": {
                "command": "/absolute/path/to/acp-agent/build/install/acp-agent/bin/acp-agent",
                "args": [],
                "env": {
                    "OPENAI_API_KEY": "paste-your-api-key-here"
                }
            }
        }
    }
    ```

    구성 파라미터:

    - `agent_servers`: 하나 이상의 에이전트 구성을 포함하는 객체
    - `Koog Agent`: IDE의 에이전트 선택기에 표시될 이름
    - `command`: 에이전트 실행 파일의 절대 경로
    - `args`: 명령줄 인자 (이 에이전트의 경우 비워둠)
    - `env`: 에이전트 프로세스에 전달되는 환경 변수 (이 예제에서는 OpenAI API 키)

7. 이제 **AI Chat** 도구 창에서 해당 에이전트를 사용할 수 있습니다.

IDE에 커스텀 에이전트를 추가하는 방법에 대한 자세한 내용은 [AI Assistant 문서](https://www.jetbrains.com/help/ai-assistant/acp.html#add-custom-agent) 및 [이 블로그 포스트](https://blog.jetbrains.com/ai/2026/02/koog-x-acp-connect-an-agent-to-your-ide-and-more/)를 참조하세요.

[Agent Client Protocol]: https://agentclientprotocol.com
[ACP Kotlin SDK]: https://github.com/agentclientprotocol/kotlin-sdk