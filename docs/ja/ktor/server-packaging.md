[//]: # (title: アプリケーションの配布を作成する)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[Ktor Gradleプラグイン](https://github.com/ktorio/ktor-build-plugins)は、Gradleの[Applicationプラグイン](https://docs.gradle.org/current/userguide/application_plugin.html)を自動的に適用します。これにより、コードの依存関係や生成された起動スクリプトを含むアプリケーションをパッケージ化する機能が提供されます。このトピックでは、Ktorアプリケーションをパッケージ化して実行する方法を説明します。

## Ktorプラグインを設定する {id="configure-plugin"}
アプリケーションの配布を作成するには、まずKtorプラグインを適用する必要があります。
1. `build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="4,7-8"}

2. [メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が設定されていることを確認します。
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="10-12"}

## アプリケーションをパッケージ化する {id="package"}
Applicationプラグインは、アプリケーションをパッケージ化するための様々な方法を提供します。例えば、`installDist`タスクは、すべてのランタイム依存関係と起動スクリプトとともにアプリケーションをインストールします。完全な配布アーカイブを作成するには、`distZip`および`distTar`タスクを使用できます。

このトピックでは、`installDist`を使用します。
1. ターミナルを開きます。
2. オペレーティングシステムに応じて、以下のいずれかの方法で`installDist`タスクを実行します。
   
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   <code-block>./gradlew installDist</code-block>
   </tab>
   <tab title="Windows" group-key="windows">
   <code-block>gradlew.bat installDist</code-block>
   </tab>
   </tabs>

   Applicationプラグインは、`build/install/<project_name>`フォルダーにアプリケーションのイメージを作成します。

## アプリケーションを実行する {id="run"}
[パッケージ化されたアプリケーション](#package)を実行するには:
1. ターミナルで`build/install/<project_name>/bin`フォルダーに移動します。
2. オペレーティングシステムに応じて、`<project_name>`または`<project_name>.bat`実行可能ファイルを実行します。例:

   <snippet id="run_executable">
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   <code-block>./ktor-sample</code-block>
   </tab>
   <tab title="Windows" group-key="windows">
   <code-block>ktor-sample.bat</code-block>
   </tab>
   </tabs>
   </snippet>
   
3. 次のメッセージが表示されるまで待ちます。
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
   ブラウザーでリンクを開き、実行中のアプリケーションを確認します。

   <img src="ktor_idea_new_project_browser.png" alt="Ktor app in a browser" width="430"/>