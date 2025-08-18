[//]: # (title: WAR)

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
學習如何使用 WAR 檔案在 servlet 容器中執行及部署 Ktor 應用程式。
</link-summary>

一個 Ktor 應用程式可以在包含 Tomcat 和 Jetty 的 servlet 容器中執行及部署。若要在 servlet 容器中部署，您需要生成一個 WAR 檔案，然後將其部署到支援 WAR 的伺服器或雲端服務。

在本主題中，我們將向您展示如何：
* 配置 Ktor 以便在 servlet 應用程式中使用它；
* 應用 Gretty 和 War 外掛程式來執行及打包 WAR 應用程式；
* 執行 Ktor servlet 應用程式；
* 生成及部署一個 WAR 檔案。

## 在 servlet 應用程式中配置 Ktor {id="configure-ktor"}

Ktor 允許您在應用程式中直接使用所需的引擎（例如 Netty、Jetty 或 Tomcat）[建立並啟動伺服器](server-create-and-configure.topic)。在這種情況下，您的應用程式可以控制引擎設定、連線及 SSL 選項。

與上述方法相比，servlet 容器應該控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 [ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html) 引擎，它將應用程式的控制權委託給 servlet 容器。

> 請注意，當 Ktor 應用程式部署在 servlet 容器中時，[連線和 SSL 設定](server-configuration-file.topic)不會生效。
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl) 範例展示了如何在 Tomcat 中配置 SSL。

### 添加依賴項 {id="add-dependencies"}

若要在 servlet 應用程式中使用 Ktor，您需要在建置腳本中包含 `ktor-server-servlet-jakarta` 成品：

<var name="artifact_name" value="ktor-server-servlet-jakarta"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

如果您使用 9.x 或更早版本的 Tomcat/Jetty，請改為添加 `ktor-server-servlet` 成品。

> 請注意，當 Ktor 應用程式部署在 servlet 容器中時，您不需要單獨的 [Jetty 或 Tomcat 成品](server-engines.md#dependencies)。

### 配置一個 servlet {id="configure-servlet"}

若要在您的應用程式中註冊 Ktor servlet，請開啟 `WEB-INF/web.xml` 檔案並將 `ServletApplicationEngine` 指派給 `servlet-class` 屬性：

<Tabs>
<TabItem title="Tomcat/Jetty v10.x+">

```xml
<servlet>
    <display-name>KtorServlet</display-name>
    <servlet-name>KtorServlet</servlet-name>
    <servlet-class>io.ktor.server.servlet.jakarta.ServletApplicationEngine</servlet-class>
    <init-param>
        <param-name>io.ktor.ktor.config</param-name>
        <param-value>application.conf</param-value>
    </init-param>
    <async-supported>true</async-supported>
</servlet>
```

</TabItem>
<TabItem title="Tomcat/Jetty v9.x">
<code-block lang="XML" code="&lt;servlet&gt;&#10;    &lt;display-name&gt;KtorServlet&lt;/display-name&gt;&#10;    &lt;servlet-name&gt;KtorServlet&lt;/servlet-name&gt;&#10;    &lt;servlet-class&gt;io.ktor.server.servlet.ServletApplicationEngine&lt;/servlet-class&gt;&#10;    &lt;init-param&gt;&#10;        &lt;param-name&gt;io.ktor.ktor.config&lt;/param-name&gt;&#10;        &lt;param-value&gt;application.conf&lt;/param-value&gt;&#10;    &lt;/init-param&gt;&#10;    &lt;async-supported&gt;true&lt;/async-supported&gt;&#10;&lt;/servlet&gt;"/>
</TabItem>
</Tabs>

接著，配置此 servlet 的 URL 模式：

```xml
<servlet-mapping>
    <servlet-name>KtorServlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

## 配置 Gretty {id="configure-gretty"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty) 外掛程式允許您在 Jetty 和 Tomcat 上[執行](#run) servlet 應用程式。若要安裝此外掛程式，請開啟 `build.gradle.kts` 檔案並將以下程式碼添加到 `plugins` 區塊：

```groovy
plugins {
    id("org.gretty") version "4.0.3"
}
```

接著，您可以在 `gretty` 區塊中如下配置它：

<Tabs>
<TabItem title="Jetty">

```groovy
gretty {
    servletContainer = "jetty11"
    contextPath = "/"
    logbackConfigFile = "src/main/resources/logback.xml"
}
```

</TabItem>
<TabItem title="Tomcat">

```groovy
gretty {
    servletContainer = "tomcat10"
    contextPath = "/"
    logbackConfigFile = "src/main/resources/logback.xml"
}
```

</TabItem>
</Tabs>

最後，配置 `run` 任務：

```groovy
afterEvaluate {
    tasks.getByName("run") {
        dependsOn("appRun")
    }
}
```

## 配置 War {id="configure-war"}

War 外掛程式允許您[生成](#generate-war) WAR 檔案。您可以透過將以下行添加到 `build.gradle.kts` 檔案中的 `plugins` 區塊來安裝它：

```groovy
plugins {
    id("war")
}
```

## 執行應用程式 {id="run"}

您可以使用 `run` 任務執行已[配置 Gretty 外掛程式](#configure-gretty)的 servlet 應用程式。例如，以下命令執行 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 範例：

```Bash
./gradlew :jetty-war:run
```

## 生成及部署 WAR 檔案 {id="generate-war"}

若要使用 [War](#configure-war) 外掛程式生成包含您應用程式的 WAR 檔案，請執行 `war` 任務。對於 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 範例，命令如下所示：

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war` 會在 `build/libs` 目錄中建立。您可以透過將生成的檔案複製到 `jetty/webapps` 目錄來將其部署到 servlet 容器中。例如，以下 `Dockerfile` 展示了如何在 Jetty 或 Tomcat servlet 容器中執行建立的 WAR：

<Tabs>
<TabItem title="Jetty">

```Docker
FROM jetty:11.0.25
EXPOSE 8080:8080
COPY ./build/libs/jetty-war.war/ /var/lib/jetty/webapps
WORKDIR /var/lib/jetty
CMD ["java","-jar","/usr/local/jetty/start.jar"]

```

</TabItem>
<TabItem title="Tomcat">

```Docker
FROM tomcat:10.1.41
EXPOSE 8080:8080
COPY ./build/libs/tomcat-war.war/ /usr/local/tomcat/webapps
WORKDIR /usr/local/tomcat
CMD ["catalina.sh", "run"]

```

</TabItem>
</Tabs>

您可以在此處找到完整的範例：[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 和 [tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war)。