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

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html)
プラグインを使用すると、サーバーをシャットダウンするために使用するURLを設定できます。
このプラグインを有効にする方法は2つあります。

- [設定ファイルで](#config-file)。
- [プラグインをインストールして](#install)。

## 設定ファイルでシャットダウンURLを構成する {id="config-file"}

[設定ファイル](server-configuration-file.topic)で、
[ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties)プロパティを使用してシャットダウンURLを設定できます。

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

## プラグインをインストールしてシャットダウンURLを構成する {id="install"}

コードでシャットダウンURLを[インストール](server-plugins.md#install)して構成するには、`install`関数に`ShutDownUrl.ApplicationCallPlugin`を渡し、`shutDownUrl`プロパティを使用します。

```kotlin
install(ShutDownUrl.ApplicationCallPlugin) {
    shutDownUrl = "/shutdown"
    exitCodeSupplier = { 0 }
}
```

完全な例については、
[shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)を参照してください。