[//]: # (title: 自動 HEAD 回應)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 提供自動回應 HEAD 請求的能力，適用於每個已定義 GET 的路由。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) 插件提供我們自動回應 `HEAD` 請求的能力，適用於每個已定義 `GET` 的路由。如果您需要在取得實際內容之前，在客戶端上對回應進行某些處理，您可以使用 `%plugin_name%` 來避免為 [head](server-routing.md#define_route) 處理器創建單獨的定義。例如，呼叫 [respondFile](server-responses.md#file) 函數會自動將 `Content-Length` 和 `Content-Type` 標頭添加到回應中，您可以在下載檔案之前，在客戶端上取得這些資訊。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 用法
為了利用這項功能，我們需要在應用程式中安裝 `AutoHeadResponse` 插件。

```kotlin
```
{src="snippets/autohead/src/main/kotlin/com/example/Application.kt" include-lines="3-15"}

在我們的案例中，`/home` 路由現在會回應 `HEAD` 請求，即使沒有為此動詞進行明確定義。

值得注意的是，如果我們正在使用此插件，針對相同 `GET` 路由的自訂 `HEAD` 定義將會被忽略。

## 選項
`%plugin_name%` 未提供任何額外的配置選項。