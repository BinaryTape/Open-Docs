[//]: # (title: Dokku)

<show-structure for="chapter" depth="2"/>

<link-summary>KtorアプリケーションをDokkuに準備し、デプロイする方法について説明します。</link-summary>

[Dokku](https://dokku.com/) は、独自のLinuxサーバー上で動作し、[Heroku](heroku.md) に似たデプロイ・ワークフローを提供するセルフホスト型のPaaS（Platform-as-a-Service）です。Ktorアプリケーションは、ファットJAR（fat JAR）を手動でサーバーにコピーしてデプロイすることもできますが、Dokkuを使用すると周辺のインフラストラクチャを自動化できます。

*   **Gitベースのデプロイ** — `git push` でコードをプッシュすると、Dokkuがアプリケーションを自動的にビルドして再起動します。SSHによるファイルコピーや手動での再起動は不要です。
*   **プロセス管理** — Dokkuは、サーバーの再起動後も含め、アプリケーションの起動、停止、再起動を自動的に行います。
*   **1つのサーバーで複数のアプリを実行** — 各アプリケーションは分離されたコンテナ内で実行されるため、ポートの競合やアプリ間の干渉を防げます。
*   **HTTPS** — 1つのコマンドで、アプリにLet's Encrypt証明書をプロビジョニングできます。
*   **ゼロダウンタイム・デプロイ** — Dokkuは、新しいコンテナがヘルスチェックに合格するのを待ってから、古いコンテナからトラフィックを切り替えます。

Dokkuを実行するにはLinuxサーバーが必要です。いくつかのホスティングプロバイダーでは、Dokkuがプリインストールされたイメージを提供しているため、手動でセットアップする必要はありません：[DigitalOcean](https://marketplace.digitalocean.com/apps/dokku)、[Hostinger](https://www.hostinger.com/vps/dokku-hosting)、[HOSTKEY](https://hostkey.com/apps/developer-tools/dokku/)。

## 前提条件 {id="prerequisites"}
このチュートリアルを始める前に、以下の前提条件が満たされていることを確認してください。
* DokkuがインストールされたLinuxサーバーがあること。[手動でインストール](https://dokku.com/docs/getting-started/installation/)するか、プリインストールされたDokkuイメージを提供しているホスティングプロバイダーを使用できます。
* ローカルマシンに [Git](https://git-scm.com/downloads) がインストールされていること。

## アプリケーションの準備 {id="prepare-app"}

### ステップ 1：ポートの設定 {id="port"}

まず、着信リクエストをリッスンするために使用するポートを指定する必要があります。Dokkuは各アプリケーションに動的にポートを割り当て、それを環境変数 `PORT` を使用して渡します。アプリケーションは起動時にこの変数を読み取る必要があります。そうしないと、間違ったポートでリッスンしてしまい、Dokkuがトラフィックをルーティングできなくなる可能性があります。[Ktorサーバーの設定方法](server-create-and-configure.topic)に応じて、以下のいずれかを行ってください。

*   サーバーの設定をコードで指定している場合は、`System.getenv()` 関数を使用して環境変数を読み取り、それを `embeddedServer()` 関数の `port` パラメーターに渡します。
    ```kotlin
    fun main() {
        embeddedServer(Netty, port = System.getenv("PORT")?.toIntOrNull() ?: 8080) {
            // ...
        }.start(wait = true)
    }
    ```

*   サーバーの設定を構成ファイルで指定している場合は、`src/main/resources` にある <Path>application.conf</Path> または <Path>application.yaml</Path> ファイルを開き、以下のように `port` プロパティを更新します。

    <Tabs group="config">
    <TabItem title="application.conf" group-key="hocon">

    ```shell
    ktor {
        deployment {
            port = 8080
            port = ${?PORT}
        }
    }
    ```

    </TabItem>
    <TabItem title="application.yaml" group-key="yaml">

    ```yaml
    ktor:
        deployment:
            port: ${PORT:8080}
    ```

    </TabItem>
    </Tabs>

### ステップ 2：stageタスクの追加 {id="stage"}

<Path>build.gradle.kts</Path> ファイルを開き、Dokkuがアプリケーションのビルドに使用するカスタムの `stage` タスクを追加します。
```kotlin
tasks {
    register("stage").configure {
        dependsOn("installDist")
    }
}
```
> `installDist` タスクは、Gradleの [applicationプラグイン](https://docs.gradle.org/current/userguide/application_plugin.html) に含まれています。
>
{style="tip"}

### ステップ 3：Javaバージョンの指定 {id="java-version"}

プロジェクトのルートに <Path>system.properties</Path> ファイルを作成し、Javaバージョンを指定します。
```properties
java.runtime.version=21
```

このバージョンは、<Path>build.gradle.kts</Path> ファイルで指定されているJVMツールチェーンのバージョンと一致している必要があります。このファイルがない場合、Dokkuは利用可能な最新のJDKバージョンを使用しますが、これは時間の経過とともに変更され、予期しないビルド失敗の原因となる可能性があります。

### ステップ 4：Procfileの作成 {id="procfile"}

プロジェクトのルートに `Procfile` を作成し、以下の内容を追加します。
```text
web: ./build/install/<project-name>/bin/<project-name>
```
{style="block"}

このファイルは、[`stage`](#stage) タスクによってビルドされた後、Dokkuにアプリケーションの起動方法を指示します。
`<project-name>` をプロジェクト名に置き換えてください。プロジェクト名を確認するには、以下のコマンドを実行します。
```bash
./gradlew properties -q | grep "^name:" | sed 's/name: //'
```

## アプリケーションのデプロイ {id="deploy-app"}

Gitを使用してアプリケーションをDokkuにデプロイするには、新しいターミナルウィンドウを開き、以下の手順に従います。

1.  [前のセクション](#prepare-app)で行った変更をローカルでコミットします。
    ```bash
    git add .
    git commit -m "Prepare app for deploying"
    ```
2.  サーバーに接続し、Dokkuアプリケーションを作成します。
    `<app-name>` をアプリケーションの名前に置き換えてください。
    ```bash
    ssh <user>@<your-server> dokku apps:create <app-name>
    ```
3.  DokkuサーバーをGitリモートとして追加します。
    `<your-server>` をサーバーのホスト名またはIPアドレスに、`<app-name>` を前のステップで使用した名前に置き換えてください。
    ```bash
    git remote add dokku dokku@<your-server>:<app-name>
    ```
4.  コードをDokkuにプッシュして、ビルドとデプロイをトリガーします。
    ```bash
    git push dokku main
    ```
    ブランチ名が異なる場合は、`main` を使用しているブランチ名に置き換えてください。

    Ktorアプリケーションがサブディレクトリにある場合は、代わりに `git subtree push` を使用します。
    ```bash
    git subtree push --prefix=<subdir> dokku main
    ```
5.  Dokkuがアプリケーションをビルドして起動するまで待ちます。
    ```text
    ...
    =====> Application deployed:
           http://<app-name>.<your-server>
    ```
    {style="block"}
6.  アプリケーションにアクセスできるように、ドメインまたはIPアドレスを設定します。
    ```bash
    ssh <user>@<your-server> dokku domains:set <app-name> <domain-or-ip>
    ```
7.  アプリケーションは `http://<domain-or-ip>` で利用可能になります。