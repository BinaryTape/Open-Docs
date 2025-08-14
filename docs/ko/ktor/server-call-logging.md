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

    <p>
        <b>코드 예제</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

Ktor는 [SLF4J](http://www.slf4j.org/) 라이브러리를 사용하여 애플리케이션 이벤트를 로깅하는 기능을 제공합니다. 일반적인 로깅 구성에 대해서는 [](server-logging.md) 토픽에서 알아볼 수 있습니다.

`%plugin_name%` 플러그인은 들어오는 클라이언트 요청을 로깅할 수 있도록 합니다.

## 종속성 추가 {id="add_dependencies"}

    <p>
        `%plugin_name%`을 사용하려면 빌드 스크립트에 ` %artifact_name%` 아티팩트를 포함해야 합니다.
    </p>
    

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
    

## %plugin_name% 설치 {id="install_plugin"}

    <p>
        애플리케이션에 ` %plugin_name%` 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 `install` 함수에 전달하세요. 아래 코드 스니펫은 ` %plugin_name%`을 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... `embeddedServer` 함수 호출 내.
        </li>
        <li>
            ... `Application` 클래스의 확장 함수인 명시적으로 정의된 `module` 내.
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
    

## 로깅 설정 구성 {id="configure"}

`%plugin_name%`은 여러 가지 방법으로 구성할 수 있습니다: 로깅 레벨 지정, 지정된 조건에 따른 요청 필터링, 로그 메시지 사용자 지정 등. 사용 가능한 구성 설정은 [CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html)에서 확인할 수 있습니다.

### 로깅 레벨 설정 {id="logging_level"}

기본적으로 Ktor는 `Level.INFO` 로깅 레벨을 사용합니다. 변경하려면 `level` 속성을 사용하세요:

[object Promise]

### 로그 요청 필터링 {id="filter"}

`filter` 속성을 사용하면 요청 필터링을 위한 조건을 추가할 수 있습니다. 아래 예시에서는 `/api/v1`로 이루어진 요청만 로그에 기록됩니다:

[object Promise]

### 로그 메시지 형식 사용자 지정 {id="format"}

`format` 함수를 사용하여 요청/응답과 관련된 모든 데이터를 로그에 기록할 수 있습니다. 아래 예시는 각 요청에 대한 응답 상태, 요청 HTTP 메서드 및 `User-Agent` 헤더 값을 로깅하는 방법을 보여줍니다.

[object Promise]

전체 예시는 여기에서 확인할 수 있습니다: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging).

### MDC에 호출 파라미터 넣기 {id="mdc"}

`%plugin_name%` 플러그인은 MDC (Mapped Diagnostic Context)를 지원합니다. `mdc` 함수를 사용하여 지정된 이름으로 원하는 컨텍스트 값을 MDC에 넣을 수 있습니다. 예를 들어, 아래 코드 스니펫에서는 `name` 쿼리 파라미터가 MDC에 추가됩니다:

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

`ApplicationCall` 수명 동안 추가된 값에 접근할 수 있습니다:

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")