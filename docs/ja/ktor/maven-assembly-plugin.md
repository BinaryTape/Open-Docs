[//]: # (title: Maven Assemblyプラグインを使用してfat JARを作成する)

<tldr>
<p>
<control>サンプルプロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assemblyプラグイン](http://maven.apache.org/plugins/maven-assembly-plugin/)を使用すると、プロジェクトの出力を、依存関係、モジュール、サイトドキュメント、その他のファイルを含む単一の配布可能なアーカイブに結合できます。

## Assemblyプラグインを設定する {id="configure-plugin"}

アセンブリをビルドするには、まずAssemblyプラグインを設定する必要があります。

1.  **pom.xml**ファイルに移動し、[メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が指定されていることを確認します。
    ```xml
    <properties>
        <main.class>com.example.ApplicationKt</main.class>
    </properties>
    ```

    > `main()`関数を明示的に使用せずに[EngineMain](server-create-and-configure.topic#engine-main)を使用する場合、アプリケーションのメインクラスは使用するエンジンに依存し、次のようになります: `io.ktor.server.netty.EngineMain`。
    {style="tip"}

2.  `maven-assembly-plugin`を`plugins`ブロックに次のように追加します。
    ```xml
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>2.6</version>
        <configuration>
            <descriptorRefs>
                <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
            <archive>
                <manifest>
                    <addClasspath>true</addClasspath>
                    <mainClass>${main.class}</mainClass>
                </manifest>
            </archive>
        </configuration>
        <executions>
            <execution>
                <id>assemble-all</id>
                <phase>package</phase>
                <goals>
                    <goal>single</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
    ```

## アセンブリをビルドする {id="build"}

アプリケーションのアセンブリをビルドするには、ターミナルを開き、次のコマンドを実行します。

```Bash
mvn package
```

これにより、アセンブリ用の新しい**target**ディレクトリが、**.jar**ファイルを含めて作成されます。

> 作成されたパッケージを使用してDockerでアプリケーションをデプロイする方法については、[Docker](docker.md)ヘルプトピックを参照してください。

## アプリケーションを実行する {id="run"}

ビルドしたアプリケーションを実行するには、以下の手順に従います。

1.  新しいターミナルウィンドウで、`java -jar`コマンドを使用してアプリケーションを実行します。サンプルプロジェクトでは次のようになります。
    ```Bash
    java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
    ```
2.  アプリケーションが実行されると、確認メッセージが表示されます。
    ```Bash
    [main] INFO  Application - Responding at http://0.0.0.0:8080
    ```
3.  URLリンクをクリックして、アプリケーションをデフォルトのブラウザで開きます。

    <img src="server_get_started_ktor_sample_app_output.png" alt="Output of generated ktor project"
                       border-effect="rounded" width="706"/>