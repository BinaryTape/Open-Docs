[//]: # (title: Heroku)

<show-structure for="chapter" depth="2"/>

<link-summary>KtorアプリケーションをHerokuに準備してデプロイする方法を学びましょう。</link-summary>

このチュートリアルでは、KtorアプリケーションをHerokuに準備してデプロイする方法を説明します。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、以下の前提条件が満たされていることを確認してください。
* Herokuアカウントを持っていること。
* お使いのマシンに[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)がインストールされていること。

## サンプルアプリケーションの作成 {id="create-sample-app"}

[新しいKtorプロジェクトの作成、開く、実行](server-create-a-new-project.topic)で説明されているように、サンプルアプリケーションを作成します。

> Ktorには、[サーバーを作成および設定](server-create-and-configure.topic)する2つのアプローチがあります。コードで設定するか、構成ファイルを使用するかです。デプロイにおける唯一の違いは、着信リクエストをリッスンするために使用する[ポートを指定する](#port)方法です。

## アプリケーションの準備 {id="prepare-app"}

### ステップ1: ポートの構成 {id="port"}

まず、着信リクエストをリッスンするために使用するポートを指定する必要があります。Herokuは`PORT`環境変数を使用するため、この変数の値を使用するようにアプリケーションを構成する必要があります。[Ktorサーバーを構成する](server-create-and-configure.topic)方法に応じて、以下のいずれかを実行します。
* サーバー構成がコードで指定されている場合、`System.getenv`を使用して環境変数の値を取得できます。`src/main/kotlin/com/example`フォルダーに配置されている`Application.kt`ファイルを開き、以下に示すように`embeddedServer`関数の`port`パラメーター値を変更します。
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
          // ...
      }.start(wait = true)
   }
    ```

* サーバー構成が`application.conf`ファイルで指定されている場合、`${ENV}`構文を使用して環境変数を`port`パラメーターに割り当てることができます。`src/main/resources`に配置されている`application.conf`ファイルを開き、以下に示すように更新します。
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### ステップ2: stageタスクの追加 {id="stage"}
`build.gradle.kts`ファイルを開き、HerokuがHerokuのプラットフォームで実行される実行可能ファイルを作成するために使用するカスタム`stage`タスクを追加します。
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
``` 
`installDist`タスクはGradleの[アプリケーションプラグイン](https://docs.gradle.org/current/userguide/application_plugin.html)に含まれており、これはすでにサンプルプロジェクトに追加されていることに注意してください。

### ステップ3: Procfileの作成 {id="procfile"}
プロジェクトのルートに[Procfile](https://devcenter.heroku.com/articles/procfile)を作成し、以下の内容を追加します。
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

このファイルは、[stage](#stage)タスクによって生成されたアプリケーションの実行可能ファイルへのパスを指定し、Herokuがアプリケーションを起動できるようにします。
`ktor-get-started-sample`をプロジェクト名に置き換える必要がある場合があります。

## アプリケーションのデプロイ {id="deploy-app"}

Gitを使用してアプリケーションをHerokuにデプロイするには、ターミナルを開いて以下の手順に従ってください。

1. [前のセクション](#prepare-app)で行った変更をローカルでコミットします。
   ```Bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. Heroku CLIにログインします。
   ```Bash
   heroku login
   ```
3. `heroku create`コマンドを使用してHerokuアプリケーションを作成します。
   `ktor-sample-heroku`をアプリケーションの名前に置き換える必要があります。
   ```Bash
   heroku create ktor-sample-heroku
   ```
   このコマンドは2つのことを行います。
   * 新しいHerokuアプリケーションを作成します。これは[Webダッシュボード](https://dashboard.heroku.com/apps/)で利用可能です。
   * ローカルリポジトリに`heroku`という新しいGitリモートを追加します。

4. アプリケーションをデプロイするには、変更を`heroku main`にプッシュします...
   ```Bash
   git push heroku main
   ```
   ...そして、Herokuがアプリケーションをビルドして公開するまで待ちます。
   ```
   ...
   remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
   remote:
   remote: Verifying deploy... done.
   ```
   {style="block"}