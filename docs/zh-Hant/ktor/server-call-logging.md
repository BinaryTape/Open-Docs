[//]: # (title: 呼叫日誌)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CallLogging"/>
<var name="package_name" value="io.ktor.server.plugins.calllogging"/>
<var name="artifact_name" value="ktor-server-call-logging"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="logging"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 提供使用 [SLF4J](http://www.slf4j.org/) 函式庫記錄應用程式事件的能力。您可以從 [](server-logging.md) 主題了解一般日誌組態設定。

`%plugin_name%` 外掛程式允許您記錄傳入的客戶端請求。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 組態設定日誌設定 {id="configure"}

您可以透過多種方式組態設定 `%plugin_name%`：指定日誌級別、根據指定條件篩選請求、自訂日誌訊息等等。您可以在 [CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html) 處查看可用的組態設定。

### 設定日誌級別 {id="logging_level"}

預設情況下，Ktor 使用 `Level.INFO` 日誌級別。若要變更，請使用 `level` 屬性：

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14-15,25"}

### 篩選日誌請求 {id="filter"}

`filter` 屬性允許您新增篩選請求的條件。在以下範例中，只有傳送至 `/api/v1` 的請求會被記錄到日誌中：

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14,16-18,25"}

### 自訂日誌訊息格式 {id="format"}

透過使用 `format` 函式，您可以將與請求/回應相關的任何資料放入日誌中。以下範例展示如何記錄回應狀態、請求 HTTP 方法，以及每個請求的 `User-Agent` 標頭值。

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14,19-25"}

您可以在此處找到完整範例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

### 將呼叫參數放入 MDC {id="mdc"}

`%plugin_name%` 外掛程式支援 MDC (映射診斷上下文)。您可以使用 `mdc` 函式將具有指定名稱的所需上下文值放入 MDC 中。例如，在以下程式碼片段中，`name` 查詢參數會被新增到 MDC 中：

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

您可以在 `ApplicationCall` 的生命週期中存取新增的值：

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")
```