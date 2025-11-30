# Koog와 OpenTelemetry: AI 에이전트 트레이싱

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button }

이 노트북은 OpenTelemetry 기반 트레이싱(tracing)을 Koog AI 에이전트에 추가하는 방법을 보여줍니다. 다음 내용을 다룰 것입니다:
- 빠른 로컬 디버깅을 위해 콘솔로 스팬(span)을 내보냅니다.
- OpenTelemetry Collector로 스팬을 내보내고 Jaeger에서 확인합니다.

사전 요구 사항:
- Docker/Docker Compose 설치됨
- 환경 변수 `OPENAI_API_KEY`에 OpenAI API 키 사용 가능

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

다음 셀에서 다음을 수행합니다:
- Koog AIAgent 생성
- OpenTelemetry 기능 설치
- 두 개의 스팬 익스포터(exporter) 추가:
  - 콘솔 로그용 `LoggingSpanExporter`
  - `http://localhost:4317` (Collector)로 OTLP gRPC 익스포터

이는 예제 설명과 일치합니다: 로컬 디버깅을 위한 콘솔 로그와 Jaeger에서 트레이스를 확인하기 위한 OTLP.

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        // 로컬 디버깅을 위한 콘솔 로거 추가
        addSpanExporter(LoggingSpanExporter.create())

        // OpenTelemetry 콜렉터로 트레이스 전송
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
}
```

## 에이전트 실행 및 Jaeger에서 트레이스 확인

다음 셀을 실행하여 간단한 프롬프트를 트리거(trigger)합니다. 다음 내용을 확인할 수 있습니다:
- `LoggingSpanExporter`에서 오는 콘솔 스팬 로그
- 로컬 OpenTelemetry Collector로 내보내진 트레이스, `http://localhost:16686`의 Jaeger에서 확인 가능

팁: 셀을 실행한 후 Jaeger 검색 기능을 사용하여 최근 트레이스를 찾으세요.

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

완료되면:

- 서비스 중지:
  ```bash
  docker-compose down
  ```

- Jaeger에서 트레이스가 보이지 않는 경우:
  - 스택이 실행 중인지 확인하세요: `./docker-compose up -d`를 실행하고 몇 초 기다리세요.
  - 포트 확인:
    - Collector (OTLP gRPC): http://localhost:4317
    - Jaeger UI: http://localhost:16686
  - 컨테이너 로그 확인: `docker-compose logs --tail=200`
  - 노트북이 실행되는 환경에서 `OPENAI_API_KEY`가 설정되었는지 확인하세요.
  - 익스포터의 엔드포인트(endpoint)가 콜렉터(collector)와 일치하는지 확인하세요: `http://localhost:4317`.

- 예상되는 스팬:
  - Koog 에이전트 수명 주기
  - LLM 요청/응답 메타데이터
  - 모든 도구 실행 스팬 (도구를 추가하는 경우)

이제 에이전트를 반복적으로 개선하며 트레이싱 파이프라인(pipeline)의 변경 사항을 관찰할 수 있습니다.