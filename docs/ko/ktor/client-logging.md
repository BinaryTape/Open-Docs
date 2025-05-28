[//]: # (title: Ktor 클라이언트에서의 로깅)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

로깅은 프로그램의 작동 상황을 추적하고, 중요한 이벤트, 오류 또는 정보 메시지를 기록하여 문제를 진단하는 방법입니다.

Ktor는 [Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging) 플러그인을 사용하여 HTTP 호출을 로깅하는 기능을 제공합니다.
이 플러그인은 다양한 플랫폼에 맞는 여러 로거 유형을 제공합니다.

> 서버에서 Ktor는 애플리케이션 로깅을 위한 [Logging](server-logging.md) 플러그인과 클라이언트 요청 로깅을 위한 [CallLogging](server-call-logging.md) 플러그인을 제공합니다.

## JVM

<snippet id="jvm-logging">
  <p>
    <a href="client-engines.md" anchor="jvm">JVM</a>에서 Ktor는 로깅을 위한 추상화 계층으로 SLF4J (Simple Logging Facade for Java, <a href="http://www.slf4j.org/">SLF4J</a>)를 사용합니다. SLF4J는 로깅 API를 기본 로깅 구현과 분리하여 애플리케이션의 요구사항에 가장 적합한 로깅 프레임워크를 통합할 수 있도록 합니다. 일반적인 선택지로는 <a href="https://logback.qos.ch/">Logback</a> 또는 <a href="https://logging.apache.org/log4j">Log4j</a>가 있습니다. 프레임워크가 제공되지 않으면 SLF4J는 기본적으로 아무 작업도 하지 않는 (NOP) 구현을 사용하며, 이는 사실상 로깅을 비활성화합니다.
  </p>

  <p>
    로깅을 활성화하려면 <a href="https://logback.qos.ch/">Logback</a>과 같이 필요한 SLF4J 구현이 포함된 아티팩트를 추가하세요:
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
</snippet>

### Android

<p>
    Android에서는 SLF4J Android 라이브러리 사용을 권장합니다:
</p>
 <var name="group_id" value="org.slf4j"/>
  <var name="artifact_name" value="slf4j-android"/>
  <var name="version" value="slf4j_version"/>
<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin">
            implementation("%group_id%:%artifact_name%:$%version%")
        </code-block>
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy">
            implementation "%group_id%:%artifact_name%:$%version%"
        </code-block>
    </tab>
</tabs>

## Native

[Native 대상](client-engines.md#native)의 경우, `Logging` 플러그인은 모든 것을 표준 출력 스트림 (`STDOUT`)으로 출력하는 로거를 제공합니다.

## 멀티플랫폼

[멀티플랫폼 프로젝트](client-create-multiplatform-application.md)에서는 [Napier](https://github.com/AAkira/Napier)와 같은 [커스텀 로거](#custom_logger)를 지정할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

`Logging` 플러그인을 추가하려면 빌드 스크립트에 다음 아티팩트를 포함하세요:

  <var name="artifact_name" value="ktor-client-logging"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>
  <include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## Logging 설치 {id="install_plugin"}

`Logging`을 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내의 `install` 함수에 전달하세요:

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
//...
val client = HttpClient(CIO) {
    install(Logging)
}
```

## Logging 구성 {id="configure_plugin"}

`Logging` 플러그인 구성은 [Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config) 클래스에 의해 제공됩니다. 아래 예제는 샘플 구성을 보여줍니다:

`logger`
: 로거 인스턴스를 지정합니다. `Logger.DEFAULT`는 SLF4J 로깅 프레임워크를 사용합니다. Native 대상의 경우 이 속성을 `Logger.SIMPLE`로 설정합니다.

`level`
: 로깅 레벨을 지정합니다. `LogLevel.HEADERS`는 요청/응답 헤더만 로깅합니다.

`filter()`
: 지정된 조건자와 일치하는 요청에 대한 로그 메시지를 필터링할 수 있습니다. 아래 예제에서는 `ktor.io`로 전송된 요청만 로그에 기록됩니다.

`sanitizeHeader()`
: 민감한 헤더를 위생 처리하여 해당 값이 로그에 나타나지 않도록 할 수 있습니다. 아래 예제에서 `Authorization` 헤더 값은 로깅 시 '***'로 대체됩니다.

```kotlin
```

{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt"}

전체 예제는 [client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)을 참조하세요.

### 커스텀 로거 제공 {id="custom_logger"}

클라이언트 애플리케이션에서 커스텀 로거를 사용하려면 `Logger` 인스턴스를 생성하고 `log` 함수를 재정의해야 합니다. 아래 예제는 [Napier](https://github.com/AAkira/Napier) 라이브러리를 사용하여 HTTP 호출을 로깅하는 방법을 보여줍니다:

```kotlin
```

{src="snippets/client-logging-napier/src/main/kotlin/com/example/Application.kt" include-symbol="main"}

전체 예제는 [client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)를 참조하세요.