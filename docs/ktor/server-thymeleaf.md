[//]: # (title: Thymeleaf)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Thymeleaf"/>
<var name="package_name" value="io.ktor.server.thymeleaf"/>
<var name="artifact_name" value="ktor-server-thymeleaf"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="thymeleaf"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允许你通过安装 [Thymeleaf](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf) 插件，在你的应用程序中使用 [Thymeleaf 模板](https://www.thymeleaf.org/) 作为视图。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 Thymeleaf {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 Thymeleaf {id="configure"}
### 配置模板加载 {id="template_loading"}
在 `install` 块中，你可以配置 `ClassLoaderTemplateResolver`。例如，下面的代码片段使 Ktor 能够在当前类路径中查找 `templates` 包下的 `*.html` 模板：
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="3,6-8,11-18,25"}

### 在响应中发送模板 {id="use_template"}
假设你在 `resources/templates` 中有一个 `index.html` 模板：
```html
```
{src="snippets/thymeleaf/src/main/resources/templates/index.html"}

用户的数据模型如下所示：
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="27"}

要将模板用于指定的 [路由](server-routing.md)，请按以下方式将 [ThymeleafContent](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html) 传递给 `call.respond` 方法：
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="20-23"}

## 示例：自动重新加载 Thymeleaf 模板 {id="auto-reload"}

下面的示例展示了如何在使用 [开发模式](server-development-mode.topic) 时自动重新加载 Thymeleaf 模板。

```kotlin
```
{src="snippets/thymeleaf-auto-reload/src/main/kotlin/com/example/Application.kt"}

你可以在此处找到完整的示例：[thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload)。