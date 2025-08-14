[//]: # (title: Google App Engine)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初期プロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>最終プロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard">google-appengine-standard</a>
</p>
</tldr>

<web-summary>
このチュートリアルでは、KtorプロジェクトをGoogle App Engine標準環境に準備し、デプロイする方法を説明します。
</web-summary>

<link-summary>
Google App Engine標準環境にプロジェクトをデプロイする方法を学びます。
</link-summary>

このチュートリアルでは、KtorプロジェクトをGoogle App Engine標準環境に準備し、デプロイする方法を説明します。このチュートリアルでは、開始プロジェクトとして[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルプロジェクトを使用します。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、以下の手順を実行する必要があります。
* [Google Cloud Platform](https://console.cloud.google.com/)に登録します。
* [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールして初期化します。
* 以下のコマンドでJava用App Engine拡張機能をインストールします。
   ```Bash
   gcloud components install app-engine-java
   ```

## サンプルアプリケーションをクローンする {id="clone"}
サンプルアプリケーションを開くには、以下の手順に従います。
1. Ktorドキュメントリポジトリをクローンし、[codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets)プロジェクトを開きます。
2. [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)モジュールを開きます。
   > 注: Ktorは[サーバーの作成と設定](server-create-and-configure.topic)に2つのアプローチを提供します: コード内で行うか、設定ファイルを使用するかです。このチュートリアルでは、どちらのアプローチでもデプロイプロセスは同じです。

## アプリケーションを準備する {id="prepare-app"}
### ステップ1: Shadowプラグインを適用する {id="configure-shadow-plugin"}
このチュートリアルでは、[fat JAR](server-fatjar.md)を使用してアプリケーションをGoogle App Engineにデプロイする方法を示します。fat JARを生成するには、Shadowプラグインを適用する必要があります。`build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
[object Promise]

### ステップ2: App Engineプラグインを設定する {id="configure-app-engine-plugin"}
[Google App Engine Gradleプラグイン](https://github.com/GoogleCloudPlatform/app-gradle-plugin)は、Google App Engineアプリケーションをビルドおよびデプロイするためのタスクを提供します。このプラグインを使用するには、以下の手順に従います。

1. `settings.gradle.kts`ファイルを開き、Central Mavenリポジトリからプラグインを参照するために以下のコードを挿入します。
   [object Promise]

2. `build.gradle.kts`を開き、`plugins`ブロックにプラグインを適用します。
   [object Promise]

3. `build.gradle.kts`ファイルに以下の設定で`appengine`ブロックを追加します。
   [object Promise]

### ステップ3: App Engine設定を構成する {id="configure-app-engine-settings"}
アプリケーションのApp Engine設定は、[app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref)ファイルで構成します。
1. `src/main`内に`appengine`ディレクトリを作成します。
2. このディレクトリ内に`app.yaml`ファイルを作成し、以下のコンテンツを追加します（`google-appengine-standard`をプロジェクト名に置き換えてください）。
   [object Promise]
   
   `entrypoint`オプションには、アプリケーション用に生成されたfat JARを実行するために使用されるコマンドが含まれています。

   サポートされている構成オプションに関する詳細なドキュメントは、[Google App Engineドキュメント](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java)から参照できます。

## アプリケーションをデプロイする {id="deploy-app"}

アプリケーションをデプロイするには、ターミナルを開き、以下の手順に従います。

1. まず、アプリケーションリソースを保持するトップレベルのコンテナであるGoogle Cloudプロジェクトを作成します。例えば、以下のコマンドは`ktor-sample-app-engine`という名前のプロジェクトを作成します。
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2. そのCloudプロジェクト用のApp Engineアプリケーションを作成します。
   ```Bash
   gcloud app create
   ```

3. アプリケーションをデプロイするには、`appengineDeploy` Gradleタスクを実行します...
   ```Bash
   ./gradlew appengineDeploy
   ```
   ...そして、Google Cloudがアプリケーションをビルドして公開するまで待ちます。
   ```
   ...done.
   Deployed service [default] to [https://ktor-sample-app-engine.ew.r.appspot.com]
   ```
   {style="block"}
   > ビルド中に`Cloud Build has not been used in project`エラーが表示された場合は、エラーレポートの指示に従って有効にしてください。
   >
   {type="note"}

完成した例は、こちらで確認できます: [google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard)。