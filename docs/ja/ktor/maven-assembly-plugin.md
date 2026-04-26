[//]: # (title: Maven Assemblyプラグインを使用したFat JARの作成)

<tldr>
<p>
<control>サンプルプロジェクト</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assemblyプラグイン](http://maven.apache.org/plugins/maven-assembly-plugin/)は、プロジェクトの出力を、依存関係、モジュール、サイトドキュメント、その他のファイルを含む単一の配布可能なアーカイブに結合する機能を提供します。

## Assemblyプラグインの設定 {id="configure-plugin"}

アセンブリをビルドするには、まずAssemblyプラグインを設定する必要があります。

1. **pom.xml**ファイルを開き、[メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が指定されていることを確認します。
   ```xml
   <properties>
       <main.class>io.ktor.server.netty.EngineMain</main.class>
   </properties>
   ```

    この例では、`EngineMain`がサーバーの作成に使用されているため、アプリケーションのメインクラスは使用されるエンジンに依存します。[embeddedServer](server-create-and-configure.topic#embedded-server)を使用する場合、アプリケーションのメインクラスは`com.example.ApplicationKt`になります。

2. `plugins`ブロックに`maven-assembly-plugin`を追加します。
   ```xml
   <plugin>
       <groupId>org.apache.maven.plugins</groupId>
       <artifactId>maven-assembly-plugin</artifactId>
       <version>3.7.1</version>
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

## アセンブリのビルド {id="build"}

アプリケーションのアセンブリをビルドするには、ターミナルを開いて次のコマンドを実行します。

```Bash
mvn package
```

これにより、**.jar**ファイルを含むアセンブリ用の新しい**target**ディレクトリが作成されます。

> 生成されたパッケージを使用してDockerでアプリケーションをデプロイする方法については、[Docker](docker.md)のヘルプトピックを参照してください。

## アプリケーションの実行 {id="run"}

ビルドされたアプリケーションを実行するには、以下の手順に従ってください。

1. 新しいターミナルウィンドウで、`java -jar`コマンドを使用してアプリケーションを実行します。サンプルプロジェクトの場合は、次のようになります。
   ```Bash
   java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
   ```
2. アプリが起動すると、確認メッセージが表示されます。
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
3. URLリンクをクリックして、デフォルトのブラウザでアプリケーションを開きます。

   <img src="server_get_started_ktor_sample_app_output.png" alt="Output of generated ktor project"
                     border-effect="rounded" width="706"/>