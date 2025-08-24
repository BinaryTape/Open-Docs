[//]: # (title: 服务器引擎)

<show-structure for="chapter" depth="3"/>

<link-summary>
了解处理网络请求的引擎。
</link-summary>

要运行 Ktor 服务器应用程序，您需要先[创建](server-create-and-configure.topic)和配置服务器。
服务器配置包括不同的设置：

- 用于处理网络请求的[引擎](#supported-engines)；
- 用于访问服务器的主机和端口值；
- SSL 设置。

## 支持的平台 {id="supported-engines"}

下表列出了各引擎支持的平台：

| Engine                                    | Platforms                                                                  | HTTP/2 |
|-------------------------------------------|----------------------------------------------------------------------------|--------|
| `Netty`                                   | JVM                                                                        | ✅      |
| `Jetty`                                   | JVM                                                                        | ✅      |
| `Tomcat`                                  | JVM                                                                        | ✅      |
| `CIO` (基于协程的 I/O)                     | JVM, [原生](server-native.md), [GraalVM](graalvm.md), JavaScript, WasmJs | ✖️     |
| [`ServletApplicationEngine`](server-war.md) | JVM                                                                        | ✅      |

## 添加依赖项 {id="dependencies"}

在使用所需的引擎之前，您需要将相应的依赖项添加到您的[构建脚本](server-dependencies.topic)中：

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

以下是为 Netty 添加依赖项的示例：

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

## 选择如何创建服务器 {id="choose-create-server"}

Ktor 服务器应用程序可以通过[两种方式创建和运行](server-create-and-configure.topic#embedded)：使用 [embeddedServer](#embeddedServer) 在代码中快速传递服务器形参，或者使用 [EngineMain](#EngineMain) 从外部的 `application.conf` 或 `application.yaml` 文件加载配置。

### embeddedServer {id="embeddedServer"}

[`embeddedServer()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html) 函数接受一个引擎工厂，用于创建特定类型的引擎。在以下示例中，我们传入 [`Netty`](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html) 工厂，以 Netty 引擎运行服务器并监听 `8080` 端口：

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

`EngineMain` 表示一个用于运行服务器的引擎。您可以使用以下引擎：

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

`EngineMain.main` 函数用于启动具有所选引擎的服务器，并加载外部[配置文件](server-configuration-file.topic)中指定的[应用程序模块](server-modules.md)。在以下示例中，我们从应用程序的 `main` 函数启动服务器：

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

如果您需要使用构建系统任务启动服务器，则需要将所需的 `EngineMain` 配置为主类：

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

## 配置引擎 {id="configure-engine"}

在本节中，我们将介绍如何指定各种引擎特有的选项。

### 在代码中 {id="embedded-server-configure"}

<p>
    <code>embeddedServer</code> 函数允许您使用 <code>configure</code> 形参传递引擎特有的选项。此形参包含所有引擎共有的选项，并由
    <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
        ApplicationEngine.Configuration
    </a>
    类公开。
</p>
<p>
    以下示例展示了如何使用 <code>Netty</code> 引擎配置服务器。在 <code>configure</code> 代码块中，我们定义了一个 <code>connector</code> 来指定主机和端口，并自定义各种服务器形参：
</p>
<code-block lang="kotlin" code="import io.ktor.server.response.*&#10;import io.ktor.server.routing.*&#10;import io.ktor.server.engine.*&#10;import io.ktor.server.netty.*&#10;&#10;fun main(args: Array&lt;String&gt;) {&#10;    embeddedServer(Netty, configure = {&#10;        connectors.add(EngineConnectorBuilder().apply {&#10;            host = &quot;127.0.0.1&quot;&#10;            port = 8080&#10;        })&#10;        connectionGroupSize = 2&#10;        workerGroupSize = 5&#10;        callGroupSize = 10&#10;        shutdownGracePeriod = 2000&#10;        shutdownTimeout = 3000&#10;    }) {&#10;        routing {&#10;            get(&quot;/&quot;) {&#10;                call.respondText(&quot;Hello, world!&quot;)&#10;            }&#10;        }&#10;    }.start(wait = true)&#10;}"/>
<p>
    <code>connectors.add()</code> 方法定义了一个具有指定主机 (<code>127.0.0.1</code>)
    和端口 (<code>8080</code>) 的连接器。
</p>
<p>除了这些选项之外，您还可以配置其他引擎特有的属性。</p>
<chapter title="Netty" id="netty-code">
    <p>
        Netty 特有的选项由
        <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">
            NettyApplicationEngine.Configuration
        </a>
        类公开。
    </p>
    <code-block lang="kotlin" code="        import io.ktor.server.engine.*&#10;        import io.ktor.server.netty.*&#10;&#10;        fun main() {&#10;            embeddedServer(Netty, configure = {&#10;                requestQueueLimit = 16&#10;                shareWorkGroup = false&#10;                configureBootstrap = {&#10;                    // ...&#10;                }&#10;                responseWriteTimeoutSeconds = 10&#10;            }) {&#10;                // ...&#10;            }.start(true)&#10;        }"/>
</chapter>
<chapter title="Jetty" id="jetty-code">
    <p>
        Jetty 特有的选项由
        <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">
            JettyApplicationEngineBase.Configuration
        </a>
        类公开。
    </p>
    <p>您可以在
        <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html">
            configureServer
        </a>
        代码块中配置 Jetty 服务器，它提供了对
        <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a>
        实例的访问。
    </p>
    <p>
        使用 <code>idleTimeout</code> 属性可以指定连接在关闭之前可以保持空闲的时长。
    </p>
    <code-block lang="kotlin" code="        import io.ktor.server.engine.*&#10;        import io.ktor.server.jetty.jakarta.*&#10;&#10;        fun main() {&#10;            embeddedServer(Jetty, configure = {&#10;                configureServer = { // this: Server -&amp;gt;&#10;                    // ...&#10;                }&#10;                idleTimeout = 30.seconds&#10;            }) {&#10;                // ...&#10;            }.start(true)&#10;        }"/>
</chapter>
<chapter title="CIO" id="cio-code">
    <p>CIO 特有的选项由
        <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">
            CIOApplicationEngine.Configuration
        </a>
        类公开。
    </p>
    <code-block lang="kotlin" code="        import io.ktor.server.engine.*&#10;        import io.ktor.server.cio.*&#10;&#10;        fun main() {&#10;            embeddedServer(CIO, configure = {&#10;                connectionIdleTimeoutSeconds = 45&#10;            }) {&#10;                // ...&#10;            }.start(true)&#10;        }"/>
</chapter>
<chapter title="Tomcat" id="tomcat-code">
    <p>如果您使用 Tomcat 作为引擎，则可以使用
        <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">
            configureTomcat
        </a>
        属性对其进行配置，该属性提供了对
        <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a>
        实例的访问。
    </p>
    <code-block lang="kotlin" code="        import io.ktor.server.engine.*&#10;        import io.ktor.server.tomcat.jakarta.*&#10;&#10;        fun main() {&#10;            embeddedServer(Tomcat, configure = {&#10;                configureTomcat = { // this: Tomcat -&amp;gt;&#10;                    // ...&#10;                }&#10;            }) {&#10;                // ...&#10;            }.start(true)&#10;        }"/>
</chapter>

### 在配置文件中 {id="engine-main-configure"}

<p>
    如果您使用 <code>EngineMain</code>，可以在 <code>ktor.deployment</code> 组中指定所有引擎共有的选项。
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
        您还可以在配置文件中，在 <code>ktor.deployment</code> 组内配置 Netty 特有的选项：
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