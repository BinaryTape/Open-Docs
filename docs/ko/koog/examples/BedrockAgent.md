# AWS Bedrock 및 Koog 프레임워크로 AI 에이전트 구축

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button }

AWS Bedrock 통합과 Koog 프레임워크를 사용하여 지능형 AI 에이전트를 생성하는 이 포괄적인 가이드에 오신 것을 환영합니다. 이 노트북에서는 자연어 명령을 통해 간단한 스위치 장치를 제어할 수 있는 기능적인 에이전트를 구축하는 과정을 안내해 드릴 것입니다.

## 학습 목표

- Kotlin 어노테이션을 사용하여 AI 에이전트용 커스텀 도구를 정의하는 방법
- LLM 기반 에이전트용 AWS Bedrock 통합 설정
- 도구 레지스트리를 생성하고 에이전트에 연결하는 방법
- 명령을 이해하고 실행할 수 있는 대화형 에이전트 구축

## 필수 조건

- 적절한 권한이 있는 AWS Bedrock 액세스
- AWS 자격 증명 구성 (액세스 키 및 비밀 키)
- Kotlin 코루틴에 대한 기본적인 이해

첫 번째 Bedrock 기반 AI 에이전트를 구축해 봅시다!

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

// 에이전트가 제어할 간단한 상태 유지 장치
class Switch {
    private var state: Boolean = false

    fun switch(on: Boolean) {
        state = on
    }

    fun isOn(): Boolean {
        return state
    }
}

/**
 * AI 에이전트에 스위치 작업을 노출하는 ToolSet 구현체입니다.
 *
 * 핵심 개념:
 * - @Tool 어노테이션은 메서드를 에이전트가 호출할 수 있도록 표시합니다.
 * - @LLMDescription은 LLM에 자연어 설명을 제공합니다.
 * - ToolSet 인터페이스는 관련 도구들을 함께 그룹화할 수 있도록 합니다.
 */
class SwitchTools(val switch: Switch) : ToolSet {

    @Tool
    @LLMDescription("스위치의 상태를 켜거나 끄도록 전환합니다.")
    fun switchState(state: Boolean): String {
        switch.switch(state)
        return "Switch turned ${if (state) "on" else "off"} successfully"
    }

    @Tool
    @LLMDescription("스위치의 현재 상태(켜짐 또는 꺼짐)를 반환합니다.")
    fun getCurrentState(): String {
        return "Switch is currently ${if (switch.isOn()) "on" else "off"}"
    }
}
```

```kotlin
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools

// 스위치 인스턴스 생성
val switch = Switch()

// 스위치 도구로 도구 레지스트리 구축
val toolRegistry = ToolRegistry {
    // ToolSet을 개별 도구로 변환하고 등록합니다.
    tools(SwitchTools(switch).asTools())
}

println("✅ 2개의 도구로 도구 레지스트리가 생성되었습니다:")
toolRegistry.tools.forEach { tool ->
    println("  - ${tool.name}")
}
```

    ✅ 2개의 도구로 도구 레지스트리가 생성되었습니다:
      - getCurrentState
      - switchState

```kotlin
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockRegions

val region = BedrockRegions.US_WEST_2.regionCode
val maxRetries = 3

// Bedrock 클라이언트 설정 구성
val bedrockSettings = BedrockClientSettings(
    region = region, // 원하는 AWS 리전을 선택하세요
    maxRetries = maxRetries // 실패한 요청에 대한 재시도 횟수
)

println("🌐 Bedrock이 리전: $region에 구성되었습니다.")
println("🔄 최대 재시도 횟수가 $maxRetries로 설정되었습니다.")
```

    🌐 Bedrock이 리전: us-west-2에 구성되었습니다.
    🔄 최대 재시도 횟수가 3로 설정되었습니다.

```kotlin
import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor

// 환경 변수로부터 자격 증명을 사용하여 Bedrock LLM 실행기 생성
val executor = simpleBedrockExecutor(
    awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_ACCESS_KEY environment variable not set"),
    awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_SECRET_ACCESS_KEY environment variable not set"),
    settings = bedrockSettings
)

println("🔐 Bedrock 실행기가 성공적으로 초기화되었습니다.")
println("💡 팁: AWS_BEDROCK_ACCESS_KEY 및 AWS_BEDROCK_SECRET_ACCESS_KEY 환경 변수를 설정하세요.")
```

    🔐 Bedrock 실행기가 성공적으로 초기화되었습니다.
    💡 팁: AWS_BEDROCK_ACCESS_KEY 및 AWS_BEDROCK_SECRET_ACCESS_KEY 환경 변수를 설정하세요.

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.bedrock.BedrockModels

val agent = AIAgent(
    executor = executor,
    llmModel = BedrockModels.AnthropicClaude35SonnetV2, // 최첨단 추론 모델
    systemPrompt = """
        You are a helpful assistant that controls a switch device.

        You can:
        - Turn the switch on or off when requested
        - Check the current state of the switch
        - Explain what you're doing

        Always be clear about the switch's current state and confirm actions taken.
    """.trimIndent(),
    temperature = 0.1, // 일관되고 집중적인 응답을 위한 낮은 온도
    toolRegistry = toolRegistry
)

println("🤖 AI 에이전트가 성공적으로 생성되었습니다!")
println("📋 시스템 프롬프트가 구성되었습니다.")
println("🛠️  사용 가능한 도구: ${toolRegistry.tools.size}")
println("🎯 모델: ${BedrockModels.AnthropicClaude35SonnetV2}")
println("🌡️  온도: 0.1 (집중적인 응답)")
```

    🤖 AI 에이전트가 성공적으로 생성되었습니다!
    📋 시스템 프롬프트가 구성되었습니다.
    🛠️  사용 가능한 도구: 2
    🎯 모델: LLModel(provider=Bedrock, id=us.anthropic.claude-3-5-sonnet-20241022-v2:0, capabilities=[Temperature, Tools, ToolChoice, Image, Document, Completion], contextLength=200000, maxOutputTokens=8192)
    🌡️  온도: 0.1 (집중적인 응답)

