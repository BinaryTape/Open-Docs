[//]: # (title: Ktor 客户端中的日志)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

日志记录是一种通过记录重要事件、错误或信息性消息来跟踪程序运行情况和诊断问题的方式。

Ktor 提供了使用 [Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging) 插件记录 HTTP 调用的能力。
此插件为不同的平台提供了不同的日志器类型。

> 在服务器端，Ktor 提供了用于应用程序日志记录的 [Logging](server-logging.md) 插件和用于记录客户端请求的 [CallLogging](server-call-logging.md) 插件。

## JVM

<snippet id="jvm-logging">
  <p>
    在 <a href="#jvm">JVM</a> 上，Ktor 使用 Simple Logging Facade for Java (<a href="http://www.slf4j.org/">SLF4J</a>) 作为日志记录的抽象层。SLF4J 将日志 API 与底层日志实现解耦，使你能够集成最适合你的应用程序需求的日志框架。
    常见选择包括 <a href="https://logback.qos.ch/">Logback</a> 或 
    <a href="https://logging.apache.org/log4j">Log4j</a>。如果未提供框架，SLF4J 将默认使用空操作 (NOP) 实现，这相当于禁用日志记录。
  </p>

  <p>
    要启用日志记录，请包含一个带有所需 SLF4J 实现的构件，例如 <a href="https://logback.qos.ch/">Logback</a>:
  </p>
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
    
</snippet>

### Android

<p>
    在 Android 上，我们推荐使用 SLF4J Android 库:
</p>
 <var name="group_id" value="org.slf4j"/>
  <var name="artifact_name" value="slf4j-android"/>
  <var name="version" value="slf4j_version"/>
<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
</tabs>

## Native

对于 [Native 目标平台](client-engines.md#native)，`Logging` 插件提供了一个日志器，它将所有内容输出到标准输出流 (`STDOUT`)。

## 多平台

在 [多平台项目](client-create-multiplatform-application.md) 中，你可以指定一个 [自定义日志器](#custom_logger)，例如 [Napier](https://github.com/AAkira/Napier)。

## 添加依赖项 {id="add_dependencies"}

要添加 `Logging` 插件，请在你的构建脚本中包含以下构件：

  <var name="artifact_name" value="ktor-client-logging"/>
  
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
    
  
    <p>
        关于 Ktor 客户端所需的构件，请参见 <Links href="/ktor/client-dependencies" summary="了解如何将客户端依赖项添加到现有项目。">添加客户端依赖项</Links>。
    </p>
    

## 安装 Logging {id="install_plugin"}

要安装 `Logging`，请将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 中的 `install` 函数：

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

`Logging` 插件的配置由 [Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config) 类提供。下面的示例展示了一个示例配置：

`logger`
: 指定一个 Logger 实例。`Logger.DEFAULT` 使用 SLF4J 日志框架。对于 Native 目标平台，将此属性设置为 `Logger.SIMPLE`。

`level`
: 指定日志级别。`LogLevel.HEADERS` 将仅记录请求/响应头。

`filter()`
: 允许你过滤匹配指定谓词的请求的日志消息。在下面的示例中，只有对 `ktor.io` 发出的请求才会进入日志。

`sanitizeHeader()`
: 允许你清理敏感头，以避免其值出现在日志中。在下面的示例中，`Authorization` 头值在记录时将被替换为 '***'。

[object Promise]

关于完整示例，请参见 [client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)。

### 提供自定义日志器 {id="custom_logger"}

要在你的客户端应用程序中使用自定义日志器，你需要创建一个 `Logger` 实例并覆盖 `log` 函数。
下面的示例展示了如何使用 [Napier](https://github.com/AAkira/Napier) 库来记录 HTTP 调用：

[object Promise]

关于完整示例，请参见 [client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)。