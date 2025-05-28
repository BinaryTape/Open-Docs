[//]: # (title: HSTS)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HSTS"/>
<var name="package_name" value="io.ktor.server.plugins.hsts"/>
<var name="artifact_name" value="ktor-server-hsts"/>

<tldr>
<p>
<b>所需相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-hsts"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s.html) 外掛程式根據 [RFC 6797](https://tools.ietf.org/html/rfc6797) 將所需的 _HTTP 嚴格傳輸安全性 (HTTP Strict Transport Security)_ 標頭新增到請求中。當瀏覽器收到 HSTS 策略標頭時，在指定期間內將不再嘗試透過不安全的連線連線到伺服器。

> 請注意，HSTS 策略標頭在不安全的 HTTP 連線上會被忽略。為了使 HSTS 生效，它應該透過 [安全](server-ssl.md) 的連線提供。

## 新增相依性 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 設定 %plugin_name% {id="configure"}

`%plugin_name%` 透過 [HSTSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s-config/index.html) 提供其設定。以下範例展示了如何使用 `maxAgeInSeconds` 屬性來指定客戶端應將主機保留在已知 HSTS 主機清單中的持續時間：

```kotlin
```
{src="snippets/ssl-engine-main-hsts/src/main/kotlin/com/example/Application.kt" include-lines="11-12,17"}

您也可以使用 `withHost` 為不同的主機提供不同的 HSTS 配置：

```kotlin
```
{src="snippets/ssl-engine-main-hsts/src/main/kotlin/com/example/Application.kt" include-lines="11-17"}

您可以在此找到完整範例：[ssl-engine-main-hsts](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-hsts)。