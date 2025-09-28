[//]: # (title: WAR)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>代码示例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war">jetty-war</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war">tomcat-war</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl">tomcat-war-ssl</a>
</p>
</tldr>

<link-summary>
了解如何使用 WAR 归档文件在 servlet 容器中运行和部署 Ktor 应用程序。
</link-summary>

Ktor 应用程序可以在包括 Tomcat 和 Jetty 在内的 servlet 容器中运行和部署。要在 servlet 容器中部署，您需要生成一个 WAR 归档文件，然后将其部署到支持 WAR 的服务器或云服务上。

在本主题中，我们将向您展示如何：
* 配置 Ktor 以在 servlet 应用程序中使用；
* 应用 Gretty 和 War 插件以运行和打包 WAR 应用程序；
* 运行 Ktor servlet 应用程序；
* 生成并部署 WAR 归档文件。

## 在 servlet 应用程序中配置 Ktor {id="configure-ktor"}

Ktor 允许您直接在应用程序中 [创建并启动服务器](server-create-and-configure.topic)，并使用所需的引擎（例如 Netty、Jetty 或 Tomcat）。在这种情况下，您的应用程序可以控制引擎设置、连接和 SSL 选项。

与上述方法相反，servlet 容器应控制应用程序的生命周期和连接设置。Ktor 提供了一个特殊的 [ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html) 引擎，它将应用程序的控制权委托给 servlet 容器。

> 请注意，当 Ktor 应用程序部署在 servlet 容器中时，[连接和 SSL 设置](server-configuration-file.topic) 不会生效。 
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl) 示例演示了如何在 Tomcat 中配置 SSL。

### 添加依赖项 {id="add-dependencies"}

要在 servlet 应用程序中使用 Ktor，您需要在构建脚本中包含 `ktor-server-servlet-jakarta` artifact：

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

如果您使用 9.x 或更早版本的 Tomcat/Jetty，请改为添加 `ktor-server-servlet` artifact。

> 请注意，当 Ktor 应用程序部署在 servlet 容器中时，您不需要单独的 [Jetty 或 Tomcat artifact](server-engines.md#dependencies)。

### 配置 servlet {id="configure-servlet"}

要在应用程序中注册 Ktor servlet，请打开 `WEB-INF/web.xml` 文件并将 `ServletApplicationEngine` 赋值给 `servlet-class` 属性：

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

然后，为此 servlet 配置 URL 模式：

```xml
<servlet-mapping>
    <servlet-name>KtorServlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

## 配置 Gretty {id="configure-gretty"}

> Ktor 3.3.0 需要 Jetty 12，而 Gretty 尚未支持。如果您依赖 Gretty 进行开发或部署，请改用 Ktor 3.2.3，直到 Gretty 添加 Jetty 12 支持为止。
>
{style="warning"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty) 插件允许您在 Jetty 和 Tomcat 上 [运行](#run) servlet 应用程序。要安装此插件，请打开 `build.gradle.kts` 文件并将以下代码添加到 `plugins` 块中：

```groovy
plugins {
    id("org.gretty") version "4.1.7"
}
```

然后，您可以在 `gretty` 块中进行如下配置：

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

最后，配置 `run` 任务：

```groovy
afterEvaluate {
    tasks.getByName("run") {
        dependsOn("appRun")
    }
}
```

## 配置 War {id="configure-war"}

War 插件允许您 [生成](#generate-war) WAR 归档文件。您可以通过在 `build.gradle.kts` 文件中的 `plugins` 块中添加以下行来安装它：

```groovy
plugins {
    id("war")
}
```

## 运行应用程序 {id="run"}

您可以使用 [配置好的 Gretty 插件](#configure-gretty) 通过 `run` 任务来运行 servlet 应用程序。例如，以下命令运行 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 示例：

```Bash
./gradlew :jetty-war:run
```

## 生成并部署 WAR 归档文件 {id="generate-war"}

要使用 [War](#configure-war) 插件生成应用程序的 WAR 文件，请执行 `war` 任务。对于 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 示例，命令如下所示：

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war` 会在 `build/libs` 目录中创建。您可以通过将其复制到 `jetty/webapps` 目录来将生成的归档文件部署到 servlet 容器中。例如，下面的 `Dockerfile` 展示了如何在 Jetty 或 Tomcat servlet 容器中运行创建的 WAR：

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

您可以在此处找到完整的示例：[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 和 [tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war)。