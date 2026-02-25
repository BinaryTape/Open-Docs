# Koog를 활용한 Google Maps MCP: Kotlin Notebook에서 지점 고도 측정까지

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button }

이 짧은 블로그 스타일의 가이드를 통해 Koog를 Google Maps용 Model Context Protocol(MCP) 서버에 연결하는 방법을 알아보겠습니다. Docker로 서버를 실행하고, 사용 가능한 도구를 탐색하며, AI 에이전트(Agent)가 주소를 지오코딩(Geocode)하고 고도(Elevation)를 가져오도록 할 것입니다. 이 모든 과정은 Kotlin Notebook 내에서 이루어집니다.

이 가이드를 마치면 워크플로나 문서에 바로 적용할 수 있는 재현 가능한 엔드 투 엔드(End-to-end) 예제를 갖게 될 것입니다.

```kotlin
%useLatestDescriptors
%use koog

```

## 사전 준비 사항
아래 셀을 실행하기 전에 다음 사항을 확인하세요.

- Docker가 설치되어 실행 중이어야 합니다.
- 유효한 Google Maps API 키가 환경 변수 `GOOGLE_MAPS_API_KEY`로 설정되어 있어야 합니다.
- OpenAI API 키가 `OPENAI_API_KEY`로 설정되어 있어야 합니다.

셸(macOS/Linux 예시)에서 다음과 같이 설정할 수 있습니다.

```bash
export GOOGLE_MAPS_API_KEY="<your-key>"
export OPENAI_API_KEY="<your-openai-key>"
```

```kotlin
// 환경 변수에서 API 키 가져오기
val googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY") ?: error("GOOGLE_MAPS_API_KEY 환경 변수가 설정되지 않았습니다")
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다")

```

## Google Maps MCP 서버 시작 (Docker)
공식 `mcp/google-maps` 이미지를 사용합니다. 이 컨테이너는 MCP를 통해 `maps_geocode` 및 `maps_elevation`과 같은 도구를 노출합니다. 환경 변수를 통해 API 키를 전달하고, Notebook이 표준 입출력(stdio)을 통해 통신할 수 있도록 프로세스를 실행합니다.

```kotlin
// Google Maps MCP 서버와 함께 Docker 컨테이너 시작
val process = ProcessBuilder(
    "docker",
    "run",
    "-i",
    "-e",
    "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

```

## McpToolRegistry를 통한 도구 탐색
Koog는 stdio를 통해 MCP 서버에 연결할 수 있습니다. 여기서는 실행 중인 프로세스로부터 도구 레지스트리(Tool Registry)를 생성하고, 탐색된 도구들과 해당 디스크립터(Descriptor)를 출력합니다.

```kotlin
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)
toolRegistry.tools.forEach {
    println(it.name)
    println(it.descriptor)
}

```

## OpenAI를 이용한 AI 에이전트 구축
다음으로 OpenAI 실행기(Executor)와 모델을 기반으로 하는 간단한 에이전트를 구성합니다. 이 에이전트는 방금 생성한 레지스트리를 통해 MCP 서버가 노출한 도구들을 호출할 수 있습니다.

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)

```

## 고도 요청: 지오코딩 후 고도 측정
에이전트에게 독일 뮌헨에 있는 JetBrains 사무실의 고도를 찾으라고 요청합니다. 지침을 통해 에이전트가 사용 가능한 도구만 사용하도록 하고, 해당 작업에 어떤 도구를 선호해야 하는지 명시적으로 알려줍니다.

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
작업이 끝나면 백그라운드에서 실행 중인 항목이 남지 않도록 Docker 프로세스를 중지합니다.

```kotlin
process.destroy()

```

## 문제 해결 및 다음 단계
- 컨테이너 시작에 실패하면 Docker가 실행 중인지, `GOOGLE_MAPS_API_KEY`가 유효한지 확인하세요.
- 에이전트가 도구를 호출할 수 없는 경우, 도구 탐색 셀을 다시 실행하여 도구 레지스트리가 채워졌는지 확인하세요.
- 사용 가능한 Google Maps 도구를 사용하여 경로 계획이나 장소 검색과 같은 다른 프롬프트를 시도해 보세요.

다음 단계로, 여러 MCP 서버(예: 웹 자동화를 위한 Playwright + Google Maps)를 조합하고 Koog가 더 풍부한 작업을 위해 도구 사용을 조율(Orchestrate)하도록 구성해 보세요.