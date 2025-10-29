[//]: # (title: Azure App Service)

<show-structure for="chapter" depth="2"/>

<link-summary>このチュートリアルでは、Ktorアプリケーションをビルド、設定、デプロイする方法を[Azure App Service](https://azure.microsoft.com/products/app-service/)に示します。</link-summary>

このチュートリアルでは、Ktorアプリケーションをビルド、設定、デプロイする方法を[Azure App Service](https://azure.microsoft.com/products/app-service/)に示します。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、以下が必要です。
* Azureアカウント（[無料試用版はこちら](https://azure.microsoft.com/en-us/free/)）。
* [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)がマシンにインストールされていること。

## サンプルアプリケーションを作成する {id="create-sample-app"}

[新しいKtorプロジェクトの作成、オープン、実行](server-create-a-new-project.topic)で説明されているように、サンプルアプリケーションを作成します。この例では、以下のプロジェクトに基づいたコードとコマンドを示しています。[embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)と[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

> 上記のチュートリアルでは、アプリケーションを設定する2つの方法を提供しています。値をコードで直接指定するか、設定ファイルを使用するかのいずれかです。どちらの場合でも、重要な設定はサーバーが受信リクエストをリッスンするポートです。

## アプリケーションを設定する {id="setup-app"}

### ステップ1: ポートを設定する {id="port"}

Azure App Serviceでは、環境変数 `PORT` に受信リクエスト用に開かれているポート番号が含まれています。[Ktorサーバーの構成](server-create-and-configure.topic)でアプリを作成した方法に応じて、この環境変数を読み取るためにコードを次のいずれかの場所で更新する必要があります。

* ポート設定を**コード内**で行う例を使用した場合は、環境変数 `PORT` は `System.getenv()` で読み取り、`.toIntOrNull()` で整数にパースできます。ファイル `Application.kt` を開き、以下に示すようにポート番号を変更します。

   ```kotlin
   fun runBasicServer() {
      val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
      embeddedServer(Netty, port = port) {
          // ...
      }.start(wait = true)
   }
    ```
* サーバー設定が設定ファイル `application.conf` で定義されている場合は、以下の例のように `PORT` 環境変数を読み取るように更新します。

   ```
   ktor {
       deployment {
           port = ${PORT:8080}
       }
   }
   ```
   {style="block"}

### ステップ2: プラグインを追加する {id="plugins"}
ファイル `build.gradle.kts` を開き、`plugins` セクションに以下の行を追加します。
```kotlin
plugins {
    application
    kotlin("jvm")
    id("io.ktor.plugin") version "%ktor_version%" // ADDED
    id("com.microsoft.azure.azurewebapp") version "1.10.0" // ADDED
}
```

`io.ktor.plugin` は、[fat JAR](server-fatjar.md)を作成するために使用されるタスクを提供します。そして、[Azure WebApp Plugin for Gradle](https://github.com/microsoft/azure-gradle-plugins)は、Azureで必要なすべてのリソースを簡単に作成するために使用されます。

`application` セクションに `mainClass` が定義されていることを確認してください。これにより、fat JARの明確なエントリポイントが確保されます。

```kotlin
application {
    mainClass.set("com.example.ApplicationKt")
}
```
`engine-main` テンプレートでプロジェクトを作成した場合、メインクラスは以下のようになります。

```kotlin
application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}
```

### ステップ3: 設定 {id="configuration"}

App Serviceに既にデプロイしたいJavaウェブアプリを作成している場合は、このステップをスキップできます。

それ以外の場合は、Azure Webapp Pluginがウェブアプリを作成するように、ファイルの末尾に `build.gradle.kts` に以下のエントリを追加します。

```kotlin
 // fat JARをデプロイタスクが期待する名前に変更します
ktor {
    fatJar {
        archiveFileName.set("embedded-server.jar")
    }
}

// Azure Pluginが通常実行する `jar` タスクを無効にし、
// 代わりに `fatJar` タスクによって作成されたアーカイブをデプロイします
tasks.named("jar") {
    enabled = false
}

// デプロイタスクが最初にfat JARをビルドすることを保証します
tasks.named("azureWebAppDeploy") {
    dependsOn("buildFatJar")
}

// Azure Webapp Pluginの設定
azurewebapp {
  subscription = "YOUR-SUBSCRIPTION-ID"
  resourceGroup = "RESOURCE-GROUP-NAME"
  appName = "WEBAPP-NAME"
  pricingTier = "YOUR-PLAN" // 例: "F1", "B1", "P0v3" など
  region = "YOUR-REGION" // 例: "westus2"
  setRuntime(closureOf<com.microsoft.azure.gradle.configuration.GradleRuntimeConfig> {
    os("Linux") // または "Windows"
    webContainer("Java SE")
    javaVersion("Java 21")
  })
  setAuth(closureOf<com.microsoft.azure.gradle.auth.GradleAuthConfig> {
    type = "azure_cli"
  })
}
```

利用可能な設定プロパティの詳細については、[Webアプリ設定のドキュメント](https://github.com/microsoft/azure-gradle-plugins/wiki/Webapp-Configuration)を参照してください。

* `pricingTier` (サービスプラン) の値は、[Linux用](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/)と[Windows用](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/)に記載されています。
* `region` の値のリストは、以下のAzure CLIコマンド: `az account list-locations --query "[].name" --output tsv` で取得できます。または[製品の提供状況テーブル](https://go.microsoft.com/fwlink/?linkid=2300348&clcid=0x409)で「App Service」を検索することによって取得できます。

## アプリケーションをデプロイする {id="deploy-app"}

### 新しいウェブアプリへ

Azure Web App Deployプラグインが使用する認証方法は、Azure CLIを使用します。まだログインしていない場合は、一度 `az login` でログインし、指示に従ってください。

最後に、`azureWebAppDeploy` タスクを実行してアプリケーションをデプロイします。このタスクは、最初にfat JARをビルドしてからデプロイするように設定されています。

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">
<code-block code="./gradlew :embedded-server:azureWebAppDeploy"/>
</TabItem>
<TabItem title="Windows" group-key="windows">
<code-block code="gradlew.bat :embedded-server:azureWebAppDeploy"/>
</TabItem>
</Tabs>

このタスクは、リソースグループ、プラン、ウェブアプリを作成し、その後fat JARをデプロイします。デプロイが成功すると、以下のような出力が表示されます。

```text
> タスク: :embedded-server:azureWebAppDeploy
認証タイプ: AZURE_CLI
ユーザー名: some.username@example.com
サブスクリプション: Some Subscription(13936cf1-cc18-40be-a0d4-177fe532b3dd)
リソースグループ(resource-group)の作成を地域(Some Region)で開始します
リソースグループ(resource-group)が正常に作成されました。
App Serviceプラン(asp-your-webapp-name)の作成を開始します...
App Serviceプラン(asp-your-webapp-name)が正常に作成されました
ウェブアプリ(your-webapp-name)の作成を開始します...
ウェブアプリ(your-webapp-name)が正常に作成されました
アーティファクトを your-webapp-name にデプロイしようとしています...
(C:\docs\ktor-documentation\codeSnippets\snippets\embedded-server\build\libs\embedded-server.jar) [jar] をデプロイ中...
アプリケーションURL: https://your-webapp-name.azurewebsites.net
```

デプロイが完了すると、上記に示されたURLで新しいウェブアプリが動作しているのを確認できます。

### 既存のウェブアプリへ

Azure App Serviceに既存のJavaウェブアプリがある場合、まず、[Ktorプラグイン](#plugins)によって提供される `buildFatJar` タスクを実行してfat JARをビルドします。

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">
<code-block code="./gradlew :embedded-server:buildFatJar"/>
</TabItem>
<TabItem title="Windows" group-key="windows">
<code-block code="gradlew.bat :embedded-server:buildFatJar"/>
</TabItem>
</Tabs>

次に、Azure CLIの以下のコマンドを使用して、以前に作成したfat JARをデプロイします。

```bash
az webapp deploy -g RESOURCE-GROUP-NAME -n WEBAPP-NAME --src-path ./path/to/embedded-server.jar --restart true
```

このコマンドはJARファイルをアップロードし、ウェブアプリを再起動します。しばらくすると、デプロイの結果が表示されます。

```text
デプロイタイプ: jar。デプロイタイプを上書きするには、--type パラメーターを指定してください。可能な値: war, jar, ear, zip, startup, script, static
デプロイを開始しています
ローカルパスからデプロイ中: ./snippets/embedded-server/build/libs/embedded-server.jar
デプロイ前にKuduをウォームアップ中。
Kuduインスタンスのウォームアップに成功しました。
同期デプロイのステータスをポーリング中。開始時刻: 2025-09-07 00:07:14.729383+00:00 UTC
ステータス: ビルド成功。時間: 5(秒)
ステータス: サイトを開始しています... 時間: 23(秒)
ステータス: サイトを開始しています... 時間: 41(秒)
ステータス: サイトが正常に開始されました。時間: 44(秒)
デプロイが正常に完了しました
アプリは以下でアクセスできます: http://your-app-name.some-region.azurewebsites.net
```