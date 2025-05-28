[//]: # (title: クライアントの依存関係の追加)

<show-structure for="chapter" depth="2"/>

<link-summary>既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。</link-summary>

プロジェクトでKtor HTTPクライアントを使用するには、[リポジトリを設定](#repositories)し、以下の依存関係を追加する必要があります。

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core` には、Ktorクライアントのコア機能が含まれています。
- **[エンジン依存関係](#engine-dependency)**

  エンジンはネットワークリクエストを処理するために使用されます。[特定のプラットフォーム](client-supported-platforms.md)では、ネットワークリクエストを処理する特定のエンジンが必要になる場合があることに注意してください。
- (オプション) **[ロギング依存関係](#logging-dependency)**

  構造化された柔軟なロギング機能を有効にするには、ロギングフレームワークを提供します。

- (オプション) **[プラグイン依存関係](#plugin-dependency)**

  プラグインは、特定の機能でクライアントを拡張するために使用されます。

<include from="server-dependencies.topic" element-id="repositories"/>

## 依存関係の追加 {id="add-ktor-dependencies"}

> [異なるプラットフォーム](client-supported-platforms.md)向けに、Ktorは`-jvm`や`-js`のようなサフィックスを持つプラットフォーム固有のアーティファクト（例: `ktor-client-core-jvm`）を提供します。Gradleは特定のプラットフォームに適したアーティファクトを自動的に解決しますが、Mavenはこの機能をサポートしていません。これは、Mavenの場合、プラットフォーム固有のサフィックスを手動で追加する必要があることを意味します。
>
{type="tip"}

### クライアント依存関係 {id="client-dependency"}

主なクライアント機能は`ktor-client-core`アーティファクトで利用できます。ビルドシステムに応じて、次の方法で追加できます。

<var name="artifact_name" value="ktor-client-core"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

`$ktor_version` を必要なKtorバージョン（例: `%ktor_version%`）に置き換えることができます。

#### マルチプラットフォーム {id="client-dependency-multiplatform"}

マルチプラットフォームプロジェクトの場合、Ktorバージョンと`ktor-client-core`アーティファクトを`gradle/libs.versions.toml`ファイルで定義できます。

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5,10-11,19"}

次に、`ktor-client-core`を`commonMain`ソースセットの依存関係として追加します。

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-28,30,40"}

### エンジン依存関係 {id="engine-dependency"}

[エンジン](client-engines.md)はネットワークリクエストの処理を担当します。Apache、CIO、Android、iOSなど、さまざまなプラットフォームで利用可能な異なるクライアントエンジンがあります。たとえば、次のように`CIO`エンジン依存関係を追加できます。

<var name="artifact_name" value="ktor-client-cio"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### マルチプラットフォーム {id="engine-dependency-multiplatform"}

マルチプラットフォームプロジェクトの場合、必要なエンジンの依存関係を対応するソースセットに追加する必要があります。

例えば、Android向けの`OkHttp`エンジン依存関係を追加するには、まずKtorバージョンと`ktor-client-okhttp`アーティファクトを`gradle/libs.versions.toml`ファイルで定義できます。

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5,10-11,20"}

次に、`ktor-client-okhttp`を`androidMain`ソースセットの依存関係として追加します。

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26,34-36,40"}

特定のエンジンに必要な依存関係の完全なリストについては、[](client-engines.md#dependencies)を参照してください。

### ロギング依存関係

<include from="client-logging.md" element-id="jvm-logging"/>

Ktorでのロギングに関する詳細については、[](client-logging.md)を参照してください。

### プラグイン依存関係 {id="plugin-dependency"}

Ktorでは、認証やシリアライゼーションなど、デフォルトでは利用できない追加のクライアント機能（[プラグイン](client-plugins.md)）を使用できます。それらのいくつかは個別のアーティファクトで提供されています。必要なプラグインのトピックから、どの依存関係が必要かを知ることができます。

> マルチプラットフォームプロジェクトの場合、プラグインの依存関係は`commonMain`ソースセットに追加する必要があります。一部のプラグインには、特定のプラットフォームに対する[制限](client-engines.md#limitations)がある場合があることに注意してください。