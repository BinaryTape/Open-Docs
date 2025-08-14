[//]: # (title: クライアントプラグイン)

<link-summary>
ロギング、シリアライゼーション、認可など、一般的な機能を提供するプラグインについて理解を深めます。
</link-summary>

多くのアプリケーションは、アプリケーションロジックの範囲外にある共通機能を必要とします。これには、[ロギング](client-logging.md)、[シリアライゼーション](client-serialization.md)、または[認可](client-auth.md)のようなものが含まれます。これらすべては、Ktorでは**プラグイン**と呼ばれるものを通じて提供されます。

## プラグインの依存関係を追加する {id="plugin-dependency"}
プラグインには、個別の[依存関係](client-dependencies.md)が必要になる場合があります。例えば、[Logging](client-logging.md)プラグインでは、ビルドスクリプトに`ktor-client-logging`アーティファクトを追加する必要があります。

<var name="artifact_name" value="ktor-client-logging"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

どの依存関係が必要かは、必要なプラグインのトピックから確認できます。

## プラグインをインストールする {id="install"}
プラグインをインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の`install`関数に渡す必要があります。例えば、`Logging`プラグインをインストールする場合は次のようになります。

[object Promise]

## プラグインを設定する {id="configure_plugin"}
`install`ブロック内でプラグインを設定できます。例えば、[Logging](client-logging.md)プラグインの場合、ロガー、ロギングレベル、ログメッセージをフィルタリングする条件を指定できます。
[object Promise]

## カスタムプラグインを作成する {id="custom"}
カスタムプラグインの作成方法については、[](client-custom-plugins.md)を参照してください。