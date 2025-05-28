[//]: # (title: 关机 URL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 插件允许您配置一个用于关闭服务器的 URL。
有两种方式可以启用此插件：

- 在[配置文件](#config-file)中。
- 通过[安装插件](#install)。

## 在配置文件中配置关机 URL {id="config-file"}

您可以在[配置文件](server-configuration-file.topic)中使用 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 属性来配置关机 URL。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

```shell
```

{src="snippets/shutdown-url/src/main/resources/application.conf" include-lines="1-2,4-5,9"}

</tab>
<tab title="application.yaml" group-key="yaml">

```yaml
```

{src="snippets/shutdown-url/src/main/resources/_application.yaml" include-lines="1-2,4-5"}

</tab>
</tabs>

## 通过安装插件配置关机 URL {id="install"}

要[安装](server-plugins.md#install)并在代码中配置关机 URL，请将 `ShutDownUrl.ApplicationCallPlugin` 传递给 `install` 函数并使用 `shutDownUrl` 属性：

```kotlin
```

{src="snippets/shutdown-url/src/main/kotlin/com/example/Application.kt" include-lines="11-14"}

完整示例请参阅 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)。