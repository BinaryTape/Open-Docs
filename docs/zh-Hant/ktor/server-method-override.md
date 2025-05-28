[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 啟用透過 `X-HTTP-Method-Override` 標頭來傳送 HTTP 謂詞的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html) 外掛啟用透過 `X-HTTP-Method-Override` 標頭來隧道化 (tunnel) HTTP 謂詞的能力。
如果您的伺服器 API 處理多個 HTTP 謂詞 (例如 `GET`、`PUT`、`POST`、`DELETE` 等)，但由於特定限制，客戶端只能使用有限的謂詞集合 (例如 `GET` 和 `POST`)，這可能會很有用。
舉例來說，如果客戶端發送請求時將 `X-Http-Method-Override` 標頭設定為 `DELETE`，Ktor 將會使用 `delete` [路由處理器](server-routing.md#define_route)來處理此請求。

## 新增依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 設定 %plugin_name% {id="configure"}

預設情況下，`%plugin_name%` 會檢查 `X-Http-Method-Override` 標頭，以決定應處理此請求的路由。
您可以自訂標頭名稱，使用 `headerName` 屬性。

## 範例 {id="example"}

下方 HTTP 請求使用 `POST` 謂詞，並將 `X-Http-Method-Override` 標頭設定為 `DELETE`：

```http request
```
{src="snippets/json-kotlinx-method-override/post.http"}

為了處理此類請求，並使用 `delete` [路由處理器](server-routing.md#define_route)，您需要安裝 `%plugin_name%`：

```kotlin
```
{src="snippets/json-kotlinx-method-override/src/main/kotlin/com/example/Application.kt"}

您可以在此處找到完整的範例：[json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override)。