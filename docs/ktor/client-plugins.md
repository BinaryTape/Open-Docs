[//]: # (title: 客户端插件)

<link-summary>
了解提供常见功能的插件，例如日志记录、序列化、授权等。
</link-summary>

许多应用程序需要超出应用程序逻辑范围的常见功能。这可能包括 [日志记录](client-logging.md)、[序列化](client-serialization.md) 或 [授权](client-auth.md) 等。所有这些功能都通过我们称之为 **插件** 的方式在 Ktor 中提供。

## 添加插件依赖项 {id="plugin-dependency"}
插件可能需要单独的 [依赖项](client-dependencies.md)。例如，[日志记录](client-logging.md) 插件需要将 `ktor-client-logging` 构件添加到构建脚本中：

<var name="artifact_name" value="ktor-client-logging"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

你可以从所需插件的主题中了解你需要哪些依赖项。

## 安装插件 {id="install"}
要安装插件，你需要将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 中的 `install` 函数。例如，安装 `Logging` 插件如下所示：

```kotlin
```
{src="snippets/_misc_client/InstallLoggingPlugin.kt"}

## 配置插件 {id="configure_plugin"}
你可以在 `install` 块中配置插件。例如，对于 [日志记录](client-logging.md) 插件，你可以指定日志记录器、日志级别以及过滤日志消息的条件：
```kotlin
```
{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt" include-lines="12-20"}

## 创建自定义插件 {id="custom"}
要了解如何创建自定义插件，请参考 [](client-custom-plugins.md)。