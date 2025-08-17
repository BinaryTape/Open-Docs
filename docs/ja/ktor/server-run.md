[//]: # (title: 実行)

<show-structure for="chapter" depth="2"/>

<link-summary>
サーバーKtorアプリケーションの実行方法について学びます。
</link-summary>

Ktorサーバーアプリケーションを実行する際には、以下の点に注意してください。
* [サーバーを作成する](server-create-and-configure.topic)方法によって、[パッケージ化されたKtorアプリケーション](#package)を実行する際にコマンドライン引数を渡してサーバーパラメーターを上書きできるかどうかが変わります。
* Gradle/Mavenのビルドスクリプトでは、[EngineMain](server-create-and-configure.topic#engine-main)を使用してサーバーを起動する際にメインクラス名を指定する必要があります。
* [サーブレットコンテナ](server-war.md)内でアプリケーションを実行するには、特定のサーブレット設定が必要です。

このトピックでは、これらの設定の詳細を確認し、IntelliJ IDEAおよびパッケージ化されたアプリケーションとしてKtorアプリケーションを実行する方法を説明します。

## 設定の詳細 {id="specifics"}

### 設定: コード vs 設定ファイル {id="code-vs-config"}

Ktorアプリケーションの実行は、[サーバーを作成した](server-create-and-configure.topic)方法 (`embeddedServer` または `EngineMain`) によって異なります。
* `embeddedServer` の場合、サーバーパラメーター (ホストアドレスやポートなど) はコードで設定されるため、アプリケーションの実行時にこれらのパラメーターを変更することはできません。
* `EngineMain` の場合、Ktorは `HOCON` または `YAML` 形式を使用する外部ファイルから設定をロードします。このアプローチを使用すると、コマンドラインから[パッケージ化されたアプリケーション](#package)を実行し、対応する[コマンドライン引数](server-configuration-file.topic#command-line)を渡すことで、必要なサーバーパラメーターを上書きできます。

### EngineMainの起動: GradleとMavenの特記事項 {id="gradle-maven"}

`EngineMain` を使用してサーバーを作成する場合、目的の[エンジン](server-engines.md)でサーバーを起動するための `main` 関数を指定する必要があります。
以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)は、Nettyエンジンでサーバーを実行するために使用される `main` 関数を示しています。

```kotlin
fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)
```

Gradle/Mavenを使用して、`main` 関数内でエンジンを設定せずにKtorサーバーを実行するには、次のようにビルドスクリプトでメインクラス名を指定する必要があります。

<TabItem title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}
```

</TabItem>
<TabItem title="Gradle (Groovy)" group-key="groovy">

```groovy
mainClassName = "io.ktor.server.netty.EngineMain"
```

</TabItem>
<TabItem title="Maven" group-key="maven">

```xml
<properties>
    <main.class>io.ktor.server.netty.EngineMain</main.class>
</properties>
```

</TabItem>

### WARの特記事項

Ktorを使用すると、アプリケーション内で直接、目的のエンジン (Netty、Jetty、Tomcatなど) を使用して[サーバーを作成し起動できます](server-create-and-configure.topic)。この場合、アプリケーションはエンジン設定、接続、およびSSLオプションを制御できます。

このアプローチとは対照的に、サーブレットコンテナはアプリケーションのライフサイクルと接続設定を制御すべきです。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な `ServletApplicationEngine` エンジンを提供します。[WARの構成](server-war.md#configure-war)からアプリケーションの設定方法を学ぶことができます。

## アプリケーションの実行 {id="run"}
> 開発中にサーバーを再起動すると時間がかかる場合があります。Ktorは、コード変更時にアプリケーションクラスをリロードし、高速なフィードバックループを提供する[自動リロード](server-auto-reload.topic)を使用することで、この制限を克服できます。

### Gradle/Mavenを使用したアプリケーションの実行 {id="gradle-maven-run"}

GradleまたはMavenを使用してKtorアプリケーションを実行するには、対応するプラグインを使用します。
* Gradle用の[Application](server-packaging.md)プラグイン。[ネイティブサーバー](server-native.md)の場合は、[Kotlin Multiplatform](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.multiplatform)プラグインを使用します。
* Maven用の[Exec](https://www.mojohaus.org/exec-maven-plugin/)プラグイン。

> IntelliJ IDEAでKtorアプリケーションを実行する方法については、IntelliJ IDEAドキュメントの[Ktorアプリケーションの実行](https://www.jetbrains.com/help/idea/ktor.html#run_ktor_app)セクションを参照してください。

### パッケージ化されたアプリケーションの実行 {id="package"}

アプリケーションをデプロイする前に、[パッケージング](server-deployment.md#packaging)セクションで説明されているいずれかの方法でパッケージ化する必要があります。
生成されたパッケージからKtorアプリケーションを実行する方法は、パッケージの種類によって異なり、次のようになります。
* 設定されたポートを上書きしてファットJARにパッケージ化されたKtorサーバーを実行するには、次のコマンドを実行します。
   ```Bash
   java -jar sample-app.jar -port=8080
   ```
* Gradle [Application](server-packaging.md)プラグインを使用してパッケージ化されたアプリケーションを実行するには、対応する実行可能ファイルを起動します。

   <Tabs group="os">
   <TabItem title="Linux/macOS" group-key="unix">
   <code-block code="./ktor-sample"/>
   </TabItem>
   <TabItem title="Windows" group-key="windows">
   <code-block code="ktor-sample.bat"/>
   </TabItem>
   </Tabs>
  
* サーブレットKtorアプリケーションを実行するには、[Gretty](server-war.md#run)プラグインの `run` タスクを使用します。