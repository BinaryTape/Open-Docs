[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>必要依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>：✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 啟用在 X-HTTP-Method-Override 標頭內建構 HTTP 方法的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html) 外掛程式啟用在 `X-HTTP-Method-Override` 標頭內建構 HTTP 方法的能力。
如果您的伺服器 API 處理多個 HTTP 方法（如 `GET`、`PUT`、`POST`、`DELETE` 等），但由於特定限制，客戶端只能使用有限的方法集（例如 `GET` 和 `POST`），那麼這可能會很有用。
例如，如果客戶端發送的請求中將 `X-Http-Method-Override` 標頭設定為 `DELETE`，Ktor 將使用 `delete` [路由處理器](server-routing.md#define_route) 來處理此請求。

## 新增依賴項 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
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
        若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中的 <code>install</code> 函式。
        以下程式碼片段展示如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函式呼叫內。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內，它是一個 <code>Application</code> 類別的擴充函式。
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
    

## 設定 %plugin_name% {id="configure"}

預設情況下，`%plugin_name%` 會檢查 `X-Http-Method-Override` 標頭，以確定應處理請求的路由。
您可以使用 `headerName` 屬性來自訂標頭名稱。

## 範例 {id="example"}

以下 HTTP 請求使用 `POST` 方法，並將 `X-Http-Method-Override` 標頭設定為 `DELETE`：

[object Promise]

若要使用 `delete` [路由處理器](server-routing.md#define_route) 處理此類請求，您需要安裝 `%plugin_name%`：

[object Promise]

您可以在此處找到完整範例：[json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override)。