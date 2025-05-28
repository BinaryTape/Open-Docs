[//]: # (title: AWS Elastic Beanstalk)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初期プロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a> または 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>完成プロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/aws-elastic-beanstalk">aws-elastic-beanstalk</a>
</p>
</tldr>

このチュートリアルでは、KtorアプリケーションをAWS Elastic Beanstalkに準備してデプロイする方法を説明します。[Ktorサーバーの作成](server-create-and-configure.topic)に使用した方法に応じて、以下の初期プロジェクトのいずれかを使用できます。
* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)
* [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

> [Elastic Beanstalkドキュメント](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Java.html)でJavaアプリケーションのデプロイについて詳しく学ぶことができます。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、AWSアカウントを作成する必要があります。

## サンプルアプリケーションのクローン作成 {id="clone"}
サンプルアプリケーションを開くには、以下の手順に従ってください。

1. Ktorドキュメンテーションリポジトリのクローンを作成し、[codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets)プロジェクトを開きます。
2. [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)または[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルを開きます。これらのサンプルは、[Ktorサーバーの作成と構成](server-create-and-configure.topic)に対する異なるアプローチを示しています。コード内または設定ファイルを使用する方法です。これらのプロジェクトをデプロイする唯一の違いは、受信リクエストをリッスンするために使用する[ポートを指定する方法](#port)です。

## アプリケーションの準備 {id="prepare-app"}

### ステップ1: ポートの設定 {id="port"}

まず、受信リクエストをリッスンするために使用するポートを指定する必要があります。Elastic Beanstalkは、ポート5000であなたのアプリケーションにリクエストを転送します。オプションで、`PORT`環境変数を設定することにより、デフォルトのポートを上書きできます。[Ktorサーバーの構成方法](server-create-and-configure.topic)に応じて、以下のいずれかの方法でポートを設定できます。
* コードでサーバー設定が指定されている[embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)サンプルを選択した場合、`System.getenv`を使用して環境変数の値を取得するか、環境変数が指定されていない場合にデフォルトの`5000`値を使用できます。`src/main/kotlin/com/example`フォルダーに配置されている`Application.kt`ファイルを開き、`embeddedServer`関数の`port`パラメーター値を以下に示すように変更します。
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = (System.getenv("PORT")?:"5000").toInt()) {
      // ...
      }.start(wait = true)
   }
    ```

* `application.conf`ファイルでサーバー設定が指定されている[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルを選択した場合、`${ENV}`構文を使用して、環境変数を`port`パラメーターに割り当てることができます。`src/main/resources`に配置されている`application.conf`ファイルを開き、以下に示すように更新します。
   ```
   ```
  {src="snippets/aws-elastic-beanstalk/src/main/resources/application.conf" include-lines="1-5,9" style="block"}

### ステップ2: Ktorプラグインの適用 {id="configure-ktor-plugin"}
このチュートリアルでは、[fat JAR](server-fatjar.md)を使用してElastic Beanstalkにアプリケーションをデプロイする方法を示します。fat JARを生成するには、Ktorプラグインを適用する必要があります。`build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
```groovy
```
{src="snippets/aws-elastic-beanstalk/build.gradle.kts" include-lines="3,6-7"}

次に、[メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が構成されていることを確認してください。
```kotlin
```
{src="snippets/aws-elastic-beanstalk/build.gradle.kts" include-lines="9-11"}

## Fat JARのビルド {id="build"}
Fat JARをビルドするには、ターミナルを開き、[Ktorプラグイン](#configure-ktor-plugin)によって提供される`buildFatJar`タスクを実行します。

<tabs group="os">
<tab title="Linux/macOS" group-key="unix">
<code-block>./gradlew :aws-elastic-beanstalk:buildFatJar</code-block>
</tab>
<tab title="Windows" group-key="windows">
<code-block>gradlew.bat :aws-elastic-beanstalk:buildFatJar</code-block>
</tab>
</tabs>

このビルドが完了すると、`build/libs`ディレクトリに`aws-elastic-beanstalk-all.jar`ファイルが表示されるはずです。

## アプリケーションのデプロイ {id="deploy-app"}
アプリケーションをデプロイするには、[AWSマネジメントコンソール](https://aws.amazon.com/console/)にサインインし、以下の手順に従ってください。
1. **AWSサービス**グループの**Elastic Beanstalk**サービスを開きます。
2. 開いたページで、**アプリケーションの作成**をクリックします。
3. 以下のアプリケーション設定を指定します。
   * **アプリケーション名**: アプリケーション名を指定します (例: _Sample Ktor app_)。
   * **プラットフォーム**: リストから_Java_を選択します。
   * **プラットフォームブランチ**: _Corretto 11 running on 64bit Amazon Linux 2_を選択します。
   * **アプリケーションコード**: _コードのアップロード_を選択します。
   * **ソースコードのオリジン**: _ローカルファイル_を選択します。次に、**ファイルを選択**ボタンをクリックし、[前のステップ](#build)で生成されたFat JARを選択します。ファイルがアップロードされるまで待ちます。
4. **アプリケーションの作成**ボタンをクリックし、Beanstalkが環境を作成してアプリケーションを公開するまで数分間待ちます。
   ```
   INFO    Instance deployment completed successfully.
   INFO    Application available at Samplektorapp-env.eba-bnye2kpu.us-east-2.elasticbeanstalk.com.
   INFO    Successfully launched environment: Samplektorapp-env
   ```
   {style="block"}