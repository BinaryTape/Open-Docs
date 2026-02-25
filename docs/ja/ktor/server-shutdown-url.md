[//]: # (title: シャットダウンURL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) プラグインを使用すると、サーバーをシャットダウンするために使用するURLを設定できます。
このプラグインを有効にするには、次の2つの方法があります。

- [設定ファイル](#config-file)で行う。
- [プラグインをインストール](#install)して行う。

## 設定ファイルでシャットダウンURLを設定する {id="config-file"}

[設定ファイル](server-configuration-file.topic)内で、[ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) プロパティを使用してシャットダウンURLを設定できます。

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

## プラグインをインストールしてシャットダウンURLを設定する {id="install"}

コード内でシャットダウンURLを[インストール](server-plugins.md#install)および設定するには、`ShutDownUrl.ApplicationCallPlugin` を `install` 関数に渡し、`shutDownUrl` プロパティを使用します。

```kotlin
install(ShutDownUrl.ApplicationCallPlugin) {
    shutDownUrl = "/shutdown"
    exitCodeSupplier = { 0 }
}
```

完全な例については、[shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url) を参照してください。