[//]: # (title: Ktor 服务器中的日志记录)

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
Ktor 使用 SLF4J API 作为各种日志框架（例如 Logback 或 Log4j）的门面，允许您记录应用程序事件。
</link-summary>

Ktor 根据所使用的平台，提供了不同的方式来记录应用程序日志：

- 在 JVM 上，Ktor 使用 [SLF4J API](http://www.slf4j.org/) 作为各种日志框架（例如 [Logback](https://logback.qos.ch/) 或 [Log4j](https://logging.apache.org/log4j)）的门面，允许您记录应用程序事件。
要启用日志记录，您需要为所需框架添加[依赖项](#add_dependencies)，并提供该框架[特有的配置](#configure-logger)。
  > 您还可以安装并配置 [CallLogging](server-call-logging.md) 插件来记录客户端请求。
- 对于[原生服务器](server-native.md)，Ktor 提供了一个日志器，将所有内容打印到标准输出。

## JVM {id="jvm"}
### 添加日志器依赖项 {id="add_dependencies"}
要启用日志记录，您需要包含所需日志框架的 artifact。
例如，Logback 需要以下依赖项：

<var name="group_id" value="ch.qos.logback"/>
<var name="artifact_name" value="logback-classic"/>
<var name="version" value="logback_version"/>

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
    

要使用 Log4j，您需要添加 `org.apache.logging.log4j:log4j-core` 和 `org.apache.logging.log4j:log4j-slf4j-impl` artifact。

### 配置日志器 {id="configure-logger"}

要了解如何配置所选日志框架，请参见其文档，例如：
- [Logback 配置](http://logback.qos.ch/manual/configuration.html)
- [Log4j 配置](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例如，要配置 Logback，您需要将 `logback.xml` 文件放置到类路径的根目录（例如，在 `src/main/resources` 中）。
下面的示例展示了带有 `STDOUT` appender 的 Logback 示例配置，它将日志输出到控制台。

[object Promise]

如果您想将日志输出到文件，可以使用 `FILE` appender。

[object Promise]

您可以在此处找到完整示例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

## 原生 {id="native"}

要配置原生服务器的日志级别，
在[运行](server-run.md)应用程序时，将以下值之一赋值给 `KTOR_LOG_LEVEL` 环境变量：
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例如，_TRACE_ 级别会启用[路由追踪](server-routing.md#trace_routes)，
这有助于您确定为什么某些路由没有被执行。

## 在代码中访问日志器 {id="access_logger"}
Logger 实例由实现 [Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html) 接口的类表示。您可以使用 [Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html) 属性在 `Application` 内访问 Logger 实例。例如，下面的代码片段展示了如何在[模块](server-modules.md)内向日志添加消息。

[object Promise]

您还可以使用 `call.application.environment.log` 属性从 [ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html) 访问 Logger。

[object Promise]

## 插件和文件中的日志记录 {id="plugins_and_files"}

不建议在插件和文件中使用应用程序日志。最好为每个插件或文件使用单独的日志器。为此，您可以使用任何日志库。

对于多平台项目，您可以使用 [KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html) 类：

[object Promise]