[//]: # (title: Ktor 伺服器中的日誌記錄)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="logging"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Ktor 使用 SLF4J API 作為各種日誌框架（例如 Logback 或 Log4j）的門面，並允許您記錄應用程式事件。
</link-summary>

Ktor 根據所使用的平台提供不同的應用程式日誌記錄方式：

- 在 JVM 上，Ktor 使用 [SLF4J API](http://www.slf4j.org/) 作為各種日誌框架（例如 [Logback](https://logback.qos.ch/) 或 [Log4j](https://logging.apache.org/log4j)）的門面，並允許您記錄應用程式事件。要啟用日誌記錄，您需要為所需的框架添加[依賴項](#add_dependencies)並提供該框架特定的[配置](#configure-logger)。
  > 您還可以安裝和配置 [CallLogging](server-call-logging.md) 外掛程式 (plugin) 以記錄客戶端請求。
- 對於 [Native 伺服器](server-native.md)，Ktor 提供了一個日誌器 (logger)，它將所有內容輸出到標準輸出。

## JVM {id="jvm"}
### 添加日誌依賴項 {id="add_dependencies"}
要啟用日誌記錄，您需要包含所需日誌框架的構件 (Artifact)。
例如，Logback 需要以下依賴項：

<var name="group_id" value="ch.qos.logback"/>
<var name="artifact_name" value="logback-classic"/>
<var name="version" value="logback_version"/>
<include from="lib.topic" element-id="add_artifact"/>

要使用 Log4j，您需要添加 `org.apache.logging.log4j:log4j-core` 和 `org.apache.logging.log4j:log4j-slf4j-impl` 構件 (Artifacts)。

### 配置日誌 {id="configure-logger"}

要了解如何配置所選的日誌框架，請參閱其文件，例如：
- [Logback 配置](http://logback.qos.ch/manual/configuration.html)
- [Log4j 配置](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例如，要配置 Logback，您需要將 `logback.xml` 文件放置在類路徑 (classpath) 的根目錄中（例如，在 `src/main/resources` 中）。
下面的範例顯示了一個 Logback 配置範例，其中包含 `STDOUT` Appender，它將日誌輸出到控制台。

```xml
```
{style="block" src="snippets/logging/src/main/resources/logback.xml"}

如果您想將日誌輸出到文件，可以使用 `FILE` Appender。

```xml
```
{style="block" src="snippets/logging/src/main/resources/logback-fileAppender.xml"}

您可以在此處找到完整範例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

## Native {id="native"}

要配置 Native 伺服器的日誌級別，
請在[運行](server-run.md)應用程式時，將以下其中一個值賦予 `KTOR_LOG_LEVEL` 環境變數 (environment variable)：
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例如，_TRACE_ 級別啟用[路由追蹤](server-routing.md#trace_routes)，這有助於您確定某些路由為何未被執行。

## 在程式碼中存取日誌 {id="access_logger"}
Logger 實例 (instance) 由一個實現 [Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html) 介面 (interface) 的類別表示。您可以使用 [Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html) 屬性在 `Application` 內部存取 Logger 實例。例如，下面的程式碼片段顯示了如何在[模組](server-modules.md)中向日誌添加訊息。

```kotlin
```
{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="3,11-13,35"}

您也可以使用 `call.application.environment.log` 屬性從 [ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html) 存取 Logger。

```kotlin
```
{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="26-28,30,34"}

## 外掛程式和文件中的日誌記錄 {id="plugins_and_files"}

不建議在外掛程式和文件內部使用應用程式日誌。最好為每個外掛程式或文件使用單獨的日誌器 (logger)。為此，您可以使用任何日誌庫 (logging library)。

對於多平台專案 (multiplatform projects)，您可以使用 [KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html) 類別 (class)：

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/RequestTracePlugin.kt" include-lines="1-13"}