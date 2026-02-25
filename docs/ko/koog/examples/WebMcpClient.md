# Bright Data의 The Web MCP와 Koog를 이용한 웹 스크래핑

[:material-github: GitHub에서 열기](https://github.com/JetBrains/koog/blob/develop/examples/bright-data-mcp/){ .md-button .md-button--primary }
[:material-download: .kt 다운로드](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/bright-data-mcp/Main.kt){ .md-button }

이 튜토리얼에서는 Koog 에이전트를 Bright Data의 Web MCP 서버에 연결하여 웹 스크래핑 및 데이터 수집 작업을 수행하도록 설정하는 방법을 알아봅니다. Model Context Protocol을 통해 Bright Data의 강력한 웹 스크래핑 인프라를 사용하여 Koog.ai에 대한 정보를 검색하는 방법을 시연하겠습니다.

사용자의 웹 스크래핑 요구 사항에 맞춰 조정할 수 있는 최소한의 실질적인 에이전트 + 도구 설정을 중심으로, 간단하고 재현 가능한 상태를 유지하며 진행하겠습니다.

## 사전 요구 사항

- 환경 변수로 내보낸 OpenAI API 키: `OPENAI_API_KEY`
- 환경 변수로 내보낸 Bright Data API 토큰: `BRIGHT_DATA_API_TOKEN`
- PATH에서 사용 가능한 Node.js 및 npx
- Koog 의존성이 포함된 Kotlin 개발 환경

**팁**: Bright Data MCP 서버는 복잡한 웹사이트, CAPTCHA 및 봇 방지 조치를 처리할 수 있는 엔터프라이즈급 웹 스크래핑 도구에 대한 액세스를 제공합니다.

## 1) API 자격 증명 설정

비밀 정보를 안전하게 유지하고 코드에 포함하지 않기 위해 환경 변수에서 두 API 키를 읽어옵니다.

```kotlin
// 환경 변수에서 API 키 가져오기
val openAIApiKey = System.getenv("OPENAI_API_KEY")
    ?: error("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.")
val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
    ?: error("BRIGHT_DATA_API_TOKEN 환경 변수가 설정되지 않았습니다.")
```

## 2) Bright Data의 The Web MCP 서버 시작

`npx`를 사용하여 Bright Data의 MCP 서버를 실행하고 API 토큰으로 구성합니다. 서버는 Model Context Protocol을 통해 웹 스크래핑 기능을 노출합니다.

```kotlin
println("Bright Data MCP 서버를 시작하는 중...")

// Bright Data MCP 서버를 별도의 프로세스로 시작
val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

// MCP 서버 프로세스를 위한 API_TOKEN 환경 변수 설정
val environment = processBuilder.environment()
environment["API_TOKEN"] = brightDataToken

// 프로세스 시작
val process = processBuilder.start()

// 프로세스가 시작될 때까지 잠시 대기
Thread.sleep(2000)
```

## 3) Koog에서 연결 및 에이전트 생성

OpenAI 실행기(executor)를 사용하여 Koog `AIAgent`를 빌드하고, STDIO 트랜스포트를 통해 도구 레지스트리(tool registry)를 Bright Data MCP 서버에 연결합니다. 그런 다음 사용 가능한 도구를 탐색하고 웹 스크래핑 작업을 실행합니다.

```kotlin
println("STDIO 트랜스포트 생성 중...")
try {
    // STDIO 트랜스포트 생성
    val transport = McpToolRegistryProvider.defaultStdioTransport(process)
    
    println("도구 레지스트리 생성 중...")
    
    // Bright Data MCP 서버의 도구로 도구 레지스트리 생성
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "bright-data-client",
        version = "1.0.0"
    )
    
    // 사용 가능한 도구 출력 (선택 사항 - 디버깅용)
    println("Bright Data MCP 서버에서 사용 가능한 도구:")
    toolRegistry.tools.forEach { tool ->
        println("- ${tool.name}")
    }
    
    // MCP 도구를 사용하여 에이전트 생성
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiKey),
        systemPrompt = "귀하는 Bright Data의 웹 스크래핑 및 데이터 수집 도구에 액세스할 수 있는 유용한 도우미입니다. 사용자가 웹사이트에서 정보를 수집하고, 웹 데이터를 분석하며, 통찰력을 제공하는 것을 도울 수 있습니다.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = toolRegistry,
        maxIterations = 100
    )
    
    val result = agent.run("Koog.ai를 검색해서 그것이 무엇인지와 누가 발명했는지 알려주세요.")
    
    println("
에이전트 응답:")
    println(result)
    
} catch (e: Exception) {
    println("오류: ${e.message}")
    e.printStackTrace()
} finally {
    println("MCP 서버 종료 중...")
    process.destroyForcibly()
}
```

## 4) 전체 코드 예제

Bright Data의 The Web MCP를 사용한 웹 스크래핑을 보여주는 전체 작동 예제는 다음과 같습니다.

```kotlin
package koog

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

/**
 * AI 기반 웹 스크래핑 및 데이터 수집을 시연하는 프로그램의 진입점입니다.
 *
 * 이 함수는 Bright Data MCP 서버를 초기화하고, 도구 통합을 설정하며,
 * 웹 스크래핑 도구와 상호 작용하기 위한 AI 에이전트를 정의합니다. 
 * 다음과 같은 주요 작업을 시연합니다:
 *
 * 1. 적절한 API 토큰 구성을 사용하여 하위 프로세스로 Bright Data MCP 서버를 시작합니다.
 * 2. STDIO 트랜스포트 통신을 통해 MCP 서버의 도구 레지스트리를 구성합니다.
 * 3. 웹 스크래핑 기능이 있는 OpenAI의 GPT-4o 모델을 활용하는 AI 에이전트를 생성합니다.
 * 4. 지정된 작업(예: Koog.ai에 대한 웹 콘텐츠 검색 및 분석)을 수행하도록 에이전트를 실행합니다.
 * 5. 실행 후 MCP 서버 프로세스를 종료하여 정리합니다.
 *
 * 이 함수는 웹 데이터 수집 및 분석을 위해 MCP(Model Context Protocol) 서버를
 * AI 에이전트와 통합하는 방법을 보여주는 튜토리얼 목적으로 작성되었습니다.
 * OPENAI_API_KEY 및 BRIGHT_DATA_API_TOKEN 환경 변수가 설정되어 있어야 합니다.
 */
fun main() = runBlocking {
    // 환경 변수에서 API 키 가져오기
    val openAIApiKey = System.getenv("OPENAI_API_KEY")
        ?: error("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.")
    val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
        ?: error("BRIGHT_DATA_API_TOKEN 환경 변수가 설정되지 않았습니다.")

    println("Bright Data MCP 서버를 시작하는 중...")

    // Bright Data MCP 서버를 별도의 프로세스로 시작
    val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

    // MCP 서버 프로세스를 위한 API_TOKEN 환경 변수 설정
    val environment = processBuilder.environment()
    environment["API_TOKEN"] = brightDataToken

    // 프로세스 시작
    val process = processBuilder.start()

    // 프로세스가 시작될 때까지 잠시 대기
    Thread.sleep(2000)

    println("STDIO 트랜스포트 생성 중...")

    try {
        // STDIO 트랜스포트 생성
        val transport = McpToolRegistryProvider.defaultStdioTransport(process)
        
        println("도구 레지스트리 생성 중...")
        
        // Bright Data MCP 서버의 도구로 도구 레지스트리 생성
        val toolRegistry = McpToolRegistryProvider.fromTransport(
            transport = transport,
            name = "bright-data-client",
            version = "1.0.0"
        )
        
        // 사용 가능한 도구 출력 (선택 사항 - 디버깅용)
        println("Bright Data MCP 서버에서 사용 가능한 도구:")
        toolRegistry.tools.forEach { tool ->
            println("- ${tool.name}")
        }
        
        // MCP 도구를 사용하여 에이전트 생성
        val agent = AIAgent(
            executor = simpleOpenAIExecutor(openAIApiKey),
            systemPrompt = "귀하는 Bright Data의 웹 스크래핑 및 데이터 수집 도구에 액세스할 수 있는 유용한 도우미입니다. 사용자가 웹사이트에서 정보를 수집하고, 웹 데이터를 분석하며, 통찰력을 제공하는 것을 도울 수 있습니다.",
            llmModel = OpenAIModels.Chat.GPT4o,
            temperature = 0.7,
            toolRegistry = toolRegistry,
            maxIterations = 100
        )
        
        val result = agent.run("Koog.ai를 검색해서 그것이 무엇인지와 누가 발명했는지 알려주세요.")
        
        println("
에이전트 응답:")
        println(result)
        
    } catch (e: Exception) {
        println("오류: ${e.message}")
        e.printStackTrace()
    } finally {
        println("MCP 서버 종료 중...")
        process.destroyForcibly()
    }
}
```

## 문제 해결

- **연결 문제**: 에이전트가 MCP 서버에 연결할 수 없는 경우, `npx @brightdata/mcp`를 통해 Bright Data MCP 패키지가 제대로 설치되었는지 확인하세요.
- **API 토큰 오류**: `BRIGHT_DATA_API_TOKEN`이 유효하고 웹 스크래핑에 필요한 권한이 있는지 다시 확인하세요.
- **OpenAI 인증**: `OPENAI_API_KEY` 환경 변수가 올바르게 설정되었고 API 키가 유효한지 확인하세요.
- **프로세스 시간 초과**: 서버 시작 시간이 더 오래 걸리는 경우 `Thread.sleep(2000)` 시간을 늘리세요.

## 다음 단계

- **다양한 쿼리 탐색**: 다른 웹사이트를 스크래핑하거나 다양한 주제를 검색해 보세요.
- **사용자 정의 도구 통합**: Bright Data의 웹 스크래핑 기능과 함께 고유한 도구를 추가해 보세요.
- **고급 스크래핑**: 주거용 프록시, CAPTCHA 해결, JavaScript 렌더링과 같은 Bright Data의 고급 기능을 활용해 보세요.
- **데이터 처리**: 스크래핑된 데이터를 다른 Koog 에이전트와 결합하여 분석 및 통찰력을 도출해 보세요.
- **프로덕션 배포**: 자동화된 웹 데이터 수집을 위해 이 패턴을 애플리케이션에 통합해 보세요.

## 배운 내용

이 튜토리얼에서는 다음 내용을 시연했습니다:
- Bright Data의 The Web MCP 설정 및 구성 방법
- STDIO 트랜스포트를 통해 Koog AI 에이전트를 외부 MCP 서버에 연결하는 방법
- 자연어 명령을 사용하여 AI 기반 웹 스크래핑 작업 수행
- 적절한 리소스 정리 및 오류 관리 처리
- 프로덕션 대응 웹 스크래핑 애플리케이션을 위한 코드 구조화

Koog의 AI 에이전트 기능과 Bright Data의 엔터프라이즈 웹 스크래핑 인프라의 결합은 자동화된 데이터 수집 및 분석 워크플로우를 위한 강력한 기반을 제공합니다.