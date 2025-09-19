# Koog를 활용한 Google 지도 MCP: Kotlin 노트북에서 처음부터 고도까지

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button }

이 짧은 블로그 스타일의 안내서에서는 Koog를 Google 지도용 Model Context Protocol (MCP) 서버에 연결할 것입니다. Docker를 사용하여 서버를 시작하고, 사용 가능한 도구를 찾아낸 다음, AI 에이전트가 주소를 지오코딩하고 해당 고도를 가져오게 할 것입니다. 이 모든 것은 Kotlin 노트북에서 이루어집니다.

이 가이드를 마치면, 워크플로 또는 문서에 쉽게 적용할 수 있는 재현 가능한 종단 간(end-to-end) 예제를 얻게 될 것입니다.

```kotlin
%useLatestDescriptors
%use koog

```

## 사전 요구 사항
아래 셀들을 실행하기 전에, 다음 사항들을 준비했는지 확인하십시오:

- Docker가 설치되어 실행 중이어야 합니다.
- 환경 변수 `GOOGLE_MAPS_API_KEY`로 내보내진 유효한 Google 지도 API 키
- `OPENAI_API_KEY`로 내보내진 OpenAI API 키

셸에서 다음과 같이 설정할 수 있습니다 (macOS/Linux 예시):

```bash
export GOOGLE_MAPS_API_KEY="<your-key>"
export OPENAI_API_KEY="<your-openai-key>"
```

```kotlin
// 환경 변수에서 API 키 가져오기
val googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY") ?: error("GOOGLE_MAPS_API_KEY environment variable not set")
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## Google 지도 MCP 서버 시작하기 (Docker)
공식 `mcp/google-maps` 이미지를 사용할 것입니다. 컨테이너는 MCP를 통해 `maps_geocode` 및 `maps_elevation`과 같은 도구들을 노출할 것입니다. API 키는 환경 변수를 통해 전달하고, 노트북이 stdio를 통해 통신할 수 있도록 연결된 상태로 시작합니다.

```kotlin
// Google 지도 MCP 서버와 함께 Docker 컨테이너 시작
val process = ProcessBuilder(
    "docker",
    "run",
    "-i",
    "-e",
    "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

```

## McpToolRegistry를 통해 도구 발견하기
Koog는 stdio를 통해 MCP 서버에 연결할 수 있습니다. 여기서는 실행 중인 프로세스로부터 도구 레지스트리(tool registry)를 생성하고, 발견된 도구들과 해당 디스크립터(descriptor)를 출력합니다.

```kotlin
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)
toolRegistry.tools.forEach {
    println(it.name)
    println(it.descriptor)
}

```

## OpenAI를 사용하여 AI 에이전트 구축하기
다음으로 OpenAI 실행자(executor)와 모델을 기반으로 하는 간단한 에이전트를 구성합니다. 이 에이전트는 방금 생성한 레지스트리를 통해 MCP 서버에서 노출된 도구들을 호출할 수 있을 것입니다.

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)

```

## 고도 요청하기: 먼저 지오코딩, 그 다음 고도
에이전트에게 뮌헨에 있는 JetBrains 사무실의 고도를 찾도록 프롬프트(prompt)합니다. 이 지시사항은 에이전트에게 사용 가능한 도구만 사용하고, 해당 작업에 어떤 도구를 선호해야 하는지 명시적으로 알려줍니다.

```kotlin
import kotlinx.coroutines.runBlocking

val request = "Get elevation of the Jetbrains Office in Munich, Germany?"
runBlocking {
    agent.run(
        request +
            "You can only call tools. Get it by calling maps_geocode and maps_elevation tools."
    )
}

```

## 정리
작업을 마쳤으면, 백그라운드에서 실행되는 것이 없도록 Docker 프로세스를 중지하십시오.

```kotlin
process.destroy()

```

## 문제 해결 및 다음 단계
- 컨테이너가 시작하지 못하면, Docker가 실행 중이고 `GOOGLE_MAPS_API_KEY`가 유효한지 확인하십시오.
- 에이전트가 도구를 호출할 수 없다면, 도구 검색 셀을 다시 실행하여 도구 레지스트리가 채워져 있는지 확인하십시오.
- 사용 가능한 Google 지도 도구를 사용하여 경로 계획 또는 장소 검색과 같은 다른 프롬프트들을 시도해 보세요.

다음으로, 여러 MCP 서버를 조합하는 것을 고려해 보세요 (예: 웹 자동화를 위한 Playwright + Google 지도). 그리고 Koog가 더 풍부한 작업을 위해 도구 사용을 오케스트레이션(orchestrate)하도록 하세요.