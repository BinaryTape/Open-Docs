[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="jte"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允许你通过安装 [%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-jte/io.ktor.server.jte/-jte.html) 插件，在你的应用程序中将 [JTE 模板](https://github.com/casid/jte) 用作视图。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> 为了处理 `.kte` 文件，你需要将 `gg.jte:jte-kotlin` artifact 添加到你的项目中。

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

在 `install` 代码块中，你可以[配置](#configure)如何加载 JTE 模板。

## 配置 %plugin_name% {id="configure"}
### 配置模板加载 {id="template_loading"}
要加载 JTE 模板，你需要：
1. 创建一个 `CodeResolver` 用于解析模板代码。例如，你可以配置 `DirectoryCodeResolver` 从给定目录加载模板，或配置 `ResourceCodeResolver` 从应用程序资源加载模板。
2. 使用 `templateEngine` 属性指定一个模板引擎，该引擎使用创建的 `CodeResolver` 将模板转换为原生 Java/Kotlin 代码。

例如，下面的代码片段使 Ktor 能够查找 `templates` 目录中的 JTE 模板：

```kotlin
```
{src="snippets/jte/src/main/kotlin/com/example/Application.kt" include-lines="3-6,9-10,13-17,24"}

### 在响应中发送模板 {id="use_template"}
假设你在 `templates` 目录中有一个 `index.kte` 模板：
```html
```
{src="snippets/jte/templates/index.kte"}

要使用该模板处理指定的[路由](server-routing.md)，请按如下方式将 `JteContent` 传递给 `call.respond` 方法：
```kotlin
```
{src="snippets/jte/src/main/kotlin/com/example/Application.kt" include-lines="19-22"}