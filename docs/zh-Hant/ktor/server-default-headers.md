[//]: # (title: 預設標頭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-default-headers"/>
<var name="package_name" value="io.ktor.server.plugins.defaultheaders"/>
<var name="plugin_name" value="DefaultHeaders"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-default-headers/io.ktor.server.plugins.defaultheaders/-default-headers.html"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](%plugin_api_link%) 插件將標準的 `Server` 和 `Date` 標頭添加至每個回應中。此外，您可以提供額外的預設標頭並覆寫 `Server` 標頭。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 配置 %plugin_name% {id="configure"}
### 新增額外標頭 {id="add"}
要自訂預設標頭列表，請使用 `header(name, value)` 函數將所需標頭傳遞給 `install`。`name` 參數接受一個 `HttpHeaders` 值，例如：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
要新增自訂標頭，請將其名稱作為字串值傳遞：
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### 覆寫標頭 {id="override"}
要覆寫 `Server` 標頭，請使用對應的 `HttpHeaders` 值：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
請注意，`Date` 標頭出於性能原因被快取，並且無法透過使用 `%plugin_name%` 覆寫。