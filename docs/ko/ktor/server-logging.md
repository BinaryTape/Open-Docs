[//]: # (title: Ktor 서버 로깅)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="logging"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Ktor는 다양한 로깅 프레임워크(예: Logback 또는 Log4j)에 대한 파사드(facade)로 SLF4J API를 사용하며, 애플리케이션 이벤트를 로깅할 수 있게 해줍니다.
</link-summary>

Ktor는 사용된 플랫폼에 따라 애플리케이션을 로깅하는 다양한 방법을 제공합니다:

- JVM에서 Ktor는 [SLF4J API](http://www.slf4j.org/)를 다양한 로깅 프레임워크(예: [Logback](https://logback.qos.ch/) 또는 [Log4j](https://logging.apache.org/log4j))에 대한 파사드(facade)로 사용하며, 애플리케이션 이벤트를 로깅할 수 있게 해줍니다.
  로깅을 활성화하려면 원하는 프레임워크에 대한 [의존성](#add_dependencies)을 추가하고 해당 프레임워크에 특정한 [설정](#configure-logger)을 제공해야 합니다.
  > 클라이언트 요청을 로깅하기 위해 [CallLogging](server-call-logging.md) 플러그인을 설치하고 설정할 수도 있습니다.
- [네이티브 서버](server-native.md)의 경우, Ktor는 모든 것을 표준 출력으로 인쇄하는 로거를 제공합니다.

## JVM {id="jvm"}
### 로거 의존성 추가 {id="add_dependencies"}
로깅을 활성화하려면 원하는 로깅 프레임워크에 대한 아티팩트를 포함해야 합니다.
예를 들어, Logback에는 다음 의존성이 필요합니다:

<var name="group_id" value="ch.qos.logback"/>
<var name="artifact_name" value="logback-classic"/>
<var name="version" value="logback_version"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                &lt;version&gt;${%version%}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

Log4j를 사용하려면 `org.apache.logging.log4j:log4j-core` 및 `org.apache.logging.log4j:log4j-slf4j-impl` 아티팩트를 추가해야 합니다.

### 로거 설정 {id="configure-logger"}

선택한 로깅 프레임워크를 설정하는 방법을 알아보려면 해당 문서를 참조하십시오. 예를 들어:
- [Logback 설정](http://logback.qos.ch/manual/configuration.html)
- [Log4j 설정](https://logging.apache.org/log4j/2.x/manual/configuration.html)

예를 들어, Logback을 설정하려면 `logback.xml` 파일을 클래스패스(classpath)의 루트(예: `src/main/resources`)에 두어야 합니다.
아래 예시는 로그를 콘솔로 출력하는 `STDOUT` 어펜더(appender)를 사용한 샘플 Logback 설정입니다.

```xml
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{YYYY-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    <root level="trace">
        <appender-ref ref="STDOUT"/>
    </root>
    <logger name="io.netty" level="INFO"/>
</configuration>
```

로그를 파일로 출력하려면 `FILE` 어펜더(appender)를 사용할 수 있습니다.

```xml
<configuration>
    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>testFile.log</file>
        <append>true</append>
        <encoder>
            <pattern>%d{YYYY-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    <root level="trace">
        <appender-ref ref="FILE"/>
    </root>
    <logger name="io.netty" level="INFO"/>
</configuration>
```

전체 예시는 여기에서 찾을 수 있습니다: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging).

## 네이티브 {id="native"}

네이티브 서버의 로깅 레벨을 설정하려면, 애플리케이션 [실행](server-run.md) 시 `KTOR_LOG_LEVEL` 환경 변수에 다음 값 중 하나를 할당하십시오:
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

예를 들어, _TRACE_ 레벨은 일부 경로가 실행되지 않는 이유를 파악하는 데 도움이 되는 [경로 추적(route tracing)](server-routing.md#trace_routes)을 활성화합니다.

## 코드에서 로거에 접근하기 {id="access_logger"}
로거 인스턴스(Logger instance)는 [Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html) 인터페이스를 구현하는 클래스로 표현됩니다. `Application` 내에서 [Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html) 속성을 사용하여 로거 인스턴스에 접근할 수 있습니다. 예를 들어, 아래 코드 스니펫은 [모듈](server-modules.md) 내에 메시지를 로그에 추가하는 방법을 보여줍니다.

```kotlin
import io.ktor.server.application.*

fun Application.module() {
    log.info("Hello from module!")
}
```

`call.application.environment.log` 속성을 사용하여 [ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html)에서 로거에 접근할 수도 있습니다.

```kotlin
routing {
    get("/api/v1") {
        call.application.environment.log.info("Hello from /api/v1!")
    }
}
```

## 플러그인 및 파일 로깅 {id="plugins_and_files"}

플러그인 및 파일 내부에서 애플리케이션 로그를 사용하는 것은 권장되지 않습니다. 각 플러그인 또는 파일에 대해 별도의 로거를 사용하는 것이 좋습니다. 이를 위해 어떤 로깅 라이브러리든 사용할 수 있습니다.

멀티플랫폼 프로젝트의 경우, [KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html) 클래스를 사용할 수 있습니다:

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.util.logging.*

internal val LOGGER = KtorSimpleLogger("com.example.RequestTracePlugin")

val RequestTracePlugin = createRouteScopedPlugin("RequestTracePlugin", { }) {
    onCall { call ->
        LOGGER.trace("Processing call: ${call.request.uri}")
    }
}