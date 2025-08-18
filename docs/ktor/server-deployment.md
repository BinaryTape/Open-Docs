[//]: # (title: 部署)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

在本主题中，我们将概述如何部署 Ktor 应用程序。

> 为了简化服务器 Ktor 应用程序的部署过程，你可以使用 [Ktor](https://github.com/ktorio/ktor-build-plugins) 的 Gradle 插件，该插件提供以下能力：
> - 构建 fat JAR。
> - 将你的应用程序 Docker 化。

## Ktor 部署特有之处 {id="ktor-specifics"}
服务器 Ktor 应用程序的部署过程取决于以下特有之处：
* 你是计划将应用程序部署为自包含包，还是部署在 servlet 容器内。
* 你使用哪种方法来创建和配置服务器。

### 自包含应用与 Servlet 容器对比 {id="self-contained-vs-servlet"}

Ktor 允许你直接在应用程序中创建并启动带有所需网络[引擎](server-engines.md)（例如 Netty、Jetty 或 Tomcat）的服务器。在这种情况下，引擎是你应用程序的一部分。你的应用程序控制引擎设置、连接和 SSL 选项。要部署你的应用程序，你可以将其[打包](#packaging)为 fat JAR 或可执行 JVM 应用程序。

与上述方法相反，servlet 容器应控制应用程序生命周期和连接设置。Ktor 提供了一个特殊的 `ServletApplicationEngine` 引擎，它将应用程序的控制权委托给 servlet 容器。要在 servlet 容器内进行部署，你需要生成一个 [WAR 归档](server-war.md)。

### 配置：代码与配置文件对比 {id="code-vs-config"}

配置用于部署的自包含 Ktor 应用程序可能取决于[创建和配置服务器](server-create-and-configure.topic)所用的方法：在代码中配置，或者通过使用[配置文件](server-configuration-file.topic)配置。例如，[托管服务提供商](#publishing)可能要求指定用于监听传入请求的端口。在这种情况下，你需要在代码中或在 `application.conf`/`application.yaml` 中[配置](server-configuration-file.topic)端口。

## 打包 {id="packaging"}

在部署应用程序之前，你需要通过以下方式之一对其进行打包：

*   **Fat JAR**

    fat JAR 是一个包含所有代码依赖项的可执行 JAR。你可以将其部署到任何支持 fat JAR 的[云服务](#publishing)。如果你需要为 GraalVM 生成原生二进制文件，也需要 fat JAR。要创建 fat JAR，你可以使用 [Ktor](server-fatjar.md) 的 Gradle 插件或 [Assembly](maven-assembly-plugin.md) 的 Maven 插件。

*   **可执行 JVM 应用程序**

    可执行 JVM 应用程序是包含代码依赖项和生成的启动脚本的打包应用程序。对于 Gradle，你可以使用 [Application](server-packaging.md) 插件来生成应用程序。

*   **WAR**

    [WAR 归档](server-war.md)允许你将应用程序部署在 servlet 容器内，例如 Tomcat 或 Jetty。

*   **GraalVM**

    Ktor 服务器应用程序可以利用 [GraalVM](graalvm.md) 以拥有针对不同平台的原生镜像。

## 容器化 {id="containerizing"}

在打包应用程序（例如，打包为可执行 JVM 应用程序或 fat JAR）后，你可以使用此应用程序准备一个 [Docker 镜像](docker.md)。此镜像可用于在 Kubernetes、Swarm 或所需的云服务容器实例上运行你的应用程序。

## 发布 {id="publishing"}

下面的教程展示了如何将 Ktor 应用程序部署到特定的云服务提供商：
* [Google App Engine](google-app-engine.md)
* [Heroku](heroku.md)
* [AWS Elastic Beanstalk](elastic-beanstalk.md)

## SSL {id="ssl"}

如果你的 Ktor 服务器位于反向代理（例如 Nginx 或 Apache）之后，或者在 servlet 容器（Tomcat 或 Jetty）内部运行，则 SSL 设置由反向代理或 servlet 容器管理。如果需要，你可以通过使用 Java KeyStore 来配置 Ktor [直接提供 SSL](server-ssl.md)。

> 请注意，当 Ktor 应用程序部署在 servlet 容器内时，SSL 设置不生效。