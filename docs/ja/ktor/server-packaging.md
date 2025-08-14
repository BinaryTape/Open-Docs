[//]: # (title: アプリケーションの配布を作成する)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[Ktor Gradle プラグイン](https://github.com/ktorio/ktor-build-plugins)は、Gradleの[Application プラグイン](https://docs.gradle.org/current/userguide/application_plugin.html)を自動的に適用します。これにより、コードの依存関係や生成された起動スクリプトを含むアプリケーションをパッケージ化する機能が提供されます。このトピックでは、Ktorアプリケーションをパッケージ化して実行する方法を紹介します。

## Ktorプラグインの設定 {id="configure-plugin"}
アプリケーションの配布を作成するには、まずKtorプラグインを適用する必要があります。
1. `build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
   [object Promise]

2. [メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が設定されていることを確認してください。
   [object Promise]

## アプリケーションのパッケージ化 {id="package"}
Applicationプラグインは、アプリケーションをパッケージ化するためのさまざまな方法を提供します。例えば、`installDist`タスクは、すべてのランタイム依存関係と起動スクリプトを含むアプリケーションをインストールします。完全なディストリビューションアーカイブを作成するには、`distZip`および`distTar`タスクを使用できます。

このトピックでは、`installDist`を使用します。
1. ターミナルを開きます。
2. オペレーティングシステムに応じて、以下のいずれかの方法で`installDist`タスクを実行します。
   
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   [object Promise]
   </tab>
   <tab title="Windows" group-key="windows">
   [object Promise]
   </tab>
   </tabs>

   Applicationプラグインは、`build/install/<project_name>`フォルダにアプリケーションのイメージを作成します。

## アプリケーションの実行 {id="run"}
[パッケージ化されたアプリケーション](#package)を実行するには：
1. ターミナルで`build/install/<project_name>/bin`フォルダに移動します。
2. オペレーティングシステムに応じて、`<project_name>`または`<project_name>.bat`実行可能ファイルを実行します。例：

   <snippet id="run_executable">
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   [object Promise]
   </tab>
   <tab title="Windows" group-key="windows">
   [object Promise]
   </tab>
   </tabs>
   </snippet>
   
3. 次のメッセージが表示されるまで待ちます。
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
   実行中のアプリケーションを表示するには、ブラウザでリンクを開きます。

   <img src="ktor_idea_new_project_browser.png" alt="ブラウザ上のKtorアプリ" width="430"/>