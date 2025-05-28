[//]: # (title: WebJars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>必需的依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
`%plugin_name%` 外掛程式可提供由 WebJars 所提供的用戶端函式庫。
</link-summary>

[`%plugin_name%`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) 外掛程式可啟用服務由 [WebJars](https://www.webjars.org/) 所提供的用戶端函式庫。它讓您能夠將 JavaScript 和 CSS 函式庫等資產作為您的 [fat JAR](server-fatjar.md) 的一部分進行打包。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `%plugin_name%`，您需要將以下構件包含在建置指令碼中：
* 新增 `%artifact_name%` 依賴項：

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 新增所需用戶端函式庫的依賴項。以下範例展示如何新增 Bootstrap 構件：

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  <include from="lib.topic" element-id="add_artifact"/>

  您可以將 `$bootstrap_version` 替換為 `bootstrap` 構件的所需版本，例如 `%bootstrap_version%`。

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 設定 %plugin_name% {id="configure"}

預設情況下，`%plugin_name%` 會在 `/webjars` 路徑上提供 WebJars 資產。以下範例展示如何更改此設定，並在 `/assets` 路徑上提供任何 WebJars 資產：

```kotlin
```
{src="snippets/webjars/src/main/kotlin/com/example/Application.kt" include-lines="3,6-7,10-13,17"}

例如，如果您已安裝 `org.webjars:bootstrap` 依賴項，您可以如下新增 `bootstrap.css`：

```html
```
{src="snippets/webjars/src/main/resources/files/index.html" include-lines="3,8-9"}

請注意，`%plugin_name%` 允許您更改依賴項的版本，而無需更改用於載入它們的路徑。

> 您可以從這裡找到完整範例：[webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)。