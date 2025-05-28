[//]: # (title: WAR 檔案)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war">jetty-war</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war">tomcat-war</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl">tomcat-war-ssl</a>
</p>
</tldr>

<link-summary>
了解如何使用 WAR 檔案，在 Servlet 容器內執行並部署 Ktor 應用程式。
</link-summary>

Ktor 應用程式可以在包含 Tomcat 和 Jetty 的 Servlet 容器中執行和部署。若要在 Servlet 容器中部署，您需要產生一個 WAR 檔案，然後將其部署到支援 WAR 的伺服器或雲端服務上。

在此主題中，我們將向您展示如何：
* 設定 Ktor 以在 Servlet 應用程式中使用它；
* 應用 Gretty 和 War 外掛程式以執行和打包 WAR 應用程式；
* 執行 Ktor Servlet 應用程式；
* 產生並部署 WAR 檔案。

## 在 Servlet 應用程式中設定 Ktor {id="configure-ktor"}

Ktor 允許您在應用程式中直接[建立並啟動伺服器](server-create-and-configure.topic)，並使用所需的引擎（例如 Netty、Jetty 或 Tomcat）。在這種情況下，您的應用程式可以控制引擎設定、連線和 SSL 選項。

與上述方法相反，Servlet 容器應該控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 [ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html) 引擎，可將應用程式的控制權委託給 Servlet 容器。

> 請注意，當 Ktor 應用程式部署在 Servlet 容器中時，[連線和 SSL 設定](server-configuration-file.topic)不會生效。
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl) 範例展示了如何在 Tomcat 中設定 SSL。

### 新增依賴項 {id="add-dependencies"}

要在 Servlet 應用程式中使用 Ktor，您需要在建置腳本中包含 `ktor-server-servlet-jakarta` artifact：

<var name="artifact_name" value="ktor-server-servlet-jakarta"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

如果您使用 9.x 或更早版本的 Tomcat/Jetty，請改為新增 `ktor-server-servlet` artifact。

> 請注意，當 Ktor 應用程式部署在 Servlet 容器中時，您不需要單獨的 [Jetty 或 Tomcat artifact](server-engines.md#dependencies)。

### 設定 Servlet {id="configure-servlet"}

要在您的應用程式中註冊 Ktor Servlet，請開啟 `WEB-INF/web.xml` 檔案並將 `ServletApplicationEngine` 指派給 `servlet-class` 屬性：

<tabs>
<tab title="Tomcat/Jetty v10.x+">

```xml
```
{src="snippets/jetty-war/src/main/webapp/WEB-INF/web.xml" include-lines="7-16"}

</tab>
<tab title="Tomcat/Jetty v9.x">
<code-block lang="XML">
<![CDATA[
<servlet>
    <display-name>KtorServlet</display-name>
    <servlet-name>KtorServlet</servlet-name>
    <servlet-class>io.ktor.server.servlet.ServletApplicationEngine</servlet-class>
    <init-param>
        <param-name>io.ktor.ktor.config</param-name>
        <param-value>application.conf</param-value>
    </init-param>
    <async-supported>true</async-supported>
</servlet>
]]>
</code-block>
</tab>
</tabs>

然後，設定此 Servlet 的 URL 模式：

```xml
```
{src="snippets/jetty-war/src/main/webapp/WEB-INF/web.xml" include-lines="18-21"}

## 設定 Gretty {id="configure-gretty"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty) 外掛程式允許您在 Jetty 和 Tomcat 上[執行](#run) Servlet 應用程式。要安裝此外掛程式，請開啟 `build.gradle.kts` 檔案並將以下程式碼新增到 `plugins` 區塊：

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="5,8,10"}

然後，您可以依照以下方式在 `gretty` 區塊中設定它：

<tabs>
<tab title="Jetty">

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="12-16"}

</tab>
<tab title="Tomcat">

```groovy
```
{src="snippets/tomcat-war/build.gradle.kts" include-lines="12-16"}

</tab>
</tabs>

最後，設定 `run` 任務：

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="32-36"}

## 設定 War {id="configure-war"}

War 外掛程式允許您[產生](#generate-war) WAR 檔案。您可以透過將以下行新增到 `build.gradle.kts` 檔案中的 `plugins` 區塊來安裝它：

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="5,9-10"}

## 執行應用程式 {id="run"}

您可以使用已[設定的 Gretty 外掛程式](#configure-gretty)，透過 `run` 任務來執行 Servlet 應用程式。例如，以下命令執行 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 範例：

```Bash
./gradlew :jetty-war:run
```

## 產生並部署 WAR 檔案 {id="generate-war"}

要使用 [War](#configure-war) 外掛程式產生包含您應用程式的 WAR 檔案，請執行 `war` 任務。對於 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 範例，命令如下所示：

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war` 會在 `build/libs` 目錄中建立。您可以將生成的檔案複製到 `jetty/webapps` 目錄中，以在 Servlet 容器中部署該檔案。例如，下面的 `Dockerfile` 顯示了如何在 Jetty 或 Tomcat Servlet 容器中執行建立的 WAR：

<tabs>
<tab title="Jetty">

```Docker
```
{src="snippets/jetty-war/Dockerfile"}

</tab>
<tab title="Tomcat">

```Docker
```
{src="snippets/tomcat-war/Dockerfile"}

</tab>
</tabs>

您可以在此處找到完整的範例：[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 和 [tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war)。