[//]: # (title: Ktor 服务器中的日志记录)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="logging"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Ktor 使用 SLF4J API 作为各种日志框架（例如 Logback 或 Log4j）的门面，允许您记录应用程序事件。
</link-summary>

Ktor 根据所使用的平台，提供不同的方式来记录您的应用程序：

- 在 JVM 上，Ktor 使用 [SLF4J API](http://www.slf4j.org/) 作为各种日志框架（例如 [Logback](https://logback.qos.ch/) 或 [Log4j](https://logging.apache.org/log4j)）的门面，允许您记录应用程序事件。要启用日志记录，您需要为所需的框架添加[依赖项](#add_dependencies)，并提供该框架特有的[配置](#configure-logger)。
  > 您也可以安装并配置 [CallLogging](server-call-logging.md) 插件来记录客户端请求。
- 对于 [Native 服务器](server-native.md)，Ktor 提供了一个将所有内容打印到标准输出的日志器。

## JVM {id="jvm"}
### 添加日志器依赖项 {id="add_dependencies"}
要启用日志记录，您需要包含所需日志框架的 artifact。
例如，Logback 需要以下依赖项：

<var name="group_id" value="ch.qos.logback"/>
<var name="artifact_name" value="logback-classic"/>
<var name="version" value="logback_version"/>
<include from="lib.topic" element-id="add_artifact"/>

要使用 Log4j，您需要添加 `org.apache.logging.log4j:log4j-core` 和 `org.apache.logging.log4j:log4j-slf4j-impl` artifact。

### 配置日志器 {id="configure-logger"}

要了解如何配置所选日志框架，请参阅其文档，例如：
- [Logback 配置](http://logback.qos.ch/manual/configuration.html)
- [Log4j 配置](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例如，要配置 Logback，您需要将 `logback.xml` 文件放在 classpath 的根目录（例如 `src/main/resources`）中。
以下示例展示了一个带有 `STDOUT` appender 的 Logback 配置文件示例，该 appender 将日志输出到控制台。

```xml
```
{style="block" src="snippets/logging/src/main/resources/logback.xml"}

如果您想将日志输出到文件，可以使用 `FILE` appender。

```xml
```
{style="block" src="snippets/logging/src/main/resources/logback-fileAppender.xml"}

您可以在此处找到完整示例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

## Native {id="native"}

要配置 Native 服务器的日志级别，
请在[运行](server-run.md)应用程序时，将 `KTOR_LOG_LEVEL` 环境变量赋值为以下任一值：
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例如，_TRACE_ 级别会启用[路由跟踪](server-routing.md#trace_routes)，
这有助于您确定为什么某些路由未被执行。

## 在代码中访问日志器 {id="access_logger"}
Logger 实例由一个实现了 [Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html) 接口的类表示。您可以使用 [Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html) 属性在 `Application` 内部访问 Logger 实例。例如，下面的代码片段展示了如何在[模块](server-modules.md)内部将消息添加到日志中。

```kotlin
```
{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="3,11-13,35"}

您也可以使用 `call.application.environment.log` 属性从 [ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html) 访问 Logger。

```kotlin
```
{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="26-28,30,34"}

## 插件和文件中的日志记录 {id="plugins_and_files"}

不建议在插件和文件中使用应用程序日志。最好为每个插件或文件使用单独的日志器。为此，您可以使用任何日志库。

对于多平台项目，您可以使用 [KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html) 类：

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/RequestTracePlugin.kt" include-lines="1-13"}