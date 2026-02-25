[//]: # (title: Sevalla)

<show-structure for="chapter" depth="2"/>

<link-summary>KtorアプリケーションをSevallaに準備してデプロイする方法を学びます。</link-summary>

このチュートリアルでは、Ktorアプリケーションを[Sevalla](https://sevalla.com/)に準備およびデプロイする方法を学びます。[Ktorサーバーの作成方法](server-create-and-configure.topic)に応じて、以下のいずれかの初期プロジェクトを使用できます。

* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)

* [Engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

## 前提条件 {id="prerequisites"}

このチュートリアルを始める前に、[Sevallaアカウントを作成](https://sevalla.com)する必要があります（50ドルの無料クレジットが付属しています）。

## サンプルアプリケーションのクローン {id="clone-sample-app"}

サンプルアプリケーションを開くには、以下の手順に従ってください。

1. [Ktorドキュメントのリポジトリ](https://github.com/ktorio/ktor-documentation)をクローンします。
2. [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets)プロジェクトを開きます。
3. [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)または[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルを開きます。これらは、コード内で直接構成するか、外部構成ファイルを介して構成するかの、Ktorサーバーをセットアップする2つの異なるアプローチを示しています。これらのプロジェクトのデプロイにおける唯一の違いは、受信リクエストをリッスンするために使用するポートの指定方法です。

## アプリケーションの準備 {id="prepare-app"}

### ステップ1：ポートの構成 {id="port"}

Sevallaは、`PORT`環境変数を使用してランダムなポートを注入します。アプリケーションはそのポートでリッスンするように構成されている必要があります。

サーバー構成がコードで指定されている[embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)サンプルを選択した場合は、`System.getenv()`を使用して環境変数の値を取得できます。<Path>src/main/kotlin/com/example</Path>フォルダにある<Path>Application.kt</Path>ファイルを開き、以下に示すように`embeddedServer()`関数のポートパラメータ値を変更します。

```kotlin
fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    embeddedServer(Netty, port = port, host = "0.0.0.0") {
        // ...
    }.start(wait = true)
}
```

サーバー構成が<Path>application.conf</Path>ファイルで指定されている[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルを選択した場合は、`${ENV}`構文を使用して環境変数をポートパラメータに割り当てることができます。<Path>src/main/resources</Path>にある<Path>application.conf</Path>ファイルを開き、以下のように更新します。

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

### ステップ2：Dockerfileの追加 {id="dockerfile"}

SevallaでKtorプロジェクトをビルドして実行するには、Dockerfileが必要です。以下は、マルチステージビルド（multi-stage build）を使用したDockerfileのサンプルです。

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

## アプリケーションのデプロイ {id="deploy-app"}

Sevallaは、接続されたGitリポジトリからアプリケーションを直接ビルドしてデプロイします。これはGitHub、GitLab、Bitbucket、またはサポートされている任意のGitプロバイダーでホストできます。正常にデプロイするために、プロジェクトがコミットおよびプッシュされており、必要なすべてのファイル（Dockerfile、<Path>build.gradle.kts</Path>、ソースコードなど）が含まれていることを確認してください。

アプリケーションをデプロイするには、[Sevalla](https://sevalla.com/)にサインインして、以下の手順に従ってください。

1. **Applications -> Create an app** をクリックします。
  ![Sevalla add app](../images/sevalla-add-app.jpg)
2. Gitリポジトリを選択し、適切なブランチ（通常は `main` または `master`）を選択します。
3. **application name**（アプリケーション名）を設定し、**region**（リージョン）を選択し、**pod size**（ポッドサイズ）を選択します（0.5 CPU / 1GB RAMから開始できます）。
4. **Create** をクリックしますが、現時点ではデプロイ手順をスキップします。
  ![Sevalla create app](../images/sevalla-deployment-create-app.png)
5. **Settings -> Build** に移動し、**Build environment** カードの下にある **Update Settings** をクリックします。
  ![Sevalla update build settings](../images/sevalla-deployment-update-build-settings.png)
6. ビルド方法（Build method）を **Dockerfile** に設定します。
  ![Sevalla Dockerfile settings](../images/sevalla-deployment-docker-settings.png)
7. **Dockerfile path** が `Dockerfile` で、**Context**（コンテキスト）が `.` であることを確認します。
8. アプリケーションの **Deployment** タブに戻り、**Deploy** をクリックします。

SevallaはGitリポジトリをクローンし、Dockerfileを使用してDockerイメージをビルドし、`PORT`環境変数を注入して、アプリケーションを実行します。すべてが正しく構成されていれば、Ktorアプリは `https://<your-app>.sevalla.app` で公開されます。