[//]: # (title: Micrometer 메트릭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[micrometer_jvm_metrics]: https://micrometer.io/docs/ref/jvm

<var name="package_name" value="io.ktor.server.metrics.micrometer"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-metrics-micrometer</code>
</p>
<var name="example_name" value="micrometer-metrics"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 해줍니다.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

<link-summary>MicrometerMetrics 플러그인은 Ktor 서버 애플리케이션에서 Micrometer 메트릭을 활성화하고 Prometheus, JMX, Elastic 등 필요한 모니터링 시스템을 선택할 수 있도록 합니다.</link-summary>

[MicrometerMetrics](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics) 플러그인은 Ktor 서버 애플리케이션에서 [Micrometer](https://micrometer.io/docs) 메트릭을 활성화하고 Prometheus, JMX, Elastic 등 필요한 모니터링 시스템을 선택할 수 있도록 합니다. 기본적으로 Ktor는 HTTP 요청 모니터링을 위한 메트릭과 [JVM 모니터링][micrometer_jvm_metrics]을 위한 저수준 메트릭 세트를 노출합니다. 이러한 메트릭을 사용자 정의하거나 새로운 메트릭을 생성할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`MicrometerMetrics`를 활성화하려면 빌드 스크립트에 다음 아티팩트를 포함해야 합니다:
*   `ktor-server-metrics-micrometer` 의존성을 추가합니다:

  <var name="artifact_name" value="ktor-server-metrics-micrometer"/>
  
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
  
*   모니터링 시스템에 필요한 의존성을 추가합니다. 아래 예시는 Prometheus용 아티팩트를 추가하는 방법을 보여줍니다:

  <var name="group_id" value="io.micrometer"/>
  <var name="artifact_name" value="micrometer-registry-prometheus"/>
  <var name="version" value="prometheus_version"/>
  
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
  
  `$prometheus_version`을 `micrometer-registry-prometheus` 아티팩트의 필요한 버전으로 바꿀 수 있습니다. 예를 들어, `%prometheus_version%`와 같이 사용합니다.

## MicrometerMetrics 설치 {id="install_plugin"}

<var name="plugin_name" value="MicrometerMetrics"/>

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈은 경로를 그룹화하여 애플리케이션을 구조화할 수 있게 합니다.">모듈</Links>의 <code>install</code> 함수에 전달하면 됩니다.
        아래 코드 스니펫은 <code>%plugin_name%</code>을 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내부에.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부에.
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

### 노출된 메트릭 {id="ktor_metrics"}
Ktor는 HTTP 요청 모니터링을 위해 다음 메트릭을 노출합니다:
*   `ktor.http.server.requests.active`: 동시 HTTP 요청 수를 세는 [게이지](https://micrometer.io/docs/concepts#_gauges)입니다. 이 메트릭은 태그를 제공하지 않습니다.
*   `ktor.http.server.requests`: 각 요청의 시간을 측정하는 [타이머](https://micrometer.io/docs/concepts#_timers)입니다. 이 메트릭은 요청된 URL에 대한 `address`, HTTP 메서드에 대한 `method`, 요청을 처리하는 Ktor 경로에 대한 `route` 등 요청 데이터를 모니터링하기 위한 태그 세트를 제공합니다.

`metricName` [구성](#configure_metrics) 속성을 사용하여 기본 `ktor.http.server.requests` 접두사를 사용자 정의할 수 있습니다.

> 구성된 모니터링 시스템에 따라 메트릭 이름이 [다를](https://micrometer.io/docs/concepts#_naming_meters) 수 있습니다.

HTTP 메트릭 외에도 Ktor는 [JVM 모니터링](#jvm_metrics)을 위한 메트릭 세트를 노출합니다.

## 레지스트리 생성 {id="create_registry"}

`MicrometerMetrics`를 설치한 후, [모니터링 시스템용 레지스트리](https://micrometer.io/docs/concepts#_registry)를 생성하고 이를 `registry` 속성에 할당해야 합니다. 아래 예시에서 `PrometheusMeterRegistry`는 여러 [경로 핸들러](server-routing.md)에서 이 레지스트리를 재사용할 수 있도록 `install` 블록 외부에 생성됩니다:

[object Promise]

## 메트릭 구성 {id="configure_metrics"}

`MicrometerMetrics` 플러그인은 [MicrometerMetricsConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics-config/index.html)를 사용하여 접근할 수 있는 다양한 구성 옵션을 제공합니다.

### 타이머 {id="timers"}
각 타이머에 대한 태그를 사용자 정의하려면 각 요청마다 호출되는 `timers` 함수를 사용할 수 있습니다:
```kotlin
install(MicrometerMetrics) {
    // ...
    timers { call, exception ->
        tag("region", call.request.headers["regionId"])
    }
}
```

### 분포 통계 {id="distribution_statistics"}
`distributionStatisticConfig` 속성을 사용하여 [분포 통계](https://micrometer.io/docs/concepts#_configuring_distribution_statistics)를 구성할 수 있습니다. 예를 들면 다음과 같습니다:

[object Promise]

### JVM 및 시스템 메트릭 {id="jvm_metrics"}
[HTTP 메트릭](#ktor_metrics) 외에도 Ktor는 [JVM 모니터링][micrometer_jvm_metrics]을 위한 메트릭 세트를 노출합니다. 예를 들어, `meterBinders` 속성을 사용하여 이러한 메트릭 목록을 사용자 정의할 수 있습니다:

[object Promise]

이러한 메트릭을 완전히 비활성화하려면 빈 목록을 할당할 수도 있습니다.

## Prometheus: 스크랩 엔드포인트 노출 {id="prometheus_endpoint"}
Prometheus를 모니터링 시스템으로 사용하는 경우, Prometheus 스크래퍼에 HTTP 엔드포인트를 노출해야 합니다. Ktor에서는 다음 방식으로 이를 수행할 수 있습니다:
1.  필요한 주소(아래 예시에서는 `/metrics`)로 GET 요청을 허용하는 전용 [경로](server-routing.md)를 생성합니다.
2.  `call.respond`를 사용하여 스크래핑 데이터를 Prometheus로 보냅니다.

   [object Promise]

   전체 예시는 여기에서 찾을 수 있습니다: [micrometer-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/micrometer-metrics).