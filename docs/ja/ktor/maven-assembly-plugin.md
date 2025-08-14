[//]: # (title: Maven Assembly プラグインを使用した fat JAR の作成)

<tldr>
<p>
<control>サンプルプロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly プラグイン](http://maven.apache.org/plugins/maven-assembly-plugin/) は、プロジェクトの出力を、依存関係、モジュール、サイトドキュメント、その他のファイルを含む単一の配布可能なアーカイブに結合する機能を提供します。

## Assembly プラグインの設定 {id="configure-plugin"}

アセンブリをビルドするには、まず Assembly プラグインを設定する必要があります。

1.  **pom.xml** ファイルに移動し、[メインアプリケーションクラス](server-dependencies.topic#create-entry-point) が指定されていることを確認してください。
    [object Promise]

    > `main()` 関数を明示的に使用せずに [EngineMain](server-create-and-configure.topic#engine-main) を使用する場合、アプリケーションのメインクラスは使用するエンジンによって異なり、`io.ktor.server.netty.EngineMain` のようになる場合があります。
    {style="tip"}

2.  `maven-assembly-plugin` を `plugins` ブロックに次のように追加します。
    [object Promise]

## アセンブリのビルド {id="build"}

アプリケーション用のアセンブリをビルドするには、ターミナルを開き、次のコマンドを実行します。

```Bash
mvn package
```

これにより、アセンブリ用の新しい **target** ディレクトリが作成され、**.jar** ファイルが含まれます。

> 結果として得られるパッケージを使用して Docker でアプリケーションをデプロイする方法については、[](docker.md) ヘルプトピックを参照してください。

## アプリケーションの実行 {id="run"}

ビルドしたアプリケーションを実行するには、以下の手順に従ってください。

1.  新しいターミナルウィンドウで、`java -jar` コマンドを使用してアプリケーションを実行します。サンプルプロジェクトでは次のようになります。
    ```Bash
    java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
    ```
2.  アプリが実行されると、確認メッセージが表示されます。
    ```Bash
    [main] INFO  Application - Responding at http://0.0.0.0:8080
    ```
3.  URL リンクをクリックして、デフォルトのブラウザでアプリケーションを開きます。

    <img src="server_get_started_ktor_sample_app_output.png" alt="Output of generated ktor project"
                         border-effect="rounded" width="706"/>