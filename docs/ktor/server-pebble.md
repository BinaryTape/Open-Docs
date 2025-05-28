[//]: # (title: Pebble)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[pebble_engine_builder]: https://pebbletemplates.io/com/mitchellbosecke/pebble/PebbleEngine/Builder/

<var name="plugin_name" value="Pebble"/>
<var name="package_name" value="io.ktor.server.pebble"/>
<var name="artifact_name" value="ktor-server-pebble"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="pebble"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允许你通过安装 [Pebble](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-pebble/io.ktor.server.pebble/-pebble) 插件，在应用程序中使用 [Pebble 模板](https://pebbletemplates.io/)作为视图。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 Pebble {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

在 `install` 块内，你可以[配置](#configure) [PebbleEngine.Builder][pebble_engine_builder] 来加载 Pebble 模板。

## 配置 Pebble {id="configure"}
### 配置模板加载 {id="template_loading"}
要加载模板，你需要使用 [PebbleEngine.Builder][pebble_engine_builder] 配置如何加载模板。例如，以下代码片段使 Ktor 能够在相对于当前类路径的 `templates` 包中查找模板：

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="3-5,10-16,23"}

### 在响应中发送模板 {id="use_template"}
假设你在 `resources/templates` 中有一个 `index.html` 模板：

```html
```
{src="snippets/pebble/src/main/resources/templates/index.html"}

一个用户的数据模型如下所示：

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="25"}

要将模板用于指定的[路由](server-routing.md)，请按以下方式将 `PebbleContent` 传递给 `call.respond` 方法：

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="18-21"}