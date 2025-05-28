[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允许你通过安装 [FreeMarker](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker) 插件，在你的应用中将 [FreeMarker 模板](https://freemarker.apache.org/) 用作视图。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 FreeMarker {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

在 `install` 块内部，你可以[配置](#configure)所需的 [TemplateLoader][freemarker_template_loading] 来加载 FreeMarker 模板。

## 配置 FreeMarker {id="configure"}
### 配置模板加载 {id="template_loading"}
要加载模板，你需要将所需的 [TemplateLoader][freemarker_template_loading] 类型赋值给 `templateLoader` 属性。例如，以下代码片段使 Ktor 能够在当前类路径下查找 `templates` 包中的模板：
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="3-5,10-14,21"}

### 在响应中发送模板 {id="use_template"}
假设你在 `resources/templates` 中有一个 `index.ftl` 模板：
```html
```
{src="snippets/freemarker/src/main/resources/templates/index.ftl"}

用户的数据模型如下所示：
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="23"}

要将模板用于指定的[路由](server-routing.md)，请按以下方式将 `FreeMarkerContent` 传递给 `call.respond` 方法：
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="16-19"}