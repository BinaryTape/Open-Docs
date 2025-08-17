[//]: # (title: デプロイメント)

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

このトピックでは、Ktorアプリケーションをデプロイする方法の概要を説明します。

> サーバーKtorアプリケーションのデプロイプロセスを簡素化するために、Gradle向けの[Ktor](https://github.com/ktorio/ktor-build-plugins)プラグインを使用できます。このプラグインは以下の機能を提供します。
> - Fat JARのビルド。
> - アプリケーションのDocker化。

## Ktorデプロイの特性 {id="ktor-specifics"}
サーバーKtorアプリケーションのデプロイプロセスは、以下の特性に依存します。
* アプリケーションを自己完結型パッケージとしてデプロイするか、サーブレットコンテナ内でデプロイするか。
* サーバーを作成および構成するために使用する方法。

### 自己完結型アプリとサーブレットコンテナ {id="self-contained-vs-servlet"}

Ktorでは、アプリケーション内で直接、目的のネットワーク[エンジン](server-engines.md)（Netty、Jetty、Tomcatなど）を使用してサーバーを作成および起動できます。この場合、エンジンはアプリケーションの一部です。アプリケーションは、エンジン設定、接続、およびSSLオプションを制御できます。アプリケーションをデプロイするには、Fat JARまたは実行可能JVMアプリケーションとして[パッケージング](#packaging)できます。

上記のアプローチとは対照的に、サーブレットコンテナはアプリケーションのライフサイクルと接続設定を制御する必要があります。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な`ServletApplicationEngine`エンジンを提供します。サーブレットコンテナ内にデプロイするには、[WARアーカイブ](server-war.md)を生成する必要があります。

### 設定：コードと設定ファイル {id="code-vs-config"}

自己完結型Ktorアプリケーションのデプロイ設定は、[サーバーの作成と構成](server-create-and-configure.topic)に使用されるアプローチ（コード内での設定、または[設定ファイル](server-configuration-file.topic)の使用）に依存する場合があります。例として、[ホスティングプロバイダー](#publishing)は、受信リクエストをリッスンするためのポートの指定を要求する場合があります。この場合、コード内または`application.conf`/`application.yaml`でポートを[設定](server-configuration-file.topic)する必要があります。

## パッケージング {id="packaging"}

アプリケーションをデプロイする前に、以下のいずれかの方法でパッケージングする必要があります。

*   **Fat JAR**

    Fat JARは、すべてのコード依存関係を含む実行可能なJARです。Fat JARをサポートする任意の[クラウドサービス](#publishing)にデプロイできます。GraalVM用のネイティブバイナリを生成する場合にもFat JARが必要です。Fat JARを作成するには、Gradle用の[Ktor](server-fatjar.md)プラグイン、またはMaven用の[Assembly](maven-assembly-plugin.md)プラグインを使用できます。

*   **実行可能JVMアプリケーション**

    実行可能JVMアプリケーションは、コード依存関係と生成された起動スクリプトを含むパッケージ化されたアプリケーションです。Gradleの場合、[Application](server-packaging.md)プラグインを使用してアプリケーションを生成できます。

*   **WAR**

    [WARアーカイブ](server-war.md)を使用すると、TomcatやJettyなどのサーブレットコンテナ内にアプリケーションをデプロイできます。

*   **GraalVM**

    Ktorサーバーアプリケーションは、異なるプラットフォーム用のネイティブイメージを持つために[GraalVM](graalvm.md)を利用できます。

## コンテナ化 {id="containerizing"}

アプリケーションをパッケージングした後（例: 実行可能JVMアプリケーションまたはFat JARとして）、このアプリケーションを含む[Dockerイメージ](docker.md)を準備できます。このイメージは、Kubernetes、Swarm、または必要なクラウドサービスのコンテナインスタンス上でアプリケーションを実行するために使用できます。

## 公開 {id="publishing"}

以下のチュートリアルでは、特定のクラウドプロバイダーにKtorアプリケーションをデプロイする方法を示します。
*   [Google App Engine](google-app-engine.md)
*   [Heroku](heroku.md)
*   [AWS Elastic Beanstalk](elastic-beanstalk.md)

## SSL {id="ssl"}

Ktorサーバーがリバースプロキシ（NginxやApacheなど）の背後に配置されている場合、またはサーブレットコンテナ（TomcatやJetty）内で実行されている場合、SSL設定はリバースプロキシまたはサーブレットコンテナによって管理されます。必要に応じて、Java KeyStoreを使用してKtorが[SSLを直接提供](server-ssl.md)するように設定できます。

> Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合、SSL設定は有効にならないことに注意してください。