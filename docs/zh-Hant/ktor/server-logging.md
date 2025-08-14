[//]: # (title: Ktor 伺服器日誌)

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
Ktor 使用 SLF4J API 作為各種日誌記錄框架（例如 Logback 或 Log4j）的 facade，並讓您記錄應用程式事件。
</link-summary>

Ktor 根據所使用的平台，提供了不同的方式來記錄您的應用程式：

- 在 JVM 上，Ktor 使用 [SLF4J API](http://www.slf4j.org/) 作為各種日誌記錄框架（例如 [Logback](https://logback.qos.ch/) 或 [Log4j](https://logging.apache.org/log4j)）的 facade，並讓您記錄應用程式事件。要啟用日誌記錄，您需要為所需的框架新增 [依賴項](#add_dependencies) 並提供此框架特定的 [組態](#configure-logger)。
  > 您也可以安裝並組態 [CallLogging](server-call-logging.md) 插件以記錄客戶端請求。
- 對於 [Native 伺服器](server-native.md)，Ktor 提供了一個日誌記錄器，它將所有內容列印到標準輸出。

## JVM {id="jvm"}
### 新增日誌記錄器依賴項 {id="add_dependencies"}
要啟用日誌記錄，您需要包含所需日誌記錄框架的 artifact。
例如，Logback 需要以下依賴項：

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
    

要使用 Log4j，您需要新增 `org.apache.logging.log4j:log4j-core` 和 `org.apache.logging.log4j:log4j-slf4j-impl` artifact。

### 組態日誌記錄器 {id="configure-logger"}

要了解如何組態所選的日誌記錄框架，請參閱其文件，例如：
- [Logback 組態](http://logback.qos.ch/manual/configuration.html)
- [Log4j 組態](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例如，要組態 Logback，您需要將 `logback.xml` 檔案放在 classpath 的根目錄（例如，在 `src/main/resources` 中）。
下面的範例顯示了一個使用 `STDOUT` 附加器的 Logback 範例組態，它將日誌輸出到控制台。

[object Promise]

如果您想將日誌輸出到檔案，可以使用 `FILE` 附加器。

[object Promise]

您可以在此處找到完整的範例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

## Native {id="native"}

要組態 Native 伺服器的日誌記錄層級，
請在 [執行](server-run.md) 應用程式時，將以下值之一指派給 `KTOR_LOG_LEVEL` 環境變數：
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例如，_TRACE_ 層級會啟用 [路由追蹤](server-routing.md#trace_routes)，這有助於您確定某些路由未被執行的原因。

## 在程式碼中存取日誌記錄器 {id="access_logger"}
Logger 實例由實作 [Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html) 介面的類別表示。您可以使用 [Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html) 屬性在 `Application` 內部存取 Logger 實例。例如，下面的程式碼片段展示了如何在 [模組](server-modules.md) 內部新增訊息到日誌中。

[object Promise]

您也可以使用 `call.application.environment.log` 屬性從 [ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html) 存取 Logger。

[object Promise]

## 插件與檔案中的日誌記錄 {id="plugins_and_files"}

不建議在插件和檔案內部使用應用程式日誌。最好為每個插件或檔案使用單獨的日誌記錄器。為此，您可以使用任何日誌記錄函式庫。

對於多平台專案，您可以使用 [KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html) 類別：

[object Promise]