# Koog와 OpenTelemetry: AI 에이전트 트레이싱(Tracing)하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button }

이 노트북은 Koog AI 에이전트에 OpenTelemetry 기반 트레이싱(tracing)을 추가하는 방법을 보여줍니다. 다음을 수행합니다:
- 빠른 로컬 디버깅을 위해 콘솔에 스팬(span)을 출력합니다.
- OpenTelemetry Collector로 스팬을 내보내고 Jaeger에서 확인합니다.

사전 요구 사항:
- Docker/Docker Compose 설치됨
- 환경 변수 `OPENAI_API_KEY`에 OpenAI API 키 설정됨

노트북을 실행하기 전에 로컬 OpenTelemetry 스택(Collector + Jaeger)을 시작하세요:
```bash
./docker-compose up -d
```
에이전트 실행 후, Jaeger UI를 엽니다:
- http://localhost:16686

나중에 서비스를 중지하려면:
```bash
docker-compose down
```

---

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

```

## OpenTelemetry 익스포터 구성

다음 셀에서는 다음을 수행합니다:
- Koog AIAgent 생성
- OpenTelemetry 기능(feature) 설치
- 두 개의 스팬 익스포터(span exporter) 추가:
  - 콘솔 로그를 위한 `LoggingSpanExporter`
  - http://localhost:4317 (Collector)로의 OTLP gRPC 익스포터

이는 예제 설명과 일치합니다: 로컬 디버깅을 위한 콘솔 로그와 Jaeger에서 트레이스를 보기 위한 OTLP를 사용합니다.

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        // 로컬 디버깅을 위한 콘솔 로거 추가
        addSpanExporter(LoggingSpanExporter.create())

        // OpenTelemetry collector로 트레이스 전송
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
}
```

## 에이전트 실행 및 Jaeger에서 트레이스 확인

다음 셀을 실행하여 간단한 프롬프트를 트리거합니다. 결과는 다음과 같습니다:
- `LoggingSpanExporter`가 출력하는 콘솔 스팬 로그
- 로컬 OpenTelemetry Collector로 내보내져 http://localhost:16686의 Jaeger에서 확인 가능한 트레이스

팁: 셀 실행 후 Jaeger 검색 기능을 사용하여 최근 트레이스를 찾으세요.

```kotlin
import ai.koog.agents.utils.use
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.use { agent ->
        println("Running agent with OpenTelemetry tracing...")

        val result = agent.run("Tell me a joke about programming")

        "Agent run completed with result: '$result'.
Check Jaeger UI at http://localhost:16686 to view traces"
    }
}
```

## 정리 및 문제 해결

작업을 마친 후:

- 서비스 중지:
  ```bash
  docker-compose down
  ```

- Jaeger에서 트레이스가 보이지 않는 경우:
  - 스택이 실행 중인지 확인하세요: `./docker-compose up -d`를 실행하고 시작될 때까지 몇 초간 기다립니다.
  - 포트 확인:
    - Collector (OTLP gRPC): http://localhost:4317
    - Jaeger UI: http://localhost:16686
  - 컨테이너 로그 확인: `docker-compose logs --tail=200`
  - 노트북이 실행되는 환경에 `OPENAI_API_KEY`가 설정되어 있는지 확인하세요.
  - 익스포터의 엔드포인트가 콜렉터와 일치하는지 확인하세요: `http://localhost:4317`.

- 기대되는 스팬(span) 항목:
  - Koog 에이전트 수명 주기(lifecycle)
  - LLM 요청/응답 메타데이터
  - 도구(tool) 실행 스팬 (도구를 추가한 경우)

이제 에이전트를 반복적으로 개선하면서 트레이싱 파이프라인의 변화를 관찰할 수 있습니다.