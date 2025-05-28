[//]: # (title: デプロイ)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

このトピックでは、Ktorアプリケーションのデプロイ方法について概説します。

> サーバーKtorアプリケーションのデプロイプロセスを簡素化するために、[Gradle用Ktor](https://github.com/ktorio/ktor-build-plugins)プラグインを使用できます。このプラグインは以下の機能を提供します：
> - Fat JARのビルド。
> - アプリケーションのDocker化。

## Ktorデプロイの特性 {id="ktor-specifics"}
サーバーKtorアプリケーションのデプロイプロセスは、以下の特性に依存します：
* アプリケーションを自己完結型パッケージとしてデプロイするか、サーブレットコンテナ内でデプロイするか。
* サーバーを作成および構成するためにどの手法を使用するか。

### 自己完結型アプリ vs サーブレットコンテナ {id="self-contained-vs-servlet"}

Ktorでは、アプリケーション内で希望するネットワーク[エンジン](server-engines.md)（Netty、Jetty、Tomcatなど）を使ってサーバーを作成し、起動できます。この場合、エンジンはアプリケーションの一部です。アプリケーションは、エンジン設定、接続、およびSSLオプションを制御します。アプリケーションをデプロイするには、[fat JAR](#packaging)または実行可能なJVMアプリケーションとして[パッケージ化](#packaging)できます。

上記のアプローチとは対照的に、サーブレットコンテナがアプリケーションのライフサイクルと接続設定を制御する必要があります。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な`ServletApplicationEngine`エンジンを提供します。サーブレットコンテナ内にデプロイするには、[WARアーカイブ](server-war.md)を生成する必要があります。

### 設定: コード vs 設定ファイル {id="code-vs-config"}

デプロイ用に自己完結型Ktorアプリケーションを設定する方法は、[サーバーの作成と構成](server-create-and-configure.topic)に使用されるアプローチ（コード内、または[設定ファイル](server-configuration-file.topic)の使用）に依存する場合があります。たとえば、[ホスティングプロバイダー](#publishing)は、受信リクエストをリッスンするために使用するポートの指定を要求する場合があります。この場合、コード内または`application.conf`/`application.yaml`のいずれかでポートを[設定](server-configuration-file.topic)する必要があります。

## パッケージング {id="packaging"}

アプリケーションをデプロイする前に、以下のいずれかの方法でパッケージ化する必要があります：

* **Fat JAR**

  Fat JARは、すべてのコード依存関係を含む実行可能なJARです。Fat JARをサポートする任意の[クラウドサービス](#publishing)にデプロイできます。GraalVM用のネイティブバイナリを生成する必要がある場合も、Fat JARが必要です。Fat JARを作成するには、[Gradle用Ktor](server-fatjar.md)プラグインまたは[Maven用Assembly](maven-assembly-plugin.md)プラグインを使用できます。

* **実行可能なJVMアプリケーション**

   実行可能なJVMアプリケーションは、コード依存関係と生成された起動スクリプトを含むパッケージ化されたアプリケーションです。Gradleの場合、[Application](server-packaging.md)プラグインを使用してアプリケーションを生成できます。

* **WAR**

   [WARアーカイブ](server-war.md)を使用すると、TomcatやJettyなどのサーブレットコンテナ内にアプリケーションをデプロイできます。

* **GraalVM**

   Ktorサーバーアプリケーションは、異なるプラットフォーム向けのネイティブイメージを作成するために[GraalVM](graalvm.md)を利用できます。

## コンテナ化 {id="containerizing"}

アプリケーションをパッケージ化した後（たとえば、実行可能なJVMアプリケーションまたはfat JARとして）、このアプリケーションを含む[Dockerイメージ](docker.md)を準備できます。このイメージは、Kubernetes、Swarm、または必要なクラウドサービスコンテナインスタンス上でアプリケーションを実行するために使用できます。

## 公開 {id="publishing"}

以下のチュートリアルでは、特定のクラウドプロバイダーにKtorアプリケーションをデプロイする方法を示します：
* [](google-app-engine.md)
* [](heroku.md)
* [](elastic-beanstalk.md)

## SSL {id="ssl"}

Ktorサーバーがリバースプロキシ（NginxやApacheなど）の背後に配置されている場合、またはサーブレットコンテナ（TomcatやJetty）内で実行されている場合、SSL設定はリバースプロキシまたはサーブレットコンテナによって管理されます。必要に応じて、Java KeyStoreを使用してKtorを[直接SSLをサービスする](server-ssl.md)ように設定できます。

> Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合、SSL設定は有効にならないことに注意してください。