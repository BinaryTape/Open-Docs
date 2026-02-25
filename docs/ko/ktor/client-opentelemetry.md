[//]: # (title: Ktor Client에서 OpenTelemetry를 이용한 분산 추적)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<var name="plugin_name" value="KtorClientTelemetry"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.opentelemetry.instrumentation:opentelemetry-ktor-3.0</code>
</p>
<var name="example_name" value="opentelemetry"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor는 추적(trace), 메트릭(metric), 로그(log)와 같은 텔레메트리 데이터를 수집하기 위한 오픈 소스 관측 가능성(observability) 프레임워크인 [OpenTelemetry](https://opentelemetry.io/)와 통합됩니다. OpenTelemetry는 애플리케이션을 계측(instrument)하고 Grafana나 Jaeger와 같은 모니터링 및 관측 가능성 도구로 데이터를 내보내는 표준 방식을 제공합니다.

`%plugin_name%` 플러그인을 사용하면 나가는(outgoing) HTTP 요청을 자동으로 추적할 수 있습니다. 이 플러그인은 메서드, URL, 상태 코드와 같은 메타데이터를 캡처하고 서비스 간에 추적 컨텍스트를 전파합니다. 또한 스팬(span) 속성을 사용자 정의하거나 자체 OpenTelemetry 구성을 사용할 수도 있습니다.

> 서버 측에서 OpenTelemetry는 서버로 들어오는 HTTP 요청을 계측하기 위한 [KtorServerTelemetry](server-opentelemetry.md) 플러그인을 제공합니다.

undefined
undefined

## %plugin_name% 설치 {id="install_plugin"}

`%plugin_name%` 플러그인을 설치하려면, [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 전달하고 [구성된 `OpenTelemetry` 인스턴스](#configure-otel)를 설정하십시오:

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...

val client = HttpClient(CIO) {
    val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-client")

    install(%plugin_name%) {
        setOpenTelemetry(openTelemetry)
    }
}
```

## 추적 구성

Ktor 클라이언트가 나가는 HTTP 호출에 대해 OpenTelemetry 스팬을 기록하고 내보내는 방식을 사용자 정의할 수 있습니다. 아래 옵션을 사용하여 어떤 요청을 추적할지, 스팬의 이름은 어떻게 지정할지, 어떤 속성을 포함할지, 어떤 헤더를 캡처할지, 스팬 종류(kind)를 어떻게 결정할지 조정할 수 있습니다.

> 이러한 개념에 대한 자세한 내용은 [OpenTelemetry 추적 문서](https://opentelemetry.io/docs/concepts/signals/traces/)를 참조하십시오.

undefined
undefined

### 응답 헤더 캡처

특정 HTTP 응답 헤더를 스팬 속성으로 캡처하려면 `capturedResponseHeaders` 속성을 사용하십시오:

```kotlin
install(%plugin_name%) {
    // ...
    capturedResponseHeaders(HttpHeaders.ContentType, CUSTOM_HEADER)
}
```

undefined

## 다음 단계

`%plugin_name%`을 설치하고 구성한 후에는, [`KtorServerTelemetry`](server-opentelemetry.md)를 사용하는 서비스와 같이 텔레메트리가 활성화된 서비스로 요청을 보내 스팬이 생성되고 전파되는지 확인할 수 있습니다. [Jaeger](https://www.jaegertracing.io/), [Zipkin](https://zipkin.io/) 또는 [Grafana Tempo](https://grafana.com/oss/tempo/)와 같은 관측 가능성 백엔드에서 추적의 양쪽 측면을 모두 확인하면 분산 추적이 종단 간(end-to-end)으로 작동하고 있음을 확인할 수 있습니다.