```kotlin
import kotlinx.coroutines.runBlocking

println("🎉 스위치 도구가 포함된 Bedrock 에이전트 - 준비 완료!")
println("💬 다음을 요청할 수 있습니다:")
println("   • 스위치를 켜거나 끄기")
println("   • 현재 스위치 상태 확인")
println("   • 스위치에 대한 질문")
println()
println("💡 예시: '스위치를 켜 주세요' 또는 '현재 상태는 무엇인가요?'")
println("📝 요청을 입력하세요:")

val input = readln()
println("
🤖 요청 처리 중...")

runBlocking {
    val response = agent.run(input)
    println("
✨ 에이전트 응답:")
    println(response)
}
```

    🎉 스위치 도구가 포함된 Bedrock 에이전트 - 준비 완료!
    💬 다음을 요청할 수 있습니다:
       • 스위치를 켜거나 끄기
       • 현재 스위치 상태 확인
       • 스위치에 대한 질문
    
    💡 예시: '스위치를 켜 주세요' 또는 '현재 상태는 무엇인가요?'
    📝 요청을 입력하세요:

    실행이 중단되었습니다

## 무슨 일이 일어났나요? 🎯

에이전트를 실행하면 내부적으로 다음과 같은 과정이 발생합니다:

1.  **자연어 처리**: 사용자 입력이 Bedrock을 통해 Claude 3.5 Sonnet으로 전송됩니다.
2.  **의도 인식**: 모델이 스위치로 무엇을 하려는지 이해합니다.
3.  **도구 선택**: 사용자 요청에 따라 에이전트가 호출할 도구를 결정합니다.
4.  **액션 실행**: 스위치 객체에서 적절한 도구 메서드가 호출됩니다.
5.  **응답 생성**: 에이전트가 발생한 일에 대한 자연어 응답을 생성합니다.

이는 자연어 이해와 프로그래밍 방식 액션 간의 원활한 통합이라는 Koog 프레임워크의 핵심적인 강력함을 보여줍니다.

## 다음 단계 및 확장

더 나아가 볼 준비가 되셨나요? 다음은 탐색해 볼 몇 가지 아이디어입니다:

### 🔧 향상된 도구

```kotlin
@Tool
@LLMDescription("지정된 초 후에 스위치를 자동으로 끄도록 타이머를 설정합니다.")
fun setAutoOffTimer(seconds: Int): String

@Tool
@LLMDescription("스위치 사용 통계 및 기록을 가져옵니다.")
fun getUsageStats(): String
```

### 🌐 여러 장치

```kotlin
class HomeAutomationTools : ToolSet {
    @Tool fun controlLight(room: String, on: Boolean): String
    @Tool fun setThermostat(temperature: Double): String
    @Tool fun lockDoor(doorName: String): String
}
```

### 🧠 메모리 및 컨텍스트

```kotlin
val agent = AIAgent(
    executor = executor,
    // ... 기타 설정
    features = listOf(
        MemoryFeature(), // 과거 상호 작용 기억
        LoggingFeature()  // 모든 작업 추적
    )
)
```

### 🔄 고급 워크플로

```kotlin
// 조건부 로직을 포함한 다단계 워크플로
@Tool
@LLMDescription("저녁 루틴을 실행합니다: 조명을 어둡게 하고, 문을 잠그고, 온도 조절기를 설정합니다.")
fun eveningRoutine(): String
```

## 핵심 정리

✅ **도구는 함수입니다**: 모든 Kotlin 함수는 에이전트의 기능이 될 수 있습니다.
✅ **어노테이션이 동작을 이끌어냅니다**: `@Tool` 및 `@LLMDescription`은 함수를 검색 가능하게 만듭니다.
✅ **ToolSet은 기능을 정리합니다**: 관련 도구들을 논리적으로 함께 그룹화합니다.
✅ **레지스트리는 도구 상자입니다**: `ToolRegistry`는 사용 가능한 모든 에이전트 기능을 포함합니다.
✅ **에이전트가 모든 것을 조율합니다**: `AIAgent`는 LLM 지능과 도구를 결합합니다.

Koog 프레임워크를 사용하면 자연어를 이해하고 실제 세계의 액션을 취할 수 있는 정교한 AI 에이전트를 매우 간단하게 구축할 수 있습니다. 간단하게 시작한 다음, 필요에 따라 더 많은 도구와 기능을 추가하여 에이전트의 기능을 확장하세요.

**즐거운 에이전트 구축 되세요!** 🚀

## 에이전트 테스트

이제 에이전트의 작동을 볼 시간입니다! 에이전트는 이제 자연어 요청을 이해하고 우리가 제공한 도구를 사용하여 스위치를 제어할 수 있습니다.

**다음 명령을 시도해 보세요:**
- "스위치를 켜 줘"
- "현재 상태는 어때?"
- "꺼 줘"
- "스위치가 켜져 있어 아니면 꺼져 있어?"