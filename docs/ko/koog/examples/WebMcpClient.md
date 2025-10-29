# Bright Data와 Koog의 The Web MCP를 이용한 웹 스크래핑

[:material-github: GitHub에서 열기](https://github.com/JetBrains/koog/blob/develop/examples/bright-data-mcp/){ .md-button .md-button--primary }
[:material-download: .kt 다운로드](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/bright-data-mcp/Main.kt){ .md-button }

이 튜토리얼에서는 Koog 에이전트를 Bright Data의 Web MCP 서버에 연결하여 웹 스크래핑 및 데이터 수집 작업을 수행하도록 합니다. Model Context Protocol(모델 컨텍스트 프로토콜)을 통해 Bright Data의 강력한 웹 스크래핑 인프라를 사용하여 Koog.ai에 대한 정보를 검색하는 방법을 시연하겠습니다.

우리는 간단하고 재현 가능하도록 유지하며, 자신만의 웹 스크래핑 요구 사항에 맞게 조정할 수 있는 최소한의 현실적인 에이전트 + 도구 설정에 초점을 맞출 것입니다.

## 사전 요구 사항

-   환경 변수로 내보낸 OpenAI API 키: `OPENAI_API_KEY`
-   환경 변수로 내보낸 Bright Data API 토큰: `BRIGHT_DATA_API_TOKEN`
-   PATH에 `Node.js` 및 `npx` 설치
-   Koog 종속성이 포함된 Kotlin 개발 환경

**팁**: Bright Data MCP 서버는 복잡한 웹사이트, CAPTCHA, 봇 방지 조치를 처리할 수 있는 엔터프라이즈급 웹 스크래핑 도구에 대한 액세스를 제공합니다.

## 1) API 자격 증명 설정

보안을 유지하고 코드에 민감한 정보가 노출되지 않도록 두 API 키를 모두 환경 변수에서 읽어옵니다.

```kotlin
// Get API keys from environment variables
val openAIApiKey = System.getenv("OPENAI_API_KEY")
    ?: error("OPENAI_API_KEY environment variable is not set")
val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
    ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")
```

## 2) Bright Data의 The Web MCP 서버 시작

`npx`를 사용하여 Bright Data의 MCP 서버를 시작하고 API 토큰으로 구성합니다. 이 서버는 Model Context Protocol을 통해 웹 스크래핑 기능을 노출할 것입니다.

```kotlin
println("Starting Bright Data MCP server...")

// Start the Bright Data MCP server as a separate process
val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

// Set the API_TOKEN environment variable for the MCP server process
val environment = processBuilder.environment()
environment["API_TOKEN"] = brightDataToken

// Start the process
val process = processBuilder.start()

// Give the process a moment to start
Thread.sleep(2000)
```

## 3) Koog에서 연결하여 에이전트 생성

OpenAI 실행기(executor)를 사용하는 Koog `AIAgent`를 구축하고, 해당 도구 레지스트리를 STDIO 전송을 통해 Bright Data MCP 서버에 연결합니다. 그런 다음 사용 가능한 도구를 탐색하고 웹 스크래핑 작업을 실행할 것입니다.

```kotlin
println("Creating STDIO transport...")
try {
    // Create the STDIO transport
    val transport = McpToolRegistryProvider.defaultStdioTransport(process)
    
    println("Creating tool registry...")
    
    // Create a tool registry with tools from the Bright Data MCP server
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "bright-data-client",
        version = "1.0.0"
    )
    
    // Print available tools (optional - for debugging)
    println("Available tools from Bright Data MCP server:")
    toolRegistry.tools.forEach { tool ->
        println("- ${tool.name}")
    }
    
    // Create the agent with MCP tools
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiKey),
        systemPrompt = "당신은 Bright Data의 웹 스크래핑 및 데이터 수집 도구에 접근할 수 있는 유용한 비서입니다. 웹사이트에서 정보를 수집하고, 웹 데이터를 분석하며, 통찰력을 제공하여 사용자를 도울 수 있습니다.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = toolRegistry,
        maxIterations = 100
    )
    
    val result = agent.run("Koog.ai를 검색하여 그것이 무엇이고 누가 발명했는지 알려주세요.")
    
    println("
에이전트 응답:")
    println(result)
    
} catch (e: Exception) {
    println("오류: ${e.message}")
    e.printStackTrace()
} finally {
    println("MCP 서버를 종료합니다...")
    process.destroyForcibly()
}
```

## 4) 전체 코드 예시

다음은 Bright Data의 The Web MCP를 사용한 웹 스크래핑을 보여주는 완전한 작동 예시입니다.

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
 * 웹 스크래핑 도구와 상호 작용하기 위한 AI 에이전트를 정의합니다. 다음 주요 작업을 시연합니다:
 *
 * 1. 적절한 API 토큰 구성으로 서브프로세스를 사용하여 Bright Data MCP 서버를 시작합니다.
 * 2. STDIO 전송 통신을 통해 MCP 서버에서 도구 레지스트리를 구성합니다.
 * 3. 웹 스크래핑 기능을 갖춘 OpenAI의 GPT-4o 모델을 활용하는 AI 에이전트를 생성합니다.
 * 4. 지정된 작업(예: Koog.ai에 대한 웹 콘텐츠 검색 및 분석)을 수행하도록 에이전트를 실행합니다.
 * 5. 실행 후 MCP 서버 프로세스를 종료하여 정리합니다.
 *
 * 이 함수는 웹 데이터 수집 및 분석을 위해 MCP(Model Context Protocol) 서버를 AI 에이전트와
 * 통합하는 방법을 시연하는 튜토리얼 목적으로 사용됩니다. OPENAI_API_KEY 및 BRIGHT_DATA_API_TOKEN
 * 환경 변수가 설정되어 있어야 합니다.
 */
fun main() = runBlocking {
    // Get API keys from environment variables
    val openAIApiKey = System.getenv("OPENAI_API_KEY")
        ?: error("OPENAI_API_KEY environment variable is not set")
    val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
        ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")

    println("Bright Data MCP 서버를 시작합니다...")

    // Start the Bright Data MCP server as a separate process
    val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

    // Set the API_TOKEN environment variable for the MCP server process
    val environment = processBuilder.environment()
    environment["API_TOKEN"] = brightDataToken

    // Start the process
    val process = processBuilder.start()

    // Give the process a moment to start
    Thread.sleep(2000)

    println("STDIO 전송을 생성합니다...")

    try {
        // Create the STDIO transport
        val transport = McpToolRegistryProvider.defaultStdioTransport(process)
        
        println("도구 레지스트리를 생성합니다...")
        
        // Create a tool registry with tools from the Bright Data MCP server
        val toolRegistry = McpToolRegistryProvider.fromTransport(
            transport = transport,
            name = "bright-data-client",
            version = "1.0.0"
        )
        
        // Print available tools (optional - for debugging)
        println("Bright Data MCP 서버에서 사용 가능한 도구:")
        toolRegistry.tools.forEach { tool ->
            println("- ${tool.name}")
        }
        
        // Create the agent with MCP tools
        val agent = AIAgent(
            executor = simpleOpenAIExecutor(openAIApiKey),
            systemPrompt = "당신은 Bright Data의 웹 스크래핑 및 데이터 수집 도구에 접근할 수 있는 유용한 비서입니다. 웹사이트에서 정보를 수집하고, 웹 데이터를 분석하며, 통찰력을 제공하여 사용자를 도울 수 있습니다.",
            llmModel = OpenAIModels.Chat.GPT4o,
            temperature = 0.7,
            toolRegistry = toolRegistry,
            maxIterations = 100
        )
        
        val result = agent.run("Koog.ai를 검색하여 그것이 무엇이고 누가 발명했는지 알려주세요.")
        
        println("
에이전트 응답:")
        println(result)
        
    } catch (e: Exception) {
        println("오류: ${e.message}")
        e.printStackTrace()
    } finally {
        println("MCP 서버를 종료합니다...")
        process.destroyForcibly()
    }
}
```

## 문제 해결

-   **연결 문제**: 에이전트가 MCP 서버에 연결할 수 없는 경우, `npx @brightdata/mcp`를 통해 Bright Data MCP 패키지가 올바르게 설치되었는지 확인하세요.
-   **API 토큰 오류**: `BRIGHT_DATA_API_TOKEN`이 유효하고 웹 스크래핑에 필요한 권한을 가지고 있는지 다시 확인하세요.
-   **OpenAI 인증**: `OPENAI_API_KEY` 환경 변수가 올바르게 설정되었고 API 키가 유효한지 확인하세요.
-   **프로세스 시간 초과**: 서버 시작에 더 오랜 시간이 걸리면 `Thread.sleep(2000)`의 지속 시간을 늘리세요.

## 다음 단계

-   **다양한 쿼리 탐색**: 다른 웹사이트를 스크래핑하거나 다양한 주제를 검색해 보세요.
-   **사용자 지정 도구 통합**: Bright Data의 웹 스크래핑 기능과 함께 자신만의 도구를 추가해 보세요.
-   **고급 스크래핑**: 주거용 프록시, CAPTCHA 해결, JavaScript 렌더링과 같은 Bright Data의 고급 기능을 활용해 보세요.
-   **데이터 처리**: 스크래핑된 데이터를 다른 Koog 에이전트와 결합하여 분석 및 통찰력을 얻으세요.
-   **프로덕션 배포**: 자동화된 웹 데이터 수집을 위해 이 패턴을 애플리케이션에 통합하세요.

## 학습한 내용

이 튜토리얼은 다음 방법을 시연했습니다:
-   Bright Data의 The Web MCP 설정 및 구성
-   STDIO 전송을 통해 Koog AI 에이전트를 외부 MCP 서버에 연결
-   자연어 지침을 사용하여 AI 기반 웹 스크래핑 작업 수행
-   적절한 리소스 정리 및 오류 관리 처리
-   프로덕션 준비 웹 스크래핑 애플리케이션을 위한 코드 구조화

Koog의 AI 에이전트 기능과 Bright Data의 엔터프라이즈 웹 스크래핑 인프라의 조합은 자동화된 데이터 수집 및 분석 워크플로를 위한 강력한 기반을 제공합니다.