[//]: # (title: 終止 URL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 插件允許您配置用於終止伺服器的 URL。
有兩種方式可以啟用此插件：

- 在 [配置文件](#config-file) 中。
- 透過 [安裝插件](#install)。

## 在配置文件中配置終止 URL {id="config-file"}

您可以在 [配置文件](server-configuration-file.topic) 中，使用 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 屬性來配置終止 URL。

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

## 透過安裝插件配置終止 URL {id="install"}

若要在程式碼中 [安裝](server-plugins.md#install) 並配置終止 URL，請將 `ShutDownUrl.ApplicationCallPlugin` 傳遞給 `install` 函數並使用 `shutDownUrl` 屬性：

```kotlin
```

{src="snippets/shutdown-url/src/main/kotlin/com/example/Application.kt" include-lines="11-14"}

如需完整範例，請參閱 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)。