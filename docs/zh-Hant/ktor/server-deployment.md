[//]: # (title: 部署)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

在本主題中，我們將概述如何部署 Ktor 應用程式。

> 為了簡化伺服器 Ktor 應用程式的部署過程，您可以使用 [Ktor](https://github.com/ktorio/ktor-build-plugins) 的 Gradle 插件，它提供了以下功能：
> - 建立 fat JAR。
> - 將您的應用程式 Docker 化。

## Ktor 部署細節 {id="ktor-specifics"}
伺服器 Ktor 應用程式的部署過程取決於以下細節：
* 您打算將應用程式部署為自包含套件還是部署到 servlet 容器中。
* 您使用哪種方法來建立和配置伺服器。

### 自包含應用程式 vs Servlet 容器 {id="self-contained-vs-servlet"}

Ktor 允許您直接在應用程式中建立並啟動帶有所需網路[引擎](server-engines.md)（例如 Netty、Jetty 或 Tomcat）的伺服器。在此情況下，引擎是您應用程式的一部分。您的應用程式可以控制引擎設定、連線和 SSL 選項。要部署您的應用程式，您可以將其[打包](#packaging)為 fat JAR 或可執行 JVM 應用程式。

與上述方法相反，servlet 容器應控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 `ServletApplicationEngine` 引擎，將應用程式的控制權委託給 servlet 容器。要在 servlet 容器中部署，您需要生成一個 [WAR 歸檔](server-war.md)。

### 配置：程式碼 vs 配置檔 {id="code-vs-config"}

為部署配置自包含的 Ktor 應用程式可能取決於[建立和配置伺服器](server-create-and-configure.topic)所使用的方法：是在程式碼中進行，還是透過使用[配置檔](server-configuration-file.topic)。例如，[託管服務供應商](#publishing)可能要求指定用於監聽傳入請求的埠。在此情況下，您需要透過程式碼或在 `application.conf`/`application.yaml` 中[配置](server-configuration-file.topic)一個埠。

## 打包 {id="packaging"}

在部署您的應用程式之前，您需要以以下其中一種方式對其進行打包：

* **Fat JAR**

  Fat JAR 是一個包含所有程式碼依賴的可執行 JAR。您可以將其部署到任何支援 fat JAR 的[雲端服務](#publishing)。如果您需要為 GraalVM 生成原生二進位檔，也需要 fat JAR。要建立 fat JAR，您可以使用 Ktor 的 [Gradle](server-fatjar.md) 插件或 Maven 的 [Assembly](maven-assembly-plugin.md) 插件。

* **可執行 JVM 應用程式**

   可執行 JVM 應用程式是一個已打包的應用程式，包含程式碼依賴和生成的啟動腳本。對於 Gradle，您可以使用 [Application](server-packaging.md) 插件來生成應用程式。

* **WAR**

   [WAR 歸檔](server-war.md)允許您將應用程式部署到 servlet 容器中，例如 Tomcat 或 Jetty。

* **GraalVM**

   Ktor 伺服器應用程式可以使用 [GraalVM](graalvm.md) 以便為不同平台提供原生映像檔。

## 容器化 {id="containerizing"}

在您打包應用程式（例如，為可執行 JVM 應用程式或 fat JAR）之後，您可以準備一個包含此應用程式的 [Docker 映像檔](docker.md)。此映像檔隨後可用於在 Kubernetes、Swarm 或所需的雲端服務容器實例上運行您的應用程式。

## 發佈 {id="publishing"}

以下教學展示了如何將 Ktor 應用程式部署到特定的雲端服務供應商：
* [Google App Engine](google-app-engine.md)
* [Heroku](heroku.md)
* [AWS Elastic Beanstalk](elastic-beanstalk.md)

## SSL {id="ssl"}

如果您的 Ktor 伺服器位於反向代理（例如 Nginx 或 Apache）之後，或者在 servlet 容器（Tomcat 或 Jetty）中運行，則 SSL 設定由反向代理或 servlet 容器管理。如果需要，您可以使用 Java KeyStore 配置 Ktor [直接提供 SSL](server-ssl.md)。

> 請注意，當 Ktor 應用程式部署到 servlet 容器中時，SSL 設定無效。