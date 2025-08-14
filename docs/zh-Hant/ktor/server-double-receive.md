[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="double-receive"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在不需額外執行時或虛擬機器下執行伺服器。">原生伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-double-receive/io.ktor.server.plugins.doublereceive/-double-receive.html) 插件提供多次[接收請求主體](server-requests.md#body_contents)的能力，而不會拋出 `RequestAlreadyConsumedException` 異常。當某個[插件](server-plugins.md)已消費請求主體時，這可能很有用，如此一來您便無法在路由處理器內部接收它。例如，您可以使用 `%plugin_name%` 透過 [CallLogging](server-call-logging.md) 插件記錄請求主體，然後在 `post` [路由處理器](server-routing.md#define_route)內部再次接收主體。

> `%plugin_name%` 插件使用實驗性 API，預計在未來更新中會演變，並可能引入破壞性變更。
>
{type="note"}

## 新增依賴 {id="add_dependencies"}

    <p>
        若要使用 `%plugin_name%`，您需要在建置腳本中包含 `%artifact_name%` 構件：
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
        若要將 `%plugin_name%` 插件<a href="#install">安裝</a>到應用程式，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過將路由分組來組織應用程式結構。">模組</Links>中的 `install` 函數。
        以下程式碼片段展示了如何安裝 `%plugin_name%` ...
    </p>
    <list>
        <li>
            ... 在 `embeddedServer` 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 `module` 內部，它是一個 `Application` 類別的擴展函數。
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
    

    <p>
        `%plugin_name%` 插件也可以<a href="#install-route">安裝到特定路由</a>。
        如果您需要針對不同的應用程式資源使用不同的 `%plugin_name%` 配置，這可能很有用。
    </p>
    

安裝 `%plugin_name%` 後，您可以多次[接收請求主體](server-requests.md#body_contents)，每次調用都返回相同的實例。例如，您可以透過 [CallLogging](server-call-logging.md) 插件啟用請求主體的日誌記錄...

[object Promise]

... 然後在路由處理器內部再次獲取請求主體。

[object Promise]

您可以在此處找到完整範例：[double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive)。

## 配置 %plugin_name% {id="configure"}
使用預設配置，`%plugin_name%` 提供以下類型[接收請求主體](server-requests.md#body_contents)的能力：

- `ByteArray` 
- `String`
- `Parameters` 
- 由 `ContentNegotiation` 插件使用的[資料類別](server-serialization.md#create_data_class)

預設情況下，`%plugin_name%` 不支援：

- 從同一個請求接收不同類型；
- 接收[串流或通道](server-requests.md#raw)。

如果您不需要從同一個請求接收不同類型或接收串流或通道，請將 `cacheRawRequest` 屬性設置為 `false`：

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}
```