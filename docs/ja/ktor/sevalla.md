[//]: # (title: Sevalla)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktorアプリケーションを準備し、Sevallaにデプロイする方法を学びます。</link-summary>

このチュートリアルでは、Ktorアプリケーションを[Sevalla](https://sevalla.com/)に準備してデプロイする方法を学びます。[Ktorサーバーの作成](server-create-and-configure.topic)方法に応じて、以下のいずれかの初期プロジェクトを使用できます。

*   [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)

*   [Engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

## 前提条件 {id="prerequisites"}

このチュートリアルを開始する前に、[Sevallaアカウントを作成する](https://sevalla.com)必要があります（50ドルの無料クレジットが付属しています）。

## サンプルアプリケーションをクローンする {id="clone-sample-app"}

サンプルアプリケーションを開くには、以下の手順に従ってください。

1.  [Ktorドキュメントリポジトリ](https://github.com/ktorio/ktor-documentation)をクローンします。
2.  [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets)プロジェクトを開きます。
3.  [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)または[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルを開きます。これらは、Ktorサーバーを設定するための2つの異なるアプローチ（コード内で直接設定するか、外部設定ファイルを使用するか）を示すものです。これらのプロジェクトをデプロイする上での唯一の違いは、受信リクエストをリッスンするために使用するポートの指定方法です。

## アプリケーションを準備する {id="prepare-app"}

### ステップ1: ポートを設定する {id="port"}

Sevallaは、`PORT`環境変数を使用してランダムなポートを注入します。アプリケーションはそのポートをリッスンするように設定する必要があります。

コードでサーバー構成が指定されている[embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)サンプルを選択した場合、`System.getenv()`を使用して環境変数値を取得できます。<Path>src/main/kotlin/com/example</Path>フォルダーにある<Path>Application.kt</Path>ファイルを開き、`embeddedServer()`関数のポートパラメーター値を以下に示すように変更します。

```kotlin
fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    embeddedServer(Netty, port = port, host = "0.0.0.0") {
        // ...
    }.start(wait = true)
}
```

<Path>application.conf</Path>ファイルでサーバー構成が指定されている[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルを選択した場合、`${ENV}`構文を使用して、環境変数をポートパラメーターに割り当てることができます。<Path>src/main/resources</Path>に配置されている<Path>application.conf</Path>ファイルを開き、以下に示すように更新します。

```hocon
ktor {
  deployment {
    port = 5000
    port = ${?PORT}
  }
  application {
    modules = [ com.example.ApplicationKt.module ]
  }
}
```

### ステップ2: Dockerfileを追加する {id="dockerfile"}

SevallaでKtorプロジェクトをビルドして実行するには、Dockerfileが必要です。以下に、マルチステージビルドを使用したDockerfileの例を示します。

```docker
# Stage 1: Build the app
FROM gradle:8.5-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle installDist

# Stage 2: Run the app
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/install/<project-name>/ ./
ENV PORT=8080
CMD ["./bin/<project-name>"]
```

`<project-name>`は、<Path>settings.gradle.kts</Path>ファイルで定義されているプロジェクト名に置き換えてください。

```kotlin
rootProject.name = "ktor-app"
```

## アプリケーションをデプロイする {id="deploy-app"}

Sevallaは、接続されたGitリポジトリからアプリケーションを直接ビルドおよびデプロイします。これは、GitHub、GitLab、Bitbucket、またはその他のサポートされているGitプロバイダーのようなプラットフォームでホストできます。正常にデプロイするには、プロジェクトがコミットおよびプッシュされ、必要なすべてのファイル（Dockerfile、<Path>build.gradle.kts</Path>、ソースコードなど）が含まれていることを確認してください。

アプリケーションをデプロイするには、[Sevalla](https://sevalla.com/)にサインインし、以下の手順に従ってください。

1.  **Applications -> Create an app** をクリックします。
    ![Sevalla add app](../images/sevalla-add-app.jpg)
2.  Gitリポジトリを選択し、適切なブランチ（通常は`main`または`master`）を選択します。
3.  **アプリケーション名**を設定し、**リージョン**を選択し、**ポッドサイズ**を選択します（0.5 CPU / 1GB RAMから開始できます）。
4.  **Create**をクリックしますが、デプロイ手順は今はスキップします。
    ![Sevalla create app](../images/sevalla-deployment-create-app.png)
5.  **Settings -> Build** に移動し、**Build environment**カードの下にある**Update Settings**をクリックします。
    ![Sevalla update build settings](../images/sevalla-deployment-update-build-settings.png)
6.  ビルド方法を**Dockerfile**に設定します。
    ![Sevalla Dockerfile settings](../images/sevalla-deployment-docker-settings.png)
7.  **Dockerfile path**が`Dockerfile`であり、**Context**が`.`であることを確認します。
8.  アプリケーションの**Deployment**タブに戻り、**Deploy**をクリックします。

Sevallaは、Gitリポジトリをクローンし、Dockerfileを使用してDockerイメージをビルドし、`PORT`環境変数を注入し、アプリケーションを実行します。すべてが正しく構成されていれば、Ktorアプリは`https://<your-app>.sevalla.app`で公開されます。