[//]: # (title: Thymeleaf)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Thymeleaf"/>
<var name="package_name" value="io.ktor.server.thymeleaf"/>
<var name="artifact_name" value="ktor-server-thymeleaf"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="thymeleaf"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允許您透過安裝 [Thymeleaf](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf) 外掛程式 (plugin)，在您的應用程式中將 [Thymeleaf 模板](https://www.thymeleaf.org/) (Thymeleaf templates) 作為視圖使用。

## 新增依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 Thymeleaf {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 Thymeleaf {id="configure"}
### 配置模板載入 {id="template_loading"}
在 `install` 區塊內部，您可以配置 `ClassLoaderTemplateResolver`。例如，以下程式碼片段使 Ktor 能夠在相對於目前類別路徑 (classpath) 的 `templates` 套件中查找 `*.html` 模板：
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="3,6-8,11-18,25"}

### 在回應中發送模板 {id="use_template"}
想像您在 `resources/templates` 中有一個 `index.html` 模板：
```html
```
{src="snippets/thymeleaf/src/main/resources/templates/index.html"}

一個用戶的資料模型 (data model) 如下所示：
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="27"}

要為指定的路由 (route) 使用該模板，請將 [ThymeleafContent](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html) 傳遞給 `call.respond` 方法，方式如下：
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="20-23"}

## 範例：自動重新載入 Thymeleaf 模板 {id="auto-reload"}

以下範例展示了當使用開發模式 (development mode) 時，如何自動重新載入 Thymeleaf 模板。

```kotlin
```
{src="snippets/thymeleaf-auto-reload/src/main/kotlin/com/example/Application.kt"}

您可以在此處找到完整的範例：[thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload)。