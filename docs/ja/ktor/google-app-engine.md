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
このチュートリアルでは、KtorプロジェクトをGoogle App Engine標準環境に準備してデプロイする方法を説明します。
</web-summary>

<link-summary>
プロジェクトをGoogle App Engine標準環境にデプロイする方法を学びます。
</link-summary>

このチュートリアルでは、KtorプロジェクトをGoogle App Engine標準環境に準備してデプロイする方法を説明します。このチュートリアルでは、開始プロジェクトとして[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)サンプルプロジェクトを使用します。

## 前提条件 {id="prerequisites"}
このチュートリアルを開始する前に、以下の手順を実行する必要があります。
*   [Google Cloud Platform](https://console.cloud.google.com/)に登録します。
*   [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールして初期化します。
*   以下のコマンドでJava用のApp Engine拡張機能をインストールします。
   ```Bash
   gcloud components install app-engine-java
   ```

## サンプルアプリケーションのクローン作成 {id="clone"}
サンプルアプリケーションを開くには、以下の手順に従います。
1.  Ktorドキュメンテーションリポジトリをクローンし、[codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets)プロジェクトを開きます。
2.  [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)モジュールを開きます。
   > Ktorは、[サーバーを作成および構成する](server-create-and-configure.topic)ための2つのアプローチ（コード内または構成ファイルを使用）を提供していることに注意してください。このチュートリアルでは、デプロイプロセスは両方のアプローチで同じです。

## アプリケーションの準備 {id="prepare-app"}
### ステップ1: Shadowプラグインの適用 {id="configure-shadow-plugin"}
このチュートリアルでは、[fat JAR](server-fatjar.md)を使用してアプリケーションをGoogle App Engineにデプロイする方法を示します。fat JARを生成するには、Shadowプラグインを適用する必要があります。`build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.9"
}
```

### ステップ2: App Engineプラグインの構成 {id="configure-app-engine-plugin"}
[Google App Engine Gradleプラグイン](https://github.com/GoogleCloudPlatform/app-gradle-plugin)は、Google App Engineアプリケーションをビルドおよびデプロイするためのタスクを提供します。このプラグインを使用するには、以下の手順に従います。

1.  `settings.gradle.kts`ファイルを開き、以下のコードを挿入してCentral Mavenリポジトリからプラグインを参照します。
   ```kotlin
   pluginManagement {
       repositories {
           gradlePluginPortal()
           mavenCentral()
           maven("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
       }
       resolutionStrategy {
           eachPlugin {
               if (requested.id.id.startsWith("com.google.cloud.tools.appengine")) {
                   useModule("com.google.cloud.tools:appengine-gradle-plugin:${requested.version}")
               }
           }
       }
   }
   ```

2.  `build.gradle.kts`を開き、`plugins`ブロックにプラグインを適用します。
   ```kotlin
   plugins {
       id("com.google.cloud.tools.appengine") version "2.8.0"
   }
   ```

3.  `build.gradle.kts`ファイルに以下の設定で`appengine`ブロックを追加します。
   ```kotlin
   import com.google.cloud.tools.gradle.appengine.appyaml.AppEngineAppYamlExtension
   
   configure<AppEngineAppYamlExtension> {
       stage {
           setArtifact("build/libs/${project.name}-all.jar")
       }
       deploy {
           version = "GCLOUD_CONFIG"
           projectId = "GCLOUD_CONFIG"
       }
   }
   ```

### ステップ3: App Engine設定の構成 {id="configure-app-engine-settings"}
アプリケーションのApp Engine設定は、[app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref)ファイルで構成します。
1.  `src/main`内に`appengine`ディレクトリを作成します。
2.  このディレクトリ内に`app.yaml`ファイルを作成し、以下のコンテンツを追加します（`google-appengine-standard`をプロジェクト名に置き換えます）。
   ```yaml
   runtime: java21
   entrypoint: 'java -jar google-appengine-standard-all.jar'
   
   ```
   
   `entrypoint`オプションには、アプリケーション用に生成されたfat JARを実行するために使用されるコマンドが含まれています。

   サポートされている構成オプションに関する詳細なドキュメントは、[Google App Engineドキュメント](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java)で確認できます。

## アプリケーションのデプロイ {id="deploy-app"}

アプリケーションをデプロイするには、ターミナルを開き、以下の手順に従います。

1.  まず、アプリケーションリソースを保持するトップレベルのコンテナであるGoogle Cloudプロジェクトを作成します。例えば、以下のコマンドは`ktor-sample-app-engine`という名前でプロジェクトを作成します。
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2.  Cloudプロジェクト用にApp Engineアプリケーションを作成します。
   ```Bash
   gcloud app create
   ```

3.  アプリケーションをデプロイするには、`appengineDeploy` Gradleタスクを実行します...
   ```Bash
   ./gradlew appengineDeploy
   ```
   ...そして、Google Cloudがアプリケーションをビルドおよび公開するまで待ちます。
   ```
   ...done.
   Deployed service [default] to [https://ktor-sample-app-engine.ew.r.appspot.com]
   ```
   {style="block"}
   > ビルド中に`Cloud Build has not been used in project`エラーが発生した場合は、エラーレポートの指示に従って有効にしてください。
   >
   {type="note"}

完成した例は、こちらで確認できます: [google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard)。