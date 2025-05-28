[//]: # (title: 條件式標頭)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html) 插件可避免在內容自上次請求後未改變時發送其主體。這是透過使用以下標頭實現的：
*   `Last-Modified` 回應標頭包含資源修改時間。例如，如果用戶端請求包含 `If-Modified-Since` 值，Ktor 只會在資源於指定日期後被修改時才發送完整回應。請注意，對於 [靜態檔案](server-static-content.md)，Ktor 會在 [安裝](#install_plugin) `ConditionalHeaders` 後自動附加 `Last-Modified` 標頭。
*   `Etag` 回應標頭是特定資源版本的識別符。例如，如果用戶端請求包含 `If-None-Match` 值，則當此值與 `Etag` 匹配時，Ktor 不會發送完整回應。您可以在 [配置](#configure) `ConditionalHeaders` 時指定 `Etag` 值。

## 新增依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 配置標頭 {id="configure"}

要配置 `%plugin_name%`，您需要在 `install` 區塊內呼叫 [version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html) 函數。此函數提供對給定 `ApplicationCall` 和 `OutgoingContent` 的資源版本列表的存取。您可以使用 [EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html) 和 [LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html) 類別物件指定所需的版本。

下方的程式碼片段展示如何為 CSS 新增 `Etag` 和 `Last-Modified` 標頭：
```kotlin
```
{src="snippets/conditional-headers/src/main/kotlin/com/example/Application.kt" include-lines="16-27"}

您可以在這裡找到完整範例：[conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers)。