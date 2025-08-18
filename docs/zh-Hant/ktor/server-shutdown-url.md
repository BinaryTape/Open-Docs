[//]: # (title: 關機網址)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 外掛程式允許您配置一個用於關閉伺服器的網址。
有兩種方式可以啟用此外掛程式：

- 在 [設定檔](#config-file) 中。
- 透過 [安裝此外掛程式](#install)。

## 在設定檔中配置關機網址 {id="config-file"}

您可以在 [設定檔](server-configuration-file.topic) 中使用 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 屬性來配置關機網址。

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

## 透過安裝外掛程式配置關機網址 {id="install"}

若要 [安裝](server-plugins.md#install) 並在程式碼中配置關機網址，請將 `ShutDownUrl.ApplicationCallPlugin` 傳遞給 `install` 函數並使用 `shutDownUrl` 屬性：

```kotlin
install(ShutDownUrl.ApplicationCallPlugin) {
    shutDownUrl = "/shutdown"
    exitCodeSupplier = { 0 }
}
```

完整的範例請參閱 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)。