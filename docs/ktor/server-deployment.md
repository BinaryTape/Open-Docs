[//]: # (title: 部署)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

在本主题中，我们将概览如何部署 Ktor 应用。

> 为了简化服务器端 Ktor 应用的部署流程，你可以使用 Gradle 的 [Ktor](https://github.com/ktorio/ktor-build-plugins) 插件，它提供了以下功能：
> - 构建 fat JAR。
> - 将你的应用 Docker 化。

## Ktor 部署细节 {id="ktor-specifics"}
服务器端 Ktor 应用的部署流程取决于以下细节：
* 你是打算将应用部署为自包含软件包，还是部署在 Servlet 容器中。
* 你使用哪种方法来创建和配置服务器。

### 自包含应用 vs Servlet 容器 {id="self-contained-vs-servlet"}

Ktor 允许你直接在应用中通过所需的网络[引擎](server-engines.md)（如 Netty、Jetty 或 Tomcat）创建并启动服务器。在这种情况下，引擎是应用的一部分。你的应用可以控制引擎设置、连接和 SSL 选项。要部署应用，你可以将其[打包](#packaging)为 fat JAR 或可执行 JVM 应用。

与上述方法不同，Servlet 容器应当控制应用的生命周期和连接设置。Ktor 提供了一个特殊的 `ServletApplicationEngine` 引擎，它将应用的控制权委托给 Servlet 容器。要在 Servlet 容器中进行部署，你需要生成 [WAR 归档](server-war.md)。

### 配置：代码 vs 配置文件 {id="code-vs-config"}

为部署配置自包含 Ktor 应用可能取决于[创建和配置服务器](server-create-and-configure.topic)时所采用的方法：是在代码中配置，还是使用[配置文件](server-configuration-file.topic)。例如，[托管服务提供商](#publishing)可能要求指定用于侦听传入请求的端口。在这种情况下，你需要在代码或 `application.conf`/`application.yaml` 中[配置](server-configuration-file.topic)端口。

## 打包 {id="packaging"}

在部署应用之前，你需要通过以下方式之一进行打包：

* **Fat JAR**

  Fat JAR 是一种包含所有代码依赖项的可执行 JAR。你可以将其部署到任何支持 fat JAR 的[云服务](#publishing)。如果你需要为 GraalVM 生成原生二进制文件，也需要 fat JAR。要创建 fat JAR，你可以使用 Gradle 的 [Ktor](server-fatjar.md) 插件或 Maven 的 [Assembly](maven-assembly-plugin.md) 插件。

* **可执行 JVM 应用**

   可执行 JVM 应用是一个包含代码依赖项和生成的启动脚本的打包应用。对于 Gradle，你可以使用 [Application](server-packaging.md) 插件来生成应用。 

* **WAR**

   [WAR 归档](server-war.md)允许你将应用部署在 Servlet 容器中，例如 Tomcat 或 Jetty。

* **GraalVM**

   Ktor 服务器应用可以利用 [GraalVM](graalvm.md) 以获得针对不同平台的原生镜像。

## 容器化 {id="containerizing"}

在打包应用之后（例如打包为可执行 JVM 应用或 fat JAR），你可以为该应用准备 [Docker 镜像](docker.md)。然后，该镜像可用于在 Kubernetes、Swarm 或所需的云服务容器实例上运行你的应用。

## 发布 {id="publishing"}

以下教程介绍了如何将 Ktor 应用部署到特定的云提供商：
* [Google App Engine](google-app-engine.md)
* [Heroku](heroku.md)
* [Dokku](dokku.md)
* [AWS Elastic Beanstalk](elastic-beanstalk.md)

## SSL {id="ssl"}

如果你的 Ktor 服务器位于反向代理（如 Nginx 或 Apache）之后，或者运行在 Servlet 容器（Tomcat 或 Jetty）中，则 SSL 设置由反向代理或 Servlet 容器管理。如有需要，你可以通过使用 Java KeyStore 配置 Ktor [直接提供 SSL 服务](server-ssl.md)。

> 请注意，当 Ktor 应用部署在 Servlet 容器内时，SSL 设置不会生效。