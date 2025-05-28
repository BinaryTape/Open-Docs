[//]: # (title: Ktor Client 中的日誌記錄)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

日誌記錄 (Logging) 是一種追蹤程式運行狀況並透過記錄重要事件、錯誤或資訊性訊息來診斷問題的方法。

Ktor 提供使用 [Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging) 插件來記錄 HTTP 呼叫的功能。
此插件為不同平台提供不同的日誌記錄器 (logger) 類型。

> 在伺服器端，Ktor 提供 [Logging](server-logging.md) 插件用於應用程式日誌記錄，以及 [CallLogging](server-call-logging.md) 插件用於記錄客戶端請求。

## JVM

<snippet id="jvm-logging">
  <p>
    在 <a href="client-engines.md" anchor="jvm">JVM</a> 上，Ktor 使用 Java 的簡易日誌記錄外觀 (Simple Logging Facade for Java，簡稱 <a href="http://www.slf4j.org/">SLF4J</a>) 作為日誌記錄的抽象層。SLF4J 將日誌記錄 API 與底層的日誌記錄實作解耦，讓您可以整合最符合應用程式需求的日誌記錄框架。
    常見的選擇包括 <a href="https://logback.qos.ch/">Logback</a> 或 
    <a href="https://logging.apache.org/log4j">Log4j</a>。如果沒有提供框架，SLF4J 將預設使用無操作 (NOP) 實作，這基本上會禁用日誌記錄。
  </p>

  <p>
    要啟用日誌記錄，請包含所需 SLF4J 實作的 Artifact，例如 <a href="https://logback.qos.ch/">Logback</a>:
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
</snippet>

### Android

<p>
    在 Android 上，我們建議使用 SLF4J Android 函式庫：
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

對於 [Native 目標](client-engines.md#native)，`Logging` 插件提供了一個日誌記錄器，它將所有內容列印到標準輸出流 (`STDOUT`)。

## Multiplatform

在 [多平台專案](client-create-multiplatform-application.md) 中，您可以指定一個 [自訂日誌記錄器](#custom_logger)，例如 [Napier](https://github.com/AAkira/Napier)。

## 添加依賴項 {id="add_dependencies"}

要添加 `Logging` 插件，請將以下 Artifact 包含到您的建構腳本中：

  <var name="artifact_name" value="ktor-client-logging"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>
  <include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安裝 Logging {id="install_plugin"}

要安裝 `Logging`，請在 [客戶端配置塊](client-create-and-configure.md#configure-client) 內將其傳遞給 `install` 函數：

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

`Logging` 插件的配置由 [Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config) 類別提供。以下範例展示了一個範例配置：

`logger`
: 指定一個 Logger 實例。`Logger.DEFAULT` 使用 SLF4J 日誌記錄框架。對於 Native 目標，請將此屬性設定為 `Logger.SIMPLE`。

`level`
: 指定日誌記錄級別。`LogLevel.HEADERS` 將僅記錄請求/響應標頭。

`filter()`
: 允許您篩選與指定判斷式 (predicate) 匹配的請求的日誌訊息。在下面的範例中，只有發往 `ktor.io` 的請求才會被記錄到日誌中。

`sanitizeHeader()`
: 允許您清理敏感標頭，以避免其值出現在日誌中。在下面的範例中，`Authorization` 標頭的值在日誌記錄時將被替換為 '***'。

```kotlin
```

{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt"}

有關完整範例，請參閱 [client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)。

### 提供自訂日誌記錄器 {id="custom_logger"}

要在客戶端應用程式中使用自訂日誌記錄器，您需要建立一個 `Logger` 實例並覆寫 `log` 函數。
以下範例展示了如何使用 [Napier](https://github.com/AAkira/Napier) 函式庫來記錄 HTTP 呼叫：

```kotlin
```

{src="snippets/client-logging-napier/src/main/kotlin/com/example/Application.kt" include-symbol="main"}

有關完整範例，請參閱 [client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)。