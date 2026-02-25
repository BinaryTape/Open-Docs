[//]: # (title: 關閉伺服器 URL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 外掛程式允許您配置用於關閉伺服器的 URL。
有兩種方式可以啟用此外掛程式：

- 在 [配置檔案](#config-file) 中。
- 透過 [安裝外掛程式](#install)。

## 在配置檔案中配置關閉伺服器 URL {id="config-file"}

您可以在 [配置檔案](server-configuration-file.topic) 中使用 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 屬性來配置關閉伺服器 URL。

<Tabs group="config">
<TabItem title="application.conf" group-key="hocon">

```shell
ktor {
    deployment {
        shutdown.url = "/shutdown"
    }
}
```

</TabItem>
<TabItem title="application.yaml" group-key="yaml">

```yaml
ktor:
    deployment:
        shutdown:
            url: "/shutdown"
```

</TabItem>
</Tabs>

## 透過安裝外掛程式配置關閉伺服器 URL {id="install"}

要在程式碼中[安裝](server-plugins.md#install)並配置關閉伺服器 URL，請將 `ShutDownUrl.ApplicationCallPlugin` 傳遞給 `install` 函式，並使用 `shutDownUrl` 屬性：

```kotlin
install(ShutDownUrl.ApplicationCallPlugin) {
    shutDownUrl = "/shutdown"
    exitCodeSupplier = { 0 }
}
```

如需完整範例，請參閱 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)。