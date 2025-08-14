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

> 為了簡化伺服器 Ktor 應用程式的部署過程，您可以使用適用於 Gradle 的 [Ktor](https://github.com/ktorio/ktor-build-plugins) 外掛程式，它提供了以下功能：
> - 建置 Fat JAR。
> - 將您的應用程式 Docker 化。

## Ktor 部署細節 {id="ktor-specifics"}
伺服器 Ktor 應用程式的部署過程取決於以下細節：
* 您打算將應用程式部署為獨立套件還是部署在 Servlet 容器內。
* 您用哪種方式來建立和設定伺服器。

### 獨立應用程式與 Servlet 容器 {id="self-contained-vs-servlet"}

Ktor 允許您直接在應用程式中建立並啟動具有所需網路 [引擎](server-engines.md)（例如 Netty、Jetty 或 Tomcat）的伺服器。在此情況下，引擎是您應用程式的一部分。您的應用程式可控制引擎設定、連線和 SSL 選項。要部署您的應用程式，您可以將其 [封裝](#packaging) 為 Fat JAR 或可執行 JVM 應用程式。

與上述方法相反，Servlet 容器應控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 `ServletApplicationEngine` 引擎，它將應用程式的控制權委託給 Servlet 容器。要在 Servlet 容器內部署，您需要產生一個 [WAR 歸檔](server-war.md)。

### 設定：程式碼與設定檔 {id="code-vs-config"}

設定用於部署的獨立 Ktor 應用程式可能取決於 [建立和設定伺服器](server-create-and-configure.topic) 所使用的方法：在程式碼中或透過使用 [設定檔](server-configuration-file.topic)。例如，[託管服務供應商](#publishing) 可能會要求指定用於監聽傳入請求的連接埠。在此情況下，您需要在程式碼中或在 `application.conf`/`application.yaml` 中 [設定](server-configuration-file.topic) 連接埠。

## 打包 {id="packaging"}

在部署您的應用程式之前，您需要以以下其中一種方式打包：

*   **Fat JAR**

    Fat JAR 是一個可執行 JAR，包含所有程式碼依賴項。您可以將其部署到任何支援 Fat JAR 的 [雲端服務](#publishing)。如果您需要為 GraalVM 產生原生二進位檔，也需要 Fat JAR。要建立 Fat JAR，您可以使用適用於 Gradle 的 [Ktor](server-fatjar.md) 外掛程式或適用於 Maven 的 [Assembly](maven-assembly-plugin.md) 外掛程式。

*   **可執行 JVM 應用程式**

    可執行 JVM 應用程式是一個打包好的應用程式，包含程式碼依賴項和產生的啟動腳本。對於 Gradle，您可以使用 [Application](server-packaging.md) 外掛程式來產生應用程式。

*   **WAR**

    [WAR 歸檔](server-war.md) 允許您將應用程式部署到 Servlet 容器中，例如 Tomcat 或 Jetty。

*   **GraalVM**

    Ktor 伺服器應用程式可以利用 [GraalVM](graalvm.md) 以便為不同平台提供原生映像檔。

## 容器化 {id="containerizing"}

打包應用程式後（例如，為可執行 JVM 應用程式或 Fat JAR），您可以準備一個包含此應用程式的 [Docker 映像檔](docker.md)。此映像檔隨後可用於在 Kubernetes、Swarm 或所需的雲端服務容器實例上執行您的應用程式。

## 發佈 {id="publishing"}

以下教程展示了如何將 Ktor 應用程式部署到特定的雲端供應商：
* [](google-app-engine.md)
* [](heroku.md)
* [](elastic-beanstalk.md)

## SSL {id="ssl"}

如果您的 Ktor 伺服器位於反向代理（如 Nginx 或 Apache）之後或在 Servlet 容器（Tomcat 或 Jetty）內執行，則 SSL 設定由反向代理或 Servlet 容器管理。如果需要，您可以使用 Java KeyStore [直接設定 Ktor 以提供 SSL](server-ssl.md)。

> 請注意，當 Ktor 應用程式部署在 Servlet 容器內時，SSL 設定將不生效。