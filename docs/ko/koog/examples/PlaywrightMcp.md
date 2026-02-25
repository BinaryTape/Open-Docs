# Playwright MCP와 Koog를 사용하여 브라우저 제어하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button }

이 노트북에서는 Koog 에이전트를 Playwright의 MCP(Model Context Protocol) 서버에 연결하고, 실제 브라우저를 구동하여 jetbrains.com 열기, 쿠키 수락하기, 툴바에서 AI 섹션 클릭하기와 같은 작업을 수행하는 과정을 살펴봅니다.

재사용 및 게시가 가능한 최소한의 현실적인 에이전트 + 도구 설정을 구축하는 데 집중하여, 단순하고 재현 가능하게 구성했습니다.

```kotlin
%useLatestDescriptors
%use koog

```

## 사전 요구 사항
- 환경 변수로 설정된 OpenAI API 키: `OPENAI_API_KEY`
- PATH에서 사용 가능한 Node.js 및 npx
- `%use koog`를 통해 Koog를 사용할 수 있는 Kotlin Jupyter 노트북 환경

팁: 브라우저가 자동화 단계를 수행하는 모습을 확인하려면 Playwright MCP 서버를 헤드풀(headful) 모드로 실행하세요.

## 1) OpenAI API 키 제공
`OPENAI_API_KEY` 환경 변수에서 API 키를 읽어옵니다. 이를 통해 노트북에 보안 비밀(secrets)이 노출되지 않도록 유지합니다.

```kotlin
// 환경 변수에서 API 키 가져오기
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 2) Playwright MCP 서버 시작
`npx`를 사용하여 로컬에서 Playwright MCP 서버를 실행합니다. 기본적으로 Koog에서 연결할 수 있는 SSE 엔드포인트가 노출됩니다.

```kotlin
// npx를 통해 Playwright MCP 서버 시작
val process = ProcessBuilder(
    "npx",
    "@playwright/mcp@latest",
    "--port",
    "8931"
).start()

```

## 3) Koog에서 연결 및 에이전트 실행
OpenAI 실행기(executor)를 사용하는 최소한의 Koog `AIAgent`를 구축하고, 도구 레지스트리(tool registry)가 SSE를 통해 MCP 서버를 가리키도록 설정합니다. 그런 다음 오직 도구만을 사용하여 브라우저 작업을 완료하도록 요청합니다.

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    println("Connecting to Playwright MCP server...")
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
    )
    println("Successfully connected to Playwright MCP server")

    // 에이전트 생성
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiToken),
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = toolRegistry,
    )

    val request = "Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar"
    println("Sending request: $request")

    agent.run(
        request + ". " +
            "You can only call tools. Use the Playwright tools to complete this task."
    )
}

```

## 4) MCP 프로세스 종료
실행이 끝나면 항상 외부 프로세스를 정리하세요.

```kotlin
// Playwright MCP 프로세스 종료
println("Closing connection to Playwright MCP server")
process.destroy()

```

## 문제 해결
- 에이전트가 연결되지 않는 경우, MCP 서버가 `http://localhost:8931`에서 실행 중인지 확인하세요.
- 브라우저가 보이지 않는 경우, 시스템에 Playwright가 설치되어 있고 브라우저를 실행할 수 있는 상태인지 확인하세요.
- OpenAI에서 인증 오류가 발생하는 경우, `OPENAI_API_KEY` 환경 변수를 다시 확인하세요.

## 다음 단계
- 다른 웹사이트나 워크플로우를 시도해 보세요. MCP 서버는 풍부한 Playwright 도구 세트를 제공합니다.
- LLM 모델을 교체하거나 Koog 에이전트에 더 많은 도구를 추가해 보세요.
- 이 흐름을 앱에 통합하거나, 노트북을 문서로 게시해 보세요.