[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 允许你通过安装 [Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity) 插件，在应用程序中使用 [Velocity 模板](https://velocity.apache.org/engine/) 作为视图。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 Velocity {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

你可以选择安装 `VelocityTools` 插件，以便能够添加标准和自定义的 [Velocity 工具](#velocity_tools)。

## 配置 Velocity {id="configure"}
### 配置模板加载 {id="template_loading"}
在 `install` 代码块内部，你可以配置 [VelocityEngine][velocity_engine]。例如，如果你想从 classpath 使用模板，请为 `classpath` 使用资源加载器：
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="3-4,7-9,12-16,23"}

### 发送模板作为响应 {id="use_template"}
假设你在 `resources/templates` 中有一个 `index.vl` 模板：
```html
```
{src="snippets/velocity/src/main/resources/templates/index.vl"}

用于用户的数据模型如下所示：
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="25"}

要将模板用于指定的[路由](server-routing.md)，请按以下方式将 `VelocityContent` 传递给 `call.respond` 方法：
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="18-21"}

### 添加 Velocity 工具 {id="velocity_tools"}

如果你已[安装](#install_plugin) `VelocityTools` 插件，你可以在 `install` 代码块中访问 `EasyFactoryConfiguration` 实例，以添加标准和自定义的 Velocity 工具，例如：

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