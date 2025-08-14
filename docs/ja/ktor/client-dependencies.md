[//]: # (title: クライアント依存関係の追加)

<show-structure for="chapter" depth="2"/>

<link-summary>既存のプロジェクトにクライアント依存関係を追加する方法を学びます。</link-summary>

プロジェクトでKtor HTTPクライアントを使用するには、[リポジトリを設定](#repositories)し、以下の依存関係を追加する必要があります。

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core` には、Ktorクライアントのコア機能が含まれています。
- **[Engine dependency](#engine-dependency)**

  エンジンはネットワークリクエストを処理するために使用されます。
  [特定のプラットフォーム](client-supported-platforms.md)では、ネットワークリクエストを処理する特定のエンジンが必要になる場合があることに注意してください。
- (Optional) **[Logging dependency](#logging-dependency)**

  構造化された柔軟なロギング機能を提供するために、ロギングフレームワークを提供します。

- (Optional) **[Plugin dependency](#plugin-dependency)**

  プラグインは、特定の機能でクライアントを拡張するために使用されます。

## 依存関係の追加 {id="add-ktor-dependencies"}

> [異なるプラットフォーム](client-supported-platforms.md)向けに、Ktorは`-jvm`や`-js`のようなサフィックスを持つプラットフォーム固有のアーティファクト、例えば`ktor-client-core-jvm`を提供します。Gradleは指定されたプラットフォームに適切なアーティファクトを自動的に解決しますが、Mavenはこの機能をサポートしていないことに注意してください。これは、Mavenではプラットフォーム固有のサフィックスを手動で追加する必要があることを意味します。
>
{type="tip"}

### クライアント依存関係 {id="client-dependency"}

主なクライアント機能は`ktor-client-core`アーティファクトで利用できます。ビルドシステムに応じて、次のように追加できます。

<var name="artifact_name" value="ktor-client-core"/>

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
    

`$ktor_version`を、例えば`%ktor_version%`のように必要なKtorのバージョンに置き換えることができます。

#### マルチプラットフォーム {id="client-dependency-multiplatform"}

マルチプラットフォームプロジェクトの場合、Ktorのバージョンと`ktor-client-core`アーティファクトを`gradle/libs.versions.toml`ファイルで定義できます。

[object Promise]

次に、`ktor-client-core`を`commonMain`ソースセットに依存関係として追加します。

[object Promise]

### エンジン依存関係 {id="engine-dependency"}

エンジンは、ネットワークリクエストの処理を担当します。Apache、CIO、Android、iOSなど、さまざまなプラットフォームで利用できるさまざまなクライアントエンジンがあります。例えば、`CIO`エンジンの依存関係は次のように追加できます。

<var name="artifact_name" value="ktor-client-cio"/>

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
    

#### マルチプラットフォーム {id="engine-dependency-multiplatform"}

マルチプラットフォームプロジェクトの場合、必要なエンジンの依存関係を対応するソースセットに追加する必要があります。

例えば、Android向けに`OkHttp`エンジンの依存関係を追加するには、まず`gradle/libs.versions.toml`ファイルでKtorのバージョンと`ktor-client-okhttp`アーティファクトを定義します。

[object Promise]

次に、`ktor-client-okhttp`を`androidMain`ソースセットに依存関係として追加します。

[object Promise]

特定のエンジンに必要な依存関係の全リストについては、[](client-engines.md#dependencies)を参照してください。

### ロギング依存関係

<snippet id="jvm-logging">
  <p>
JVMでは、Ktorはロギングの抽象化レイヤーとしてSimple Logging Facade for Java
(<a href="http://www.slf4j.org/">SLF4J</a>)を使用します。SLF4JはロギングAPIを基盤となるロギング実装から分離し、
アプリケーションの要件に最も適したロギングフレームワークを統合できるようにします。
一般的な選択肢には、<a href="https://logback.qos.ch/">Logback</a>や
<a href="https://logging.apache.org/log4j">Log4j</a>が含まれます。フレームワークが提供されていない場合、SLF4Jはデフォルトで
no-operation (NOP)実装になり、実質的にロギングが無効になります。
  </p>

  <p>
ロギングを有効にするには、<a href="https://logback.qos.ch/">Logback</a>のような必要なSLF4J実装を含むアーティファクトを含めます。
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
</snippet>

Ktorでのロギングに関する詳細については、[](client-logging.md)を参照してください。

### プラグイン依存関係 {id="plugin-dependency"}

Ktorでは、認証やシリアライゼーションなど、デフォルトでは利用できない追加のクライアント機能（[プラグイン](client-plugins.md)）を使用できます。これらの一部は個別のアーティファクトで提供されます。必要なプラグインのトピックから、どの依存関係が必要かを知ることができます。

> マルチプラットフォームプロジェクトの場合、プラグインの依存関係は`commonMain`ソースセットに追加する必要があります。一部のプラグインには、特定のプラットフォームで[制限](client-engines.md#limitations)がある場合があることに注意してください。

## Ktorのバージョンの一貫性を確保する

<chapter title="Ktor BOM依存関係の使用">

Ktor BOMを使用すると、各依存関係のバージョンを個別に指定することなく、すべてのKtorモジュールが同じ一貫したバージョンを使用することを保証できます。

Ktor BOMの依存関係を追加するには、ビルドスクリプトに次のように宣言します。

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
</chapter>

<var name="target_module" value="client"/>