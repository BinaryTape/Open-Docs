# AWS Bedrock 및 Koog 프레임워크를 사용한 AI 에이전트 구축

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button }

Koog 프레임워크와 AWS Bedrock 연동을 사용하여 지능형 AI 에이전트를 만드는 종합 가이드에 오신 것을 환영합니다. 이 노트북에서는 자연어 명령을 통해 간단한 스위치 장치를 제어할 수 있는 기능적인 에이전트를 구축하는 과정을 살펴보겠습니다.

## 학습 내용

- Kotlin 어노테이션(annotation)을 사용하여 AI 에이전트를 위한 커스텀 도구(tool)를 정의하는 방법
- LLM 기반 에이전트를 위한 AWS Bedrock 연동 설정
- 도구 레지스트리(tool registry) 생성 및 에이전트 연결
- 명령을 이해하고 실행할 수 있는 대화형 에이전트 구축

## 사전 준비 사항

- 적절한 권한이 있는 AWS Bedrock 접근 권한
- 구성된 AWS 자격 증명 (액세스 키 및 비밀 키)
- Kotlin 코루틴(coroutines)에 대한 기본 이해

이제 첫 번째 Bedrock 기반 AI 에이전트 구축을 시작해 보겠습니다!

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
 * AI 에이전트에 스위치 작업을 노출하는 ToolSet 구현.
 *
 * 핵심 개념:
 * - @Tool 어노테이션은 메서드를 에이전트가 호출 가능한 것으로 표시함
 * - @LLMDescription은 LLM을 위한 자연어 설명을 제공함
 * - ToolSet 인터페이스는 관련 도구들을 함께 그룹화할 수 있게 함
 */
class SwitchTools(val switch: Switch) : ToolSet {

    @Tool
    @LLMDescription("Switches the state of the switch to on or off")
    fun switchState(state: Boolean): String {
        switch.switch(state)
        return "Switch turned ${if (state) "on" else "off"} successfully"
    }

    @Tool
    @LLMDescription("Returns the current state of the switch (on or off)")
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

// 스위치 도구를 사용하여 도구 레지스트리 빌드
val toolRegistry = ToolRegistry {
    // ToolSet을 개별 도구로 변환하고 등록
    tools(SwitchTools(switch).asTools())
}

println("✅ ${toolRegistry.tools.size}개의 도구가 포함된 도구 레지스트리가 생성되었습니다:")
toolRegistry.tools.forEach { tool ->
    println("  - ${tool.name}")
}
```

    ✅ 2개의 도구가 포함된 도구 레지스트리가 생성되었습니다:
      - getCurrentState
      - switchState

```kotlin
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockRegions

val region = BedrockRegions.US_WEST_2.regionCode
val maxRetries = 3

// Bedrock 클라이언트 설정 구성
val bedrockSettings = BedrockClientSettings(
    region = region, // 선호하는 AWS 리전 선택
    maxRetries = maxRetries // 실패한 요청에 대한 재시도 횟수
)

println("🌐 Bedrock 리전 설정 완료: $region")
println("🔄 최대 재시도 횟수 설정 완료: $maxRetries")
```

    🌐 Bedrock 리전 설정 완료: us-west-2
    🔄 최대 재시도 횟수 설정 완료: 3

```kotlin
import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor

// 환경 변수의 자격 증명을 사용하여 Bedrock LLM 실행기(executor) 생성
val executor = simpleBedrockExecutor(
    awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_ACCESS_KEY environment variable not set"),
    awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_SECRET_ACCESS_KEY environment variable not set"),
    settings = bedrockSettings
)

println("🔐 Bedrock 실행기가 성공적으로 초기화되었습니다")
println("💡 팁: AWS_BEDROCK_ACCESS_KEY 및 AWS_BEDROCK_SECRET_ACCESS_KEY 환경 변수를 설정하세요")
```

    🔐 Bedrock 실행기가 성공적으로 초기화되었습니다
    💡 팁: AWS_BEDROCK_ACCESS_KEY 및 AWS_BEDROCK_SECRET_ACCESS_KEY 환경 변수를 설정하세요

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
    temperature = 0.1, // 일관되고 집중된 응답을 위한 낮은 온(temperature) 설정
    toolRegistry = toolRegistry
)

println("🤖 AI 에이전트가 성공적으로 생성되었습니다!")
println("📋 시스템 프롬프트 구성 완료")
println("🛠️  사용 가능한 도구: ${toolRegistry.tools.size}")
println("🎯 모델: ${BedrockModels.AnthropicClaude35SonnetV2}")
println("🌡️  온도: 0.1 (집중된 응답)")
```

