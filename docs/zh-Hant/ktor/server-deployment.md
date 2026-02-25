[//]: # (title: 部署)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

在本主題中，我們將概述如何部署 Ktor 應用程式。

> 為了簡化伺服器 Ktor 應用程式的部署程序，您可以使用 Gradle 的 [Ktor](https://github.com/ktorio/ktor-build-plugins) 外掛程式，它提供了以下功能：
> - 建置 fat JAR。
> - 將您的應用程式 Docker 化。

## Ktor 部署細節 {id="ktor-specifics"}
伺服器 Ktor 應用程式的部署程序取決於以下細節：
* 您是要將應用程式部署為獨立套件，還是部署在 Servlet 容器中。
* 您使用哪種方法來建立和配置伺服器。

### 獨立應用程式與 Servlet 容器 {id="self-contained-vs-servlet"}

Ktor 允許您直接在應用程式中以所需的網路[引擎](server-engines.md)（例如 Netty、Jetty 或 Tomcat）建立並啟動伺服器。在這種情況下，引擎是您應用程式的一部分。您的應用程式可以控制引擎設定、連線和 SSL 選項。要部署您的應用程式，您可以將其[封裝](#packaging)為 fat JAR 或可執行的 JVM 應用程式。

與上述方法相反，Servlet 容器應控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 `ServletApplicationEngine` 引擎，可將應用程式的控制權委託給 Servlet 容器。要部署在 Servlet 容器內，您需要產生 [WAR 封存檔](server-war.md)。

### 配置：程式碼與配置檔案 {id="code-vs-config"}

為部署配置獨立 Ktor 應用程式可能取決於[建立和配置伺服器](server-create-and-configure.topic)時所使用的方法：是在程式碼中或是透過[配置檔案](server-configuration-file.topic)。例如，託管提供者（hosting provider）可能要求指定用於監聽傳入請求的連接埠。在這種情況下，您需要透過程式碼或在 `application.conf`/`application.yaml` 中[配置](server-configuration-file.topic)連接埠。

## 封裝 {id="packaging"}

在部署應用程式之前，您需要透過以下方式之一對其進行封裝：

* **Fat JAR**

  fat JAR 是一個包含所有程式碼相依性的可執行 JAR。您可以將其部署到任何支援 fat JAR 的[雲端服務](#publishing)。如果您需要為 GraalVM 產生原生二進位檔，也需要 fat JAR。要建立 fat JAR，您可以使用 Gradle 的 [Ktor](server-fatjar.md) 外掛程式或 Maven 的 [Assembly](maven-assembly-plugin.md) 外掛程式。

* **可執行的 JVM 應用程式**

   可執行的 JVM 應用程式是一個封裝後的應用程式，其中包括程式碼相依性和產生的啟動指令碼。對於 Gradle，您可以使用 [Application](server-packaging.md) 外掛程式來產生應用程式。 

* **WAR**

   [WAR 封存檔](server-war.md)可讓您在 Servlet 容器（如 Tomcat 或 Jetty）中部署應用程式。

* **GraalVM**

   Ktor 伺服器應用程式可以利用 [GraalVM](graalvm.md) 來獲得適用於不同平台的原生映像。

## 容器化 {id="containerizing"}

在您封裝應用程式（例如，封裝為可執行的 JVM 應用程式或 fat JAR）之後，您可以準備一個包含此應用程式的 [Docker 映像](docker.md)。此映像隨後可用於在 Kubernetes、Swarm 或所需的雲端服務容器執行個體上執行您的應用程式。

## 發佈 {id="publishing"}

以下教學說明如何將 Ktor 應用程式部署到特定的雲端提供者：
* [Google App Engine](google-app-engine.md)
* [Heroku](heroku.md)
* [AWS Elastic Beanstalk](elastic-beanstalk.md)

## SSL {id="ssl"}

如果您的 Ktor 伺服器位於反向代理（如 Nginx 或 Apache）之後，或者在 Servlet 容器（Tomcat 或 Jetty）內執行，則 SSL 設定由反向代理或 Servlet 容器管理。如果需要，您可以透過使用 Java KeyStore 配置 Ktor [直接提供 SSL 服務](server-ssl.md)。

> 請注意，當 Ktor 應用程式部署在 Servlet 容器內時，SSL 設定不會生效。