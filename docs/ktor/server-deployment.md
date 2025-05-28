[//]: # (title: 部署)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

在本主题中，我们将概述如何部署 Ktor 应用。

> 为了简化服务器 Ktor 应用的部署过程，你可以使用用于 Gradle 的 [Ktor](https://github.com/ktorio/ktor-build-plugins) 插件，它提供了以下功能：
> - 构建 fat JARs。
> - 将你的应用 Docker 化。

## Ktor 部署特性 {id="ktor-specifics"}
服务器 Ktor 应用的部署过程取决于以下几点具体情况：
* 你的应用是作为独立包部署，还是部署在 servlet 容器中。
* 你使用哪种方法来创建和配置服务器。

### 独立应用 vs Servlet 容器 {id="self-contained-vs-servlet"}

Ktor 允许你直接在应用中创建并启动一个带有所需网络[引擎](server-engines.md)（例如 Netty、Jetty 或 Tomcat）的服务器。在这种情况下，引擎是你应用的一部分。你的应用可以控制引擎设置、连接和 SSL 选项。要部署你的应用，你可以将其[打包](#packaging)成 fat JAR 或可执行 JVM 应用。

与上述方法不同的是，servlet 容器应该控制应用生命周期和连接设置。Ktor 提供了一个特殊的 `ServletApplicationEngine` 引擎，它将应用的控制权委托给 servlet 容器。要在 servlet 容器中部署，你需要生成一个 [WAR 归档](server-war.md)。

### 配置：代码 vs 配置文件 {id="code-vs-config"}

配置一个用于部署的独立 Ktor 应用可能取决于[创建和配置服务器](server-create-and-configure.topic)所用的方法：在代码中配置，或通过使用[配置文件](server-configuration-file.topic)进行配置。例如，[托管服务提供商](#publishing)可能要求指定用于监听传入请求的端口。在这种情况下，你需要[配置](server-configuration-file.topic)在代码中或在 `application.conf`/`application.yaml` 中指定端口。

## 打包 {id="packaging"}

在部署你的应用之前，你需要通过以下方式之一对其进行打包：

* **Fat JAR**

  Fat JAR 是一个包含所有代码依赖项的可执行 JAR。你可以将其部署到任何支持 fat JAR 的[云服务](#publishing)。如果你需要为 GraalVM 生成原生二进制文件，也需要 Fat JAR。要创建 fat JAR，你可以使用用于 Gradle 的 [Ktor](server-fatjar.md) 插件或用于 Maven 的 [Assembly](maven-assembly-plugin.md) 插件。

* **可执行 JVM 应用**

   可执行 JVM 应用是一个包含代码依赖项和生成的启动脚本的打包应用。对于 Gradle，你可以使用 [Application](server-packaging.md) 插件来生成一个应用。

* **WAR**

   一个 [WAR 归档](server-war.md)允许你将你的应用部署到 servlet 容器中，例如 Tomcat 或 Jetty。

* **GraalVM**

   Ktor 服务器应用可以利用 [GraalVM](graalvm.md) 来获得针对不同平台的原生镜像。

## 容器化 {id="containerizing"}

在打包你的应用之后（例如，打包成可执行 JVM 应用或 fat JAR），你可以为该应用准备一个 [Docker 镜像](docker.md)。这个镜像可以用来在 Kubernetes、Swarm 或所需的云服务容器实例上运行你的应用。

## 发布 {id="publishing"}

以下教程展示了如何将 Ktor 应用部署到特定的云服务提供商：
* [](google-app-engine.md)
* [](heroku.md)
* [](elastic-beanstalk.md)

## SSL {id="ssl"}

如果你的 Ktor 服务器部署在反向代理后面（例如 Nginx 或 Apache），或者运行在 servlet 容器（Tomcat 或 Jetty）中，那么 SSL 设置将由反向代理或 servlet 容器管理。如果需要，你可以配置 Ktor 通过使用 Java KeyStore 直接提供 [SSL](server-ssl.md) 服务。

> 请注意，当 Ktor 应用部署在 servlet 容器中时，SSL 设置不会生效。