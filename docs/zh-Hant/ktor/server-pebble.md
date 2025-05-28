[//]: # (title: Pebble)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[pebble_engine_builder]: https://pebbletemplates.io/com/mitchellbosecke/pebble/PebbleEngine/Builder/

<var name="plugin_name" value="Pebble"/>
<var name="package_name" value="io.ktor.server.pebble"/>
<var name="artifact_name" value="ktor-server-pebble"/>

<tldr>
<p>
<b>必需的依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="pebble"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允許您在應用程式中，透過安裝 [Pebble](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-pebble/io.ktor.server.pebble/-pebble) 插件，將 [Pebble 模板](https://pebbletemplates.io/) 作為視圖使用。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 Pebble {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

在 `install` 區塊內，您可以 [配置](#configure) [PebbleEngine.Builder][pebble_engine_builder] 以載入 Pebble 模板。

## 配置 Pebble {id="configure"}
### 配置模板載入 {id="template_loading"}
為了載入模板，您需要使用 [PebbleEngine.Builder][pebble_engine_builder] 配置模板的載入方式。例如，以下程式碼片段使 Ktor 能夠在相對於目前類別路徑的 `templates` 套件中查找模板：

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="3-5,10-16,23"}

### 在回應中傳送模板 {id="use_template"}
假設您在 `resources/templates` 中有一個 `index.html` 模板：

```html
```
{src="snippets/pebble/src/main/resources/templates/index.html"}

使用者的資料模型如下所示：

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="25"}

為了將模板用於指定的 [路由](server-routing.md)，請以以下方式將 `PebbleContent` 傳遞給 `call.respond` 方法：

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="18-21"}