[//]: # (title: Mustache)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>必備依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允許您透過安裝 [Mustache](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache) 插件，在您的應用程式中使用 [Mustache 模板](https://github.com/spullara/mustache.java) 作為視圖。

## 添加依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 Mustache {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

在 `install` 區塊中，您可以[配置](#template_loading) `[MustacheFactory][mustache_factory]` 用於載入 Mustache 模板。

## 配置 Mustache {id="configure"}
### 配置模板載入 {id="template_loading"}
若要載入模板，您需要將 `[MustacheFactory][mustache_factory]` 指派給 `mustacheFactory` 屬性。例如，以下程式碼片段使 Ktor 能夠查找相對於目前 classpath 的 `templates` 套件中的模板：
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="3-6,11-15,22"}

### 在響應中傳送模板 {id="use_template"}
假設您在 `resources/templates` 中有 `index.hbs` 模板：
```html
```
{src="snippets/mustache/src/main/resources/templates/index.hbs"}

用戶的資料模型如下所示：
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="24"}

若要使用該模板用於指定的[路由](server-routing.md)，請以以下方式將 `MustacheContent` 傳遞給 `call.respond` 方法：
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="17-20"}