[//]: # (title: Mustache)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允许你通过安装 [Mustache](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache) 插件，在你的应用程序中使用 [Mustache 模板](https://github.com/spullara/mustache.java) 作为视图。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 Mustache {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

在 `install` 代码块中，你可以[配置](#template_loading) [MustacheFactory][mustache_factory] 以加载 Mustache 模板。

## 配置 Mustache {id="configure"}
### 配置模板加载 {id="template_loading"}
为了加载模板，你需要将 [MustacheFactory][mustache_factory] 赋值给 `mustacheFactory` 属性。例如，以下代码片段让 Ktor 能够从当前类路径中相对于 `templates` 包查找模板：
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="3-6,11-15,22"}

### 在响应中发送模板 {id="use_template"}
假设你在 `resources/templates` 中有一个 `index.hbs` 模板：
```html
```
{src="snippets/mustache/src/main/resources/templates/index.hbs"}

用户的数据模型如下所示：
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="24"}

若要将模板用于指定的[路由](server-routing.md)，请通过以下方式将 `MustacheContent` 传递给 `call.respond` 方法：
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="17-20"}