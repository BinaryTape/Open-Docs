[//]: # (title: 호출 로깅)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CallLogging"/>
<var name="package_name" value="io.ktor.server.plugins.calllogging"/>
<var name="artifact_name" value="ktor-server-call-logging"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="logging"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor는 [SLF4J](http://www.slf4j.org/) 라이브러리를 사용하여 애플리케이션 이벤트를 로깅하는 기능을 제공합니다. 일반 로깅 구성에 대한 자세한 내용은 [](server-logging.md) 토픽에서 확인할 수 있습니다.

`%plugin_name%` 플러그인은 들어오는 클라이언트 요청을 로깅할 수 있도록 합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 로깅 설정 구성 {id="configure"}

`%plugin_name%`은 여러 가지 방법으로 구성할 수 있습니다: 로깅 레벨 지정, 특정 조건에 따른 요청 필터링, 로그 메시지 사용자 정의 등이 가능합니다. 사용 가능한 구성 설정은 [CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html)에서 확인할 수 있습니다.

### 로깅 레벨 설정 {id="logging_level"}

기본적으로 Ktor는 `Level.INFO` 로깅 레벨을 사용합니다. 이를 변경하려면 `level` 속성을 사용하세요:

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14-15,25"}

### 로그 요청 필터링 {id="filter"}

`filter` 속성을 사용하면 요청 필터링 조건을 추가할 수 있습니다. 아래 예제에서는 `/api/v1`로 전송된 요청만 로그에 기록됩니다:

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14,16-18,25"}

### 로그 메시지 형식 사용자 정의 {id="format"}

`format` 함수를 사용하면 요청/응답과 관련된 모든 데이터를 로그에 기록할 수 있습니다. 아래 예제는 각 요청에 대한 응답 상태, 요청 HTTP 메서드, `User-Agent` 헤더 값을 로깅하는 방법을 보여줍니다.

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14,19-25"}

전체 예제는 여기에서 확인할 수 있습니다: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging).

### 호출 파라미터를 MDC에 추가 {id="mdc"}

`%plugin_name%` 플러그인은 MDC(Mapped Diagnostic Context)를 지원합니다. `mdc` 함수를 사용하여 지정된 이름으로 원하는 컨텍스트 값을 MDC에 추가할 수 있습니다. 예를 들어, 아래 코드 스니펫에서는 `name` 쿼리 파라미터가 MDC에 추가됩니다:

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

`ApplicationCall` 수명 주기 동안 추가된 값에 접근할 수 있습니다:

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")
```