[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>所需相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允許您透過安裝 [FreeMarker](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker) 外掛程式，在您的應用程式中將 [FreeMarker 模板](https://freemarker.apache.org/) 作為視圖使用。

## 新增相依性 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 FreeMarker {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

在 `install` 區塊內，您可以[設定](#configure)所需的 [TemplateLoader][freemarker_template_loading] 以載入 FreeMarker 模板。

## 設定 FreeMarker {id="configure"}
### 設定模板載入 {id="template_loading"}
要載入模板，您需要將所需的 [TemplateLoader][freemarker_template_loading] 類型指定給 `templateLoader` 屬性。例如，以下程式碼片段讓 Ktor 在目前 classpath 相對的 `templates` 套件中尋找模板：
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="3-5,10-14,21"}

### 在回應中發送模板 {id="use_template"}
假設您在 `resources/templates` 中有一個 `index.ftl` 模板：
```html
```
{src="snippets/freemarker/src/main/resources/templates/index.ftl"}

使用者的資料模型如下：
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="23"}

若要將模板用於指定的 [route](server-routing.md)，請以下列方式將 `FreeMarkerContent` 傳遞給 `call.respond` 方法：
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="16-19"}