[//]: # (title: 关机 URL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 插件允许您配置用于关闭服务器的 URL。
有两种方式启用此插件：

- 在[配置文件](#config-file)中。
- 通过[安装插件](#install)。

## 在配置文件中配置关机 URL {id="config-file"}

您可以在 [配置文件](server-configuration-file.topic) 中，使用 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 属性配置关机 URL。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

## 通过安装插件配置关机 URL {id="install"}

要在代码中[安装](server-plugins.md#install)并配置关机 URL，请将 `ShutDownUrl.ApplicationCallPlugin` 传递给 `install` 函数，并使用 `shutDownUrl` 属性：

[object Promise]

有关完整示例，请参见 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)。