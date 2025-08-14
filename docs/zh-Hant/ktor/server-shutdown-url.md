[//]: # (title: 關機 URL)

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

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 插件允許您設定用於關閉伺服器的 URL。
有兩種方式啟用此插件：

- 在[設定檔](#config-file)中。
- 透過[安裝此插件](#install)。

## 在設定檔中設定關機 URL {id="config-file"}

您可以在[設定檔](server-configuration-file.topic)中，透過使用 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 屬性來設定關機 URL。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

## 透過安裝插件設定關機 URL {id="install"}

若要在程式碼中[安裝](server-plugins.md#install)並設定關機 URL，請將 `ShutDownUrl.ApplicationCallPlugin` 傳遞給 `install` 函式並使用 `shutDownUrl` 屬性：

[object Promise]

如需完整範例，請參閱 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)。