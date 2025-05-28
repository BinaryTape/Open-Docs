[//]: # (title: Ktor Client 中的日志记录)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

日志记录是一种通过记录重要事件、错误或信息性消息来跟踪程序正在做什么以及诊断问题的方式。

Ktor 提供了使用 [Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging) 插件来记录 HTTP 调用的功能。
此插件为不同平台提供了不同类型的日志器。

> 在服务器端，Ktor 提供了用于应用程序日志记录的 [Logging](server-logging.md) 插件和用于记录客户端请求的 [CallLogging](server-call-logging.md) 插件。

## JVM

<snippet id="jvm-logging">
  <p>
    在 <a href="client-engines.md" anchor="jvm">JVM</a> 上，Ktor 使用 Java 简单日志门面 (<a href="http://www.slf4j.org/">SLF4J</a>) 作为日志记录的抽象层。SLF4J 将日志 API 与底层日志实现分离，
    允许你集成最适合应用程序需求的日志框架。
    常见的选择包括 <a href="https://logback.qos.ch/">Logback</a> 或
    <a href="https://logging.apache.org/log4j">Log4j</a>。如果没有提供任何框架，SLF4J 将默认使用
    无操作 (NOP) 实现，这实际上会禁用日志记录。
  </p>

  <p>
    要启用日志记录，请包含具有所需 SLF4J 实现的构件，例如 <a href="https://logback.qos.ch/">Logback</a>：
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
</snippet>

### Android

<p>
    在 Android 上，我们建议使用 SLF4J Android 库：
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

对于 [Native 目标](client-engines.md#native)，`Logging` 插件提供了一个将所有内容打印到标准输出流 (`STDOUT`) 的日志器。

## Multiplatform

在 [多平台项目](client-create-multiplatform-application.md) 中，你可以指定一个[自定义日志器](#custom_logger)，例如 [Napier](https://github.com/AAkira/Napier)。

## 添加依赖项 {id="add_dependencies"}

要添加 `Logging` 插件，请将以下构件包含到你的构建脚本中：

  <var name="artifact_name" value="ktor-client-logging"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>
  <include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安装 Logging {id="install_plugin"}

要安装 `Logging`，请在[客户端配置块](client-create-and-configure.md#configure-client)中将其传递给 `install` 函数：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
//...
val client = HttpClient(CIO) {
    install(Logging)
}
```

## 配置 Logging {id="configure_plugin"}

`Logging` 插件的配置由 [Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config) 类提供。以下示例展示了一个示例配置：

`logger`
: 指定一个 `Logger` 实例。`Logger.DEFAULT` 使用 SLF4J 日志框架。对于 Native 目标，将此属性设置为 `Logger.SIMPLE`。

`level`
: 指定日志级别。`LogLevel.HEADERS` 将仅记录请求/响应头。

`filter()`
: 允许你根据指定的谓词过滤请求的日志消息。在下面的示例中，只有发送到 `ktor.io` 的请求才会进入日志。

`sanitizeHeader()`
: 允许你净化敏感头，以避免其值出现在日志中。在下面的示例中，`Authorization` 头的记录值将被替换为 '***'。

```kotlin
```

{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt"}

有关完整示例，请参见 [client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)。

### 提供自定义日志器 {id="custom_logger"}

要在你的客户端应用程序中使用自定义日志器，你需要创建一个 `Logger` 实例并重写 `log` 函数。
以下示例展示了如何使用 [Napier](https://github.com/AAkira/Napier) 库来记录 HTTP 调用：

```kotlin
```

{src="snippets/client-logging-napier/src/main/kotlin/com/example/Application.kt" include-symbol="main"}

有关完整示例，请参见 [client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)。