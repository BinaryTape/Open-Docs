[//]: # (title: 服务器引擎)

<show-structure for="chapter" depth="3"/>

<link-summary>
了解处理网络请求的引擎。
</link-summary>

要运行 Ktor 服务端应用程序，您需要首先[创建](server-create-and-configure.topic)并配置一个服务器。
服务器配置包括不同的设置：
- 一个用于处理网络请求的[引擎](#supported-engines)；
- 用于访问服务器的主机和端口值；
- SSL 设置；
- ……等等。

## 支持的引擎 {id="supported-engines"}

下表列出了 Ktor 支持的引擎及其支持的平台：

| 引擎                                  | 平台                                            | HTTP/2 |
|-----------------------------------------|------------------------------------------------------|--------|
| `Netty`                                 | JVM                                                  | ✅      |
| `Jetty`                                 | JVM                                                  | ✅      |
| `Tomcat`                                | JVM                                                  | ✅      |
| `CIO` (基于协程的 I/O)             | JVM, [Native](server-native.md), [GraalVM](graalvm.md) | ✖️     |
| [ServletApplicationEngine](server-war.md) | JVM                                                  | ✅      |

## 添加依赖项 {id="dependencies"}

在使用所需引擎之前，您需要将相应的依赖项添加到您的[构建脚本](server-dependencies.topic)中：

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

下面是添加 Netty 依赖项的示例：

<var name="artifact_name" value="ktor-server-netty"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 选择创建服务器的方式 {id="choose-create-server"}
Ktor 服务端应用程序可以通过[两种方式创建和运行](server-create-and-configure.topic#embedded)：使用 [embeddedServer](#embeddedServer) 在代码中快速传递服务器参数，或者使用 [EngineMain](#EngineMain) 从外部的 ``application.conf`` 或 ``application.yaml`` 文件加载配置。

### embeddedServer {id="embeddedServer"}

[embeddedServer](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html) 函数接受一个引擎工厂，用于创建特定类型的引擎。在下面的示例中，我们传递 [Netty](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html) 工厂，以 Netty 引擎运行服务器并监听 ``8080`` 端口：

```kotlin
```

{src="snippets/embedded-server/src/main/kotlin/com/example/Application.kt" include-lines="3-7,13,28-35"}

### EngineMain {id="EngineMain"}

``EngineMain`` 代表一个用于运行服务器的引擎。您可以使用以下引擎：

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

``EngineMain.main`` 函数用于启动使用所选引擎的服务器，并加载外部[配置文件](server-configuration-file.topic)中指定的[应用程序模块](server-modules.md)。在下面的示例中，我们从应用程序的 ``main`` 函数启动服务器：

<tabs>
<tab title="Application.kt">

```kotlin
```

{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt"}

</tab>

<tab title="application.conf">

```shell
```

{src="snippets/engine-main/src/main/resources/application.conf"}

</tab>

<tab title="application.yaml">

```yaml
```

{src="snippets/engine-main-yaml/src/main/resources/application.yaml"}

</tab>
</tabs>

如果您需要使用构建系统任务启动服务器，您需要将所需的 ``EngineMain`` 配置为主类：

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

在本节中，我们将介绍如何指定各种引擎特有的选项。

### 在代码中 {id="embedded-server-configure"}

<include from="server-configuration-code.topic" element-id="embedded-engine-configuration"/>

### 在配置文件中 {id="engine-main-configure"}

<include from="server-configuration-file.topic" element-id="engine-main-configuration"/>