[//]: # (title: Ktor 服务器中的日志)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="logging"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Ktor 使用 SLF4J API 作为各种日志框架（例如 Logback 或 Log4j）的门面，并允许您记录应用程序事件。
</link-summary>

Ktor 根据所使用的平台，提供不同的应用程序日志记录方式：

- 在 JVM 上，Ktor 使用 [SLF4J API](http://www.slf4j.org/) 作为各种日志框架（例如 [Logback](https://logback.qos.ch/) 或 [Log4j](https://logging.apache.org/log4j)）的门面，并允许您记录应用程序事件。要启用日志记录，您需要为所需框架添加[依赖项](#add_dependencies)，并提供该框架[特有的配置](#configure-logger)。
  > 您还可以安装并配置 [CallLogging](server-call-logging.md) 插件以记录客户端请求。
- 对于[原生服务器](server-native.md)，Ktor 提供了一个记录器，它将所有内容打印到标准输出。

## JVM {id="jvm"}
### 添加记录器依赖项 {id="add_dependencies"}
要启用日志记录，您需要包含所需日志框架的 artifact。
例如，Logback 需要以下依赖项：

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

要使用 Log4j，您需要添加 `org.apache.logging.log4j:log4j-core` 和 `org.apache.logging.log4j:log4j-slf4j-impl` artifact。

### 配置记录器 {id="configure-logger"}

要了解如何配置选定的日志框架，请参见其文档，例如：
- [Logback 配置](http://logback.qos.ch/manual/configuration.html)
- [Log4j 配置](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例如，要配置 Logback，您需要将 `logback.xml` 文件放到类路径的根目录（例如，在 `src/main/resources` 中）。
以下示例展示了带 `STDOUT` 追加器的 Logback 配置示例，它将日志输出到控制台。

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

如果您想将日志输出到文件，可以使用 `FILE` 追加器。

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

您可以在此处找到完整示例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

## Native {id="native"}

要配置原生服务器的日志级别，
请在[运行](server-run.md)应用程序时将以下值之一分配给 `KTOR_LOG_LEVEL` 环境变量：
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例如，_TRACE_ 级别会启用[路由追踪](server-routing.md#trace_routes)，这有助于您确定为什么某些路由未被执行。

## 在代码中访问记录器 {id="access_logger"}
Logger 实例由实现 [Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html) 接口的类表示。您可以使用 [Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html) 属性在 `Application` 内部访问 Logger 实例。例如，以下代码片段展示了如何在[模块](server-modules.md)内部在日志中添加消息。

```kotlin
import io.ktor.server.application.*

fun Application.module() {
    log.info("Hello from module!")
}
```

您还可以使用 `call.application.environment.log` 属性从 [ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html) 访问 Logger。

```kotlin
routing {
    get("/api/v1") {
        call.application.environment.log.info("Hello from /api/v1!")
    }
}
```

## 插件和文件中的日志记录 {id="plugins_and_files"}

不推荐在插件和文件内部使用应用程序日志。最好为每个插件或文件使用独立的记录器。为此，您可以使用任何日志库。

对于多平台项目，您可以使用 [KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html) 类：

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