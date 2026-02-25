[//]: # (title: Heroku)

<show-structure for="chapter" depth="2"/>

<link-summary>KtorアプリケーションをHerokuにデプロイするための準備とデプロイ方法について学びます。</link-summary>

このチュートリアルでは、KtorアプリケーションをHerokuにデプロイするための準備とデプロイ方法について説明します。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、以下の前提条件が満たされていることを確認してください。
* Herokuアカウントを持っていること。
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) がマシンにインストールされていること。

## サンプルアプリケーションの作成 {id="create-sample-app"}

[Ktorプロジェクトの作成、オープン、実行](server-create-a-new-project.topic)の説明に従って、サンプルアプリケーションを作成します。

> Ktorには[サーバーを作成および構成する](server-create-and-configure.topic)ための2つのアプローチ（コード内での設定、または設定ファイルの使用）があることに注意してください。デプロイにおける唯一の違いは、着信リクエストを待機するために使用される[ポートの指定方法](#port)です。

## アプリケーションの準備 {id="prepare-app"}

### ステップ1：ポートの構成 {id="port"}

まず、着信リクエストを待機するために使用するポートを指定する必要があります。Herokuは `PORT` 環境変数を使用するため、この変数の値を使用するようにアプリケーションを構成する必要があります。[Ktorサーバーを構成する](server-create-and-configure.topic)方法に応じて、以下のいずれかを行ってください。
* サーバーの構成がコード内で指定されている場合は、`System.getenv` を使用して環境変数の値を取得できます。`src/main/kotlin/com/example` フォルダにある `Application.kt` ファイルを開き、以下に示すように `embeddedServer` 関数の `port` パラメータの値を変更します。
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT")?.toIntOrNull() ?: 8080) {
          // ...
      }.start(wait = true)
   }
    ```

* サーバーの構成が `application.conf` ファイルで指定されている場合は、`${ENV}` 構文を使用して環境変数を `port` パラメータに割り当てることができます。`src/main/resources` にある `application.conf` ファイルを開き、以下のように更新します。
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### ステップ2：stageタスクの追加 {id="stage"}
`build.gradle.kts` ファイルを開き、Herokuのプラットフォームで実行される実行ファイルを作成するためにHerokuが使用するカスタム `stage` タスクを追加します。
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
``` 
なお、`installDist` タスクはGradleの [applicationプラグイン](https://docs.gradle.org/current/userguide/application_plugin.html) に含まれており、サンプルプロジェクトにはすでに追加されています。

### ステップ3：Procfileの作成 {id="procfile"}
プロジェクトのルートに [Procfile](https://devcenter.heroku.com/articles/procfile) を作成し、以下の内容を追加します。
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

このファイルは、[stage](#stage) タスクによって生成されたアプリケーションの実行ファイルへのパスを指定し、Herokuがアプリケーションを開始できるようにします。
`ktor-get-started-sample` をプロジェクト名に置き換える必要がある場合があります。

## アプリケーションのデプロイ {id="deploy-app"}

Gitを使用してHerokuにアプリケーションをデプロイするには、ターミナルを開き、以下の手順に従います。

1. [前のセクション](#prepare-app) で行った変更をローカルにコミットします。
   ```Bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. Heroku CLIにログインします。
   ```Bash
   heroku login
   ```
3. `heroku create` コマンドを使用してHerokuアプリケーションを作成します。
   `ktor-sample-heroku` をアプリケーションの名前に置き換えてください。
   ```Bash
   heroku create ktor-sample-heroku
   ```
   このコマンドは2つのことを行います。
   * [Webダッシュボード](https://dashboard.heroku.com/apps/) で利用可能な新しいHerokuアプリケーションを作成します。
   * ローカルリポジトリに `heroku` という名前の新しいGitリモートを追加します。

4. アプリケーションをデプロイするには、変更を `heroku main` にプッシュします。
   ```Bash
   git push heroku main
   ```
   ...そしてHerokuがアプリケーションをビルドして公開するまで待ちます。
   ```
   ...
   remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
   remote:
   remote: Verifying deploy... done.
   ```
   {style="block"}