[//]: # (title: 実行)

<show-structure for="chapter" depth="2"/>

<link-summary>
Ktorサーバーアプリケーションの実行方法を学びます。
</link-summary>

Ktorサーバーアプリケーションを実行する際は、以下の詳細に注意してください。
*   [サーバーの作成方法](server-create-and-configure.topic)は、[パッケージ化されたKtorアプリケーション](#package)を実行する際にコマンドライン引数を渡すことでサーバーパラメータをオーバーライドできるかどうかに影響します。
*   [EngineMain](server-create-and-configure.topic#engine-main)を使用してサーバーを起動する際、Gradle/Mavenビルドスクリプトはメインクラス名を指定する必要があります。
*   [サーブレットコンテナ](server-war.md)内でアプリケーションを実行するには、特定のサーブレット設定が必要です。

このトピックでは、これらの設定の詳細を確認し、IntelliJ IDEAおよびパッケージ化されたアプリケーションとしてKtorアプリケーションを実行する方法を示します。

## 設定の詳細 {id="specifics"}

### 設定: コード vs 設定ファイル {id="code-vs-config"}

Ktorアプリケーションの実行は、[サーバーを作成](server-create-and-configure.topic)した方法 (`embeddedServer` または `EngineMain`) に依存します。
*   `embeddedServer` の場合、サーバーパラメータ（ホストアドレスやポートなど）はコードで設定されるため、アプリケーション実行時にこれらのパラメータを変更することはできません。
*   `EngineMain` の場合、Ktor は `HOCON` または `YAML` 形式を使用する外部ファイルから設定をロードします。このアプローチを使用すると、コマンドラインから[パッケージ化されたアプリケーション](#package)を実行し、対応する[コマンドライン引数](server-configuration-file.topic#command-line)を渡すことで、必要なサーバーパラメータをオーバーライドできます。

### EngineMainの起動: GradleとMavenの詳細 {id="gradle-maven"}

`EngineMain` を使用してサーバーを作成する場合、目的の[エンジン](server-engines.md)でサーバーを起動するための `main` 関数を指定する必要があります。
以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)は、Nettyエンジンでサーバーを実行するために使用される `main` 関数を示しています。

```kotlin
```
{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt" include-lines="7"}

`main` 関数内でエンジンを設定せずにGradle/Mavenを使用してKtorサーバーを実行するには、ビルドスクリプトでメインクラス名を次のように指定する必要があります。

<include from="server-engines.md" element-id="main-class-set-engine-main"/>

### WARの詳細

Ktorでは、アプリケーション内で目的のエンジン（Netty、Jetty、Tomcatなど）を使用して[サーバーを作成および起動](server-create-and-configure.topic)できます。この場合、アプリケーションはエンジン設定、接続、SSLオプションを制御します。

このアプローチとは対照的に、サーブレットコンテナはアプリケーションのライフサイクルと接続設定を制御する必要があります。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な `ServletApplicationEngine` エンジンを提供します。アプリケーションの設定方法については、[](server-war.md#configure-war)を参照してください。

## アプリケーションの実行 {id="run"}
> 開発中にサーバーを再起動すると時間がかかる場合があります。Ktorは、コード変更時にアプリケーションクラスをリロードし、高速なフィードバックループを提供する[自動リロード](server-auto-reload.topic)を使用することで、この制限を克服できます。

### Gradle/Mavenを使用したアプリケーションの実行 {id="gradle-maven-run"}

GradleまたはMavenを使用してKtorアプリケーションを実行するには、対応するプラグインを使用します。
*   Gradle用の[Application](server-packaging.md)プラグイン。[Nativeサーバー](server-native.md)の場合は、[Kotlin Multiplatform](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.multiplatform)プラグインを使用します。
*   Maven用の[Exec](https://www.mojohaus.org/exec-maven-plugin/)プラグイン。

> IntelliJ IDEAでKtorアプリケーションを実行する方法については、IntelliJ IDEAドキュメントの[Ktorアプリケーションの実行](https://www.jetbrains.com/help/idea/ktor.html#run_ktor_app)セクションを参照してください。

### パッケージ化されたアプリケーションの実行 {id="package"}

アプリケーションをデプロイする前に、[](server-deployment.md#packaging)セクションで説明されているいずれかの方法でパッケージ化する必要があります。
結果として得られるパッケージからのKtorアプリケーションの実行は、パッケージタイプに依存し、次のようになります。
*   設定されたポートをオーバーライドしてfat JARにパッケージ化されたKtorサーバーを実行するには、次のコマンドを実行します。
   ```Bash
   java -jar sample-app.jar -port=8080
   ```
*   Gradle [Application](server-packaging.md)プラグインを使用してパッケージ化されたアプリケーションを実行するには、対応する実行可能ファイルを実行します。

   <include from="server-packaging.md" element-id="run_executable"/>
  
*   サーブレットKtorアプリケーションを実行するには、[Gretty](server-war.md#run)プラグインの `run` タスクを使用します。