[//]: # (title: サーバーエンジン)

<show-structure for="chapter" depth="3"/>

<link-summary>
ネットワークリクエストを処理するエンジンについて学びます。
</link-summary>

Ktorサーバーアプリケーションを実行するには、まずサーバーを[作成](server-create-and-configure.topic)して設定する必要があります。
サーバー設定には、さまざまな設定が含まれます。
- ネットワークリクエストを処理するための[エンジン](#supported-engines)
- サーバーへのアクセスに使用されるホストとポートの値
- SSL設定
- ... など

## サポートされているエンジン {id="supported-engines"}

以下の表は、Ktorがサポートするエンジンと、サポートされているプラットフォームをリストしています。

| エンジン                                  | プラットフォーム                                            | HTTP/2 |
|-----------------------------------------|------------------------------------------------------|--------|
| `Netty`                                 | JVM                                                  | ✅      |
| `Jetty`                                 | JVM                                                  | ✅      |
| `Tomcat`                                | JVM                                                  | ✅      |
| `CIO` (Coroutine-based I/O)             | JVM, [Native](server-native.md), [GraalVM](graalvm.md) | ✖️     |
| [ServletApplicationEngine](server-war.md) | JVM                                                  | ✅      |

## 依存関係の追加 {id="dependencies"}

目的のエンジンを使用する前に、対応する依存関係を[ビルドスクリプト](server-dependencies.topic)に追加する必要があります。

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

以下は、Nettyの依存関係を追加する例です。

<var name="artifact_name" value="ktor-server-netty"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## サーバーの作成方法を選択する {id="choose-create-server"}
Ktorサーバーアプリケーションは、[2つの方法](server-create-and-configure.topic#embedded)で[作成および実行](server-create-and-configure.topic#embedded)できます。サーバーパラメーターをコードで素早く渡すための[embeddedServer](#embeddedServer)を使用する方法、または外部の`application.conf`または`application.yaml`ファイルから設定を読み込むための[EngineMain](#EngineMain)を使用する方法です。

### embeddedServer {id="embeddedServer"}

[embeddedServer](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html)関数は、特定のタイプのエンジンを作成するために使用されるエンジンファクトリを受け入れます。以下の例では、[Netty](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html)ファクトリを渡して、Nettyエンジンでサーバーを実行し、`8080`ポートをリッスンします。

[object Promise]

### EngineMain {id="EngineMain"}

`EngineMain`は、サーバーを実行するためのエンジンを表します。以下のエンジンを使用できます。

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

`EngineMain.main`関数は、選択したエンジンでサーバーを起動し、外部の[設定ファイル](server-configuration-file.topic)で指定された[アプリケーションモジュール](server-modules.md)を読み込むために使用されます。以下の例では、アプリケーションの`main`関数からサーバーを起動します。

<tabs>
<tab title="Application.kt">

[object Promise]

</tab>

<tab title="application.conf">

[object Promise]

</tab>

<tab title="application.yaml">

[object Promise]

</tab>
</tabs>

ビルドシステムタスクを使用してサーバーを起動する必要がある場合は、必要な`EngineMain`をメインクラスとして設定する必要があります。

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

## エンジンの設定 {id="configure-engine"}

このセクションでは、さまざまなエンジン固有のオプションを指定する方法を見ていきます。

### コード内 {id="embedded-server-configure"}

        <p>
            <code>embeddedServer</code>関数を使用すると、<code>configure</code>パラメーターを使用してエンジン固有のオプションを渡すことができます。このパラメーターには、すべてのエンジンに共通で、
            <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
                ApplicationEngine.Configuration
            </a>
            クラスによって公開されるオプションが含まれます。
        </p>
        <p>
            以下の例は、<code>Netty</code>エンジンを使用してサーバーを設定する方法を示しています。<code>configure</code>ブロック内で、ホストとポートを指定するための<code>connector</code>を定義し、さまざまなサーバーパラメーターをカスタマイズします。
        </p>
        [object Promise]
        <p>
            <code>connectors.add()</code>メソッドは、指定されたホスト（<code>127.0.0.1</code>）とポート（<code>8080</code>）を持つコネクタを定義します。
        </p>
        <p>これらのオプションに加えて、他のエンジン固有のプロパティを設定することもできます。</p>
        <chapter title="Netty" id="netty-code">
            <p>
                Netty固有のオプションは、
                <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">
                    NettyApplicationEngine.Configuration
                </a>
                クラスによって公開されます。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Jetty" id="jetty-code">
            <p>
                Jetty固有のオプションは、
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">
                    JettyApplicationEngineBase.Configuration
                </a>
                クラスによって公開されます。
            </p>
            <p>Jettyサーバーは、
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html">
                    configureServer
                </a>
                ブロック内で設定できます。これにより、
                <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a>
                インスタンスにアクセスできます。
            </p>
            <p>
                <code>idleTimeout</code>プロパティを使用して、接続がクローズされるまでにアイドル状態であることができる時間の長さを指定します。
            </p>
            [object Promise]
        </chapter>
        <chapter title="CIO" id="cio-code">
            <p>CIO固有のオプションは、
                <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">
                    CIOApplicationEngine.Configuration
                </a>
                クラスによって公開されます。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Tomcat" id="tomcat-code">
            <p>Tomcatをエンジンとして使用する場合、
                <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">
                    configureTomcat
                </a>
                プロパティを使用して設定できます。これにより、
                <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a>
                インスタンスにアクセスできます。
            </p>
            [object Promise]
        </chapter>
        

### 設定ファイル内 {id="engine-main-configure"}

            <p>
                <code>EngineMain</code>を使用する場合、<code>ktor.deployment</code>グループ内のすべてのエンジンに共通のオプションを指定できます。
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon" id="engine-main-conf">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml" id="engine-main-yaml">
                    [object Promise]
                </tab>
            </tabs>
            <chapter title="Netty" id="netty-file">
                <p>
                    Netty固有のオプションは、<code>ktor.deployment</code>グループ内の設定ファイルでも設定できます。
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon" id="application-conf-1">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml" id="application-yaml-1">
                        [object Promise]
                    </tab>
                </tabs>
            </chapter>