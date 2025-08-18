[//]: # (title: Ktor 伺服器中的日誌記錄)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="logging"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Ktor 使用 SLF4J API 作為各種日誌框架（例如 Logback 或 Log4j）的門面，讓您能夠記錄應用程式事件。
</link-summary>

Ktor 根據所使用的平台，提供不同的方式來記錄您的應用程式：

- 在 JVM 上，Ktor 使用 [SLF4J API](http://www.slf4j.org/) 作為各種日誌框架（例如 [Logback](https://logback.qos.ch/) 或 [Log4j](https://logging.apache.org/log4j)）的門面，讓您能夠記錄應用程式事件。若要啟用日誌記錄，您需要為所需的框架[添加依賴項](#add_dependencies)並提供該框架專屬的[配置](#configure-logger)。
  > 您也可以安裝並配置 [CallLogging](server-call-logging.md) 插件來記錄客戶端請求。
- 對於 [Native 伺服器](server-native.md)，Ktor 提供一個日誌記錄器，會將所有內容列印到標準輸出。

## JVM {id="jvm"}
### 添加日誌記錄器依賴項 {id="add_dependencies"}
若要啟用日誌記錄，您需要包含所需日誌框架的構件 (artifacts)。
例如，Logback 需要以下依賴項：

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

若要使用 Log4j，您需要添加 `org.apache.logging.log4j:log4j-core` 和 `org.apache.logging.log4j:log4j-slf4j-impl` 構件。

### 配置日誌記錄器 {id="configure-logger"}

若要了解如何配置所選的日誌框架，請參閱其文件，例如：
- [Logback 配置](http://logback.qos.ch/manual/configuration.html)
- [Log4j 配置](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例如，若要配置 Logback，您需要將 `logback.xml` 檔案放置在類路徑的根目錄下（例如，在 `src/main/resources` 中）。
下方的範例顯示一個帶有 `STDOUT` appender 的 Logback 配置範例，它會將日誌輸出到控制台。

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

如果您想將日誌輸出到檔案，可以使用 `FILE` appender。

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

您可以在此處找到完整範例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

## Native {id="native"}

若要配置 Native 伺服器的日誌級別，請在[運行](server-run.md)應用程式時，將以下值之一賦給 `KTOR_LOG_LEVEL` 環境變數：
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例如，_TRACE_ 級別會啟用[路由追蹤](server-routing.md#trace_routes)，這有助於您確定為什麼某些路由沒有被執行。

## 在程式碼中訪問日誌記錄器 {id="access_logger"}
Logger 實例由一個實現 [Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html) 介面的類別表示。您可以使用 [Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html) 屬性在 `Application` 內部訪問 Logger 實例。例如，下方的程式碼片段顯示如何在 [模組](server-modules.md) 內部添加訊息到日誌。

```kotlin
import io.ktor.server.application.*

fun Application.module() {
    log.info("Hello from module!")
}
```

您也可以使用 `call.application.environment.log` 屬性從 [ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html) 訪問 Logger。

```kotlin
routing {
    get("/api/v1") {
        call.application.environment.log.info("Hello from /api/v1!")
    }
}
```

## 插件和檔案中的日誌記錄 {id="plugins_and_files"}

不建議在插件和檔案內部使用應用程式日誌。最好為每個插件或檔案使用單獨的日誌記錄器。為此，您可以使用任何日誌庫。

對於多平台專案，您可以使用 [KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html) 類別：

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
```