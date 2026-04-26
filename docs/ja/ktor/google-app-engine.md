[//]: # (title: Google App Engine)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初期プロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>完成プロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/google-appengine-standard">google-appengine-standard</a>
</p>
</tldr>

<web-summary>
このチュートリアルでは、KtorプロジェクトをGoogle App Engineのスタンダード環境（standard environment）向けに準備し、デプロイする方法を説明します。
</web-summary>

<link-summary>
プロジェクトをGoogle App Engineのスタンダード環境にデプロイする方法を学びます。
</link-summary>

このチュートリアルでは、KtorプロジェクトをGoogle App Engineのスタンダード環境（standard environment）向けに準備し、デプロイする方法を紹介します。このチュートリアルでは、[engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) サンプルプロジェクトをスタータープロジェクトとして使用します。

## 前提条件 {id="prerequisites"}
このチュートリアルを始める前に、以下の手順を完了しておく必要があります。
* [Google Cloud Platform](https://console.cloud.google.com/) に登録する。
* [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) をインストールして初期化する。
* 以下のコマンドを使用して、Java用のApp Engine拡張機能をインストールする。
   ```Bash
   gcloud components install app-engine-java
   ```

## サンプルアプリケーションのクローン {id="clone"}
サンプルアプリケーションを開くには、以下の手順に従ってください。
1. Ktorドキュメントのリポジトリをクローンし、[codeSnippets](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets) プロジェクトを開きます。
2. [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) モジュールを開きます。
   > Ktorには、コード内で、または設定ファイルを使用して[サーバーを作成および設定する](server-create-and-configure.topic)ための2つのアプローチがあることに注意してください。このチュートリアルでは、デプロイのプロセスはいずれのアプローチでも同じです。

## アプリケーションの準備 {id="prepare-app"}
### ステップ 1: Shadowプラグインの適用 {id="configure-shadow-plugin"}
このチュートリアルでは、[fat JAR](server-fatjar.md)を使用してGoogle App Engineにアプリケーションをデプロイする方法を示します。fat JARを生成するには、Shadowプラグインを適用する必要があります。`build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.10"
}
```

### ステップ 2: App Engineプラグインの設定 {id="configure-app-engine-plugin"}
[Google App Engine Gradleプラグイン](https://github.com/GoogleCloudPlatform/app-gradle-plugin)は、Google App Engineアプリケーションをビルドおよびデプロイするためのタスクを提供します。このプラグインを使用するには、以下の手順に従ってください。

1. `settings.gradle.kts`ファイルを開き、Maven Centralリポジトリからプラグインを参照するために以下のコードを挿入します。
   ```kotlin
   pluginManagement {
       repositories {
           gradlePluginPortal()
           mavenCentral()
           maven("https://redirector.kotlinlang.org/maven/ktor-eap")
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

2. `build.gradle.kts`を開き、`plugins`ブロックでプラグインを適用します。
   ```kotlin
   plugins {
       id("com.google.cloud.tools.appengine") version "2.8.0"
   }
   ```

3. `build.gradle.kts`ファイルに、以下の設定で`appengine`ブロックを追加します。
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

### ステップ 3: App Engineの設定 {id="configure-app-engine-settings"}
アプリケーションのApp Engine設定は、[app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref)ファイルで行います。
1. `src/main`の中に`appengine`ディレクトリを作成します。
2. このディレクトリ内に`app.yaml`ファイルを作成し、以下の内容を追加します（`google-appengine-standard`をプロジェクト名に置き換えてください）。
   ```yaml
   runtime: java21
   entrypoint: 'java -jar google-appengine-standard-all.jar'
   
   ```
   
   `entrypoint`オプションには、アプリケーション用に生成されたfat JARを実行するために使用されるコマンドが含まれます。

   サポートされている設定オプションに関する詳細は、[Google AppEngineのドキュメント](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java)で確認できます。

## アプリケーションのデプロイ {id="deploy-app"}

アプリケーションをデプロイするには、ターミナルを開き、以下の手順に従ってください。

1. まず、アプリケーションリソースを保持するトップレベルのコンテナであるGoogle Cloudプロジェクトを作成します。例えば、以下のコマンドは`ktor-sample-app-engine`という名前でプロジェクトを作成します。
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2. Cloudプロジェクト用のApp Engineアプリケーションを作成します。
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
   > ビルド中に `Cloud Build has not been used in project` というエラーが発生した場合は、エラーレポートの指示に従って有効にしてください。
   >
   {type="note"}

完成した例はこちらで確認できます: [google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/google-appengine-standard)