    🤖 AI 에이전트가 성공적으로 생성되었습니다!
    📋 시스템 프롬프트 구성 완료
    🛠️  사용 가능한 도구: 2
    🎯 모델: LLModel(provider=Bedrock, id=us.anthropic.claude-3-5-sonnet-20241022-v2:0, capabilities=[Temperature, Tools, ToolChoice, Image, Document, Completion], contextLength=200000, maxOutputTokens=8192)
    🌡️  온도: 0.1 (집중된 응답)

```kotlin
import kotlinx.coroutines.runBlocking

println("🎉 스위치 도구가 포함된 Bedrock 에이전트가 준비되었습니다!")
println("💬 저에게 다음과 같이 요청할 수 있습니다:")
println("   • 스위치 켜기/끄기")
println("   • 현재 스위치 상태 확인")
println("   • 스위치에 대한 질문")
println()
println("💡 예시: '스위치를 켜줘' 또는 '현재 상태가 뭐야?'")
println("📝 요청 사항을 입력하세요:")

val input = readln()
println("
🤖 요청을 처리 중입니다...")

runBlocking {
    val response = agent.run(input)
    println("
✨ 에이전트 응답:")
    println(response)
}
```

    🎉 스위치 도구가 포함된 Bedrock 에이전트가 준비되었습니다!
    💬 저에게 다음과 같이 요청할 수 있습니다:
       • 스위치 켜기/끄기
       • 현재 스위치 상태 확인
       • 스위치에 대한 질문
    
    💡 예시: '스위치를 켜줘' 또는 '현재 상태가 뭐야?'
    📝 요청 사항을 입력하세요:

    The execution was interrupted

## 무슨 일이 일어났나요? 🎯

에이전트를 실행할 때 배후에서 일어나는 마법은 다음과 같습니다:

1. **자연어 처리 (Natural Language Processing)**: 입력 내용이 Bedrock을 통해 Claude 3.5 Sonnet으로 전송됩니다.
2. **의도 인식 (Intent Recognition)**: 모델이 사용자가 스위치로 무엇을 하려고 하는지 이해합니다.
3. **도구 선택 (Tool Selection)**: 요청에 따라 에이전트가 어떤 도구를 호출할지 결정합니다.
4. **작업 실행 (Action Execution)**: 스위치 객체에서 적절한 도구 메서드가 호출됩니다.
5. **응답 생성 (Response Generation)**: 에이전트가 발생한 일에 대해 자연어 응답을 작성합니다.

이는 자연어 이해와 프로그래밍 방식의 작업 사이의 원활한 통합이라는 Koog 프레임워크의 핵심적인 힘을 보여줍니다.

## 다음 단계 및 확장

더 나아가 볼 준비가 되셨나요? 탐구해 볼 수 있는 몇 가지 아이디어입니다:

### 🔧 향상된 도구
```kotlin
@Tool
@LLMDescription("Sets a timer to automatically turn off the switch after specified seconds")
fun setAutoOffTimer(seconds: Int): String

@Tool
@LLMDescription("Gets the switch usage statistics and history")
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
        MemoryFeature(), // 과거 상호작용 기억
        LoggingFeature()  // 모든 작업 추적
    )
)
```

### 🔄 고급 워크플로
```kotlin
// 조건부 로직이 포함된 다단계 워크플로
@Tool
@LLMDescription("Executes evening routine: dims lights, locks doors, sets thermostat")
fun eveningRoutine(): String
```

## 핵심 요약

✅ **도구는 함수입니다**: 모든 Kotlin 함수는 에이전트의 기능이 될 수 있습니다.
✅ **어노테이션이 동작을 제어합니다**: `@Tool` 및 `@LLMDescription`을 통해 함수를 탐색 가능하게 만듭니다.
✅ **ToolSet은 기능을 구성합니다**: 관련 도구들을 논리적으로 그룹화합니다.
✅ **레지스트리는 도구 상자입니다**: `ToolRegistry`에는 에이전트가 사용 가능한 모든 기능이 들어 있습니다.
✅ **에이전트가 모든 것을 조율합니다**: `AIAgent`는 LLM 지능과 도구를 하나로 통합합니다.

Koog 프레임워크를 사용하면 자연어를 이해하고 실제 작업을 수행할 수 있는 정교한 AI 에이전트를 매우 간단하게 구축할 수 있습니다. 작게 시작한 다음, 필요에 따라 더 많은 도구와 기능을 추가하여 에이전트의 역량을 확장해 보세요.

**즐거운 에이전트 구축 되세요!** 🚀

## 에이전트 테스트

이제 에이전트가 작동하는 모습을 볼 시간입니다! 에이전트는 이제 자연어 요청을 이해하고 제공된 도구를 사용하여 스위치를 제어할 수 있습니다.

**다음 명령들을 시도해 보세요:**
- "스위치 켜줘"
- "현재 상태가 어때?"
- "스위치 좀 꺼줄래"
- "스위치가 켜져 있어 꺼져 있어?"