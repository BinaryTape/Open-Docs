[//]: # (title: サーバーエンジン)

<show-structure for="chapter" depth="3"/>

<link-summary>
ネットワークリクエストを処理するエンジンについて学びます。
</link-summary>

Ktorサーバーアプリケーションを実行するには、まずサーバーを[作成](server-create-and-configure.topic)し、設定する必要があります。
サーバーの設定にはさまざまなものが含まれます。

- ネットワークリクエストを処理するための[エンジン](#supported-engines)
- サーバーにアクセスするために使用されるホストとポートの値
- SSL設定

## サポートされているプラットフォーム {id="supported-engines"}

以下の表は、各エンジンがサポートするプラットフォームをリストしています。

| Engine                                    | Platforms                                                                  | HTTP/2 |
|-------------------------------------------|----------------------------------------------------------------------------|--------|
| `Netty`                                   | JVM                                                                        | ✅      |
| `Jetty`                                   | JVM                                                                        | ✅      |
| `Tomcat`                                  | JVM                                                                        | ✅      |
| `CIO` (Coroutine-based I/O)               | JVM, [Native](server-native.md), [GraalVM](graalvm.md), JavaScript, WasmJs | ✖️     |
| [`ServletApplicationEngine`](server-war.md) | JVM                                                                        | ✅      |

## 依存関係の追加 {id="dependencies"}

使用したいエンジンを使用する前に、対応する依存関係を[ビルドスクリプト](server-dependencies.topic)に追加する必要があります。

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

以下は、Nettyの依存関係を追加する例です。

<var name="artifact_name" value="ktor-server-netty"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## サーバーの作成方法を選択する {id="choose-create-server"}

Ktorサーバーアプリケーションは、[2つの方法](server-create-and-configure.topic#embedded)で作成および実行できます。[embeddedServer](#embeddedServer)を使用してコード内でサーバーパラメータを迅速に渡す方法、または[EngineMain](#EngineMain)を使用して外部の`application.conf`または`application.yaml`ファイルから設定を読み込む方法です。

### embeddedServer {id="embeddedServer"}

[`embeddedServer()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html)関数は、特定の型のエンジンを作成するために使用されるエンジンファクトリを受け入れます。以下の例では、Nettyエンジンでサーバーを実行し、ポート`8080`をリッスンするために、[`Netty`](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html)ファクトリを渡しています。

```kotlin
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}
```

### EngineMain {id="EngineMain"}

`EngineMain`は、サーバーを実行するためのエンジンを表します。以下のエンジンを使用できます。

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

`EngineMain.main`関数は、選択されたエンジンでサーバーを起動し、外部[設定ファイル](server-configuration-file.topic)で指定された[アプリケーションモジュール](server-modules.md)を読み込みます。以下の例では、アプリケーションの`main`関数からサーバーを起動しています。

<Tabs>
<TabItem title="Application.kt">

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        get("/") {
            call.respondText("Hello, world!")
        }
    }
}

```

</TabItem>

<TabItem title="application.conf">

```shell
ktor {
    deployment {
        port = 8080
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}
```

</TabItem>

<TabItem title="application.yaml">

```yaml
ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.module
```

</TabItem>
</Tabs>

ビルドシステムタスクを使用してサーバーを起動する必要がある場合は、必要な`EngineMain`をメインクラスとして設定する必要があります。

<Tabs group="languages" id="main-class-set-engine-main">
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
</Tabs>

## エンジンの設定 {id="configure-engine"}

このセクションでは、さまざまなエンジン固有のオプションを指定する方法を見ていきます。

### コード内 {id="embedded-server-configure"}

<p>
    <code>embeddedServer</code>関数は、<code>configure</code>パラメータを使用してエンジン固有のオプションを渡すことができます。このパラメータには、すべてのエンジンに共通し、
    <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
        ApplicationEngine.Configuration
    </a>
    クラスによって公開されているオプションが含まれています。
</p>
<p>
    以下の例は、<code>Netty</code>エンジンを使用してサーバーを設定する方法を示しています。<code>configure</code>ブロック内で、ホストとポートを指定するために<code>connector</code>を定義し、さまざまなサーバーパラメータをカスタマイズしています。
</p>
<code-block lang="kotlin" code="import io.ktor.server.response.*&#10;import io.ktor.server.routing.*&#10;import io.ktor.server.engine.*&#10;import io.ktor.server.netty.*&#10;&#10;fun main(args: Array&lt;String&gt;) {&#10;    embeddedServer(Netty, configure = {&#10;        connectors.add(EngineConnectorBuilder().apply {&#10;            host = &quot;127.0.0.1&quot;&#10;            port = 8080&#10;        })&#10;        connectionGroupSize = 2&#10;        workerGroupSize = 5&#10;        callGroupSize = 10&#10;        shutdownGracePeriod = 2000&#10;        shutdownTimeout = 3000&#10;    }) {&#10;        routing {&#10;            get(&quot;/&quot;) {&#10;                call.respondText(&quot;Hello, world!&quot;)&#10;            }&#10;        }&#10;    }.start(wait = true)&#10;}"/>
<p>
    <code>connectors.add()</code>メソッドは、指定されたホスト（<code>127.0.0.1</code>）
    とポート（<code>8080</code>）を持つコネクタを定義します。
</p>
<p>これらのオプションに加えて、他のエンジン固有のプロパティを設定できます。</p>
<chapter title="Netty" id="netty-code">
    <p>
        Netty固有のオプションは、
        <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">
            NettyApplicationEngine.Configuration
        </a>
        クラスによって公開されています。
    </p>
    <code-block lang="kotlin" code="        import io.ktor.server.engine.*&#10;        import io.ktor.server.netty.*&#10;&#10;        fun main() {&#10;            embeddedServer(Netty, configure = {&#10;                requestQueueLimit = 16&#10;                shareWorkGroup = false&#10;                configureBootstrap = {&#10;                    // ...&#10;                }&#10;                responseWriteTimeoutSeconds = 10&#10;            }) {&#10;                // ...&#10;            }.start(true)&#10;        }"/>
</chapter>
<chapter title="Jetty" id="jetty-code">
    <p>
        Jetty固有のオプションは、
        <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">
            JettyApplicationEngineBase.Configuration
        </a>
        クラスによって公開されています。
    </p>
    <p>
        <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html">
            configureServer
        </a>ブロック内でJettyサーバーを設定できます。これは、
        <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a>
        インスタンスへのアクセスを提供します。
    </p>
    <p>
        <code>idleTimeout</code>プロパティを使用して、接続が閉じられるまでにアイドル状態を維持できる期間を指定します。
    </p>
    <code-block lang="kotlin" code="        import io.ktor.server.engine.*&#10;        import io.ktor.server.jetty.jakarta.*&#10;&#10;        fun main() {&#10;            embeddedServer(Jetty, configure = {&#10;                configureServer = { // this: Server -&amp;gt;&#10;                    // ...&#10;                }&#10;                idleTimeout = 30.seconds&#10;            }) {&#10;                // ...&#10;            }.start(true)&#10;        }"/>
</chapter>
<chapter title="CIO" id="cio-code">
    <p>CIO固有のオプションは、
        <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">
            CIOApplicationEngine.Configuration
        </a>
        クラスによって公開されています。
    </p>
    <code-block lang="kotlin" code="        import io.ktor.server.engine.*&#10;        import io.ktor.server.cio.*&#10;&#10;        fun main() {&#10;            embeddedServer(CIO, configure = {&#10;                connectionIdleTimeoutSeconds = 45&#10;            }) {&#10;                // ...&#10;            }.start(true)&#10;        }"/>
</chapter>
<chapter title="Tomcat" id="tomcat-code">
    <p>エンジンとしてTomcatを使用する場合、
        <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">
            configureTomcat
        </a>
        プロパティを使用して設定できます。これは、
        <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a>
        インスタンスへのアクセスを提供します。
    </p>
    <code-block lang="kotlin" code="        import io.ktor.server.engine.*&#10;        import io.ktor.server.tomcat.jakarta.*&#10;&#10;        fun main() {&#10;            embeddedServer(Tomcat, configure = {&#10;                configureTomcat = { // this: Tomcat -&amp;gt;&#10;                    // ...&#10;                }&#10;            }) {&#10;                // ...&#10;            }.start(true)&#10;        }"/>
</chapter>

### 設定ファイル内 {id="engine-main-configure"}

<p>
    <code>EngineMain</code>を使用する場合、<code>ktor.deployment</code>グループ内で、すべてのエンジンに共通するオプションを指定できます。
</p>
<Tabs group="config">
    <TabItem title="application.conf" group-key="hocon" id="engine-main-conf">
        <code-block lang="shell" code="            ktor {&#10;                deployment {&#10;                    connectionGroupSize = 2&#10;                    workerGroupSize = 5&#10;                    callGroupSize = 10&#10;                    shutdownGracePeriod = 2000&#10;                    shutdownTimeout = 3000&#10;                }&#10;            }"/>
    </TabItem>
    <TabItem title="application.yaml" group-key="yaml" id="engine-main-yaml">
        <code-block lang="yaml" code="           ktor:&#10;               deployment:&#10;                   connectionGroupSize: 2&#10;                   workerGroupSize: 5&#10;                   callGroupSize: 10&#10;                   shutdownGracePeriod: 2000&#10;                   shutdownTimeout: 3000"/>
    </TabItem>
</Tabs>
<chapter title="Netty" id="netty-file">
    <p>
        <code>ktor.deployment</code>グループ内の設定ファイルで、Netty固有のオプションも設定できます。
    </p>
    <Tabs group="config">
        <TabItem title="application.conf" group-key="hocon" id="application-conf-1">
            <code-block lang="shell" code="               ktor {&#10;                   deployment {&#10;                       maxInitialLineLength = 2048&#10;                       maxHeaderSize = 1024&#10;                       maxChunkSize = 42&#10;                   }&#10;               }"/>
        </TabItem>
        <TabItem title="application.yaml" group-key="yaml" id="application-yaml-1">
            <code-block lang="yaml" code="               ktor:&#10;                   deployment:&#10;                       maxInitialLineLength: 2048&#10;                       maxHeaderSize: 1024&#10;                       maxChunkSize: 42"/>
        </TabItem>
    </Tabs>
</chapter>