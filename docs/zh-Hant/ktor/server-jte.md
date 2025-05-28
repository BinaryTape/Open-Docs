[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>必備依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="jte"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 讓您可以透過安裝 `[%plugin_name%]` (https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-jte/io.ktor.server.jte/-jte.html) 外掛 (plugin)，將 [JTE 模板](https://github.com/casid/jte) 作為應用程式中的視圖 (view) 來使用。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> 為了處理 `.kte` 檔案，您需要將 `gg.jte:jte-kotlin` 構件 (artifact) 新增到您的專案中。

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

在 `install` 區塊內，您可以[配置](#configure)如何載入 JTE 模板。

## 配置 %plugin_name% {id="configure"}
### 配置模板載入 {id="template_loading"}
若要載入 JTE 模板，您需要：
1.  建立一個用於解析模板程式碼的 `CodeResolver`。例如，您可以配置 `DirectoryCodeResolver` 從指定目錄載入模板，或配置 `ResourceCodeResolver` 從應用程式資源載入模板。
2.  使用 `templateEngine` 屬性指定一個模板引擎，它會使用一個已建立的 `CodeResolver` 將模板轉換為原生 Java/Kotlin 程式碼。

例如，下面的程式碼片段讓 Ktor 可以在 `templates` 目錄中查找 JTE 模板：

```kotlin
```
{src="snippets/jte/src/main/kotlin/com/example/Application.kt" include-lines="3-6,9-10,13-17,24"}

### 在回應中傳送模板 {id="use_template"}
假設您在 `templates` 目錄中有 `index.kte` 模板：
```html
```
{src="snippets/jte/templates/index.kte"}

若要將模板用於指定的[路由](server-routing.md)，請以下列方式將 `JteContent` 傳遞給 `call.respond` 方法：
```kotlin
```
{src="snippets/jte/src/main/kotlin/com/example/Application.kt" include-lines="19-22"}