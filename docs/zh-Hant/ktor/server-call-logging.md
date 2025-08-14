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

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links> 支援</b>: ✖️
    </p>
    
</tldr>

Ktor 支援使用 [SLF4J](http://www.slf4j.org/) 函式庫記錄應用程式事件。您可以從 [](server-logging.md) 主題了解一般日誌配置。

`%plugin_name%` 外掛程式允許您記錄傳入的用戶端請求。

## 新增依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置指令碼中包含 <code>%artifact_name%</code> 構件：
    </p>
    

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
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>至應用程式，
        請在指定的 <Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links> 中將其傳遞給 <code>install</code> 函式。
        以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函式呼叫內。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內，其為 <code>Application</code> 類別的擴展函式。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 配置日誌設定 {id="configure"}

您可以透過多種方式配置 `%plugin_name%`：指定日誌級別、根據指定條件篩選請求、自訂日誌訊息等等。您可以在 [CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html) 查看可用的配置設定。

### 設定日誌級別 {id="logging_level"}

預設情況下，Ktor 使用 `Level.INFO` 日誌級別。若要變更，請使用 `level` 屬性：

[object Promise]

### 篩選日誌請求 {id="filter"}

`filter` 屬性允許您新增篩選請求的條件。在下面的範例中，只有發送到 `/api/v1` 的請求會被記錄到日誌中：

[object Promise]

### 自訂日誌訊息格式 {id="format"}

透過使用 `format` 函式，您可以將與請求/回應相關的任何資料放入日誌中。以下範例展示了如何記錄回應狀態、請求 HTTP 方法，以及每個請求的 `User-Agent` 標頭值。

[object Promise]

您可以在此處找到完整的範例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

### 將呼叫參數放入 MDC {id="mdc"}

`%plugin_name%` 外掛程式支援 MDC (Mapped Diagnostic Context)。您可以使用 `mdc` 函式將具有指定名稱的所需上下文值放入 MDC。例如，在下面的程式碼片段中，`name` 查詢參數被新增到 MDC：

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

您可以在 `ApplicationCall` 的生命週期內存取新增的值：

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")