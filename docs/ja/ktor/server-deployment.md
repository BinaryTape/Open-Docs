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

このトピックでは、Ktorアプリケーションをデプロイする方法の概要を説明します。

> サーバーKtorアプリケーションのデプロイプロセスを簡素化するために、Gradle用の[Ktor](https://github.com/ktorio/ktor-build-plugins)プラグインを使用できます。このプラグインは以下の機能を提供します：
> - fat JARのビルド。
> - アプリケーションのDocker化。

## Ktorデプロイメントの固有事項 {id="ktor-specifics"}
サーバーKtorアプリケーションのデプロイプロセスは、以下の事項によって異なります。
* アプリケーションを自己完結型のパッケージとしてデプロイするか、サーブレットコンテナ内にデプロイするか。
* サーバーの作成と構成にどのアプローチを使用するか。

### 自己完結型アプリ vs サーブレットコンテナ {id="self-contained-vs-servlet"}

Ktorでは、アプリケーション内で直接、目的のネットワーク[エンジン](server-engines.md)（Netty、Jetty、Tomcatなど）を使用してサーバーを作成し、起動することができます。この場合、エンジンはアプリケーションの一部となります。アプリケーションは、エンジン設定、接続、SSLオプションを制御できます。アプリケーションをデプロイするには、[パッケージ化](#packaging)して fat JAR または実行可能なJVMアプリケーションとして出力します。

上記のアプローチとは対照的に、サーブレットコンテナがアプリケーションのライフサイクルと接続設定を制御する必要があります。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な `ServletApplicationEngine` エンジンを提供しています。サーブレットコンテナ内にデプロイするには、[WARアーカイブ](server-war.md)を生成する必要があります。

### 構成：コード vs 設定ファイル {id="code-vs-config"}

デプロイ用の自己完結型Ktorアプリケーションの構成は、[サーバーの作成と構成](server-create-and-configure.topic)に使用する方法（コード内で行うか、[設定ファイル](server-configuration-file.topic)を使用するか）によって異なる場合があります。例として、[ホスティングプロバイダー](#publishing)が受信リクエストをリッスンするために使用するポートの指定を要求する場合があります。この場合、コード内または `application.conf`/`application.yaml` のいずれかでポートを[構成](server-configuration-file.topic)する必要があります。

## パッケージ化 {id="packaging"}

アプリケーションをデプロイする前に、以下のいずれかの方法でパッケージ化する必要があります：

* **Fat JAR**

  fat JARは、すべてのコード依存関係を含む実行可能なJARです。fat JARをサポートする任意の[クラウドサービス](#publishing)にデプロイできます。また、GraalVM用のネイティブバイナリを生成する必要がある場合も、fat JARが必要です。fat JARを作成するには、Gradle用の[Ktor](server-fatjar.md)プラグインまたはMaven用の[Assembly](maven-assembly-plugin.md)プラグインを使用できます。

* **実行可能なJVMアプリケーション**

   実行可能なJVMアプリケーションは、コードの依存関係と生成された起動スクリプトを含むパッケージ化されたアプリケーションです。Gradleの場合、[Application](server-packaging.md)プラグインを使用してアプリケーションを生成できます。

* **WAR**

   [WARアーカイブ](server-war.md)を使用すると、TomcatやJettyなどのサーブレットコンテナ内にアプリケーションをデプロイできます。

* **GraalVM**

   Ktorサーバーアプリケーションは、さまざまなプラットフォーム向けのネイティブイメージを作成するために[GraalVM](graalvm.md)を利用できます。

## コンテナ化 {id="containerizing"}

アプリケーションをパッケージ化（例：実行可能なJVMアプリケーションまたはfat JAR）した後、そのアプリケーションを含む[Dockerイメージ](docker.md)を作成できます。このイメージを使用して、Kubernetes、Swarm、または必要なクラウドサービスのコンテナインスタンス上でアプリケーションを実行できます。

## 公開 {id="publishing"}

以下のチュートリアルでは、特定のクラウドプロバイダーにKtorアプリケーションをデプロイする方法を示しています：
* [Google App Engine](google-app-engine.md)
* [Heroku](heroku.md)
* [AWS Elastic Beanstalk](elastic-beanstalk.md)

## SSL {id="ssl"}

Ktorサーバーがリバースプロキシ（NginxやApacheなど）の背後に配置されている場合、またはサーブレットコンテナ（TomcatやJetty）内で動作している場合、SSL設定はリバースプロキシまたはサーブレットコンテナによって管理されます。必要に応じて、Java KeyStoreを使用して[SSLを直接提供](server-ssl.md)するようにKtorを構成することもできます。

> Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合、SSL設定は有効にならないことに注意してください。