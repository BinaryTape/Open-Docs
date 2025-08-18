[//]: # (title: Ktor 客户端中的日志记录)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

日志记录是一种通过记录重要事件、错误或信息性消息来跟踪程序运行状况和诊断问题的方式。

Ktor 提供了使用 [Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging) 插件记录 HTTP 调用的能力。
此插件为不同的平台提供了不同的 Logger 类型。

> 在服务器端，Ktor 提供了用于应用程序日志记录的 [Logging](server-logging.md) 插件和用于记录客户端请求的 [CallLogging](server-call-logging.md) 插件。

## JVM

<snippet id="jvm-logging">
  <p>
    在 <a href="#jvm">JVM</a> 上，Ktor 使用用于 Java 的简单日志门面
    (<a href="http://www.slf4j.org/">SLF4J</a>) 作为日志记录的抽象层。SLF4J 将日志记录 API 与底层日志记录实现解耦，
    使你能够集成最符合你的应用程序需求的日志框架。
    常见的选择包括 <a href="https://logback.qos.ch/">Logback</a> 或
    <a href="https://logging.apache.org/log4j">Log4j</a>。如果没有提供任何框架，SLF4J 将默认为无操作 (NOP) 实现，这会实质上禁用
    日志记录。
  </p>

  <p>
    要启用日志记录，请包含一个包含所需 SLF4J 实现的构件，例如 <a href="https://logback.qos.ch/">Logback</a>：
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>
</snippet>

### Android

<p>
    在 Android 上，我们建议使用 SLF4J Android 库：
</p>
 <var name="group_id" value="org.slf4j"/>
  <var name="artifact_name" value="slf4j-android"/>
  <var name="version" value="slf4j_version"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
    </TabItem>
</Tabs>

## Native

对于 [原生目标平台](client-engines.md#native)，`Logging` 插件提供了一个 Logger，它将所有内容打印到标准输出流 (`STDOUT`)。

## Multiplatform

在 [多平台项目](client-create-multiplatform-application.md) 中，你可以指定一个 [自定义 Logger](#custom_logger)，例如 [Napier](https://github.com/AAkira/Napier)。

## 添加依赖项 {id="add_dependencies"}

要添加 `Logging` 插件，请在你的构建脚本中包含以下构件：

  <var name="artifact_name" value="ktor-client-logging"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>
  <p>
      你可以通过 <Links href="/ktor/client-dependencies" summary="了解如何向现有项目添加客户端依赖项。">添加客户端依赖项</Links> 了解更多关于 Ktor 客户端所需构件的信息。
  </p>

## 安装 Logging {id="install_plugin"}

要安装 `Logging`，请在 [客户端配置块](client-create-and-configure.md#configure-client) 内将其传递给 `install` 函数：

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

[Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config) 类提供了 `Logging` 插件的配置。以下示例展示了一个配置示例：

`logger`
: 指定一个 Logger 实例。`Logger.DEFAULT` 使用 SLF4J 日志框架。对于原生目标平台，将此属性设置为 `Logger.SIMPLE`。

`level`
: 指定日志记录级别。`LogLevel.HEADERS` 将只记录请求/响应头部。

`filter()`
: 允许你过滤与指定谓词匹配的请求的日志消息。在以下示例中，只有对 `ktor.io` 发出的请求才会记录到日志中。

`sanitizeHeader()`
: 允许你净化敏感头部，以避免其值出现在日志中。在以下示例中，`Authorization` 头部的值在记录时将被替换为 '***'。

```kotlin
package com.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val client = HttpClient(CIO) {
            install(Logging) {
                logger = Logger.DEFAULT
                level = LogLevel.HEADERS
                filter { request ->
                    request.url.host.contains("ktor.io")
                }
                sanitizeHeader { header -> header == HttpHeaders.Authorization }
            }
        }

        val response1: HttpResponse = client.get("https://ktor.io/")
        val response2: HttpResponse = client.get("https://jetbrains.com/")
    }
}
```

有关完整示例，请参见 [client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)。

### 提供自定义 Logger {id="custom_logger"}

要在客户端应用程序中使用自定义 Logger，你需要创建一个 `Logger` 实例并覆盖 `log` 函数。
以下示例展示了如何使用 [Napier](https://github.com/AAkira/Napier) 库记录 HTTP 调用：

```kotlin
package com.example

import io.github.aakira.napier.DebugAntilog
import io.github.aakira.napier.Napier
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val client = HttpClient(CIO) {
            install(Logging) {
                logger = object: Logger {
                    override fun log(message: String) {
                        Napier.v("HTTP Client", null, message)
                    }
                }
                level = LogLevel.HEADERS
            }
        }.also { Napier.base(DebugAntilog()) }

        val response: HttpResponse = client.get("https://ktor.io/")
    }
}

```

有关完整示例，请参见 [client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)。