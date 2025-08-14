[//]: # (title: ヘロク)

<show-structure for="chapter" depth="2"/>

<link-summary>KtorアプリケーションをHerokuに準備してデプロイする方法を学習します。</link-summary>

このチュートリアルでは、KtorアプリケーションをHerokuに準備してデプロイする方法を紹介します。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、以下の前提条件が満たされていることを確認してください。
* Herokuアカウントを持っていること。
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) がマシンにインストールされていること。

## サンプルアプリケーションを作成する {id="create-sample-app"}

[](server-create-a-new-project.topic) で説明されているように、サンプルアプリケーションを作成します。

> 注意点として、Ktorは、[サーバーの作成と構成](server-create-and-configure.topic) に2つのアプローチを提供します。コード内、または設定ファイルを使用するアプローチです。デプロイ時の唯一の違いは、受信リクエストをリッスンするために使用する[ポートの指定](#port) 方法です。

## アプリケーションを準備する {id="prepare-app"}

### ステップ 1: ポートを構成する {id="port"}

まず、受信リクエストをリッスンするために使用するポートを指定する必要があります。Herokuは `PORT` 環境変数を使用するため、この変数の値を使用するようにアプリケーションを構成する必要があります。[Ktorサーバーの構成方法](server-create-and-configure.topic) に応じて、次のいずれかの操作を実行します。
* サーバー構成がコードで指定されている場合、`System.getenv` を使用して環境変数の値を取得できます。`src/main/kotlin/com/example` フォルダーに配置されている `Application.kt` ファイルを開き、以下に示すように `embeddedServer` 関数の `port` パラメーター値を変更します。
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
          // ...
      }.start(wait = true)
   }
    ```

* サーバー構成が `application.conf` ファイルで指定されている場合、`${ENV}` 構文を使用して、環境変数を `port` パラメーターに割り当てることができます。`src/main/resources` に配置されている `application.conf` ファイルを開き、以下に示すように更新します。
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### ステップ 2: stageタスクを追加する {id="stage"}
`build.gradle.kts` ファイルを開き、Herokuのプラットフォームで実行される実行可能ファイルを作成するためにHerokuが使用するカスタム `stage` タスクを追加します。
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
```
なお、`installDist` タスクはGradleの[アプリケーションプラグイン](https://docs.gradle.org/current/userguide/application_plugin.html)に付属しており、サンプルプロジェクトにはすでに追加されています。

### ステップ 3: Procfileを作成する {id="procfile"}
プロジェクトのルートに[Procfile](https://devcenter.heroku.com/articles/procfile) を作成し、以下の内容を追加します。
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

このファイルは、[stage](#stage) タスクによって生成されたアプリケーションの実行可能ファイルへのパスを指定し、Herokuがアプリケーションを起動できるようにします。
`ktor-get-started-sample` をプロジェクト名に置き換える必要があるかもしれません。

## アプリケーションをデプロイする {id="deploy-app"}

Gitを使用してアプリケーションをHerokuにデプロイするには、ターミナルを開き、以下の手順を実行します。

1. [前のセクション](#prepare-app) で行った変更をローカルでコミットします。
   ```Bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. Heroku CLIにログインします。
   ```Bash
   heroku login
   ```
3. `heroku create` コマンドを使用してHerokuアプリケーションを作成します。
   `ktor-sample-heroku` をアプリケーションの名前に置き換える必要があります。
   ```Bash
   heroku create ktor-sample-heroku
   ```
   このコマンドは2つのことを行います。
   * 新しいHerokuアプリケーションを作成します。これは[Webダッシュボード](https://dashboard.heroku.com/apps/)で利用できます。
   * ローカルリポジトリに `heroku` という新しいGitリモートを追加します。

4. アプリケーションをデプロイするには、`heroku main` に変更をプッシュします…
   ```Bash
   git push heroku main
   ```
   …そしてHerokuがアプリケーションをビルドして公開するまで待ちます。
   ```
   ...
   remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
   remote:
   remote: Verifying deploy... done.
   ```
   {style="block"}