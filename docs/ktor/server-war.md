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
了解如何使用 WAR 归档在 servlet 容器中运行和部署 Ktor 应用程序。
</link-summary>

Ktor 应用程序可以在包含 Tomcat 和 Jetty 在内的 servlet 容器中运行和部署。要在 servlet 容器中部署，你需要生成一个 WAR 归档，然后将其部署到支持 WAR 的服务器或云服务上。

在本主题中，我们将向你展示如何：
* 配置 Ktor 以在 servlet 应用程序中使用它；
* 应用 Gretty 和 War 插件以运行和打包 WAR 应用程序；
* 运行 Ktor servlet 应用程序；
* 生成和部署 WAR 归档。

## 在 servlet 应用程序中配置 Ktor {id="configure-ktor"}

Ktor 允许你直接在应用程序中[创建并启动服务器](server-create-and-configure.topic)，并使用所需的引擎（例如 Netty、Jetty 或 Tomcat）。在这种情况下，你的应用程序可以控制引擎设置、连接和 SSL 选项。

与上述方法相比，servlet 容器应控制应用程序生命周期和连接设置。Ktor 提供了一个特殊的 [ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html) 引擎，它将应用程序的控制权委托给 servlet 容器。

> 请注意，当 Ktor 应用程序部署在 servlet 容器中时，[连接和 SSL 设置](server-configuration-file.topic)不生效。 [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl) 示例演示了如何在 Tomcat 中配置 SSL。

### 添加依赖项 {id="add-dependencies"}

要在 servlet 应用程序中使用 Ktor，你需要在构建脚本中包含 `ktor-server-servlet-jakarta` artifact：

<var name="artifact_name" value="ktor-server-servlet-jakarta"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

如果你使用 9.x 或更早版本的 Tomcat/Jetty，则改为添加 `ktor-server-servlet` artifact。

> 请注意，当 Ktor 应用程序部署在 servlet 容器中时，你不需要单独的 [Jetty 或 Tomcat artifact](server-engines.md#dependencies)。

### 配置 servlet {id="configure-servlet"}

要在应用程序中注册 Ktor servlet，请打开 `WEB-INF/web.xml` 文件并将 `ServletApplicationEngine` 赋值给 `servlet-class` 属性：

<tabs>
<tab title="Tomcat/Jetty v10.x+">

[object Promise]

</tab>
<tab title="Tomcat/Jetty v9.x">
[object Promise]
</tab>
</tabs>

然后，为此 servlet 配置 URL 模式：

[object Promise]

## 配置 Gretty {id="configure-gretty"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty) 插件允许你在 Jetty 和 Tomcat 上[运行](#run) servlet 应用程序。要安装此插件，请打开 `build.gradle.kts` 文件并将以下代码添加到 `plugins` 代码块中：

[object Promise]

然后，你可以在 `gretty` 代码块中如下配置它：

<tabs>
<tab title="Jetty">

[object Promise]

</tab>
<tab title="Tomcat">

[object Promise]

</tab>
</tabs>

最后，配置 `run` 任务：

[object Promise]

## 配置 War {id="configure-war"}

War 插件允许你[生成](#generate-war) WAR 归档。你可以通过在 `build.gradle.kts` 文件中的 `plugins` 代码块中添加以下行来安装它：

[object Promise]

## 运行应用程序 {id="run"}

你可以使用 `run` 任务来运行带有[配置好的 Gretty 插件](#configure-gretty)的 servlet 应用程序。例如，以下命令运行 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 示例：

```Bash
./gradlew :jetty-war:run
```

## 生成并部署 WAR 归档 {id="generate-war"}

要使用 [War](#configure-war) 插件生成应用程序的 WAR 文件，请执行 `war` 任务。对于 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 示例，命令如下所示：

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war` 文件在 `build/libs` 目录中创建。你可以通过将其复制到 `jetty/webapps` 目录，从而在 servlet 容器中部署生成的归档。例如，下面的 `Dockerfile` 展示了如何在 Jetty 或 Tomcat servlet 容器中运行创建的 WAR：

<tabs>
<tab title="Jetty">

[object Promise]

</tab>
<tab title="Tomcat">

[object Promise]

</tab>
</tabs>

你可以在此处找到完整的示例：[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 和 [tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war)。