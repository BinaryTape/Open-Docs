[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允許您透過安裝 [Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity) 外掛，在應用程式中將 [Velocity 範本](https://velocity.apache.org/engine/) 作為視圖使用。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 Velocity {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

您可以選擇安裝 `VelocityTools` 外掛，以便能夠新增標準和自訂的 [Velocity 工具](#velocity_tools)。

## 配置 Velocity {id="configure"}
### 配置範本載入 {id="template_loading"}
在 `install` 區塊內，您可以配置 [VelocityEngine][velocity_engine]。例如，如果您想從 `classpath` 使用範本，請使用 `classpath` 的資源載入器：
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="3-4,7-9,12-16,23"}

### 在響應中傳送範本 {id="use_template"}
想像您在 `resources/templates` 中有一個 `index.vl` 範本：
```html
```
{src="snippets/velocity/src/main/resources/templates/index.vl"}

用於使用者資料模型如下所示：
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="25"}

若要為指定的 [路由](server-routing.md) 使用範本，請以下列方式將 `VelocityContent` 傳遞給 `call.respond` 方法：
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="18-21"}

### 新增 Velocity 工具 {id="velocity_tools"}

如果您已[安裝](#install_plugin) `VelocityTools` 外掛，您可以在 `install` 區塊內存取 `EasyFactoryConfiguration` 實例，以新增標準和自訂的 Velocity 工具，例如：

```kotlin
install(VelocityTools) {
    engine {
        // Engine configuration
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // Add a default tool
    tool("foo", MyCustomTool::class.java) // Add a custom tool
}
```