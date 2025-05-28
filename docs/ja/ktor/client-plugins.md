[//]: # (title: クライアントプラグイン)

<link-summary>
ロギング、シリアライゼーション、認可などの一般的な機能を提供するプラグインについて理解を深めます。
</link-summary>

多くのアプリケーションでは、アプリケーションロジックの範囲外となる共通の機能が必要になります。[ロギング](client-logging.md)、[シリアライゼーション](client-serialization.md)、[認可](client-auth.md)などがこれにあたります。これらはすべて、Ktorでは**プラグイン**と呼ばれる仕組みによって提供されます。

## プラグインの依存関係を追加する {id="plugin-dependency"}
プラグインには、別途[依存関係](client-dependencies.md)が必要になる場合があります。例えば、[Logging](client-logging.md)プラグインを使用するには、ビルドスクリプトに`ktor-client-logging`アーティファクトを追加する必要があります。

<var name="artifact_name" value="ktor-client-logging"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

必要な依存関係については、各プラグインのトピックで確認できます。

## プラグインをインストールする {id="install"}
プラグインをインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数にプラグインを渡す必要があります。例えば、`Logging`プラグインのインストールは次のようになります。

```kotlin
```
{src="snippets/_misc_client/InstallLoggingPlugin.kt"}

## プラグインを設定する {id="configure_plugin"}
`install`ブロック内でプラグインを設定できます。例えば、[Logging](client-logging.md)プラグインの場合、ロガー、ロギングレベル、ログメッセージをフィルタリングする条件を指定できます。
```kotlin
```
{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt" include-lines="12-20"}

## カスタムプラグインを作成する {id="custom"}
カスタムプラグインの作成方法については、[](client-custom-plugins.md)を参照してください。