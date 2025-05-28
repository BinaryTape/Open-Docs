[//]: # (title: シャットダウンURL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) プラグインを使用すると、サーバーをシャットダウンするために使用されるURLを構成できます。
このプラグインを有効にする方法は2つあります。

- [設定ファイル](#config-file)で。
- プラグインを[インストール](#install)して。

## 設定ファイルでシャットダウンURLを構成する {id="config-file"}

[設定ファイル](server-configuration-file.topic)で、`[ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties)` プロパティを使用してシャットダウンURLを構成できます。

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

## プラグインをインストールしてシャットダウンURLを構成する {id="install"}

コードでシャットダウンURLを[インストール](server-plugins.md#install)および構成するには、`install` 関数に `ShutDownUrl.ApplicationCallPlugin` を渡し、`shutDownUrl` プロパティを使用します。

```kotlin
```

{src="snippets/shutdown-url/src/main/kotlin/com/example/Application.kt" include-lines="11-14"}

完全な例については、[shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)を参照してください。