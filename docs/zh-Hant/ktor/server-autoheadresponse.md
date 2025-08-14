[//]: # (title: 自動HEAD回應)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>必備依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您無需額外的執行時或虛擬機器即可執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 提供自動回應具有 GET 定義之每個路由的 HEAD 請求的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) 外掛為我們提供了自動回應每個定義了 `GET` 的路由之 `HEAD` 請求的能力。如果您需要在取得實際內容之前在客戶端處理回應，可以使用 %plugin_name% 來避免建立單獨的 [head](server-routing.md#define_route) 處理程式。例如，呼叫 [respondFile](server-responses.md#file) 函數會自動為回應新增 `Content-Length` 和 `Content-Type` 標頭，您可以在下載檔案之前在客戶端取得此資訊。

## 新增依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
    

## 用法
為了利用此功能，我們需要在應用程式中安裝 `AutoHeadResponse` 外掛。

[object Promise]

在我們的案例中，即使沒有為此動詞明確定義，`/home` 路由現在也會回應 `HEAD` 請求。

需要注意的是，如果我們正在使用此外掛，針對相同 `GET` 路由的自訂 `HEAD` 定義將會被忽略。

## 選項
%plugin_name% 不提供任何額外的配置選項。