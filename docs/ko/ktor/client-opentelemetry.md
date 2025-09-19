[//]: # (title: Ktor 클라이언트에서 OpenTelemetry를 사용한 분산 트레이싱)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<var name="plugin_name" value="KtorClientTelemetry"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.opentelemetry.instrumentation:opentelemetry-ktor-3.0</code>
</p>
<var name="example_name" value="opentelemetry"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor는 [OpenTelemetry](https://opentelemetry.io/)와 통합됩니다. OpenTelemetry는 트레이스, 메트릭, 로그와 같은 텔레메트리 데이터를 수집하기 위한 오픈소스 가시성(observability) 프레임워크입니다. 이는 애플리케이션을 계측(instrument)하고 Grafana 또는 Jaeger와 같은 모니터링 및 가시성 도구로 데이터를 내보내는 표준적인 방법을 제공합니다.

`%plugin_name%` 플러그인은 나가는(outgoing) HTTP 요청을 자동으로 트레이스할 수 있도록 해줍니다. 이는 메서드, URL, 상태 코드와 같은 메타데이터를 캡처하고 서비스 전반에 걸쳐 트레이스 컨텍스트를 전파합니다. 또한 스팬 속성을 사용자 지정하거나 자신만의 OpenTelemetry 구성을 사용할 수 있습니다.

> 서버 측에서는 OpenTelemetry가 서버로 들어오는 HTTP 요청을 계측하기 위한 [KtorServerTelemetry](server-opentelemetry.md) 플러그인을 제공합니다.

## %plugin_name% 설치 {id="install_plugin"}

`%plugin_name%` 플러그인을 설치하려면, 이를 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부에 있는 `install` 함수에 전달하고 [구성된 `OpenTelemetry` 인스턴스](#configure-otel)를 설정합니다.

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

## 트레이싱 구성

Ktor 클라이언트가 나가는(outgoing) HTTP 호출에 대한 OpenTelemetry 스팬을 기록하고 내보내는 방식을 사용자 지정할 수 있습니다. 아래 옵션을 사용하면 어떤 요청이 트레이스되는지, 스팬 이름이 어떻게 지정되는지, 어떤 속성을 포함하는지, 어떤 헤더가 캡처되는지, 그리고 스팬 종류가 어떻게 결정되는지를 조정할 수 있습니다.

> 이러한 개념에 대한 자세한 내용은 [OpenTelemetry 트레이싱 문서](https://opentelemetry.io/docs/concepts/signals/traces/)를 참조하십시오.

### 응답 헤더 캡처

특정 HTTP 응답 헤더를 스팬 속성으로 캡처하려면 `capturedResponseHeaders` 속성을 사용하십시오:

```kotlin
install(%plugin_name%) {
    // ...
    capturedResponseHeaders(HttpHeaders.ContentType, CUSTOM_HEADER)
}
```

## 다음 단계

`%plugin_name%`을(를) 설치하고 구성했다면, [`KtorServerTelemetry`](server-opentelemetry.md)를 사용하는 서비스와 같이 텔레메트리가 활성화된 서비스로 요청을 전송하여 스팬이 생성되고 전파되는지 확인할 수 있습니다. [Jaeger](https://www.jaegertracing.io/), [Zipkin](https://zipkin.io/), [Grafana Tempo](https://grafana.com/oss/tempo/)와 같은 가시성 백엔드에서 트레이스의 양쪽 측면을 보면 분산 트레이싱이 종단 간(end-to-end)으로 작동하는 것을 확인할 수 있습니다.