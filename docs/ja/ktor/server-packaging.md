[//]: # (title: アプリケーションの配布物を作成する)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[Ktor Gradleプラグイン](https://github.com/ktorio/ktor-build-plugins)は、Gradleの[Applicationプラグイン](https://docs.gradle.org/current/userguide/application_plugin.html)を自動的に適用します。これにより、コードの依存関係や生成された起動スクリプトを含むアプリケーションをパッケージ化する機能が提供されます。このトピックでは、Ktorアプリケーションをパッケージ化して実行する方法を説明します。

## Ktorプラグインの構成 {id="configure-plugin"}
アプリケーションの配布物を作成するには、まずKtorプラグインを適用する必要があります。
1.  `build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
   ```kotlin
   plugins {
       id("io.ktor.plugin") version "3.2.3"
   }
   ```

2.  [メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が構成されていることを確認してください。
   ```kotlin
   application {
       mainClass.set("com.example.ApplicationKt")
   }
   ```

## アプリケーションのパッケージ化 {id="package"}
Applicationプラグインは、アプリケーションをパッケージ化するためのさまざまな方法を提供します。例えば、`installDist`タスクは、すべてのランタイム依存関係と起動スクリプトとともにアプリケーションをインストールします。完全な配布アーカイブを作成するには、`distZip`および`distTar`タスクを使用できます。

このトピックでは、`installDist`を使用します。
1.  ターミナルを開きます。
2.  オペレーティングシステムに応じて、以下のいずれかの方法で`installDist`タスクを実行します。
   
   <Tabs group="os">
   <TabItem title="Linux/macOS" group-key="unix">
   <code-block code="./gradlew installDist"/>
   </TabItem>
   <TabItem title="Windows" group-key="windows">
   <code-block code="gradlew.bat installDist"/>
   </TabItem>
   </Tabs>

   Applicationプラグインは、`build/install/<project_name>`フォルダー内にアプリケーションのイメージを作成します。

## アプリケーションの実行 {id="run"}
[パッケージ化されたアプリケーション](#package)を実行するには：
1.  ターミナルで`build/install/<project_name>/bin`フォルダーに移動します。
2.  オペレーティングシステムに応じて、`<project_name>`または`<project_name>.bat`実行可能ファイルを実行します。例：

   <snippet id="run_executable">
   <Tabs group="os">
   <TabItem title="Linux/macOS" group-key="unix">
   <code-block code="./ktor-sample"/>
   </TabItem>
   <TabItem title="Windows" group-key="windows">
   <code-block code="ktor-sample.bat"/>
   </TabItem>
   </Tabs>
   </snippet>
   
3.  次のメッセージが表示されるまで待ちます。
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
   ブラウザでリンクを開き、実行中のアプリケーションを確認します。

   <img src="ktor_idea_new_project_browser.png" alt="ブラウザで表示されるKtorアプリケーション" width="430"/>