[//]: # (title: 服务器引擎)

<show-structure for="chapter" depth="3"/>

<link-summary>
了解处理网络请求的引擎。
</link-summary>

要运行 Ktor 服务器应用程序，您需要首先[创建](server-create-and-configure.topic)并配置服务器。
服务器配置包含不同的设置：
- 用于处理网络请求的[引擎](#supported-engines)；
- 用于访问服务器的主机和端口值；
- SSL 设置；
- ……等等。

## 支持的引擎 {id="supported-engines"}

下表列出了 Ktor 支持的引擎及其支持的平台：

| 引擎                                  | 平台                                               | HTTP/2 |
|-----------------------------------------|----------------------------------------------------|--------|
| `Netty`                                 | JVM                                                | ✅      |
| `Jetty`                                 | JVM                                                | ✅      |
| `Tomcat`                                | JVM                                                | ✅      |
| `CIO` (基于协程的 I/O)                    | JVM, [原生](server-native.md), [GraalVM](graalvm.md) | ✖️     |
| [ServletApplicationEngine](server-war.md) | JVM                                                | ✅      |

## 添加依赖项 {id="dependencies"}

在使用所需引擎之前，您需要将相应的[依赖项](server-dependencies.topic)添加到您的构建脚本中：

*   `ktor-server-netty`
*   `ktor-server-jetty-jakarta`
*   `ktor-server-tomcat-jakarta`
*   `ktor-server-cio`

下面是为 Netty 添加依赖项的示例：

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
    

## 选择如何创建服务器 {id="choose-create-server"}
Ktor 服务器应用程序可以[通过两种方式创建和运行](server-create-and-configure.topic#embedded)：使用 [embeddedServer](#embeddedServer) 在代码中快速传递服务器形参，或使用 [EngineMain](#EngineMain) 从外部 `application.conf` 或 `application.yaml` 文件加载配置。

### embeddedServer {id="embeddedServer"}

[embeddedServer](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html) 函数接受一个引擎工厂，用于创建特定类型的引擎。在下面的示例中，我们传递 [Netty](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html) 工厂来运行使用 Netty 引擎的服务器并监听 `8080` 端口：

[object Promise]

### EngineMain {id="EngineMain"}

`EngineMain` 代表一个用于运行服务器的引擎。您可以使用以下引擎：

*   `io.ktor.server.netty.EngineMain`
*   `io.ktor.server.jetty.jakarta.EngineMain`
*   `io.ktor.server.tomcat.jakarta.EngineMain`
*   `io.ktor.server.cio.EngineMain`

`EngineMain.main` 函数用于启动带有选定引擎的服务器，并加载外部[配置文件](server-configuration-file.topic)中指定的[应用程序模块](server-modules.md)。在下面的示例中，我们从应用程序的 `main` 函数启动服务器：

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

如果您需要使用构建系统任务启动服务器，您需要将所需的 `EngineMain` 配置为主类：

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

## 配置引擎 {id="configure-engine"}

本节将介绍如何指定各种引擎特有的选项。

### 在代码中 {id="embedded-server-configure"}

        <p>
            <code>embeddedServer</code> 函数允许您使用 <code>configure</code> 形参传递引擎特有的选项。此形参包含所有引擎通用的选项，并由
            <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
                ApplicationEngine.Configuration
            </a>
            类公开。
        </p>
        <p>
            下面的示例展示了如何使用 <code>Netty</code> 引擎配置服务器。在 <code>configure</code> 代码块中，我们定义了一个 <code>connector</code> 来指定主机和端口，并自定义各种服务器形参：
        </p>
        [object Promise]
        <p>
            <code>connectors.add()</code> 方法定义了一个指定主机（<code>127.0.0.1</code>）
            和端口（<code>8080</code>）的连接器。
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
            [object Promise]
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
                代码块中配置 Jetty 服务器，该代码块提供了对
                <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a>
                实例的访问。
            </p>
            <p>
                使用 <code>idleTimeout</code> 属性指定连接在关闭前可以空闲的时长。
            </p>
            [object Promise]
        </chapter>
        <chapter title="CIO" id="cio-code">
            <p>CIO 特有的选项由
                <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">
                    CIOApplicationEngine.Configuration
                </a>
                类公开。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Tomcat" id="tomcat-code">
            <p>如果您使用 Tomcat 作为引擎，您可以使用
                <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">
                    configureTomcat
                </a>
                属性来配置它，该属性提供了对
                <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a>
                实例的访问。
            </p>
            [object Promise]
        </chapter>
        

### 在配置文件中 {id="engine-main-configure"}

            <p>
                如果您使用 <code>EngineMain</code>，您可以在 <code>ktor.deployment</code> 组中指定所有引擎通用的选项。
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
                    您还可以在 <code>ktor.deployment</code> 组的配置文件中配置 Netty 特有的选项：
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