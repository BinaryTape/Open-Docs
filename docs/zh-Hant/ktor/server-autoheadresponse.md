[//]: # (title: AutoHeadResponse)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外執行時或虛擬機器下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name% 提供自動回應具有 GET 定義的每個路由的 HEAD 請求的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) 外掛程式讓我們能夠自動回應定義了 `GET` 的每個路由的 `HEAD` 請求。如果您需要在取得實際內容之前在客戶端處理回應，可以使用 `%plugin_name%` 來避免建立單獨的 [head](server-routing.md#define_route) 處理器。例如，呼叫 [respondFile](server-responses.md#file) 函數會自動為回應新增 `Content-Length` 和 `Content-Type` 標頭，您可以在下載檔案之前在客戶端取得這些資訊。

## 新增依賴項 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
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

## 用法
為了利用此功能，我們需要在應用程式中安裝 `AutoHeadResponse` 外掛程式。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.autohead.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.main() {
    install(AutoHeadResponse)
    routing {
        get("/home") {
            call.respondText("This is a response to a GET, but HEAD also works")
        }
    }
}
```

在我們的範例中，即使沒有為此動詞明確定義，`/home` 路由現在也會回應 `HEAD` 請求。

值得注意的是，如果我們使用此外掛程式，針對相同 `GET` 路由的自訂 `HEAD` 定義將被忽略。

## 選項
`%plugin_name%` 不提供任何額外的設定選項。