[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
%plugin_name% 插件支持提供 WebJars 提供的客户端库。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) 插件支持提供 [WebJars](https://www.webjars.org/) 提供的客户端库。它允许你将 JavaScript 和 CSS 库等资源打包到你的 [fat JAR](server-fatjar.md) 中。

## 添加依赖项 {id="add_dependencies"}
要启用 `%plugin_name%`，你需要在构建脚本中包含以下 Artifact：
* 添加 `%artifact_name%` 依赖项：

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 添加所需客户端库的依赖项。以下示例展示了如何添加 Bootstrap Artifact：

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  你可以将 `$bootstrap_version` 替换为 `bootstrap` Artifact 的所需版本，例如 `%bootstrap_version%`。

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 %plugin_name% {id="configure"}

默认情况下，`%plugin_name%` 通过 `/webjars` 路径提供 WebJars 资源。以下示例展示了如何更改此设置，并在 `/assets` 路径上提供所有 WebJars 资源：

```kotlin
```
{src="snippets/webjars/src/main/kotlin/com/example/Application.kt" include-lines="3,6-7,10-13,17"}

例如，如果你已安装 `org.webjars:bootstrap` 依赖项，可以按如下方式添加 `bootstrap.css`：

```html
```
{src="snippets/webjars/src/main/resources/files/index.html" include-lines="3,8-9"}

请注意，`%plugin_name%` 允许你更改依赖项的版本，而无需更改用于加载它们的路径。

> 你可以在此处找到完整示例：[webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)。