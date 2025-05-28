[//]: # (title: Heroku)

<show-structure for="chapter" depth="2"/>

<link-summary>HerokuにKtorアプリケーションを準備してデプロイする方法を学びます。</link-summary>

このチュートリアルでは、HerokuにKtorアプリケーションを準備してデプロイする方法を説明します。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、以下の前提条件が満たされていることを確認してください。
* Herokuアカウントを所有していること。
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)がマシンにインストールされていること。

## サンプルアプリケーションを作成する {id="create-sample-app"}

[](server-create-a-new-project.topic)で説明されているように、サンプルアプリケーションを作成します。

> 注意点として、Ktorでは、[サーバーを作成および設定する](server-create-and-configure.topic)2つのアプローチ（コード内または設定ファイルを使用）が提供されます。デプロイにおける唯一の違いは、着信リクエストをリッスンするために使用する[ポートを指定する方法](#port)です。

## アプリケーションを準備する {id="prepare-app"}

### ステップ1: ポートを設定する {id="port"}

まず、着信リクエストをリッスンするために使用するポートを指定する必要があります。Herokuは`PORT`環境変数を使用するため、この変数の値を使用するようにアプリケーションを設定する必要があります。[Ktorサーバーを設定する](server-create-and-configure.topic)方法に応じて、以下のいずれかを実行してください。
* サーバー設定がコード内で指定されている場合、`System.getenv`を使用して環境変数の値を取得できます。`src/main/kotlin/com/example`フォルダにある`Application.kt`ファイルを開き、`embeddedServer`関数の`port`パラメータの値を以下のように変更してください。
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
          // ...
      }.start(wait = true)
   }
    ```

* サーバー設定が`application.conf`ファイルで指定されている場合、`${ENV}`構文を使用して、環境変数を`port`パラメータに割り当てることができます。`src/main/resources`にある`application.conf`ファイルを開き、以下のように更新してください。
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### ステップ2: `stage`タスクを追加する {id="stage"}
`build.gradle.kts`ファイルを開き、Herokuがそのプラットフォームで実行する実行可能ファイルを作成するために使用するカスタム`stage`タスクを追加します。
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
``` 
なお、`installDist`タスクはGradleの[アプリケーションプラグイン](https://docs.gradle.org/current/userguide/application_plugin.html)に付属しており、これはすでにサンプルプロジェクトに追加されています。

### ステップ3: Procfileを作成する {id="procfile"}
プロジェクトのルートに[Procfile](https://devcenter.heroku.com/articles/procfile)を作成し、以下の内容を追加します。
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

このファイルは、[stage](#stage)タスクによって生成されたアプリケーションの実行可能ファイルへのパスを指定し、Herokuがアプリケーションを起動できるようにします。
`ktor-get-started-sample`をプロジェクト名に置き換える必要がある場合があります。

## アプリケーションをデプロイする {id="deploy-app"}

Gitを使用してHerokuにアプリケーションをデプロイするには、ターミナルを開き、以下の手順に従ってください。

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

4. アプリケーションをデプロイするには、`heroku main`に変更をプッシュします。
   ```Bash
   git push heroku main
   ```
   ...そしてHerokuがアプリケーションをビルドして公開するのを待ちます。
   ```
   ...
   remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
   remote:
   remote: Verifying deploy... done.
   ```
   {style="block"}