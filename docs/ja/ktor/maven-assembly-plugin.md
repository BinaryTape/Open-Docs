[//]: # (title: Maven Assemblyプラグインを使ったfat JARの作成)

<tldr>
<p>
<control>サンプルプロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assemblyプラグイン](http://maven.apache.org/plugins/maven-assembly-plugin/)は、プロジェクトの出力を、依存関係、モジュール、サイトドキュメント、およびその他のファイルを含む単一の配布可能なアーカイブに結合する機能を提供します。

## Assemblyプラグインの設定 {id="configure-plugin"}

アセンブリをビルドするには、まずAssemblyプラグインを設定する必要があります。

1. **pom.xml**ファイルに移動し、[メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が指定されていることを確認します。
   ```xml
   ```
   {src="snippets/tutorial-server-get-started-maven/pom.xml" include-lines="10,18-19"}

   > 明示的な`main()`関数なしで[EngineMain](server-create-and-configure.topic#engine-main)を使用する場合、アプリケーションのメインクラスは使用されるエンジンに依存し、次のように表示されることがあります: `io.ktor.server.netty.EngineMain`。
   {style="tip"}

2. `maven-assembly-plugin`を`plugins`ブロックに次のように追加します。
   ```xml
   ```
   {src="snippets/tutorial-server-get-started-maven/pom.xml" include-lines="111-135"}

## アセンブリのビルド {id="build"}

アプリケーションのアセンブリをビルドするには、ターミナルを開いて次のコマンドを実行します。

```Bash
mvn package
```

これにより、アセンブリ用に新しい**target**ディレクトリが作成され、**.jar**ファイルが含まれます。

> 結果として得られるパッケージを使用してDockerでアプリケーションをデプロイする方法については、[](docker.md)ヘルプトピックを参照してください。

## アプリケーションの実行 {id="run"}

ビルドしたアプリケーションを実行するには、以下の手順に従ってください。

1. 新しいターミナルウィンドウで、`java -jar`コマンドを使用してアプリケーションを実行します。サンプルプロジェクトの場合、次のようになります。
   ```Bash
   java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
   ```
2. アプリが実行されると、確認メッセージが表示されます。
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
3. URLリンクをクリックして、デフォルトのブラウザでアプリケーションを開きます。

   <img src="server_get_started_ktor_sample_app_output.png" alt="Output of generated ktor project"
                     border-effect="rounded" width="706"/>