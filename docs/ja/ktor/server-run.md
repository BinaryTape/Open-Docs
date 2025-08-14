[//]: # (title: 実行)

<show-structure for="chapter" depth="2"/>

<link-summary>
サーバーKtorアプリケーションの実行方法を学習します。
</link-summary>

Ktorサーバーアプリケーションを実行する際は、以下の点に注意してください。
* [サーバーを作成する](server-create-and-configure.topic)方法によって、[パッケージ化されたKtorアプリケーション](#package)の実行時にコマンドライン引数を渡すことでサーバーパラメータを上書きできるかどうかが決まります。
* Gradle/Mavenのビルドスクリプトは、[EngineMain](server-create-and-configure.topic#engine-main)を使用してサーバーを起動する際にメインクラス名を指定する必要があります。
* [サーブレットコンテナ](server-war.md)内でアプリケーションを実行する場合、特定のサーブレット設定が必要です。

このトピックでは、これらの設定の詳細を確認し、IntelliJ IDEAとパッケージ化されたアプリケーションとしてKtorアプリケーションを実行する方法を説明します。

## 設定の詳細 {id="specifics"}

### 設定：コード vs 設定ファイル {id="code-vs-config"}

Ktorアプリケーションの実行は、[サーバーを作成する](server-create-and-configure.topic)際に使用した方法（`embeddedServer`または`EngineMain`）に依存します。
* `embeddedServer`の場合、サーバーパラメータ（ホストアドレスやポートなど）はコードで設定されるため、アプリケーションの実行時にこれらのパラメータを変更することはできません。
* `EngineMain`の場合、Ktorは、`HOCON`または`YAML`形式を使用する外部ファイルから設定をロードします。このアプローチを使用すると、コマンドラインから[パッケージ化されたアプリケーション](#package)を実行し、対応する[コマンドライン引数](server-configuration-file.topic#command-line)を渡すことで、必要なサーバーパラメータを上書きできます。

### EngineMainの起動：GradleとMavenの詳細 {id="gradle-maven"}

`EngineMain`を使用してサーバーを作成する場合、目的の[エンジン](server-engines.md)でサーバーを起動するための`main`関数を指定する必要があります。
以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)は、Nettyエンジンでサーバーを実行するために使用される`main`関数を示しています。

[object Promise]

`main`関数内でエンジンを設定せずにGradle/Mavenを使用してKtorサーバーを実行するには、ビルドスクリプトでメインクラス名を次のように指定する必要があります。

<tabs group="languages" id="main-class-set-engine-main">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
application {
mainClass.set("io.ktor.server.netty.EngineMain")
}
```

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
mainClassName = "io.ktor.server.netty.EngineMain"
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<properties>
<main.class>io.ktor.server.netty.EngineMain</main.class>
</properties>
```

</tab>
</tabs>

### WARに関する詳細

Ktorでは、目的のエンジン（Netty、Jetty、Tomcatなど）を使って[サーバーを作成し起動する](server-create-and-configure.topic)ことをアプリケーション内で直接行えます。この場合、アプリケーションがエンジンの設定、接続、SSLオプションを制御します。

このアプローチとは対照的に、サーブレットコンテナがアプリケーションのライフサイクルと接続設定を制御する必要があります。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な`ServletApplicationEngine`エンジンを提供します。[](server-war.md#configure-war)でアプリケーションの構成方法を学ぶことができます。

## アプリケーションの実行 {id="run"}
> 開発中にサーバーを再起動するには時間がかかる場合があります。Ktorは、コードの変更時にアプリケーションクラスをリロードし、迅速なフィードバックループを提供する[オートリロード](server-auto-reload.topic)を使用することでこの制限を克服できます。

### Gradle/Mavenを使用したアプリケーションの実行 {id="gradle-maven-run"}

GradleまたはMavenを使用してKtorアプリケーションを実行するには、対応するプラグインを使用します。
* Gradle用の[Application](server-packaging.md)プラグイン。[Nativeサーバー](server-native.md)の場合は、[Kotlin Multiplatform](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.multiplatform)プラグインを使用します。
* Maven用の[Exec](https://www.mojohaus.org/exec-maven-plugin/)プラグイン。

> IntelliJ IDEAでKtorアプリケーションを実行する方法については、IntelliJ IDEAのドキュメントの[Ktorアプリケーションの実行](https://www.jetbrains.com/help/idea/ktor.html#run_ktor_app)セクションを参照してください。

### パッケージ化されたアプリケーションの実行 {id="package"}

アプリケーションをデプロイする前に、[](server-deployment.md#packaging)セクションで説明されているいずれかの方法でパッケージ化する必要があります。
生成されたパッケージからKtorアプリケーションを実行する方法は、パッケージの種類によって異なり、次のようになります。
* fat JARにパッケージ化されたKtorサーバーを実行し、設定されたポートを上書きするには、次のコマンドを実行します。
   ```Bash
   java -jar sample-app.jar -port=8080
   ```
* Gradle [Application](server-packaging.md)プラグインを使用してパッケージ化されたアプリケーションを実行するには、対応する実行可能ファイルを実行します。

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
  
* サーブレットKtorアプリケーションを実行するには、[Gretty](server-war.md#run)プラグインの`run`タスクを使用します。

    ```