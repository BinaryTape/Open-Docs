[//]: # (title: 部署)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

在本主題中，我們將概述如何部署 Ktor 應用程式。

> 為了簡化伺服器 Ktor 應用程式的部署過程，您可以使用 [Ktor](https://github.com/ktorio/ktor-build-plugins) 的 Gradle 插件，它提供了以下功能：
> - 建置胖 JAR (Fat JAR)。
> - 將您的應用程式 Docker 化。

## Ktor 部署細節 {id="ktor-specifics"}
伺服器 Ktor 應用程式的部署過程取決於以下細節：
* 您是要將應用程式部署為獨立套件，還是部署在 Servlet 容器內。
* 您使用哪種方法來建立和配置伺服器。

### 獨立應用程式與 Servlet 容器 {id="self-contained-vs-servlet"}

Ktor 允許您直接在應用程式中建立並啟動一個帶有所需網路 [引擎](server-engines.md) (例如 Netty、Jetty 或 Tomcat) 的伺服器。在這種情況下，引擎是您應用程式的一部分。您的應用程式可以控制引擎設定、連線和 SSL 選項。要部署您的應用程式，您可以將其 [打包](#packaging) 為胖 JAR 或可執行 JVM 應用程式。

與上述方法相反，Servlet 容器應該控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 `ServletApplicationEngine` 引擎，它將應用程式的控制權委託給 Servlet 容器。要在 Servlet 容器內部署，您需要產生一個 [WAR 檔案](server-war.md)。

### 配置：程式碼與配置檔案 {id="code-vs-config"}

配置用於部署的獨立 Ktor 應用程式可能取決於用於 [建立和配置伺服器](server-create-and-configure.topic) 的方法：在程式碼中或透過使用 [配置檔案](server-configuration-file.topic)。例如，[主機提供商](#publishing) 可能要求指定用於監聽傳入請求的連接埠。在這種情況下，您需要在程式碼中或在 `application.conf`/`application.yaml` 中 [配置](server-configuration-file.topic) 一個連接埠。

## 打包 {id="packaging"}

在部署應用程式之前，您需要透過以下方式之一對其進行打包：

* **胖 JAR**

  胖 JAR 是一個可執行 JAR，包含所有程式碼依賴項。您可以將其部署到任何支援胖 JAR 的 [雲端服務](#publishing)。如果您需要為 GraalVM 產生原生二進位檔，也需要胖 JAR。要建立胖 JAR，您可以使用 [Ktor](server-fatjar.md) 的 Gradle 插件或 [Assembly](maven-assembly-plugin.md) 的 Maven 插件。

* **可執行 JVM 應用程式**

   可執行 JVM 應用程式是一個打包好的應用程式，包含程式碼依賴項和產生的啟動腳本。對於 Gradle，您可以使用 [Application](server-packaging.md) 插件來產生一個應用程式。

* **WAR**

   [WAR 檔案](server-war.md) 允許您將應用程式部署到 Servlet 容器中，例如 Tomcat 或 Jetty。

* **GraalVM**

   Ktor 伺服器應用程式可以使用 [GraalVM](graalvm.md) 以便為不同平台提供原生映像。

## 容器化 {id="containerizing"}

在您打包應用程式後 (例如，打包成可執行 JVM 應用程式或胖 JAR)，您可以為此應用程式準備一個 [Docker 映像](docker.md)。此映像可用於在 Kubernetes、Swarm 或所需的雲端服務容器實例上執行您的應用程式。

## 發佈 {id="publishing"}

以下教程展示了如何將 Ktor 應用程式部署到特定的雲端供應商：
* [](google-app-engine.md)
* [](heroku.md)
* [](elastic-beanstalk.md)

## SSL {id="ssl"}

如果您的 Ktor 伺服器位於反向代理 (例如 Nginx 或 Apache) 後方，或在 Servlet 容器 (Tomcat 或 Jetty) 內執行，則 SSL 設定由反向代理或 Servlet 容器管理。如果需要，您可以透過使用 Java KeyStore 來配置 Ktor 直接提供 [SSL 服務](server-ssl.md)。

> 請注意，當 Ktor 應用程式部署在 Servlet 容器內時，SSL 設定不會生效。