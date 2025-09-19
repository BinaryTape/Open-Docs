# Playwright MCP 및 Koog로 브라우저 제어하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button }

이 노트북에서는 Koog 에이전트를 Playwright의 Model Context Protocol (MCP) 서버에 연결하여 실제 브라우저를 구동해 작업을 완료하는 방법을 알아봅니다. 작업 내용은 jetbrains.com을 열고, 쿠키를 수락하고, 툴바에서 AI 섹션을 클릭하는 것입니다.

간단하고 재현 가능한 방식으로 진행하며, 게시하고 재사용할 수 있는 최소한의 현실적인 에이전트 + 도구 설정을 중심으로 다룹니다.

```kotlin
%useLatestDescriptors
%use koog

```

## 사전 요구 사항
- `OPENAI_API_KEY` 환경 변수로 내보낸 OpenAI API 키
- PATH에 Node.js 및 npx 사용 가능
- `%use koog`를 통해 Koog를 사용할 수 있는 Kotlin Jupyter 노트북 환경

팁: 브라우저가 단계를 자동화하는 것을 보려면 Playwright MCP 서버를 헤드풀(headful) 모드로 실행하세요.

## 1) OpenAI API 키 제공
`OPENAI_API_KEY` 환경 변수에서 API 키를 읽어옵니다. 이렇게 하면 노트북에 비밀 정보가 노출되지 않습니다.

```kotlin
// 환경 변수에서 API 키 가져오기
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 2) Playwright MCP 서버 시작
`npx`를 사용하여 Playwright의 MCP 서버를 로컬에서 시작합니다. 기본적으로 Koog에서 연결할 수 있는 SSE 엔드포인트를 노출합니다.

```kotlin
// npx를 통해 Playwright MCP 서버 시작
val process = ProcessBuilder(
    "npx",
    "@playwright/mcp@latest",
    "--port",
    "8931"
).start()

```

## 3) Koog에서 연결하고 에이전트 실행
OpenAI Executor가 있는 최소한의 Koog `AIAgent`를 빌드하고, 해당 도구 레지스트리를 SSE를 통해 MCP 서버로 지정합니다. 그런 다음 도구를 통해서만 브라우저 작업을 완료하도록 요청합니다.

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
실행이 끝날 때 항상 외부 프로세스를 정리해야 합니다.

```kotlin
// Playwright MCP 프로세스 종료
println("Closing connection to Playwright MCP server")
process.destroy()

```

## 문제 해결
- 에이전트가 연결할 수 없다면, MCP 서버가 `http://localhost:8931`에서 실행 중인지 확인하세요.
- 브라우저가 보이지 않는다면, Playwright가 설치되어 있고 시스템에서 브라우저를 실행할 수 있는지 확인하세요.
- OpenAI에서 인증 오류가 발생하면, `OPENAI_API_KEY` 환경 변수를 다시 확인하세요.

## 다음 단계
- 다른 웹사이트나 흐름을 시도해 보세요. MCP 서버는 풍부한 Playwright 도구 세트를 노출합니다.
- LLM 모델을 교체하거나 Koog 에이전트에 도구를 더 추가해 보세요.
- 이 흐름을 앱에 통합하거나 노트북을 문서로 게시하세요.