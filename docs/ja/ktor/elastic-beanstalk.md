[//]: # (title: AWS Elastic Beanstalk)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初期プロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a> または 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>最終プロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/aws-elastic-beanstalk">aws-elastic-beanstalk</a>
</p>
</tldr>

このチュートリアルでは、KtorアプリケーションをAWS Elastic Beanstalkに準備してデプロイする方法を説明します。[Ktorサーバーの作成方法](server-create-and-configure.topic)に応じて、以下の初期プロジェクトのいずれかを使用できます。
* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)
* [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

> Javaアプリケーションのデプロイの詳細については、[Elastic Beanstalkのドキュメント](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Java.html)を参照してください。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、AWSアカウントを作成する必要があります。

## サンプルアプリケーションをクローンする {id="clone"}
サンプルアプリケーションを開くには、以下の手順に従ってください。

1. Ktorドキュメンテーションのリポジトリをクローンし、[codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets)プロジェクトを開きます。
2. [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)または[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルを開きます。これらのサンプルは、[Ktorサーバーの作成と構成](server-create-and-configure.topic)における異なるアプローチ（コード内または設定ファイルを使用）を示しています。これらのプロジェクトをデプロイする唯一の違いは、受信リクエストをリッスンするために使用する[ポートを指定する方法](#port)です。

## アプリケーションの準備 {id="prepare-app"}

### ステップ1: ポートの設定 {id="port"}

まず、受信リクエストをリッスンするために使用するポートを指定する必要があります。Elastic Beanstalkは、ポート5000でアプリケーションにリクエストを転送します。オプションとして、`PORT`環境変数を設定することでデフォルトポートをオーバーライドできます。[Ktorサーバーを構成する](server-create-and-configure.topic)方法に応じて、以下のいずれかの方法でポートを設定できます。
* コードでサーバー設定が指定されている[embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)サンプルを選択した場合、`System.getenv`を使用して環境変数の値を取得するか、環境変数が指定されていない場合にデフォルトの_5000_の値を使用できます。`src/main/kotlin/com/example`フォルダーにある`Application.kt`ファイルを開き、以下に示すように`embeddedServer`関数の`port`パラメーターの値を変更します。
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = (System.getenv("PORT")?:"5000").toInt()) {
      // ...
      }.start(wait = true)
   }
    ```

* `application.conf`ファイルでサーバー設定が指定されている[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルを選択した場合、`${ENV}`構文を使用して環境変数を`port`パラメーターに割り当てることができます。`src/main/resources`にある`application.conf`ファイルを開き、以下に示すように更新します。
   [object Promise]

### ステップ2: Ktorプラグインの適用 {id="configure-ktor-plugin"}
このチュートリアルでは、[Fat JAR](server-fatjar.md)を使用してElastic Beanstalkにアプリケーションをデプロイする方法を示します。Fat JARを生成するには、Ktorプラグインを適用する必要があります。`build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
[object Promise]

次に、[メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が設定されていることを確認してください。
[object Promise]

## Fat JARのビルド {id="build"}
Fat JARをビルドするには、ターミナルを開き、[Ktorプラグイン](#configure-ktor-plugin)によって提供される`buildFatJar`タスクを実行します。

<tabs group="os">
<tab title="Linux/macOS" group-key="unix">
[object Promise]
</tab>
<tab title="Windows" group-key="windows">
[object Promise]
</tab>
</tabs>

このビルドが完了すると、`build/libs`ディレクトリに`aws-elastic-beanstalk-all.jar`ファイルが表示されるはずです。

## アプリケーションのデプロイ {id="deploy-app"}
アプリケーションをデプロイするには、[AWS マネジメントコンソール](https://aws.amazon.com/console/)にサインインし、以下の手順に従ってください。
1. **AWSサービス**グループの**Elastic Beanstalk**サービスを開きます。
2. 開いたページで、**アプリケーションの作成**をクリックします。
3. 以下のアプリケーション設定を指定します。
   * **アプリケーション名**: アプリケーション名を指定します（例: _Sample Ktor app_）。
   * **プラットフォーム**: リストから_Java_を選択します。
   * **プラットフォームブランチ**: _Corretto 11 running on 64bit Amazon Linux 2_を選択します。
   * **アプリケーションコード**: _コードをアップロード_を選択します。
   * **ソースコードのオリジン**: _ローカルファイル_を選択します。次に、**ファイルの選択**ボタンをクリックし、[前の手順](#build)で生成されたFat JARを選択します。ファイルがアップロードされるまで待ちます。
4. **アプリケーションの作成**ボタンをクリックし、Beanstalkが環境を作成し、アプリケーションを公開するまで数分間待ちます。
   ```
   INFO    Instance deployment completed successfully.
   INFO    Application available at Samplektorapp-env.eba-bnye2kpu.us-east-2.elasticbeanstalk.com.
   INFO    Successfully launched environment: Samplektorapp-env
   ```
   {style="block"}