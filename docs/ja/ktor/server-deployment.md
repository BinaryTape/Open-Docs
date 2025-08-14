[//]: # (title: デプロイ)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

このトピックでは、Ktorアプリケーションのデプロイ方法の概要を説明します。

> サーバーKtorアプリケーションのデプロイプロセスを簡素化するには、Gradle用の[Ktor](https://github.com/ktorio/ktor-build-plugins)プラグインを使用できます。このプラグインは以下の機能を提供します。
> - ファットJARのビルド。
> - アプリケーションのDocker化。

## Ktorのデプロイに関する詳細 {id="ktor-specifics"}
サーバーKtorアプリケーションのデプロイプロセスは、以下の詳細に依存します。
* アプリケーションを自己完結型パッケージとしてデプロイするか、サーブレットコンテナ内でデプロイするか。
* サーバーの作成と設定にどの方法を使用するか。

### 自己完結型アプリとサーブレットコンテナの比較 {id="self-contained-vs-servlet"}

Ktorでは、必要なネットワーク[エンジン](server-engines.md)（Netty、Jetty、Tomcatなど）を使って、アプリケーション内で直接サーバーを作成し、起動できます。この場合、エンジンはアプリケーションの一部となります。アプリケーションはエンジン設定、接続、SSLオプションを制御できます。アプリケーションをデプロイするには、[パッケージ化](#packaging)してファットJARまたは実行可能なJVMアプリケーションにできます。

上記のアプローチとは対照的に、サーブレットコンテナがアプリケーションのライフサイクルと接続設定を制御する必要があります。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な`ServletApplicationEngine`エンジンを提供します。サーブレットコンテナ内でデプロイするには、[WARアーカイブ](server-war.md)を生成する必要があります。

### 設定: コードと設定ファイル {id="code-vs-config"}

自己完結型Ktorアプリケーションをデプロイ用に設定する方法は、[サーバーの作成と設定](server-create-and-configure.topic)に使用するアプローチ（コード内、または[設定ファイル](server-configuration-file.topic)の使用）によって異なる場合があります。たとえば、[ホスティングプロバイダー](#publishing)は、受信リクエストをリッスンするためのポートの指定を要求する場合があります。この場合、コード内または`application.conf`/`application.yaml`でポートを[設定](server-configuration-file.topic)する必要があります。

## パッケージ化 {id="packaging"}

アプリケーションをデプロイする前に、以下のいずれかの方法でパッケージ化する必要があります。

* **ファットJAR**

  ファットJARは、すべてのコード依存関係を含む実行可能なJARです。ファットJARをサポートするあらゆる[クラウドサービス](#publishing)にデプロイできます。GraalVM用のネイティブバイナリを生成する場合にもファットJARが必要です。ファットJARを作成するには、Gradle用の[Ktor](server-fatjar.md)プラグインまたはMaven用の[Assembly](maven-assembly-plugin.md)プラグインを使用できます。

* **実行可能なJVMアプリケーション**

   実行可能なJVMアプリケーションは、コード依存関係と生成された起動スクリプトを含むパッケージ化されたアプリケーションです。Gradleの場合、[Application](server-packaging.md)プラグインを使用してアプリケーションを生成できます。

* **WAR**

   [WARアーカイブ](server-war.md)を使用すると、TomcatやJettyなどのサーブレットコンテナ内にアプリケーションをデプロイできます。

* **GraalVM**

   Ktorサーバーアプリケーションは、異なるプラットフォーム用のネイティブイメージを持つために[GraalVM](graalvm.md)を利用できます。

## コンテナ化 {id="containerizing"}

アプリケーションをパッケージ化（例えば、実行可能なJVMアプリケーションやファットJARに）した後、そのアプリケーションを含む[Dockerイメージ](docker.md)を準備できます。このイメージは、Kubernetes、Swarm、または必要なクラウドサービスのコンテナインスタンスでアプリケーションを実行するために使用できます。

## 公開 {id="publishing"}

以下のチュートリアルでは、Ktorアプリケーションを特定のクラウドプロバイダーにデプロイする方法を示します。
* [](google-app-engine.md)
* [](heroku.md)
* [](elastic-beanstalk.md)

## SSL {id="ssl"}

Ktorサーバーがリバースプロキシ（NginxやApacheなど）の背後に配置されている場合、またはサーブレットコンテナ（TomcatやJetty）内で実行されている場合、SSL設定はリバースプロキシまたはサーブレットコンテナによって管理されます。必要に応じて、Java KeyStoreを使用してKtorが[SSLを直接](server-ssl.md)提供するように設定できます。

> Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合、SSL設定は有効にならないことに注意してください。