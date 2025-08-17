[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="double-receive"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外執行環境或虛擬機器下執行伺服器。">原生伺服器</Links>支援</b>：✅
</p>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-double-receive/io.ktor.server.plugins.doublereceive/-double-receive.html) 外掛提供多次[接收請求主體](server-requests.md#body_contents)的能力，且不會拋出 `RequestAlreadyConsumedException` 例外。如果某個[外掛](server-plugins.md)已經消耗了請求主體，導致您無法在路由處理器中接收它，這可能就很有用。例如，您可以使用 `%plugin_name%` 透過 [CallLogging](server-call-logging.md) 外掛來記錄請求主體，然後在 `post` [路由處理器](server-routing.md#define_route)內部再次接收主體。

> `%plugin_name%` 外掛使用實驗性 API，預計在未來的更新中會演進，並可能導致破壞性變更。
>
{type="note"}

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 `%plugin_name%`，您需要在建置腳本中納入 `%artifact_name%` artifact：
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
    若要將 `%plugin_name%` 外掛[安裝](#install)到應用程式，
    請將其傳遞給指定[模組](<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>)中的 `install` 函式。
    下方的程式碼片段展示了如何安裝 `%plugin_name%` ...
</p>
<list>
    <li>
        ... 在 `embeddedServer` 函式呼叫內。
    </li>
    <li>
        ... 在明確定義的 `module` 內，該 `module` 是 `Application` 類別的一個擴充函式。
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
<p>
    `%plugin_name%` 外掛也可以[安裝](#install-route)到特定的路由。
    如果您需要為不同的應用程式資源設定不同的 `%plugin_name%` 配置，這可能很有用。
</p>

安裝 `%plugin_name%` 後，您可以多次[接收請求主體](server-requests.md#body_contents)，並且每次呼叫都返回相同的實例。
例如，您可以使用 [CallLogging](server-call-logging.md) 外掛啟用請求主體的日誌記錄...

```kotlin
install(CallLogging) {
    level = Level.TRACE
    format { call ->
        runBlocking {
            "Body: ${call.receiveText()}"
        }
    }
}
```

... 然後在路由處理器內部再次取得請求主體。

```kotlin
post("/") {
    val receivedText = call.receiveText()
    call.respondText("Text '$receivedText' is received")
}
```

您可以在此處找到完整範例：[double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive)。

## 配置 %plugin_name% {id="configure"}
在預設配置下，`%plugin_name%` 提供將[請求主體](server-requests.md#body_contents)接收為以下類型的能力：

- `ByteArray` 
- `String`
- `Parameters` 
- 由 `ContentNegotiation` 外掛使用的[資料類別](server-serialization.md#create_data_class)

依預設，`%plugin_name%` 不支援：

- 從同一個請求接收不同類型；
- 接收[流或通道](server-requests.md#raw)。

如果您不需要從同一個請求接收不同類型，或不需要接收流或通道，請將 `cacheRawRequest` 屬性設定為 `false`：

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}
```