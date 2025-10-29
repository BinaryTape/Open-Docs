[//]: # (title: 呼叫記錄)

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
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，讓您無需額外的執行階段或虛擬機器即可執行伺服器。">原生伺服器</Links>支援</b>: ✖️
</p>
</tldr>

Ktor 提供了使用 [SLF4J](http://www.slf4j.org/) 函式庫記錄應用程式事件的功能。您可以從 [Ktor 伺服器中的記錄](server-logging.md) 主題了解一般的記錄組態。

%plugin_name% 外掛程式允許您記錄傳入的客戶端請求。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置指令碼中包含 <code>%artifact_name%</code> artifact：
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函式。
    以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函式呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴充函式。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 設定記錄選項 {id="configure"}

您可以透過多種方式設定 %plugin_name%：指定記錄級別、根據指定條件篩選請求、自訂記錄訊息等等。您可以在 [CallLoggingConfig](https://api.ktor.io/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html) 查看可用的組態設定。

### 設定記錄級別 {id="logging_level"}

預設情況下，Ktor 使用 `Level.INFO` 記錄級別。若要更改它，請使用 `level` 屬性：

```kotlin
install(CallLogging) {
    level = Level.INFO
}
```

### 篩選記錄請求 {id="filter"}

<code>filter</code> 屬性允許您新增用於篩選請求的條件。在下面的範例中，只有發往 `/api/v1` 的請求會被記錄：

```kotlin
install(CallLogging) {
    filter { call ->
        call.request.path().startsWith("/api/v1")
    }
}
```

### 自訂記錄訊息格式 {id="format"}

透過使用 <code>format</code> 函式，您可以將與請求/回應相關的任何資料放入記錄中。下面的範例展示了如何記錄回應狀態、請求 HTTP 方法以及每個請求的 <code>User-Agent</code> 標頭值。

```kotlin
install(CallLogging) {
    format { call ->
        val status = call.response.status()
        val httpMethod = call.request.httpMethod.value
        val userAgent = call.request.headers["User-Agent"]
        "Status: $status, HTTP method: $httpMethod, User agent: $userAgent"
    }
}
```

您可以在此處找到完整範例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

### 將呼叫參數放入 MDC {id="mdc"}

%plugin_name% 外掛程式支援 MDC (Mapped Diagnostic Context)。您可以使用 <code>mdc</code> 函式將具有指定名稱的所需上下文值放入 MDC。例如，在下面的程式碼片段中，一個 <code>name</code> 查詢參數被新增到 MDC：

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

您可以在 <code>ApplicationCall</code> 的生命週期中存取新增的值：

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")